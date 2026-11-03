import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { VendorRequestService } from '../../core/services/vendor-request.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,RouterLink,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  username = '';
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';

  accountType: 'CUSTOMER' | 'VENDOR' = 'CUSTOMER';

  businessName = '';
  contactPerson = '';
  businessPhone = '';
  businessAddress = '';
  businessDescription = '';
  tradeLicenseNumber = '';

  loading = false;
  errorMessage = '';
  successMessage = '';
  businessEmail = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private vendorRequestService: VendorRequestService,
    private router: Router,
  ) {}

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.username.trim() ||
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.email.trim() ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.accountType === 'VENDOR') {
      if (
        !this.businessName.trim() ||
        !this.contactPerson.trim() ||
        !this.businessEmail
      ) {
        this.errorMessage = 'Please fill in the vendor business details.';
        return;
      }
    }

    this.loading = true;

    const request = {
      username: this.username.trim(),
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim(),
      password: this.password,
      accountType: this.accountType,
      businessName: this.businessName.trim(),
      contactPerson: this.contactPerson.trim(),
      businessPhone: this.businessPhone.trim(),
      businessAddress: this.businessAddress.trim(),
      businessDescription: this.businessDescription.trim(),
      tradeLicenseNumber: this.tradeLicenseNumber.trim(),
    };

    this.authService.register(request).subscribe({
      next: (response) => {
        if (this.accountType === 'VENDOR') {
          this.authService
            .login({
              username: this.username.trim(),
              password: this.password,
            })
            .subscribe({
              next: () => {
                // AuthService.login() সফল হলে নতুন user's token localStorage-এ save হয়।
                this.vendorRequestService
                  .submit({
                    businessName: this.businessName.trim(),
                    contactPerson: this.contactPerson.trim(),
                    businessEmail: this.email.trim(),
                    businessPhone: this.businessPhone.trim(),
                    businessAddress: this.businessAddress.trim(),
                    businessDescription: this.businessDescription.trim(),
                    tradeLicenseNumber: this.tradeLicenseNumber.trim(),
                  })
                  .subscribe({
                    next: () => {
                      this.successMessage =
                        'Your vendor registration request has been submitted successfully. Please wait for Admin approval.';
                      this.loading = false;

                      setTimeout(() => this.router.navigate(['/login']), 1500);
                    },
                    error: (error) => {
                      this.loading = false;
                      this.errorMessage =
                        error.error?.message ||
                        'Vendor registration request could not be submitted.';
                    },
                  });
              },
              error: (error) => {
                this.loading = false;
                this.errorMessage =
                  error.error?.message ||
                  'Account was created, but automatic login failed. Please log in and submit your vendor request again.';
              },
            });

          return;
        }

        this.successMessage = response || 'Registration successful!';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          typeof error.error === 'string'
            ? error.error
            : error.error?.message ||
              'Registration failed. Please check the backend logs.';
      },
    });
  }
}
