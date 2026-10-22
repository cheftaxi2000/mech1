/**
 * Week 1 (Übung 1, pp. 11–12; Übung 2, pp. 1–2): arithmetic, geometric and harmonic series, the e-series, Gauss's sum.
 * Every number the lesson shows is computed here and checked in reihen.test.ts.
 */

/* ---------------------------------------------------------------- arithmetic */
export const arith = (a1: number, d: number, n: number) => a1 + d * (n - 1);
/** Recursive form: needs the anchor a1 (U02 p. 1 «WICHTIG: … Ankerpunkt/Startwert!»). */
export function arithRec(a1: number, d: number, n: number) { let a = a1; for (let k = 2; k <= n; k++) a = a + d; return a; }
export const arithSum = (a1: number, d: number, n: number) => (n * (a1 + arith(a1, d, n))) / 2;
export const arithSum2 = (a1: number, d: number, n: number) => (n * (2 * a1 + d * (n - 1))) / 2;
export const gauss = (n: number) => (n * (n + 1)) / 2;
export function sumBy(n: number, f: (k: number) => number, k0 = 1) { let s = 0; for (let k = k0; k <= n; k++) s += f(k); return s; }

/** Slide example U01 p. 11: 4 + 8 + … + 24. */
export const AR = { a1: 4, d: 4, n: 6 };

/* ---------------------------------------------------------------- geometric */
export const geo = (a1: number, q: number, n: number) => a1 * q ** (n - 1);
export function geoRec(a1: number, q: number, n: number) { let a = a1; for (let k = 2; k <= n; k++) a = a * q; return a; }
/** S_n = a1 (1 + q + … + q^(n−1)) = a1 (1 − q^n)/(1 − q) for q ≠ 1, and n·a1 for q = 1. A-001: n terms end with q^(n−1). */
export const geoSum = (a1: number, q: number, n: number) => (q === 1 ? n * a1 : (a1 * (1 - q ** n)) / (1 - q));
/** S_∞ = a1/(1 − q) only for |q| < 1; otherwise no finite limit (null). */
export const geoLimit = (a1: number, q: number) => (Math.abs(q) < 1 ? a1 / (1 - q) : null);
/** Gap S_∞ − S_n = a1 q^n/(1 − q): it shrinks by the factor q per term. */
export const geoGap = (a1: number, q: number, n: number) => (a1 * q ** n) / (1 - q);

/** Slide examples U01 p. 12. */
export const GE = { a1: 3, q: 2, n: 4 };          // 3 + 6 + 12 + 24 = 45
export const GI = { a1: 3, q: 0.5 };              // 3 + 3/2 + 3/4 + … = 6

/* ---------------------------------------------------------------- harmonic */
export const harm = (n: number) => sumBy(n, (k) => 1 / k);
/** Group m ≥ 1 of the grouping proof (U02 p. 2): the terms 1/k for 2^(m−1) < k ≤ 2^m; group 0 is the single term 1. */
export const group = (m: number): [number, number] => (m === 0 ? [1, 1] : [2 ** (m - 1) + 1, 2 ** m]);
/** Each group m ≥ 1 is at least (number of terms)·(smallest term) = 2^(m−1) · 2^(−m) = 1/2. */
export const groupLower = (m: number) => (m === 0 ? 1 : 2 ** (m - 1) * 2 ** -m);
export const groupSum = (m: number) => { const [a, b] = group(m); return sumBy(b, (k) => 1 / k, a); };
/** Consequence: S_(2^m) ≥ 1 + m/2. */
export const harmBound = (m: number) => 1 + m / 2;
/** The first n with S_n > H (the harmonic series grows very slowly). */
export function harmExceed(H: number) { let s = 0, n = 0; while (s <= H) { n++; s += 1 / n; } return n; }
export const EULER_GAMMA = 0.5772156649015329;

/* ---------------------------------------------------------------- e */
const fact = (k: number) => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
/** The slide's sum 1/1! + … + 1/n! (from k = 1) → e − 1 (A-002). */
export const eSlide = (n: number) => sumBy(n, (k) => 1 / fact(k));
/** With the term 1/0! = 1 (from k = 0) → e. */
export const eFull = (n: number) => sumBy(n, (k) => 1 / fact(k), 0);
