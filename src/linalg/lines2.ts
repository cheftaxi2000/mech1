/**
 * Linear equations as lines (Übung 2, slides 4–15): a·x + b·y = c, two of them (a system), combinations α·E₁ + β·E₂.
 * Exact answers come from the shared elimination (`gauss.ts`), the figures only draw what is computed here.
 */
import { mat, solve } from './gauss';
import { num, q, type Q } from './frac';

/** a·x + b·y = c */
export type Eq2 = readonly [number, number, number];

export const dotEq = (e: Eq2, x: number, y: number) => e[0] * x + e[1] * y - e[2];
/** Does the point (x, y) satisfy the equation (up to rounding)? */
export const holds = (e: Eq2, x: number, y: number, tol = 1e-9) => Math.abs(dotEq(e, x, y)) < tol;

export type LineKind = 'line' | 'all' | 'empty';
/** One equation: a line (a or b ≠ 0), the whole plane (0 = 0) or nothing (0 = c with c ≠ 0). */
export const lineKind = (e: Eq2): LineKind => (e[0] !== 0 || e[1] !== 0 ? 'line' : e[2] === 0 ? 'all' : 'empty');

/**
 * What two equations do together:
 *  cross    – the lines meet in exactly one point (unique solution)
 *  same     – the same line (infinitely many solutions, all on that line)
 *  parallel – parallel and different (no solution)
 *  all      – 0 = 0 twice (every point is a solution)
 *  empty    – one of the equations is 0 = c with c ≠ 0 (no solution)
 */
export type Rel2 = 'cross' | 'same' | 'parallel' | 'all' | 'empty';
export interface TwoLines { rel: Rel2; det: number; point?: readonly [Q, Q] }

export function twoLines(e1: Eq2, e2: Eq2): TwoLines {
  const det = e1[0] * e2[1] - e2[0] * e1[1];
  const s = solve(mat([[e1[0], e1[1], e1[2]], [e2[0], e2[1], e2[2]]]));
  if (s.kind === 'unique') return { rel: 'cross', det, point: [s.particular![0], s.particular![1]] };
  if (s.kind === 'none') return { rel: lineKind(e1) === 'empty' || lineKind(e2) === 'empty' ? 'empty' : 'parallel', det };
  return { rel: s.rank === 0 ? 'all' : 'same', det };
}

/** α·E₁ + β·E₂, coefficient by coefficient. */
export const combine = (e1: Eq2, e2: Eq2, alpha: number, beta: number): Eq2 =>
  [alpha * e1[0] + beta * e2[0], alpha * e1[1] + beta * e2[1], alpha * e1[2] + beta * e2[2]];

/** Linear interpolation between two equations (used to morph one line into another). */
export const lerpEq = (e: Eq2, f: Eq2, u: number): Eq2 => [e[0] + (f[0] - e[0]) * u, e[1] + (f[1] - e[1]) * u, e[2] + (f[2] - e[2]) * u];

/**
 * The line a·x + b·y = c as written on the slides: «2x+3y=5», «x−2y=−1», «−3y=−4», «3x=2».
 * Coefficients 1 and −1 lose the 1, zero terms vanish. `fmt` formats a coefficient (default: plain numbers); the minus is a TeX hyphen.
 */
export function eqTex(coef: readonly number[], rhs: number, vars: readonly string[] = ['x', 'y'], fmt: (v: number) => string = (v) => String(+v.toFixed(6))): string {
  let out = '';
  coef.forEach((c, i) => {
    if (c === 0) return;
    const mag = Math.abs(c) === 1 ? '' : fmt(Math.abs(c));
    out += (out === '' ? (c < 0 ? '-' : '') : c < 0 ? '-' : '+') + mag + vars[i];
  });
  return `${out === '' ? '0' : out}=${rhs < 0 ? '-' : ''}${fmt(Math.abs(rhs))}`;
}

/** The point on the line where one coordinate is fixed: `x` fixed → y, or `y` fixed → x (exact). Undefined if the line is parallel to that axis. */
export function pointOnLine(e: Eq2, fixed: 'x' | 'y', v: Q): readonly [Q, Q] | undefined {
  const [a, b, c] = e;
  if (fixed === 'x') {
    if (b === 0) return undefined;
    const y = q(c * v[1] - a * v[0], b * v[1]);
    return [v, y];
  }
  if (a === 0) return undefined;
  const x = q(c * v[1] - b * v[0], a * v[1]);
  return [x, v];
}

/**
 * The parameter range (in steps of 1/2) in which a point of the line a·x + b·y = c stays inside the window |x| ≤ X, |y| ≤ Y.
 * The parameter is x when |b| ≥ |a| (flat line) and y otherwise. Returns undefined when the line does not meet the window.
 */
export function lineParam(e: Eq2, X: number, Y: number): { fixed: 'x' | 'y'; lo: number; hi: number } | undefined {
  const [a, b, c] = e;
  if (lineKind(e) !== 'line') return undefined;
  const fixed: 'x' | 'y' = Math.abs(b) >= Math.abs(a) ? 'x' : 'y';
  let lo = fixed === 'x' ? -X : -Y, hi = -lo;
  if (fixed === 'x') {
    if (a !== 0) { const s = [(c - b * Y) / a, (c + b * Y) / a]; lo = Math.max(lo, Math.min(...s)); hi = Math.min(hi, Math.max(...s)); }
    else if (Math.abs(c / b) > Y) return undefined;
  } else {
    if (b !== 0) { const s = [(c - a * X) / b, (c + a * X) / b]; lo = Math.max(lo, Math.min(...s)); hi = Math.min(hi, Math.max(...s)); }
    else if (Math.abs(c / a) > X) return undefined;
  }
  lo = Math.ceil(lo * 2 - 1e-9) / 2; hi = Math.floor(hi * 2 + 1e-9) / 2;
  return lo <= hi ? { fixed, lo, hi } : undefined;
}

export const qNum = (p: readonly [Q, Q]): [number, number] => [num(p[0]), num(p[1])];
