
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DeliveryDashboard {
  totalOrders: number;
  pendingOrders: number;
  pickedUpOrders: number;
  deliveredOrders: number;
  todayTotalDeliveries: number;
  todayCompletedDeliveries: number;
  todayRemainingDeliveries: number;
  progressPercentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryDashboardApiService {

  private readonly apiUrl =
    'http://localhost:8080/api/delivery/dashboard';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DeliveryDashboard> {
    return this.http.get<DeliveryDashboard>(this.apiUrl);
  }
}
