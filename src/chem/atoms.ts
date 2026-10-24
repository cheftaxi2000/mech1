/**
 * Atoms, isotopes and ions (lecture 1, slides 12–21): particle counts of a nuclide ^A_Z X^q, the atomic weight as an
 * abundance-weighted mean of isotope masses, and the sizes used for the figures.
 */
import { bySymbol } from './elements';

/** Masses in u from slide 17 (the slide's rounded values). */
export const M_P_U = 1.0073, M_N_U = 1.0087, M_E_U = 5.486e-4;

export interface Counts { protons: number; neutrons: number; electrons: number; charge: number; massNumber: number }

/** Particles of the nuclide with Z protons, mass number A and charge q (in units of e; q > 0 means electrons removed). */
export function counts(Z: number, A: number, q = 0): Counts {
  if (A < Z) throw new Error('mass number cannot be smaller than the atomic number');
  const electrons = Z - q;
  if (electrons < 0) throw new Error('more electrons removed than the atom has');
  return { protons: Z, neutrons: A - Z, electrons, charge: q, massNumber: A };
}

/** «cation», «anion» or «neutral» from the charge. */
export const ionKind = (q: number): 'cation' | 'anion' | 'neutral' => (q > 0 ? 'cation' : q < 0 ? 'anion' : 'neutral');

export interface Isotope { A: number; /** atomic mass in u */ mass: number; /** natural abundance as a fraction */ abundance: number }

/** Natural isotope mixtures of some elements (masses and abundances as in standard tables; carbon as on slide 17). */
export const ISOTOPES: Record<string, Isotope[]> = {
  B: [{ A: 10, mass: 10.012937, abundance: 0.199 }, { A: 11, mass: 11.009305, abundance: 0.801 }],
  C: [{ A: 12, mass: 12, abundance: 0.9893 }, { A: 13, mass: 13.0035, abundance: 0.0107 }],
  Cl: [{ A: 35, mass: 34.968853, abundance: 0.7576 }, { A: 37, mass: 36.965903, abundance: 0.2424 }],
  Cu: [{ A: 63, mass: 62.929598, abundance: 0.6915 }, { A: 65, mass: 64.927790, abundance: 0.3085 }],
  Br: [{ A: 79, mass: 78.918338, abundance: 0.5069 }, { A: 81, mass: 80.916291, abundance: 0.4931 }],
  Ag: [{ A: 107, mass: 106.905093, abundance: 0.51839 }, { A: 109, mass: 108.904756, abundance: 0.48161 }],
};

/** Weighted mean of the isotope masses: the atomic weight (slide 17). Abundances are normalised if they do not add up to 1. */
export function atomicWeight(iso: Isotope[], abundances: number[] = iso.map((i) => i.abundance)): number {
  const total = abundances.reduce((a, b) => a + b, 0);
  return iso.reduce((s, i, k) => s + (abundances[k] / total) * i.mass, 0);
}

/** Atomic weight of the natural mixture, from `ISOTOPES`. */
export const naturalWeight = (symbol: string): number => atomicWeight(ISOTOPES[symbol]);

/** Mass number of the most common isotope when known, else the rounded atomic weight. */
export function commonMassNumber(symbol: string): number {
  const iso = ISOTOPES[symbol];
  if (iso) return iso.reduce((a, b) => (b.abundance > a.abundance ? b : a)).A;
  return Math.round(bySymbol(symbol).mass);
}

/** Distances for the zoom figure (slide 14), in metres. */
export const NUCLEUS_M = 1e-14; // ~10^-4 Å
export const CLOUD_M = [1e-10, 5e-10] as const; // 1–5 Å
