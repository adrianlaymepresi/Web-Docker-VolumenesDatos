"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { controlClassName, describedBy, FormField } from "@/components/ui/form-field";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

export function PasswordInput({ id, label, error, hint, className = "", ...props }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ToggleIcon = isVisible ? EyeOff : Eye;

  return (
    <FormField id={id} label={label} error={error} hint={hint}>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={isVisible ? "text" : "password"}
          className={`${controlClassName} pr-12 ${className}`}
          {...describedBy(id, error)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={isVisible}
          className="absolute inset-y-0 right-1 my-auto inline-flex size-9 items-center justify-center rounded-lg text-text-muted hover:bg-surface-muted hover:text-secondary"
        >
          <ToggleIcon aria-hidden className="size-5" />
        </button>
      </div>
    </FormField>
  );
}
