import { describe, expect, it } from 'vitest';
import { macrostateW, mulberry32, sampleConfig } from '../../chem/entropy';
import { LS, countLeft, latticeScene, siteCenter } from './latticeScene';
import { expectInside, expectNoOverlap, lab, shape } from './cTestKit';

describe('lattice of microstates (slides 17–19, 21)', () => {
  it('20 distinct sites inside the box, 10 per chamber', () => {
    const pts = Array.from({ length: 20 }, (_, c) => siteCenter(c));
    expect(new Set(pts.map((p) => p.join(','))).size).toBe(20);
    const px = LS.x0 + 5 * LS.cell;
    expect(pts.slice(0, 10).every((p) => p[0] < px)).toBe(true); expect(pts.slice(10).every((p) => p[0] > px)).toBe(true);
  });
  it('closed: particles are drawn only on the left, N circles; open: anywhere', () => {
    const rnd = mulberry32(5);
    const closed = latticeScene(6, false, sampleConfig(10, 6, rnd), [], 'de');
    expect(closed.shapes.filter((s) => /^p\d/.test(s.key))).toHaveLength(6);
    expect(closed.shapes.filter((s) => /^p\d/.test(s.key)).every((s) => s.pts[0][0] < LS.x0 + 5 * LS.cell)).toBe(true);
    expect(shape(closed, 'partition')!.cls).toBe('th-wall');
    const open = latticeScene(6, true, sampleConfig(20, 6, rnd), [], 'de');
    expect(shape(open, 'partition')!.cls).toBe('th-wall-dash');
  });
  it('histogram bar heights are proportional to the exact W(k); the largest is full height', () => {
    const N = 10, w = macrostateW(10, N), s = latticeScene(N, true, sampleConfig(20, N, mulberry32(1)), [], 'de');
    const wmax = Math.max(...w);
    w.forEach((v, k) => expect(shape(s, `h${k}`)!.pts[1][1]).toBeCloseTo(Math.max(2, (v / wmax) * LS.hmax), 9));
    expect(shape(s, 'h5')!.pts[1][1]).toBeCloseTo(LS.hmax, 9);
  });
  it('closed box: a single bar at k = N, of height proportional to W_i = C(10, N) (almost invisible for N = 10)', () => {
    const s = latticeScene(10, false, sampleConfig(10, 10, mulberry32(1)), [], 'de');
    expect(s.shapes.filter((x) => /^h\d/.test(x.key)).map((x) => x.key)).toEqual(['h10']);
    expect(shape(s, 'h10')!.pts[1][1]).toBe(2);
    const s6 = latticeScene(6, false, sampleConfig(10, 6, mulberry32(1)), [], 'de');
    expect(s6.shapes.filter((x) => /^h\d/.test(x.key)).map((x) => x.key)).toEqual(['h6']);
  });
  it('the current macrostate k is highlighted and equals the number of particles on the left', () => {
    const cfg = [1, 4, 12, 15];
    expect(countLeft(cfg)).toBe(2);
    const s = latticeScene(4, true, cfg, [0, 0, 3, 0, 0], 'de');
    expect(s.data.k).toBe(2); expect(shape(s, 'h2')!.cls).toContain('th-now'); expect(lab(s, 'lab-k')?.tex).toBe('k = 2');
    expect(shape(s, 'd2')).toBeDefined(); expect(shape(s, 'd1')).toBeUndefined();
  });
  it('inside the figure and no overlapping labels for every N, open and closed', () => {
    const cases: [number, boolean][] = []; for (let N = 1; N <= 10; N++) { cases.push([N, true]); cases.push([N, false]); }
    const build = (s: number, _t: number, l: 'de' | 'en') => latticeScene(cases[s][0], cases[s][1], sampleConfig(cases[s][1] ? 20 : 10, cases[s][0], mulberry32(s)), Array(cases[s][0] + 1).fill(1), l);
    expectInside(build, cases.length); expectNoOverlap(build, cases.length);
  });
});
