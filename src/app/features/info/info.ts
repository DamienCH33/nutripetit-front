import { Component, inject, OnInit, signal } from '@angular/core';
import { ScanService, InfoData } from '../../services/scan';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [Icon],
  templateUrl: './info.html',
  styleUrl: './info.scss',
})
export class Info implements OnInit {
  private scanService = inject(ScanService);
  data = signal<InfoData | null>(null);

  ngOnInit(): void {
    this.scanService.getInfo().subscribe((d) => this.data.set(d));
  }
}
