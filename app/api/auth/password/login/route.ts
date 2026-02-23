import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashValue, normalizeEmail } from "@/lib/auth/otp";
import { verifyPassword } from "@/lib/auth/password";

type RequestBody = {
  identifier?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const identifierInput = body.identifier?.trim() ?? "";
    const password = body.password?.trim() ?? "";
    const identifier = normalizeEmail(identifierInput);

    if (!/\S+@\S+\.\S+/.test(identifier) || !password) {
      return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
    }

    const valueHash = hashValue(`EMAIL:${identifier}`);
    const record = await db.verifiedIdentifier.findFirst({
      where: {
        type: "EMAIL",
        valueHash,
      },
      include: {
        user: true,
      },
    });

    if (!record?.user || !record.user.passwordHash || !record.user.passwordSalt) {
      return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    const ok = await verifyPassword(password, record.user.passwordSalt, record.user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    const activeTotp = await db.totpCredential.findFirst({
      where: {
        identifierId: record.id,
        status: "ACTIVE",
      },
      select: { id: true },
    });

    const now = new Date();
    await db.$transaction([
      db.user.update({
        where: { id: record.user.id },
        data: { lastLoginAt: now },
      }),
      db.accessLog.create({
        data: {
          userId: record.user.id,
          eventType: "PASSWORD_LOGIN_SUCCESS",
          resource: "auth/password",
          metadata: {
            totpEnabled: Boolean(activeTotp),
          },
        },
      }),
    ]);

    return NextResponse.json({
      status: "AUTHENTICATED",
      userId: record.user.id,
      totpEnabled: Boolean(activeTotp),
      maskedIdentifier: record.valueMasked,
    });
  } catch (error) {
    console.error("Password login failed", error);
    const message =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.message
        : undefined;
    return NextResponse.json({ error: "INTERNAL_ERROR", message }, { status: 500 });
  }
}
