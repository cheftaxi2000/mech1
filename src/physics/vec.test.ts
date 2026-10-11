import { describe, expect, it } from 'vitest';
import { add, cross, dot, E_X, E_Y, E_Z, norm, scale, triple, vecApproxEqual, type Vec3 } from './vec';

// Deterministic pseudo-random vectors (no flaky tests).
function* vectors(n: number): Generator<[Vec3, Vec3]> {
  let s = 4242;
  const rnd = () => ((s = (s * 1103515245 + 12345) % 2 ** 31) / 2 ** 31) * 4 - 2;
  for (let i = 0; i < n; i++) yield [[rnd(), rnd(), rnd()], [rnd(), rnd(), rnd()]];
}
/** The angle between two vectors, 0 … π, from geometry alone (law of cosines, no dot product). */
const angle = (a: Vec3, b: Vec3) => {
  const A = norm(a), B = norm(b), C = norm(add(a, scale(-1, b)));
  return Math.acos(Math.max(-1, Math.min(1, (A * A + B * B - C * C) / (2 * A * B))));
};

describe('orthonormal basis (lecture p. 5)', () => {
  const E = [E_X, E_Y, E_Z];
  it('e_i · e_i = 1 and e_i · e_j = 0 for i ≠ j (pairwise orthogonal, unit length)', () => {
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) expect(dot(E[i], E[j])).toBe(i === j ? 1 : 0);
  });
  it('right-handed: e1 × e2 = e3, e2 × e3 = e1, e3 × e1 = e2', () => {
    expect(cross(E_X, E_Y)).toEqual(E_Z);
    expect(cross(E_Y, E_Z)).toEqual(E_X);
    expect(cross(E_Z, E_X)).toEqual(E_Y);
  });
  it('against the cycle the sign flips: e2 × e1 = −e3, e3 × e2 = −e1 (quiz)', () => {
    expect(vecApproxEqual(cross(E_Y, E_X), [0, 0, -1])).toBe(true);
    expect(vecApproxEqual(cross(E_Z, E_Y), [-1, 0, 0])).toBe(true);
  });
});

describe('scalar product (lecture p. 5)', () => {
  it('a · b = |a||b| cos φ, with φ from the law of cosines', () => {
    for (const [a, b] of vectors(300)) expect(dot(a, b)).toBeCloseTo(norm(a) * norm(b) * Math.cos(angle(a, b)), 9);
  });
  it('a · e1 = |a| cos φ is the (signed) length of the projection of a onto the e1-direction', () => {
    for (const [a] of vectors(100)) {
      const foot = scale(dot(a, E_X), E_X); // foot of the perpendicular from the tip of a onto the e1-axis
      expect(dot(add(a, scale(-1, foot)), E_X)).toBeCloseTo(0, 12); // a − foot ⊥ e1
      expect(dot(a, E_X)).toBeCloseTo(a[0], 12);
    }
  });
  it('component formula (supplement): a · b = a_x b_x + a_y b_y + a_z b_z; worked example (1,2,0)·(3,−1,4) = 1', () => {
    expect(dot([1, 2, 0], [3, -1, 4])).toBe(1);
  });
  it('sign of a · b tells the angle: > 0 acute, = 0 right angle, < 0 obtuse', () => {
    for (const [a, b] of vectors(300)) {
      const phi = angle(a, b), d = dot(a, b);
      if (Math.abs(phi - Math.PI / 2) > 1e-6) expect(Math.sign(d)).toBe(phi < Math.PI / 2 ? 1 : -1);
    }
  });
});

describe('cross product (lecture p. 5)', () => {
  it('|a × b| = |a||b| sin φ = area of the parallelogram', () => {
    for (const [a, b] of vectors(300)) expect(norm(cross(a, b))).toBeCloseTo(norm(a) * norm(b) * Math.sin(angle(a, b)), 9);
  });
  it('a × b is perpendicular to a and to b', () => {
    for (const [a, b] of vectors(300)) {
      const c = cross(a, b);
      expect(dot(c, a)).toBeCloseTo(0, 9);
      expect(dot(c, b)).toBeCloseTo(0, 9);
    }
  });
  it('(a, b, a × b) is right-handed: det(a, b, a × b) = |a × b|² > 0', () => {
    for (const [a, b] of vectors(300)) {
      const c = cross(a, b);
      if (norm(c) > 1e-9) expect(triple(a, b, c)).toBeGreaterThan(0);
    }
  });
  it('anti-commutative: b × a = −(a × b); a × a = 0', () => {
    for (const [a, b] of vectors(100)) {
      expect(vecApproxEqual(cross(b, a), scale(-1, cross(a, b)))).toBe(true);
      expect(vecApproxEqual(cross(a, a), [0, 0, 0])).toBe(true);
    }
  });
  it('demo geometry: a = |a| e_x, b in the xy-plane at angle φ gives a × b = |a||b| sin φ e_z', () => {
    for (const phiDeg of [0, 30, 90, 150, 180]) {
      const p = (phiDeg * Math.PI) / 180, A = 1.6, B = 1.3;
      const c = cross([A, 0, 0], [B * Math.cos(p), B * Math.sin(p), 0]);
      expect(vecApproxEqual(c, [0, 0, A * B * Math.sin(p)], 1e-12)).toBe(true);
    }
  });
  it('component formula (supplement), worked example: (1,2,0) × (3,−1,4) = (8,−4,−7), perpendicular to both', () => {
    const c = cross([1, 2, 0], [3, -1, 4]);
    expect(c).toEqual([8, -4, -7]);
    expect(dot(c, [1, 2, 0])).toBe(0);
    expect(dot(c, [3, -1, 4])).toBe(0);
  });
  it('quiz: |a| = 2, |b| = 3, φ = 30° gives |a × b| = 3', () => {
    const p = Math.PI / 6;
    expect(norm(cross([2, 0, 0], [3 * Math.cos(p), 3 * Math.sin(p), 0]))).toBeCloseTo(3, 12);
  });
});

describe('Cartesian basis (lecture p. 5)', () => {
  it('r = r_x e_x + r_y e_y + r_z e_z with r_x = r · e_x etc. (p. 6)', () => {
    for (const [r] of vectors(100)) {
      const sum = add(add(scale(dot(r, E_X), E_X), scale(dot(r, E_Y), E_Y)), scale(dot(r, E_Z), E_Z));
      expect(vecApproxEqual(sum, r)).toBe(true);
    }
  });
});
