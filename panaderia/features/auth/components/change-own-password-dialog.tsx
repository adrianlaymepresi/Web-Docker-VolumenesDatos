"use client";

import { type SubmitEvent } from "react";
import { DialogActions, Modal } from "@/components/ui/modal";
import { PasswordInput } from "@/components/ui/password-input";
import { useServerAction } from "@/components/ui/use-server-action";
import { changeOwnPassword } from "@/features/auth/actions";
import { changeOwnPasswordSchema, PASSWORD_MIN_LENGTH } from "@/features/auth/schemas";

type ChangeOwnPasswordDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ChangeOwnPasswordDialog({ isOpen, onClose }: ChangeOwnPasswordDialogProps) {
  const { runValidated, isPending, fieldError, clearFieldErrors } = useServerAction();

  function handleClose() {
    clearFieldErrors();
    onClose();
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    runValidated(
      changeOwnPasswordSchema,
      {
        currentPassword: String(formData.get("currentPassword")),
        newPassword: String(formData.get("newPassword")),
        confirmPassword: String(formData.get("confirmPassword")),
      },
      changeOwnPassword,
      handleClose,
    );
  }

  return (
    <Modal isOpen={isOpen} title="Cambiar mi contraseña" description="Por seguridad, confirma tu contraseña actual." onClose={handleClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <PasswordInput id="currentPassword" label="Contraseña actual" autoComplete="current-password" error={fieldError("currentPassword")} required />
        <PasswordInput
          id="newPassword"
          label="Nueva contraseña"
          autoComplete="new-password"
          hint={`Mínimo ${PASSWORD_MIN_LENGTH} caracteres.`}
          error={fieldError("newPassword")}
          required
        />
        <PasswordInput id="confirmPassword" label="Confirmar nueva contraseña" autoComplete="new-password" error={fieldError("confirmPassword")} required />
        <DialogActions submitLabel="Actualizar contraseña" submitVariant="secondary" isPending={isPending} onCancel={handleClose} />
      </form>
    </Modal>
  );
}
