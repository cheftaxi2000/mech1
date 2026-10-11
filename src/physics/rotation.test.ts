import { describe, expect, it } from 'vitest';
import { distToAxis, footOnAxis, proof3, rotateAbout, rotationVelocity } from './rotation';
import { type Vec3, add, cross, dot, norm, normalize, scale, sub, vecApproxEqual } from './vec';

const rnd = (s: number) => { let x = s; return () => { x = (x * 16807) % 2147483647; return x / 2147483647 - 0.5; }; };
const r = rnd(7);
const rv = (k = 4): Vec3 => [k * r(), k * r(), k * r()];

describe('Rotation about an arbitrary axis μ (pp. 15–18)', () => {
  it('property 1: points on μ do not move, for every angle', () => {
    for (let i = 0; i < 20; i++) {
      const O = rv(), e = rv(), p = add(O, scale(3 * r(), e));
      expect(vecApproxEqual(rotateAbout(p, O, e, 5 * r()), p, 1e-9)).toBe(true);
      expect(norm(rotationVelocity(scale(2, normalize(e)), O, p))).toBeLessThan(1e-9);
    }
  });
  it('property 2: every other point stays on a circle — centre at its foot on μ, in the plane ⊥ μ', () => {
    for (let i = 0; i < 20; i++) {
      const O = rv(), e = rv(), p = rv(), A = footOnAxis(p, O, e), R = distToAxis(p, O, e);
      for (const phi of [0.3, 1.7, 3.1, 5]) {
        const q = rotateAbout(p, O, e, phi);
        expect(norm(sub(q, A))).toBeCloseTo(R, 9); // same radius
        expect(dot(sub(q, A), e)).toBeCloseTo(0, 9); // same plane ⊥ μ
      }
    }
  });
  it('property 3: rotating the body by φ turns every point by the same angle φ about μ', () => {
    for (let i = 0; i < 20; i++) {
      const O = rv(), e = rv(), p = rv(), phi = 2.5 * r() + 0.1;
      const A = footOnAxis(p, O, e), a = sub(p, A), b = sub(rotateAbout(p, O, e, phi), A);
      const ang = Math.atan2(dot(normalize(e), cross(a, b)), dot(a, b));
      expect(ang).toBeCloseTo(phi, 9);
    }
  });
  it('eq. (3): d/dt of the rotated point is ω × r with ω = φ̇ e_μ (r from any point O on μ)', () => {
    for (let i = 0; i < 20; i++) {
      const O = rv(), e = normalize(rv()), p = rv(), w = 2 * r(), phi0 = r(), h = 1e-6;
      const p0 = rotateAbout(p, O, e, phi0);
      const v = scale(1 / (2 * h), sub(rotateAbout(p, O, e, phi0 + w * h), rotateAbout(p, O, e, phi0 - w * h)));
      const O2 = add(O, scale(3 * r(), e)); // another point of μ
      expect(vecApproxEqual(v, rotationVelocity(scale(w, e), O2, p0), 1e-6)).toBe(true);
    }
  });
  it('p. 18: |v_M| = |ω|·|AM| (distance to the axis, not |OM|), for every O on μ', () => {
    for (let i = 0; i < 20; i++) {
      const O = rv(), e = rv(), M = rv(), w = scale(1.7, normalize(e));
      const O2 = add(O, scale(5 * r(), e));
      expect(norm(rotationVelocity(w, O2, M))).toBeCloseTo(1.7 * distToAxis(M, O, e), 9);
    }
  });
  it('p. 18: with O off the axis, ω × OM is wrong (it does not vanish on μ)', () => {
    const e: Vec3 = [0, 0, 1], O: Vec3 = [0, 0, 0], Ooff: Vec3 = [1, 0, 0], onAxis: Vec3 = [0, 0, 2];
    expect(norm(rotationVelocity(e, O, onAxis))).toBe(0);
    expect(norm(rotationVelocity(e, Ooff, onAxis))).toBeGreaterThan(0.5);
  });
});

describe('Proof 2 (p. 16): v_P ⊥ DP and v_P ⊥ μ', () => {
  it('SdpG with D at rest gives v_P·DP = 0; (DP·DA)˙ = 0 gives v_P·DA = 0', () => {
    for (let i = 0; i < 20; i++) {
      const O = rv(), e = normalize(rv()), P = rv(), w = scale(1.3, e);
      const D = footOnAxis(P, O, e), A = add(D, scale(1.5, e)), vP = rotationVelocity(w, O, P);
      expect(dot(vP, sub(P, D))).toBeCloseTo(0, 9);
      expect(dot(vP, sub(A, D))).toBeCloseTo(0, 9);
      // (DP·DA)˙ by finite differences, with D and A at rest
      const h = 1e-6, f = (s: number) => dot(sub(rotateAbout(P, O, e, 1.3 * s), D), sub(A, D));
      expect((f(h) - f(-h)) / (2 * h)).toBeCloseTo(0, 6);
    }
  });
});

describe('Proof 3 (p. 17): equal angular speed', () => {
  it('v_P·PQ = v_P·r_Q because v_P ⊥ r_P; both projections are φ̇·X/|PQ| with the same X', () => {
    for (let i = 0; i < 20; i++) {
      const rP = rv(), rQ = rv(), wP = r(), wQ = r();
      const { vP, vQ, projP, projQ, X, L } = proof3(rP, rQ, wP, wQ);
      expect(dot(vP, sub(rQ, rP))).toBeCloseTo(dot(vP, rQ), 9);
      expect(dot(vQ, sub(rQ, rP))).toBeCloseTo(-dot(vQ, rP), 9);
      expect(projP).toBeCloseTo((wP * X) / L, 9);
      expect(projQ).toBeCloseTo((wQ * X) / L, 9);
    }
  });
  it('the lecture’s identities: −(e_z × r_Q)·r_P = (r_Q × e_z)·r_P = (e_z × r_P)·r_Q (Spatprodukt)', () => {
    const ez: Vec3 = [0, 0, 1];
    for (let i = 0; i < 20; i++) {
      const rP = rv(), rQ = rv();
      const a = -dot(cross(ez, rQ), rP), b = dot(cross(rQ, ez), rP), c = dot(cross(ez, rP), rQ);
      expect(a).toBeCloseTo(b, 9); expect(b).toBeCloseTo(c, 9);
    }
  });
  it('X is the area of the parallelogram of r_P and r_Q seen from above: ρ_P ρ_Q sin(φ_Q − φ_P)', () => {
    const rP: Vec3 = [2 * Math.cos(0.4), 2 * Math.sin(0.4), 1], rQ: Vec3 = [3 * Math.cos(1.5), 3 * Math.sin(1.5), -2];
    expect(proof3(rP, rQ, 1, 1).X).toBeCloseTo(6 * Math.sin(1.1), 12);
  });
  it('SdpG holds only for equal angular speeds (X ≠ 0); R-003 (b): if X = 0 it says nothing', () => {
    const rP: Vec3 = [2, 0, 0.5], rQ: Vec3 = [0.6, 2.2, -0.4];
    expect(proof3(rP, rQ, 1, 1).projP).toBeCloseTo(proof3(rP, rQ, 1, 1).projQ, 12);
    const u = proof3(rP, rQ, 1, 1.6);
    expect(Math.abs(u.projP - u.projQ)).toBeGreaterThan(0.3);
    const c = proof3([2, 0, 0], [3.5, 0, 1], 1, 1.6); // P, Q and μ in one plane
    expect(c.X).toBe(0); expect(c.projP).toBeCloseTo(c.projQ, 12);
  });
});
