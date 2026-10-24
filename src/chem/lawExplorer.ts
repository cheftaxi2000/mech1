/**
 * Maths behind the gas-law explorer (lecture 2, slides 14–19): which variable moves, which are held fixed, what the
 * curve of each law is, and the constant that stays the same along it. Units: L, atm, K, mol.
 */
import { R_SLIDE, ZERO_C, idealP, idealV, type GasState } from './gas';

export type LawId = 'boyle' | 'charles' | 'avogadro' | 'pt';
const R = R_SLIDE.latm;

export interface LawDef {
  id: LawId;
  /** the variable the student moves */
  free: keyof GasState;
  /** the variables held constant */
  fixed: (keyof GasState)[];
  /** the variable that follows from the others */
  follows: keyof GasState;
}
export const LAW_DEFS: Record<LawId, LawDef> = {
  boyle: { id: 'boyle', free: 'V', fixed: ['n', 'T'], follows: 'P' },
  charles: { id: 'charles', free: 'T', fixed: ['n', 'P'], follows: 'V' },
  avogadro: { id: 'avogadro', free: 'n', fixed: ['P', 'T'], follows: 'V' },
  pt: { id: 'pt', free: 'T', fixed: ['n', 'V'], follows: 'P' },
};
export const RANGES: Record<keyof GasState, { min: number; max: number; step: number }> = {
  n: { min: 0.1, max: 1, step: 0.05 },
  T: { min: 100, max: 600, step: 10 },
  P: { min: 0.2, max: 3, step: 0.1 },
  V: { min: 2, max: 20, step: 0.5 },
};
export const START: GasState = { n: 0.5, T: 300, P: 1, V: 6 };

/** The full state when the free and fixed variables are given: the fourth one comes from PV = nRT. */
export function lawState(law: LawId, s: GasState): GasState {
  const o = { ...s };
  switch (law) {
    case 'boyle': o.P = idealP(s.n, s.T, s.V, R); break;
    case 'charles': o.V = idealV(s.n, s.T, s.P, R); break;
    case 'avogadro': o.V = idealV(s.n, s.T, s.P, R); break;
    case 'pt': o.P = idealP(s.n, s.T, s.V, R); break;
  }
  return o;
}

/** The dependent variable as a function of the free one, all other values fixed: the curve of the law. */
export function curve(law: LawId, s: GasState): (x: number) => number {
  switch (law) {
    case 'boyle': return (V) => idealP(s.n, s.T, V, R);
    case 'charles': return (T) => idealV(s.n, T, s.P, R);
    case 'avogadro': return (n) => idealV(n, s.T, s.P, R);
    case 'pt': return (T) => idealP(s.n, T, s.V, R);
  }
}

/** The quantity that is constant along the curve (slides 14–16 and 19): PV, V/T, V/n, P/T. */
export function lawConstant(law: LawId, s: GasState): number {
  switch (law) {
    case 'boyle': return s.P * s.V;
    case 'charles': return s.V / s.T;
    case 'avogadro': return s.V / s.n;
    case 'pt': return s.P / s.T;
  }
}
/** …and its value in closed form (so the readout can be checked against the law). */
export function lawConstantClosed(law: LawId, s: GasState): number {
  switch (law) {
    case 'boyle': return s.n * R * s.T;
    case 'charles': return (s.n * R) / s.P;
    case 'avogadro': return (R * s.T) / s.P;
    case 'pt': return (s.n * R) / s.V;
  }
}

/** A tick spacing (1, 2 or 5 × 10^k) that gives at most `maxTicks` ticks on [0, max]. */
export function niceStep(max: number, maxTicks = 6): number {
  const raw = max / maxTicks;
  const e = Math.floor(Math.log10(raw));
  for (const m of [1, 2, 5, 10]) if (m * 10 ** e >= raw - 1e-12) return m * 10 ** e;
  return 10 ** (e + 1);
}
/** upper end of an axis: the next multiple of a nice step above `v`. */
export function niceMax(v: number): number {
  const s = niceStep(v * 1.05);
  return Math.ceil((v * 1.05) / s - 1e-9) * s;
}

export const toCelsius = (K: number) => K - ZERO_C;
