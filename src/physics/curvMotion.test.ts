import { describe, expect, it } from 'vitest';
import { inside, posOf, qAt, timeToEdge, velocityOf, velocityTerms, type CMode, type Q } from './curvMotion';
import { numericVelocity } from './kinematics';
import { cross, dot, norm, vecApproxEqual } from './vec';

const CASES: [CMode, Q, Q][] = [
  ['cyl', [1.2, -0.35, 0.3], [-0.4, 0.6, 0.15]], // the student's screenshot: ρ̇ ≠ 0 → spiral, not the φ-circle
  ['cyl', [1.0, 2.0, -0.5], [0.3, -0.8, 0.2]],
  ['cyl', [1.5, 0.4, 0.0], [0, 0.7, 0]],
  ['sph', [1.5, 1.13, -0.35], [0, 0.25, 0.6]],
  ['sph', [1.2, 0.8, 1.0], [0.3, -0.4, 0.9]],
];

describe('constant-rate motion in the figure (lecture p. 10)', () => {
  it('the sum of the three terms equals the derivative of the drawn trajectory, i.e. v is tangent to it', () => {
    for (const [mode, q0, rates] of CASES) for (const t of [0, 0.5, 1.2]) {
      const path = (s: number) => posOf(mode, qAt(q0, rates, s));
      expect(vecApproxEqual(velocityOf(mode, qAt(q0, rates, t), rates), numericVelocity(path, t), 1e-6)).toBe(true);
    }
  });
  it('with ρ̇ ≠ 0, v is NOT tangent to the φ-circle (it has a radial part) — only with ρ̇ = ż = 0', () => {
    const [mode, q0, rates] = CASES[0];
    const v = velocityOf(mode, q0, rates);
    const radial = [Math.cos(q0[1]), Math.sin(q0[1]), 0] as const;
    expect(Math.abs(dot(v, radial))).toBeGreaterThan(0.3); // = |ρ̇|
    const vc = velocityOf('cyl', CASES[2][1], CASES[2][2]);
    const p = posOf('cyl', CASES[2][1]);
    expect(dot(vc, [p[0], p[1], 0])).toBeCloseTo(0, 12); // pure φ̇: tangent to the circle
  });
  it('the three terms are mutually perpendicular (orthogonal basis)', () => {
    for (const [mode, q0, rates] of CASES) {
      const [a, b, c] = velocityTerms(mode, q0, rates);
      expect(dot(a, b)).toBeCloseTo(0, 12); expect(dot(b, c)).toBeCloseTo(0, 12); expect(dot(a, c)).toBeCloseTo(0, 12);
    }
  });
  it('timeToEdge stops before the coordinates become invalid (ρ → 0)', () => {
    const t = timeToEdge('cyl', [1.2, 0, 0], [-0.4, 0.6, 0], 1, 10);
    expect(t).toBeGreaterThan(2.5); expect(t).toBeLessThan(2.71);
    expect(inside('cyl', qAt([1.2, 0, 0], [-0.4, 0.6, 0], t))).toBe(true);
    expect(norm(cross([1, 0, 0], [0, 1, 0]))).toBe(1);
  });
});
