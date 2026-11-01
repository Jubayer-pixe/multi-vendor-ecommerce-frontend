import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { jwtInterceptor } from './jwt.interceptor';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';

describe('jwtInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => jwtInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('adds a Bearer token to backend API requests', () => {
    localStorage.setItem('token', 'test-jwt');
    const req = new HttpRequest('GET', `${API_BASE_URL}/users`);
    let forwarded = req;
    jwtInterceptor(req, request => { forwarded = request; return of(new HttpResponse()); }).subscribe();
    expect(forwarded.headers.get('Authorization')).toBe('Bearer test-jwt');
    localStorage.clear();
  });

  it('does not attach a token to auth endpoints or unrelated URLs', () => {
    localStorage.setItem('token', 'test-jwt');
    for (const url of [API_ENDPOINTS.login, API_ENDPOINTS.register, 'https://example.test/api/users', 'http://localhost:8080/apix/users']) {
      const req = new HttpRequest('GET', url);
      let forwarded = req;
      jwtInterceptor(req, request => { forwarded = request; return of(new HttpResponse()); }).subscribe();
      expect(forwarded.headers.has('Authorization')).toBeFalse();
    }
    localStorage.clear();
  });
});
