import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductHeader } from '../product-header/product-header';
import { RuleCard } from '../rule-card/rule-card';
import { ScoreCircle } from '../score-circle/score-circle';
import { ScanResult, ScanService, Rule } from '../../services/scan';
import { Icon } from '../../shared/icon/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [ProductHeader, ScoreCircle, RuleCard, Icon, RouterLink],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
})
export class ProductPage implements OnInit {
  private scanService = inject(ScanService);
  private route = inject(ActivatedRoute);

  result = signal<ScanResult | null>(null);
  activeTab = signal<string>('rules');
  error = signal<{ title: string; message: string } | null>(null);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    const ean = this.route.snapshot.paramMap.get('ean');
    if (ean) {
      this.scanService.scan(ean).subscribe({
        next: (data) => {
          this.result.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set({
            title: err.error?.errorTitle ?? 'Erreur',
            message: err.error?.errorMessage ?? 'Impossible de charger ce produit.',
          });
          this.loading.set(false);
        },
      });
    }
  }
  rulesByCategory(category: string): Rule[] {
    return this.result()?.appliedRules?.filter((rule) => rule.category === category) ?? [];
  }

  setTab(tab: string): void {
    this.activeTab.set(tab);
  }
}
