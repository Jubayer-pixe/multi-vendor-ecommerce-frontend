import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { InvoiceApiService } from '../../shared/services/invoice-api.service';

import { OrderSuccessComponent } from './order-success.component';

describe('OrderSuccessComponent', () => {
  let component: OrderSuccessComponent;
  let fixture: ComponentFixture<OrderSuccessComponent>;
  let invoiceApi: jasmine.SpyObj<InvoiceApiService>;

  beforeEach(async () => {
    invoiceApi = jasmine.createSpyObj<InvoiceApiService>('InvoiceApiService', ['downloadCustomerInvoice', 'savePdf']);
    invoiceApi.downloadCustomerInvoice.and.returnValue(of({ blob: new Blob(['pdf']), filename: 'invoice.pdf' }));
    await TestBed.configureTestingModule({
      imports: [OrderSuccessComponent],
      providers: [
        { provide: InvoiceApiService, useValue: invoiceApi },
        { provide: Router, useValue: { getCurrentNavigation: () => ({ extras: { state: { order: { id: 42, orderNumber: 'ORD-42', createdAt: '2026-11-04T10:00:00' } } } }), navigate: jasmine.createSpy('navigate') } },
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('downloads an authenticated invoice for the order returned by checkout', () => {
    component.downloadInvoice();
    expect(invoiceApi.downloadCustomerInvoice).toHaveBeenCalledWith(42, 'ORD-42');
    expect(invoiceApi.savePdf).toHaveBeenCalled();
  });

  it('shows an invoice download error without losing the order success page', () => {
    invoiceApi.downloadCustomerInvoice.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    component.downloadInvoice();
    fixture.detectChanges();
    expect(component.downloadError).toContain('could not be downloaded');
    expect(fixture.nativeElement.textContent).toContain('could not be downloaded');
  });
});
