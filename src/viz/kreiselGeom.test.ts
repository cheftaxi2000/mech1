import { describe, expect, it } from 'vitest';
import { conePoint, kreiselVelocity } from '../physics/kreisel';
import { cross, dot, norm } from '../physics/vec';
import { CONE, H, M0, MODES, coneBodyPoint, kreiselFrame } from './kreiselGeom';

const { GAM, L } = CONE;
describe('Kreiselung explorer: the cone rolling about its apex', () => {
  it('the rim lies at distance L from O; the lowest rim point touches the floor along the line of contact', () => {
    for (const a of [0, 1, 2, Math.PI]) expect(norm(coneBodyPoint(1, a))).toBeCloseTo(L, 12);
    for (const m of Object.values(MODES)) for (const phi of [0, 1, 3]) {
      const f = kreiselFrame(phi, m.k);
      // the line of contact is a generator of the cone: |OK| = L, angle γ with the cone's axis
      expect(dot(f.contact, f.e3) / L).toBeCloseTo(Math.cos(GAM), 12);
      // no rim point below the floor, the lowest one on it
      const zs = Array.from({ length: 721 }, (_, i) => f.P(coneBodyPoint(1, (2 * Math.PI * i) / 720))[2]);
      expect(Math.min(...zs)).toBeGreaterThan(-1e-12); expect(Math.min(...zs)).toBeLessThan(1e-4);
    }
  });
  it('M stays on the sphere of radius L in every mode', () => {
    for (const m of Object.values(MODES)) for (const phi of [0.3, 2, 5]) expect(norm(kreiselFrame(phi, m.k).P(M0))).toBeCloseTo(L, 12);
  });
  it('rolling: ω lies along the line of contact, the contact point is at rest', () => {
    for (const phi of [0.2, 1.7, 4]) {
      const f = kreiselFrame(phi, 1);
      expect(f.rolling).toBe(true);
      expect(norm(cross(f.axis, f.contact))).toBeCloseTo(0, 12);
    }
  });
  it('without spin μ is vertical; with fast spin μ is tilted; in both the line of contact slides', () => {
    const s = kreiselFrame(1, MODES.still.k);
    expect(Math.abs(s.axis[2])).toBeCloseTo(1, 12); expect(s.rolling).toBe(false);
    const q = kreiselFrame(1, MODES.fast.k);
    expect(Math.abs(q.axis[2])).toBeLessThan(0.5); expect(q.rolling).toBe(false);
  });
  it('μ always passes through O: points along ω are at rest in every mode', () => {
    for (const m of Object.values(MODES)) {
      const f = kreiselFrame(0.9, m.k);
      for (const s of [0.5, 1.5]) expect(norm(kreiselVelocity(f.omega, [s * f.axis[0], s * f.axis[1], s * f.axis[2]]))).toBeCloseTo(0, 12);
    }
  });
  it('supplement: when rolling, the centre C of the base has v_C = φ̇ L cos²γ and the top rim point 2 v_C', () => {
    const phi = 0.8, f = kreiselFrame(phi, 1); // φ̇ = 1
    const Cp = f.P(coneBodyPoint(1, 0, 0)), top = conePoint(GAM, phi, 0, coneBodyPoint(1, 0)); // the rim point on top right now
    const vC = norm(kreiselVelocity(f.omega, Cp)), vTop = norm(kreiselVelocity(f.omega, top));
    expect(vC).toBeCloseTo(L * Math.cos(GAM) ** 2, 12);
    expect(vTop).toBeCloseTo(2 * vC, 12);
    expect(norm(f.omega)).toBeCloseTo(1 / Math.tan(GAM), 12); // |ω| = φ̇ cot γ
    // C moves on a horizontal circle of radius H cos γ = L cos²γ with angular speed φ̇
    expect(Math.hypot(Cp[0], Cp[1])).toBeCloseTo(H * Math.cos(GAM), 12);
    expect(dot(kreiselVelocity(f.omega, Cp), [0, 0, 1])).toBeCloseTo(0, 12);
  });
});
