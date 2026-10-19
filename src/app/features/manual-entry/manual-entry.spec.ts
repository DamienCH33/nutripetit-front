import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';


import { ManualEntry } from './manual-entry';

describe('ManualEntry', () => {
  let component: ManualEntry;
  let fixture: ComponentFixture<ManualEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualEntry],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ManualEntry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
