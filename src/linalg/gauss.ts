import { ONE, ZERO, add, div, eq, isZero, mul, neg, q, sub, type Q } from './frac';

/**
 * Gaussian elimination on an augmented matrix [A | b] with exact rational entries (Übung 2, slides 25–36).
 * The row operations are recorded, so a lesson can replay them step by step: "II − I", "III − 2·I", …
 */
export type Mat = Q[][];
export type Op =
  | { kind: 'add'; target: number; source: number; factor: Q } // row[target] += factor · row[source]
  | { kind: 'swap'; i: number; j: number }
  | { kind: 'scale'; row: number; factor: Q };
export interface Step { op: Op; after: Mat }

export const mat = (rows: number[][]): Mat => rows.map((r) => r.map((x) => q(x)));
const copy = (m: Mat): Mat => m.map((r) => r.slice());

export function apply(m: Mat, op: Op): Mat {
  const r = copy(m);
  if (op.kind === 'swap') [r[op.i], r[op.j]] = [r[op.j], r[op.i]];
  else if (op.kind === 'scale') r[op.row] = r[op.row].map((x) => mul(x, op.factor));
  else r[op.target] = r[op.target].map((x, c) => add(x, mul(op.factor, r[op.source][c])));
  return r;
}

export interface Elim {
  start: Mat;
  steps: Step[];
  /** the matrix after the last step */
  result: Mat;
  /** pivot positions (row, column) in the result; the first non-zero entry of every non-zero row */
  pivots: [number, number][];
  rank: number;
}

const pivotsOf = (m: Mat, nVars: number): [number, number][] => {
  const out: [number, number][] = [];
  m.forEach((row, i) => { const c = row.slice(0, nVars).findIndex((x) => !isZero(x)); if (c >= 0) out.push([i, c]); });
  return out;
};

/** Forward elimination to row-echelon form (Zeilen-Stufen-Form): no scaling, no swaps unless a pivot is 0. `nVars` = number of columns left of the bar. */
export function eliminate(aug: Mat, nVars = aug[0].length - 1): Elim {
  let m = copy(aug);
  const steps: Step[] = [];
  const push = (op: Op) => { m = apply(m, op); steps.push({ op, after: m }); };
  let row = 0;
  for (let col = 0; col < nVars && row < m.length; col++) {
    const p = m.findIndex((r, i) => i >= row && !isZero(r[col]));
    if (p < 0) continue;
    if (p !== row) push({ kind: 'swap', i: row, j: p });
    for (let i = row + 1; i < m.length; i++) {
      if (isZero(m[i][col])) continue;
      push({ kind: 'add', target: i, source: row, factor: neg(div(m[i][col], m[row][col])) });
    }
    row++;
  }
  const pivots = pivotsOf(m, nVars);
  return { start: aug, steps, result: m, pivots, rank: pivots.length };
}

/** Continue from a row-echelon form to the reduced one (Vereinfachte Zeilen-Stufen-Form): pivots 1, zeros above. */
export function reduce(e: Elim, nVars = e.start[0].length - 1): Elim {
  let m = copy(e.result);
  const steps = e.steps.slice();
  const push = (op: Op) => { m = apply(m, op); steps.push({ op, after: m }); };
  const piv = pivotsOf(m, nVars);
  for (const [r, c] of piv.slice().reverse()) {
    if (!eq(m[r][c], ONE)) push({ kind: 'scale', row: r, factor: div(ONE, m[r][c]) });
    for (let i = 0; i < r; i++) if (!isZero(m[i][c])) push({ kind: 'add', target: i, source: r, factor: neg(m[i][c]) });
  }
  const pivots = pivotsOf(m, nVars);
  return { start: e.start, steps, result: m, pivots, rank: pivots.length };
}

export type Kind = 'none' | 'unique' | 'infinite';
export interface Solution {
  kind: Kind;
  rank: number;
  /** m = number of equations, n = number of unknowns */
  m: number; n: number;
  /** indices of pivot / free variables (columns) */
  pivotCols: number[]; freeCols: number[];
  /** unique solution, or a particular solution (free variables = 0) */
  particular?: Q[];
  /** one direction vector per free variable (free variable = 1, the others free = 0): x = particular + Σ α_k · dirs[k] */
  dirs?: Q[][];
}

/** Read the solution set off the REDUCED echelon form. */
export function solve(aug: Mat, nVars = aug[0].length - 1): Solution {
  const red = reduce(eliminate(aug, nVars), nVars).result;
  const piv = pivotsOf(red, nVars);
  const rank = piv.length, m = aug.length;
  const base = { rank, m, n: nVars };
  // a row (0 … 0 | b) with b ≠ 0 means no solution
  const bad = red.some((r) => r.slice(0, nVars).every(isZero) && !isZero(r[nVars]));
  const pivotCols = piv.map((p) => p[1]);
  const freeCols = Array.from({ length: nVars }, (_, c) => c).filter((c) => !pivotCols.includes(c));
  if (bad) return { ...base, kind: 'none', pivotCols, freeCols };
  const particular: Q[] = Array.from({ length: nVars }, () => ZERO);
  piv.forEach(([r, c]) => { particular[c] = red[r][nVars]; });
  if (freeCols.length === 0) return { ...base, kind: 'unique', pivotCols, freeCols, particular };
  const dirs = freeCols.map((fc) => {
    const d: Q[] = Array.from({ length: nVars }, () => ZERO);
    d[fc] = ONE;
    piv.forEach(([r, c]) => { d[c] = neg(red[r][fc]); });
    return d;
  });
  return { ...base, kind: 'infinite', pivotCols, freeCols, particular, dirs };
}

/** Evaluate A·x for a rational vector (used to check solutions). */
export const mulVec = (A: Mat, x: Q[]): Q[] => A.map((r) => r.reduce((s, a, c) => add(s, mul(a, x[c])), ZERO));
export const coeffs = (aug: Mat, nVars = aug[0].length - 1): Mat => aug.map((r) => r.slice(0, nVars));
export const rhs = (aug: Mat, nVars = aug[0].length - 1): Q[] => aug.map((r) => r[nVars]);
export { sub };

/**
 * Rank-based classification as in the table of Übung 4, slide 8, stated correctly for any m × n:
 * none ⇔ rank[A|b] > rank A;  unique ⇔ consistent and r = n;  infinite ⇔ consistent and r < n (n − r free parameters).
 */
export const classify = (aug: Mat, nVars = aug[0].length - 1): Kind => solve(aug, nVars).kind;
