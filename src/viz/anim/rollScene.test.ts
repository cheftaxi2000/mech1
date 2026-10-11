import { describe, expect, it } from 'vitest';
import { RS, drawnV, rollScene, rollX } from './rollScene';
import { wheelVelocity } from '../../physics/rolling';
import { expectInside, expectNoOverlap, lab, shape } from './sceneTestKit';

describe('rolling cylinder = momentary rotation about the contact line (p. 20)', () => {
  it('drawn velocities match the rolling field: 0 at AB, v at C, 2v at the top (linear in the height)', () => {
    const vc = drawnV(RS.R), Om = vc / RS.R;
    for (const z of [0, 0.5 * RS.R, RS.R, 1.5 * RS.R, 2 * RS.R]) expect(drawnV(z)).toBeCloseTo(wheelVelocity(vc, Om, [0, z - RS.R])[0], 12);
    expect(drawnV(2 * RS.R)).toBeCloseTo(2 * drawnV(RS.R), 12);
  });
  it('rolling without sliding: the marked line turns by distance / R', () => {
    const f = rollScene(1, 1, 'de');
    expect(f.data.turn).toBeCloseTo((rollX(1, 1) - RS.X0) / RS.R, 12);
  });
  it('every frame inside the figure', () => expectInside(rollScene, 4));
  it('final frames: labels do not overlap', () => expectNoOverlap(rollScene, 4));
  it('final frames show what the captions say', () => {
    const f0 = rollScene(0, 1, 'de'); expect(shape(f0, 'CD')).toBeDefined(); expect(shape(f0, 'v1')).toBeUndefined();
    const f1 = rollScene(1, 1, 'de'); expect(f1.data.xc).toBeCloseTo(RS.X1, 12); expect(lab(f1, 'box1')?.o).toBe(1);
    const f2 = rollScene(2, 1, 'de'); expect(shape(f2, 'v1')?.o).toBe(1); expect(shape(f2, 'v3')?.o).toBe(1); expect(lab(f2, 'lab-mu')?.o).toBe(1); expect(lab(f2, 'box2')?.o).toBe(1);
    const f3 = rollScene(3, 1, 'de'); expect(f3.data.xc).toBeCloseTo(RS.X2, 12); expect(shape(f3, 'mu-old')?.o).toBe(1); expect(lab(f3, 'lab-mu')?.o).toBe(1);
  });
});
