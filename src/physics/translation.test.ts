import { describe, expect, it } from 'vitest';
import { crankA, crankB, rodOmega, rodPoint, rodVelocity } from './translation';

const D = (f: (t: number) => [number, number], t: number): [number, number] => {
  const h = 1e-6, p = f(t + h), q = f(t - h);
  return [(p[0] - q[0]) / (2 * h), (p[1] - q[1]) / (2 * h)];
};

describe('Translation (lecture p. 13)', () => {
  it('a = r_N − r_M constant ⇒ v_N = v_M, and N’s path is M’s path shifted by a (congruent)', () => {
    const rM = (t: number): [number, number] => [Math.cos(t) + 0.3 * t, Math.sin(2 * t)];
    const a: [number, number] = [0.7, -0.4];
    const rN = (t: number): [number, number] => [rM(t)[0] + a[0], rM(t)[1] + a[1]];
    for (const t of [0.2, 1.1, 2.7]) {
      const vM = D(rM, t), vN = D(rN, t);
      expect(vN[0]).toBeCloseTo(vM[0], 6); expect(vN[1]).toBeCloseTo(vM[1], 6);
    }
  });
  it('circular translation (Ferris-wheel gondola): every point on a circle of the same radius, centres shifted by a; equal velocities', () => {
    const R = 2, c: [number, number] = [0, 0], a: [number, number] = [0.3, -0.5];
    const rM = (t: number): [number, number] => [c[0] + R * Math.cos(t), c[1] + R * Math.sin(t)];
    const rN = (t: number): [number, number] => [rM(t)[0] + a[0], rM(t)[1] + a[1]];
    for (const t of [0.4, 2]) {
      expect(Math.hypot(rN(t)[0] - a[0], rN(t)[1] - a[1])).toBeCloseTo(R, 12); // N on a circle of radius R about c + a
      expect(D(rN, t)[0]).toBeCloseTo(D(rM, t)[0], 6);
    }
  });
  it('rotation is not translation: a turns, the points have different speeds', () => {
    const rM = (t: number): [number, number] => [Math.cos(t), Math.sin(t)], rN = (t: number): [number, number] => [2 * Math.cos(t), 2 * Math.sin(t)];
    expect(Math.hypot(...D(rN, 0.5))).toBeCloseTo(2 * Math.hypot(...D(rM, 0.5)), 6);
  });
});

describe('momentane Translation (lecture p. 14) — slider-crank supplement', () => {
  const r = 1, l = 2.5, w = 1.3;
  it('the rod points are consistent with the geometry (B on the x-axis, |AB| = l)', () => {
    for (const th of [0.3, 1.2, 2.8]) {
      const A = crankA(th, r), B = crankB(th, r, l);
      expect(B[1]).toBe(0); expect(Math.hypot(B[0] - A[0], B[1] - A[1])).toBeCloseTo(l, 12);
    }
  });
  it('at θ = 90° the rod has ω = 0 and all its points have the same velocity (−ωr, 0): momentary translation', () => {
    const th = Math.PI / 2;
    expect(rodOmega(th, r, l, w)).toBeCloseTo(0, 12);
    for (const k of [0, 0.5, 1]) { const v = rodVelocity(th, r, l, k, w); expect(v[0]).toBeCloseTo(-w * r, 5); expect(v[1]).toBeCloseTo(0, 5); }
  });
  it('a moment later the velocities differ again (only momentary)', () => {
    const th = Math.PI / 2 + 0.3;
    const vA = rodVelocity(th, r, l, 0, w), vB = rodVelocity(th, r, l, 1, w);
    expect(Math.hypot(vA[0] - vB[0], vA[1] - vB[1])).toBeGreaterThan(0.1);
    expect(Math.abs(rodOmega(th, r, l, w))).toBeGreaterThan(0.05);
  });
  it('rod ω formula agrees with differentiating the rod angle', () => {
    const beta = (th: number) => Math.atan2(-(rodPoint(th, r, l, 1)[1] - rodPoint(th, r, l, 0)[1]), rodPoint(th, r, l, 1)[0] - rodPoint(th, r, l, 0)[0]);
    const th = 0.8, h = 1e-6;
    expect(((beta(th + h) - beta(th - h)) / (2 * h)) * w).toBeCloseTo(rodOmega(th, r, l, w), 5);
  });
  it('bowl figure (R-016): a block following a bowl of radius R turns about the centre; at the bottom inner points are slower by (R − h)/R', () => {
    const R = 3, h = 0.5, W = 0.7;
    expect((W * (R - h)) / (W * R)).toBeCloseTo((R - h) / R, 12);
    expect((R - h) / R).toBeLessThan(1);
  });
});
