import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { HOME_ROUTE, LOGIN_ROUTE } from "@/config/navigation";
import type { Role } from "@/config/roles";
import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
  signSessionToken,
  verifySessionToken,
  type SessionPayload,
} from "@/features/auth/session-token";
import type { CurrentUser } from "@/features/auth/types";

export async function createSession(payload: SessionPayload) {
  const token = await signSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && process.env.SESSION_COOKIE_SECURE !== "false",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!session) return null;

  const user = await getPrisma().user.findUnique({
    where: { id: session.userId },
    select: { id: true, username: true, role: true, isActive: true },
  });
  if (!user?.isActive) return null;

  return { id: user.id, username: user.username, role: user.role };
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect(LOGIN_ROUTE);
  return user;
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await requireUser();
  if (!allowedRoles.includes(user.role)) redirect(HOME_ROUTE);
  return user;
}

export async function authorizeAction(allowedRoles: Role[]) {
  const user = await getCurrentUser();
  if (!user || !allowedRoles.includes(user.role)) return null;
  return user;
}
