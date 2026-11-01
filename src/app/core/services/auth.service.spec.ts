import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { API_ENDPOINTS } from '../config/api.config';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('posts username and password, maps the response, and persists the JWT', () => {
    let result: unknown;
    service.login({ username: 'sam', password: 'password' }).subscribe(value => result = value);

    const req = TestBed.inject(HttpTestingController).expectOne(API_ENDPOINTS.login);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'sam', password: 'password' });
    req.flush({
      jwtToken: 'test-jwt',
      user: {
        userName: 'sam', userFirstName: 'Sam', userLastName: 'User',
        email: 'sam@example.test', enabled: true, roles: ['CUSTOMER'],
      },
    });

    expect(result).toEqual({ username: 'sam', name: 'Sam User', email: 'sam@example.test', role: 'CUSTOMER' });
    expect(localStorage.getItem('token')).toBe('test-jwt');
    expect(localStorage.getItem('isLoggedIn')).toBe('true');
    expect(service.getRole()).toBe('CUSTOMER');
  });

  it('accepts an optional ROLE_ prefix and rejects unsupported roles', () => {
    service.login({ username: 'sam', password: 'password' }).subscribe();
    TestBed.inject(HttpTestingController).expectOne(API_ENDPOINTS.login).flush({
      jwtToken: 'test-jwt',
      user: { userName: 'sam', roles: ['ROLE_VENDOR'] },
    });
    expect(service.getRole()).toBe('VENDOR');

    service.logout();
    let failed = false;
    service.login({ username: 'sam', password: 'password' }).subscribe({ error: () => failed = true });
    TestBed.inject(HttpTestingController).expectOne(API_ENDPOINTS.login).flush({
      jwtToken: 'test-jwt', user: { userName: 'sam', roles: ['MODERATOR'] },
    });
    expect(failed).toBeTrue();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('posts registration fields and returns the backend plain-text response', () => {
    let result = '';
    const payload = { username: 'sam', password: 'password1', email: 'sam@example.test', firstName: 'Sam', lastName: 'User' };
    service.register(payload).subscribe(value => result = value);
    const req = TestBed.inject(HttpTestingController).expectOne(API_ENDPOINTS.register);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush('User registered successfully');
    expect(result).toBe('User registered successfully');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('clears all persisted authentication state on logout', () => {
    localStorage.setItem('token', 'test-jwt');
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', '{}');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });
});
