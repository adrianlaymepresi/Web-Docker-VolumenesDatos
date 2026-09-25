import { ADMIN_ONLY, ALL_ROLES, type Role } from "@/config/roles";

export const LOGIN_ROUTE = "/login";
export const USERS_ROUTE = "/usuarios";
export const CATEGORIES_ROUTE = "/categorias";
export const PRODUCTS_ROUTE = "/productos";
export const HOME_ROUTE = PRODUCTS_ROUTE;

export type NavigationItemKey = "users" | "categories" | "products";

export type NavigationItem = {
  key: NavigationItemKey;
  label: string;
  href: string;
  allowedRoles: Role[];
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { key: "users", label: "Usuarios", href: USERS_ROUTE, allowedRoles: ADMIN_ONLY },
  { key: "categories", label: "Categorías", href: CATEGORIES_ROUTE, allowedRoles: ADMIN_ONLY },
  { key: "products", label: "Productos", href: PRODUCTS_ROUTE, allowedRoles: ALL_ROLES },
];

export function getNavigationForRole(role: Role) {
  return NAVIGATION_ITEMS.filter((item) => item.allowedRoles.includes(role));
}

export function getProductRoute(productId: number) {
  return `${PRODUCTS_ROUTE}/${productId}`;
}
