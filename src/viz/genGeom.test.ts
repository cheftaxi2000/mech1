import { describe, expect, it } from 'vitest';
import { GEN, PLATE, fieldFrame, inside, mitfahrFrame, RIDE_CENTRE, type Ride } from './genGeom';

const inFrame = (p: readonly [number, number], w: number, h: number) => p[0] >= 0 && p[0] <= w && p[1] >= 0 && p[1] <= h;

describe('«Mitfahren»: the plate seen from a camera at rest or riding along with B or C', () => {
  it('the plate stays inside the figure for every time and camera', () => {
    for (const r of ['rest', 'B', 'C'] as Ride[]) for (let k = 0; k <= 40; k++) {
      const f = mitfahrFrame(r, (GEN.T_END * k) / 40);
      for (const p of [...f.plate, ...f.start]) expect(inFrame(p, 400, 300), `${r} ${k}`).toBe(true);
    }
  });
  it('riding along: the riding point stays at the centre, M stays on a circle about it, and the angle turned is the same for B and C', () => {
    for (const r of ['B', 'C'] as const) for (const t of [0.5, 2, 4]) {
      const f = mitfahrFrame(r, t), f0 = mitfahrFrame(r, 0);
      expect(f.ref![0]).toBeCloseTo(RIDE_CENTRE[0], 9); expect(f.ref![1]).toBeCloseTo(RIDE_CENTRE[1], 9);
      const d = (p: readonly [number, number]) => Math.hypot(p[0] - RIDE_CENTRE[0], p[1] - RIDE_CENTRE[1]);
      expect(d(f.M)).toBeCloseTo(d(f0.M), 9);
      const ang = (p: readonly [number, number]) => Math.atan2(-(p[1] - RIDE_CENTRE[1]), p[0] - RIDE_CENTRE[0]);
      const turned = ang(f.M) - ang(f0.M);
      expect(Math.cos(turned)).toBeCloseTo(Math.cos(f.phi), 9); expect(Math.sin(turned)).toBeCloseTo(Math.sin(f.phi), 9);
    }
    expect(mitfahrFrame('B', 3).phi).toBe(mitfahrFrame('C', 3).phi);
  });
});

describe('Grundgleichung figure: the velocity field of the plate', () => {
  const cases: [[number, number], number][] = [[[40, 12], 0], [[0, 0], 0.45], [[40, 12], 0.45], [[-40, 40], -0.5], [[40, -40], 0.5], [[40, 40], 0.5], [[-40, -40], -0.5], [[-40, -40], 0.5], [[40, 40], -0.5]];
  it('every arrow stays inside the figure for the slider ranges', () => {
    for (const [vb, w] of cases) for (const ref of ['B', 'C'] as const) {
      const f = fieldFrame(vb, w, ref);
      for (const [a, b] of [...f.grid, f.vRef, f.copy, f.rot, f.vM]) { expect(inFrame(a, 400, 280)).toBe(true); expect(inFrame(b, 400, 280), `${vb} ${w} ${ref}`).toBe(true); }
    }
  });
  it('v_M is the same with B or C as reference point; only the split changes', () => {
    for (const [vb, w] of cases) {
      const b = fieldFrame(vb, w, 'B'), c = fieldFrame(vb, w, 'C');
      expect(c.vMval[0]).toBeCloseTo(b.vMval[0], 9); expect(c.vMval[1]).toBeCloseTo(b.vMval[1], 9);
      expect(c.vM[1][0]).toBeCloseTo(c.rot[1][0], 9); expect(c.vM[1][1]).toBeCloseTo(c.rot[1][1], 9); // the triangle closes
      if (w !== 0) expect(Math.hypot(...c.rotPart)).not.toBeCloseTo(Math.hypot(...b.rotPart), 3);
    }
  });
  it('ω = 0: all arrows equal (translation); v_B = 0: the rest point is B', () => {
    const f = fieldFrame([45, 10], 0, 'B');
    for (const [a, b] of f.grid) { expect(b[0] - a[0]).toBeCloseTo(f.grid[0][1][0] - f.grid[0][0][0], 9); }
    expect(f.rest).toBeNull();
    const g = fieldFrame([0, 0], 0.5, 'B');
    expect(g.rest![0]).toBeCloseTo(g.B[0], 9); expect(g.rest![1]).toBeCloseTo(g.B[1], 9);
  });
  it('point-in-polygon test', () => { expect(inside([0, 0], PLATE)).toBe(true); expect(inside([200, 0], PLATE)).toBe(false); });
  it('rays from the point at rest: every velocity is perpendicular to its ray and proportional to its length (supplement)', () => {
    for (const [vb, w] of cases) if (w !== 0) for (const ref of ['B', 'C'] as const) {
      const f = fieldFrame(vb, w, ref), Q = f.rest!;
      for (const [a, b] of [f.vB, f.vM, ...f.grid]) {
        const rx = a[0] - Q[0], ry = a[1] - Q[1], vx = b[0] - a[0], vy = b[1] - a[1];
        expect(rx * vx + ry * vy).toBeCloseTo(0, 6);
        expect(Math.hypot(vx, vy)).toBeCloseTo(0.9 * Math.abs(w) * Math.hypot(rx, ry), 6); // drawn: KV · |ω| · distance
      }
    }
  });
});
