import { describe, expect, it } from 'vitest';
import { numericVelocity } from './kinematics';
import { helix, helixVelocity, lineX, lineXdot } from './velocity';
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
