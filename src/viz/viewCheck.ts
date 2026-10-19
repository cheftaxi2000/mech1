/**
 * Test helpers for the 3D figures: how a vector appears from the figure's start camera (Scene: z up, perspective).
 * Used by the *.test.ts files to make sure the vectors a caption talks about are not foreshortened or hidden.
 */
import { cross, dot, norm, scale, sub, type Vec3 } from '../physics/vec';

const unit = (v: Vec3) => scale(1 / norm(v), v);

/** Screen coordinates (in units of the focal length) of a point seen from `camera` looking at `target`, z up. */
export function projectPoint(p: Vec3, camera: Vec3, target: Vec3): [number, number] {
  const f = unit(sub(target, camera));
  const r = unit(cross(f, [0, 0, 1]));
  const u = cross(r, f);
  const q = sub(p, camera), depth = dot(q, f);
  return [dot(q, r) / depth, dot(q, u) / depth];
}

/**
 * Drawn length of the arrow from `p` to `p + e` relative to the length it would have if it stood
 * perpendicular to the line of sight at `p` (1 = full length, 0 = pointing straight at the camera).
 */
export function visibleFraction(p: Vec3, e: Vec3, camera: Vec3, target: Vec3): number {
  const a = projectPoint(p, camera, target), b = projectPoint([p[0] + e[0], p[1] + e[1], p[2] + e[2]], camera, target);
  const depth = dot(sub(p, camera), unit(sub(target, camera)));
  return Math.hypot(b[0] - a[0], b[1] - a[1]) / (norm(e) / depth);
}

/** Angle (degrees, 0…180) between the drawn directions of two arrows starting at p and q. */
export function screenAngle(p: Vec3, e: Vec3, q: Vec3, g: Vec3, camera: Vec3, target: Vec3): number {
  const a0 = projectPoint(p, camera, target), a1 = projectPoint([p[0] + e[0], p[1] + e[1], p[2] + e[2]], camera, target);
  const b0 = projectPoint(q, camera, target), b1 = projectPoint([q[0] + g[0], q[1] + g[1], q[2] + g[2]], camera, target);
  const u = [a1[0] - a0[0], a1[1] - a0[1]], v = [b1[0] - b0[0], b1[1] - b0[1]];
  const c = (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(v[0], v[1]));
  return (Math.acos(Math.max(-1, Math.min(1, c))) * 180) / Math.PI;
}
