import type { Metadata } from "next";
import { ADMIN_ONLY } from "@/config/roles";
import { requireRole } from "@/features/auth/session";
import { CategoriesView } from "@/features/categories/components/categories-view";
import { listCategories } from "@/features/categories/queries";
import { readSearchParam } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Categorías",
};

export default async function CategoriesPage({ searchParams }: PageProps<"/categorias">) {
  await requireRole(ADMIN_ONLY);
  const params = await searchParams;
  const categories = await listCategories(readSearchParam(params.q));

  return <CategoriesView categories={categories} />;
}
