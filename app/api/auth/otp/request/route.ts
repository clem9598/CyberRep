import { NextResponse } from "next/server";
import type { OtpChannel } from "@prisma/client";
import { db } from "@/lib/db";
import { deliverOtp } from "@/lib/auth/otp-delivery";
import {
  OTP_MAX_VERIFY_ATTEMPTS,
  OTP_RATE_LIMIT_MAX_REQUESTS,
  OTP_RATE_LIMIT_WINDOW_SECONDS,
  OTP_RESEND_SECONDS,
  OTP_TTL_SECONDS,
  channelToIdentifierType,
  generateOtpCode,
  hashValue,
  isValidIdentifier,
  maskIdentifier,
  normalizeForChannel,
} from "@/lib/auth/otp";

type RequestBody = {
  channel?: string;
  value?: string;
};

function parseChannel(input?: string): OtpChannel | null {
  if (input === "EMAIL" || input === "SMS") return input;
  return null;
}

function getRequestIp(raw: string | null) {
  if (!raw) return null;
  return raw.split(",")[0]?.trim() ?? null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const channel = parseChannel(body.channel);
    const value = body.value?.trim() ?? "";

    if (!channel || !value) {
      return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
    }

    const normalizedValue = normalizeForChannel(value, channel);
    if (!isValidIdentifier(normalizedValue, channel)) {
      return NextResponse.json({ error: "INVALID_IDENTIFIER" }, { status: 400 });
    }

    const identifierType = channelToIdentifierType(channel);
    const valueHash = hashValue(`${identifierType}:${normalizedValue}`);
    const valueMasked = maskIdentifier(normalizedValue, channel);
    const now = new Date();
    const windowStart = new Date(now.getTime() - OTP_RATE_LIMIT_WINDOW_SECONDS * 1000);

    const identifier = await db.verifiedIdentifier.upsert({
      where: {
        type_valueHash: {
          type: identifierType,
          valueHash,
        },
      },
      update: {
        valueMasked,
      },
      create: {
        type: identifierType,
        valueHash,
        valueMasked,
      },
    });

    const requestCountInWindow = await db.otpChallenge.count({
      where: {
        identifierId: identifier.id,
        createdAt: {
          gte: windowStart,
        },
      },
    });

    if (requestCountInWindow >= OTP_RATE_LIMIT_MAX_REQUESTS) {
      return NextResponse.json(
        {
          error: "RATE_LIMITED",
          retryAfterSeconds: OTP_RESEND_SECONDS,
        },
        { status: 429 },
      );
    }

    const code = generateOtpCode();
    const ip = getRequestIp(request.headers.get("x-forwarded-for"));
    const ipHash = ip ? hashValue(`ip:${ip}`) : null;
    const userAgent = request.headers.get("user-agent");

    const delivery = await deliverOtp({
      channel,
      target: normalizedValue,
      code,
    });

    if (!delivery.ok) {
      return NextResponse.json(
        {
          error: delivery.error,
          message:
            delivery.error === "DELIVERY_NOT_CONFIGURED"
              ? "Aucun fournisseur OTP configure (Resend/Twilio)."
              : "Echec d'envoi OTP.",
        },
        { status: 503 },
      );
    }

    const challenge = await db.otpChallenge.create({
      data: {
        identifierId: identifier.id,
        channel,
        codeHash: hashValue(`otp:${code}`),
        maxAttempts: OTP_MAX_VERIFY_ATTEMPTS,
        expiresAt: new Date(now.getTime() + OTP_TTL_SECONDS * 1000),
        resendAvailableAt: new Date(now.getTime() + OTP_RESEND_SECONDS * 1000),
        requestedIpHash: ipHash,
        userAgent: userAgent ? userAgent.slice(0, 512) : null,
      },
    });

    return NextResponse.json(
      {
        status: "OTP_SENT",
        challengeId: challenge.id,
        maskedIdentifier: identifier.valueMasked,
        expiresInSeconds: OTP_TTL_SECONDS,
        resendInSeconds: OTP_RESEND_SECONDS,
        debugCode: delivery.provider === "debug" ? delivery.debugCode : undefined,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("OTP request failed", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
