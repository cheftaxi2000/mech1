import { ease } from '../anim/geometry';

/**
 * The geometric twin of the Gauss steps (Übung 2, slide 33 with the pictures of slides 14–15):
 *   I: x₁ + x₂ = 3,   II: 2x₁ − x₂ = 0.
 * A row operation replaces ONE line by a combination of the two. Every combination (1−s)·II + s·(II − 2·I) still passes
 * through the common point (1, 2), so the replaced line turns around that point until it is horizontal.
 * Lines are a·x + b·y = c  (x for x₁, y for x₂).
 */
export type Eq3 = [number, number, number];
export const E1: Eq3 = [1, 1, 3], E2: Eq3 = [2, -1, 0];
export const POINT: [number, number] = [1, 2];

/** the augmented matrix at the END of each step (what the caption says) */
export const STAGES: Eq3[][] = [
  [E1, E2],
  [E1, [0, -3, -6]],   // II − 2·I:        −3x₂ = −6, a horizontal line
  [[1, 0, 1], [0, -3, -6]], // I + 1/3·II:  x₁ = 1,   a vertical line
  [[1, 0, 1], [0, -3, -6]], // read off the point
];
export const OPS = ['', '\\mathrm{II} - 2\\cdot \\mathrm{I}', '\\mathrm{I} + \\tfrac{1}{3}\\cdot \\mathrm{II}', ''];

export interface Twin {
  lines: [Eq3, Eq3];
  /** the line before this step's operation (dashed grey ghost), if one moves */
  ghost: { eq: Eq3; which: 0 | 1 } | null;
  /** operation label to show (empty = none) */
  op: string;
  /** which line currently moves: 0 = I, 1 = II */
  moving: 0 | 1 | null;
  /** 0..1: opacity of the intersection's coordinates and the dashed projections onto the axes (step 3) */
  reading: number;
  /** 0..1 opacity of the whole figure's lines (step 0 draws them in) */
  o: number;
}

const mix = (a: Eq3, b: Eq3, k: number): Eq3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

export function twinScene(step: number, t: number): Twin {
  const k = ease(t);
  if (step === 0) return { lines: [E1, E2], ghost: null, op: '', moving: null, reading: 0, o: k };
  if (step === 1) return { lines: [E1, mix(STAGES[0][1], STAGES[1][1], k)], ghost: { eq: E2, which: 1 }, op: OPS[1], moving: 1, reading: 0, o: 1 };
  if (step === 2) return { lines: [mix(STAGES[1][0], STAGES[2][0], k), STAGES[1][1]], ghost: { eq: E1, which: 0 }, op: OPS[2], moving: 0, reading: 0, o: 1 };
  return { lines: [STAGES[2][0], STAGES[2][1]], ghost: null, op: '', moving: null, reading: k, o: 1 };
}
