import { describe, expect, it } from 'vitest';
import { GAIN, NU, PRESET_S, SQUARE, FACES, deformation, image, loadAt, shearDir, strainOf } from './stress';
import { det, col } from './plane2';

describe('opener machine «Mechanics II»: square under load (Übung 1, slide 4)', () => {
  it('s = 0: no load, F is the identity', () => {
    expect(loadAt(0)).toEqual({ sx: 0, sy: 0, tau: 0 });
    expect(deformation(0)).toEqual([[1, 0], [0, 1]]);
  });
  it('the three presets: uniaxial, biaxial, pure shear', () => {
    expect(loadAt(PRESET_S.uniaxial)).toEqual({ sx: 1, sy: 0, tau: 0 });
    const b = loadAt(PRESET_S.biaxial);
    expect(b.sx).toBe(1); expect(b.sy).toBeCloseTo(0.6, 12); expect(b.tau).toBe(0);
    expect(loadAt(PRESET_S.shear)).toEqual({ sx: 0, sy: 0, tau: 1 });
  });
  it('uniaxial tension: stretch in x, Poisson contraction in y', () => {
    const F = deformation(PRESET_S.uniaxial);
    expect(F[0][0]).toBeCloseTo(1 + GAIN, 12);
    expect(F[1][1]).toBeCloseTo(1 - GAIN * NU, 12);
    expect(F[0][1]).toBe(0); expect(F[1][0]).toBe(0);
  });
  it('pure shear: the diagonal stays 1, the off-diagonal entries are g·(1 + ν)', () => {
    const F = deformation(PRESET_S.shear);
    expect(F[0][0]).toBeCloseTo(1, 12); expect(F[1][1]).toBeCloseTo(1, 12);
    expect(F[0][1]).toBeCloseTo(GAIN * (1 + NU), 12);
    expect(F[1][0]).toBeCloseTo(F[0][1], 12);
  });
  it('the columns of F are the images of e₁ and e₂ (what the picture shows)', () => {
    for (const s of [0, 0.2, 0.5, 0.8, 1]) {
      const F = deformation(s);
      expect(image(F, [1, 0])).toEqual(col(F, 0));
      expect(image(F, [0, 1])).toEqual(col(F, 1));
    }
  });
  it('F stays invertible along the whole sweep (the square never collapses) and the load is continuous', () => {
    let prev = loadAt(0);
    for (let i = 1; i <= 1000; i++) {
      const s = i / 1000, L = loadAt(s);
      expect(det(deformation(s))).toBeGreaterThan(0.9);
      expect(Math.abs(L.sx - prev.sx) + Math.abs(L.sy - prev.sy) + Math.abs(L.tau - prev.tau)).toBeLessThan(0.06);
      prev = L;
    }
  });
  it('strain: Hooke for plane stress', () => {
    const E = strainOf({ sx: 1, sy: 0.6, tau: 0 });
    expect(E.ex).toBeCloseTo(1 - 0.3 * 0.6, 12); expect(E.ey).toBeCloseTo(0.6 - 0.3, 12); expect(E.exy).toBe(0);
  });
  it('geometry helpers: the deformed square has area 4·det F, the shear arrows form a couple', () => {
    expect(SQUARE).toHaveLength(4);
    const F = deformation(PRESET_S.shear);
    const q = SQUARE.map((p) => image(F, p));
    let A = 0;
    for (let i = 0; i < 4; i++) { const a = q[i], b = q[(i + 1) % 4]; A += a[0] * b[1] - b[0] * a[1]; }
    expect(A / 2).toBeCloseTo(4 * det(F), 10);
    expect(FACES.map(shearDir)).toEqual([[0, 1], [1, 0], [0, -1], [-1, 0]]);
  });
});
