import { z } from "zod";
import { ROLES } from "@/config/roles";
import { passwordConfirmationFields, passwordMismatchIssue, passwordsMatch } from "@/features/auth/schemas";

const userDetailsFields = {
  username: z
    .string()
    .trim()
    .min(3, "El usuario debe tener al menos 3 caracteres.")
    .max(100, "El usuario no puede superar 100 caracteres.")
    .regex(/^\S+$/, "El usuario no puede contener espacios."),
  role: z.enum(ROLES, "Selecciona un rol válido."),
  isActive: z.boolean(),
};

export const updateUserSchema = z.object(userDetailsFields);

export const createUserSchema = z
  .object({ ...userDetailsFields, ...passwordConfirmationFields })
  .refine(passwordsMatch, passwordMismatchIssue);

export type UpdateUserInput = z.input<typeof updateUserSchema>;
export type CreateUserInput = z.input<typeof createUserSchema>;
