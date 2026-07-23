import { Component, Input } from '@angular/core';

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
  templateUrl: './rule-card.html',
  styleUrl: './rule-card.scss',
})
export class RuleCard {
  @Input({ required: true }) rule!: Rule;
}
