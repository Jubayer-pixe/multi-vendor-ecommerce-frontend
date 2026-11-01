import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.config';

export interface AdminInventoryRecord {
  id: number;
  productId: number;
  variantId: number;
  availableQuantity: number;
  reservedQuantity: number;
  reorderLevel: number;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminInventoryService {
  constructor(private http: HttpClient) {}
  list(): Observable<AdminInventoryRecord[]> { return this.http.get<AdminInventoryRecord[]>(`${API_BASE_URL}/inventory`); }
}
