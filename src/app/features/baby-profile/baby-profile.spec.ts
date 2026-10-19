import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';


import { BabyProfile } from './baby-profile';

describe('BabyProfile', () => {
  let component: BabyProfile;
  let fixture: ComponentFixture<BabyProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BabyProfile],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(BabyProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
