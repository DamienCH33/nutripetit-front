import { TestBed } from '@angular/core/testing';

import { PwaInstallService, capturePwaInstallPrompt } from './pwa-install';

describe('PwaInstallService', () => {
  it("garde l'invite d'installation émise avant le démarrage de l'appli et la rejoue au clic", async () => {
    capturePwaInstallPrompt();

    // Le navigateur émet l'événement avant qu'aucun composant n'existe.
    const prompt = vi.fn().mockResolvedValue(undefined);
    const event = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
      prompt,
      userChoice: Promise.resolve({ outcome: 'accepted' as const }),
    });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);

    const service = TestBed.inject(PwaInstallService);
    expect(service.canPrompt()).toBe(true);

    expect(await service.install()).toBe(true);
    expect(prompt).toHaveBeenCalledOnce();
    // Un événement ne sert qu'une fois.
    expect(service.canPrompt()).toBe(false);
  });
});
