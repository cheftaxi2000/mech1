/**
 * Light and the Bohr model (lecture 6, slides 6–12; exercise class 6). Uses the constants as printed on the slides:
 * c = 2.998×10⁸ m/s, h = 6.626×10⁻³⁴ J·s, R_H = 1.097×10⁷ m⁻¹. SI units unless a name says nm.
 */
import { rand } from './particles';

export const SLIDE = { c: 2.998e8, h: 6.626e-34, RH: 1.097e7 } as const;
const { c, h, RH } = SLIDE;

export const frequency = (lambda: number) => c / lambda; // Hz, λ in m
export const wavelengthOf = (nu: number) => c / nu;
export const photonEnergy = (lambda: number) => (h * c) / lambda; // J
export const photonEnergyNu = (nu: number) => h * nu;
export const wavelengthFromEnergy = (E: number) => (h * c) / E;
export const nm = (m: number) => m * 1e9;

// ---- regions of the electromagnetic spectrum (boundaries are textbook round numbers, not on the slides) ----
export type Region = 'gamma' | 'xray' | 'uv' | 'visible' | 'ir' | 'micro' | 'radio';
export const REGION_EDGES_NM: [Region, number, number][] = [
  ['gamma', 0, 0.01], ['xray', 0.01, 10], ['uv', 10, 400], ['visible', 400, 700], ['ir', 700, 1e6], ['micro', 1e6, 1e9], ['radio', 1e9, Infinity],
];
export const regionOf = (lambdaNm: number): Region => REGION_EDGES_NM.find(([, a, b]) => lambdaNm >= a && lambdaNm < b)![0];

/** approximate screen colour of a visible wavelength (380–750 nm), after D. Bruton; null outside the visible range */
export function visibleRGB(lambdaNm: number): [number, number, number] | null {
  const w = lambdaNm;
  if (w < 380 || w > 750) return null;
  let r = 0, g = 0, b = 0;
  if (w < 440) { r = -(w - 440) / 60; b = 1; }
  else if (w < 490) { g = (w - 440) / 50; b = 1; }
  else if (w < 510) { g = 1; b = -(w - 510) / 20; }
  else if (w < 580) { r = (w - 510) / 70; g = 1; }
  else if (w < 645) { r = 1; g = -(w - 645) / 65; }
  else r = 1;
  const f = w < 420 ? 0.3 + (0.7 * (w - 380)) / 40 : w > 700 ? 0.3 + (0.7 * (750 - w)) / 50 : 1;
  const gm = (x: number) => Math.round(255 * Math.pow(x * f, 0.8));
  return [gm(r), gm(g), gm(b)];
}

// ---- hydrogen: Rydberg equation (slide 9) and Bohr energy levels (slide 11) ----
/** E_n = −h c R_H / n² (J); n = ∞ gives 0 */
export const levelEnergy = (n: number) => (Number.isFinite(n) ? -(h * c * RH) / (n * n) : 0);
/** 1/λ = R_H (1/n₁² − 1/n₂²) for n₂ > n₁ > 0 — the wavelength of the emitted photon, in m */
export const rydbergLambda = (n1: number, n2: number) => 1 / (RH * (1 / (n1 * n1) - 1 / (n2 * n2)));
export interface Transition { ni: number; nf: number; dE: number; emitted: boolean; photonE: number; lambda: number; nu: number }
/** electron goes from orbit n_i to orbit n_f: ΔE = E_f − E_i (slide 11); the photon has |ΔE| */
export function transition(ni: number, nf: number): Transition {
  const dE = levelEnergy(nf) - levelEnergy(ni);
  const photonE = Math.abs(dE);
  return { ni, nf, dE, emitted: dE < 0, photonE, lambda: photonE > 0 ? (h * c) / photonE : Infinity, nu: photonE / h };
}
export const SERIES: Record<number, [string, string]> = { 1: ['Lyman', 'Lyman'], 2: ['Balmer', 'Balmer'], 3: ['Paschen', 'Paschen'], 4: ['Brackett', 'Brackett'] };
/** the visible hydrogen lines of slide 8 (Balmer series n → 2), in nm */
export const balmerNm = (nMax = 6) => Array.from({ length: nMax - 2 }, (_, i) => ({ n: i + 3, nm: nm(rydbergLambda(2, i + 3)) }));

// ---- the electron cloud (slide 12 and exercise 6, p. 5): hydrogen 1s, radii in units of the Bohr radius ----
/** probability that the electron of the 1s state is closer than r (in units a₀): 1 − e^{−2r}(1 + 2r + 2r²) */
export const cloudCdf = (r: number) => 1 - Math.exp(-2 * r) * (1 + 2 * r + 2 * r * r);
/** radius that holds `p` of the probability (bisection) */
export function cloudRadius(p: number): number {
  let a = 0, b = 20;
  for (let i = 0; i < 80; i++) { const m = (a + b) / 2; if (cloudCdf(m) < p) a = m; else b = m; }
  return (a + b) / 2;
}
/** seeded sample of the 1s cloud projected onto a plane: returns (x, y, r) in a₀ — r is the true 3-D distance */
export function cloudPoints(n: number, seed: number): [number, number, number][] {
  const s = { seed };
  return Array.from({ length: n }, () => {
    const r = -(Math.log(1 - rand(s)) + Math.log(1 - rand(s)) + Math.log(1 - rand(s))) / 2; // r² e^{−2r}: a Gamma(3, ½) variable
    const z = 2 * rand(s) - 1, ph = 2 * Math.PI * rand(s), rho = Math.sqrt(1 - z * z);
    return [r * rho * Math.cos(ph), r * z, r];
  });
}
