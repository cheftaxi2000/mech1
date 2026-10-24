import { describe, expect, it } from 'vitest';
import { N_A, R_H as RH_ENERGY, c_light, h as h_exact } from './constants';
import { roundSig } from './gas';
import {
  SLIDE, balmerNm, cloudCdf, cloudPoints, cloudRadius, frequency, levelEnergy, nm, photonEnergy, photonEnergyNu, regionOf, rydbergLambda, transition,
  visibleRGB, wavelengthFromEnergy, wavelengthOf,
} from './light';

describe('light (slide 7, exercise 6.2)', () => {
  it('the slide constants agree with the exact ones to the printed digits', () => {
    expect(SLIDE.c / c_light).toBeCloseTo(1, 3); expect(SLIDE.h / h_exact).toBeCloseTo(1, 3);
    expect(SLIDE.h * SLIDE.c * SLIDE.RH).toBeCloseTo(RH_ENERGY, -20); // 2.18·10⁻¹⁸ J, the hydrogen ground-state energy
  });
  it('c = λν and E = hν = hc/λ', () => {
    const lam = 530e-9;
    expect(frequency(lam) * lam).toBeCloseTo(SLIDE.c, 0);
    expect(wavelengthOf(frequency(lam))).toBeCloseTo(lam, 15);
    expect(photonEnergy(lam)).toBeCloseTo(photonEnergyNu(frequency(lam)), 25);
    expect(frequency(lam) / 1e14).toBeCloseTo(5.66, 2);
    expect(photonEnergy(lam) / 1e-19).toBeCloseTo(3.75, 2);
  });
  it('blue photons carry more energy than red ones (slide 7): 430 nm > 530 nm > 630 nm; shorter wavelength = higher frequency', () => {
    const e = [430, 530, 630].map((l) => photonEnergy(l * 1e-9));
    expect(e[0]).toBeGreaterThan(e[1]); expect(e[1]).toBeGreaterThan(e[2]);
    expect(frequency(430e-9)).toBeGreaterThan(frequency(630e-9));
    expect(e[0] / e[2]).toBeCloseTo(630 / 430, 12); // E ∝ 1/λ
  });
  it('exercise 1: frequency falls as wavelength grows (a: false); every wavelength travels at c (b: true); infrared has lower ν than visible light (c: false)', () => {
    expect(frequency(700e-9)).toBeLessThan(frequency(400e-9));
    expect(frequency(1000e-9)).toBeLessThan(frequency(550e-9));
    expect(regionOf(1000)).toBe('ir'); expect(regionOf(550)).toBe('visible'); expect(regionOf(100)).toBe('uv');
    expect(regionOf(0.1)).toBe('xray'); expect(regionOf(0.001)).toBe('gamma'); expect(regionOf(1e7)).toBe('micro'); expect(regionOf(1e10)).toBe('radio');
  });
  it('the colours of the slide: 430 nm blue, 530 nm green, 630 nm red; outside the visible range there is no colour', () => {
    const [r1, g1, b1] = visibleRGB(430)!, [r2, g2, b2] = visibleRGB(530)!, [r3, g3, b3] = visibleRGB(630)!;
    expect(b1).toBeGreaterThan(r1); expect(b1).toBeGreaterThan(g1);
    expect(g2).toBeGreaterThan(b2); expect(g2).toBeGreaterThan(r2 - 1);
    expect(r3).toBeGreaterThan(g3); expect(r3).toBeGreaterThan(b3);
    expect(visibleRGB(300)).toBeNull(); expect(visibleRGB(800)).toBeNull();
  });
});

describe('hydrogen and the Bohr model (slides 9–11, exercise 6.3)', () => {
  it('E_n = −hcR_H/n²: −2.18·10⁻¹⁸ J for n = 1, a quarter of it for n = 2, zero at n = ∞', () => {
    expect(levelEnergy(1) / 1e-18).toBeCloseTo(-2.18, 2);
    expect(levelEnergy(2) / levelEnergy(1)).toBeCloseTo(0.25, 12);
    expect(levelEnergy(Infinity)).toBe(0);
    for (let n = 1; n < 8; n++) expect(levelEnergy(n + 1)).toBeGreaterThan(levelEnergy(n)); // levels rise with n
  });
  it('slide 11 example: 3 → 1: ΔE = −1.94·10⁻¹⁸ J, E_ph = +1.94·10⁻¹⁸ J, λ = 103 nm (deep ultraviolet)', () => {
    const tr = transition(3, 1);
    expect(tr.emitted).toBe(true);
    expect(tr.dE / 1e-18).toBeCloseTo(-1.94, 2);
    expect(tr.photonE / 1e-18).toBeCloseTo(1.94, 2);
    expect(nm(tr.lambda)).toBeCloseTo(102.55, 1);
    expect(roundSig(nm(tr.lambda), 3)).toBe(103);
    expect(regionOf(nm(tr.lambda))).toBe('uv');
    expect(levelEnergy(1) - levelEnergy(3)).toBeCloseTo(levelEnergy(1) * (1 - 1 / 9), 25); // −2.18·10⁻¹⁸ J (1 − 1/9)
  });
  it('the Rydberg equation (slide 9) and the energy difference (slide 11) are the same statement', () => {
    for (const [n1, n2] of [[1, 2], [2, 3], [2, 6], [3, 5]] as const) {
      const tr = transition(n2, n1);
      expect(tr.lambda).toBeCloseTo(rydbergLambda(n1, n2), 14);
      expect(tr.photonE).toBeCloseTo(SLIDE.h * SLIDE.c * SLIDE.RH * (1 / n1 ** 2 - 1 / n2 ** 2), 28);
    }
  });
  it('emission down, absorption up; ΔE > 0 means a photon is absorbed (exercise 6.3)', () => {
    expect(transition(1, 2).emitted).toBe(false); expect(transition(1, 2).dE).toBeGreaterThan(0);
    expect(transition(4, 2).emitted).toBe(true); expect(transition(4, 2).dE).toBeLessThan(0);
    expect(transition(2, 5).lambda).toBeCloseTo(transition(5, 2).lambda, 12); // the same photon, absorbed or emitted
    expect(transition(3, 3).dE).toBe(0);
  });
  it('the four visible lines of slide 8 are the Balmer lines 3→2, 4→2, 5→2, 6→2: 656, 486, 434, 410 nm', () => {
    const b = balmerNm(6).map((x) => Math.round(x.nm));
    expect(b).toEqual([656, 486, 434, 410]);
    for (const x of balmerNm(6)) expect(regionOf(x.nm)).toBe('visible');
    expect(visibleRGB(656)![0]).toBeGreaterThan(200); // red line
    // Lyman lines lie in the ultraviolet, Paschen lines in the infrared
    expect(regionOf(nm(rydbergLambda(1, 2)))).toBe('uv'); expect(regionOf(nm(rydbergLambda(3, 4)))).toBe('ir');
  });
  it('exercise 2: excitation 1 → ∞ takes 2.18·10⁻¹⁸ J, λ = 91.1 nm (ultraviolet); a shorter wavelength has more energy than needed', () => {
    const tr = transition(1, Infinity);
    expect(tr.dE / 1e-18).toBeCloseTo(2.18, 2);
    expect(nm(tr.lambda)).toBeCloseTo(91.16, 1);
    expect(nm(wavelengthFromEnergy(218e-20))).toBeCloseTo(91.1, 1); // with the TA's rounded 218·10⁻²⁰ J: 9.1123·10⁻⁸ m
    expect(photonEnergy(80e-9)).toBeGreaterThan(tr.photonE);
    expect(tr.emitted).toBe(false);
  });
  it('lecture example sanity: the energy per mole of the 3 → 1 photons is ≈ 1170 kJ/mol', () => {
    expect((transition(3, 1).photonE * N_A) / 1000).toBeCloseTo(1167, -1);
  });
});

describe('electron cloud (slide 12, exercise 6.4)', () => {
  it('90 % of the 1s probability lies within 2.66 a₀; the cumulative law is right', () => {
    expect(cloudRadius(0.9)).toBeCloseTo(2.661, 2);
    expect(cloudCdf(cloudRadius(0.5))).toBeCloseTo(0.5, 9);
    expect(cloudCdf(0)).toBeCloseTo(0, 12); expect(cloudCdf(30)).toBeCloseTo(1, 12);
  });
  it('the seeded sample reproduces it: mean radius 1.5 a₀, 90 % inside 2.66 a₀', () => {
    const pts = cloudPoints(6000, 5);
    expect(pts.reduce((s, p) => s + p[2], 0) / pts.length).toBeCloseTo(1.5, 1);
    expect(pts.filter((p) => p[2] < cloudRadius(0.9)).length / pts.length).toBeCloseTo(0.9, 1);
    expect(cloudPoints(10, 5)).toEqual(cloudPoints(10, 5));
    for (const p of pts.slice(0, 100)) expect(Math.hypot(p[0], p[1])).toBeLessThanOrEqual(p[2] + 1e-9);
  });
});
