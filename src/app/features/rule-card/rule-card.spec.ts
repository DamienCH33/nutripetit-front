import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleCard } from './rule-card';

describe('RuleCard', () => {
  let component: RuleCard;
  let fixture: ComponentFixture<RuleCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleCard],
    }).compileComponents();

    fixture = TestBed.createComponent(RuleCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
