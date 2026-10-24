import { describe, expect, it } from 'vitest';
import { ELEMENTS } from './elements';
import { PERIODIC, cellBySymbol, cellByZ } from './periodic';
import { ISOTOPES, M_E_U, M_N_U, M_P_U, atomicWeight, commonMassNumber, counts, ionKind, naturalWeight } from './atoms';
import { ANIONS, CATIONS, anion, cation, ionicFormula, ionStr } from './ions';
import { molarMass } from './formula';
import { chemTex } from './tex';
import { N_A, e_charge, m_e, u_kg } from './constants';
import { gramsFromMoles, gramsPerMoleOfU, massOfB, molesFromGrams, particlesFromMoles, sides, slideRoute } from './stoich';
import { PREFIXES, convert, factor, unitPath } from './units';
import { balance } from './balance';

describe('periodic table (slide 18)', () => {
  it('has 118 elements in order with unique grid cells', () => {
    expect(PERIODIC).toHaveLength(118);
    expect(PERIODIC.map((e) => e.Z)).toEqual(Array.from({ length: 118 }, (_, i) => i + 1));
    expect(new Set(PERIODIC.map((e) => `${e.row},${e.col}`)).size).toBe(118);
    expect(new Set(PERIODIC.map((e) => e.symbol)).size).toBe(118);
  });
  it('agrees with elements.ts where both know an element', () => {
    for (const e of ELEMENTS) {
      const c = cellByZ(e.Z)!;
      expect([c.symbol, c.mass, c.period, c.group]).toEqual([e.symbol, e.mass, e.period, e.group]);
    }
  });
  it('known positions: K = 19 in period 4 group 1; Lu/Lr in group 3; f-block rows below', () => {
    const k = cellBySymbol('K');
    expect([k.Z, k.period, k.group, k.row, k.col]).toEqual([19, 4, 1, 4, 1]);
    expect(cellBySymbol('Lu')).toMatchObject({ Z: 71, row: 6, col: 3, family: 'lanthanide' });
    expect(cellBySymbol('Lr')).toMatchObject({ Z: 103, row: 7, col: 3, family: 'actinide' });
    expect(cellBySymbol('La')).toMatchObject({ row: 9, col: 3 });
    expect(cellBySymbol('Yb')).toMatchObject({ row: 9, col: 16 });
    expect(cellBySymbol('Ac')).toMatchObject({ row: 10, col: 3 });
    expect(cellBySymbol('No')).toMatchObject({ row: 10, col: 16 });
    expect(cellBySymbol('Hf')).toMatchObject({ group: 4, period: 6 });
    expect(cellBySymbol('Og')).toMatchObject({ group: 18, period: 7 });
    expect(cellBySymbol('Cn')).toMatchObject({ group: 12, period: 7 });
    expect(cellBySymbol('Au')).toMatchObject({ group: 11, period: 6 });
  });
  it('classes as on the slide: metalloids B Si Ge As Sb Te; At nonmetal; Po metal', () => {
    expect(PERIODIC.filter((e) => e.cls === 'metalloid').map((e) => e.symbol)).toEqual(['B', 'Si', 'Ge', 'As', 'Sb', 'Te']);
    expect(cellBySymbol('At').cls).toBe('nonmetal');
    expect(cellBySymbol('Po').cls).toBe('metal');
    expect(PERIODIC.filter((e) => e.cls === 'nonmetal')).toHaveLength(19);
  });
  it('family names of slide 19', () => {
    const fam = (f: string) => PERIODIC.filter((e) => e.family === f).map((e) => e.symbol);
    expect(fam('alkali')).toEqual(['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr']);
    expect(fam('alkaline')).toEqual(['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra']);
    expect(fam('chalcogen')).toEqual(['O', 'S', 'Se', 'Te', 'Po']);
    expect(fam('halogen')).toEqual(['F', 'Cl', 'Br', 'I', 'At']);
    expect(fam('noble')).toEqual(['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn']);
    expect(fam('lanthanide')).toHaveLength(15);
    expect(fam('actinide')).toHaveLength(15);
    expect(fam('transition')).toHaveLength(38); // Sc–Zn, Y–Cd, Hf–Hg, Rf–Cn
  });
});

describe('subatomic particles (slides 13, 17)', () => {
  it('proton and electron masses in u follow from the kg values', () => {
    expect(1.67262192e-27 / u_kg).toBeCloseTo(M_P_U, 4);
    expect(1.67492750e-27 / u_kg).toBeCloseTo(M_N_U, 4);
    expect(m_e / u_kg).toBeCloseTo(M_E_U, 7);
  });
  it('heavier than the electron by 1836 and 1839 (hw note on slide 13)', () => {
    expect(1.67e-27 / 9.11e-31).toBeGreaterThan(1830);
    expect(M_P_U / M_E_U).toBeCloseTo(1836, -1);
    expect(M_N_U / M_E_U).toBeCloseTo(1839, -1);
  });
  it('the elementary charge and N_A: one mole of electrons carries 96485 C', () => { expect(e_charge * N_A).toBeCloseTo(96485.33, 1); });
});

describe('nuclides and ions', () => {
  it('carbon-12: 6 p, 6 n, 6 e (slide 16)', () => expect(counts(6, 12)).toMatchObject({ protons: 6, neutrons: 6, electrons: 6 }));
  it('exercise 8: fluoride 19-9-F⁻ has 9 protons, 10 neutrons, 10 electrons', () => expect(counts(9, 19, -1)).toMatchObject({ protons: 9, neutrons: 10, electrons: 10 }));
  it('slide 21: Na → Na⁺ has 11 p and 10 e; Cl → Cl⁻ has 17 p and 18 e', () => {
    expect(counts(11, 23, 1)).toMatchObject({ protons: 11, electrons: 10 });
    expect(counts(17, 35, -1)).toMatchObject({ protons: 17, electrons: 18 });
    expect(ionKind(1)).toBe('cation'); expect(ionKind(-2)).toBe('anion'); expect(ionKind(0)).toBe('neutral');
  });
  it('rejects impossible nuclides', () => { expect(() => counts(6, 5)).toThrow(); expect(() => counts(1, 1, 2)).toThrow(); });
  it('atomic weight of carbon from slide 17: 0.9893·12 + 0.0107·13.0035 = 12.01 u', () => {
    expect(0.9893 * 12 + 0.0107 * 13.0035).toBeCloseTo(12.0107, 4);
    expect(naturalWeight('C')).toBeCloseTo(12.01, 2);
  });
  it('every isotope mixture reproduces the tabulated atomic weight within 0.01 u and sums to 1', () => {
    for (const [s, iso] of Object.entries(ISOTOPES)) {
      expect(iso.reduce((a, i) => a + i.abundance, 0), s).toBeCloseTo(1, 4);
      expect(naturalWeight(s), s).toBeCloseTo(cellBySymbol(s).mass, 1);
      for (const i of iso) expect(i.mass, `${s}-${i.A}`).toBeCloseTo(i.A, 0);
    }
  });
  it('weighted mean lies between the isotope masses and moves with the abundance', () => {
    const cl = ISOTOPES.Cl;
    expect(atomicWeight(cl, [1, 0])).toBeCloseTo(34.968853, 6);
    expect(atomicWeight(cl, [0, 1])).toBeCloseTo(36.965903, 6);
    expect(atomicWeight(cl, [1, 1])).toBeCloseTo((34.968853 + 36.965903) / 2, 6);
    expect(commonMassNumber('Cl')).toBe(35); expect(commonMassNumber('C')).toBe(12); expect(commonMassNumber('Na')).toBe(23);
  });
});

describe('ions and ionic formulae (slides 21–24)', () => {
  it('has the cations and anions of the tables, bold ones as on the slide', () => {
    expect(CATIONS).toHaveLength(26);
    expect(ANIONS).toHaveLength(21);
    expect(CATIONS.filter((c) => c.bold).map((c) => ionStr(c))).toEqual(['H^+', 'Na^+', 'K^+', 'Ag^+', 'NH4^+', 'Mg^2+', 'Ca^2+', 'Zn^2+', 'Cu^2+', 'Fe^2+', 'Pb^2+', 'Al^3+', 'Fe^3+']);
    expect(ANIONS.filter((a) => a.bold).map((a) => ionStr(a))).toEqual(['F^-', 'Cl^-', 'Br^-', 'I^-', 'OH^-', 'CH3COO^-', 'ClO4^-', 'NO3^-', 'O^2-', 'S^2-', 'CO3^2-', 'SO4^2-', 'PO4^3-']);
  });
  it('charge balance: Mg²⁺ + N³⁻ → Mg₃N₂ (slide 21)', () => {
    expect(ionicFormula(cation('Mg', 2), anion('N', -3))).toEqual({ formula: 'Mg3N2', nCation: 3, nAnion: 2 });
  });
  it('more compounds; polyatomic ions get brackets only when needed', () => {
    const f = (c: [string, number], a: [string, number]) => ionicFormula(cation(...c), anion(...a)).formula;
    expect(f(['Na', 1], ['Cl', -1])).toBe('NaCl');
    expect(f(['Ca', 2], ['Cl', -1])).toBe('CaCl2');
    expect(f(['Ca', 2], ['OH', -1])).toBe('Ca(OH)2');
    expect(f(['Al', 3], ['SO4', -2])).toBe('Al2(SO4)3');
    expect(f(['NH4', 1], ['SO4', -2])).toBe('(NH4)2SO4');
    expect(f(['Ca', 2], ['SO4', -2])).toBe('CaSO4');
    expect(f(['Fe', 3], ['O', -2])).toBe('Fe2O3');
    expect(f(['Hg2', 2], ['SO4', -2])).toBe('Hg2SO4');
    expect(f(['Mg', 2], ['PO4', -3])).toBe('Mg3(PO4)2');
    expect(f(['Al', 3], ['NO3', -1])).toBe('Al(NO3)3');
  });
  it('every ionic formula is electrically neutral', () => {
    for (const c of CATIONS) for (const a of ANIONS) { const r = ionicFormula(c, a); expect(r.nCation * c.z + r.nAnion * a.z).toBe(0); molarMass(r.formula); }
  });
  it('ion notation for the TeX helper', () => {
    expect(ionStr(cation('Na', 1))).toBe('Na^+');
    expect(chemTex(ionStr(cation('Ca', 2)) + '(aq)')).toContain('^{2+}');
    expect(chemTex(ionStr(anion('SO4', -2)))).toBe(String.raw`\mathrm{SO_{4}^{2−}}`);
  });
});

describe('stoichiometry (slides 27–31)', () => {
  it('formula weights of slide 27: H₂O = 18.0 u with the slide\'s rounded masses', () => { expect(2 * 1.0 + 16.0).toBe(18.0); expect(molarMass('H2O')).toBeCloseTo(18.015, 3); });
  it('N_A · 1 u = 1 g (why the mole was defined so, slide 29)', () => { expect(gramsPerMoleOfU()).toBeCloseTo(1, 6); });
  it('one K atom is 39.0983 u, 39.0983 g contain N_A atoms (slide 29)', () => {
    expect(molesFromGrams(39.0983, 'K')).toBeCloseTo(39.0983 / cellBySymbol('K').mass, 9);
    expect(particlesFromMoles(molesFromGrams(cellBySymbol('K').mass, 'K'))).toBeCloseTo(N_A, -15);
  });
  it('slide 28: 2.00 g H₂ → 6.02×10²³ molecules H₂ → 3.01×10²³ molecules O₂ → 16.0 g O₂', () => {
    const r = slideRoute(2);
    expect(r.moleculesH2 / 1e23).toBeCloseTo(6.02, 2);
    expect(r.moleculesO2 / 1e23).toBeCloseTo(3.01, 2);
    expect(r.gramsO2).toBeCloseTo(16.0, 1);
  });
  it('the mole route gives the same answer: n(H₂) = 2.00 g / 2.00 g/mol = 1.00 mol → 0.500 mol O₂ → 16.0 g', () => {
    expect(2.0 / 2.0).toBe(1); expect(1 / 2).toBe(0.5); expect(0.5 * 32.0).toBe(16.0);
    expect(massOfB(2.0, 'H2', 2, 'O2', 1)).toBeCloseTo(15.8, 0); // with exact atomic weights: 2.0 g / 2.016 · 1/2 · 31.998
    expect(massOfB(2.0, 'H2', 2, 'O2', 1)).toBeCloseTo(((2.0 / 2.016) / 2) * 31.998, 1);
  });
  it('slide 31: 2 H₂ + O₂ → 2 H₂O is 4.0 g + 32.0 g = 36.0 g, mass is conserved', () => {
    expect(gramsFromMoles(2, 'H2')).toBeCloseTo(4.0, 1);
    expect(gramsFromMoles(1, 'O2')).toBeCloseTo(32.0, 0);
    expect(gramsFromMoles(2, 'H2O')).toBeCloseTo(36.0, 0);
    const s = sides([[2, 'H2'], [1, 'O2']], [[2, 'H2O']]);
    expect(s.left).toBeCloseTo(s.right, 9);
  });
  it('balancing: a H₂ + b O₂ → c H₂O gives 2 : 1 : 2 (slide 26); exercise 9; exercise problem set', () => {
    expect(balance(['H2', 'O2'], ['H2O'])).toEqual([2, 1, 2]);
    expect(balance(['CF4', 'Br2'], ['CBr4', 'F2'])).toEqual([1, 2, 1, 2]);
  });
});

describe('dimensional analysis (exercise class 1, pp. 6–8)', () => {
  it('exercise 4: 78 kcal = 3.3×10⁵ J', () => {
    const r = convert({ value: 78, unit: 'kcal' }, [factor(1000, 'cal', 1, 'kcal'), factor(4.184, 'J', 1, 'cal')]);
    expect(r.unit).toBe('J');
    expect(r.value).toBeCloseTo(326352, 0);
    expect(r.value / 1e5).toBeCloseTo(3.3, 1);
    expect(unitPath({ value: 78, unit: 'kcal' }, [factor(1000, 'cal', 1, 'kcal'), factor(4.184, 'J', 1, 'cal')])).toEqual(['kcal', 'cal', 'J']);
  });
  it('exercise 2: 7.4 km/s in 5.0 ms is 37 m', () => {
    const r = convert({ value: 7.4, unit: 'km' }, [factor(1000, 'm', 1, 'km')]);
    expect(r.value * 5.0e-3).toBeCloseTo(37, 5);
  });
  it('exercise 5: the fuel mass is 3.7×10³ tons', () => {
    const V = Math.PI * 4.5 ** 2 * 70; // m³
    const kg = convert({ value: V, unit: 'm3' }, [factor(1000, 'L', 1, 'm3'), factor(0.83, 'kg', 1, 'L')]);
    expect(kg.unit).toBe('kg');
    expect(kg.value / 1000).toBeCloseTo(3700, -2);
  });
  it('a factor must cancel the running unit', () => { expect(() => convert({ value: 1, unit: 'g' }, [factor(1, 'J', 1, 'cal')])).toThrow(); });
  it('prefixes of exercise 3: nano 10⁻⁹, micro 10⁻⁶, pico 10⁻¹²', () => {
    const e = (s: string) => PREFIXES.find((p) => p.en === s)!.exp;
    expect([e('nano'), e('micro'), e('pico')]).toEqual([-9, -6, -12]);
  });
});
