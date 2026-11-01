import { UserRole } from './role.model';
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginUser {
  userName: string;
  userFirstName: string;
  userLastName: string;
  email: string;
  enabled: boolean;
  roles: string[];
  dateCreated?: string;
}

export interface LoginResponse {
  jwtToken: string;
  user: LoginUser;
}

export interface CurrentUser {
  name: string;
  email: string;
  role: UserRole;
  username: string;
}
