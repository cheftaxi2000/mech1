/**
 * Extra pure maths for the lessons «Leistung einer Kraft» (p. 33) and «Leistung bei Rotation und das Moment» (pp. 33–35).
 * Everything here is a rewriting of formulas of the lecture that the figures need (components along a direction,
 * lever arm, tangential/radial split, the shift of the reference point); `force.ts` stays the numeric source of truth.
 */
import { add, cross, dot, norm, scale, sub, type Vec3 } from './vec';
import { lorentz, power } from './force';

const ZERO: Vec3 = [0, 0, 0];

// ───────────────────────────────── K5: P = F̲ · v̲ ─────────────────────────────────

/** F̲ split along the direction of v̲: `par` = signed length F̲ · v̲/|v̲| (= |F| cos α), `perp` = the rest (F̲ minus the part along v̲). */
export function alongDirection(F: Vec3, v: Vec3) {
  const n = norm(v);
  if (n === 0) return { par: 0, parVec: ZERO, perpVec: F };
  const u = scale(1 / n, v);
  const par = dot(F, u);
  return { par, parVec: scale(par, u), perpVec: sub(F, scale(par, u)) };
}

/** P = F∥ · |v̲|: only the part of F̲ along v̲ counts (p. 33, P = |F||v| cos α). */
export const powerFromParallel = (F: Vec3, v: Vec3): number => alongDirection(F, v).par * norm(v);

/** «Schiebe-Wirkung» F̲ · dr̲ over the short time dt (dr̲ = v̲ dt); divided by dt it is P (supplement: why P = F̲ · v̲ is plausible). */
export const pushOver = (F: Vec3, v: Vec3, dt: number): number => dot(F, scale(dt, v));

/** Velocity (v_x, v_y) of a charge on its circle and the Lorentz force, for B̲ out of the page (+z), angle `a` on the circle (clockwise for q > 0). */
export function lorentzCircle(q: number, B: number, speed: number, a: number) {
  // clockwise: v = speed·(cos a, −sin a) … the force q v × B points to the centre of the circle
  const v: Vec3 = [speed * Math.cos(a), -speed * Math.sin(a), 0];
  const F = lorentz(q, v, [0, 0, B]);
  return { v, F, P: power(F, v) };
}

/** A contact (Normalkraft) between two bodies: N̲ acts on body 1 at M₁ (velocity v̲₁), −N̲ on body 2 at M₂ (velocity v̲₂). */
export function contactPowers(N: Vec3, v1: Vec3, v2: Vec3) {
  const P1 = power(N, v1), P2 = power(scale(-1, N), v2);
  return { P1, P2, sum: P1 + P2 };
}

/** Power as force × speed: handy for the everyday-numbers table (F in N, v in m/s → W). */
export const watt = (F: number, v: number): number => F * v;

// ───────────────────────────────── K6: Moment ─────────────────────────────────

/** z-component of OP̲ × F̲ for plane vectors: x F_y − y F_x (positive = counter-clockwise). */
export const momentZ2D = (OP: readonly [number, number], F: readonly [number, number]): number => OP[0] * F[1] - OP[1] * F[0];

/**
 * Lever arm of the force F̲ at P about O (plane): perpendicular distance of O from the line of action, and the foot of
 * the perpendicular on that line. |M_z| = |F| · d.
 */
export function leverArm2D(OP: readonly [number, number], F: readonly [number, number]) {
  const nf = Math.hypot(F[0], F[1]);
  if (nf === 0) return { d: 0, foot: [OP[0], OP[1]] as [number, number], lambda: 0 };
  const u: [number, number] = [F[0] / nf, F[1] / nf];
  // foot = P + λ u with (foot − O) ⟂ u  ⇒  λ = −OP·u
  const lambda = -(OP[0] * u[0] + OP[1] * u[1]);
  const foot: [number, number] = [OP[0] + lambda * u[0], OP[1] + lambda * u[1]];
  return { d: Math.hypot(foot[0], foot[1]), foot, lambda };
}

/** Angle φ ∈ [0, π] between OP̲ and F̲ (both as free vectors), or null if one of them is zero. */
export function angleOPF(OP: readonly [number, number], F: readonly [number, number]): number | null {
  const a = Math.hypot(OP[0], OP[1]), b = Math.hypot(F[0], F[1]);
  if (a === 0 || b === 0) return null;
  return Math.acos(Math.max(-1, Math.min(1, (OP[0] * F[0] + OP[1] * F[1]) / (a * b))));
}

/** F̲ at P split into the radial part (along OP̲, outward positive) and the tangential part (counter-clockwise positive). */
export function radialTangential(OP: readonly [number, number], F: readonly [number, number]) {
  const r = Math.hypot(OP[0], OP[1]);
  if (r === 0) return { r, Fr: 0, Ft: 0 };
  const er: [number, number] = [OP[0] / r, OP[1] / r], et: [number, number] = [-er[1], er[0]];
  return { r, Fr: F[0] * er[0] + F[1] * er[1], Ft: F[0] * et[0] + F[1] * et[1] };
}

/** M̲_O′ = M̲_O + O′O̲ × F̲ (p. 34: O′P̲ = O′O̲ + OP̲). Returns M_O, M_O′ and the difference D = O′O̲ × F̲. */
export function momentShift(O: Vec3, Op: Vec3, P: Vec3, F: Vec3) {
  const MO = cross(sub(P, O), F), MOp = cross(sub(P, Op), F);
  const D = cross(sub(O, Op), F);
  return { MO, MOp, D, sum: add(MO, D) };
}

/** Height of F̲ over the base spanned by a̲ and b̲: (a̲ × b̲) · F̲ / |a̲ × b̲| (the parallelepiped of the proof, p. 35: a·(b×c) = b·(c×a)). */
export function heightOverBase(a: Vec3, b: Vec3, c: Vec3): number {
  const n = cross(a, b), l = norm(n);
  return l === 0 ? 0 : dot(n, c) / l;
}
