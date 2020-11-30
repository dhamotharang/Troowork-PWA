import { TestBed } from '@angular/core/testing';

import { DocumentserviceService } from './documentservice.service';

describe('DocumentserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentserviceService = TestBed.get(DocumentserviceService);
    expect(service).toBeTruthy();
  });
});
