/**
 * Oxidation numbers by the rules of lecture 3, slide 26:
 *   elemental form 0 · monatomic ion = its charge · O −2 (peroxide −1) · H +1 (−1 when bonded to a metal) · F −1 · Cl, Br, I −1 (not when bonded to O)
 *   · the sum over all atoms equals the net charge.
 * Extension (not on the slide, taken from the ion table of lecture 1): alkali metals +1, alkaline earth metals +2, Al +3, Zn +2, Ag +1.
 * Exactly one unknown element is solved with the sum rule; a bracketed group such as (NO3)2 is first treated as a known anion.
 */
import { q, div, sub, num, type Q, ZERO, add, mul } from '../linalg/frac';
import { parseFormula } from './formula';
import { cellBySymbol } from './periodic';
import { ANIONS } from './ions';

export type Rule = 'elemental' | 'monatomic' | 'F' | 'O' | 'peroxide' | 'H' | 'hydride' | 'halogen' | 'group1' | 'group2' | 'metal3' | 'sum';

export interface OxEntry {
  /** exact value (a fraction for averages such as Fe in Fe3O4) */
  value: Q;
  rule: Rule;
  count: number;
}
export type OxResult = Record<string, OxEntry>;

const PEROXIDES = new Set(['H2O2', 'Na2O2', 'K2O2', 'Li2O2', 'BaO2', 'CaO2', 'SrO2', 'O2^2-']);
const FIXED: Record<string, [number, Rule]> = {
  Li: [1, 'group1'], Na: [1, 'group1'], K: [1, 'group1'], Rb: [1, 'group1'], Cs: [1, 'group1'], Ag: [1, 'group1'],
  Be: [2, 'group2'], Mg: [2, 'group2'], Ca: [2, 'group2'], Sr: [2, 'group2'], Ba: [2, 'group2'], Zn: [2, 'group2'], Cd: [2, 'group2'],
  Al: [3, 'metal3'],
};

/**
 * Oxidation numbers of every element in `formula` (digits are subscripts, brackets allowed) with total charge `charge`.
 * Returns null if more than one element is left unknown.
 */
export function oxidationNumbers(formula: string, charge = 0): OxResult | null {
  const counts = parseFormula(formula);
  const els = Object.keys(counts);
  const out: OxResult = {};
  const total = (e: string) => counts[e];

  if (els.length === 1) {
    const e = els[0], n = total(e);
    if (charge === 0) { out[e] = { value: ZERO, rule: 'elemental', count: n }; return out; }
    if (PEROXIDES.has(`${formula}^2-`) && charge === -2) { out[e] = { value: q(-1), rule: 'peroxide', count: n }; return out; }
    out[e] = { value: q(charge, n), rule: n === 1 ? 'monatomic' : 'sum', count: n };
    return out;
  }

  // H is −1 only when it is bonded to a metal and to no other nonmetal (NaH, CaH₂; but not NaOH or Ca(OH)₂, where H sits on O)
  const hydride = els.some((e) => cellBySymbol(e).cls === 'metal') && els.every((e) => e === 'H' || cellBySymbol(e).cls === 'metal');
  const peroxide = PEROXIDES.has(formula);
  const hasO = els.includes('O');
  for (const e of els) {
    if (e === 'F') out[e] = { value: q(-1), rule: 'F', count: total(e) };
    else if (e === 'O') out[e] = { value: q(peroxide ? -1 : -2), rule: peroxide ? 'peroxide' : 'O', count: total(e) };
    else if (e === 'H') out[e] = { value: q(hydride ? -1 : 1), rule: hydride ? 'hydride' : 'H', count: total(e) };
    else if ((e === 'Cl' || e === 'Br' || e === 'I') && !hasO) out[e] = { value: q(-1), rule: 'halogen', count: total(e) };
    else if (FIXED[e]) out[e] = { value: q(FIXED[e][0]), rule: FIXED[e][1], count: total(e) };
  }
  const unknown = els.filter((e) => !out[e]);
  if (unknown.length === 0) return out;
  if (unknown.length === 1) {
    const e = unknown[0];
    const known = els.filter((x) => out[x]).reduce((s, x) => add(s, mul(out[x].value, q(out[x].count))), ZERO);
    out[e] = { value: div(sub(q(charge), known), q(total(e))), rule: 'sum', count: total(e) };
    return out;
  }
  // two or more unknowns: a bracketed known anion, e.g. Fe(NO3)2 → Fe + 2 NO3⁻
  for (const a of ANIONS) {
    const m = formula.match(new RegExp(`\\(${a.f}\\)(\\d*)`));
    if (!m || a.f.length < 2) continue;
    const k = m[1] ? Number(m[1]) : 1;
    const rest = formula.replace(m[0], '');
    const inner = oxidationNumbers(a.f, a.z);
    const outer = rest ? oxidationNumbers(rest, charge - k * a.z) : null;
    if (inner && outer) return { ...outer, ...Object.fromEntries(Object.entries(inner).map(([e, v]) => [e, { ...v, count: v.count * k }])) };
  }
  return null;
}

/** Oxidation number as a number (fractions allowed). */
export const oxValue = (e: OxEntry): number => num(e.value);
