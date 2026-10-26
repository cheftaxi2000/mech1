import { describe, expect, it } from 'vitest';
import { skaterAt } from './skaters';

describe('roller-skate supplement', () => {
  const s = { m1: 60, m2: 30, F: 90, tau: 0.5 };
  it('both start at rest, touching', () => {
    const a = skaterAt(s, 1, 0);
    expect(a.v1).toBeCloseTo(0, 12); expect(a.v2).toBeCloseTo(0, 12); expect(a.x2 - a.x1).toBe(1);
  });
  it('equal and opposite forces give equal and opposite momenta: m₁v₁ = −m₂v₂', () => {
    const a = skaterAt(s, 1, 2);
    expect(s.m1 * a.v1 + s.m2 * a.v2).toBeCloseTo(0, 12);
  });
  it('the lighter body ends up faster, in the ratio of the masses', () => {
    const a = skaterAt(s, 1, 2);
    expect(Math.abs(a.v2 / a.v1)).toBeCloseTo(s.m1 / s.m2, 12);
  });
  it('after the push both roll with constant speed (positions linear in t)', () => {
    const a = skaterAt(s, 1, 1), b = skaterAt(s, 1, 2);
    expect(b.x2 - a.x2).toBeCloseTo(a.v2, 12);
    expect(b.x1 - a.x1).toBeCloseTo(a.v1, 12);
  });
  it('the centre of mass stays where it was (equal and opposite forces)', () => {
    for (const t of [0.2, 0.5, 1.3]) {
      const a = skaterAt(s, 1, t);
      expect((s.m1 * a.x1 + s.m2 * a.x2) / (s.m1 + s.m2)).toBeCloseTo((s.m1 * -0.5 + s.m2 * 0.5) / (s.m1 + s.m2), 12);
    }
  });
});
