import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutrientGauge } from './nutrient-gauge';

describe('NutrientGauge', () => {
  let component: NutrientGauge;
  let fixture: ComponentFixture<NutrientGauge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutrientGauge],
    }).compileComponents();

    fixture = TestBed.createComponent(NutrientGauge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
