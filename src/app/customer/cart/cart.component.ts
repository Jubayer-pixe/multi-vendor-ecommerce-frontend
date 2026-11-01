import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CartService } from '../../shared/services/cart.service';
import { CartItem } from '../../shared/models/cart-item';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  cartItems: CartItem[] = [];

  deliveryCharge: number = 100;

  constructor(
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  // Increase quantity
  increaseQuantity(id: number): void {
    this.cartService.increaseQuantity(id);
  }

  // Decrease quantity
  decreaseQuantity(id: number): void {
    this.cartService.decreaseQuantity(id);
  }

  // Remove item
  removeItem(id: number): void {
    this.cartService.removeFromCart(id);
  }

  // Clear entire cart
  clearCart(): void {
    this.cartService.clearCart();
  }

  // Calculate subtotal
  getSubtotal(): number {
    return this.cartService.getCartTotal();
  }

  // Calculate grand total
  getGrandTotal(): number {
    return this.getSubtotal() + this.deliveryCharge;
  }
}