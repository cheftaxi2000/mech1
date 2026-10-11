import { describe, expect, it } from 'vitest';
import { OM, omegaGeom, omegaScene } from './omegaScene';
import { proof3 } from '../../physics/rotation';
import { expectInside, expectNoOverlap, lab, shape } from './sceneTestKit';

describe('proof 3: equal angular speed (p. 17)', () => {
  it('the drawn projections agree with physics/rotation.proof3 (projections = φ̇·X/|PQ|)', () => {
    const g = omegaGeom(0, 0, 1.5);
    const p = proof3([g.rP[0], g.rP[1], 0.7], [g.rQ[0], g.rQ[1], -0.3], OM.k * OM.wP, OM.k * 1.5);
    expect(g.projP).toBeCloseTo(p.projP * p.L / g.L, 9); // same 2D length (z does not enter the top view)
    expect(g.projP).toBeCloseTo((OM.k * OM.wP * g.X) / g.L, 9);
    expect(g.projQ).toBeCloseTo((OM.k * 1.5 * g.X) / g.L, 9);
    expect(Math.abs(g.X)).toBeGreaterThan(0.5 * OM.rhoP * OM.rhoQ); // P, Q, O clearly not in line
  });
  it('step 1: unequal angular speeds change the distance PQ', () => {
    expect(Math.abs(omegaScene(1, 1, 'de').data.L - 1)).toBeGreaterThan(0.04);
  });
  it('every frame inside the figure', () => expectInside(omegaScene, 5));
  it('final frames: labels do not overlap', () => expectNoOverlap(omegaScene, 5));
  it('final frames show what the captions say', () => {
    const f0 = omegaScene(0, 1, 'de');
    expect(f0.data.wQ).toBe(OM.wQwrong); expect(shape(f0, 'vQ')?.o).toBe(1);
    const f1 = omegaScene(1, 1, 'de');
    expect(shape(f1, 'P0')?.o).toBe(1); expect(lab(f1, 'box1')?.o).toBe(1);
    const f2 = omegaScene(2, 1, 'de');
    expect(shape(f2, 'P0')).toBeUndefined(); expect(shape(f2, 'projP')).toBeDefined();
    expect(Math.abs(f2.data.projP - f2.data.projQ)).toBeGreaterThan(8); // visibly different
    expect(lab(f2, 'box2')?.o).toBe(1);
    const f3 = omegaScene(3, 1, 'de');
    expect(shape(f3, 'par')?.o).toBe(1); expect(lab(f3, 'lab-X')?.o).toBe(1); expect(lab(f3, 'box3')?.o).toBe(1);
    const f4 = omegaScene(4, 1, 'de');
    expect(f4.data.wQ).toBeCloseTo(OM.wP, 12); expect(f4.data.projQ).toBeCloseTo(f4.data.projP, 9); expect(lab(f4, 'box4')?.o).toBe(1);
  });
});
