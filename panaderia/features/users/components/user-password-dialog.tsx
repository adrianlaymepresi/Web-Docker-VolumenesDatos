"use client";

import { type SubmitEvent } from "react";
import { DialogActions, Modal } from "@/components/ui/modal";
import { PasswordInput } from "@/components/ui/password-input";
import { useServerAction } from "@/components/ui/use-server-action";
import { newPasswordSchema, PASSWORD_MIN_LENGTH } from "@/features/auth/schemas";
import { setUserPassword } from "@/features/users/actions";
import type { UserSummary } from "@/features/users/types";

type UserPasswordDialogProps = {
  user: UserSummary | null;
  onClose: () => void;
};

export function UserPasswordDialog({ user, onClose }: UserPasswordDialogProps) {
  const { runValidated, isPending, fieldError, clearFieldErrors } = useServerAction();

  function handleClose() {
    clearFieldErrors();
    onClose();
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    const formData = new FormData(event.currentTarget);
    runValidated(
      newPasswordSchema,
      {
        newPassword: String(formData.get("newPassword")),
        confirmPassword: String(formData.get("confirmPassword")),
      },
      (input) => setUserPassword(user.id, input),
      handleClose,
    );
  }

  return (
    <Modal
      isOpen={user !== null}
      title="Cambiar contraseña"
      description={user ? `Define una nueva contraseña para ${user.username}.` : undefined}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <PasswordInput
          id="newPassword"
          label="Nueva contraseña"
          autoComplete="new-password"
          hint={`Mínimo ${PASSWORD_MIN_LENGTH} caracteres.`}
          error={fieldError("newPassword")}
          required
        />
        <PasswordInput id="confirmPassword" label="Confirmar contraseña" autoComplete="new-password" error={fieldError("confirmPassword")} required />
        <DialogActions submitLabel="Actualizar contraseña" submitVariant="secondary" isPending={isPending} onCancel={handleClose} />
      </form>
    </Modal>
  );
}
