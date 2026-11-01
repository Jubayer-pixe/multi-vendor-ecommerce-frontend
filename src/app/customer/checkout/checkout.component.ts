import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartItem } from '../../shared/models/cart-item';
import { CartService } from '../../shared/services/cart.service';
import { CheckoutService } from './checkout.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  cartItems: CartItem[] = [];
  customerName = '';
  phone = '';
  address = '';
  city = '';
  postalCode = '';
  customerNote = '';
  paymentMethod = 'COD';
  message = '';
  submitting = false;
  deliveryCharge = 100;

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private checkoutService: CheckoutService
  ) {
    this.cartItems = this.cartService.getCartItems();
  }

  getSubtotal(): number {
    return this.cartService.getCartTotal();
  }

  getGrandTotal(): number {
    return this.getSubtotal() + this.deliveryCharge;
  }

  placeOrder(): void {
    this.message = '';
    if (this.submitting) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    if (!this.customerName.trim() || !this.phone.trim() || !this.address.trim() ||
        !this.city.trim() || !this.postalCode.trim() || this.cartItems.length === 0) {
      this.message = this.cartItems.length === 0
        ? 'Your cart is empty.'
        : 'Please fill in all required delivery fields.';
      return;
    }

    if (this.paymentMethod !== 'COD') {
      this.message = 'Only Cash on Delivery is currently available.';
      return;
    }

    this.submitting = true;
    this.checkoutService.placeOrder({
      customerName: this.customerName.trim(),
      phone: this.phone.trim(),
      address: this.address.trim(),
      city: this.city.trim(),
      postalCode: this.postalCode.trim(),
      paymentMethod: this.paymentMethod,
      customerNote: this.customerNote.trim(),
      items: this.cartItems.map(item => ({ productId: item.id, quantity: item.quantity }))
    }).subscribe({
      next: order => {
        this.cartService.clearCart();
        this.submitting = false;
        this.router.navigate(['/order-success'], { state: { order } });
      },
      error: (error: HttpErrorResponse) => {
        this.submitting = false;
        this.message = this.getErrorMessage(error);
      }
    });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const body = error.error;
    if (typeof body === 'string' && body.trim()) return body;
    return body?.message || body?.reason || body?.detail || body?.error || error.message ||
      'Could not place your order. Please try again.';
  }
}
