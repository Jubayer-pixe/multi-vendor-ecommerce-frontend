import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: CartItem[] = [];

  private cartItemsSubject =
    new BehaviorSubject<CartItem[]>([]);

  cartItems$ =
    this.cartItemsSubject.asObservable();

  private cartCountSubject =
    new BehaviorSubject<number>(0);

  cartCount$ =
    this.cartCountSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {

    const savedCart =
      localStorage.getItem('cartItems');

    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
    } else {
      this.cartItems = [];
    }

    this.cartItemsSubject.next(this.cartItems);

    this.cartCountSubject.next(
      this.getCartCount()
    );
  }

  private saveCart(): void {

    localStorage.setItem(
      'cartItems',
      JSON.stringify(this.cartItems)
    );

    this.cartItemsSubject.next(
      this.cartItems
    );

    this.cartCountSubject.next(
      this.getCartCount()
    );
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  addToCart(item: CartItem): void {

    const existingItem =
      this.cartItems.find(
        cartItem => cartItem.id === item.id
      );

    if (existingItem) {

      existingItem.quantity += item.quantity;

    } else {

      this.cartItems.push(item);

    }

    this.saveCart();
  }

  increaseQuantity(id: number): void {

    const item =
      this.cartItems.find(
        cartItem => cartItem.id === id
      );

    if (item) {

      item.quantity++;

      this.saveCart();

    }
  }

  decreaseQuantity(id: number): void {

    const item =
      this.cartItems.find(
        cartItem => cartItem.id === id
      );

    if (!item) return;

    if (item.quantity > 1) {

      item.quantity--;

      this.saveCart();

    } else {

      this.removeFromCart(id);

    }
  }

  removeFromCart(id: number): void {

    this.cartItems =
      this.cartItems.filter(
        item => item.id !== id
      );

    this.saveCart();
  }

  clearCart(): void {

    this.cartItems = [];

    this.saveCart();
  }

  getCartTotal(): number {

    return this.cartItems.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );
  }

  getCartCount(): number {

    return this.cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }
}