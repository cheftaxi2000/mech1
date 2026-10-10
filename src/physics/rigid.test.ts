import { describe, expect, it } from 'vitest';
import { rigidVelocity, sdpgDefect } from './rigid';
import { cross, dot, scale, sub, triple, vecApproxEqual, type Vec3 } from './vec';

describe('SdpG holds for every rigid velocity field (lecture p. 12)', () => {
  it('random fields v = v_B + ω × BM', () => {
    const vB: Vec3 = [0.3, -1, 2], w: Vec3 = [1.5, 0.2, -0.7], rB: Vec3 = [1, 1, 0];
    const pts: Vec3[] = [[0, 0, 0], [2, -1, 3], [-4, 0.5, 1], [1, 7, -2]];
    for (const m of pts) for (const n of pts)
      expect(sdpgDefect(m, rigidVelocity(vB, w, rB, m), n, rigidVelocity(vB, w, rB, n))).toBeCloseTo(0);
  });
});

describe('Beispiel p. 13: gleitende Leiter', () => {
  // A on the floor at (−L cos α, 0), B on the wall (x = 0) at (0, L sin α).
  it('SdpG result v_V = v_H cot α agrees with differentiating the geometry', () => {
    const L = 3, vH = 0.8;
    for (const alpha of [0.3, 0.8, 1.2]) {
      const alphaDot = vH / (L * Math.sin(alpha)); // from ẋ_A = L sin α · α̇ = v_H (α grows as A slides to the wall)
      const vV = L * Math.cos(alpha) * alphaDot; // ẏ_B
      expect(vV).toBeCloseTo(vH / Math.tan(alpha));
      expect(sdpgDefect([-L * Math.cos(alpha), 0, 0], [vH, 0, 0], [0, L * Math.sin(alpha), 0], [0, vV, 0])).toBeCloseTo(0);
    }
  });
});

describe('Rotation proof p. 17 (equal angular speed)', () => {
  it('R-003: the argument divides by (e_z × r_P)·r_Q, which vanishes if P, Q and the axis are coplanar', () => {
    const ez: Vec3 = [0, 0, 1];
    expect(triple(ez, [1, 0, 0], [2, 0, 5])).toBe(0); // P, Q both in the xz-plane → no information
    expect(triple(ez, [1, 0, 0], [0, 2, 5])).not.toBe(0);
  });
});

describe('Beispiel p. 19: Würfel, Rotation about E (cube edge a)', () => {
  const a = 2, v = 1.5;
  const A: Vec3 = [0, 0, 0], B: Vec3 = [a, 0, 0], E: Vec3 = [0, a, 0], C: Vec3 = [a, a, a];
  const vel = (w: Vec3, P: Vec3) => cross(w, sub(P, E)); // v_E = 0
  it('handwritten solution: v_A = (v,0,−v) ⇒ ω = (v/a)(1,0,1), v_B = (v,v,−v), axis ∥ EC', () => {
    const w = scale(v / a, [1, 0, 1]);
    expect(vecApproxEqual(vel(w, A), [v, 0, -v])).toBe(true);
    expect(vecApproxEqual(vel(w, B), [v, v, -v])).toBe(true);
    expect(vecApproxEqual(vel(w, C), [0, 0, 0])).toBe(true); // C lies on μ — matches the red line E→C
  });
  it('R-004: typed v_A = (v,0,v) is also consistent but gives a different ω = (v/a)(−1,2,1)', () => {
    const w = scale(v / a, [-1, 2, 1]);
    expect(vecApproxEqual(vel(w, A), [v, 0, v])).toBe(true);
    expect(vecApproxEqual(vel(w, B), [v, v, -v])).toBe(true);
    expect(vecApproxEqual(vel(w, C), [0, 0, 0])).toBe(false); // axis would NOT pass through C
  });
});

describe('Beispiel p. 23: Würfel, allgemeine Bewegung (edge L)', () => {
  const L = 2, v = 0.9;
  const B: Vec3 = [0, 0, 0], P1: Vec3 = [L, L, 0], P2: Vec3 = [0, L, L], P3: Vec3 = [0, 0, L];
  const v1: Vec3 = [-v, 0, 0], v2: Vec3 = [0, 0, v], v3: Vec3 = [-v, 0, 0];
  const w = scale(v / L, [1, 1, -1]);
  it('ω = (v/L)(1, 1, −1) reproduces all three given velocities', () => {
    expect(vecApproxEqual(rigidVelocity(v3, w, P3, P1), v1)).toBe(true);
    expect(vecApproxEqual(rigidVelocity(v3, w, P3, P2), v2)).toBe(true);
  });
  it('v_B = (−2v, v, 0)  (v_Bz left blank in the notes — it is 0)', () => {
    expect(vecApproxEqual(rigidVelocity(v3, w, P3, B), [-2 * v, v, 0])).toBe(true);
    expect(vecApproxEqual(rigidVelocity(v1, w, P1, B), [-2 * v, v, 0])).toBe(true);
  });
  it('ω·v is the same for every point (invariant of the motion)', () => {
    const k = dot(w, v1);
    for (const P of [P2, P3, B]) expect(dot(w, rigidVelocity(v1, w, P1, P))).toBeCloseTo(k);
  });
});
