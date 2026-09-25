import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre de la categoría es obligatorio.")
    .max(100, "El nombre no puede superar 100 caracteres."),
  description: z.string().trim().max(255, "La descripción no puede superar 255 caracteres."),
});

export type CategoryInput = z.input<typeof categorySchema>;
