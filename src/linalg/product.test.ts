import { describe, expect, it } from 'vitest';
import { canMultiply, columnOfProduct, entry, entryTerms, matMul, shapeVerdict, SLIDE30 } from './product';
import { transpose } from './special';

describe('shape rule (slide 28)', () => {
  it('inner numbers must agree', () => {
    expect(shapeVerdict(2, 3, 3, 4)).toMatchObject({ ok: true, result: [2, 4] });
    expect(shapeVerdict(2, 3, 2, 3)).toMatchObject({ ok: false, result: null });
    expect(shapeVerdict(4, 3, 3, 1).result).toEqual([4, 1]); // matrix times vector
  });
  it('canMultiply and matMul throw on mismatch', () => {
    expect(canMultiply([[1, 2]], [[1, 2]])).toBe(false);
    expect(() => matMul([[1, 2]], [[1, 2]])).toThrow();
  });
});

describe('slides 27 and 29', () => {
  const A = [[0, 2], [1, 0]], B = [[1, -2], [1, 0]];
  it('(0 2; 1 0)(1 −2; 1 0) = (2 0; 1 −2)', () => { expect(matMul(A, B)).toEqual([[2, 0], [1, -2]]); });
  it('finger computer terms (slide 29)', () => {
    expect(entryTerms(A, B, 0, 0).map((t) => [t.a, t.b])).toEqual([[0, 1], [2, 1]]);
    expect(entry(A, B, 0, 0)).toBe(2);
    expect(entry(A, B, 0, 1)).toBe(0);
    expect(entry(A, B, 1, 0)).toBe(1);
    expect(entry(A, B, 1, 1)).toBe(-2);
  });
  it('column j of C is A applied to column j of B (slide 27)', () => {
    expect(columnOfProduct(A, B, 0)).toEqual([2, 1]);
    expect(columnOfProduct(A, B, 1)).toEqual([0, -2]);
  });
});

describe('slide 30 exercises', () => {
  it.each(SLIDE30.map((e, i) => [i + 1, e] as const))('exercise %i matches matMul', (_, e) => {
    expect(matMul(e.A, e.B)).toEqual(e.C);
  });
  it('first is a 4×1 times 1×2 = 4×2 matrix with the vector as first column', () => {
    const C = matMul([[1], [1], [0], [3]], [[1, 0]]);
    expect([C.length, C[0].length]).toEqual([4, 2]);
    expect(C.map((r) => r[0])).toEqual([1, 1, 0, 3]);
  });
  it('only the first answer is printed on the slide', () => { expect(SLIDE30.map((e) => e.onSlide)).toEqual([true, false, false]); });
});

describe('products in general', () => {
  it('AB ≠ BA for the slide example', () => {
    const A = [[0, 2], [1, 0]], B = [[1, -2], [1, 0]];
    expect(matMul(B, A)).toEqual([[-2, 2], [0, 2]]);
    expect(matMul(A, B)).not.toEqual(matMul(B, A));
  });
  it('(AB)ᵀ = BᵀAᵀ for the slide-30 exercise 2 (promised in lesson la-spezial)', () => {
    const { A, B } = SLIDE30[1];
    expect(transpose(matMul(A, B))).toEqual(matMul(transpose(B), transpose(A)));
  });
});
