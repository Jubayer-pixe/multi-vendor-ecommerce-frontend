export interface AdminOrder {
  id: number;
  customerId: number;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  createdAt: string;
  itemIds: number[];
}

export interface AdminOrderItem {
  id: number;
  orderId: number;
  productId: number;
  variantId: number | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface AdminVendorOrder {
  id: number;
  orderId: number;
  vendorId: number;
  status: string;
  subtotal: number;
  shippingFee: number;
  commissionAmount: number;
  itemIds: number[];
}
