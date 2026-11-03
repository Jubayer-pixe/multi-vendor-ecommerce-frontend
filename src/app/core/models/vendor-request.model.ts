export interface VendorRegistrationRequest {
  id: number;
  userName: string;
  businessName: string;
  contactPerson: string;
  businessEmail: string;
  businessPhone?: string | null;
  businessAddress?: string | null;
  businessDescription?: string | null;
  tradeLicenseNumber?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface VendorRegistrationDecision {
  reason: string;
}
export interface VendorRegistrationPayload {
  businessName: string;
  contactPerson: string;
  businessEmail: string;
  businessPhone?: string | null;
  businessAddress?: string | null;
  businessDescription?: string | null;
  tradeLicenseNumber?: string | null;
}

export interface VendorRegistrationRequest extends VendorRegistrationPayload {
  id: number;
  userName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface VendorRegistrationDecision {
  reason: string;
}