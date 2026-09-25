"use client";

import { useActionState } from "react";
import { LogIn, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/form-field";
import { PasswordInput } from "@/components/ui/password-input";
import { login } from "@/features/auth/actions";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state?.message && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">
          <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {state.message}
        </div>
      )}
      <TextInput id="username" label="Usuario" autoComplete="username" placeholder="Ingresa tu usuario" defaultValue={state?.username} required autoFocus />
      <PasswordInput id="password" label="Contraseña" autoComplete="current-password" placeholder="Ingresa tu contraseña" required />
      <Button type="submit" isLoading={isPending} icon={<LogIn aria-hidden className="size-4" />} className="mt-2 w-full">
        {isPending ? "Ingresando…" : "Iniciar sesión"}
      </Button>
    </form>
  );
}
