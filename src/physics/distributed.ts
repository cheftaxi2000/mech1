/**
 * Verteilte Kräfte (Skript pp. 31–32, Fig. 4.8): numeric models of the lesson «Verteilte Kräfte und Kraftdichte».
 * Everything the figures show is computed here (and tested), on top of the quadrature helpers of force.ts.
 * The scenes (a patch under a shoe, snow on a roof, a soil lens, a box of material, a load on a beam) are OUR examples.
 */
import { areaSum, cubeMass, integrate, midpointSum, weightBox } from './force';
import type { Vec3 } from './vec';

export const G_EARTH = 9.81; // m/s²

// ───────────────────────── 1. one force, a shrinking contact strip (Fig. 4.8 a) ─────────────────────────

/** A person (≈ 70 kg) stands on one foot: F ≈ 700 N, spread over a strip of length 10 cm and width w. */
export const PATCH = { F: 700, depth: 0.1, wMin: 0.01, wMax: 0.1 } as const;
export const patchArea = (w: number) => w * PATCH.depth; // m²
/** Flächenkraftdichte of a uniformly loaded patch: s = F/A in N/m². */
export const patchDensity = (w: number, F: number = PATCH.F) => F / patchArea(w);

// ───────────────────────────── 2. snow on a roof: s(x, y) in N/m² ─────────────────────────────

export const ROOF = { a: 6, b: 4 } as const; // m
export type RoofKind = 'flat' | 'ramp' | 'drift';
/** Flächenkraftdichte on the roof: even snow, snow that gets deeper to the right, a drift in one corner region. */
export function roofS(kind: RoofKind, x: number, y: number): number {
  switch (kind) {
    case 'flat': return 1000;
    case 'ramp': return 400 + 250 * x;
    case 'drift': return 600 + 1800 * Math.exp(-((x - 4.4) ** 2 / 1.3 + (y - 2.2) ** 2 / 1.6));
  }
}
/** ΔF = ∬ s dA over the square [x0, x0+h] × [y0, y0+h] (midpoint rule with sub-cells of at most 0.1 m). */
export function cellForce(kind: RoofKind, x0: number, y0: number, h: number): number {
  const m = Math.max(2, Math.min(24, Math.ceil(h / 0.1)));
  const d = h / m;
  let s = 0;
  for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) s += roofS(kind, x0 + (i + 0.5) * d, y0 + (j + 0.5) * d) * d * d;
  return s;
}
/** The grid of squares with side h (h must divide 6 and 4): ΔF of every cell, row by row. */
export function roofGrid(kind: RoofKind, h: number) {
  const nx = Math.round(ROOF.a / h), ny = Math.round(ROOF.b / h);
  const dF: number[] = [];
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) dF.push(cellForce(kind, i * h, j * h, h));
  return { nx, ny, dF };
}
/** R = ∬ s dA over the whole roof (reference value; fine midpoint rule). */
export const roofTotal = (kind: RoofKind) => areaSum((x, y) => roofS(kind, x, y), ROOF.a, ROOF.b, 240);
/** The cell of the grid (side h) that contains the point P = (x, y), and what it carries. */
export function roofCellAt(kind: RoofKind, P: readonly [number, number], h: number) {
  const nx = Math.round(ROOF.a / h), ny = Math.round(ROOF.b / h);
  const i = Math.min(nx - 1, Math.max(0, Math.floor(P[0] / h))), j = Math.min(ny - 1, Math.max(0, Math.floor(P[1] / h)));
  const dF = cellForce(kind, i * h, j * h, h);
  return { i, j, dA: h * h, dF, ratio: dF / (h * h), sP: roofS(kind, P[0], P[1]) };
}

// ───────────────────────── 3. density at a point (the handwritten «Parenthèse») ─────────────────────────

/** A soil block 4 m × 2 m × 3 m (x, y, z) with a dense rock lens: ρ in kg/m³, 1800 outside, up to 2700 at the lens centre. */
export const SOIL = { X: 4, Y: 2, Z: 3, yMid: 1, lens: [2.6, 1, 1.5] as Vec3 } as const;
export const soilRho = (p: Vec3): number =>
  1800 + 900 * Math.exp(-(((p[0] - SOIL.lens[0]) ** 2 + (p[1] - SOIL.lens[1]) ** 2 + (p[2] - SOIL.lens[2]) ** 2) / 0.8));
/** ΔM and ΔM/ΔV for the cube of side h around P (kg, kg/m³). */
export function cubeAt(P: Vec3, h: number) {
  const dM = cubeMass(soilRho, P, h, 10), dV = h * h * h;
  return { h, dV, dM, ratio: dM / dV };
}
export const H_MAX = 2; // largest cube (m)
/** Sample the two curves ΔM(h) and ΔM/ΔV(h) for h in (0, H_MAX]. */
export function densitySeries(P: Vec3, n = 48) {
  return Array.from({ length: n }, (_, i) => cubeAt(P, (H_MAX * (i + 1)) / n));
}

// ───────────────────────────────────── 4. weight as a volume force ─────────────────────────────────────

export interface Material { id: 'water' | 'wood' | 'concrete' | 'steel'; rho: number; de: string; en: string }
/** Round textbook densities in kg/m³. */
export const MATERIALS: readonly Material[] = [
  { id: 'wood', rho: 500, de: 'Fichtenholz', en: 'spruce wood' },
  { id: 'water', rho: 1000, de: 'Wasser', en: 'water' },
  { id: 'concrete', rho: 2400, de: 'Beton', en: 'concrete' },
  { id: 'steel', rho: 7850, de: 'Stahl', en: 'steel' },
];
/** «Dichte ändert sich mit der Höhe»: ρ(z) = ρ₀ (1 + 0.8 (1 − z/c)), i.e. 1.8 ρ₀ at the bottom, ρ₀ at the top. */
export const rhoOfHeight = (rho0: number, z: number, c: number) => rho0 * (1 + 0.8 * (1 - z / c));
/** Weight of the box a × b × c (m): V, mass M = ∭ρ dV, weight G = g M, and the mean density M/V. */
export function boxWeight(rho0: number, a: number, b: number, c: number, varying: boolean) {
  const V = a * b * c;
  const rho = varying ? (p: Vec3) => rhoOfHeight(rho0, p[2], c) : () => rho0;
  const G = -weightBox(rho, G_EARTH, a, b, c, 12)[2];
  const M = G / G_EARTH;
  return { V, M, G, rhoMean: M / V };
}

// ───────────────────────────────── 5. line load q(x) on a beam of length L ─────────────────────────────────

export const LINE_L = 4; // m
export type LineKind = 'const' | 'ramp' | 'parab';
/** Linienkraftdichte q(x) in N/m: constant, linearly growing, growing like x². */
export function lineQ(kind: LineKind, x: number, q0 = 1, L = LINE_L): number {
  switch (kind) {
    case 'const': return 40 * q0;
    case 'ramp': return 60 * q0 * (x / L);
    case 'parab': return 100 * q0 * (x / L) ** 2;
  }
}
/** Exact R = ∫₀ᴸ q dx for the three presets (N). */
export function lineExact(kind: LineKind, q0 = 1, L = LINE_L): number {
  switch (kind) {
    case 'const': return 40 * q0 * L;
    case 'ramp': return 30 * q0 * L;
    case 'parab': return (100 * q0 * L) / 3;
  }
}
/** The load of the step animation: q(x) = 20 + 60 (x/L)² N/m, R = 20 L + 20 L = 160 N for L = 4 m. */
export const animQ = (x: number) => 20 + 60 * (x / LINE_L) ** 2;
export const ANIM_R = 160;
/** Σ q(x_i) Δx with n equal pieces (midpoint of each piece). */
export const sliceSum = (q: (x: number) => number, n: number, L = LINE_L) => midpointSum(q, 0, L, n);
export const lineIntegral = (q: (x: number) => number, L = LINE_L) => integrate(q, 0, L);
