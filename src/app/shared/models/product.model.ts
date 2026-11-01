
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  premium?: boolean;
  description?: string | null;
  stock: number;
  active?: boolean;
  imageUrl?: string | null;
  createdAt?: string | null;
  catalogProduct?: boolean;
  sku?: string;
  brandName?: string | null;
  imageIds?: number[];
  imagePaths?: string[];
  slug?: string;
  categoryId?: number | null;
  brandId?: number | null;
  vendorId?: number | null;
}

export interface ProductRequest {
  name: string;
  category: string;
  price: number;
  description: string | null;
  stock: number;
  active: boolean;
  premium: boolean;
  imageUrl: string | null;
}

/** Response shape returned by the legacy /api/products endpoints. */
export interface LegacyProductDto {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string | null;
  stock: number;
  active: boolean | null;
  premium: boolean | null;
  imageUrl: string | null;
  createdAt: string | null;
}

export interface CatalogImageDto {
  id: number;
  productId: number;
  url: string;
  altText: string | null;
  primaryImage: boolean;
  contentType: string | null;
  sizeBytes: number | null;
}

export interface CategoryOptionDto {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  active: boolean | null;
}

export interface BrandOptionDto {
  id: number;
  name: string;
  logoUrl: string | null;
  description: string | null;
}

export interface CatalogProductDto {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sku: string;
  basePrice: number;
  salePrice: number | null;
  stockQuantity: number;
  active: boolean;
  categoryId: number | null;
  categoryName: string | null;
  subCategoryId: number | null;
  brandId: number | null;
  brandName: string | null;
  vendorId: number | null;
  createdAt: string | null;
  imageIds: number[];
  images: CatalogImageDto[] | null;
}
