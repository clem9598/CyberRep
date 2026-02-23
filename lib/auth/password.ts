import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

const KEY_LENGTH = 64;

export function isValidPassword(password: string) {
  return password.length >= 10 && password.length <= 128;
}

export function generatePasswordSalt() {
  return randomBytes(16).toString("hex");
}

export async function hashPassword(password: string, salt: string) {
  const key = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return key.toString("hex");
}

export async function verifyPassword(password: string, salt: string, expectedHash: string) {
  const computed = await hashPassword(password, salt);
  const left = Buffer.from(computed, "hex");
  const right = Buffer.from(expectedHash, "hex");

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}
