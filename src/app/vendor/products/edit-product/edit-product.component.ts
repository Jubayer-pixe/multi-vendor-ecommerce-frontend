
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  Product,
  CatalogProductDto
} from '../../../shared/models/product.model';

import {
  ProductApiService
} from '../../../shared/services/product-api.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent implements OnInit {

  productId = 0;
  loading = false;
  saving = false;
  error = '';

  product = {
    id: 0,
    name: '',
    category: '',
    brand: '',
    sku: '',
    price: 0,
    discount: 0,
    stock: 0,
    description: '',
    status: 'Active'
  };

  selectedImage: string | null = null;

  private currentImageUrl: string | null = null;
  private currentPremium = false;
  private currentSlug = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productApi: ProductApiService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.error = 'Invalid product ID.';
      return;
    }

    this.productId = id;
    this.loadProduct();
  }

  loadProduct(): void {
    this.loading = true;
    this.error = '';

    this.productApi.getVendorProduct(this.productId).subscribe({
      next: (p: Product) => {
        this.product = {
          id: p.id,
          name: p.name ?? '',
          category: p.category ?? '',
          brand: p.brandName ?? '',
          sku: p.sku ?? '',
          price: Number(p.price ?? 0),
          discount: Number(p.discount ?? 0),
          stock: Number(p.stock ?? 0),
          description: p.description ?? '',
          status: Number(p.stock ?? 0) === 0
            ? 'Out of Stock'
            : p.active === false
              ? 'Inactive'
              : 'Active'
        };

        this.currentImageUrl = p.imageUrl ?? null;
        this.currentPremium = p.premium ?? false;
        this.currentSlug = p.slug ?? '';

        this.loading = false;
      },

      error: (err) => {
        this.loading = false;

        this.error =
          err.status === 0
            ? 'Cannot connect to the backend.'
            : err.status === 401
              ? 'Please log in first.'
              : err.status === 403
                ? 'You do not have permission to view this product.'
                : err.status === 404
                  ? 'Product not found.'
                  : 'Unable to load product.';

        console.error('GET product failed:', err);
      }
    });
  }

  updateProduct(): void {
    if (this.saving || this.loading) {
      return;
    }

    if (
      !this.product.name.trim() ||
      !this.product.category.trim() ||
      !Number.isFinite(this.product.price) ||
      this.product.price <= 0 ||
      !Number.isInteger(this.product.stock) ||
      this.product.stock < 0
    ) {
      this.error = 'Please enter valid product details.';
      return;
    }

    const basePrice = Number(this.product.price);
    const request: Partial<CatalogProductDto> = {
      id: this.productId,
      name: this.product.name.trim(),
      slug: this.currentSlug || this.product.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: this.product.sku.trim() || `SKU-${Date.now()}`,
      description: this.product.description.trim() || null,
      basePrice,
      salePrice: this.product.discount > 0
        ? Number((basePrice * (1 - this.product.discount / 100)).toFixed(2))
        : null,
      categoryName: this.product.category.trim(),
      brandName: this.product.brand.trim() || null,
      stockQuantity: Number(this.product.stock),
      active: this.product.status !== 'Inactive'
    };

    this.saving = true;
    this.error = '';

    this.productApi.updateVendorProduct(
      this.productId,
      request
    ).subscribe({
      next: () => {
        this.saving = false;

        alert('Product updated successfully.');

        this.router.navigate(['/vendor/products']);
      },

      error: (err) => {
        this.saving = false;

        this.error =
          err.status === 0
            ? 'Cannot connect to the backend.'
            : err.status === 400
              ? 'Invalid product data. Check the fields and try again.'
              : err.status === 401
                ? 'Please log in first.'
                : err.status === 403
                  ? 'You do not have permission to update products.'
                  : err.status === 404
                    ? 'Product not found.'
                    : 'Product update failed.';

        console.error('PUT product failed:', err);
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.error = 'Please select a valid image file.';
      input.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.selectedImage = reader.result as string;
      this.error = '';
    };

    reader.onerror = () => {
      this.error = 'Unable to preview the selected image.';
    };

    reader.readAsDataURL(file);
  }

  cancel(): void {
    this.router.navigate(['/vendor/products']);
  }
}
