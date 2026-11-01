
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { Product } from '../../../shared/models/product.model';
import { ProductApiService } from '../../../shared/services/product-api.service';


@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  loading = true;
  error = '';
  quantity = 1;
  galleryImages: { id: number; url: string }[] = [];
  selectedImageIndex = 0;
  private imageObjectUrls: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productApi: ProductApiService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const id = Number(params.get('id'));

          if (!Number.isInteger(id) || id <= 0) {
            throw new Error('Invalid product ID.');
          }

          return this.productApi.getVendorProduct(id);
        })
      )
      .subscribe({
        next: product => {
          this.product = product;
          this.loading = false;
          this.error = '';
          (product.imagePaths ?? []).forEach((imagePath, index) => {
            const imageId = product.imageIds?.[index] ?? index;
            this.productApi.getVendorProductImageByPath(imagePath).subscribe({
              next: image => {
                const objectUrl = URL.createObjectURL(image);
                this.imageObjectUrls.push(objectUrl);
                this.galleryImages = [...this.galleryImages.filter(item => item.id !== imageId), { id: imageId, url: objectUrl }]
                  .sort((first, second) => (product.imageIds ?? []).indexOf(first.id) - (product.imageIds ?? []).indexOf(second.id));
                if (index === 0 && this.product?.id === product.id) this.product.imageUrl = objectUrl;
              }
            });
          });
        },
        error: err => {
          this.loading = false;
          this.product = null;
          this.error =
            err.status === 0
              ? 'Backend server-এর সঙ্গে সংযোগ করা যাচ্ছে না।'
              : err.status === 404
                ? 'এই product-টি পাওয়া যায়নি।'
                : err.status === 401 || err.status === 403
                  ? 'এই product দেখতে login বা permission প্রয়োজন।'
                  : 'Product load করা যায়নি। আবার চেষ্টা করো।';

          console.error('Product details loading failed:', err);
        }
      });
  }

  ngOnDestroy(): void {
    this.imageObjectUrls.forEach(url => URL.revokeObjectURL(url));
  }

  selectImage(index: number): void {
    if (this.galleryImages[index]) this.selectedImageIndex = index;
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product || this.product.stock < 1) {
      return;
    }

    // Cart service-এর সঙ্গে connect করার জন্য এখানে integration প্রয়োজন।
    this.router.navigate(['/customer/cart'], {
      queryParams: {
        productId: this.product.id,
        quantity: this.quantity
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/customer/products']);
  }
}
