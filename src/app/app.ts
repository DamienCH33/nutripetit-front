import { Component, inject, signal, OnInit } from '@angular/core';
import { PwaHeader } from './features/pwa-header/pwa-header';
import { PwaBottomNav } from './features/pwa-bottom-nav/pwa-bottom-nav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Icon } from './shared/icon/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PwaHeader, PwaBottomNav, RouterOutlet, RouterLink, Icon],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
