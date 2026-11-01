
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductApiService } from '../../../shared/services/product-api.service';
import { BrandOptionDto, CategoryOptionDto } from '../../../shared/models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit, OnDestroy {

  product = {
    name: '',
    category: null as number | null,
    brand: null as number | null,
    sku: '',
    price: null as number | null,
    discount: 0,
    stock: null as number | null,
    description: '',
    status: 'Active'
  };

  selectedImages: { file: File; preview: string }[] = [];

  saving = false;
  error = '';
  categories: CategoryOptionDto[] = [];
  brands: BrandOptionDto[] = [];
  categoriesLoading = true;
  categoriesError = '';
  brandsError = '';

  constructor(
    private router: Router,
    private productApi: ProductApiService
  ) {}

  ngOnInit(): void {
    this.productApi.getCategories().subscribe({
      next: categories => {
        this.categories = categories;
        this.categoriesLoading = false;
        if (!categories.length) {
          this.categoriesError = 'No product categories are available. Ask an administrator to add a category before creating a product.';
        }
      },
      error: err => {
        this.categoriesLoading = false;
        this.categoriesError = err.status === 403
          ? 'Your account cannot read the product category list.'
          : 'Could not load product categories from the backend.';
      }
    });

    this.productApi.getBrands().subscribe({
      next: brands => this.brands = brands,
      error: err => {
        this.brandsError = err.status === 403
          ? 'Your account cannot read the brand list; you can still create a product without a brand.'
          : 'Could not load brands; you can still create a product without a brand.';
      }
    });
  }

  private readonly maxImageCount = 10;
  private readonly maxImageBytes = 5 * 1024 * 1024;

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (!files.length) {
      return;
    }

    this.error = '';
    const errors: string[] = [];
    for (const file of files) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        errors.push(`${file.name}: only JPG and PNG images are accepted.`);
        continue;
      }
      if (file.size === 0 || file.size > this.maxImageBytes) {
        errors.push(`${file.name}: image size must be 5 MB or less.`);
        continue;
      }
      if (this.selectedImages.length >= this.maxImageCount) {
        errors.push(`A maximum of ${this.maxImageCount} images can be uploaded.`);
        break;
      }
      this.selectedImages.push({ file, preview: URL.createObjectURL(file) });
    }
    this.error = errors.join(' ');
    input.value = '';
  }

  removeImage(index: number): void {
    const image = this.selectedImages.splice(index, 1)[0];
    if (image) URL.revokeObjectURL(image.preview);
  }

  ngOnDestroy(): void {
    this.selectedImages.forEach(image => URL.revokeObjectURL(image.preview));
  }

  saveProduct(): void {
    if (this.saving) {
      return;
    }

    if (
      !this.product.name.trim() ||
      this.product.category === null ||
      this.product.price === null ||
      !Number.isFinite(this.product.price) ||
      this.product.price <= 0 ||
      this.product.stock === null ||
      !Number.isInteger(this.product.stock) ||
      this.product.stock < 0 ||
      !Number.isFinite(this.product.discount) ||
      this.product.discount < 0 ||
      this.product.discount > 100
    ) {
      this.error =
        'Enter a valid name, category, price, stock and discount.';
      return;
    }

    const now = Date.now();
    const slugBase = this.product.name.trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'product';
    const request = {
      name: this.product.name.trim(),
      slug: `${slugBase}-${now}`,
      sku: this.product.sku.trim() || `SKU-${now}`,
      description: this.product.description.trim() || null,
      basePrice: this.product.price,
      salePrice: this.product.discount > 0
        ? Number((this.product.price * (1 - this.product.discount / 100)).toFixed(2))
        : null,
      categoryId: this.product.category,
      brandId: this.product.brand,
      stockQuantity: this.product.stock,
      active: this.product.status === 'Active' && this.product.stock > 0
    };

    this.saving = true;
    this.error = '';

    this.productApi.createCatalogProduct(request, this.selectedImages.map(image => image.file)).subscribe({
      next: (created) => {
        this.saving = false;

        alert(
          `Product created successfully. ID: ${created.id}`
        );

        this.router.navigate(['/vendor/products']);
      },

      error: (err) => {
        this.saving = false;

        this.error =
          err.status === 0
            ? 'Cannot connect to the backend. Check whether Spring Boot is running.'
            : err.status === 400
              ? 'Product or image data was rejected. Check the category, brand, image type, and file-size limits.'
              : err.status === 409
                ? 'This product SKU or name is already in use. Change the SKU and try again.'
                : err.status === 413
                  ? 'The selected images exceed the server upload limit. Remove some files and try again.'
              : err.status === 401
                ? 'Please log in first.'
                : err.status === 403
                  ? 'You do not have permission to create products.'
                  : 'Product and image upload failed. Please retry; the backend should roll back this product creation.';

        console.error('POST product failed:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/vendor/products']);
  }
}
