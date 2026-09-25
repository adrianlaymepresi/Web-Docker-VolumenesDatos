import { z } from "zod";

export const MAX_PRICE = 99_999_999.99;

export const imageUrlSchema = z
  .string()
  .trim()
  .min(1, "La URL de la imagen es obligatoria.")
  .max(2048, "La URL no puede superar 2048 caracteres.")
  .pipe(z.url({ protocol: /^https?$/, error: "Ingresa una URL válida que comience con http:// o https://." }));

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre del producto es obligatorio.")
    .max(150, "El nombre no puede superar 150 caracteres."),
  price: z
    .number("Ingresa un precio válido.")
    .nonnegative("El precio no puede ser negativo.")
    .max(MAX_PRICE, "El precio es demasiado alto.")
    .transform((price) => Math.round(price * 100) / 100),
  categoryId: z.number().int().positive("Selecciona una categoría."),
});

export const newProductSchema = productSchema.extend({
  coverImageUrl: z.union([z.literal(""), imageUrlSchema]),
});

export const productImageSchema = z.object({
  url: imageUrlSchema,
  setAsCover: z.boolean(),
});

export type ProductInput = z.input<typeof productSchema>;
export type NewProductInput = z.input<typeof newProductSchema>;
export type ProductImageInput = z.input<typeof productImageSchema>;
