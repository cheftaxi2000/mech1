import { describe, expect, it } from 'vitest';
import { CF, CF_STEPS, circFrame } from './circFrame';
import { cross, dot, norm, sub, vecApproxEqual } from '../../physics/vec';

describe('circular-motion animation frames (lecture p. 11)', () => {
  it('every frame: M on the circle ρ = R at height z0', () => {
    for (let s = 0; s < CF_STEPS; s++) for (let i = 0; i <= 20; i++) {
      const f = circFrame(s, i / 20);
      expect(Math.hypot(f.M[0], f.M[1])).toBeCloseTo(CF.R, 12); expect(f.M[2]).toBe(CF.Z0);
    }
  });
  it('v drawn = R φ̇ e_φ = ω × r, tangent to the circle, in every frame', () => {
    for (let s = 0; s < CF_STEPS; s++) {
      const f = circFrame(s, 1);
      expect(vecApproxEqual(f.vec.v, f.vec.wxr)).toBe(true);
      expect(dot(f.vec.v, sub(f.M, f.C))).toBeCloseTo(0, 12);
      expect(vecApproxEqual(cross([0, 0, 1], f.vec.eRho), f.vec.ePhi)).toBe(true); // e_φ = e_z × e_ρ
    }
  });
  it('final frames show what the captions say', () => {
    expect(circFrame(0, 1).circle).toBe(1); expect(circFrame(0, 1).v).toBe(0);
    expect(circFrame(1, 1).v).toBe(1); expect(circFrame(1, 1).basis).toBe(1);
    expect(circFrame(2, 1).omega).toBe(1);
    expect(circFrame(3, 0.6).cross).toBe(1);
    expect(circFrame(4, 1).decomp).toBe(1);
    expect(circFrame(5, 1).vCross).toBe(1);
    expect(norm(circFrame(5, 1).vec.omega)).toBeCloseTo(CF.PHIDOT, 12);
  });
  it('steps join continuously', () => {
    for (let s = 0; s < CF_STEPS - 1; s++) {
      const a = circFrame(s, 1), b = circFrame(s + 1, 0);
      expect(a.phi).toBeCloseTo(b.phi, 12); expect(a.basis).toBe(b.basis); expect(a.v).toBe(b.v);
    }
  });
});
