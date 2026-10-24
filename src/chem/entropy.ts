/**
 * Entropy of Lecture 5: ΔS = q_rev/T, the 2nd law as ΔS_univ ≥ 0, and Boltzmann's S = k_B ln W by exact counting.
 * Entropies in J mol⁻¹ K⁻¹ (per mole) or J K⁻¹ (per body); W counts microstates.
 */
import { R, k_B } from './constants';

/* ------------------------------------------------------------------ counting microstates */
/** Binomial coefficient C(n, k), exact for the sizes used here (n ≤ 60). */
export function binom(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  const kk = Math.min(k, n - k);
  let r = 1n;
  for (let i = 1; i <= kk; i++) r = (r * BigInt(n - kk + i)) / BigInt(i);
  return Number(r);
}

/** N identical particles on `cells` lattice sites, at most one per site: W = C(cells, N). */
export const latticeW = (cells: number, N: number) => binom(cells, N);

/** S/k_B = ln W (dimensionless), and S itself in J/K. */
export const entropyKB = (W: number) => Math.log(W);
export const entropyJK = (W: number) => k_B * Math.log(W);

/**
 * Isothermal expansion into vacuum, lattice model: the partition between two halves with M sites each is removed.
 * Before: all N particles on the left (W = C(M, N)); after: they may sit anywhere (W = C(2M, N)).
 */
export function expansionLattice(M: number, N: number) {
  const Wi = latticeW(M, N), Wf = latticeW(2 * M, N);
  return {
    Wi, Wf,
    dS_kB: Math.log(Wf / Wi), // ΔS = k_B ln(W_f/W_i)
    dS_JK: k_B * Math.log(Wf / Wi),
    pAllLeft: Wi / Wf, // chance that a random microstate of the open box has everything on the left again
  };
}

/**
 * With the partition open, the macroscopic state «k of the N particles are in the left half» can be realised in
 * W(k) = C(M, k)·C(M, N − k) ways. These numbers add up to C(2M, N), the total number of microstates.
 */
export function macrostateW(M: number, N: number): number[] {
  return Array.from({ length: N + 1 }, (_, k) => binom(M, k) * binom(M, N - k));
}

/** For a dilute gas (N ≪ M) the ratio W_f/W_i → 2^N, so ΔS → N k_B ln 2; for N = N_A this is R ln 2 = 5.76 J/K. */
export const dilutedExpansionJKperMol = () => R * Math.log(2);

/* ------------------------------------------------------------------ random microstates (seeded, deterministic) */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A uniformly random choice of N occupied sites out of `cells` (partial Fisher–Yates), sorted. */
export function sampleConfig(cells: number, N: number, rnd: () => number): number[] {
  const idx = Array.from({ length: cells }, (_, i) => i);
  for (let i = 0; i < N; i++) {
    const j = i + Math.floor(rnd() * (cells - i));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, N).sort((a, b) => a - b);
}

/* ------------------------------------------------------------------ heat flow between two bodies (slides 9–10, 15–16) */
export interface Blocks { Th: number; Tc: number; C: number }
/**
 * Two identical blocks of heat capacity C (J/K) at T_hot and T_cold are in thermal contact inside an isolated box.
 * After heat q (J) has flowed from hot to cold (q < 0: the impossible reverse direction):
 * ΔS_hot = C ln(T_hot'/T_hot) < 0, ΔS_cold = C ln(T_cold'/T_cold) > 0.
 */
export function heatFlow(b: Blocks, q: number) {
  const Th = b.Th - q / b.C, Tc = b.Tc + q / b.C;
  const dSh = b.C * Math.log(Th / b.Th), dSc = b.C * Math.log(Tc / b.Tc);
  return { Th, Tc, dSh, dSc, dSuniv: dSh + dSc };
}
/** Heat that has flowed when both blocks have reached the same temperature; ΔS_univ is largest there. */
export const qEquilibrium = (b: Blocks) => (b.C * (b.Th - b.Tc)) / 2;
export const Tequilibrium = (b: Blocks) => (b.Th + b.Tc) / 2;

/** Slide 10: infinitesimal temperature difference δT — heat q at almost equal temperatures changes S_univ by q(1/T − 1/(T+δT)) → 0. */
export const reversibleDSuniv = (q: number, T: number, dT: number) => q / T - q / (T + dT);

/* ------------------------------------------------------------------ phase changes (slides 13–16) */
/** ΔS = q_rev/T for an isothermal process at absolute temperature T. */
export const dSisothermal = (qrev_J: number, T: number) => qrev_J / T;
export const DH_FUS_WATER = 6.0e3; // J/mol (slide 14)
export const T_MELT = 273.15; // K (the slide rounds to 273)

/**
 * A process that absorbs heat q (J/mol) from the surroundings at T_surr while the system sits at T_sys
 * (ice melting: q = ΔH_fus, T_sys = 273 K; for freezing pass q < 0).
 */
export function universeBalance(q: number, Tsys: number, Tsurr: number) {
  const sys = q / Tsys, surr = -q / Tsurr, univ = sys + surr;
  return { sys, surr, univ, spontaneous: univ > 1e-9, reversible: Math.abs(univ) <= 1e-9 };
}
/** The temperature of the surroundings at which melting ice is just reversible: T_surr = T_melt (slides 10, 15). */
export const meltingBreakEven = () => T_MELT;

/* ------------------------------------------------------------------ what raises S (slide 19, exercise 5 p. 4–5) */
/**
 * Sign of ΔS_sys predicted from the change of the number of gas particles (exercise 3 of class 5):
 * more gas molecules → more microstates → ΔS > 0; fewer → ΔS < 0.
 */
export function entropySignFromGas(dn: number): 'up' | 'down' | 'unclear' {
  return dn > 0 ? 'up' : dn < 0 ? 'down' : 'unclear';
}

/** Schematic entropy of 1 mol of water versus T (supplement, approximate textbook values): jumps at the melting and boiling point. */
export const WATER = { Tm: 273.15, Tb: 373.15, dHfus: 6.01e3, dHvap: 40.7e3, CpL: 75.3, CpG: 33.6, S_m_ice: 41 } as const;
export function waterEntropy(T: number): { S: number; phase: 'solid' | 'liquid' | 'gas' } {
  const { Tm, Tb, dHfus, dHvap, CpL, CpG, S_m_ice } = WATER;
  const Sfus = dHfus / Tm, Svap = dHvap / Tb;
  if (T < Tm) return { S: S_m_ice * Math.pow(Math.max(T, 0) / Tm, 0.8), phase: 'solid' };
  const Sl0 = S_m_ice + Sfus;
  if (T < Tb) return { S: Sl0 + CpL * Math.log(T / Tm), phase: 'liquid' };
  return { S: Sl0 + CpL * Math.log(Tb / Tm) + Svap + CpG * Math.log(T / Tb), phase: 'gas' };
}
export const waterJumps = () => ({ fus: WATER.dHfus / WATER.Tm, vap: WATER.dHvap / WATER.Tb });
