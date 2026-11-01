import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../core/config/api.config';

import { PaymentsComponent } from './payments.component';

describe('PaymentsComponent', () => {
  let component: PaymentsComponent;
  let fixture: ComponentFixture<PaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads typed payment records from the admin API', () => {
    fixture.detectChanges();
    const req = TestBed.inject(HttpTestingController).expectOne(`${API_BASE_URL}/payments`);
    expect(req.request.method).toBe('GET');
    req.flush([{
      id: 4, orderId: 12, paymentMethod: 'CARD', paymentGateway: 'Example',
      amount: 42.5, status: 'PAID', transactionId: 'ref-4', paidAt: '2026-10-28T12:30:00',
    }]);
    expect(component.payments.length).toBe(1);
    expect(component.payments[0].amount).toBe(42.5);
    expect(component.loading).toBeFalse();
  });
});
