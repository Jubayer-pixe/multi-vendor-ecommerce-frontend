import { LegacyProductDto } from '../../shared/models/product.model';

export interface DashboardChartItem {
  label: string;
  value: number;
}

export interface AdminDashboardResponse {
  dashboard: string;
  username: string;
  roles: string[];
  metrics: Record<string, number>;
  products: LegacyProductDto[];
  charts: Record<string, DashboardChartItem[]>;
  recentOrders: DashboardRecentOrder[];
  recentRegistrations: DashboardRecentRegistration[];
}

export interface DashboardRecentOrder {
  id: number;
  orderNumber: string;
  customerName: string | null;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export interface DashboardRecentRegistration {
  username: string;
  email: string;
  roles: string[];
  enabled: boolean;
  dateCreated: string | null;
}
