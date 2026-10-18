import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';


import { PwaHeader } from './pwa-header';

describe('PwaHeader', () => {
  let component: PwaHeader;
  let fixture: ComponentFixture<PwaHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwaHeader],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PwaHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
