import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  stats = [
    {
      title: 'Total Products',
      value: 128,
      icon: 'bi-box-seam',
      color: 'purple',
      change: '+12%'
    },
    {
      title: 'Total Orders',
      value: 356,
      icon: 'bi-cart-check',
      color: 'blue',
      change: '+18%'
    },
    {
      title: 'Pending Orders',
      value: 24,
      icon: 'bi-hourglass-split',
      color: 'orange',
      change: '+5%'
    },
    {
      title: 'Available Balance',
      value: '৳ 85,450',
      icon: 'bi-wallet2',
      color: 'green',
      change: '+22%'
    }
  ];


  recentOrders = [
    {
      id: 'ORD-1001',
      customer: 'Rahim Ahmed',
      product: 'Wireless Headphone',
      amount: 2500,
      status: 'Delivered'
    },
    {
      id: 'ORD-1002',
      customer: 'Karim Hasan',
      product: 'Smart Watch',
      amount: 4500,
      status: 'Processing'
    },
    {
      id: 'ORD-1003',
      customer: 'Nusrat Jahan',
      product: 'Bluetooth Speaker',
      amount: 3200,
      status: 'Pending'
    },
    {
      id: 'ORD-1004',
      customer: 'Sakib Khan',
      product: 'Gaming Mouse',
      amount: 1800,
      status: 'Shipped'
    }
  ];


  topProducts = [
    {
      name: 'Wireless Headphone',
      category: 'Electronics',
      sales: 85,
      revenue: 212500
    },
    {
      name: 'Smart Watch',
      category: 'Wearable',
      sales: 64,
      revenue: 288000
    },
    {
      name: 'Bluetooth Speaker',
      category: 'Electronics',
      sales: 52,
      revenue: 166400
    }
  ];


  lowStockProducts = [
    {
      name: 'Gaming Mouse',
      stock: 4
    },
    {
      name: 'USB Keyboard',
      stock: 7
    },
    {
      name: 'Power Bank',
      stock: 3
    }
  ];

}