import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  imports: [CommonModule],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  // Décoratif : le texte voisin ou l'aria-label du bouton porte le sens.
  host: { 'aria-hidden': 'true' },
})
export class Icon {
  @Input({ required: true }) name!: string;
}
