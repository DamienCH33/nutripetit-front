import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

/**
 * Saisie du code-barres à la main (code abîmé, caméra refusée).
 * EAN-8, UPC-A (12), EAN-13 et GTIN-14 acceptés ; espaces et tirets ignorés.
 */
@Component({
  selector: 'app-manual-entry',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './manual-entry.html',
  styleUrl: './manual-entry.scss',
})
export class ManualEntry {
  private router = inject(Router);
  ean = signal<string>('');
  touched = signal(false);

  digits = computed(() => this.ean().replace(/[\s-]/g, ''));
  error = computed(() => {
    const v = this.digits();
    if (v === '') {
      return 'Tapez les chiffres écrits sous le code-barres.';
    }
    if (!/^\d+$/.test(v)) {
      return 'Seuls les chiffres comptent : retirez les lettres.';
    }
    if (v.length < 8 || v.length > 14) {
      return `Il y a ${v.length} chiffre${v.length > 1 ? 's' : ''} : un code-barres en compte 8 ou 13 (parfois 12 ou 14).`;
    }
    return null;
  });

  onInput(value: string): void {
    this.ean.set(value);
  }

  submit(): void {
    this.touched.set(true);
    if (this.error() === null) {
      this.router.navigate(['/scan', this.digits()]);
    }
  }
}
