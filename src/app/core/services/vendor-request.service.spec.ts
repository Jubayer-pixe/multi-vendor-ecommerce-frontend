import { TestBed } from '@angular/core/testing';

import { VendorRequestService } from './vendor-request.service';

describe('VendorRequestService', () => {
  let service: VendorRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
