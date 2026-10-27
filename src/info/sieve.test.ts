import { describe, expect, it } from 'vitest';
import { runProgram } from './cpp/interp';
import { P } from './cpp/programs';
import { sievePrimes, sieveRounds } from './sieve';

describe('sieve model', () => {
  it('lists the same primes as the C++ program', () => {
    for (const n of [2, 3, 10, 24, 50, 97]) {
      const out = runProgram(P.sieve.code, { stdin: `${n}\n`, maxSnaps: 400000 }).stdout.split('\n')[1].trim();
      expect(sievePrimes(n).join(' ')).toBe(out);
    }
  });
  it('every composite below n is crossed out exactly once as "fresh"', () => {
    const n = 60;
    const fresh = sieveRounds(n).flatMap((r) => r.fresh).sort((a, b) => a - b);
    const comps = Array.from({ length: n - 2 }, (_, k) => k + 2).filter((m) => !sievePrimes(n).includes(m));
    expect(fresh).toEqual(comps);
  });
  it('after round p the multiples of p are crossed: 12 is fresh for 2, "again" for 3', () => {
    const r = sieveRounds(24);
    expect(r[0].fresh).toContain(12);
    expect(r[1].again).toContain(12);
    expect(r[1].fresh).toContain(9);
  });
});
