"use client";

import { type SubmitEvent } from "react";
import { SelectInput, TextInput } from "@/components/ui/form-field";
import { DialogActions, Modal } from "@/components/ui/modal";
import { PasswordInput } from "@/components/ui/password-input";
import { useServerAction } from "@/components/ui/use-server-action";
import { ROLE_LABELS, ROLES, type Role } from "@/config/roles";
import { PASSWORD_MIN_LENGTH } from "@/features/auth/schemas";
import { createUser, updateUser } from "@/features/users/actions";
import { createUserSchema, updateUserSchema } from "@/features/users/schemas";
import type { UserSummary } from "@/features/users/types";

const roleOptions = ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] }));

type UserFormDialogProps = {
  isOpen: boolean;
  user: UserSummary | null;
  isCurrentUser: boolean;
  onClose: () => void;
};

export function UserFormDialog({ isOpen, user, isCurrentUser, onClose }: UserFormDialogProps) {
  const { runValidated, isPending, fieldError, clearFieldErrors } = useServerAction();
  const isEditing = user !== null;

  function handleClose() {
    clearFieldErrors();
    onClose();
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const details = {
      username: String(formData.get("username")),
      role: String(formData.get("role") ?? user?.role) as Role,
      isActive: isCurrentUser || formData.get("isActive") === "on",
    };

    if (user) {
      runValidated(updateUserSchema, details, (input) => updateUser(user.id, input), handleClose);
      return;
    }

    runValidated(
      createUserSchema,
      {
        ...details,
        newPassword: String(formData.get("newPassword")),
        confirmPassword: String(formData.get("confirmPassword")),
      },
      createUser,
      handleClose,
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Editar usuario" : "Nuevo usuario"}
      description={isEditing ? "Actualiza los datos de acceso del usuario." : "Crea una cuenta para un miembro del equipo."}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <TextInput id="username" label="Usuario" defaultValue={user?.username} autoComplete="off" error={fieldError("username")} required />
        <SelectInput
          id="role"
          label="Rol"
          options={roleOptions}
          defaultValue={user?.role ?? "AYUDANTE"}
          disabled={isCurrentUser}
          error={fieldError("role")}
        />
        {!isEditing && (
          <>
            <PasswordInput
              id="newPassword"
              label="Contraseña"
              autoComplete="new-password"
              hint={`Mínimo ${PASSWORD_MIN_LENGTH} caracteres.`}
              error={fieldError("newPassword")}
              required
            />
            <PasswordInput id="confirmPassword" label="Confirmar contraseña" autoComplete="new-password" error={fieldError("confirmPassword")} required />
          </>
        )}
        <label className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted/50 px-4 py-3 text-sm font-semibold">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={user?.isActive ?? true}
            disabled={isCurrentUser}
            className="size-5 accent-secondary"
          />
          Usuario activo
        </label>
        {isCurrentUser && <p className="text-xs text-text-muted">No puedes cambiar tu propio rol ni desactivar tu cuenta.</p>}
        <DialogActions submitLabel={isEditing ? "Guardar cambios" : "Crear usuario"} isPending={isPending} onCancel={handleClose} />
      </form>
    </Modal>
  );
}
