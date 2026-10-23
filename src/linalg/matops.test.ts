import { describe, expect, it } from 'vitest';
import { addMat, applyMat, build, commonFactor, matEq, sameShape, scaleMat, shapeOf } from './matops';

describe('shape and entry-wise operations (slides 22–25)', () => {
  it('shape is rows × columns', () => {
    expect(shapeOf([[1, 2, 3], [4, 5, 6]])).toEqual([2, 3]);
    expect(shapeOf(build(3, 4))).toEqual([3, 4]);
  });
  it('slide 23: (1 2 3; 4 5 6) + (2 2 3; 4 1 2) = (3 4 6; 8 6 8)', () => {
    expect(addMat([[1, 2, 3], [4, 5, 6]], [[2, 2, 3], [4, 1, 2]])).toEqual([[3, 4, 6], [8, 6, 8]]);
  });
  it('sum needs the same shape', () => {
    expect(sameShape([[1, 2]], [[1], [2]])).toBe(false);
    expect(() => addMat([[1, 2]], [[1], [2]])).toThrow();
  });
  it('slide 24: (A+B)v = Av + Bv with A = (1 1; 0 2), B = (2 0; −1 0), v = (1, 1)', () => {
    const A = [[1, 1], [0, 2]], B = [[2, 0], [-1, 0]], v = [1, 1];
    expect(addMat(A, B)).toEqual([[3, 1], [-1, 2]]);
    expect(applyMat(A, v)).toEqual([2, 2]);
    expect(applyMat(B, v)).toEqual([2, -1]);
    expect(applyMat(addMat(A, B), v)).toEqual([4, 1]);
  });
  it('(A+B)v = Av + Bv for random 3×2 matrices (numeric check, not a proof)', () => {
    let s = 7; const rnd = () => ((s = (s * 48271) % 2147483647) / 2147483647) * 10 - 5;
    for (let k = 0; k < 50; k++) {
      const A = build(3, 2, rnd), B = build(3, 2, rnd), v = [rnd(), rnd()];
      const L = applyMat(addMat(A, B), v), R = applyMat(A, v).map((x, i) => x + applyMat(B, v)[i]);
      L.forEach((x, i) => expect(x).toBeCloseTo(R[i], 9));
    }
  });
  it('slide 25: (5 10 5; 15 5 0) = 5·(1 2 1; 3 1 0); (λA)v = λ(Av)', () => {
    const A = [[1, 2, 1], [3, 1, 0]];
    expect(scaleMat(5, A)).toEqual([[5, 10, 5], [15, 5, 0]]);
    expect(commonFactor([[5, 10, 5], [15, 5, 0]])).toBe(5);
    expect(commonFactor([[1, 2], [3, 4]])).toBe(1);
    expect(commonFactor([[0, 0], [0, 0]])).toBe(1);
    expect(applyMat(scaleMat(3, A), [1, 2, 3])).toEqual(applyMat(A, [1, 2, 3]).map((x) => 3 * x));
    expect(matEq(scaleMat(0, A), build(2, 3))).toBe(true);
  });
  it('applyMat needs matching size', () => {
    expect(() => applyMat([[1, 2]], [1, 2, 3])).toThrow();
  });
});
