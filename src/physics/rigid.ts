/** Rigid-body kinematics (Mitschrift ch. 3). */
import { type Vec3, add, cross, dot, sub } from './vec';

/** Grundgleichung: v_M = v_B + ω × BM  (lecture p. 22). */
export const rigidVelocity = (vB: Vec3, omega: Vec3, rB: Vec3, rM: Vec3): Vec3 =>
  add(vB, cross(omega, sub(rM, rB)));

/**
 * Satz der projizierten Geschwindigkeiten (SdpG): v_M · MN = v_N · MN.
 * Returns the defect v_N·MN − v_M·MN (0 for any rigid velocity field).
 */
export const sdpgDefect = (rM: Vec3, vM: Vec3, rN: Vec3, vN: Vec3): number => {
  const a = sub(rN, rM);
  return dot(vN, a) - dot(vM, a);
};
