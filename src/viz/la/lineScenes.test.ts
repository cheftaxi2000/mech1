import { describe, expect, it } from 'vitest';
import { holds } from '../../linalg/lines2';
import {
  COMBINE_STEPS, COMBINE_WIN, C_P, SIMPLIFY_STEPS, SIMPLIFY_WIN, S_P, combineScene, simplifyScene, type LineScene, type Win,
} from './lineScenes';

const vis = (s: LineScene) => ({
  lines: s.lines.filter((l) => l.o > 0.5).map((l) => l.key),
  labels: s.labels.filter((l) => l.o > 0.5).map((l) => l.key),
});
const inside = (s: LineScene, w: Win) => s.labels.every((l) => l.x >= w.x[0] && l.x <= w.x[1] && l.y >= w.y[0] && l.y <= w.y[1]);

describe('combineScene (slide 13)', () => {
  it('final frames show what the captions say', () => {
    expect(vis(combineScene(0, 1))).toEqual({ lines: ['E1', 'E2'], labels: ['lE1', 'lE2', 'lP'] });
    expect(vis(combineScene(1, 1))).toEqual({ lines: ['E1', 'E2'], labels: ['lE1', 'lE2', 'lP', 'v1', 'v2'] });
    expect(vis(combineScene(2, 1))).toEqual({ lines: ['E1', 'E2', 'S'], labels: ['lE1', 'lE2', 'lP', 'v1', 'v2', 'lS'] });
    expect(combineScene(2, 1).lines.find((l) => l.key === 'S')!.e).toEqual([3, 1, 4]);
  });
  it('every line passes through (1, 1) in every frame; labels inside the window', () => {
    for (let s = 0; s < COMBINE_STEPS; s++) for (let i = 0; i <= 10; i++) {
      const sc = combineScene(s, i / 10);
      for (const l of sc.lines) expect(holds(l.e, ...C_P)).toBe(true);
      expect(inside(sc, COMBINE_WIN)).toBe(true);
    }
  });
  it('the scene starts empty and grows monotonically', () => {
    expect(vis(combineScene(0, 0)).lines).toEqual([]);
  });
});

describe('simplifyScene (slides 14–15)', () => {
  it('final frames show what the captions say', () => {
    const f0 = simplifyScene(0, 1), f1 = simplifyScene(1, 1), f2 = simplifyScene(2, 1), f3 = simplifyScene(3, 1);
    expect(vis(f0)).toEqual({ lines: ['E1', 'E2'], labels: ['lE1', 'lE2'] });
    // step 1: the new line is horizontal −3y = −4 and labelled
    const H = f1.lines.find((l) => l.key === 'H')!.e;
    expect(H[0]).toBeCloseTo(0, 12); expect(H[2] / H[1]).toBeCloseTo(4 / 3, 12);
    expect(vis(f1).labels).toContain('lH');
    expect(f1.lines.find((l) => l.key === 'E1')!.dashed).toBe(true);
    // step 2: the vertical line 3x = 2
    const V = f2.lines.find((l) => l.key === 'V')!.e;
    expect(V[1]).toBeCloseTo(0, 12); expect(V[2] / V[0]).toBeCloseTo(2 / 3, 12);
    expect(vis(f2).labels).toEqual(expect.arrayContaining(['lH', 'lV']));
    // step 3: old lines pale, the solution read off
    expect(vis(f3).lines).toEqual(['H', 'V']);
    expect(vis(f3).labels).toEqual(expect.arrayContaining(['lH', 'lV', 'lP']));
  });
  it('every line passes through (2/3, 4/3) in every frame (the intersection stays); labels inside', () => {
    for (let s = 0; s < SIMPLIFY_STEPS; s++) for (let i = 0; i <= 20; i++) {
      const sc = simplifyScene(s, i / 20);
      for (const l of sc.lines) { expect(holds(l.e, ...S_P, 1e-12)).toBe(true); expect(Math.abs(l.e[0]) + Math.abs(l.e[1])).toBeGreaterThan(0.5); }
      expect(inside(sc, SIMPLIFY_WIN)).toBe(true);
    }
  });
});
