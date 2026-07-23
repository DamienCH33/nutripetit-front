import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-score-circle',
  templateUrl: './score-circle.html',
  styleUrl: './score-circle.scss',
})
export class ScoreCircle {
  @Input({ required: true }) score!: number;
  @Input({ required: true }) level!: string;
  @Input() levelLabel = '';
}
