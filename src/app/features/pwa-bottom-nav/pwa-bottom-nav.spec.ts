import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';


import { PwaBottomNav } from './pwa-bottom-nav';

describe('PwaBottomNav', () => {
  let component: PwaBottomNav;
  let fixture: ComponentFixture<PwaBottomNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwaBottomNav],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PwaBottomNav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
