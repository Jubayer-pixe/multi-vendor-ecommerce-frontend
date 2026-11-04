import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { InvoiceApiService, OrderReportRow, PageResponse } from '../../shared/services/invoice-api.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  orders: OrderReportRow[] = [];
  result: PageResponse<OrderReportRow> | null = null;
  loading = false;
  errorMessage = '';
  downloadError = '';
  downloadingOrderId: number | null = null;

  constructor(private invoiceApi: InvoiceApiService) {}

  ngOnInit(): void { this.loadOrders(); }

  loadOrders(page = 0): void {
    this.loading = true;
    this.errorMessage = '';
    this.invoiceApi.getCustomerOrders(page).subscribe({
      next: result => { this.result = result; this.orders = result.content; this.loading = false; },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.orders = [];
        this.errorMessage = error.status === 401 || error.status === 403
          ? 'Sign in with your customer account to view your orders.'
          : 'Unable to load your orders. Please try again.';
      },
    });
  }

  previousPage(): void { if (this.result && !this.result.first) this.loadOrders(this.result.number - 1); }
  nextPage(): void { if (this.result && !this.result.last) this.loadOrders(this.result.number + 1); }

  downloadInvoice(order: OrderReportRow): void {
    this.downloadingOrderId = order.id;
    this.downloadError = '';
    this.invoiceApi.downloadCustomerInvoice(order.id, order.orderNumber).subscribe({
      next: file => { this.downloadingOrderId = null; this.invoiceApi.savePdf(file); },
      error: (error: HttpErrorResponse) => {
        this.downloadingOrderId = null;
        this.downloadError = error.status === 404
          ? `No invoice is available for ${order.orderNumber}.`
          : error.status === 401 || error.status === 403
            ? 'Sign in with the customer account that placed this order to download its invoice.'
            : 'Unable to download this invoice PDF. Please try again.';
      },
    });
  }


  getOrderStatusClass(status: string): string {

    switch (status.toUpperCase()) {

      case 'PENDING':
        return 'bg-warning text-dark';

      case 'PROCESSING':
        return 'bg-info text-dark';

      case 'SHIPPED':
        return 'bg-primary';

      case 'DELIVERED':
        return 'bg-success';

      case 'CANCELLED':
        return 'bg-danger';

      default:
        return 'bg-secondary';

    }

  }


  getPaymentStatusClass(status: string | null): string {

    if (status?.toUpperCase() === 'PAID') {
      return 'bg-success';
    }

    if (status?.toUpperCase() === 'PENDING') {
      return 'bg-warning text-dark';
    }

    if (status?.toUpperCase() === 'FAILED') {
      return 'bg-danger';
    }

    return 'bg-secondary';

  }

}
