import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScanService, HistoryData } from '../../services/scan';
import { Icon } from '../../shared/icon/icon';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [RouterLink, Icon, DatePipe],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class History implements OnInit {
  private scanService = inject(ScanService);
  data = signal<HistoryData | null>(null);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.scanService.getHistory().subscribe((d) => this.data.set(d));
  }

  onClear(): void {
    if (!confirm("Effacer tout l'historique ? Cette action est irréversible.")) {
      return;
    }
    this.scanService.clearHistory().subscribe({
      next: () => this.load(),
      error: () => alert('La suppression a échoué. Réessaie.'),
    });
  }
}
