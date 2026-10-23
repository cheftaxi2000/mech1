/**
 * Special matrices and the transpose (Übung 4, slides 31–36). Pure helpers; matrices are row-wise number[][].
 * Indices are 0-based here; the lessons write A_{ij} with 1-based i, j.
 */
import type { Mat } from './matops';

export type { Mat };

/** Aᵀ: columns become rows, (Aᵀ)_{ji} = A_{ij}; an m×n matrix becomes n×m. */
export function transpose(A: Mat): Mat {
  const m = A.length, n = A[0]?.length ?? 0;
  return Array.from({ length: n }, (_, j) => Array.from({ length: m }, (_, i) => A[i][j]));
}

export const isSquare = (A: Mat) => A.length > 0 && A.every((r) => r.length === A.length);

const close = (a: number, b: number, eps: number) => Math.abs(a - b) <= eps;

/** Aᵀ = A. Needs a square matrix. */
export const isSymmetric = (A: Mat, eps = 1e-9) => isSquare(A) && A.every((r, i) => r.every((v, j) => close(v, A[j][i], eps)));

/** A = −Aᵀ. Needs a square matrix; forces zeros on the diagonal (A_ii = −A_ii). */
export const isAntisymmetric = (A: Mat, eps = 1e-9) => isSquare(A) && A.every((r, i) => r.every((v, j) => close(v, -A[j][i], eps)));

/** Everything off the diagonal is 0 (the matrix need not be square). */
export const isDiagonal = (A: Mat, eps = 1e-9) => A.every((r, i) => r.every((v, j) => i === j || Math.abs(v) <= eps));

/** «Rechts-Dreiecksmatrix» R: zeros below the diagonal. */
export const isUpperTriangular = (A: Mat, eps = 1e-9) => isSquare(A) && A.every((r, i) => r.every((v, j) => j >= i || Math.abs(v) <= eps));

/** «Links-Dreiecksmatrix» L: zeros above the diagonal. */
export const isLowerTriangular = (A: Mat, eps = 1e-9) => isSquare(A) && A.every((r, i) => r.every((v, j) => j <= i || Math.abs(v) <= eps));

/** 𝕀: ones on the diagonal, zeros elsewhere. */
export const isIdentity = (A: Mat, eps = 1e-9) => isSquare(A) && A.every((r, i) => r.every((v, j) => close(v, i === j ? 1 : 0, eps)));

export const identity = (n: number): Mat => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));

export const diag = (d: number[]): Mat => d.map((v, i) => d.map((_, j) => (i === j ? v : 0)));

/** The mirror partner of entry (i, j) across the diagonal. */
export const mirror = (i: number, j: number): [number, number] => [j, i];

/** All pairs (i, j) with i < j: each pair of mirror partners once. */
export function mirrorPairs(n: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) out.push([i, j]);
  return out;
}

/** The pairs i < j where the symmetry A_ij = A_ji fails. */
export const symmetryBreaks = (A: Mat, eps = 1e-9) => mirrorPairs(A.length).filter(([i, j]) => !close(A[i][j], A[j][i], eps));

/** The pairs i < j where the antisymmetry A_ij = −A_ji fails, plus the diagonal entries that are not 0 (as [i, i]). */
export function antisymmetryBreaks(A: Mat, eps = 1e-9): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < A.length; i++) if (Math.abs(A[i][i]) > eps) out.push([i, i]);
  for (const [i, j] of mirrorPairs(A.length)) if (!close(A[i][j], -A[j][i], eps)) out.push([i, j]);
  return out;
}

/** Copy the upper triangle onto the lower one: the result is symmetric. */
export const symmetrize = (A: Mat): Mat => A.map((r, i) => r.map((v, j) => (j >= i ? v : A[j][i])));

/** Copy the upper triangle, negated, onto the lower one and clear the diagonal: the result is antisymmetric. */
export const antisymmetrize = (A: Mat): Mat => A.map((r, i) => r.map((v, j) => (j > i ? v : j === i ? 0 : -A[j][i] + 0)));
