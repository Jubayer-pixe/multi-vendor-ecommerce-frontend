import { Injectable } from '@angular/core';
import { WishlistItem } from '../models/wishlist-item';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private wishlistItems: WishlistItem[] = [];

  constructor() {
    this.loadWishlist();
  }

  private loadWishlist(): void {

    const savedWishlist =
      localStorage.getItem('wishlistItems');

    if (savedWishlist) {

      this.wishlistItems =
        JSON.parse(savedWishlist);

    }

  }

  private saveWishlist(): void {

    localStorage.setItem(
      'wishlistItems',
      JSON.stringify(this.wishlistItems)
    );

  }

  getWishlistItems(): WishlistItem[] {
    return this.wishlistItems;
  }

  getWishlistCount(): number {
    return this.wishlistItems.length;
  }

  addToWishlist(item: WishlistItem): void {

    const exists =
      this.wishlistItems.some(
        wishlistItem =>
          wishlistItem.id === item.id
      );

    if (!exists) {

      this.wishlistItems.push(item);

      this.saveWishlist();

    }

  }

  removeFromWishlist(id: number): void {

    this.wishlistItems =
      this.wishlistItems.filter(
        item => item.id !== id
      );

    this.saveWishlist();

  }

  isInWishlist(id: number): boolean {

    return this.wishlistItems.some(
      item => item.id === id
    );

  }

  clearWishlist(): void {

    this.wishlistItems = [];

    this.saveWishlist();

  }

}