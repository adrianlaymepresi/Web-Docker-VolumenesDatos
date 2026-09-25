"use client";

import { useState } from "react";
import { KeyRound, Pencil, Plus, Power, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, IconButton } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar, type SelectFilter } from "@/components/ui/filter-bar";
import { PageHeader } from "@/components/ui/page-header";
import { useServerAction } from "@/components/ui/use-server-action";
import { ROLE_LABELS, ROLES } from "@/config/roles";
import { deleteUser, setUserActive } from "@/features/users/actions";
import { UserFormDialog } from "@/features/users/components/user-form-dialog";
import { UserPasswordDialog } from "@/features/users/components/user-password-dialog";
import type { UserSummary } from "@/features/users/types";

type DialogState =
  | { type: "form"; user: UserSummary | null }
  | { type: "password"; user: UserSummary }
  | { type: "delete"; user: UserSummary }
  | null;

const userFilters: SelectFilter[] = [
  {
    param: "role",
    label: "Rol",
    allLabel: "Todos los roles",
    options: ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] })),
  },
  {
    param: "status",
    label: "Estado",
    allLabel: "Todos los estados",
    options: [
      { value: "active", label: "Activos" },
      { value: "inactive", label: "Inactivos" },
    ],
  },
];

type UsersViewProps = {
  users: UserSummary[];
  currentUserId: number;
};

export function UsersView({ users, currentUserId }: UsersViewProps) {
  const [dialog, setDialog] = useState<DialogState>(null);
  const { run, isPending } = useServerAction();
  const closeDialog = () => setDialog(null);

  const columns: DataTableColumn<UserSummary>[] = [
    {
      key: "username",
      header: "Usuario",
      cell: (user) => (
        <span className="font-bold">
          {user.username}
          {user.id === currentUserId && <span className="ml-2 text-xs font-semibold text-text-muted">(tú)</span>}
        </span>
      ),
    },
    {
      key: "role",
      header: "Rol",
      cell: (user) => <Badge tone={user.role === "ADMINISTRADOR" ? "secondary" : "accent"}>{ROLE_LABELS[user.role]}</Badge>,
    },
    {
      key: "status",
      header: "Estado",
      cell: (user) => <Badge tone={user.isActive ? "success" : "neutral"}>{user.isActive ? "Activo" : "Inactivo"}</Badge>,
    },
    {
      key: "actions",
      header: "Acciones",
      className: "text-right",
      cell: (user) => {
        const isCurrentUser = user.id === currentUserId;
        return (
          <div className="flex justify-end gap-1">
            <IconButton label={`Editar ${user.username}`} tone="secondary" onClick={() => setDialog({ type: "form", user })}>
              <Pencil aria-hidden className="size-4" />
            </IconButton>
            <IconButton label={`Cambiar contraseña de ${user.username}`} tone="secondary" onClick={() => setDialog({ type: "password", user })}>
              <KeyRound aria-hidden className="size-4" />
            </IconButton>
            <IconButton
              label={isCurrentUser ? "No puedes desactivar tu propia cuenta" : user.isActive ? `Desactivar ${user.username}` : `Activar ${user.username}`}
              tone={user.isActive ? "neutral" : "primary"}
              disabled={isCurrentUser || isPending}
              onClick={() => run(() => setUserActive(user.id, !user.isActive))}
            >
              <Power aria-hidden className="size-4" />
            </IconButton>
            <IconButton
              label={isCurrentUser ? "No puedes eliminar tu propia cuenta" : `Eliminar ${user.username}`}
              tone="danger"
              disabled={isCurrentUser}
              onClick={() => setDialog({ type: "delete", user })}
            >
              <Trash2 aria-hidden className="size-4" />
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Usuarios"
        description="Administra las cuentas y los permisos del equipo."
        action={
          <Button icon={<Plus aria-hidden className="size-4" />} onClick={() => setDialog({ type: "form", user: null })}>
            Nuevo usuario
          </Button>
        }
      />
      <FilterBar searchLabel="Buscar usuario" searchPlaceholder="Nombre de usuario…" selectFilters={userFilters} />

      {users.length === 0 ? (
        <EmptyState
          icon={<Users aria-hidden className="size-7" />}
          title="No se encontraron usuarios"
          description="Prueba con otros filtros o crea un nuevo usuario."
        />
      ) : (
        <DataTable caption="Lista de usuarios" columns={columns} rows={users} getRowKey={(user) => user.id} />
      )}

      <UserFormDialog
        isOpen={dialog?.type === "form"}
        user={dialog?.type === "form" ? dialog.user : null}
        isCurrentUser={dialog?.type === "form" && dialog.user?.id === currentUserId}
        onClose={closeDialog}
      />
      <UserPasswordDialog user={dialog?.type === "password" ? dialog.user : null} onClose={closeDialog} />
      <ConfirmDialog
        isOpen={dialog?.type === "delete"}
        title="Eliminar usuario"
        message={dialog?.type === "delete" ? `¿Seguro que deseas eliminar al usuario "${dialog.user.username}"? Esta acción no se puede deshacer.` : ""}
        isLoading={isPending}
        onConfirm={() => dialog?.type === "delete" && run(() => deleteUser(dialog.user.id), closeDialog)}
        onClose={closeDialog}
      />
    </div>
  );
}
