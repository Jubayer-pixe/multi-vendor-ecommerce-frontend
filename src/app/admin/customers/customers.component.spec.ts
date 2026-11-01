import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { UserManagementService } from './user-management.service';

import { CustomersComponent } from './customers.component';

describe('CustomersComponent', () => {
  let component: CustomersComponent;
  let fixture: ComponentFixture<CustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersComponent],
      providers: [
        { provide: UserManagementService, useValue: { listUsers: () => of([]) } },
        { provide: AuthService, useValue: { getCurrentUser: () => ({ username: 'admin' }) } },
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('protects the signed-in account and SUPER_ADMIN accounts from admin changes', () => {
    const self = { userName: 'admin', userFirstName: null, userLastName: null, email: 'admin@example.test', enabled: true, roles: ['ADMIN'], dateCreated: null };
    const superAdmin = { ...self, userName: 'root', roles: ['SUPER_ADMIN'] };
    expect(component.canManage(self)).toBeFalse();
    expect(component.canManage(superAdmin)).toBeFalse();
  });
});
