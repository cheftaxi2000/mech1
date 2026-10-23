import { describe, expect, it } from 'vitest';
import { ELEMENTS, bySymbol, byZ } from './elements';
import { massFractions, molarMass, parseFormula } from './formula';
import { balance } from './balance';
import { chemTex } from './tex';
import { N_A, R, R_L_ATM, ATM_PA, T_ZERO_C } from './constants';

describe('elements', () => {
  it('has unique, ordered atomic numbers and sane masses', () => {
    const zs = ELEMENTS.map((e) => e.Z);
    expect(new Set(zs).size).toBe(zs.length);
    expect(zs).toEqual([...zs].sort((a, b) => a - b));
    expect(ELEMENTS.find((e) => e.Z === 26)!.symbol).toBe('Fe');
  });
  it('places elements in the periodic table', () => {
    const pos = (s: string) => [bySymbol(s).period, bySymbol(s).group];
    expect(pos('H')).toEqual([1, 1]);
    expect(pos('He')).toEqual([1, 18]);
    expect(pos('Li')).toEqual([2, 1]);
    expect(pos('B')).toEqual([2, 13]);
    expect(pos('O')).toEqual([2, 16]);
    expect(pos('Ne')).toEqual([2, 18]);
    expect(pos('Na')).toEqual([3, 1]);
    expect(pos('Cl')).toEqual([3, 17]);
    expect(pos('K')).toEqual([4, 1]);
    expect(pos('Fe')).toEqual([4, 8]);
    expect(pos('Zn')).toEqual([4, 12]);
    expect(pos('Se')).toEqual([4, 16]);
    expect(pos('Ag')).toEqual([5, 11]);
    expect(pos('Xe')).toEqual([5, 18]);
    expect(pos('Au')).toEqual([6, 11]);
    expect(byZ(8)!.symbol).toBe('O');
    expect(() => bySymbol('Xx')).toThrow();
  });
});

describe('formulas', () => {
  it('parses nested groups', () => {
    expect(parseFormula('H2O')).toEqual({ H: 2, O: 1 });
    expect(parseFormula('Ca(OH)2')).toEqual({ Ca: 1, O: 2, H: 2 });
    expect(parseFormula('Al2(SO4)3')).toEqual({ Al: 2, S: 3, O: 12 });
    expect(() => parseFormula('Ca(OH')).toThrow();
  });
  it('computes molar masses', () => {
    expect(molarMass('H2O')).toBeCloseTo(18.015, 3);
    expect(molarMass('CO2')).toBeCloseTo(44.009, 3);
    expect(molarMass('Ca(OH)2')).toBeCloseTo(74.092, 3);
    expect(molarMass('C3H8')).toBeCloseTo(44.097, 3);
  });
  it('mass fractions sum to one', () => {
    const f = massFractions('H2O');
    expect(f.H + f.O).toBeCloseTo(1, 12);
    expect(f.O).toBeCloseTo(0.888, 3);
  });
});

describe('balancing', () => {
  it('water', () => expect(balance(['H2', 'O2'], ['H2O'])).toEqual([2, 1, 2]));
  it('propane combustion', () => expect(balance(['C3H8', 'O2'], ['CO2', 'H2O'])).toEqual([1, 5, 3, 4]));
  it('rust', () => expect(balance(['Fe', 'O2'], ['Fe2O3'])).toEqual([4, 3, 2]));
  it('ammonia', () => expect(balance(['N2', 'H2'], ['NH3'])).toEqual([1, 3, 2]));
  it('methane', () => expect(balance(['CH4', 'O2'], ['CO2', 'H2O'])).toEqual([1, 2, 1, 2]));
  it('glucose', () => expect(balance(['C6H12O6', 'O2'], ['CO2', 'H2O'])).toEqual([1, 6, 6, 6]));
  it('rejects impossible equations', () => expect(balance(['H2'], ['O2'])).toBeNull());
});

describe('constants', () => {
  it('are mutually consistent', () => {
    expect(R / R_L_ATM).toBeCloseTo(ATM_PA / 1000, 1); // J per L·atm = 101.325
    expect(N_A * 1.380649e-23).toBeCloseTo(R, 4); // R = N_A k_B
    expect(T_ZERO_C).toBe(273.15);
  });
});

describe('chemTex', () => {
  it('subscripts and coefficients', () => {
    expect(chemTex('H2O')).toBe(String.raw`\mathrm{H_{2}O}`);
    expect(chemTex('2 H2 + O2 -> 2 H2O')).toBe(String.raw`\mathrm{2\,H_{2}\;+\;O_{2}\;\longrightarrow\;2\,H_{2}O}`);
    expect(chemTex('Ca(OH)2')).toBe(String.raw`\mathrm{Ca(OH)_{2}}`);
  });
  it('charges and states', () => {
    expect(chemTex('SO4^2-')).toBe(String.raw`\mathrm{SO_{4}^{2−}}`);
    expect(chemTex('Na^+')).toBe(String.raw`\mathrm{Na^{+}}`);
    expect(chemTex('H2O(l)')).toBe(String.raw`\mathrm{H_{2}O\,(l)}`);
  });
  it('renders in KaTeX without errors', async () => {
    const katex = (await import('katex')).default;
    for (const s of ['2 H2 + O2 -> 2 H2O(g)', 'Ag^+(aq) + Cl^-(aq) -> AgCl(s)', 'N2 + 3 H2 <=> 2 NH3', 'CuSO4·5 H2O'])
      expect(() => katex.renderToString(chemTex(s), { throwOnError: true, strict: 'error' })).not.toThrow();
  });
});
