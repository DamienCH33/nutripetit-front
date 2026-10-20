import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { BabyProfile } from './baby-profile';
import { BabyProfileService } from '../../services/baby-profile';

describe('BabyProfile', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [BabyProfile],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it("enregistre l'âge dès qu'on le change", () => {
    const cmp = TestBed.createComponent(BabyProfile).componentInstance;
    cmp.pick(9);
    cmp.step(1);
    expect(TestBed.inject(BabyProfileService).age()).toBe(10);
  });

  it('enregistre le prénom', () => {
    const cmp = TestBed.createComponent(BabyProfile).componentInstance;
    cmp.pick(12);
    cmp.name.set(' Léo ');
    cmp.saveName();
    expect(TestBed.inject(BabyProfileService).label()).toBe('Léo · 1 an');
  });

  it("efface seulement après confirmation", () => {
    const fixture = TestBed.createComponent(BabyProfile);
    const cmp = fixture.componentInstance;
    cmp.pick(9);
    cmp.askClear();
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Effacer le prénom et l');
    expect(TestBed.inject(BabyProfileService).age()).toBe(9);
    cmp.clear();
    expect(TestBed.inject(BabyProfileService).age()).toBeNull();
  });

  it("ne prétend plus que rien n'est envoyé : l'âge part avec le scan", () => {
    const fixture = TestBed.createComponent(BabyProfile);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain("Seul l'âge est envoyé avec un scan");
  });
});
