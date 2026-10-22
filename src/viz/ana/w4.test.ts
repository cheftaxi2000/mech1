import { describe, expect, it } from 'vitest';
import { PROD, TAN_EXAMPLES, productAreas } from '../../analysis/deriv';
import {
  CHAIN_WIN, INV_WIN, NORM_WIN, PROD_WIN, SEC_STEPS, SEC_WIN, SIDE_CASES, chainBars, invTriangle, niceStep, normalTriangles,
  prodRects, secantFrame, secantPts, sides, zoomBend, zoomWindow,
} from './w4';

const inside = (p: readonly number[], w: { x: readonly number[]; y: readonly number[] }) =>
  p[0] >= w.x[0] && p[0] <= w.x[1] && p[1] >= w.y[0] && p[1] <= w.y[1];

describe('secant animation (Ü4 p. 2)', () => {
  it('final frames: h = 1, 0.5, 0.1, 0.01, then the tangent', () => {
    const hs = [0, 1, 2, 3, 4].map((s) => secantFrame(s, 1).h);
    expect(hs.map((h) => +h.toFixed(12))).toEqual([1, 0.5, 0.1, 0.01, 0.01]);
    expect([0, 1, 2, 3, 4].map((s) => secantFrame(s, 1).filled)).toEqual([1, 2, 3, 4, 4]);
    expect(secantFrame(4, 1).tan).toBe(1);
    expect(secantFrame(3, 1).tan).toBe(0);
    expect(secantFrame(0, 1).tri).toBe(1);
  });
  it('h decreases monotonically through every step', () => {
    let last = Infinity;
    for (let s = 1; s < SEC_STEPS - 1; s++) for (let i = 0; i <= 20; i++) {
      const h = secantFrame(s, i / 20).h; expect(h).toBeLessThanOrEqual(last + 1e-12); last = h;
    }
  });
  it('P, Q and the triangle corner stay inside the window', () => {
    for (const h of [1, 0.5, 0.1, 0.01]) for (const p of Object.values(secantPts(h))) expect(inside(p, SEC_WIN)).toBe(true);
    expect(secantPts(1).Q).toEqual([2, 4]);
  });
  it('triangle labels only while the triangle is big enough', () => {
    expect(secantFrame(1, 1).triLabels).toBe(true); expect(secantFrame(2, 1).triLabels).toBe(false);
  });
});

describe('left and right secants (Ü4 p. 3)', () => {
  it('x² at 1: slopes 2 − h and 2 + h', () => {
    for (const h of [1, 0.3, 0.05]) { const s = sides('sq', h); expect(s.mLeft).toBeCloseTo(2 - h, 12); expect(s.mRight).toBeCloseTo(2 + h, 12); }
  });
  it('|x| at 0: −1 and +1 for every h', () => {
    for (const h of [2, 0.5, 0.02]) { const s = sides('abs', h); expect(s.mLeft).toBe(-1); expect(s.mRight).toBe(1); }
  });
  it('all points inside their windows for the full slider range', () => {
    for (const c of ['sq', 'abs'] as const) for (const h of [0.02, 0.5, SIDE_CASES[c].hMax]) {
      const s = sides(c, h); for (const p of [s.P, s.Qm, s.Qp]) expect(inside(p, SIDE_CASES[c])).toBe(true);
    }
  });
});

describe('product, chain, inverse figures', () => {
  it('product rectangles fit the window for h ≤ 1', () => {
    const a = productAreas(PROD.u, PROD.v, PROD.du, PROD.dv, 1);
    for (const p of prodRects(PROD.u, PROD.v, a.Du, a.Dv).corner) expect(inside(p, PROD_WIN)).toBe(true);
  });
  it('chain bars fit the number lines for Δx ≤ 0.5 and the rates multiply', () => {
    const b = chainBars(0.5);
    expect(b.gBar[1]).toBeLessThan(CHAIN_WIN.x[1] - 0.2);
    expect(b.rTotal).toBeCloseTo(b.rU * b.rG, 12);
  });
  it('mirroring the triangle at y = x turns slope m into 1/m', () => {
    for (const x0 of [0.4, 1, 1.6]) {
      const a = invTriangle(x0, 0), b = invTriangle(x0, 1);
      expect(a.slope).toBeCloseTo(a.m, 12); expect(b.slope).toBeCloseTo(1 / a.m, 12);
      for (const p of [...a.tri, ...b.tri]) expect(inside(p, INV_WIN)).toBe(true);
      expect(b.tri[0][0]).toBeCloseTo(a.tri[0][1], 12); expect(b.tri[0][1]).toBeCloseTo(a.tri[0][0], 12);
    }
  });
});

describe('tangent zoom and normal', () => {
  it('windows are centred on P and shrink with the zoom', () => {
    for (const e of TAN_EXAMPLES) {
      const w = zoomWindow(e, 10);
      expect(inside([e.x0, e.f(e.x0)], w)).toBe(true);
      expect(zoomBend(e, 100)).toBeLessThan(zoomBend(e, 10) / 5);
      expect(zoomBend(e, 10)).toBeLessThan(zoomBend(e, 1) / 5);
    }
  });
  it('the first window shows clearly that the curve is bent (> 10 % of the height)', () => {
    for (const e of TAN_EXAMPLES) expect(zoomBend(e, 1)).toBeGreaterThan(0.1);
  });
  it('nice steps', () => {
    expect(niceStep(4)).toBe(1); expect(niceStep(0.4)).toBeCloseTo(0.1, 12); expect(niceStep(8.8)).toBe(2); expect(niceStep(0.04)).toBeCloseTo(0.01, 12);
  });
  it('the turned triangle has slope −1/m and stays inside the window', () => {
    for (const x0 of [-1.2, -0.5, 0.5, 1.2]) {
      const n = normalTriangles(x0);
      const s = (n.rotTri[2][1] - n.rotTri[0][1]) / (n.rotTri[2][0] - n.rotTri[0][0]);
      expect(s).toBeCloseTo(n.mN, 12); expect(s * n.m).toBeCloseTo(-1, 12);
      for (const p of [...n.tanTri, ...n.rotTri]) expect(inside(p, NORM_WIN)).toBe(true);
    }
    expect(normalTriangles(0).mN).toBe(Infinity);
  });
});
