import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { WishlistService } from '../../shared/services/wishlist.service';
import { WishlistItem } from '../../shared/models/wishlist-item';

import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {

  wishlistItems: WishlistItem[] = [];


  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {

    this.loadWishlist();

  }


  loadWishlist(): void {

    this.wishlistItems =
      this.wishlistService.getWishlistItems();

  }


  removeFromWishlist(id: number): void {

    this.wishlistService.removeFromWishlist(id);

    this.loadWishlist();

  }


  addToCart(item: WishlistItem): void {

    this.cartService.addToCart({

      id: item.id,

      name: item.name,

      price: item.price,

      image: item.image,

      quantity: 1

    });

    alert('Product added to cart!');

  }


  clearWishlist(): void {

    this.wishlistService.clearWishlist();

    this.loadWishlist();

  }

}