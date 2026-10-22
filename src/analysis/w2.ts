/**
 * Analysis 1, week 2 (Übung 2): functions, image (Wertebereich), even/odd, monotonic, one-sided limits,
 * limit techniques, L'Hôpital. Every number shown in the lessons `ana-funktionen` and `ana-grenzwerte-funktionen`
 * is computed here and checked in w2.test.ts. Numerical agreement is a check, not a proof — the lessons show why.
 */

/* ------------------------------------------------------------------ image of an interval */

/** An interval with open/closed ends; ±Infinity ends are always open. */
export interface Interval { lo: number; hi: number; loIn: boolean; hiIn: boolean }

/**
 * Image f(D) of an interval D for a CONTINUOUS f whose only turning points are `crit` (where f changes direction).
 * Then f is monotonic between the candidates, so the image is the interval from the smallest to the largest
 * candidate value, and an end is closed exactly when some INCLUDED candidate (an included end or an interior turning
 * point) reaches it. Used for (x − 4)² on [2, 6) → [0, 4] (4 is reached at the included end x = 2).
 */
export function imageOfInterval(f: (x: number) => number, crit: readonly number[], d: Interval): Interval {
  const cands: { v: number; inc: boolean }[] = [
    { v: f(d.lo), inc: d.loIn },
    { v: f(d.hi), inc: d.hiIn },
    ...crit.filter((c) => c > d.lo && c < d.hi).map((c) => ({ v: f(c), inc: true })),
  ];
  const lo = Math.min(...cands.map((c) => c.v)), hi = Math.max(...cands.map((c) => c.v));
  const near = (a: number, b: number) => Math.abs(a - b) < 1e-12;
  return {
    lo, hi,
    loIn: cands.some((c) => c.inc && near(c.v, lo)),
    hiIn: cands.some((c) => c.inc && near(c.v, hi)),
  };
}

export const parab = (x: number) => (x - 4) ** 2;
export const PARAB_CRIT = [4] as const;
export const lin = (x: number) => 4 * x + 3;

/** Where the extreme values of an image are reached (for the figure's red points), inside the domain only. */
export function reachedAt(f: (x: number) => number, crit: readonly number[], d: Interval, value: number): number[] {
  const xs = [...(d.loIn ? [d.lo] : []), ...crit.filter((c) => c > d.lo && c < d.hi), ...(d.hiIn ? [d.hi] : [])];
  return xs.filter((x) => Math.abs(f(x) - value) < 1e-9);
}

/* ------------------------------------------------------------------ examples on p. 3 */

export const recip3 = (x: number) => 1 / (x - 3);
/** g(x) = (x − 15)/(√x − 4), domain [0, ∞) without 16. */
export const g15 = (x: number) => (x < 0 || x === 16 ? NaN : (x - 15) / (Math.sqrt(x) - 4));
/** With t = √x: g = (t² − 15)/(t − 4), dg/dt = (t − 3)(t − 5)/(t − 4)² → turning points t = 3 (x = 9) and t = 5 (x = 25). */
export const G15_MAX = { x: 9, y: 6 } as const;
export const G15_MIN = { x: 25, y: 10 } as const;
export const g15dt = (t: number) => ((t - 3) * (t - 5)) / (t - 4) ** 2;

/** Is c a value of g15? (horizontal-line test). Image = ℝ ∖ (6, 10). */
export const inImageG15 = (c: number) => c <= G15_MAX.y || c >= G15_MIN.y;
/** Solutions of g15(x) = c (for the figure): t² − c t + (4c − 15) = 0 with t = √x ≥ 0, t ≠ 4. */
export function solveG15(c: number): number[] {
  const disc = c * c - 4 * (4 * c - 15);
  if (disc < 0) return [];
  const ts = disc === 0 ? [c / 2] : [(c - Math.sqrt(disc)) / 2, (c + Math.sqrt(disc)) / 2];
  return ts.filter((tt) => tt >= 0 && Math.abs(tt - 4) > 1e-9).map((tt) => tt * tt);
}
/** Solutions of 1/(x − 3) = c: x = 3 + 1/c, none for c = 0. */
export const solveRecip3 = (c: number) => (c === 0 ? [] : [3 + 1 / c]);

/** Standard atmosphere (troposphere): p(h) in bar. Continuous and decreasing → image of [0, 10 000 m] is [p(10 000), p(0)]. */
export const baro = (h: number) => 1.01325 * (1 - 2.25577e-5 * h) ** 5.25588;

/* ------------------------------------------------------------------ function types (figure presets) */

export interface TypeFn { id: string; f: (x: number) => number; tex: string; dom?: [number, number]; breaks?: number[] }
export const TYPE_FNS: TypeFn[] = [
  { id: 'pot', f: (x) => 0.5 * x ** 3, tex: String.raw`f(x) = \tfrac12\,x^3` },
  { id: 'poly', f: (x) => 0.25 * (x + 2) * (x - 1) * (x - 3), tex: String.raw`f(x) = \tfrac14(x+2)(x-1)(x-3)` },
  { id: 'rat', f: (x) => (x * x - 1) / (x * x - 4), tex: String.raw`f(x) = \frac{x^2-1}{x^2-4}`, breaks: [-2, 2] },
  { id: 'trig', f: (x) => Math.sin(x), tex: String.raw`f(x) = \sin(x)` },
  { id: 'exp', f: (x) => 2 ** x, tex: String.raw`f(x) = 2^x` },
  { id: 'log', f: (x) => Math.log(x) / Math.log(2), tex: String.raw`f(x) = \log_2(x) = \frac{\ln(x)}{\ln(2)}`, dom: [1e-4, 10] },
];

/* ------------------------------------------------------------------ even / odd */

export interface SymFn { id: string; f: (x: number) => number; tex: string; kind: 'even' | 'odd' | 'none' }
export const SYM_FNS: SymFn[] = [
  { id: 'x2', f: (x) => 0.5 * x * x - 1, tex: String.raw`\tfrac12 x^2 - 1`, kind: 'even' },
  { id: 'cos', f: (x) => 1.5 * Math.cos(x), tex: String.raw`1{,}5\cos(x)`, kind: 'even' },
  { id: 'x3', f: (x) => 0.25 * x ** 3 - x, tex: String.raw`\tfrac14 x^3 - x`, kind: 'odd' },
  { id: 'sin', f: (x) => 1.5 * Math.sin(x), tex: String.raw`1{,}5\sin(x)`, kind: 'odd' },
  { id: 'none', f: (x) => 0.3 * x * x + 0.5 * x - 1, tex: String.raw`0{,}3x^2 + 0{,}5x - 1`, kind: 'none' },
];
/** Numerical symmetry test on sample points. */
export function symmetryOf(f: (x: number) => number): 'even' | 'odd' | 'none' {
  const xs = [0.3, 0.7, 1.1, 1.9, 2.6];
  if (xs.every((x) => Math.abs(f(-x) - f(x)) < 1e-12)) return 'even';
  if (xs.every((x) => Math.abs(f(-x) + f(x)) < 1e-12)) return 'odd';
  return 'none';
}

/** Monotonic but not strictly: rises, stays flat on [2, 4], rises again (C¹ pieces). */
export function plateau(x: number): number {
  if (x < 2) return 2 - 0.25 * (2 - x) ** 2;
  if (x <= 4) return 2;
  return 2 + 0.25 * (x - 4) ** 2;
}

/* ------------------------------------------------------------------ continuity and one-sided limits */

/** The slide's two drawn graphs, re-made: f continuous; g jumps at a = 4, continuous at b = 6,5. */
export const STET_A = 4, STET_B = 6.5;
export const fStet = (x: number) => 1.2 + 0.32 * x + 0.75 * Math.sin(1.25 * x - 0.6);
/** g: left piece for x < a, right piece for x ≥ a (the slide does not say which piece owns g(a)). */
export const gLeft = (x: number) => 2.4 + 0.18 * x + 0.5 * Math.sin(1.1 * x - 1.2);
export const gRight = (x: number) => 0.9 + 0.42 * (x - STET_A) + 0.22 * Math.sin(1.7 * x);
export const gStet = (x: number) => (x < STET_A ? gLeft(x) : gRight(x));
/** The slide's example (x − 1)/(2|x − 1|): +½ right of 1, −½ left of 1, not defined at 1. */
export const absEx = (x: number) => (x === 1 ? NaN : (x - 1) / (2 * Math.abs(x - 1)));

/** One-sided limits numerically: f(a ∓ h) for a small h. */
export const leftVal = (f: (x: number) => number, a: number, h = 1e-7) => f(a - h);
export const rightVal = (f: (x: number) => number, a: number, h = 1e-7) => f(a + h);

/* ------------------------------------------------------------------ limit techniques (slides pp. 5–7) */

export interface LimitEx { id: string; f: (x: number) => number; a: number; value: number }
export const LIMITS: LimitEx[] = [
  { id: 'einsetzen', f: (x) => (x * x + 1) / x, a: 2, value: 5 / 2 },
  { id: 'kuerzen', f: (x) => (x * x - 4) / (x * x + x - 6), a: 2, value: 4 / 5 },
  { id: 'potenz', f: (x) => (x * x + 5 * x) / (2 * x * x), a: Infinity, value: 1 / 2 },
  { id: 'wurzel', f: (x) => (Math.sqrt(x + 4) - 2) / x, a: 0, value: 1 / 4 },
  { id: 'sinx', f: (x) => Math.sin(x) / x, a: 0, value: 1 },
  { id: 'cosx', f: (x) => (Math.cos(x) - 1) / x, a: 0, value: 0 },
  { id: 'tan5x', f: (x) => Math.tan(5 * x) / x, a: 0, value: 5 },
  { id: 'x2sin', f: (x) => (x * x * Math.sin(1 / x)) / Math.sin(x), a: 0, value: 0 },
  { id: 'xsin1x', f: (x) => x * Math.sin(1 / x), a: 0, value: 0 },
];
/** Cancelled forms on the slides (equal to the original for x ≠ a). */
export const kuerzenReduced = (x: number) => (x + 2) / (x + 3);
export const wurzelReduced = (x: number) => 1 / (Math.sqrt(x + 4) + 2);
export const potenzReduced = (x: number) => (1 + 5 / x) / 2;

/* ------------------------------------------------------------------ sin x / x → 1, unit-circle squeeze */

/** Areas in the unit circle for angle x (radians, 0 < x < π/2): triangle OAP ≤ sector OAP ≤ triangle OAT. */
export const circleAreas = (x: number) => ({ small: 0.5 * Math.sin(x), sector: 0.5 * x, big: 0.5 * Math.tan(x) });
/** From the areas, divided by ½ sin x: 1 ≤ x / sin x ≤ 1 / cos x. */
export const squeeze = (x: number) => ({ lower: 1, mid: x / Math.sin(x), upper: 1 / Math.cos(x) });

/* ------------------------------------------------------------------ L'Hôpital */

/** Zoom-figure pair: both vanish at 0; slopes f′(0) = 2, g′(0) = 1 → f/g → 2. */
export const lhF = (x: number) => Math.sin(2 * x);
export const lhG = (x: number) => Math.exp(x) - 1;
export const LH_SLOPES = { f: 2, g: 1 } as const;
/** A-008 counter-example: (x + sin x)/x → 1 for x → ∞, but f′/g′ = 1 + cos x has no limit. */
export const cexRatio = (x: number) => (x + Math.sin(x)) / x;
export const cexDeriv = (x: number) => 1 + Math.cos(x);
/** Misuse without 0/0: (x + 1)/(x + 2) at 0 is ½, the derivative ratio would give 1. */
export const noIndet = (x: number) => (x + 1) / (x + 2);

/** Central difference for derivative checks. */
export const dnum = (f: (x: number) => number, x: number, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);
