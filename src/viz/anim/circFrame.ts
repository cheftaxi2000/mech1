/**
 * Lesson "kreisbewegung" (lecture p. 11): the derivation v = ω × r as a pure function of (step, t);
 * `CircleAnim` draws what this returns, so every frame is unit-testable.
 *
 *  step 0  circle ρ = R at height z0; M runs along it (only φ changes)
 *  step 1  basis at M and v = R φ̇ e_φ (tangent)
 *  step 2  ω = φ̇ e_z on the axis, with the sense of rotation (right hand)
 *  step 3  e_φ = e_z × e_ρ
 *  step 4  r = z0 e_z + R e_ρ, i.e. R e_ρ = r − z0 e_z
 *  step 5  v = ω × r (the z0 e_z part contributes e_z × e_z = 0)
 */
import { cylToCart, ePhi, eRho } from '../../physics/coords';
import { cross, scale, type Vec3 } from '../../physics/vec';

export const CF = { R: 1.4, Z0: 1.0, PHIDOT: 0.55, PHI0: (-55 * Math.PI) / 180, PHI1: (-18 * Math.PI) / 180, OMEGA_LEN: 1.2 };
export const CF_STEPS = 6;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));

export interface CircFrame {
  phi: number; M: Vec3; C: Vec3; // C = centre of the circle on the axis
  circle: number; // drawn fraction of the circle
  basis: number; // length factor of e_ρ, e_φ, e_z at M
  v: number; // fraction of v drawn
  omega: number; // fraction of ω drawn
  cross: number; // highlight of e_φ = e_z × e_ρ (0 … 1)
  r: number; decomp: number; // r arrow, and its split into z0 e_z + R e_ρ
  vCross: number; // final v = ω × r emphasis
  vec: { eRho: Vec3; ePhi: Vec3; v: Vec3; omega: Vec3; wxr: Vec3 };
}

export function circFrame(step: number, t: number): CircFrame {
  const s = Math.max(0, Math.min(CF_STEPS - 1, step));
  const phi = s === 0 ? CF.PHI0 + (CF.PHI1 - CF.PHI0) * seg(t, 0.35, 1) : CF.PHI1;
  const M = cylToCart({ rho: CF.R, phi, z: CF.Z0 });
  const omega: Vec3 = [0, 0, CF.PHIDOT];
  const v = scale(CF.R * CF.PHIDOT, ePhi(phi));
  return {
    phi, M, C: [0, 0, CF.Z0],
    circle: s === 0 ? seg(t, 0, 0.4) : 1,
    basis: s === 0 ? 0 : s === 1 ? seg(t, 0, 0.4) : 1,
    v: s === 0 ? 0 : s === 1 ? seg(t, 0.45, 1) : 1,
    omega: s < 2 ? 0 : s === 2 ? seg(t, 0, 0.6) : 1,
    cross: s === 3 ? seg(t, 0, 0.5) : 0,
    r: s < 4 ? 0 : s === 4 ? seg(t, 0, 0.35) : 1,
    decomp: s < 4 ? 0 : s === 4 ? seg(t, 0.35, 1) : 1,
    vCross: s === 5 ? seg(t, 0.2, 0.8) : 0,
    vec: { eRho: eRho(phi), ePhi: ePhi(phi), v, omega, wxr: cross(omega, M) },
  };
}
