import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';


import { Scanner } from './scanner';

describe('Scanner', () => {
  let component: Scanner;
  let fixture: ComponentFixture<Scanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Scanner],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Scanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
