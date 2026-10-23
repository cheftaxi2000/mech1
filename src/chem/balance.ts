import { ONE, ZERO, div, isZero, mul, q, sub, type Q } from '../linalg/frac';
import { parseFormula } from './formula';

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/**
 * Balance a chemical equation: the smallest positive integer coefficients [reactants…, products…] so that every element
 * occurs equally often on both sides. Solves the linear system (rows = elements, columns = species) by Gaussian
 * elimination with exact fractions — the same method as in Linear Algebra. Returns null if there is no unique solution.
 */
export function balance(reactants: string[], products: string[]): number[] | null {
  const species = [...reactants, ...products];
  const counts = species.map((s) => parseFormula(s));
  const elements = [...new Set(counts.flatMap((c) => Object.keys(c)))];
  const nR = reactants.length;
  const A: Q[][] = elements.map((el) => species.map((_, j) => q((j < nR ? 1 : -1) * (counts[j][el] ?? 0))));
  const n = species.length;
  // reduced row echelon form
  const pivots: number[] = [];
  let r = 0;
  for (let c = 0; c < n && r < A.length; c++) {
    const p = A.findIndex((row, i) => i >= r && !isZero(row[c]));
    if (p < 0) continue;
    [A[r], A[p]] = [A[p], A[r]];
    A[r] = A[r].map((x) => div(x, A[r][c]));
    for (let i = 0; i < A.length; i++) if (i !== r && !isZero(A[i][c])) { const f = A[i][c]; A[i] = A[i].map((x, k) => sub(x, mul(f, A[r][k]))); }
    pivots.push(c); r++;
  }
  const free = Array.from({ length: n }, (_, c) => c).filter((c) => !pivots.includes(c));
  if (free.length !== 1) return null; // none or several independent balances
  const f = free[0];
  const v: Q[] = Array.from({ length: n }, () => ZERO);
  v[f] = ONE;
  pivots.forEach((c, row) => { v[c] = sub(ZERO, A[row][f]); });
  const lcm = v.reduce((l, x) => (l * x[1]) / gcd(l, x[1]), 1);
  let ints = v.map((x) => (x[0] * lcm) / x[1]);
  const g = ints.reduce((a, b) => gcd(a, b), 0);
  ints = ints.map((x) => x / g);
  if (ints.every((x) => x < 0)) ints = ints.map((x) => -x);
  return ints.every((x) => x > 0) ? ints : null;
}
