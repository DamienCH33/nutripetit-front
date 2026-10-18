import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Scanner } from './scanner';

describe('Scanner', () => {
  let resolveStream: (s: MediaStream) => void;
  let trackStop: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    trackStop = vi.fn();
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: () =>
          new Promise<MediaStream>((resolve) => {
            resolveStream = resolve;
          }),
      },
    });

    await TestBed.configureTestingModule({
      imports: [Scanner],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it("coupe la caméra si on quitte la page avant que l'autorisation arrive", async () => {
    const fixture = TestBed.createComponent(Scanner);
    fixture.detectChanges(); // ngAfterViewInit -> demande la caméra

    fixture.destroy(); // l'utilisateur quitte la page pendant la demande

    resolveStream({ getTracks: () => [{ stop: trackStop }] } as unknown as MediaStream);
    await new Promise((r) => setTimeout(r));

    expect(trackStop).toHaveBeenCalled();
  });

  it('valide la clé de contrôle EAN-13', () => {
    const scanner = TestBed.createComponent(Scanner).componentInstance;
    expect(scanner.isValidEan13('3288131510927')).toBe(true);
    expect(scanner.isValidEan13('1234567890123')).toBe(false);
  });
});
