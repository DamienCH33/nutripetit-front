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

  it("transmet l'âge du bébé à l'API", () => {
    service.scan('3041091478146', 9).subscribe();

    const req = http.expectOne((r) => r.url === '/api/scan/3041091478146');
    expect(req.request.params.get('age')).toBe('9');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it("n'envoie pas d'âge quand il est inconnu", () => {
    service.scan('3041091478146', null).subscribe();

    const req = http.expectOne((r) => r.url === '/api/scan/3041091478146');
    expect(req.request.params.has('age')).toBe(false);
    req.flush({});
  });

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
