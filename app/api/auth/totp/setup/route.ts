import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { db } from "@/lib/db";
import { hashValue, normalizeEmail } from "@/lib/auth/otp";
import { buildOtpAuthUri, encryptTotpSecret, generateTotpSecret } from "@/lib/auth/totp";

type RequestBody = {
  identifier?: string;
};

const issuer = "Self-Audit Numerique";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const rawIdentifier = body.identifier?.trim() ?? "";
    const identifier = normalizeEmail(rawIdentifier);

    if (!/\S+@\S+\.\S+/.test(identifier)) {
      return NextResponse.json({ error: "INVALID_IDENTIFIER" }, { status: 400 });
    }

    const valueHash = hashValue(`EMAIL:${identifier}`);
    const local = identifier.split("@")[0] ?? "";
    const masked = `${local.slice(0, 2)}${"*".repeat(Math.max(local.length - 2, 1))}@${identifier.split("@")[1]}`;

    const verifiedIdentifier = await db.verifiedIdentifier.upsert({
      where: {
        type_valueHash: {
          type: "EMAIL",
          valueHash,
        },
      },
      update: {
        valueMasked: masked,
      },
      create: {
        type: "EMAIL",
        valueHash,
        valueMasked: masked,
      },
    });

    const secret = generateTotpSecret();
    const encrypted = encryptTotpSecret(secret);
    const otpauthUri = buildOtpAuthUri(issuer, identifier, secret);
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUri, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 260,
    });

    const credential = await db.totpCredential.create({
      data: {
        identifierId: verifiedIdentifier.id,
        issuer,
        label: identifier,
        status: "PENDING",
        secretCiphertext: encrypted.ciphertext,
        secretIv: encrypted.iv,
        secretTag: encrypted.tag,
      },
    });

    return NextResponse.json({
      status: "SETUP_CREATED",
      credentialId: credential.id,
      issuer,
      label: identifier,
      otpauthUri,
      qrCodeDataUrl,
      secret,
      maskedIdentifier: verifiedIdentifier.valueMasked,
    });
  } catch (error) {
    console.error("TOTP setup failed", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
