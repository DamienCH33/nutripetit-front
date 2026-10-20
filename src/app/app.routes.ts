import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { onboardingGuard } from './onboarding.guard';

// Seul l'accueil est dans le bundle initial. Les autres pages sont chargées à la
// demande : le scanner embarque ZXing (~400 kB), inutile pour qui saisit un EAN.
export const routes: Routes = [
  // pathMatch 'full' obligatoire : en 'prefix' (défaut), '' correspond aussi à
  // /bienvenue, la garde redirige vers /bienvenue… qui la redéclenche : boucle infinie.
  { path: '', pathMatch: 'full', component: Home, title: 'NutriPetit', canMatch: [onboardingGuard] },
  {
    path: 'bienvenue',
    loadComponent: () => import('./features/onboarding/onboarding').then((m) => m.Onboarding),
    title: 'Bienvenue — NutriPetit',
  },
  {
    path: 'saisie-manuelle',
    loadComponent: () => import('./features/manual-entry/manual-entry').then((m) => m.ManualEntry),
    title: 'Saisie manuelle — NutriPetit',
  },
  {
    path: 'scan/:ean',
    loadComponent: () => import('./features/product-page/product-page').then((m) => m.ProductPage),
    title: 'Fiche produit — NutriPetit',
  },
  {
    path: 'infos',
    loadComponent: () => import('./features/info/info').then((m) => m.Info),
    title: 'Comment on note — NutriPetit',
  },
  {
    path: 'historique',
    loadComponent: () => import('./features/history/history').then((m) => m.History),
    title: 'Historique — NutriPetit',
  },
  {
    path: 'profil-bebe',
    loadComponent: () => import('./features/baby-profile/baby-profile').then((m) => m.BabyProfile),
    title: 'Profil bébé — NutriPetit',
  },
  {
    path: 'scanner',
    loadComponent: () => import('./features/scanner/scanner').then((m) => m.Scanner),
    title: 'Scanner — NutriPetit',
  },
  // Route inconnue : retour à l'accueil plutôt qu'une page blanche.
  { path: '**', redirectTo: '' },
];
