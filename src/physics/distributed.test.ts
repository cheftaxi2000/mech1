import { describe, expect, it } from 'vitest';
import {
  ANIM_R, G_EARTH, LINE_L, MATERIALS, PATCH, ROOF, animQ, boxWeight, cellForce, cubeAt, densitySeries, lineExact, lineQ, patchArea,
  patchDensity, rhoOfHeight, roofCellAt, roofGrid, roofS, roofTotal, sliceSum, soilRho, type LineKind, type RoofKind,
} from './distributed';
import { lineResultant } from './force';

const close = (a: number, b: number, tol = 1e-9) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol * Math.max(1, Math.abs(a), Math.abs(b)));

describe('Fig. 4.8: the same force on a smaller patch means a larger density', () => {
  it('s = F/A, and F = s·A is always the same 700 N', () => {
    for (const w of [0.01, 0.03, 0.1]) { close(patchDensity(w) * patchArea(w), PATCH.F); }
    close(patchDensity(0.1), 70000);   // 70 kN/m²
    close(patchDensity(0.01), 700000); // 700 kN/m²: ten times narrower, ten times denser
    close(patchDensity(0.01) / patchDensity(0.1), 10);
  });
});

describe('p. 32: Flächenkraftdichte on a roof', () => {
  const kinds: RoofKind[] = ['flat', 'ramp', 'drift'];
  it('flat snow: R = s·A = 1000 · 24 = 24 kN; ramp: 400 + 250 x averages 1150 → 27.6 kN', () => {
    close(roofTotal('flat'), 24000, 1e-9);
    close(roofTotal('ramp'), 27600, 1e-9);
  });
  it.each([2, 1, 0.5, 0.25])('the cells (side %s m) add up to R, whatever their size', (h) => {
    for (const k of kinds) {
      const g = roofGrid(k, h);
      expect(g.dF.length).toBe(g.nx * g.ny);
      close(g.dF.reduce((a, b) => a + b, 0), roofTotal(k), 2e-4);
    }
  });
  it('ΔF → 0 but ΔF/ΔA → s(P) when the cell around P shrinks', () => {
    const P: [number, number] = [4.4, 2.2];
    let prevErr = Infinity, prevF = Infinity;
    for (const h of [2, 1, 0.5, 0.25, 0.1, 0.05, 0.01]) {
      const c = roofCellAt('drift', P, h);
      expect(c.dF).toBeLessThan(prevF); prevF = c.dF;
      const err = Math.abs(c.ratio - c.sP);
      expect(err).toBeLessThanOrEqual(prevErr + 1e-6); prevErr = err;
    }
    expect(prevErr / roofS('drift', P[0], P[1])).toBeLessThan(1e-3);
    expect(roofCellAt('drift', P, 0.01).dF).toBeLessThan(10);
  });
  it('a single cell: uniform load gives exactly s·h²', () => close(cellForce('flat', 1, 1, 0.5), 250));
  it('the roof is 6 m × 4 m', () => expect(ROOF.a * ROOF.b).toBe(24));
});

describe('p. 32 «Parenthèse»: ΔV → 0 ⇒ ΔM → 0, but ΔM/ΔV → ρ', () => {
  const P = [1.9, 1, 1.6] as const;
  it('the ratio converges to ρ(P), the mass goes to 0 like h³', () => {
    const rho = soilRho(P);
    close(cubeAt(P, 0.001).ratio, rho, 1e-5);
    expect(Math.abs(cubeAt(P, 2).ratio - rho) / rho).toBeGreaterThan(0.08); // the big cube is a poor measurement
    expect(cubeAt(P, 0.001).dM).toBeLessThan(1e-5);
    close(cubeAt(P, 0.02).dM / cubeAt(P, 0.01).dM, 8, 1e-3);
  });
  it('the series is monotone in ΔM and ends at h = 2 m', () => {
    const s = densitySeries(P);
    for (let i = 1; i < s.length; i++) expect(s[i].dM).toBeGreaterThan(s[i - 1].dM);
    expect(s[s.length - 1].h).toBeCloseTo(2, 12);
  });
  it('ρ is between 1800 and 2700 kg/m³', () => {
    for (const p of [[0, 0, 0], [2.6, 1, 1.5], [4, 2, 3]] as const) { expect(soilRho(p)).toBeGreaterThanOrEqual(1800); expect(soilRho(p)).toBeLessThanOrEqual(2700 + 1e-9); }
    close(soilRho([2.6, 1, 1.5]), 2700);
  });
});

describe('p. 32: the weight G = −∭ρ g dV e_z', () => {
  it('homogeneous: G = ρ g V; one litre of water weighs 9.81 N', () => {
    close(boxWeight(1000, 0.1, 0.1, 0.1, false).G, 9.81, 1e-9);
    const b = boxWeight(2400, 2, 1.5, 0.5, false);
    close(b.G, 2400 * G_EARTH * 1.5, 1e-9); close(b.M, 3600, 1e-9);
  });
  it('density varying with the height: G = mean ρ · g · V with mean ρ = 1.4 ρ₀', () => {
    const b = boxWeight(500, 1, 2, 0.5, true);
    close(b.rhoMean, 700, 1e-9); close(b.G, 700 * G_EARTH, 1e-9);
    close(rhoOfHeight(500, 0, 1), 900); close(rhoOfHeight(500, 1, 1), 500);
  });
  it('materials', () => expect(MATERIALS.map((m) => m.rho)).toEqual([500, 1000, 2400, 7850]));
});

describe('p. 32: Linienkraftdichte, R = ∫₀ᴸ q dx', () => {
  const kinds: LineKind[] = ['const', 'ramp', 'parab'];
  it.each(kinds)('%s: closed form = quadrature', (k) => {
    close(lineResultant((x) => lineQ(k, x), LINE_L), lineExact(k), 1e-9);
  });
  it('constant load: R = q L', () => close(lineExact('const'), 40 * 4));
  it('the animation: q = 20 + 60 (x/L)² gives R = 160 N and the sums 155, 158.75, 159.6875, 159.921875', () => {
    close(lineResultant(animQ, LINE_L), ANIM_R, 1e-9);
    close(sliceSum(animQ, 2), 155); close(sliceSum(animQ, 4), 158.75);
    close(sliceSum(animQ, 8), 159.6875); close(sliceSum(animQ, 16), 159.921875);
    // the error of the midpoint sum shrinks like 1/n²: R − Σ = (Δx²/24)(q′(L) − q′(0)) = Δx²·30/24
    for (const n of [2, 4, 8, 16]) close(ANIM_R - sliceSum(animQ, n), ((LINE_L / n) ** 2 / 24) * 30, 1e-9);
  });
  it('more pieces never make the sum worse', () => {
    let prev = Infinity;
    for (const n of [1, 2, 4, 8, 16, 32, 64]) { const e = Math.abs(ANIM_R - sliceSum(animQ, n)); expect(e).toBeLessThan(prev); prev = e; }
  });
});
