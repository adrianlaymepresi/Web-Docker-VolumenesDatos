"use client";

import { useState, type SubmitEvent } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServerAction } from "@/components/ui/use-server-action";
import { addProductImage } from "@/features/products/image-actions";
import { ImageUrlField } from "@/features/products/components/image-url-field";
import { productImageSchema } from "@/features/products/schemas";

type AddImageFormProps = {
  productId: number;
  hasImages: boolean;
};

export function AddImageForm({ productId, hasImages }: AddImageFormProps) {
  const { runValidated, isPending, fieldError } = useServerAction();
  const [formKey, setFormKey] = useState(0);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    runValidated(
      productImageSchema,
      { url: String(formData.get("url")), setAsCover: formData.get("setAsCover") === "on" },
      (input) => addProductImage(productId, input),
      () => setFormKey((key) => key + 1),
    );
  }

  return (
    <form key={formKey} onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5" noValidate>
      <h3 className="font-display text-lg font-bold text-secondary-strong">Agregar imagen por URL</h3>
      <ImageUrlField
        id="url"
        label="URL de la imagen"
        hint="Solo se guarda el enlace externo; no se suben archivos."
        error={fieldError("url")}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="setAsCover" defaultChecked={!hasImages} className="size-5 accent-primary" />
          Usar como portada
        </label>
        <Button type="submit" variant="secondary" isLoading={isPending} icon={<ImagePlus aria-hidden className="size-4" />}>
          Agregar imagen
        </Button>
      </div>
    </form>
  );
}
