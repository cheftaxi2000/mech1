import { describe, expect, it } from 'vitest';
import { cylToCart, eR, ePhi, ePsi, eRho, eTheta, sphToCart } from './coords';
import { add, dot, E_X, E_Y, E_Z, norm, scale, sub, vecApproxEqual, type Vec3 } from './vec';

/** ∂f/∂q at q = 0 by central differences. */
const d = (f: (h: number) => Vec3): Vec3 => scale(1 / 2e-6, sub(f(1e-6), f(-1e-6)));
const unit = (v: Vec3) => scale(1 / norm(v), v);

describe('Cartesian basis: components (lecture p. 6)', () => {
  it('r_x = r·e_x = x, r_y = r·e_y = y, r_z = r·e_z = z and eq. (1) r = x e_x + y e_y + z e_z', () => {
    const r: Vec3 = [1.2, -0.7, 2.5];
    expect([dot(r, E_X), dot(r, E_Y), dot(r, E_Z)]).toEqual([1.2, -0.7, 2.5]);
    expect(add(add(scale(r[0], E_X), scale(r[1], E_Y)), scale(r[2], E_Z))).toEqual(r);
  });
});

describe('basis vectors are unit vectors tangent to the coordinate lines (lecture pp. 6–7)', () => {
  it('cylindrical: e_ρ, e_φ, e_z are ∂r/∂ρ, ∂r/∂φ, ∂r/∂z normalised; |∂r/∂φ| = ρ', () => {
    for (const [rho, phi, z] of [[1.7, 0.8, 0.4], [0.6, 2.9, -1], [2.2, 4.4, 1.5]]) {
      const at = (q: Partial<{ rho: number; phi: number; z: number }>) => cylToCart({ rho, phi, z, ...q });
      expect(vecApproxEqual(unit(d((h) => at({ rho: rho + h }))), eRho(phi), 1e-6)).toBe(true);
      expect(vecApproxEqual(unit(d((h) => at({ phi: phi + h }))), ePhi(phi), 1e-6)).toBe(true);
      expect(vecApproxEqual(unit(d((h) => at({ z: z + h }))), E_Z, 1e-6)).toBe(true);
      expect(norm(d((h) => at({ phi: phi + h })))).toBeCloseTo(rho, 6);
    }
  });
  it('spherical: e_r, e_θ, e_ψ are ∂r/∂r, ∂r/∂θ, ∂r/∂ψ normalised; |∂r/∂θ| = r, |∂r/∂ψ| = r sin θ', () => {
    for (const [r, theta, psi] of [[1.5, 0.7, 0.4], [2, 2.2, 3.5], [0.8, 1.4, 5.9]]) {
      const at = (q: Partial<{ r: number; theta: number; psi: number }>) => sphToCart({ r, theta, psi, ...q });
      expect(vecApproxEqual(unit(d((h) => at({ r: r + h }))), eR(theta, psi), 1e-6)).toBe(true);
      expect(vecApproxEqual(unit(d((h) => at({ theta: theta + h }))), eTheta(theta, psi), 1e-6)).toBe(true);
      expect(vecApproxEqual(unit(d((h) => at({ psi: psi + h }))), ePsi(psi), 1e-6)).toBe(true);
      expect(norm(d((h) => at({ theta: theta + h })))).toBeCloseTo(r, 6);
      expect(norm(d((h) => at({ psi: psi + h })))).toBeCloseTo(r * Math.sin(theta), 6);
    }
  });
  it('e_θ points "south" (z-component ≤ 0), e_ψ "east" (horizontal)', () => {
    for (const theta of [0.3, 1.2, 2.8]) for (const psi of [0, 2, 4]) {
      expect(eTheta(theta, psi)[2]).toBeLessThanOrEqual(0);
      expect(ePsi(psi)[2]).toBe(0);
    }
  });
  it('the Cartesian basis is the same at every point; e_ρ, e_φ turn with φ (lecture: e_ρ(φ))', () => {
    expect(vecApproxEqual(eRho(0), E_X)).toBe(true);
    expect(vecApproxEqual(eRho(Math.PI / 2), E_Y)).toBe(true);
    expect(dot(eRho(0.3), eRho(1.8))).toBeCloseTo(Math.cos(1.5), 12);
  });
});

describe('position vector in the local basis (lecture pp. 6–7)', () => {
  it('cylindrical: r = ρ e_ρ(φ) + z e_z — no φ-term; eq. (2)', () => {
    for (const [rho, phi, z] of [[1.7, 0.8, 0.4], [0.6, 2.9, -1], [2.2, 4.4, 1.5]]) {
      expect(vecApproxEqual(add(scale(rho, eRho(phi)), scale(z, E_Z)), cylToCart({ rho, phi, z }))).toBe(true);
      expect(dot(cylToCart({ rho, phi, z }), ePhi(phi))).toBeCloseTo(0, 12); // the e_φ-component of r is 0
    }
  });
  it('spherical: r = r e_r(θ, ψ); e_θ- and e_ψ-components of r are 0', () => {
    for (const [r, theta, psi] of [[1.5, 0.7, 0.4], [2, 2.2, 3.5]]) {
      const p = sphToCart({ r, theta, psi });
      expect(vecApproxEqual(scale(r, eR(theta, psi)), p)).toBe(true);
      expect(dot(p, eTheta(theta, psi))).toBeCloseTo(0, 12);
      expect(dot(p, ePsi(psi))).toBeCloseTo(0, 12);
    }
  });
  it('misconception example: ρ = 1.5, φ = 90°, z = 0 — "ρ e_ρ + φ e_φ + z e_z" gives (−1.57; 1.5; 0) instead of (0; 1.5; 0)', () => {
    const rho = 1.5, phi = Math.PI / 2;
    expect(vecApproxEqual(scale(rho, eRho(phi)), [0, 1.5, 0])).toBe(true);
    const wrong = add(scale(rho, eRho(phi)), scale(phi, ePhi(phi)));
    expect(wrong[0]).toBeCloseTo(-1.5708, 4);
    expect(wrong[1]).toBeCloseTo(1.5, 12);
  });
});
