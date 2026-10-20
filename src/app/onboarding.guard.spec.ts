import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from './app.routes';

describe('Premier lancement (routage)', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it("envoie vers /bienvenue sans boucler quand l'âge n'est pas connu", async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    expect(TestBed.inject(Router).url).toBe('/bienvenue');
  });

  it("ouvre l'accueil une fois l'âge renseigné", async () => {
    localStorage.setItem('nutripetit_baby_age', '9');
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    expect(TestBed.inject(Router).url).toBe('/');
  });

  it('laisse passer un lien direct vers une fiche, même au premier lancement', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/scan/3701293900233');
    expect(TestBed.inject(Router).url).toBe('/scan/3701293900233');
  });
});
