import { describe, expect, it } from 'vitest';
import { addMat, build } from './matops';
import { matMul } from './product';
import {
  antisymmetrize, antisymmetryBreaks, diag, identity, isAntisymmetric, isDiagonal, isIdentity, isLowerTriangular, isSquare, isSymmetric,
  isUpperTriangular, mirror, mirrorPairs, symmetrize, symmetryBreaks, transpose,
} from './special';

const S35 = [[1, 2, -2, 0], [2, 2, 0, 1], [-2, 0, -3, 0], [0, 1, 0, 1]]; // slide 35
const A36 = [[0, 1, 2, 3], [-1, 0, 0, -1], [-2, 0, 0, -2], [-3, 1, 2, 0]]; // slide 36

describe('transpose (slides 33–34)', () => {
  it('slide 33: 3×2 becomes 2×3, columns become rows', () => {
    expect(transpose([[1, 2], [3, 4], [5, 6]])).toEqual([[1, 3, 5], [2, 4, 6]]);
  });
  it('slide 33: 3×3 mirrored across the diagonal', () => {
    expect(transpose([[1, 2, 3], [4, 5, 6], [7, 8, 9]])).toEqual([[1, 4, 7], [2, 5, 8], [3, 6, 9]]);
  });
  it('slide 34 «Your turn» (answers computed here)', () => {
    expect(transpose([[-2, 0], [5, 0], [6, 2]])).toEqual([[-2, 5, 6], [0, 0, 2]]);
    expect(transpose([[1], [2], [3], [4], [5]])).toEqual([[1, 2, 3, 4, 5]]);
    expect(transpose([[1, 1, 1], [0, 0, 0], [2, 2, 2]])).toEqual([[1, 0, 2], [1, 0, 2], [1, 0, 2]]);
  });
  const rnd = (() => { let s = 11; return () => ((s = (s * 48271) % 2147483647) / 2147483647) * 8 - 4; })();
  it('rules of the ZF excerpt (numeric checks): (A+B)ᵀ = Aᵀ+Bᵀ, (cA)ᵀ = cAᵀ, (Aᵀ)ᵀ = A', () => {
    const A = build(3, 2, rnd), B = build(3, 2, rnd);
    expect(transpose(addMat(A, B))).toEqual(addMat(transpose(A), transpose(B)));
    expect(transpose(A.map((r) => r.map((v) => 2.5 * v)))).toEqual(transpose(A).map((r) => r.map((v) => 2.5 * v)));
    expect(transpose(transpose(A))).toEqual(A);
  });
  it('(AB)ᵀ = BᵀAᵀ for random 3×2 · 2×4 (numeric check, not a proof) and with the slide-27 matrices', () => {
    for (let k = 0; k < 30; k++) {
      const A = build(3, 2, rnd), B = build(2, 4, rnd);
      const L = transpose(matMul(A, B)), R = matMul(transpose(B), transpose(A));
      expect([L.length, L[0].length]).toEqual([4, 3]);
      L.forEach((r, i) => r.forEach((v, j) => expect(v).toBeCloseTo(R[i][j], 9)));
    }
    const A = [[0, 2], [1, 0]], B = [[1, -2], [1, 0]];
    expect(transpose(matMul(A, B))).toEqual(matMul(transpose(B), transpose(A)));
    expect(transpose(matMul(A, B))).toEqual([[2, 1], [0, -2]]);
  });
});

describe('symmetric and antisymmetric (slides 35–36)', () => {
  it('slide 35 example is symmetric, slide 36 example antisymmetric', () => {
    expect(isSymmetric(S35)).toBe(true);
    expect(isAntisymmetric(S35)).toBe(false);
    expect(isAntisymmetric(A36)).toBe(true);
    expect(isSymmetric(A36)).toBe(false);
  });
  it('must be square', () => {
    expect(isSquare([[1, 2, 3]])).toBe(false);
    expect(isSymmetric([[1, 2, 3]])).toBe(false);
    expect(isAntisymmetric([[0, 1]])).toBe(false);
  });
  it('antisymmetric forces a zero diagonal (A_ii = −A_ii)', () => {
    expect(isAntisymmetric([[1, 0], [0, 0]])).toBe(false);
    expect(isAntisymmetric([[0, 5], [-5, 0]])).toBe(true);
    expect(antisymmetryBreaks([[1, 0], [0, 0]])).toEqual([[0, 0]]);
  });
  it('only the zero matrix is both symmetric and antisymmetric', () => {
    expect(isSymmetric(build(3, 3)) && isAntisymmetric(build(3, 3))).toBe(true);
    expect(isSymmetric([[0, 1], [1, 0]]) && isAntisymmetric([[0, 1], [1, 0]])).toBe(false);
  });
  it('zeros on the diagonal are not enough for antisymmetry', () => {
    expect(isAntisymmetric([[0, 1], [1, 0]])).toBe(false);
    expect(symmetryBreaks([[0, 1], [2, 0]])).toEqual([[0, 1]]);
  });
  it('mirror partners and pairs', () => {
    expect(mirror(2, 0)).toEqual([0, 2]);
    expect(mirrorPairs(4)).toHaveLength(6);
    expect(symmetryBreaks(S35)).toEqual([]);
    expect(antisymmetryBreaks(A36)).toEqual([]);
  });
  it('symmetrize / antisymmetrize give what they say', () => {
    const M = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    expect(isSymmetric(symmetrize(M))).toBe(true);
    expect(isAntisymmetric(antisymmetrize(M))).toBe(true);
    expect(symmetrize(M)[2]).toEqual([3, 6, 9]);
  });
  it('supplement: A, B symmetric but AB not symmetric — (1 2; 2 3)(0 1; 1 0) = (2 1; 3 2)', () => {
    const A = [[1, 2], [2, 3]], B = [[0, 1], [1, 0]];
    expect(isSymmetric(A) && isSymmetric(B)).toBe(true);
    const AB = matMul(A, B);
    expect(AB).toEqual([[2, 1], [3, 2]]);
    expect(isSymmetric(AB)).toBe(false);
  });
  it('AᵀA and AAᵀ are always symmetric (ZF excerpt; numeric check)', () => {
    const A = [[1, 2, 0], [-1, 3, 4]];
    expect(isSymmetric(matMul(transpose(A), A))).toBe(true);
    expect(isSymmetric(matMul(A, transpose(A)))).toBe(true);
  });
  it('LA-004: the backward directions of «A, B sym ⇔ A+B sym» and «A sym ⇔ A² sym» fail', () => {
    const N = [[0, 1], [0, 0]], Nt = [[0, 0], [1, 0]];
    expect(isSymmetric(addMat(N, Nt)) && !isSymmetric(N) && !isSymmetric(Nt)).toBe(true);
    expect(matMul(N, N)).toEqual([[0, 0], [0, 0]]);
    expect(isSymmetric(matMul(N, N)) && !isSymmetric(N)).toBe(true);
  });
  it('odd n: det(S) = (−1)ⁿ det(S) forces det(S) = 0 (3×3 example)', () => {
    const S = [[0, 2, -1], [-2, 0, 3], [1, -3, 0]];
    const d = S[0][0] * (S[1][1] * S[2][2] - S[1][2] * S[2][1]) - S[0][1] * (S[1][0] * S[2][2] - S[1][2] * S[2][0]) + S[0][2] * (S[1][0] * S[2][1] - S[1][1] * S[2][0]);
    expect(d).toBe(0);
  });
  it('A + B and A² stay symmetric', () => {
    expect(isSymmetric(addMat(S35, S35))).toBe(true);
    expect(isSymmetric(matMul(S35, S35))).toBe(true);
  });
});

describe('diagonal, triangular, identity (slides 31–32)', () => {
  it('diag(1, 2, 6, 4) scales each basis vector', () => {
    const D = diag([1, 2, 6, 4]);
    expect(isDiagonal(D)).toBe(true);
    expect(matMul(D, [[1], [1], [1], [1]])).toEqual([[1], [2], [6], [4]]);
  });
  it('identity does nothing', () => {
    expect(isIdentity(identity(3))).toBe(true);
    expect(matMul(identity(2), [[7], [19]])).toEqual([[7], [19]]);
  });
  it('triangular classes; a shear is upper triangular', () => {
    expect(isUpperTriangular([[1, 1], [0, 1]])).toBe(true);
    expect(isLowerTriangular([[1, 1], [0, 1]])).toBe(false);
    expect(isLowerTriangular([[1, 0], [2, 3]])).toBe(true);
    expect(isDiagonal([[1, 0], [0, 3]]) && isUpperTriangular(diag([1, 3])) && isLowerTriangular(diag([1, 3]))).toBe(true);
  });
});
