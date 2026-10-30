import type { HessRoute } from './hess';
import { chemTex } from './tex';

/**
 * Chemical bonding (lecture 7, slides 4–25; exercise class 7): Lewis symbols, Lewis structures with formal charges and
 * oxidation numbers, electronegativity and bond polarity, dipole moments, the Born–Haber cycle of NaCl, bond
 * enthalpies and bond lengths. Every number shown in the week-7 chemistry lessons comes from here (tests in bonding.test.ts).
 */

/* ------------------------------------------------------------------ valence electrons, Lewis symbols (slides 5–6) */

/** Valence electrons of the main-group elements used in the lessons («column index» of the s and p block, exercise 7 p. 2). */
export const VALENCE: Record<string, number> = {
  H: 1, He: 2, Li: 1, Be: 2, B: 3, C: 4, N: 5, O: 6, F: 7, Ne: 8,
  Na: 1, Mg: 2, Al: 3, Si: 4, P: 5, S: 6, Cl: 7, Ar: 8,
  K: 1, Ca: 2, Ga: 3, Br: 7, Kr: 8, I: 7, Xe: 8,
};
export const valence = (el: string): number => {
  const v = VALENCE[el];
  if (v === undefined) throw new Error(`no valence count for ${el}`);
  return v;
};

/** Sides of a Lewis symbol: right, left, top, bottom (slide 5: «top, bottom, left, and right sides are all equivalent»). */
export type Side = 'r' | 'l' | 't' | 'b';
export const SIDES: Side[] = ['r', 'l', 't', 'b'];
/**
 * Dots on each side for n valence electrons, by the slide's rules: at most 2 dots per side, spread the electrons out
 * (first one dot on every side, then pair them up). The order of the sides is a convention; every order is correct.
 */
export function lewisDots(n: number): Record<Side, number> {
  if (n < 0 || n > 8) throw new Error('0 ≤ n ≤ 8');
  const out: Record<Side, number> = { r: 0, l: 0, t: 0, b: 0 };
  for (let k = 0; k < n; k++) out[SIDES[k % 4]] += 1;
  return out;
}

/* ------------------------------------------------------------------ electronegativity (slides 11–14) */

/** Pauling electronegativities as printed on slide 13 (Brown, Fig. 8.8), periods 1–6 without the noble gases. */
export const EN: Record<string, number> = {
  H: 2.1,
  Li: 1.0, Be: 1.5, B: 2.0, C: 2.5, N: 3.0, O: 3.5, F: 4.0,
  Na: 0.9, Mg: 1.2, Al: 1.5, Si: 1.8, P: 2.1, S: 2.5, Cl: 3.0,
  K: 0.8, Ca: 1.0, Sc: 1.3, Ti: 1.5, V: 1.6, Cr: 1.6, Mn: 1.5, Fe: 1.8, Co: 1.9, Ni: 1.9, Cu: 1.9, Zn: 1.6,
  Ga: 1.6, Ge: 1.8, As: 2.0, Se: 2.4, Br: 2.8,
  Rb: 0.8, Sr: 1.0, Y: 1.2, Zr: 1.4, Nb: 1.6, Mo: 1.8, Tc: 1.9, Ru: 2.2, Rh: 2.2, Pd: 2.2, Ag: 1.9, Cd: 1.7,
  In: 1.7, Sn: 1.8, Sb: 1.9, Te: 2.1, I: 2.5,
  Cs: 0.7, Ba: 0.9, La: 1.0, Hf: 1.3, Ta: 1.5, W: 1.7, Re: 1.9, Os: 2.2, Ir: 2.2, Pt: 2.2, Au: 2.4, Hg: 1.9,
  Tl: 1.8, Pb: 1.9, Bi: 1.9, Po: 2.0, At: 2.2,
  // not on the slide (noble gases are left out there): Pauling value, needed only for the oxidation numbers of XeO3
  Xe: 2.6,
};
export const en = (el: string): number => {
  const v = EN[el];
  if (v === undefined) throw new Error(`no electronegativity for ${el}`);
  return v;
};
/** |ΔEN| rounded to one decimal (the table has one decimal). */
export const deltaEN = (a: string, b: string) => Math.round(Math.abs(en(a) - en(b)) * 10) / 10;

export type BondType = 'nonpolar' | 'polar' | 'ionic';
/** Slide 11 + rule of thumb of slide 14: equal sharing only between equal atoms (ΔEN = 0); ΔEN ≥ 2 ⇒ ionic. */
export function bondType(a: string, b: string): BondType {
  const d = deltaEN(a, b);
  return d === 0 ? 'nonpolar' : d >= 2 ? 'ionic' : 'polar';
}

/* ------------------------------------------------------------------ dipole moments (slide 15) */

export const E_CHARGE = 1.602176634e-19; // C
/** 1 D = 3.336 × 10⁻³⁰ C·m (slide: 3.34 × 10⁻³⁰). */
export const DEBYE = 3.33564e-30;
/** |μ| = Q r in debye for a charge Q (in units of e) separated by r (in pm). */
export const dipoleD = (qE: number, rPm: number) => (qE * E_CHARGE * rPm * 1e-12) / DEBYE;
/** Partial charge δ (in units of e) from a measured dipole moment and bond length. */
export const partialCharge = (muD: number, rPm: number) => (muD * DEBYE) / (E_CHARGE * rPm * 1e-12);
/** Measured dipole moments (D) and bond lengths (pm) of the hydrogen halides (Brown, Table 8.3 of the 14th ed.; not on the slides except |μ_HF| = 1.8 D). */
export const HX: Record<'HF' | 'HCl' | 'HBr' | 'HI', { mu: number; r: number }> = {
  HF: { mu: 1.82, r: 92 }, HCl: { mu: 1.08, r: 127 }, HBr: { mu: 0.82, r: 141 }, HI: { mu: 0.44, r: 161 },
};

/* ------------------------------------------------------------------ Lewis structures (slides 9–23) */

export interface LAtom {
  el: string;
  /** position in units of one bond length; y points down (screen) */
  x: number; y: number;
  /** lone pairs */
  lp: number;
  /** unpaired electrons (radicals, e.g. N in NO) */
  rad?: number;
  /** explicit directions (degrees, 0 = right, 90 = down) of lone pairs then unpaired electrons; otherwise placed automatically */
  at?: number[];
}
export interface LBond { a: number; b: number; order: 1 | 2 | 3 }
export interface LStruct { atoms: LAtom[]; bonds: LBond[]; charge: number }

export const bondsOf = (s: LStruct, i: number) => s.bonds.filter((b) => b.a === i || b.b === i);
/** Number of bonding electron pairs at atom i (a double bond counts 2). */
export const bondPairs = (s: LStruct, i: number) => bondsOf(s, i).reduce((n, b) => n + b.order, 0);
/** Electrons around atom i: its lone-pair and unpaired electrons plus all shared electrons (octet count; H needs 2). */
export const electronsAround = (s: LStruct, i: number) => 2 * s.atoms[i].lp + (s.atoms[i].rad ?? 0) + 2 * bondPairs(s, i);
/** Total valence electrons drawn in the structure. */
export const drawnElectrons = (s: LStruct) => s.atoms.reduce((n, a) => n + 2 * a.lp + (a.rad ?? 0), 0) + 2 * s.bonds.reduce((n, b) => n + b.order, 0);
/** Rule 1 of slide 17: sum of the valence electrons of all atoms, minus the overall charge. */
export const valenceSum = (s: LStruct) => s.atoms.reduce((n, a) => n + valence(a.el), 0) - s.charge;

/** Slide 18: FC = (valence e⁻) − ½ (bonding e⁻) − (non-bonding e⁻). */
export function formalCharge(s: LStruct, i: number): number {
  const a = s.atoms[i];
  return valence(a.el) - bondPairs(s, i) - (2 * a.lp + (a.rad ?? 0));
}
/** Electrons «assigned» to atom i for the formal charge: its non-bonding electrons plus half of each shared pair. */
export const assignedFC = (s: LStruct, i: number) => valence(s.atoms[i].el) - formalCharge(s, i);
/**
 * Slide 20: oxidation numbers = charges if the bonds were completely ionic: each shared pair goes entirely to the more
 * electronegative atom (split equally between equal atoms).
 */
export function oxidationNumber(s: LStruct, i: number): number {
  const a = s.atoms[i];
  let assigned = 2 * a.lp + (a.rad ?? 0);
  for (const b of bondsOf(s, i)) {
    const j = b.a === i ? b.b : b.a;
    const d = en(a.el) - en(s.atoms[j].el);
    assigned += d > 1e-9 ? 2 * b.order : Math.abs(d) <= 1e-9 ? b.order : 0;
  }
  return valence(a.el) - assigned;
}
export const assignedOx = (s: LStruct, i: number) => valence(s.atoms[i].el) - oxidationNumber(s, i);
export const formalCharges = (s: LStruct) => s.atoms.map((_, i) => formalCharge(s, i));
/** Octet satisfied for every atom (H: 2 electrons). */
export const octetsOk = (s: LStruct) => s.atoms.every((a, i) => electronsAround(s, i) === (a.el === 'H' ? 2 : 8));
/** Sum of |FC| — the dominant structure has the smallest (slide 18). */
export const fcSize = (s: LStruct) => formalCharges(s).reduce((n, f) => n + Math.abs(f), 0);

/**
 * Directions (degrees, screen: 0 = right, 90 = down) for the lone pairs and unpaired electrons of atom i: explicit `at`,
 * or greedily the free directions among multiples of 45° farthest from the bonds and from the electrons already placed.
 */
export function electronDirs(s: LStruct, i: number): number[] {
  const a = s.atoms[i];
  const n = a.lp + (a.rad ?? 0);
  if (a.at && a.at.length >= n) return a.at.slice(0, n);
  const bondDirs = bondsOf(s, i).map((b) => {
    const o = s.atoms[b.a === i ? b.b : b.a];
    return (Math.atan2(o.y - a.y, o.x - a.x) * 180) / Math.PI;
  });
  const gap = (u: number, v: number) => { const d = Math.abs(((u - v) % 360 + 540) % 360 - 180); return d; };
  const taken = [...bondDirs];
  const out: number[] = [];
  const pref = [180, 0, 270, 90, 225, 315, 135, 45]; // left, right, up, down first: the usual way of drawing
  for (let k = 0; k < n; k++) {
    let best = pref[0], score = -1;
    for (const c of pref) {
      const sc = taken.length ? Math.min(...taken.map((d) => gap(c, d))) : 360;
      if (sc > score + 1e-9) { score = sc; best = c; }
    }
    out.push(best); taken.push(best);
  }
  return out;
}

const A = (el: string, x: number, y: number, lp: number, extra: Partial<LAtom> = {}): LAtom => ({ el, x, y, lp, ...extra });
const B = (a: number, b: number, order: 1 | 2 | 3 = 1): LBond => ({ a, b, order });
const S120 = Math.sin(Math.PI / 3), C120 = 0.5;

/** The structures drawn on slides 9–23 and in exercise class 7. */
export const STRUCTS = {
  H2: { atoms: [A('H', 0, 0, 0), A('H', 1, 0, 0)], bonds: [B(0, 1)], charge: 0 },
  Cl2: { atoms: [A('Cl', 0, 0, 3), A('Cl', 1, 0, 3)], bonds: [B(0, 1)], charge: 0 },
  F2: { atoms: [A('F', 0, 0, 3), A('F', 1, 0, 3)], bonds: [B(0, 1)], charge: 0 },
  CO2: { atoms: [A('O', 0, 0, 2, { at: [270, 90] }), A('C', 1, 0, 0), A('O', 2, 0, 2, { at: [270, 90] })], bonds: [B(0, 1, 2), B(1, 2, 2)], charge: 0 },
  CO2b: { atoms: [A('O', 0, 0, 3), A('C', 1, 0, 0), A('O', 2, 0, 1)], bonds: [B(0, 1, 1), B(1, 2, 3)], charge: 0 },
  N2: { atoms: [A('N', 0, 0, 1), A('N', 1, 0, 1)], bonds: [B(0, 1, 3)], charge: 0 },
  HF: { atoms: [A('H', 0, 0, 0), A('F', 1, 0, 3)], bonds: [B(0, 1)], charge: 0 },
  HCl: { atoms: [A('H', 0, 0, 0), A('Cl', 1, 0, 3)], bonds: [B(0, 1)], charge: 0 },
  HCN: { atoms: [A('H', 0, 0, 0), A('C', 1, 0, 0), A('N', 2, 0, 1)], bonds: [B(0, 1), B(1, 2, 3)], charge: 0 },
  CN: { atoms: [A('C', 0, 0, 1), A('N', 1, 0, 1)], bonds: [B(0, 1, 3)], charge: -1 },
  NCSa: { atoms: [A('N', 0, 0, 3), A('C', 1, 0, 0), A('S', 2, 0, 1)], bonds: [B(0, 1, 1), B(1, 2, 3)], charge: -1 },
  NCSb: { atoms: [A('N', 0, 0, 2, { at: [270, 90] }), A('C', 1, 0, 0), A('S', 2, 0, 2, { at: [270, 90] })], bonds: [B(0, 1, 2), B(1, 2, 2)], charge: -1 },
  NCSc: { atoms: [A('N', 0, 0, 1), A('C', 1, 0, 0), A('S', 2, 0, 3)], bonds: [B(0, 1, 3), B(1, 2, 1)], charge: -1 },
  O3a: { atoms: [A('O', -S120, C120, 2, { at: [180, 270] }), A('O', 0, 0, 1, { at: [270] }), A('O', S120, C120, 3, { at: [0, 90, 300] })], bonds: [B(0, 1, 2), B(1, 2, 1)], charge: 0 },
  O3b: { atoms: [A('O', -S120, C120, 3, { at: [180, 90, 240] }), A('O', 0, 0, 1, { at: [270] }), A('O', S120, C120, 2, { at: [0, 270] })], bonds: [B(0, 1, 1), B(1, 2, 2)], charge: 0 },
  BF3: { atoms: [A('B', 0, 0, 0), A('F', 0, -1, 3), A('F', -S120, C120, 3), A('F', S120, C120, 3)], bonds: [B(0, 1), B(0, 2), B(0, 3)], charge: 0 },
  BF3d: { atoms: [A('B', 0, 0, 0), A('F', 0, -1, 2, { at: [180, 0] }), A('F', -S120, C120, 3), A('F', S120, C120, 3)], bonds: [B(0, 1, 2), B(0, 2), B(0, 3)], charge: 0 },
  NO: { atoms: [A('N', 0, 0, 1, { rad: 1, at: [180, 270] }), A('O', 1, 0, 2, { at: [270, 90] })], bonds: [B(0, 1, 2)], charge: 0 },
  PF5: {
    atoms: [A('P', 0, 0, 0), A('F', 0, -1, 3), A('F', 0, 1, 3), A('F', -1, 0, 3), A('F', 0.82, -0.57, 3, { at: [0, 300, 225] }), A('F', 0.82, 0.57, 3, { at: [0, 60, 135] })],
    bonds: [B(0, 1), B(0, 2), B(0, 3), B(0, 4), B(0, 5)], charge: 0,
  },
  // exercise class 7, Ex. 7: XeO3 (structures K, L, M, N); Xe keeps one lone pair in all four
  XeO3K: { atoms: [A('Xe', 0, 0, 1, { at: [270] }), A('O', -1, 0, 3), A('O', 1, 0, 3), A('O', 0, 1, 3)], bonds: [B(0, 1), B(0, 2), B(0, 3)], charge: 0 },
  XeO3L: { atoms: [A('Xe', 0, 0, 1, { at: [270] }), A('O', -1, 0, 3), A('O', 1, 0, 3), A('O', 0, 1, 2, { at: [180, 0] })], bonds: [B(0, 1), B(0, 2), B(0, 3, 2)], charge: 0 },
  XeO3M: { atoms: [A('Xe', 0, 0, 1, { at: [270] }), A('O', -1, 0, 2, { at: [270, 90] }), A('O', 1, 0, 2, { at: [270, 90] }), A('O', 0, 1, 3)], bonds: [B(0, 1, 2), B(0, 2, 2), B(0, 3)], charge: 0 },
  XeO3N: { atoms: [A('Xe', 0, 0, 1, { at: [270] }), A('O', -1, 0, 2, { at: [270, 90] }), A('O', 1, 0, 2, { at: [270, 90] }), A('O', 0, 1, 2, { at: [180, 0] })], bonds: [B(0, 1, 2), B(0, 2, 2), B(0, 3, 2)], charge: 0 },
  NH3: { atoms: [A('N', 0, 0, 1, { at: [270] }), A('H', -1, 0, 0), A('H', 1, 0, 0), A('H', 0, 1, 0)], bonds: [B(0, 1), B(0, 2), B(0, 3)], charge: 0 },
  H2O: { atoms: [A('O', 0, 0, 2, { at: [225, 315] }), A('H', -S120, C120, 0), A('H', S120, C120, 0)], bonds: [B(0, 1), B(0, 2)], charge: 0 },
  CH4: { atoms: [A('C', 0, 0, 0), A('H', -1, 0, 0), A('H', 1, 0, 0), A('H', 0, -1, 0), A('H', 0, 1, 0)], bonds: [B(0, 1), B(0, 2), B(0, 3), B(0, 4)], charge: 0 },
  CCl4: { atoms: [A('C', 0, 0, 0), A('Cl', -1, 0, 3), A('Cl', 1, 0, 3), A('Cl', 0, -1, 3), A('Cl', 0, 1, 3)], bonds: [B(0, 1), B(0, 2), B(0, 3), B(0, 4)], charge: 0 },
} satisfies Record<string, LStruct>;
export type StructId = keyof typeof STRUCTS;

/* ------------------------------------------------------------------ ionic bonding: Born–Haber cycle of NaCl (slides 7–8) */

/**
 * The five steps of the Born–Haber cycle for NaCl(s) (slide 8 shows the diagram; the numbers are from Brown, Appendix C
 * and Table 8.1 — «See p. 376 of Brown», not printed on the slide). kJ/mol.
 */
export const BORN_HABER_NACL = [
  { id: 'unform', dH: 410.9 },   // −ΔH°f[NaCl(s)] (same value as the ΔH°f table of lecture 4, chem/thermo.ts)
  { id: 'naGas', dH: 107.3 },    // ΔH°f[Na(g)] (sublimation)
  { id: 'clGas', dH: 121.3 },    // ΔH°f[Cl(g)] = ½ D(Cl–Cl) = ½ · 242.6
  { id: 'ion', dH: 496 },        // I₁(Na)
  { id: 'ea', dH: -349 },        // EA(Cl)
] as const;
export const latticeEnergyNaCl = () => BORN_HABER_NACL.reduce((s, x) => s + x.dH, 0);

/** Ionic radii (pm) used for the lattice-energy comparison (Brown, Fig. 7.8; same table as lecture 6, slide 31). */
export const ION_RADIUS: Record<string, number> = {
  'Li+': 90, 'Na+': 116, 'K+': 152, 'Mg2+': 86, 'Ca2+': 114, 'F-': 119, 'Cl-': 167, 'Br-': 182, 'O2-': 126,
};
/** Coulomb energy of one ion pair at contact, k Q₁Q₂ / d, in kJ/mol (Q in units of e, d in pm); slide 7 margin: E_el = Q₁Q₂/(4πε₀ d). */
export const coulombKJ = (q1: number, q2: number, dPm: number) => (1389.35 * q1 * q2) / (dPm / 100);

/* ------------------------------------------------------------------ bond enthalpies and lengths (slides 24–25) */

/** Table 8.3 «Average bond enthalpies (kJ/mol)» as printed on slide 24. Keys use -, =, # for single, double, triple. */
export const BOND_H: Record<string, number> = {
  'C-H': 413, 'C-C': 348, 'C-N': 293, 'C-O': 358, 'C-F': 485, 'C-Cl': 328, 'C-Br': 276, 'C-I': 240, 'C-S': 259,
  'N-H': 391, 'N-N': 163, 'N-O': 201, 'N-F': 272, 'N-Cl': 200, 'N-Br': 243, 'H-H': 436, 'H-F': 567, 'H-Cl': 431, 'H-Br': 366, 'H-I': 299,
  'O-H': 463, 'O-O': 146, 'O-F': 190, 'O-Cl': 203, 'O-I': 234, 'S-H': 339, 'S-F': 327, 'S-Cl': 253, 'S-Br': 218, 'S-S': 266,
  'F-F': 155, 'Cl-F': 253, 'Cl-Cl': 242, 'Br-F': 237, 'Br-Cl': 218, 'Br-Br': 193, 'I-Cl': 208, 'I-Br': 175, 'I-I': 151,
  'Si-H': 323, 'Si-Si': 226, 'Si-C': 301, 'Si-O': 368, 'Si-Cl': 464,
  'C=C': 614, 'C#C': 839, 'C=N': 615, 'C#N': 891, 'C=O': 799, 'C#O': 1072, 'N=N': 418, 'N#N': 941, 'N=O': 607, 'O=O': 495, 'S=O': 523, 'S=S': 418,
};
/** Table 8.4 «Average bond lengths (pm)» as printed on slide 25. */
export const BOND_L: Record<string, number> = {
  'C-C': 154, 'C=C': 134, 'C#C': 120, 'C-N': 143, 'C=N': 138, 'C#N': 116, 'C-O': 143, 'C=O': 123, 'C#O': 113,
  'N-N': 147, 'N=N': 124, 'N#N': 110, 'N-O': 136, 'N=O': 122, 'O-O': 148, 'O=O': 121,
};
export const bondH = (k: string) => { const v = BOND_H[k]; if (v === undefined) throw new Error(`no bond enthalpy ${k}`); return v; };

export interface BondRxn { id: string; eq: string; broken: [string, number][]; formed: [string, number][]; /** the free atoms in between */ atoms: string }
/** Reactions for the estimate ΔH_rxn = Σ(bonds broken) − Σ(bonds formed) (slide 24). All species gaseous. */
export const BOND_RXNS: BondRxn[] = [
  { id: 'hcl', eq: 'H2(g) + Cl2(g) -> 2 HCl(g)', broken: [['H-H', 1], ['Cl-Cl', 1]], formed: [['H-Cl', 2]], atoms: '2 H(g) + 2 Cl(g)' },
  { id: 'ch4', eq: 'CH4(g) + 2 O2(g) -> CO2(g) + 2 H2O(g)', broken: [['C-H', 4], ['O=O', 2]], formed: [['C=O', 2], ['O-H', 4]], atoms: 'C(g) + 4 H(g) + 4 O(g)' },
  { id: 'nh3', eq: 'N2(g) + 3 H2(g) -> 2 NH3(g)', broken: [['N#N', 1], ['H-H', 3]], formed: [['N-H', 6]], atoms: '2 N(g) + 6 H(g)' },
  { id: 'chlor', eq: 'CH4(g) + Cl2(g) -> CH3Cl(g) + HCl(g)', broken: [['C-H', 1], ['Cl-Cl', 1]], formed: [['C-Cl', 1], ['H-Cl', 1]], atoms: 'CH3(g) + H(g) + 2 Cl(g)' },
];
export const sumBonds = (list: [string, number][]) => list.reduce((s, [k, n]) => s + n * bondH(k), 0);
export const bondRxnH = (r: BondRxn) => sumBonds(r.broken) - sumBonds(r.formed);

/** Two-step route for the enthalpy diagram: reactants → free atoms (+Σ broken) → products (−Σ formed). */
export function bondRoute(r: BondRxn): HessRoute {
  const [lhs, rhs] = r.eq.split('->').map((x) => x.trim());
  const up = sumBonds(r.broken), down = -sumBonds(r.formed);
  return {
    levels: [{ tex: chemTex(lhs), H: 0 }, { tex: chemTex(r.atoms), H: up }, { tex: chemTex(rhs), H: up + down }],
    steps: [{ kind: 'step', dH: up }, { kind: 'step', dH: down }],
    total: up + down, reactantsTex: chemTex(lhs), productsTex: chemTex(rhs),
  };
}

/** Born–Haber cycle of NaCl as an enthalpy route (slide 8), from NaCl(s) up to the free gaseous ions. */
export function bornHaberRoute(): HessRoute {
  const levels = ['NaCl(s)', 'Na(s) + 1/2 Cl2(g)', 'Na(g) + 1/2 Cl2(g)', 'Na(g) + Cl(g)', 'Na^+(g) + e^- + Cl(g)', 'Na^+(g) + Cl^-(g)'];
  const names = [String.raw`-\Delta H^\circ_f[\mathrm{NaCl}(s)]`, String.raw`\Delta H^\circ_f[\mathrm{Na}(g)]`, String.raw`\Delta H^\circ_f[\mathrm{Cl}(g)]`, String.raw`I_1(\mathrm{Na})`, String.raw`EA(\mathrm{Cl})`];
  let H = 0;
  return {
    levels: levels.map((l, i) => { if (i) H += BORN_HABER_NACL[i - 1].dH; return { tex: chemTex(l), H }; }),
    steps: BORN_HABER_NACL.map((x, i) => ({ kind: 'step' as const, dH: x.dH, tex: names[i] })),
    total: latticeEnergyNaCl(), reactantsTex: chemTex(levels[0]), productsTex: chemTex(levels[5]),
    netTex: String.raw`\Delta H_\mathrm{lat}`,
  };
}
