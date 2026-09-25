import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 72;

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`)
  .max(PASSWORD_MAX_LENGTH, `La contraseña no puede superar ${PASSWORD_MAX_LENGTH} caracteres.`);

export const passwordConfirmationFields = {
  newPassword: passwordSchema,
  confirmPassword: z.string(),
};

export function passwordsMatch(data: { newPassword: string; confirmPassword: string }) {
  return data.newPassword === data.confirmPassword;
}

export const passwordMismatchIssue = {
  message: "Las contraseñas no coinciden.",
  path: ["confirmPassword"],
};

export const newPasswordSchema = z
  .object(passwordConfirmationFields)
  .refine(passwordsMatch, passwordMismatchIssue);

export const changeOwnPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Ingresa tu contraseña actual."),
    ...passwordConfirmationFields,
  })
  .refine(passwordsMatch, passwordMismatchIssue);

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Ingresa tu usuario."),
  password: z.string().min(1, "Ingresa tu contraseña."),
});

export type NewPasswordInput = z.infer<typeof newPasswordSchema>;
export type ChangeOwnPasswordInput = z.infer<typeof changeOwnPasswordSchema>;
