
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.config';

import {
  Product,
  ProductRequest,
  CategoryOptionDto,
  BrandOptionDto
} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {

  private readonly apiUrl = 'http://localhost:8080/api/products';
  private readonly vendorCatalogUrl = `${API_BASE_URL}/catalog/vendor-products`;
  private readonly catalogCreateUrl = `${API_BASE_URL}/catalog/products`;
  private readonly publicCatalogUrl = `${API_BASE_URL}/catalog/products/public`;

  getPublicProducts(): Observable<Product[]> {
    return this.http.get<import('../models/product.model').CatalogProductDto[]>(this.publicCatalogUrl)
      .pipe(map(products => products.map(product => this.mapCatalogProduct(product))));
  }

  getPublicProduct(id: number): Observable<Product> {
    return this.http.get<import('../models/product.model').CatalogProductDto>(`${this.publicCatalogUrl}/${id}`)
      .pipe(map(product => this.mapCatalogProduct(product)));
  }

  constructor(private http: HttpClient) {}

  getCategories(): Observable<CategoryOptionDto[]> {
    return this.http.get<CategoryOptionDto[]>(`${API_BASE_URL}/categories`);
  }

  getBrands(): Observable<BrandOptionDto[]> {
    return this.http.get<BrandOptionDto[]>(`${API_BASE_URL}/brands`);
  }

  getVendorProducts(): Observable<import('../models/product.model').Product[]> {
    return this.http.get<import('../models/product.model').CatalogProductDto[]>(this.vendorCatalogUrl)
      .pipe(map(products => products.map(product => this.mapCatalogProduct(product))));
  }

  getVendorProduct(id: number): Observable<import('../models/product.model').Product> {
    return this.http.get<import('../models/product.model').CatalogProductDto>(`${this.vendorCatalogUrl}/${id}`)
      .pipe(map(product => this.mapCatalogProduct(product)));
  }

  createCatalogProduct(product: Record<string, unknown>, images: File[]): Observable<import('../models/product.model').CatalogProductDto> {
    const body = new FormData();
    body.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
    images.forEach(image => body.append('images', image, image.name));
    return this.http.post<import('../models/product.model').CatalogProductDto>(this.catalogCreateUrl, body);
  }

  updateVendorProduct(id: number, product: Partial<import('../models/product.model').CatalogProductDto>): Observable<import('../models/product.model').CatalogProductDto> {
    return this.http.put<import('../models/product.model').CatalogProductDto>(`${this.vendorCatalogUrl}/${id}`, product);
  }

  getVendorProductImageByPath(path: string): Observable<Blob> {
    if (!path.startsWith('/api/catalog/vendor-products/')) {
      return throwError(() => new Error('Unexpected vendor product image path.'));
    }
    const backendOrigin = API_BASE_URL.slice(0, -'/api'.length);
    return this.http.get(`${backendOrigin}${path}`, { responseType: 'blob' });
  }

  private mapCatalogProduct(dto: import('../models/product.model').CatalogProductDto): import('../models/product.model').Product {
    const price = Number(dto.salePrice ?? dto.basePrice);
    const basePrice = Number(dto.basePrice);
    return {
      id: dto.id,
      name: dto.name,
      category: dto.categoryName ?? '',
      price,
      oldPrice: basePrice,
      discount: basePrice > 0 ? Math.round((basePrice - price) / basePrice * 100) : 0,
      rating: 0,
      reviews: 0,
      image: '',
      description: dto.description,
      stock: Number(dto.stockQuantity ?? 0),
      active: dto.active,
      imageUrl: null,
      createdAt: dto.createdAt,
      catalogProduct: true,
      sku: dto.sku,
      brandName: dto.brandName,
      imageIds: dto.images?.map(image => image.id) ?? [],
      imagePaths: dto.images?.map(image => `${API_BASE_URL}/product-images/${image.id}/content`) ?? [],
      slug: dto.slug,
      categoryId: dto.categoryId,
      brandId: dto.brandId,
      vendorId: dto.vendorId
    };
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(data: ProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, data);
  }

  updateProduct(
    id: number,
    data: ProductRequest
  ): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

deleteProduct(id: number) {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
}
