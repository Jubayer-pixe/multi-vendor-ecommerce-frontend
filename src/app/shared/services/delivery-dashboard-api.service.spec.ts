import { TestBed } from '@angular/core/testing';

import { DeliveryDashboardApiService } from './delivery-dashboard-api.service';

describe('DeliveryDashboardApiService', () => {
  let service: DeliveryDashboardApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryDashboardApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
