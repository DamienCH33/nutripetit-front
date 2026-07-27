import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  level: string;
  message: string;
  reference: string;
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
    palm_oil_free: boolean;
    origin: { country: string; flag: string } | null;
    packaging: unknown | null;
  };
  uniqueSources: Source[];
  babyAgeMonths: number | null;
  minAgeMonths: number | null;
  dataIncomplete: boolean;
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

@Injectable({ providedIn: 'root' })
export class ScanService {
  private http = inject(HttpClient);

  scan(ean: string) {
    return this.http.get<ScanResult>('/api/scan/' + ean, { withCredentials: true });
  }
  getInfo() {
    return this.http.get<InfoData>('/api/info', { withCredentials: true });
  }
}
