import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { decryptTotpSecret, verifyTotpCode } from "@/lib/auth/totp";
import { hashValue } from "@/lib/auth/otp";
import { generatePasswordSalt, hashPassword, isValidPassword } from "@/lib/auth/password";

type RequestBody = {
  credentialId?: string;
  code?: string;
  password?: string;
};

const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_SECONDS = 120;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const credentialId = body.credentialId?.trim();
    const code = body.code?.trim() ?? "";
    const password = body.password?.trim() ?? "";

    if (!credentialId || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
    }

    const credential = await db.totpCredential.findUnique({
      where: { id: credentialId },
      include: { identifier: true },
    });

    if (!credential) {
      return NextResponse.json({ error: "CREDENTIAL_NOT_FOUND" }, { status: 404 });
    }

    if (credential.status === "DISABLED") {
      return NextResponse.json({ error: "CREDENTIAL_DISABLED" }, { status: 403 });
    }

    const now = new Date();
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

    const result = await db.$transaction(async (tx) => {
      let userId = credential.identifier.userId;
      let passwordHashValue: string | null = null;
      let passwordSaltValue: string | null = null;

      if (!userId || !(await tx.user.findUnique({ where: { id: userId }, select: { passwordHash: true } }))?.passwordHash) {
        if (!isValidPassword(password)) {
          throw new Error("PASSWORD_REQUIRED");
        }
        passwordSaltValue = generatePasswordSalt();
        passwordHashValue = await hashPassword(password, passwordSaltValue);
      }

      if (!userId) {
        const user = await tx.user.create({
          data: {
            passwordHash: passwordHashValue,
            passwordSalt: passwordSaltValue,
            passwordSetAt: now,
            lastLoginAt: now,
          },
        });
        userId = user.id;
      } else {
        await tx.user.update({
          where: { id: userId },
          data: {
            lastLoginAt: now,
            ...(passwordHashValue && passwordSaltValue
              ? {
                  passwordHash: passwordHashValue,
                  passwordSalt: passwordSaltValue,
                  passwordSetAt: now,
                }
              : {}),
          },
        });
      }

      await tx.verifiedIdentifier.update({
        where: { id: credential.identifierId },
        data: {
          userId,
          verifiedAt: now,
        },
      });

      await tx.totpCredential.update({
        where: { id: credential.id },
        data: {
          status: "ACTIVE",
          verifiedAt: credential.verifiedAt ?? now,
          failedAttempts: 0,
          blockedUntil: null,
          lastUsedStep: BigInt(verification.step),
        },
      });

      await tx.consentProof.create({
        data: {
          userId,
          identifierId: credential.identifierId,
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
            identifierId: credential.identifierId,
          },
        },
        update: {
          status: "ACTIVE",
          revokedAt: null,
        },
        create: {
          userId,
          identifierId: credential.identifierId,
          status: "ACTIVE",
        },
      });

      return { userId };
    });

    return NextResponse.json({ status: "VERIFIED", userId: result.userId }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "PASSWORD_REQUIRED") {
      return NextResponse.json({ error: "PASSWORD_REQUIRED" }, { status: 400 });
    }
    console.error("TOTP verify failed", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
