import { describe, expect, it } from 'vitest';
import { cylToCart, ePhi, eRho } from './coords';
import { numericVelocity } from './kinematics';
import { add, cross, dot, E_Z, norm, scale, sub, vecApproxEqual, type Vec3 } from './vec';

const R = 1.3, z0 = 0.8;
const phiOf = (t: number) => 0.4 + 0.9 * t + 0.2 * t * t; // non-uniform: φ̇ changes
const phiDot = (t: number) => 0.9 + 0.4 * t;
const r = (t: number) => cylToCart({ rho: R, phi: phiOf(t), z: z0 });

describe('Kreisbewegung (lecture p. 11)', () => {
  it('r = R e_ρ + z0 e_z; its cylindrical components are (R, 0, z0), not (R, φ, z0)', () => {
    for (const t of [0, 1, 2.5]) {
      const p = r(t), ph = phiOf(t);
      expect(vecApproxEqual(p, add(scale(R, eRho(ph)), scale(z0, E_Z)))).toBe(true);
      expect([dot(p, eRho(ph)), dot(p, ePhi(ph)), dot(p, E_Z)].map((x) => +x.toFixed(12))).toEqual([R, 0, z0]);
    }
  });
  it('v = R φ̇ e_φ, tangent to the circle; ṡ = R φ̇, τ = e_φ (φ̇ > 0)', () => {
    for (const t of [0.3, 1.7]) {
      const v = numericVelocity(r, t);
      expect(vecApproxEqual(v, scale(R * phiDot(t), ePhi(phiOf(t))), 1e-6)).toBe(true);
      expect(norm(v)).toBeCloseTo(R * phiDot(t), 6);
      expect(dot(v, sub(r(t), [0, 0, z0]))).toBeCloseTo(0, 6);
    }
  });
  it('e_φ = e_z × e_ρ (used in the Umformung)', () => {
    for (const ph of [0, 1, 3, 5]) expect(vecApproxEqual(cross(E_Z, eRho(ph)), ePhi(ph))).toBe(true);
  });
  it('v = ω × r with ω = φ̇ e_z, for every height z0 (e_z × e_z = 0)', () => {
    for (const t of [0.3, 1.7]) for (const zz of [-1, 0, 2]) {
      const p = cylToCart({ rho: R, phi: phiOf(t), z: zz });
      expect(vecApproxEqual(cross(scale(phiDot(t), E_Z), p), scale(R * phiDot(t), ePhi(phiOf(t))))).toBe(true);
    }
    expect(norm(cross(E_Z, E_Z))).toBe(0);
  });
  it('Cartesian computation: (0,0,φ̇) × (R cos φ, R sin φ, z0) = (−φ̇R sin φ, φ̇R cos φ, 0)', () => {
    const ph = 0.7, w = 1.9;
    expect(vecApproxEqual(cross([0, 0, w], [R * Math.cos(ph), R * Math.sin(ph), z0]), [-w * R * Math.sin(ph), w * R * Math.cos(ph), 0])).toBe(true);
  });
  it('slide L5: in the cylindrical basis (0,0,φ̇) × (R,0,z0) = (0, φ̇R, 0) = φ̇R e_φ', () => {
    expect(cross([0, 0, 2], [R, 0, z0])).toEqual([0, 2 * R, 0]);
  });
  it('rotation field: v = 0 on the axis, |v| = |ω| · distance from the axis', () => {
    const w: Vec3 = [0, 0, 1.4];
    expect(norm(cross(w, [0, 0, 3]))).toBe(0);
    for (const p of [[1, 0, 0.5], [0.3, -1.2, 2], [-2, 1, -1]] as Vec3[]) expect(norm(cross(w, p))).toBeCloseTo(1.4 * Math.hypot(p[0], p[1]), 12);
  });
  it('misconception: with O off the axis, ω × r is wrong (O must lie on the axis)', () => {
    const w: Vec3 = [0, 0, 1], Oshift: Vec3 = [0.8, 0, 0], p = cylToCart({ rho: R, phi: 1, z: z0 });
    const truth = cross(w, p), wrong = cross(w, sub(p, Oshift));
    expect(norm(sub(truth, wrong))).toBeCloseTo(0.8, 12);
  });
});
