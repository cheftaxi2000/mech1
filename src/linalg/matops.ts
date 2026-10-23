/**
 * Entry-wise matrix calculus for Übung 4, slides 22–25: shape, sum, scalar multiple, a matrix applied to a vector.
 * Matrices are row-wise number[][]; a vector is a plain number[].
 */
export type Mat = number[][];

/** [m, n] = (number of rows, number of columns): «Zeilen zuerst, Spalten später». */
export const shapeOf = (A: Mat): [number, number] => [A.length, A[0]?.length ?? 0];

export const sameShape = (A: Mat, B: Mat) => { const a = shapeOf(A), b = shapeOf(B); return a[0] === b[0] && a[1] === b[1]; };

/** m×n matrix of zeros, or built from f(i, j) (0-based). */
export const build = (m: number, n: number, f: (i: number, j: number) => number = () => 0): Mat =>
  Array.from({ length: m }, (_, i) => Array.from({ length: n }, (_, j) => f(i, j)));

/** A + B, entry by entry. Only defined for the same shape. */
export function addMat(A: Mat, B: Mat): Mat {
  if (!sameShape(A, B)) throw new Error('A + B needs the same shape');
  return A.map((r, i) => r.map((v, j) => v + B[i][j]));
}

/** λ·A: every entry is multiplied. */
export const scaleMat = (lambda: number, A: Mat): Mat => A.map((r) => r.map((v) => lambda * v + 0));

/** A·v for a vector with n entries (n = number of columns of A): the combination v₁·a₁ + … + v_n·a_n of the columns. */
export function applyMat(A: Mat, v: number[]): number[] {
  const [, n] = shapeOf(A);
  if (v.length !== n) throw new Error('A·v needs as many columns as the vector has rows');
  return A.map((r) => r.reduce((s, a, k) => s + a * v[k], 0));
}

/** Greatest common divisor of all entries if they are integers (> 1 and not all zero), else 1. */
export function commonFactor(A: Mat): number {
  const flat = A.flat();
  if (!flat.every(Number.isInteger) || flat.every((v) => v === 0)) return 1;
  const g = (a: number, b: number): number => (b === 0 ? Math.abs(a) : g(b, a % b));
  return flat.reduce((s, v) => g(s, v), 0) || 1;
}

/** Entry-wise equality up to a tolerance. */
export const matEq = (A: Mat, B: Mat, eps = 1e-9) => sameShape(A, B) && A.every((r, i) => r.every((v, j) => Math.abs(v - B[i][j]) <= eps));
