import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminDashboardResponse } from './dashboard.model';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  dashboard: AdminDashboardResponse | null = null;
  loading = false;
  errorMessage = '';

  constructor(private dashboardService: DashboardService) {}

  get metricCards(): Array<{ key: string; label: string; icon: string; tone: string; value: number }> {
    const metrics = this.dashboard?.metrics ?? {};
    const cards = [
      ['totalUsers', 'Total users', 'bi-people-fill', 'primary'],
      ['totalVendors', 'Total vendors', 'bi-shop', 'success'],
      ['pendingVendorApprovals', 'Unverified vendors', 'bi-patch-exclamation-fill', 'warning'],
      ['totalOrders', 'Total orders', 'bi-bag-check-fill', 'info'],
      ['pendingOrders', 'Pending orders', 'bi-hourglass-split', 'warning'],
      ['deliveredOrders', 'Delivered orders', 'bi-truck', 'success'],
      ['cancelledOrders', 'Cancelled orders', 'bi-bag-x-fill', 'danger'],
      ['totalLegacyProducts', 'Legacy products', 'bi-box-seam-fill', 'primary'],
      ['totalCatalogProducts', 'Catalog products', 'bi-boxes', 'info'],
      ['activeCatalogProducts', 'Active catalog products', 'bi-check-circle-fill', 'success'],
      ['inactiveCatalogProducts', 'Inactive catalog products', 'bi-pause-circle-fill', 'secondary'],
      ['enabledUsers', 'Enabled users', 'bi-person-check-fill', 'success'],
      ['disabledUsers', 'Disabled users', 'bi-person-x-fill', 'secondary'],
    ] as const;

    return cards
      .filter(([key]) => metrics[key] !== undefined)
      .map(([key, label, icon, tone]) => ({ key, label, icon, tone, value: metrics[key] }));
  }

  get categoryChart(): Array<{ label: string; value: number }> {
    return this.dashboard?.charts['productsByCategory'] ?? [];
  }

  categoryBarWidth(value: number): number {
    const max = Math.max(...this.categoryChart.map((item) => item.value), 1);
    return Math.max(6, Math.round((value / max) * 100));
  }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';
    this.dashboardService.getAdminDashboard().subscribe({
      next: (dashboard) => {
        this.dashboard = dashboard;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.status === 401 || error.status === 403
          ? 'Administrator access is required to load this dashboard.'
          : 'Unable to load dashboard data. Please try again.';
      },
    });
  }
}
