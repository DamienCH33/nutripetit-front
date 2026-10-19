import { Injectable, signal } from '@angular/core';

/** Événement non standard de Chrome/Edge/Android (absent de lib.dom). */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const installable = signal(false);

/**
 * À appeler dans main.ts AVANT bootstrapApplication : le navigateur peut
 * émettre beforeinstallprompt avant qu'Angular ait créé le moindre composant,
 * et un événement manqué ne revient pas.
 */
export function capturePwaInstallPrompt(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    installable.set(true);
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installable.set(false);
  });
}

@Injectable({ providedIn: 'root' })
export class PwaInstallService {
  readonly isStandalone =
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;

  /** iOS / iPadOS : pas d'invite d'installation, il faut passer par « Partager ». */
  readonly isIos =
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  /** Vrai quand Chrome/Edge/Android proposent l'installation. */
  readonly canPrompt = installable.asReadonly();

  async install(): Promise<boolean> {
    if (!deferredPrompt) {
      return false;
    }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    // Un événement ne sert qu'une fois.
    deferredPrompt = null;
    installable.set(false);

    return outcome === 'accepted';
  }
}
