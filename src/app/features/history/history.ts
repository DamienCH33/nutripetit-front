import { Component, ElementRef, computed, inject, OnInit, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ScanService, HistoryData } from '../../services/scan';
import { BabyProfileService } from '../../services/baby-profile';
import { Icon } from '../../shared/icon/icon';
import { shortLabel } from '../../shared/score-scale';

type HistoryItem = HistoryData['results'][number];

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [RouterLink, Icon],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class History implements OnInit {
  private scanService = inject(ScanService);
  protected profile = inject(BabyProfileService);

  data = signal<HistoryData | null>(null);
  loadError = signal<string | null>(null);
  clearing = signal(false);
  clearError = signal<string | null>(null);
  notice = signal<string | null>(null);

  private sheet = viewChild<ElementRef<HTMLDialogElement>>('sheet');

  /** Scans regroupés par jour : « Aujourd'hui », « Hier », puis la date. */
  groups = computed(() => {
    const results = this.data()?.results ?? [];
    const out: { day: string; items: HistoryItem[] }[] = [];
    for (const item of results) {
      const day = dayLabel(new Date(item.calculatedAt));
      const last = out[out.length - 1];
      if (last && last.day === day) {
        last.items.push(item);
      } else {
        out.push({ day, items: [item] });
      }
    }
    return out;
  });

  total = computed(() => this.data()?.total ?? 0);

  ngOnInit(): void {
    this.load();
  }

  label(level: string): string {
    return shortLabel(level);
  }

  openClear(): void {
    this.clearError.set(null);
    this.sheet()?.nativeElement.showModal();
  }

  closeClear(): void {
    this.sheet()?.nativeElement.close();
  }

  confirmClear(): void {
    const count = this.total();
    this.clearing.set(true);
    this.scanService.clearHistory().subscribe({
      next: () => {
        this.clearing.set(false);
        this.closeClear();
        this.notice.set(`${count} produit${count > 1 ? 's' : ''} effacé${count > 1 ? 's' : ''}.`);
        this.load();
      },
      error: () => {
        this.clearing.set(false);
        this.clearError.set("L'historique n'a pas été effacé : le serveur ne répond pas. Réessayez.");
      },
    });
  }

  private load(): void {
    this.scanService.getHistory().subscribe({
      next: (d) => {
        this.data.set(d);
        this.loadError.set(null);
      },
      error: (err: HttpErrorResponse) =>
        this.loadError.set(
          err.status === 0
            ? "Pas de connexion : l'historique s'affichera au retour du réseau."
            : "L'historique ne se charge pas pour le moment. Réessayez dans un instant.",
        ),
    });
  }
}

function dayLabel(date: Date): string {
  const today = new Date();
  const d0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diff = Math.round((d0 - d) / 86_400_000);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return 'Hier';
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}
