import { SignJWT, jwtVerify } from "jose";
import { getRequiredEnv } from "@/config/env";
import { isRole, type Role } from "@/config/roles";

export const SESSION_COOKIE_NAME = "panaderia_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 8;

export type SessionPayload = {
  userId: number;
  role: Role;
};

function getSecretKey() {
  return new TextEncoder().encode(getRequiredEnv("SESSION_SECRET"));
}

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ["HS256"] });
    if (typeof payload.userId !== "number" || !isRole(payload.role)) return null;
    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}
