export const ROLES = ["ADMINISTRADOR", "AYUDANTE"] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  ADMINISTRADOR: "Administrador",
  AYUDANTE: "Ayudante",
};

export const ADMIN_ONLY: Role[] = ["ADMINISTRADOR"];
export const ALL_ROLES: Role[] = [...ROLES];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}
