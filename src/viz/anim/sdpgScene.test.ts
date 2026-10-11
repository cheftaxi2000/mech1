import { describe, expect, it } from 'vitest';
import { SA, SVM, SVN, projM, projN, sdpgScene } from './sdpgScene';
import { H, W, labelBox, labelOverlap } from './scene';

const LANGS = ['de', 'en'] as const;
const ts = Array.from({ length: 41 }, (_, i) => i / 40);
const lab = (s: ReturnType<typeof sdpgScene>, k: string) => s.labels.find((l) => l.key === k);
const shape = (s: ReturnType<typeof sdpgScene>, k: string) => s.shapes.find((x) => x.key === k);

describe('SdpG animation (lecture p. 12)', () => {
  it('the drawn velocities form a rigid field: equal projections, v_N − v_M ⟂ a', () => {
    expect(projM).toBeCloseTo(projN, 10);
    const d = [SVN[0] - SVM[0], SVN[1] - SVM[1]];
    expect(d[0] * SA[0] + d[1] * SA[1]).toBeCloseTo(0, 10);
    expect(Math.hypot(SVM[0] - SVN[0], SVM[1] - SVN[1])).toBeGreaterThan(20); // visibly different velocities
  });
  it('every frame inside the figure', () => {
    for (const lang of LANGS) for (let s = 0; s < 5; s++) for (const t of ts) {
      const sc = sdpgScene(s, t, lang);
      for (const sh of sc.shapes) for (const p of sh.pts) { expect(p[0]).toBeGreaterThanOrEqual(0); expect(p[0]).toBeLessThanOrEqual(W); expect(p[1]).toBeGreaterThanOrEqual(0); expect(p[1]).toBeLessThanOrEqual(H); }
      for (const l of sc.labels) { const b = labelBox(l); expect(b.x0).toBeGreaterThanOrEqual(0); expect(b.x1).toBeLessThanOrEqual(W); expect(b.y0).toBeGreaterThanOrEqual(0); expect(b.y1).toBeLessThanOrEqual(H); }
    }
  });
  it('final frames show what the captions say', () => {
    expect(lab(sdpgScene(0, 1, 'de'), 'lab-a2')?.o).toBe(1);
    expect(lab(sdpgScene(1, 1, 'de'), 'lab-vN')?.o).toBe(1);
    const f2 = sdpgScene(2, 1, 'de');
    expect(lab(f2, 'lab-pM')?.o).toBe(1); expect(lab(f2, 'box-proj')?.o).toBe(1);
    const f3 = sdpgScene(3, 1, 'de');
    expect(shape(f3, 'diff')?.o).toBe(1); expect(lab(f3, 'lab-diff')?.o).toBe(1);
    expect(lab(sdpgScene(4, 1, 'en'), 'box')?.o).toBe(1);
  });
  it('final frames: labels do not overlap', () => {
    for (const lang of LANGS) for (let s = 0; s < 5; s++) {
      const ls = sdpgScene(s, 1, lang).labels;
      for (let i = 0; i < ls.length; i++) for (let j = i + 1; j < ls.length; j++)
        expect(labelOverlap(ls[i], ls[j]), `${s}: ${ls[i].key} / ${ls[j].key}`).toBeLessThan(0.2);
    }
  });
});
