/** Rotation of a rigid body about a fixed axis μ (lecture pp. 15–19). */
import { type Vec3, add, cross, dot, norm, normalize, scale, sub } from './vec';

/** Foot of the perpendicular from p onto the axis through O with direction e (the lecture's D on p. 16, A on p. 18). */
export function footOnAxis(p: Vec3, O: Vec3, e: Vec3): Vec3 {
  const u = normalize(e);
  return add(O, scale(dot(sub(p, O), u), u));
}

/** Distance of p from the axis through O with direction e (|AM| on p. 18). */
export const distToAxis = (p: Vec3, O: Vec3, e: Vec3): number => norm(sub(p, footOnAxis(p, O, e)));

/** p turned by the angle φ about the axis through O with direction e (right-hand rule, Rodrigues' formula). */
export function rotateAbout(p: Vec3, O: Vec3, e: Vec3, phi: number): Vec3 {
  const u = normalize(e), q = sub(p, O);
  const c = Math.cos(phi), s = Math.sin(phi);
  return add(O, add(add(scale(c, q), scale(s, cross(u, q))), scale((1 - c) * dot(u, q), u)));
}

/** Velocity in a rotation: v = ω × r, r measured from a point O ON the axis (eq. (3), p. 17–18). */
export const rotationVelocity = (omega: Vec3, O: Vec3, p: Vec3): Vec3 => cross(omega, sub(p, O));

/**
 * Proof 3 (p. 17), top view: P and Q on circles about the z-axis with angular speeds wP, wQ.
 * Returns the two projections of v_P and v_Q onto the direction PQ (the SdpG compares them) and
 * X = (e_z × r_P)·r_Q, the signed area of the parallelogram spanned by r_P and r_Q seen from above.
 */
export function proof3(rP: Vec3, rQ: Vec3, wP: number, wQ: number) {
  const ez: Vec3 = [0, 0, 1];
  const vP = scale(wP, cross(ez, rP)), vQ = scale(wQ, cross(ez, rQ));
  const PQ = sub(rQ, rP), L = norm(PQ);
  const X = dot(cross(ez, rP), rQ);
  return { vP, vQ, projP: dot(vP, PQ) / L, projQ: dot(vQ, PQ) / L, X, L };
}
