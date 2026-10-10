import { describe, expect, it } from 'vitest';
import { numericVelocity, velocityCylindrical, velocitySpherical, speed } from './kinematics';
import { cylToCart, sphToCart, eRho, ePhi } from './coords';
import { cross, scale, add, vecApproxEqual, type Vec3 } from './vec';

describe('velocity in curvilinear bases (lecture p. 10)', () => {
  it('cylindrical: ṙ = ρ̇e_ρ + ρφ̇e_φ + że_z matches numerical differentiation', () => {
    const rho = (t: number) => 1 + 0.5 * t, phi = (t: number) => 0.3 + 2 * t * t, z = (t: number) => Math.sin(t);
    const r = (t: number) => cylToCart({ rho: rho(t), phi: phi(t), z: z(t) });
    for (const t of [0.1, 0.7, 1.9]) {
      const v = velocityCylindrical(rho(t), phi(t), 0.5, 4 * t, Math.cos(t));
      expect(vecApproxEqual(v, numericVelocity(r, t), 1e-6)).toBe(true);
    }
  });
  it('spherical: ṙ = ṙe_r + rθ̇e_θ + r sinθ ψ̇ e_ψ matches numerical differentiation', () => {
    const R = (t: number) => 2 + t, th = (t: number) => 0.4 + 0.3 * t, ps = (t: number) => -1 + 1.5 * t;
    const r = (t: number) => sphToCart({ r: R(t), theta: th(t), psi: ps(t) });
    for (const t of [0.2, 1.1, 2.4]) {
      const v = velocitySpherical(R(t), th(t), ps(t), 1, 0.3, 1.5);
      expect(vecApproxEqual(v, numericVelocity(r, t), 1e-6)).toBe(true);
    }
  });
  it('ė_ρ = φ̇ e_φ (the step that produces the ρφ̇ term)', () => {
    const phi = (t: number) => 3 * t;
    const t = 0.4;
    expect(vecApproxEqual(numericVelocity((s) => eRho(phi(s)), t), scale(3, ePhi(phi(t))), 1e-6)).toBe(true);
  });
});

describe('Beispiel p. 10: r(t) = (at, at, b a² t²)', () => {
  const a = 2, b = 0.25; // [a] = m/s, [b] = 1/m so that b a² t² is a length
  const r = (t: number): Vec3 => [a * t, a * t, b * a * a * t * t];
  const vExact = (t: number): Vec3 => [a, a, 2 * b * a * a * t];
  it('v(t) = (a, a, 2ba²t)', () => {
    for (const t of [0, 0.5, 3]) expect(vecApproxEqual(numericVelocity(r, t), vExact(t), 1e-6)).toBe(true);
  });
  it('ṡ(t) = |a|·√(2 + 4b²a²t²)', () => {
    for (const t of [0, 0.5, 3]) expect(speed(vExact(t))).toBeCloseTo(Math.abs(a) * Math.sqrt(2 + 4 * b * b * a * a * t * t));
  });
});

describe('Kreisbewegung (lecture p. 11)', () => {
  const R = 1.3, z0 = 0.7, phiDot = 2.2;
  it('v = Rφ̇ e_φ = ω × r with ω = φ̇ e_z, independent of z0', () => {
    for (const phi of [0, 1, 2.5, 4]) {
      const r = add(scale(R, eRho(phi)), [0, 0, z0]);
      const v1 = scale(R * phiDot, ePhi(phi));
      expect(vecApproxEqual(cross([0, 0, phiDot], r), v1)).toBe(true);
    }
  });
});
