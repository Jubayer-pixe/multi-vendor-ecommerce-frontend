import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../shared/services/cart.service';
import { WishlistService } from '../../shared/services/wishlist.service';
import { FormsModule } from '@angular/forms';
import { UserRole } from '../../core/models/role.model';

interface PanelLink {
  label: string;
  icon: string;
  route: string;
  exact?: boolean;
}

const PANEL_LINKS: Record<string, PanelLink[]> = {
  SUPER_ADMIN: [
    { label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/super-admin', exact: true },
    { label: 'Admins', icon: 'bi-person-gear', route: '/super-admin/admins' },
    { label: 'Vendor approvals', icon: 'bi-patch-check', route: '/super-admin/vendors' },
    { label: 'Settings', icon: 'bi-sliders', route: '/super-admin/settings' }
  ],
  ADMIN: [
    { label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/admin', exact: true },
    { label: 'Vendors', icon: 'bi-shop', route: '/admin/vendors' },
    { label: 'Products', icon: 'bi-box-seam', route: '/admin/products' },
    { label: 'Orders', icon: 'bi-receipt', route: '/admin/orders' },
    { label: 'Reports', icon: 'bi-bar-chart-line', route: '/admin/reports' }
  ],
  VENDOR: [
    { label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/vendor', exact: true },
    { label: 'Products', icon: 'bi-box-seam', route: '/vendor/products' },
    { label: 'Orders', icon: 'bi-receipt', route: '/vendor/orders' },
    { label: 'Inventory', icon: 'bi-boxes', route: '/vendor/inventory' },
    { label: 'Wallet', icon: 'bi-wallet2', route: '/vendor/wallet' }
  ],
  DELIVERY: [
    { label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/delivery', exact: true },
    { label: 'Orders', icon: 'bi-box-seam', route: '/delivery/orders' },
    { label: 'Pickups', icon: 'bi-geo-alt', route: '/delivery/pickups' },
    { label: 'Notifications', icon: 'bi-bell', route: '/delivery/notifications' },
    { label: 'Settings', icon: 'bi-gear', route: '/delivery/settings' }
  ]
};

const EMPTY_PANEL_LINKS: PanelLink[] = [];

const PANEL_DASHBOARD_ROUTES: Record<string, string> = {
  SUPER_ADMIN: '/super-admin',
  ADMIN: '/admin',
  VENDOR: '/vendor',
  DELIVERY: '/delivery'
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  @Input() role: UserRole | null = null;

  searchText: string = '';

  cartCount$ = this.cartService.cartCount$;

  wishlistCount = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

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

  get panelLinks(): PanelLink[] {
    return PANEL_LINKS[this.currentRole] || EMPTY_PANEL_LINKS;
  }

  get panelProfileRoute(): string {
    const profileRoutes: Record<string, string> = {
      VENDOR: '/vendor/profile',
      DELIVERY: '/delivery/profile',
      ADMIN: '/admin',
      SUPER_ADMIN: '/super-admin/settings'
    };

    return profileRoutes[this.currentRole] || '/profile';
  }

  get panelDashboardRoute(): string {
    return PANEL_DASHBOARD_ROUTES[this.currentRole] || '/home';
  }

  searchProducts(): void {

    const search = this.searchText.trim();

    if (!search) {
      return;
    }

    console.log('Searching for:', search);

    this.router.navigate(
      ['/products'],
      {
        queryParams: {
          search: search
        }
      }
    );
  }

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/login']);

  }

}
