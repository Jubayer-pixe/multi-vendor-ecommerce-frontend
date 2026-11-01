import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface OrderItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  deliveryCharge: number;
  items: OrderItem[];
}

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent {

  orderId!: number;

  order: Order = {
    id: 1,
    orderNumber: 'ORD-1001',
    orderDate: '2026-09-11',

    customerName: 'Jubayer Ahmed',
    phone: '017XXXXXXXX',

    address: 'House 10, Road 5',
    city: 'Dhaka',
    postalCode: '1200',

    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',

    orderStatus: 'Processing',

    deliveryCharge: 100,

    items: [
      {
        id: 1,
        name: 'Wireless Headphone',
        image: 'assets/images/headphone.jpg',
        price: 2500,
        quantity: 1
      },
      {
        id: 2,
        name: 'Smart Watch',
        image: 'assets/images/watch.jpg',
        price: 3500,
        quantity: 1
      }
    ]
  };


  constructor(
    private route: ActivatedRoute
  ) {

    this.route.params.subscribe(params => {

      this.orderId = Number(params['id']);

    });

  }


  getSubtotal(): number {

    return this.order.items.reduce(
      (total, item) =>
        total + (item.price * item.quantity),
      0
    );

  }


  getGrandTotal(): number {

    return this.getSubtotal() + this.order.deliveryCharge;

  }


  getStatusClass(status: string): string {

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

}