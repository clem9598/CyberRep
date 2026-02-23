import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { decryptTotpSecret, verifyTotpCode } from "@/lib/auth/totp";

type RequestBody = {
  sessionId?: string;
  code?: string;
};

const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_SECONDS = 120;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const sessionId = body.sessionId?.trim() ?? "";
    const code = body.code?.trim() ?? "";

    if (!sessionId || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
    }

    const session = await db.authSession.findUnique({
      where: { id: sessionId },
      include: { identifier: true, user: true },
    });

    if (!session || session.status !== "PENDING_OTP") {
      return NextResponse.json({ error: "SESSION_INVALID" }, { status: 401 });
    }

    const now = new Date();
    if (now >= session.expiresAt) {
      await db.authSession.update({
        where: { id: session.id },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json({ error: "SESSION_EXPIRED" }, { status: 401 });
    }

    const credential = await db.totpCredential.findFirst({
      where: {
        identifierId: session.identifierId,
        status: "ACTIVE",
      },
      include: {
        identifier: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!credential) {
      return NextResponse.json({ error: "TOTP_NOT_CONFIGURED" }, { status: 404 });
    }

    if (credential.blockedUntil && now < credential.blockedUntil) {
      const retryAfterSeconds = Math.ceil((credential.blockedUntil.getTime() - now.getTime()) / 1000);
      return NextResponse.json({ error: "RATE_LIMITED", retryAfterSeconds }, { status: 429 });
    }

    let secret: string;
    try {
      secret = decryptTotpSecret(
        credential.secretCiphertext,
        credential.secretIv,
        credential.secretTag,
      );
    } catch {
      return NextResponse.json({ error: "CREDENTIAL_CORRUPTED" }, { status: 500 });
    }

    const verification = verifyTotpCode(secret, code);
    if (!verification.valid) {
      const nextFailed = credential.failedAttempts + 1;
      const shouldBlock = nextFailed >= MAX_FAILED_ATTEMPTS;
      await db.totpCredential.update({
        where: { id: credential.id },
        data: {
          failedAttempts: shouldBlock ? 0 : nextFailed,
          blockedUntil: shouldBlock ? new Date(now.getTime() + BLOCK_SECONDS * 1000) : null,
        },
      });

      if (shouldBlock) {
        return NextResponse.json({ error: "RATE_LIMITED", retryAfterSeconds: BLOCK_SECONDS }, { status: 429 });
      }
      return NextResponse.json({ error: "TOTP_INVALID" }, { status: 400 });
    }

    if (credential.lastUsedStep !== null && verification.step <= Number(credential.lastUsedStep)) {
      return NextResponse.json({ error: "TOTP_REPLAYED" }, { status: 400 });
    }

    await db.$transaction([
      db.user.update({
        where: { id: session.userId },
        data: { lastLoginAt: now },
      }),
      db.totpCredential.update({
        where: { id: credential.id },
        data: {
          failedAttempts: 0,
          blockedUntil: null,
          lastUsedStep: BigInt(verification.step),
        },
      }),
      db.authSession.update({
        where: { id: session.id },
        data: {
          status: "COMPLETED",
          completedAt: now,
        },
      }),
      db.accessLog.create({
        data: {
          userId: session.userId,
          eventType: "TOTP_LOGIN_SUCCESS",
          resource: "auth/totp",
          metadata: {
            sessionId: session.id,
          },
        },
      }),
    ]);

    return NextResponse.json({ status: "AUTHENTICATED", userId: session.userId });
  } catch (error) {
    console.error("TOTP login failed", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
