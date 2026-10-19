import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';


import { RuleCard } from './rule-card';

describe('RuleCard', () => {
  let component: RuleCard;
  let fixture: ComponentFixture<RuleCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleCard],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(RuleCard);
    component = fixture.componentInstance;
    component.rule = {
      rule_code: 'added_salt',
      rule_label: 'Sel ajouté',
      points: -20,
      reason: 'Contient du sel ajouté.',
      source_name: 'ANSES',
      source_url: 'https://www.anses.fr',
      status: 'triggered',
      category: 'malus',
      icon: 'lucide:circle',
    };
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
