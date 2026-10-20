import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScanService, AgeRange } from '../../services/scan';
import { BabyProfileService, ageLabel } from '../../services/baby-profile';

/**
 * Profil de l'enfant : mêmes gestes qu'au premier lancement (stepper + raccourcis),
 * enregistrement immédiat, effacement en deux temps.
 */
@Component({
  selector: 'app-baby-profile',
  imports: [FormsModule],
  templateUrl: './baby-profile.html',
  styleUrl: './baby-profile.scss',
})
export class BabyProfile implements OnInit {
  private scanService = inject(ScanService);
  private profile = inject(BabyProfileService);

  readonly shortcuts = [4, 6, 9, 12, 18, 24];

  ranges = signal<AgeRange[]>([]);
  name = signal(this.profile.name());
  age = signal<number | null>(this.profile.age());
  saved = signal(false);
  confirmClear = signal(false);

  ageNumber = computed(() => {
    const a = this.age();
    if (a === null) {
      return '–';
    }
    return String(a >= 12 && a % 12 === 0 ? a / 12 : a);
  });
  ageUnit = computed(() => {
    const a = this.age();
    if (a !== null && a >= 12 && a % 12 === 0) {
      return a === 12 ? 'an' : 'ans';
    }
    return 'mois';
  });
  savedText = computed(() => this.profile.label() ?? '');
  currentRange = computed(() => {
    const a = this.age();
    return a === null ? undefined : this.ranges().find((r) => a >= r.minMonths && a <= r.maxMonths);
  });

  ngOnInit(): void {
    this.scanService.getBabyProfile().subscribe((data) => this.ranges.set(data));
  }

  step(delta: number): void {
    this.setAge(Math.max(0, Math.min(36, (this.age() ?? 6) + delta)));
  }

  pick(months: number): void {
    this.setAge(months);
  }

  saveName(): void {
    this.profile.saveName(this.name());
    this.name.set(this.profile.name());
    this.flashSaved();
  }

  askClear(): void {
    this.confirmClear.set(true);
  }

  cancelClear(): void {
    this.confirmClear.set(false);
  }

  clear(): void {
    this.profile.clearAge();
    this.profile.saveName('');
    this.age.set(null);
    this.name.set('');
    this.confirmClear.set(false);
  }

  shortcutLabel(m: number): string {
    return ageLabel(m);
  }

  private setAge(months: number): void {
    this.age.set(months);
    this.profile.saveAge(months);
    this.profile.markOnboarded();
    this.flashSaved();
  }

  private flashSaved(): void {
    this.saved.set(true);
  }
}
