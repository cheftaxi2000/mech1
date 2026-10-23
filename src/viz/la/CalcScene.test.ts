import { describe, expect, it } from 'vitest';
import { addM2, scalarScene, scaleM2, sumScene, windowFor } from './CalcScene';

describe('sum scene (slide 24)', () => {
  const A: [[number, number], [number, number]] = [[1, 1], [0, 2]], B: [[number, number], [number, number]] = [[2, 0], [-1, 0]];
  it('slide numbers: Av = (2,2), Bv = (2,−1), (A+B)v = (4,1)', () => {
    const s = sumScene(A, B, [1, 1]);
    expect(addM2(A, B)).toEqual([[3, 1], [-1, 2]]);
    expect(s.Av).toEqual([2, 2]);
    expect(s.Bv).toEqual([2, -1]);
    expect(s.Cv).toEqual([4, 1]);
    expect(s.tipAvBv).toEqual(s.Cv);
  });
  it('(A+B)v = Av + Bv for many v (numeric check)', () => {
    for (let k = 0; k < 40; k++) {
      const v: [number, number] = [Math.sin(k) * 3, Math.cos(2 * k) * 3];
      const s = sumScene(A, B, v);
      expect(s.Cv[0]).toBeCloseTo(s.Av[0] + s.Bv[0], 9);
      expect(s.Cv[1]).toBeCloseTo(s.Av[1] + s.Bv[1], 9);
    }
  });
  it('the window contains every drawn point', () => {
    const s = sumScene(A, B, [1, 1]);
    for (const p of [s.v, s.Av, s.Bv, s.Cv]) expect(Math.max(Math.abs(p[0]), Math.abs(p[1]))).toBeLessThan(s.r);
    expect(windowFor([[0, 0]])).toBe(3);
  });
});

describe('scalar scene (slide 25)', () => {
  const A: [[number, number], [number, number]] = [[1, 1], [0, 2]];
  it('λA scales Av by λ and the unit-square image around 0', () => {
    const s = scalarScene(A, 2, [1, 2]);
    expect(s.Av).toEqual([3, 4]);
    expect(s.lAv).toEqual([6, 8]);
    expect(s.L).toEqual(scaleM2(2, A));
    s.squareL.forEach((p, i) => { expect(p[0]).toBeCloseTo(2 * s.squareA[i][0]); expect(p[1]).toBeCloseTo(2 * s.squareA[i][1]); });
  });
  it('λ = 0 collapses everything to the origin, λ < 0 turns the picture around', () => {
    expect(scalarScene(A, 0, [1, 2]).lAv).toEqual([0, 0]);
    expect(scalarScene(A, -1, [1, 2]).lAv).toEqual([-3, -4]);
  });
  it('window contains all points', () => {
    const s = scalarScene(A, 3, [1, 2]);
    for (const p of [s.lAv, ...s.squareL]) expect(Math.max(Math.abs(p[0]), Math.abs(p[1]))).toBeLessThan(s.r);
  });
});
