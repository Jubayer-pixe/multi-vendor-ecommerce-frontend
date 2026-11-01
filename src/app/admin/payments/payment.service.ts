import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.config';
import { PaymentDto } from './payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly paymentsUrl = `${API_BASE_URL}/payments`;

  constructor(private http: HttpClient) {}

  getPayments(): Observable<PaymentDto[]> {
    return this.http.get<PaymentDto[]>(this.paymentsUrl);
  }
}
