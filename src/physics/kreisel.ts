/**
 * Kreiselung (lecture pp. 20–21): a rigid body with exactly one point O at rest.
 * Example used in the lesson: a cone (half-angle γ, apex at O) that lies on the floor z = 0 and turns about
 * its apex — like a paper cup rolling in a circle on a table.
 */
import { rotateAbout } from './rotation';
import { type Vec3, add, cross, dot, norm, normalize, scale, sub } from './vec';

const O: Vec3 = [0, 0, 0];
const EZ: Vec3 = [0, 0, 1];

/** Direction of the cone's own axis when the line of contact with the floor has azimuth φ (axis tilted up by γ). */
export const coneAxis = (gam: number, phi: number): Vec3 => [Math.cos(gam) * Math.cos(phi), Math.cos(gam) * Math.sin(phi), Math.sin(gam)];

/**
 * Pose of the cone: first turned by ψ about its own axis (in the start position φ = 0), then by φ about the
 * vertical through O. A body point p0 (given in the start position) is then at conePoint(…, p0).
 */
export function conePoint(gam: number, phi: number, psi: number, p0: Vec3): Vec3 {
  return rotateAbout(rotateAbout(p0, O, coneAxis(gam, 0), psi), O, EZ, phi);
}

/** Angular velocity of that motion: ω = φ̇ e_z + ψ̇ e_3, e_3 the cone's axis at this instant. */
export const coneOmega = (gam: number, phi: number, phiDot: number, psiDot: number): Vec3 =>
  add(scale(phiDot, EZ), scale(psiDot, coneAxis(gam, phi)));

/** Spin rate for rolling without sliding: ψ̇ = −φ̇ / sin γ (then ω lies along the line of contact). */
export const rollingSpin = (gam: number, phiDot: number) => -phiDot / Math.sin(gam);

/** Velocity of a point r (measured from O) in a Kreiselung: v = ω × r. */
export const kreiselVelocity = (omega: Vec3, r: Vec3): Vec3 => cross(omega, r);

/**
 * The proof on p. 21 (Fig. 3.11): the plane E_M through M perpendicular to v_M, and E_N through N perpendicular
 * to v_N. Both contain O (because v_M ⊥ r_M, v_N ⊥ r_N); their line of intersection μ has the direction
 * v_M × v_N. Returns that direction (unit) and the checks used in the lesson.
 */
export function proofPlanes(omega: Vec3, rM: Vec3, rN: Vec3) {
  const vM = kreiselVelocity(omega, rM), vN = kreiselVelocity(omega, rN);
  const d = normalize(cross(vM, vN));
  return {
    vM, vN, d,
    /** distance of O from E_M and from E_N (both 0) */
    oInEM: dot(sub(O, rM), normalize(vM)), oInEN: dot(sub(O, rN), normalize(vN)),
  };
}

/**
 * SdpG checks for a point A on μ: the three products v_A·AM, v_A·AN, v_A·AO with the (unknown) velocity
 * v_A = ω × r_A. Also the triple product of AM, AN, AO: ≠ 0 means the three directions span space, so a vector
 * perpendicular to all three must be 0 (R-012).
 */
export function restOnAxis(omega: Vec3, rM: Vec3, rN: Vec3, rA: Vec3) {
  const vA = kreiselVelocity(omega, rA);
  const AM = sub(rM, rA), AN = sub(rN, rA), AO = sub(O, rA);
  return { vA, pM: dot(vA, AM), pN: dot(vA, AN), pO: dot(vA, AO), spat: dot(cross(AM, AN), AO), speed: norm(vA) };
}
