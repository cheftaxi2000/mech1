import { describe, expect, it } from 'vitest';
import { KMT, KMT_V, VDW, WALL_L, kmtScene, vdwScene } from './kineticScenes';
import { expectInside, expectNoOverlap, lab, shape } from './sceneTestKit';

const h = (s: ReturnType<typeof shape>) => Math.abs(s!.pts[2][1] - s!.pts[0][1]);

describe('why P ∝ T (slide 25)', () => {
  it('every frame inside; final labels do not overlap', () => { expectInside(kmtScene, 3); expectNoOverlap(kmtScene, 3); });
  it('step 1 final frame: the hot gas (2T) is √2 times faster — longer arrows', () => {
    const f = kmtScene(0, 1, 'de');
    expect(KMT_V.hot / KMT_V.cold).toBeCloseTo(Math.SQRT2, 12);
    const len = (k: string) => { const s = shape(f, k)!; return Math.hypot(s.pts[1][0] - s.pts[0][0], s.pts[1][1] - s.pts[0][1]); };
    // the line stops a little before the tip; compare the same particle in both boxes
    expect(len('v-h0') / len('v-c0')).toBeGreaterThan(1.2); expect(len('v-h0') / len('v-c0')).toBeLessThan(1.7);
    expect(lab(f, 'T2')?.o).toBe(1); expect(shape(f, 'imp-c')).toBeUndefined();
  });
  it('step 2 final frame: each hit pushes √2 as hard and happens √2 as often', () => {
    const f = kmtScene(1, 1, 'de');
    expect(h(shape(f, 'imp-h')) / h(shape(f, 'imp-c'))).toBeCloseTo(Math.SQRT2, 9);
    expect(h(shape(f, 'rate-h')) / h(shape(f, 'rate-c'))).toBeCloseTo(Math.SQRT2, 9);
    expect(shape(f, 'P-c')).toBeUndefined();
  });
  it('step 3 final frame: the pressure bar of the hot gas is exactly twice as high — P ∝ v² ∝ E_k ∝ T', () => {
    const f = kmtScene(2, 1, 'de');
    expect(h(shape(f, 'P-h')) / h(shape(f, 'P-c'))).toBeCloseTo(2, 9);
    expect(h(shape(f, 'P-c'))).toBeCloseTo(KMT.unit, 9);
    expect(lab(f, 'law')?.o).toBe(1); expect(lab(f, 'P2')?.o).toBe(1);
    expect(shape(f, 'imp-c')).toBeUndefined(); // the push/rate bars gave way to the pressure bar
  });
});

describe('what a and b mean (slide 30)', () => {
  it('every frame inside; final labels do not overlap', () => { expectInside(vdwScene, 3); expectNoOverlap(vdwScene, 3); });
  it('step 1: ideal gas, point particles, full wall push', () => {
    const f = vdwScene(0, 1, 'de');
    expect(f.data.r).toBeCloseTo(VDW.r0, 9); expect(f.data.L).toBe(WALL_L.ideal); expect(shape(f, 'att0')).toBeUndefined(); expect(lab(f, 'lab-id')?.o).toBe(1);
  });
  it('step 2 final frame: attraction lines are there and the wall push is weaker than the ideal one (so P + n²a/V² = P_ideal)', () => {
    const f = vdwScene(1, 1, 'de');
    expect(f.data.L).toBe(WALL_L.real); expect(WALL_L.real).toBeLessThan(WALL_L.ideal);
    expect(shape(f, 'att0')).toBeDefined(); expect(shape(f, 'miss0')).toBeDefined();
    expect(lab(f, 'lab-real')?.o).toBe(1); expect(lab(f, 'lab-V')).toBeUndefined();
  });
  it('step 3 final frame: the molecules take room (bigger circles), V − nb and the full law appear', () => {
    const f = vdwScene(2, 1, 'de');
    expect(f.data.r).toBeCloseTo(VDW.r1, 9); expect(shape(f, 'ex0')).toBeDefined();
    expect(lab(f, 'lab-V')?.o).toBe(1); expect(lab(f, 'law')?.o).toBe(1);
  });
});
