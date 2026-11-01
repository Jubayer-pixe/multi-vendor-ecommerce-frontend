import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.config';
import { AdminOrder, AdminOrderItem, AdminVendorOrder } from './admin-order.model';

@Injectable({ providedIn: 'root' })
export class AdminOrderService {
  private readonly ordersUrl = `${API_BASE_URL}/orders`;
  constructor(private http: HttpClient) {}
  list(): Observable<AdminOrder[]> { return this.http.get<AdminOrder[]>(this.ordersUrl); }
  item(id: number): Observable<AdminOrderItem> { return this.http.get<AdminOrderItem>(`${API_BASE_URL}/order-items/${id}`); }
  vendorOrders(): Observable<AdminVendorOrder[]> { return this.http.get<AdminVendorOrder[]>(`${API_BASE_URL}/vendor-orders`); }
}
