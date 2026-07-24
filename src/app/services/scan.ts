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

@Injectable({ providedIn: 'root' })
export class ScanService {
  private http = inject(HttpClient);

  scan(ean: string) {
    return this.http.get<ScanResult>('/api/scan/' + ean, { withCredentials: true });
  }
}
