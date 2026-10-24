import { describe, expect, it } from 'vitest';
import { heatFlow, qEquilibrium } from '../../chem/entropy';
import { HF, heatBlocks, heatCurve, heatScene, tempClass } from './heatScene';
import { US, universeScene } from './universeScene';
import { expectInside, expectNoOverlap, lab, shape } from './cTestKit';

describe('heat between two blocks (slides 9–10, 15–16)', () => {
  it('curve = exact ΔS_univ(q): zero at q = 0 and 2q*, maximum at q*, negative for q < 0', () => {
    const c = heatCurve(100, 5 * 12);
    const at = (x: number) => c.find((p) => Math.abs(p[0] - x) < 1e-9)![1];
    expect(at(0)).toBeCloseTo(0, 12); expect(at(2)).toBeCloseTo(0, 9); expect(at(-0.5)).toBeLessThan(0);
    expect(at(1)).toBeCloseTo(100 * Math.log((350 * 350) / (400 * 300)), 9);
    expect(Math.max(...c.map((p) => p[1]))).toBeCloseTo(at(1), 12);
  });
  it('final temperatures: the common value 350 K at x = 1; swapped temperatures at x = 2', () => {
    const s1 = heatScene(100, 1, 'de'), s2 = heatScene(100, 2, 'de');
    expect(s1.data.Th).toBeCloseTo(350, 9); expect(s1.data.Tc).toBeCloseTo(350, 9);
    expect(s2.data.Th).toBeCloseTo(300, 9); expect(s2.data.Tc).toBeCloseTo(400, 9);
    expect(s1.data.qs).toBeCloseTo(qEquilibrium(heatBlocks(100)), 9);
  });
  it('the signs: hot block loses entropy, cold gains, universe gains for 0 < x < 2; x < 0 loses', () => {
    for (const x of [0.2, 1, 1.8]) { const s = heatScene(100, x, 'de'); expect(s.data.dSh).toBeLessThan(0); expect(s.data.dSc).toBeGreaterThan(0); expect(s.data.dSuniv).toBeGreaterThan(0); }
    expect(heatScene(100, -0.3, 'de').data.dSuniv).toBeLessThan(0);
    expect(heatScene(100, 0.4, 'de').data.dSuniv).toBeCloseTo(heatFlow(heatBlocks(100), 0.4 * 5000).dSuniv, 12);
  });
  it('heat arrow points from hot to cold for x > 0 and back for x < 0', () => {
    const a = shape(heatScene(100, 0.5, 'de'), 'heat')!, r = shape(heatScene(100, -0.3, 'de'), 'heat')!;
    expect(a.pts[1][0]).toBeGreaterThan(a.pts[0][0]); expect(r.pts[1][0]).toBeLessThan(r.pts[0][0]);
    expect(shape(heatScene(100, 0, 'de'), 'heat')).toBeUndefined();
  });
  it('reversible limit (slide 10): for a tiny ΔT the whole curve is almost flat', () => {
    expect(Math.max(...heatCurve(2).map((p) => Math.abs(p[1])))).toBeLessThan(0.01);
    expect(Math.max(...heatCurve(100).map((p) => Math.abs(p[1])))).toBeGreaterThan(1);
  });
  it('colours follow the temperature (hotter = higher class)', () => {
    expect(tempClass(280)).toBe('th-temp-0'); expect(tempClass(440)).toBe('th-temp-8'); expect(tempClass(400)).not.toBe(tempClass(300));
    const s = heatScene(100, 1, 'de');
    expect(shape(s, 'hot')!.cls).toBe(shape(s, 'cold')!.cls);
  });
  it('inside the figure and no label overlap over the slider range', () => {
    const cs: [number, number][] = [[100, 0.5], [2, 1], [100, -0.5], [100, 2], [50, 1], [100, 0.05]];
    expectInside((s, _t, l) => heatScene(cs[s][0], cs[s][1], l), cs.length); expectNoOverlap((s, _t, l) => heatScene(cs[s][0], cs[s][1], l), cs.length);
    expect(HF.px1).toBeLessThan(520);
  });
});

describe('ice, universe balance (slides 8, 14–16, 20)', () => {
  it('slide 15: hand at 310 K: +22.0, −19.4, total +2.6 (not +3.0)', () => {
    const s = universeScene('melt', 310, 'de');
    expect(s.data.sys).toBeCloseTo(21.97, 2); expect(s.data.surr).toBeCloseTo(-19.35, 2); expect(s.data.univ).toBeCloseTo(2.61, 2);
    expect(s.data.spont).toBe(1);
    expect(lab(s, 'v-sys')?.tex).toBe('+22{,}0'); expect(lab(universeScene('melt', 310, 'en'), 'v-sys')?.tex).toBe('+22.0');
  });
  it('+1 °C melts, −1 °C does not; the break-even is 273.15 K', () => {
    expect(universeScene('melt', 274.15, 'de').data.univ).toBeGreaterThan(0.05); expect(universeScene('melt', 272.15, 'de').data.univ).toBeLessThan(-0.05);
    expect(universeScene('melt', 273.15, 'de').data.rev).toBe(1);
  });
  it('freezing in a freezer (263 K): system −22, surroundings +22.8, universe +0.8 > 0 («engineers»)', () => {
    const s = universeScene('freeze', 263.15, 'de');
    expect(s.data.sys).toBeLessThan(-21); expect(s.data.surr).toBeGreaterThan(22); expect(s.data.univ).toBeCloseTo(0.82, 1); expect(s.data.spont).toBe(1);
    expect(universeScene('freeze', 283.15, 'de').data.spont).toBe(0);
  });
  it('bars are to scale and the universe bar is the sum', () => {
    const s = universeScene('melt', 310, 'de'), h = (k: string) => shape(s, k)!.pts[1][1];
    expect(h('bar-sys')).toBeCloseTo(s.data.sys * US.k, 6); expect(h('bar-surr')).toBeCloseTo(-s.data.surr * US.k, 6);
    expect(h('bar-univ')).toBeCloseTo(s.data.univ * US.k, 6);
    expect(shape(s, 'bar-sys')!.pts[0][1]).toBeLessThan(US.zero); expect(shape(s, 'bar-surr')!.pts[0][1]).toBe(US.zero);
  });
  it('inside, no overlap', () => {
    const cs: ['melt' | 'freeze', number][] = [['melt', 310], ['melt', 245], ['melt', 330], ['freeze', 245], ['freeze', 330], ['melt', 273.15]];
    expectInside((s, _t, l) => universeScene(cs[s][0], cs[s][1], l), cs.length); expectNoOverlap((s, _t, l) => universeScene(cs[s][0], cs[s][1], l), cs.length);
  });
});
