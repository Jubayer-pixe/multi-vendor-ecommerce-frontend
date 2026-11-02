
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';

import { API_BASE_URL } from '../../core/config/api.config';

import {
  BrandOptionDto,
  CatalogImageDto,
  CatalogProductDto,
  CategoryOptionDto,
} from '../../shared/models/product.model';


// Vendor dropdown option
export interface AdminProductVendorOption {
  id: number;
  userName: string;
  businessName: string;
}

// Product image metadata from backend
interface AdminProductImageMetadata {
  id: number;
  productId: number;
  imageUrl: string;
  altText: string | null;
  primaryImage: boolean;
}

// Backend ProductCreateRequest DTO অনুযায়ী
export interface AdminProductCreateRequest {
  name: string;
  slug: string;
  description: string | null;
  sku: string;

  basePrice: number;
  salePrice: number | null;

  categoryId: number | null;
  categoryName: string | null;

  subCategoryId: number | null;

  brandId: number | null;
  brandName: string | null;

  stockQuantity: number;
  active: boolean;
}

// Update request
// export type AdminCatalogProductRequest = Omit<
//   CatalogProductDto,
//   'id' | 'createdAt' | 'imageIds' | 'images'
// > & {
//   id?: number;
// };
export type AdminCatalogProductRequest =
  AdminProductCreateRequest & {
    id?: number;
    vendorId?: number | null;
  };
@Injectable({
  providedIn: 'root',
})
export class AdminProductService {

  private readonly catalogUrl = `${API_BASE_URL}/catalog/products`;

  constructor(private http: HttpClient) {}


  // ==========================================
  // LOAD CATEGORY, BRAND AND VENDOR OPTIONS
  // ==========================================

  loadOptions() {
    return forkJoin({
      categories: this.http.get<CategoryOptionDto[]>(
        `${API_BASE_URL}/categories`
      ),

      brands: this.http.get<BrandOptionDto[]>(
        `${API_BASE_URL}/brands`
      ),

      vendors: this.http.get<AdminProductVendorOption[]>(
        `${API_BASE_URL}/vendors`
      ),
    });
  }


  // ==========================================
  // GET ALL PRODUCTS WITH IMAGES
  // ==========================================

  list(): Observable<CatalogProductDto[]> {

    return forkJoin({
      products: this.http.get<CatalogProductDto[]>(
        this.catalogUrl
      ),

      images: this.http.get<AdminProductImageMetadata[]>(
        `${API_BASE_URL}/product-images`
      ),
    }).pipe(

      map(({ products, images }) =>

        products.map((product) => ({

          ...product,

          images: images
            .filter((image) => image.productId === product.id)

            .map((image) => ({

              id: image.id,
              productId: image.productId,
              url: image.imageUrl,
              altText: image.altText,
              primaryImage: image.primaryImage,

              contentType: null,
              sizeBytes: null,

            })),

        }))

      )

    );
  }


  // ==========================================
  // CREATE PRODUCT WITH MULTIPLE IMAGES
  // POST /api/catalog/products
  // Content-Type: multipart/form-data
  // ==========================================

  create(
    request: AdminProductCreateRequest,
    files: File[] = []
  ): Observable<CatalogProductDto> {

    const formData = new FormData();

    // Product JSON part
    formData.append(
      'product',
      new Blob(
        [JSON.stringify(request)],
        { type: 'application/json' }
      )
    );

    // Multiple image files
    files.forEach((file) => {

      formData.append(
        'images',
        file,
        file.name
      );

    });

    return this.http.post<CatalogProductDto>(
      this.catalogUrl,
      formData
    );
  }


  // ==========================================
  // UPDATE PRODUCT
  // PUT /api/catalog/products/{id}
  // Content-Type: application/json
  // ==========================================

  update(
    id: number,
    request: AdminCatalogProductRequest
  ): Observable<CatalogProductDto> {

    const updateRequest = {
      ...request,
      id: id,
    };

    return this.http.put<CatalogProductDto>(
      `${this.catalogUrl}/${id}`,
      updateRequest
    );
  }


  // ==========================================
  // UPLOAD IMAGES TO EXISTING PRODUCT
  // POST /api/catalog/products/{id}/images
  // Content-Type: multipart/form-data
  // ==========================================

  uploadImages(
    productId: number,
    files: File[]
  ): Observable<CatalogImageDto[]> {

    const formData = new FormData();

    files.forEach((file) => {

      formData.append(
        'images',
        file,
        file.name
      );

    });

    return this.http.post<CatalogImageDto[]>(
      `${this.catalogUrl}/${productId}/images`,
      formData
    );
  }

}
