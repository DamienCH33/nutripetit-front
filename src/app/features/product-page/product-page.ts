import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductHeader } from '../product-header/product-header';
import { RuleCard } from '../rule-card/rule-card';
import { ScoreCircle } from '../score-circle/score-circle';
import { ScanResult, ScanService, Rule } from '../../services/scan';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [ProductHeader, ScoreCircle, RuleCard, Icon],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
})
export class ProductPage implements OnInit {
  private scanService = inject(ScanService);

  result = signal<ScanResult | null>(null);
  activeTab = signal<string>('rules');

  ngOnInit(): void {
    this.scanService.scan('3041091342034').subscribe((data) => {
      this.result.set(data);
    });
  }

  rulesByCategory(category: string): Rule[] {
    return this.result()?.appliedRules?.filter((rule) => rule.category === category) ?? [];
  }

  setTab(tab: string): void {
    this.activeTab.set(tab);
  }
}
