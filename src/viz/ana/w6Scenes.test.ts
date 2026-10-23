import { describe, expect, it } from 'vitest';
import { cx, reIz } from '../../analysis/week6';
import {
  HALF_WIN, MUL_WIN, REGION_PRESETS, ROOT_WIN, arcPts, boundaryIncluded, halfPlanePoly, halfScene, inside, linePts,
  mulScene, rootAnimScene, satisfies, snapPolar, tipOffset,
} from './w6Scenes';

const PI = Math.PI;

describe('multiplication animation (2e^{iπ/6})(3e^{iπ/3})', () => {
  it('final frames: z1 of length 2 at π/6; stretched to 6; turned to π/2 = 6i', () => {
    const s0 = mulScene(0, 1);
    expect(s0.r).toBeCloseTo(2, 12); expect(s0.phi).toBeCloseTo(PI / 6, 12); expect(s0.showZ2).toBe(false);
    const s1 = mulScene(1, 1);
    expect(s1.r).toBeCloseTo(6, 12); expect(s1.phi).toBeCloseTo(PI / 6, 12); expect(s1.showZ2).toBe(true);
    const s2 = mulScene(2, 1);
    expect(s2.cur.re).toBeCloseTo(0, 12); expect(s2.cur.im).toBeCloseTo(6, 12); expect(s2.done).toBe(true);
    expect(s2.result.re).toBeCloseTo(0, 12); expect(s2.result.im).toBeCloseTo(6, 12);
  });
  it('the moving point and z2 stay in the window', () => {
    for (let s = 0; s < 3; s++) for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const sc = mulScene(s, t);
      expect(inside(MUL_WIN, [sc.cur.re, sc.cur.im], 0.03)).toBe(true);
      expect(inside(MUL_WIN, [sc.z2.re, sc.z2.im], 0.03)).toBe(true);
    }
  });
});

describe('z^4 = −16 construction', () => {
  it('final frames: direction; circle; z0 at π/4; all four roots; square', () => {
    expect(rootAnimScene(0, 1).circle).toBeNull();
    expect(rootAnimScene(0, 1).shown.some(Boolean)).toBe(false);
    expect(rootAnimScene(1, 1).circle!.length).toBeGreaterThan(10);
    const s2 = rootAnimScene(2, 1);
    expect(s2.shown).toEqual([true, false, false, false]);
    expect(s2.roots[0][0]).toBeCloseTo(Math.SQRT2, 12); expect(s2.roots[0][1]).toBeCloseTo(Math.SQRT2, 12);
    expect(rootAnimScene(3, 1).shown).toEqual([true, true, true, true]);
    expect(rootAnimScene(3, 0.5).shown).toEqual([true, true, false, false]);
    expect(rootAnimScene(4, 1).square).toBe(1);
    for (const p of rootAnimScene(4, 1).roots) expect(inside(ROOT_WIN, p, 0.1)).toBe(true);
    // the marker ends on z3 = √2 − i√2
    const m = rootAnimScene(3, 1).marker!;
    expect(m.re).toBeCloseTo(Math.SQRT2, 9); expect(m.im).toBeCloseTo(-Math.SQRT2, 9);
  });
});

describe('Re(iz) > 1 construction', () => {
  it('final frames: z = 2 − 1,5i; iz = 1,5 + 2i with Re(iz) = −b = 1,5; then the half-plane', () => {
    const s0 = halfScene(0, 1);
    expect(s0.iz.re).toBeCloseTo(2, 12); expect(s0.shade).toBe(0);
    const s1 = halfScene(1, 1);
    expect(s1.iz.re).toBeCloseTo(1.5, 12); expect(s1.iz.im).toBeCloseTo(2, 12); expect(s1.showRe).toBe(true);
    expect(s1.exact.re).toBeCloseTo(1.5, 12);
    expect(s1.reIz).toBeCloseTo(1.5, 12);
    expect(halfScene(2, 1).shade).toBe(1);
    for (const st of [0, 1, 2]) for (const t of [0, 0.5, 1]) { const s = halfScene(st, t); expect(inside(HALF_WIN, [s.iz.re, s.iz.im], 0.05)).toBe(true); }
    // the turn arc ends where iz is (angle)
    const a = halfScene(1, 1).arc!; const last = a[a.length - 1];
    expect(Math.atan2(last[1], last[0])).toBeCloseTo(Math.atan2(2, 1.5), 9);
  });
});

describe('regions', () => {
  const P = Object.fromEntries(REGION_PRESETS.map((p) => [p.id, p]));
  it('disc: boundary solid, 3 + i on it is inside; half-plane: dashed, 1 − i excluded', () => {
    expect(boundaryIncluded(P.disc.conds[0])).toBe(true);
    expect(satisfies(P.disc.conds[0], cx(3, 1))).toBe(true);
    expect(boundaryIncluded(P.half.conds[0])).toBe(false);
    expect(satisfies(P.half.conds[0], cx(1, -1))).toBe(false);
    expect(satisfies(P.half.conds[0], cx(1, -1.5))).toBe(true);
  });
  it('the half-plane value is the slide’s Re(iz) and agrees with −b', () => {
    const c = P.half.conds[0];
    if (c.kind !== 'lin') throw new Error();
    for (const z of [cx(0, -2), cx(3, 0.5)]) expect(c.value!(z)).toBeCloseTo(-z.im, 12);
    expect(reIz(cx(2, -3))).toBe(3);
  });
  it('annulus: |z| = 1 belongs, |z| = 2 does not', () => {
    const ok = (z: ReturnType<typeof cx>) => P.ring.conds.every((c) => satisfies(c, z));
    expect(ok(cx(1, 0))).toBe(true); expect(ok(cx(2, 0))).toBe(false); expect(ok(cx(0, 1.5))).toBe(true); expect(ok(cx(0.5, 0))).toBe(false);
  });
  it('Re z ≥ Im z: the line belongs; intersection with the disc', () => {
    expect(satisfies(P.diag.conds[0], cx(1, 1))).toBe(true);
    expect(satisfies(P.diag.conds[0], cx(0, 1))).toBe(false);
    const both = (z: ReturnType<typeof cx>) => P.both.conds.every((c) => satisfies(c, z));
    expect(both(cx(2, 0.5))).toBe(true); expect(both(cx(4, 0))).toBe(false); expect(both(cx(0, 2))).toBe(false);
  });
  it('preset test points start inside their region, windows contain the disc', () => {
    for (const p of REGION_PRESETS) expect(p.conds.every((c) => satisfies(c, p.test))).toBe(true);
    for (const q of [[-1, 1], [3, 1], [1, 3], [1, -1]] as const) expect(inside(P.disc.win, q, 0)).toBe(true);
  });
  it('half-plane polygon lies on the right side; boundary line is on b = −1', () => {
    const c = P.half.conds[0];
    if (c.kind !== 'lin') throw new Error();
    const poly = halfPlanePoly(c, HALF_WIN);
    for (const p of poly) expect(p[1]).toBeLessThanOrEqual(-1 + 1e-9);
    const [a, b] = linePts(c, HALF_WIN);
    expect(a[1]).toBeCloseTo(-1, 9); expect(b[1]).toBeCloseTo(-1, 9);
  });
});

describe('helpers', () => {
  it('arcPts runs from a0 to a1; snapPolar snaps and clamps; tipOffset points outward', () => {
    const a = arcPts(2, 0, PI / 2);
    expect(a[0][0]).toBeCloseTo(2, 12); expect(a[a.length - 1][1]).toBeCloseTo(2, 12);
    const s = snapPolar(Math.sqrt(3), 1.02, 0.5, PI / 12, 0.5, 3);
    expect(s.r).toBe(2); expect(s.phi).toBeCloseTo(PI / 6, 12);
    expect(snapPolar(0.1, 0, 0.5, PI / 12, 0.5, 3).r).toBe(0);
    expect(snapPolar(10, 0, 0.5, PI / 12, 0.5, 3).r).toBe(3);
    expect(snapPolar(-1, -0.0001, 0.5, PI / 12, 0.5, 3).phi).toBeCloseTo(PI, 12);
    expect(tipOffset([1, 0]).anchor).toBe('l'); expect(tipOffset([-1, 0]).anchor).toBe('r');
    expect(tipOffset([0, 1]).anchor).toBe('l'); expect(tipOffset([0, -1]).anchor).toBe('l');
  });
});
