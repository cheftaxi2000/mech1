import { describe, expect, it } from 'vitest';
import { boxFaces } from './k4Box';
import { fmtSig } from './k34Common';
import { fmtLen, hOfU, uOfH } from './K4DensityFigure';

describe('fmtSig: significant digits, German decimal comma in TeX, thin-space grouping, scientific notation', () => {
  it('plain numbers', () => {
    expect(fmtSig(155, 7, 'de')).toBe('155');
    expect(fmtSig(159.6875, 7, 'de')).toBe('159{,}6875');
    expect(fmtSig(159.6875, 7, 'en')).toBe('159.6875');
    expect(fmtSig(0.0625, 3, 'de')).toBe('0{,}0625');
    expect(fmtSig(2.5, 4, 'en')).toBe('2.5');
    expect(fmtSig(0, 3, 'de')).toBe('0');
  });
  it('large numbers are grouped, tiny ones are scientific', () => {
    expect(fmtSig(16310.45, 4, 'de')).toBe('16\\,310');
    expect(fmtSig(240000, 6, 'en')).toBe('240\\,000');
    expect(fmtSig(2.246e-5, 4, 'de')).toBe('2{,}246\\cdot 10^{-5}');
    expect(fmtSig(1e-4, 3, 'en')).toBe('1\\cdot 10^{-4}');
  });
});

describe('density figure: the cube edge from the slider', () => {
  it('goes from 1 mm to 2 m and back', () => {
    expect(hOfU(1)).toBeCloseTo(2, 12);
    expect(hOfU(0)).toBeCloseTo(0.001, 3);
    for (const u of [0.1, 0.5, 0.9]) expect(uOfH(hOfU(u))).toBeCloseTo(u, 9);
  });
  it('lengths are written in m, cm or mm', () => {
    expect(fmtLen(2, 'de')).toBe('2\\,\\mathrm m');
    expect(fmtLen(0.25, 'de')).toBe('25\\,\\mathrm{cm}');
    expect(fmtLen(0.002, 'en')).toBe('2\\,\\mathrm{mm}');
  });
});

describe('boxFaces', () => {
  it('can be centred on a point', () => {
    const f = boxFaces(3, 2, 2, undefined, [200, 150]);
    const all = [...f.top, ...f.left, ...f.right];
    const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
    expect((Math.min(...xs) + Math.max(...xs)) / 2).toBeCloseTo(200, 9);
    expect((Math.min(...ys) + Math.max(...ys)) / 2).toBeCloseTo(150, 9);
  });
  it('the z-axis points up on the screen and the face corners are shared', () => {
    const f = boxFaces(1, 1, 1);
    expect(f.left[3][1]).toBeLessThan(f.left[0][1]);            // top of the left face is higher (smaller y)
    expect(f.left[1]).toEqual(f.right[0]); expect(f.left[2]).toEqual(f.right[3]); expect(f.top[1]).toEqual(f.right[3]);
  });
});
