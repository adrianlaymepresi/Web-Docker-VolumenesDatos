import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { ExternalImage } from "@/components/ui/external-image";
import { formatPrice } from "@/lib/format";
import { ProductActions } from "@/features/products/components/product-actions";
import type { ProductSummary } from "@/features/products/types";

type ProductTableProps = {
  products: ProductSummary[];
  canDelete: boolean;
  onEdit: (product: ProductSummary) => void;
  onDelete: (product: ProductSummary) => void;
};

export function ProductTable({ products, canDelete, onEdit, onDelete }: ProductTableProps) {
  const columns: DataTableColumn<ProductSummary>[] = [
    {
      key: "product",
      header: "Producto",
      cell: (product) => (
        <div className="flex items-center gap-3">
          <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-border">
            <ExternalImage src={product.coverImageUrl} alt={`Portada de ${product.name}`} />
          </div>
          <span className="font-bold">{product.name}</span>
        </div>
      ),
    },
    { key: "category", header: "Categoría", cell: (product) => <Badge tone="secondary">{product.categoryName}</Badge> },
    { key: "price", header: "Precio", cell: (product) => <span className="font-bold text-primary">{formatPrice(product.price)}</span> },
    {
      key: "images",
      header: "Imágenes",
      className: "hidden md:table-cell",
      cell: (product) => <span className="text-text-muted">{product.imageCount}</span>,
    },
    {
      key: "actions",
      header: "Acciones",
      className: "text-right",
      cell: (product) => <ProductActions product={product} canDelete={canDelete} onEdit={onEdit} onDelete={onDelete} />,
    },
  ];

  return <DataTable caption="Lista de productos" columns={columns} rows={products} getRowKey={(product) => product.id} />;
}
