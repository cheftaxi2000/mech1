import { describe, expect, it } from 'vitest';
import { analyze, apply, dot, interp, mm, norm, sub, sameM, type M2, type V2 } from './plane2';

const close = (u: V2, v: V2, e = 1e-9) => Math.abs(u[0] - v[0]) < e && Math.abs(u[1] - v[1]) < e;
const cases: { tag: string; A: M2; b: V2; r: number; kind: string; x?: V2; xp?: V2; n?: V2; xc?: V2; proj?: V2 }[] = [
  { tag: 'rank 2 (Übung 3 slide / Übung 4 slide 12): 2x₁+3x₂ = −1, x₁−2x₂ = 3', A: [[2, 3], [1, -2]], b: [-1, 3], r: 2, kind: 'unique', x: [1, -1] },
  { tag: 'rank 1, infinitely many', A: [[1, -2], [2, -4]], b: [-1, -2], r: 1, kind: 'infinite', xp: [-0.2, 0.4], n: [2, 1], xc: [1, 1] },
  { tag: 'rank 1, none (Übung 4 slide 13)', A: [[1, -2], [2, -4]], b: [1, 4], r: 1, kind: 'none', proj: [1.8, 3.6], xp: [0.36, -0.72] },
  { tag: 'rank 0, none', A: [[0, 0], [0, 0]], b: [1, 1], r: 0, kind: 'none' },
  { tag: 'rank 0, every x', A: [[0, 0], [0, 0]], b: [0, 0], r: 0, kind: 'all' },
  { tag: 'a₁ = 0, b in span', A: [[0, 1], [0, 2]], b: [2, 4], r: 1, kind: 'infinite', n: [1, 0] },
  { tag: 'near singular', A: [[1, 1], [1, 1 + 1e-12]], b: [1, 1], r: 1, kind: 'infinite' },
  { tag: 'regular, badly scaled', A: [[1000, 0], [0, 0.001]], b: [1, 1], r: 2, kind: 'unique', x: [0.001, 1000] },
  { tag: 'Full rank II (3B1B: (3 1; 1 2)(−1, 2) = (−1, 3))', A: [[3, 1], [1, 2]], b: [-1, 3], r: 2, kind: 'unique', x: [-1, 2] },
];

describe('column picture analysis', () => {
  for (const c of cases) {
    it(c.tag, () => {
      const an = analyze(c.A, c.b);
      expect(an.r).toBe(c.r);
      expect(an.kind).toBe(c.kind);
      if (an.kind !== 'none') expect(close(apply(c.A, an.xp), c.b, 1e-6)).toBe(true);
      if (c.x) expect(close(an.xp, c.x, 1e-9)).toBe(true);
      if (c.xp) expect(close(an.xp, c.xp, 1e-9)).toBe(true);
      if (c.n) expect(an.n).toEqual(c.n);
      if (c.proj) expect(close(an.proj, c.proj)).toBe(true);
      if (an.n) { expect(close(apply(c.A, an.n), [0, 0], 1e-6)).toBe(true); expect(Math.abs(dot(an.xp, an.n))).toBeLessThan(1e-9); }
      if (an.kind === 'infinite' && an.xc) {
        expect(close(apply(c.A, an.xc), c.b, 1e-9)).toBe(true);
        for (const t of [0.7, 1.9, 3.3]) expect(close(apply(c.A, [an.xc[0] + an.n![0] * t, an.xc[1] + an.n![1] * t]), c.b, 1e-9)).toBe(true);
      }
      if (an.kind === 'none' && an.r === 1) {
        const miss = sub(c.b, an.proj);
        expect(Math.abs(dot(miss, an.a1))).toBeLessThan(1e-9);
        expect(Math.abs(dot(miss, an.a2))).toBeLessThan(1e-9);
        const g = apply(c.A, an.xg!);
        expect(norm(sub(g, an.proj))).toBeGreaterThan(0.5);
        expect(Math.abs(an.u![0] * g[1] - an.u![1] * g[0])).toBeLessThan(1e-9);
      }
    });
  }
  it('the incomplete-rank slides (Übung 4, slides 18–20): (1 −2; 2 −4) sends (−2, −2) to (2, 4), and (3, 2) to (−1, −2)', () => {
    const A: M2 = [[1, -2], [2, -4]];
    expect(apply(A, [-2, -2])).toEqual([2, 4]);
    expect(apply(A, [3, 2])).toEqual([-1, -2]);
  });
});

describe('composition (Übung 4, slides 26–30)', () => {
  it('(0 2; 1 0)(1 −2; 1 0) = (2 0; 1 −2)', () => {
    expect(mm([[0, 2], [1, 0]], [[1, -2], [1, 0]])).toEqual([[2, 0], [1, -2]]);
  });
  it('(AB)x = A(Bx), and AB ≠ BA in general', () => {
    const A: M2 = [[0, -1], [1, 0]], B: M2 = [[1, 1], [0, 1]], x: V2 = [2, 1];
    expect(apply(mm(A, B), x)).toEqual(apply(A, apply(B, x)));
    expect(sameM(mm(A, B), mm(B, A))).toBe(false);
  });
  it('interp goes from I to F; a rotation really turns (no shrinking on the way)', () => {
    const R: M2 = [[0, -1], [1, 0]];
    expect(sameM(interp(R, 0), [[1, 0], [0, 1]])).toBe(true);
    expect(sameM(interp(R, 1), R)).toBe(true);
    const h = interp(R, 0.5);
    expect(Math.hypot(h[0][0], h[1][0])).toBeCloseTo(1);
  });
});
