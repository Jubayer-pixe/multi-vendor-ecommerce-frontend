import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AuthService as CoreAuthService } from '../../core/services/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service).toBe(TestBed.inject(CoreAuthService));
  });
});
