import { z } from "zod";
import type { ActionResult } from "@/types/action-result";

export const UNAUTHORIZED_MESSAGE = "No tienes permisos para realizar esta operación.";
export const UNEXPECTED_ERROR_MESSAGE = "Ocurrió un error inesperado. Inténtalo nuevamente.";

export function success(message: string): ActionResult {
  return { ok: true, message };
}

export function failure(message: string): ActionResult {
  return { ok: false, message };
}

export function validationFailure(error: z.ZodError): ActionResult {
  return {
    ok: false,
    message: "Revisa los datos del formulario.",
    fieldErrors: z.flattenError(error).fieldErrors,
  };
}
