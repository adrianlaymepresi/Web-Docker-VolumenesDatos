import type { Metadata } from "next";
import { requireUser } from "@/features/auth/session";
import { listCategoryOptions } from "@/features/categories/queries";
import { ProductsView } from "@/features/products/components/products-view";
import { getProductPermissions } from "@/features/products/permissions";
import { listProducts } from "@/features/products/queries";
import { parseProductViewMode } from "@/features/products/view-mode";
import { readIdParam, readSearchParam } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Productos",
};

export default async function ProductsPage({ searchParams }: PageProps<"/productos">) {
  const user = await requireUser();
  const params = await searchParams;

  const [products, categories] = await Promise.all([
    listProducts({ query: readSearchParam(params.q), categoryId: readIdParam(params.category) }),
    listCategoryOptions(),
  ]);

  return (
    <ProductsView
      products={products}
      categories={categories}
      viewMode={parseProductViewMode(readSearchParam(params.view))}
      permissions={getProductPermissions(user.role)}
    />
  );
}
