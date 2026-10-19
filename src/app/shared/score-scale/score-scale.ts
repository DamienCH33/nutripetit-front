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
        @for (s of segments(); track s.level) {
          <span
            [style.flex-grow]="s.to - s.from + 1"
            [class]="s.level === level() ? 'sc__lbl sc__lbl--on np-ink--' + s.level : 'sc__lbl'"
          >{{ s.label }}</span>
        }
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
    .sc__labels { display: flex; gap: 3px; font-size: 12px; color: var(--np-ink-2); }
    .sc__lbl { flex-basis: 0; min-width: 0; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sc__lbl--on { font-weight: 700; overflow: visible; }
  `,
})
export class ScoreScale {
  score = input.required<number>();
  level = input.required<string>();
  infantFormula = input(false);

  segments = computed(() => scaleFor(this.infantFormula()));

  ariaLabel = computed(() => {
    const seg = this.segments().find((s) => s.level === this.level());
    return `Score ${this.score()} sur 100, tranche « ${seg?.label ?? this.level()} »`;
  });
}
