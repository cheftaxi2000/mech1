/**
 * Hydrogen-like orbitals (Z = 1), lengths in units of the Bohr radius a₀.
 * ψ_{nℓm} = R_{nℓ}(r) · Y(θ, φ) with the REAL angular functions (p_x, p_y, p_z, d_z², …) that are drawn in textbooks and on slides 17–18.
 * Used for the cross-section density plots of the lesson (not on the slides: the slides show pictures from Brown).
 */
const fact = (k: number): number => (k <= 1 ? 1 : k * fact(k - 1));
const binom = (n: number, k: number) => fact(n) / (fact(k) * fact(n - k));

/** Generalised Laguerre polynomial L_k^α(x). */
export function laguerre(k: number, alpha: number, x: number): number {
  let s = 0;
  for (let i = 0; i <= k; i++) s += ((i % 2 ? -1 : 1) * binom(k + alpha, k - i) * x ** i) / fact(i);
  return s;
}

/** Radial function R_{nℓ}(r), normalised: ∫ R² r² dr = 1 (r in a₀). */
export function radial(n: number, l: number, r: number): number {
  const rho = (2 * r) / n;
  const N = Math.sqrt(((2 / n) ** 3 * fact(n - l - 1)) / (2 * n * fact(n + l)));
  return N * Math.exp(-rho / 2) * rho ** l * laguerre(n - l - 1, 2 * l + 1, rho);
}

export type Kind = 's' | 'px' | 'py' | 'pz' | 'dz2' | 'dxz' | 'dyz' | 'dxy' | 'dx2y2';
export interface Orbital { n: number; l: number; ml: number; kind: Kind }

/** Which real orbital belongs to which m_ℓ (convention of the drawings: m = 0 along z, ±1 and ±2 are the combinations). */
const KIND: Record<number, Record<number, Kind>> = {
  0: { 0: 's' },
  1: { [-1]: 'py', 0: 'pz', 1: 'px' },
  2: { [-2]: 'dxy', [-1]: 'dyz', 0: 'dz2', 1: 'dxz', 2: 'dx2y2' },
};
export const kindOf = (l: number, ml: number): Kind | null => KIND[l]?.[ml] ?? null;
export const orbital = (n: number, l: number, ml: number): Orbital | null => { const kind = kindOf(l, ml); return kind ? { n, l, ml, kind } : null; };

/** Plane in which the cross-section shows the lobes: the lobes of d_xy and d_x²−y² lie in the xy plane, those of p_y and d_yz in the yz plane. */
export type Plane = 'xz' | 'yz' | 'xy';
export const planeOf = (k: Kind): Plane => (k === 'py' || k === 'dyz' ? 'yz' : k === 'dxy' || k === 'dx2y2' ? 'xy' : 'xz');

const PI = Math.PI;
/** Real angular function (orthonormal over the sphere) at the direction (x, y, z)/r. */
export function angular(k: Kind, x: number, y: number, z: number): number {
  const r2 = x * x + y * y + z * z;
  if (r2 === 0) return k === 's' ? Math.sqrt(1 / (4 * PI)) : 0;
  const r = Math.sqrt(r2);
  switch (k) {
    case 's': return Math.sqrt(1 / (4 * PI));
    case 'pz': return Math.sqrt(3 / (4 * PI)) * (z / r);
    case 'px': return Math.sqrt(3 / (4 * PI)) * (x / r);
    case 'py': return Math.sqrt(3 / (4 * PI)) * (y / r);
    case 'dz2': return Math.sqrt(5 / (16 * PI)) * ((3 * z * z - r2) / r2);
    case 'dxz': return Math.sqrt(15 / (4 * PI)) * ((x * z) / r2);
    case 'dyz': return Math.sqrt(15 / (4 * PI)) * ((y * z) / r2);
    case 'dxy': return Math.sqrt(15 / (4 * PI)) * ((x * y) / r2);
    case 'dx2y2': return Math.sqrt(15 / (16 * PI)) * ((x * x - y * y) / r2);
  }
}

/** Wave function ψ(x, y, z) (a₀^(−3/2)). */
export function psi(o: Orbital, x: number, y: number, z: number): number {
  return radial(o.n, o.l, Math.sqrt(x * x + y * y + z * z)) * angular(o.kind, x, y, z);
}
export const density = (o: Orbital, x: number, y: number, z: number) => psi(o, x, y, z) ** 2;

/** Number of radial nodes n − ℓ − 1 (spherical shells where ψ = 0). */
export const radialNodes = (n: number, l: number) => n - l - 1;

/**
 * The density level ρ* such that the region {ρ ≥ ρ*} contains `fraction` (e.g. 90 %) of the probability (3-D, not just in the drawn plane),
 * and the largest distance from the nucleus that this region reaches. Found on a spherical grid with a histogram of log ρ.
 */
const cache = new Map<string, { level: number; rmax: number }>();
export function contour(o: Orbital, fraction = 0.9): { level: number; rmax: number } {
  const key = `${o.n}${o.kind}${fraction}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const rMax = 4 * o.n * o.n + 12 * o.n, nr = 360, nt = 48, np = 48;
  const dr = rMax / nr, dt = PI / nt, dp = (2 * PI) / np;
  const BINS = 3000, lo = -40, hi = 2; // log10 ρ range
  const hist = new Float64Array(BINS);
  const rAt = new Float64Array(BINS); // largest r seen in each bin
  let total = 0;
  for (let i = 0; i < nr; i++) {
    const r = (i + 0.5) * dr;
    const R = radial(o.n, o.l, r);
    for (let j = 0; j < nt; j++) {
      const th = (j + 0.5) * dt, st = Math.sin(th), ct = Math.cos(th);
      const w = r * r * dr * st * dt * dp;
      for (let k = 0; k < np; k++) {
        const ph = (k + 0.5) * dp;
        const a = angular(o.kind, st * Math.cos(ph), st * Math.sin(ph), ct);
        const rho = (R * a) ** 2;
        if (rho <= 0) continue;
        const b = Math.min(BINS - 1, Math.max(0, Math.floor(((Math.log10(rho) - lo) / (hi - lo)) * BINS)));
        hist[b] += rho * w;
        if (r > rAt[b]) rAt[b] = r;
        total += rho * w;
      }
    }
  }
  let acc = 0, b = BINS - 1;
  for (; b >= 0; b--) { acc += hist[b]; if (acc >= fraction * total) break; }
  let rmax = 0;
  for (let q = Math.max(0, b); q < BINS; q++) rmax = Math.max(rmax, rAt[q]);
  const res = { level: 10 ** (lo + ((Math.max(0, b)) / BINS) * (hi - lo)), rmax };
  cache.set(key, res);
  return res;
}
