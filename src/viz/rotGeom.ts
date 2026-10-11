/** Pure geometry of the rotation figures (RotationFigures.tsx), kept apart from three.js for unit tests. */
import { rotateAbout } from '../physics/rotation';
import { type Vec3, add, cross, scale } from '../physics/vec';

/** The door: axis μ through A0 with direction e(β); body coordinates (s along μ, r away from μ, d thickness). */
export const DOOR = { A0: [0, 0, 0.15] as Vec3, H: 2.3, R0: 0.06, R1: 1.5, D: 0.05, sA: 0.35, sB: 1.95 };
export const axisDir = (beta: number): Vec3 => [Math.sin(beta), 0, Math.cos(beta)];
/** Unit vectors ⊥ μ at φ = 0: u0 points into the door (the x-direction, tilted with μ), w0 = e × u0 (= e_y). */
export const doorFrame = (beta: number) => {
  const e = axisDir(beta), u0: Vec3 = [Math.cos(beta), 0, -Math.sin(beta)], w0 = cross(e, u0);
  return { e, u0, w0 };
};
/** World position of the body point (s, r, d) after the door has turned by φ about μ. */
export function doorPoint(beta: number, phi: number, s: number, r: number, d = 0): Vec3 {
  const { e, u0, w0 } = doorFrame(beta);
  const p0 = add(DOOR.A0, add(scale(s, e), add(scale(r, u0), scale(d, w0))));
  return rotateAbout(p0, DOOR.A0, e, phi);
}
/** FootDemo: |AM| = 3 units (180 px at 60 px per unit), |ω| = 2. */
export const FOOT = { AM: 3, W: 2 };

/** |ω × OM| = |ω|·|OM|·sin α = |ω|·|AM| for every O on μ (sliding O shears the parallelogram but keeps its area). */
export function footNumbers(s: number) {
  const OM = Math.hypot(FOOT.AM, s), sinA = FOOT.AM / OM;
  return { OM, sinA, height: OM * sinA, v: FOOT.W * OM * sinA };
}

