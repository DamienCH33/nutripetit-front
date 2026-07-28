import { Component, inject, OnInit, signal } from '@angular/core';
import { ScanService, AgeRange } from '../../services/scan';
import { BabyProfileService } from '../../services/baby-profile';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-baby-profile',
  imports: [Icon],
  templateUrl: './baby-profile.html',
  styleUrl: './baby-profile.scss',
})
export class BabyProfile implements OnInit {
  private scanService = inject(ScanService);
  private babyProfileService = inject(BabyProfileService);
  showSaved = signal<boolean>(false);

  ranges = signal<AgeRange[]>([]);
  age = signal<number>(12);

  ngOnInit(): void {
    this.scanService.getBabyProfile().subscribe((data) => this.ranges.set(data));
    const stored = this.babyProfileService.getAge();
    if (stored !== null) {
      this.age.set(stored);
    }
  }

  // trouve la tranche qui contient l'âge actuel
  currentRange(): AgeRange | undefined {
    return this.ranges().find((r) => this.age() >= r.minMonths && this.age() <= r.maxMonths);
  }

  // appelée quand on bouge le slider
  onAgeChange(value: number): void {
    this.age.set(value);
    this.babyProfileService.saveAge(value);
    this.showSaved.set(true);
    setTimeout(() => this.showSaved.set(false), 5000);
  }

  reset(): void {
    this.babyProfileService.clearAge();
    this.age.set(12);
  }
}
