import { describe, expect, it } from 'vitest';
import { expectInside, expectNoOverlap, lab, shape } from '../anim/sceneTestKit';
import { sampleScene, G_O2, N_H2, N_O2 } from './sampleScene';
import { chainTex } from '../../chem/unitchain';
import { convert, factor } from '../../chem/units';
import { sci } from './StoichFigures';

describe('sample problem by the mole route (slides 28–31)', () => {
  it('numbers of the slide: 2.00 g H₂ → 1.00 mol → 0.500 mol O₂ → 16.0 g O₂', () => {
    expect([N_H2, N_O2, G_O2]).toEqual([1, 0.5, 16]);
    expect(sampleScene(3, 1, 'en').data).toMatchObject({ g1: 2, n1: 1, n2: 0.5, g2: 16 });
  });
  it('every frame inside, final labels do not overlap', () => { expectInside(sampleScene, 4); expectNoOverlap(sampleScene, 4, 0.45); });
  it('final frames show what the captions say', () => {
    const f0 = sampleScene(0, 1, 'en');
    expect(lab(f0, 'val0')?.tex).toBe(String.raw`2.00\,\mathrm{g}`); expect(lab(f0, 'val3')?.tex).toContain('?'); expect(shape(f0, 'ar0')?.o).toBe(0);
    const f1 = sampleScene(1, 1, 'en');
    expect(lab(f1, 'val1')?.tex).toBe(String.raw`1.00\,\mathrm{mol}`); expect(shape(f1, 'ar0')?.o).toBe(1); expect(lab(f1, 'af0')?.tex).toContain('2.00');
    const f2 = sampleScene(2, 1, 'de');
    expect(lab(f2, 'val2')?.tex).toBe(String.raw`0{,}500\,\mathrm{mol}`); expect(lab(f2, 'ratio')?.o).toBe(1); expect(shape(f2, 'h1a')).toBeDefined(); expect(shape(f2, 'o-b')).toBeDefined();
    const f3 = sampleScene(3, 1, 'en');
    expect(lab(f3, 'val3')?.tex).toBe(String.raw`16.0\,\mathrm{g}`); expect(shape(f3, 'ar2')?.o).toBe(1);
  });
});

describe('unit chains (exercise class 1)', () => {
  const start = { value: 78, unit: 'kcal' }, fs = [factor(1000, 'cal', 1, 'kcal'), factor(4.184, 'J', 1, 'cal')];
  it('the TeX cancels the units step by step and ends with the result', () => {
    expect(chainTex(start, fs, 0)).toBe(String.raw`78\,\mathrm{kcal}`);
    const one = chainTex(start, fs, 1);
    expect(one).toContain(String.raw`\cancel{\mathrm{kcal}}`); expect(one).not.toContain('J');
    const two = chainTex(start, fs, 2);
    expect(two).toContain(String.raw`\cancel{\mathrm{cal}}`); expect(two).toContain(String.raw`3.3\times 10^{5}\,\mathrm{J}`);
    expect(chainTex(start, fs, 2, true)).toContain('4{,}184');
  });
  it('the result matches convert()', () => { expect(convert(start, fs).value).toBeCloseTo(326352, 0); });
  it('scientific notation helper', () => {
    expect(sci(6.022e23, 3, false)).toBe(String.raw`6.02\times 10^{23}`);
    expect(sci(6.022e23, 3, true)).toBe(String.raw`6{,}02\times 10^{23}`);
    expect(sci(18.015, 3, false)).toBe('18.0');
    expect(sci(0.5, 3, true)).toBe('0{,}500');
  });
});
