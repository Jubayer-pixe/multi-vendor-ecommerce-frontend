import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../core/config/api.config';
import { UserManagementService } from './user-management.service';

describe('UserManagementService', () => {
  let service: UserManagementService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(UserManagementService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('uses the existing admin users and status contracts', () => {
    service.updateStatus('customer one', false).subscribe();
    const request = http.expectOne(`${API_BASE_URL}/users/customer%20one/status`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ enabled: false });
    request.flush({ userName: 'customer one', enabled: false, roles: ['CUSTOMER'] });
  });

  it('sends role updates to the protected admin role endpoint', () => {
    service.updateRoles('customer', ['CUSTOMER', 'VENDOR']).subscribe();
    const request = http.expectOne(`${API_BASE_URL}/admin/users/customer/roles`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ roles: ['CUSTOMER', 'VENDOR'] });
    request.flush({ userName: 'customer', enabled: true, roles: ['CUSTOMER', 'VENDOR'] });
  });
});
