import { describe, expect, it } from 'vitest';
import { contactVelocity, momentaryCentre, rimPoint, slip, wheelVelocity } from './rolling';
import { rigidVelocity } from './rigid';

const R = 0.8;

describe('rolling and sliding (p. 20)', () => {
  it('the wheel velocities are a rigid field v = v_C + ω × CP (ω = −Ω e_z)', () => {
    for (const [vc, Om] of [[1, 1.25], [0.4, -0.7], [1.2, 0]]) for (const p of [[0.3, -0.5], [-0.8, 0], [0, R]] as [number, number][]) {
      const v = wheelVelocity(vc, Om, p), w = rigidVelocity([vc, 0, 0], [0, 0, -Om], [0, 0, 0], [p[0], p[1], 0]);
      expect(v[0]).toBeCloseTo(w[0], 12); expect(v[1]).toBeCloseTo(w[1], 12); expect(w[2]).toBe(0);
    }
  });
  it('rolling on ground at rest: contact point at rest, centre v, top 2v', () => {
    const vc = 1.3, Om = vc / R;
    expect(contactVelocity(vc, Om, R)).toBeCloseTo(0, 12);
    expect(wheelVelocity(vc, Om, [0, -R])).toEqual([expect.closeTo(0, 12), expect.closeTo(0, 12)]);
    expect(wheelVelocity(vc, Om, [0, R])[0]).toBeCloseTo(2 * vc, 12);
  });
  it('rolling = momentary rotation about the contact point: v = ω × KP for every point', () => {
    const vc = 0.9, Om = vc / R, K: [number, number] = [0, -R];
    for (const p of [[0.5, 0.2], [-0.6, 0.6], [0, 0], [0.8, -0.1]] as [number, number][]) {
      const q: [number, number] = [p[0] - K[0], p[1] - K[1]];
      const v = wheelVelocity(vc, Om, p);
      expect(v[0]).toBeCloseTo(Om * q[1], 12); expect(v[1]).toBeCloseTo(-Om * q[0], 12);
    }
    expect(momentaryCentre(vc, Om)).toEqual([0, expect.closeTo(-R, 12)]);
  });
  it('the rim point’s path (cycloid) has velocity 0 exactly when it touches the ground', () => {
    const vc = 1, Om = vc / R, h = 1e-6;
    const tTouch = Math.PI / Om; // β = π: the point starting at the top reaches the bottom
    const p0 = rimPoint(vc, Om, R, 0, tTouch - h), p1 = rimPoint(vc, Om, R, 0, tTouch + h);
    expect(Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / (2 * h)).toBeLessThan(1e-5);
    expect(rimPoint(vc, Om, R, 0, tTouch)[1]).toBeCloseTo(-R, 12);
  });
  it('contact conditions: rolling ⟺ equal tangential velocities (belt moving with u)', () => {
    expect(slip(1, 1.5 / R, R, -0.5)).toBeCloseTo(0, 12); // wheel rolls on a belt running backwards
    expect(slip(1, 0, R, 0)).toBe(1); // locked wheel: slides forward
    expect(slip(0.2, 2 / R, R, 0)).toBeCloseTo(-1.8, 12); // spinning wheel: contact point slides backwards
  });
  it('sliding: the momentary centre is not the contact point (locked wheel: pure translation)', () => {
    expect(momentaryCentre(1, 0)).toBeNull();
    expect(momentaryCentre(0.2, 2 / R)![1]).toBeCloseTo(-0.1 * R, 12); // spinning: inside the wheel
  });
});
