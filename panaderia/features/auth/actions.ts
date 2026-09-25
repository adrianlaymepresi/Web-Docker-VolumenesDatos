"use server";

import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { HOME_ROUTE, LOGIN_ROUTE } from "@/config/navigation";
import { failure, success, UNAUTHORIZED_MESSAGE, validationFailure } from "@/lib/action-result";
import { hashPassword, isPasswordHashed, verifyPassword } from "@/features/auth/password";
import { changeOwnPasswordSchema, loginSchema, type ChangeOwnPasswordInput } from "@/features/auth/schemas";
import { createSession, deleteSession, getCurrentUser } from "@/features/auth/session";
import type { ActionResult } from "@/types/action-result";

export type LoginState = { message: string; username: string } | undefined;

export async function login(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const parsed = loginSchema.safeParse({ username, password: formData.get("password") });
  if (!parsed.success) return { message: "Ingresa tu usuario y contraseña.", username };

  const prisma = getPrisma();
  const user = await prisma.user.findUnique({ where: { username: parsed.data.username } });
  if (!user || !(await verifyPassword(parsed.data.password, user.password))) {
    return { message: "Usuario o contraseña incorrectos.", username };
  }
  if (!user.isActive) {
    return { message: "Tu cuenta está desactivada. Contacta con un administrador.", username };
  }

  if (!isPasswordHashed(user.password)) {
    await prisma.user.update({
      where: { id: user.id },
      data: { password: await hashPassword(parsed.data.password) },
    });
  }

  await createSession({ userId: user.id, role: user.role });
  redirect(HOME_ROUTE);
}

export async function logout() {
  await deleteSession();
  redirect(LOGIN_ROUTE);
}

export async function changeOwnPassword(input: ChangeOwnPasswordInput): Promise<ActionResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return failure(UNAUTHORIZED_MESSAGE);

  const parsed = changeOwnPasswordSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const prisma = getPrisma();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: currentUser.id } });
  if (!(await verifyPassword(parsed.data.currentPassword, user.password))) {
    return { ok: false, message: "La contraseña actual no es correcta.", fieldErrors: { currentPassword: ["La contraseña actual no es correcta."] } };
  }

  await prisma.user.update({
    where: { id: currentUser.id },
    data: { password: await hashPassword(parsed.data.newPassword) },
  });
  return success("Contraseña actualizada correctamente.");
}
