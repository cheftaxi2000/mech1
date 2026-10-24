import { describe, expect, it } from 'vitest';
import { angular, contour, density, kindOf, orbital, planeOf, psi, radial, radialNodes, type Kind } from './orbital';

const integrate = (f: (r: number) => number, a: number, b: number, n = 4000) => { const h = (b - a) / n; let s = 0; for (let i = 0; i < n; i++) s += f(a + (i + 0.5) * h) * h; return s; };

describe('radial functions of hydrogen', () => {
  it('are normalised: ∫R² r² dr = 1 for all n ≤ 4, ℓ < n', () => {
    for (let n = 1; n <= 4; n++) for (let l = 0; l < n; l++) expect(integrate((r) => radial(n, l, r) ** 2 * r * r, 0, 40 * n * n), `${n},${l}`).toBeCloseTo(1, 4);
  });
  it('agree with the textbook closed forms of 1s, 2s, 2p, 3s, 3p, 3d', () => {
    const f: Record<string, (r: number) => number> = {
      '1,0': (r) => 2 * Math.exp(-r),
      '2,0': (r) => (1 / (2 * Math.SQRT2)) * (2 - r) * Math.exp(-r / 2),
      '2,1': (r) => (1 / (2 * Math.sqrt(6))) * r * Math.exp(-r / 2),
      '3,0': (r) => (2 / (81 * Math.sqrt(3))) * (27 - 18 * r + 2 * r * r) * Math.exp(-r / 3),
      '3,1': (r) => (8 / (27 * Math.sqrt(6))) * r * (1 - r / 6) * Math.exp(-r / 3),
      '3,2': (r) => (4 / (81 * Math.sqrt(30))) * r * r * Math.exp(-r / 3),
    };
    for (const [k, fn] of Object.entries(f)) { const [n, l] = k.split(',').map(Number); for (const r of [0.3, 1, 2.5, 7]) expect(radial(n, l, r), `${k} r=${r}`).toBeCloseTo(fn(r), 10); }
  });
  it('are orthogonal for the same ℓ: ⟨1s|2s⟩ = ⟨2s|3s⟩ = 0', () => {
    expect(integrate((r) => radial(1, 0, r) * radial(2, 0, r) * r * r, 0, 200)).toBeCloseTo(0, 5);
    expect(integrate((r) => radial(2, 0, r) * radial(3, 0, r) * r * r, 0, 300)).toBeCloseTo(0, 5);
  });
  it('mean radius ⟨r⟩ = 1.5 a₀ for 1s and n²(1 + ½(1 − ℓ(ℓ+1)/n²))a₀ in general', () => {
    expect(integrate((r) => radial(1, 0, r) ** 2 * r ** 3, 0, 60)).toBeCloseTo(1.5, 4);
    for (const [n, l] of [[2, 0], [2, 1], [3, 2]]) expect(integrate((r) => radial(n, l, r) ** 2 * r ** 3, 0, 40 * n * n)).toBeCloseTo(0.5 * (3 * n * n - l * (l + 1)), 3);
  });
  it('count of radial nodes is n − ℓ − 1 (2s one node at r = 2 a₀, 3s two)', () => {
    const nodes = (n: number, l: number) => { let c = 0, prev = radial(n, l, 0.05); for (let r = 0.1; r < 60; r += 0.05) { const v = radial(n, l, r); if (v * prev < 0) c++; prev = v; } return c; };
    for (const [n, l] of [[1, 0], [2, 0], [2, 1], [3, 0], [3, 1], [3, 2], [4, 0]]) expect(nodes(n, l), `${n},${l}`).toBe(radialNodes(n, l));
    expect(radial(2, 0, 2)).toBeCloseTo(0, 12);
  });
});

describe('real angular functions', () => {
  const kinds: Kind[] = ['s', 'px', 'py', 'pz', 'dz2', 'dxz', 'dyz', 'dxy', 'dx2y2'];
  const sphere = (f: (x: number, y: number, z: number) => number) => {
    const nt = 120, np = 240; let s = 0;
    for (let j = 0; j < nt; j++) { const th = ((j + 0.5) * Math.PI) / nt; for (let k = 0; k < np; k++) { const ph = ((k + 0.5) * 2 * Math.PI) / np; s += f(Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)) * Math.sin(th) * (Math.PI / nt) * ((2 * Math.PI) / np); } }
    return s;
  };
  it('are normalised and mutually orthogonal over the sphere', () => {
    for (const a of kinds) for (const b of kinds) expect(sphere((x, y, z) => angular(a, x, y, z) * angular(b, x, y, z)), `${a}·${b}`).toBeCloseTo(a === b ? 1 : 0, 3);
  });
  it('lobes lie where the names say: p_z on the z axis, d_xy between x and y, d_x²−y² on the axes, d_z² has the ring in the xy plane', () => {
    expect(Math.abs(angular('pz', 0, 0, 1))).toBeGreaterThan(0.4);
    expect(angular('pz', 1, 0, 0)).toBeCloseTo(0, 12);
    expect(angular('dxy', 1, 1, 0) ** 2).toBeGreaterThan(angular('dxy', 1, 0, 0) ** 2);
    expect(angular('dxy', 1, 0, 0)).toBeCloseTo(0, 12);
    expect(angular('dx2y2', 1, 0, 0)).toBeGreaterThan(0);
    expect(angular('dx2y2', 0, 1, 0)).toBeLessThan(0);
    expect(angular('dz2', 0, 0, 1)).toBeGreaterThan(0);
    expect(angular('dz2', 1, 0, 0)).toBeLessThan(0);
  });
  it('m_ℓ ↔ real orbital as on slides 17–18 and the plane shows the lobes', () => {
    expect([-1, 0, 1].map((m) => kindOf(1, m))).toEqual(['py', 'pz', 'px']);
    expect([-2, -1, 0, 1, 2].map((m) => kindOf(2, m))).toEqual(['dxy', 'dyz', 'dz2', 'dxz', 'dx2y2']);
    expect(kindOf(3, 0)).toBeNull();
    for (const k of kinds) { const pl = planeOf(k); const o = orbital(3, 2, 0)!; void o; expect(['xz', 'yz', 'xy']).toContain(pl); }
    // the density is non-zero somewhere in the chosen plane
    const o = (k: Kind, n = 3) => ({ n, l: k === 's' ? 0 : k.startsWith('p') ? 1 : 2, ml: 0, kind: k });
    for (const k of kinds.filter((q) => q !== 's')) {
      const pl = planeOf(k); let m = 0;
      for (let a = -8; a <= 8; a += 0.5) for (let b = -8; b <= 8; b += 0.5) { const [x, y, z] = pl === 'xz' ? [a, 0, b] : pl === 'yz' ? [0, a, b] : [a, b, 0]; m = Math.max(m, density(o(k), x, y, z)); }
      expect(m, k).toBeGreaterThan(1e-4);
    }
  });
});

describe('90 % contour (slide 16, exercise 6 p. 5)', () => {
  it('1s: the sphere that holds 90 % has radius 2.66 a₀', () => {
    const c = contour(orbital(1, 0, 0)!);
    expect(c.rmax).toBeGreaterThan(2.55);
    expect(c.rmax).toBeLessThan(2.8);
    // density at the contour radius equals the level
    expect(density(orbital(1, 0, 0)!, c.rmax, 0, 0)).toBeCloseTo(c.level, 1);
  });
  it('orbital size grows with n: r90(1s) < r90(2s) < r90(3s) (slide 16)', () => {
    const r = [1, 2, 3].map((n) => contour(orbital(n, 0, 0)!).rmax);
    expect(r[0]).toBeLessThan(r[1]);
    expect(r[1]).toBeLessThan(r[2]);
  });
  it('the region above the level holds 90 % of the probability (1s, by direct integration)', () => {
    const o = orbital(1, 0, 0)!, c = contour(o);
    const p = integrate((r) => radial(1, 0, r) ** 2 * r * r, 0, c.rmax);
    expect(p).toBeGreaterThan(0.89);
    expect(p).toBeLessThan(0.91);
    expect(psi(o, 0, 0, 0) ** 2).toBeCloseTo(1 / Math.PI, 8);
  });
});
