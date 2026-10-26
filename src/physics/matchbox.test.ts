import { describe, expect, it } from 'vitest';
import { attackPoint, inertia, offsetFromLine, simulateBox, stateAt, torqueZ, type BoxSpec, type P2 } from './matchbox';

const box: BoxSpec = { w: 2.2, h: 1.2, m: 1 };
const F: P2 = [0.8, 0];
const T = 1.5;

describe('matchbox supplement (rigid rectangle on a smooth table)', () => {
  it('inertia of a uniform rectangle: m (w² + h²) / 12', () => {
    expect(inertia(box)).toBeCloseTo((2.2 ** 2 + 1.2 ** 2) / 12, 12);
  });
  it('pull through the centre of mass: pure sliding, x = ½ (F/m) t², no turning', () => {
    const s = simulateBox(box, [0, 0], F, T)[240];
    expect(s.x).toBeCloseTo(0.5 * 0.8 * T * T, 9);
    expect(s.th).toBeCloseTo(0, 12);
    expect(s.y).toBeCloseTo(0, 12);
  });
  it('the centre of mass moves identically wherever the force is applied (F = m a), only the turning differs', () => {
    const ref = simulateBox(box, [0, 0], F, T)[240];
    for (const r of [[1.1, 0.6], [-1.1, 0.6], [0, 0.6], [0.5, -0.3], [1.1, 0]] as P2[]) {
      const s = simulateBox(box, r, F, T)[240];
      expect(s.x, `r=${r}`).toBeCloseTo(ref.x, 9);
      expect(s.y, `r=${r}`).toBeCloseTo(ref.y, 9);
    }
  });
  it('a point on the line of action through the centre (r ∥ F) does not turn the body', () => {
    expect(simulateBox(box, [1.1, 0], F, T)[240].th).toBeCloseTo(0, 12);
    expect(offsetFromLine([1.1, 0], F)).toBe(0);
  });
  it('the turning sense follows the sign of (r × F)_z: above the line of action → clockwise, below → counter-clockwise', () => {
    const up = simulateBox(box, [0.5, 0.6], F, T)[240].th, down = simulateBox(box, [0.5, -0.6], F, T)[240].th;
    expect(torqueZ([0.5, 0.6], 0, F)).toBeLessThan(0);
    expect(up).toBeLessThan(0);
    expect(down).toBeGreaterThan(0);
    expect(down).toBeCloseTo(-up, 9); // mirror image
  });
  it('how much it turns depends on the distance of A from the line through the centre of mass along F, not on where along that line', () => {
    const th = (r: P2) => Math.abs(simulateBox(box, r, F, T)[240].th);
    expect(th([0, 0.6])).toBeGreaterThan(th([0, 0.3]));
    expect(th([0, 0.3])).toBeGreaterThan(0);
    // the start value of the angular acceleration is the same for every point on one parallel to F
    expect(torqueZ([1.1, 0.6], 0, F)).toBeCloseTo(torqueZ([-1.1, 0.6], 0, F), 12);
    expect(offsetFromLine([1.1, 0.6], F)).toBeCloseTo(0.6, 12);
  });
  it('energy: the work F · (displacement of A) equals the kinetic energy (translation + rotation)', () => {
    const r: P2 = [1.1, 0.6];
    const s = simulateBox(box, r, F, T, 960)[960];
    const A1 = attackPoint(s, r), A0 = attackPoint({ x: 0, y: 0, th: 0 }, r);
    const W = F[0] * (A1[0] - A0[0]) + F[1] * (A1[1] - A0[1]);
    const Ekin = 0.5 * box.m * (s.vx ** 2 + s.vy ** 2) + 0.5 * inertia(box) * s.om ** 2;
    expect(W).toBeCloseTo(Ekin, 6);
  });
  it('stateAt interpolates the samples', () => {
    const samples = simulateBox(box, [0, 0], F, T);
    expect(stateAt(samples, T, 0).x).toBe(0);
    expect(stateAt(samples, T, T).x).toBeCloseTo(samples[240].x, 12);
    expect(stateAt(samples, T, T / 2).x).toBeCloseTo(0.5 * 0.8 * (T / 2) ** 2, 4);
  });
});
