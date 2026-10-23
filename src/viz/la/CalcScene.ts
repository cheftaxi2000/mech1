/**
 * Pure geometry of the figures of la-rechnen (Übung 4, slides 24–25): sum of two matrices applied to a vector,
 * and the scalar multiple λA. The React figures only draw what is computed here.
 */
import { add, apply, mm, type M2, type V2 } from '../../linalg/plane2';

/** Half width r of a symmetric window [−r, r]² that contains all points with a margin; at least `min`, rounded up to an integer. */
export function windowFor(points: V2[], min = 3, margin = 0.8): number {
  const m = Math.max(0, ...points.map((p) => Math.max(Math.abs(p[0]), Math.abs(p[1]))));
  return Math.max(min, Math.ceil(m + margin));
}

export const addM2 = (A: M2, B: M2): M2 => [[A[0][0] + B[0][0], A[0][1] + B[0][1]], [A[1][0] + B[1][0], A[1][1] + B[1][1]]];
export const scaleM2 = (k: number, A: M2): M2 => [[k * A[0][0] + 0, k * A[0][1] + 0], [k * A[1][0] + 0, k * A[1][1] + 0]];

export interface SumScene {
  v: V2; Av: V2; Bv: V2; Cv: V2; S: M2;
  /** tips of the dashed copies that complete the parallelogram: Bv shifted to the tip of Av, Av shifted to the tip of Bv */
  tipAvBv: V2;
  r: number;
}

/** v, Av, Bv and (A+B)v; (A+B)v is the diagonal of the parallelogram spanned by Av and Bv. */
export function sumScene(A: M2, B: M2, v: V2): SumScene {
  const S = addM2(A, B), Av = apply(A, v), Bv = apply(B, v), Cv = apply(S, v);
  const tipAvBv = add(Av, Bv);
  return { v, Av, Bv, Cv, S, tipAvBv, r: windowFor([v, Av, Bv, Cv, tipAvBv], 3) };
}

export interface ScalarScene {
  lam: number; v: V2; Av: V2; lAv: V2; L: M2;
  /** image of the unit square [0,1]² under A and under λA (closed polygon, 4 corners) */
  squareA: V2[]; squareL: V2[];
  r: number;
}

const unit: V2[] = [[0, 0], [1, 0], [1, 1], [0, 1]];

export function scalarScene(A: M2, lam: number, v: V2): ScalarScene {
  const L = scaleM2(lam, A), Av = apply(A, v), lAv = apply(L, v);
  const squareA = unit.map((p) => apply(A, p)), squareL = unit.map((p) => apply(L, p));
  return { lam, v, Av, lAv, L, squareA, squareL, r: windowFor([v, Av, lAv, ...squareA, ...squareL], 3) };
}

/** Product of two 2×2 matrices again (re-exported for the figures that need AB). */
export const prod2 = mm;
