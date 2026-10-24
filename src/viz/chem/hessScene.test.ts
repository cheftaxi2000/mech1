import { describe, expect, it } from 'vitest';
import { HESS_EXAMPLES } from '../../chem/hess';
import { expectInside, expectNoOverlap, lab, shape } from './cTestKit';
import { hessLayout, hessScene, hessSteps, kj } from './hessScene';

for (const ex of HESS_EXAMPLES) {
  const route = ex.route();
  const N = hessSteps(route);
  const build = (s: number, t: number, l: 'de' | 'en') => hessScene(route, s, t, l);
  describe(`enthalpy diagram «${ex.id}»`, () => {
    it('every frame inside the figure', () => expectInside(build, N));
    it('final frames: labels do not overlap', () => expectNoOverlap(build, N));
    it('layout: direction of every arrow matches the sign of its ΔH, all levels distinct', () => {
      const { ys, n } = hessLayout(route);
      route.steps.forEach((s, i) => { if (s.dH > 0) expect(ys[i + 1]).toBeLessThan(ys[i]); else expect(ys[i + 1]).toBeGreaterThan(ys[i]); });
      expect(new Set(ys.map((y) => y.toFixed(1))).size).toBe(n + 1);
      ys.forEach((y) => { expect(y).toBeGreaterThanOrEqual(28); expect(y).toBeLessThanOrEqual(272); });
    });
    it('each step’s final frame shows what it should: level i and arrow i, nothing later', () => {
      const n = route.steps.length;
      for (let s = 0; s <= n; s++) {
        const f = hessScene(route, s, 1, 'de');
        expect(lab(f, `name${s}`)?.o, `level ${s}`).toBe(1);
        if (s >= 1) expect(shape(f, `ar${s}`)).toBeDefined();
        if (s < n) expect(shape(f, `ar${s + 1}`)).toBeUndefined();
        expect(shape(f, 'net')).toBeUndefined();
      }
      const last = hessScene(route, n + 1, 1, 'de');
      expect(shape(last, 'net')).toBeDefined();
      expect(lab(last, 'net-val')?.tex).toContain(kj(route.total, 'de'));
      const p = shape(last, 'net')!.pts;
      expect(p[0][1]).toBeCloseTo(hessLayout(route).ys[0], 9);
    });
  });
}

describe('number format', () => {
  it('decimal comma in German TeX, signs, trimmed zeros', () => {
    expect(kj(103.85, 'de')).toBe('+103{,}85'); expect(kj(-1180.5, 'de')).toBe('-1180{,}5'); expect(kj(-88, 'en')).toBe('-88'); expect(kj(-2219.85, 'en')).toBe('-2219.85');
  });
});
