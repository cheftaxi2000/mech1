/**
 * Analysis 1, Übung 7 (pp. 5–12): zeros of real polynomials (quadratic formula, conjugate pairs, counting with
 * multiplicity, splitting off a pair by polynomial division), hyperbolic functions and their inverses, orders of
 * magnitude (little o, big O). Every number shown in the week-7 lessons is computed here and checked in week7.test.ts.
 */
import { cabs, cmul, cx, type C } from './week5';

export { cabs, cmul, cx, type C };

/* ------------------------------------------------------------------ polynomials (Ü7 S. 5–7) */

/** Coefficients in ascending order: [a0, a1, …, an] means a0 + a1 z + … + an zⁿ. */
export type Poly = number[];
export const cadd = (a: C, b: C): C => cx(a.re + b.re, a.im + b.im);
/** p(z) by Horner's scheme. */
export function evalPoly(p: Poly, z: C): C {
  let acc = cx(0, 0);
  for (let k = p.length - 1; k >= 0; k--) acc = cadd(cmul(acc, z), cx(p[k], 0));
  return acc;
}
export const evalReal = (p: Poly, x: number) => p.reduceRight((acc, a) => acc * x + a, 0);
export function mulPoly(p: Poly, q: Poly): Poly {
  const out = new Array(p.length + q.length - 1).fill(0);
  p.forEach((a, i) => q.forEach((b, j) => { out[i + j] += a * b; }));
  return out;
}
/** Long division p = q·d + r (d monic or not); returns quotient q, remainder r and the subtraction rows of the scheme. */
export function divPoly(p: Poly, d: Poly): { q: Poly; r: Poly; rows: { sub: Poly; rest: Poly }[] } {
  const rest = [...p];
  const dn = d.length - 1, lead = d[dn];
  const q = new Array(Math.max(1, p.length - dn)).fill(0);
  const rows: { sub: Poly; rest: Poly }[] = [];
  for (let k = p.length - 1 - dn; k >= 0; k--) {
    const c = rest[k + dn] / lead;
    q[k] = c;
    const sub = new Array(p.length).fill(0);
    d.forEach((b, j) => { sub[k + j] = c * b; rest[k + j] -= c * b; });
    rows.push({ sub, rest: rest.map((v) => (Math.abs(v) < 1e-12 ? 0 : v)) });
  }
  return { q, r: rest.slice(0, dn).map((v) => (Math.abs(v) < 1e-12 ? 0 : v)), rows };
}
/** Real quadratic factor of the conjugate pair a ± bi: (z − a)² + b² = z² − 2a z + (a² + b²). */
export const pairFactor = (z: C): Poly => [z.re * z.re + z.im * z.im, -2 * z.re, 1];
/** Monic polynomial with the given real roots and conjugate pairs (one representative per pair). */
export function fromRoots(real: number[], pairs: C[]): Poly {
  let p: Poly = [1];
  for (const r of real) p = mulPoly(p, [-r, 1]);
  for (const z of pairs) p = mulPoly(p, pairFactor(z));
  return p;
}

export type DiscKind = 'two-real' | 'double' | 'complex';
/** Roots of a z² + b z + c with real coefficients (a ≠ 0). */
export function quadRoots(a: number, b: number, c: number): { D: number; kind: DiscKind; z1: C; z2: C } {
  const D = b * b - 4 * a * c;
  const eps = 1e-12;
  if (D > eps) { const s = Math.sqrt(D); return { D, kind: 'two-real', z1: cx((-b + s) / (2 * a), 0), z2: cx((-b - s) / (2 * a), 0) }; }
  if (D < -eps) { const s = Math.sqrt(-D); return { D, kind: 'complex', z1: cx(-b / (2 * a), s / (2 * a)), z2: cx(-b / (2 * a), -s / (2 * a)) }; }
  return { D: 0, kind: 'double', z1: cx(-b / (2 * a), 0), z2: cx(-b / (2 * a), 0) };
}

/** Possible (r_p, c_p) for a real polynomial of degree n: r_p + c_p = n, c_p even (Ü7 S. 6). */
export function rootSplits(n: number): [number, number][] {
  const out: [number, number][] = [];
  for (let c = 0; c <= n; c += 2) out.push([n - c, c]);
  return out;
}
/**
 * Smallest degree of a real polynomial that has all the given zeros (each listed zero once): add the conjugate of
 * every non-real zero unless it is listed already (SC 9).
 */
export function minDegree(zeros: C[]): number {
  const key = (z: C) => `${z.re.toFixed(9)},${z.im.toFixed(9)}`;
  const set = new Set(zeros.map(key));
  for (const z of zeros) if (Math.abs(z.im) > 1e-12) set.add(key(cx(z.re, -z.im)));
  return set.size;
}

/* ------------------------------------------------------------------ hyperbolic functions (Ü7 S. 8–10) */

export const cosh = Math.cosh, sinh = Math.sinh, tanh = Math.tanh;
export const arsinh = (x: number) => Math.log(x + Math.sqrt(x * x + 1));
export const arcosh = (x: number) => Math.log(x + Math.sqrt(x * x - 1));
export const artanh = (x: number) => 0.5 * Math.log((1 + x) / (1 - x));
/** cos and sin of a complex argument: cos(z) = (e^{iz} + e^{−iz})/2, sin(z) = (e^{iz} − e^{−iz})/(2i). */
export function ccos(z: C): C { return cx(Math.cos(z.re) * Math.cosh(z.im), -Math.sin(z.re) * Math.sinh(z.im)); }
export function csin(z: C): C { return cx(Math.sin(z.re) * Math.cosh(z.im), Math.cos(z.re) * Math.sinh(z.im)); }
/** Central difference, for checking the derivative formulas. */
export const deriv = (f: (x: number) => number, x: number, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);

/* ------------------------------------------------------------------ orders of magnitude (Ü7 S. 10–12) */

export const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
/** Γ(x + 1) for x ≥ 0 (smooth x! for the growth plot of S. 10): shift the argument up to ≥ 10, then Stirling's series. */
export function factorial(x: number): number {
  if (Number.isInteger(x) && x >= 0 && x <= 20) return fact(x);
  let n = x + 1, div = 1;
  while (n < 10) { div *= n; n += 1; }
  const ln = (n - 0.5) * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI) + 1 / (12 * n) - 1 / (360 * n ** 3) + 1 / (1260 * n ** 5);
  return Math.exp(ln) / div;
}
/** The growth race of S. 10 (x ≥ 1). */
export const GROWTH: { id: string; tex: string; f: (x: number) => number }[] = [
  { id: 'fact', tex: 'x!', f: factorial },
  { id: 'exp2', tex: '2^x', f: (x) => 2 ** x },
  { id: 'sq', tex: 'x^2', f: (x) => x * x },
  { id: 'xlnx', tex: 'x\\ln x', f: (x) => x * Math.log(x) },
  { id: 'x', tex: 'x', f: (x) => x },
  { id: 'ln', tex: '\\ln x', f: (x) => Math.log(x) },
  { id: 'one', tex: '1', f: () => 1 },
];
/** First x (on a grid of step h) from which f(x) > g(x) for good — where f overtakes g in the window [x0, x1]. */
export function overtake(f: (x: number) => number, g: (x: number) => number, x0: number, x1: number, h = 1e-3): number | null {
  let last: number | null = null;
  for (let x = x0; x <= x1 + 1e-12; x += h) { if (f(x) > g(x)) { if (last === null) last = x; } else last = null; }
  return last;
}
/** The four functions of «Bsp.: Wachstum vergleichen» (S. 12). */
export const ORDER_EXAMPLE = [
  { id: 'f2', tex: 'e^{5x+1}', f: (x: number) => Math.exp(5 * x + 1), lnf: (x: number) => 5 * x + 1 },
  { id: 'f1', tex: 'x^3', f: (x: number) => x ** 3, lnf: (x: number) => 3 * Math.log(x) },
  { id: 'f4', tex: '\\sqrt{x}', f: (x: number) => Math.sqrt(x), lnf: (x: number) => 0.5 * Math.log(x) },
  { id: 'f3', tex: '\\ln\\bigl(e^{x^{1/4}} - 2\\bigr)', f: (x: number) => Math.log(Math.exp(x ** 0.25) - 2), lnf: (x: number) => Math.log(Math.log(Math.exp(x ** 0.25) - 2)) },
];
