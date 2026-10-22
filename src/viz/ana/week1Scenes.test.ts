import { describe, expect, it } from 'vitest';
import { KB, MB, side } from '../../analysis/folgen';
import { geoSum } from '../../analysis/reihen';
import {
  GAUSS_STEPS, HALF_STEPS, HARM_STEPS, KB_STEPS, MB_STEPS, ROOT_N, ROOT_STEPS,
  gaussScene, halfScene, harmGroupOf, harmScene, kbScene, mbScene, rootScene, type Scene,
} from './week1Scenes';

const SCENES: [string, (s: number, t: number, l: 'de' | 'en') => Scene, number][] = [
  ['kb', kbScene, KB_STEPS], ['mb', mbScene, MB_STEPS], ['root', rootScene, ROOT_STEPS],
  ['gauss', gaussScene, GAUSS_STEPS], ['half', halfScene, HALF_STEPS], ['harm', harmScene, HARM_STEPS],
];

describe('week-1 scenes: every label inside the window, every frame', () => {
  it.each(SCENES)('%s', (_, f, n) => {
    for (let step = 0; step < n; step++) for (const t of [0, 0.25, 0.5, 0.75, 1]) for (const l of ['de', 'en'] as const) {
      const s = f(step, t, l);
      for (const lb of s.labels) {
        expect(lb.x, `${step}/${t} ${lb.tex}`).toBeGreaterThanOrEqual(s.x[0]); expect(lb.x).toBeLessThanOrEqual(s.x[1]);
        expect(lb.y, `${step}/${t} ${lb.tex}`).toBeGreaterThanOrEqual(s.y[0]); expect(lb.y).toBeLessThanOrEqual(s.y[1]);
        if (l === 'de') expect(lb.tex).not.toMatch(/\d\.\d/); // decimal comma in German
      }
      for (const p of s.pts) { expect(p.y).toBeGreaterThan(s.y[0]); expect(p.y).toBeLessThan(s.y[1]); }
    }
  });
});

describe('final frames show what the captions say', () => {
  it('kb: step 2 — strip of half-width ε; terms before N red, from N on blue', () => {
    const s = kbScene(1, 1, 'de');
    expect(s.bands).toEqual([{ from: 1 - KB.eps, to: 1 + KB.eps }]);
    expect(s.pts.filter((p) => p.role === 'pt').map((p) => p.x)).toEqual([1, 2, 3]);
    expect(s.labels.some((l) => l.tex === 'N = 4')).toBe(true);
  });
  it('kb: step 3 names a_1, a_2, a_3; step 4 the bounds 0 and 1,5 enclose every term', () => {
    expect(kbScene(2, 1, 'de').labels.filter((l) => /^a_\d$/.test(l.tex)).length).toBe(3);
    const s = kbScene(3, 1, 'de');
    expect(s.hlines.filter((h) => h.role === 'g').map((h) => h.at).sort()).toEqual([0, 1.5]);
    expect(s.labels.map((l) => l.tex)).toContain('a_n \\le 1{,}5');
    for (const p of s.pts) { expect(p.y).toBeGreaterThanOrEqual(0); expect(p.y).toBeLessThanOrEqual(1.5); }
  });
  it('mb: the bound drops to S = 1; a_7 is the first term in the strip; later terms all inside', () => {
    expect(mbScene(0, 1, 'de').hlines[0].at).toBe(MB.bound0);
    expect(mbScene(1, 1, 'de').hlines[0].at).toBe(1);
    const s2 = mbScene(2, 1, 'de');
    expect(s2.pts.find((p) => p.role === 'pt')!.x).toBe(7);
    const s = mbScene(3, 1, 'de');
    for (const p of s.pts) if (p.x > MB.N) { expect(p.role).toBe('f'); expect(p.y).toBeGreaterThan(1 - MB.eps); expect(p.y).toBeLessThan(1); }
    for (const p of s.pts) if (p.x < MB.N) expect(p.role).toBe('muted');
  });
  it('root: step 2 the top strip stands on the right strip (rectangle δ × (s+1)); step 3 width nδ; step 4 nδ → 1/2', () => {
    const sd = side(ROOT_N), d = sd - 1;
    const top = rootScene(1, 1, 'de').polys[3].pts;
    const xs = top.map((p) => p[0]), ys = top.map((p) => p[1]);
    expect(Math.min(...xs)).toBeCloseTo(1, 9); expect(Math.max(...xs)).toBeCloseTo(sd, 9);
    expect(Math.min(...ys)).toBeCloseTo(sd, 9); expect(Math.max(...ys)).toBeCloseTo(sd + 1, 9);
    const r2 = rootScene(2, 1, 'de').polys[2].pts;
    expect(r2[1][0] - r2[0][0]).toBeCloseTo(ROOT_N * d, 12);
    expect((r2[1][0] - r2[0][0]) * (r2[2][1] - r2[1][1])).toBeCloseTo(1, 12);
    const r3 = rootScene(3, 1, 'en').polys[2].pts;
    expect(r3[1][0] - r3[0][0]).toBeCloseTo(0.4975, 3);
    expect(rootScene(3, 1, 'en').labels.map((l) => l.tex)).toContain('n = 50');
  });
  it('gauss: after step 2 every column is 28 high; step 3 states 6·28 = 168 = 2S_6', () => {
    const s = gaussScene(1, 1, 'de');
    const tops = s.polys.filter((p) => p.role === 'g').map((p) => p.pts[2][1]);
    expect(tops).toEqual([28, 28, 28, 28, 28, 28]);
    expect(gaussScene(2, 1, 'de').labels.map((l) => l.tex)).toContain('6\\cdot 28 = 168 = 2S_6');
  });
  it('half: step k ends with k pieces up to S_k; the gap label is 6 − S_k', () => {
    for (let k = 1; k <= 4; k++) {
      const s = halfScene(k - 1, 1, 'en');
      const pieces = s.polys.filter((p) => p.fill);
      expect(pieces.length).toBe(k);
      expect(pieces[k - 1].pts[1][0]).toBeCloseTo(geoSum(3, 0.5, k), 12);
      expect(s.labels.map((l) => l.tex)).toContain(`6 - S_${k} = ${+(6 - geoSum(3, 0.5, k)).toFixed(3)}`);
    }
    expect(halfScene(4, 1, 'de').polys.filter((p) => p.fill).length).toBe(12);
  });
  it('harm: step m sinks group m to its smallest term; labels «≥ 1/2»', () => {
    expect([1, 2, 3, 4, 5, 8, 9, 16].map(harmGroupOf)).toEqual([0, 0, 1, 1, 2, 2, 3, 3]);
    for (let m = 1; m <= 3; m++) {
      const s = harmScene(m, 1, 'de');
      const filled = s.polys.filter((p) => p.fill && p.role === `grp${m}`);
      expect(filled.length).toBe(2 ** m);
      for (const p of filled) expect(p.pts[2][1]).toBeCloseTo(2 ** -(m + 1), 12);
      // area of the sunk block = 1/2
      expect(filled.reduce((a, p) => a + (p.pts[1][0] - p.pts[0][0]) * p.pts[2][1], 0)).toBeCloseTo(0.5, 12);
      expect(s.labels.filter((l) => l.tex.startsWith('\\ge')).length).toBe(m);
    }
    expect(harmScene(4, 1, 'de').labels.map((l) => l.tex)).toContain('S_{16} \\ge 1 + 4\\cdot\\tfrac12 = 3');
  });
});
