/**
 * Analysis 1, Übung 6: powers of i, modulus and conjugate rules, polar and Euler form, multiplying/dividing in polar
 * form, powers (de Moivre), n-th roots, double-angle formulas, regions in the complex plane. Every number shown in
 * the week-6 lessons is computed here and checked in week6.test.ts.
 */
import { cabs, cdiv, cmul, conj, cx, type C } from './week5';

export { cabs, cdiv, cmul, conj, cx, type C };

const TAU = 2 * Math.PI;

/* ------------------------------------------------------------------ Potenzen von i (Ü6 S. 2) */

/** i^n for an integer n ≥ 0: «Exponent durch 4 teilen, nur der Rest zählt». */
export function iPow(n: number): C {
  const r = ((n % 4) + 4) % 4;
  return [cx(1, 0), cx(0, 1), cx(-1, 0), cx(0, -1)][r];
}
/** i^n by repeated multiplication (the slow way, for the test). */
export function iPowSlow(n: number): C {
  let z = cx(1, 0);
  for (let k = 0; k < n; k++) z = cmul(z, cx(0, 1));
  return z;
}
/** n = 4q + r with 0 ≤ r < 4. */
export const div4 = (n: number) => ({ q: Math.floor(n / 4), r: ((n % 4) + 4) % 4 });

/* ------------------------------------------------------------------ Polarform (Ü6 S. 5–6) */

/** The angle in [0, 2π) measured counter-clockwise from the positive real axis; NaN for z = 0 (no angle). */
export function arg(z: C): number {
  if (Math.hypot(z.re, z.im) < 1e-12) return NaN;
  const a = Math.atan2(z.im, z.re);
  const p = a < 0 ? a + TAU : a;
  return p >= TAU - 1e-12 ? 0 : p;
}
/** arctan(b/a) alone — what the slide warns about. NaN for a = 0. Range (−π/2, π/2). */
export const naiveArctan = (z: C) => (z.re === 0 ? NaN : Math.atan(z.im / z.re));
/** r e^{iφ} = r(cos φ + i sin φ). */
export const fromPolar = (r: number, phi: number): C => cx(r * Math.cos(phi), r * Math.sin(phi));
export const toPolar = (z: C) => ({ r: cabs(z), phi: arg(z) });

/** The table of special values on the slide (φ, cos φ, sin φ), with the exact forms as TeX. */
export const TRIG_TABLE = [
  { phi: 0, phiTex: '0', cos: 1, cosTex: '1', sin: 0, sinTex: '0' },
  { phi: Math.PI / 6, phiTex: '\\pi/6', cos: Math.sqrt(3) / 2, cosTex: '\\sqrt3/2', sin: 0.5, sinTex: '1/2' },
  { phi: Math.PI / 4, phiTex: '\\pi/4', cos: Math.SQRT2 / 2, cosTex: '\\sqrt2/2', sin: Math.SQRT2 / 2, sinTex: '\\sqrt2/2' },
  { phi: Math.PI / 3, phiTex: '\\pi/3', cos: 0.5, cosTex: '1/2', sin: Math.sqrt(3) / 2, sinTex: '\\sqrt3/2' },
  { phi: Math.PI / 2, phiTex: '\\pi/2', cos: 0, cosTex: '0', sin: 1, sinTex: '1' },
] as const;

/**
 * Nice TeX names for rational multiples of π with denominator ≤ 48 (e.g. 5π/6, π/14); otherwise null. Not reduced mod 2π.
 * style 'frac' → \tfrac{5\pi}{6}, 'slash' → 5\pi/6 (for exponents).
 */
export function angleTex(phi: number, style: 'frac' | 'slash' = 'frac'): string | null {
  if (!Number.isFinite(phi)) return null;
  // smallest denominator d ≤ 48 with φ/π · d an integer (π/14, 2π/7, 5π/6 …)
  let D = 0, k = 0;
  for (let d = 1; d <= 48 && !D; d++) { const x = (phi / Math.PI) * d; if (Math.abs(x - Math.round(x)) < 1e-7) { D = d; k = Math.round(x); } }
  if (!D) return null;
  if (k === 0) return '0';
  const neg = k < 0, kk = Math.abs(k);
  const g = gcd(kk, D), num = kk / g, den = D / g;
  const top = num === 1 ? '\\pi' : `${num}\\pi`;
  const body = den === 1 ? top : style === 'frac' ? `\\tfrac{${top}}{${den}}` : `${top}/${den}`;
  return (neg ? '-' : '') + body;
}
function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

/* ------------------------------------------------------------------ Euler form, rules (Ü6 S. 7) */

/** (r1 e^{iφ1})(r2 e^{iφ2}) = r1 r2 e^{i(φ1+φ2)} — the slide's rule (computed in polar form). */
export const mulPolar = (r1: number, p1: number, r2: number, p2: number) => ({ r: r1 * r2, phi: p1 + p2 });
/** r1 e^{iφ1} / (r2 e^{iφ2}) = (r1/r2) e^{i(φ1−φ2)}, r2 > 0. */
export const divPolar = (r1: number, p1: number, r2: number, p2: number) => ({ r: r1 / r2, phi: p1 - p2 });
/** Angle reduced to [0, 2π). */
export const norm2pi = (phi: number) => { const p = ((phi % TAU) + TAU) % TAU; return p >= TAU - 1e-12 ? 0 : p; };

/* ------------------------------------------------------------------ Potenzen und Wurzeln (Ü6 S. 8–9) */

/** z^n by repeated multiplication (n ≥ 0). */
export function cpowMul(z: C, n: number): C {
  let w = cx(1, 0);
  for (let k = 0; k < n; k++) w = cmul(w, z);
  return w;
}
/** (r e^{iφ})^n = r^n e^{inφ}. */
export function cpowPolar(z: C, n: number): C {
  const { r, phi } = toPolar(z);
  if (r === 0) return cx(0, 0);
  return fromPolar(r ** n, n * phi);
}
/** The powers z^1, …, z^n (the spiral). */
export const powerList = (z: C, n: number): C[] => Array.from({ length: n }, (_, k) => cpowPolar(z, k + 1));

/** All n solutions of z^n = w = R e^{iθ}: z_k = R^{1/n} e^{i(θ + 2πk)/n}, k = 0 … n−1. w = 0 → only z = 0. */
export function roots(w: C, n: number): { z: C; angle: number }[] {
  const R = cabs(w);
  if (R < 1e-12) return [{ z: cx(0, 0), angle: NaN }];
  const th = arg(w), rr = R ** (1 / n);
  return Array.from({ length: n }, (_, k) => { const a = (th + TAU * k) / n; return { z: fromPolar(rr, a), angle: a }; });
}

/**
 * «Probe» animation: the point on the way from z_k to z_k^n, raising the power continuously from 1 to n
 * (s = 1 + (n − 1)t) along the root's own angle a_k = (θ + 2πk)/n: radius rr^s, angle s·a_k. At t = 1 it is w.
 */
export function probePoint(rr: number, ak: number, n: number, t: number): C {
  const s = 1 + (n - 1) * t;
  return fromPolar(rr ** s, s * ak);
}

/** Double angle via (e^{ix})² = e^{2ix}: Re and Im of (cos x + i sin x)². */
export function doubleAngle(x: number) {
  const sq = cpowMul(cx(Math.cos(x), Math.sin(x)), 2);
  return { re: sq.re, im: sq.im, cos2x: Math.cos(2 * x), sin2x: Math.sin(2 * x), cosForm: Math.cos(x) ** 2 - Math.sin(x) ** 2, sinForm: 2 * Math.sin(x) * Math.cos(x) };
}

/* ------------------------------------------------------------------ Bereiche (Ü6 S. 10, 12) */

export type Rel = '<' | '<=' | '>' | '>=' | '=';
const EPS = 1e-9;
export function holds(lhs: number, rel: Rel, rhs: number): boolean {
  switch (rel) {
    case '<': return lhs < rhs - EPS;
    case '<=': return lhs <= rhs + EPS;
    case '>': return lhs > rhs + EPS;
    case '>=': return lhs >= rhs - EPS;
    case '=': return Math.abs(lhs - rhs) <= EPS;
  }
}
/** |z − z0| rel R (circle, open/closed disc, outside). */
export const distCond = (z: C, z0: C, rel: Rel, R: number) => holds(Math.hypot(z.re - z0.re, z.im - z0.im), rel, R);
/** Re(iz) = Re(i(a + bi)) = Re(ai − b) = −b. */
export const reIz = (z: C) => cmul(cx(0, 1), z).re;
/** |z − a| = |z − b| (perpendicular bisector): signed difference of the squared distances. */
export const bisectorGap = (z: C, a: C, b: C) => (z.re - a.re) ** 2 + (z.im - a.im) ** 2 - (z.re - b.re) ** 2 - (z.im - b.im) ** 2;
