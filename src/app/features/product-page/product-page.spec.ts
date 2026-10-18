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
});
