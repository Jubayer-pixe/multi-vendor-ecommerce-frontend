
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../shared/models/product.model';
import { ProductService } from '../../shared/services/product.service';
import { RouterLink } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
import { WishlistService } from '../../shared/services/wishlist.service';
import { CartItem } from '../../shared/models/cart-item';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  selectedImageByProduct: Record<number, string> = {};

  categories: string[] = [];

  searchText = '';
  selectedCategory = 'All';
  sortBy = 'featured';

  loading = false;
  errorMessage = '';

  constructor(private productService: ProductService, private cartService: CartService, private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

 loadProducts(): void {
  this.loading = true;
  this.errorMessage = '';

  this.productService.getProductsFromBackend().subscribe({
    next: (data) => {
      this.products = data;
      this.products = data.map(product => ({ ...product, image: this.productService.toDisplayImage(product) }));
      this.categories = [...new Set(data.map(product => product.category).filter(Boolean))];
      this.applyFilters();
      this.loading = false;
    },
    error: (error) => {
      console.error('Failed to load products:', error);
      this.errorMessage =
        'Products load করা যায়নি। Backend server ও API পরীক্ষা করো।';
      this.loading = false;
    }
  });
}

  applyFilters(): void {
    const search = this.searchText.trim().toLowerCase();

    this.filteredProducts = this.products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        (product.category || '').toLowerCase().includes(search);

      const matchesCategory =
        this.selectedCategory === 'All' ||
        product.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });

    switch (this.sortBy) {
      case 'priceLow':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        this.filteredProducts.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;
    }
  }

  getDiscount(price: number, oldPrice: number): number {
    if (oldPrice <= 0 || oldPrice <= price) {
      return 0;
    }

    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }

  addToCart(product: Product): void {
    const item: CartItem = { id: product.id, name: product.name, price: product.price, image: this.productService.toDisplayImage(product), quantity: 1 };
    this.cartService.addToCart(item);
  }

  addToWishlist(product: Product): void {
    this.wishlistService.addToWishlist({ id: product.id, name: product.name, price: product.price, oldPrice: product.oldPrice, image: this.productService.toDisplayImage(product), category: product.category, rating: product.rating });
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.style.display = 'none';
  }

  resetFilters(): void {
    this.searchText = '';
    this.selectedCategory = 'All';
    this.sortBy = 'featured';
    this.applyFilters();
  }


  getProductImages(product: Product): string[] {
  const paths = (product.imagePaths ?? []).filter(
    (path): path is string => !!path,
  );

  if (paths.length) {
    return [...new Set(paths)];
  }

  return product.image ? [product.image] : [];
}

getSelectedProductImage(product: Product): string {
  return (
    this.selectedImageByProduct[product.id] ||
    this.productService.toDisplayImage(product)
  );
}

selectProductImage(product: Product, image: string): void {
  this.selectedImageByProduct[product.id] = image;
}
}
