import { eliminate, mat, solve, type Kind, type Mat } from './gauss';
import { isZero } from './frac';

/**
 * Rank and the table of cases (Übung 4, slides 5–11). The rule is stated for any m × n system (R-LA-002):
 *   no solution  ⇔ rank [A | b] > rank A  ⇔ some row is (0 … 0 | b_i) with b_i ≠ 0
 *   unique       ⇔ consistent and r = n
 *   infinite     ⇔ consistent and r < n, with n − r free parameters.
 */
export interface RankInfo {
  m: number; n: number;
  /** rank of A (number of pivots left of the bar) */
  r: number;
  /** rank of [A | b] */
  rAug: number;
  kind: Kind;
  /** number of free parameters n − r (only if a solution exists) */
  free: number;
  /** r = m: A x = b is solvable for EVERY b */
  solvableForAll: boolean;
  /** r = m = n: A x = b has exactly one solution for EVERY b */
  uniqueForAll: boolean;
  /** number of rows that are completely zero left of the bar (dependent equations) */
  zeroRows: number;
  /** the echelon form of [A | b] (pivots left of the bar) */
  echelon: Mat;
}

export function rankInfo(aug: Mat): RankInfo {
  const n = aug[0].length - 1, m = aug.length;
  const e = eliminate(aug, n);
  const eAug = eliminate(aug, n + 1);
  const s = solve(aug, n);
  const r = e.rank;
  return {
    m, n, r, rAug: eAug.rank, kind: s.kind,
    free: s.kind === 'none' ? 0 : n - r,
    solvableForAll: r === m,
    uniqueForAll: r === m && m === n,
    zeroRows: e.result.filter((row) => row.slice(0, n).every(isZero)).length,
    echelon: e.result,
  };
}

/** The rule of slide 8 exactly as printed (kept for the lesson's comparison): true where the printed condition holds. */
export function printedRule(info: RankInfo): { none: boolean; unique: boolean; infinite: boolean } {
  const n = info.n, rows = info.echelon;
  const bAfterR = rows.slice(info.r).map((row) => row[n]);
  return {
    none: info.r < info.m && bAfterR.every((b) => !isZero(b)),
    unique: info.r === info.n && info.n === info.m,
    infinite: info.r < info.n && bAfterR.every(isZero),
  };
}

/** Series 2, problem 2 (slides 9–11): 3x₁ + 2b·x₂ + 4x₃ = 5, 3x₁ + 4x₃ = 5, 2b·x₂ + 3a·x₃ = b. */
export const seriesSystem = (a: number, b: number): Mat => mat([[3, 2 * b, 4, 5], [3, 0, 4, 5], [0, 2 * b, 3 * a, b]]);

export type SeriesCase = 'a' | 'b' | 'c' | 'd';
/** The case of the slides: (a) two free parameters a = b = 0, (b) one free parameter a ≠ 0, b = 0, (c) unique a, b ≠ 0, (d) none a = 0, b ≠ 0. */
export function seriesCase(a: number, b: number): SeriesCase {
  if (b === 0) return a === 0 ? 'a' : 'b';
  return a === 0 ? 'd' : 'c';
}

/**
 * Solution sets the slides leave out (computed by us, checked in the test):
 *  (b) a ≠ 0, b = 0:  x = (5/3, α, 0)
 *  (c) a, b ≠ 0:      x = ((15a − 4b)/(9a), 0, b/(3a))
 *  (d) a = 0, b ≠ 0:  none
 */
export const seriesUnique = (a: number, b: number): [number, number, number] => [(15 * a - 4 * b) / (9 * a), 0, b / (3 * a)];

/** An echelon form in which a dependent equation cancels to a zero row (animation «what the rank counts»): III = I + II. */
export const CANCEL_EXAMPLE: Mat = mat([[1, 1, 1, 2], [0, 1, 2, 1], [1, 2, 3, 3]]);

/** The R⁴ example of slide 5. */
export const PIVOT_EXAMPLE: Mat = mat([[1, 0, 3, 2, 1], [0, 2, 1, 1, 3], [0, 0, 0, 1, 5], [0, 0, 0, 0, 0]]);

/** Presets of the rank explorer: the three small matrices of slide 8 and a few more, incl. m > n and m < n. */
export interface RankPreset { id: string; aug: Mat }
export const RANK_PRESETS: RankPreset[] = [
  { id: 'none', aug: mat([[1, 1, 1, 1], [0, 1, 2, 1], [0, 0, 0, 1]]) },
  { id: 'unique', aug: mat([[1, 1, 1, 1], [0, 1, 1, 1], [0, 0, 1, 1]]) },
  { id: 'infinite', aug: mat([[1, 1, 1, 1], [0, 1, 2, 1], [0, 0, 0, 0]]) },
  { id: 'tall', aug: mat([[1, 0, 1], [0, 1, 2], [1, 1, 3]]) },
  { id: 'tallNone', aug: mat([[1, 0, 1], [0, 1, 2], [1, 1, 4]]) },
  { id: 'wide', aug: mat([[1, 1, 1, 3], [1, 2, 3, 4]]) },
  { id: 'wideNone', aug: mat([[1, 1, 1, 1], [2, 2, 2, 5]]) },
];

