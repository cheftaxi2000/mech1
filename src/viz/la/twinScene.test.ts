import { describe, expect, it } from 'vitest';
import { mat, eliminate, reduce } from '../../linalg/gauss';
import { num } from '../../linalg/frac';
import { E1, E2, POINT, STAGES, twinScene, type Eq3 } from './twinScene';

const through = (l: Eq3) => l[0] * POINT[0] + l[1] * POINT[1] - l[2];

describe('geometric twin of the Gauss steps (slide 33)', () => {
  it('the intersection (1, 2) lies on both lines in EVERY frame: a row operation never moves the solution', () => {
    for (let s = 0; s < 4; s++) for (const t of [0, 0.2, 0.5, 0.8, 1]) {
      const f = twinScene(s, t);
      for (const l of f.lines) expect(through(l)).toBeCloseTo(0, 12);
    }
    expect(through(E1)).toBe(0); expect(through(E2)).toBe(0);
  });
  it('final frames: step 2 has a horizontal line II (x₂ = 2), step 3 a vertical line I (x₁ = 1), step 4 reads off (1, 2)', () => {
    const s2 = twinScene(1, 1);
    expect(s2.lines[1]).toEqual([0, -3, -6]);
    expect(s2.lines[0]).toEqual(E1);
    expect(s2.op).toBe('\\mathrm{II} - 2\\cdot \\mathrm{I}');
    const s3 = twinScene(2, 1);
    expect(s3.lines).toEqual([[1, 0, 1], [0, -3, -6]]);
    const s4 = twinScene(3, 1);
    expect(s4.reading).toBe(1); expect(s4.moving).toBeNull();
    expect(twinScene(0, 1).lines).toEqual([E1, E2]);
  });
  it('the stages are exactly what eliminate() and reduce() compute (II − 2·I, then the reduced row I)', () => {
    const e = eliminate(mat([[1, 1, 3], [2, -1, 0]]));
    expect(e.result.map((r) => r.map(num))).toEqual([[1, 1, 3], [0, -3, -6]]);
    const red = reduce(e).result.map((r) => r.map(num));
    expect(red).toEqual([[1, 0, 1], [0, 1, 2]]);
    expect(STAGES[1].map((l) => [...l])).toEqual([[1, 1, 3], [0, -3, -6]]);
  });
  it('the moving line is the ghost line being replaced; the other one stands still', () => {
    const f = twinScene(1, 0.5);
    expect(f.moving).toBe(1); expect(f.ghost?.eq).toEqual(E2); expect(f.lines[0]).toEqual(E1);
    const g = twinScene(2, 0.5);
    expect(g.moving).toBe(0); expect(g.lines[1]).toEqual([0, -3, -6]);
  });
});
