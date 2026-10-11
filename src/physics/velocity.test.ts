import { describe, expect, it } from 'vitest';
import { numericVelocity } from './kinematics';
import { ex10, ex10v, EX10, helix, helixVelocity, lineX, lineXdot } from './velocity';
import { E_X, E_Y, E_Z, add, norm, scale, vecApproxEqual } from './vec';

describe('rectilinear motion (lecture p. 8)', () => {
  it('v = dx/dt is the limit of the difference quotient (x(t+Δt) − x(t))/Δt', () => {
    const t = 1.1;
    const q = (dt: number) => (lineX(t + dt) - lineX(t)) / dt;
    expect(Math.abs(q(0.5) - lineXdot(t))).toBeGreaterThan(0.1);
    expect(q(1e-6)).toBeCloseTo(lineXdot(t), 5);
  });
});

describe('velocity in the Cartesian basis (lecture p. 9)', () => {
  it('ṙ = ẋ e_x + ẏ e_y + ż e_z: the basis terms x ė_x … vanish because the basis is constant', () => {
    for (const t of [0, 0.7, 2.3, 4]) {
      const [xd, yd, zd] = helixVelocity(t);
      const v = add(add(scale(xd, E_X), scale(yd, E_Y)), scale(zd, E_Z));
      expect(vecApproxEqual(numericVelocity(helix, t), v, 1e-6)).toBe(true);
    }
  });
  it('helix: ṡ = |v| is constant although v changes direction (misconception "ṡ const ⇒ v const")', () => {
    const s = norm(helixVelocity(0));
    for (const t of [0.5, 1.7, 3.1]) expect(norm(helixVelocity(t))).toBeCloseTo(s, 12);
    expect(vecApproxEqual(helixVelocity(0), helixVelocity(Math.PI))).toBe(false);
  });
  it('v is tangent to the trajectory: v ⟂ the radius of the helix circle (no radial component)', () => {
    for (const t of [0.3, 2]) {
      const r = helix(t), v = helixVelocity(t);
      expect(r[0] * v[0] + r[1] * v[1]).toBeCloseTo(0, 12);
    }
  });
});

describe('Beispiel p. 10 as drawn (a = 0.5, b = 0.6)', () => {
  it('v = (a, a, 2ba²t), ṡ = a√(2 + 4b²a²t²), τ = v/ṡ is a unit vector', () => {
    for (const tt of [0, 1, 2.5]) {
      expect(vecApproxEqual(numericVelocity(ex10, tt), ex10v(tt), 1e-6)).toBe(true);
      const s = norm(ex10v(tt));
      expect(s).toBeCloseTo(EX10.a * Math.sqrt(2 + 4 * EX10.b ** 2 * EX10.a ** 2 * tt * tt), 12);
      expect(norm(scale(1 / s, ex10v(tt)))).toBeCloseTo(1, 12);
    }
  });
  it('at t = 0 the point moves horizontally along the diagonal: τ = (1, 1, 0)/√2', () => {
    const v0 = ex10v(0), s = norm(v0);
    expect(v0[2]).toBe(0);
    expect(v0[0] / s).toBeCloseTo(Math.SQRT1_2, 12);
  });
});
