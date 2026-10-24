/**
 * Thermochemistry of Lecture 4 (first law, work, enthalpy, calorimetry, Hess's law, enthalpies of formation).
 * Sign convention of the course (Brown): q and w are positive when they are ADDED to the system, ΔE = q + w.
 * Energies in kJ unless a name says otherwise.
 */
import { R } from './constants';

/** 1 L·atm = 101.325 J (exactly, from 1 atm = 101 325 Pa and 1 L = 10⁻³ m³). */
export const J_PER_L_ATM = 101.325;

/* ------------------------------------------------------------------ first law and signs */
export const deltaE = (q: number, w: number) => q + w;
export type HeatKind = 'endothermic' | 'exothermic' | 'neutral';
export const heatKind = (q: number): HeatKind => (q > 0 ? 'endothermic' : q < 0 ? 'exothermic' : 'neutral');
export type EnergyKind = 'gain' | 'loss' | 'none';
export const energyKind = (dE: number, eps = 1e-9): EnergyKind => (dE > eps ? 'gain' : dE < -eps ? 'loss' : 'none');

/** Work done ON the gas at constant external pressure: w = −P·ΔV (P in atm, ΔV in L → result in J). */
export const pvWorkJ = (P_atm: number, dV_L: number) => -P_atm * dV_L * J_PER_L_ATM;

/** Piston of area A (m²) pushed through Δx (m) by a constant force F = P·A (P in Pa): w = −F·Δx = −P·A·Δx = −P·ΔV (J). */
export function pistonWorkJ(P_Pa: number, A_m2: number, dx_m: number): { F: number; w: number; dV: number } {
  const F = P_Pa * A_m2;
  return { F, w: -F * dx_m, dV: A_m2 * dx_m };
}

/** The three bars of slide 17: ΔE = q_p + w and PΔV = −w, so ΔH = ΔE + PΔV = q_p. */
export function enthalpyBars(qp: number, w: number) {
  const dE = qp + w, PdV = -w;
  return { dE, PdV, dH: dE + PdV };
}

/** ΔH − ΔE = Δ(PV). For ideal gases at constant T and P that is Δn_gas·R·T (kJ for T in K). */
export const pvTermKJ = (dnGas: number, T: number) => (dnGas * R * T) / 1000;
export const dEfromdH = (dH: number, dnGas: number, T: number) => dH - pvTermKJ(dnGas, T);
export const dHfromdE = (dE: number, dnGas: number, T: number) => dE + pvTermKJ(dnGas, T);

/** Number of gas molecules (moles) change of a reaction written with (g)/(l)/(s)/(aq) state symbols. */
export function dnGas(rxn: Reaction): number {
  const g = (side: Term[]) => side.reduce((s, t) => s + (/\(g\)$/.test(t.species) ? t.n : 0), 0);
  return g(rxn.products) - g(rxn.reactants);
}

/* ------------------------------------------------------------------ calorimetry */
export const WATER_CS = 4.18; // J g⁻¹ K⁻¹ (slide 20)
/** q = n·C_m·ΔT (J, with C_m in J mol⁻¹ K⁻¹). */
export const heatMolar = (n: number, Cm: number, dT: number) => n * Cm * dT;
/** q = m·C_s·ΔT (J, with C_s in J g⁻¹ K⁻¹). */
export const heatSpecific = (m: number, Cs: number, dT: number) => m * Cs * dT;

/** Final temperature when bodies at different temperatures exchange heat in an isolated container: Σ m_i C_i (T_eq − T_i) = 0. */
export function equilibriumTemp(bodies: { m: number; Cs: number; T: number }[]): number {
  const num = bodies.reduce((s, b) => s + b.m * b.Cs * b.T, 0), den = bodies.reduce((s, b) => s + b.m * b.Cs, 0);
  return num / den;
}

/** Coffee-cup calorimeter: q_rxn = −q_water; returns the temperature change of the water (K) for a reaction heat q_rxn (kJ). */
export const calorimeterDT = (qRxnKJ: number, mWater_g: number, Cs = WATER_CS) => (-qRxnKJ * 1000) / (mWater_g * Cs);
/** The reverse: the reaction heat (kJ) read off from the temperature change of the water. */
export const calorimeterQrxn = (dT: number, mWater_g: number, Cs = WATER_CS) => (-mWater_g * Cs * dT) / 1000;

/* ------------------------------------------------------------------ enthalpies of formation */
/**
 * Standard enthalpies of formation ΔH°_f at 298 K in kJ/mol: Table 5.3 of Brown (printed on exercise 4, p. 5), plus
 * the few values the TA takes from Appendix C for her exercises (marked appx) and the elements (0).
 */
export const HF: Record<string, number> = {
  'C2H2(g)': 226.7, 'NH3(g)': -46.19, 'C6H6(l)': 49.0, 'CaCO3(s)': -1207.1, 'CaO(s)': -635.5, 'CO2(g)': -393.5, 'CO(g)': -110.5,
  'C(diamond)': 1.88, 'C2H6(g)': -84.68, 'C2H5OH(l)': -277.7, 'C2H4(g)': 52.30, 'C6H12O6(s)': -1273, 'HBr(g)': -36.23,
  'HCl(g)': -92.30, 'HF(g)': -268.60, 'HI(g)': 25.9, 'CH4(g)': -74.80, 'CH3OH(l)': -238.6, 'C3H8(g)': -103.85, 'AgCl(s)': -127.0,
  'NaHCO3(s)': -947.7, 'Na2CO3(s)': -1130.9, 'NaCl(s)': -410.9, 'C12H22O11(s)': -2221, 'H2O(l)': -285.8, 'H2O(g)': -241.8,
  // Appendix C (as used in exercise 4, exercises 3 and 5)
  'CH3OH(g)': -201.2, 'CaF2(s)': -1219.6, 'Fe2O3(s)': -822.16,
  // elements in their most stable form at STP
  'H2(g)': 0, 'O2(g)': 0, 'N2(g)': 0, 'Cl2(g)': 0, 'F2(g)': 0, 'C(s)': 0, 'C(graphite)': 0, 'Fe(s)': 0, 'Ca(s)': 0, 'Na(s)': 0, 'Ag(s)': 0,
};

export interface Term { n: number; species: string }
export interface Reaction { reactants: Term[]; products: Term[] }

/** `'C3H8(g) + 5 O2(g) -> 3 CO2(g) + 4 H2O(l)'`; coefficients may be integers, decimals or `1/2`. */
export function parseReaction(src: string): Reaction {
  const [l, r] = src.split(/\s*->\s*/);
  if (l === undefined || r === undefined) throw new Error(`no arrow in «${src}»`);
  const side = (s: string): Term[] => s.split(/\s\+\s/).map((t) => {
    const m = /^\s*(\d+(?:\.\d+)?(?:\/\d+)?)?\s*(.+?)\s*$/.exec(t);
    if (!m) throw new Error(`cannot read «${t}»`);
    const c = m[1] ?? '1';
    const n = c.includes('/') ? Number(c.split('/')[0]) / Number(c.split('/')[1]) : Number(c);
    return { n, species: m[2] };
  });
  return { reactants: side(l), products: side(r) };
}

export function hf(species: string): number {
  const v = HF[species];
  if (v === undefined) throw new Error(`no ΔH°_f tabulated for ${species}`);
  return v;
}

/** Slide 29: ΔH°_rxn = Σ b_j ΔH°_f(products) − Σ a_i ΔH°_f(reactants). */
export function dHrxn(rxn: Reaction): number {
  const sum = (side: Term[]) => side.reduce((s, t) => s + t.n * hf(t.species), 0);
  return sum(rxn.products) - sum(rxn.reactants);
}

/** One term of the formation route (slide 27/28): reactants are «unformed» (+), products are formed (−ΔH sign of ΔH_f). */
export interface RouteStep { kind: 'unform' | 'form'; species: string; n: number; dH: number }
/**
 * Hess route through the elements (slides 27–28 and exercise 4): first every reactant is decomposed into its elements
 * (ΔH = −n·ΔH_f), then every product is formed from the elements (ΔH = +n·ΔH_f). The steps add up to ΔH°_rxn.
 * Species with ΔH_f = 0 (elements such as O₂) take no step: they are already in the elements' level.
 */
export function formationRoute(rxn: Reaction): RouteStep[] {
  const out: RouteStep[] = [];
  for (const t of rxn.reactants) if (hf(t.species) !== 0) out.push({ kind: 'unform', species: t.species, n: t.n, dH: -t.n * hf(t.species) });
  for (const t of rxn.products) if (hf(t.species) !== 0) out.push({ kind: 'form', species: t.species, n: t.n, dH: t.n * hf(t.species) });
  return out;
}

/** Hess's law for a chain of steps: the enthalpy at each level (starting at 0) and the total. */
export function hessLevels(steps: readonly number[]): { levels: number[]; total: number } {
  const levels = [0];
  for (const d of steps) levels.push(levels[levels.length - 1] + d);
  return { levels, total: levels[levels.length - 1] };
}

/** The steps of slide 23–25 (water vapour route) as numbers: ΔH₁ = −483.6, ΔH₂ = −88 kJ. */
export const SLIDE23 = { dH1: -483.6, dH2: -88, dHrxn: -572 };
