import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { roleGuard } from './role.guard';

describe('roleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { isLoggedIn: () => true, getRole: () => 'CUSTOMER' } },
      ],
    });
  });

  it('should be created', () => {
    const guard = TestBed.runInInjectionContext(() =>
      roleGuard(['CUSTOMER'])
    );

    expect(guard).toBeTruthy();
  });

  it('allows a logged-in user with an allowed role', () => {
    const guard = roleGuard(['CUSTOMER']);
    const result = TestBed.runInInjectionContext(() => guard({} as never, {} as never));
    expect(result).toBeTrue();
  });

  it('redirects a logged-in user with a disallowed role to login', () => {
    TestBed.overrideProvider(AuthService, {
      useValue: { isLoggedIn: () => true, getRole: () => 'VENDOR' },
    });
    spyOn(window, 'alert').and.stub();
    const guard = roleGuard(['CUSTOMER']);
    const result = TestBed.runInInjectionContext(() => guard({} as never, {} as never));
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/login');
  });
});
