import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface DeliveryOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  amount: number;
  paymentStatus: string;
  status: string;
  orderDate: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  constructor(
    private router: Router
  ) { }

  selectedStatus: string = 'ALL';
  searchText: string = '';

  orders: DeliveryOrder[] = [

    {
      id: 'ORD-1001',
      customerName: 'Jubayer Ahmed',
      customerPhone: '01712345678',
      pickupAddress: 'Dhanmondi, Dhaka',
      deliveryAddress: 'Mirpur 10, Dhaka',
      amount: 2500,
      paymentStatus: 'PAID',
      status: 'ASSIGNED',
      orderDate: '15 Sep 2026'
    },

    {
      id: 'ORD-1002',
      customerName: 'Rahim Uddin',
      customerPhone: '01812345678',
      pickupAddress: 'Banani, Dhaka',
      deliveryAddress: 'Uttara Sector 7, Dhaka',
      amount: 1850,
      paymentStatus: 'COD',
      status: 'PICKED_UP',
      orderDate: '15 Sep 2026'
    },

    {
      id: 'ORD-1003',
      customerName: 'Nusrat Jahan',
      customerPhone: '01912345678',
      pickupAddress: 'Gulshan 1, Dhaka',
      deliveryAddress: 'Bashundhara R/A, Dhaka',
      amount: 3200,
      paymentStatus: 'PAID',
      status: 'IN_TRANSIT',
      orderDate: '14 Sep 2026'
    },

    {
      id: 'ORD-1004',
      customerName: 'Sakib Hasan',
      customerPhone: '01612345678',
      pickupAddress: 'Mohammadpur, Dhaka',
      deliveryAddress: 'Farmgate, Dhaka',
      amount: 1450,
      paymentStatus: 'COD',
      status: 'OUT_FOR_DELIVERY',
      orderDate: '14 Sep 2026'
    },

    {
      id: 'ORD-1005',
      customerName: 'Mim Akter',
      customerPhone: '01512345678',
      pickupAddress: 'Wari, Dhaka',
      deliveryAddress: 'Motijheel, Dhaka',
      amount: 2200,
      paymentStatus: 'PAID',
      status: 'DELIVERED',
      orderDate: '13 Sep 2026'
    }

  ];


  // ============================
  // FILTER ORDERS
  // ============================

  get filteredOrders(): DeliveryOrder[] {

    return this.orders.filter(order => {

      const matchesStatus =
        this.selectedStatus === 'ALL' ||
        order.status === this.selectedStatus;

      const search =
        this.searchText.toLowerCase().trim();

      const matchesSearch =
        order.id.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search) ||
        order.customerPhone.includes(search);

      return matchesStatus && matchesSearch;
    });

  }


  // ============================
  // STATUS COUNTS
  // ============================

  get totalOrders(): number {
    return this.orders.length;
  }


  get assignedOrders(): number {

    return this.orders.filter(
      order => order.status === 'ASSIGNED'
    ).length;

  }


  get inProgressOrders(): number {

    return this.orders.filter(
      order =>
        order.status === 'PICKED_UP' ||
        order.status === 'IN_TRANSIT' ||
        order.status === 'OUT_FOR_DELIVERY'
    ).length;

  }


  get deliveredOrders(): number {

    return this.orders.filter(
      order => order.status === 'DELIVERED'
    ).length;

  }


  // ============================
  // STATUS CLASS
  // ============================

  getStatusClass(status: string): string {

    switch (status) {

      case 'ASSIGNED':
        return 'status-assigned';

      case 'PICKED_UP':
        return 'status-picked';

      case 'IN_TRANSIT':
        return 'status-transit';

      case 'OUT_FOR_DELIVERY':
        return 'status-out';

      case 'DELIVERED':
        return 'status-delivered';

      default:
        return '';
    }

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
  // UPDATE STATUS
  // ============================

  updateStatus(
    order: DeliveryOrder,
    newStatus: string
  ): void {

    order.status = newStatus;

    alert(
      `${order.id} status updated to ${this.getStatusText(newStatus)}`
    );

  }


  // ============================
  // ACCEPT ORDER
  // ============================

  acceptOrder(order: DeliveryOrder): void {

    order.status = 'ASSIGNED';

    alert(
      `${order.id} has been accepted successfully.`
    );

  }


  // ============================
  // CALL CUSTOMER
  // ============================

  callCustomer(phone: string): void {

    window.location.href = `tel:${phone}`;

  }


  // ============================
  // VIEW ORDER
  // ============================

  viewOrder(order: DeliveryOrder): void {

    this.router.navigate([
      '/delivery/orders',
      order.id
    ]);

  }

}