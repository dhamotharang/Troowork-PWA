import { TestBed } from '@angular/core/testing';

import { WorkOrderServiceService } from './work-order-service.service';

describe('WorkOrderServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkOrderServiceService = TestBed.get(WorkOrderServiceService);
    expect(service).toBeTruthy();
  });
});
