import { Component, Input } from '@angular/core';
import { Icon } from '../../shared/icon/icon';

interface Rule {
  rule_code: string;
  rule_label: string;
  points: number;
  reason: string;
  source_name: string;
  source_url: string;
  status: string;
}

@Component({
  selector: 'app-rule-card',
  imports: [Icon],
  templateUrl: './rule-card.html',
  styleUrl: './rule-card.scss',
})
export class RuleCard {
  @Input({ required: true }) rule!: Rule;
}
