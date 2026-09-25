import Link from "next/link";
import { Images, Pencil, Trash2 } from "lucide-react";
import { IconButton } from "@/components/ui/button";
import { getProductRoute } from "@/config/navigation";
import type { ProductSummary } from "@/features/products/types";

type ProductActionsProps = {
  product: ProductSummary;
  canDelete: boolean;
  onEdit: (product: ProductSummary) => void;
  onDelete: (product: ProductSummary) => void;
};

export function ProductActions({ product, canDelete, onEdit, onDelete }: ProductActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <Link
        href={getProductRoute(product.id)}
        aria-label={`Gestionar imágenes de ${product.name}`}
        title="Ver detalle e imágenes"
        className="inline-flex size-9 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary-soft"
      >
        <Images aria-hidden className="size-4" />
      </Link>
      <IconButton label={`Editar ${product.name}`} tone="secondary" onClick={() => onEdit(product)}>
        <Pencil aria-hidden className="size-4" />
      </IconButton>
      {canDelete && (
        <IconButton label={`Eliminar ${product.name}`} tone="danger" onClick={() => onDelete(product)}>
          <Trash2 aria-hidden className="size-4" />
        </IconButton>
      )}
    </div>
  );
}
