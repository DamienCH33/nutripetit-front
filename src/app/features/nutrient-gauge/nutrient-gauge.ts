import { Component, Input } from '@angular/core';
import { Nutrient } from '../../services/scan';

@Component({
  selector: 'app-nutrient-gauge',
  standalone: true,
  templateUrl: './nutrient-gauge.html',
  styleUrl: './nutrient-gauge.scss',
})
export class NutrientGauge {
  @Input({ required: true }) nutrient!: Nutrient;

  get position(): number {
    if (this.nutrient.value === null || !this.nutrient.max_scale) return 0;
    return Math.min(100, Math.round((this.nutrient.value / this.nutrient.max_scale) * 1000) / 10);
  }

  get thresholdPosition(): number {
    if (this.nutrient.threshold_baby === null || !this.nutrient.max_scale) return 0;
    return Math.round((this.nutrient.threshold_baby / this.nutrient.max_scale) * 1000) / 10;
  }
}
