import { describe, expect, it } from 'vitest';
import { rigidVelocity, sdpgDefect } from './rigid';
import { add, cross, dot, norm, scale, sub, type Vec3 } from './vec';

describe('Starrer Körper & SdpG (lecture p. 12)', () => {
  it('rigid motion keeps |a| and the angle between a and b; a·b = const', () => {
    const rot = (p: Vec3, ang: number): Vec3 => [p[0] * Math.cos(ang) - p[1] * Math.sin(ang), p[0] * Math.sin(ang) + p[1] * Math.cos(ang), p[2]];
    const M: Vec3 = [0.2, 0.1, 0], M1: Vec3 = [1.3, 0.4, 0], M2: Vec3 = [0.5, -0.9, 0];
    const move = (p: Vec3, tt: number) => add(rot(p, 0.7 * tt), [0.3 * tt, -0.2 * tt, 0.1 * tt]);
    for (const tt of [0, 0.8, 2.1]) {
      const a = sub(move(M1, tt), move(M, tt)), b = sub(move(M2, tt), move(M, tt));
      expect(norm(a)).toBeCloseTo(norm(sub(M1, M)), 12);
      expect(dot(a, b)).toBeCloseTo(dot(sub(M1, M), sub(M2, M)), 12);
    }
  });
  it('proof step: ȧ = v_N − v_M is perpendicular to a (because a·a is constant)', () => {
    const vB: Vec3 = [0.4, -0.3, 0.2], w: Vec3 = [0.3, 0.8, -0.5], rB: Vec3 = [0, 0, 0];
    const rM: Vec3 = [1, 2, 0.5], rN: Vec3 = [-0.7, 0.4, 1.2];
    const vM = rigidVelocity(vB, w, rB, rM), vN = rigidVelocity(vB, w, rB, rN);
    expect(dot(sub(vN, vM), sub(rN, rM))).toBeCloseTo(0, 12);
    expect(sdpgDefect(rM, vM, rN, vN)).toBeCloseTo(0, 12);
  });
  it('the SdpG fails for a body that stretches (counterexample: v = k·r)', () => {
    const k = 0.5, rM: Vec3 = [1, 0, 0], rN: Vec3 = [3, 1, 0];
    expect(Math.abs(sdpgDefect(rM, scale(k, rM), rN, scale(k, rN)))).toBeGreaterThan(0.1);
  });
  it('demo figure numbers: v_M = (70, −60), ω = 0.6, a = (160, 40) give equal projections 53.3', () => {
    const vM: Vec3 = [70, -60, 0], a: Vec3 = [160, 40, 0], vN = add(vM, cross([0, 0, 0.6], a));
    const u = scale(1 / norm(a), a);
    expect(dot(vM, u)).toBeCloseTo(dot(vN, u), 12);
    expect(dot(vM, u)).toBeCloseTo(53.36, 1);
  });
  it('Leiter (p. 13): v_V = v_H cot α, and both projections onto AB equal v_H cos α', () => {
    for (const al of [0.3, 0.8, 1.2]) {
      const L = 2, vH = 1.5, AB: Vec3 = [L * Math.cos(al), L * Math.sin(al), 0];
      const vA: Vec3 = [vH, 0, 0], vB: Vec3 = [0, vH / Math.tan(al), 0];
      expect(dot(vA, AB)).toBeCloseTo(dot(vB, AB), 12);
      expect(dot(vA, scale(1 / L, AB))).toBeCloseTo(vH * Math.cos(al), 12);
    }
  });
});
