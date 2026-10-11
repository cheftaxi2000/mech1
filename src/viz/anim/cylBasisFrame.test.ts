import { describe, expect, it } from 'vitest';
import { CB, CB_STEPS, cylBasisFrame } from './cylBasisFrame';
import { cylToCart } from '../../physics/coords';
import { add, cross, dot, norm, scale, sub, vecApproxEqual, type Vec3 } from '../../physics/vec';

/** Unit tangent of a coordinate line: numerical derivative of the position with respect to one coordinate. */
const tangent = (f: (h: number) => Vec3): Vec3 => { const d = sub(f(1e-6), f(-1e-6)); return scale(1 / norm(d), d); };

describe('cylindrical basis animation (lecture p. 6)', () => {
  const final = (s: number) => cylBasisFrame(s, 1);

  it('step 1 ends with all three coordinate lines fully drawn, nothing else', () => {
    const f = final(0);
    expect(f.lines).toEqual({ rho: 1, phi: 1, z: 1 });
    expect(f.basisLen).toBe(0);
    expect(f.decomp.r).toBe(false);
  });
  it('step 2 ends with an orthonormal, right-handed basis of length 1, tangent to the coordinate lines in M', () => {
    const f = final(1), { eRho, ePhi, eZ } = f.basis;
    expect(f.basisLen).toBe(1);
    for (const e of [eRho, ePhi, eZ]) expect(norm(e)).toBeCloseTo(1, 12);
    expect(dot(eRho, ePhi)).toBeCloseTo(0, 12); expect(dot(eRho, eZ)).toBeCloseTo(0, 12); expect(dot(ePhi, eZ)).toBeCloseTo(0, 12);
    expect(vecApproxEqual(cross(eRho, ePhi), eZ)).toBe(true); // e_ρ × e_φ = e_z
    const at = (d: Partial<{ rho: number; phi: number; z: number }>) => cylToCart({ rho: CB.RHO, phi: f.phi, z: CB.Z, ...d });
    expect(vecApproxEqual(eRho, tangent((h) => at({ rho: CB.RHO + h })), 1e-6)).toBe(true);
    expect(vecApproxEqual(ePhi, tangent((h) => at({ phi: f.phi + h })), 1e-6)).toBe(true);
    expect(vecApproxEqual(eZ, tangent((h) => at({ z: CB.Z + h })), 1e-6)).toBe(true);
  });
  it('step 3 ends with M moved along the circle: e_ρ, e_φ turned by Δφ, e_z unchanged, ghost at the start', () => {
    const f = final(2);
    expect(f.phi).toBeCloseTo(CB.PHI1, 12);
    expect(Math.hypot(f.M[0], f.M[1])).toBeCloseTo(CB.RHO, 12); // still on the circle ρ = const
    expect(dot(f.basis.eRho, f.ghost!.eRho)).toBeCloseTo(Math.cos(CB.PHI1 - CB.PHI0), 12);
    expect(f.basis.eZ).toEqual([0, 0, 1]);
    expect(f.showEx).toBe(true);
  });
  it('step 4 ends with r = ρ e_ρ + z e_z reaching M exactly (no φ-term)', () => {
    const f = final(3);
    expect(f.decomp).toEqual({ rho: 1, z: 1, r: true });
    expect(vecApproxEqual(add(scale(CB.RHO, f.basis.eRho), scale(CB.Z, f.basis.eZ)), f.M)).toBe(true);
  });
  it('every frame: M is on the cylinder ρ = const at height z, basis length within [0, 1]', () => {
    for (let s = 0; s < CB_STEPS; s++) for (let i = 0; i <= 20; i++) {
      const f = cylBasisFrame(s, i / 20);
      expect(Math.hypot(f.M[0], f.M[1])).toBeCloseTo(CB.RHO, 12);
      expect(f.M[2]).toBe(CB.Z);
      expect(f.basisLen).toBeGreaterThanOrEqual(0); expect(f.basisLen).toBeLessThanOrEqual(1);
    }
  });
  it('steps join continuously: the last frame of a step equals the first frame of the next', () => {
    for (let s = 0; s < CB_STEPS - 1; s++) {
      const a = cylBasisFrame(s, 1), b = cylBasisFrame(s + 1, 0);
      expect(a.phi).toBeCloseTo(b.phi, 12);
      expect(a.basisLen).toBe(b.basisLen);
    }
  });
});
