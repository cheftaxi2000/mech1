import { describe, expect, it } from 'vitest';
import { mat, eliminate, reduce, solve, mulVec, coeffs, rhs } from './gauss';
import { q, num, eq } from './frac';

const nums = (v: readonly (readonly [number, number])[]) => v.map(num);

describe('Gaussian elimination: the worked examples of Übung 2 (slides 27–36)', () => {
  it('3 × 3 with the unique solution (1, 2, 3); row operations II−I and III−2·I (slides 27–30)', () => {
    const A = mat([[1, 1, 1, 6], [1, 2, 1, 8], [2, 3, 5, 23]]);
    const e = eliminate(A);
    expect(e.steps[0].op).toEqual({ kind: 'add', target: 1, source: 0, factor: q(-1) });
    expect(e.steps[1].op).toEqual({ kind: 'add', target: 2, source: 0, factor: q(-2) });
    expect(e.steps[0].after.map((r) => r.map(num))).toEqual([[1, 1, 1, 6], [0, 1, 0, 2], [2, 3, 5, 23]]);
    expect(e.steps[1].after.map((r) => r.map(num))).toEqual([[1, 1, 1, 6], [0, 1, 0, 2], [0, 1, 3, 11]]);
    expect(e.result.map((r) => r.map(num))).toEqual([[1, 1, 1, 6], [0, 1, 0, 2], [0, 0, 3, 9]]);
    expect(e.rank).toBe(3);
    const s = solve(A);
    expect(s.kind).toBe('unique');
    expect(nums(s.particular!)).toEqual([1, 2, 3]);
    const red = reduce(e).result.map((r) => r.map(num));
    expect(red).toEqual([[1, 0, 0, 1], [0, 1, 0, 2], [0, 0, 1, 3]]);
  });
  it('2 × 2: x₁ + x₂ = 3, 2x₁ − x₂ = 0 gives (1, 2) (slide 33)', () => {
    expect(nums(solve(mat([[1, 1, 3], [2, -1, 0]])).particular!)).toEqual([1, 2]);
  });
  it('2 × 2 without solution: x₁ + x₂ = 2, 2x₁ + 2x₂ = 5 gives the row (0 0 | 1) (slide 34)', () => {
    const A = mat([[1, 1, 2], [2, 2, 5]]);
    expect(eliminate(A).result.map((r) => r.map(num))).toEqual([[1, 1, 2], [0, 0, 1]]);
    expect(solve(A).kind).toBe('none');
  });
  it('3 × 3 (3x+4y−2z=0, 2x−3y+4z=11, x−2y+3z=7): (2, −1, 1) via −2, −3, −10 (slide 35)', () => {
    const A = mat([[1, -2, 3, 7], [2, -3, 4, 11], [3, 4, -2, 0]]);
    const e = eliminate(A);
    expect(e.steps.map((s) => s.op)).toEqual([
      { kind: 'add', target: 1, source: 0, factor: q(-2) },
      { kind: 'add', target: 2, source: 0, factor: q(-3) },
      { kind: 'add', target: 2, source: 1, factor: q(-10) },
    ]);
    expect(e.result.map((r) => r.map(num))).toEqual([[1, -2, 3, 7], [0, 1, -2, -3], [0, 0, 9, 9]]);
    expect(nums(solve(A).particular!)).toEqual([2, -1, 1]);
  });
  it('three proportional equations: infinitely many solutions, 2 free parameters (slide 36)', () => {
    const s = solve(mat([[1, 1, 1, 2], [2, 2, 2, 4], [3, 3, 3, 6]]));
    expect(s.kind).toBe('infinite');
    expect(s.rank).toBe(1);
    expect(s.freeCols).toEqual([1, 2]);
  });
  it('more columns than rows (slide 32): 2x₁+2x₂−x₃=2, x₁+x₂+3x₃=1 → x₃ = 0, x₁ + x₂ = 1', () => {
    const A = mat([[2, 2, -1, 2], [1, 1, 3, 1]]);
    const s = solve(A);
    expect(s.kind).toBe('infinite');
    expect(s.freeCols).toEqual([1]);
    expect(nums(s.particular!)).toEqual([1, 0, 0]);
    expect(nums(s.dirs![0])).toEqual([-1, 1, 0]);
  });
});

describe('Pivots, free variables and rank (Übung 4, slides 5–11)', () => {
  it('R⁴ example: L = {(−9−3α, −(2+α)/2, α, 5)}', () => {
    const A = mat([[1, 0, 3, 2, 1], [0, 2, 1, 1, 3], [0, 0, 0, 1, 5], [0, 0, 0, 0, 0]]);
    const s = solve(A);
    expect(s.kind).toBe('infinite');
    expect(s.pivotCols).toEqual([0, 1, 3]);
    expect(s.freeCols).toEqual([2]);
    expect(nums(s.particular!)).toEqual([-9, -1, 0, 5]);
    expect(nums(s.dirs![0])).toEqual([-3, -0.5, 1, 0]);
    for (const a of [-2, 0, 1.5, 7]) {
      const x = [-9 - 3 * a, -(2 + a) / 2, a, 5];
      const Ax = [1, 0, 3, 2].reduce((t, c, i) => t + c * x[i], 0);
      expect(Ax).toBeCloseTo(1);
      expect(2 * x[1] + x[2] + x[3]).toBeCloseTo(3);
    }
  });
  it('Series 2 example 3x₁+2b x₂+4x₃=5, 3x₁+4x₃=5, 2b x₂+3a x₃=b: the four cases', () => {
    const sys = (a: number, b: number) => mat([[3, 2 * b, 4, 5], [3, 0, 4, 5], [0, 2 * b, 3 * a, b]]);
    expect(solve(sys(0, 0))).toMatchObject({ kind: 'infinite', rank: 1, freeCols: [1, 2] }); // (a) two free parameters
    expect(solve(sys(1, 0))).toMatchObject({ kind: 'infinite', rank: 2, freeCols: [1] }); // (b) one free parameter
    expect(solve(sys(1, 1))).toMatchObject({ kind: 'unique', rank: 3 }); // (c)
    expect(solve(sys(0, 1)).kind).toBe('none'); // (d)
    const s = solve(sys(0, 0));
    expect(nums(s.particular!)).toEqual([5 / 3, 0, 0]);
    expect(nums(s.dirs![1])).toEqual([-4 / 3, 0, 1]);
  });
  it('the rank rule of slide 8 for non-square systems: r = n is enough for uniqueness (R-LA-002)', () => {
    const s = solve(mat([[1, 0, 1], [0, 1, 2], [1, 1, 3]])); // m = 3 > n = 2, r = n = 2
    expect(s).toMatchObject({ kind: 'unique', rank: 2 });
  });
  it('every solution satisfies A x = b', () => {
    const A = mat([[2, 2, -1, 2], [1, 1, 3, 1]]);
    const s = solve(A);
    const Ax = mulVec(coeffs(A), s.particular!);
    expect(Ax.every((v, i) => eq(v, rhs(A)[i]))).toBe(true);
  });
});
