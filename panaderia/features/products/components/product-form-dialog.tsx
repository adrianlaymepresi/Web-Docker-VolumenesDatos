"use client";

import { type SubmitEvent } from "react";
import { TriangleAlert } from "lucide-react";
import { SelectInput, TextInput } from "@/components/ui/form-field";
import { DialogActions, Modal } from "@/components/ui/modal";
import { useServerAction } from "@/components/ui/use-server-action";
import type { CategoryOption } from "@/features/categories/types";
import { createProduct, updateProduct } from "@/features/products/actions";
import { ImageUrlField } from "@/features/products/components/image-url-field";
import { MAX_PRICE, newProductSchema, productSchema } from "@/features/products/schemas";
import type { ProductSummary } from "@/features/products/types";

type ProductFormDialogProps = {
  isOpen: boolean;
  product: ProductSummary | null;
  categories: CategoryOption[];
  onClose: () => void;
};

function readPrice(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim().replace(",", ".");
  return text === "" ? Number.NaN : Number(text);
}

export function ProductFormDialog({ isOpen, product, categories, onClose }: ProductFormDialogProps) {
  const { runValidated, isPending, fieldError, clearFieldErrors } = useServerAction();
  const hasCategories = categories.length > 0;

  function handleClose() {
    clearFieldErrors();
    onClose();
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const details = {
      name: String(formData.get("name")),
      price: readPrice(formData.get("price")),
      categoryId: Number(formData.get("categoryId")),
    };

    if (product) {
      runValidated(productSchema, details, (input) => updateProduct(product.id, input), handleClose);
      return;
    }
    runValidated(newProductSchema, { ...details, coverImageUrl: String(formData.get("coverImageUrl")).trim() }, createProduct, handleClose);
  }

  return (
    <Modal
      isOpen={isOpen}
      title={product ? "Editar producto" : "Nuevo producto"}
      description={product ? "Actualiza la información del producto." : "Registra un nuevo producto en el catálogo."}
      onClose={handleClose}
    >
      {hasCategories ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <TextInput id="name" label="Nombre del producto" defaultValue={product?.name} maxLength={150} error={fieldError("name")} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              id="price"
              label="Precio"
              type="number"
              inputMode="decimal"
              min={0}
              max={MAX_PRICE}
              step="0.01"
              defaultValue={product?.price}
              error={fieldError("price")}
              required
            />
            <SelectInput
              id="categoryId"
              label="Categoría"
              placeholder="Selecciona una categoría"
              options={categories.map((category) => ({ value: String(category.id), label: category.name }))}
              defaultValue={product ? String(product.categoryId) : ""}
              error={fieldError("categoryId")}
              required
            />
          </div>
          {!product && (
            <ImageUrlField
              id="coverImageUrl"
              label="URL de imagen de portada (opcional)"
              hint="Podrás agregar más imágenes desde el detalle del producto."
              error={fieldError("coverImageUrl")}
            />
          )}
          <DialogActions submitLabel={product ? "Guardar cambios" : "Crear producto"} isPending={isPending} onCancel={handleClose} />
        </form>
      ) : (
        <div role="alert" className="flex items-start gap-3 rounded-xl bg-accent-soft p-4 text-sm">
          <TriangleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-accent" />
          <p>No hay categorías registradas. Un administrador debe crear al menos una categoría antes de registrar productos.</p>
        </div>
      )}
    </Modal>
  );
}
