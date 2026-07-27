import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-manual-entry',
  standalone: true,
  imports: [FormsModule, Icon],
  templateUrl: './manual-entry.html',
  styleUrl: './manual-entry.scss',
})
export class ManualEntry {
  private router = inject(Router);
  ean = signal<string>('');

  submit(): void {
    const value = this.ean().trim();
    if (/^\d{13}$/.test(value)) {
      this.router.navigate(['/scan', value]);
    }
  }
}
