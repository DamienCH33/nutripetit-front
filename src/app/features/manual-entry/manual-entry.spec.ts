import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { ManualEntry } from './manual-entry';

describe('ManualEntry', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ManualEntry], providers: [provideRouter([])] });
  });

  it('ouvre la fiche, espaces retirés', () => {
    const nav = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const cmp = TestBed.createComponent(ManualEntry).componentInstance;
    cmp.onInput('3 701293 900233');
    cmp.submit();
    expect(nav).toHaveBeenCalledWith(['/scan', '3701293900233']);
  });

  it('accepte un EAN-8', () => {
    const nav = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const cmp = TestBed.createComponent(ManualEntry).componentInstance;
    cmp.onInput('40170725');
    cmp.submit();
    expect(nav).toHaveBeenCalledWith(['/scan', '40170725']);
  });

  it('dit pourquoi le code est refusé, sans naviguer', () => {
    const nav = vi.spyOn(TestBed.inject(Router), 'navigate');
    const fixture = TestBed.createComponent(ManualEntry);
    fixture.componentInstance.onInput('12345');
    fixture.componentInstance.submit();
    fixture.detectChanges();
    expect(nav).not.toHaveBeenCalled();
    expect((fixture.nativeElement as HTMLElement).querySelector('#ean-error')?.textContent).toContain('5 chiffres');
  });
});
