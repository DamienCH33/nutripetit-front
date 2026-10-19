import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ProductPage } from './product-page';

const EAN = '3564706788480';

function scanResult(overrides: Record<string, unknown> = {}) {
  return {
    product: { ean: EAN, name: 'Pommes de terre poulet champignons', brand: null, image_url: null },
    finalScore: 85,
    level: 'good',
    levelLabel: 'Bon choix',
    algoVersion: '1.3.0',
    isInfantFormula: false,
    appliedRules: [],
    nutrients: [],
    environment: { bio_certified: false, palm_oil_free: false, origin: null, packaging: null },
    uniqueSources: [],
    babyAgeMonths: 9,
    minAgeMonths: null,
    dataIncomplete: false,
    criticalAlert: null,
    scoresByAge: [],
    additives: [],
    carbonFootprint: null,
    infantFormulaReference: null,
    ...overrides,
  };
}

describe('ProductPage', () => {
  let fixture: ComponentFixture<ProductPage>;
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem('nutripetit_baby_age', '9');
    localStorage.setItem('nutripetit_baby_name', 'Léo');

    await TestBed.configureTestingModule({
      imports: [ProductPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ ean: EAN }) } } },
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProductPage);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  function answer(body: object, status = 200): HTMLElement {
    const req = http.expectOne((r) => r.url === `/api/scan/${EAN}`);
    expect(req.request.params.get('age')).toBe('9');
    if (status === 200) {
      req.flush(body);
    } else {
      req.flush(body, { status, statusText: 'Unprocessable Entity' });
    }
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it("signale un score partiel quand la fiche Open Food Facts est incomplète", () => {
    const el = answer(scanResult({ dataIncomplete: true }));
    expect(el.textContent).toContain('Fiche incomplète');
  });

  it("n'affiche pas l'avertissement quand les données sont complètes", () => {
    const el = answer(scanResult());
    expect(el.textContent).not.toContain('Fiche incomplète');
  });

  it("propose de compléter la fiche Open Food Facts quand le produit est refusé", () => {
    const el = answer(
      { errorTitle: 'Produit hors du périmètre de NutriPetit', errorMessage: '…' },
      422,
    );
    expect(el.textContent).toContain('hors du périmètre');
    const link = el.querySelector(`a[href="https://fr.openfoodfacts.org/produit/${EAN}"]`);
    expect(link).not.toBeNull();
  });

  function rule(code: string, label: string, points: number) {
    return {
      rule_code: code, rule_label: label, points, reason: '', source_name: 'ANSES',
      source_url: 'https://www.anses.fr', status: 'triggered',
      category: points > 0 ? 'bonus' : points < 0 ? 'malus' : 'info', icon: '',
    };
  }

  it('dit le verdict pour cet enfant, avec le score et la tranche', () => {
    const el = answer(scanResult({ finalScore: 74, level: 'occasional', levelLabel: 'Occasionnel' }));
    expect(el.querySelector('#pp-verdict')?.textContent).toContain('Occasionnel pour Léo');
    expect(el.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe(
      'Score 74 sur 100, tranche « Occasionnel »',
    );
  });

  it('montre les 3 raisons qui pèsent le plus, défauts en premier', () => {
    answer(
      scanResult({
        appliedRules: [
          rule('organic_certified', 'Certifié bio', 0),
          rule('added_salt', 'Sel ajouté', -20),
          rule('palm_oil', 'Huile de palme', -10),
          rule('added_sugars', 'Sucres ajoutés', -30),
          rule('soy_products', 'Soja', -4),
        ],
      }),
    );
    const why = fixture.componentInstance.why(fixture.componentInstance.result()!);
    expect(why.map((w) => w.points)).toEqual(['−30', '−20', '−10']);
  });

  it('explique la base 60 sur un lait infantile', () => {
    answer(
      scanResult({
        isInfantFormula: true, finalScore: 74, levelLabel: 'Très bon lait pour bébé',
        appliedRules: [rule('formula_no_palm_oil', 'Sans huile de palme', 8), rule('formula_organic', 'Certification Bio', 6)],
      }),
    );
    const cmp = fixture.componentInstance;
    const r = cmp.result()!;
    expect(cmp.verdict(r)).toBe('Très bon lait pour Léo');
    expect(cmp.why(r).map((w) => `${w.points} ${w.label}`)).toEqual([
      '+8 Sans huile de palme',
      '+6 Certification Bio',
      '60 Base commune : tout lait vendu en Europe est conforme',
    ]);
  });

  it("masque le score quand une alerte critique s'applique (miel avant 1 an)", () => {
    const el = answer(
      scanResult({
        finalScore: 65,
        criticalAlert: { title: 'Contient du miel — interdit avant 1 an', message: 'Botulisme infantile.', source_name: 'ANSES', source_url: 'https://www.anses.fr' },
      }),
    );
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('interdit avant 1 an');
    expect(el.querySelector('#pp-verdict')).toBeNull();
    expect(el.textContent).toContain("Le score n'est pas affiché");
  });

  it('donne une issue quand le code est inconnu de la base', () => {
    const el = answer({ error: 'Produit non trouvé.' }, 404);
    expect(el.textContent).toContain("Produit inconnu d'Open Food Facts");
    expect(el.querySelector('a[href="/scanner"]')).not.toBeNull();
  });
});
