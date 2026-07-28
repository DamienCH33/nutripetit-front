import { TestBed } from '@angular/core/testing';

import { BabyProfile } from './baby-profile';

describe('BabyProfile', () => {
  let service: BabyProfile;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BabyProfile);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
