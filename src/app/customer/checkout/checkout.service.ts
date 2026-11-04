import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.config';

export interface CheckoutRequest {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  customerNote: string;
  items: Array<{ productId: number; quantity: number }>;
}

export interface CheckoutResponse {
  id: number;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  createdAt: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
}

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly attemptStorageKey = 'mve.checkout.idempotency.v1';

  constructor(private http: HttpClient) {}

  placeOrder(request: CheckoutRequest): Observable<CheckoutResponse> {
    const key = this.keyForAttempt();
    return this.http.post<CheckoutResponse>(`${API_BASE_URL}/orders/checkout`, request, {
      headers: { 'Idempotency-Key': key },
    }).pipe(tap(() => this.clearCompletedAttempt(key)));
  }

  abandonAttempt(): void {
    sessionStorage.removeItem(this.attemptStorageKey);
  }

  private keyForAttempt(): string {
    const saved = sessionStorage.getItem(this.attemptStorageKey);
    if (saved && /^[0-9a-f-]{36}$/i.test(saved)) return saved;

    const key = this.newKey();
    sessionStorage.setItem(this.attemptStorageKey, key);
    return key;
  }

  private clearCompletedAttempt(key: string): void {
    if (sessionStorage.getItem(this.attemptStorageKey) === key) this.abandonAttempt();
  }

  private newKey(): string {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map(value => value.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
}
