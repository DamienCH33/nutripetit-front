import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { BabyProfileService } from './services/baby-profile';

/**
 * L'accueil passe par l'écran « âge » tant que le parent n'y a pas répondu.
 * Les liens directs vers une fiche (/scan/…) restent ouverts : on ne bloque
 * pas quelqu'un qui arrive par un partage.
 */
export const onboardingGuard: CanMatchFn = () => {
  const profile = inject(BabyProfileService);
  return profile.isOnboarded() ? true : inject(Router).parseUrl('/bienvenue');
};
