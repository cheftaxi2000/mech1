import { describe, expect, it } from 'vitest';
import { whyNumbers, whyScene, WHY_STEPS } from './k5WhyScene';
import { expectInside, expectNoOverlap, lab, shape } from '../anim/sceneTestKit';

describe('supplement «Warum P = F · v?» (K5)', () => {
  it('the numbers: F∥ = 2,6 N, dr = v dt = 1,0 m, push = 2,6 N m, P = push/dt = 5,2 W = F · v', () => {
    const n = whyNumbers();
    expect(n.Fpar).toBeCloseTo(2.6, 12); expect(n.dr).toBeCloseTo(1, 12); expect(n.push).toBeCloseTo(2.6, 12);
    expect(n.P).toBeCloseTo(5.2, 12); expect(n.push / 0.5).toBeCloseTo(n.P, 12);
    expect(n.alpha).toBeCloseTo(Math.atan2(1.5, 2.6), 12);
  });
  it('every frame inside the figure; final frames: labels do not overlap', () => {
    expectInside(whyScene, WHY_STEPS);
    expectNoOverlap(whyScene, WHY_STEPS);
  });
  it('final frames show what the captions say', () => {
    const f0 = whyScene(0, 1, 'de');
    expect(shape(f0, 'F')?.o).toBe(1); expect(shape(f0, 'v')?.o).toBe(1); expect(shape(f0, 'dr')).toBeUndefined();
    const f1 = whyScene(1, 1, 'de');
    expect(f1.data.glide).toBe(1); expect(shape(f1, 'dr')?.o).toBe(1); expect(shape(f1, 'ghost')).toBeDefined(); expect(lab(f1, 'dr')?.o).toBe(1); expect(lab(f1, 'Ap')?.o).toBe(1);
    const f2 = whyScene(2, 1, 'de');
    expect(shape(f2, 'drop')?.o).toBe(1); expect(shape(f2, 'strip')).toBeDefined(); expect(lab(f2, 'Fcos')?.o).toBe(1); expect(lab(f2, 'alpha')?.o).toBe(1);
    const f3 = whyScene(3, 1, 'de');
    expect(shape(f3, 'rect')?.o).toBe(1); expect(lab(f3, 'box3')?.o).toBe(1); expect(f3.data.width).toBeCloseTo(50, 9); // width = |d r̲| (1,0 m · 50 px/m)
    const f4 = whyScene(4, 1, 'de');
    expect(shape(f4, 'rect')?.o).toBe(1); expect(lab(f4, 'box4')?.o).toBe(1); expect(f4.data.width).toBeCloseTo(100, 9); // width = |v| (2,0 m/s · 50 px per m/s)
    expect(lab(f4, 'box4')?.rows?.length).toBe(2);
  });
  it('step 3 → 4: the rectangle widens from |dr| to |v| = |dr|/dt, the height (F∥) stays', () => {
    const w = (t: number) => whyScene(4, t, 'de').data.width;
    expect(w(0)).toBeCloseTo(50, 9); expect(w(0.5)).toBeGreaterThan(50); expect(w(0.5)).toBeLessThan(100); expect(w(1)).toBeCloseTo(100, 9);
    const rect = (t: number) => shape(whyScene(4, t, 'de'), 'rect')!.pts;
    expect(rect(0.4)[2][1] - rect(0.4)[1][1]).toBeCloseTo(rect(1)[2][1] - rect(1)[1][1], 9);
  });
  it('the projection strip ends under the tip of F (the drop line is vertical)', () => {
    const f = whyScene(2, 1, 'de');
    const drop = shape(f, 'drop')!.pts, strip = shape(f, 'strip')!.pts;
    expect(drop[0][0]).toBeCloseTo(drop[1][0], 9); expect(strip[1][0]).toBeCloseTo(drop[0][0], 9);
  });
});
