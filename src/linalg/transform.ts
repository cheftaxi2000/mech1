/**
 * The matrix as a transformation of the plane (Übung 4, slides 14–21; TA visualisation «Matrix as a Transformation»).
 * Pure maths for the explorer: presets, the input the visualisation starts with, two more "traced" inputs picked per
 * matrix (port of the visualisation's chooseInputs), the inverse, and the input(s) that land on a target b.
 * The morph from the identity to A is `plane2.interp`.
 */
import { add, analyze, apply, det, dot, interp, norm, scale, sub, type Analysis, type M2, type V2 } from './plane2';

export interface TrPreset { id: string; label: [string, string]; A: M2; b: V2; /** the input shown first (slides: (−1, 2) for (3 1; 1 2)) */ x?: V2 }

/** The presets of the visualisation (rank group, then the gallery). */
export const TR_PRESETS: TrPreset[] = [
  { id: 'full', label: ['Voller Rang', 'Full rank'], A: [[2, 3], [1, -2]], b: [-1, 3] },
  { id: 'full2', label: ['Voller Rang II', 'Full rank II'], A: [[3, 1], [1, 2]], b: [-1, 3], x: [-1, 2] },
  { id: 'rank1', label: ['Rang 1', 'Rank 1'], A: [[1, -2], [2, -4]], b: [-1, -2] },
  { id: 'rank0', label: ['Rang 0', 'Rank 0'], A: [[0, 0], [0, 0]], b: [1, 1] },
  { id: 'shear', label: ['Scherung', 'Shear'], A: [[1, 1], [0, 1]], b: [2, 1] },
  { id: 'rot', label: ['Drehung um 90°', 'Rotation 90°'], A: [[0, -1], [1, 0]], b: [-1, 2] },
  { id: 'refl', label: ['Spiegelung', 'Reflection'], A: [[0, 1], [1, 0]], b: [1, 2] },
  { id: 'stretch', label: ['Streckung', 'Stretch'], A: [[2, 0], [0, 0.5]], b: [2, 1] },
];

const near = (u: V2, v: V2, e = 1e-9) => Math.abs(u[0] - v[0]) < e && Math.abs(u[1] - v[1]) < e;
const cross = (p: V2, q: V2) => p[0] * q[1] - p[1] * q[0];
const isInt = (v: number) => Math.abs(v - Math.round(v)) < 1e-7;

/** The x the visualisation feeds in first: the solution, a nice particular solution, the closest point x̂, or (1.5, −2) for A = 0. */
export function firstInput(an: Analysis): V2 {
  const v = an.kind === 'unique' ? an.xp : an.kind === 'infinite' ? an.xc! : an.r === 1 ? an.xp : [1.5, -2] as V2;
  return [v[0] + 0, v[1] + 0];
}

const LIM_IN = 4, LIM_OUT = 4.5;
const apart = (p: V2, q: V2) => { const a = norm(p), c = norm(q); return a < 1e-9 || c < 1e-9 || Math.abs(cross(p, q)) >= 0.2 * a * c; };
const lineAng = (p: V2, q: V2) => { const a = norm(p) * norm(q); return a < 1e-12 ? 90 : (Math.acos(Math.min(1, Math.abs(dot(p, q)) / a)) * 180) / Math.PI; };
const isUnitAxis = (p: V2) => near(p, [1, 0]) || near(p, [0, 1]) || near(p, [-1, 0]) || near(p, [0, -1]);
function inputOK(A: M2, x5: V2, p: V2, lo = LIM_OUT) {
  const o = apply(A, p);
  return norm(p) > 1e-9 && norm(p) <= LIM_IN + 1e-9 && norm(o) <= lo + 1e-9 && !isUnitAxis(p) && !near(p, x5) && apart(p, x5);
}

/** Two more inputs, not on a line with x5 or each other, small, with images that stay in view (port of chooseInputs). */
export function chooseInputs(A: M2, b: V2, an: Analysis, x5: V2): [V2, V2] {
  const pref: V2[] = [[2, 1], [-1, 2]];
  for (const k of [1, 0.5]) { const P = pref.map((p) => scale(p, k)); if (P.every((p) => inputOK(A, x5, p))) return [P[0], P[1]]; }
  const big = norm(x5) > 1e-9;
  const score = (p: V2) => {
    const o = apply(A, p), half = (isInt(p[0]) ? 0 : 1) + (isInt(p[1]) ? 0 : 1);
    return 0.6 * (Math.abs(p[0]) + Math.abs(p[1])) + (p[0] === 0 || p[1] === 0 ? 3 : 0) + 2 * half +
      (an.r === 1 && norm(o) < 0.5 ? 6 : 0) + (big ? Math.max(0, 30 - lineAng(p, x5)) / 10 : 0) + (an.r > 0 && norm(sub(o, b)) < 0.8 ? 3 : 0);
  };
  for (const lo of [LIM_OUT, 6, 10, 1e9]) {
    const C: V2[] = [];
    for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) { const p: V2 = [i / 2 + 0, j / 2 + 0]; if (inputOK(A, x5, p, lo)) C.push(p); }
    const sc = C.map(score);
    let best: [V2, V2] | null = null, bs = Infinity;
    for (let i = 0; i < C.length; i++) for (let j = i + 1; j < C.length; j++) {
      const p = C[i], q = C[j];
      if (!apart(p, q)) continue;
      const sep = an.r > 0 && norm(sub(apply(A, p), apply(A, q))) < 1 ? 3 : 0;
      const s = sc[i] + sc[j] + Math.max(0, 40 - lineAng(p, q)) / 10 + sep;
      if (s < bs - 1e-9) { bs = s; best = sc[i] <= sc[j] ? [p, q] : [q, p]; }
    }
    if (best) return best;
  }
  return [pref[0], pref[1]];
}

/** Inverse of a regular 2 × 2 matrix (null when singular). */
export function inv2(A: M2): M2 | null {
  const d = det(A);
  if (Math.abs(d) < 1e-12) return null;
  return [[A[1][1] / d, -A[0][1] / d], [-A[1][0] / d, A[0][0] / d]];
}

export type FindResult =
  | { kind: 'unique'; x: V2 }
  | { kind: 'line'; x: V2; dir: V2 }      // every x + α·dir lands on b
  | { kind: 'none'; x: V2; closest: V2 }  // rank 1, b off the line: x lands on the closest point
  | { kind: 'all'; x: V2 }                // A = 0, b = 0
  | { kind: 'none0'; x: V2 };             // A = 0, b ≠ 0

/** «Find the input»: which x lands on b after the transformation? */
export function findInput(A: M2, b: V2): FindResult {
  const an = analyze(A, b);
  if (an.kind === 'unique') return { kind: 'unique', x: an.xp }; // = A⁻¹b (Cramer, exact for small integers)
  if (an.kind === 'infinite') return { kind: 'line', x: an.xc!, dir: an.n! };
  if (an.r === 1) return { kind: 'none', x: an.xp, closest: an.proj };
  return an.kind === 'all' ? { kind: 'all', x: [1.5, -2] } : { kind: 'none0', x: [1.5, -2] };
}

/** The point p after the fraction t of the morph from the identity to A. */
export const morph = (A: M2, t: number, p: V2): V2 => apply(interp(A, t), p);

/** Everything a view must show for the whole morph (sampled, since a rotation moves points on an arc). */
export function morphPoints(A: M2, pts: V2[]): V2[] {
  const out: V2[] = [];
  for (const t of [0, 0.25, 0.5, 0.75, 1]) for (const p of pts) out.push(morph(A, t, p));
  return out;
}

/** In words: what does A do to the plane? */
export type Effect = 'plane' | 'line' | 'point';
export const effect = (A: M2): Effect => { const r = analyze(A, [0, 0]).r; return r === 2 ? 'plane' : r === 1 ? 'line' : 'point'; };

/** x₁·a₁ + x₂·a₂ = A x (the column reading of A x, as on the slides). */
export const columnSum = (A: M2, x: V2): V2 => add(scale([A[0][0], A[1][0]], x[0]), scale([A[0][1], A[1][1]], x[1]));
