/**
 * Enthalpy diagrams (slides 25 and 28, exercise 4): the levels of a Hess route.
 * - `waterRoute`: the two-step route of slides 23–25 through water vapour.
 * - `formationHessRoute`: the route through the elements of slides 27–28 for ANY reaction with tabulated ΔH°_f:
 *   first every compound among the reactants is decomposed into its elements, then every compound among the products is formed.
 * Every level is a mixture of intact compounds and elements; its label is built by atom bookkeeping.
 */
import { chemTex } from './tex';
import { parseFormula } from './formula';
import { HF, SLIDE23, dHrxn, hf, hessLevels, parseReaction, type Reaction, type Term } from './thermo';

export interface HessLevel { tex: string; H: number }
export interface HessStep { kind: 'unform' | 'form' | 'step'; species?: string; n?: number; dH: number; /** name of the arrow in the diagram (default ΔH_i) */ tex?: string }
export interface HessRoute { levels: HessLevel[]; steps: HessStep[]; total: number; reactantsTex: string; productsTex: string; /** name of the direct arrow (default ΔH_rxn) */ netTex?: string }

const ELEMENT_FORM: Record<string, { name: string; atoms: number }> = {
  H: { name: 'H2(g)', atoms: 2 }, O: { name: 'O2(g)', atoms: 2 }, N: { name: 'N2(g)', atoms: 2 }, F: { name: 'F2(g)', atoms: 2 }, Cl: { name: 'Cl2(g)', atoms: 2 },
  C: { name: 'C(graphite)', atoms: 1 }, Fe: { name: 'Fe(s)', atoms: 1 }, Ca: { name: 'Ca(s)', atoms: 1 }, Na: { name: 'Na(s)', atoms: 1 }, Ag: { name: 'Ag(s)', atoms: 1 },
};
const ORDER = ['C', 'H', 'N', 'O', 'F', 'Cl', 'Na', 'Ca', 'Fe', 'Ag'];

/** `1.5 → "3/2"`, `2 → "2"`, `1 → ""`. */
export function coef(n: number): string {
  if (Math.abs(n - 1) < 1e-9) return '';
  if (Math.abs(n - Math.round(n)) < 1e-9) return String(Math.round(n));
  for (const d of [2, 3, 4]) if (Math.abs(n * d - Math.round(n * d)) < 1e-9) return `${Math.round(n * d)}/${d}`;
  return String(n);
}
const termsString = (ts: Term[]) => ts.map((t) => `${coef(t.n)}${coef(t.n) ? ' ' : ''}${t.species}`).join(' + ');
const atomsOf = (species: string): Record<string, number> => parseFormula(species.replace(/\(.*\)$/, ''));

function poolTerms(pool: Record<string, number>): Term[] {
  return ORDER.filter((e) => (pool[e] ?? 0) > 1e-9).map((e) => ({ n: pool[e] / ELEMENT_FORM[e].atoms, species: ELEMENT_FORM[e].name }));
}
function addAtoms(pool: Record<string, number>, species: string, n: number, sign: 1 | -1) {
  for (const [e, k] of Object.entries(atomsOf(species))) {
    if (!ELEMENT_FORM[e]) throw new Error(`no standard element form for ${e}`);
    pool[e] = (pool[e] ?? 0) + sign * n * k;
  }
}

export function formationHessRoute(rxn: Reaction): HessRoute {
  const pool: Record<string, number> = {};
  const intact: Term[] = [];
  for (const t of rxn.reactants) { if (hf(t.species) === 0) addAtoms(pool, t.species, t.n, 1); else intact.push({ ...t }); }
  const reactantsTex = chemTex(termsString(rxn.reactants)), productsTex = chemTex(termsString(rxn.products));
  const levels: HessLevel[] = [{ tex: reactantsTex, H: 0 }];
  const steps: HessStep[] = [];
  const label = () => chemTex(termsString([...intact, ...poolTerms(pool)]));
  let H = 0;
  for (const t of rxn.reactants) {
    if (hf(t.species) === 0) continue;
    const dH = -t.n * hf(t.species);
    const i = intact.findIndex((x) => x.species === t.species);
    intact.splice(i, 1); addAtoms(pool, t.species, t.n, 1);
    H += dH; steps.push({ kind: 'unform', species: t.species, n: t.n, dH }); levels.push({ tex: label(), H });
  }
  for (const t of rxn.products) {
    if (hf(t.species) === 0) continue;
    const dH = t.n * hf(t.species);
    addAtoms(pool, t.species, t.n, -1); intact.push({ ...t });
    H += dH; steps.push({ kind: 'form', species: t.species, n: t.n, dH }); levels.push({ tex: label(), H });
  }
  levels[levels.length - 1] = { tex: productsTex, H }; // the last level IS the product side
  return { levels, steps, total: H, reactantsTex, productsTex };
}

/** Slides 23–25: 2 H₂ + O₂ → 2 H₂O(g) (−483.6 kJ) → 2 H₂O(l) (−88 kJ). */
export function waterRoute(): HessRoute {
  const steps: HessStep[] = [{ kind: 'step', dH: SLIDE23.dH1 }, { kind: 'step', dH: SLIDE23.dH2 }];
  const { levels, total } = hessLevels(steps.map((s) => s.dH));
  const tex = [chemTex('2 H2(g) + O2(g)'), chemTex('2 H2O(g)'), chemTex('2 H2O(l)')];
  return { levels: levels.map((H, i) => ({ tex: tex[i], H })), steps, total, reactantsTex: tex[0], productsTex: tex[2] };
}

export interface HessExample { id: string; src: string; slides: string; route: () => HessRoute; rxn?: Reaction }
const fr = (src: string): HessExample['route'] => () => formationHessRoute(parseReaction(src));
export const HESS_EXAMPLES: HessExample[] = [
  { id: 'water', src: '2 H2(g) + O2(g) -> 2 H2O(l)', slides: 'Vorlesung 4, Folien 23–25', route: waterRoute, rxn: parseReaction('2 H2(g) + O2(g) -> 2 H2O(l)') },
  { id: 'propane', src: 'C3H8(g) + 5 O2(g) -> 3 CO2(g) + 4 H2O(l)', slides: 'Folien 27–28, Übung 4 Aufg. 4', route: fr('C3H8(g) + 5 O2(g) -> 3 CO2(g) + 4 H2O(l)'), rxn: parseReaction('C3H8(g) + 5 O2(g) -> 3 CO2(g) + 4 H2O(l)') },
  { id: 'methanol', src: 'CO(g) + 2 H2(g) -> CH3OH(g)', slides: 'Übung 4 Aufg. 3', route: fr('CO(g) + 2 H2(g) -> CH3OH(g)'), rxn: parseReaction('CO(g) + 2 H2(g) -> CH3OH(g)') },
  { id: 'cao', src: 'CaO(s) + 2 HF(g) -> CaF2(s) + H2O(g)', slides: 'Übung 4 Aufg. 5a', route: fr('CaO(s) + 2 HF(g) -> CaF2(s) + H2O(g)'), rxn: parseReaction('CaO(s) + 2 HF(g) -> CaF2(s) + H2O(g)') },
  { id: 'fe', src: 'Fe2O3(s) + 3 C(s) -> 2 Fe(s) + 3 CO(g)', slides: 'Übung 4 Aufg. 5b', route: fr('Fe2O3(s) + 3 C(s) -> 2 Fe(s) + 3 CO(g)'), rxn: parseReaction('Fe2O3(s) + 3 C(s) -> 2 Fe(s) + 3 CO(g)') },
];

/** The table of slide 29: for each species its coefficient, ΔH°_f and n·ΔH°_f (products +, reactants −). */
export function formationTable(rxn: Reaction) {
  const rows = [
    ...rxn.reactants.map((t) => ({ side: 'reactant' as const, species: t.species, n: t.n, hf: hf(t.species), contribution: 0 - t.n * hf(t.species) })),
    ...rxn.products.map((t) => ({ side: 'product' as const, species: t.species, n: t.n, hf: hf(t.species), contribution: t.n * hf(t.species) })),
  ];
  return { rows, total: rows.reduce((s, r) => s + r.contribution, 0), known: Object.keys(HF).length };
}

export { dHrxn };
