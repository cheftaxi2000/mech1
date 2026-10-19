import { describe, expect, it } from 'vitest';
import { rigidVelocity } from './rigid';
import {
  FIG330, centralAxis, distanceToAxis, eOmega, fig330Solution, lineG, pitch, rotateAbout, screwPosition, screwVelocity,
  speedAtDistance, vOmegaPart, vOmegaSigned, vPerpPart, velocityOnG,
} from './screw';
import { type Vec3, add, cross, dot, norm, scale, sub, vecApproxEqual } from './vec';

/** A few general Kinematen {r_B, v_B, ω} (no special directions). */
const CASES: { rB: Vec3; vB: Vec3; w: Vec3 }[] = [
  { rB: [0.3, -0.2, 0.5], vB: [0.7, -1.1, 0.4], w: [0.4, 1.1, -0.6] },
  { rB: [2, 1, -1], vB: [-0.2, 0.9, 1.5], w: [-1.3, 0.2, 0.8] },
  { rB: [0, 0.75, 0], vB: [-0.75, 0, 0.25], w: [0, 0, 1] },
];
const POINTS: Vec3[] = [[1, 2, 0], [-1.5, 0.3, 2], [0.4, -0.8, -1.1], [3, -2, 0.5]];

describe('1. Invariante (p. 24): ω does not depend on the point', () => {
  it('the Kinemate {v_P, ω} in any other point P describes exactly the same velocity field', () => {
    for (const { rB, vB, w } of CASES) for (const P of POINTS) {
      const vP = rigidVelocity(vB, w, rB, P);
      for (const M of POINTS) expect(vecApproxEqual(rigidVelocity(vP, w, P, M), rigidVelocity(vB, w, rB, M), 1e-12)).toBe(true);
    }
  });
  it('with any other ω′ in P the field does not fit (ω′ × PM = ω × PM for all M forces ω′ = ω, R-018)', () => {
    const { rB, vB, w } = CASES[0], P = POINTS[0], vP = rigidVelocity(vB, w, rB, P);
    const w2: Vec3 = add(w, [0.05, 0, 0]);
    const misfit = POINTS.map((M) => norm(sub(rigidVelocity(vP, w2, P, M), rigidVelocity(vB, w, rB, M))));
    expect(Math.max(...misfit)).toBeGreaterThan(0.01);
  });
});

describe('2. Invariante (p. 24): v_ω = (v · e_ω) e_ω is the same in every point', () => {
  it('the struck-out term (ω × BP) · e_ω is zero, so v_P · e_ω = v_B · e_ω', () => {
    for (const { rB, vB, w } of CASES) for (const P of POINTS) {
      expect(dot(cross(w, sub(P, rB)), eOmega(w))).toBeCloseTo(0, 12);
      expect(vOmegaSigned(rigidVelocity(vB, w, rB, P), w)).toBeCloseTo(vOmegaSigned(vB, w), 12);
      expect(vecApproxEqual(vOmegaPart(rigidVelocity(vB, w, rB, P), w), vOmegaPart(vB, w), 1e-12)).toBe(true);
    }
  });
  it('v = v_ω + v^⊥ with v_ω ∥ ω and v^⊥ ⊥ ω (handwritten: v_ω = (v · e_ω) · e_ω, «Projektion»)', () => {
    for (const { vB, w } of CASES) {
      const a = vOmegaPart(vB, w), b = vPerpPart(vB, w);
      expect(vecApproxEqual(add(a, b), vB, 1e-12)).toBe(true);
      expect(norm(cross(a, w))).toBeCloseTo(0, 12);
      expect(dot(b, w)).toBeCloseTo(0, 12);
      expect(vecApproxEqual(a, scale(dot(vB, eOmega(w)), eOmega(w)), 1e-12)).toBe(true);
    }
  });
  it('R-021: «|v_ω| = v_B · ω/|ω|» is a signed component: negative when v_ω points against ω', () => {
    const w: Vec3 = [0, 0, 2], vB: Vec3 = [1, 0, -3];
    expect(vOmegaSigned(vB, w)).toBe(-3);
    expect(norm(vOmegaPart(vB, w))).toBe(3);
  });
});

describe('Fig. 3.16: the construction along g gives the central axis ζ', () => {
  it('lecture lines: v_P = v_B + ω × BP = v_ω + v_B^⊥ + ω × BP = v_ω + (v_B^⊥ − ω x) e^⊥ for P on g', () => {
    for (const { rB, vB, w } of CASES) {
      const g = lineG(vB, w)!;
      expect(dot(g.dir, w)).toBeCloseTo(0, 12); // g ⊥ ω
      expect(dot(g.dir, g.ePerp)).toBeCloseTo(0, 12); // g ⊥ v_B^⊥
      expect(norm(g.dir)).toBeCloseTo(1, 12);
      for (const x of [0, 0.3, 1.1, -0.7, 2.5]) {
        const P = add(rB, scale(x, g.dir));
        const line1 = rigidVelocity(vB, w, rB, P);
        const line2 = add(add(vOmegaPart(vB, w), vPerpPart(vB, w)), cross(w, sub(P, rB)));
        const line3 = add(add(vOmegaPart(vB, w), scale(g.vPerp, g.ePerp)), scale(-norm(w) * x, g.ePerp));
        for (const v of [line2, line3, velocityOnG(vB, w, x)]) expect(vecApproxEqual(v, line1, 1e-12)).toBe(true);
        // ω × BP = −ω x e^⊥: it points against v_B^⊥ and grows linearly with x
        expect(vecApproxEqual(cross(w, sub(P, rB)), scale(-norm(w) * x, g.ePerp), 1e-12)).toBe(true);
      }
    }
  });
  it('at x = v_B^⊥/ω the perpendicular part vanishes: that point Z is the point of ζ closest to B, r_Z = r_B + (ω × v_B)/|ω|²', () => {
    for (const { rB, vB, w } of CASES) {
      const g = lineG(vB, w)!, x = g.vPerp / norm(w);
      const Z = add(rB, scale(x, g.dir)), ax = centralAxis(rB, vB, w)!;
      expect(vecApproxEqual(Z, ax.point, 1e-12)).toBe(true);
      expect(vecApproxEqual(velocityOnG(vB, w, x), vOmegaPart(vB, w), 1e-12)).toBe(true);
      expect(dot(sub(ax.point, rB), w)).toBeCloseTo(0, 12); // BZ ⊥ ω: Z is the foot of the perpendicular from B
      expect(distanceToAxis(ax, rB)).toBeCloseTo(x, 12);
    }
  });
  it('every point of ζ has v = v_ω; every other point is faster: |v|² = v_ω² + ω² d² (R-020)', () => {
    for (const { rB, vB, w } of CASES) {
      const ax = centralAxis(rB, vB, w)!, vw = vOmegaPart(vB, w);
      for (const lam of [-2, -0.5, 0, 1, 3]) {
        const P = add(ax.point, scale(lam, ax.dir));
        expect(vecApproxEqual(rigidVelocity(vB, w, rB, P), vw, 1e-12)).toBe(true);
      }
      for (const P of [...POINTS, rB]) {
        const d = distanceToAxis(ax, P), v = norm(rigidVelocity(vB, w, rB, P));
        expect(v).toBeCloseTo(speedAtDistance(norm(vw), norm(w), d), 12);
        if (d > 1e-6) expect(v).toBeGreaterThan(norm(vw));
      }
    }
  });
  it('with Z on ζ as reference point: v_P = v_ω + ω × ZP (turning about ζ plus sliding along ζ)', () => {
    for (const { rB, vB, w } of CASES) {
      const ax = centralAxis(rB, vB, w)!, vw = vOmegaPart(vB, w);
      for (const P of POINTS) expect(vecApproxEqual(screwVelocity(ax, vw, w, P), rigidVelocity(vB, w, rB, P), 1e-12)).toBe(true);
    }
  });
  it('the screw motion: d/dt of screwPosition is the velocity field of the Kinemate; a point on ζ moves straight along ζ', () => {
    const h = 1e-6;
    for (const { rB, vB, w } of CASES) for (const P of POINTS) {
      const a = screwPosition(rB, vB, w, P, h), b = screwPosition(rB, vB, w, P, -h);
      expect(vecApproxEqual(scale(1 / (2 * h), sub(a, b)), rigidVelocity(vB, w, rB, P), 1e-6)).toBe(true);
    }
    const { rB, vB, w } = CASES[0], ax = centralAxis(rB, vB, w)!;
    const T = (2 * Math.PI) / norm(w);
    const Z1 = screwPosition(rB, vB, w, ax.point, T);
    expect(vecApproxEqual(Z1, add(ax.point, scale(T, vOmegaPart(vB, w))), 1e-12)).toBe(true);
    // after one full turn every point has advanced by 2π p along e_ω (same rise for all)
    const B1 = screwPosition(rB, vB, w, rB, T);
    expect(vecApproxEqual(sub(B1, rB), scale(2 * Math.PI * pitch(vB, w), eOmega(w)), 1e-9)).toBe(true);
    // and its distance from ζ never changes (a helix)
    for (const t of [0.3, 1.7, 4]) expect(distanceToAxis(ax, screwPosition(rB, vB, w, rB, t))).toBeCloseTo(distanceToAxis(ax, rB), 12);
  });
  it('Rodrigues rotation keeps distances and turns right-handed about u', () => {
    const p = rotateAbout([0, 0, 0], [0, 0, 1], Math.PI / 2, [1, 0, 0]);
    expect(vecApproxEqual(p, [0, 1, 0], 1e-12)).toBe(true);
  });
});

describe('Spezialfälle (p. 25)', () => {
  it('ω = 0: translation, no central axis', () => {
    expect(centralAxis([0, 0, 0], [1, 2, 3], [0, 0, 0])).toBeNull();
    expect(vecApproxEqual(screwPosition([0, 0, 0], [1, 2, 3], [0, 0, 0], [1, 1, 1], 2), [3, 5, 7])).toBe(true);
  });
  it('ω ≠ 0, v_B = 0: rotation, B ∈ μ = ζ, no v_ω', () => {
    const w: Vec3 = [0.3, -1, 0.5], rB: Vec3 = [1, 2, 3];
    const ax = centralAxis(rB, [0, 0, 0], w)!;
    expect(vecApproxEqual(ax.point, rB)).toBe(true);
    expect(norm(vOmegaPart([0, 0, 0], w))).toBe(0);
  });
  it('ω ≠ 0, v_B ⊥ ω: rotation with B ∉ μ, no screw (v_ω = 0); ζ is the rotation axis: its points are at rest', () => {
    const w: Vec3 = [0, 0, 1.5], vB: Vec3 = [-0.9, 0.3, 0], rB: Vec3 = [0.2, 0.6, -0.4];
    expect(norm(vOmegaPart(vB, w))).toBe(0);
    const ax = centralAxis(rB, vB, w)!;
    expect(distanceToAxis(ax, rB)).toBeGreaterThan(0.1);
    for (const lam of [-1, 0, 2]) expect(norm(rigidVelocity(vB, w, rB, add(ax.point, scale(lam, ax.dir))))).toBeCloseTo(0, 12);
  });
});

describe('Problem Fig. 3.30 (p. 25 + handwritten solution)', () => {
  const s = fig330Solution();
  it('(v_B · e_ω) = (0, 2, 2) · (0, 1, 0) = 2, v_ω = 2 e_ω = (0, 2, 0), v_B^⊥ = (0, 0, 2)', () => {
    expect(s.e).toEqual([0, 1, 0]);
    expect(s.proj).toBe(2);
    expect(vecApproxEqual(s.vw, [0, 2, 0])).toBe(true);
    expect(vecApproxEqual(s.vperp, [0, 0, 2])).toBe(true);
  });
  it('P ∈ ζ ⇔ v_P = v_B + ω × BP = v_ω ⇔ (0, 0, −2) = (2 z_P, 0, −2 x_P) ⇒ z_P = 0, x_P = 1, y_P beliebig', () => {
    expect(vecApproxEqual(s.rhs, [0, 0, -2])).toBe(true);
    for (const p of [[0.3, -1.2, 0.7], [1, 5, 0], [2, 0, -1]] as Vec3[]) expect(vecApproxEqual(s.omegaCross(p), [2 * p[2], 0, -2 * p[0]])).toBe(true);
    expect(s.xP).toBe(1); expect(s.zP).toBe(0);
    // y_P is arbitrary: ω × (x, y, z) does not contain y, because moving P along ω adds a multiple of ω and ω × ω = 0
    expect(norm(cross(FIG330.omega, FIG330.omega))).toBe(0);
    for (const y of [-1, 0, 0.5, 1, 7]) expect(vecApproxEqual(rigidVelocity(FIG330.vB, FIG330.omega, FIG330.B, [1, y, 0]), [0, 2, 0])).toBe(true);
  });
  it('R-019: with «·» read literally the line is not even a vector equation; with «+» it is the Grundgleichung', () => {
    const P: Vec3 = [1, 0, 0];
    const literal = dot(FIG330.vB, cross(FIG330.omega, P)); // v_B · (ω × BP) — a number
    expect(typeof literal).toBe('number');
    expect(vecApproxEqual(add(FIG330.vB, cross(FIG330.omega, P)), [0, 2, 0])).toBe(true);
  });
  it('ζ: (1, 0, 0) + λ (0, 1, 0) — along the bottom front edge of the cube, as drawn in green in Fig. 3.30', () => {
    expect(vecApproxEqual(s.axis.point, [1, 0, 0])).toBe(true);
    expect(vecApproxEqual(s.axis.dir, [0, 1, 0])).toBe(true);
    // the edge from (1, 0, 0) to (1, 1, 0) is part of the cube
    for (const lam of [0, 0.5, 1]) {
      const p = add(s.axis.point, scale(lam, s.axis.dir));
      expect(p.every((c) => c >= 0 && c <= FIG330.edge)).toBe(true);
    }
  });
  it('speeds: |v_B| = 2√2 at distance 1 from ζ; the corners farthest from ζ (x = 0, z = 1) have |v| = 2√3; pitch 1 m per rad', () => {
    expect(norm(FIG330.vB)).toBeCloseTo(2 * Math.SQRT2, 12);
    expect(speedAtDistance(2, 2, 1)).toBeCloseTo(2 * Math.SQRT2, 12);
    const corners: Vec3[] = [0, 1].flatMap((i) => [0, 1].flatMap((j) => [0, 1].map((k) => [i, j, k] as Vec3)));
    const speeds = corners.map((c) => norm(rigidVelocity(FIG330.vB, FIG330.omega, FIG330.B, c)));
    expect(Math.max(...speeds)).toBeCloseTo(2 * Math.sqrt(3), 12);
    expect(Math.min(...speeds)).toBeCloseTo(2, 12); // the two corners on ζ
    expect(norm(rigidVelocity(FIG330.vB, FIG330.omega, FIG330.B, [0, 0, 1]))).toBeCloseTo(2 * Math.sqrt(3), 12);
    expect(s.pitch).toBe(1);
  });
});
