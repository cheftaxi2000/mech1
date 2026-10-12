import { describe, expect, it } from 'vitest';
import { MOTION, PTS } from '../viz/genGeom';
import { omegaComponent, omegaMismatch, placeAt, planarRestPoint, planarVelocity, planarVelocityVia, ridingView } from './general';
import { rigidVelocity } from './rigid';
import { type Vec3, norm, scale } from './vec';

describe('general motion in the plane (p. 22): translation of B plus turning about B', () => {
  it('Grundgleichung v_M = v_B + ω × BM equals the time derivative of the position', () => {
    const h = 1e-6;
    for (const t of [0, 1.3, 3.1]) for (const p of [PTS.M, PTS.C, [-20, 30] as const]) {
      const a = placeAt(MOTION, p, t + h), b = placeAt(MOTION, p, t - h), v = planarVelocity(MOTION, p, t);
      expect((a[0] - b[0]) / (2 * h)).toBeCloseTo(v[0], 5); expect((a[1] - b[1]) / (2 * h)).toBeCloseTo(v[1], 5);
    }
  });
  it('the same velocities with C as reference point and the same ω (ω does not depend on the reference point)', () => {
    for (const t of [0.4, 2.2]) for (const p of [PTS.M, PTS.B, [10, -15] as const]) {
      const a = planarVelocity(MOTION, p, t), b = planarVelocityVia(MOTION, PTS.C, p, t);
      expect(b[0]).toBeCloseTo(a[0], 10); expect(b[1]).toBeCloseTo(a[1], 10);
    }
  });
  it('riding along with B or with C: the plate turns by the same angle θ(t) − θ(0) about the riding point', () => {
    for (const c of [PTS.B, PTS.C]) for (const t of [1, 2.5]) {
      const r0 = ridingView(MOTION, c, PTS.M, 0), r1 = ridingView(MOTION, c, PTS.M, t);
      expect(Math.hypot(...r1)).toBeCloseTo(Math.hypot(...r0), 10); // M on a circle about the riding point
      const turned = Math.atan2(r1[1], r1[0]) - Math.atan2(r0[1], r0[0]);
      const d = MOTION.theta(t) - MOTION.theta(0);
      expect(Math.cos(turned)).toBeCloseTo(Math.cos(d), 10); expect(Math.sin(turned)).toBeCloseTo(Math.sin(d), 10);
    }
  });
  it('in the plane with ω ≠ 0 one point is at rest at each instant (supplement)', () => {
    const t = 1.7, B = MOTION.B(t), P = planarRestPoint(MOTION.vB(t), MOTION.omega(t), B)!;
    const w = MOTION.omega(t), vb = MOTION.vB(t);
    expect(vb[0] - w * (P[1] - B[1])).toBeCloseTo(0, 10); expect(vb[1] + w * (P[0] - B[0])).toBeCloseTo(0, 10);
    expect(planarRestPoint([1, 0], 0, [0, 0])).toBeNull();
  });
});

describe('ω is the same for all reference points (p. 22) and R-011', () => {
  const vB: Vec3 = [0.3, -0.2, 0.5], w: Vec3 = [0.4, 1.1, -0.6], rB: Vec3 = [0, 0, 0], rC: Vec3 = [1, 0.5, -0.3];
  it('with ω** = ω* the two descriptions agree for every M', () => {
    for (const M of [[2, 1, 0], [-1, 3, 2], [0.5, -0.5, 1]] as Vec3[]) expect(norm(omegaMismatch(vB, w, rB, rC, w, M))).toBeCloseTo(0, 12);
  });
  it('any other ω** fails for some M (CM in two non-parallel directions suffice)', () => {
    const w2: Vec3 = [0.4, 1.0, -0.6];
    const bad = ([[2, 1, 0], [-1, 3, 2]] as Vec3[]).map((M) => norm(omegaMismatch(vB, w, rB, rC, w2, M)));
    expect(Math.max(...bad)).toBeGreaterThan(0.05);
  });
  it('R-011: if all CM were parallel (a thin rod), ω** = ω* + k·CM would also fit — the argument needs two directions', () => {
    const dir: Vec3 = [1, 2, 2];
    const w2: Vec3 = [w[0] + 0.3 * dir[0], w[1] + 0.3 * dir[1], w[2] + 0.3 * dir[2]];
    for (const k of [0.5, 1, -2]) {
      const M: Vec3 = [rC[0] + k * dir[0], rC[1] + k * dir[1], rC[2] + k * dir[2]];
      expect(norm(omegaMismatch(vB, w, rB, rC, w2, M))).toBeCloseTo(0, 12);
    }
  });
  it('the component of v along ω is the same for every point (ω·v_M = ω·v_B)', () => {
    const k = omegaComponent(vB, w, rB, rB);
    for (const M of [[2, 1, 0], [-1, 3, 2]] as Vec3[]) expect(omegaComponent(vB, w, rB, M)).toBeCloseTo(k, 12);
  });
  it('cube p. 23: ω·v = −v²/L for every point, so no point of the cube is at rest', () => {
    const L = 2, v = 0.9, ww = scale(v / L, [1, 1, -1]);
    const P1: Vec3 = [L, L, 0], v1: Vec3 = [-v, 0, 0];
    for (const M of [[0, 0, 0], [L, 0, L], [0, L, L], [L / 2, L / 2, L / 2]] as Vec3[]) {
      expect(omegaComponent(v1, ww, P1, M)).toBeCloseTo((-v * v) / L, 12);
      expect(norm(rigidVelocity(v1, ww, P1, M))).toBeGreaterThan(0.1);
    }
  });
});
