import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../core/config/api.config';
import { AdminProductService } from './admin-product.service';

describe('AdminProductService', () => {
  let service: AdminProductService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AdminProductService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('keeps catalog records separate and maps their persisted image metadata', () => {
    let products: any[] = [];
    service.list().subscribe((result) => products = result);
    http.expectOne(`${API_BASE_URL}/catalog/products`).flush([{
      id: 9, name: 'Catalog item', slug: 'catalog-item', description: null, sku: 'CAT-9', basePrice: 15,
      salePrice: null, stockQuantity: 4, active: true, categoryId: 2, categoryName: 'Home', subCategoryId: null,
      brandId: null, brandName: null, vendorId: 3, createdAt: null, imageIds: [41], images: null,
    }]);
    http.expectOne(`${API_BASE_URL}/product-images`).flush([{
      id: 41, productId: 9, imageUrl: '/api/product-images/41/content', altText: 'Catalog image', primaryImage: true,
    }]);
    expect(products[0].id).toBe(9);
    expect(products[0].images[0]).toEqual({
      id: 41, productId: 9, url: '/api/product-images/41/content', altText: 'Catalog image',
      primaryImage: true, contentType: null, sizeBytes: null,
    });
  });

  it('sends multiple image files as repeated images multipart fields', () => {
    let finished = false;
    service.uploadImages(9, [new File(['one'], 'one.png', { type: 'image/png' }), new File(['two'], 'two.jpg', { type: 'image/jpeg' })]).subscribe(() => finished = true);
    const request = http.expectOne(`${API_BASE_URL}/catalog/products/9/images`);
    expect(request.request.method).toBe('POST');
    const form = request.request.body as FormData;
    expect(form.getAll('images').length).toBe(2);
    request.flush([]);
    expect(finished).toBeTrue();
  });
});
