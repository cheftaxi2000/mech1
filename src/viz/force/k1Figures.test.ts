import { describe, expect, it } from 'vitest';
import { resultant } from '../../physics/force';
import { FIG42 } from './resultantScene';
import { FIG41 } from './K1Fig41';
import { fmtForce, fmtMass, pct } from './K1Newton';

describe('K1 figure data', () => {
  it('Fig. 4.1: five points along a 4 m bar, F₂ and F₃ end at their point, F₁, F₄, F₅ start there (as drawn in the lecture)', () => {
    expect(FIG41).toHaveLength(5);
    expect(FIG41.map((i) => i.headAtA)).toEqual([false, true, true, false, false]);
    const xs = FIG41.map((i) => i.x);
    expect([...xs].sort((a, b) => a - b)).toEqual(xs); // A₁ … A₅ from left to right
    expect(xs[0]).toBeGreaterThanOrEqual(0); expect(xs[4]).toBeLessThanOrEqual(4);
    // directions read off the page: F₁ up, F₂ down-left, F₃ down, F₄ down-left, F₅ up-right
    const [F1, F2, F3, F4, F5] = FIG41.map((i) => i.F);
    expect(F1[1]).toBeGreaterThan(0); expect(F2[0]).toBeLessThan(0); expect(F2[1]).toBeLessThan(0);
    expect(F3[0]).toBe(0); expect(F3[1]).toBeLessThan(0);
    expect(F4[0]).toBeLessThan(0); expect(F4[1]).toBeLessThan(0);
    expect(F5[0]).toBeGreaterThan(0); expect(F5[1]).toBeGreaterThan(0);
  });
  it('Fig. 4.2 numbers: the table of the explorer adds up (force.ts): R = (25; 45) N, |R| = 51.5 N', () => {
    const R = resultant(FIG42.map((f) => ({ F: [f[0], f[1], 0] as const })));
    expect(R).toEqual([25, 45, 0]);
    expect(Math.hypot(R[0], R[1])).toBeCloseTo(51.48, 2);
  });
  it('log axis: 1 mN at 0 %, 1 MN at 100 %, 1 N one third', () => {
    expect(pct(1e-3)).toBeCloseTo(0, 9); expect(pct(1e6)).toBeCloseTo(100, 9); expect(pct(1)).toBeCloseTo(100 / 3, 9);
    expect(pct(1e-9)).toBe(0); expect(pct(1e12)).toBe(100); // clamped
  });
  it('number formats: decimal comma in German, units chosen so the number stays readable', () => {
    expect(fmtForce(0.981, 'de')).toBe('0,98 N'); expect(fmtForce(0.981, 'en')).toBe('0.98 N');
    expect(fmtForce(11772, 'de')).toBe('12 kN'); expect(fmtForce(392400, 'de')).toBe('392 kN'); expect(fmtForce(1.5e6, 'en')).toBe('1.5 MN');
    expect(fmtMass(0.1, 'de')).toBe('100 g'); expect(fmtMass(0.001, 'de')).toBe('1 g'); expect(fmtMass(2.5, 'de')).toBe('2,5 kg'); expect(fmtMass(40000, 'en')).toBe('40 t');
  });
});
