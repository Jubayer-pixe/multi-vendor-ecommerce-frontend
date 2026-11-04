import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../../core/config/api.config';
import { InvoiceApiService } from './invoice-api.service';

describe('InvoiceApiService', () => {
  let service: InvoiceApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(InvoiceApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends report filters to the backend and preserves paging', () => {
    service.getAdminOrders({ startDate: '2026-11-01', endDate: '2026-11-04', status: 'PENDING', search: 'Ada' }, 1, 10).subscribe();
    const request = http.expectOne(req => req.url === `${API_BASE_URL}/reports/orders`);
    expect(request.request.params.get('startDate')).toBe('2026-11-01');
    expect(request.request.params.get('endDate')).toBe('2026-11-04');
    expect(request.request.params.get('status')).toBe('PENDING');
    expect(request.request.params.get('search')).toBe('Ada');
    expect(request.request.params.get('page')).toBe('1');
    request.flush({ content: [], number: 1, size: 10, totalElements: 0, totalPages: 0, first: false, last: true, empty: true });
  });

  it('downloads invoice blobs through authenticated API URLs and reads the filename', () => {
    service.downloadCustomerInvoice(42).subscribe(file => {
      expect(file.filename).toBe('INV-ORD-42.pdf');
      expect(file.blob.type).toBe('application/pdf');
    });
    const request = http.expectOne(`${API_BASE_URL}/invoices/orders/42/pdf`);
    expect(request.request.responseType).toBe('blob');
    request.flush(new Blob(['%PDF'], { type: 'application/pdf' }), {
      headers: { 'Content-Disposition': 'attachment; filename="INV-ORD-42.pdf"' },
    });
  });
});
