import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DeliveryDashboardApiService } from '../../shared/services/delivery-dashboard-api.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  currentDate = new Date();

  totalOrders = 0;
  pendingOrders = 0;
  pickedUpOrders = 0;
  deliveredOrders = 0;

  todayTotalDeliveries = 0;
  todayCompletedDeliveries = 0;
  todayRemainingDeliveries = 0;
  progressPercentage = 0;

  loading = true;
  errorMessage = '';

  constructor(
    private dashboardService: DeliveryDashboardApiService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.totalOrders = data.totalOrders;
        this.pendingOrders = data.pendingOrders;
        this.pickedUpOrders = data.pickedUpOrders;
        this.deliveredOrders = data.deliveredOrders;

        this.todayTotalDeliveries =
          data.todayTotalDeliveries;

        this.todayCompletedDeliveries =
          data.todayCompletedDeliveries;

        this.todayRemainingDeliveries =
          data.todayRemainingDeliveries;

        this.progressPercentage =
          data.progressPercentage;

        this.loading = false;
      },
      error: (error) => {
        console.error('Delivery dashboard error:', error);
        this.errorMessage =
          'Dashboard data load failed. Please try again.';
        this.loading = false;
      }
    });
  }
}