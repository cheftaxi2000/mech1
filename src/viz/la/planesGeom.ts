/**
 * Pure geometry of the 3D figure «three planes» (Übung 2, slides 16–24): a plane a·x + b·y + c·z = d is drawn as a
 * finite polygon, its intersection with the box |x|, |y|, |z| ≤ R; the common set of the planes (point, line, plane,
 * nothing) comes from the exact elimination (`solve` in src/linalg/gauss.ts).
 */
import { mat, solve } from '../../linalg/gauss';
import { num } from '../../linalg/frac';

export type V3 = [number, number, number];
/** a·x + b·y + c·z = d */
export type Plane = readonly [number, number, number, number];
export const BOX = 5;

const sub = (p: V3, r: V3): V3 => [p[0] - r[0], p[1] - r[1], p[2] - r[2]];
const dot = (p: V3, r: V3) => p[0] * r[0] + p[1] * r[1] + p[2] * r[2];
const cross = (p: V3, r: V3): V3 => [p[1] * r[2] - p[2] * r[1], p[2] * r[0] - p[0] * r[2], p[0] * r[1] - p[1] * r[0]];
const norm = (p: V3) => Math.hypot(p[0], p[1], p[2]);
export const normalOf = (p: Plane): V3 => [p[0], p[1], p[2]];
export const residual = (p: Plane, x: V3) => p[0] * x[0] + p[1] * x[1] + p[2] * x[2] - p[3];

/** The 12 edges of the cube [−R, R]³ as pairs of corners. */
function cubeEdges(R: number): [V3, V3][] {
  const out: [V3, V3][] = [];
  const s = [-R, R];
  for (const a of s) for (const b of s) {
    out.push([[-R, a, b], [R, a, b]], [[a, -R, b], [a, R, b]], [[a, b, -R], [a, b, R]]);
  }
  return out;
}

/**
 * The part of the plane inside the box |x|, |y|, |z| ≤ R as a convex polygon, corners in order around the polygon.
 * Empty when the plane misses the box (or only touches it in an edge or a corner).
 */
export function planePolygon(p: Plane, R = BOX): V3[] {
  const n = normalOf(p);
  if (norm(n) < 1e-12) return [];
  const pts: V3[] = [];
  const add = (x: V3) => { if (!pts.some((y) => norm(sub(x, y)) < 1e-9)) pts.push(x); };
  for (const [c0, c1] of cubeEdges(R)) {
    const f0 = residual(p, c0), f1 = residual(p, c1);
    if (Math.abs(f0) < 1e-12) add(c0);
    if (Math.abs(f1) < 1e-12) add(c1);
    if (f0 * f1 < -1e-24) { const u = f0 / (f0 - f1); add([c0[0] + u * (c1[0] - c0[0]), c0[1] + u * (c1[1] - c0[1]), c0[2] + u * (c1[2] - c0[2])]); }
  }
  if (pts.length < 3) return [];
  const m: V3 = [0, 0, 0];
  for (const x of pts) { m[0] += x[0] / pts.length; m[1] += x[1] / pts.length; m[2] += x[2] / pts.length; }
  const nn = norm(n), nu: V3 = [n[0] / nn, n[1] / nn, n[2] / nn];
  const seed: V3 = Math.abs(nu[0]) < 0.8 ? [1, 0, 0] : [0, 1, 0];
  const e1 = cross(nu, seed), l1 = norm(e1), u: V3 = [e1[0] / l1, e1[1] / l1, e1[2] / l1], v = cross(nu, u);
  const ang = (x: V3) => { const d = sub(x, m); return Math.atan2(dot(d, v), dot(d, u)); };
  const poly = pts.slice().sort((x, y) => ang(x) - ang(y));
  return polygonArea(poly) > 1e-9 ? poly : [];
}

/** Area of a planar polygon in 3D (half the length of the summed cross products). */
export function polygonArea(poly: readonly V3[]): number {
  let s: V3 = [0, 0, 0];
  for (let i = 0; i < poly.length; i++) { const c = cross(poly[i], poly[(i + 1) % poly.length]); s = [s[0] + c[0], s[1] + c[1], s[2] + c[2]]; }
  return norm(s) / 2;
}

/** The part of the line `p + t·d` inside the box, as two end points; null if it misses the box. */
export function lineInBox(p: V3, d: V3, R = BOX): [V3, V3] | null {
  let lo = -Infinity, hi = Infinity;
  for (let i = 0; i < 3; i++) {
    if (Math.abs(d[i]) < 1e-12) { if (Math.abs(p[i]) > R + 1e-12) return null; continue; }
    const a = (-R - p[i]) / d[i], b = (R - p[i]) / d[i];
    lo = Math.max(lo, Math.min(a, b)); hi = Math.min(hi, Math.max(a, b));
  }
  if (!(lo <= hi) || !Number.isFinite(lo) || !Number.isFinite(hi)) return null;
  const at = (t: number): V3 => [p[0] + t * d[0], p[1] + t * d[1], p[2] + t * d[2]];
  return [at(lo), at(hi)];
}

export type Common =
  | { kind: 'none' }
  | { kind: 'point'; p: V3 }
  | { kind: 'line'; p: V3; d: V3 }
  | { kind: 'plane' };

/** Common solutions of the equations: nothing, one point, a line, or a whole plane (all equations describe the same plane). */
export function commonSet(planes: readonly Plane[]): Common {
  const s = solve(mat(planes.map((p) => [...p])));
  if (s.kind === 'none') return { kind: 'none' };
  const p = s.particular!.map(num) as V3;
  if (s.kind === 'unique') return { kind: 'point', p };
  if (s.dirs!.length === 1) return { kind: 'line', p, d: s.dirs![0].map(num) as V3 };
  return { kind: 'plane' };
}

export type PairRel = 'cross' | 'same' | 'parallel';
/** Two planes: they cut in a line, coincide, or are parallel without touching. */
export function pairRelation(p: Plane, r: Plane): PairRel {
  const c = cross(normalOf(p), normalOf(r));
  if (norm(c) > 1e-12) return 'cross';
  // normals are parallel: compare the planes with the scaled right-hand side
  const k = Math.abs(p[0]) + Math.abs(p[1]) + Math.abs(p[2]) > 0 ? (Math.abs(p[0]) >= 1e-12 ? r[0] / p[0] : Math.abs(p[1]) >= 1e-12 ? r[1] / p[1] : r[2] / p[2]) : 0;
  return Math.abs(r[3] - k * p[3]) < 1e-9 ? 'same' : 'parallel';
}

export type NoneReason = 'allParallel' | 'twoParallel' | 'prism';
/**
 * Why three planes have no common point: all three parallel (or two coincide and the third is parallel),
 * two parallel and one crossing them, or every two of them cut but the three cut-lines never meet (a «prism»).
 */
export function noneReason(planes: readonly [Plane, Plane, Plane]): NoneReason {
  const rel = [pairRelation(planes[0], planes[1]), pairRelation(planes[0], planes[2]), pairRelation(planes[1], planes[2])];
  const par = rel.filter((r) => r === 'parallel').length;
  if (par === 0) return 'prism';
  return rel.every((r) => r !== 'cross') ? 'allParallel' : 'twoParallel';
}

export interface PlanePreset {
  id: string;
  /** equations of the planes, in order (E₁, E₂, E₃) */
  eqs: Plane[];
  /** on the slides? */
  slides: boolean;
}
/** The examples of the slides 16–22 (and the «prism», which is not on the slides). */
export const PLANE_PRESETS: PlanePreset[] = [
  { id: 'point', slides: true, eqs: [[1, 1, 1, 3], [1, -2, 3, 4], [2, 1, -1, 1]] },
  { id: 'parallel', slides: true, eqs: [[1, 1, 1, 3], [1, 1, 1, 5], [1, 1, 1, 7]] },
  { id: 'twoParallel', slides: true, eqs: [[1, 1, 1, 3], [1, 1, 1, 5], [1, 1, -1, -2]] },
  { id: 'same', slides: true, eqs: [[1, 1, 1, 3], [2, 2, 2, 6], [3, 3, 3, 9]] },
  { id: 'line', slides: true, eqs: [[1, 1, 0, 2], [1, 2, 0, 2], [1, -1, 0, 2]] },
  { id: 'prism', slides: false, eqs: [[1, 0, 0, 1], [0, 0, 1, 1], [1, 0, 1, 3]] },
];

/** Slides 22–24: «simplification process»: the point (1/3, 2, 4/3) stays when eq₃ is replaced by eq₃ − eq₂. */
export const SIMPLIFY_EQS: [Plane, Plane, Plane] = [[-1, 1, 1, 3], [1, 1, 2, 5], [1, 1, -1, 1]];
export const SIMPLIFY_NEW: Plane = [0, 0, -3, -4];
/**
 * Where to put the name of each plane: a corner of its polygon (pulled 18 % towards the middle) that is as far as possible
 * from the labels placed before it and from the points in `avoid` (origin, solution point), so names do not pile up.
 */
export function labelSpots(polys: readonly V3[][], avoid: readonly V3[] = [[0, 0, 0]], view?: V3): (V3 | null)[] {
  const placed: V3[] = [...avoid];
  // distances as seen from the camera: drop the component along the viewing direction
  const vn = view ? norm(view) : 0, vu: V3 = vn ? [view![0] / vn, view![1] / vn, view![2] / vn] : [0, 0, 0];
  const seen = (d: V3): V3 => { const k = dot(d, vu); return [d[0] - k * vu[0], d[1] - k * vu[1], d[2] - k * vu[2]]; };
  return polys.map((poly) => {
    if (poly.length < 3) return null;
    const m = poly.reduce((s, p) => [s[0] + p[0] / poly.length, s[1] + p[1] / poly.length, s[2] + p[2] / poly.length] as V3, [0, 0, 0] as V3);
    let best: V3 | null = null, bd = -1;
    for (const v of poly) {
      const c: V3 = [m[0] + 0.82 * (v[0] - m[0]), m[1] + 0.82 * (v[1] - m[1]), m[2] + 0.82 * (v[2] - m[2])];
      const d = Math.min(...placed.map((p) => norm(seen(sub(c, p)))));
      if (d > bd + 1e-9) { bd = d; best = c; }
    }
    placed.push(best!);
    return best;
  });
}

export const lerpPlane =(p: Plane, r: Plane, u: number): Plane => [0, 1, 2, 3].map((i) => p[i] + (r[i] - p[i]) * u) as unknown as Plane;
