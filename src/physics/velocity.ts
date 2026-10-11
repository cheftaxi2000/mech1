/** Example motions of the lesson "geschwindigkeit" (lecture pp. 8–9), with their exact velocities. */
import type { Vec3 } from './vec';

/** Rectilinear demo motion x(t) (lecture p. 8: x(t) a scalar function), t in s, x in m. */
export const lineX = (t: number) => 0.4 + 1.3 * t - 0.28 * t * t;
export const lineXdot = (t: number) => 1.3 - 0.56 * t;

/** Helix r(t) = (R cos ωt, R sin ωt, z0 + c t): the 3D demo trajectory. */
export const HELIX = { R: 1.3, w: 0.9, c: 0.28, z0: -0.9, T: 2 * Math.PI / 0.9 * 1.4 };
export const helix = (t: number): Vec3 => [HELIX.R * Math.cos(HELIX.w * t), HELIX.R * Math.sin(HELIX.w * t), HELIX.z0 + HELIX.c * t];
export const helixVelocity = (t: number): Vec3 => [-HELIX.R * HELIX.w * Math.sin(HELIX.w * t), HELIX.R * HELIX.w * Math.cos(HELIX.w * t), HELIX.c];

/** Beispiel p. 10: r(t) = (at, at, b a² t²), here a = 0.5 m/s, b = 0.6 1/m (so that b a² t² is a length). */
export const EX10 = { a: 0.5, b: 0.6, T: 3 };
export const ex10 = (t: number): Vec3 => [EX10.a * t, EX10.a * t, EX10.b * EX10.a ** 2 * t * t];
export const ex10v = (t: number): Vec3 => [EX10.a, EX10.a, 2 * EX10.b * EX10.a ** 2 * t];
