/**
 * Gas laws of lecture 2 (slides 8–23) and the TA's exercise class 2: the ideal gas law and its problem types,
 * pressure units, barometer and manometer, density and molar mass, Dalton's law, mole fractions.
 * Numbers use the lecture's rounded constants where the slides quote them (R = 8.314 / 0.08206 / 62.36).
 * Units are named in each function: the explorers work in L, atm, K, mol; the SI versions say `Si`.
 */
import { ATM_PA } from './constants';

/** Gas constant as printed on slide 18 (three unit systems) — `latm` is what the explorers use. */
export const R_SLIDE = { si: 8.314, latm: 0.08206, ltorr: 62.36 } as const;
/** Standard temperature (0 °C) and pressure (1 atm = 101.325 kPa), slide 17. */
export const STP = { T: 273.15, P_atm: 1, P_kPa: 101.325 } as const;
/** Molar volume at STP in litres, slide 17 («as engineer, you should know this number»). */
export const MOLAR_VOLUME_STP = 22.41;
/** Offset between the Celsius and the Kelvin scale (slide 15: −273.15 °C = 0 K). */
export const ZERO_C = 273.15;
/** Earth's gravity as the TA uses it (exercise 2, p. 6); slide 11 rounds it to 9.8. */
export const G_EARTH = 9.81;
/** Density of mercury in kg/m³ (slide 12 quotes 13.5 g/cm³; 13.595 is the value at 0 °C). */
export const RHO_HG = 13_500;
export const RHO_HG_EXACT = 13_595;
export const RHO_WATER = 1000;

export const cToK = (c: number) => c + ZERO_C;
export const kToC = (k: number) => k - ZERO_C;

// ---- pressure units (slide 12: 760 torr = 1 atm = 101.325 kPa = 1.01325 bar) ----
export type PUnit = 'Pa' | 'kPa' | 'bar' | 'atm' | 'torr' | 'mmHg';
export const P_IN_PA: Record<PUnit, number> = { Pa: 1, kPa: 1e3, bar: 1e5, atm: ATM_PA, torr: ATM_PA / 760, mmHg: ATM_PA / 760 };
export const toPa = (x: number, u: PUnit) => x * P_IN_PA[u];
export const convertP = (x: number, from: PUnit, to: PUnit) => (x * P_IN_PA[from]) / P_IN_PA[to];

// ---- the ideal gas law PV = nRT (slide 18); `R` must match the units (default L·atm) ----
export const idealP = (n: number, T: number, V: number, R: number = R_SLIDE.latm) => (n * R * T) / V;
export const idealV = (n: number, T: number, P: number, R: number = R_SLIDE.latm) => (n * R * T) / P;
export const idealN = (P: number, V: number, T: number, R: number = R_SLIDE.latm) => (P * V) / (R * T);
export const idealT = (P: number, V: number, n: number, R: number = R_SLIDE.latm) => (P * V) / (n * R);

export interface GasState { P: number; V: number; T: number; n: number }
export type GasVar = keyof GasState;

/**
 * Types 2 and 3 of slide 19–20: PV/(nT) = R stays the same, so from a complete state `i` and a partly known state `f`
 * the one missing variable of `f` follows. Temperatures in K. Exactly one of f's four entries must be missing.
 */
export function solveFinal(i: GasState, f: Partial<GasState>): { variable: GasVar; value: number } {
  const missing = (['P', 'V', 'T', 'n'] as GasVar[]).filter((k) => f[k] === undefined);
  if (missing.length !== 1) throw new Error('exactly one variable of the final state must be unknown');
  const R = (i.P * i.V) / (i.n * i.T); // «R» in the units of the given numbers
  const v = missing[0];
  const { P, V, T, n } = f;
  const value = v === 'P' ? (R * n! * T!) / V! : v === 'V' ? (R * n! * T!) / P! : v === 'T' ? (P! * V!) / (R * n!) : (P! * V!) / (R * T!);
  return { variable: v, value };
}

/** Which variable is held fixed in each historic law (the other two change together). */
export const LAWS = {
  boyle: { fixed: ['n', 'T'], vary: ['P', 'V'] },
  charles: { fixed: ['n', 'P'], vary: ['V', 'T'] },
  avogadro: { fixed: ['P', 'T'], vary: ['V', 'n'] },
  gayLussac: { fixed: ['n', 'V'], vary: ['P', 'T'] },
} as const;

// ---- density and molar mass (slide 21) ----
/** ρ = P·M_w/(R·T) in g/L for P in atm, T in K, M_w in g/mol (slide 21: ρ = (P/RT)·M_w). */
export const gasDensity = (P: number, Mw: number, T: number, R: number = R_SLIDE.latm) => (P * Mw) / (R * T);
/** M_w = ρRT/P in g/mol. */
export const molarMassFromDensity = (rho: number, T: number, P: number, R: number = R_SLIDE.latm) => (rho * R * T) / P;

// ---- mixtures (slides 22–23) ----
export const totalMoles = (ns: readonly number[]) => ns.reduce((a, b) => a + b, 0);
/** X_i = n_i/n_tot */
export const moleFractions = (ns: readonly number[]) => { const t = totalMoles(ns); return ns.map((n) => (t > 0 ? n / t : 0)); };
/** P_i = n_i RT/V (Dalton, each gas behaves as if it were alone). */
export const partialPressures = (ns: readonly number[], T: number, V: number, R: number = R_SLIDE.latm) => ns.map((n) => idealP(n, T, V, R));
/** P_i = X_i · P_tot */
export const partialFromTotal = (ns: readonly number[], Ptot: number) => moleFractions(ns).map((x) => x * Ptot);

// ---- barometer and manometer (slides 11–13) ----
/** Hydrostatic pressure ρ·g·h in Pa (ρ in kg/m³, g in m/s², h in m). */
export const hydrostatic = (rho: number, h: number, g: number = G_EARTH) => rho * g * h;
/** Height of the liquid column that a pressure P (Pa) holds up in a barometer, in m. */
export const columnHeight = (P: number, rho: number, g: number = G_EARTH) => P / (rho * g);
/** Manometer: P_gas = P_atm + ρ g h, h > 0 when the open side stands higher. All in Pa, kg/m³, m. */
export const manometerP = (Patm: number, rho: number, h: number, g: number = G_EARTH) => Patm + rho * g * h;
/** Weight of an air column of mass m on an area A: pressure = m g / A (slide 11). */
export const columnPressure = (m: number, A: number, g: number = G_EARTH) => (m * g) / A;

// ---- significant figures (exercise 2, p. 1–3) ----
/** Round x to `n` significant figures. */
export function roundSig(x: number, n: number): number {
  if (x === 0 || !Number.isFinite(x)) return x;
  const d = Math.ceil(Math.log10(Math.abs(x)));
  const k = n - d;
  const r = (v: number) => Math.sign(v) * Math.round(Math.abs(v) + 1e-9); // half rounds up, as the TA says
  return k >= 0 ? r(x * 10 ** k) / 10 ** k : r(x / 10 ** -k) * 10 ** -k;
}

/**
 * The TA's rules for «how many digits count»: marks every character of a number as significant or not.
 *   non-zero digits count; zeros between them count; leading zeros do not;
 *   trailing zeros count only if the number has a decimal comma/point («7,0» → 2, «700» → 1, «0,070» → 2).
 * Accepts «,» or «.» and an exponent («1,00e8», «1,00·10^8»), which does not change the count.
 */
export function sigDigits(raw: string): { chars: { ch: string; sig: boolean }[]; count: number } {
  const s = raw.trim();
  const m = s.match(/^([+\-−]?)([0-9]*[.,]?[0-9]*)(.*)$/u)!;
  const sign = m[1], mant = m[2], rest = m[3];
  const hasPoint = /[.,]/.test(mant);
  const digitsIdx: number[] = [];
  [...mant].forEach((c, i) => { if (/[0-9]/.test(c)) digitsIdx.push(i); });
  const first = digitsIdx.find((i) => mant[i] !== '0');
  let last = -1;
  digitsIdx.forEach((i) => { if (mant[i] !== '0') last = i; });
  const sig = new Set<number>();
  if (first !== undefined) {
    for (const i of digitsIdx) {
      if (i < first) continue;
      if (hasPoint || i <= last) sig.add(i);
    }
  }
  const chars = [...sign].map((ch) => ({ ch, sig: false }))
    .concat([...mant].map((ch, i) => ({ ch, sig: sig.has(i) })))
    .concat([...rest].map((ch) => ({ ch, sig: false })));
  return { chars, count: sig.size };
}

/** Number of decimal places written in a number string («104,842» → 3, «83,1» → 1, «14» → 0). */
export function decimalPlaces(raw: string): number {
  const m = raw.trim().match(/[.,]([0-9]*)/);
  return m ? m[1].length : 0;
}

/** Sum or difference rule (exercise 2, p. 2): the result has as many decimal places as the least certain value. */
export function roundToDecimals(x: number, d: number): number {
  const f = 10 ** d;
  return (Math.sign(x) * Math.round(Math.abs(x) * f + 1e-9)) / f;
}
