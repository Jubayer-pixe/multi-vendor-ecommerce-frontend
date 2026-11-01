import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

interface OrderProduct {
  name: string;
  image: string;
  quantity: number;
  price: number;
  total: number;
}

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent {

  orderId: string = '';

  order = {
    id: 'ORD-1001',
    orderDate: '15 September 2026',
    customerName: 'Jubayer Ahmed',
    customerPhone: '01712345678',
    customerEmail: 'jubayer@example.com',

    vendorName: 'Tech World',
    vendorPhone: '01898765432',

    pickupAddress: 'Dhanmondi, Dhaka',
    deliveryAddress: 'Mirpur 10, Dhaka',

    subtotal: 2400,
    deliveryCharge: 100,
    discount: 0,
    total: 2500,

    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'COD',

    status: 'ASSIGNED'
  };


  products: OrderProduct[] = [

    {
      name: 'Wireless Headphone',
      image: 'assets/images/headphone.jpg',
      quantity: 1,
      price: 2500,
      total: 2500
    }

  ];


  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.orderId =
      this.route.snapshot.paramMap.get('id') || '';

    console.log('Order ID:', this.orderId);

  }


  // ============================
  // STATUS TEXT
  // ============================

  getStatusText(status: string): string {

    switch (status) {

      case 'ASSIGNED':
        return 'Assigned';

      case 'PICKED_UP':
        return 'Picked Up';

      case 'IN_TRANSIT':
        return 'In Transit';

      case 'OUT_FOR_DELIVERY':
        return 'Out for Delivery';

      case 'DELIVERED':
        return 'Delivered';

      default:
        return status;
    }

  }


  // ============================
  // STATUS CLASS
  // ============================

  getStatusClass(status: string): string {

    switch (status) {

      case 'ASSIGNED':
        return 'assigned';

      case 'PICKED_UP':
        return 'picked';

      case 'IN_TRANSIT':
        return 'transit';

      case 'OUT_FOR_DELIVERY':
        return 'out';

      case 'DELIVERED':
        return 'delivered';

      default:
        return '';
    }

  }


  // ============================
  // UPDATE STATUS
  // ============================

  updateStatus(status: string): void {

    this.order.status = status;

    alert(
      `Order ${this.order.id} status updated to ${this.getStatusText(status)}`
    );

  }


  // ============================
  // CALL CUSTOMER
  // ============================

  callCustomer(): void {

    window.location.href =
      `tel:${this.order.customerPhone}`;

  }


  // ============================
  // BACK
  // ============================

  goBack(): void {

    this.router.navigate(['/delivery/orders']);

  }

}