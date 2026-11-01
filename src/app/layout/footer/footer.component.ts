import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/role.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  @Input() role: UserRole | null = null;

  email: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get currentRole(): string {
    return this.role || 'GUEST';
  }

  get isCustomerExperience(): boolean {
    return this.currentRole === 'GUEST' || this.currentRole === 'CUSTOMER';
  }

  get roleLabel(): string {
    const labels: Record<string, string> = {
      ADMIN: 'Admin',
      VENDOR: 'Vendor',
      DELIVERY: 'Delivery Partner',
      SUPER_ADMIN: 'Super Admin'
    };

    return labels[this.currentRole] || 'Customer';
  }

  get dashboardRoute(): string {
    const routes: Record<string, string> = {
      ADMIN: '/admin',
      VENDOR: '/vendor',
      DELIVERY: '/delivery',
      SUPER_ADMIN: '/super-admin'
    };

    return routes[this.currentRole] || '/home';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  subscribe(): void {

    if (!this.email.trim()) {
      alert('Please enter your email address.');
      return;
    }

    alert('Thank you for subscribing!');

    this.email = '';
  }

}
