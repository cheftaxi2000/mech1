/** Minimal 3D vector algebra. Components are always w.r.t. the Cartesian basis (e_x, e_y, e_z). */
export type Vec3 = readonly [number, number, number];

export const vec = (x: number, y: number, z: number): Vec3 => [x, y, z];
export const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (k: number, a: Vec3): Vec3 => [k * a[0], k * a[1], k * a[2]];
export const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const norm = (a: Vec3): number => Math.sqrt(dot(a, a));
export const normalize = (a: Vec3): Vec3 => {
  const n = norm(a);
  if (n === 0) throw new Error('Cannot normalize the zero vector');
  return scale(1 / n, a);
};
/** Scalar triple product (a × b) · c ("Spatprodukt"). */
export const triple = (a: Vec3, b: Vec3, c: Vec3): number => dot(cross(a, b), c);

export const E_X: Vec3 = [1, 0, 0];
export const E_Y: Vec3 = [0, 1, 0];
export const E_Z: Vec3 = [0, 0, 1];

export const approxEqual = (a: number, b: number, tol = 1e-9): boolean =>
  Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));
export const vecApproxEqual = (a: Vec3, b: Vec3, tol = 1e-9): boolean =>
  a.every((ai, i) => approxEqual(ai, b[i], tol));
