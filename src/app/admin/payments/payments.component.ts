import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PaymentDto } from './payment.model';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent implements OnInit {
  payments: PaymentDto[] = [];
  loading = false;
  errorMessage = '';

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.errorMessage = '';
    this.paymentService.getPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.status === 401 || error.status === 403
          ? 'Administrator access is required to view payments.'
          : 'Unable to load payment records. Please try again.';
      },
    });
  }
}
