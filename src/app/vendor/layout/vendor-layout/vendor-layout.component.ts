import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-vendor-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './vendor-layout.component.html',
  styleUrl: './vendor-layout.component.scss'
})
export class VendorLayoutComponent {

  constructor(
    private authService: AuthService
  ) {}

  logout(): void {
    this.authService.logout();

    window.location.href = '/login';
  }
}