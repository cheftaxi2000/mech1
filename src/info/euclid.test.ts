import { describe, expect, it } from 'vitest';
import { commonDivisors, euclid, euclidTrace, gcdRemainder, subtractions } from './euclid';

describe('Euclid by subtraction (notes p. 9–10)', () => {
  it('finds the greatest common divisor for every pair 1..60', () => {
    for (let a = 1; a <= 60; a++) for (let b = 1; b <= 60; b++) expect(euclid(a, b)).toBe(gcdRemainder(a, b));
  });

  it('terminates: every step makes a or b strictly smaller (a + b decreases)', () => {
    for (const [a, b] of [[12, 8], [60, 7], [97, 1], [1, 1], [35, 14]]) {
      const tr = euclidTrace(a, b);
      for (let i = 1; i < tr.length; i++) expect(tr[i].a + tr[i].b).toBeLessThan(tr[i - 1].a + tr[i - 1].b);
      expect(tr.at(-1)!.a).toBe(tr.at(-1)!.b);
    }
  });

  it('correctness argument of the notes: the set of common divisors never changes', () => {
    for (const [a, b] of [[12, 8], [60, 7], [35, 14], [48, 18], [13, 8]]) {
      const first = commonDivisors(a, b);
      for (const s of euclidTrace(a, b)) expect(commonDivisors(s.a, s.b)).toEqual(first);
      // …and at the end the largest common divisor of the input is the value a = b
      expect(Math.max(...first)).toBe(euclid(a, b));
    }
  });

  it('worked trace 12, 8: (12,8) → (4,8) → (4,4)', () => {
    expect(euclidTrace(12, 8)).toEqual([{ a: 12, b: 8, op: 'start' }, { a: 4, b: 8, op: 'a-b' }, { a: 4, b: 4, op: 'b-a' }]);
  });

  it('footnote 1: with a small second number the subtraction version needs many steps', () => {
    expect(subtractions(100, 3)).toBe(35); // 100→97→…→1 is 33 subtractions of 3, then 3→2, 2→1 …
    expect(subtractions(100, 3)).toBeGreaterThan(subtractions(100, 30));
    expect(subtractions(40, 3)).toBe(15);  // used in the lesson text
    expect(subtractions(40, 30)).toBe(3);
  });

  it('rejects non-positive input', () => {
    expect(() => euclidTrace(0, 5)).toThrow();
    expect(() => euclidTrace(3.5, 2)).toThrow();
  });
});
