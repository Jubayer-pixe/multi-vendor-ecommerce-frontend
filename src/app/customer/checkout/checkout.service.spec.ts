import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../../core/config/api.config';
import { CheckoutRequest, CheckoutService } from './checkout.service';

describe('CheckoutService', () => {
  let service: CheckoutService;
  let http: HttpTestingController;
  const storageKey = 'mve.checkout.idempotency.v1';
  const request: CheckoutRequest = {
    customerName: 'Buyer', phone: '555-0100', address: '12 Main St', city: 'Dhaka',
    postalCode: '1200', paymentMethod: 'COD', customerNote: '', items: [{ productId: 7, quantity: 2 }],
  };

  beforeEach(() => {
    sessionStorage.removeItem(storageKey);
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(CheckoutService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    sessionStorage.removeItem(storageKey);
  });

  it('reuses the key after a failed request and clears it after success', () => {
    service.placeOrder(request).subscribe({ error: () => undefined });
    const first = http.expectOne(`${API_BASE_URL}/orders/checkout`);
    const key = first.request.headers.get('Idempotency-Key');
    expect(key).toMatch(/^[0-9a-f-]{36}$/i);
    first.flush({ message: 'temporary failure' }, { status: 503, statusText: 'Service Unavailable' });

    service.placeOrder(request).subscribe();
    const retry = http.expectOne(`${API_BASE_URL}/orders/checkout`);
    expect(retry.request.headers.get('Idempotency-Key')).toBe(key);
    retry.flush({ id: 14, orderNumber: 'ORD-14' });
    expect(sessionStorage.getItem(storageKey)).toBeNull();
  });

  it('keeps a key when request data changes and rotates only after explicit abandonment', () => {
    service.placeOrder(request).subscribe({ error: () => undefined });
    const first = http.expectOne(`${API_BASE_URL}/orders/checkout`);
    const firstKey = first.request.headers.get('Idempotency-Key');
    first.flush({ message: 'temporary failure' }, { status: 503, statusText: 'Service Unavailable' });

    service.placeOrder({ ...request, address: '13 Main St' }).subscribe({ error: () => undefined });
    const changed = http.expectOne(`${API_BASE_URL}/orders/checkout`);
    expect(changed.request.headers.get('Idempotency-Key')).toBe(firstKey);
    changed.flush({ detail: 'Idempotency-Key was already used with a different checkout request' },
      { status: 409, statusText: 'Conflict' });

    service.abandonAttempt();
    expect(sessionStorage.getItem(storageKey)).toBeNull();
    service.placeOrder({ ...request, address: '13 Main St' }).subscribe();
    const newAttempt = http.expectOne(`${API_BASE_URL}/orders/checkout`);
    expect(newAttempt.request.headers.get('Idempotency-Key')).not.toBe(firstKey);
    newAttempt.flush({ id: 15, orderNumber: 'ORD-15' });
  });
});
