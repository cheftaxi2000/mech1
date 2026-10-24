import { describe, expect, it } from 'vitest';
import { levelEnergy } from '../../chem/light';
import { ATOM, LEVELS, levelY, lightScene } from './lightScene';
import { expectInside, expectNoOverlap, lab, shape } from './sceneTestKit';

describe('example 3 → 1 (slide 11)', () => {
  it('every frame inside the figure; final labels do not overlap', () => { expectInside(lightScene, 4); expectNoOverlap(lightScene, 4); });
  it('level positions are proportional to the energies: n = 2 at a quarter, n = 3 at a ninth of the way from 0 to E₁', () => {
    const f = (n: number) => (levelY(n) - levelY(Infinity)) / (levelY(1) - levelY(Infinity));
    expect(f(1)).toBeCloseTo(1, 12); expect(f(2)).toBeCloseTo(0.25, 12); expect(f(3)).toBeCloseTo(1 / 9, 12);
    expect(levelEnergy(2) / levelEnergy(1)).toBeCloseTo(f(2), 12);
    expect(levelY(1)).toBeLessThanOrEqual(LEVELS.bottom);
  });
  it('step 1 final frame: the electron is on orbit 3 and on level 3, nothing has happened yet', () => {
    const f = lightScene(0, 1, 'de');
    expect(f.data.R).toBeCloseTo(ATOM.r(3), 9);
    expect(shape(f, 'fall')).toBeUndefined(); expect(shape(f, 'photon-l')).toBeUndefined(); expect(lab(f, 'dE')).toBeUndefined();
    expect(shape(f, 'e-level')!.pts[0][1]).toBeCloseTo(levelY(3), 9);
  });
  it('step 2 final frame: the electron is on orbit 1 and level 1, the photon has left', () => {
    const f = lightScene(1, 1, 'de');
    expect(f.data.R).toBeCloseTo(ATOM.r(1), 9);
    expect(shape(f, 'e-level')!.pts[0][1]).toBeCloseTo(levelY(1), 9);
    expect(shape(f, 'photon-l')).toBeDefined(); expect(shape(f, 'photon-a')).toBeDefined(); expect(shape(f, 'fall')).toBeDefined();
    expect(lab(f, 'dE')).toBeUndefined();
  });
  it('step 3 final frame: the bookkeeping is shown, with the lecture’s numbers', () => {
    const f = lightScene(2, 1, 'de');
    expect(lab(f, 'dE')?.o).toBe(1); expect(lab(f, 'Eph')?.o).toBe(1);
    expect(lab(f, 'dE')!.rows![1].tex).toContain('-1{,}94'); expect(lab(lightScene(3, 1, 'de'), 'dE')).toBeUndefined(); expect(lab(f, 'Eph')!.tex).toContain('1{,}94');
    expect(lab(lightScene(2, 1, 'en'), 'Eph')!.tex).toContain('1.94');
    expect(lab(f, 'lam')).toBeUndefined();
  });
  it('step 4 final frame: λ = 103 nm, deep ultraviolet', () => {
    const f = lightScene(3, 1, 'de');
    expect(lab(f, 'lam')?.o).toBe(1); expect(lab(f, 'lam')!.tex).toContain('103'); expect(f.data.lambdaNm).toBeCloseTo(102.55, 1);
    expect(lab(f, 'uv')?.o).toBe(1);
  });
});
