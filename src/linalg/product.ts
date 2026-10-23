/**
 * The matrix product (Übung 4, slides 26–30). Pure maths; matrices are row-wise number[][].
 * C = A·B has C_{ij} = (row i of A)·(column j of B); the column j of C is A applied to the column j of B.
 */
import { shapeOf, type Mat } from './matops';

export type { Mat };

/** Verdict of the shape check A^{m×n}·B^{n'×p}: the product exists exactly when the inner numbers n = n' agree. */
export interface ShapeVerdict { ok: boolean; m: number; n: number; n2: number; p: number; result: [number, number] | null }

export function shapeVerdict(m: number, n: number, n2: number, p: number): ShapeVerdict {
  const ok = n === n2;
  return { ok, m, n, n2, p, result: ok ? [m, p] : null };
}

/** The product exists exactly when the number of columns of A equals the number of rows of B. */
export const canMultiply = (A: Mat, B: Mat) => shapeOf(A)[1] === B.length;

export function matMul(A: Mat, B: Mat): Mat {
  if (!canMultiply(A, B)) throw new Error('A·B needs as many columns in A as rows in B');
  const [m, n] = shapeOf(A), [, p] = shapeOf(B);
  return Array.from({ length: m }, (_, i) => Array.from({ length: p }, (_, j) => {
    let s = 0;
    for (let k = 0; k < n; k++) s += A[i][k] * B[k][j];
    return s + 0;
  }));
}

/** The products A_{ik}·B_{kj}, k = 1…n, whose sum is C_{ij} (the finger computer). */
export function entryTerms(A: Mat, B: Mat, i: number, j: number): { a: number; b: number; k: number }[] {
  return A[i].map((a, k) => ({ a, b: B[k][j], k }));
}

export const entry = (A: Mat, B: Mat, i: number, j: number) => entryTerms(A, B, i, j).reduce((s, t) => s + t.a * t.b, 0) + 0;

export const column = (B: Mat, j: number): number[] => B.map((r) => r[j]);

/** Column picture: column j of A·B is A applied to column j of B. */
export function columnOfProduct(A: Mat, B: Mat, j: number): number[] {
  const x = column(B, j);
  return A.map((r) => r.reduce((s, a, k) => s + a * x[k], 0) + 0);
}

/** Slide 30: the three exercises, with the answers (only the first is on the slide; the others are computed here). */
export const SLIDE30: readonly { A: Mat; B: Mat; C: Mat; onSlide: boolean }[] = [
  { A: [[1], [1], [0], [3]], B: [[1, 0]], C: [[1, 0], [1, 0], [0, 0], [3, 0]], onSlide: true },
  { A: [[1, 0], [2, 2], [0, 1]], B: [[1, 2], [1, 0]], C: [[1, 2], [4, 4], [1, 0]], onSlide: false },
  { A: [[2, 0, 0], [0, 1, 0], [0, 0, -2]], B: [[8, 2], [5, 2], [6, 9]], C: [[16, 4], [5, 2], [-12, -18]], onSlide: false },
];
