import { describe, expect, it } from 'vitest';
import {
  cartToCyl, cartToSph, cylToCart, sphToCart, lectureArctanPhi,
  eRho, ePhi, eR, eTheta, ePsi, wrapAngle,
} from './coords';
import { cross, dot, E_Z, norm, vecApproxEqual, type Vec3 } from './vec';

// Deterministic pseudo-random points (no flaky tests).
function* points(n: number): Generator<Vec3> {
  let s = 12345;
  const rnd = () => ((s = (s * 1103515245 + 12345) % 2 ** 31) / 2 ** 31) * 4 - 2;
  for (let i = 0; i < n; i++) yield [rnd(), rnd(), rnd()];
}

describe('cylindrical coordinates (lecture p. 4)', () => {
  it('round-trips Cartesian → cylindrical → Cartesian in all octants', () => {
    for (const p of points(500)) expect(vecApproxEqual(cylToCart(cartToCyl(p)), p)).toBe(true);
  });
  it('ρ is the distance from the z-axis, not from the origin', () => {
    expect(cartToCyl([3, 4, 12]).rho).toBeCloseTo(5);
  });
  it('R-001: the literal arctan(y/x) gives the wrong angle for x < 0', () => {
    // Point in the 2nd quadrant: true φ = 135°, arctan(y/x) = −45°.
    expect(cartToCyl([-1, 1, 0]).phi).toBeCloseTo((3 * Math.PI) / 4);
    expect(lectureArctanPhi(-1, 1)).toBeCloseTo(-Math.PI / 4);
    // ...and both quadrants I and III map to the same arctan value.
    expect(lectureArctanPhi(1, 1)).toBeCloseTo(lectureArctanPhi(-1, -1));
  });
  it('agrees with the lecture formula where it is valid (x > 0)', () => {
    for (const [x, y] of [[1, 2], [3, -1], [0.5, 0]] as const)
      expect(wrapAngle(lectureArctanPhi(x, y))).toBeCloseTo(cartToCyl([x, y, 0]).phi);
  });
});

describe('spherical coordinates (lecture p. 4)', () => {
  it('round-trips in all octants', () => {
    for (const p of points(500)) expect(vecApproxEqual(sphToCart(cartToSph(p)), p)).toBe(true);
  });
  it('θ is measured from +z: points below the xy-plane have θ > π/2', () => {
    expect(cartToSph([1, 0, -1]).theta).toBeCloseTo((3 * Math.PI) / 4);
    // The lecture formula arctan(√(x²+y²)/z) would give −π/4 here (R-001).
    expect(Math.atan(1 / -1)).toBeCloseTo(-Math.PI / 4);
  });
  it('handles the degenerate points (origin, z-axis) without NaN', () => {
    for (const p of [[0, 0, 0], [0, 0, 2], [0, 0, -2]] as Vec3[]) {
      const s = cartToSph(p);
      expect(Number.isFinite(s.theta) && Number.isFinite(s.psi)).toBe(true);
      expect(vecApproxEqual(sphToCart(s), p)).toBe(true);
    }
  });
});

describe('local bases are orthonormal and right-handed (lecture pp. 5–7)', () => {
  const angles = [0, 0.3, 1.2, 2.5, 3.9, 5.5];
  it('(e_ρ, e_φ, e_z)', () => {
    for (const phi of angles) {
      const [a, b] = [eRho(phi), ePhi(phi)];
      expect(norm(a)).toBeCloseTo(1); expect(norm(b)).toBeCloseTo(1);
      expect(dot(a, b)).toBeCloseTo(0);
      expect(vecApproxEqual(cross(a, b), E_Z)).toBe(true); // e_ρ × e_φ = e_z
      expect(vecApproxEqual(cross(E_Z, a), b)).toBe(true); // e_φ = e_z × e_ρ (used on p. 11)
    }
  });
  it('(e_r, e_θ, e_ψ)', () => {
    for (const theta of [0.2, 1, 2, 3]) for (const psi of angles) {
      const [a, b, c] = [eR(theta, psi), eTheta(theta, psi), ePsi(psi)];
      for (const u of [a, b, c]) expect(norm(u)).toBeCloseTo(1);
      expect(dot(a, b)).toBeCloseTo(0); expect(dot(b, c)).toBeCloseTo(0); expect(dot(a, c)).toBeCloseTo(0);
      expect(vecApproxEqual(cross(a, b), c)).toBe(true);
    }
  });
  it('basis vectors are tangent to the coordinate lines (∂r/∂q normalised)', () => {
    const h = 1e-6, rho = 1.7, phi = 0.8, z = 0.4;
    const d = cylToCart({ rho, phi: phi + h, z }).map((v, i) => (v - cylToCart({ rho, phi: phi - h, z })[i]) / (2 * h)) as unknown as Vec3;
    // ∂r/∂φ = ρ e_φ  →  scale factor ρ
    expect(vecApproxEqual(d, ePhi(phi).map((c) => c * rho) as unknown as Vec3, 1e-6)).toBe(true);
  });
});
