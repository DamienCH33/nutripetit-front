import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyProfile } from './baby-profile';

describe('BabyProfile', () => {
  let component: BabyProfile;
  let fixture: ComponentFixture<BabyProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BabyProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(BabyProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
