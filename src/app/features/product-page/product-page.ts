import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RuleCard } from '../rule-card/rule-card';
import { ScanResult, ScanService, Rule, Nutrient } from '../../services/scan';
import { Icon } from '../../shared/icon/icon';
import { NutrientGauge } from '../nutrient-gauge/nutrient-gauge';
import { BabyProfileService, ageLabel } from '../../services/baby-profile';
import { ScoreScale } from '../../shared/score-scale/score-scale';

export interface WhyLine {
  points: string;
  label: string;
  tone: 'minus' | 'plus' | 'base';
}

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [RuleCard, Icon, RouterLink, NutrientGauge, ScoreScale],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
})
export class ProductPage implements OnInit {
  private scanService = inject(ScanService);
  private route = inject(ActivatedRoute);
  private babyProfile = inject(BabyProfileService);

  ean = signal<string | null>(null);

  result = signal<ScanResult | null>(null);
  error = signal<{ title: string; message: string } | null>(null);
  loading = signal<boolean>(true);
  who = this.babyProfile.who;

  ngOnInit(): void {
    const ean = this.route.snapshot.paramMap.get('ean');
    this.ean.set(ean);
    if (ean) {
      this.scanService.scan(ean, this.babyProfile.getAge()).subscribe({
        next: (data) => {
          this.result.set(data);
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(this.describeError(err));
          this.loading.set(false);
        },
      });
    }
  }

  /** « Très bon lait pour bébé » → « Très bon lait pour Léo » ; « Bon choix » → « Bon choix pour Léo ». */
  verdict(r: ScanResult): string {
    const who = this.who();
    if (/pour bébé$/i.test(r.levelLabel)) {
      return r.levelLabel.replace(/pour bébé$/i, `pour ${who}`);
    }
    return `${r.levelLabel} pour ${who}`;
  }

  alertTitle(title: string): string {
    return title;
  }

  /**
   * Les 2 ou 3 raisons qui pèsent le plus, lisibles sans ouvrir de section.
   * Aliments : on part de 100 et seuls les défauts retirent des points.
   * Laits : base 60 pour tout lait conforme, puis bonus et malus facultatifs.
   */
  why(r: ScanResult): WhyLine[] {
    const scored = r.appliedRules.filter((rule) => rule.points !== 0 && rule.status !== 'satisfied');
    const minus = scored.filter((rule) => rule.points < 0).sort((a, b) => a.points - b.points);
    const plus = scored.filter((rule) => rule.points > 0).sort((a, b) => b.points - a.points);
    const lines: WhyLine[] = [...minus, ...plus].slice(0, 3).map((rule) => ({
      points: rule.points > 0 ? `+${rule.points}` : `−${Math.abs(rule.points)}`,
      label: rule.rule_label,
      tone: rule.points > 0 ? 'plus' : 'minus',
    }));

    if (r.isInfantFormula) {
      lines.push({ points: '60', label: 'Base commune : tout lait vendu en Europe est conforme', tone: 'base' });
    } else if (minus.length === 0) {
      lines.push({ points: '100', label: 'Aucun défaut repéré parmi nos critères', tone: 'base' });
    }
    return lines;
  }

  rulesMeta(r: ScanResult): string {
    const n = r.appliedRules.length;
    return n === 0 ? '' : `${n} critère${n > 1 ? 's' : ''}`;
  }

  ageMeta(r: ScanResult): string {
    return r.minAgeMonths !== null ? `dès ${ageLabel(r.minAgeMonths)}` : '';
  }

  rulesByCategory(category: string): Rule[] {
    return this.result()?.appliedRules?.filter((rule) => rule.category === category) ?? [];
  }

  nutrientCategories(): string[] {
    const nutrients = this.result()?.nutrients ?? [];
    const cats: string[] = [];
    for (const n of nutrients) {
      const cat = n.category || 'Nutrition';
      if (!cats.includes(cat)) cats.push(cat);
    }
    return cats;
  }

  nutrientsByCategory(category: string): Nutrient[] {
    return this.result()?.nutrients?.filter((n) => (n.category || 'Nutrition') === category) ?? [];
  }

  /** Un message par cause, toujours avec une issue. Jamais « Erreur » tout court. */
  private describeError(err: HttpErrorResponse): { title: string; message: string } {
    if (err.error?.errorTitle) {
      return { title: err.error.errorTitle, message: err.error.errorMessage ?? '' };
    }
    switch (err.status) {
      case 0:
        return {
          title: 'Pas de connexion',
          message: 'Ce produit n\'a jamais été consulté sur ce téléphone. Réessayez une fois connecté.',
        };
      case 404:
        return {
          title: 'Produit inconnu d\'Open Food Facts',
          message: 'Ce code-barres n\'existe pas encore dans la base. Vous pouvez l\'ajouter en photographiant l\'emballage.',
        };
      case 400:
        return {
          title: 'Code-barres illisible',
          message: 'Les 13 chiffres ne forment pas un code valide. Vérifiez-les sous le code-barres.',
        };
      case 429:
        return {
          title: 'Trop de scans d\'un coup',
          message: 'Attendez une minute, puis réessayez.',
        };
      default:
        return {
          title: 'Fiche indisponible pour le moment',
          message: 'La base Open Food Facts ne répond pas. Réessayez dans quelques minutes.',
        };
    }
  }
}
