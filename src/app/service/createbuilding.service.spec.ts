import { TestBed, inject } from '@angular/core/testing';

import { CreatebuildingService } from './createbuilding.service';

describe('CreatebuildingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreatebuildingService]
    });
  });

  it('should be created', inject([CreatebuildingService], (service: CreatebuildingService) => {
    expect(service).toBeTruthy();
  }));
});
