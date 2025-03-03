import { TestBed } from '@angular/core/testing';

import { GetQuetionSpecificToSubjectService } from './get-quetion-specific-to-subject.service';

describe('GetQuetionSpecificToSubjectService', () => {
  let service: GetQuetionSpecificToSubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetQuetionSpecificToSubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
