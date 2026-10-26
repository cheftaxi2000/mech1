import { describe, expect, it } from 'vitest';
import { ANIM_R, animQ, sliceSum } from '../../physics/distributed';
import { expectInside, expectNoOverlap, lab, shape } from '../anim/sceneTestKit';
import { LS, lineScene } from './k4LineScene';
import { WB, cellK, weightScene } from './k4WeightScene';

const fin = (f: typeof lineScene, s: number) => f(s, 1, 'de');
const bars = (s: number, n: number) => fin(lineScene, s).shapes.filter((x) => x.key.startsWith(`bar-${n}-`) && (x.o ?? 1) > 0.5);

describe('line load: from the sum to the integral', () => {
  it('step 0: arrows and the curve, no bars', () => {
    const sc = fin(lineScene, 0);
    expect(sc.shapes.filter((x) => x.key.startsWith('arr0-') && !x.key.endsWith('-h')).length).toBe(8);
    expect(sc.shapes.some((x) => x.key.startsWith('bar-'))).toBe(false);
    expect(shape(sc, 'curve')!.pts.length).toBe(61);
  });
  it.each([[1, 2], [2, 4], [3, 8], [4, 16]])('step %i: %i pieces, each as high as q at its middle, and the printed sum is the real one', (s, n) => {
    const b = bars(s, n);
    expect(b.length).toBe(n);
    const dx = 4 / n;
    b.forEach((p, i) => {
      const h = LS.BASE - p.pts[2][1];                           // bar height in px
      expect(h).toBeCloseTo(LS.KY * animQ((i + 0.5) * dx), 9);
    });
    // the sum of the bar areas (in N) equals the sum shown in the read-out
    const area = b.reduce((acc, p) => acc + ((LS.BASE - p.pts[2][1]) / LS.KY) * (((p.pts[1][0] - p.pts[0][0]) / LS.KX)), 0);
    expect(area).toBeCloseTo(sliceSum(animQ, n), 9);
    expect(fin(lineScene, s).data.sum).toBeCloseTo(sliceSum(animQ, n), 9);
  });
  it('the sums are 155, 158.75, 159.6875, 159.921875 and approach R = 160 N', () => {
    expect([1, 2, 3, 4].map((s) => fin(lineScene, s).data.sum)).toEqual([155, 158.75, 159.6875, 159.921875]);
    expect(lab(fin(lineScene, 1), 'sum')!.rows![1].tex).toContain('155');
    expect(lab(fin(lineScene, 4), 'sum')!.rows![1].tex).toContain('159{,}9219');
    expect(lab(lineScene(4, 1, 'en'), 'sum')!.rows![1].tex).toContain('159.9219');
  });
  it('step 1: the two pieces are labelled ΔF₁, ΔF₂; step 5: the area, the element dx with dF, R = 160 N', () => {
    expect(lab(fin(lineScene, 1), 'dF1')!.tex).toBe('\\Delta F_1'); expect(lab(fin(lineScene, 1), 'dF2')).toBeDefined();
    const s5 = fin(lineScene, 5);
    expect((shape(s5, 'area')!.o ?? 1)).toBeCloseTo(1, 9);
    expect(shape(s5, 'elem')).toBeDefined(); expect(lab(s5, 'dF')!.tex).toContain('\\mathrm dx');
    expect(lab(s5, 'sum')!.rows![1].tex).toContain('160');
    expect(s5.data.sum).toBe(ANIM_R);
    expect(bars(5, 16).length).toBe(0);                           // the bars have given way to the area
    const area = shape(s5, 'area')!.pts;
    expect(area[0][1]).toBe(LS.BASE); expect(area[area.length - 1][1]).toBe(LS.BASE);
  });
  it('the curve follows q(x) at its ends: 20 N/m at x = 0 and 80 N/m at x = L', () => {
    const c = shape(fin(lineScene, 1), 'curve')!.pts;
    expect(LS.BASE - c[0][1]).toBeCloseTo(LS.KY * 20, 9); expect(LS.BASE - c[c.length - 1][1]).toBeCloseTo(LS.KY * 80, 9);
  });
  it('inside the frame, no overlapping labels', () => {
    expectInside(lineScene, 6);
    expectNoOverlap(lineScene, 6, 0.25);
  });
});

describe('weight as a volume force', () => {
  it('step 0: the box and the three axes only', () => {
    const sc = fin(weightScene, 0);
    expect(['left', 'right', 'top'].every((k) => shape(sc, k))).toBe(true);
    expect(sc.shapes.some((x) => x.key.startsWith('cell-') || x.key === 'G' || x.key === 'dG')).toBe(false);
    expect(['ax-x', 'ax-y', 'ax-z'].every((k) => lab(sc, k))).toBe(true);
  });
  it('step 1: one small cube dV with its arrow dG', () => {
    const sc = fin(weightScene, 1);
    expect(shape(sc, 'dv-top')).toBeDefined(); expect(shape(sc, 'dG')).toBeDefined();
    expect(lab(sc, 'dG')!.tex).toContain('\\mathrm dV'); expect(sc.shapes.some((x) => x.key.startsWith('cell-'))).toBe(false);
  });
  it('step 2: the body is cut into 4 × 3 cubes per face, arrows of different length, sum written as a triple integral', () => {
    const sc = fin(weightScene, 2);
    const cells = sc.shapes.filter((x) => x.key.startsWith('cell-') && !x.key.endsWith('-h'));
    expect(cells.length).toBe(WB.na * WB.nc);
    const lens = new Set(cells.map((c) => Math.round(Math.abs(c.pts[1][1] - c.pts[0][1]))));
    expect(lens.size).toBeGreaterThan(2);
    expect(lab(sc, 'eq')!.rows![1].tex).toContain('\\iiint');
    expect(shape(sc, 'dG')).toBeUndefined();
  });
  it('step 3: all arrows equal (homogeneous), they give way to one arrow G with G = −ρ g V e_z', () => {
    const sc = fin(weightScene, 3);
    expect(sc.shapes.filter((x) => x.key.startsWith('cell-') && !x.key.endsWith('-h')).length).toBe(0);
    expect(shape(sc, 'G')).toBeDefined(); expect(lab(sc, 'eq')!.rows![1].tex).toContain('\\rho\\,g\\,V');
    for (const i of [0, 1, 2, 3]) for (const k of [0, 1, 2]) expect(cellK(i, k, 1)).toBeCloseTo(0.8, 12);
    expect(Math.abs(cellK(0, 0, 0) - cellK(1, 2, 0))).toBeGreaterThan(0.05);
    const g = shape(sc, 'G')!.pts; expect(g[1][1]).toBeGreaterThan(g[0][1]);   // points down (SVG y grows downward)
  });
  it('inside the frame, no overlapping labels', () => {
    expectInside(weightScene, 4);
    expectNoOverlap(weightScene, 4, 0.25);
  });
});
