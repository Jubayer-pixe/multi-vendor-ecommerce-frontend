import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../core/config/api.config';

interface VendorWalletRecord { id: number; vendorId: number; balance: number; currency: string; updatedAt: string; }

@Component({
  selector: 'app-withdrawals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './withdrawals.component.html',
  styleUrl: './withdrawals.component.scss'
})
export class WithdrawalsComponent implements OnInit {
  wallets: VendorWalletRecord[] = [];
  loading = false;
  errorMessage = '';
  constructor(private http: HttpClient) {}
  ngOnInit(): void { this.loadWallets(); }

  loadWallets(): void {
    this.loading = true;
    this.errorMessage = '';
    this.http.get<VendorWalletRecord[]>(`${API_BASE_URL}/vendor-wallets`).subscribe({
      next: (wallets) => { this.wallets = wallets; this.loading = false; },
      error: (error) => { this.loading = false; this.errorMessage = error.status === 401 || error.status === 403 ? 'Administrator access is required to view wallet balances.' : 'Unable to load wallet balances.'; },
    });
  }
}
