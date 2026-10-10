import { describe, expect, it } from 'vitest';
import { OBLIQUE, TOP, camera, centroid, ease, lerpView, outerSquares, polygonArea2D, project, triangle } from './geometry';
import { cross, dot, norm, sub, vecApproxEqual, type Vec3 } from '../../physics/vec';

describe('orthographic camera', () => {
  it('screen axes R, U are orthonormal and R × U points to the camera for every view on the way', () => {
    for (const k of [0, 0.25, 0.5, 0.75, 1]) {
      const v = lerpView(OBLIQUE, TOP, k);
      const { R, U } = camera(v.alpha, v.beta);
      expect(norm(R)).toBeCloseTo(1); expect(norm(U)).toBeCloseTo(1); expect(dot(R, U)).toBeCloseTo(0);
      const d: Vec3 = [Math.cos(v.beta) * Math.cos(v.alpha), Math.cos(v.beta) * Math.sin(v.alpha), Math.sin(v.beta)];
      expect(vecApproxEqual(cross(R, U), d)).toBe(true);
    }
  });
  it('top view shows the xy-plane undistorted with x to the right and y up (SVG y grows down)', () => {
    const O = project([0, 0, 0], TOP), X = project([1, 0, 0], TOP), Y = project([0, 1, 0], TOP), Z = project([0, 0, 1], TOP);
    expect(X[0] - O[0]).toBeCloseTo(TOP.s); expect(X[1] - O[1]).toBeCloseTo(0);
    expect(Y[0] - O[0]).toBeCloseTo(0); expect(Y[1] - O[1]).toBeCloseTo(-TOP.s);
    expect(Z[0] - O[0]).toBeCloseTo(0); expect(Z[1] - O[1]).toBeCloseTo(0); // z collapses: looking straight down
  });
  it('oblique view matches Fig. 1.4/1.8 of the lecture: z up, x down-right, y up-right (both ≈ 24° from horizontal)', () => {
    const O = project([0, 0, 0], OBLIQUE), X = project([1, 0, 0], OBLIQUE), Y = project([0, 1, 0], OBLIQUE), Z = project([0, 0, 1], OBLIQUE);
    expect(Z[0] - O[0]).toBeCloseTo(0); expect(Z[1]).toBeLessThan(O[1]);
    const angle = (P: readonly [number, number]) => (Math.atan2(O[1] - P[1], P[0] - O[0]) * 180) / Math.PI; // screen angle, up = +
    expect(angle(X)).toBeGreaterThan(-35); expect(angle(X)).toBeLessThan(-15);
    expect(angle(Y)).toBeGreaterThan(15); expect(angle(Y)).toBeLessThan(35);
  });
  it('projection keeps a point of the xy-plane and its vertical drop on one screen point in top view', () => {
    const M: Vec3 = [1.2, 0.9, 1.3], Mxy: Vec3 = [1.2, 0.9, 0];
    expect(project(M, TOP)[0]).toBeCloseTo(project(Mxy, TOP)[0]);
    expect(project(M, TOP)[1]).toBeCloseTo(project(Mxy, TOP)[1]);
  });
});

describe('triangle construction of x = ρ cos φ, y = ρ sin φ (all four quadrants)', () => {
  const rho = 1.6;
  const phis = [0.3, 1.2, 2.0, 2.9, 3.6, 4.4, 5.2, 6.0];
  it('legs are the signed coordinates, hypotenuse is ρ, right angle at F', () => {
    for (const phi of phis) {
      const t = triangle(rho, phi);
      expect(t.x).toBeCloseTo(rho * Math.cos(phi)); expect(t.y).toBeCloseTo(rho * Math.sin(phi));
      expect(norm(t.Mxy)).toBeCloseTo(rho);
      expect(dot(sub(t.O, t.F), sub(t.Mxy, t.F))).toBeCloseTo(0);
      expect(Math.sign(t.x)).toBe(Math.sign(Math.cos(phi))); // e.g. negative in quadrants II and III
    }
  });
  it('the three squares lie outside the triangle and their areas satisfy ρ² = x² + y²', () => {
    for (const phi of phis) {
      const tri = triangle(rho, phi);
      const { sx, sy, sr } = outerSquares(tri, rho, phi);
      expect(polygonArea2D(sx)).toBeCloseTo(tri.x ** 2);
      expect(polygonArea2D(sy)).toBeCloseTo(tri.y ** 2);
      expect(polygonArea2D(sr)).toBeCloseTo(rho ** 2);
      expect(polygonArea2D(sx) + polygonArea2D(sy)).toBeCloseTo(polygonArea2D(sr));
      // "outside": each square's centre and the triangle's opposite vertex are on different sides of the shared edge
      const side = (a: Vec3, b: Vec3, p: Vec3) => Math.sign((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]));
      expect(side(tri.O, tri.F, centroid(sx))).toBe(-side(tri.O, tri.F, tri.Mxy));
      expect(side(tri.F, tri.Mxy, centroid(sy))).toBe(-side(tri.F, tri.Mxy, tri.O));
      expect(side(tri.O, tri.Mxy, centroid(sr))).toBe(-side(tri.O, tri.Mxy, tri.F));
    }
  });
});

describe('easing', () => {
  it('starts at 0, ends at 1, is monotone', () => {
    expect(ease(0)).toBe(0); expect(ease(1)).toBe(1);
    let prev = -1;
    for (let k = 0; k <= 1; k += 0.05) { expect(ease(k)).toBeGreaterThanOrEqual(prev); prev = ease(k); }
  });
});
