import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Rule {
  rule_code: string;
  rule_label: string;
  points: number;
  reason: string;
  source_name: string;
  source_url: string;
  status: string;
  category: string;
  icon: string;
}

export interface Source {
  name: string;
  url: string;
  rules: string[];
}

export interface Nutrient {
  name: string;
  category: string;
  available: boolean;
  value: number | null;
  unit: string;
  threshold_baby: number | null;
  max_scale: number;
  level: string;
  message: string;
  reference: string;
}

export interface AgeScore {
  months: number;
  score: number;
  level: string;
  label: string;
}

export interface ScanResult {
  product: {
    ean: string;
    name: string;
    brand: string | null;
    image_url: string | null;
  };
  finalScore: number;
  level: string;
  levelLabel: string;
  algoVersion: string;
  isInfantFormula: boolean;
  appliedRules: Rule[];
  nutrients: Nutrient[];
  environment: {
    bio_certified: boolean;
    /** null : liste d'ingrédients absente, impossible de conclure. */
    palm_oil_free: boolean | null;
    origin: { country: string; flag: string } | null;
    packaging: unknown | null;
  };
  uniqueSources: Source[];
  babyAgeMonths: number | null;
  minAgeMonths: number | null;
  dataIncomplete: boolean;
  criticalAlert: { title: string; message: string; source_name: string; source_url: string } | null;
  scoresByAge: AgeScore[];
  additives: Additive[];
  carbonFootprint: CarbonFootprint | null;
  infantFormulaReference?: {
    type: string;
    label: string;
    energy: number;
    proteins: number;
  } | null;
}

export interface InfoData {
  algoVersion: string;
  infantFormulaAlgoVersion: string;
  rules: Array<{
    code: string;
    label: string;
    description: string;
    pointsImpact: number;
    sourceName: string;
    sourceUrl: string;
    ageMinMonths: number | null;
    ageMaxMonths: number | null;
  }>;
  scoreScale: Array<{
    level: string;
    min: number;
    max: number;
    label: string;
    description: string;
  }>;
  infantFormulaRules: Array<{
    code: string;
    label: string;
    points: number;
    reason: string;
    source: string;
    category: string;
  }>;
  sources: Array<{ name: string; description: string; url: string }>;
}

export interface HistoryData {
  results: Array<{
    product: {
      ean: string;
      name: string;
      brand: string | null;
      imageUrl: string | null;
    };
    finalScore: number;
    level: string;
    calculatedAt: string;
  }>;
  total: number;
  page: number;
  lastPage: number;
}

export interface AgeRange {
  code: string;
  label: string;
  minMonths: number;
  maxMonths: number;
  description: string;
}

export interface Additive {
  code: string;
  name: string;
  /** Absents tant que l'API n'est pas à jour : la fiche affiche alors code et nom seuls. */
  status?: 'controversial' | 'sweetener' | 'authorized';
  note?: string;
}

export interface CarbonFootprint {
  value: number;
  unit: string;
  car_km: number;
}

@Injectable({ providedIn: 'root' })
export class ScanService {
  private http = inject(HttpClient);
  private readonly api = environment.apiUrl + '/api';

  /**
   * L'âge (en mois) active les règles par tranche d'âge côté API (sel avant 1 an,
   * miel, fer…). Sans lui, l'API n'applique que les règles valables de 0 à 36 mois.
   */
  scan(ean: string, ageMonths: number | null = null) {
    const params: Record<string, string> = ageMonths === null ? {} : { age: String(ageMonths) };
    return this.http.get<ScanResult>(`${this.api}/scan/${ean}`, { params, withCredentials: true });
  }
  getInfo() {
    return this.http.get<InfoData>(`${this.api}/info`, { withCredentials: true });
  }
  getHistory() {
    return this.http.get<HistoryData>(`${this.api}/history`, { withCredentials: true });
  }
  getBabyProfile() {
    return this.http.get<AgeRange[]>(`${this.api}/baby-profile`, { withCredentials: true });
  }
  clearHistory() {
    const token = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(18))));

    const isHttps = window.location.protocol === 'https:';
    const base = 'submit_' + token + '=submit; path=/; samesite=strict';
    document.cookie = isHttps ? '__Host-' + base + '; secure' : base;

    return this.http.post(
      `${this.api}/history/clear`,
      {},
      {
        headers: { submit: token },
        withCredentials: true,
      },
    );
  }
}
