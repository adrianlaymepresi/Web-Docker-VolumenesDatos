"use server";

import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/prisma";
import { CATEGORIES_ROUTE } from "@/config/navigation";
import { ADMIN_ONLY } from "@/config/roles";
import { failure, success, UNAUTHORIZED_MESSAGE, UNEXPECTED_ERROR_MESSAGE, validationFailure } from "@/lib/action-result";
import { isForeignKeyConstraintError, isRecordNotFoundError, isUniqueConstraintError } from "@/lib/database-errors";
import { authorizeAction } from "@/features/auth/session";
import { categorySchema, type CategoryInput } from "@/features/categories/schemas";
import type { ActionResult } from "@/types/action-result";

const DUPLICATED_NAME_MESSAGE = "Ya existe una categoría con ese nombre.";
const CATEGORY_IN_USE_MESSAGE = "No se pudo eliminar la categoría porque tiene productos asociados.";

function translateCategoryError(error: unknown): ActionResult {
  if (isUniqueConstraintError(error)) {
    return { ok: false, message: DUPLICATED_NAME_MESSAGE, fieldErrors: { name: [DUPLICATED_NAME_MESSAGE] } };
  }
  if (isForeignKeyConstraintError(error)) return failure(CATEGORY_IN_USE_MESSAGE);
  if (isRecordNotFoundError(error)) return failure("La categoría no existe o ya fue eliminada.");
  return failure(UNEXPECTED_ERROR_MESSAGE);
}

function toCategoryData(input: { name: string; description: string }) {
  return { name: input.name, description: input.description || null };
}

export async function createCategory(input: CategoryInput): Promise<ActionResult> {
  if (!(await authorizeAction(ADMIN_ONLY))) return failure(UNAUTHORIZED_MESSAGE);

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    await getPrisma().category.create({ data: toCategoryData(parsed.data) });
  } catch (error) {
    return translateCategoryError(error);
  }

  revalidatePath(CATEGORIES_ROUTE);
  return success("Categoría creada correctamente.");
}

export async function updateCategory(categoryId: number, input: CategoryInput): Promise<ActionResult> {
  if (!(await authorizeAction(ADMIN_ONLY))) return failure(UNAUTHORIZED_MESSAGE);

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    await getPrisma().category.update({ where: { id: categoryId }, data: toCategoryData(parsed.data) });
  } catch (error) {
    return translateCategoryError(error);
  }

  revalidatePath(CATEGORIES_ROUTE);
  return success("Categoría actualizada correctamente.");
}

export async function deleteCategory(categoryId: number): Promise<ActionResult> {
  if (!(await authorizeAction(ADMIN_ONLY))) return failure(UNAUTHORIZED_MESSAGE);

  const prisma = getPrisma();
  const productCount = await prisma.product.count({ where: { categoryId } });
  if (productCount > 0) return failure(CATEGORY_IN_USE_MESSAGE);

  try {
    await prisma.category.delete({ where: { id: categoryId } });
  } catch (error) {
    return translateCategoryError(error);
  }

  revalidatePath(CATEGORIES_ROUTE);
  return success("Categoría eliminada correctamente.");
}
