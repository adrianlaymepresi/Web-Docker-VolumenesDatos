import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/features/auth/session";
import { listCategoryOptions } from "@/features/categories/queries";
import { ProductDetailView } from "@/features/products/components/product-detail-view";
import { getProductPermissions } from "@/features/products/permissions";
import { getProductDetail } from "@/features/products/queries";
import { readIdParam } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Detalle de producto",
};

export default async function ProductDetailPage({ params }: PageProps<"/productos/[id]">) {
  const user = await requireUser();
  const productId = readIdParam((await params).id);
  if (!productId) notFound();

  const [product, categories] = await Promise.all([getProductDetail(productId), listCategoryOptions()]);
  if (!product) notFound();

  return <ProductDetailView product={product} categories={categories} permissions={getProductPermissions(user.role)} />;
}
