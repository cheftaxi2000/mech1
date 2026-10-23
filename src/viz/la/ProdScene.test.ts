import { describe, expect, it } from 'vitest';
import { apply, mm, sameM, type M2 } from '../../linalg/plane2';
import { COMP_PRESETS, COMP_STEPS, SHAPE_F, X_PT, chain, compBox, compFrame, compWindow } from './ProdScene';

const I: M2 = [[1, 0], [0, 1]];

describe('composition story (visualisation «Composing Transformations»)', () => {
  for (const p of COMP_PRESETS) {
    const { A, B } = p;
    it(`${p.en}: each step's final frame shows what its caption says`, () => {
      expect(sameM(compFrame(A, B, 0, 1).M, I)).toBe(true);
      expect(sameM(compFrame(A, B, 1, 1).M, B)).toBe(true);
      expect(sameM(compFrame(A, B, 2, 1).M, mm(A, B))).toBe(true);
      expect(sameM(compFrame(A, B, 3, 1).M, mm(A, B))).toBe(true);
      expect(sameM(compFrame(A, B, 4, 1).M, A)).toBe(true);
      expect(sameM(compFrame(A, B, 5, 1).M, mm(B, A))).toBe(true);
      for (let s = 0; s < COMP_STEPS.length; s++) expect(compFrame(A, B, s, 1).fade).toBe(1);
    });
    it(`${p.en}: steps continue where the previous one stopped, new sequences restart at 𝕀`, () => {
      expect(sameM(compFrame(A, B, 1, 0).M, I)).toBe(true);
      expect(sameM(compFrame(A, B, 2, 0).M, B)).toBe(true);
      expect(sameM(compFrame(A, B, 3, 0).M, I)).toBe(true);
      expect(compFrame(A, B, 3, 0).fade).toBe(0);
      expect(sameM(compFrame(A, B, 5, 0).M, A)).toBe(true);
    });
    it(`${p.en}: window holds the F at every stage`, () => {
      const r = compWindow(A, B), bx = compBox(A, B);
      expect(bx.h / 400).toBeGreaterThan(0.6); expect(bx.h / 400).toBeLessThan(1.45);
      expect(bx.x[0] <= 0 && bx.x[1] >= 0 && bx.y[0] <= 0 && bx.y[1] >= 0).toBe(true);
      for (let s = 0; s < 6; s++) for (let k = 0; k <= 10; k++) {
        const M = compFrame(A, B, s, k / 10).M;
        for (const c of SHAPE_F) {
          const q = apply(M, c); expect(Math.abs(q[0])).toBeLessThan(r + 1e-9); expect(Math.abs(q[1])).toBeLessThan(r + 1e-9);
          expect(q[0]).toBeGreaterThan(bx.x[0]); expect(q[0]).toBeLessThan(bx.x[1]); expect(q[1]).toBeGreaterThan(bx.y[0]); expect(q[1]).toBeLessThan(bx.y[1]);
        }
      }
    });
  }
  it('labels: e, then b, then c; product hidden until it has been built', () => {
    const { A, B } = COMP_PRESETS[6];
    expect(compFrame(A, B, 0, 1).names).toEqual(['e_1', 'e_2']);
    expect(compFrame(A, B, 1, 1).names).toEqual(['b_1', 'b_2']);
    expect(compFrame(A, B, 2, 1).names).toEqual(['c_1', 'c_2']);
    expect(compFrame(A, B, 5, 1).names).toEqual(['d_1', 'd_2']);
    expect(compFrame(A, B, 1, 1).productShown).toBe(false);
    expect(compFrame(A, B, 2, 1).productShown).toBe(true);
    expect(compFrame(A, B, 4, 1).productShown).toBe(false);
    expect(compFrame(A, B, 5, 1).productShown).toBe(true);
    expect(compFrame(A, B, 2, 1).first).toEqual(B);
    expect(compFrame(A, B, 1, 1).ghosts.map((g) => g.v)).toEqual([[1, 1], [-2, 0]]);
  });
  it('slide example: AB = (2 0; 1 −2), BA = (−2 2; 0 2), (AB)x = A(Bx)', () => {
    const { A, B } = COMP_PRESETS[6];
    expect(mm(A, B)).toEqual([[2, 0], [1, -2]]);
    expect(mm(B, A)).toEqual([[-2, 2], [0, 2]]);
    const c = chain(A, B, X_PT);
    expect(c.Bx).toEqual([-3, 1]);
    expect(c.ABx).toEqual([2, -3]);
    expect(c.Cx).toEqual(c.ABx);
    expect(c.Dx).toEqual(c.BAx);
  });
  it('commuting presets: Flip → Flip and 45° → 45° give BA = AB; Shear → Undo gives 𝕀', () => {
    for (const k of [3, 4]) { const { A, B } = COMP_PRESETS[k]; expect(sameM(mm(A, B), mm(B, A))).toBe(true); }
    const { A, B } = COMP_PRESETS[5];
    expect(sameM(mm(A, B), I)).toBe(true);
    for (const k of [0, 1, 2, 6]) { const { A: a, B: b } = COMP_PRESETS[k]; expect(sameM(mm(a, b), mm(b, a))).toBe(false); }
  });
});
