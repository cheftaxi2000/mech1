import { describe, expect, it } from 'vitest';
import { solveTruss } from '../../physics/truss';
import { trussScene, TS } from './trussScene';
import { expectInside, expectNoOverlap, lab, shape } from './sceneTestKit';

describe('Fig. 3.24: truss (trussScene)', () => {
  const sol = solveTruss(TS.V, TS.L);
  it('the drawn values are the solved ones', () => {
    const d = trussScene(5, 1, 'de').data;
    expect(d.w15).toBeCloseTo(sol.w15, 12); expect(d.w6).toBeCloseTo(sol.w6, 12); expect(d.w7).toBeCloseTo(sol.w7, 12); expect(d.w8).toBeCloseTo(sol.w8, 12);
  });
  it('Z₈ lies on the vertical through B and on the line AE', () => {
    const f = trussScene(2, 1, 'de');
    const Z = shape(f, 'Z8')!.pts[0], B = shape(f, 'ptB')!.pts[0], A = shape(f, 'ptA')!.pts[0], E = shape(f, 'ptE')!.pts[0];
    expect(Z[0]).toBeCloseTo(B[0], 9);
    const cr = (E[0] - A[0]) * (Z[1] - A[1]) - (E[1] - A[1]) * (Z[0] - A[0]);
    expect(cr).toBeCloseTo(0, 6);
  });
  it('every frame inside the figure', () => expectInside(trussScene, 6));
  it('final frames: labels do not overlap', () => expectNoOverlap(trussScene, 6));
  it('final frames show what the captions say', () => {
    const f0 = trussScene(0, 1, 'de'); expect(shape(f0, 'vB')?.o).toBe(1); expect(lab(f0, 'box0')?.o).toBe(1); expect(shape(f0, 'Z8')).toBeUndefined();
    const f1 = trussScene(1, 1, 'de'); for (const k of ['dirC', 'dirD', 'dirE']) expect(shape(f1, k)).toBeDefined(); expect(lab(f1, 'box1')?.o).toBe(1); expect(shape(f1, 'b1')?.cls).toContain('on'); expect(shape(f1, 'b8')?.cls).not.toContain('on');
    const f2 = trussScene(2, 1, 'de'); for (const k of ['perpB', 'perpE', 'Z8', 'w8']) expect(shape(f2, k)?.pts.length, k).toBeGreaterThan(0); expect(lab(f2, 'box2')?.o).toBe(1); expect(shape(f2, 'b8')?.cls).toContain('on');
    const f3 = trussScene(3, 1, 'de'); for (const k of ['vE', 'vD', 'vC', 'w15']) expect(shape(f3, k), k).toBeDefined(); expect(lab(f3, 'box3')?.o).toBe(1);
    const f4 = trussScene(4, 1, 'de'); expect(shape(f4, 'vF')).toBeDefined(); expect(shape(f4, 'Z6')?.o).toBe(1); expect(lab(f4, 'box4')?.o).toBe(1); expect(shape(f4, 'b6')?.cls).toContain('on');
    const f5 = trussScene(5, 1, 'de'); expect(shape(f5, 'Z7')?.o).toBe(1); expect(shape(f5, 'perpF7')).toBeDefined(); expect(lab(f5, 'box5')?.o).toBe(1); expect(shape(f5, 'b7')?.cls).toContain('on');
  });
});
