import { describe, expect, it } from 'vitest';
import { reaction, resultant, type PointForce } from '../../physics/force';
import { expectInside, expectNoOverlap, lab, shape } from '../anim/sceneTestKit';
import { A1, A2, reactionScene } from './reactionScene';

const STEPS = 4;
const near = (p: readonly number[], q: readonly number[], tol = 1e-6) => { expect(Math.abs(p[0] - q[0])).toBeLessThan(tol); expect(Math.abs(p[1] - q[1])).toBeLessThan(tol); };
const cx = (pts: readonly (readonly number[])[]) => pts.reduce((s, p) => s + p[0], 0) / pts.length;

describe('Reaktionsprinzip animation (p. 30)', () => {
  it('step 1 (final frame): only the Actio, an arrow that ENDS at A₂ and points down onto the lower body', () => {
    const f = reactionScene(0, 1, 'de');
    const a = shape(f, 'actio')!;
    near(a.pts[1], A2); // head at A₂
    expect(a.pts[0][1]).toBeLessThan(a.pts[1][1]); // comes from above (screen y grows downwards)
    expect(a.pts[0][0]).toBeCloseTo(a.pts[1][0], 9); // vertical
    expect(shape(f, 'reactio')).toBeUndefined();
    expect(lab(f, 'lab-actio')?.o).toBe(1);
    expect(lab(f, 'lab-reactio')).toBeUndefined();
  });
  it('step 2 (final frame): the Reactio ends at A₁, has the same length, and points the opposite way', () => {
    const f = reactionScene(1, 1, 'de');
    const a = shape(f, 'actio')!, r = shape(f, 'reactio')!;
    near(r.pts[1], A1);
    const va = [a.pts[1][0] - a.pts[0][0], a.pts[1][1] - a.pts[0][1]], vr = [r.pts[1][0] - r.pts[0][0], r.pts[1][1] - r.pts[0][1]];
    near(va, [-vr[0], -vr[1]]); // equal and opposite
    expect(lab(f, 'lab-reactio')?.o).toBe(1);
    expect(shape(f, 'pt1')).toBeDefined(); expect(shape(f, 'pt2')).toBeDefined();
  });
  it('the two arrows are the physics pair: {A₂|F} and its reaction {A₁|−F} (force.ts)', () => {
    const f = reactionScene(1, 1, 'de');
    const a = shape(f, 'actio')!, r = shape(f, 'reactio')!;
    // screen → physics (y up)
    const F: [number, number, number] = [a.pts[1][0] - a.pts[0][0], -(a.pts[1][1] - a.pts[0][1]), 0];
    const act: PointForce = { A: [A2[0], -A2[1], 0], F };
    const re = reaction(act, [A1[0], -A1[1], 0]);
    near([r.pts[1][0] - r.pts[0][0], -(r.pts[1][1] - r.pts[0][1])], [re.F[0], re.F[1]]);
    expect(resultant([act, re])).toEqual([0, 0, 0]);
  });
  it('step 3 (final frame): two separate pictures — A₂ with its arrow on the left, A₁ with its arrow on the right', () => {
    const f = reactionScene(2, 1, 'de');
    expect(f.data.split).toBe(1);
    expect(cx(shape(f, 'body2')!.pts)).toBeLessThan(200);
    expect(cx(shape(f, 'body1')!.pts)).toBeGreaterThan(200);
    expect(shape(f, 'actio')!.pts[1][0]).toBeLessThan(200);
    expect(shape(f, 'reactio')!.pts[1][0]).toBeGreaterThan(200);
    expect(shape(f, 'divider')?.o).toBe(1);
    expect(lab(f, 'pic1')?.o).toBe(1); expect(lab(f, 'pic2')?.o).toBe(1);
    // both arrows keep their equal length after the split (same scale for both pictures)
    const L = (k: string) => { const s = shape(f, k)!; return Math.hypot(s.pts[1][0] - s.pts[0][0], s.pts[1][1] - s.pts[0][1]); };
    expect(L('actio')).toBeCloseTo(L('reactio'), 9);
  });
  it('step 4 (final frame): back together, named Actio and Reactio, no divider', () => {
    const f = reactionScene(3, 1, 'de');
    expect(f.data.split).toBe(0);
    expect(shape(f, 'divider')).toBeUndefined();
    expect(lab(f, 'tag-actio')?.o).toBe(1); expect(lab(f, 'tag-reactio')?.o).toBe(1);
    near(shape(f, 'actio')!.pts[1], A2); near(shape(f, 'reactio')!.pts[1], A1);
  });
  it('every frame inside the figure; final-frame labels do not overlap', () => {
    expectInside(reactionScene, STEPS);
    expectNoOverlap(reactionScene, STEPS, 0.12);
  });
});
