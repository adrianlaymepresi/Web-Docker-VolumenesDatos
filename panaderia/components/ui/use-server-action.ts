"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { useToast } from "@/components/ui/toast-provider";
import type { ActionResult, FieldErrors } from "@/types/action-result";

const CLIENT_ERROR_MESSAGE = "No se pudo completar la operación. Verifica tu conexión e inténtalo nuevamente.";

export function useServerAction() {
  const { showResult, showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function run(action: () => Promise<ActionResult>, onSuccess?: () => void) {
    startTransition(async () => {
      try {
        const result = await action();
        setFieldErrors(result.ok ? {} : (result.fieldErrors ?? {}));
        showResult(result);
        if (result.ok) onSuccess?.();
      } catch {
        showToast(CLIENT_ERROR_MESSAGE, "error");
      }
    });
  }

  function runValidated<Schema extends z.ZodType>(
    schema: Schema,
    input: z.input<Schema>,
    action: (input: z.input<Schema>) => Promise<ActionResult>,
    onSuccess?: () => void,
  ) {
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      setFieldErrors(z.flattenError(parsed.error).fieldErrors as FieldErrors);
      return;
    }
    run(() => action(input), onSuccess);
  }

  return {
    run,
    runValidated,
    isPending,
    fieldError: (name: string) => fieldErrors[name]?.[0],
    clearFieldErrors: () => setFieldErrors({}),
  };
}
