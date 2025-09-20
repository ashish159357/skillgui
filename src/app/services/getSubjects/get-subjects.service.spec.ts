import { TestBed } from '@angular/core/testing';

import { GetSubjectsService } from './get-subjects.service';

describe('GetSubjectsService', () => {
  let service: GetSubjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetSubjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
