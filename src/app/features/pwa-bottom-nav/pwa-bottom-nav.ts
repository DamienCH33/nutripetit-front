import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-pwa-bottom-nav',
  imports: [Icon, RouterLink],
  templateUrl: './pwa-bottom-nav.html',
  styleUrl: './pwa-bottom-nav.scss',
})
export class PwaBottomNav {}
