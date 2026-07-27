import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { ManualEntry } from './features/manual-entry/manual-entry';
import { ProductPage } from './features/product-page/product-page';
import { Info } from './features/info/info';
import { History } from './features/history/history';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'saisie-manuelle', component: ManualEntry },
  { path: 'scan/:ean', component: ProductPage },
  { path: 'infos', component: Info },
  { path: 'historique', component: History },
];
