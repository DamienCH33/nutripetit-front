import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';


import { NutrientGauge } from './nutrient-gauge';

describe('NutrientGauge', () => {
  let component: NutrientGauge;
  let fixture: ComponentFixture<NutrientGauge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutrientGauge],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(NutrientGauge);
    component = fixture.componentInstance;
    component.nutrient = {
      name: 'Sel',
      category: 'Nutrition',
      available: true,
      value: 0.2,
      unit: 'g',
      threshold_baby: 0.3,
      max_scale: 1,
      level: 'good',
      message: '',
      reference: 'ANSES',
    };
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
