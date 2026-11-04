import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CheckoutResponse } from '../checkout/checkout.service';
import { HttpErrorResponse } from '@angular/common/http';
import { InvoiceApiService } from '../../shared/services/invoice-api.service';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.scss'
})
export class OrderSuccessComponent {
downloading: any;
  readonly order: CheckoutResponse | null;
  readonly orderDate: string;
  downloadError = '';

  constructor(router: Router, private invoiceApi: InvoiceApiService) {
    const state = router.getCurrentNavigation()?.extras.state ?? history.state;
    const order = state?.['order'] as CheckoutResponse | undefined;
    this.order = order?.id && order?.orderNumber ? order : null;
    this.orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleString() : '';
    if (!this.order) router.navigate(['/']);
  }

  downloadInvoice(): void {
    if (!this.order || this.downloading) return;
    this.downloading = true;
    this.downloadError = '';
    this.invoiceApi.downloadCustomerInvoice(this.order.id, this.order.orderNumber).subscribe({
      next: file => { this.downloading = false; this.invoiceApi.savePdf(file); },
      error: (error: HttpErrorResponse) => {
        this.downloading = false;
        this.downloadError = error.status === 401 || error.status === 403
          ? 'Sign in to the customer account that placed this order to download the invoice.'
          : 'The invoice PDF could not be downloaded. Please try again from My Orders.';
      },
    });
  }
}
