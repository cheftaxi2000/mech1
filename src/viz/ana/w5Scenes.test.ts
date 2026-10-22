import { describe, expect, it } from 'vitest';
import { EX2_ZOOM, MVT, ex1Scene, ex2Scene, inside, mvtScene, niceStep, snapHalf, tanScene, tipLabel } from './w5Scenes';

describe('tangent scene (Δf ≈ df)', () => {
  it('final frames show what the captions say', () => {
    const s0 = tanScene(0, 1);
    expect(s0.dxGrow).toBe(1); expect(s0.DfGrow).toBe(0); expect(s0.showTangent).toBe(false);
    const s1 = tanScene(1, 1);
    expect(s1.DfGrow).toBe(1); expect(s1.dfGrow).toBe(0);
    const s2 = tanScene(2, 1);
    expect(s2.showTangent).toBe(true); expect(s2.dfGrow).toBe(1); expect(s2.showGap).toBe(false);
    const s3 = tanScene(3, 1);
    expect(s3.showGap).toBe(true); expect(s3.gap).toBeCloseTo(0.64, 12); // Δx² for x² at 1
    expect(s3.exact).toBeCloseTo(2.24, 12); expect(s3.lin).toBeCloseTo(1.6, 12);
    const s4 = tanScene(4, 1);
    expect(s4.dx).toBeCloseTo(0.2, 12); expect(s4.gap).toBeCloseTo(0.04, 12);
    expect(s4.lin).toBeCloseTo(0.4, 12);
  });
  it('P, Q and the tangent point stay inside the (zooming) window', () => {
    for (let step = 0; step < 5; step++) for (const t of [0, 0.3, 0.7, 1]) {
      const s = tanScene(step, t);
      for (const p of [s.P, s.Q, s.T]) expect(inside(s.win, p, 0.04)).toBe(true);
    }
  });
  it('the gap shrinks like Δx² while Δx shrinks by 4: 16 times smaller', () => {
    expect(tanScene(3, 1).gap / tanScene(4, 1).gap).toBeCloseTo(16, 9);
  });
});

describe('mean value construction (x² on [1, 3])', () => {
  it('secant m = 4; shifted line cuts twice; then touches at (2, 4)', () => {
    const s0 = mvtScene(0, 1);
    expect(s0.m).toBe(4); expect(s0.cuts).toHaveLength(0); expect(s0.secGrow).toBe(1);
    const s1 = mvtScene(1, 1);
    expect(s1.cuts).toHaveLength(2); expect(s1.touch).toBe(false);
    for (const p of s1.cuts) expect(p[1]).toBeCloseTo(4 * (p[0] - 1) + 1 - s1.k, 9); // on the shifted line
    const s2 = mvtScene(2, 1);
    expect(s2.touch).toBe(true); expect(s2.C).toEqual([2, 4]); expect(s2.showC).toBe(false);
    expect(mvtScene(3, 1).showC).toBe(true);
  });
  it('A, B, C inside the window', () => {
    const s = mvtScene(3, 1);
    for (const p of [s.A, s.B, s.C!]) expect(inside(MVT.win, p, 0.03)).toBe(true);
  });
});

describe('candidates scenes', () => {
  it('Bsp. 1: ends first, then f′ = 0 (−1/√3 outside, grey), then max 3/8 and min −2/(3√3)', () => {
    expect(ex1Scene(0).cands.every((c) => !c.shown)).toBe(true);
    expect(ex1Scene(1).cands.filter((c) => c.shown).map((c) => c.kind)).toEqual(['end', 'end']);
    const s2 = ex1Scene(2);
    expect(s2.cands.every((c) => c.shown)).toBe(true);
    expect(s2.cands.find((c) => !c.inside)!.role).toBe('muted');
    const s3 = ex1Scene(3);
    expect(s3.max).toBeCloseTo(3 / 8, 12); expect(s3.min).toBeCloseTo(-2 / (3 * Math.sqrt(3)), 12);
    expect(s3.cands.find((c) => c.x === -0.5)!.role).toBe('f');
    expect(s3.cands.find((c) => Math.abs(c.x - 1 / Math.sqrt(3)) < 1e-12)!.role).toBe('g');
    for (const c of s3.cands) expect(inside(s3.win, [c.x, c.y], 0.02)).toBe(true);
  });
  it('Bsp. 2: table fills, global max blue at ±2, min magenta at ±1/√2, zoom ends on the slide window', () => {
    expect(ex2Scene(0, 1).tableCols).toBe(5);
    const s1 = ex2Scene(1, 1);
    expect(s1.cands.filter((c) => c.role === 'f').map((c) => c.x)).toEqual([-2, 2]);
    expect(s1.cands.filter((c) => c.role === 'g')).toHaveLength(2);
    expect(s1.cands.find((c) => c.x === 0)!.role).toBe('fg');
    const s2 = ex2Scene(2, 1);
    expect(s2.win).toEqual(EX2_ZOOM);
    for (const c of s2.cands.filter((k) => Math.abs(k.x) < 1)) expect(inside(s2.win, [c.x, c.y], 0.03)).toBe(true);
  });
});

describe('helpers', () => {
  it('niceStep, snapHalf, tipLabel inside the window', () => {
    expect(niceStep(2.6)).toBe(0.5); expect(niceStep(0.65)).toBe(0.1); expect(niceStep(10)).toBe(2);
    expect(snapHalf(3.26, 5)).toBe(3.5); expect(snapHalf(-7, 5)).toBe(-5);
    const win = { x: [-5.5, 5.5] as const, y: [-5.5, 5.5] as const };
    for (const p of [[5, 5], [-5, 0], [0, -5], [0, 0], [3, 4]] as const) expect(inside(win, tipLabel(p, win), 0.05)).toBe(true);
  });
});
