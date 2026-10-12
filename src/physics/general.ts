/**
 * General motion of a rigid body (lecture pp. 22–23): at every instant a translation (velocity v_B of a reference
 * point B) plus a Kreiselung about B (angular velocity ω, the same for every reference point).
 * Planar example of lesson 12: a plate in the xy-plane, ω = θ̇ e_z.
 */
import { rigidVelocity } from './rigid';
import { type Vec3, dot, sub } from './vec';

export type P2 = readonly [number, number];

/** A planar motion: position of the reference point B and the turning angle θ of the plate, both functions of t. */
export interface PlanarMotion { B: (t: number) => P2; vB: (t: number) => P2; theta: (t: number) => number; omega: (t: number) => number }

/** Body point p (coordinates in the plate, relative to B, at θ = 0) at time t. */
export function placeAt(m: PlanarMotion, p: P2, t: number): P2 {
  const b = m.B(t), th = m.theta(t), c = Math.cos(th), s = Math.sin(th);
  return [b[0] + c * p[0] - s * p[1], b[1] + s * p[0] + c * p[1]];
}

/** Grundgleichung in the plane: v_M = v_B + ω e_z × BM. */
export function planarVelocity(m: PlanarMotion, p: P2, t: number): P2 {
  const b = m.B(t), q = placeAt(m, p, t), w = m.omega(t), vb = m.vB(t);
  return [vb[0] - w * (q[1] - b[1]), vb[1] + w * (q[0] - b[0])];
}

/** The same velocity written with another reference point C of the plate: v_M = v_C + ω e_z × CM. */
export function planarVelocityVia(m: PlanarMotion, c: P2, p: P2, t: number): P2 {
  const C = placeAt(m, c, t), q = placeAt(m, p, t), w = m.omega(t), vc = planarVelocity(m, c, t);
  return [vc[0] - w * (q[1] - C[1]), vc[1] + w * (q[0] - C[0])];
}

/**
 * Seen by an observer riding along with the body point c (without turning): where the body point p is.
 * Relative to c it only turns, by the angle θ(t) − θ(0) — the same angle whichever point c one rides with.
 */
export function ridingView(m: PlanarMotion, c: P2, p: P2, t: number): P2 {
  const C = placeAt(m, c, t), q = placeAt(m, p, t);
  return [q[0] - C[0], q[1] - C[1]];
}

/** The point of the plane at rest at time t (ω ≠ 0): BM = (e_z × v_B)/ω. In the plane it always exists when ω ≠ 0. */
export function planarRestPoint(vB: P2, w: number, B: P2): P2 | null {
  if (Math.abs(w) < 1e-12) return null;
  return [B[0] - vB[1] / w, B[1] + vB[0] / w];
}

/** Every point of a rigid body has the same velocity component along ω: ω·v_M = ω·v_B (ω × BM ⊥ ω). */
export const omegaComponent = (vB: Vec3, omega: Vec3, rB: Vec3, rM: Vec3): number => dot(omega, rigidVelocity(vB, omega, rB, rM));

/**
 * The step on p. 22: with v_M = v_B + ω*×BM and v_M = v_C + ω**×CM for the same field, the difference
 * (ω* − ω**)×CM must vanish for every M. Returns |(ω* − ω**)×CM| for a trial ω** — zero for all M only if ω** = ω*
 * (unless all CM are parallel, R-011).
 */
export function omegaMismatch(vB: Vec3, omega: Vec3, rB: Vec3, rC: Vec3, omega2: Vec3, rM: Vec3): Vec3 {
  const vC = rigidVelocity(vB, omega, rB, rC);
  return sub(rigidVelocity(vB, omega, rB, rM), rigidVelocity(vC, omega2, rC, rM));
}
