import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductApiService } from './product-api.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private productApi: ProductApiService) {}

  getProductsFromBackend(): Observable<Product[]> {
    return this.productApi.getPublicProducts();
  }

  getProductByIdFromBackend(id: number): Observable<Product> {
    return this.productApi.getPublicProduct(id);
  }

  toDisplayImage(product: Product): string {
    return product.imagePaths?.[0] || product.imageUrl || product.image || 'assets/images/home.jpg';
  }
}