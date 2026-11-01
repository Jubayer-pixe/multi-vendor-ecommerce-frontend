import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class SuperAdminDashboardComponent {
  readonly stats = [
    { label: 'Total admins', value: '12', icon: 'bi-person-gear', tone: 'blue' },
    { label: 'Active vendors', value: '248', icon: 'bi-shop', tone: 'green' },
    { label: 'Pending approvals', value: '8', icon: 'bi-hourglass-split', tone: 'amber' },
    { label: 'Platform orders', value: '1,426', icon: 'bi-bag-check', tone: 'purple' }
  ];

  readonly activities = [
    { text: 'Tech Bazaar submitted vendor verification documents.', time: '10 minutes ago', icon: 'bi-file-earmark-check' },
    { text: 'An admin account was granted order-management access.', time: '1 hour ago', icon: 'bi-person-check' },
    { text: 'Weekly platform report is ready to review.', time: 'Today, 9:00 AM', icon: 'bi-bar-chart-line' }
  ];
}
