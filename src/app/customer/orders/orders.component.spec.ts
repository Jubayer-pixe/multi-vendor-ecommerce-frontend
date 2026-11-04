import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { InvoiceApiService, OrderReportRow, PageResponse } from '../../shared/services/invoice-api.service';

import { OrdersComponent } from './orders.component';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let invoiceApi: jasmine.SpyObj<InvoiceApiService>;
  const emptyPage: PageResponse<OrderReportRow> = { content: [], number: 0, size: 20, totalElements: 0, totalPages: 0, first: true, last: true, empty: true };

  beforeEach(async () => {
    invoiceApi = jasmine.createSpyObj<InvoiceApiService>('InvoiceApiService', ['getCustomerOrders', 'downloadCustomerInvoice', 'savePdf']);
    invoiceApi.getCustomerOrders.and.returnValue(of(emptyPage));
    invoiceApi.downloadCustomerInvoice.and.returnValue(of({ blob: new Blob(['pdf']), filename: 'invoice.pdf' }));
    await TestBed.configureTestingModule({
      imports: [OrdersComponent],
      providers: [{ provide: InvoiceApiService, useValue: invoiceApi }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads real customer orders and shows empty state without sample rows', () => {
    expect(invoiceApi.getCustomerOrders).toHaveBeenCalledWith(0);
    expect(component.orders).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('No Orders Found');
  });

  it('renders payment status from backend and lets customers request their invoice', () => {
    const order: OrderReportRow = { id: 17, orderNumber: 'ORD-17', customerName: 'Customer', orderDate: '2026-11-04T10:00:00', total: 225, orderStatus: 'PENDING', paymentStatus: 'PENDING', paymentMethod: 'COD', invoiceAvailable: true };
    invoiceApi.getCustomerOrders.and.returnValue(of({ ...emptyPage, content: [order], totalElements: 1, totalPages: 1, empty: false }));
    component.loadOrders();
    expect(fixture.nativeElement.textContent).toContain('ORD-17');
    expect(fixture.nativeElement.textContent).toContain('COD');
    expect(fixture.nativeElement.textContent).toContain('PENDING');
    component.downloadInvoice(order);
    expect(invoiceApi.downloadCustomerInvoice).toHaveBeenCalledWith(17, 'ORD-17');
    expect(invoiceApi.savePdf).toHaveBeenCalled();
  });

  it('shows order loading failures and invoice not-found failures', () => {
    invoiceApi.getCustomerOrders.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    component.loadOrders();
    expect(component.errorMessage).toContain('Unable to load your orders');
    const order: OrderReportRow = { id: 17, orderNumber: 'ORD-17', customerName: 'Customer', orderDate: '', total: 0, orderStatus: 'PENDING', paymentStatus: 'PENDING', invoiceAvailable: true };
    invoiceApi.downloadCustomerInvoice.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
    component.downloadInvoice(order);
    expect(component.downloadError).toContain('No invoice is available');
  });
});
