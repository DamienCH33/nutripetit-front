import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon/icon';
import { ScanService, HistoryData } from '../../services/scan';
import { BabyProfileService, ageLabel } from '../../services/baby-profile';
import { PwaInstallService } from '../../services/pwa-install';
import { shortLabel } from '../../shared/score-scale';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, Icon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private scanService = inject(ScanService);
  protected profile = inject(BabyProfileService);
  protected pwa = inject(PwaInstallService);
  showIosHelp = signal(false);

  recentScans = signal<HistoryData['results']>([]);
  ageText = computed(() => {
    const age = this.profile.age();
    return age === null ? '' : ageLabel(age);
  });

  ngOnInit(): void {
    this.scanService.getHistory().subscribe({
      next: (data) => this.recentScans.set(data.results.slice(0, 3)),
      // Hors ligne ou API indisponible : l'accueil reste utilisable sans la liste.
      error: () => this.recentScans.set([]),
    });
  }

  label(level: string): string {
    return shortLabel(level);
  }

  /** Bouton visible si Chrome propose l'installation, ou sur iPhone hors appli. */
  showInstall(): boolean {
    return !this.pwa.isStandalone && (this.pwa.canPrompt() || this.pwa.isIos);
  }

  async onInstall(): Promise<void> {
    if (this.pwa.canPrompt()) {
      await this.pwa.install();
    } else if (this.pwa.isIos) {
      this.showIosHelp.set(true);
    }
  }
}
