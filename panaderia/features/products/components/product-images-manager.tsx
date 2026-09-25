"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ImageOff, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ExternalImage } from "@/components/ui/external-image";
import { useServerAction } from "@/components/ui/use-server-action";
import { deleteProductImage, moveProductImage, setCoverImage } from "@/features/products/image-actions";
import { AddImageForm } from "@/features/products/components/add-image-form";
import type { ProductImageItem } from "@/features/products/types";

type ProductImagesManagerProps = {
  productId: number;
  productName: string;
  images: ProductImageItem[];
  canDeleteCoverImage: boolean;
};

export function ProductImagesManager({ productId, productName, images, canDeleteCoverImage }: ProductImagesManagerProps) {
  const [imageToDelete, setImageToDelete] = useState<ProductImageItem | null>(null);
  const { run, isPending } = useServerAction();

  return (
    <section aria-labelledby="images-title" className="flex flex-col gap-4">
      <div>
        <h2 id="images-title" className="font-display text-2xl font-bold text-secondary-strong">
          Imágenes del producto
        </h2>
        <p className="text-sm text-text-muted">La primera imagen (prioridad 0) es la portada. Ordena el resto según su prioridad.</p>
      </div>

      <AddImageForm productId={productId} hasImages={images.length > 0} />

      {images.length === 0 ? (
        <EmptyState
          icon={<ImageOff aria-hidden className="size-7" />}
          title="Este producto aún no tiene imágenes"
          description="Se mostrará el ícono de panadería hasta que agregues una URL."
        />
      ) : (
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image, index) => {
            const isCover = index === 0;
            const canDelete = !isCover || canDeleteCoverImage;
            return (
              <li
                key={image.id}
                className={`flex flex-col overflow-hidden rounded-2xl border bg-surface shadow-sm ${isCover ? "border-primary ring-2 ring-primary/30" : "border-border"}`}
              >
                <div className="relative aspect-[4/3]">
                  <ExternalImage src={image.url} alt={`${productName}, imagen ${index + 1}`} />
                  <div className="absolute left-3 top-3">
                    {isCover ? (
                      <Badge tone="primary">
                        <Star aria-hidden className="size-3 fill-current" />
                        Portada
                      </Badge>
                    ) : (
                      <Badge tone="neutral">Prioridad {image.priority}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-3">
                  <a
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-xs text-secondary underline-offset-2 hover:underline"
                    title={image.url}
                  >
                    {image.url}
                  </a>
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex gap-1">
                      <IconButton
                        label="Subir prioridad"
                        disabled={index === 0 || isPending}
                        onClick={() => run(() => moveProductImage(image.id, "up"))}
                      >
                        <ArrowUp aria-hidden className="size-4" />
                      </IconButton>
                      <IconButton
                        label="Bajar prioridad"
                        disabled={index === images.length - 1 || isPending}
                        onClick={() => run(() => moveProductImage(image.id, "down"))}
                      >
                        <ArrowDown aria-hidden className="size-4" />
                      </IconButton>
                    </div>
                    <div className="flex gap-1">
                      {!isCover && (
                        <IconButton label="Usar como portada" tone="primary" disabled={isPending} onClick={() => run(() => setCoverImage(image.id))}>
                          <Star aria-hidden className="size-4" />
                        </IconButton>
                      )}
                      <IconButton
                        label={canDelete ? "Eliminar imagen" : "Asigna otra portada antes de eliminar esta imagen"}
                        tone="danger"
                        disabled={!canDelete}
                        onClick={() => setImageToDelete(image)}
                      >
                        <Trash2 aria-hidden className="size-4" />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <ConfirmDialog
        isOpen={imageToDelete !== null}
        title="Eliminar imagen"
        message="¿Seguro que deseas eliminar esta imagen del producto? Solo se elimina el enlace registrado."
        isLoading={isPending}
        onConfirm={() => imageToDelete && run(() => deleteProductImage(imageToDelete.id), () => setImageToDelete(null))}
        onClose={() => setImageToDelete(null)}
      />
    </section>
  );
}
