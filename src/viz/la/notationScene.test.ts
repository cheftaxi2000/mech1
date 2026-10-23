import { describe, expect, it } from 'vitest';
import { SYSTEM, TOKEN_IDS, notationScene } from './notationScene';

const vis = (step: number, t = 1) => notationScene(step, t).filter((k) => k.o > 0.999);
const nums = (step: number) => vis(step).filter((k) => k.kind === 'tok' && k.role === 'num').map((k) => k.tex);

describe('notation morph (Übung 2, slide 25)', () => {
  it('token ids are unique', () => expect(new Set(TOKEN_IDS).size).toBe(TOKEN_IDS.length));
  it('every token stays inside the stage in every frame', () => {
    for (let s = 0; s < 4; s++) for (const t of [0, 0.25, 0.5, 0.75, 1]) for (const k of notationScene(s, t)) {
      expect(k.x, `${k.id} x`).toBeGreaterThanOrEqual(3); expect(k.x, `${k.id} x`).toBeLessThanOrEqual(97);
      expect(k.y, `${k.id} y`).toBeGreaterThanOrEqual(3); expect(k.y, `${k.id} y`).toBeLessThanOrEqual(97);
      expect(k.o).toBeGreaterThanOrEqual(0); expect(k.o).toBeLessThanOrEqual(1);
    }
  });
  it('step 1 final: standard form, nine unknowns, the signs, three equals signs, no brackets', () => {
    const f = vis(0);
    expect(f.filter((k) => k.role === 'var')).toHaveLength(9);
    expect(f.filter((k) => k.id.startsWith('eq'))).toHaveLength(3);
    expect(f.filter((k) => k.kind !== 'tok')).toHaveLength(0);
    // 3x₁ + 2x₂ − x₃ = 2: the magnitudes in layout 0 (1 is not written)
    const row = (r: number) => f.filter((k) => Math.abs(k.y - 36 - 22 * r) < 1).sort((a, b) => a.x - b.x).map((k) => k.tex).join(' ');
    expect(row(0)).toBe('3 x_1 + 2 x_2 - x_3 = 2');
    expect(row(1)).toBe('x_1 - 2 x_2 - 2 x_3 = 0');
    expect(row(2)).toBe('-2 x_1 + x_2 + x_3 = 3');
  });
  it('step 2 final: A x = b with three bracket pairs, the signed numbers, x in a column, no plus/minus signs', () => {
    const f = vis(1);
    expect(f.filter((k) => k.kind === 'brL')).toHaveLength(3);
    expect(f.filter((k) => k.kind === 'brR')).toHaveLength(3);
    expect(f.filter((k) => k.role === 'var').map((k) => k.tex).sort()).toEqual(['x_1', 'x_2', 'x_3']);
    expect(f.filter((k) => k.role === 'op' && k.id.startsWith('s'))).toHaveLength(0);
    const A = f.filter((k) => /^a\d\d$/.test(k.id));
    expect(A.map((k) => Number(k.tex)).sort()).toEqual(SYSTEM.flatMap((r) => r.slice(0, 3)).sort());
  });
  it('step 3 final: augmented matrix with headers x₁ x₂ x₃ | 1 above the columns and the bar', () => {
    const f = vis(2);
    const heads = f.filter((k) => k.y < 20).sort((a, b) => a.x - b.x).map((k) => k.tex);
    expect(heads).toEqual(['x_1', 'x_2', 'x_3', '1']);
    expect(f.filter((k) => k.kind === 'bar')).toHaveLength(1);
    expect(f.filter((k) => k.kind === 'brL')).toHaveLength(1);
    expect(f.filter((k) => k.id.startsWith('eq'))).toHaveLength(0);
  });
  it('step 4 final: headers dropped, only the twelve numbers, one pair of brackets and the bar', () => {
    const f = vis(3);
    expect(f.filter((k) => k.role === 'var')).toHaveLength(0);
    expect(nums(3)).toHaveLength(12);
    const want = SYSTEM.flat().map(String).sort();
    expect(nums(3).sort()).toEqual(want);
    expect(f.filter((k) => k.kind !== 'tok').map((k) => k.kind).sort()).toEqual(['bar', 'brL', 'brR']);
    // the right-hand sides sit right of the bar, the coefficients left of it
    const bar = f.find((k) => k.kind === 'bar')!.x;
    for (const k of f.filter((k) => /^a\d\d$/.test(k.id))) expect(k.x).toBeLessThan(bar);
    for (const k of f.filter((k) => /^b\d$/.test(k.id))) expect(k.x).toBeGreaterThan(bar);
  });
  it('a number keeps its row while it glides (rows never mix)', () => {
    for (let s = 1; s < 4; s++) for (const k of notationScene(s, 0.5).filter((k) => /^b\d$/.test(k.id))) {
      expect([36, 58, 80]).toContain(Math.round(k.y));
    }
  });
});
