import { describe, expect, it } from 'vitest';
import { sdpgDefect2, type P2 } from './plane';
import { aboutCentre, nodes, parallelogramResidual, parallelogramRoutes, solveTruss, velocityEByHelperPoints } from './truss';

const near = (a: P2, b: P2, d = 10) => { expect(a[0]).toBeCloseTo(b[0], d); expect(a[1]).toBeCloseTo(b[1], d); };

describe('Fig. 3.24: truss example (solved from first principles)', () => {
  const s = solveTruss(1, 1);
  it('the lecture’s results: ω₈ = −2v/L, ω₁₋₅ = ½ω₈ in magnitude (= v/L), ω₆ = −2v/L, ω₇ = v/L', () => {
    expect(s.w8).toBeCloseTo(-2, 10);
    expect(Math.abs(s.w15)).toBeCloseTo(Math.abs(s.w8) / 2, 10);
    expect(s.w15).toBeCloseTo(1, 10);
    expect(s.w6).toBeCloseTo(-2, 10);
    expect(s.w7).toBeCloseTo(1, 10);
  });
  it('the lecture’s Momentanzentren and distances: |Z₈B| = L/2, |Z₇B| = L, Z₆ = middle of DF, Z₁₋₅ = A', () => {
    near(s.Z8, [3, -1.5]);
    expect(Math.hypot(s.Z8[0] - s.P.B[0], s.Z8[1] - s.P.B[1])).toBeCloseTo(0.5, 10);
    near(s.Z7, [3, -3]);
    expect(Math.hypot(s.Z7[0] - s.P.B[0], s.Z7[1] - s.P.B[1])).toBeCloseTo(1, 10);
    near(s.Z6, [1.5, -1.5]);
    expect(Math.hypot(s.Z6[0] - s.P.F[0], s.Z6[1] - s.P.F[1])).toBeCloseTo(Math.SQRT2 / 2, 10);
    near(s.Z15, [0, 0]);
  });
  it('velocities: v_E = (v, 2v, 0), v_D = (v, v), v_C = (0, v), v_F = (−v, −v) = √2 v in size, v_B = (−v, 0)', () => {
    near(s.vel.E, [1, 2]); near(s.vel.D, [1, 1]); near(s.vel.C, [0, 1]); near(s.vel.F, [-1, -1]); near(s.vel.B, [-1, 0]);
    expect(Math.hypot(...s.vel.D)).toBeCloseTo(Math.SQRT2, 10);
  });
  it('every bar satisfies the SdpG (Fig. 3.24 bars 1–8 as used in the solution)', () => {
    const bars: [keyof typeof s.P, keyof typeof s.P][] = [['A', 'C'], ['A', 'D'], ['C', 'E'], ['C', 'D'], ['D', 'E'], ['D', 'F'], ['F', 'B'], ['E', 'B']];
    for (const [a, b] of bars) expect(sdpgDefect2(s.P[a], s.vel[a], s.P[b], s.vel[b])).toBeCloseTo(0, 10);
  });
  it('the nodes of bars 1–5 move as ONE rigid body about A: v = ω₁₋₅ e_z × AX, perpendicular to AX', () => {
    for (const N of ['C', 'D', 'E'] as const) {
      near(s.vel[N], aboutCentre(s.Z15, s.w15, s.P[N]));
      expect(s.vel[N][0] * s.P[N][0] + s.vel[N][1] * s.P[N][1]).toBeCloseTo(0, 10);
    }
  });
  it('the three constructions of v_E agree: ω₈ × Z₈E, |v_E| = |ω₈|·|Z₈E| = √5 v, helper points H₁, H₂', () => {
    const e = aboutCentre(s.Z8, s.w8, s.P.E);
    near(e, [1, 2]);
    expect(Math.hypot(...e)).toBeCloseTo(Math.sqrt(5), 10);
    const h = velocityEByHelperPoints(s);
    expect(Math.hypot(...h.vH2)).toBeCloseTo(1, 10); // |v_H2| = ω₈ L/2 = v
    expect(Math.hypot(...h.vH1)).toBeCloseTo(2, 10); // |v_H1| = ω₈ L = 2v
    near(h.vE, [1, 2]);
  });
  it('scales with v and L: ω ∝ v/L, Z positions ∝ L', () => {
    const t = solveTruss(3, 2);
    expect(t.w8).toBeCloseTo(-2 * 3 / 2, 10);
    expect(t.w15).toBeCloseTo(3 / 2, 10);
    near(t.Z8, [6, -3]);
    near(t.vel.E, [3, 6]);
  });
  it('Parallelogrammregel applied: D E B F is a parallelogram; ω₅ = ω₇ and ω₆ = ω₈', () => {
    const n = nodes(1);
    expect([n.E[0] - n.D[0], n.E[1] - n.D[1]]).toEqual([n.B[0] - n.F[0], n.B[1] - n.F[1]]); // DE = FB
    expect([n.B[0] - n.E[0], n.B[1] - n.E[1]]).toEqual([n.F[0] - n.D[0], n.F[1] - n.D[1]]); // EB = DF
    expect(s.w7).toBeCloseTo(s.w15, 10); // DE belongs to the body 1–5
    expect(s.w6).toBeCloseTo(s.w8, 10);
  });
  it('R-036: a rigid vertical bar EF would violate the SdpG (v_E,y = 2v but v_F,y = −v): the truss could not move', () => {
    expect(Math.abs(sdpgDefect2(s.P.E, s.vel.E, s.P.F, s.vel.F))).toBeGreaterThan(1);
  });
});

describe('Fig. 3.25: Parallelogrammregel', () => {
  it('the residual vanishes exactly for ω₂ = ω₄ and ω₁ = ω₃ (a, b not parallel)', () => {
    const a: P2 = [3, 0.5], b: P2 = [-0.4, 2];
    for (const w of [[1, 2, 1, 2], [-3, 0.7, -3, 0.7], [0, 0, 0, 0]] as [number, number, number, number][])
      near(parallelogramResidual(a, b, w), [0, 0]);
    for (const w of [[1, 2, 1.5, 2], [1, 2, 1, 2.2], [1, 2, 0, 1]] as [number, number, number, number][]) {
      const r = parallelogramResidual(a, b, w);
      expect(Math.hypot(...r)).toBeGreaterThan(1e-3);
    }
  });
  it('the linear map (Δ₂, Δ₁) ↦ residual is injective iff a × b ≠ 0 (a ∥ b: the argument breaks down)', () => {
    const inj = (a: P2, b: P2) => Math.abs(a[0] * b[1] - a[1] * b[0]) > 1e-9;
    expect(inj([1, 0], [0.3, 1])).toBe(true);
    expect(inj([1, 0], [2, 0])).toBe(false);
    near(parallelogramResidual([1, 0], [2, 0], [0, 1, 2, 0]), [0, 0]); // ω₂ ≠ ω₄ but residual 0: not decided by the loop
  });
  it('the two routes to v_C differ by −(residual); the gap vanishes exactly for ω₃ = ω₁, ω₄ = ω₂', () => {
    const a: P2 = [3, 0.5], b: P2 = [-0.4, 2];
    for (const w of [[1, 0.5, 1, 0.5], [2, -1, 2, -1]] as [number, number, number, number][]) near(parallelogramRoutes(a, b, w).gap, [0, 0]);
    const w: [number, number, number, number] = [1, 0.5, 0.4, 0.5];
    const r = parallelogramResidual(a, b, w), g = parallelogramRoutes(a, b, w).gap;
    near(g, [-r[0], -r[1]]);
    expect(Math.hypot(...g)).toBeGreaterThan(0.1);
  });
});
