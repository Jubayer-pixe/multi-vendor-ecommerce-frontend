import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

import { UserRole } from '../models/role.model';
import {
  LoginRequest,
  LoginResponse,
  CurrentUser,
  RegisterRequest,
} from '../models/auth.model';
import { API_ENDPOINTS } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<CurrentUser> {
    return this.http.post<LoginResponse>(API_ENDPOINTS.login, request).pipe(
      map((response) => {
        if (!response.jwtToken || !response.user) {
          throw new Error('Invalid login response from server.');
        }

        const allowedRoles: UserRole[] = [
          'SUPER_ADMIN',
          'ADMIN',
          'VENDOR',
          'CUSTOMER',
          'DELIVERY',
        ];

        const backendRoles = response.user.roles?.map(role => role.replace(/^ROLE_/, '')) ?? [];
        const backendRole = allowedRoles.find(role => backendRoles.includes(role));

        if (!backendRole) {
          throw new Error(
            `Unsupported backend role: ${backendRole || 'missing'}`,
          );
        }

        const currentUser: CurrentUser = {
          username: response.user.userName,
          name: [response.user.userFirstName, response.user.userLastName]
            .filter(Boolean)
            .join(' '),
          email: response.user.email,
          role: backendRole,
        };

        return { response, currentUser };
      }),
      tap(({ response, currentUser }) => {
        localStorage.setItem('token', response.jwtToken);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      }),
      map(({ currentUser }) => currentUser),
    );
  }

  register(request: RegisterRequest): Observable<string> {
    return this.http.post(API_ENDPOINTS.register, request, {
      responseType: 'text',
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return (
      localStorage.getItem('isLoggedIn') === 'true' &&
      !!localStorage.getItem('token')
    );
  }

  getCurrentUser(): CurrentUser | null {
    const user = localStorage.getItem('currentUser');

    return user ? (JSON.parse(user) as CurrentUser) : null;
  }

  getRole(): UserRole | null {
    return this.getCurrentUser()?.role ?? null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
