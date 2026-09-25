"use client";

import { useState } from "react";
import { Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, IconButton } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/ui/filter-bar";
import { PageHeader } from "@/components/ui/page-header";
import { useServerAction } from "@/components/ui/use-server-action";
import { deleteCategory } from "@/features/categories/actions";
import { CategoryFormDialog } from "@/features/categories/components/category-form-dialog";
import type { CategorySummary } from "@/features/categories/types";

type DialogState = { type: "form"; category: CategorySummary | null } | { type: "delete"; category: CategorySummary } | null;

export function CategoriesView({ categories }: { categories: CategorySummary[] }) {
  const [dialog, setDialog] = useState<DialogState>(null);
  const { run, isPending } = useServerAction();
  const closeDialog = () => setDialog(null);

  const columns: DataTableColumn<CategorySummary>[] = [
    { key: "name", header: "Categoría", cell: (category) => <span className="font-bold">{category.name}</span> },
    {
      key: "description",
      header: "Descripción",
      className: "hidden md:table-cell",
      cell: (category) => <span className="text-text-muted">{category.description || "Sin descripción"}</span>,
    },
    {
      key: "products",
      header: "Productos",
      cell: (category) => <Badge tone={category.productCount > 0 ? "secondary" : "neutral"}>{category.productCount}</Badge>,
    },
    {
      key: "actions",
      header: "Acciones",
      className: "text-right",
      cell: (category) => (
        <div className="flex justify-end gap-1">
          <IconButton label={`Editar ${category.name}`} tone="secondary" onClick={() => setDialog({ type: "form", category })}>
            <Pencil aria-hidden className="size-4" />
          </IconButton>
          <IconButton label={`Eliminar ${category.name}`} tone="danger" onClick={() => setDialog({ type: "delete", category })}>
            <Trash2 aria-hidden className="size-4" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Categorías"
        description="Organiza los productos en grupos claros."
        action={
          <Button icon={<Plus aria-hidden className="size-4" />} onClick={() => setDialog({ type: "form", category: null })}>
            Nueva categoría
          </Button>
        }
      />
      <FilterBar searchLabel="Buscar categoría" searchPlaceholder="Nombre o descripción…" />

      {categories.length === 0 ? (
        <EmptyState
          icon={<Tags aria-hidden className="size-7" />}
          title="No se encontraron categorías"
          description="Prueba con otra búsqueda o crea una nueva categoría."
        />
      ) : (
        <DataTable caption="Lista de categorías" columns={columns} rows={categories} getRowKey={(category) => category.id} />
      )}

      <CategoryFormDialog
        isOpen={dialog?.type === "form"}
        category={dialog?.type === "form" ? dialog.category : null}
        onClose={closeDialog}
      />
      <ConfirmDialog
        isOpen={dialog?.type === "delete"}
        title="Eliminar categoría"
        message={dialog?.type === "delete" ? `¿Seguro que deseas eliminar la categoría "${dialog.category.name}"?` : ""}
        isLoading={isPending}
        onConfirm={() => dialog?.type === "delete" && run(() => deleteCategory(dialog.category.id), closeDialog)}
        onClose={closeDialog}
      />
    </div>
  );
}
