/**
 * The activity series of metals (Brown, Table 4.5; lecture 3 slides 27–28 and exercise class 3, p. 9) and the redox reactions it predicts:
 * a metal is oxidised by the cations below it in the series; a metal above hydrogen reacts with acids to form H₂.
 */
import { balance } from './balance';

export interface Metal {
  symbol: string;
  de: string;
  en: string;
  /** charge of the cation formed (the number of electrons lost per atom) */
  z: number;
  /** liquid at room temperature (only mercury) */
  liquid?: boolean;
}

/** From the easiest to oxidise (lithium) to the hardest (gold). Hydrogen is part of the table and sits between lead and copper. */
export const SERIES: Metal[] = [
  { symbol: 'Li', de: 'Lithium', en: 'Lithium', z: 1 }, { symbol: 'K', de: 'Kalium', en: 'Potassium', z: 1 },
  { symbol: 'Ba', de: 'Barium', en: 'Barium', z: 2 }, { symbol: 'Ca', de: 'Calcium', en: 'Calcium', z: 2 },
  { symbol: 'Na', de: 'Natrium', en: 'Sodium', z: 1 }, { symbol: 'Mg', de: 'Magnesium', en: 'Magnesium', z: 2 },
  { symbol: 'Al', de: 'Aluminium', en: 'Aluminum', z: 3 }, { symbol: 'Mn', de: 'Mangan', en: 'Manganese', z: 2 },
  { symbol: 'Zn', de: 'Zink', en: 'Zinc', z: 2 }, { symbol: 'Cr', de: 'Chrom', en: 'Chromium', z: 3 },
  { symbol: 'Fe', de: 'Eisen', en: 'Iron', z: 2 }, { symbol: 'Co', de: 'Cobalt', en: 'Cobalt', z: 2 },
  { symbol: 'Ni', de: 'Nickel', en: 'Nickel', z: 2 }, { symbol: 'Sn', de: 'Zinn', en: 'Tin', z: 2 },
  { symbol: 'Pb', de: 'Blei', en: 'Lead', z: 2 },
  { symbol: 'H', de: 'Wasserstoff', en: 'Hydrogen', z: 1 },
  { symbol: 'Cu', de: 'Kupfer', en: 'Copper', z: 2 }, { symbol: 'Ag', de: 'Silber', en: 'Silver', z: 1 },
  { symbol: 'Hg', de: 'Quecksilber', en: 'Mercury', z: 2, liquid: true }, { symbol: 'Pt', de: 'Platin', en: 'Platinum', z: 2 },
  { symbol: 'Au', de: 'Gold', en: 'Gold', z: 3 },
];

export const rank = (symbol: string): number => {
  const i = SERIES.findIndex((m) => m.symbol === symbol);
  if (i < 0) throw new Error(`not in the activity series: ${symbol}`);
  return i;
};
export const metal = (symbol: string): Metal => SERIES[rank(symbol)];

/** Does solid metal `m` reduce the cation of metal `c` (m above c in the series)? */
export const reducesCation = (m: string, c: string): boolean => rank(m) < rank(c);
/** Does metal `m` react with an acid (m above hydrogen)? */
export const reactsWithAcid = (m: string): boolean => rank(m) < rank('H');

const ion = (m: Metal) => `${m.symbol}^${m.z === 1 ? '' : m.z}+`;
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

export interface RedoxEq {
  /** the reaction in the notation of `chem/tex.ts`, e.g. `Cu(s) + 2 Ag^+(aq) -> Cu^2+(aq) + 2 Ag(s)` */
  eq: string;
  /** electrons transferred in the reaction as written */
  electrons: number;
  /** coefficient of the metal that is oxidised and of the cation that is reduced */
  coefOx: number;
  coefRed: number;
}

/** Metal `m` in a solution of the cation of metal `c`: Cu + 2 Ag⁺ → Cu²⁺ + 2 Ag. Null if there is no reaction (NR). */
export function displacement(m: string, c: string): RedoxEq | null {
  if (!reducesCation(m, c)) return null;
  const A = metal(m), B = metal(c);
  const l = (A.z * B.z) / gcd(A.z, B.z); // electrons exchanged
  const nA = l / A.z, nB = l / B.z;
  const st = (x: Metal) => (x.liquid ? 'l' : 's');
  return {
    eq: `${k(nA)}${A.symbol}(${st(A)}) + ${k(nB)}${ion(B)}(aq) -> ${k(nA)}${ion(A)}(aq) + ${k(nB)}${B.symbol}(${st(B)})`,
    electrons: l, coefOx: nA, coefRed: nB,
  };
}

const k = (n: number) => (n === 1 ? '' : `${n} `);

/** Metal `m` with an acid, net ionic: M + z H⁺ → M^z⁺ + (z/2) H₂, doubled for odd z. Null if m is not above hydrogen. */
export function acidNet(m: string): RedoxEq | null {
  if (!reactsWithAcid(m)) return null;
  const A = metal(m);
  const d = A.z % 2 === 0 ? 1 : 2; // scale to whole coefficients
  return { eq: `${k(d)}${A.symbol}(s) + ${k(d * A.z)}H^+(aq) -> ${k(d)}${ion(A)}(aq) + ${k((d * A.z) / 2)}H2(g)`, electrons: d * A.z, coefOx: d, coefRed: d * A.z };
}

/** Metal `m` in hydrochloric acid with whole formulas: M + n HCl → MCl_n + n/2 H₂ (whole coefficients from `balance`). */
export function acidMolecular(m: string): string | null {
  if (!reactsWithAcid(m)) return null;
  const A = metal(m);
  const salt = A.z === 1 ? `${A.symbol}Cl` : `${A.symbol}Cl${A.z}`;
  const co = balance([A.symbol, 'HCl'], [salt, 'H2'])!;
  return `${k(co[0])}${A.symbol}(s) + ${k(co[1])}HCl(aq) -> ${k(co[2])}${salt}(aq) + ${k(co[3])}H2(g)`;
}
