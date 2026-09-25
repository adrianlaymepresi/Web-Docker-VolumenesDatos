"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalImage } from "@/components/ui/external-image";
import { PRODUCTS_ROUTE } from "@/config/navigation";
import { formatPrice } from "@/lib/format";
import type { CategoryOption } from "@/features/categories/types";
import { ProductFormDialog } from "@/features/products/components/product-form-dialog";
import { ProductImagesManager } from "@/features/products/components/product-images-manager";
import type { ProductDetail, ProductPermissions } from "@/features/products/types";

type ProductDetailViewProps = {
  product: ProductDetail;
  categories: CategoryOption[];
  permissions: ProductPermissions;
};

export function ProductDetailView({ product, categories, permissions }: ProductDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <Link href={PRODUCTS_ROUTE} className="inline-flex w-fit items-center gap-1 text-sm font-bold text-secondary hover:text-secondary-strong">
        <ChevronLeft aria-hidden className="size-4" />
        Volver a productos
      </Link>

      <article className="grid overflow-hidden rounded-3xl border border-border bg-surface shadow-sm md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="aspect-[4/3] md:aspect-auto md:min-h-72">
          <ExternalImage src={product.coverImageUrl} alt={`Portada de ${product.name}`} />
        </div>
        <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
          <Badge tone="secondary">{product.categoryName}</Badge>
          <h1 className="font-display text-3xl font-bold text-secondary-strong sm:text-4xl">{product.name}</h1>
          <p className="text-3xl font-extrabold text-primary">{formatPrice(product.price)}</p>
          <div>
            <Button variant="outline" icon={<Pencil aria-hidden className="size-4" />} onClick={() => setIsEditing(true)}>
              Editar información
            </Button>
          </div>
        </div>
      </article>

      <ProductImagesManager
        productId={product.id}
        productName={product.name}
        images={product.images}
        canDeleteCoverImage={permissions.canDeleteCoverImage}
      />

      <ProductFormDialog isOpen={isEditing} product={product} categories={categories} onClose={() => setIsEditing(false)} />
    </div>
  );
}
