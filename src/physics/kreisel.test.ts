import { describe, expect, it } from 'vitest';
import { coneAxis, coneOmega, conePoint, kreiselVelocity, proofPlanes, restOnAxis, rollingSpin } from './kreisel';
import { type Vec3, cross, dot, norm, normalize, scale, sub } from './vec';

const GAM = (25 * Math.PI) / 180;
const L = 2;
// body points in the start position (φ = ψ = 0): the rim of the base circle, a point on the axis, a point inside
const H = L * Math.cos(GAM), R = L * Math.sin(GAM);
const e3 = coneAxis(GAM, 0), u: Vec3 = [-Math.sin(GAM), 0, Math.cos(GAM)], w = cross(e3, u);
const rim = (a: number): Vec3 => [0, 1, 2].map((i) => H * e3[i] + R * (Math.cos(a) * u[i] + Math.sin(a) * w[i])) as unknown as Vec3;
const BODY: Vec3[] = [rim(0), rim(1), rim(2.5), rim(Math.PI), scale(1.3, e3), [0.9, 0.2, 0.35]];

describe('Kreiselung: the cone rolling about its apex (p. 20)', () => {
  it('the cone touches the floor along one line: the rim point at ψ-angle π is on the floor at φ = 0', () => {
    expect(rim(Math.PI)[2]).toBeCloseTo(0, 12); // lowest rim point
    expect(norm(rim(Math.PI))).toBeCloseTo(L, 12);
    for (const a of [0, 1, 2, 4]) expect(rim(a)[2]).toBeGreaterThanOrEqual(-1e-12);
  });
  it('every point keeps its distance from O — paths lie on spheres about O', () => {
    for (const p of BODY) for (const [phi, psi] of [[0.4, -1], [2, 3], [5, -7]]) expect(norm(conePoint(GAM, phi, psi, p))).toBeCloseTo(norm(p), 12);
  });
  it('v = ω × r with ω = φ̇ e_z + ψ̇ e_3 (numeric derivative of the pose)', () => {
    const phiDot = 0.7, psiDot = -1.9, h = 1e-6;
    for (const t of [0, 0.8, 2.1]) {
      const omega = coneOmega(GAM, phiDot * t, phiDot, psiDot);
      for (const p of BODY) {
        const r = conePoint(GAM, phiDot * t, psiDot * t, p);
        const num = scale(1 / (2 * h), sub(conePoint(GAM, phiDot * (t + h), psiDot * (t + h), p), conePoint(GAM, phiDot * (t - h), psiDot * (t - h), p)));
        const v = kreiselVelocity(omega, r);
        for (let i = 0; i < 3; i++) expect(num[i]).toBeCloseTo(v[i], 7);
      }
    }
  });
  it('rolling (ψ̇ = −φ̇/sin γ): ω lies along the line of contact, whose points are at rest', () => {
    const phiDot = 1.1, psiDot = rollingSpin(GAM, phiDot);
    for (const phi of [0, 1.3, 4]) {
      const omega = coneOmega(GAM, phi, phiDot, psiDot);
      expect(omega[2]).toBeCloseTo(0, 12);
      const contact: Vec3 = [Math.cos(phi), Math.sin(phi), 0];
      expect(norm(cross(omega, contact))).toBeCloseTo(0, 12);
      expect(norm(omega)).toBeCloseTo(phiDot / Math.tan(GAM), 12); // |ω| = φ̇ cot γ
      for (const s of [0.5, 1, L]) expect(norm(kreiselVelocity(omega, scale(s, contact)))).toBeCloseTo(0, 12);
    }
  });
  it('not rolling: still a whole axis through O at rest, but it is not the line of contact', () => {
    for (const psiDot of [0, -4]) {
      const omega = coneOmega(GAM, 0.6, 1, psiDot);
      for (const s of [-1, 0.5, 2]) expect(norm(kreiselVelocity(omega, scale(s, omega)))).toBe(0);
      expect(norm(kreiselVelocity(omega, [Math.cos(0.6), Math.sin(0.6), 0]))).toBeGreaterThan(0.1); // contact point slides
    }
  });
});

describe('proof p. 21 (Fig. 3.11): the planes E_M, E_N and the axis μ', () => {
  const omega: Vec3 = [-0.3, 0.2, 1.1];
  const rM: Vec3 = [1.3, -0.4, 0.9], rN: Vec3 = [-0.6, 1.2, 1.3];
  it('O lies in E_M and in E_N (v_M ⊥ r_M, v_N ⊥ r_N)', () => {
    const p = proofPlanes(omega, rM, rN);
    expect(p.oInEM).toBeCloseTo(0, 12); expect(p.oInEN).toBeCloseTo(0, 12);
    expect(dot(p.vM, rM)).toBeCloseTo(0, 12);
  });
  it('the line of intersection E_M ∩ E_N has the direction of ω', () => {
    const { d } = proofPlanes(omega, rM, rN);
    expect(norm(cross(d, normalize(omega)))).toBeCloseTo(0, 12);
  });
  it('for A on μ: v_A·AM = v_A·AN = v_A·AO = 0, AM, AN, AO span space, so v_A = 0', () => {
    const { d } = proofPlanes(omega, rM, rN);
    for (const k of [0.6, 1.5, -0.8]) {
      const c = restOnAxis(omega, rM, rN, scale(k, d));
      expect(c.pM).toBeCloseTo(0, 12); expect(c.pN).toBeCloseTo(0, 12); expect(c.pO).toBeCloseTo(0, 12);
      expect(Math.abs(c.spat)).toBeGreaterThan(0.1);
      expect(c.speed).toBeCloseTo(0, 12);
    }
  });
  it('a point A off μ in E_M: v_A·AM = v_M·AM still holds (SdpG) but v_A ≠ 0 — the intersection is needed', () => {
    const { d, vM } = proofPlanes(omega, rM, rN);
    const A = scale(0.5, sub(rM, scale(-0.2, d))); // in E_M (span of d and r_M), not on μ
    const c = restOnAxis(omega, rM, rN, A);
    expect(c.pM).toBeCloseTo(dot(vM, sub(rM, A)), 12);
    expect(c.speed).toBeGreaterThan(0.05);
  });
});
