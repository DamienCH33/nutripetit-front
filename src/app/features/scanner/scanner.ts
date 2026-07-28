import {
  Component,
  signal,
  viewChild,
  ElementRef,
  inject,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon/icon';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';
import type { IScannerControls } from '@zxing/browser';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [Icon, RouterLink],
  templateUrl: './scanner.html',
  styleUrl: './scanner.scss',
})
export class Scanner implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private consecutiveDetections = new Map<string, number>();
  private codeReader?: BrowserMultiFormatReader;
  private controls?: IScannerControls;
  private activeStream?: MediaStream;

  videoElement = viewChild<ElementRef<HTMLVideoElement>>('videoElement');

  status = signal<string>('Démarrage de la caméra…');
  error = signal<string | null>(null);

  ngAfterViewInit(): void {
    this.start();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  stop(): void {
    if (this.controls) {
      this.controls.stop();
      this.controls = undefined;
    }
    if (this.activeStream) {
      this.activeStream.getTracks().forEach((t) => t.stop());
      this.activeStream = undefined;
    }
    this.status.set('Scanner arrêté.');
  }

  handleResult(ean: string) {
    // UPC-A = EAN-13 dont le premier chiffre est 0 (norme GS1).
    if (/^\d{12}$/.test(ean)) {
      ean = '0' + ean;
    }

    if (!/^\d{13}$/.test(ean)) {
      this.status.set(`Continuez à scanner...`);
      return;
    }

    // Validation checksum EAN-13 côté JS
    if (!this.isValidEan13(ean)) {
      this.status.set('Code détecté invalide, continuez...');
      return;
    }

    // Demander 2 détections identiques avant d'accepter
    const count = (this.consecutiveDetections.get(ean) || 0) + 1;
    this.consecutiveDetections.set(ean, count);

    if (count < 2) {
      this.status.set(`Validation en cours... (${count}/2)`);
      return;
    }

    this.stop();
    this.status.set(`Code validé : ${ean}. Redirection...`);

    this.router.navigate(['/scan', ean]);
  }

  isValidEan13(ean: string) {
    if (!/^\d{13}$/.test(ean)) return false;
    const digits = ean.split('').map(Number);
    const checksum = digits.pop();
    let sum = 0;
    digits.forEach((d, i) => {
      sum += d * (i % 2 === 0 ? 1 : 3);
    });
    return (10 - (sum % 10)) % 10 === checksum;
  }

  private async start(): Promise<void> {
    const video = this.videoElement()?.nativeElement;
    if (!video) return;

    // 1. Configurer ZXing : ne lire que EAN-13 et UPC-A
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13, BarcodeFormat.UPC_A]);
    hints.set(DecodeHintType.TRY_HARDER, true);
    this.codeReader = new BrowserMultiFormatReader(hints, {
      delayBetweenScanAttempts: 100,
      delayBetweenScanSuccess: 1000,
    });

    try {
      // 2. Ouvrir la caméra arrière
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });

      // 3. Brancher le flux sur la vidéo
      video.srcObject = stream;
      await video.play();
      this.activeStream = stream;
      this.status.set('Pointez le code-barres dans le cadre.');

      // 4. Décoder en continu : à chaque code lu → handleResult
      this.controls = await this.codeReader.decodeFromVideoElement(video, (result) => {
        if (result) {
          this.handleResult(result.getText());
        }
      });
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        this.error.set('Accès caméra refusé. Activez-le dans les paramètres du navigateur.');
      } else if (err.name === 'NotFoundError') {
        this.error.set('Aucune caméra disponible.');
      } else {
        this.error.set('Erreur caméra : ' + err.message);
      }
    }
  }
}
