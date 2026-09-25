import "server-only";
import { getPrisma } from "@/lib/prisma";
import type { CategoryOption, CategorySummary } from "@/features/categories/types";

export async function listCategories(query: string): Promise<CategorySummary[]> {
  const categories = await getPrisma().category.findMany({
    where: query ? { OR: [{ name: { contains: query } }, { description: { contains: query } }] } : undefined,
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    productCount: category._count.products,
  }));
}

export async function listCategoryOptions(): Promise<CategoryOption[]> {
  return getPrisma().category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}
