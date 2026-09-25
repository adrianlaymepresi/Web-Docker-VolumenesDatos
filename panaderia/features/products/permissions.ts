import type { Role } from "@/config/roles";
import type { ProductPermissions } from "@/features/products/types";

export function getProductPermissions(role: Role): ProductPermissions {
  const isAdministrator = role === "ADMINISTRADOR";
  return {
    canDeleteProducts: isAdministrator,
    canDeleteCoverImage: isAdministrator,
  };
}
