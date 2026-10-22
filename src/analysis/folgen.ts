/**
 * Week 1 (Übung 1, pp. 10–11): sequences, boundedness, monotonicity, convergence, limits of fractions and roots.
 * Every number the lessons show is computed here and checked in folgen.test.ts.
 */
export type Seq = (n: number) => number;

/** Terms (n, a_n) for n = n0 … n1. */
export function terms(a: Seq, n0: number, n1: number): [number, number][] {
  const out: [number, number][] = [];
  for (let n = n0; n <= n1; n++) out.push([n, a(n)]);
  return out;
}

/**
 * The ε-strip test of convergence, checked up to nMax: the smallest N such that |a_n − L| < ε for every n with
 * N ≤ n ≤ nMax, or null when no such N ≤ nMax/2 exists (terms keep leaving the strip in the second half of the check).
 * `dist` = |a_n − L| as a closed form where known (avoids rounding exactly on the strip's edge).
 * A finite check — the lesson gives the reason it holds for every n.
 */
export function entryIndex(a: Seq, L: number, eps: number, nMax = 5000, n0 = 1, dist: Seq = (n) => Math.abs(a(n) - L)): number | null {
  let last = n0 - 1;
  for (let n = n0; n <= nMax; n++) if (!(dist(n) < eps)) last = n;
  return last + 1 > nMax / 2 ? null : last + 1;
}

/** Smallest and largest term for n0 ≤ n ≤ nMax (the «Parallelstreifen» of a bounded sequence, sampled). */
export function range(a: Seq, n0: number, nMax: number): [number, number] {
  let lo = Infinity, hi = -Infinity;
  for (let n = n0; n <= nMax; n++) { const v = a(n); lo = Math.min(lo, v); hi = Math.max(hi, v); }
  return [lo, hi];
}

export type Mono = 'inc' | 'dec' | 'none';
/** Monotonicity of the first terms (U01 p. 10: wachsend a_{n+1} ≥ a_n, fallend a_{n+1} ≤ a_n). */
export function monotone(a: Seq, n0: number, nMax: number): Mono {
  let inc = true, dec = true;
  for (let n = n0; n < nMax; n++) { if (a(n + 1) < a(n)) inc = false; if (a(n + 1) > a(n)) dec = false; }
  return inc ? 'inc' : dec ? 'dec' : 'none';
}

/* ---------------------------------------------------------------- the ε-strip explorer (supplement) */
export type ExplorerKey = 'mono' | 'alt' | 'osc' | 'grow';
export interface ExplorerSeq {
  a: Seq;
  /** limit, or null for a divergent sequence */
  L: number | null;
  /** exact bounds inf/sup (null sup = unbounded) */
  inf: number; sup: number | null;
  /** |a_n − L| as a closed form (the reason the strip test holds for every n, not only the drawn ones) */
  dist?: Seq;
}
export const EXPLORER: Record<ExplorerKey, ExplorerSeq> = {
  // n/(n+1) = 1 − 1/(n+1): increasing, 1/2 ≤ a_n < 1
  mono: { a: (n) => n / (n + 1), L: 1, inf: 0.5, sup: 1, dist: (n) => 1 / (n + 1) },
  // 1 + (−1)^n / n: jumps around 1, a_1 = 0 (smallest), a_2 = 3/2 (largest)
  alt: { a: (n) => 1 + (-1) ** n / n, L: 1, inf: 0, sup: 1.5, dist: (n) => 1 / n },
  // (−1)^n: bounded, never settles
  osc: { a: (n) => (-1) ** n, L: null, inf: -1, sup: 1 },
  // n/10: increasing without bound
  grow: { a: (n) => n / 10, L: null, inf: 0.1, sup: null },
};
/** Closed forms of the entry index: 1/(n+1) < ε ⇔ n > 1/ε − 1;  1/n < ε ⇔ n > 1/ε. */
export const entryMono = (eps: number) => Math.max(1, Math.floor(1 / eps - 1) + 1);
export const entryAlt = (eps: number) => Math.floor(1 / eps) + 1;

/* ---------------------------------------------------------------- animation data */
/** «konvergent ⇒ beschränkt»: a_n = 1 + (−1)^n/n, L = 1, ε = 0,3. */
export const KB = (() => {
  const a = EXPLORER.alt.a, L = 1, eps = 0.3;
  const N = entryIndex(a, L, eps)!; // = 4
  const before = terms(a, 1, N - 1);
  const lo = Math.min(L - eps, ...before.map((p) => p[1]));
  const hi = Math.max(L + eps, ...before.map((p) => p[1]));
  return { a, L, eps, N, lo, hi, nMax: 16 };
})();

/** «beschränkt & monoton ⇒ konvergent»: a_n = 1 − 1/n, first bound 1,6, smallest bound S = 1, ε = 0,15. */
export const MB = (() => {
  const a: Seq = (n) => 1 - 1 / n, S = 1, eps = 0.15, bound0 = 1.6;
  const N = terms(a, 1, 1000).find((p) => p[1] > S - eps)![0]; // first term above S − ε  (= 7)
  return { a, S, eps, bound0, N, nMax: 16 };
})();

/** The slide's plot (U01 p. 10), drawn with sequences of the same look. */
export const SLIDE = {
  div: (n: number) => 0.33 * n,                                     // blue squares: straight up
  conv: (n: number) => 2.6 - 2.4 * Math.exp(-0.25 * n) * Math.cos(0.3 * n),  // green crosses: rise, overshoot, settle
  osc: (n: number) => -0.25 + 0.55 * Math.sin(1.25 * n),             // magenta circles: oscillate in a band
};

/* ---------------------------------------------------------------- limits of fractions (U01 p. 11) */
/** Polynomial as coefficients by power: [[5, 3], [3, 1], [7, 0]] = 5n³ + 3n + 7. */
export type Poly = readonly (readonly [number, number])[];
export const polyEval = (p: Poly, n: number) => p.reduce((s, [c, k]) => s + c * n ** k, 0);
export const degree = (p: Poly) => Math.max(...p.filter(([c]) => c !== 0).map(([, k]) => k));
export const lead = (p: Poly) => p.find(([, k]) => k === degree(p))![0];

/**
 * Limit of P(n)/Q(n) by the degree rule. A-004: if deg P > deg Q the limit is +∞ or −∞ with the sign of the ratio of
 * the leading coefficients (the slide writes «= ∞», true for its example).
 */
export function degreeLimit(P: Poly, Q: Poly): number {
  const p = degree(P), q = degree(Q), r = lead(P) / lead(Q);
  return p > q ? (r > 0 ? Infinity : -Infinity) : p === q ? r : 0;
}
/** Every term divided by the highest power of the DENOMINATOR: c·n^k → c·n^(k−q). Returns [numerator, denominator] terms. */
export function divided(P: Poly, Q: Poly): [Poly, Poly] {
  const q = degree(Q);
  return [P.map(([c, k]) => [c, k - q] as const), Q.map(([c, k]) => [c, k - q] as const)];
}

export type FracKey = 'gt' | 'eq' | 'lt' | 'neg';
export const FRACS: Record<FracKey, { P: Poly; Q: Poly; n0: number }> = {
  gt: { P: [[5, 3], [3, 1], [7, 0]], Q: [[1, 2], [-2, 1]], n0: 3 }, // n² − 2n = 0 at n = 2: start at n = 3
  eq: { P: [[7, 2], [3, 1]], Q: [[4, 2]], n0: 1 },
  lt: { P: [[1, 5], [-4, 1]], Q: [[6, 6], [-2, 0]], n0: 1 },
  neg: { P: [[-2, 3], [3, 1]], Q: [[1, 2], [1, 0]], n0: 1 },   // A-004: (3n − 2n³)/(n² + 1) → −∞
};
export const fracValue = (k: FracKey, n: number) => polyEval(FRACS[k].P, n) / polyEval(FRACS[k].Q, n);

/* ---------------------------------------------------------------- roots: the 3rd binomial formula (U01 p. 11) */
/** s = √(1 + 1/n) (side of the square of area 1 + 1/n), δ = s − 1. */
export const side = (n: number) => Math.sqrt(1 + 1 / n);
/** The slide's sequence n(√(1 + 1/n) − 1) — a «0 · ∞» fight. */
export const rootSeq = (n: number) => n * (side(n) - 1);
/** After the trick: 1/(√(1 + 1/n) + 1) — no fight left, → 1/2. */
export const rootTrick = (n: number) => 1 / (side(n) + 1);
