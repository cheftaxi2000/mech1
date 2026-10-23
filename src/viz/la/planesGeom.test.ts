import { describe, expect, it } from 'vitest';
import {
  BOX, PLANE_PRESETS, SIMPLIFY_EQS, SIMPLIFY_NEW, commonSet, labelSpots, lerpPlane, lineInBox, noneReason, pairRelation, planePolygon, polygonArea, residual,
  type Plane, type V3,
} from './planesGeom';

const preset = (id: string) => PLANE_PRESETS.find((p) => p.id === id)!.eqs;

describe('plane polygons clipped to the box ±5', () => {
  it('every corner lies on the plane and inside the box; the polygon is convex and ordered', () => {
    for (const pr of PLANE_PRESETS) for (const p of pr.eqs) {
      const poly = planePolygon(p);
      expect(poly.length).toBeGreaterThanOrEqual(3);
      expect(poly.length).toBeLessThanOrEqual(6);
      for (const x of poly) { expect(Math.abs(residual(p, x))).toBeLessThan(1e-9); for (const c of x) expect(Math.abs(c)).toBeLessThanOrEqual(BOX + 1e-9); }
      // ordered: consecutive cross products all point the same way (convex, no self-crossing)
      const n: V3 = [p[0], p[1], p[2]];
      const signs = poly.map((a, i) => {
        const b = poly[(i + 1) % poly.length], c = poly[(i + 2) % poly.length];
        const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - b[0], c[1] - b[1], c[2] - b[2]];
        const w = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
        return Math.sign(w[0] * n[0] + w[1] * n[1] + w[2] * n[2]);
      });
      expect(new Set(signs).size).toBe(1);
    }
  });
  it('known areas: z = 0 is the full 10 × 10 square; x + y + z = 0 is a regular hexagon', () => {
    expect(polygonArea(planePolygon([0, 0, 1, 0]))).toBeCloseTo(100, 9);
    const hex = planePolygon([1, 1, 1, 0]);
    expect(hex).toHaveLength(6);
    // hexagon with side 5√2: area = (3√3/2)·50
    expect(polygonArea(hex)).toBeCloseTo((3 * Math.sqrt(3) / 2) * 50, 9);
  });
  it('a plane outside the box gives nothing; a plane through one corner only gives nothing', () => {
    expect(planePolygon([0, 0, 1, 7])).toEqual([]);
    expect(planePolygon([1, 1, 1, 15])).toEqual([]);
    expect(planePolygon([0, 0, 0, 1])).toEqual([]);
  });
});

describe('the examples of the slides 16–22: verdict by exact elimination', () => {
  it('slide 16: x + y + z = 3, x − 2y + 3z = 4, 2x + y − z = 1 meet in one point (10/11, 7/11, 16/11)', () => {
    const c = commonSet(preset('point'));
    expect(c.kind).toBe('point');
    if (c.kind !== 'point') return;
    expect(c.p[0]).toBeCloseTo(10 / 11, 12); expect(c.p[1]).toBeCloseTo(7 / 11, 12); expect(c.p[2]).toBeCloseTo(16 / 11, 12);
    for (const p of preset('point')) expect(Math.abs(residual(p, c.p))).toBeLessThan(1e-12);
  });
  it('slides 17–19: no solution; three parallel planes, two parallel ones cut by a third', () => {
    expect(commonSet(preset('parallel')).kind).toBe('none');
    expect(noneReason(preset('parallel') as [Plane, Plane, Plane])).toBe('allParallel');
    expect(commonSet(preset('twoParallel')).kind).toBe('none');
    expect(noneReason(preset('twoParallel') as [Plane, Plane, Plane])).toBe('twoParallel');
  });
  it('slide 20: three coinciding planes: a whole plane of solutions', () => {
    expect(commonSet(preset('same')).kind).toBe('plane');
    const [a, b, c] = preset('same');
    expect(pairRelation(a, b)).toBe('same'); expect(pairRelation(a, c)).toBe('same');
  });
  it('slide 21: x + y = 2, x + 2y = 2, x − y = 2: infinitely many, but on the line x = 2, y = 0', () => {
    const c = commonSet(preset('line'));
    expect(c.kind).toBe('line');
    if (c.kind !== 'line') return;
    expect(c.p).toEqual([2, 0, 0]);
    expect(c.d).toEqual([0, 0, 1]);
    const seg = lineInBox(c.p, c.d)!;
    expect(seg[0]).toEqual([2, 0, -5]); expect(seg[1]).toEqual([2, 0, 5]);
  });
  it('the prism (supplement): every two planes cut, but there is no common point', () => {
    const e = preset('prism') as [Plane, Plane, Plane];
    expect(commonSet(e).kind).toBe('none');
    expect(noneReason(e)).toBe('prism');
    expect([pairRelation(e[0], e[1]), pairRelation(e[0], e[2]), pairRelation(e[1], e[2])]).toEqual(['cross', 'cross', 'cross']);
  });
  it('pairRelation: parallel vs same with a scaled equation', () => {
    expect(pairRelation([1, 1, 1, 3], [2, 2, 2, 6])).toBe('same');
    expect(pairRelation([1, 1, 1, 3], [-1, -1, -1, -5])).toBe('parallel');
    expect(pairRelation([0, 0, 1, 1], [0, 0, 2, 2])).toBe('same');
  });
});

describe('slides 22–24: simplification process', () => {
  it('the point (1/3, 2, 4/3) is the common point before and after replacing eq₃ by eq₃ − eq₂ = −3z = −4', () => {
    const before = commonSet(SIMPLIFY_EQS);
    expect(before.kind).toBe('point');
    const nw = [0, 1, 2, 3].map((i) => SIMPLIFY_EQS[2][i] - SIMPLIFY_EQS[1][i]);
    expect(nw).toEqual([...SIMPLIFY_NEW]);
    const after = commonSet([SIMPLIFY_EQS[0], SIMPLIFY_EQS[1], SIMPLIFY_NEW]);
    for (const c of [before, after]) {
      if (c.kind !== 'point') throw new Error('expected a point');
      expect(c.p[0]).toBeCloseTo(1 / 3, 12); expect(c.p[1]).toBeCloseTo(2, 12); expect(c.p[2]).toBeCloseTo(4 / 3, 12);
    }
    // the new plane is horizontal: z = 4/3
    const poly = planePolygon(SIMPLIFY_NEW);
    for (const x of poly) expect(x[2]).toBeCloseTo(4 / 3, 12);
  });
  it('while eq₃ morphs into eq₄, the point stays on the moving plane', () => {
    for (let i = 0; i <= 10; i++) expect(Math.abs(residual(lerpPlane(SIMPLIFY_EQS[2], SIMPLIFY_NEW, i / 10), [1 / 3, 2, 4 / 3]))).toBeLessThan(1e-12);
  });
});

describe('labelSpots', () => {
  it('names of three coinciding planes go to different corners, each on its plane', () => {
    const eqs = preset('same');
    const spots = labelSpots(eqs.map((p) => planePolygon(p)));
    for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) {
      const a = spots[i]!, b = spots[j]!;
      expect(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])).toBeGreaterThan(3);
    }
    spots.forEach((s, i) => expect(Math.abs(residual(eqs[i], s!))).toBeLessThan(1e-9));
  });
});

describe('lineInBox', () => {
  it('clips a diagonal line and rejects one outside', () => {
    const s = lineInBox([0, 0, 0], [1, 1, 1])!;
    expect(s[0]).toEqual([-5, -5, -5]); expect(s[1]).toEqual([5, 5, 5]);
    expect(lineInBox([6, 0, 0], [0, 0, 1])).toBeNull();
  });
});
