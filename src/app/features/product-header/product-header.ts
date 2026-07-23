import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-header',
  templateUrl: './product-header.html',
  styleUrl: './product-header.scss',
})
export class ProductHeader {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) ean!: string;
  @Input() brand: string | null = null;
  @Input() imageUrl: string | null = null;
}
