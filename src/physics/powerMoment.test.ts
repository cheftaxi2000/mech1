import { describe, expect, it } from 'vitest';
import { moment, power, powerRotation, powerViaMoment, rotVelocity, momentAbout, powerKind } from './force';
import {
  alongDirection, angleOPF, contactPowers, heightOverBase, leverArm2D, lorentzCircle, momentShift, momentZ2D, powerFromParallel,
  pushOver, radialTangential, watt,
} from './powerMoment';
import { cross, dot, norm, scale, sub, type Vec3 } from './vec';

const close = (a: number, b: number, tol = 1e-9) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol * Math.max(1, Math.abs(a), Math.abs(b)));
function rng(seed: number) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32) * 2 - 1; }

describe('K5: P = F · v = F∥ |v| (p. 33)', () => {
  it('only the part of F along v counts; the perpendicular part is leistungslos', () => {
    const r = rng(7);
    for (let i = 0; i < 50; i++) {
      const F: Vec3 = [r() * 4, r() * 4, r() * 4], v: Vec3 = [r() * 3, r() * 3, r() * 3];
      const s = alongDirection(F, v);
      close(powerFromParallel(F, v), power(F, v));
      close(dot(s.perpVec, v), 0, 1e-9);
      close(dot(s.perpVec, s.parVec), 0, 1e-9);
      close(s.par, norm(F) * Math.cos(Math.acos(dot(F, v) / (norm(F) * norm(v)))), 1e-9);
    }
  });
  it('the preset sketches of p. 33: ++, +, −, −−, 0', () => {
    const v: Vec3 = [2, 0, 0];
    const cases: [Vec3, string][] = [[[3, 0, 0], 'drive'], [[2, 1.5, 0], 'drive'], [[-1.5, 2, 0], 'resist'], [[-3, 0, 0], 'resist'], [[0, 3, 0], 'none']];
    for (const [F, kind] of cases) expect(powerKind(F, v)).toBe(kind);
    expect(power([3, 0, 0], v)).toBe(6);
    expect(power([-3, 0, 0], v)).toBe(-6);
    expect(power([0, 3, 0], v)).toBe(0);
  });
  it('supplement: the push F·dr over dt, divided by dt, is P', () => {
    const F: Vec3 = [2.6, 1.5, 0], v: Vec3 = [2, 0, 0];
    for (const dt of [1, 0.1, 1e-3]) close(pushOver(F, v, dt) / dt, power(F, v));
    close(power(F, v), 5.2);
  });
  it('Lorentz circle: F ⟂ v at every angle, |F| = |q| v B, F points to the centre, P = 0', () => {
    for (const q of [1, -1]) for (let k = 0; k < 24; k++) {
      const a = (k * Math.PI) / 12, { v, F, P } = lorentzCircle(q, 1.5, 2, a);
      close(P, 0, 1e-12);
      close(norm(F), Math.abs(q) * 2 * 1.5, 1e-12);
      close(norm(v), 2, 1e-12);
      // centre direction for q > 0: −(sin a, cos a); for q < 0 the opposite (anticlockwise motion)
      const toCentre: Vec3 = [-Math.sin(a), -Math.cos(a), 0];
      close(dot(F, toCentre), q > 0 ? norm(F) : -norm(F), 1e-12);
    }
  });
  it('Lorentz circle: with F = m a_centripetal the radius is r = m v/(|q| B) (consistency check, not a proof)', () => {
    const m = 0.5, q = 1, B = 1.5, s = 2, r = (m * s) / (Math.abs(q) * B);
    const F = lorentzCircle(q, B, s, 0.3).F;
    close(norm(F), (m * s * s) / r, 1e-12);
  });
  it('Normalkraft: tangent velocities give zero; with a moving floor the two powers are ±N v_n and add up to 0', () => {
    const N: Vec3 = [0, 4, 0];
    const t1 = contactPowers(N, [1.5, 0, 0], [-0.7, 0, 0]);
    expect(t1.P1).toBe(0); expect(t1.P2).toBeCloseTo(0, 12); expect(t1.sum).toBeCloseTo(0, 12);
    // elevator floor rises with u = 0.8 m/s: contact kept, so both contact points have the same normal velocity
    const u = 0.8, lift = contactPowers(N, [1.5, u, 0], [-0.7, u, 0]);
    close(lift.P1, 3.2); close(lift.P2, -3.2); close(lift.sum, 0, 1e-12);
  });
  it('everyday numbers: P = F v in W', () => {
    close(watt(20, 5), 100); // cyclist: 20 N drag at 18 km/h
    close(watt(500, 100 / 3.6), 13888.888888888889, 1e-12); // car at 100 km/h
    close(watt(1, 1), 1); // 1 W = 1 N · 1 m/s
  });
});

describe('K6: the moment (pp. 33–35)', () => {
  const O: Vec3 = [0, 0, 0], P: Vec3 = [1.1, 0.5, 0], F: Vec3 = [-0.3, 0.9, 0.7], om: Vec3 = [0, 0, 1];
  it('the lesson example: v_P = (−0,5; 1,1; 0), M_O = (0,35; −0,77; 1,14), P = 1,14 = F·v_P = ω·M_O', () => {
    const v = rotVelocity(om, O, P), M = moment(O, { A: P, F });
    close(v[0], -0.5); close(v[1], 1.1); close(v[2], 0);
    close(M[0], 0.35); close(M[1], -0.77); close(M[2], 1.14);
    close(power(F, v), 1.14); close(dot(om, M), 1.14);
    close(powerRotation(om, O, { A: P, F }), powerViaMoment(om, O, { A: P, F }), 1e-12);
  });
  it('triple product: (a×b)·c = b·(c×a) = c·(a×b), the volume of the parallelepiped read in three ways', () => {
    const r = rng(11);
    for (let i = 0; i < 50; i++) {
      const a: Vec3 = [r(), r(), r()], b: Vec3 = [r(), r(), r()], c: Vec3 = [r(), r(), r()];
      close(dot(cross(a, b), c), dot(b, cross(c, a)), 1e-12);
      close(dot(cross(a, b), c), dot(c, cross(a, b)), 1e-12);
    }
  });
  it('parallelepiped of the animation: base (ω, OP) × height = base (OP, F) × height = P', () => {
    const base1 = norm(cross(om, P)), h1 = heightOverBase(om, P, F);
    const base2 = norm(cross(P, F)), h2 = heightOverBase(P, F, om);
    close(base1 * h1, 1.14); close(base2 * h2, 1.14);
    expect(h1).toBeGreaterThan(0); expect(h2).toBeGreaterThan(0);
  });
  it('plane case: M_z = x F_y − y F_x = |F| d (counter-clockwise positive), lever arm = distance to the line of action', () => {
    const r = rng(3);
    for (let i = 0; i < 60; i++) {
      const OP: [number, number] = [r() * 2, r() * 2], f: [number, number] = [r() * 3, r() * 3];
      const Mz = momentZ2D(OP, f), { d, foot } = leverArm2D(OP, f);
      close(Math.abs(Mz), Math.hypot(f[0], f[1]) * d, 1e-9);
      close(foot[0] * f[0] + foot[1] * f[1], 0, 1e-9); // foot ⟂ F: the perpendicular from O
      const phi = angleOPF(OP, f)!;
      close(Math.abs(Mz), Math.hypot(...OP) * Math.hypot(...f) * Math.sin(phi), 1e-9);
      close(momentZ2D(OP, f), moment([0, 0, 0], { A: [OP[0], OP[1], 0], F: [f[0], f[1], 0] })[2], 1e-12);
    }
  });
  it('F × PO = OP × F (both signs change), and sin(π − φ) = sin φ', () => {
    const OPv: Vec3 = [1.4, 0.8, 0], f: Vec3 = [-0.5, 1.6, 0];
    const lhs = cross(OPv, f), rhs = cross(f, scale(-1, OPv));
    for (let i = 0; i < 3; i++) close(lhs[i], rhs[i], 1e-12);
    const phi = angleOPF([1.4, 0.8], [-0.5, 1.6])!;
    close(Math.sin(phi), Math.sin(Math.PI - phi));
  });
  it('lever arm ≠ |OP|: sliding P along the line of action changes |OP| but not d and not M', () => {
    const f: [number, number] = [0, 1.5], P0: [number, number] = [1.2, 0.3];
    const m0 = momentZ2D(P0, f), a0 = leverArm2D(P0, f).d;
    for (const s of [-1, 0.5, 2]) {
      const P1: [number, number] = [P0[0] + s * f[0], P0[1] + s * f[1]];
      close(momentZ2D(P1, f), m0); close(leverArm2D(P1, f).d, a0);
    }
    close(a0, 1.2);
  });
  it('radial/tangential: M_z = r F_t, the radial part has no moment; P = F_t |v_P| = ω M_z', () => {
    const r = rng(5);
    for (let i = 0; i < 40; i++) {
      const OP: [number, number] = [r() * 2, r() * 2], f: [number, number] = [r() * 3, r() * 3], w = r() * 2;
      const { r: rr, Fr, Ft } = radialTangential(OP, f);
      close(momentZ2D(OP, f), rr * Ft, 1e-9);
      close(Fr * Fr + Ft * Ft, f[0] * f[0] + f[1] * f[1], 1e-9);
      const v = rotVelocity([0, 0, w], [0, 0, 0], [OP[0], OP[1], 0]);
      close(power([f[0], f[1], 0], v), Ft * w * rr, 1e-9); // v_P is tangential with |v| = ω r (counter-clockwise for ω > 0)
      close(power([f[0], f[1], 0], v), w * momentZ2D(OP, f), 1e-9);
    }
  });
  it('p. 34: M_O′ = M_O + O′O × F; the difference is ⟂ the axis, the axis components agree, so P = ω M_z for every O on μ', () => {
    const r = rng(9);
    for (let i = 0; i < 40; i++) {
      const h = r() * 2, Op: Vec3 = [0, 0, h], f: Vec3 = [r(), r(), r()], A: Vec3 = [r() * 2, r() * 2, r()];
      const s = momentShift(O, Op, A, f);
      for (let k = 0; k < 3; k++) close(s.MO[k] + s.D[k], s.MOp[k], 1e-12);
      close(s.D[2], 0, 1e-12); // O′O ∥ axis, so O′O × F is horizontal
      close(s.MO[2], s.MOp[2], 1e-12);
      close(momentAbout([0, 0, 1], O, { A, F: f }), momentAbout([0, 0, 1], Op, { A, F: f }), 1e-12);
      close(dot([0, 0, 2], s.MO), dot([0, 0, 2], s.MOp), 1e-12);
    }
  });
  it('the lesson example for the reference point: O′ = (0, 0, 1,2) gives M_O′ = (1,43; −0,41; 1,14), D = (1,08; 0,36; 0)', () => {
    const s = momentShift(O, [0, 0, 1.2], P, F);
    close(s.MOp[0], 1.43); close(s.MOp[1], -0.41); close(s.MOp[2], 1.14);
    close(s.D[0], 1.08); close(s.D[1], 0.36); close(s.D[2], 0);
    expect(norm(sub(s.MO, s.MOp))).toBeGreaterThan(0.5); // M_O ≠ M_O′
  });
});
