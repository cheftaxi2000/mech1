/**
 * Kinemate, Invarianten, Zentralachse und Schraube (lecture pp. 24–25, Fig. 3.16, Problem Fig. 3.30).
 *
 * A state of motion of a rigid body is given by its Kinemate {v_B, ω} in a point B (Grundgleichung
 * v_M = v_B + ω × BM, p. 22). Two quantities do not depend on the point:
 *   1. Invariante: ω itself;
 *   2. Invariante: v_ω = (v · e_ω) e_ω, the part of the velocity along ω.
 * The points whose velocity is only v_ω form a line ζ ∥ ω, the Zentralachse (Schraubungsachse). With a
 * point Z on ζ as reference point, v_P = v_ω + ω × ZP: a turning about ζ plus a sliding along ζ — a screw.
 */
import { rigidVelocity } from './rigid';
import { type Vec3, add, cross, dot, norm, normalize, scale, sub } from './vec';

const EPS = 1e-12;

/** e_ω = ω/|ω| (ω ≠ 0). */
export const eOmega = (omega: Vec3): Vec3 => normalize(omega);

/** Signed component v · e_ω (R-021: the lecture's «|v_ω| = v_B · ω/|ω|» is this signed number). */
export const vOmegaSigned = (v: Vec3, omega: Vec3): number => dot(v, omega) / norm(omega);

/** v_ω = (v · e_ω) e_ω — the projection of v onto the direction of ω (handwritten on p. 25: «Projektion»). */
export const vOmegaPart = (v: Vec3, omega: Vec3): Vec3 => scale(dot(v, omega) / dot(omega, omega), omega);

/** v^⊥ = v − v_ω, the part of v perpendicular to ω. */
export const vPerpPart = (v: Vec3, omega: Vec3): Vec3 => sub(v, vOmegaPart(v, omega));

/** Pitch p = v_ω/ω (length per radian, signed): the body advances 2π p along ζ per full turn. */
export const pitch = (vB: Vec3, omega: Vec3): number => dot(vB, omega) / dot(omega, omega);

export interface Axis { point: Vec3; dir: Vec3 }

/**
 * The central axis ζ of the Kinemate {v_B, ω} in B (ω ≠ 0; null for a translation, ω = 0):
 * the point of ζ closest to B is r_Z = r_B + (ω × v_B)/|ω|², the direction is e_ω.
 */
export function centralAxis(rB: Vec3, vB: Vec3, omega: Vec3): Axis | null {
  const w2 = dot(omega, omega);
  if (w2 < EPS) return null;
  return { point: add(rB, scale(1 / w2, cross(omega, vB))), dir: eOmega(omega) };
}

/** Distance of the point r from the line `axis`. */
export const distanceToAxis = (axis: Axis, r: Vec3): number => norm(cross(axis.dir, sub(r, axis.point)));

/** R-020: speed at distance d from ζ, |v|² = v_ω² + ω² d² (smallest on ζ, growing with d). */
export const speedAtDistance = (vOmega: number, omega: number, d: number): number => Math.hypot(vOmega, omega * d);

/**
 * The lecture's construction in Fig. 3.16. e^⊥ = v_B^⊥/|v_B^⊥| and the line g through B, perpendicular to ω and
 * to v_B^⊥, oriented so that ω × BP points against e^⊥: g = e_ω × e^⊥ (R-021). Null if v_B^⊥ = 0 (B is on ζ).
 */
export function lineG(vB: Vec3, omega: Vec3): { ePerp: Vec3; dir: Vec3; vPerp: number } | null {
  const vp = vPerpPart(vB, omega), n = norm(vp);
  if (n < EPS || norm(omega) < EPS) return null;
  const ePerp = scale(1 / n, vp);
  return { ePerp, dir: cross(eOmega(omega), ePerp), vPerp: n };
}

/**
 * Velocity of the point P on g at distance x from B, as written beside Fig. 3.16:
 * v_P = v_ω + (v_B^⊥ − ω · x) · e^⊥.
 */
export function velocityOnG(vB: Vec3, omega: Vec3, x: number): Vec3 {
  const g = lineG(vB, omega);
  if (!g) return vB;
  return add(vOmegaPart(vB, omega), scale(g.vPerp - norm(omega) * x, g.ePerp));
}

/** Rodrigues: the point p turned by `angle` (right-handed) about the line through `a` with unit direction `u`. */
export function rotateAbout(a: Vec3, u: Vec3, angle: number, p: Vec3): Vec3 {
  const r = sub(p, a), c = Math.cos(angle), s = Math.sin(angle);
  const rot = add(add(scale(c, r), scale(s, cross(u, r))), scale((1 - c) * dot(u, r), u));
  return add(a, rot);
}

/**
 * Where the body point p0 is after time t if the Kinemate stays the same (constant screw): turned by |ω| t about ζ
 * and shifted by v_ω t along ζ. For ω = 0 (translation) it is shifted by v_B t.
 */
export function screwPosition(rB: Vec3, vB: Vec3, omega: Vec3, p0: Vec3, t: number): Vec3 {
  const ax = centralAxis(rB, vB, omega);
  if (!ax) return add(p0, scale(t, vB));
  return add(rotateAbout(ax.point, ax.dir, norm(omega) * t, p0), scale(t, vOmegaPart(vB, omega)));
}

/** The velocity field written with a point Z on ζ as reference point: v_P = v_ω + ω × ZP. */
export const screwVelocity = (axis: Axis, vOmega: Vec3, omega: Vec3, rP: Vec3): Vec3 => rigidVelocity(vOmega, omega, axis.point, rP);

/**
 * Problem Fig. 3.30 (p. 25 + handwritten page): cube of edge 1 m, B at the origin (x toward the viewer, y to the
 * right, z up), Kinemate in B: v_B = (0, 2, 2) m/s, ω = (0, 2, 0) s⁻¹. Wanted: ζ.
 */
export const FIG330 = { edge: 1, B: [0, 0, 0] as Vec3, vB: [0, 2, 2] as Vec3, omega: [0, 2, 0] as Vec3 };

/** Every number of the worked example, computed (not typed): used by the lesson, the animation and the tests. */
export function fig330Solution() {
  const { B, vB, omega } = FIG330;
  const e = eOmega(omega);
  const proj = dot(vB, e); // (v_B · e_ω) = 2
  const vw = vOmegaPart(vB, omega); // (0, 2, 0)
  const vperp = vPerpPart(vB, omega); // (0, 0, 2)
  /** P ∈ ζ ⇔ v_B + ω × BP = v_ω ⇔ ω × BP = v_ω − v_B = (0, 0, −2) */
  const rhs = sub(vw, vB);
  /** ω × (x, y, z) written out for ω = (0, 2, 0): (2z, 0, −2x) — y drops out (ω × ω = 0) */
  const omegaCross = (p: Vec3) => cross(omega, p);
  const xP = -rhs[2] / omega[1], zP = rhs[0] / omega[1]; // −2x = −2 ⇒ x = 1; 2z = 0 ⇒ z = 0
  const axis = centralAxis(B, vB, omega)!;
  return { e, proj, vw, vperp, rhs, omegaCross, xP, zP, axis, pitch: pitch(vB, omega) };
}
