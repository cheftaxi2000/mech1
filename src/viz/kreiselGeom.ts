/** Pure geometry of the Kreiselung explorer (lesson 11): the rolling cone, tested in kreiselGeom.test.ts. */
import { coneAxis, coneOmega, conePoint, kreiselVelocity, rollingSpin } from '../physics/kreisel';
import { type Vec3, add, cross, norm, normalize, scale } from '../physics/vec';

const DEG = Math.PI / 180;
/** The cone of the lesson: half-angle γ = 25°, slant length L = 2 (apex O at the origin). */
export const CONE = { GAM: 25 * DEG, L: 2 };
export const H = CONE.L * Math.cos(CONE.GAM);
export const R = CONE.L * Math.sin(CONE.GAM);
const E3_0 = coneAxis(CONE.GAM, 0);
export const U0: Vec3 = [-Math.sin(CONE.GAM), 0, Math.cos(CONE.GAM)];
const W0 = cross(E3_0, U0);
/** A point of the cone in its start position: at distance s·H along the axis, at body angle a and fraction f of the radius. */
export const coneBodyPoint = (s: number, a: number, f = 1): Vec3 =>
  add(scale(s * H, E3_0), scale(s * f * R, add(scale(Math.cos(a), U0), scale(Math.sin(a), W0))));
/** The marked rim point M: in the start position on top of the cone (body angle 0). */
export const M0 = coneBodyPoint(1, 0);

export type Mode = 'roll' | 'still' | 'fast';
export const MODES: Record<Mode, { k: number; de: string; en: string }> = {
  roll: { k: 1, de: 'Rollen', en: 'rolling' },
  still: { k: 0, de: 'Ohne Eigendrehung', en: 'no spin' },
  fast: { k: 2, de: 'Schnelle Eigendrehung', en: 'fast spin' },
};

/** Pure frame of the explorer (tested): pose, ω, the momentary axis and the velocities shown. */
export function kreiselFrame(phi: number, k: number) {
  const { GAM, L } = CONE;
  const ratio = k * rollingSpin(GAM, 1); // ψ̇ / φ̇
  const psi = ratio * phi;
  const P = (p0: Vec3) => conePoint(GAM, phi, psi, p0);
  const omega = coneOmega(GAM, phi, 1, ratio); // φ̇ = 1
  const contact: Vec3 = [L * Math.cos(phi), L * Math.sin(phi), 0];
  const vContact = norm(kreiselVelocity(omega, contact));
  return { psi, P, omega, axis: normalize(omega), contact, vContact, rolling: vContact < 1e-9, e3: coneAxis(GAM, phi) };
}

