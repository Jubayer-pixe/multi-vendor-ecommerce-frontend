import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CheckoutResponse } from '../checkout/checkout.service';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.scss'
})
export class OrderSuccessComponent {
  readonly order: CheckoutResponse | null;
  readonly orderDate: string;

  constructor(router: Router) {
    const state = router.getCurrentNavigation()?.extras.state ?? history.state;
    const order = state?.['order'] as CheckoutResponse | undefined;
    this.order = order?.id && order?.orderNumber ? order : null;
    this.orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleString() : '';
    if (!this.order) router.navigate(['/']);
  }
}
