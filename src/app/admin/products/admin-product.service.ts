import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.config';
import { BrandOptionDto, CatalogImageDto, CatalogProductDto, CategoryOptionDto } from '../../shared/models/product.model';

export interface AdminProductVendorOption { id: number; userName: string; businessName: string; }
interface AdminProductImageMetadata { id: number; productId: number; imageUrl: string; altText: string | null; primaryImage: boolean; }
export type AdminCatalogProductRequest = Omit<CatalogProductDto, 'id' | 'createdAt' | 'imageIds' | 'images'> & { id?: number };

@Injectable({ providedIn: 'root' })
export class AdminProductService {
  private readonly catalogUrl = `${API_BASE_URL}/catalog/products`;

  constructor(private http: HttpClient) {}

  loadOptions() {
    return forkJoin({
      categories: this.http.get<CategoryOptionDto[]>(`${API_BASE_URL}/categories`),
      brands: this.http.get<BrandOptionDto[]>(`${API_BASE_URL}/brands`),
      vendors: this.http.get<AdminProductVendorOption[]>(`${API_BASE_URL}/vendors`),
    });
  }

  list(): Observable<CatalogProductDto[]> {
    return forkJoin({
      products: this.http.get<CatalogProductDto[]>(this.catalogUrl),
      images: this.http.get<AdminProductImageMetadata[]>(`${API_BASE_URL}/product-images`),
    }).pipe(map(({ products, images }) => products.map((product) => ({
      ...product,
      images: images.filter((image) => image.productId === product.id).map((image) => ({
        id: image.id,
        productId: image.productId,
        url: image.imageUrl,
        altText: image.altText,
        primaryImage: image.primaryImage,
        contentType: null,
        sizeBytes: null,
      })),
    }))));
  }
  create(request: AdminCatalogProductRequest): Observable<CatalogProductDto> { return this.http.post<CatalogProductDto>(this.catalogUrl, request); }
  update(id: number, request: AdminCatalogProductRequest): Observable<CatalogProductDto> { return this.http.put<CatalogProductDto>(`${this.catalogUrl}/${id}`, { ...request, id }); }
  uploadImages(productId: number, files: File[]): Observable<CatalogImageDto[]> {
    const form = new FormData();
    files.forEach((file) => form.append('images', file, file.name));
    return this.http.post<CatalogImageDto[]>(`${this.catalogUrl}/${productId}/images`, form);
  }
}
