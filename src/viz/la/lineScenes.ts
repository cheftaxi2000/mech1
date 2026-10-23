/**
 * Pure scenes of the two step animations of «Lineare Gleichungssysteme geometrisch» (Übung 2):
 *  combineScene  – slide 13, why E₁ + E₂ passes through the common point (x₀, y₀) = (1, 1)
 *  simplifyScene – slides 14–15, E₁ − E₂ and E₁ + 2·E₂ replace the lines by a horizontal and a vertical one; the point stays
 * A scene maps (step, t ∈ [0, 1]) to lines, points and labels in math coordinates; <LineSceneFig> draws it in the shared Plot.
 * Each step's final frame (t = 1) shows what its caption says (tested in lineScenes.test.ts).
 */
import { combine, lerpEq, type Eq2 } from '../../linalg/lines2';

export type SRole = 'f' | 'g' | 'sec' | 'asym' | 'ref' | 'pt' | 'fg';
export interface SLine { key: string; e: Eq2; role: SRole; o: number; dashed?: boolean }
export interface SPoint { key: string; x: number; y: number; role: SRole; o: number }
export interface SLabel { key: string; x: number; y: number; tex: string; role: SRole; o: number; anchor?: 'c' | 'l' | 'r' | 't' | 'b'; dx?: number; dy?: number }
export interface LineScene { lines: SLine[]; points: SPoint[]; labels: SLabel[] }
export interface Win { x: readonly [number, number]; y: readonly [number, number]; w: number; h: number }

const ease = (u: number) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
/** progress of a sub-interval [a, b] of the step's time */
const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));

/* ---------------------------------------------------------------- slide 13: combining algebraically */
export const C_E1: Eq2 = [2, 3, 5], C_E2: Eq2 = [1, -2, -1];
export const C_P: [number, number] = [1, 1];
export const COMBINE_WIN: Win = { x: [-3, 5], y: [-2, 4.5], w: 400, h: 330 };
export const COMBINE_STEPS = 3;

export function combineScene(step: number, t: number): LineScene {
  const lines: SLine[] = [], points: SPoint[] = [], labels: SLabel[] = [];
  const a0 = step === 0 ? seg(t, 0, 0.6) : 1;
  lines.push({ key: 'E1', e: C_E1, role: 'f', o: a0 }, { key: 'E2', e: C_E2, role: 'g', o: a0 });
  labels.push({ key: 'lE1', x: -2.2, y: 4.15, tex: 'E_1:\\ 2x+3y=5', role: 'f', o: a0, anchor: 'l' });
  labels.push({ key: 'lE2', x: 4.8, y: 1.75, tex: 'E_2:\\ x-2y=-1', role: 'g', o: a0, anchor: 'r', dy: 0 });
  const pIn = step === 0 ? seg(t, 0.5, 1) : 1;
  points.push({ key: 'P', x: C_P[0], y: C_P[1], role: 'pt', o: pIn });
  labels.push({ key: 'lP', x: C_P[0], y: C_P[1], tex: '(x_0, y_0)', role: 'pt', o: pIn, anchor: 'l', dx: 12, dy: 14 });
  // step 1: the two equations hold at the point: the brackets are 5 and −1
  const vals = step === 1 ? seg(t, 0.1, 0.7) : step > 1 ? 1 : 0;
  labels.push({ key: 'v1', x: -2.8, y: -0.9, tex: '2x_0+3y_0 = 5', role: 'f', o: vals, anchor: 'l' });
  labels.push({ key: 'v2', x: -2.8, y: -1.55, tex: 'x_0-2y_0 = -1', role: 'g', o: vals, anchor: 'l' });
  // step 2: the sum 3x + y = 4 passes through the same point
  const sum = step === 2 ? seg(t, 0.1, 0.8) : 0;
  lines.push({ key: 'S', e: combine(C_E1, C_E2, 1, 1), role: 'sec', o: sum });
  labels.push({ key: 'lS', x: 1.4, y: 3.6, tex: 'E_1+E_2:\\ 3x+y=4', role: 'sec', o: sum, anchor: 'l' });
  return { lines, points, labels };
}

/* ---------------------------------------------------------------- slides 14–15: simplifying to solve */
export const S_E1: Eq2 = [1, -2, -2], S_E2: Eq2 = [1, 1, 2];
export const S_H = combine(S_E1, S_E2, 1, -1); // −3y = −4
export const S_V = combine(S_E1, S_E2, 1, 2); // 3x = 2
export const S_P: [number, number] = [2 / 3, 4 / 3];
export const SIMPLIFY_WIN: Win = { x: [-2, 3.5], y: [-1, 3.5], w: 400, h: 332 };
export const SIMPLIFY_STEPS = 4;

export function simplifyScene(step: number, t: number): LineScene {
  const lines: SLine[] = [], points: SPoint[] = [], labels: SLabel[] = [];
  const a0 = step === 0 ? seg(t, 0, 0.6) : 1;
  const fadeOld = step === 3 ? seg(t, 0, 0.7) : 0; // old lines become pale in the last step
  const oldO = a0 * (1 - 0.65 * fadeOld);
  lines.push({ key: 'E1', e: S_E1, role: 'f', o: oldO, dashed: step >= 1 }, { key: 'E2', e: S_E2, role: 'g', o: oldO, dashed: step >= 2 });
  labels.push({ key: 'lE1', x: 3.4, y: 2.95, tex: 'E_1:\\ x-2y=-2', role: 'f', o: step >= 3 ? 0 : a0, anchor: 'r' });
  labels.push({ key: 'lE2', x: 0.15, y: 3.25, tex: 'E_2:\\ x+y=2', role: 'g', o: step >= 3 ? 0 : a0, anchor: 'l' });
  points.push({ key: 'P', x: S_P[0], y: S_P[1], role: 'pt', o: step === 0 ? seg(t, 0.5, 1) : 1 });
  // step 1: E₁ turns into E₁ − E₂ (the new line always passes through the point)
  if (step >= 1) {
    const u = step === 1 ? seg(t, 0.05, 0.85) : 1;
    lines.push({ key: 'H', e: lerpEq(S_E1, S_H, u), role: 'sec', o: 1 });
    labels.push({ key: 'lH', x: 3.4, y: S_P[1], tex: 'E_1-E_2:\\ -3y=-4', role: 'sec', o: u >= 1 ? 1 : 0, anchor: 'r', dy: -14 });
  }
  // step 2: E₂ turns into E₁ + 2·E₂
  if (step >= 2) {
    const u = step === 2 ? seg(t, 0.05, 0.85) : 1;
    lines.push({ key: 'V', e: lerpEq(S_E2, S_V, u), role: 'asym', o: 1 });
    labels.push({ key: 'lV', x: S_P[0], y: -0.75, tex: 'E_1+2E_2:\\ 3x=2', role: 'asym', o: u >= 1 ? 1 : 0, anchor: 'l', dx: 8 });
  }
  // step 3: read off the solution
  const read = step === 3 ? seg(t, 0.4, 1) : 0;
  labels.push({ key: 'lP', x: S_P[0], y: S_P[1], tex: '\\left(\\tfrac{2}{3},\\ \\tfrac{4}{3}\\right)', role: 'pt', o: read, anchor: 'r', dx: -10, dy: -16 });
  return { lines, points, labels };
}
