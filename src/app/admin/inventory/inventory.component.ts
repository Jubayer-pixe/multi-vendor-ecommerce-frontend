import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminInventoryRecord, AdminInventoryService } from './admin-inventory.service';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class AdminInventoryComponent implements OnInit {
  records: AdminInventoryRecord[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';
  lowStockOnly = false;
  constructor(private inventoryService: AdminInventoryService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    this.inventoryService.list().subscribe({
      next: (records) => { this.records = records; this.loading = false; },
      error: (error) => { this.loading = false; this.errorMessage = error.status === 401 || error.status === 403 ? 'Administrator access is required to view inventory.' : 'Unable to load inventory records.'; },
    });
  }

  get filteredRecords(): AdminInventoryRecord[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.records.filter((record) => (!query || `${record.productId} ${record.variantId} ${record.id}`.toLowerCase().includes(query)) && (!this.lowStockOnly || record.availableQuantity <= record.reorderLevel));
  }
}
