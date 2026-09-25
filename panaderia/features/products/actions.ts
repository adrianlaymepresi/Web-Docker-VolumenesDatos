"use server";

import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/prisma";
import { PRODUCTS_ROUTE } from "@/config/navigation";
import { ALL_ROLES } from "@/config/roles";
import { failure, success, UNAUTHORIZED_MESSAGE, UNEXPECTED_ERROR_MESSAGE, validationFailure } from "@/lib/action-result";
import { isForeignKeyConstraintError, isRecordNotFoundError } from "@/lib/database-errors";
import { authorizeAction } from "@/features/auth/session";
import { COVER_PRIORITY } from "@/features/products/image-order";
import { getProductPermissions } from "@/features/products/permissions";
import { newProductSchema, productSchema, type NewProductInput, type ProductInput } from "@/features/products/schemas";
import type { ActionResult } from "@/types/action-result";

function translateProductError(error: unknown): ActionResult {
  if (isForeignKeyConstraintError(error)) {
    return { ok: false, message: "La categoría seleccionada no existe.", fieldErrors: { categoryId: ["La categoría seleccionada no existe."] } };
  }
  if (isRecordNotFoundError(error)) return failure("El producto no existe o ya fue eliminado.");
  return failure(UNEXPECTED_ERROR_MESSAGE);
}

export async function createProduct(input: NewProductInput): Promise<ActionResult> {
  if (!(await authorizeAction(ALL_ROLES))) return failure(UNAUTHORIZED_MESSAGE);

  const parsed = newProductSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const { coverImageUrl, ...product } = parsed.data;
  try {
    await getPrisma().product.create({
      data: {
        ...product,
        images: coverImageUrl ? { create: { url: coverImageUrl, priority: COVER_PRIORITY } } : undefined,
      },
    });
  } catch (error) {
    return translateProductError(error);
  }

  revalidatePath(PRODUCTS_ROUTE, "layout");
  return success("Producto creado correctamente.");
}

export async function updateProduct(productId: number, input: ProductInput): Promise<ActionResult> {
  if (!(await authorizeAction(ALL_ROLES))) return failure(UNAUTHORIZED_MESSAGE);

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    await getPrisma().product.update({ where: { id: productId }, data: parsed.data });
  } catch (error) {
    return translateProductError(error);
  }

  revalidatePath(PRODUCTS_ROUTE, "layout");
  return success("Producto actualizado correctamente.");
}

export async function deleteProduct(productId: number): Promise<ActionResult> {
  const user = await authorizeAction(ALL_ROLES);
  if (!user || !getProductPermissions(user.role).canDeleteProducts) return failure(UNAUTHORIZED_MESSAGE);

  try {
    await getPrisma().product.delete({ where: { id: productId } });
  } catch (error) {
    return translateProductError(error);
  }

  revalidatePath(PRODUCTS_ROUTE, "layout");
  return success("Producto eliminado correctamente.");
}
