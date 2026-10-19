import { Injectable, computed, signal } from '@angular/core';

/**
 * Profil de l'enfant, stocké uniquement sur ce téléphone (localStorage).
 * L'âge part à l'API au moment d'un scan (?age=), jamais le prénom.
 */
@Injectable({ providedIn: 'root' })
export class BabyProfileService {
  private readonly KEY = 'nutripetit_baby_age';
  private readonly NAME_KEY = 'nutripetit_baby_name';
  private readonly ONBOARDED_KEY = 'nutripetit_onboarded';

  private readonly ageSig = signal<number | null>(this.readAge());
  private readonly nameSig = signal<string>(this.read(this.NAME_KEY) ?? '');

  readonly age = this.ageSig.asReadonly();
  readonly name = this.nameSig.asReadonly();

  /** « Léo · 9 mois », « 9 mois », ou null si l'âge est inconnu. */
  readonly label = computed(() => {
    const age = this.ageSig();
    if (age === null) {
      return null;
    }
    const name = this.nameSig().trim();
    return name ? `${name} · ${ageLabel(age)}` : ageLabel(age);
  });

  /** Pour qui le score est calculé, en toutes lettres : « Léo », « votre enfant ». */
  readonly who = computed(() => this.nameSig().trim() || 'votre enfant');

  saveAge(age: number): void {
    const clamped = Math.max(0, Math.min(36, Math.round(age)));
    this.write(this.KEY, String(clamped));
    this.ageSig.set(clamped);
  }

  getAge(): number | null {
    return this.ageSig();
  }

  clearAge(): void {
    this.remove(this.KEY);
    this.ageSig.set(null);
  }

  saveName(name: string): void {
    const clean = name.trim().slice(0, 30);
    if (clean) {
      this.write(this.NAME_KEY, clean);
    } else {
      this.remove(this.NAME_KEY);
    }
    this.nameSig.set(clean);
  }

  /** Vrai quand le parent a répondu à l'écran de premier lancement (ou l'a passé). */
  isOnboarded(): boolean {
    return this.read(this.ONBOARDED_KEY) === '1' || this.ageSig() !== null;
  }

  markOnboarded(): void {
    this.write(this.ONBOARDED_KEY, '1');
  }

  private readAge(): number | null {
    const value = this.read(this.KEY);
    if (value === null || value === '' || Number.isNaN(Number(value))) {
      return null;
    }
    return Number(value);
  }

  // localStorage peut lever une exception (navigation privée, stockage bloqué) :
  // l'appli doit continuer à marcher, sans mémoriser.
  private read(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private write(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* stockage indisponible : valeur gardée en mémoire seulement */
    }
  }

  private remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      /* idem */
    }
  }
}

/** 9 → « 9 mois », 12 → « 1 an », 24 → « 2 ans », 18 → « 18 mois ». */
export function ageLabel(months: number): string {
  if (months >= 12 && months % 12 === 0) {
    const years = months / 12;
    return years === 1 ? '1 an' : `${years} ans`;
  }
  return `${months} mois`;
}
