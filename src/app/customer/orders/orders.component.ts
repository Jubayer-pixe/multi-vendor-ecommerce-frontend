import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  orders: Order[] = [

    {
      id: 1,
      orderNumber: 'ORD-1001',
      orderDate: '2026-09-11',
      totalAmount: 3600,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Pending'
    },

    {
      id: 2,
      orderNumber: 'ORD-1002',
      orderDate: '2026-09-08',
      totalAmount: 5200,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      orderStatus: 'Processing'
    },

    {
      id: 3,
      orderNumber: 'ORD-1003',
      orderDate: '2026-09-02',
      totalAmount: 2800,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered'
    }

  ];


  getOrderStatusClass(status: string): string {

    switch (status) {

      case 'Pending':
        return 'bg-warning text-dark';

      case 'Processing':
        return 'bg-info text-dark';

      case 'Shipped':
        return 'bg-primary';

      case 'Delivered':
        return 'bg-success';

      case 'Cancelled':
        return 'bg-danger';

      default:
        return 'bg-secondary';

    }

  }


  getPaymentStatusClass(status: string): string {

    if (status === 'Paid') {
      return 'bg-success';
    }

    if (status === 'Pending') {
      return 'bg-warning text-dark';
    }

    if (status === 'Failed') {
      return 'bg-danger';
    }

    return 'bg-secondary';

  }

}