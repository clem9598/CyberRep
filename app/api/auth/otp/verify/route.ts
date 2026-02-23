import { NextResponse } from "next/server";
import { OtpChallengeStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { hashValue } from "@/lib/auth/otp";

type RequestBody = {
  challengeId?: string;
  code?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const challengeId = body.challengeId?.trim();
    const code = body.code?.trim();

    if (!challengeId || !code || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
    }

    const challenge = await db.otpChallenge.findUnique({
      where: { id: challengeId },
      include: { identifier: true },
    });

    if (!challenge) {
      return NextResponse.json({ error: "CHALLENGE_NOT_FOUND" }, { status: 404 });
    }

    const now = new Date();
    if (challenge.status === OtpChallengeStatus.VERIFIED) {
      return NextResponse.json({
        status: "VERIFIED",
        userId: challenge.identifier.userId,
      });
    }

    if (now >= challenge.expiresAt) {
      await db.otpChallenge.update({
        where: { id: challenge.id },
        data: { status: OtpChallengeStatus.EXPIRED },
      });
      return NextResponse.json({ error: "OTP_EXPIRED" }, { status: 400 });
    }

    if (challenge.attempts >= challenge.maxAttempts) {
      await db.otpChallenge.update({
        where: { id: challenge.id },
        data: { status: OtpChallengeStatus.RATE_LIMITED },
      });
      return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
    }

    const matches = hashValue(`otp:${code}`) === challenge.codeHash;
    if (!matches) {
      const nextAttempts = challenge.attempts + 1;
      await db.otpChallenge.update({
        where: { id: challenge.id },
        data: {
          attempts: nextAttempts,
          status:
            nextAttempts >= challenge.maxAttempts
              ? OtpChallengeStatus.RATE_LIMITED
              : OtpChallengeStatus.FAILED,
        },
      });

      return NextResponse.json(
        {
          error: nextAttempts >= challenge.maxAttempts ? "RATE_LIMITED" : "OTP_INVALID",
        },
        { status: nextAttempts >= challenge.maxAttempts ? 429 : 400 },
      );
    }

    const result = await db.$transaction(async (tx) => {
      let userId = challenge.identifier.userId;

      if (!userId) {
        const user = await tx.user.create({
          data: {
            lastLoginAt: now,
          },
        });
        userId = user.id;
      } else {
        await tx.user.update({
          where: { id: userId },
          data: {
            lastLoginAt: now,
          },
        });
      }

      await tx.verifiedIdentifier.update({
        where: { id: challenge.identifierId },
        data: {
          userId,
          verifiedAt: now,
        },
      });

      await tx.otpChallenge.update({
        where: { id: challenge.id },
        data: {
          status: OtpChallengeStatus.VERIFIED,
          verifiedAt: now,
        },
      });

      await tx.consentProof.create({
        data: {
          userId,
          identifierId: challenge.identifierId,
          purpose: "SELF_AUDIT",
          policyVersion: "v1",
          ipHash: request.headers.get("x-forwarded-for")
            ? hashValue(`ip:${request.headers.get("x-forwarded-for")}`)
            : null,
          userAgent: request.headers.get("user-agent")?.slice(0, 512) ?? null,
        },
      });

      await tx.auditScope.upsert({
        where: {
          userId_identifierId: {
            userId,
            identifierId: challenge.identifierId,
          },
        },
        update: {
          status: "ACTIVE",
          revokedAt: null,
        },
        create: {
          userId,
          identifierId: challenge.identifierId,
          status: "ACTIVE",
        },
      });

      return { userId };
    });

    return NextResponse.json({ status: "VERIFIED", userId: result.userId }, { status: 200 });
  } catch (error) {
    console.error("OTP verify failed", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
