import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { InvoiceApiService, OrderReportRow, PageResponse } from '../../shared/services/invoice-api.service';

import { ReportsComponent } from './reports.component';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let invoiceApi: jasmine.SpyObj<InvoiceApiService>;
  const emptyPage: PageResponse<OrderReportRow> = { content: [], number: 0, size: 20, totalElements: 0, totalPages: 0, first: true, last: true, empty: true };

  beforeEach(async () => {
    invoiceApi = jasmine.createSpyObj<InvoiceApiService>('InvoiceApiService', ['getAdminOrders', 'downloadAdminInvoice', 'openPdf', 'savePdf']);
    invoiceApi.getAdminOrders.and.returnValue(of(emptyPage));
    await TestBed.configureTestingModule({
      imports: [ReportsComponent],
      providers: [{ provide: InvoiceApiService, useValue: invoiceApi }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads a real empty report and submits backend filters', () => {
    component.filters.startDate = '2026-11-01';
    component.filters.endDate = '2026-11-04';
    component.filters.status = 'PENDING';
    component.filters.search = 'Ada';
    component.applyFilters();
    expect(invoiceApi.getAdminOrders).toHaveBeenCalledWith(component.filters, 0, 20);
    expect(fixture.nativeElement.textContent).toContain('No orders match these filters');
  });

  it('renders order rows and exposes invoice view and download actions', () => {
    const row: OrderReportRow = { id: 9, orderNumber: 'ORD-9', customerName: 'Ada', orderDate: '2026-11-04T10:00:00', total: 125, orderStatus: 'PENDING', paymentStatus: 'PENDING', invoiceAvailable: true };
    invoiceApi.getAdminOrders.and.returnValue(of({ ...emptyPage, content: [row], totalElements: 1, totalPages: 1, empty: false }));
    component.load();
    expect(fixture.nativeElement.textContent).toContain('ORD-9');
    expect(fixture.nativeElement.textContent).toContain('Ada');
    expect(fixture.nativeElement.textContent).toContain('PENDING');
  });

  it('opens the invoice tab during the user gesture before the PDF request completes', () => {
    const row: OrderReportRow = { id: 11, orderNumber: 'ORD-11', customerName: 'Jo', orderDate: '2026-11-04T10:00:00', total: 25, orderStatus: 'PENDING', paymentStatus: 'PENDING', invoiceAvailable: true };
    const viewer = { close: jasmine.createSpy('close'), location: { href: '' } } as unknown as Window;
    const openSpy = spyOn(window, 'open').and.returnValue(viewer);
    invoiceApi.downloadAdminInvoice.and.returnValue(of({ blob: new Blob(['%PDF']), filename: 'INV-ORD-11.pdf' }));
    component.viewInvoice(row);

    expect(openSpy).toHaveBeenCalledWith('', '_blank');
    expect(invoiceApi.downloadAdminInvoice).toHaveBeenCalledWith(11, 'ORD-11');
    expect(invoiceApi.openPdf).toHaveBeenCalledWith(jasmine.anything(), viewer);
  });

  it('shows unavailable historical invoices and disables PDF actions', () => {
    const row: OrderReportRow = { id: 10, orderNumber: 'ORD-10', customerName: 'Sam', orderDate: '2025-01-01T10:00:00', total: 50, orderStatus: 'DELIVERED', paymentStatus: 'PAID', invoiceAvailable: false };
    invoiceApi.getAdminOrders.and.returnValue(of({ ...emptyPage, content: [row], totalElements: 1, totalPages: 1, empty: false }));
    component.load();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('No invoice available for this order');
    const buttons = fixture.nativeElement.querySelectorAll('button[aria-label*="invoice for ORD-10"]');
    expect(buttons.length).toBe(0);
    component.downloadInvoice(row);
    expect(invoiceApi.downloadAdminInvoice).not.toHaveBeenCalled();
  });

  it('shows loading and API errors', () => {
    invoiceApi.getAdminOrders.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    component.load();
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toContain('Unable to load order reports');
    expect(fixture.nativeElement.textContent).toContain('Unable to load order reports');
  });
});
