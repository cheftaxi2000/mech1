import { describe, expect, it } from 'vitest';
import { PD, PV, phiFromA, polodeFrame, toWorld } from './polodeGeom';

const inside = (p: readonly [number, number], pad = 0) => p[0] >= PV[0] + pad && p[0] <= PV[2] - pad && p[1] >= PV[1] + pad && p[1] <= PV[3] - pad;

describe('polodeFrame', () => {
  it('everything drawn stays inside the viewBox for every angle and every point of the ladder', () => {
    for (let k = 0; k <= 10; k++) for (const s of [0, 0.25, 0.5, 0.75, 1]) {
      const phi = PD.PHI_MIN + ((PD.PHI_MAX - PD.PHI_MIN) * k) / 10, f = polodeFrame(phi, s);
      for (const p of [f.A, f.B, f.C, f.M, f.Z, f.P, ...f.fixedAll, ...f.movingAll, ...f.pathAll]) expect(inside(p, 4)).toBe(true);
    }
  });
  it('the two swept arcs are equally long (rolling without slipping) and end in Z', () => {
    const f = polodeFrame(0.6, 0.3);
    expect(f.arcFixed).toBeCloseTo(f.arcMoving, 12);
    const len = (ps: readonly (readonly [number, number])[]) => ps.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - ps[i][0], p[1] - ps[i][1]), 0) / PD.S;
    expect(len(f.fixedSwept)).toBeCloseTo(len(f.movingSwept), 3);
    const lastF = f.fixedSwept[f.fixedSwept.length - 1], lastM = f.movingSwept[f.movingSwept.length - 1];
    expect(lastF[0]).toBeCloseTo(f.Z[0], 9); expect(lastM[0]).toBeCloseTo(f.Z[0], 9); expect(lastM[1]).toBeCloseTo(f.Z[1], 9);
  });
  it('P lies on its path; for s = ½ the path is the circle about C', () => {
    const f = polodeFrame(0.9, 0.5);
    const w = toWorld(f.P);
    expect(Math.hypot(w[0], w[1])).toBeCloseTo(0.5, 12);
  });
  it('velocity of A is horizontal (to the left), of B vertical (down)', () => {
    const f = polodeFrame(0.9, 0.4);
    expect(f.vA[1]).toBeCloseTo(0, 12); expect(f.vA[0]).toBeLessThan(0);
    expect(f.vB[0]).toBeCloseTo(0, 12); expect(f.vB[1]).toBeGreaterThan(0);
  });
  it('phiFromA inverts the position of A and clamps', () => {
    expect(phiFromA(-Math.cos(0.7))).toBeCloseTo(0.7, 12);
    expect(phiFromA(-5)).toBe(PD.PHI_MIN); expect(phiFromA(0)).toBe(PD.PHI_MAX);
  });
});
