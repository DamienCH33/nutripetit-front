import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ScanResult {
  product: {
    ean: string;
    name: string;
    brand: string | null;
    imageUrl: string | null;
  };
  score: {
    finalScore: number;
    level: string;
    appliedRules: Array<{
      rule_code: string;
      rule_label: string;
      points: number;
      reason: string;
      source_name: string;
      source_url: string;
      status: string;
      category: string;
    }>;
    algoVersion: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ScanService {
  private http = inject(HttpClient);

  scan(ean: string) {
    return this.http.get<ScanResult>('/api/scan/' + ean);
  }
}
