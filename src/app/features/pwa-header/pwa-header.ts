import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BabyProfileService } from '../../services/baby-profile';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-pwa-header',
  imports: [RouterLink, Icon],
  templateUrl: './pwa-header.html',
  styleUrl: './pwa-header.scss',
})
export class PwaHeader {
  protected profile = inject(BabyProfileService);

  /** Initiale du prénom, ou un point d'interrogation tant que rien n'est renseigné. */
  protected initial = computed(() => {
    const name = this.profile.name().trim();
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    return this.profile.age() === null ? '?' : '•';
  });
}
