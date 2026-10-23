import { describe, expect, it } from 'vitest';
import { mat, solve } from './gauss';
import { num } from './frac';
import { CANCEL_EXAMPLE, PIVOT_EXAMPLE, RANK_PRESETS, printedRule, rankInfo, seriesCase, seriesSystem, seriesUnique } from './rankInfo';
import { traceGauss } from './gaussTrace';

describe('rankInfo: the table of slide 8', () => {
  it('the three small matrices of the slide: none (m=3, r=2), unique (m=n=r=3), infinite (n=3, r=2, 1 free)', () => {
    const [none, unique, infinite] = RANK_PRESETS.slice(0, 3).map((p) => rankInfo(p.aug));
    expect(none).toMatchObject({ m: 3, n: 3, r: 2, rAug: 3, kind: 'none' });
    expect(unique).toMatchObject({ r: 3, kind: 'unique', free: 0, solvableForAll: true, uniqueForAll: true });
    expect(infinite).toMatchObject({ r: 2, rAug: 2, kind: 'infinite', free: 1, solvableForAll: false });
  });
  it('rank rule for any m × n: none ⇔ rank[A|b] > rank A; unique ⇔ consistent and r = n (R-LA-002)', () => {
    for (const p of RANK_PRESETS) {
      const i = rankInfo(p.aug);
      expect(i.kind === 'none').toBe(i.rAug > i.r);
      if (i.kind !== 'none') expect(i.kind === 'unique').toBe(i.r === i.n);
      expect(i.kind).toBe(solve(p.aug).kind);
    }
  });
  it('the printed condition of the slide is too narrow: tall unique system (m=3, n=2) and «b_i ≠ 0 for all i > r»', () => {
    const tall = rankInfo(RANK_PRESETS.find((p) => p.id === 'tall')!.aug);
    expect(tall).toMatchObject({ m: 3, n: 2, r: 2, kind: 'unique' });
    expect(printedRule(tall).unique).toBe(false); // «r = n = m» fails although the solution is unique
    // two dependent rows, one of them inconsistent: the printed «∀ i > r» fails, yet there is no solution
    const two = rankInfo(mat([[1, 1, 1], [0, 0, 0], [0, 0, 1]]));
    expect(two).toMatchObject({ r: 1, kind: 'none' });
    expect(printedRule(two).none).toBe(false);
  });
  it('solvable for every b ⇔ r = m (full row rank): the wide preset has rank 2 = m', () => {
    expect(rankInfo(RANK_PRESETS.find((p) => p.id === 'wide')!.aug).solvableForAll).toBe(true);
    expect(rankInfo(RANK_PRESETS.find((p) => p.id === 'wideNone')!.aug).solvableForAll).toBe(false);
    // r = m for A alone: whatever b we pick, the system has a solution
    for (const b of [[0, 0], [1, 5], [-3, 2]]) expect(solve(mat([[1, 1, 1, b[0]], [1, 2, 3, b[1]]])).kind).not.toBe('none');
  });
});

describe('slide 5: R⁴ example', () => {
  it('pivots in columns 1, 2, 4; x₃ free; rank 3; one zero row', () => {
    const i = rankInfo(PIVOT_EXAMPLE);
    expect(i).toMatchObject({ m: 4, n: 4, r: 3, kind: 'infinite', free: 1, zeroRows: 1 });
    expect(solve(PIVOT_EXAMPLE).pivotCols).toEqual([0, 1, 3]);
  });
});

describe('rank animation: a dependent equation cancels to a zero row (slide 7)', () => {
  it('III − I − II ends in (0 0 0 | 0)', () => {
    const tr = traceGauss(CANCEL_EXAMPLE);
    expect(tr.echelon.map((r) => r.map(num))).toEqual([[1, 1, 1, 2], [0, 1, 2, 1], [0, 0, 0, 0]]);
    expect(rankInfo(CANCEL_EXAMPLE)).toMatchObject({ r: 2, zeroRows: 1, kind: 'infinite' });
  });
});

describe('Series 2, problem 2 (slides 9–11)', () => {
  it('the four cases (a)–(d) as the slides give them', () => {
    expect(rankInfo(seriesSystem(0, 0))).toMatchObject({ r: 1, free: 2, kind: 'infinite' });
    expect(rankInfo(seriesSystem(2, 0))).toMatchObject({ r: 2, free: 1, kind: 'infinite' });
    expect(rankInfo(seriesSystem(2, 3))).toMatchObject({ r: 3, kind: 'unique' });
    expect(rankInfo(seriesSystem(0, 3))).toMatchObject({ kind: 'none' });
    expect([[0, 0], [2, 0], [2, 3], [0, 3]].map(([a, b]) => seriesCase(a, b))).toEqual(['a', 'b', 'c', 'd']);
  });
  it('the case agrees with the rank analysis for all integer a, b in [−3, 3]', () => {
    const want = { a: ['infinite', 2], b: ['infinite', 1], c: ['unique', 0], d: ['none', 0] } as const;
    for (let a = -3; a <= 3; a++) for (let b = -3; b <= 3; b++) {
      const i = rankInfo(seriesSystem(a, b));
      expect([i.kind, i.free]).toEqual(want[seriesCase(a, b)]);
    }
  });
  it('(a): L = {((5 − 4β)/3, α, β)}; (b): (5/3, α, 0); (c): ((15a − 4b)/(9a), 0, b/(3a)) — computed by us', () => {
    const sa = solve(seriesSystem(0, 0));
    expect(sa.particular!.map(num)).toEqual([5 / 3, 0, 0]);
    expect(sa.dirs!.map((d) => d.map(num))).toEqual([[0, 1, 0], [-4 / 3, 0, 1]]);
    const sb = solve(seriesSystem(2, 0));
    expect(sb.particular!.map(num)).toEqual([5 / 3, 0, 0]);
    expect(sb.dirs!.map((d) => d.map(num))).toEqual([[0, 1, 0]]);
    for (const [a, b] of [[1, 1], [2, 3], [-1, 2], [3, -2]]) {
      const sc = solve(seriesSystem(a, b));
      const x = seriesUnique(a, b);
      expect(sc.particular!.map(num).map((v, i) => v - x[i]).every((d) => Math.abs(d) < 1e-9)).toBe(true);
    }
  });
});
