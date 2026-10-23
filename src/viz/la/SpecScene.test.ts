import { describe, expect, it } from 'vitest';
import { isAntisymmetric, transpose } from '../../linalg/special';
import { ANTI_STEPS, S_A, TRANSPOSE_STEPS, T_A, antiFrame, transposeFrame } from './SpecScene';

/** The matrix a frame shows: value at its (rounded) position. */
function shown(f: ReturnType<typeof transposeFrame>): number[][] {
  const M = Array.from({ length: f.n }, () => Array(f.n).fill(NaN));
  for (const c of f.cells) M[Math.round(c.y)][Math.round(c.x)] = Number(c.tex);
  return M;
}

describe('transpose animation (slide 33)', () => {
  it('step 1 shows A with the mirror line', () => {
    const f = transposeFrame(0, 1);
    expect(shown(f)).toEqual(T_A);
    expect(f.mirror).toBe(1);
    expect(f.title).toBe('A');
    expect(f.cells.filter((c) => c.cls === 'diag').map((c) => c.tex)).toEqual(['1', '5', '9']);
  });
  it('step 2 ends with row 1 as column 1', () => {
    const M = shown(transposeFrame(1, 1));
    expect(M.map((r) => r[0])).toEqual([1, 2, 3]);
    expect(M[0]).toEqual([1, 4, 7]);
    expect(M[1].slice(1)).toEqual([5, 6]); // rest untouched
  });
  it('step 3 and 4 end with Aᵀ', () => {
    expect(shown(transposeFrame(2, 1))).toEqual(transpose(T_A));
    const f = transposeFrame(3, 1);
    expect(shown(f)).toEqual(transpose(T_A));
    expect(f.title).toBe('A^T');
  });
  it('the diagonal never moves; every frame stays inside the grid', () => {
    for (let s = 0; s < TRANSPOSE_STEPS; s++) for (let k = 0; k <= 10; k++) {
      const f = transposeFrame(s, k / 10);
      for (const c of f.cells) {
        expect(c.x).toBeGreaterThanOrEqual(-0.5); expect(c.x).toBeLessThanOrEqual(2.5);
        expect(c.y).toBeGreaterThanOrEqual(-0.5); expect(c.y).toBeLessThanOrEqual(2.5);
        if (c.key[0] === c.key[1]) expect([c.x, c.y]).toEqual([+c.key[1], +c.key[0]]);
      }
    }
  });
  it('a moving number crosses only the mirror (diagonal) cells, never another resting one (the cells are boxes about 0.44 × 0.37 cell units)', () => {
    for (let s = 0; s < TRANSPOSE_STEPS; s++) for (let k = 0; k <= 40; k++) {
      const c = transposeFrame(s, k / 40).cells;
      for (const a of c) for (const b of c) {
        if (a === b || a.cls !== 'move' || b.cls === 'move' || b.cls === 'diag') continue; // only the mirror cells may be crossed
        expect(Math.abs(a.x - b.x) >= 0.44 || Math.abs(a.y - b.y) >= 0.37, `step ${s} t ${k / 40}: ${a.key} at ${a.x.toFixed(2)},${a.y.toFixed(2)} over ${b.key}`).toBe(true);
      }
    }
  });
});

describe('antisymmetric diagonal (slide 36)', () => {
  it('example is antisymmetric', () => { expect(isAntisymmetric(S_A)).toBe(true); });
  it('step 1 highlights the partners 2 and −2', () => {
    const f = antiFrame(0, 1);
    expect(f.cells.find((c) => c.key === '01')!.cls).toBe('me');
    expect(f.cells.find((c) => c.key === '10')!.tex).toBe('-2');
    expect(f.arcs).toHaveLength(3);
  });
  it('step 2: S22 is its own partner (self arc, shows a); step 3 final frame shows 0', () => {
    expect(antiFrame(1, 1).cells.find((c) => c.key === '11')!.tex).toBe('a');
    expect(antiFrame(1, 1).arcs[0].self).toBe(true);
    expect(antiFrame(2, 1).cells.find((c) => c.key === '11')!.tex).toBe('0');
    expect(antiFrame(2, 1).eq).toContain('S_{22} = 0');
    expect(ANTI_STEPS).toBe(3);
  });
});
