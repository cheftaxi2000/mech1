import { describe, expect, it } from 'vitest';
import { rigidVelocity, sdpgDefect } from './rigid';
import { add, cross, dot, norm, scale, sub, type Vec3 } from './vec';
import { OMEGA as SCENE_OMEGA, SA, SVM, SVN, projM, projN } from '../viz/anim/sdpgScene';
import { LADDER, SDPG_DEMO_UNIT, ladderFrame, sdpgDemoFrame } from '../viz/RigidFigures';

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
  it('the drawn animation (sdpgScene): v_N = v_M + ω × a, equal projections onto MN, both clearly visible', () => {
    const vM: Vec3 = [SVM[0], SVM[1], 0], a: Vec3 = [SA[0], SA[1], 0];
    const vN = add(vM, cross([0, 0, SCENE_OMEGA], a));
    expect(vN[0]).toBeCloseTo(SVN[0], 12); expect(vN[1]).toBeCloseTo(SVN[1], 12);
    const u = scale(1 / norm(a), a);
    expect(dot(vM, u)).toBeCloseTo(projM, 12);
    expect(dot(vN, u)).toBeCloseTo(projN, 12);
    expect(projM).toBeCloseTo(projN, 12);
    expect(projM).toBeGreaterThan(30); // the shadows are long enough to see (px)
  });
  it('the interactive SdpgDemo: equal SIGNED projections for every direction and turning; different if the body stretches', () => {
    for (const dir of [-180, -150, -35, 0, 90, 150]) for (const w of [-1, -0.3, 0, 0.5, 1]) {
      const f = sdpgDemoFrame(dir, w, false);
      expect(f.pM).toBeCloseTo(f.pN, 9);
      expect(f.pM).toBeCloseTo(dot([f.vM[0], f.vM[1], 0], [f.u[0], f.u[1], 0]), 12);
      expect(Math.abs(sdpgDemoFrame(dir, w, true).pN - f.pN)).toBeGreaterThan(10);
    }
    // a shadow pointing back from N to M is negative (this used to be shown as |v'_M| < 0)
    expect(sdpgDemoFrame(150, 0.5, false).pM).toBeLessThan(0);
    expect(sdpgDemoFrame(-35, 0.5, false).pM / SDPG_DEMO_UNIT).toBeCloseTo(0.68, 2); // default readout 0,68
  });
  it('the LadderDemo drawing: both projections are v_H cos α long and sit beside the ladder, parallel to it', () => {
    for (const al of [15, 35, 45, 60, 78]) {
      const f = ladderFrame(al), len = (p: [number, number][]) => Math.hypot(p[1][0] - p[0][0], p[1][1] - p[0][1]);
      expect(len(f.projA)).toBeCloseTo(LADDER.VH * Math.cos(f.a), 9);
      expect(len(f.projB)).toBeCloseTo(LADDER.VH * Math.cos(f.a), 9);
      expect(f.vv * Math.sin(f.a)).toBeCloseTo(LADDER.VH * Math.cos(f.a), 9); // v_V sin α = v_H cos α
      // the drop line from the tip of v_A is perpendicular to AB and ends on the shifted projection
      const d = [f.projA[1][0] - f.tipA[0], f.projA[1][1] - f.tipA[1]];
      expect(d[0] * f.u[0] + d[1] * f.u[1]).toBeCloseTo(0, 9);
      // shifted off the ladder line by OFF px
      const s = [f.projA[0][0] - f.A[0], f.projA[0][1] - f.A[1]];
      expect(Math.abs(s[0] * f.u[1] - s[1] * f.u[0])).toBeCloseTo(LADDER.OFF, 9);
    }
    expect(1 / Math.tan(45 * Math.PI / 180)).toBeCloseTo(1, 12); // α = 45°: both ends equally fast
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
