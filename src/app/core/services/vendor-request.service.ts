import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import {
  VendorRegistrationDecision,
  VendorRegistrationPayload,
  VendorRegistrationRequest,
} from '../models/vendor-request.model';

@Injectable({
  providedIn: 'root',
})
export class VendorRequestService {
  constructor(private http: HttpClient) {}

  submit(
    request: VendorRegistrationPayload,
  ): Observable<VendorRegistrationRequest> {
    return this.http.post<VendorRegistrationRequest>(
      `${API_BASE_URL}/vendor-requests`,
      request,
    );
  }

  myRequest(): Observable<VendorRegistrationRequest> {
    return this.http.get<VendorRegistrationRequest>(
      `${API_BASE_URL}/vendor-requests/my-request`,
    );
  }

  adminList(): Observable<VendorRegistrationRequest[]> {
    return this.http.get<VendorRegistrationRequest[]>(
      `${API_BASE_URL}/admin/vendor-requests`,
    );
  }

  approve(id: number): Observable<VendorRegistrationRequest> {
    return this.http.put<VendorRegistrationRequest>(
      `${API_BASE_URL}/admin/vendor-requests/${id}/approve`,
      {},
    );
  }

  reject(
    id: number,
    reason: string,
  ): Observable<VendorRegistrationRequest> {
    return this.http.put<VendorRegistrationRequest>(
      `${API_BASE_URL}/admin/vendor-requests/${id}/reject`,
      { reason } as VendorRegistrationDecision,
    );
  }
}