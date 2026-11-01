import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardService } from '../dashboard/dashboard.service';

import { ReportsComponent } from './reports.component';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsComponent],
      providers: [{ provide: DashboardService, useValue: { getAdminDashboard: () => of({ dashboard: 'admin', username: 'admin', roles: ['ROLE_ADMIN'], metrics: {}, products: [], charts: {}, recentOrders: [], recentRegistrations: [] }) } }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
