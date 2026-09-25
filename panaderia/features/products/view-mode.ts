import type { ProductViewMode } from "@/features/products/types";

export const DEFAULT_PRODUCT_VIEW: ProductViewMode = "table";

export function parseProductViewMode(value: string): ProductViewMode {
  return value === "cards" ? "cards" : DEFAULT_PRODUCT_VIEW;
}
