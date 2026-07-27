import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualEntry } from './manual-entry';

describe('ManualEntry', () => {
  let component: ManualEntry;
  let fixture: ComponentFixture<ManualEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualEntry],
    }).compileComponents();

    fixture = TestBed.createComponent(ManualEntry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
