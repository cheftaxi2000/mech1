/**
 * Analysis 1, week 3 (Übung 3 + Übung 4 p. 1): continuity, gaps, the intermediate value theorem, graph
 * transformations, reciprocals, injective/surjective, inverse functions, asymptotes and polynomial division.
 * Every formula and number shown in the lessons ana-stetigkeit, ana-transformationen, ana-umkehr and
 * ana-asymptoten is computed here and checked in week3.test.ts.
 */

/* ------------------------------------------------------------------ Lücken und Sprünge (Ü3 p. 2) */
/** Hebbare Lücke: (x² − 1)/(x − 1); not defined at x = 1 (NaN there). */
export const holeF = (x: number) => (x === 1 ? NaN : (x * x - 1) / (x - 1));
/** Polstelle: 1/x. */
export const poleG = (x: number) => 1 / x;
/** Sprungstelle: h(x) = −2 − √(4 − x) for x ≤ 4, 0 for x > 4. */
export const jumpH = (x: number) => (x <= 4 ? -2 - Math.sqrt(4 - x) : 0);

/* ------------------------------------------------------------------ Zwischenwertsatz (Ü3 p. 3) */
export const zwsF = (x: number) => x ** 3 - x - 1;

export interface BisectStep { a: number; b: number; m: number; fa: number; fb: number; fm: number }
/**
 * Bisection (supplement): halve [a, b] n times, always keeping the half where the sign changes.
 * Requires f(a) and f(b) of opposite signs — exactly the situation of the intermediate value theorem.
 */
export function bisect(f: (x: number) => number, a: number, b: number, n: number): BisectStep[] {
  const out: BisectStep[] = [];
  let fa = f(a), fb = f(b);
  if (fa * fb > 0) throw new Error('bisect: no sign change');
  for (let i = 0; i < n; i++) {
    const m = (a + b) / 2, fm = f(m);
    out.push({ a, b, m, fa, fb, fm });
    if (fm === 0) { a = b = m; break; }
    if (fa * fm < 0) { b = m; fb = fm; } else { a = m; fa = fm; }
  }
  return out;
}
/** The interval left after a bisection step. */
export const afterStep = (s: BisectStep): [number, number] => (s.fm === 0 ? [s.m, s.m] : s.fa * s.fm < 0 ? [s.a, s.m] : [s.m, s.b]);

/** The real root of x³ − x − 1 (Cardano; it is the «plastic number»). */
export const ZWS_ROOT = Math.cbrt((9 + Math.sqrt(69)) / 18) + Math.cbrt((9 - Math.sqrt(69)) / 18);

/** Bsp. 2: the left piece of h hits −π at x = 4 − (π − 2)² (solve −2 − √(4 − x) = −π). */
export const H_PI_X = 4 - (Math.PI - 2) ** 2;

/* ------------------------------------------------------------------ Transformationen (Ü3 p. 4–5) */
/** The slide's example p(x) = 2x³ − 3x² − 6x + 6. */
export const p = (x: number) => 2 * x ** 3 - 3 * x ** 2 - 6 * x + 6;
export const dp = (x: number) => 6 * x ** 2 - 6 * x - 6;
/** Critical points of p: p′(x) = 6(x² − x − 1) = 0 ⇔ x = (1 ∓ √5)/2. */
export const P_MAX_X = (1 - Math.sqrt(5)) / 2;
export const P_MIN_X = (1 + Math.sqrt(5)) / 2;

export interface Tr { a: number; b: number; c: number; d: number }
/** y = d · f(c · (x − a)) + b: first shift by a, stretch by 1/c in x, then stretch by d and shift by b in y. */
export const transform = (f: (x: number) => number, { a, b, c, d }: Tr) => (x: number) => d * f(c * (x - a)) + b;
/** Where a point (x₀, y₀) of the original graph lands: x = a + x₀/c, y = d·y₀ + b. */
export const movePoint = ([x0, y0]: readonly [number, number], { a, b, c, d }: Tr): [number, number] => [a + x0 / c, d * y0 + b];

/** Real roots of a function on [lo, hi] by sign changes on a fine grid + bisection (exact zeros of the grid kept). */
export function roots(f: (x: number) => number, lo: number, hi: number, n = 4000): number[] {
  const out: number[] = [];
  let x0 = lo, f0 = f(lo);
  if (f0 === 0) out.push(lo);
  for (let i = 1; i <= n; i++) {
    const x1 = lo + ((hi - lo) * i) / n, f1 = f(x1);
    if (!Number.isFinite(f0) || !Number.isFinite(f1)) { x0 = x1; f0 = f1; continue; }
    if (f1 === 0) out.push(x1);
    else if (f0 * f1 < 0) {
      let a = x0, b = x1, fa = f0;
      for (let k = 0; k < 60; k++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
      // a sign change across a jump is no root: keep it only if f really is (nearly) 0 there
      const r = (a + b) / 2, fr = f(r);
      if (Math.abs(fr) <= 1e-7 * (1 + Math.abs(f0) + Math.abs(f1))) out.push(r);
    }
    x0 = x1; f0 = f1;
  }
  return out;
}
/** The three zeros of p (poles of 1/p). */
export const P_ROOTS = roots(p, -4, 4);

/** Kehrwert der y-Werte and «Kehrwert im x einsetzen». */
export const recipP = (x: number) => 1 / p(x);
export const pOfRecip = (x: number) => p(1 / x);

/* ------------------------------------------------------------------ Ü4 p. 1: max → min */
export const f5 = (t: number) => Math.abs(Math.tan(t * t + t));
export const f5tilde = (x: number) => 1 / f5(1 / x);

/* ------------------------------------------------------------------ Injektiv / surjektiv (Ü3 p. 5–6) */
/** All solutions of f(x) = c in the domain [lo, hi] (the intersections of the graph with the line y = c). */
export const hits = (f: (x: number) => number, lo: number, hi: number, c: number) => {
  const r = roots((x) => f(x) - c, lo, hi);
  return r.filter((x, i) => i === 0 || Math.abs(x - r[i - 1]) > 1e-6);
};

/* ------------------------------------------------------------------ Umkehrfunktionen (Ü3 p. 7–8) */
export const inv1 = (x: number) => (x - 3) / 2; // f(x) = 2x + 3
export const bruch = (x: number) => (x - 1) / (x + 2); // ℝ \ {−2} → ℝ \ {1}
export const bruchInv = (x: number) => -(2 * x + 1) / (x - 1); // ℝ \ {1} → ℝ \ {−2}

/* ------------------------------------------------------------------ Polynomdivision (Ü3 p. 11) */
/** Polynomial as coefficients, highest power first: x³ − 3x + 5 = [1, 0, −3, 5]. */
export type Poly = number[];
export const evalPoly = (q: Poly, x: number) => q.reduce((s, c) => s * x + c, 0);
export const deg = (q: Poly) => q.length - 1;

export interface DivStep {
  /** quotient term: coefficient and power (e.g. x² → [1, 2]) */
  term: [number, number];
  /** term · divisor, aligned to the current remainder (highest first, same length as the remainder) */
  sub: Poly;
  /** remainder after subtracting (same length; leading entry 0) */
  rest: Poly;
}
/** Long division num : den, one step per quotient term (the slide's layout). */
export function longDivide(num: Poly, den: Poly): { q: Poly; r: Poly; steps: DivStep[] } {
  const n = deg(num), m = deg(den);
  let rem = [...num];
  const q: Poly = Array(Math.max(0, n - m + 1)).fill(0);
  const steps: DivStep[] = [];
  for (let k = 0; k <= n - m; k++) {
    const c = rem[k] / den[0], pow = n - m - k;
    q[k] = c;
    const sub = rem.map((_, i) => (i >= k && i - k <= m ? c * den[i - k] : 0));
    const rest = rem.map((v, i) => (i <= k ? 0 : v - sub[i]));
    steps.push({ term: [c, pow], sub, rest });
    rem = rest;
  }
  return { q, r: rem.slice(n - m + 1), steps };
}

/** Asymptote examples (Ü3 p. 9–11). */
export const asym = {
  h1: (x: number) => (2 * x) / (x + 1), // → 2
  h2: (x: number) => (4 * x * x + 3) / (2 * x * x - 1), // → 2 for x → ±∞
  v1: (x: number) => 1 / (x - 2),
  v2: (x: number) => (2 * x + 1) / (x - 1), // = 2 + 3/(x − 1)
  o1: (x: number) => (x * x) / (x + 1), // = x − 1 + 1/(x + 1)
  o2: (x: number) => (x ** 3 - 3 * x + 5) / (x - 1), // = x² + x − 2 + 3/(x − 1)
};
