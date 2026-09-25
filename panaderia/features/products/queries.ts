import "server-only";
import { getPrisma } from "@/lib/prisma";
import { IMAGE_ORDER } from "@/features/products/image-order";
import type { ProductDetail, ProductFilters, ProductSummary } from "@/features/products/types";

export async function listProducts({ query, categoryId }: ProductFilters): Promise<ProductSummary[]> {
  const products = await getPrisma().product.findMany({
    where: {
      name: query ? { contains: query } : undefined,
      categoryId,
    },
    include: {
      category: { select: { name: true } },
      images: { select: { url: true }, orderBy: IMAGE_ORDER, take: 1 },
      _count: { select: { images: true } },
    },
    orderBy: { name: "asc" },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    categoryId: product.categoryId,
    categoryName: product.category.name,
    coverImageUrl: product.images[0]?.url ?? null,
    imageCount: product._count.images,
  }));
}

export async function getProductDetail(productId: number): Promise<ProductDetail | null> {
  const product = await getPrisma().product.findUnique({
    where: { id: productId },
    include: {
      category: { select: { name: true } },
      images: { select: { id: true, url: true, priority: true }, orderBy: IMAGE_ORDER },
    },
  });
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    categoryId: product.categoryId,
    categoryName: product.category.name,
    coverImageUrl: product.images[0]?.url ?? null,
    imageCount: product.images.length,
    images: product.images,
  };
}
