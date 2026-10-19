import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { History } from './history';

describe('History', () => {
  let fixture: ComponentFixture<History>;
  let http: HttpTestingController;

  const item = (ean: string, at: Date, level = 'good', score = 88) => ({
    product: { ean, name: `Produit ${ean}`, brand: 'Marque', imageUrl: null },
    finalScore: score,
    level,
    calculatedAt: at.toISOString(),
  });

  beforeEach(async () => {
    // jsdom n'implémente pas <dialog>.showModal / close.
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    };

    await TestBed.configureTestingModule({
      imports: [History],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(History);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it("regroupe les produits par jour et écrit le niveau en toutes lettres", () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 86_400_000);
    http.expectOne('/api/history').flush({
      results: [item('1', now), item('2', now, 'occasional', 70), item('3', yesterday)],
      total: 3, page: 1, lastPage: 1,
    });
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect([...el.querySelectorAll('.hi__day')].map((h) => h.textContent?.trim())).toEqual(["Aujourd'hui", 'Hier']);
    expect(el.textContent).toContain('70 · Occasionnel');
  });

  it("demande confirmation dans l'appli, en nommant ce qui sera effacé", () => {
    http.expectOne('/api/history').flush({ results: [item('1', new Date())], total: 1, page: 1, lastPage: 1 });
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    (el.querySelector('.hi__clear') as HTMLButtonElement).click();
    fixture.detectChanges();
    const sheet = el.querySelector('dialog')!;
    expect(sheet.hasAttribute('open')).toBe(true);
    expect(sheet.textContent).toContain('Effacer ce produit de l\'historique');
    expect(sheet.textContent).not.toContain('les 1 produit');

    (sheet.querySelector('.np-cta--danger') as HTMLButtonElement).click();
    http.expectOne('/api/history/clear').flush({ deleted: 1 });
    http.expectOne('/api/history').flush({ results: [], total: 0, page: 1, lastPage: 1 });
    fixture.detectChanges();

    expect(sheet.hasAttribute('open')).toBe(false);
    expect(el.textContent).toContain('1 produit effacé.');
  });
});
