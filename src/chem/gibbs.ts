/**
 * Gibbs free energy (lecture 5, slides 22–29; exercise class 5, pp. 7–13).
 * Units: ΔH, ΔG in kJ/mol, ΔS and S° in J/(mol·K), T in K.
 */

/** Standard thermodynamic quantities at 298 K: ΔH°f and ΔG°f in kJ/mol, S° in J/(mol·K). */
export interface Thermo { H: number; G: number; S: number }

/**
 * Values of Appendix C (Brown), as printed on p. 12 of the filled-in exercise slides 5.
 * N₂, H₂, NH₃ carry the rounded lecture values for S° (192, 131, 193; slide 23) and ΔH°f(NH₃) = −46.2 (so that ΔH°rxn = −92.4 kJ, slide 24);
 * Appendix C itself prints S° = 191.50, 130.58, 192.5 and ΔH°f = −46.19 for them.
 */
export const THERMO: Record<string, Thermo> = {
  'N2(g)': { H: 0, G: 0, S: 192 },
  'H2(g)': { H: 0, G: 0, S: 131 },
  'NH3(g)': { H: -46.2, G: -16.66, S: 193 },
  'O2(g)': { H: 0, G: 0, S: 205.0 },
  'O3(g)': { H: 142.3, G: 163.4, S: 237.6 },
  'Zn(s)': { H: 0, G: 0, S: 41.63 },
  'ZnO(s)': { H: -348.0, G: -318.2, S: 43.9 },
  'NaBr(s)': { H: -361.4, G: -349.3, S: 86.82 },
  'Na(g)': { H: 107.7, G: 77.3, S: 153.7 },
  'Br2(g)': { H: 30.71, G: 3.14, S: 245.3 },
  'CaO(s)': { H: -635.5, G: -604.17, S: 39.75 },
  'CO2(g)': { H: -393.5, G: -394.4, S: 213.6 },
  'CaCO3(s)': { H: -1207.1, G: -1128.76, S: 92.88 },
  'SO2(g)': { H: -296.9, G: -300.4, S: 248.5 },
  'SO3(g)': { H: -395.2, G: -370.4, S: 256.2 },
};

export type Quantity = 'H' | 'G' | 'S';
export type Term = [coef: number, species: string];
export interface Reaction { id: string; reactants: Term[]; products: Term[] }

export const REACTIONS: Reaction[] = [
  { id: 'nh3', reactants: [[1, 'N2(g)'], [3, 'H2(g)']], products: [[2, 'NH3(g)']] },
  { id: 'zno', reactants: [[2, 'Zn(s)'], [1, 'O2(g)']], products: [[2, 'ZnO(s)']] },
  { id: 'o3', reactants: [[2, 'O3(g)']], products: [[3, 'O2(g)']] },
  { id: 'nabr', reactants: [[2, 'NaBr(s)']], products: [[2, 'Na(g)'], [1, 'Br2(g)']] },
  { id: 'caco3', reactants: [[1, 'CaO(s)'], [1, 'CO2(g)']], products: [[1, 'CaCO3(s)']] },
  { id: 'so3', reactants: [[2, 'SO2(g)'], [1, 'O2(g)']], products: [[2, 'SO3(g)']] },
];

/** Σ aᵢ·X for one side of a reaction. */
export const side = (q: Quantity, terms: Term[]) => terms.reduce((s, [a, sp]) => s + a * THERMO[sp][q], 0);
/** Σ products − Σ reactants (slides 22 and 28). ΔH, ΔG in kJ, ΔS in J/K. */
export const deltaRxn = (q: Quantity, r: Reaction) => side(q, r.products) - side(q, r.reactants);
/** Number of gas molecules on one side (coefficients of the species marked (g)). */
export const gasCount = (terms: Term[]) => terms.reduce((s, [a, sp]) => s + (sp.endsWith('(g)') ? a : 0), 0);

/** ΔG = ΔH − TΔS (slide 26), ΔH in kJ, ΔS in J/K, T in K → kJ. */
export const gibbs = (dH: number, dS: number, T: number) => dH - (T * dS) / 1000;
/** −TΔS in kJ. */
export const minusTdS = (dS: number, T: number) => -(T * dS) / 1000;
/** ΔS_surr = −ΔH/T in J/K (slide 24); ΔH in kJ. */
export const dSsurr = (dH: number, T: number) => (-dH * 1000) / T;
export const dSuniv = (dH: number, dS: number, T: number) => dS + dSsurr(dH, T);

/** Temperature where ΔG = 0, T = ΔH/ΔS, if it is positive (the signs of ΔH and ΔS agree); otherwise null. */
export function crossoverT(dH: number, dS: number): number | null {
  if (dH === 0 || dS === 0) return null;
  const T = (dH * 1000) / dS;
  return T > 0 ? T : null;
}

/** The four sign combinations of slide 29: 1 (−,+), 2 (+,−), 3 (−,−), 4 (+,+); null if ΔH or ΔS is 0. */
export function caseOf(dH: number, dS: number): 1 | 2 | 3 | 4 | null {
  if (dH === 0 || dS === 0) return null;
  if (dH < 0) return dS > 0 ? 1 : 3;
  return dS < 0 ? 2 : 4;
}

/** Where is the reaction spontaneous (ΔG < 0)? Temperatures T > 0. */
export type Range = { kind: 'all' } | { kind: 'none' } | { kind: 'below'; T: number } | { kind: 'above'; T: number };
export function spontaneousRange(dH: number, dS: number): Range {
  switch (caseOf(dH, dS)) {
    case 1: return { kind: 'all' };
    case 2: return { kind: 'none' };
    case 3: return { kind: 'below', T: crossoverT(dH, dS)! };
    case 4: return { kind: 'above', T: crossoverT(dH, dS)! };
    default: return dH < 0 || (dH === 0 && dS > 0) ? { kind: 'all' } : { kind: 'none' };
  }
}

/** Presets of the temperature explorer: the four examples of slide 29 and two more. ΔH in kJ, ΔS in J/K. */
export interface Preset { id: string; dH: number; dS: number }
const rx = (id: string) => REACTIONS.find((r) => r.id === id)!;
/** Ice: ΔH_fus = 6.01 kJ/mol at 273.15 K (not on the slides); ΔS_fus = ΔH_fus/T_m. */
export const ICE = { dHfus: 6.01, Tm: 273.15, dSfus: (6.01 * 1000) / 273.15 };
export const PRESETS: Preset[] = [
  { id: 'o3-decay', dH: -2 * THERMO['O3(g)'].H, dS: 3 * THERMO['O2(g)'].S - 2 * THERMO['O3(g)'].S },
  { id: 'o3-form', dH: 2 * THERMO['O3(g)'].H, dS: -(3 * THERMO['O2(g)'].S - 2 * THERMO['O3(g)'].S) },
  { id: 'freeze', dH: -ICE.dHfus, dS: -ICE.dSfus },
  { id: 'melt', dH: ICE.dHfus, dS: ICE.dSfus },
  { id: 'nh3', dH: deltaRxn('H', rx('nh3')), dS: deltaRxn('S', rx('nh3')) },
  { id: 'pbs', dH: -844, dS: -165 },
];
