export type AdminManagedRole = 'ADMIN' | 'VENDOR' | 'CUSTOMER' | 'DELIVERY';

export interface AdminUser {
  userName: string;
  userFirstName: string | null;
  userLastName: string | null;
  email: string;
  enabled: boolean;
  roles: string[];
  dateCreated: string | null;
}

export interface UserStatusRequest {
  enabled: boolean;
}

export interface UserRolesRequest {
  roles: AdminManagedRole[];
}
