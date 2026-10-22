import { describe, expect, it } from 'vitest';
import { clipLine, makeFrame, sampleCurve, ticks, tickText } from './plotMath';

const F = makeFrame([-4, 4], [-3, 3], 400, 300, 10);

describe('plot frame', () => {
  it('maps the window corners to the padded viewBox and back', () => {
    expect(F.sx(-4)).toBeCloseTo(10); expect(F.sx(4)).toBeCloseTo(390);
    expect(F.sy(-3)).toBeCloseTo(290); expect(F.sy(3)).toBeCloseTo(10);
    expect(F.ix(F.sx(1.3))).toBeCloseTo(1.3); expect(F.iy(F.sy(-2.2))).toBeCloseTo(-2.2);
  });
});

describe('sampleCurve', () => {
  it('a continuous function is one polyline across the window', () => {
    const c = sampleCurve((x) => x / 2, F);
    expect(c).toHaveLength(1);
    expect(c[0][0][0]).toBeCloseTo(10); expect(c[0].at(-1)![0]).toBeCloseTo(390);
  });
  it('1/x is broken at the pole: two branches, none crossing x = 0', () => {
    const c = sampleCurve((x) => 1 / x, F, undefined, { breaks: [0] });
    expect(c).toHaveLength(2);
    const x0 = F.sx(0);
    expect(c[0].every((p) => p[0] < x0)).toBe(true);
    expect(c[1].every((p) => p[0] > x0)).toBe(true);
  });
  it('without a declared break, leaving the window still cuts the branch (no vertical line across a pole)', () => {
    const c = sampleCurve((x) => 1 / (x - 1), F);
    expect(c.length).toBeGreaterThanOrEqual(2);
    for (const br of c) for (let i = 1; i < br.length; i++) expect(Math.abs(br[i][1] - br[i - 1][1])).toBeLessThan(300);
  });
  it('a jump declared as a break gives two pieces; the domain restricts the graph', () => {
    const h = (x: number) => (x <= 1 ? -2 : 0);
    expect(sampleCurve(h, F, undefined, { breaks: [1] })).toHaveLength(2);
    const d = sampleCurve((x) => Math.sqrt(x), F, [0, 2]);
    expect(d).toHaveLength(1);
    expect(d[0][0][0]).toBeCloseTo(F.sx(0)); expect(d[0].at(-1)![0]).toBeCloseTo(F.sx(2));
  });
  it('NaN outside the natural domain ends the graph there', () => {
    const c = sampleCurve((x) => Math.sqrt(x), F);
    expect(c).toHaveLength(1);
    expect(c[0][0][0]).toBeGreaterThanOrEqual(F.sx(0) - 1e-6);
  });
});

describe('clipLine', () => {
  it('a tangent is clipped to the window', () => {
    const s = clipLine(F, [1, 1], 2)!;
    for (const p of s) { expect(p[1]).toBeGreaterThanOrEqual(10 - 1e-9); expect(p[1]).toBeLessThanOrEqual(290 + 1e-9); }
    expect(F.iy(s[0][1])).toBeCloseTo(-3); expect(F.ix(s[0][0])).toBeCloseTo(-1);
  });
  it('a horizontal line outside the window is null', () => {
    expect(clipLine(F, [0, 5], 0)).toBeNull();
  });
});

describe('ticks', () => {
  it('multiples of the step without zero; decimal comma in German, real minus sign', () => {
    expect(ticks([-4, 4], 2)).toEqual([-4, -2, 2, 4]);
    expect(ticks([0, 1], 0.25)).toEqual([0.25, 0.5, 0.75, 1]);
    expect(tickText(-2, 'de')).toBe('−2');
    expect(tickText(0.5, 'de')).toBe('0,5');
    expect(tickText(0.5, 'en')).toBe('0.5');
  });
});
