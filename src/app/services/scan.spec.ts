import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ScanService } from './scan';

describe('ScanService', () => {
  let service: ScanService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ScanService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it("envoie le jeton CSRF dans l'en-tête et le nom du cookie (double soumission Symfony)", () => {
    service.clearHistory().subscribe();

    const req = http.expectOne('/api/history/clear');
    const token = req.request.headers.get('submit');
    expect(req.request.method).toBe('POST');
    expect(token).toMatch(/^[A-Za-z0-9+/]{24}$/);
    expect(document.cookie).toContain('submit_' + token + '=submit');
    req.flush({ deleted: 0 });
  });
});
