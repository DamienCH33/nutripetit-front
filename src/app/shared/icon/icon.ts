import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  imports: [CommonModule],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  @Input({ required: true }) name!: string;
}
