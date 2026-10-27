import { describe, expect, it } from 'vitest';
import { canonicalDecimal, exactDecimal, spacing, toFloat } from './float';

describe('canonical decimal for the exactness check', () => {
  it('normalizes typed numbers', () => {
    expect(canonicalDecimal('0.10')).toBe('0.1');
    expect(canonicalDecimal('1e-3')).toBe('0.001');
    expect(canonicalDecimal('16777217')).toBe('16777217');
    expect(canonicalDecimal('-2,50')).toBe('-2.5');
    expect(canonicalDecimal('1.5e2')).toBe('150');
    expect(canonicalDecimal('abc')).toBeUndefined();
  });
  it('a typed number is stored exactly iff its canonical form equals the exact expansion', () => {
    const exact = (txt: string, fl: boolean) => { const x = Number(txt); const v = fl ? Math.fround(x) : x; return canonicalDecimal(txt) === exactDecimal(v); };
    expect(exact('0.5', true)).toBe(true);
    expect(exact('0.75', false)).toBe(true);
    expect(exact('0.1', false)).toBe(false);
    expect(exact('0.1', true)).toBe(false);
    expect(exact('16777217', true)).toBe(false);
    expect(exact('16777216', true)).toBe(true);
  });
});

describe('exact values of floating point numbers (notes §4.2)', () => {
  it('0.1 as a double is slightly more than 0.1', () => {
    expect(exactDecimal(0.1)).toBe('0.1000000000000000055511151231257827021181583404541015625');
  });
  it('0.1 as a float is 0.100000001490116119384765625', () => {
    expect(exactDecimal(toFloat(0.1))).toBe('0.100000001490116119384765625');
  });
  it('numbers that are sums of powers of two are exact', () => {
    expect(exactDecimal(0.5)).toBe('0.5');
    expect(exactDecimal(0.75)).toBe('0.75');
    expect(exactDecimal(3)).toBe('3');
    expect(exactDecimal(-2.25)).toBe('-2.25');
    expect(exactDecimal(1e21)).toBe('1000000000000000000000');
  });
  it('0.1 + 0.2 is not 0.3, and the sum is a different double', () => {
    expect(0.1 + 0.2 === 0.3).toBe(false);
    expect(exactDecimal(0.1 + 0.2)).toBe('0.3000000000000000444089209850062616169452667236328125');
  });
  it('spacing: 2^-23 relative for floats near 1, 2^-52 for doubles', () => {
    expect(spacing(1, 'float')).toBe(2 ** -23);
    expect(spacing(1, 'double')).toBe(2 ** -52);
    expect(spacing(1.5, 'double')).toBe(2 ** -52);
    expect(spacing(2, 'double')).toBe(2 ** -51);
    expect(spacing(0.1, 'double')).toBe(2 ** -56);
  });
  it('the notes: 1.1 − 1.0 − 0.1 in float arithmetic is 2.23517e-8', () => {
    const f = Math.fround;
    expect(f(f(f(1.1) - f(1.0)) - f(0.1))).toBeCloseTo(2.23517e-8, 12);
  });
  it('largest exact integer in a float is 2^24 (16777217 is not representable)', () => {
    expect(toFloat(16777217)).toBe(16777216);
  });
});
