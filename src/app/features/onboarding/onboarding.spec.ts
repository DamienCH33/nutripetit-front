import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { Onboarding } from './onboarding';
import { BabyProfileService, ageLabel } from '../../services/baby-profile';
import { onboardingGuard } from '../../onboarding.guard';

describe('Onboarding (premier lancement)', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [Onboarding], providers: [provideRouter([])] });
  });

  it("enregistre le prénom et l'âge, puis ouvre l'accueil", () => {
    const router = TestBed.inject(Router);
    const nav = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const cmp = TestBed.createComponent(Onboarding).componentInstance;

    cmp.name.set('Léo');
    cmp.pick(9);
    expect(cmp.ctaLabel()).toBe('Commencer avec Léo, 9 mois');
    cmp.start();

    const profile = TestBed.inject(BabyProfileService);
    expect(profile.age()).toBe(9);
    expect(profile.label()).toBe('Léo · 9 mois');
    expect(profile.isOnboarded()).toBe(true);
    expect(nav).toHaveBeenCalledWith('/');
  });

  it("borne l'âge entre 0 et 36 mois", () => {
    const cmp = TestBed.createComponent(Onboarding).componentInstance;
    cmp.pick(0);
    cmp.step(-1);
    expect(cmp.age()).toBe(0);
    cmp.pick(36);
    cmp.step(1);
    expect(cmp.age()).toBe(36);
  });

  it("« Plus tard » laisse passer sans âge, l'accueil invitera à le donner", () => {
    vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    TestBed.createComponent(Onboarding).componentInstance.later();
    const profile = TestBed.inject(BabyProfileService);
    expect(profile.isOnboarded()).toBe(true);
    expect(profile.age()).toBeNull();
  });

  it("redirige l'accueil vers l'écran d'âge au tout premier lancement", () => {
    const result = TestBed.runInInjectionContext(() => onboardingGuard({} as never, [], {} as never));
    expect(String(result)).toBe('/bienvenue');
  });

  it('écrit les âges comme un parent les dit', () => {
    expect(ageLabel(9)).toBe('9 mois');
    expect(ageLabel(12)).toBe('1 an');
    expect(ageLabel(18)).toBe('18 mois');
    expect(ageLabel(24)).toBe('2 ans');
  });

  it("dit dès le premier lancement que NutriPetit n'est pas un professionnel de santé", () => {
    const f = TestBed.createComponent(Onboarding);
    f.detectChanges();
    expect((f.nativeElement as HTMLElement).textContent).toContain("n'est pas un professionnel de santé");
  });
});
