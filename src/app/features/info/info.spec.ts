import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Info } from './info';
import { InfoData } from '../../services/scan';

const DATA: InfoData = {
  algoVersion: '1.3.0',
  infantFormulaAlgoVersion: 'infant_formula_3.0.0',
  rules: [
    { code: 'palm_oil', label: 'Huile de palme', description: 'Riche en acides gras saturés.', pointsImpact: -5, sourceName: 'PNNS 4', sourceUrl: '', ageMinMonths: 0, ageMaxMonths: 36 },
    { code: 'honey_botulism', label: 'Miel avant 1 an', description: 'Botulisme infantile.', pointsImpact: -35, sourceName: 'ANSES', sourceUrl: 'https://www.anses.fr', ageMinMonths: 0, ageMaxMonths: 36 },
    { code: 'iron_rich', label: 'Riche en fer', description: 'Fer.', pointsImpact: 0, sourceName: 'ANSES', sourceUrl: '', ageMinMonths: 6, ageMaxMonths: 36 },
  ],
  scoreScale: [
    { level: 'ideal', min: 97, max: 100, label: 'Idéal pour bébé', description: 'Composition optimale' },
    { level: 'discouraged', min: 0, max: 39, label: 'À éviter', description: 'Plusieurs critères dépassés' },
  ],
  infantFormulaRules: [
    { code: 'formula_no_palm_oil', label: 'Sans huile de palme', points: 8, reason: '3-MCPD.', source: 'EFSA', category: 'bonus' },
  ],
  sources: [{ name: 'ANSES', description: 'Avis 0-3 ans', url: 'https://www.anses.fr' }],
};

describe('Info', () => {
  let fixture: ComponentFixture<Info>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Info],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Info);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne((r) => r.url.endsWith('/info')).flush(DATA);
    fixture.detectChanges();
    el = fixture.nativeElement as HTMLElement;
  });

  it('pose la question en titre et annonce la version', () => {
    expect(el.querySelector('h1')?.textContent).toContain('Comment on note');
    expect(el.textContent).toContain('v1.3.0');
  });

  it('classe les défauts du plus lourd au plus léger, dépliables avec leur source', () => {
    const minus = el.querySelector('section[aria-labelledby="in-minus"]')!;
    const labels = [...minus.querySelectorAll('summary .in-rule__label')].map((s) => s.textContent?.trim());
    expect(labels).toEqual(['Miel avant 1 an', 'Huile de palme']);
    expect(minus.querySelector('details a[href="https://www.anses.fr"]')).not.toBeNull();
  });

  it('sépare les règles sans effet sur le score', () => {
    const info = el.querySelector('section[aria-labelledby="in-info"]')!;
    expect(info.textContent).toContain('Riche en fer');
    expect(info.textContent).toContain('De 6 à 36 mois');
  });

  it("lit l'échelle de 0 à 100", () => {
    const segs = [...el.querySelectorAll('.in-bar__seg')].map((s) => s.className);
    expect(segs[0]).toContain('discouraged');
    expect(segs[segs.length - 1]).toContain('ideal');
  });

  it("rappelle que ce n'est pas un avis médical", () => {
    expect(el.querySelector('.in-care')?.textContent).toContain("pas un professionnel de santé");
  });
});
