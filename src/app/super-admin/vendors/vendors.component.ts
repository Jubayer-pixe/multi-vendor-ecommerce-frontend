import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface VendorApplication {
  store: string;
  owner: string;
  category: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

@Component({
  selector: 'app-super-admin-vendors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendors.component.html',
  styleUrl: './vendors.component.scss'
})
export class SuperAdminVendorsComponent {
  vendors: VendorApplication[] = [
    { store: 'Tech Bazaar', owner: 'Mahin Islam', category: 'Electronics', submittedAt: 'Today, 10:20 AM', status: 'Pending' },
    { store: 'Aranya Crafts', owner: 'Maliha Noor', category: 'Home & living', submittedAt: 'Yesterday', status: 'Pending' },
    { store: 'Urban Sole', owner: 'Tahsin Kabir', category: 'Fashion', submittedAt: '18 Sep 2026', status: 'Approved' }
  ];

  updateStatus(vendor: VendorApplication, status: 'Approved' | 'Rejected'): void {
    vendor.status = status;
  }
}
