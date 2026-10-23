import { describe, expect, it } from 'vitest';
import { mat, mulVec, coeffs, rhs, solve } from './gauss';
import { eq, num, q } from './frac';
import { ROMAN, linTex, opTex, solutionForms, solutionSetTex, traceGauss } from './gaussTrace';

const nums = (m: readonly (readonly (readonly [number, number])[])[]) => m.map((r) => r.map(num));
const SLIDE = mat([[1, 1, 1, 6], [1, 2, 1, 8], [2, 3, 5, 23]]);

describe('row operations in the TA notation', () => {
  it('II − I, III − 2·I, III + I, 1/3·III, I ↔ II', () => {
    expect(opTex({ kind: 'add', target: 1, source: 0, factor: q(-1) })).toBe('\\mathrm{II} - \\mathrm{I}');
    expect(opTex({ kind: 'add', target: 2, source: 0, factor: q(-2) })).toBe('\\mathrm{III} - 2\\cdot \\mathrm{I}');
    expect(opTex({ kind: 'add', target: 2, source: 1, factor: q(1) })).toBe('\\mathrm{III} + \\mathrm{II}');
    expect(opTex({ kind: 'add', target: 1, source: 0, factor: q(-1, 2) })).toBe('\\mathrm{II} - \\frac{1}{2}\\cdot \\mathrm{I}');
    expect(opTex({ kind: 'scale', row: 2, factor: q(1, 3) })).toBe('\\frac{1}{3}\\cdot \\mathrm{III}');
    expect(opTex({ kind: 'swap', i: 0, j: 1 })).toBe('\\mathrm{I} \\leftrightarrow \\mathrm{II}');
    expect(ROMAN.slice(0, 3)).toEqual(['I', 'II', 'III']);
  });
});

describe('linear forms and solution sets', () => {
  it('(5 − 4β)/3, −α, 7, 0', () => {
    expect(linTex({ c: q(5, 3), p: [q(0), q(-4, 3)] })).toBe('\\frac{5-4\\beta}{3}');
    expect(linTex({ c: q(0), p: [q(-1)] })).toBe('-\\alpha');
    expect(linTex({ c: q(7), p: [] })).toBe('7');
    expect(linTex({ c: q(0), p: [q(0)] })).toBe('0');
    expect(linTex({ c: q(-9), p: [q(-3)] })).toBe('-9-3\\alpha');
  });
  it('R⁴ example of Übung 4, slide 5: (−9−3α, (−2−α)/2, α, 5)', () => {
    const s = solve(mat([[1, 0, 3, 2, 1], [0, 2, 1, 1, 3], [0, 0, 0, 1, 5], [0, 0, 0, 0, 0]]));
    expect(solutionForms(s).map((l) => linTex(l))).toEqual(['-9-3\\alpha', '\\frac{-2-\\alpha}{2}', '\\alpha', '5']);
  });
  it('slide 36 has two free parameters, slide 34 the empty set, slide 33 one point', () => {
    expect(solutionSetTex(solve(mat([[1, 1, 1, 2], [2, 2, 2, 4], [3, 3, 3, 6]])))).toContain('\\alpha,\\beta');
    expect(solutionSetTex(solve(mat([[1, 1, 2], [2, 2, 5]])))).toBe('L = \\varnothing');
    expect(solutionSetTex(solve(mat([[1, 1, 3], [2, -1, 0]])))).toBe('L = \\left\\{ \\begin{pmatrix}1\\\\2\\end{pmatrix} \\right\\}');
  });
  it('Series 2 (a): L = {((5 − 4β)/3, α, β)} and every member solves the system', () => {
    const s = solve(mat([[3, 0, 4, 5], [0, 0, 0, 0], [0, 0, 0, 0]]));
    expect(solutionForms(s).map((l) => linTex(l))).toEqual(['\\frac{5-4\\beta}{3}', '\\alpha', '\\beta']);
    for (const [a, b] of [[0, 0], [1, 2], [-3, 5]]) {
      const x = solutionForms(s).map((l) => num(l.c) + num(l.p[0]) * a + num(l.p[1]) * b);
      expect(3 * x[0] + 4 * x[2]).toBeCloseTo(5);
    }
  });
});

describe('the frames of the slide example (Übung 2, slides 26–30)', () => {
  const tr = traceGauss(SLIDE);
  const kinds = tr.frames.map((f) => f.kind);
  it('order: start, pivot/ops, pivot/ops, echelon, three back-substitution rows, reduced steps, reduced, verdict', () => {
    expect(kinds.slice(0, 6)).toEqual(['start', 'pivot', 'ops', 'pivot', 'ops', 'echelon']);
    expect(kinds.slice(6, 9)).toEqual(['back', 'back', 'back']);
    expect(kinds.slice(-2)).toEqual(['reduced', 'verdict']);
  });
  it('first pivot (1,1) with multiples −1 and −2, then the notes II − I and III − 2·I', () => {
    const p = tr.frames[1];
    expect(p.pivot).toEqual([0, 0]);
    expect(p.mult.map((m) => [m.row, num(m.factor)])).toEqual([[1, -1], [2, -2]]);
    expect(nums(p.m)).toEqual([[1, 1, 1, 6], [1, 2, 1, 8], [2, 3, 5, 23]]);
    const o = tr.frames[2];
    expect(o.notes.map((n) => n.tex)).toEqual(['\\mathrm{II} - \\mathrm{I}', '\\mathrm{III} - 2\\cdot \\mathrm{I}']);
    expect(nums(o.m)).toEqual([[1, 1, 1, 6], [0, 1, 0, 2], [0, 1, 3, 11]]);
    expect(o.focusCol).toBe(0);
  });
  it('second round: pivot (2,2), multiple −1 for row III; echelon form (1 1 1|6; 0 1 0|2; 0 0 3|9) with 3 pivots', () => {
    expect(tr.frames[3].pivot).toEqual([1, 1]);
    expect(tr.frames[3].mult.map((m) => [m.row, num(m.factor)])).toEqual([[2, -1]]);
    expect(nums(tr.echelon)).toEqual([[1, 1, 1, 6], [0, 1, 0, 2], [0, 0, 3, 9]]);
    expect(tr.frames[5].done).toEqual([[0, 0], [1, 1], [2, 2]]);
  });
  it('back substitution as on slide 30: x₃ = 3, x₂ = 2, x₁ = 1 (with the values put in)', () => {
    const b = tr.frames[8].back;
    expect(b.map((r) => r.val)).toEqual(['x_3 = 3', 'x_2 = 2', 'x_1 = 1']);
    expect(b[0].eq).toBe('3x_3 = 9');
    expect(b[2].subst).toBe('x_1+2+3 = 6');
  });
  it('reduced form is the identity on the left (slide 30); verdict is the unique solution', () => {
    expect(nums(tr.reduced)).toEqual([[1, 0, 0, 1], [0, 1, 0, 2], [0, 0, 1, 3]]);
    expect(tr.frames.at(-1)!.sol!.kind).toBe('unique');
  });
  it('the solution satisfies A x = b', () => {
    const s = solve(SLIDE);
    expect(mulVec(coeffs(SLIDE), s.particular!).every((v, i) => eq(v, rhs(SLIDE)[i]))).toBe(true);
  });
});

describe('other presets', () => {
  it('slide 34 (no solution): ends in a verdict naming the row (0 0 | 1)', () => {
    const tr = traceGauss(mat([[1, 1, 2], [2, 2, 5]]));
    expect(tr.frames.map((f) => f.kind)).toEqual(['start', 'pivot', 'ops', 'echelon', 'verdict']);
    expect(tr.frames.at(-1)!.bad).toBe(1);
  });
  it('slide 32 (more columns than rows): free variable x₂ = α, x₃ = 0, x₁ = 1 − α', () => {
    const tr = traceGauss(mat([[1, 1, 3, 1], [2, 2, -1, 2]]));
    expect(nums(tr.echelon)).toEqual([[1, 1, 3, 1], [0, 0, -7, 0]]);
    const free = tr.frames.find((f) => f.kind === 'free')!;
    expect(free.free).toEqual(['x_2 = \\alpha']);
    const last = tr.frames.at(-1)!;
    expect(last.back.map((r) => r.val)).toEqual(['x_3 = 0', 'x_1 = 1-\\alpha']);
  });
  it('slide 35: multiples −2, −3, −10', () => {
    const tr = traceGauss(mat([[1, -2, 3, 7], [2, -3, 4, 11], [3, 4, -2, 0]]));
    const mults = tr.frames.filter((f) => f.kind === 'pivot').flatMap((f) => f.mult.map((m) => num(m.factor)));
    expect(mults).toEqual([-2, -3, -10]);
    expect(tr.frames.at(-1)!.back.map((r) => r.val)).toEqual(['x_3 = 1', 'x_2 = -1', 'x_1 = 2']);
  });
  it('slide 36: two free parameters, x₁ = 2 − α − β', () => {
    const tr = traceGauss(mat([[1, 1, 1, 2], [2, 2, 2, 4], [3, 3, 3, 6]]));
    expect(tr.sol.rank).toBe(1);
    expect(tr.frames.find((f) => f.kind === 'free')!.free).toEqual(['x_2 = \\alpha', 'x_3 = \\beta']);
    expect(tr.frames.at(-1)!.back.map((r) => r.val)).toEqual(['x_1 = 2-\\alpha-\\beta']);
  });
  it('a pivot that is 0 triggers a row swap frame', () => {
    const tr = traceGauss(mat([[0, 1, 1], [1, 1, 3]]));
    expect(tr.frames[1].kind).toBe('swap');
    expect(tr.frames[1].notes[0].tex).toBe('\\mathrm{I} \\leftrightarrow \\mathrm{II}');
  });
});

describe('several right-hand sides in one table (slide 37)', () => {
  it('one elimination of [A | b₁ b₂] solves both: (1, 2, 3) and (1, 1, 1)', async () => {
    const { MULTI_RHS } = await import('./gaussTrace');
    const { eliminate, reduce } = await import('./gauss');
    const e = eliminate(MULTI_RHS, 3);
    expect(nums(e.result)).toEqual([[1, 1, 1, 6, 3], [0, 1, 0, 2, 1], [0, 0, 3, 9, 3]]);
    expect(nums(reduce(e, 3).result)).toEqual([[1, 0, 0, 1, 1], [0, 1, 0, 2, 1], [0, 0, 1, 3, 1]]);
  });
});
