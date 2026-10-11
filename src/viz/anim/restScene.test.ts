import { describe, expect, it } from 'vitest';
import { RA, RB, RC, bentAngle, restScene } from './restScene';
import { expectInside, expectNoOverlap, lab, shape } from './sceneTestKit';

describe('why points on μ are at rest (p. 15, “Anschaulich”)', () => {
  it('A, C, B lie on one straight line (μ); a sideways shift of C bends the angle below 180°', () => {
    const cross = (RB[0] - RA[0]) * (RC[1] - RA[1]) - (RB[1] - RA[1]) * (RC[0] - RA[0]);
    expect(Math.abs(cross)).toBeLessThan(1e-9);
    expect(bentAngle(0)).toBeCloseTo(Math.PI, 6);
    expect((bentAngle(1) * 180) / Math.PI).toBeLessThan(165);
  });
  it('every frame inside the figure', () => expectInside(restScene, 3));
  it('final frames: labels do not overlap', () => expectNoOverlap(restScene, 3));
  it('final frames show what the captions say', () => {
    const f0 = restScene(0, 1, 'de');
    expect(shape(f0, 'vC')?.o).toBe(1); expect(shape(f0, 'along')?.o).toBe(1); expect(shape(f0, 'across')?.o).toBe(1);
    const f1 = restScene(1, 1, 'de');
    expect(f1.data.along).toBe(0); expect(shape(f1, 'along')).toBeUndefined(); expect(shape(f1, 'across')?.o).toBe(1);
    expect(lab(f1, 'box1')?.o).toBe(1);
    const f2 = restScene(2, 1, 'de');
    expect(f2.data.across).toBe(0); expect(shape(f2, 'vC')).toBeUndefined();
    expect(shape(f2, 'bent')).toBeDefined(); expect(f2.data.gamma).toBeLessThan(170); expect(lab(f2, 'lab-gamma')?.o).toBe(1);
    expect(lab(f2, 'box2')?.o).toBe(1);
  });
});
