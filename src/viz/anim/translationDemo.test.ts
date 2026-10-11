import { describe, expect, it } from 'vitest';
import { demoFrame, type Mode } from '../TranslationFigures';

type V = [number, number];
const segDist = (c: V, a: V, b: V) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy;
  const k = l2 < 1e-9 ? 0 : Math.max(0, Math.min(1, ((c[0] - a[0]) * dx + (c[1] - a[1]) * dy) / l2));
  return Math.hypot(c[0] - a[0] - k * dx, c[1] - a[1] - k * dy);
};
const MODES: Mode[] = ['line', 'curve', 'circle', 'rot'];
const US = Array.from({ length: 50 }, (_, i) => i / 50);

describe('TranslationDemo frames', () => {
  it('translations: all three velocity arrows are equal; rotation: they differ', () => {
    for (const m of MODES) for (const u of US) {
      const { vel } = demoFrame(m, u);
      const diff = Math.max(Math.hypot(vel[1][0] - vel[0][0], vel[1][1] - vel[0][1]), Math.hypot(vel[2][0] - vel[0][0], vel[2][1] - vel[0][1]));
      if (m === 'rot') expect(diff).toBeGreaterThan(2);
      else expect(diff).toBeLessThan(1e-3);
    }
  });
  it('point labels and the label of a keep clear of every arrow and of each other', () => {
    for (const m of MODES) for (const u of US) {
      const { labels, aLabel, segs } = demoFrame(m, u);
      for (const c of [...labels, aLabel]) {
        const d = Math.min(...segs.map(([a, b]) => segDist(c, a, b)));
        expect(d, `${m} u=${u}`).toBeGreaterThan(6);
      }
      const all = [...labels, aLabel];
      for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) expect(Math.hypot(all[i][0] - all[j][0], all[i][1] - all[j][1])).toBeGreaterThan(12);
    }
  });
  it('every label stays inside the 400 × 290 view', () => {
    for (const m of MODES) for (const u of US) for (const c of [...demoFrame(m, u).labels, demoFrame(m, u).aLabel]) {
      expect(c[0]).toBeGreaterThan(8); expect(c[0]).toBeLessThan(392); expect(c[1]).toBeGreaterThan(8); expect(c[1]).toBeLessThan(282);
    }
  });
});
