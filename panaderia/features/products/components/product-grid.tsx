import { Badge } from "@/components/ui/badge";
import { ExternalImage } from "@/components/ui/external-image";
import { formatPrice } from "@/lib/format";
import { ProductActions } from "@/features/products/components/product-actions";
import type { ProductSummary } from "@/features/products/types";

type ProductGridProps = {
  products: ProductSummary[];
  canDelete: boolean;
  onEdit: (product: ProductSummary) => void;
  onDelete: (product: ProductSummary) => void;
};

export function ProductGrid({ products, canDelete, onEdit, onDelete }: ProductGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.id} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md">
          <div className="relative aspect-[4/3] border-b border-border">
            <ExternalImage src={product.coverImageUrl} alt={`Portada de ${product.name}`} />
            <div className="absolute left-3 top-3">
              <Badge tone="secondary">{product.categoryName}</Badge>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-3 p-4">
            <div className="flex-1">
              <h2 className="font-display text-lg font-bold leading-tight text-text">{product.name}</h2>
              <p className="mt-1 text-xs text-text-muted">
                {product.imageCount === 1 ? "1 imagen" : `${product.imageCount} imágenes`}
              </p>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
              <span className="text-lg font-extrabold text-primary">{formatPrice(product.price)}</span>
              <ProductActions product={product} canDelete={canDelete} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
