import { TestBed } from '@angular/core/testing';

import { BabyProfileService } from './baby-profile';

describe('BabyProfileService', () => {
  let service: BabyProfileService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(BabyProfileService);
  });

  it("renvoie null tant qu'aucun âge n'est enregistré", () => {
    expect(service.getAge()).toBeNull();
  });

  it("garde l'âge en mois, y compris 0 (nouveau-né)", () => {
    service.saveAge(0);
    expect(service.getAge()).toBe(0);

    service.saveAge(18);
    expect(service.getAge()).toBe(18);
  });

  it("oublie l'âge après effacement", () => {
    service.saveAge(6);
    service.clearAge();
    expect(service.getAge()).toBeNull();
  });
});
