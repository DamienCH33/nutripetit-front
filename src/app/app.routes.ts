import { Routes } from '@angular/router';
import { ProductPage } from './features/product-page/product-page';
import { ManualEntry } from './features/manual-entry/manual-entry';

export const routes: Routes = [
  { path: '', component: ManualEntry },
  { path: 'scan/:ean', component: ProductPage },
];
