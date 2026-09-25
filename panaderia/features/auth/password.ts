import "server-only";
import { timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 10;
const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$/;

export function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function isPasswordHashed(storedPassword: string) {
  return BCRYPT_HASH_PATTERN.test(storedPassword);
}

function matchesPlainTextPassword(password: string, storedPassword: string) {
  const provided = Buffer.from(password);
  const stored = Buffer.from(storedPassword);
  return provided.length === stored.length && timingSafeEqual(provided, stored);
}

export async function verifyPassword(password: string, storedPassword: string) {
  if (isPasswordHashed(storedPassword)) {
    return bcrypt.compare(password, storedPassword);
  }
  return matchesPlainTextPassword(password, storedPassword);
}
