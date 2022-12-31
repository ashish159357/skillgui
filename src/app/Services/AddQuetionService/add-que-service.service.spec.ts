import { TestBed } from '@angular/core/testing';

import { AddQueServiceService } from './add-que-service.service';

describe('AddQueServiceService', () => {
  let service: AddQueServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddQueServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
