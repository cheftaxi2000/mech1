import { describe, expect, it } from 'vitest';
import { analyze, apply, I2, interp, mm, norm, sub, type M2, type V2 } from './plane2';
import { TR_PRESETS, chooseInputs, columnSum, effect, findInput, firstInput, inv2, morph, morphPoints } from './transform';

const close = (u: V2, v: V2, e = 1e-9) => Math.abs(u[0] - v[0]) < e && Math.abs(u[1] - v[1]) < e;

describe('slides 15–17 (3Blue1Brown stills): (3 1; 1 2) applied to (−1, 2)', () => {
  const A: M2 = [[3, 1], [1, 2]];
  it('the columns are the images of e₁ and e₂', () => {
    expect(apply(A, [1, 0])).toEqual([3, 1]);
    expect(apply(A, [0, 1])).toEqual([1, 2]);
  });
  it('(3, 1)·(−1) + (1, 2)·(2) = (−1, 3) = A(−1, 2)', () => {
    expect(columnSum(A, [-1, 2])).toEqual([-1, 3]);
    expect(apply(A, [-1, 2])).toEqual([-1, 3]);
  });
  it('the preset «Full rank II» starts with exactly this input', () => {
    const p = TR_PRESETS.find((q) => q.id === 'full2')!;
    expect(p.x).toEqual([-1, 2]);
    expect(apply(p.A, p.x!)).toEqual(p.b);
  });
});

describe('slides 18–20: (1 −2; 2 −4) collapses the plane onto a line', () => {
  const A: M2 = [[1, -2], [2, -4]];
  it('rank 1: both columns on the line through (1, 2)', () => {
    expect(analyze(A, [0, 0]).r).toBe(1);
    expect(effect(A)).toBe('line');
  });
  it('(1, 2)(−2) + (−2, −4)(−2) = (2, 4)', () => {
    expect(columnSum(A, [-2, -2])).toEqual([2, 4]);
  });
  it('LA-001: A(1, −2) = (1, 2)·1 + (−2, −4)·(−2) = (5, 10), not (−1, −2) as the slide writes with the coefficient 3', () => {
    expect(apply(A, [1, -2])).toEqual([5, 10]);
    expect(columnSum(A, [3, -2])).toEqual([7, 14]); // the slide's coefficients (3, −2) give neither
    expect(apply(A, [3, 2])).toEqual([-1, -2]);     // (−1, −2) would be the image of (3, 2)
  });
  it('every image lies on the line y = 2x', () => {
    for (const x of [[-2, -2], [1, -2], [3, 1], [0.5, 4]] as V2[]) { const y = apply(A, x); expect(y[1]).toBeCloseTo(2 * y[0], 12); }
  });
});

describe('slide 21: where would these vectors land?', () => {
  it('identity: (7, 19) stays (7, 19) = 7·(1, 0) + 19·(0, 1)', () => {
    expect(apply(I2, [7, 19])).toEqual([7, 19]);
    expect(columnSum(I2, [7, 19])).toEqual([7, 19]);
  });
  it('(2 −3; 1 2)(1, 2) = (2, 1)(1) + (−3, 2)(2) = (−4, 5)', () => {
    expect(apply([[2, -3], [1, 2]], [1, 2])).toEqual([-4, 5]);
  });
  it('(1 −2; 2 −4)(−2, 1) = (1, 2)(−2) + (−2, −4)(1) = (−4, −8)', () => {
    expect(apply([[1, -2], [2, -4]], [-2, 1])).toEqual([-4, -8]);
  });
});

describe('explorer maths', () => {
  it('the morph starts at the identity and ends at A; a rotation keeps lengths on the way', () => {
    for (const p of TR_PRESETS) {
      expect(close(morph(p.A, 0, [2, -1]), [2, -1])).toBe(true);
      expect(close(morph(p.A, 1, [2, -1]), apply(p.A, [2, -1]))).toBe(true);
    }
    const R: M2 = [[0, -1], [1, 0]];
    for (const t of [0.2, 0.5, 0.8]) expect(norm(morph(R, t, [1, 0]))).toBeCloseTo(1, 12);
    expect(interp(R, 0.5)[0][0]).toBeCloseTo(Math.SQRT1_2, 12);
  });
  it('find the input, rank 2: x = A⁻¹b, and A⁻¹A = I', () => {
    for (const p of TR_PRESETS.filter((q) => analyze(q.A, q.b).r === 2)) {
      const f = findInput(p.A, p.b);
      expect(f.kind).toBe('unique');
      expect(close(apply(p.A, f.x), p.b)).toBe(true);
      const I = mm(inv2(p.A)!, p.A);
      expect(close([I[0][0], I[0][1]], [1, 0])).toBe(true); expect(close([I[1][0], I[1][1]], [0, 1])).toBe(true);
    }
    expect(findInput([[2, 3], [1, -2]], [-1, 3])).toEqual({ kind: 'unique', x: [1, -1] });
    expect(inv2([[1, -2], [2, -4]])).toBeNull();
  });
  it('find the input, rank 1: a whole line of inputs lands on b; b off the line: none (closest point)', () => {
    const A: M2 = [[1, -2], [2, -4]];
    const f = findInput(A, [-1, -2]);
    expect(f.kind).toBe('line');
    if (f.kind === 'line') for (const a of [-2, 0.5, 3]) expect(close(apply(A, [f.x[0] + a * f.dir[0], f.x[1] + a * f.dir[1]]), [-1, -2])).toBe(true);
    const g = findInput(A, [1, 4]);
    expect(g.kind).toBe('none');
    if (g.kind === 'none') { expect(close(apply(A, g.x), g.closest)).toBe(true); expect(norm(sub(g.closest, [1, 4]))).toBeGreaterThan(0.5); }
  });
  it('find the input, rank 0', () => {
    expect(findInput([[0, 0], [0, 0]], [0, 0]).kind).toBe('all');
    expect(findInput([[0, 0], [0, 0]], [1, 1]).kind).toBe('none0');
  });
  it('first inputs: solution of the preset system; the two traced inputs differ from it and from each other in direction', () => {
    for (const p of TR_PRESETS) {
      const an = analyze(p.A, p.b), x5 = p.x ?? firstInput(an);
      if (an.kind === 'unique' || an.kind === 'infinite') expect(close(apply(p.A, x5), p.b)).toBe(true);
      const [u, v] = chooseInputs(p.A, p.b, an, x5);
      const cr = (a: V2, b: V2) => Math.abs(a[0] * b[1] - a[1] * b[0]);
      expect(cr(u, v)).toBeGreaterThan(0.1);
      if (norm(x5) > 0) { expect(cr(u, x5)).toBeGreaterThan(0.1); expect(cr(v, x5)).toBeGreaterThan(0.1); }
    }
  });
  it('morphPoints samples the arc of a rotation', () => {
    const pts = morphPoints([[0, -1], [1, 0]], [[2, 0]]);
    expect(pts.length).toBe(5);
    expect(pts.some((q) => q[0] > 1 && q[1] > 1)).toBe(true);
  });
});
