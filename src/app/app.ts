import { Component, inject, signal, OnInit } from '@angular/core';
import { ScoreCircle } from './features/score-circle/score-circle';
import { ProductHeader } from './features/product-header/product-header';
import { RuleCard } from './features/rule-card/rule-card';
import { PwaHeader } from './features/pwa-header/pwa-header';
import { PwaBottomNav } from './features/pwa-bottom-nav/pwa-bottom-nav';
import { ScanService, ScanResult } from './services/scan';

type Rule = ScanResult['score']['appliedRules'][number];

@Component({
  selector: 'app-root',
  imports: [ScoreCircle, ProductHeader, RuleCard, PwaHeader, PwaBottomNav],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private scanService = inject(ScanService);
  result = signal<ScanResult | null>(null);

  ngOnInit(): void {
    this.scanService.scan('3041091342034').subscribe((data) => {
      this.result.set(data);
    });
  }

  rulesByCategory(category: string): Rule[] {
    const rules = this.result()?.score.appliedRules ?? [];
    return rules.filter((rule) => rule.category === category);
  }
}
