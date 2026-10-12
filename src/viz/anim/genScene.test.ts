import { describe, expect, it } from 'vitest';
import { genScene } from './genScene';
import { expectInside, expectNoOverlap, lab, shape } from './sceneTestKit';

const N = 5;
describe('general motion: translation plus Kreiselung (p. 22)', () => {
  it('ρ̇ is perpendicular to ρ (M turns about B)', () => expect(genScene(2, 1, 'de').data.rhoDotDotRho).toBeCloseTo(0, 9));
  it('every frame inside the figure', () => expectInside(genScene, N));
  it('final frames: labels do not overlap', () => expectNoOverlap(genScene, N));
  it('final frames show what the captions say', () => {
    const f0 = genScene(0, 1, 'de');
    expect(f0.data.tau).toBeCloseTo(2, 9); expect(shape(f0, 'ghost')).toBeDefined(); expect(shape(f0, 'pathM')).toBeDefined();
    const f1 = genScene(1, 1, 'de');
    expect(shape(f1, 'rB')?.o).toBe(1); expect(shape(f1, 'rM')?.o).toBe(1); expect(shape(f1, 'rho')?.o).toBe(1); expect(lab(f1, 'box1')?.o).toBe(1);
    const f2 = genScene(2, 1, 'de');
    expect(shape(f2, 'vB')?.o).toBe(1); expect(shape(f2, 'vB-copy')?.o).toBe(1); expect(shape(f2, 'rel')?.o).toBe(1); expect(shape(f2, 'vM')?.o).toBe(1); expect(lab(f2, 'box2')?.o).toBe(1);
    expect(shape(f2, 'rB')).toBeUndefined();
    const f3 = genScene(3, 1, 'de');
    expect(shape(f3, 'circle')?.o).toBe(1); expect(shape(f3, 'rhodot')?.o).toBe(1); expect(lab(f3, 'lab-w')?.o).toBe(1); expect(lab(f3, 'box3')?.o).toBe(1); expect(shape(f3, 'vB')).toBeUndefined();
    const f4 = genScene(4, 1, 'de');
    expect(shape(f4, 'vM')?.o).toBe(1); expect(shape(f4, 'rel')?.o).toBe(1); expect(lab(f4, 'box4')?.rows?.length).toBe(3); expect(lab(f4, 'box4')?.o).toBe(1);
  });
});
