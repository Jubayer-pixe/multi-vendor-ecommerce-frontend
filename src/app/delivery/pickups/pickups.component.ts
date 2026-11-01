import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface PickupOrder {
  id: string;
  vendorName: string;
  vendorPhone: string;
  pickupAddress: string;
  customerName: string;
  deliveryAddress: string;
  amount: number;
  paymentStatus: string;
  pickupTime: string;
  status: string;
}

@Component({
  selector: 'app-pickups',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pickups.component.html',
  styleUrl: './pickups.component.scss'
})
export class PickupsComponent {

  pickups: PickupOrder[] = [
    {
      id: 'ORD-1001',
      vendorName: 'Tech World',
      vendorPhone: '01898765432',
      pickupAddress: 'Dhanmondi 27, Dhaka',
      customerName: 'Jubayer Ahmed',
      deliveryAddress: 'Mirpur 10, Dhaka',
      amount: 2500,
      paymentStatus: 'PAID',
      pickupTime: '10:30 AM',
      status: 'PENDING'
    },
    {
      id: 'ORD-1006',
      vendorName: 'Fashion House',
      vendorPhone: '01987654321',
      pickupAddress: 'Bashundhara City, Dhaka',
      customerName: 'Rahim Uddin',
      deliveryAddress: 'Uttara Sector 7, Dhaka',
      amount: 1850,
      paymentStatus: 'COD',
      pickupTime: '11:30 AM',
      status: 'PENDING'
    },
    {
      id: 'ORD-1007',
      vendorName: 'Smart Gadgets',
      vendorPhone: '01787654321',
      pickupAddress: 'Banani, Dhaka',
      customerName: 'Nusrat Jahan',
      deliveryAddress: 'Gulshan 2, Dhaka',
      amount: 3200,
      paymentStatus: 'PAID',
      pickupTime: '12:30 PM',
      status: 'PICKED_UP'
    }
  ];

  constructor(
    private router: Router
  ) {}

  get pendingPickups(): number {
    return this.pickups.filter(
      pickup => pickup.status === 'PENDING'
    ).length;
  }

  get completedPickups(): number {
    return this.pickups.filter(
      pickup => pickup.status === 'PICKED_UP'
    ).length;
  }

  getStatusText(status: string): string {
    return status === 'PENDING'
      ? 'Pending Pickup'
      : 'Picked Up';
  }

  getStatusClass(status: string): string {
    return status === 'PENDING'
      ? 'status-pending'
      : 'status-picked';
  }

  completePickup(pickup: PickupOrder): void {

    pickup.status = 'PICKED_UP';

    alert(
      `${pickup.id} pickup completed successfully!`
    );
  }

  callVendor(phone: string): void {
    window.location.href = `tel:${phone}`;
  }

  viewOrder(pickup: PickupOrder): void {
    this.router.navigate([
      '/delivery/orders',
      pickup.id
    ]);
  }
}