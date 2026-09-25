"use client";

import { type SubmitEvent } from "react";
import { TextArea, TextInput } from "@/components/ui/form-field";
import { DialogActions, Modal } from "@/components/ui/modal";
import { useServerAction } from "@/components/ui/use-server-action";
import { createCategory, updateCategory } from "@/features/categories/actions";
import { categorySchema } from "@/features/categories/schemas";
import type { CategorySummary } from "@/features/categories/types";

type CategoryFormDialogProps = {
  isOpen: boolean;
  category: CategorySummary | null;
  onClose: () => void;
};

export function CategoryFormDialog({ isOpen, category, onClose }: CategoryFormDialogProps) {
  const { runValidated, isPending, fieldError, clearFieldErrors } = useServerAction();

  function handleClose() {
    clearFieldErrors();
    onClose();
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const input = {
      name: String(formData.get("name")),
      description: String(formData.get("description")),
    };
    const action = category ? (data: typeof input) => updateCategory(category.id, data) : createCategory;
    runValidated(categorySchema, input, action, handleClose);
  }

  return (
    <Modal
      isOpen={isOpen}
      title={category ? "Editar categoría" : "Nueva categoría"}
      description="Agrupa los productos de la panadería por tipo."
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <TextInput id="name" label="Nombre" defaultValue={category?.name} maxLength={100} error={fieldError("name")} required />
        <TextArea id="description" label="Descripción" defaultValue={category?.description ?? ""} maxLength={255} error={fieldError("description")} />
        <DialogActions submitLabel={category ? "Guardar cambios" : "Crear categoría"} isPending={isPending} onCancel={handleClose} />
      </form>
    </Modal>
  );
}
