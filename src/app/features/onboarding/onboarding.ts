import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BabyProfileService, ageLabel } from '../../services/baby-profile';

/**
 * Premier lancement : une seule question, l'âge. Il change le score
 * (sel avant 1 an, miel, fer dès 6 mois…), donc on le demande avant tout.
 */
@Component({
  selector: 'app-onboarding',
  imports: [FormsModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
})
export class Onboarding {
  private profile = inject(BabyProfileService);
  private router = inject(Router);

  readonly shortcuts = [4, 6, 9, 12, 18, 24];

  name = signal(this.profile.name());
  age = signal(this.profile.age() ?? 6);

  ageText = computed(() => ageLabel(this.age()));
  ageNumber = computed(() => {
    const a = this.age();
    return a >= 12 && a % 12 === 0 ? a / 12 : a;
  });
  ageUnit = computed(() => {
    const a = this.age();
    if (a >= 12 && a % 12 === 0) {
      return a === 12 ? 'an' : 'ans';
    }
    return 'mois';
  });
  ctaLabel = computed(() => {
    const n = this.name().trim();
    return n ? `Commencer avec ${n}, ${this.ageText()}` : `Commencer : ${this.ageText()}`;
  });

  step(delta: number): void {
    this.age.update((a) => Math.max(0, Math.min(36, a + delta)));
  }

  pick(months: number): void {
    this.age.set(months);
  }

  start(): void {
    this.profile.saveName(this.name());
    this.profile.saveAge(this.age());
    this.profile.markOnboarded();
    this.router.navigateByUrl('/');
  }

  later(): void {
    this.profile.markOnboarded();
    this.router.navigateByUrl('/');
  }
}
