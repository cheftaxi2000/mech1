import { describe, expect, it } from 'vitest';
import { apply, bits, signedRange, toSigned, toUnsigned } from './wrap';

describe('B-bit integers (notes §4.1)', () => {
  it('domain of int with B = 32: −2^31 … 2^31 − 1', () => {
    expect(signedRange(32)).toEqual([-2147483648, 2147483647]);
  });
  it('conversion table: x ≥ 0 stays, x < 0 becomes x + 2^B (notes p. 39)', () => {
    for (const x of [-8, -1, 0, 5, 7]) expect(toUnsigned(x, 4)).toBe(x >= 0 ? x : x + 16);
    expect(toUnsigned(-1, 32)).toBe(2 ** 32 - 1);
  });
  it('converting back and forth loses nothing: the bit pattern is the same', () => {
    for (let u = 0; u < 16; u++) { expect(toUnsigned(toSigned(u, 4), 4)).toBe(u); expect(bits(u, 4)).toHaveLength(4); }
  });
  it('overflow wraps around: 7 + 1 = −8 for 4 bits, 2147483647 + 1 = −2147483648 for 32', () => {
    expect(toSigned(apply(7, '+', 1, 4).u, 4)).toBe(-8);
    expect(apply(7, '+', 1, 4).wrapped).toBe(true);
    expect(toSigned(apply(2147483647, '+', 1, 32).u, 32)).toBe(-2147483648);
  });
  it('the notes: 15^8 as int is −1732076671', () => {
    const p = (a: number) => { let r = 1; for (let i = 0; i < 8; i++) r = toSigned(apply(toUnsigned(r, 32), '*', a, 32).u, 32); return r; };
    expect(p(15)).toBe(-1732076671);
  });
  it('the first program works up to a = 14; from 15 on a^8 leaves the int domain', () => {
    const [, max] = signedRange(32);
    expect(14 ** 8).toBeLessThanOrEqual(max);
    expect(15 ** 8).toBeGreaterThan(max);
  });
  it('Example 4.4: (10 + (−110)) in unsigned arithmetic, divided by 10, is 429496719', () => {
    expect(Math.floor((toUnsigned(10 + toUnsigned(-110, 32), 32)) / 10)).toBe(429496719);
  });
  it('unsigned wraps modulo 2^B: 0 − 1 = 2^B − 1', () => {
    expect(apply(0, '-', 1, 4).u).toBe(15);
  });
});
