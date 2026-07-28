import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BabyProfileService {
  private readonly KEY = 'nutripetit_baby_age';

  saveAge(age: number): void {
    localStorage.setItem(this.KEY, age.toString());
  }

  getAge(): number | null {
    const value = localStorage.getItem(this.KEY);
    return value ? Number(value) : null;
  }

  clearAge(): void {
    localStorage.removeItem(this.KEY);
  }
}
