import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AddProductComponent } from './add-product.component';
import { ProductApiService } from '../../../shared/services/product-api.service';
import { CatalogProductDto } from '../../../shared/models/product.model';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let productApi: jasmine.SpyObj<ProductApiService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    productApi = jasmine.createSpyObj<ProductApiService>('ProductApiService', [
      'createCatalogProduct', 'getCategories', 'getBrands'
    ]);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    productApi.createCatalogProduct.and.returnValue(of({ id: 31 } as unknown as CatalogProductDto));
    productApi.getCategories.and.returnValue(of([{ id: 14, name: 'Office', slug: 'office', active: true }]));
    productApi.getBrands.and.returnValue(of([{ id: 3, name: 'Acme', logoUrl: null, description: null }]));
    await TestBed.configureTestingModule({
      imports: [AddProductComponent],
      providers: [
        { provide: ProductApiService, useValue: productApi },
        { provide: Router, useValue: router }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses category and brand records returned by their APIs', () => {
    expect(component.categories).toEqual([{ id: 14, name: 'Office', slug: 'office', active: true }]);
    expect(component.brands).toEqual([{ id: 3, name: 'Acme', logoUrl: null, description: null }]);
  });

  it('accepts multiple JPEG and PNG images and allows one preview to be removed', () => {
    spyOn(URL, 'createObjectURL').and.returnValues('blob:first', 'blob:second');
    spyOn(URL, 'revokeObjectURL');
    const files = [
      new File(['first'], 'first.png', { type: 'image/png' }),
      new File(['second'], 'second.jpg', { type: 'image/jpeg' })
    ];
    const input = { files, value: 'selected' } as unknown as HTMLInputElement;

    component.onImageSelected({ target: input } as unknown as Event);

    expect(component.selectedImages.length).toBe(2);
    expect(component.selectedImages[0].preview).toBe('blob:first');
    component.removeImage(0);
    expect(component.selectedImages.length).toBe(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:first');
  });

  it('rejects non-image formats and files larger than 5 MB', () => {
    const files = [
      new File(['text'], 'notes.txt', { type: 'text/plain' }),
      new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' })
    ];

    component.onImageSelected({ target: { files, value: '' } } as unknown as Event);

    expect(component.selectedImages).toEqual([]);
    expect(component.error).toContain('only JPG and PNG');
    expect(component.error).toContain('5 MB or less');
  });

  it('submits product fields and all selected files through the catalog multipart service', () => {
    const image = new File(['png'], 'item.png', { type: 'image/png' });
    spyOn(URL, 'createObjectURL').and.returnValue('blob:item');
    component.product = {
      name: 'Desk Lamp', category: 14, brand: 3, sku: 'LAMP-1',
      price: 100, discount: 10, stock: 4, description: 'Lamp', status: 'Active'
    };
    component.onImageSelected({ target: { files: [image], value: '' } } as unknown as Event);

    component.saveProduct();

    expect(productApi.createCatalogProduct).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'Desk Lamp', categoryId: 14, brandId: 3,
      sku: 'LAMP-1', basePrice: 100, salePrice: 90, stockQuantity: 4
    }), [image]);
    expect(router.navigate).toHaveBeenCalledWith(['/vendor/products']);
  });
});
