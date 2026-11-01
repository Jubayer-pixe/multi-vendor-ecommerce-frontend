import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminDashboardResponse } from '../dashboard/dashboard.model';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  report: AdminDashboardResponse | null = null;
  loading = false;
  errorMessage = '';
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading = true;
    this.errorMessage = '';
    this.dashboardService.getAdminDashboard().subscribe({
      next: (report) => { this.report = report; this.loading = false; },
      error: (error) => { this.loading = false; this.errorMessage = error.status === 401 || error.status === 403 ? 'Administrator access is required to view reports.' : 'Unable to load platform report data.'; },
    });
  }
}
