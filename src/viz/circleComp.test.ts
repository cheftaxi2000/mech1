import { describe, expect, it } from 'vitest';
import { cross } from '../physics/vec';
import { circleState, tangentSlopes } from './circleComp';

describe('circle in components', () => {
  it('v = ω × r in components (lecture p. 11) equals the closed form', () => {
    for (const w of [-2, -0.5, 0.8, 2]) for (const t of [0, 0.7, 2.1, 5]) {
      const s = circleState(1.3, w, t), v = cross([0, 0, w], [s.x, s.y, 0]);
      expect(v[0]).toBeCloseTo(s.vx, 12); expect(v[1]).toBeCloseTo(s.vy, 12); expect(v[2]).toBeCloseTo(0, 12);
    }
  });
  it('the velocity components are the slopes of x(t) and y(t) (numerical derivative)', () => {
    const h = 1e-6;
    for (const w of [-1.5, 1, 2]) for (const t of [0.3, 1.9, 4.4]) {
      const a = circleState(1, w, t - h), b = circleState(1, w, t + h), [mx, my] = tangentSlopes(1, w, t);
      expect((b.x - a.x) / (2 * h)).toBeCloseTo(mx, 6); expect((b.y - a.y) / (2 * h)).toBeCloseTo(my, 6);
    }
  });
  it('the speed is |φ̇| R and v ⊥ r at all times', () => {
    for (const t of [0, 1, 2, 3]) {
      const s = circleState(2, 1.2, t);
      expect(Math.hypot(s.vx, s.vy)).toBeCloseTo(2.4, 12); expect(s.speed).toBeCloseTo(2.4, 12);
      expect(s.x * s.vx + s.y * s.vy).toBeCloseTo(0, 12);
    }
  });
});
