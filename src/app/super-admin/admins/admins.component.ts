import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AdminAccount {
  name: string;
  email: string;
  access: string;
  status: 'Active' | 'Suspended';
}

@Component({
  selector: 'app-super-admin-admins',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admins.component.html',
  styleUrl: './admins.component.scss'
})
export class SuperAdminAdminsComponent {
  admins: AdminAccount[] = [
    { name: 'Sadia Rahman', email: 'sadia@marketplace.com', access: 'Orders & customers', status: 'Active' },
    { name: 'Rakib Hasan', email: 'rakib@marketplace.com', access: 'Catalog & vendors', status: 'Active' },
    { name: 'Nusrat Jahan', email: 'nusrat@marketplace.com', access: 'Finance & reports', status: 'Suspended' }
  ];

  toggleStatus(admin: AdminAccount): void {
    admin.status = admin.status === 'Active' ? 'Suspended' : 'Active';
  }

  inviteAdmin(): void {
    alert('Admin invitation flow will be connected to the backend next.');
  }
}
