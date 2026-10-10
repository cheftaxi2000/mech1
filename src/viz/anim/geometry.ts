/**
 * Pure geometry for SVG animations: an orthographic camera that can move smoothly from the lecture's
 * oblique view to a view from above, and the triangle construction of the cylindrical derivation.
 * Everything here is unit-tested (geometry.test.ts); the SVG figures only draw what these return.
 */
import { type Vec3, add, dot, scale, sub } from '../../physics/vec';

export type P2 = readonly [number, number];

/** Orthographic camera on a sphere around O: azimuth α from +x, elevation β above the xy-plane. */
export interface Cam { R: Vec3; U: Vec3 }
export const camera = (alpha: number, beta: number): Cam => ({
  R: [-Math.sin(alpha), Math.cos(alpha), 0],
  U: [-Math.sin(beta) * Math.cos(alpha), -Math.sin(beta) * Math.sin(alpha), Math.cos(beta)],
});

export interface View { alpha: number; beta: number; cx: number; cy: number; s: number }
/** Lecture-style oblique view (Fig. 1.4/1.8): x toward the viewer (down-left), y right, z up. */
export const OBLIQUE: View = { alpha: (28 * Math.PI) / 180, beta: (20 * Math.PI) / 180, cx: 190, cy: 205, s: 62 };
/** Looking down the z-axis: x right, y up (as in the lecture's 2D figure on p. 10). */
export const TOP: View = { alpha: -Math.PI / 2, beta: Math.PI / 2, cx: 200, cy: 170, s: 66 };

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const lerpView = (a: View, b: View, k: number): View => ({
  alpha: lerp(a.alpha, b.alpha, k), beta: lerp(a.beta, b.beta, k),
  cx: lerp(a.cx, b.cx, k), cy: lerp(a.cy, b.cy, k), s: lerp(a.s, b.s, k),
});

/** 3D point → SVG coordinates (SVG y grows downward). */
export function project(p: Vec3, v: View): P2 {
  const c = camera(v.alpha, v.beta);
  return [v.cx + v.s * dot(p, c.R), v.cy - v.s * dot(p, c.U)];
}

// ---- easing / timing ----
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Progress of a sub-interval [a, b] of the step's normalised time t. */
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const ease = (x: number) => { const k = clamp01(x); return k * k * (3 - 2 * k); };

// ---- the right triangle O, F, M_xy of the derivation x = ρ cos φ, y = ρ sin φ ----
export interface Triangle { O: Vec3; F: Vec3; Mxy: Vec3; x: number; y: number }
/** F is the foot of the perpendicular from M_xy onto the x-axis. x, y are SIGNED leg lengths. */
export function triangle(rho: number, phi: number): Triangle {
  const x = rho * Math.cos(phi), y = rho * Math.sin(phi);
  return { O: [0, 0, 0], F: [x, 0, 0], Mxy: [x, y, 0], x, y };
}

const sgn = (v: number) => (v < 0 ? -1 : 1);

/** Squares on the three sides, each on the side facing AWAY from the triangle (Pythagoras figure). */
export function outerSquares(tri: Triangle, rho: number, phi: number): { sx: Vec3[]; sy: Vec3[]; sr: Vec3[] } {
  const { O, F, Mxy, x, y } = tri;
  const down: Vec3 = [0, -sgn(y) * Math.abs(x), 0]; // away from M_xy
  const out: Vec3 = [sgn(x) * Math.abs(y), 0, 0]; // away from O
  let n: Vec3 = [-Math.sin(phi), Math.cos(phi), 0];
  if (dot(sub(F, O), n) > 0) n = scale(-1, n); // away from F
  const nr = scale(rho, n);
  return {
    sx: [O, F, add(F, down), add(O, down)],
    sy: [F, Mxy, add(Mxy, out), add(F, out)],
    sr: [O, Mxy, add(Mxy, nr), add(O, nr)],
  };
}

export const centroid = (pts: Vec3[]): Vec3 => scale(1 / pts.length, pts.reduce((a, b) => add(a, b), [0, 0, 0] as Vec3));
export const polygonArea2D = (pts: Vec3[]) =>
  Math.abs(pts.reduce((acc, p, i) => { const q = pts[(i + 1) % pts.length]; return acc + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
