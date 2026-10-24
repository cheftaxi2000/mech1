import { describe, expect, it } from 'vitest';
import { MOLAR_VOLUME_STP, STP } from './gas';
import { LAW_DEFS, RANGES, START, curve, lawConstant, lawConstantClosed, lawState, niceMax, niceStep, type LawId } from './lawExplorer';

const LAWS = Object.keys(LAW_DEFS) as LawId[];

describe('gas-law explorer maths', () => {
  it('every law keeps its two fixed variables and changes the free one; the fourth follows', () => {
    for (const law of LAWS) {
      const d = LAW_DEFS[law];
      expect(new Set([d.free, d.follows, ...d.fixed]).size).toBe(4);
      const a = lawState(law, START), b = lawState(law, { ...START, [d.free]: START[d.free] * 1.5 });
      for (const k of d.fixed) expect(b[k]).toBe(a[k]);
      expect(b[d.follows]).not.toBeCloseTo(a[d.follows], 6);
    }
  });
  it('the constant of each law does not change along its curve (slides 14–16, 19)', () => {
    for (const law of LAWS) {
      const d = LAW_DEFS[law], r = RANGES[d.free];
      const consts = [r.min, (r.min + r.max) / 2, r.max].map((x) => lawConstant(law, lawState(law, { ...START, [d.free]: x })));
      expect(consts[1]).toBeCloseTo(consts[0], 9); expect(consts[2]).toBeCloseTo(consts[0], 9);
      expect(consts[0]).toBeCloseTo(lawConstantClosed(law, START), 9);
    }
  });
  it('Boyle: halving V doubles P; Charles: V is zero at 0 K and linear; Avogadro: V/n = 22.41 L/mol at STP', () => {
    const P = curve('boyle', START);
    expect(P(3) / P(6)).toBeCloseTo(2, 12);
    const V = curve('charles', START);
    expect(V(0)).toBe(0);
    expect(V(200) / V(100)).toBeCloseTo(2, 12);
    const Vn = curve('avogadro', { ...START, T: STP.T, P: STP.P_atm });
    expect(Vn(1)).toBeCloseTo(MOLAR_VOLUME_STP, 2);
    expect(Vn(2) / Vn(1)).toBeCloseTo(2, 12);
  });
  it('the point of the state lies on the curve', () => {
    for (const law of LAWS) {
      const d = LAW_DEFS[law], s = lawState(law, START);
      expect(curve(law, s)(s[d.free])).toBeCloseTo(s[d.follows], 9);
    }
  });
  it('nice axis steps and maxima', () => {
    expect(niceStep(20)).toBe(5); expect(niceStep(8)).toBe(2); expect(niceStep(0.5)).toBe(0.1); expect(niceStep(600)).toBe(100);
    expect(niceMax(6.1)).toBeGreaterThanOrEqual(6.1 * 1.05 - 1e-9);
    expect(niceMax(20.4)).toBe(25);
    for (const v of [0.07, 0.9, 3.3, 14, 140, 1500]) {
      const s = niceStep(v * 1.05), m = niceMax(v);
      expect(m).toBeGreaterThan(v); expect(m / s).toBeLessThanOrEqual(8); expect(Math.abs(m / s - Math.round(m / s))).toBeLessThan(1e-9);
    }
  });
});
