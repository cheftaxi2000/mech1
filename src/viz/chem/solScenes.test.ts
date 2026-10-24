import { describe, expect, it } from 'vitest';
import { expectInside, expectNoOverlap, lab, shape } from '../anim/sceneTestKit';
import { SUBSTANCES, electrolyteScene, molarityScene, dotsFor, waterTop, N_ION, N_MOL } from './solScenes';

describe('electrolytes and nonelectrolytes (slides 9, 11)', () => {
  it('the lamp lights only for electrolytes; ions or molecules are drawn as counted', () => {
    for (const s of SUBSTANCES) {
      const f = electrolyteScene(s);
      expect(f.data.lit).toBe(s.kind === 'ionic' ? 1 : 0);
      expect(shape(f, 'bulb')?.cls).toBe(s.kind === 'ionic' ? 'cs-bulb-on' : 'cs-bulb-off');
      expect(f.shapes.filter((x) => /^c\d+$/.test(x.key))).toHaveLength(s.kind === 'ionic' ? N_ION : 0);
      expect(f.shapes.filter((x) => /^a\d+$/.test(x.key))).toHaveLength(s.kind === 'ionic' ? N_ION : 0);
      expect(f.shapes.filter((x) => /^m\d+$/.test(x.key))).toHaveLength(s.kind === 'molecular' ? N_MOL : 0);
      expectInside(() => f, 1); expectNoOverlap(() => f, 1, 0.3);
    }
  });
  it('the solution is neutral: as many cations as anions', () => {
    const f = electrolyteScene(SUBSTANCES[0]);
    expect(f.shapes.filter((x) => x.cls === 'cs-ion-cat').length).toBe(f.shapes.filter((x) => x.cls === 'cs-ion-an').length);
  });
  it('particles stay inside the water and away from the electrodes', () => {
    for (const s of SUBSTANCES) for (const p of electrolyteScene(s).shapes.filter((x) => x.kind === 'circle' && x.key !== 'bulb')) {
      expect(p.pts[0][0]).toBeGreaterThan(70); expect(p.pts[0][0]).toBeLessThan(330); expect(p.pts[0][1]).toBeGreaterThan(114); expect(p.pts[0][1]).toBeLessThan(266);
    }
  });
});

describe('molarity (slide 29)', () => {
  it('c = n / V and the number of dots follows n', () => {
    const f = molarityScene(0.5, 1, 'en');
    expect(f.data.c).toBeCloseTo(0.5, 12); expect(f.data.dots).toBe(dotsFor(0.5));
    expect(molarityScene(1, 0.5, 'en').data.c).toBeCloseTo(2, 12);
    expect(dotsFor(0.25)).toBe(10); expect(dotsFor(1)).toBe(40);
  });
  it('1 mol in 1 L is 1 M; the label shows it', () => {
    const f = molarityScene(1, 1, 'de');
    expect(lab(f, 'formula')!.rows![2].tex).toContain('1{,}00');
  });
  it('more water: the level rises and the dots spread out vertically', () => {
    expect(waterTop(2)).toBeLessThan(waterTop(1));
    const spread = (V: number) => { const ys = molarityScene(0.5, V, 'en').shapes.filter((x) => x.key.startsWith('d')).map((x) => x.pts[0][1]); return Math.max(...ys) - Math.min(...ys); };
    expect(spread(2)).toBeGreaterThan(spread(0.5) * 1.5);
  });
  it('all dots stay inside the liquid, every frame inside the picture', () => {
    for (const [n, V] of [[0.05, 0.1], [1.2, 2], [0.5, 1], [1.2, 0.1]] as [number, number][]) {
      const f = molarityScene(n, V, 'en');
      for (const d of f.shapes.filter((x) => x.key.startsWith('d'))) { expect(d.pts[0][1]).toBeGreaterThan(f.data.top); expect(d.pts[0][1]).toBeLessThan(262); }
      expectInside(() => f, 1);
    }
  });
});
