import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';


import { ScoreCircle } from './score-circle';

describe('ScoreCircle', () => {
  let component: ScoreCircle;
  let fixture: ComponentFixture<ScoreCircle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreCircle],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreCircle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
