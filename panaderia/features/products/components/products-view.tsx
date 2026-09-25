"use client";

import { useState } from "react";
import { LayoutGrid, Package, Plus, Rows3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/ui/filter-bar";
import { PageHeader } from "@/components/ui/page-header";
import { useServerAction } from "@/components/ui/use-server-action";
import { ViewToggle, type ViewOption } from "@/components/ui/view-toggle";
import type { CategoryOption } from "@/features/categories/types";
import { deleteProduct } from "@/features/products/actions";
import { ProductFormDialog } from "@/features/products/components/product-form-dialog";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductTable } from "@/features/products/components/product-table";
import type { ProductPermissions, ProductSummary, ProductViewMode } from "@/features/products/types";
import { DEFAULT_PRODUCT_VIEW } from "@/features/products/view-mode";

const viewOptions: ViewOption<ProductViewMode>[] = [
  { value: "table", label: "Tabla", icon: Rows3 },
  { value: "cards", label: "Tarjetas", icon: LayoutGrid },
];

type DialogState = { type: "form"; product: ProductSummary | null } | { type: "delete"; product: ProductSummary } | null;

type ProductsViewProps = {
  products: ProductSummary[];
  categories: CategoryOption[];
  viewMode: ProductViewMode;
  permissions: ProductPermissions;
};

export function ProductsView({ products, categories, viewMode, permissions }: ProductsViewProps) {
  const [dialog, setDialog] = useState<DialogState>(null);
  const { run, isPending } = useServerAction();
  const closeDialog = () => setDialog(null);

  const listProps = {
    products,
    canDelete: permissions.canDeleteProducts,
    onEdit: (product: ProductSummary) => setDialog({ type: "form", product }),
    onDelete: (product: ProductSummary) => setDialog({ type: "delete", product }),
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Productos"
        description="Consulta y administra el catálogo de la panadería."
        action={
          <Button icon={<Plus aria-hidden className="size-4" />} onClick={() => setDialog({ type: "form", product: null })}>
            Nuevo producto
          </Button>
        }
      />
      <FilterBar
        searchLabel="Buscar producto"
        searchPlaceholder="Nombre del producto…"
        selectFilters={[
          {
            param: "category",
            label: "Categoría",
            allLabel: "Todas las categorías",
            options: categories.map((category) => ({ value: String(category.id), label: category.name })),
          },
        ]}
      >
        <ViewToggle param="view" label="Vista" options={viewOptions} currentValue={viewMode} defaultValue={DEFAULT_PRODUCT_VIEW} />
      </FilterBar>

      {products.length === 0 ? (
        <EmptyState
          icon={<Package aria-hidden className="size-7" />}
          title="No se encontraron productos"
          description="Prueba con otros filtros o registra un nuevo producto."
        />
      ) : viewMode === "cards" ? (
        <ProductGrid {...listProps} />
      ) : (
        <ProductTable {...listProps} />
      )}

      <ProductFormDialog
        isOpen={dialog?.type === "form"}
        product={dialog?.type === "form" ? dialog.product : null}
        categories={categories}
        onClose={closeDialog}
      />
      {permissions.canDeleteProducts && (
        <ConfirmDialog
          isOpen={dialog?.type === "delete"}
          title="Eliminar producto"
          message={
            dialog?.type === "delete"
              ? `¿Seguro que deseas eliminar "${dialog.product.name}"? También se eliminarán sus imágenes registradas.`
              : ""
          }
          isLoading={isPending}
          onConfirm={() => dialog?.type === "delete" && run(() => deleteProduct(dialog.product.id), closeDialog)}
          onClose={closeDialog}
        />
      )}
    </div>
  );
}
