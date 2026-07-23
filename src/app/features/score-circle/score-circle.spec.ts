import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreCircle } from './score-circle';

describe('ScoreCircle', () => {
  let component: ScoreCircle;
  let fixture: ComponentFixture<ScoreCircle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreCircle],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreCircle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
