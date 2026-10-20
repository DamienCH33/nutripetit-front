import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { PwaHeader } from './features/pwa-header/pwa-header';
import { PwaBottomNav } from './features/pwa-bottom-nav/pwa-bottom-nav';

/** Écrans plein cadre, sans en-tête ni barre du bas. */
const BARE_ROUTES = ['/bienvenue', '/scanner'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PwaHeader, PwaBottomNav, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private router = inject(Router);

  protected bare = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => BARE_ROUTES.some((r) => e.urlAfterRedirects.startsWith(r))),
    ),
    { initialValue: false },
  );
}
