import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductApiService } from '../../shared/services/product-api.service';
import { Product } from '../../shared/models/product.model';

type ProductStatus = 'Active' | 'Inactive' | 'Out of Stock';

@Component({
  selector: 'app-vendor-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {

  products: Product[] = [];

  searchText = '';
  selectedCategory = 'All';
  selectedStatus = 'All';
  deletingProductId: number | null = null;

  loading = false;
  error = '';
  success = '';
  private imageObjectUrls: string[] = [];

  constructor(
    private router: Router,
    private productApi: ProductApiService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.imageObjectUrls.forEach(url => URL.revokeObjectURL(url));
    this.imageObjectUrls = [];
    this.loading = true;
    this.error = '';

    this.productApi.getVendorProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.loading = false;
        data.forEach(product => {
          const imagePath = product.imagePaths?.[0];
          if (!imagePath) return;
          this.productApi.getVendorProductImageByPath(imagePath).subscribe({
            next: blob => {
              const objectUrl = URL.createObjectURL(blob);
              this.imageObjectUrls.push(objectUrl);
              product.imageUrl = objectUrl;
            }
          });
        });
      },
      error: (err) => {
        this.loading = false;

        this.error =
          err.status === 0
            ? 'Backend connection failed. Make sure Spring Boot is running.'
            : err.status === 401
              ? 'Please log in to continue.'
              : err.status === 403
                ? 'You do not have permission to view products.'
                : 'Unable to load products. Please try again.';

        console.error('GET products failed:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.imageObjectUrls.forEach(url => URL.revokeObjectURL(url));
  }

  get filteredProducts(): Product[] {
    return this.products.filter(product => {
      const matchesSearch = (product.name ?? '')
        .toLowerCase()
        .includes(this.searchText.trim().toLowerCase());

      const matchesCategory =
        this.selectedCategory === 'All' ||
        product.category === this.selectedCategory;

      const matchesStatus =
        this.selectedStatus === 'All' ||
        this.getStatus(product) === this.selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  get totalProducts(): number {
    return this.products.length;
  }

  get activeProducts(): number {
    return this.products.filter(
      p => p.active && p.stock > 0
    ).length;
  }

  get outOfStockProducts(): number {
    return this.products.filter(
      p => p.stock === 0
    ).length;
  }

  get lowStockProducts(): number {
    return this.products.filter(
      p => p.stock > 0 && p.stock <= 10
    ).length;
  }

  getStatus(product: Product): ProductStatus {
    if (product.stock === 0) {
      return 'Out of Stock';
    }

    return product.active ? 'Active' : 'Inactive';
  }

  addProduct(): void {
    this.router.navigate(['/vendor/products/add']);
  }

  editProduct(product: Product): void {
    this.router.navigate(['/vendor/products/edit', product.id]);
  }

  viewProduct(product: Product): void {
    this.router.navigate(['/vendor/products', product.id]);
  }

 
deleteProduct(product: Product): void {
  if (product.catalogProduct) {
    this.error = 'Product deletion is not available for catalog products because historical order references require a backend retirement workflow.';
    return;
  }
  if (this.deletingProductId !== null) {
    return;
  }

  const confirmed = confirm(
    `Are you sure you want to delete "${product.name}"?`
  );

  if (!confirmed) {
    return;
  }

  this.error = '';
  this.success = '';
  this.deletingProductId = product.id;

  this.productApi.deleteProduct(product.id).subscribe({
    next: () => {
      this.products = this.products.filter(
        p => p.id !== product.id
      );

      this.deletingProductId = null;
      this.success = `"${product.name}" deleted successfully.`;

      // কয়েক সেকেন্ড পর success message সরিয়ে দেবে
      setTimeout(() => {
        this.success = '';
      }, 4000);
    },

    error: (err) => {
      this.deletingProductId = null;

      if (err.status === 0) {
        this.error = 'Backend connection failed. Check Spring Boot.';
      } else if (err.status === 401) {
        this.error = 'Please log in before deleting a product.';
      } else if (err.status === 403) {
        this.error = 'Your account does not have permission to delete products.';
      } else if (err.status === 404) {
        this.error = 'Product not found. It may already have been deleted.';
      } else {
        this.error = `Delete failed (HTTP ${err.status}). Check the backend logs.`;
      }

      console.error('DELETE product failed:', err);
    }
  });
}

}
