/**
 * Lesson "basen" (lecture p. 6): animation of the cylindrical basis, as a pure function of (step, t).
 * The 3D component `CylBasisAnim` only draws what this returns, so every frame is unit-testable.
 *
 *  step 0  the three coordinate lines through M are drawn (ρ-ray, φ-circle, z-vertical)
 *  step 1  the basis vectors grow at M, tangent to those lines, length 1
 *  step 2  M moves along the φ-circle (φ: PHI0 → PHI1): e_ρ, e_φ turn with it, e_z and e_x (at O) do not
 *  step 3  r = ρ e_ρ + z e_z is built from O: first ρ e_ρ, then z e_z — no φ-term
 */
import { cylToCart, ePhi, eRho } from '../../physics/coords';
import type { Vec3 } from '../../physics/vec';

/** φ runs from 10° to 75°: from the start camera both e_ρ and e_φ are then seen at ≥ 60 % of their length (views12.test.ts). */
export const CB = { RHO: 1.5, Z: 1.1, PHI0: (10 * Math.PI) / 180, PHI1: (75 * Math.PI) / 180 };
/** Start view of CylBasisAnim (lecture orientation: x down-right, y up-right), seen a little more from above than Fig. 1.8. */
export const CB_CAMERA: [number, number, number] = [4.3, -3.6, 4.6];
export const CB_TARGET: [number, number, number] = [0.5, 0.5, 0.7];
export const CB_STEPS = 4;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };

export interface CylBasisFrame {
  phi: number;
  M: Vec3;
  /** drawn fraction of each coordinate line through M */
  lines: { rho: number; phi: number; z: number };
  /** length of the basis vectors at M (0 … 1, 1 = unit length) */
  basisLen: number;
  basis: { eRho: Vec3; ePhi: Vec3; eZ: Vec3 };
  /** faint copy of the basis at the start position (step 2 onwards), to compare directions */
  ghost: { at: Vec3; eRho: Vec3; ePhi: Vec3 } | null;
  /** Cartesian e_x at O for comparison (does not turn) */
  showEx: boolean;
  /** construction of r: fraction of ρ e_ρ (0…1) and of z e_z (0…1); r arrow shown when both are complete */
  decomp: { rho: number; z: number; r: boolean };
}

export function cylBasisFrame(step: number, t: number): CylBasisFrame {
  const s = Math.max(0, Math.min(CB_STEPS - 1, step));
  const phi = s < 2 ? CB.PHI0 : s === 2 ? CB.PHI0 + (CB.PHI1 - CB.PHI0) * ease(t) : CB.PHI1;
  const M = cylToCart({ rho: CB.RHO, phi, z: CB.Z });
  const lines = s === 0
    ? { rho: ease(t * 3), phi: ease(t * 3 - 1), z: ease(t * 3 - 2) }
    : { rho: 1, phi: 1, z: 1 };
  const basisLen = s === 0 ? 0 : s === 1 ? ease(t) : 1;
  const ghost = s >= 2 ? { at: cylToCart({ rho: CB.RHO, phi: CB.PHI0, z: CB.Z }), eRho: eRho(CB.PHI0), ePhi: ePhi(CB.PHI0) } : null;
  const decomp = s < 3 ? { rho: 0, z: 0, r: false } : { rho: ease(t * 2), z: ease(t * 2 - 1), r: t >= 1 };
  return { phi, M, lines, basisLen, basis: { eRho: eRho(phi), ePhi: ePhi(phi), eZ: [0, 0, 1] }, ghost, showEx: s >= 2, decomp };
}
