import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashValue, normalizeEmail } from "@/lib/auth/otp";
import { generatePasswordSalt, hashPassword, isValidPassword } from "@/lib/auth/password";

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

    if (!/\S+@\S+\.\S+/.test(identifier) || !isValidPassword(password)) {
      return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
    }

    const valueHash = hashValue(`EMAIL:${identifier}`);
    const local = identifier.split("@")[0] ?? "";
    const domain = identifier.split("@")[1] ?? "";
    const maskedIdentifier = `${local.slice(0, 2)}${"*".repeat(Math.max(local.length - 2, 1))}@${domain}`;

    const result = await db.$transaction(async (tx) => {
      const identifierRecord = await tx.verifiedIdentifier.upsert({
        where: {
          type_valueHash: {
            type: "EMAIL",
            valueHash,
          },
        },
        update: {
          valueMasked: maskedIdentifier,
        },
        create: {
          type: "EMAIL",
          valueHash,
          valueMasked: maskedIdentifier,
        },
      });

      let userId = identifierRecord.userId;
      const salt = generatePasswordSalt();
      const passwordHashValue = await hashPassword(password, salt);

      if (!userId) {
        const user = await tx.user.create({
          data: {
            passwordHash: passwordHashValue,
            passwordSalt: salt,
            passwordSetAt: new Date(),
          },
        });
        userId = user.id;
      } else {
        await tx.user.update({
          where: { id: userId },
          data: {
            passwordHash: passwordHashValue,
            passwordSalt: salt,
            passwordSetAt: new Date(),
          },
        });
      }

      await tx.verifiedIdentifier.update({
        where: { id: identifierRecord.id },
        data: { userId },
      });

      return { userId, identifierId: identifierRecord.id };
    });

    return NextResponse.json({
      status: "ACCOUNT_CREATED",
      userId: result.userId,
      maskedIdentifier,
      totpEnabled: false,
    });
  } catch (error) {
    console.error("Password signup failed", error);
    const message =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.message
        : undefined;
    return NextResponse.json({ error: "INTERNAL_ERROR", message }, { status: 500 });
  }
}
