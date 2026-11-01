
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CartService } from '../../shared/services/cart.service';
import { WishlistService } from '../../shared/services/wishlist.service';
import { Product } from '../../shared/models/product.model';
import { ProductService } from '../../shared/services/product.service';

interface ProductDetails extends Product {
  description: string;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  productId!: number;
  quantity = 1;

  product: ProductDetails | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));

      if (!Number.isInteger(id) || id <= 0) {
        this.router.navigate(['/products']);
        return;
      }

      this.productId = id;
      this.quantity = 1;
      this.loadProduct(id);
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.errorMessage = '';
    this.product = null;

    this.productService.getProductByIdFromBackend(id).subscribe({
      next: (data) => {
        this.product = {
          ...data,
          image: this.productService.toDisplayImage(data),
          description:
            data.description ||
            `Discover ${data.name}, a quality ${data.category.toLowerCase()} product selected for the ShopNest marketplace.`
        };

        this.loading = false;
      },
      error: (error) => {
        console.error('Product details API error:', error);

        if (error.status === 404) {
          this.errorMessage = 'Product পাওয়া যায়নি।';
        } else if (error.status === 401 || error.status === 403) {
          this.errorMessage =
            'এই product দেখতে login অথবা প্রয়োজনীয় permission দরকার।';
        } else {
          this.errorMessage =
            'Product load করা যায়নি। Backend ও API পরীক্ষা করো।';
        }

        this.loading = false;
      }
    });
  }

  addToWishlist(): void {
    if (!this.product) return;

    this.wishlistService.addToWishlist({
      id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      oldPrice: this.product.oldPrice,
      image: this.product.image,
      category: this.product.category,
      rating: this.product.rating
    });

    alert('Product added to wishlist!');
  }

  increaseQuantity(): void {
    if (!this.product) return;

    if (this.product.stock != null &&
        this.quantity >= this.product.stock) {
      alert('Available stock-এর বেশি quantity নেওয়া যাবে না।');
      return;
    }

    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    if (this.product.active === false ||
        (this.product.stock != null && this.product.stock <= 0)) {
      alert('এই product বর্তমানে available নেই।');
      return;
    }

    this.cartService.addToCart({
      id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      image: this.product.image,
      quantity: this.quantity
    });

    alert('Product added to cart!');
  }

  buyNow(): void {
    this.addToCart();
  }
}
