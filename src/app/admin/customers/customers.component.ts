import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AdminManagedRole, AdminUser } from './user-management.model';
import { UserManagementService } from './user-management.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {
  readonly managedRoles: AdminManagedRole[] = ['ADMIN', 'VENDOR', 'CUSTOMER', 'DELIVERY'];
  users: AdminUser[] = [];
  loading = false;
  savingUser = '';
  errorMessage = '';
  successMessage = '';
  searchTerm = '';
  roleFilter = '';
  statusFilter = '';
  page = 1;
  readonly pageSize = 10;
  selectedUser: AdminUser | null = null;

  constructor(private userManagement: UserManagementService, private authService: AuthService) {}

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';
    this.userManagement.listUsers().subscribe({
      next: (users) => { this.users = users; this.page = 1; this.loading = false; },
      error: (error) => { this.loading = false; this.errorMessage = error.status === 401 || error.status === 403 ? 'Administrator access is required to view users.' : 'Unable to load users. Please try again.'; },
    });
  }

  get filteredUsers(): AdminUser[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.users.filter((user) => {
      const matchesText = !query || [user.userName, user.userFirstName, user.userLastName, user.email]
        .some((value) => value?.toLowerCase().includes(query));
      const matchesRole = !this.roleFilter || user.roles.includes(this.roleFilter);
      const matchesStatus = !this.statusFilter || String(user.enabled) === this.statusFilter;
      return matchesText && matchesRole && matchesStatus;
    });
  }

  get visibleUsers(): AdminUser[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get pageCount(): number { return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize)); }
  get pageStart(): number { return this.filteredUsers.length ? (this.page - 1) * this.pageSize + 1 : 0; }
  get pageEnd(): number { return Math.min(this.page * this.pageSize, this.filteredUsers.length); }
  get currentUsername(): string | null { return this.authService.getCurrentUser()?.username ?? null; }

  displayName(user: AdminUser): string {
    return [user.userFirstName, user.userLastName].filter((value): value is string => !!value).join(' ') || '—';
  }

  canManage(user: AdminUser): boolean {
    return user.userName !== this.currentUsername && !user.roles.includes('SUPER_ADMIN');
  }

  selectUser(user: AdminUser): void { this.selectedUser = this.selectedUser?.userName === user.userName ? null : user; }

  setPage(page: number): void { this.page = Math.min(Math.max(page, 1), this.pageCount); }

  updateStatus(user: AdminUser): void {
    if (!this.canManage(user)) return;
    this.saveUser(user, this.userManagement.updateStatus(user.userName, !user.enabled));
  }

  toggleRole(user: AdminUser, role: AdminManagedRole, checked: boolean): void {
    if (!this.canManage(user)) return;
    const current = [...user.roles] as AdminManagedRole[];
    const roles = checked ? [...new Set([...current, role])] : current.filter((item) => item !== role);
    if (!roles.length) {
      this.errorMessage = 'A user must retain at least one role.';
      return;
    }
    this.saveUser(user, this.userManagement.updateRoles(user.userName, roles));
  }

  roleChecked(user: AdminUser, role: AdminManagedRole): boolean { return user.roles.includes(role); }

  private saveUser(user: AdminUser, request: import('rxjs').Observable<AdminUser>): void {
    this.savingUser = user.userName;
    this.errorMessage = '';
    this.successMessage = '';
    request.subscribe({
      next: (updated) => {
        this.users = this.users.map((item) => item.userName === updated.userName ? updated : item);
        if (this.selectedUser?.userName === updated.userName) this.selectedUser = updated;
        this.savingUser = '';
        this.successMessage = `Updated ${updated.userName}.`;
      },
      error: (error) => {
        this.savingUser = '';
        this.errorMessage = error.status === 401 || error.status === 403
          ? 'This account is not allowed to change the selected user.'
          : error.error?.message || 'Unable to update the user. Please try again.';
      },
    });
  }
}
