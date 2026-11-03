import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import {
  AdminVendor,
  AdminVendorOrder,
  AdminVendorProduct,
  VendorRequest,
  VendorUserOption,
} from './admin-vendor.model';
import { AdminVendorService } from './admin-vendor.service';
import { VendorRegistrationRequest } from '../../core/models/vendor-request.model';
import { VendorRequestService } from '../../core/services/vendor-request.service';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendors.component.html',
  styleUrl: './vendors.component.scss',
})
export class VendorsComponent implements OnInit {
  vendors: AdminVendor[] = [];
  vendorUsers: VendorUserOption[] = [];
  vendorProducts: AdminVendorProduct[] = [];
  vendorOrders: AdminVendorOrder[] = [];

  vendorRequests: VendorRegistrationRequest[] = [];
  requestStatusFilter = '';
  loadingRequests = false;
  processingRequestId: number | null = null;

  loading = false;
  loadingDetails = false;
  creating = false;
  errorMessage = '';
  detailError = '';
  successMessage = '';
  searchTerm = '';
  verificationFilter = '';
  selectedVendor: AdminVendor | null = null;
  showCreate = false;
  selectedUserName = '';
  form: VendorRequest = this.emptyForm();

  constructor(
    private vendorService: AdminVendorService,
    private vendorRequestService: VendorRequestService,
  ) {}

  ngOnInit(): void {
    this.load();
    this.loadVendorRequests();
  }
  loadVendorRequests(): void {
    this.vendorRequestService.adminList().subscribe({
      next: (requests) => {
        this.vendorRequests = requests;
      },
      error: (error) => {
        console.error('Failed to load vendor requests', error);
      },
    });
  }
  approveRequest(id: number): void {
    this.vendorRequestService.approve(id).subscribe({
      next: () => {
        this.loadVendorRequests();
        this.load(); // reload vendor list too
      },
      error: (error) => {
        console.error('Approve failed', error);
      },
    });
  }

  rejectRequest(id: number): void {
    const reason = window.prompt('Please enter rejection reason:');
    if (!reason || !reason.trim()) {
      return;
    }

    this.vendorRequestService.reject(id, reason.trim()).subscribe({
      next: () => {
        this.loadVendorRequests();
      },
      error: (error) => {
        console.error('Reject failed', error);
      },
    });
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    forkJoin({
      vendors: this.vendorService.list(),
      users: this.vendorService.vendorUsers(),
    }).subscribe({
      next: ({ vendors, users }) => {
        this.vendors = vendors;
        this.vendorUsers = users;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = this.messageFor(
          error,
          'Unable to load vendor records.',
        );
      },
    });
  }

  get filteredVendors(): AdminVendor[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.vendors.filter((vendor) => {
      const matchesQuery =
        !query ||
        [
          vendor.businessName,
          vendor.userName,
          vendor.contactPerson,
          vendor.email,
        ].some((value) => value?.toLowerCase().includes(query));
      const matchesVerification =
        !this.verificationFilter ||
        String(vendor.verified) === this.verificationFilter;
      return matchesQuery && matchesVerification;
    });
  }

  get eligibleVendorUsers(): VendorUserOption[] {
    const linkedUsers = new Set(this.vendors.map((vendor) => vendor.userName));
    return this.vendorUsers.filter((user) => !linkedUsers.has(user.userName));
  }

  openCreate(): void {
    this.showCreate = true;
    this.selectedVendor = null;
    this.resetForm();
  }
  cancelCreate(): void {
    this.showCreate = false;
    this.resetForm();
  }

  selectUser(): void {
    const user = this.eligibleVendorUsers.find(
      (item) => item.userName === this.selectedUserName,
    );
    if (!user) return;
    this.form.userName = user.userName;
    this.form.email = user.email;
    this.form.contactPerson = [user.userFirstName, user.userLastName]
      .filter((value): value is string => !!value)
      .join(' ');
  }

  createVendor(): void {
    if (
      !this.form.userName ||
      !this.form.businessName.trim() ||
      !this.form.contactPerson.trim() ||
      !this.form.email.trim()
    ) {
      this.errorMessage =
        'Select an existing VENDOR account and complete the required profile fields.';
      return;
    }
    const request: VendorRequest = {
      ...this.form,
      businessName: this.form.businessName.trim(),
      contactPerson: this.form.contactPerson.trim(),
      email: this.form.email.trim(),
      phone: this.form.phone?.trim() || null,
      verified: false,
      rating: null,
    };
    this.creating = true;
    this.errorMessage = '';
    this.vendorService.create(request).subscribe({
      next: (created) => {
        this.vendors = [created, ...this.vendors];
        this.creating = false;
        this.showCreate = false;
        this.resetForm();
        this.successMessage = `Vendor profile created for ${created.userName}.`;
      },
      error: (error) => {
        this.creating = false;
        this.errorMessage = this.messageFor(
          error,
          'Unable to create vendor profile.',
        );
      },
    });
  }

  selectVendor(vendor: AdminVendor): void {
    this.selectedVendor = vendor;
    this.showCreate = false;
    this.loadingDetails = true;
    this.detailError = '';
    forkJoin({
      products: this.vendorService.products(),
      orders: this.vendorService.vendorOrders(),
    }).subscribe({
      next: ({ products, orders }) => {
        this.vendorProducts = products.filter(
          (product) => product.vendorId === vendor.id,
        );
        this.vendorOrders = orders.filter(
          (order) => order.vendorId === vendor.id,
        );
        this.loadingDetails = false;
      },
      error: (error) => {
        this.loadingDetails = false;
        this.detailError = this.messageFor(
          error,
          'Vendor details loaded, but related product/order data is unavailable.',
        );
      },
    });
  }

  toggleVerified(vendor: AdminVendor): void {
    const updated = { ...vendor, verified: !vendor.verified };
    this.vendorService.update(updated).subscribe({
      next: (saved) => {
        this.vendors = this.vendors.map((item) =>
          item.id === saved.id ? saved : item,
        );
        this.selectedVendor = saved;
        this.successMessage = `${saved.businessName} marked ${saved.verified ? 'verified' : 'unverified'}.`;
      },
      error: (error) => {
        this.errorMessage = this.messageFor(
          error,
          'Unable to update vendor verification.',
        );
      },
    });
  }

  private emptyForm(): VendorRequest {
    return {
      userName: '',
      businessName: '',
      contactPerson: '',
      phone: null,
      email: '',
      verified: false,
      rating: null,
    };
  }
 private resetForm(): void {
  this.selectedUserName = '';
  this.editingVendorId = null;
  this.form = this.emptyForm();
}
  private messageFor(error: any, fallback: string): string {
    if (error.status === 401 || error.status === 403)
      return 'Administrator access is required for this action.';
    return error.error?.message || error.error?.detail || fallback;
  }
  get filteredVendorRequests(): VendorRegistrationRequest[] {
    return this.vendorRequests.filter(
      (request) =>
        !this.requestStatusFilter ||
        request.status === this.requestStatusFilter,
    );
  }
  editingVendorId: number | null = null;

openEdit(vendor: AdminVendor): void {
  this.selectedVendor = vendor;
  this.showCreate = true;
  this.editingVendorId = vendor.id;
  this.selectedUserName = vendor.userName;
  this.form = {
    ...vendor,
    phone: vendor.phone ?? null,
  };
}

saveVendor(): void {
  if (this.editingVendorId === null) {
    this.createVendor();
    return;
  }

  const request: VendorRequest = {
    ...this.form,
    id: this.editingVendorId,
    businessName: this.form.businessName.trim(),
    contactPerson: this.form.contactPerson.trim(),
    email: this.form.email.trim(),
    phone: this.form.phone?.trim() || null,
  };

  this.creating = true;
  this.errorMessage = '';
  this.successMessage = '';

  this.vendorService.update(request).subscribe({
    next: (saved) => {
      this.vendors = this.vendors.map((vendor) =>
        vendor.id === saved.id ? saved : vendor,
      );
      this.selectedVendor = saved;
      this.creating = false;
      this.showCreate = false;
      this.resetForm();
      this.successMessage = `${saved.businessName} updated successfully.`;
    },
    error: (error) => {
      this.creating = false;
      this.errorMessage = this.messageFor(error, 'Unable to update vendor.');
    },
  });
}

deleteVendor(vendor: AdminVendor): void {
  const confirmed = window.confirm(
    `Delete vendor "${vendor.businessName}"?`,
  );

  if (!confirmed) return;

  this.errorMessage = '';
  this.successMessage = '';

  this.vendorService.delete(vendor.id).subscribe({
    next: () => {
      this.vendors = this.vendors.filter((item) => item.id !== vendor.id);

      if (this.selectedVendor?.id === vendor.id) {
        this.selectedVendor = null;
      }

      this.successMessage = `${vendor.businessName} deleted successfully.`;
    },
    error: (error) => {
      this.errorMessage = this.messageFor(
        error,
        'Unable to delete vendor. The vendor may have related orders or records.',
      );
    },
  });
}
}
