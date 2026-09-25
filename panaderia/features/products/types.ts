export type ProductImageItem = {
  id: number;
  url: string;
  priority: number;
};

export type ProductSummary = {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  categoryName: string;
  coverImageUrl: string | null;
  imageCount: number;
};

export type ProductDetail = ProductSummary & {
  images: ProductImageItem[];
};

export type ProductFilters = {
  query?: string;
  categoryId?: number;
};

export type ProductViewMode = "table" | "cards";

export type ProductPermissions = {
  canDeleteProducts: boolean;
  canDeleteCoverImage: boolean;
};

export type ImageMoveDirection = "up" | "down";
