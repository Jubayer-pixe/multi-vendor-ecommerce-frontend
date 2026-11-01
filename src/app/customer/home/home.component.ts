import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Category } from '../../shared/models/category.model';
import { Product } from '../../shared/models/product.model';

import { CategoryService } from '../../shared/services/category.service';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { CartItem } from '../../shared/models/cart-item';
import { WishlistService } from '../../shared/services/wishlist.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  categories: Category[] = [];

  trendingProducts: Product[] = [];

  featuredProducts: Product[] = [];
  loading = true;
  errorMessage = '';
  categoryError = '';
  private catalogProducts: Product[] = [];

constructor(
  private categoryService: CategoryService,
  private productService: ProductService,
  private cartService: CartService,
  private wishlistService: WishlistService
) {}

  ngOnInit(): void {

    this.loadCategories();

    this.loadProducts();

  }

  loadCategories(): void {

    this.categoryService.getCategories().subscribe({
      next: categories => this.categories = categories.map(category => ({
        ...category,
        productCount: this.catalogProducts.filter(product => product.categoryId === category.id).length
      })),
      error: () => this.categoryError = 'Categories could not be loaded.'
    });

  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.productService.getProductsFromBackend().subscribe({
      next: products => {
        products = products.map(product => ({ ...product, image: this.productService.toDisplayImage(product) }));
        this.trendingProducts = products.filter(product => product.active !== false);
        this.catalogProducts = this.trendingProducts;
        this.categories = this.categories.map(category => ({
          ...category,
          productCount: this.catalogProducts.filter(product => product.categoryId === category.id).length
        }));
        this.featuredProducts = [];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'We could not load the vendor catalog. Please try again.';
        this.loading = false;
      }
    });

  }

addToCart(product: Product): void {

  const cartItem: CartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: 1
  };

  this.cartService.addToCart(cartItem);

  alert(`${product.name} added to cart!`);
}

  addToWishlist(product: Product): void {
    this.wishlistService.addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
      category: product.category,
      rating: product.rating
    });
  }

}
