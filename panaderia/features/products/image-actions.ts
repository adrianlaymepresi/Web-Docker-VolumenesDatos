"use server";

import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/prisma";
import { PRODUCTS_ROUTE } from "@/config/navigation";
import { ALL_ROLES } from "@/config/roles";
import { failure, success, UNAUTHORIZED_MESSAGE, UNEXPECTED_ERROR_MESSAGE, validationFailure } from "@/lib/action-result";
import { authorizeAction } from "@/features/auth/session";
import type { CurrentUser } from "@/features/auth/types";
import { getOrderedImageIds, moveToFront, saveImageOrder, swapWithNeighbor } from "@/features/products/image-order";
import { getProductPermissions } from "@/features/products/permissions";
import { productImageSchema, type ProductImageInput } from "@/features/products/schemas";
import type { ImageMoveDirection } from "@/features/products/types";
import type { ActionResult } from "@/types/action-result";

const IMAGE_NOT_FOUND_MESSAGE = "La imagen no existe o ya fue eliminada.";

async function findImage(imageId: number) {
  return getPrisma().productImage.findUnique({ where: { id: imageId }, select: { id: true, productId: true } });
}

async function runImageMutation(mutation: (user: CurrentUser) => Promise<ActionResult>): Promise<ActionResult> {
  const user = await authorizeAction(ALL_ROLES);
  if (!user) return failure(UNAUTHORIZED_MESSAGE);

  try {
    const result = await mutation(user);
    if (result.ok) revalidatePath(PRODUCTS_ROUTE, "layout");
    return result;
  } catch {
    return failure(UNEXPECTED_ERROR_MESSAGE);
  }
}

export async function addProductImage(productId: number, input: ProductImageInput): Promise<ActionResult> {
  return runImageMutation(async () => {
    const parsed = productImageSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error);

    const prisma = getPrisma();
    const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
    if (!product) return failure("El producto no existe o ya fue eliminado.");

    await prisma.$transaction(async (transaction) => {
      const orderedIds = await getOrderedImageIds(transaction, productId);
      const image = await transaction.productImage.create({
        data: { productId, url: parsed.data.url, priority: orderedIds.length },
      });
      const nextOrder = parsed.data.setAsCover ? [image.id, ...orderedIds] : [...orderedIds, image.id];
      await saveImageOrder(transaction, nextOrder);
    });
    return success("Imagen agregada correctamente.");
  });
}

export async function setCoverImage(imageId: number): Promise<ActionResult> {
  return runImageMutation(async () => {
    const image = await findImage(imageId);
    if (!image) return failure(IMAGE_NOT_FOUND_MESSAGE);

    await getPrisma().$transaction(async (transaction) => {
      const orderedIds = await getOrderedImageIds(transaction, image.productId);
      await saveImageOrder(transaction, moveToFront(orderedIds, image.id));
    });
    return success("Portada actualizada correctamente.");
  });
}

export async function moveProductImage(imageId: number, direction: ImageMoveDirection): Promise<ActionResult> {
  return runImageMutation(async () => {
    const image = await findImage(imageId);
    if (!image) return failure(IMAGE_NOT_FOUND_MESSAGE);

    await getPrisma().$transaction(async (transaction) => {
      const orderedIds = await getOrderedImageIds(transaction, image.productId);
      await saveImageOrder(transaction, swapWithNeighbor(orderedIds, image.id, direction === "up" ? -1 : 1));
    });
    return success("Orden de imágenes actualizado correctamente.");
  });
}

export async function deleteProductImage(imageId: number): Promise<ActionResult> {
  return runImageMutation(async (user) => {
    const image = await findImage(imageId);
    if (!image) return failure(IMAGE_NOT_FOUND_MESSAGE);

    return getPrisma().$transaction(async (transaction) => {
      const orderedIds = await getOrderedImageIds(transaction, image.productId);
      const isCover = orderedIds[0] === image.id;
      if (isCover && !getProductPermissions(user.role).canDeleteCoverImage) {
        return failure("No puedes eliminar la imagen de portada. Primero asigna otra imagen como portada.");
      }

      await transaction.productImage.delete({ where: { id: image.id } });
      await saveImageOrder(transaction, orderedIds.filter((id) => id !== image.id));
      return success("Imagen eliminada correctamente.");
    });
  });
}
