import "server-only";
import type { Prisma } from "@/generated/prisma/client";

export const COVER_PRIORITY = 0;

export const IMAGE_ORDER = [{ priority: "asc" }, { id: "asc" }] satisfies Prisma.ProductImageOrderByWithRelationInput[];

export async function getOrderedImageIds(transaction: Prisma.TransactionClient, productId: number) {
  const images = await transaction.productImage.findMany({
    where: { productId },
    select: { id: true },
    orderBy: IMAGE_ORDER,
  });
  return images.map((image) => image.id);
}

export async function saveImageOrder(transaction: Prisma.TransactionClient, orderedImageIds: number[]) {
  for (const [index, imageId] of orderedImageIds.entries()) {
    await transaction.productImage.update({
      where: { id: imageId },
      data: { priority: COVER_PRIORITY + index },
    });
  }
}

export function moveToFront(imageIds: number[], imageId: number) {
  return [imageId, ...imageIds.filter((id) => id !== imageId)];
}

export function swapWithNeighbor(imageIds: number[], imageId: number, offset: -1 | 1) {
  const index = imageIds.indexOf(imageId);
  const neighborIndex = index + offset;
  if (index < 0 || neighborIndex < 0 || neighborIndex >= imageIds.length) return imageIds;

  const reordered = [...imageIds];
  [reordered[index], reordered[neighborIndex]] = [reordered[neighborIndex], reordered[index]];
  return reordered;
}
