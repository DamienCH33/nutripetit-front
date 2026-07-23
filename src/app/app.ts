import { Component, inject, signal, OnInit } from '@angular/core';
import { PwaHeader } from './features/pwa-header/pwa-header';
import { PwaBottomNav } from './features/pwa-bottom-nav/pwa-bottom-nav';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PwaHeader, PwaBottomNav, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
