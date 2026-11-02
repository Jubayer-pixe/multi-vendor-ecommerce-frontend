
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { API_BASE_URL } from '../../core/config/api.config';

import {
  BrandOptionDto,
  CatalogProductDto,
  CategoryOptionDto,
} from '../../shared/models/product.model';

import {
  AdminCatalogProductRequest,
  AdminProductCreateRequest,
  AdminProductService,
  AdminProductVendorOption,
} from './admin-product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
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


  constructor(
    private productService: AdminProductService
  ) {}


  // ==========================================
  // INITIALIZATION
  // ==========================================

  ngOnInit(): void {
    this.load();
  }


  ngOnDestroy(): void {
    this.clearPreviews();
  }


  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  load(): void {

    this.loading = true;
    this.errorMessage = '';

    this.productService.list()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({

        next: (products) => {
          this.products = products;
        },

        error: (error) => {
          this.errorMessage = this.messageFor(
            error,
            'Unable to load catalog products.'
          );
        },

      });


    this.productService.loadOptions().subscribe({

      next: (options) => {
        this.categories = options.categories;
        this.brands = options.brands;
        this.vendors = options.vendors;
      },

      error: (error) => {
        this.errorMessage = this.messageFor(
          error,
          'Unable to load category, brand and vendor options.'
        );
      },

    });

  }


  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  get filteredProducts(): CatalogProductDto[] {

    const query = this.searchTerm.trim().toLowerCase();

    return this.products.filter((product) => {

      const text = [
        product.name,
        product.sku,
        product.slug,
        product.categoryName,
        product.brandName,
      ].some((item) =>
        item?.toLowerCase().includes(query)
      );

      return (
        (!query || text) &&
        (
          !this.activeFilter ||
          String(product.active) === this.activeFilter
        )
      );

    });

  }


  // ==========================================
  // PAGINATION
  // ==========================================

  get visibleProducts(): CatalogProductDto[] {

    return this.filteredProducts.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    );

  }


  get pageCount(): number {

    return Math.max(
      1,
      Math.ceil(this.filteredProducts.length / this.pageSize)
    );

  }


  setPage(page: number): void {

    this.page = Math.min(
      Math.max(page, 1),
      this.pageCount
    );

  }


  // ==========================================
  // START CREATE
  // ==========================================

  startCreate(): void {

    this.editId = null;

    this.form = this.emptyForm();

    this.selectedProduct = null;

    this.setFiles([]);

    this.errorMessage = '';
    this.successMessage = '';

  }


  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  edit(product: CatalogProductDto): void {

    this.editId = product.id;

    this.selectedProduct = product;

    this.form = {

      name: product.name,
      slug: product.slug,
      description: product.description,

      sku: product.sku,

      basePrice: product.basePrice,
      salePrice: product.salePrice,

      stockQuantity: product.stockQuantity,

      active: product.active,

      categoryId: product.categoryId,
      categoryName: product.categoryName,

      subCategoryId: product.subCategoryId,

      brandId: product.brandId,
      brandName: product.brandName,

    };

    this.setFiles([]);

    this.errorMessage = '';
    this.successMessage = '';

  }


  // ==========================================
  // NAME CHANGE AND SLUG
  // ==========================================

  onNameChange(): void {

    if (this.editId === null) {

      this.form.slug = this.slugify(this.form.name);

    }

  }


  // ==========================================
  // IMAGE SELECTION
  // ==========================================

  onFilesChanged(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.setFiles(
      Array.from(input.files ?? [])
    );

  }


  removeFile(index: number): void {

    const files = [...this.selectedImages];

    files.splice(index, 1);

    this.setFiles(files);

  }


  // ==========================================
  // IMAGE URL
  // ==========================================

  imageUrl(product: CatalogProductDto): string | null {

    const path =
      product.images?.find((image) => image.primaryImage)?.url ??
      product.images?.[0]?.url;

    return this.resolveImageUrl(path);

  }


  imageUrlFromPath(path: string | null): string | null {

    return this.resolveImageUrl(path);

  }


  private resolveImageUrl(
    path: string | null | undefined
  ): string | null {

    if (!path) {
      return null;
    }

    return /^https?:\/\//i.test(path)
      ? path
      : `${API_BASE_URL.replace(/\/api$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;

  }


  // ==========================================
  // SAVE PRODUCT
  // CREATE AND UPDATE
  // ==========================================

  save(): void {

    if (this.saving) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';


    // Required field validation
    if (
      !this.form.name?.trim() ||
      !this.form.slug?.trim() ||
      !this.form.sku?.trim()
    ) {

      this.errorMessage =
        'Product name, slug and SKU are required.';

      return;
    }


    // Convert prices
    const basePrice = Number(this.form.basePrice);

    const rawSalePrice = this.form.salePrice;

    const salePrice =
      rawSalePrice === null ||
      rawSalePrice === undefined ||
      Number(rawSalePrice) <= 0
        ? null
        : Number(rawSalePrice);


    // Base price validation
    if (
      !Number.isFinite(basePrice) ||
      basePrice < 0.01
    ) {

      this.errorMessage =
        'Base price must be greater than zero.';

      return;
    }


    // Sale price validation
    if (
      salePrice !== null &&
      (
        !Number.isFinite(salePrice) ||
        salePrice >= basePrice
      )
    ) {

      this.errorMessage =
        'Sale price must be lower than base price.';

      return;
    }


    // Stock validation
    const stockQuantity = Number(this.form.stockQuantity);

    if (
      !Number.isInteger(stockQuantity) ||
      stockQuantity < 0
    ) {

      this.errorMessage =
        'Stock quantity must be a non-negative whole number.';

      return;
    }


    // Build backend ProductCreateRequest
    const request: AdminProductCreateRequest = {

      name: this.form.name.trim(),

      slug: this.form.slug.trim(),

      description: this.form.description?.trim() || null,

      sku: this.form.sku.trim(),

      basePrice,

      salePrice,

      categoryId: this.form.categoryId ?? null,

      categoryName: this.form.categoryName ?? null,

      subCategoryId: this.form.subCategoryId ?? null,

      brandId: this.form.brandId ?? null,

      brandName: this.form.brandName ?? null,

      stockQuantity,

      active: Boolean(this.form.active),

    };


    // Store operation state before request
    const wasCreate = this.editId === null;

    const productId = this.editId;

    this.saving = true;


    // ========================================
    // CREATE PRODUCT WITH IMAGES
    // ========================================

    if (wasCreate) {

      this.productService
        .create(request, this.selectedImages)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe({

          next: (saved) => {

            this.products = [
              saved,
              ...this.products,
            ];

            this.selectedProduct = saved;

            this.editId = saved.id;

            this.successMessage =
              'Product created successfully.';

            this.setFiles([]);

          },

          error: (error) => {

            this.errorMessage = this.messageFor(
              error,
              'Unable to create product.'
            );

          },

        });

      return;

    }


    // ========================================
    // UPDATE EXISTING PRODUCT
    // ========================================

    if (productId === null) {

      this.saving = false;
      return;

    }


    this.productService
      .update(productId, {
        ...request,
        id: productId,
      })
      .subscribe({

        next: (saved) => {

          // No new images selected
          if (this.selectedImages.length === 0) {

            this.finishSave(
              saved,
              'Product updated successfully.'
            );

            return;

          }


          // Upload new images for existing product
          this.productService
            .uploadImages(saved.id, this.selectedImages)
            .pipe(
              finalize(() => {
                this.saving = false;
              })
            )
            .subscribe({

              next: (images) => {

                saved.images = [
                  ...(saved.images ?? []),
                  ...images,
                ];

                saved.imageIds = saved.images.map(
                  (image) => image.id
                );

                this.finishSave(
                  saved,
                  'Product updated and images uploaded successfully.'
                );

              },

              error: (error) => {

                this.saving = false;

                this.errorMessage = this.messageFor(
                  error,
                  'Product was updated, but image upload failed.'
                );

                this.successMessage =
                  'Product details saved. Image upload failed; retry from Edit product.';

              },

            });

        },

        error: (error) => {

          this.saving = false;

          this.errorMessage = this.messageFor(
            error,
            'Unable to update product.'
          );

        },

      });

  }


  // ==========================================
  // FINISH SAVE
  // ==========================================

  private finishSave(
    saved: CatalogProductDto,
    message: string
  ): void {

    this.products = this.products.map((item) =>
      item.id === saved.id ? saved : item
    );

    this.selectedProduct = saved;

    this.successMessage = message;

    this.errorMessage = '';

    this.setFiles([]);

    this.saving = false;

  }


  // ==========================================
  // TOGGLE ACTIVE STATUS
  // ==========================================

  toggleActive(product: CatalogProductDto): void {

    const request: AdminProductCreateRequest = {

      name: product.name,
      slug: product.slug,
      description: product.description,
      sku: product.sku,

      basePrice: Number(product.basePrice),
      salePrice: product.salePrice,

      stockQuantity: product.stockQuantity,

      active: !product.active,

      categoryId: product.categoryId,
      categoryName: product.categoryName,

      subCategoryId: product.subCategoryId,

      brandId: product.brandId,
      brandName: product.brandName,

    };


    this.productService
      .update(product.id, {
        ...request,
        id: product.id,
      })
      .subscribe({

        next: (updated) => {

          this.products = this.products.map((item) =>
            item.id === updated.id ? updated : item
          );

          this.successMessage =
            `${updated.name} is now ${updated.active ? 'active' : 'inactive'}.`;

          this.errorMessage = '';

        },

        error: (error) => {

          this.errorMessage = this.messageFor(
            error,
            'Unable to update product status.'
          );

        },

      });

  }


  // ==========================================
  // FILE PREVIEW MANAGEMENT
  // ==========================================

  private setFiles(files: File[]): void {

    this.clearPreviews();

    this.selectedImages = files;

    this.previews = files.map((file) =>
      URL.createObjectURL(file)
    );

  }


  private clearPreviews(): void {

    this.previews.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    this.previews = [];

  }


  // ==========================================
  // EMPTY FORM
  // ==========================================

  private emptyForm(): AdminCatalogProductRequest {

    return {

      name: '',
      slug: '',
      description: null,

      sku: '',

      basePrice: 0,
      salePrice: null,

      stockQuantity: 0,

      active: true,

      categoryId: null,
      categoryName: null,

      subCategoryId: null,

      brandId: null,
      brandName: null,

    };

  }


  // ==========================================
  // SLUG GENERATOR
  // ==========================================

  private slugify(value: string): string {

    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  }


  // ==========================================
  // ERROR MESSAGE
  // ==========================================

  private messageFor(
    error: any,
    fallback: string
  ): string {

    if (
      error.status === 401 ||
      error.status === 403
    ) {

      return 'Administrator access is required for this action.';

    }

    return (
      error.error?.message ||
      error.error?.detail ||
      fallback
    );

  }

}
