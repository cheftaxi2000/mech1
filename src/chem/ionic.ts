/**
 * Molecular, complete ionic and net ionic equations (lecture 3, slides 14–15 and 20).
 * A reaction is a list of reactants and products with coefficients; an ionic compound that is dissolved (aq) is written as its ions
 * in the complete ionic equation, a solid / liquid / gas stays whole. Spectator ions are the ions that occur on both sides; cancelling
 * them gives the net ionic equation. Strings are in the notation of `chem/tex.ts` (`Ag^+(aq)`, `AgCl(s)`, `2 NO3^-(aq)`).
 */
import { ionStr, type Ion } from './ions';

export type State = 's' | 'l' | 'g' | 'aq';

export interface Species {
  /** formula, e.g. `AgCl` or `Ca(OH)2` */
  f: string;
  state: State;
  /** for an ionic compound: its ions with the number of each in the formula unit */
  ions?: [Ion, number][];
}
export interface Term { coef: number; sp: Species }
export interface Reaction { reactants: Term[]; products: Term[] }

const sideStr = (ts: { coef: number; s: string }[]) => ts.map((t) => (t.coef === 1 ? '' : `${t.coef} `) + t.s).join(' + ');
const spStr = (sp: Species) => `${sp.f}(${sp.state})`;

/** Molecular equation: every compound as a whole formula. */
export function molecular(r: Reaction): string {
  const side = (ts: Term[]) => sideStr(ts.map((t) => ({ coef: t.coef, s: spStr(t.sp) })));
  return `${side(r.reactants)} -> ${side(r.products)}`;
}

interface IonTerm { coef: number; s: string; key: string; whole: boolean }

/** Terms of a side in the complete ionic equation: dissolved ionic compounds split into their ions. */
function ionTerms(ts: Term[]): IonTerm[] {
  // eslint-disable-next-line
  return ts.flatMap((t): IonTerm[] => {
    if (t.sp.state === 'aq' && t.sp.ions) return t.sp.ions.map(([ion, n]) => ({ coef: t.coef * n, s: `${ionStr(ion)}(aq)`, key: `${ionStr(ion)}(aq)`, whole: false }));
    return [{ coef: t.coef, s: spStr(t.sp), key: spStr(t.sp), whole: true }];
  });
}
/** Merge equal ions (e.g. 2 OH⁻ from two sources) in order of first appearance. */
function merge(ts: IonTerm[]): IonTerm[] {
  const out: IonTerm[] = [];
  for (const t of ts) {
    const same = out.find((o) => o.key === t.key && !o.whole);
    if (same) same.coef += t.coef; else out.push({ ...t });
  }
  return out;
}

export function completeIonic(r: Reaction): string {
  const side = (ts: Term[]) => sideStr(merge(ionTerms(ts)));
  return `${side(r.reactants)} -> ${side(r.products)}`;
}

/** The ions that are present on both sides (with the number that cancels). */
export function spectators(r: Reaction): { key: string; n: number }[] {
  const L = merge(ionTerms(r.reactants)).filter((t) => !t.whole), R = merge(ionTerms(r.products)).filter((t) => !t.whole);
  return L.flatMap((l) => { const m = R.find((x) => x.key === l.key); return m ? [{ key: l.key, n: Math.min(l.coef, m.coef) }] : []; });
}

/** Net ionic equation: spectator ions cancelled from both sides. */
export function netIonic(r: Reaction): string {
  const L = merge(ionTerms(r.reactants)), R = merge(ionTerms(r.products));
  const take = (a: IonTerm[], b: IonTerm[]) => a.map((t) => {
    if (t.whole) return t;
    const m = b.find((x) => x.key === t.key && !x.whole);
    return m ? { ...t, coef: t.coef - Math.min(t.coef, m.coef) } : t;
  }).filter((t) => t.coef > 0);
  const l = take(L, R), rr = take(R, L);
  const str = (ts: IonTerm[]) => sideStr(ts.map((t) => ({ coef: t.coef, s: t.s })));
  return `${str(l)} -> ${str(rr)}`;
}

/** Dissolved ionic compound from its ions (formula and counts given by `ionicFormula`). */
export const ionicSpecies = (formula: string, c: Ion, nc: number, a: Ion, na: number, state: State): Species => ({ f: formula, state, ions: [[c, nc], [a, na]] });
