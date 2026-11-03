import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.config';
import {
  AdminVendor,
  AdminVendorOrder,
  AdminVendorProduct,
  VendorRequest,
  VendorUserOption,
} from './admin-vendor.model';

@Injectable({ providedIn: 'root' })
export class AdminVendorService {
  private readonly vendorsUrl = `${API_BASE_URL}/vendors`;

  constructor(private http: HttpClient) {}

  list(): Observable<AdminVendor[]> {
    return this.http.get<AdminVendor[]>(this.vendorsUrl);
  }
  // vendorUsers(): Observable<VendorUserOption[]> {
  //   return this.http.get<VendorUserOption[]>(
  //     `${API_BASE_URL}/admin/roles/VENDOR/users`,
  //   );
  // }
  vendorUsers(): Observable<VendorUserOption[]> {
  return this.http.get<VendorUserOption[]>(`${API_BASE_URL}/users`);
}
  products(): Observable<AdminVendorProduct[]> {
    return this.http.get<AdminVendorProduct[]>(
      `${API_BASE_URL}/catalog/products`,
    );
  }
  vendorOrders(): Observable<AdminVendorOrder[]> {
    return this.http.get<AdminVendorOrder[]>(`${API_BASE_URL}/vendor-orders`);
  }
  create(request: VendorRequest): Observable<AdminVendor> {
    return this.http.post<AdminVendor>(this.vendorsUrl, request);
  }
update(vendor: AdminVendor | VendorRequest): Observable<AdminVendor> {
  return this.http.put<AdminVendor>(
    `${this.vendorsUrl}/${vendor.id}`,
    vendor,
  );
}

delete(id: number): Observable<void> {
  return this.http.delete<void>(`${this.vendorsUrl}/${id}`);
}
}
