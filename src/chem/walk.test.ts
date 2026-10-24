import { describe, expect, it } from 'vitest';
import { makeWalk, pathLength, pointAtLength, theoryMfp } from './walk';

describe('random walk among frozen molecules (slide 28)', () => {
  const base = { seed: 3, W: 60, H: 60, density: 0.05, rc: 1 };
  it('is deterministic and stays in the box', () => {
    const a = makeWalk({ ...base, collisions: 40 }), b = makeWalk({ ...base, collisions: 40 });
    expect(a.path).toEqual(b.path);
    expect(makeWalk({ ...base, seed: 4, collisions: 40 }).path).not.toEqual(a.path);
    for (const p of a.path) { expect(p[0]).toBeGreaterThanOrEqual(0); expect(p[0]).toBeLessThanOrEqual(60); expect(p[1]).toBeGreaterThanOrEqual(0); expect(p[1]).toBeLessThanOrEqual(60); }
    expect(a.collisionAt.length).toBe(40); expect(a.segLengths.length).toBe(40);
  });
  it('collisions happen at distance rc from an obstacle, and the segment lengths add up to the path length', () => {
    const w = makeWalk({ ...base, collisions: 60 });
    for (const k of w.collisionAt) {
      const d = Math.min(...w.obstacles.map((o) => Math.hypot(o[0] - w.path[k][0], o[1] - w.path[k][1])));
      expect(d).toBeCloseTo(w.rc, 6);
    }
    expect(w.segLengths.reduce((s, x) => s + x, 0)).toBeCloseTo(pathLength(w.path, w.collisionAt[w.collisionAt.length - 1]), 3);
  });
  it('mean free path = 1/(2·rc·ρ) (2-D) — twice the density halves the path', () => {
    const mean = (d: number) => { let s = 0, n = 0; for (const seed of [1, 2, 3, 4, 5]) { const w = makeWalk({ seed, W: 120, H: 120, density: d, rc: 1, collisions: 500 }); s += w.segLengths.reduce((a, b) => a + b, 0); n += w.segLengths.length; } return s / n; };
    const m1 = mean(0.05), m2 = mean(0.1);
    expect(m1 / theoryMfp(0.05, 1)).toBeGreaterThan(0.85); expect(m1 / theoryMfp(0.05, 1)).toBeLessThan(1.15);
    expect(m2 / m1).toBeGreaterThan(0.42); expect(m2 / m1).toBeLessThan(0.58);
  });
  it('the zigzag does not get far: after 300 collisions the distance from the start is a small part of the path walked', () => {
    const w = makeWalk({ seed: 7, W: 400, H: 400, density: 0.05, rc: 1, collisions: 300 });
    const end = w.path[w.path.length - 1], s = w.path[0];
    expect(Math.hypot(end[0] - s[0], end[1] - s[1]) / pathLength(w.path)).toBeLessThan(0.3);
  });
  it('pointAtLength walks along the polyline', () => {
    const w = makeWalk({ ...base, collisions: 10 });
    expect(pointAtLength(w.path, 0).p).toEqual(w.path[0]);
    const L = pathLength(w.path);
    expect(pointAtLength(w.path, L).p[0]).toBeCloseTo(w.path[w.path.length - 1][0], 9);
    const half = pointAtLength(w.path, L / 2);
    expect(pathLength([...w.path.slice(0, half.k + 1), half.p])).toBeCloseTo(L / 2, 6);
  });
});
