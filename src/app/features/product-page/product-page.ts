import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductHeader } from '../product-header/product-header';
import { RuleCard } from '../rule-card/rule-card';
import { ScoreCircle } from '../score-circle/score-circle';
import { ScanResult, ScanService } from '../../services/scan';

type Rule = ScanResult['score']['appliedRules'][number];

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [ProductHeader, ScoreCircle, RuleCard],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
})
export class ProductPage implements OnInit {
  private scanService = inject(ScanService);

  result = signal<ScanResult | null>(null);

  ngOnInit(): void {
    this.scanService.scan('3041091342034').subscribe((data) => {
      this.result.set(data);
    });
  }

  rulesByCategory(category: string): Rule[] {
    return this.result()?.score.appliedRules?.filter((rule) => rule.category === category) ?? [];
  }
}
