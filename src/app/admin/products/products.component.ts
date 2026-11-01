import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { API_BASE_URL } from '../../core/config/api.config';
import { BrandOptionDto, CatalogImageDto, CatalogProductDto, CategoryOptionDto } from '../../shared/models/product.model';
import { AdminCatalogProductRequest, AdminProductService, AdminProductVendorOption } from './admin-product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: CatalogProductDto[] = [];
  categories: CategoryOptionDto[] = [];
  brands: BrandOptionDto[] = [];
  vendors: AdminProductVendorOption[] = [];
  selectedImages: File[] = [];
  previews: string[] = [];
  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  searchTerm = '';
  activeFilter = '';
  page = 1;
  readonly pageSize = 10;
  editId: number | null = null;
  selectedProduct: CatalogProductDto | null = null;
  form: AdminCatalogProductRequest = this.emptyForm();

  constructor(private productService: AdminProductService) {}

  ngOnInit(): void { this.load(); }
  ngOnDestroy(): void { this.clearPreviews(); }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    this.productService.list().subscribe({
      next: (products) => { this.products = products; this.loading = false; },
      error: (error) => { this.loading = false; this.errorMessage = this.messageFor(error, 'Unable to load catalog products.'); },
    });
    this.productService.loadOptions().subscribe({
      next: (options) => { this.categories = options.categories; this.brands = options.brands; this.vendors = options.vendors; },
      error: (error) => { this.errorMessage = this.messageFor(error, 'Unable to load category, brand and vendor options.'); },
    });
  }

  get filteredProducts(): CatalogProductDto[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.products.filter((product) => {
      const text = [product.name, product.sku, product.slug, product.categoryName, product.brandName].some((item) => item?.toLowerCase().includes(query));
      return (!query || text) && (!this.activeFilter || String(product.active) === this.activeFilter);
    });
  }

  get visibleProducts(): CatalogProductDto[] { return this.filteredProducts.slice((this.page - 1) * this.pageSize, this.page * this.pageSize); }
  get pageCount(): number { return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize)); }
  setPage(page: number): void { this.page = Math.min(Math.max(page, 1), this.pageCount); }

  startCreate(): void { this.editId = null; this.form = this.emptyForm(); this.selectedProduct = null; this.setFiles([]); this.errorMessage = ''; }

  edit(product: CatalogProductDto): void {
    this.editId = product.id;
    this.selectedProduct = product;
    this.form = { name: product.name, slug: product.slug, description: product.description, sku: product.sku, basePrice: product.basePrice, salePrice: product.salePrice, stockQuantity: product.stockQuantity, active: product.active, categoryId: product.categoryId, categoryName: product.categoryName, subCategoryId: product.subCategoryId, brandId: product.brandId, brandName: product.brandName, vendorId: product.vendorId };
    this.setFiles([]);
    this.errorMessage = '';
  }

  onNameChange(): void { if (this.editId === null) this.form.slug = this.slugify(this.form.name); }
  onFilesChanged(event: Event): void { const input = event.target as HTMLInputElement; this.setFiles(Array.from(input.files ?? [])); }
  removeFile(index: number): void { const files = [...this.selectedImages]; files.splice(index, 1); this.setFiles(files); }

  imageUrl(product: CatalogProductDto): string | null {
    const path = product.images?.find((image) => image.primaryImage)?.url ?? product.images?.[0]?.url;
    return this.resolveImageUrl(path);
  }

  imageUrlFromPath(path: string | null): string | null {
    return this.resolveImageUrl(path);
  }

  private resolveImageUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    return /^https?:\/\//i.test(path) ? path : `${API_BASE_URL.replace(/\/api$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  save(): void {
    if (!this.form.name.trim() || !this.form.slug.trim() || !this.form.sku.trim() || this.form.basePrice <= 0 || this.form.stockQuantity < 0) {
      this.errorMessage = 'Provide a name, slug, SKU, positive base price and non-negative stock quantity.';
      return;
    }
    const request = { ...this.form, name: this.form.name.trim(), slug: this.form.slug.trim(), sku: this.form.sku.trim(), description: this.form.description?.trim() || null };
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';
    const operation = this.editId === null ? this.productService.create(request) : this.productService.update(this.editId, request);
    operation.subscribe({
      next: (saved) => {
        const wasCreate = this.editId === null;
        this.products = wasCreate ? [saved, ...this.products] : this.products.map((item) => item.id === saved.id ? saved : item);
        this.selectedProduct = saved;
        if (this.selectedImages.length) {
          this.productService.uploadImages(saved.id, this.selectedImages).subscribe({
            next: (images) => { saved.images = [...(saved.images ?? []), ...images]; saved.imageIds = saved.images.map((image) => image.id); this.products = this.products.map((item) => item.id === saved.id ? saved : item); this.selectedProduct = saved; this.saving = false; this.successMessage = wasCreate ? 'Product created and images uploaded.' : 'Product updated and images uploaded.'; this.setFiles([]); },
            error: (error) => { this.saving = false; this.successMessage = 'Product was saved, but image upload failed.'; this.errorMessage = this.messageFor(error, 'The product exists; retry its image upload from Edit product.'); },
          });
        } else {
          this.saving = false;
          this.successMessage = wasCreate ? 'Product created.' : 'Product updated.';
        }
      },
      error: (error) => { this.saving = false; this.errorMessage = this.messageFor(error, 'Unable to save the product.'); },
    });
  }

  toggleActive(product: CatalogProductDto): void {
    const request: AdminCatalogProductRequest = { id: product.id, name: product.name, slug: product.slug, description: product.description, sku: product.sku, basePrice: product.basePrice, salePrice: product.salePrice, stockQuantity: product.stockQuantity, active: !product.active, categoryId: product.categoryId, categoryName: product.categoryName, subCategoryId: product.subCategoryId, brandId: product.brandId, brandName: product.brandName, vendorId: product.vendorId };
    this.productService.update(product.id, request).subscribe({
      next: (updated) => { this.products = this.products.map((item) => item.id === updated.id ? updated : item); this.successMessage = `${updated.name} is now ${updated.active ? 'active' : 'inactive'}.`; },
      error: (error) => { this.errorMessage = this.messageFor(error, 'Unable to update product status.'); },
    });
  }

  private setFiles(files: File[]): void {
    this.clearPreviews();
    this.selectedImages = files;
    this.previews = files.map((file) => URL.createObjectURL(file));
  }
  private clearPreviews(): void { this.previews.forEach((url) => URL.revokeObjectURL(url)); this.previews = []; }
  private emptyForm(): AdminCatalogProductRequest { return { name: '', slug: '', description: null, sku: '', basePrice: 0, salePrice: null, stockQuantity: 0, active: true, categoryId: null, categoryName: null, subCategoryId: null, brandId: null, brandName: null, vendorId: null }; }
  private slugify(value: string): string { return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  private messageFor(error: any, fallback: string): string {
    if (error.status === 401 || error.status === 403) return 'Administrator access is required for this action.';
    return error.error?.message || error.error?.detail || fallback;
  }
}
