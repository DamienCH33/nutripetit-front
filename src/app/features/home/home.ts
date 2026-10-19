import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon/icon';
import { ScanService, HistoryData } from '../../services/scan';
import { BabyProfileService } from '../../services/baby-profile';
import { PwaInstallService } from '../../services/pwa-install';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, Icon, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private scanService = inject(ScanService);
  private babyProfileService = inject(BabyProfileService);
  protected pwa = inject(PwaInstallService);
  showIosHelp = signal(false);

  recentScans = signal<HistoryData['results']>([]);

  ngOnInit(): void {
    this.scanService.getHistory().subscribe((data) => {
      this.recentScans.set(data.results.slice(0, 3));
    });
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

  hasAge(): boolean {
    return this.babyProfileService.getAge() !== null;
  }

  scoreOffset(score: number): number {
    return (100 - score) * 1.256;
  }
}
