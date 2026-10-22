import { describe, expect, it } from 'vitest';
import {
  AR, EULER_GAMMA, GE, GI, arith, arithRec, arithSum, arithSum2, eFull, eSlide, gauss, geo, geoGap, geoLimit, geoRec,
  geoSum, group, groupLower, groupSum, harm, harmBound, harmExceed, sumBy,
} from './reihen';

describe('arithmetic (U01 p. 11)', () => {
  it('explicit = recursive (with the anchor a1)', () => {
    for (let n = 1; n <= 10; n++) expect(arithRec(4, 4, n)).toBe(arith(4, 4, n));
  });
  it('slide example 4 + 8 + … + 24 = 84, both formulas, and by adding', () => {
    expect(arith(AR.a1, AR.d, AR.n)).toBe(24);
    expect(arithSum(AR.a1, AR.d, AR.n)).toBe(84);
    expect(arithSum2(AR.a1, AR.d, AR.n)).toBe(84);
    expect(sumBy(AR.n, (k) => arith(AR.a1, AR.d, k))).toBe(84);
    // Gauss pairing: every pair a_k + a_(n+1−k) = a1 + an = 28
    for (let k = 1; k <= AR.n; k++) expect(arith(AR.a1, AR.d, k) + arith(AR.a1, AR.d, AR.n + 1 - k)).toBe(28);
  });
  it('1 + 2 + … + n = n(n+1)/2', () => {
    for (const n of [1, 2, 10, 100]) expect(gauss(n)).toBe(sumBy(n, (k) => k));
    expect(gauss(100)).toBe(5050);
  });
});

describe('geometric (U01 p. 12)', () => {
  it('explicit = recursive', () => { for (let n = 1; n <= 8; n++) expect(geoRec(3, 2, n)).toBe(geo(3, 2, n)); });
  it('slide example 3 + 6 + 12 + 24 = 45', () => {
    expect(geoSum(GE.a1, GE.q, GE.n)).toBe(45);
    expect(sumBy(GE.n, (k) => geo(GE.a1, GE.q, k))).toBe(45);
  });
  it('A-001: n terms 1 + q + … + q^(n−1) match the closed form; ending with q^n would not', () => {
    for (const q of [2, 0.5, -0.3, 3]) for (const n of [1, 3, 6]) {
      expect(sumBy(n, (k) => q ** (k - 1))).toBeCloseTo((1 - q ** n) / (1 - q), 10);
      expect(Math.abs(sumBy(n, (k) => q ** k, 0) - (1 - q ** n) / (1 - q))).toBeGreaterThan(1e-6);
    }
    expect(3 * sumBy(4, (k) => 2 ** k, 0)).toBe(93); // with q^4 the example would give 93, not 45
  });
  it('S_∞ = 6 for 3 + 3/2 + …; gap halves each term', () => {
    expect(geoLimit(GI.a1, GI.q)).toBe(6);
    expect(geoSum(GI.a1, GI.q, 40)).toBeCloseTo(6, 10);
    for (let n = 1; n < 10; n++) {
      expect(6 - geoSum(GI.a1, GI.q, n)).toBeCloseTo(geoGap(GI.a1, GI.q, n), 12);
      expect(geoGap(GI.a1, GI.q, n + 1)).toBeCloseTo(geoGap(GI.a1, GI.q, n) / 2, 12);
    }
    expect([1, 2, 3, 4].map((n) => geoSum(3, 0.5, n))).toEqual([3, 4.5, 5.25, 5.625]);
  });
  it('|q| ≥ 1: no finite sum', () => {
    expect(geoLimit(1, 1)).toBeNull(); expect(geoLimit(1, -1)).toBeNull(); expect(geoLimit(1, 2)).toBeNull();
    expect(geoSum(1, 1, 50)).toBe(50);
    expect(geoSum(1, -1, 7)).toBe(1); expect(geoSum(1, -1, 8)).toBe(0);
    expect(geoLimit(1, -0.5)).toBeCloseTo(2 / 3, 12);
    expect(geoLimit(1, 0.9)).toBeCloseTo(10, 12);
  });
});

describe('harmonic (U01 p. 12, U02 p. 2)', () => {
  it('each group m ≥ 1 is > 1/2 (strictly, for m ≥ 2) and its lower bound is exactly 1/2', () => {
    expect(group(1)).toEqual([2, 2]); expect(group(2)).toEqual([3, 4]); expect(group(3)).toEqual([5, 8]); expect(group(4)).toEqual([9, 16]);
    for (let m = 1; m <= 12; m++) { expect(groupLower(m)).toBe(0.5); expect(groupSum(m)).toBeGreaterThanOrEqual(0.5); }
    for (let m = 2; m <= 12; m++) expect(groupSum(m)).toBeGreaterThan(0.5);
    expect(groupSum(2)).toBeCloseTo(7 / 12, 12); expect(groupSum(3)).toBeCloseTo(533 / 840, 12);
  });
  it('S_(2^m) ≥ 1 + m/2', () => {
    for (let m = 0; m <= 16; m++) expect(harm(2 ** m)).toBeGreaterThanOrEqual(harmBound(m) - 1e-12);
    expect(harm(16)).toBeCloseTo(3.380728993, 8);
  });
  it('slow growth: S_n ≈ ln n + γ; more than 10 needs 12367 terms', () => {
    expect(harmExceed(10)).toBe(12367);
    expect(harmExceed(3)).toBe(11);
    expect(harm(1e5) - Math.log(1e5)).toBeCloseTo(EULER_GAMMA, 4);
  });
});

describe('e-series (U01 p. 12, A-002)', () => {
  it('1/1! + … + 1/n! → e − 1, with 1/0! → e', () => {
    expect(eSlide(20)).toBeCloseTo(Math.E - 1, 14);
    expect(eFull(20)).toBeCloseTo(Math.E, 14);
    expect(eSlide(1)).toBe(1); expect(eSlide(2)).toBe(1.5); expect(eSlide(3)).toBeCloseTo(5 / 3, 14);
    expect(eSlide(5)).toBeCloseTo(1.716666667, 8);
  });
});
