import { createHash, randomInt } from "node:crypto";
import type { IdentifierType, OtpChannel } from "@prisma/client";

export const OTP_TTL_SECONDS = 5 * 60;
export const OTP_RESEND_SECONDS = 30;
export const OTP_RATE_LIMIT_WINDOW_SECONDS = 5 * 60;
export const OTP_RATE_LIMIT_MAX_REQUESTS = 3;
export const OTP_MAX_VERIFY_ATTEMPTS = 5;

const emailRegex = /\S+@\S+\.\S+/;
const phoneRegex = /^\+?[0-9\s().-]{8,}$/;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "").trim();
}

export function isValidIdentifier(value: string, channel: OtpChannel) {
  if (channel === "EMAIL") {
    return emailRegex.test(value);
  }

  return phoneRegex.test(value);
}

export function maskIdentifier(value: string, channel: OtpChannel) {
  if (channel === "EMAIL") {
    const [local, domain] = value.split("@");
    const localMasked =
      local.length <= 2 ? `${local[0] ?? "*"}*` : `${local.slice(0, 2)}${"*".repeat(Math.max(local.length - 2, 1))}`;
    return `${localMasked}@${domain}`;
  }

  const digits = value.replace(/\D/g, "");
  const suffix = digits.slice(-2).padStart(2, "*");
  return `*** *** **${suffix}`;
}

export function channelToIdentifierType(channel: OtpChannel): IdentifierType {
  return channel === "EMAIL" ? "EMAIL" : "PHONE";
}

export function normalizeForChannel(value: string, channel: OtpChannel) {
  return channel === "EMAIL" ? normalizeEmail(value) : normalizePhone(value);
}

export function generateOtpCode() {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashValue(raw: string) {
  const pepper = process.env.OTP_PEPPER ?? "development-pepper";
  return createHash("sha256").update(`${raw}:${pepper}`).digest("hex");
}
