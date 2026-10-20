import { Component, computed, input } from '@angular/core';
import { scaleFor } from '../score-scale';

/**
 * Échelle horizontale du score : une tranche par niveau, à la largeur de ses
 * seuils réels, et un repère à la position du score. Le niveau est écrit en
 * toutes lettres sous l'échelle : l'information ne repose pas sur la couleur.
 */
@Component({
  selector: 'app-score-scale',
  template: `
    <div class="sc" role="img" [attr.aria-label]="ariaLabel()">
      <div class="sc__bar">
        @for (s of segments(); track s.level) {
          <span
            [class]="'sc__seg np-fill--' + s.level"
            [class.sc__seg--off]="s.level !== level()"
            [style.flex-grow]="s.to - s.from + 1"
          ></span>
        }
        <span class="sc__mark" [style.left.%]="score()"></span>
      </div>
      <div class="sc__labels" aria-hidden="true">
        <span>0</span>
        <span [class]="'sc__lbl np-ink--' + level()" [style.left.%]="labelPos()">{{ activeLabel() }}</span>
        <span>100</span>
      </div>
    </div>
  `,
  styles: `
    .sc { display: flex; flex-direction: column; gap: 6px; }
    .sc__bar { position: relative; display: flex; gap: 3px; height: 12px; }
    .sc__seg { flex-basis: 0; border-radius: 3px; }
    .sc__seg:first-child { border-radius: 6px 3px 3px 6px; }
    .sc__seg:nth-last-child(2) { border-radius: 3px 6px 6px 3px; }
    .sc__seg--off { opacity: 0.3; }
    .sc__mark {
      position: absolute; top: -6px; width: 4px; height: 24px; margin-left: -2px;
      background: var(--np-ink); border-radius: 2px; box-shadow: 0 0 0 3px var(--np-surface);
    }
    /* Une seule étiquette, sous le repère : les tranches étroites (Idéal = 4 points)
       ne laissent pas la place d'écrire chaque niveau sans chevauchement. */
    .sc__labels { position: relative; display: flex; justify-content: space-between; height: 18px; font-size: 12px; color: var(--np-ink-2); }
    .sc__lbl { position: absolute; top: 0; transform: translateX(-50%); font-weight: 700; white-space: nowrap; }
  `,
})
export class ScoreScale {
  score = input.required<number>();
  level = input.required<string>();
  infantFormula = input(false);

  segments = computed(() => scaleFor(this.infantFormula()));

  activeLabel = computed(() => this.segments().find((s) => s.level === this.level())?.label ?? '');

  /** Centrée sur le repère, sans déborder des bords ni masquer « 0 » et « 100 ». */
  labelPos = computed(() => Math.max(22, Math.min(78, this.score())));

  ariaLabel = computed(() => {
    const seg = this.segments().find((s) => s.level === this.level());
    return `Score ${this.score()} sur 100, tranche « ${seg?.label ?? this.level()} »`;
  });
}
