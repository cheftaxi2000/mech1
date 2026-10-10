/** Point kinematics (Mitschrift ch. 2). Numerical helpers used only for *checking* closed-form results. */
import { type Vec3, add, scale, sub, norm } from './vec';
import { eRho, ePhi, eR, eTheta, ePsi } from './coords';

export type Trajectory = (t: number) => Vec3;

/** Central-difference velocity ṙ(t). Accuracy O(h²); a check, never a proof. */
export const numericVelocity = (r: Trajectory, t: number, h = 1e-5): Vec3 =>
  scale(1 / (2 * h), sub(r(t + h), r(t - h)));

/** v = ρ̇ e_ρ + ρ φ̇ e_φ + ż e_z  (lecture p. 10). */
export const velocityCylindrical = (
  rho: number, phi: number, rhoDot: number, phiDot: number, zDot: number,
): Vec3 => add(add(scale(rhoDot, eRho(phi)), scale(rho * phiDot, ePhi(phi))), [0, 0, zDot]);

/** v = ṙ e_r + r θ̇ e_θ + r sin θ ψ̇ e_ψ  (lecture p. 10, proof in Hausübung 3). */
export const velocitySpherical = (
  r: number, theta: number, psi: number, rDot: number, thetaDot: number, psiDot: number,
): Vec3 =>
  add(
    add(scale(rDot, eR(theta, psi)), scale(r * thetaDot, eTheta(theta, psi))),
    scale(r * Math.sin(theta) * psiDot, ePsi(psi)),
  );

/** Speed ("Schnelligkeit") ṡ = |v| for a trajectory traversed in the direction of increasing s. */
export const speed = (v: Vec3): number => norm(v);
