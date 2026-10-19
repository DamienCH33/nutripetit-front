import { isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { capturePwaInstallPrompt } from './app/services/pwa-install';

capturePwaInstallPrompt();

// Le service worker et le manifest sont servis par Symfony à la racine du
// domaine (/sw.js, /manifest.json) : scope « / », il couvre la vitrine et /app.
// En dev (ng serve), ils n'existent pas : on n'enregistre rien.
if (!isDevMode() && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
