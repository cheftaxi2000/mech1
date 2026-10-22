import { describe, expect, it } from 'vitest';
import {
  EXPLORER, FRACS, KB, MB, SLIDE, degree, degreeLimit, divided, entryAlt, entryIndex, entryMono, fracValue, lead,
  monotone, polyEval, range, rootSeq, rootTrick, side, terms,
} from './folgen';

describe('ε-strip explorer', () => {
  it('entry index equals the closed form for the two convergent presets', () => {
    for (const eps of [1, 0.6, 0.5, 0.3, 0.25, 0.2, 0.1, 0.07, 0.05]) {
      expect(entryIndex(EXPLORER.mono.a, 1, eps, 5000, 1, EXPLORER.mono.dist)).toBe(entryMono(eps));
      expect(entryIndex(EXPLORER.alt.a, 1, eps, 5000, 1, EXPLORER.alt.dist)).toBe(entryAlt(eps));
    }
    expect(entryMono(0.05)).toBe(20);
    expect(entryAlt(0.05)).toBe(21); // both fit in the drawn 30 terms
  });
  it('the distance closed forms are right and decrease (so «from N on» holds for every n)', () => {
    for (const k of ['mono', 'alt'] as const) {
      const s = EXPLORER[k];
      for (let n = 1; n < 200; n++) {
        expect(Math.abs(s.a(n) - 1)).toBeCloseTo(s.dist!(n), 12);
        expect(s.dist!(n + 1)).toBeLessThan(s.dist!(n));
      }
    }
  });
  it('bounds inf/sup as stated', () => {
    expect(range(EXPLORER.mono.a, 1, 5000)[0]).toBe(0.5);
    expect(range(EXPLORER.mono.a, 1, 5000)[1]).toBeLessThan(1);
    expect(range(EXPLORER.alt.a, 1, 5000)).toEqual([0, 1.5]);
    expect(range(EXPLORER.osc.a, 1, 50)).toEqual([-1, 1]);
    expect(range(EXPLORER.grow.a, 1, 1000)[1]).toBe(100); // grows beyond every bound
  });
  it('oscillating (−1)^n: for every candidate L and ε ≤ 1 terms keep leaving the strip', () => {
    for (let L = -1.5; L <= 1.5; L += 0.05) for (const eps of [1, 0.5, 0.1]) expect(entryIndex(EXPLORER.osc.a, L, eps, 1000)).toBeNull();
  });
  it('monotonicity: mono increasing, alt and osc not monotone (konvergent ⇏ monoton)', () => {
    expect(monotone(EXPLORER.mono.a, 1, 100)).toBe('inc');
    expect(monotone(EXPLORER.alt.a, 1, 100)).toBe('none');
    expect(monotone(EXPLORER.osc.a, 1, 100)).toBe('none');
    expect(monotone(EXPLORER.grow.a, 1, 100)).toBe('inc');
  });
});

describe('animation data', () => {
  it('konvergent ⇒ beschränkt: N = 4, the bound [0; 1,5] contains every term', () => {
    expect(KB.N).toBe(4);
    expect(terms(KB.a, 1, 3).map((p) => p[1])).toEqual([0, 1.5, 1 - 1 / 3]);
    expect(KB.lo).toBe(0); expect(KB.hi).toBe(1.5);
    for (let n = 1; n < 5000; n++) { expect(KB.a(n)).toBeGreaterThanOrEqual(KB.lo); expect(KB.a(n)).toBeLessThanOrEqual(KB.hi); }
    for (let n = KB.N; n < 5000; n++) expect(Math.abs(KB.a(n) - 1)).toBeLessThan(KB.eps);
  });
  it('monoton & beschränkt ⇒ konvergent: 1 is the smallest bound, a_7 is the first term above 0,85', () => {
    expect(MB.N).toBe(7);
    expect(MB.a(6)).toBeLessThanOrEqual(MB.S - MB.eps);
    expect(MB.a(7)).toBeGreaterThan(MB.S - MB.eps);
    for (let n = 1; n < 5000; n++) { expect(MB.a(n)).toBeLessThan(MB.S); expect(MB.a(n + 1)).toBeGreaterThan(MB.a(n)); }
    // nothing smaller than 1 is a bound: for every b < 1 a term exceeds it
    for (const b of [0.9, 0.99, 0.999]) expect(terms(MB.a, 1, 5000).some((p) => p[1] > b)).toBe(true);
  });
  it('the slide-like plot: blue grows, green settles, magenta stays in a band', () => {
    expect(SLIDE.div(12)).toBeGreaterThan(3.9);
    expect(Math.abs(SLIDE.conv(14) - 2.6)).toBeLessThan(0.05);
    expect(SLIDE.conv(1)).toBeLessThan(1);
    expect(range(SLIDE.osc, 1, 14)[0]).toBeGreaterThan(-0.81);
    expect(range(SLIDE.osc, 1, 14)[1]).toBeLessThan(0.31);
  });
});

describe('degree rule (U01 p. 11)', () => {
  it('the three slide examples and A-004', () => {
    expect(degreeLimit(FRACS.gt.P, FRACS.gt.Q)).toBe(Infinity);
    expect(degreeLimit(FRACS.eq.P, FRACS.eq.Q)).toBe(7 / 4);
    expect(degreeLimit(FRACS.lt.P, FRACS.lt.Q)).toBe(0);
    expect(degreeLimit(FRACS.neg.P, FRACS.neg.Q)).toBe(-Infinity);
    expect(degree(FRACS.lt.Q)).toBe(6); expect(lead(FRACS.neg.P)).toBe(-2);
  });
  it('numerically: values approach the limits (a check, not a proof)', () => {
    expect(fracValue('eq', 1e6)).toBeCloseTo(1.75, 5);
    expect(Math.abs(fracValue('lt', 1e4))).toBeLessThan(1e-4);
    expect(fracValue('gt', 1e5)).toBeGreaterThan(4e5);
    expect(fracValue('neg', 1e5)).toBeLessThan(-1.9e5);
  });
  it('dividing by the highest power of the denominator does not change the value', () => {
    for (const k of ['gt', 'eq', 'lt', 'neg'] as const) {
      const [P, Q] = divided(FRACS[k].P, FRACS[k].Q);
      for (const n of [3, 7, 20]) expect(polyEval(P, n) / polyEval(Q, n)).toBeCloseTo(fracValue(k, n), 9);
      // the denominator tends to its leading coefficient
      expect(polyEval(Q, 1e6)).toBeCloseTo(lead(FRACS[k].Q), 5);
    }
  });
  it('the slide example (5n³+3n+7)/(n²−2n) is undefined at n = 2', () => {
    expect(polyEval(FRACS.gt.Q, 2)).toBe(0);
    expect(FRACS.gt.n0).toBe(3);
  });
});

describe('root trick (U01 p. 11)', () => {
  it('n(√(1+1/n) − 1) = 1/(√(1+1/n) + 1) for every n (3rd binomial formula)', () => {
    for (const n of [1, 2, 5, 10, 100, 1000]) expect(rootSeq(n)).toBeCloseTo(rootTrick(n), 10);
  });
  it('multiplied out it is √(n² + n) − n («∞ − ∞»)', () => {
    for (const n of [1, 2, 5, 10, 100]) expect(rootSeq(n)).toBeCloseTo(Math.sqrt(n * n + n) - n, 10);
    expect(rootSeq(2)).toBeCloseTo(0.4495, 4); expect(rootSeq(50)).toBeCloseTo(0.4975, 4);
  });
  it('limit 1/2', () => {
    expect(rootTrick(1e9)).toBeCloseTo(0.5, 8);
    expect(rootTrick(2)).toBeCloseTo(1 / (Math.sqrt(1.5) + 1), 12);
  });
  it('square picture: the L-shaped extra area (s−1)(s+1) equals 1/n', () => {
    for (const n of [1, 2, 4, 10]) { const s = side(n); expect((s - 1) * (s + 1)).toBeCloseTo(1 / n, 12); expect(s * s - 1).toBeCloseTo(1 / n, 12); }
  });
});
