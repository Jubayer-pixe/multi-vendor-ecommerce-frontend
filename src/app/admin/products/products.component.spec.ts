import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminProductService } from './admin-product.service';

import { ProductsComponent } from './products.component';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [{ provide: AdminProductService, useValue: { list: () => of([]), loadOptions: () => of({ categories: [], brands: [], vendors: [] }) } }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps the create form visible while entering a product name', () => {
    const nameInput: HTMLInputElement =
      fixture.nativeElement.querySelector('#product-name');

    nameInput.value = 'Sample product';
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#product-name')).toBeTruthy();
  });
});
