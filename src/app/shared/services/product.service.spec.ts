import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { Product } from '../models/product.model';
import { API_BASE_URL } from '../../core/config/api.config';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ProductService);
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads and maps the legacy product list contract without assuming catalog fields', () => {
    let products: Product[] = [];
    service.getProductsFromBackend().subscribe(value => products = value);

    const req = TestBed.inject(HttpTestingController).expectOne(`${API_BASE_URL}/products`);
    expect(req.request.method).toBe('GET');
    req.flush([{
      id: 17,
      name: 'Headphones',
      category: 'Electronics',
      price: 1250.5,
      description: null,
      stock: 8,
      active: true,
      premium: false,
      imageUrl: 'https://cdn.example.test/headphones.jpg',
      createdAt: '2026-10-28T10:00:00Z',
    }]);

    expect(products[0]).toEqual(jasmine.objectContaining({
      id: 17,
      name: 'Headphones',
      category: 'Electronics',
      price: 1250.5,
      oldPrice: 1250.5,
      discount: 0,
      rating: 0,
      reviews: 0,
      stock: 8,
      image: 'https://cdn.example.test/headphones.jpg',
      imageUrl: 'https://cdn.example.test/headphones.jpg',
      createdAt: '2026-10-28T10:00:00Z',
    }));
  });

  it('loads a legacy product detail by id', () => {
    let product: unknown;
    service.getProductByIdFromBackend(17).subscribe(value => product = value);
    const req = TestBed.inject(HttpTestingController).expectOne(`${API_BASE_URL}/products/17`);
    expect(req.request.method).toBe('GET');
    req.flush({
      id: 17, name: 'Headphones', category: 'Electronics', price: 1250,
      description: 'Wired headphones', stock: 8, active: true, premium: false,
      imageUrl: null, createdAt: null,
    });
    expect(product).toEqual(jasmine.objectContaining({
      id: 17, price: 1250, description: 'Wired headphones', image: '', imageUrl: null,
    }));
  });
});
