import { describe, expect, it } from 'vitest';
import {
  centreFromTwo, cross2, ladderAt, ladderMZ, omegaFromTwo, outOfPlane, planeVelocity, restPoint, sdpgDefect2,
  tiltFromTwoDirections, tipsIntersection, wheelPointVelocity, type P2,
} from './plane';
import { rigidVelocity } from './rigid';
import type { Vec3 } from './vec';

const dot = (a: P2, b: P2) => a[0] * b[0] + a[1] * b[1];
const sub = (a: P2, b: P2): P2 => [a[0] - b[0], a[1] - b[1]];
const len = (a: P2) => Math.hypot(a[0], a[1]);

describe('p. 26: plane motion forces ω ⊥ E', () => {
  it('v_Az − v_Pz = ω_x PA_y − ω_y PA_x (z-component of ω × PA, PA in E)', () => {
    const w: Vec3 = [0.3, -0.7, 1.1];
    for (const pa of [[1, 0], [0, 1], [0.4, -1.3]] as P2[]) {
      expect(outOfPlane(w, pa)).toBeCloseTo(w[0] * pa[1] - w[1] * pa[0], 12);
      const vA = rigidVelocity([0.2, 0.5, 0], w, [0, 0, 0], [pa[0], pa[1], 0]);
      expect(vA[2]).toBeCloseTo(outOfPlane(w, pa), 12);
    }
  });
  it('PA along x gives −ω_y PA_x, PA along y gives ω_x PA_y', () => {
    const w: Vec3 = [0.3, -0.7, 1.1];
    expect(outOfPlane(w, [2, 0])).toBeCloseTo(-w[1] * 2, 12);
    expect(outOfPlane(w, [0, 2])).toBeCloseTo(w[0] * 2, 12);
  });
  it('zero for two non-parallel PA ⇒ ω_x = ω_y = 0; one direction alone does not decide (R-011)', () => {
    expect(tiltFromTwoDirections([1, 0], [0, 1], 0, 0)).toEqual([0, 0].map(() => expect.closeTo(0, 12)));
    const r = tiltFromTwoDirections([1.2, 0.3], [-0.4, 0.9], 0, 0)!;
    expect(r[0]).toBeCloseTo(0, 12); expect(r[1]).toBeCloseTo(0, 12);
    expect(tiltFromTwoDirections([1, 2], [2, 4], 0, 0)).toBeNull();
    // with a tilted ω (ω_x, ω_y) the two equations recover exactly that tilt
    const w: Vec3 = [0.25, -0.6, 1];
    const a: P2 = [1.2, 0.3], b: P2 = [-0.4, 0.9];
    const s = tiltFromTwoDirections(a, b, outOfPlane(w, a), outOfPlane(w, b))!;
    expect(s[0]).toBeCloseTo(w[0], 12); expect(s[1]).toBeCloseTo(w[1], 12);
    // a tilt about a direction d leaves the points on the line along d in the plane (ω × d has no z-part there)
    expect(outOfPlane([1, 1, 0.5], [1, 1])).toBeCloseTo(0, 12);
  });
  it('ω = (0, 0, ω_z): every point keeps v_z = 0', () => {
    for (const pa of [[1, 0], [0.3, -2], [5, 5]] as P2[]) expect(outOfPlane([0, 0, 0.8], pa)).toBeCloseTo(0, 14);
  });
});

describe('Satz vom Momentanzentrum (p. 26)', () => {
  const A: P2 = [0.2, 0.1], B: P2 = [2.1, 0.9];
  it('construction from two velocities: Z on both perpendiculars, v_Z = 0', () => {
    const w = 0.7, Zt: P2 = [1.1, -1.4];
    const vA = planeVelocity(Zt, [0, 0], w, A), vB = planeVelocity(Zt, [0, 0], w, B);
    const c = centreFromTwo(A, vA, B, vB);
    expect(c.kind).toBe('point');
    if (c.kind !== 'point') return;
    expect(c.via).toBe('perpendiculars');
    expect(c.Z[0]).toBeCloseTo(Zt[0], 10); expect(c.Z[1]).toBeCloseTo(Zt[1], 10);
    expect(c.w).toBeCloseTo(w, 12);
    expect(dot(vA, sub(c.Z, A))).toBeCloseTo(0, 10); expect(dot(vB, sub(c.Z, B))).toBeCloseTo(0, 10);
    const vZ = planeVelocity(A, vA, c.w, c.Z);
    expect(len(vZ)).toBeCloseTo(0, 10);
    const r = restPoint(A, vA, c.w)!;
    expect(r[0]).toBeCloseTo(Zt[0], 10); expect(r[1]).toBeCloseTo(Zt[1], 10);
  });
  it('every velocity is ⊥ ZM with size |ω| r, sense from ω (counter-clockwise for ω > 0)', () => {
    const Z: P2 = [-0.5, 0.8], w = -1.3;
    for (const M of [[1, 1], [2, -0.3], [-1.4, 2.2]] as P2[]) {
      const v = planeVelocity(Z, [0, 0], w, M), r = sub(M, Z);
      expect(dot(v, r)).toBeCloseTo(0, 12);
      expect(len(v)).toBeCloseTo(Math.abs(w) * len(r), 12);
      expect(Math.sign(cross2(r, v))).toBe(Math.sign(w));
    }
  });
  it('the only point at rest: any other point has v ≠ 0', () => {
    const Z: P2 = [0.4, 0.4], w = 0.9;
    for (const M of [[0.41, 0.4], [3, -1]] as P2[]) expect(len(planeVelocity(Z, [0, 0], w, M))).toBeGreaterThan(0);
  });
  it('ω from two velocities equals ω used to make them; the SdpG holds', () => {
    const vA: P2 = [0.3, -0.2], w = 0.45;
    const vB = planeVelocity(A, vA, w, B);
    expect(omegaFromTwo(A, vA, B, vB)).toBeCloseTo(w, 12);
    expect(sdpgDefect2(A, vA, B, vB)).toBeCloseTo(0, 12);
  });
  it('degenerate: v_A = v_B ⇒ translation (Z at infinity)', () => {
    expect(centreFromTwo(A, [0.5, 0.2], B, [0.5, 0.2]).kind).toBe('translation');
  });
  it('degenerate: v_A ∥ v_B, both ⊥ AB — the perpendiculars coincide; Z from the line through the tips', () => {
    const u = [(B[0] - A[0]) / len(sub(B, A)), (B[1] - A[1]) / len(sub(B, A))] as P2, n: P2 = [-u[1], u[0]];
    for (const [a, b] of [[1, 0.4], [1, -0.5], [0.3, 1.2]]) {
      const vA: P2 = [a * n[0], a * n[1]], vB: P2 = [b * n[0], b * n[1]];
      const c = centreFromTwo(A, vA, B, vB);
      expect(c.kind).toBe('point');
      if (c.kind !== 'point') continue;
      expect(c.via).toBe('tips');
      const tip = tipsIntersection(A, vA, B, vB)!;
      expect(c.Z[0]).toBeCloseTo(tip[0], 10); expect(c.Z[1]).toBeCloseTo(tip[1], 10);
      expect(len(planeVelocity(A, vA, c.w, c.Z))).toBeCloseTo(0, 10);
      expect(cross2(sub(B, A), sub(c.Z, A))).toBeCloseTo(0, 10); // on the line AB
    }
  });
  it('a point at rest is itself Z; velocities that violate the SdpG are rejected', () => {
    const c = centreFromTwo(A, [0, 0], B, planeVelocity(A, [0, 0], 0.5, B));
    expect(c.kind === 'point' && c.via === 'restingPoint' && c.Z === A).toBe(true);
    expect(centreFromTwo(A, [1, 0], B, [0, 1]).kind).toBe('inconsistent');
  });
});

describe('Fig. 3.20: rolling wheel', () => {
  it('Z = contact point: v_P ⊥ ZP, v_P = ω|ZP|, v_O = ωR (to the right for clockwise ω)', () => {
    const R = 1, xO = 0.3, w = 1.7, Z: P2 = [xO, 0];
    for (let k = 0; k < 12; k++) {
      const a = (k * Math.PI) / 6, P: P2 = [xO + 0.8 * R * Math.sin(a), R + 0.8 * R * Math.cos(a)];
      const v = wheelPointVelocity(xO, w, P);
      expect(dot(v, sub(P, Z))).toBeCloseTo(0, 12);
      expect(len(v)).toBeCloseTo(w * len(sub(P, Z)), 12);
    }
    const vO = wheelPointVelocity(xO, w, [xO, R]);
    expect(vO[0]).toBeCloseTo(w * R, 12); expect(vO[1]).toBeCloseTo(0, 12);
    const top = wheelPointVelocity(xO, w, [xO, 2 * R]);
    expect(top[0]).toBeCloseTo(2 * w * R, 12);
  });
});

describe('p. 27: ladder solved with the Momentanzentrum (supplement, R-022)', () => {
  const L = 1.5, vH = 0.8;
  it('Z = (x_A, y_B): on the vertical through A and the horizontal through B; |ZA| = L sin φ, |ZB| = L cos φ', () => {
    for (const phi of [0.3, 0.7, 50 * (Math.PI / 180), 1.3]) {
      const m = ladderMZ(L, phi, vH);
      expect(dot(m.vA, sub(m.Z, m.A))).toBeCloseTo(0, 12); // ⊥ v_A
      expect(dot(m.vB, sub(m.Z, m.B))).toBeCloseTo(0, 12); // ⊥ v_B
      expect(len(sub(m.Z, m.A))).toBeCloseTo(L * Math.sin(phi), 12); expect(len(sub(m.Z, m.B))).toBeCloseTo(L * Math.cos(phi), 12);
      const c = centreFromTwo(m.A, m.vA, m.B, m.vB);
      expect(c.kind).toBe('point');
      if (c.kind === 'point') { expect(c.Z[0]).toBeCloseTo(m.Z[0], 10); expect(c.Z[1]).toBeCloseTo(m.Z[1], 10); expect(c.w).toBeCloseTo(m.w, 10); }
    }
  });
  it('ω = v_H/(L sin φ), clockwise (ω̲ = −v_H/(L sin φ) e_z); v_V = ω L cos φ = v_H cot φ = SdpG result', () => {
    for (const phi of [0.3, 0.7, 1.3]) {
      const m = ladderMZ(L, phi, vH);
      expect(m.w).toBeCloseTo(-vH / (L * Math.sin(phi)), 12);
      expect(m.vV).toBeCloseTo(vH / Math.tan(phi), 12);
      expect(sdpgDefect2(m.A, m.vA, m.B, m.vB)).toBeCloseTo(0, 12); // the SdpG of p. 13/27
      // v_A really is ω × ZA
      const vA = planeVelocity(m.Z, [0, 0], m.w, m.A);
      expect(vA[0]).toBeCloseTo(-vH, 12); expect(vA[1]).toBeCloseTo(0, 12);
      const vB = planeVelocity(m.Z, [0, 0], m.w, m.B);
      expect(vB[0]).toBeCloseTo(0, 12); expect(vB[1]).toBeCloseTo(-m.vV, 12);
    }
    expect(ladderMZ(L, Math.PI / 4, vH).vV).toBeCloseTo(vH, 12); // φ = 45°: both ends equally fast
  });
  it('as the ladder slides, Z stays at distance L from the corner (circle about the corner); ω = φ̇', () => {
    const phi0 = 1.2;
    for (const t of [0, 0.3, 0.6, 0.9]) {
      const s = ladderAt(L, phi0, vH, t);
      expect(s.ZC).toBeCloseTo(L, 12);
      expect(len(sub(s.B, s.A))).toBeCloseTo(L, 12);
      const h = 1e-6, s2 = ladderAt(L, phi0, vH, t + h);
      expect((s2.phi - s.phi) / h).toBeCloseTo(s.w, 5); // φ decreases: clockwise turning
      expect((s2.B[1] - s.B[1]) / h).toBeCloseTo(-s.vV, 5); // B slides down with v_V
      expect((s2.A[0] - s.A[0]) / h).toBeCloseTo(-vH, 6);
    }
  });
});
