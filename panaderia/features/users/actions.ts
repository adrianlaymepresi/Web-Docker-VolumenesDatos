"use server";

import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/prisma";
import { USERS_ROUTE } from "@/config/navigation";
import { ADMIN_ONLY } from "@/config/roles";
import { failure, success, UNAUTHORIZED_MESSAGE, UNEXPECTED_ERROR_MESSAGE, validationFailure } from "@/lib/action-result";
import { isRecordNotFoundError, isUniqueConstraintError } from "@/lib/database-errors";
import { hashPassword } from "@/features/auth/password";
import { newPasswordSchema, type NewPasswordInput } from "@/features/auth/schemas";
import { authorizeAction } from "@/features/auth/session";
import { createUserSchema, updateUserSchema, type CreateUserInput, type UpdateUserInput } from "@/features/users/schemas";
import type { ActionResult } from "@/types/action-result";

const USER_NOT_FOUND_MESSAGE = "El usuario no existe o ya fue eliminado.";
const DUPLICATED_USERNAME_MESSAGE = "Ya existe un usuario con ese nombre.";

function translateUserError(error: unknown): ActionResult {
  if (isUniqueConstraintError(error)) {
    return { ok: false, message: DUPLICATED_USERNAME_MESSAGE, fieldErrors: { username: [DUPLICATED_USERNAME_MESSAGE] } };
  }
  if (isRecordNotFoundError(error)) return failure(USER_NOT_FOUND_MESSAGE);
  return failure(UNEXPECTED_ERROR_MESSAGE);
}

export async function createUser(input: CreateUserInput): Promise<ActionResult> {
  if (!(await authorizeAction(ADMIN_ONLY))) return failure(UNAUTHORIZED_MESSAGE);

  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const { username, role, isActive, newPassword } = parsed.data;
  try {
    await getPrisma().user.create({
      data: { username, role, isActive, password: await hashPassword(newPassword) },
    });
  } catch (error) {
    return translateUserError(error);
  }

  revalidatePath(USERS_ROUTE);
  return success("Usuario creado correctamente.");
}

export async function updateUser(userId: number, input: UpdateUserInput): Promise<ActionResult> {
  const currentUser = await authorizeAction(ADMIN_ONLY);
  if (!currentUser) return failure(UNAUTHORIZED_MESSAGE);

  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const isEditingSelf = currentUser.id === userId;
  if (isEditingSelf && !parsed.data.isActive) return failure("No puedes desactivar tu propia cuenta.");
  if (isEditingSelf && parsed.data.role !== currentUser.role) return failure("No puedes cambiar tu propio rol.");

  try {
    await getPrisma().user.update({ where: { id: userId }, data: parsed.data });
  } catch (error) {
    return translateUserError(error);
  }

  revalidatePath(USERS_ROUTE);
  return success("Usuario actualizado correctamente.");
}

export async function setUserActive(userId: number, isActive: boolean): Promise<ActionResult> {
  const currentUser = await authorizeAction(ADMIN_ONLY);
  if (!currentUser) return failure(UNAUTHORIZED_MESSAGE);
  if (currentUser.id === userId && !isActive) return failure("No puedes desactivar tu propia cuenta.");

  try {
    await getPrisma().user.update({ where: { id: userId }, data: { isActive } });
  } catch (error) {
    return translateUserError(error);
  }

  revalidatePath(USERS_ROUTE);
  return success(isActive ? "Usuario activado correctamente." : "Usuario desactivado correctamente.");
}

export async function setUserPassword(userId: number, input: NewPasswordInput): Promise<ActionResult> {
  if (!(await authorizeAction(ADMIN_ONLY))) return failure(UNAUTHORIZED_MESSAGE);

  const parsed = newPasswordSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    await getPrisma().user.update({
      where: { id: userId },
      data: { password: await hashPassword(parsed.data.newPassword) },
    });
  } catch (error) {
    return translateUserError(error);
  }

  return success("Contraseña actualizada correctamente.");
}

export async function deleteUser(userId: number): Promise<ActionResult> {
  const currentUser = await authorizeAction(ADMIN_ONLY);
  if (!currentUser) return failure(UNAUTHORIZED_MESSAGE);
  if (currentUser.id === userId) return failure("No puedes eliminar tu propia cuenta.");

  try {
    await getPrisma().user.delete({ where: { id: userId } });
  } catch (error) {
    return translateUserError(error);
  }

  revalidatePath(USERS_ROUTE);
  return success("Usuario eliminado correctamente.");
}
