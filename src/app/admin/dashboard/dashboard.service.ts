import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.config';
import { AdminDashboardResponse } from './dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly dashboardUrl = `${API_BASE_URL}/dashboard/admin`;

  constructor(private http: HttpClient) {}

  getAdminDashboard(): Observable<AdminDashboardResponse> {
    return this.http.get<AdminDashboardResponse>(this.dashboardUrl);
  }
}
