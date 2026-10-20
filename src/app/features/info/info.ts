import { Component, inject, OnInit, signal } from '@angular/core';
import { ScanService, InfoData } from '../../services/scan';

type Rule = InfoData['rules'][number];
type Tier = InfoData['scoreScale'][number];

@Component({
  selector: 'app-info',
  standalone: true,
  templateUrl: './info.html',
  styleUrl: './info.scss',
})
export class Info implements OnInit {
  private scanService = inject(ScanService);
  data = signal<InfoData | null>(null);

  ngOnInit(): void {
    this.scanService.getInfo().subscribe((d) => this.data.set(d));
  }

  /** Défauts, du plus lourd au plus léger. */
  minusRules(d: InfoData): Rule[] {
    return d.rules.filter((r) => r.pointsImpact < 0).sort((a, b) => a.pointsImpact - b.pointsImpact);
  }

  /** Règles affichées sur la fiche sans retirer de points (badges, allergènes). */
  infoRules(d: InfoData): Rule[] {
    return d.rules.filter((r) => r.pointsImpact >= 0);
  }

  /** L'échelle se lit de gauche (0) à droite (100). */
  scaleAscending(d: InfoData): Tier[] {
    return [...d.scoreScale].sort((a, b) => a.min - b.min);
  }

  ageLabel(min: number | null, max: number | null): string {
    if (min === null && max === null) {
      return 'Tous âges';
    }
    const from = min ?? 0;
    const to = max ?? 36;
    return from === 0 && to === 36 ? 'De 0 à 3 ans' : `De ${from} à ${to} mois`;
  }
}
