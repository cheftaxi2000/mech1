/**
 * Analysis 1, Übung 5: error propagation, mean value theorem, extremum and curvature tests, extrema on a closed
 * interval, the L'Hôpital example, complex arithmetic. Every number shown in the week-5 lessons is computed here
 * and checked in week5.test.ts.
 */
export type Fn = (x: number) => number;

/* ------------------------------------------------------------------ Fehlerrechnung (Ü5 S. 1–2) */

/** Δf = f(x + Δx) − f(x) (exact change) and df = f′(x)·Δx (change along the tangent). */
export function changes(f: Fn, fp: Fn, x: number, dx: number) {
  const exact = f(x + dx) - f(x), lin = fp(x) * dx;
  return { exact, lin, gap: exact - lin };
}
/** Absolute error E_f ≈ |f′(x)|·|Δx| and relative error r_f ≈ E_f / |f(x)| (f(x) ≠ 0). */
export const absErr = (fp: Fn, x: number, dx: number) => Math.abs(fp(x)) * Math.abs(dx);
export const relErr = (f: Fn, fp: Fn, x: number, dx: number) => absErr(fp, x, dx) / Math.abs(f(x));

/** Rectangle A = a·b, only a measured. ΔA = b·Δa exactly (A is linear in a). */
export function rectangle(a: number, b: number, da: number) {
  const A = a * b, dA = (a + da) * b - A;
  return { A, dA, EA: Math.abs(dA), rA: Math.abs(dA) / A, rASimplified: Math.abs(da) / a };
}

/** Cylinder V = π r² h, only r varies, relative radius error ε = |Δr|/r. */
export function cylinder(r: number, h: number, eps: number) {
  const V = Math.PI * r * r * h, dr = eps * r;
  const approx = (2 * Math.PI * r * h * dr) / V; // |ΔV|/V ≈ V′(r)|Δr| / V = 2ε
  const exact = (Math.PI * (r + dr) ** 2 * h - V) / V; // = 2ε + ε²
  return { V, approx, exact };
}

/** Box (Quader): space diagonal d = √(a² + b² + c²), only a varies. */
export function boxDiagonal(a: number, b: number, c: number, da: number) {
  const d2 = a * a + b * b + c * c, d = Math.sqrt(d2), dprime = a / d;
  const Ed = dprime * Math.abs(da), rd = (a * Math.abs(da)) / d2;
  const exact = Math.sqrt((a + da) ** 2 + b * b + c * c) - d;
  return { d2, d, dprime, Ed, rd, exact };
}

/** Power x^n: relative error ≈ n · relative error of x (supplement). */
export const powerRel = (n: number, eps: number) => n * eps;

/* ------------------------------------------------------------------ Mittelwertsatz (Ü5 S. 3) */

export const secantSlope = (f: Fn, a: number, b: number) => (f(b) - f(a)) / (b - a);

/**
 * All c in (a, b) with f′(c) = m (the mean slope). Found from sign changes of g = f′ − m on a fine grid, refined by
 * bisection, and kept only if |g(c)| is really small (a jump of f′, e.g. |x| at 0, is no solution). Grid points
 * where g touches 0 without changing sign are kept too. If g ≈ 0 on the whole interval (a straight piece), every c
 * works: returns 'all'.
 */
export function mvtPoints(fp: Fn, a: number, b: number, m: number, n = 2000): number[] | 'all' {
  const g = (x: number) => fp(x) - m;
  const tol = 1e-7 * (1 + Math.abs(m));
  const xs = Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);
  const inner = xs.slice(1, -1);
  if (inner.every((x) => Math.abs(g(x)) < 1e-9 * (1 + Math.abs(m)))) return 'all';
  const out: number[] = [];
  const push = (c: number) => { if (c > a && c < b && Math.abs(g(c)) < tol * 1e3 && !out.some((o) => Math.abs(o - c) < (b - a) * 1e-3)) out.push(c); };
  for (let i = 0; i < n; i++) {
    let lo = xs[i], hi = xs[i + 1];
    const gl = g(lo), gh = g(hi);
    if (gl === 0) { push(lo); continue; }
    if (gl * gh < 0) {
      for (let k = 0; k < 80; k++) { const mid = 0.5 * (lo + hi); if (g(lo) * g(mid) <= 0) hi = mid; else lo = mid; }
      push(0.5 * (lo + hi));
    } else if (i > 0) {
      // touching zero: local minimum of |g| that is (almost) zero
      const gp = g(xs[i - 1]);
      if (Math.abs(gl) < Math.abs(gp) && Math.abs(gl) < Math.abs(gh) && Math.abs(gl) < 1e-4) {
        let L = xs[i - 1], R = xs[i + 1];
        for (let k = 0; k < 100; k++) { const m1 = L + (R - L) / 3, m2 = R - (R - L) / 3; if (Math.abs(g(m1)) < Math.abs(g(m2))) R = m2; else L = m1; }
        push(0.5 * (L + R));
      }
    }
  }
  return out.sort((p, q) => p - q);
}

/* ------------------------------------------------------------------ Extremum, Krümmung (Ü5 S. 4) */

export interface Fun { f: Fn; fp: Fn; fpp: Fn }
export const FUNS = {
  x3: { f: (x: number) => x ** 3, fp: (x: number) => 3 * x * x, fpp: (x: number) => 6 * x },
  x4: { f: (x: number) => x ** 4, fp: (x: number) => 4 * x ** 3, fpp: (x: number) => 12 * x * x },
  x3x: { f: (x: number) => x ** 3 + x, fp: (x: number) => 3 * x * x + 1, fpp: (x: number) => 6 * x },
  x4x2: { f: (x: number) => x ** 4 - x * x, fp: (x: number) => 4 * x ** 3 - 2 * x, fpp: (x: number) => 12 * x * x - 2 },
  x3mx: { f: (x: number) => x ** 3 - x, fp: (x: number) => 3 * x * x - 1, fpp: (x: number) => 6 * x },
  sq: { f: (x: number) => x * x, fp: (x: number) => 2 * x, fpp: () => 2 },
  cubic: { f: (x: number) => x ** 3 - 3 * x, fp: (x: number) => 3 * x * x - 3, fpp: (x: number) => 6 * x },
  abs: { f: (x: number) => Math.abs(x), fp: (x: number) => (x > 0 ? 1 : x < 0 ? -1 : NaN), fpp: () => 0 },
} satisfies Record<string, Fun>;

export type Sign = -1 | 0 | 1;
const sgn = (v: number, tol = 1e-12): Sign => (v > tol ? 1 : v < -tol ? -1 : 0);

/** Sign of f′ just left and just right of x0 (h small): the «Vorzeichenwechsel» test. */
export function signChange(fp: Fn, x0: number, h = 1e-3): [Sign, Sign] {
  return [sgn(fp(x0 - h)), sgn(fp(x0 + h))];
}

export type Verdict = 'min' | 'max' | 'undecided' | 'none';
/** Second-derivative table of the slide: only meaningful where f′(x0) = 0. */
export function secondDerivTest(fun: Fun, x0: number): Verdict {
  if (Math.abs(fun.fp(x0)) > 1e-9) return 'none';
  const s = fun.fpp(x0);
  return s > 1e-9 ? 'min' : s < -1e-9 ? 'max' : 'undecided';
}
/** Sign change of f′: + → − maximum, − → + minimum, otherwise no extremum. */
export function signTest(fun: Fun, x0: number): 'min' | 'max' | 'neither' {
  const [l, r] = signChange(fun.fp, x0);
  return l > 0 && r < 0 ? 'max' : l < 0 && r > 0 ? 'min' : 'neither';
}
/** What happens at x0: extremum, saddle point (inflection with horizontal tangent), inflection point, nothing. */
export function classify(fun: Fun, x0: number): 'min' | 'max' | 'saddle' | 'inflection' | 'none' {
  const st = signTest(fun, x0);
  const [cl, cr] = signChange(fun.fpp, x0);
  const curvFlip = cl * cr < 0;
  const flat = Math.abs(fun.fp(x0)) < 1e-9;
  if (flat && st !== 'neither') return st;
  if (curvFlip) return flat ? 'saddle' : 'inflection';
  return 'none';
}

/** Intervals of constant sign of g on [a, b] (for the sign bars of f′ and f″), boundaries refined by bisection. */
export function signIntervals(g: Fn, a: number, b: number, n = 800): { from: number; to: number; s: Sign }[] {
  const out: { from: number; to: number; s: Sign }[] = [];
  let start = a, cur = sgn(g(a + (b - a) * 1e-6), 1e-10);
  let prevX = a;
  for (let i = 1; i <= n; i++) {
    const x = a + ((b - a) * i) / n, s = sgn(g(x), 1e-10);
    if (s !== 0 && cur !== 0 && s !== cur) {
      let lo = prevX, hi = x;
      for (let k = 0; k < 60; k++) { const m = 0.5 * (lo + hi); if (sgn(g(m), 1e-10) === cur) lo = m; else hi = m; }
      out.push({ from: start, to: 0.5 * (lo + hi), s: cur }); start = 0.5 * (lo + hi); cur = s;
    } else if (cur === 0 && s !== 0) cur = s;
    prevX = x;
  }
  out.push({ from: start, to: b, s: cur });
  return out;
}

/* ------------------------------------------------------------------ Extremalstellen auf [a, b] (Ü5 S. 5) */

export interface Candidate { x: number; y: number; kind: 'end' | 'crit'; inside: boolean }
/** Candidates of a continuous, differentiable f on [a, b]: both ends and the zeros of f′ (also those outside). */
export function candidates(fun: Fun, a: number, b: number, crit: readonly number[]): Candidate[] {
  const c: Candidate[] = [
    { x: a, y: fun.f(a), kind: 'end', inside: true },
    ...crit.map((x) => ({ x, y: fun.f(x), kind: 'crit' as const, inside: x >= a && x <= b })),
    { x: b, y: fun.f(b), kind: 'end', inside: true },
  ];
  return c.sort((p, q) => p.x - q.x);
}
/** Global max and min over the allowed candidates (all x where the value is attained). */
export function globalExtrema(cands: readonly Candidate[]) {
  const ok = cands.filter((c) => c.inside);
  const max = Math.max(...ok.map((c) => c.y)), min = Math.min(...ok.map((c) => c.y));
  const near = (v: number, w: number) => Math.abs(v - w) < 1e-12;
  return { max, min, argmax: ok.filter((c) => near(c.y, max)).map((c) => c.x), argmin: ok.filter((c) => near(c.y, min)).map((c) => c.x) };
}
/** The slide's two examples, with the zeros of f′ in closed form. */
export const EX1 = { fun: FUNS.x3mx, a: -0.5, b: 1, crit: [-1 / Math.sqrt(3), 1 / Math.sqrt(3)] };
export const EX2 = { fun: FUNS.x4x2, a: -2, b: 2, crit: [-1 / Math.SQRT2, 0, 1 / Math.SQRT2] };

/* ------------------------------------------------------------------ L'Hôpital example (Ü5 S. 6) */

export const lhQuotient = (x: number) => Math.log(x) / Math.exp(2 * x);
export const lhAfter = (x: number) => (1 / x) / (2 * Math.exp(2 * x));

/* ------------------------------------------------------------------ Komplexe Zahlen (Ü5 S. 6–8) */

export interface C { re: number; im: number }
export const cx = (re: number, im: number): C => ({ re, im });
export const cadd = (z: C, w: C): C => cx(z.re + w.re, z.im + w.im);
export const csub = (z: C, w: C): C => cx(z.re - w.re, z.im - w.im);
/** (a + bi)(c + di) = (ac − bd) + (ad + bc)i — the slide's formula. */
export const cmul = (z: C, w: C): C => cx(z.re * w.re - z.im * w.im, z.re * w.im + z.im * w.re);
export const conj = (z: C): C => cx(z.re, -z.im);
export const cabs = (z: C) => Math.hypot(z.re, z.im);
/** (a + bi)/(c + di) = (ac + bd)/(c² + d²) + (bc − ad)/(c² + d²) i, c + di ≠ 0 — the slide's formula. */
export function cdiv(z: C, w: C): C {
  const n = w.re * w.re + w.im * w.im;
  if (n === 0) throw new Error('division by 0');
  return cx((z.re * w.re + z.im * w.im) / n, (z.im * w.re - z.re * w.im) / n);
}
/** The four terms of «ausmultiplizieren» before i² = −1 is used: ac, ad·i, bc·i, bd·i². */
export const expandTerms = (z: C, w: C) => ({ ac: z.re * w.re, ad: z.re * w.im, bc: z.im * w.re, bd: z.im * w.im });
