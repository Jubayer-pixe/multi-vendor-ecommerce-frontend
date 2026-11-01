import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { AdminOrder, AdminOrderItem, AdminVendorOrder } from './admin-order.model';
import { AdminOrderService } from './admin-order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  orders: AdminOrder[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';
  statusFilter = '';
  page = 1;
  readonly pageSize = 10;
  selectedOrder: AdminOrder | null = null;
  orderItems: AdminOrderItem[] = [];
  vendorOrders: AdminVendorOrder[] = [];
  loadingDetails = false;
  detailError = '';

  constructor(private orderService: AdminOrderService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    this.orderService.list().subscribe({
      next: (orders) => { this.orders = orders; this.loading = false; },
      error: (error) => { this.loading = false; this.errorMessage = error.status === 401 || error.status === 403 ? 'Administrator access is required to view orders.' : error.error?.message || 'Unable to load orders.'; },
    });
  }

  get filteredOrders(): AdminOrder[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.orders.filter((order) => (!query || `${order.orderNumber} ${order.customerId} ${order.id}`.toLowerCase().includes(query)) && (!this.statusFilter || order.status === this.statusFilter));
  }
  get visibleOrders(): AdminOrder[] { return this.filteredOrders.slice((this.page - 1) * this.pageSize, this.page * this.pageSize); }
  get statuses(): string[] { return [...new Set(this.orders.map((order) => order.status))].sort(); }
  get pageCount(): number { return Math.max(1, Math.ceil(this.filteredOrders.length / this.pageSize)); }
  setPage(page: number): void { this.page = Math.min(Math.max(page, 1), this.pageCount); }

  selectOrder(order: AdminOrder): void {
    this.selectedOrder = order;
    this.loadingDetails = true;
    this.detailError = '';
    const itemsRequest = order.itemIds.length ? forkJoin(order.itemIds.map((id) => this.orderService.item(id))) : of([] as AdminOrderItem[]);
    forkJoin({ items: itemsRequest, vendorOrders: this.orderService.vendorOrders() }).subscribe({
      next: ({ items, vendorOrders }) => {
        this.orderItems = items;
        this.vendorOrders = vendorOrders.filter((vendorOrder) => vendorOrder.orderId === order.id);
        this.loadingDetails = false;
      },
      error: (error) => { this.loadingDetails = false; this.detailError = error.status === 401 || error.status === 403 ? 'Administrator access is required to view order details.' : 'Order is loaded, but item or vendor-order detail is unavailable.'; },
    });
  }
}
