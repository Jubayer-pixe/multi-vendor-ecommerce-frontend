import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductApiService } from './product-api.service';
import { API_BASE_URL } from '../../core/config/api.config';

describe('ProductApiService catalog upload', () => {
  let service: ProductApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ProductApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends product JSON and multiple image parts as multipart form data', () => {
    const imageFiles = [
      new File(['one'], 'one.png', { type: 'image/png' }),
      new File(['two'], 'two.jpg', { type: 'image/jpeg' })
    ];
    const product = { name: 'Lamp', sku: 'L-1', stockQuantity: 3 };

    service.createCatalogProduct(product, imageFiles).subscribe();

    const request = http.expectOne(`${API_BASE_URL}/catalog/products`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body instanceof FormData).toBeTrue();
    const form = request.request.body as FormData;
    const productPart = form.get('product') as Blob;
    expect(productPart.type).toBe('application/json');
    expect(form.getAll('images').length).toBe(2);
    request.flush({ id: 31 });
  });
});
