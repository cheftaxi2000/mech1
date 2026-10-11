import { describe, expect, it } from 'vitest';
import { DOOR, FOOT, axisDir, doorPoint, footNumbers } from './rotGeom';
import { footOnAxis } from '../physics/rotation';
import { cross, dot, norm, normalize, scale, sub } from '../physics/vec';

const DEG = Math.PI / 180;

describe('RotationExplorer geometry (door on the axis μ)', () => {
  it('points on μ (r = 0, d = 0) — the hinges A, B — do not move, for every tilt and angle', () => {
    for (const beta of [0, 20 * DEG, 50 * DEG]) for (const phi of [0.3, 2, -1.4]) for (const s of [DOOR.sA, DOOR.sB, 2.9]) {
      const p = doorPoint(beta, phi, s, 0), q = doorPoint(beta, 0, s, 0);
      expect(norm(sub(p, q))).toBeLessThan(1e-12);
    }
  });
  it('every body point stays on its circle about μ and turns by exactly φ', () => {
    for (const beta of [0, 35 * DEG]) for (const [s, r, d] of [[2.3, 1.5, 0], [1.2, 0.9, 0.05], [0.4, 0.3, -0.05]]) {
      const e = axisDir(beta), p0 = doorPoint(beta, 0, s, r, d), A = footOnAxis(p0, DOOR.A0, e), R = norm(sub(p0, A));
      for (const phi of [0.5, 1.9, -2.6]) {
        const p = doorPoint(beta, phi, s, r, d);
        expect(norm(sub(p, A))).toBeCloseTo(R, 12);
        const a = sub(p0, A), b = sub(p, A);
        expect(Math.atan2(dot(normalize(e), cross(a, b)), dot(a, b))).toBeCloseTo(phi, 12);
      }
    }
  });
  it('the drawn velocity ω × (p − A0) equals the time derivative of the turning door', () => {
    const beta = 30 * DEG, w = 0.8, e = axisDir(beta), h = 1e-6;
    for (const phi of [0.2, 1.5]) {
      const p = doorPoint(beta, phi, 2.3, 1.5);
      const v = scale(1 / (2 * h), sub(doorPoint(beta, phi + w * h, 2.3, 1.5), doorPoint(beta, phi - w * h, 2.3, 1.5)));
      const vr = cross(scale(w, e), sub(p, DOOR.A0));
      expect(norm(sub(v, vr))).toBeLessThan(1e-6);
    }
  });
});

describe('FootDemo (p. 18): |v_M| = |ω|·|AM| wherever O lies on μ', () => {
  it('|OM| sin α = |AM| and |v_M| = |ω|·|AM| for every position of O', () => {
    for (const s of [-1.6, -0.5, 0, 0.7, 1.4]) {
      const n = footNumbers(s);
      expect(n.height).toBeCloseTo(FOOT.AM, 12);
      expect(n.v).toBeCloseTo(FOOT.W * FOOT.AM, 12);
      // cross-check with the vector product in 3D: μ = z-axis, M = (AM, 0, 0), O = (0, 0, s)
      expect(norm(cross([0, 0, FOOT.W], [FOOT.AM, 0, -s]))).toBeCloseTo(n.v, 12);
    }
  });
});
