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
import { FormsModule } from '@angular/forms';
import { Icon } from '../../shared/icon/icon';
import { BabyProfileService } from '../../services/baby-profile';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';
import type { IScannerControls } from '@zxing/browser';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [Icon, RouterLink, FormsModule],
  templateUrl: './scanner.html',
  styleUrl: './scanner.scss',
})
export class Scanner implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private consecutiveDetections = new Map<string, number>();
  private codeReader?: BrowserMultiFormatReader;
  private controls?: IScannerControls;
  private activeStream?: MediaStream;
  private destroyed = false;

  videoElement = viewChild<ElementRef<HTMLVideoElement>>('videoElement');

  status = signal<string>('Démarrage de la caméra…');
  error = signal<string | null>(null);
  detected = signal(false);
  torchAvailable = signal(false);
  torchOn = signal(false);
  manual = signal('');
  manualError = signal<string | null>(null);

  private profile = inject(BabyProfileService);
  /** « Léo · 9 mois », rappelé en haut de l'écran : le score sera calculé pour lui. */
  who = () => this.profile.label();

  /** Lampe torche : seulement si la caméra l'expose (Chrome Android, pas iOS Safari). */
  async toggleTorch(): Promise<void> {
    const track = this.activeStream?.getVideoTracks()[0];
    if (!track) return;
    const next = !this.torchOn();
    try {
      await track.applyConstraints({ advanced: [{ torch: next } as MediaTrackConstraintSet] });
      this.torchOn.set(next);
    } catch {
      this.torchAvailable.set(false);
    }
  }

  onManualChange(value: string): void {
    // Espaces et tirets tolérés à la saisie : on ne garde que les chiffres.
    this.manual.set(value.replace(/\D/g, '').slice(0, 13));
    this.manualError.set(null);
  }

  submitManual(): void {
    const ean = this.manual();
    if (ean.length !== 13) {
      this.manualError.set(`Il faut 13 chiffres (${ean.length} saisi${ean.length > 1 ? 's' : ''}).`);
      return;
    }
    if (!this.isValidEan13(ean)) {
      this.manualError.set('Ce code ne semble pas correct : vérifiez les chiffres sous le code-barres.');
      return;
    }
    this.stop();
    this.router.navigate(['/scan', ean]);
  }

  ngAfterViewInit(): void {
    this.start();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
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
    this.torchOn.set(false);
  }

  handleResult(ean: string) {
    // UPC-A = EAN-13 dont le premier chiffre est 0 (norme GS1).
    if (/^\d{12}$/.test(ean)) {
      ean = '0' + ean;
    }

    if (!/^\d{13}$/.test(ean)) {
      this.status.set('Code partiel, gardez le cadre sur le code');
      return;
    }

    // Validation checksum EAN-13 côté JS
    if (!this.isValidEan13(ean)) {
      this.status.set('Lecture floue, gardez le cadre sur le code');
      return;
    }

    // Demander 2 détections identiques avant d'accepter
    const count = (this.consecutiveDetections.get(ean) || 0) + 1;
    this.consecutiveDetections.set(ean, count);

    if (count < 2) {
      this.status.set('Vérification…');
      return;
    }

    this.detected.set(true);
    // Retour tactile : on sait que c'est lu sans regarder l'écran.
    navigator.vibrate?.(80);
    this.stop();
    this.status.set(`Code lu : ${ean}`);

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
      // Référencé tout de suite : stop() doit pouvoir le couper même si play() échoue.
      this.activeStream = stream;

      // Page quittée pendant la demande d'autorisation : sans ce garde-fou,
      // ngOnDestroy est déjà passé et la caméra resterait allumée.
      if (this.destroyed) {
        this.stop();
        return;
      }

      // 3. Brancher le flux sur la vidéo
      video.srcObject = stream;
      await video.play();
      this.status.set('Pointez le code-barres dans le cadre');
      const caps = stream.getVideoTracks()[0]?.getCapabilities?.() as { torch?: boolean } | undefined;
      this.torchAvailable.set(!!caps?.torch);

      // 4. Décoder en continu : à chaque code lu → handleResult
      this.controls = await this.codeReader.decodeFromVideoElement(video, (result) => {
        if (result) {
          this.handleResult(result.getText());
        }
      });
      if (this.destroyed) {
        this.stop();
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        this.error.set('La caméra est bloquée. Autorisez-la dans les réglages du navigateur, ou tapez le code ci-dessous.');
      } else if (err.name === 'NotFoundError') {
        this.error.set('Aucune caméra trouvée. Tapez le code ci-dessous.');
      } else {
        this.error.set('La caméra ne démarre pas. Tapez le code ci-dessous.');
      }
    }
  }
}
