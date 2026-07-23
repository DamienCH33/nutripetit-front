import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScoreCircle } from './features/score-circle/score-circle';
import { ScanService, ScanResult } from './services/scan';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ScoreCircle],
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
