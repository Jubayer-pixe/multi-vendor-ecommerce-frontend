import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { InvoiceApiService, OrderReportFilter, OrderReportRow, PageResponse } from '../../shared/services/invoice-api.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  report: PageResponse<OrderReportRow> | null = null;
  loading = false;
  errorMessage = '';
  actionError = '';
  actionOrderId: number | null = null;
  page = 0;
  readonly pageSize = 20;
  readonly filters: OrderReportFilter = { startDate: '', endDate: '', status: '', search: '' };

  constructor(private invoiceApi: InvoiceApiService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    this.invoiceApi.getAdminOrders(this.filters, this.page, this.pageSize).subscribe({
      next: (report) => { this.report = report; this.loading = false; },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.report = null;
        this.errorMessage = error.status === 401 || error.status === 403
          ? 'Administrator access is required to view reports.'
          : error.status === 400 ? 'The report filters are invalid. Check the date range and try again.'
            : 'Unable to load order reports. Please try again.';
      },
    });
  }

  applyFilters(): void { this.page = 0; this.load(); }
  previousPage(): void { if (this.page > 0) { this.page--; this.load(); } }
  nextPage(): void { if (this.report && !this.report.last) { this.page++; this.load(); } }

  viewInvoice(order: OrderReportRow): void {
    if (!order.invoiceAvailable) return;
    const viewer = window.open('', '_blank');
    if (!viewer) {
      this.actionError = 'Your browser blocked the invoice window. Allow popups and try again.';
      return;
    }
    viewer.opener = null;
    this.fetchInvoice(order, true, viewer);
  }
  downloadInvoice(order: OrderReportRow): void { this.fetchInvoice(order, false); }

  private fetchInvoice(order: OrderReportRow, view: boolean, viewer?: Window): void {
    if (!order.invoiceAvailable) return;
    this.actionOrderId = order.id;
    this.actionError = '';
    this.invoiceApi.downloadAdminInvoice(order.id, order.orderNumber).subscribe({
      next: file => {
        this.actionOrderId = null;
        if (view && viewer) this.invoiceApi.openPdf(file, viewer); else this.invoiceApi.savePdf(file);
      },
      error: (error: HttpErrorResponse) => {
        this.actionOrderId = null;
        viewer?.close();
        this.actionError = error.status === 401 || error.status === 403
          ? 'Administrator access is required to access invoice PDFs.'
          : 'Unable to open this invoice PDF. Please try again.';
      },
    });
  }
}
