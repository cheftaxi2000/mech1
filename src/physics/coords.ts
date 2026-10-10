/**
 * Coordinate systems exactly as in the lecture (Mitschrift pp. 3–7):
 *  - cylindrical (ρ, φ, z):  x = ρ cos φ, y = ρ sin φ, z = z
 *  - spherical  (r, θ, ψ):   x = r sin θ cos ψ, y = r sin θ sin ψ, z = r cos θ
 *    θ = polar angle measured from the +z axis, ψ = azimuth in the xy-plane from +x.
 *    NOTE: the lecture uses ψ (not φ) for the spherical azimuth. Keep it that way.
 *
 * Inverse maps: the lecture writes φ = arctan(y/x) and θ = arctan(√(x²+y²)/z).
 * Those are only correct for x > 0 and z > 0 respectively; here we use atan2,
 * which picks the correct quadrant. See docs/REVIEW_LOG.md (R-001).
 */
import { type Vec3, vec } from './vec';

export interface Cylindrical { rho: number; phi: number; z: number }
export interface Spherical { r: number; theta: number; psi: number }

const TWO_PI = 2 * Math.PI;
/** Wrap an angle into [0, 2π). */
export const wrapAngle = (a: number): number => ((a % TWO_PI) + TWO_PI) % TWO_PI;

export const cylToCart = ({ rho, phi, z }: Cylindrical): Vec3 =>
  vec(rho * Math.cos(phi), rho * Math.sin(phi), z);

/** φ ∈ [0, 2π). On the z-axis (ρ = 0) φ is undefined; we return φ = 0 by convention. */
export const cartToCyl = ([x, y, z]: Vec3): Cylindrical => ({
  rho: Math.hypot(x, y),
  phi: x === 0 && y === 0 ? 0 : wrapAngle(Math.atan2(y, x)),
  z,
});

export const sphToCart = ({ r, theta, psi }: Spherical): Vec3 =>
  vec(r * Math.sin(theta) * Math.cos(psi), r * Math.sin(theta) * Math.sin(psi), r * Math.cos(theta));

/** θ ∈ [0, π], ψ ∈ [0, 2π). At the origin θ, ψ are undefined (returned as 0); on the z-axis ψ is undefined (0). */
export const cartToSph = ([x, y, z]: Vec3): Spherical => {
  const rho = Math.hypot(x, y);
  return {
    r: Math.hypot(x, y, z),
    theta: rho === 0 && z === 0 ? 0 : Math.atan2(rho, z),
    psi: rho === 0 ? 0 : wrapAngle(Math.atan2(y, x)),
  };
};

/** The lecture's literal inverse formula φ = arctan(y/x) — kept to *demonstrate* its quadrant failure. */
export const lectureArctanPhi = (x: number, y: number): number => Math.atan(y / x);

// ---- Local bases (unit vectors tangent to the coordinate lines), Cartesian components ----
export const eRho = (phi: number): Vec3 => vec(Math.cos(phi), Math.sin(phi), 0);
export const ePhi = (phi: number): Vec3 => vec(-Math.sin(phi), Math.cos(phi), 0);
export const eR = (theta: number, psi: number): Vec3 =>
  vec(Math.sin(theta) * Math.cos(psi), Math.sin(theta) * Math.sin(psi), Math.cos(theta));
export const eTheta = (theta: number, psi: number): Vec3 =>
  vec(Math.cos(theta) * Math.cos(psi), Math.cos(theta) * Math.sin(psi), -Math.sin(theta));
export const ePsi = (psi: number): Vec3 => vec(-Math.sin(psi), Math.cos(psi), 0);
