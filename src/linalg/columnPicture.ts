/**
 * The step story of the TA's visualisation «Column Picture» (Übung 4, slides 12–13), as pure functions of (system, step, t).
 * Maths (rank, solutions, closest point) is `plane2.analyze`; this file adds what the visualisation does with it:
 * the presets, which x is played out in steps 2–3, the four steps, and the "family of solutions" motion.
 */
import { analyze, add, apply, norm, scale, sub, type Analysis, type M2, type V2 } from './plane2';

/** `label`: [German, English]; «§x» marks the variable x (typeset by KaTeX in the figure). */
export interface ColPreset { id: string; label: [string, string]; A: M2; b: V2 }

/** The five presets of the visualisation (same order). */
export const COL_PRESETS: ColPreset[] = [
  { id: 'r2', label: ['Rang 2 · eindeutig', 'rank 2 · unique'], A: [[2, 3], [1, -2]], b: [-1, 3] },
  { id: 'r1inf', label: ['Rang 1 · unendlich viele', 'rank 1 · infinitely many'], A: [[1, -2], [2, -4]], b: [-1, -2] },
  { id: 'r1none', label: ['Rang 1 · keine', 'rank 1 · none'], A: [[1, -2], [2, -4]], b: [1, 4] },
  { id: 'r0none', label: ['Rang 0 · keine', 'rank 0 · none'], A: [[0, 0], [0, 0]], b: [1, 1] },
  { id: 'r0all', label: ['Rang 0 · jedes §x', 'rank 0 · every §x'], A: [[0, 0], [0, 0]], b: [0, 0] },
];

export interface ColModel extends Analysis {
  A: M2; b: V2;
  /** the x played out in steps 2–3: the solution, a nice particular solution, a first "try", or (1.5, −2) for A = 0 */
  disp: V2;
}

export function colModel(A: M2, b: V2): ColModel {
  const an = analyze(A, b);
  const disp: V2 = an.kind === 'unique' ? an.xp : an.kind === 'infinite' ? an.xc! : an.r === 1 ? an.xg! : [1.5, -2];
  return { ...an, A, b, disp };
}

export const COL_STEPS = 4;
export const HIT = 1e-6;

/** Smooth start and end (the same ease as the visualisation). */
export const ease = (u: number) => { const v = Math.min(1, Math.max(0, u)); return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2; };
const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

/** Piecewise path through 0 → v₁ → v₂ → … with one ease per piece (rank 0: x runs through a few values, nothing moves). */
export function sweep(vals: number[], t: number): number {
  const n = vals.length, k = Math.min(n - 1, Math.floor(Math.min(0.999999, Math.max(0, t)) * n));
  const from = k === 0 ? 0 : vals[k - 1];
  return lerp(from, vals[k], ease(Math.min(1, Math.max(0, t)) * n - k));
}

export interface ColFrame {
  /** growth of the three vectors of step 1 (a₁, a₂, b), 0 … 1 */
  g: [number, number, number];
  /** columns drawn bold (step 1) or as ghosts */
  full: boolean;
  s1: boolean; s2: boolean;
  /** 0 = x₂a₂ starts at the origin, 1 = attached at the tip of x₁a₁ */
  base2: number;
  /** show the number x₂ (otherwise the panel shows the symbol) */
  x2num: boolean;
  /** show the number x₁ */
  x1num: boolean;
  /** Ax grown to this fraction */
  axGrow: number;
  x: V2;
}

/** The x the story ends on in step 4. */
export function finalX(m: ColModel): V2 {
  return m.kind === 'none' && m.r === 1 ? m.xp : m.disp;
}

/**
 * The state of the figure at step `step` (0…3) and time t ∈ [0, 1] of that step. t = 1 is the resting frame of the step.
 * `tau` (seconds after step 4 has finished) runs the "family of solutions" motion; tau = 0 is the resting frame.
 */
export function colFrame(m: ColModel, step: number, t: number, tau = 0): ColFrame {
  const d = m.disp;
  const base: ColFrame = { g: [1, 1, 1], full: false, s1: false, s2: false, base2: 0, x2num: false, x1num: false, axGrow: 0, x: [0, 0] };
  if (step <= 0) {
    return { ...base, full: true, g: [seg(t, 0, 0.4), seg(t, 0.3, 0.7), seg(t, 0.6, 1)] };
  }
  if (step === 1) {
    const x1 = m.r === 0 ? sweep([3, -2, d[0]], t) : lerp(0, d[0], ease(t));
    return { ...base, s1: true, x1num: true, x: [x1, 0] };
  }
  if (step === 2) {
    if (m.r === 0) return { ...base, s1: true, s2: true, base2: 1, x1num: true, x2num: true, x: [d[0], sweep([-3, 2.5, d[1]], t)] };
    // x₂a₂ first slides (as x₂ = 1) from the origin to the tip of x₁a₁, then it is scaled to x₂
    const slide = seg(t, 0, 0.35), scl = seg(t, 0.4, 1);
    return { ...base, s1: true, s2: true, base2: slide, x1num: true, x2num: t >= 0.35, x: [d[0], t < 0.4 ? 1 : lerp(1, d[1], scl)] };
  }
  const grow = seg(t, 0, 0.4);
  const out: ColFrame = { ...base, s1: true, s2: true, base2: 1, x1num: true, x2num: true, axGrow: grow, x: [d[0], d[1]] };
  if (m.kind === 'none' && m.r === 1) {
    const u = seg(t, 0.55, 1);
    out.x = [lerp(d[0], m.xp[0], u), lerp(d[1], m.xp[1], u)];
  } else if (t >= 1) out.x = famX(m, tau);
  return out;
}

/** Amplitude of the walk along the family of solutions. */
export function famAmp(m: ColModel): number {
  return m.n ? 1.2 / Math.max(Math.abs(m.n[0]), Math.abs(m.n[1])) : 0;
}

/**
 * x after step 4 while time `tau` runs: rank 1 with solutions: x walks along x_c + s·n (Ax stays on b);
 * rank 0: x wanders around (nothing moves). Everything else rests.
 */
export function famX(m: ColModel, tau: number): V2 {
  if (m.kind === 'infinite') return add(m.xc!, scale(m.n!, famAmp(m) * Math.sin((2 * Math.PI * tau) / 5)));
  if (m.r === 0) return add(m.disp, [1.5 * Math.sin((2 * Math.PI * tau) / 5), 1.5 * Math.sin((2 * Math.PI * tau) / 3.5)]);
  return finalX(m);
}

/** Ax and the miss for a frame. */
export function colResult(m: ColModel, f: ColFrame) {
  const Ax = apply(m.A, f.x), miss = norm(sub(Ax, m.b));
  return { Ax, miss, hit: f.axGrow >= 1 && miss < HIT };
}

export type CountKey = 'unique' | 'infinite' | 'none';
/** «eindeutig / unendlich viele / keine» (the panel's number of solutions); A = 0 and b = 0: every x, i.e. infinitely many. */
export const countKey = (m: ColModel): CountKey => (m.kind === 'unique' ? 'unique' : m.kind === 'none' ? 'none' : 'infinite');

/** Points the picture must have room for (independent of the step), for fitView. */
export function colPoints(m: ColModel): V2[] {
  const pts: V2[] = [[0, 0], m.a1, m.a2, m.b, m.proj, [-1, -1], [1, 1]];
  const chain = (x: V2) => { const t1 = scale(m.a1, x[0]); pts.push(t1, add(t1, scale(m.a2, x[1]))); };
  chain(m.disp); chain(m.xp); chain(finalX(m));
  if (m.kind === 'infinite') { const k = famAmp(m); chain(add(m.xc!, scale(m.n!, k))); chain(add(m.xc!, scale(m.n!, -k))); }
  return pts;
}
