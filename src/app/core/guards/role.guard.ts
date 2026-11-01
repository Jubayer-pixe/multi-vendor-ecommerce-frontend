import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/role.model';

export const roleGuard = (
  allowedRoles: UserRole[]
): CanActivateFn => {

  return () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    // Login check
    if (!authService.isLoggedIn()) {

      return router.createUrlTree(['/login']);
    }

    // Current user role
    const currentRole = authService.getRole();

    console.log('Current Role:', currentRole);
    console.log('Allowed Roles:', allowedRoles);

    // Role permission check
    if (
      currentRole !== null &&
      allowedRoles.includes(currentRole)
    ) {
      return true;
    }

    return router.createUrlTree(['/']);
  };
};
