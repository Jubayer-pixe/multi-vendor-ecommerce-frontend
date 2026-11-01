import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../core/config/api.config';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the ADMIN dashboard contract from the backend', () => {
    fixture.detectChanges();
    const req = TestBed.inject(HttpTestingController).expectOne(`${API_BASE_URL}/dashboard/admin`);
    expect(req.request.method).toBe('GET');
    req.flush({
      dashboard: 'admin',
      username: 'admin-user',
      roles: ['ROLE_ADMIN'],
      metrics: { totalUsers: 5, enabledUsers: 4, disabledUsers: 1, totalProducts: 8, activeProducts: 6, inactiveProducts: 2 },
      products: [],
      charts: {},
      recentOrders: [],
      recentRegistrations: [],
    });
    expect(component.dashboard?.dashboard).toBe('admin');
    expect(component.dashboard?.metrics['totalUsers']).toBe(5);
    expect(component.loading).toBeFalse();
  });
});
