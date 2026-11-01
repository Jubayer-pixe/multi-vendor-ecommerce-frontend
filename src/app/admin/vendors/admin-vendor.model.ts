export interface AdminVendor {
  id: number;
  userName: string;
  businessName: string;
  contactPerson: string;
  phone: string | null;
  email: string;
  verified: boolean;
  rating: number | null;
  createdAt: string | null;
  bankAccountIds?: number[] | null;
  documentIds?: number[] | null;
  walletId?: number | null;
}

export interface VendorUserOption {
  userName: string;
  userFirstName: string | null;
  userLastName: string | null;
  email: string;
}

export interface AdminVendorProduct {
  id: number;
  name: string;
  sku: string;
  vendorId: number | null;
}

export interface AdminVendorOrder {
  id: number;
  orderId: number | null;
  vendorId: number | null;
  status: string;
  subtotal: number;
}

export interface VendorRequest extends Omit<AdminVendor, 'id' | 'createdAt' | 'bankAccountIds' | 'documentIds' | 'walletId'> {
  id?: number;
  bankAccountIds?: number[] | null;
  documentIds?: number[] | null;
  walletId?: number | null;
}
