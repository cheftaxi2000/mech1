/**
 * The solubility chart of lecture 3, slide 16 (Brown, Table 4.1): which ionic compounds dissolve in water.
 * Only the anions of the chart are covered; for every other combination the answer is `null` («not on the chart»).
 */
import type { Ion } from './ions';

export interface Verdict {
  /** true = dissolves, false = insoluble (precipitate), null = the chart says nothing */
  soluble: boolean | null;
  /** the chart row used (the anion) */
  row: string | null;
  /** true if the cation is one of the row's «important exceptions» */
  exception: boolean;
}

const ALKALI = new Set(['Li', 'Na', 'K', 'Rb', 'Cs']);
const isAlkali = (c: Ion) => c.z === 1 && ALKALI.has(c.f);
const isNH4 = (c: Ion) => c.f === 'NH4';

interface Row { soluble: boolean; exceptions: (c: Ion) => boolean }
const is = (f: string, z: number) => (c: Ion) => c.f === f && c.z === z;
const anyOf = (...p: ((c: Ion) => boolean)[]) => (c: Ion) => p.some((q) => q(c));

/** Chart rows by anion formula. Soluble rows list the cations that are the exceptions (insoluble), insoluble rows the cations that dissolve. */
const ROWS: Record<string, Row> = {
  NO3: { soluble: true, exceptions: () => false },
  CH3COO: { soluble: true, exceptions: () => false },
  Cl: { soluble: true, exceptions: anyOf(is('Ag', 1), is('Hg2', 2), is('Pb', 2)) },
  Br: { soluble: true, exceptions: anyOf(is('Ag', 1), is('Hg2', 2), is('Pb', 2)) },
  I: { soluble: true, exceptions: anyOf(is('Ag', 1), is('Hg2', 2), is('Pb', 2)) },
  SO4: { soluble: true, exceptions: anyOf(is('Sr', 2), is('Ba', 2), is('Hg2', 2), is('Pb', 2)) },
  S: { soluble: false, exceptions: anyOf(isNH4, isAlkali, is('Ca', 2), is('Sr', 2), is('Ba', 2)) },
  CO3: { soluble: false, exceptions: anyOf(isNH4, isAlkali) },
  PO4: { soluble: false, exceptions: anyOf(isNH4, isAlkali) },
  OH: { soluble: false, exceptions: anyOf(isNH4, isAlkali, is('Ca', 2), is('Sr', 2), is('Ba', 2)) },
};

/** The anions of the chart, soluble rows first (as on the slide). */
export const CHART_ANIONS = ['NO3', 'CH3COO', 'Cl', 'Br', 'I', 'SO4', 'S', 'CO3', 'PO4', 'OH'];

/** Does the compound of cation `c` and anion `a` dissolve in water (according to the slide-16 chart)? */
export function solubility(c: Ion, a: Ion): Verdict {
  const row = ROWS[a.f];
  if (!row || a.z > -1) return { soluble: null, row: null, exception: false };
  const exception = row.exceptions(c);
  return { soluble: exception ? !row.soluble : row.soluble, row: a.f, exception };
}
