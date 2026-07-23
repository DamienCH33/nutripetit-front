import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScoreCircle } from './features/score-circle/score-circle';
import { ProductHeader } from './features/product-header/product-header';
import { ScanService, ScanResult } from './services/scan';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ScoreCircle, ProductHeader],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private scanService = inject(ScanService);
  result = signal<ScanResult | null>(null);

  ngOnInit(): void {
    this.scanService.scan('3041091342034').subscribe((data) => {
      this.result.set(data);
    });
  }
}
