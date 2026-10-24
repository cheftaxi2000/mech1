/**
 * Common cations and anions (lecture 1, slides 23–24) and the formula of the neutral ionic compound (slide 22: Mg²⁺ and N³⁻ give Mg₃N₂).
 * An ion is written in the notation of `chem/tex.ts`: `Ca^2+`, `NO3^-`, `Hg2^2+`.
 */
import { parseFormula } from './formula';

export interface Ion {
  /** formula without charge: `Ca`, `NO3`, `Hg2` */
  f: string;
  /** charge in units of e, e.g. +2 or −3 */
  z: number;
  de: string;
  en: string;
  /** printed in bold on the slide: the ions the course uses most */
  bold?: boolean;
}

/** Notation for `chemTex`: `ionStr({f:'Ca', z:2})` = `Ca^2+`. */
export const ionStr = (i: Pick<Ion, 'f' | 'z'>): string => `${i.f}^${Math.abs(i.z) === 1 ? '' : Math.abs(i.z)}${i.z > 0 ? '+' : '-'}`;

const cat = (f: string, z: number, de: string, en: string, bold = false): Ion => ({ f, z, de, en, bold });

export const CATIONS: Ion[] = [
  cat('H', 1, 'Wasserstoff-Ion', 'hydrogen ion', true), cat('Li', 1, 'Lithium-Ion', 'lithium ion'), cat('Na', 1, 'Natrium-Ion', 'sodium ion', true),
  cat('K', 1, 'Kalium-Ion', 'potassium ion', true), cat('Cs', 1, 'Caesium-Ion', 'cesium ion'), cat('Ag', 1, 'Silber-Ion', 'silver ion', true),
  cat('NH4', 1, 'Ammonium-Ion', 'ammonium ion', true), cat('Cu', 1, 'Kupfer(I)-Ion', 'copper(I) ion'),
  cat('Mg', 2, 'Magnesium-Ion', 'magnesium ion', true), cat('Ca', 2, 'Calcium-Ion', 'calcium ion', true), cat('Sr', 2, 'Strontium-Ion', 'strontium ion'),
  cat('Ba', 2, 'Barium-Ion', 'barium ion'), cat('Zn', 2, 'Zink-Ion', 'zinc ion', true), cat('Cd', 2, 'Cadmium-Ion', 'cadmium ion'),
  cat('Co', 2, 'Cobalt(II)-Ion', 'cobalt(II) ion'), cat('Cu', 2, 'Kupfer(II)-Ion', 'copper(II) ion', true), cat('Fe', 2, 'Eisen(II)-Ion', 'iron(II) ion', true),
  cat('Mn', 2, 'Mangan(II)-Ion', 'manganese(II) ion'), cat('Hg2', 2, 'Quecksilber(I)-Ion', 'mercury(I) ion'), cat('Hg', 2, 'Quecksilber(II)-Ion', 'mercury(II) ion'),
  cat('Ni', 2, 'Nickel(II)-Ion', 'nickel(II) ion'), cat('Pb', 2, 'Blei(II)-Ion', 'lead(II) ion', true), cat('Sn', 2, 'Zinn(II)-Ion', 'tin(II) ion'),
  cat('Al', 3, 'Aluminium-Ion', 'aluminium ion', true), cat('Cr', 3, 'Chrom(III)-Ion', 'chromium(III) ion'), cat('Fe', 3, 'Eisen(III)-Ion', 'iron(III) ion', true),
];

export const ANIONS: Ion[] = [
  cat('H', -1, 'Hydrid', 'hydride'), cat('F', -1, 'Fluorid', 'fluoride', true), cat('Cl', -1, 'Chlorid', 'chloride', true), cat('Br', -1, 'Bromid', 'bromide', true),
  cat('I', -1, 'Iodid', 'iodide', true), cat('CN', -1, 'Cyanid', 'cyanide'), cat('OH', -1, 'Hydroxid', 'hydroxide', true),
  cat('CH3COO', -1, 'Acetat', 'acetate', true), cat('ClO3', -1, 'Chlorat', 'chlorate'), cat('ClO4', -1, 'Perchlorat', 'perchlorate', true),
  cat('NO3', -1, 'Nitrat', 'nitrate', true), cat('MnO4', -1, 'Permanganat', 'permanganate'),
  cat('O', -2, 'Oxid', 'oxide', true), cat('O2', -2, 'Peroxid', 'peroxide'), cat('S', -2, 'Sulfid', 'sulfide', true),
  cat('CO3', -2, 'Carbonat', 'carbonate', true), cat('CrO4', -2, 'Chromat', 'chromate'), cat('Cr2O7', -2, 'Dichromat', 'dichromate'), cat('SO4', -2, 'Sulfat', 'sulfate', true),
  cat('N', -3, 'Nitrid', 'nitride'), cat('PO4', -3, 'Phosphat', 'phosphate', true),
];

export const findIon = (list: Ion[], f: string, z: number): Ion => {
  const i = list.find((x) => x.f === f && x.z === z);
  if (!i) throw new Error(`unknown ion ${f} ${z}`);
  return i;
};
export const cation = (f: string, z: number) => findIon(CATIONS, f, z);
export const anion = (f: string, z: number) => findIon(ANIONS, f, z);

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** An ion with more than one atom (needs brackets when it occurs more than once). */
export const isPolyatomic = (i: Pick<Ion, 'f'>): boolean => Object.values(parseFormula(i.f)).reduce((a, b) => a + b, 0) > 1;

/** Formula part of an ion occurring n times: `n = 1` plain, n > 1 with brackets for polyatomic ions. */
const times = (i: Ion, n: number): string => (n === 1 ? i.f : isPolyatomic(i) ? `(${i.f})${n}` : `${i.f}${n}`);

/**
 * Neutral ionic compound of a cation and an anion: the smallest numbers (n_c, n_a) with n_c·z_c + n_a·z_a = 0
 * (slide 22: the charge number of one ion becomes the subscript of the other).
 */
export function ionicFormula(c: Ion, a: Ion): { formula: string; nCation: number; nAnion: number } {
  if (c.z <= 0 || a.z >= 0) throw new Error('a cation and an anion are needed');
  const g = gcd(c.z, -a.z);
  const nCation = -a.z / g, nAnion = c.z / g;
  return { formula: times(c, nCation) + times(a, nAnion), nCation, nAnion };
}
