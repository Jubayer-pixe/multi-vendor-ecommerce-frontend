import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.config';
import { AdminManagedRole, AdminUser, UserRolesRequest, UserStatusRequest } from './user-management.model';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private readonly usersUrl = `${API_BASE_URL}/users`;
  private readonly adminUrl = `${API_BASE_URL}/admin`;

  constructor(private http: HttpClient) {}

  listUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(this.usersUrl);
  }

  updateStatus(username: string, enabled: boolean): Observable<AdminUser> {
    const request: UserStatusRequest = { enabled };
    return this.http.patch<AdminUser>(`${this.usersUrl}/${encodeURIComponent(username)}/status`, request);
  }

  updateRoles(username: string, roles: AdminManagedRole[]): Observable<AdminUser> {
    const request: UserRolesRequest = { roles };
    return this.http.put<AdminUser>(`${this.adminUrl}/users/${encodeURIComponent(username)}/roles`, request);
  }
}
