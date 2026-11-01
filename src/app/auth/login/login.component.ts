
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login(): void {
    this.errorMessage = '';

    if (!this.username.trim() || !this.password) {
      this.errorMessage = 'Please enter username and password.';
      return;
    }

    this.loading = true;

    this.authService.login({
      username: this.username.trim(),
      password: this.password
    }).subscribe({
      next: (user) => {
        this.loading = false;

        const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'];
        if (user.role === 'CUSTOMER' && typeof returnUrl === 'string' && returnUrl.startsWith('/')) {
          this.router.navigateByUrl(returnUrl);
          return;
        }

        switch (user.role) {
          case 'SUPER_ADMIN':
            this.router.navigate(['/super-admin']);
            break;

          case 'ADMIN':
            this.router.navigate(['/admin']);
            break;

          case 'VENDOR':
            this.router.navigate(['/vendor']);
            break;

          case 'DELIVERY':
            this.router.navigate(['/delivery']);
            break;

          case 'CUSTOMER':
            this.router.navigate(['/']);
            break;
        }
      },
      error: (error) => {
        this.loading = false;

        this.errorMessage =
          typeof error.error === 'string'
            ? error.error
            : error.error?.message ||
              error.message ||
              'Login failed. Check your username and password.';

        console.error('Login API error:', error);
      }
    });
  }
}
