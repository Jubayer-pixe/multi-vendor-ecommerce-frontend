import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.config';

export interface OrderReportRow {
  id: number;
  orderNumber: string;
  customerName: string;
  orderDate: string;
  total: number;
  orderStatus: string;
  paymentStatus: string | null;
  invoiceAvailable: boolean;
  paymentMethod?: string | null;
}

export interface PageResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface OrderReportFilter {
  startDate?: string;
  endDate?: string;
  status?: string;
  search?: string;
}

export interface InvoicePdfFile {
  blob: Blob;
  filename: string;
}

@Injectable({ providedIn: 'root' })
export class InvoiceApiService {
  constructor(private http: HttpClient) {}

  getAdminOrders(filter: OrderReportFilter, page = 0, size = 20): Observable<PageResponse<OrderReportRow>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (filter.startDate) params = params.set('startDate', filter.startDate);
    if (filter.endDate) params = params.set('endDate', filter.endDate);
    if (filter.status) params = params.set('status', filter.status);
    if (filter.search?.trim()) params = params.set('search', filter.search.trim());
    return this.http.get<PageResponse<OrderReportRow>>(`${API_BASE_URL}/reports/orders`, { params });
  }

  getCustomerOrders(page = 0, size = 20): Observable<PageResponse<OrderReportRow>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<OrderReportRow>>(`${API_BASE_URL}/orders/mine`, { params });
  }

  downloadCustomerInvoice(orderId: number, orderNumber?: string): Observable<InvoicePdfFile> {
    return this.download(`${API_BASE_URL}/invoices/orders/${orderId}/pdf`, this.invoiceFilename(orderNumber));
  }

  downloadAdminInvoice(orderId: number, orderNumber?: string): Observable<InvoicePdfFile> {
    return this.download(`${API_BASE_URL}/invoices/admin/orders/${orderId}/pdf`, this.invoiceFilename(orderNumber));
  }

  savePdf(file: InvoicePdfFile): void {
    const url = URL.createObjectURL(file.blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  openPdf(file: InvoicePdfFile, targetWindow: Window): void {
    const url = URL.createObjectURL(file.blob);
    targetWindow.location.href = url;
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  private invoiceFilename(orderNumber?: string): string {
    const safeOrderNumber = orderNumber?.replace(/[^A-Za-z0-9._-]/g, '_');
    return safeOrderNumber ? `INV-${safeOrderNumber}.pdf` : 'invoice.pdf';
  }

  private download(url: string, fallbackFilename: string): Observable<InvoicePdfFile> {
    return this.http.get(url, { observe: 'response', responseType: 'blob' }).pipe(
      map((response: HttpResponse<Blob>) => ({
        blob: response.body ?? new Blob([], { type: 'application/pdf' }),
        filename: this.filenameFrom(response, fallbackFilename),
      })),
    );
  }

  private filenameFrom(response: HttpResponse<Blob>, fallback: string): string {
    const header = response.headers.get('Content-Disposition') ?? '';
    const encoded = /filename\*=UTF-8''([^;]+)/i.exec(header)?.[1];
    const plain = /filename="?([^";]+)"?/i.exec(header)?.[1];
    const candidate = encoded ? decodeURIComponent(encoded) : plain;
    return candidate && /^[A-Za-z0-9._-]+$/.test(candidate) ? candidate : fallback;
  }
}
