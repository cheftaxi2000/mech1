/**
 * Precipitation (metathesis) reactions AX + BY → AY + BX (lecture 3, slide 13) and neutralisation reactions (slide 20).
 * The product states follow the solubility chart of slide 16; coefficients come from `balance`.
 */
import { balance } from './balance';
import { ionicFormula, CATIONS, ANIONS, type Ion } from './ions';
import { completeIonic, ionicSpecies, molecular, netIonic, spectators, type Reaction, type Species, type State } from './ionic';
import { solubility } from './solubility';

export interface Metathesis {
  reaction: Reaction;
  /** insoluble products (the precipitates) */
  precipitates: Species[];
  /** a reaction takes place if at least one product is a solid */
  reacts: boolean;
  /** a product whose solubility the chart does not cover (it is written dissolved) */
  unknown: boolean;
  molecular: string;
  complete: string;
  net: string;
  spectatorKeys: string[];
}

const species = (c: Ion, a: Ion, state: State): Species => {
  const f = ionicFormula(c, a);
  return ionicSpecies(f.formula, c, f.nCation, a, f.nAnion, state);
};

/** Mix the solutions of the compounds AX and BY. Both must dissolve (slide 16), otherwise there is no solution to mix. */
export function metathesis(A: Ion, X: Ion, B: Ion, Y: Ion): Metathesis {
  if (A.f === B.f && A.z === B.z) throw new Error('two different cations are needed');
  if (X.f === Y.f && X.z === Y.z) throw new Error('two different anions are needed');
  for (const [c, a] of [[A, X], [B, Y]] as [Ion, Ion][]) if (solubility(c, a).soluble !== true) throw new Error(`${ionicFormula(c, a).formula} does not dissolve`);
  const state = (c: Ion, a: Ion): State => (solubility(c, a).soluble === false ? 's' : 'aq');
  const AX = species(A, X, 'aq'), BY = species(B, Y, 'aq');
  const AY = species(A, Y, state(A, Y)), BX = species(B, X, state(B, X));
  const co = balance([AX.f, BY.f], [AY.f, BX.f]);
  if (!co) throw new Error('cannot balance');
  const reaction: Reaction = {
    reactants: [{ coef: co[0], sp: AX }, { coef: co[1], sp: BY }],
    products: [{ coef: co[2], sp: AY }, { coef: co[3], sp: BX }],
  };
  const precipitates = [AY, BX].filter((s) => s.state === 's');
  return {
    reaction, precipitates, reacts: precipitates.length > 0,
    unknown: solubility(A, Y).soluble === null || solubility(B, X).soluble === null,
    molecular: molecular(reaction), complete: completeIonic(reaction), net: netIonic(reaction),
    spectatorKeys: spectators(reaction).map((s) => s.key),
  };
}

// ---------------------------------------------------------------- acids and bases (slides 17–20)

export interface Acid { f: string; /** H⁺ per molecule */ n: number; anion: Ion; strong: boolean }
export interface Base { f: string; cation: Ion | null; /** OH⁻ per formula unit; 0 for ammonia */ nOH: number }

const an = (f: string, z: number) => ANIONS.find((x) => x.f === f && x.z === z)!;
const ca = (f: string, z: number) => CATIONS.find((x) => x.f === f && x.z === z)!;

export const ACIDS: Acid[] = [
  { f: 'HCl', n: 1, anion: an('Cl', -1), strong: true },
  { f: 'HNO3', n: 1, anion: an('NO3', -1), strong: true },
  { f: 'H2SO4', n: 2, anion: an('SO4', -2), strong: true },
];
export const BASES: Base[] = [
  { f: 'NaOH', cation: ca('Na', 1), nOH: 1 },
  { f: 'KOH', cation: ca('K', 1), nOH: 1 },
  { f: 'Ca(OH)2', cation: ca('Ca', 2), nOH: 2 },
  { f: 'Ba(OH)2', cation: ca('Ba', 2), nOH: 2 },
  { f: 'Mg(OH)2', cation: ca('Mg', 2), nOH: 2 },
  { f: 'Al(OH)3', cation: ca('Al', 3), nOH: 3 },
  { f: 'NH3', cation: null, nOH: 0 },
];

const H = ca('H', 1), OH = an('OH', -1), NH4 = ca('NH4', 1);

export interface Neutralisation { reaction: Reaction; molecular: string; complete: string; net: string; saltFormula: string; saltSolid: boolean; baseSolid: boolean }

/** Acid + base → salt + water (ammonia: salt only). */
export function neutralisation(acid: Acid, base: Base): Neutralisation {
  const saltCation = base.cation ?? NH4;
  const salt = ionicFormula(saltCation, acid.anion);
  const saltSolid = solubility(saltCation, acid.anion).soluble === false;
  const baseSolid = base.cation !== null && solubility(base.cation, OH).soluble === false;
  const saltSp = ionicSpecies(salt.formula, saltCation, salt.nCation, acid.anion, salt.nAnion, saltSolid ? 's' : 'aq');
  const acidSp = ionicSpecies(acid.f, H, acid.n, acid.anion, 1, 'aq');
  const baseSp: Species = base.cation
    ? ionicSpecies(base.f, base.cation, 1, OH, base.nOH, baseSolid ? 's' : 'aq')
    : { f: 'NH3', state: 'aq' };
  const water: Species = { f: 'H2O', state: 'l' };
  const prods = base.cation ? [saltSp, water] : [saltSp];
  const co = balance([acid.f, base.f], prods.map((p) => p.f));
  if (!co) throw new Error('cannot balance');
  const reaction: Reaction = {
    reactants: [{ coef: co[0], sp: acidSp }, { coef: co[1], sp: baseSp }],
    products: prods.map((sp, i) => ({ coef: co[2 + i], sp })),
  };
  return { reaction, molecular: molecular(reaction), complete: completeIonic(reaction), net: netIonic(reaction), saltFormula: salt.formula, saltSolid, baseSolid };
}

