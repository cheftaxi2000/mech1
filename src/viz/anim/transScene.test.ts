import { describe, expect, it } from 'vitest';
import { TA, pathM, pathN, transScene } from './transScene';
import { H, W, labelBox, labelOverlap } from './scene';

const LANGS = ['de', 'en'] as const;
const ts = Array.from({ length: 41 }, (_, i) => i / 40);
const lab = (s: ReturnType<typeof transScene>, k: string) => s.labels.find((l) => l.key === k);
const shape = (s: ReturnType<typeof transScene>, k: string) => s.shapes.find((x) => x.key === k);

describe('translation animation (Fig. 3.4)', () => {
  it('N’s path is M’s path shifted by the constant a (congruent trajectories)', () => {
    for (const s of [0, 0.3, 0.8, 1]) { const m = pathM(s), n = pathN(s); expect(n[0] - m[0]).toBe(TA[0]); expect(n[1] - m[1]).toBe(TA[1]); }
  });
  it('every frame inside the figure', () => {
    for (const lang of LANGS) for (let s = 0; s < 4; s++) for (const t of ts) {
      const sc = transScene(s, t, lang);
      for (const sh of sc.shapes) for (const p of sh.pts) { expect(p[0]).toBeGreaterThanOrEqual(0); expect(p[0]).toBeLessThanOrEqual(W); expect(p[1]).toBeGreaterThanOrEqual(0); expect(p[1]).toBeLessThanOrEqual(H); }
      for (const l of sc.labels) { const b = labelBox(l); expect(b.x0).toBeGreaterThanOrEqual(0); expect(b.x1).toBeLessThanOrEqual(W); expect(b.y0).toBeGreaterThanOrEqual(0); expect(b.y1).toBeLessThanOrEqual(H); }
    }
  });
  it('final frames show what the captions say', () => {
    const f1 = transScene(1, 1, 'de');
    expect(lab(f1, 'lab-RM')?.o).toBe(1); expect(shape(f1, 'RN')?.o).toBe(1);
    const f2 = transScene(2, 1, 'de');
    expect(shape(f2, 'pathM')).toBeDefined(); expect(shape(f2, 'pathN')).toBeDefined(); expect(lab(f2, 'lab-t2')?.o).toBe(1);
    // M and N are named on the solid body (at t₂), the ghosts carry only their times t₁, t
    expect(Math.hypot(lab(f2, 'lab-M')!.at[0] - pathM(1)[0], lab(f2, 'lab-M')!.at[1] - pathM(1)[1])).toBeLessThan(25);
    expect(lab(f2, 'lab-t')?.o).toBe(1); expect(lab(f2, 'lab-t1')?.o).toBe(1);
    const f3 = transScene(3, 1, 'de');
    const vM = shape(f3, 'vM')!, vN = shape(f3, 'vN')!;
    expect(vN.pts[1][0] - vN.pts[0][0]).toBeCloseTo(vM.pts[1][0] - vM.pts[0][0], 9); // equal arrows
    expect(lab(f3, 'box')?.o).toBe(1);
  });
  it('final frames: labels do not overlap', () => {
    for (const lang of LANGS) for (let s = 0; s < 4; s++) {
      const ls = transScene(s, 1, lang).labels;
      for (let i = 0; i < ls.length; i++) for (let j = i + 1; j < ls.length; j++)
        expect(labelOverlap(ls[i], ls[j]), `${s}: ${ls[i].key} / ${ls[j].key}`).toBeLessThan(0.2);
    }
  });
});
