/**
 * «Mechanics II» machine of the opener visualisation «Seven Machines, One Toolbox» (Übung 1, slide 4): a square under a
 * load sweep (uniaxial → biaxial → pure shear). The deformation matrix F is shown with live numbers; its columns are
 * the images of the basis vectors e₁ and e₂. Pure maths, ported from the visualisation (ν = 0.3, gain 0.13).
 *
 * The strain is exaggerated (the visualisation labels it «strain ×40») so that the change of the square is visible.
 */
import type { M2, V2 } from './plane2';

export const NU = 0.3;
export const GAIN = 0.13;

export interface Load { sx: number; sy: number; tau: number }
export interface Strain { ex: number; ey: number; exy: number }

const easeOut = (u: number) => 1 - (1 - u) * (1 - u);
const smooth = (u: number) => u * u * (3 - 2 * u);
const clamp01 = (s: number) => Math.min(1, Math.max(0, s));

/** The load at sweep position s ∈ [0, 1]: uniaxial (s ≤ 0.34), biaxial (0.34 … 0.62), towards pure shear (0.62 … 1). */
export function loadAt(s: number): Load {
  s = clamp01(s);
  if (s < 0.34) return { sx: easeOut(s / 0.34), sy: 0, tau: 0 };
  if (s < 0.62) return { sx: 1, sy: 0.6 * smooth((s - 0.34) / 0.28), tau: 0 };
  const u = smooth((s - 0.62) / 0.38);
  return { sx: 1 - u, sy: 0.6 * (1 - u), tau: u };
}

/** Strains of the load (Hooke's law for plane stress with Poisson ratio ν). */
export const strainOf = (L: Load, nu = NU): Strain => ({ ex: L.sx - nu * L.sy, ey: L.sy - nu * L.sx, exy: (1 + nu) * L.tau });

/** The deformation matrix F = [[1 + g·εx, g·γ], [g·γ, 1 + g·εy]] (rows), g = 0.13 as in the visualisation. */
export function deformation(s: number): M2 {
  const E = strainOf(loadAt(s));
  return [[1 + GAIN * E.ex, GAIN * E.exy], [GAIN * E.exy, 1 + GAIN * E.ey]];
}

/** Sweep positions of the three presets of the lesson. */
export const PRESET_S = { uniaxial: 0.34, biaxial: 0.62, shear: 1 } as const;

/** Where F sends a point. */
export const image = (F: M2, p: V2): V2 => [F[0][0] * p[0] + F[0][1] * p[1], F[1][0] * p[0] + F[1][1] * p[1]];

/** The four corners of the square [−1, 1]², counter-clockwise from the lower left. */
export const SQUARE: V2[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]];

export interface Face { a: V2; b: V2; n: V2; normalLoad: 'sx' | 'sy' }
/** The four faces of the square: end points (counter-clockwise), outward normal, which normal stress acts on it. */
export const FACES: Face[] = [
  { a: [1, -1], b: [1, 1], n: [1, 0], normalLoad: 'sx' },
  { a: [1, 1], b: [-1, 1], n: [0, 1], normalLoad: 'sy' },
  { a: [-1, 1], b: [-1, -1], n: [-1, 0], normalLoad: 'sx' },
  { a: [-1, -1], b: [1, -1], n: [0, -1], normalLoad: 'sy' },
];
/** Direction of the shear arrows on a face (the consistent couple of the visualisation): up on the right, right on top, down on the left, left at the bottom. */
export const shearDir = (f: Face): V2 => (f.n[0] !== 0 ? [0, f.n[0]] : [f.n[1], 0]);
