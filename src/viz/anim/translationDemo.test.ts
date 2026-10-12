import { describe, expect, it } from 'vitest';
import { CIRC, demoFrame, isMomentary, type Mode } from '../TranslationFigures';
import { rodOmega } from '../../physics/translation';

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
      const { labels, aLabel, bLabel, segs } = demoFrame(m, u);
      for (const c of [...labels, aLabel, bLabel]) {
        const d = Math.min(...segs.map(([a, b]) => segDist(c, a, b)));
        expect(d, `${m} u=${u}`).toBeGreaterThan(6);
      }
      const all = [...labels, aLabel, bLabel];
      for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) expect(Math.hypot(all[i][0] - all[j][0], all[i][1] - all[j][1])).toBeGreaterThan(12);
    }
  });
  it('circular translation: every point runs on a circle of the same radius R, centres shifted by the body offsets', () => {
    const c0 = [CIRC.cx, CIRC.cy];
    for (const u of US) {
      const { pts } = demoFrame('circle', u), p0 = demoFrame('circle', 0).pts;
      for (let i = 0; i < 3; i++) {
        const centre = [c0[0] + p0[i][0] - (CIRC.cx + CIRC.R), c0[1] + p0[i][1] - CIRC.cy];
        expect(Math.hypot(pts[i][0] - centre[0], pts[i][1] - centre[1])).toBeCloseTo(CIRC.R, 9);
      }
    }
  });
  it('slider crank: the chip «momentane Translation» shows only when ω_rod reads 0,00', () => {
    const om = (deg: number) => rodOmega((deg * Math.PI) / 180, 1, 2.6, 1); // the figure: r = 1, l = 2.6, θ̇ = 1
    expect(isMomentary(om(90))).toBe(true); expect(isMomentary(om(270))).toBe(true);
    for (const deg of [88, 89, 91, 92, 268, 272]) expect(isMomentary(om(deg))).toBe(false); // the old tolerance showed it here
    for (const deg of [60, 89.5, 90.4, 120]) expect(isMomentary(om(deg))).toBe(Math.abs(om(deg)) < 0.005);
  });
  it('every label stays inside the 400 × 290 view', () => {
    for (const m of MODES) for (const u of US) for (const c of [...demoFrame(m, u).labels, demoFrame(m, u).aLabel, demoFrame(m, u).bLabel]) {
      expect(c[0]).toBeGreaterThan(8); expect(c[0]).toBeLessThan(392); expect(c[1]).toBeGreaterThan(8); expect(c[1]).toBeLessThan(282);
    }
  });
});
