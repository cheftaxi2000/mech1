import { describe, expect, it } from 'vitest';
import { combine, eqTex, holds, lerpEq, lineKind, lineParam, pointOnLine, qNum, twoLines, type Eq2 } from './lines2';
import { num, tex } from './frac';

describe('linear equations as lines (Übung 2, slides 4–10)', () => {
  it('slide 5: the solutions of 4x + 6y = 10 are exactly the points of the line (checked on a sample)', () => {
    const e: Eq2 = [4, 6, 10];
    for (let k = -8; k <= 8; k++) { const x = k / 2, y = (10 - 4 * x) / 6; expect(holds(e, x, y)).toBe(true); expect(holds(e, x, y + 0.1)).toBe(false); }
  });
  it('slides 7–10: the three systems', () => {
    const one = twoLines([2, 3, 5], [3, -2, 0]);
    expect(one.rel).toBe('cross');
    expect(tex(one.point![0])).toBe('\\frac{10}{13}'); expect(tex(one.point![1])).toBe('\\frac{15}{13}');
    expect(holds([2, 3, 5], ...qNum(one.point!))).toBe(true); expect(holds([3, -2, 0], ...qNum(one.point!))).toBe(true);
    expect(twoLines([2, 3, 5], [4, 6, 10]).rel).toBe('same');
    expect(twoLines([2, 3, 5], [4, 6, 5]).rel).toBe('parallel');
  });
  it('the determinant a₁b₂ − a₂b₁ is zero exactly for parallel lines (same or different)', () => {
    expect(twoLines([2, 3, 5], [3, -2, 0]).det).toBe(-13);
    expect(twoLines([2, 3, 5], [4, 6, 10]).det).toBe(0);
    expect(twoLines([2, 3, 5], [4, 6, 5]).det).toBe(0);
  });
  it('degenerate equations: 0 = 0 and 0 = c', () => {
    expect(lineKind([0, 0, 0])).toBe('all'); expect(lineKind([0, 0, 3])).toBe('empty'); expect(lineKind([1, 0, 3])).toBe('line');
    expect(twoLines([0, 0, 0], [0, 0, 0]).rel).toBe('all');
    expect(twoLines([0, 0, 0], [1, 2, 3]).rel).toBe('same');
    expect(twoLines([0, 0, 2], [1, 2, 3]).rel).toBe('empty');
  });
  it('slide 6: ½x + y = 2 and 3x − 2y = 1 meet in (5/4, 11/8) (scaled to integers: x + 2y = 4)', () => {
    const r = twoLines([1, 2, 4], [3, -2, 1]);
    expect(qNum(r.point!)).toEqual([1.25, 1.375]);
  });
});

describe('combining equations (slides 11–15)', () => {
  const E1: Eq2 = [2, 3, 5], E2: Eq2 = [1, -2, -1];
  it('E₁ and E₂ meet in (1, 1)', () => {
    expect(qNum(twoLines(E1, E2).point!)).toEqual([1, 1]);
  });
  it('slide 11/12: E₁ + E₂ = 3x + y = 4, −E₁ + E₂ = −x − 5y = −6, 3E₁ + E₂ = 7x + 7y = 14', () => {
    expect(combine(E1, E2, 1, 1)).toEqual([3, 1, 4]);
    expect(combine(E1, E2, -1, 1)).toEqual([-1, -5, -6]);
    expect(combine(E1, E2, 3, 1)).toEqual([7, 7, 14]);
  });
  it('slide 13: every combination passes through the common point, for all α, β (not only on a sample of lines)', () => {
    for (let al = -6; al <= 6; al++) for (let be = -6; be <= 6; be++) expect(holds(combine(E1, E2, al, be), 1, 1)).toBe(true);
  });
  it('slides 14–15: E₁: x − 2y = −2, E₂: x + y = 2; E₁ − E₂ = −3y = −4, E₁ + 2E₂ = 3x = 2; the intersection (2/3, 4/3) stays', () => {
    const A: Eq2 = [1, -2, -2], B: Eq2 = [1, 1, 2];
    const P = qNum(twoLines(A, B).point!);
    expect(P[0]).toBeCloseTo(2 / 3, 12); expect(P[1]).toBeCloseTo(4 / 3, 12);
    const h = combine(A, B, 1, -1), v = combine(A, B, 1, 2);
    expect(h).toEqual([0, -3, -4]); expect(v).toEqual([3, 0, 2]);
    expect(holds(h, ...P)).toBe(true); expect(holds(v, ...P)).toBe(true);
    expect(qNum(twoLines(h, v).point!)).toEqual(P);
    expect(qNum(twoLines(A, h).point!)[1]).toBeCloseTo(4 / 3, 12);
  });
  it('morphing one line into another (the common point stays) keeps the point on every intermediate line', () => {
    const A: Eq2 = [1, -2, -2], B: Eq2 = [1, 1, 2], P: [number, number] = [2 / 3, 4 / 3];
    for (let i = 0; i <= 10; i++) {
      expect(holds(lerpEq(A, combine(A, B, 1, -1), i / 10), ...P)).toBe(true);
      expect(holds(lerpEq(B, combine(A, B, 1, 2), i / 10), ...P)).toBe(true);
    }
  });
});

describe('warm-up (slide 4)', () => {
  it('sin(8) is just a number, about 0.989 (radians)', () => {
    expect(Math.sin(8)).toBeCloseTo(0.989, 3);
  });
  it('the example points of the misconception lie on x + y + z = 3', () => {
    for (const p of [[3, 0, 0], [1, 1, 1], [0, 5, -2]]) expect(p[0] + p[1] + p[2]).toBe(3);
  });
});

describe('writing an equation as the slides do', () => {
  it('eqTex', () => {
    expect(eqTex([2, 3], 5)).toBe('2x+3y=5');
    expect(eqTex([1, -2], -1)).toBe('x-2y=-1');
    expect(eqTex([0, -3], -4)).toBe('-3y=-4');
    expect(eqTex([3, 0], 2)).toBe('3x=2');
    expect(eqTex([0, 0], 0)).toBe('0=0');
    expect(eqTex([-1, 1, 1], 3, ['x', 'y', 'z'])).toBe('-x+y+z=3');
    expect(eqTex([1, 1, -1], 1, ['x', 'y', 'z'])).toBe('x+y-z=1');
  });
});

describe('a point that slides along the line (exact)', () => {
  it('pointOnLine is exact: 4x + 6y = 10 at x = 3/2 gives y = 2/3', () => {
    const p = pointOnLine([4, 6, 10], 'x', [3, 2])!;
    expect(tex(p[1])).toBe('\\frac{2}{3}');
    expect(holds([4, 6, 10], ...qNum(p))).toBe(true);
    expect(pointOnLine([4, 0, 10], 'x', [1, 1])).toBeUndefined();
  });
  it('lineParam: all admissible half-integer parameters stay inside the window; steep lines use y', () => {
    for (const e of [[4, 6, 10], [1, 0, 3], [0, 2, -4], [5, -1, 2], [1, 6, 12]] as Eq2[]) {
      const r = lineParam(e, 6, 6)!;
      expect(r).toBeDefined();
      for (const u of [r.lo, r.hi]) {
        const p = pointOnLine(e, r.fixed, [Math.round(u * 2), 2])!, [x, y] = qNum(p);
        expect(Math.abs(x)).toBeLessThanOrEqual(6 + 1e-9); expect(Math.abs(y)).toBeLessThanOrEqual(6 + 1e-9);
        expect(num(p[0])).toBeCloseTo(x, 12);
      }
    }
    expect(lineParam([1, 0, 9], 6, 6)).toBeUndefined();
    expect(lineParam([0, 0, 0], 6, 6)).toBeUndefined();
  });
});
