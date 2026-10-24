import { describe, expect, it } from 'vitest';
import { ANIONS, CATIONS, anion, cation } from './ions';
import { CHART_ANIONS, solubility } from './solubility';
import { metathesis, neutralisation, ACIDS, BASES } from './precip';
import { oxidationNumbers, oxValue } from './oxnum';
import { SERIES, acidMolecular, acidNet, displacement, reactsWithAcid, reducesCation } from './activity';
import { parseFormula } from './formula';
import { balance } from './balance';
import { molarMass } from './formula';

const S = (c: [string, number], a: [string, number]) => solubility(cation(...c), anion(...a));

describe('solubility chart (slide 16)', () => {
  it('exercise 3, example 2: Hg₂SO₄ no, NH₄OH yes, Ni(CH₃COO)₂ yes, AgNO₃ yes, FeCO₃ no', () => {
    expect(S(['Hg2', 2], ['SO4', -2]).soluble).toBe(false);
    expect(S(['NH4', 1], ['OH', -1]).soluble).toBe(true);
    expect(S(['Ni', 2], ['CH3COO', -1]).soluble).toBe(true);
    expect(S(['Ag', 1], ['NO3', -1]).soluble).toBe(true);
    expect(S(['Fe', 2], ['CO3', -2]).soluble).toBe(false);
  });
  it('exceptions are flagged', () => {
    expect(S(['Ag', 1], ['Cl', -1])).toMatchObject({ soluble: false, exception: true });
    expect(S(['Na', 1], ['Cl', -1])).toMatchObject({ soluble: true, exception: false });
    expect(S(['Na', 1], ['CO3', -2])).toMatchObject({ soluble: true, exception: true });
    expect(S(['Ca', 2], ['CO3', -2])).toMatchObject({ soluble: false, exception: false });
    expect(S(['Ba', 2], ['OH', -1]).soluble).toBe(true);
    expect(S(['Ca', 2], ['SO4', -2]).soluble).toBe(true);
    expect(S(['Pb', 2], ['I', -1]).soluble).toBe(false);
  });
  it('anions that are not on the chart give null', () => {
    expect(S(['Ca', 2], ['F', -1]).soluble).toBeNull();
    expect(S(['Na', 1], ['ClO4', -1]).soluble).toBeNull();
  });
  it('every alkali metal and ammonium compound of the chart dissolves', () => {
    for (const a of CHART_ANIONS) for (const c of CATIONS.filter((x) => ['Li', 'Na', 'K', 'Cs', 'NH4'].includes(x.f) && x.z === 1)) {
      const an = ANIONS.find((x) => x.f === a)!;
      expect(solubility(c, an).soluble, `${c.f}${a}`).toBe(true);
    }
  });
});

describe('precipitation (slides 13–15, exercise 3)', () => {
  const ag = cation('Ag', 1), k = cation('K', 1), no3 = anion('NO3', -1), cl = anion('Cl', -1);
  it('AgNO₃ + KCl: molecular, complete ionic and net ionic equation of the slides', () => {
    const m = metathesis(ag, no3, k, cl);
    expect(m.reacts).toBe(true);
    expect(m.molecular).toBe('AgNO3(aq) + KCl(aq) -> AgCl(s) + KNO3(aq)');
    expect(m.complete).toBe('Ag^+(aq) + NO3^-(aq) + K^+(aq) + Cl^-(aq) -> AgCl(s) + K^+(aq) + NO3^-(aq)');
    expect(m.net).toBe('Ag^+(aq) + Cl^-(aq) -> AgCl(s)');
    expect(m.spectatorKeys.sort()).toEqual(['K^+(aq)', 'NO3^-(aq)']);
  });
  it('example 3: Mg(NO₃)₂ + 2 NaOH → Mg(OH)₂(s) + 2 NaNO₃', () => {
    const m = metathesis(cation('Mg', 2), no3, cation('Na', 1), anion('OH', -1));
    expect(m.molecular).toBe('Mg(NO3)2(aq) + 2 NaOH(aq) -> Mg(OH)2(s) + 2 NaNO3(aq)');
    expect(m.net).toBe('Mg^2+(aq) + 2 OH^-(aq) -> Mg(OH)2(s)');
  });
  it('bonus 2: only KOH + MgSO₄ gives a precipitate (Mg(OH)₂); NaOH + KNO₃ and NH₄Cl + Rb₂CO₃ do not', () => {
    expect(metathesis(cation('K', 1), anion('OH', -1), cation('Mg', 2), anion('SO4', -2))).toMatchObject({ reacts: true });
    expect(metathesis(cation('K', 1), anion('OH', -1), cation('Mg', 2), anion('SO4', -2)).precipitates.map((p) => p.f)).toEqual(['Mg(OH)2']);
    expect(metathesis(cation('Na', 1), anion('OH', -1), cation('K', 1), no3).reacts).toBe(false);
    expect(metathesis(cation('NH4', 1), cl, cation('Cs', 1), anion('CO3', -2)).reacts).toBe(false); // Rb is not in the ion table; Cs behaves the same
  });
  it('a compound that does not dissolve cannot be mixed as a solution', () => {
    expect(() => metathesis(ag, cl, k, no3)).toThrow();
  });
  it('limescale (slide 21): Ca²⁺ + CO₃²⁻ → CaCO₃(s); soap scum (slide 13): Ca(C₁₇H₃₅COO)₂ is balanced', () => {
    expect(balance(['Na(C17H35COO)', 'CaCl2'], ['Ca(C17H35COO)2', 'NaCl'])).toEqual([2, 1, 1, 2]);
    expect(metathesis(cation('Ca', 2), no3, cation('Na', 1), anion('CO3', -2)).net).toBe('Ca^2+(aq) + CO3^2-(aq) -> CaCO3(s)');
  });
  it('every reaction conserves atoms and charge in the molecular equation', () => {
    const cs = CATIONS.filter((c) => ['Na', 'K', 'Mg', 'Ca', 'Ag', 'Pb', 'Zn', 'Cu', 'Al', 'Fe', 'Ba', 'NH4'].includes(c.f));
    const as = ANIONS.filter((a) => CHART_ANIONS.includes(a.f));
    let n = 0;
    for (const A of cs) for (const B of cs) for (const X of as) for (const Y of as) {
      if (A === B || X === Y || solubility(A, X).soluble !== true || solubility(B, Y).soluble !== true) continue;
      const m = metathesis(A, X, B, Y);
      const count = (side: typeof m.reaction.reactants) => { const t: Record<string, number> = {}; for (const { coef, sp } of side) for (const [e, c] of Object.entries(parseFormula(sp.f))) t[e] = (t[e] ?? 0) + coef * c; return t; };
      expect(count(m.reaction.reactants)).toEqual(count(m.reaction.products));
      n++;
    }
    expect(n).toBeGreaterThan(100);
  });
});

describe('acids and bases (slides 17–21, exercise 3)', () => {
  const acid = (f: string) => ACIDS.find((a) => a.f === f)!, base = (f: string) => BASES.find((b) => b.f === f)!;
  it('HCl + NaOH (slide 20)', () => {
    const n = neutralisation(acid('HCl'), base('NaOH'));
    expect(n.molecular).toBe('HCl(aq) + NaOH(aq) -> NaCl(aq) + H2O(l)');
    expect(n.complete).toBe('H^+(aq) + Cl^-(aq) + Na^+(aq) + OH^-(aq) -> Na^+(aq) + Cl^-(aq) + H2O(l)');
    expect(n.net).toBe('H^+(aq) + OH^-(aq) -> H2O(l)');
  });
  it('H₂SO₄ + Ca(OH)₂ (exercise 3, p. 6): net ionic 2 H⁺ + 2 OH⁻ → 2 H₂O', () => {
    const n = neutralisation(acid('H2SO4'), base('Ca(OH)2'));
    expect(n.molecular).toBe('H2SO4(aq) + Ca(OH)2(aq) -> CaSO4(aq) + 2 H2O(l)');
    expect(n.net).toBe('2 H^+(aq) + 2 OH^-(aq) -> 2 H2O(l)');
  });
  it('HCl + Al(OH)₃ (exercise 3, p. 7): 3 HCl + Al(OH)₃ → AlCl₃ + 3 H₂O; the solid base stays in the net ionic equation', () => {
    const n = neutralisation(acid('HCl'), base('Al(OH)3'));
    expect(n.molecular).toBe('3 HCl(aq) + Al(OH)3(s) -> AlCl3(aq) + 3 H2O(l)');
    expect(n.net).toBe('3 H^+(aq) + Al(OH)3(s) -> Al^3+(aq) + 3 H2O(l)');
    expect(n.baseSolid).toBe(true);
  });
  it('ammonia needs no hydroxide: NH₃ + HCl → NH₄Cl, net H⁺ + NH₃ → NH₄⁺', () => {
    const n = neutralisation(acid('HCl'), base('NH3'));
    expect(n.molecular).toBe('HCl(aq) + NH3(aq) -> NH4Cl(aq)');
    expect(n.net).toBe('H^+(aq) + NH3(aq) -> NH4^+(aq)');
  });
  it('barium sulfate is a solid: Ba(OH)₂ + H₂SO₄ has no spectators', () => {
    const n = neutralisation(acid('H2SO4'), base('Ba(OH)2'));
    expect(n.saltSolid).toBe(true);
    expect(n.net).toContain('BaSO4(s)');
  });
  it('limescale reaction (slide 21) is balanced', () => {
    expect(balance(['CaCO3', 'CH3COOH'], ['H2O', 'Ca(CH3COO)2', 'CO2'])).toEqual([1, 2, 1, 1, 1]);
  });
  it('NaOH(s) etc. have sane molar masses', () => { expect(molarMass('NaOH')).toBeCloseTo(40.0, 1); });
});

describe('oxidation numbers (slide 26, exercise 3)', () => {
  const ox = (f: string, q = 0) => { const r = oxidationNumbers(f, q)!; return Object.fromEntries(Object.entries(r).map(([e, v]) => [e, oxValue(v)])); };
  it('exercise 5: H₂O +1 −2; O₂ 0; Na⁺ +1; MgCl₂ +2 −1; CO₂ +4 −2', () => {
    expect(ox('H2O')).toEqual({ H: 1, O: -2 });
    expect(ox('O2')).toEqual({ O: 0 });
    expect(ox('Na', 1)).toEqual({ Na: 1 });
    expect(ox('MgCl2')).toEqual({ Mg: 2, Cl: -1 });
    expect(ox('CO2')).toEqual({ C: 4, O: -2 });
  });
  it('exercise 6: NH₃ is N −3, H +1; Fe(NO₃)₂ is Fe +2, N +5, O −2; Al(NO₃)₃', () => {
    expect(ox('NH3')).toEqual({ N: -3, H: 1 });
    expect(ox('Fe(NO3)2')).toEqual({ Fe: 2, N: 5, O: -2 });
    expect(ox('Al(NO3)3')).toEqual({ Al: 3, N: 5, O: -2 });
    expect(ox('N2')).toEqual({ N: 0 });
  });
  it('bonus 1: sulfur in H₂S −2, S₈ 0, SCl₂ +2, Na₂SO₃ +4, SO₄²⁻ +6', () => {
    expect(ox('H2S').S).toBe(-2);
    expect(ox('S8').S).toBe(0);
    expect(ox('SCl2').S).toBe(2);
    expect(ox('Na2SO3').S).toBe(4);
    expect(ox('SO4', -2).S).toBe(6);
  });
  it('slide 26: peroxide −1, hydride −1, chlorine with oxygen is positive, Mg + 2 HCl → MgCl₂ + H₂', () => {
    expect(ox('H2O2')).toEqual({ H: 1, O: -1 });
    expect(ox('NaH')).toEqual({ Na: 1, H: -1 });
    expect(ox('ClO4', -1).Cl).toBe(7);
    expect(ox('HCl')).toEqual({ H: 1, Cl: -1 });
    expect(ox('Mg')).toEqual({ Mg: 0 });
    expect(ox('H2')).toEqual({ H: 0 });
    expect(ox('Ca(OH)2')).toEqual({ Ca: 2, O: -2, H: 1 });
  });
  it('more: KMnO₄, Cr₂O₇²⁻, NH₄⁺, NO₃⁻, HSO₄⁻, CaCO₃; average Fe₃O₄ = 8/3', () => {
    expect(ox('KMnO4').Mn).toBe(7);
    expect(ox('Cr2O7', -2).Cr).toBe(6);
    expect(ox('NH4', 1).N).toBe(-3);
    expect(ox('NO3', -1).N).toBe(5);
    expect(ox('HSO4', -1).S).toBe(6);
    expect(ox('CaCO3').C).toBe(4);
    expect(ox('Fe3O4').Fe).toBeCloseTo(8 / 3, 12);
    expect(ox('O2', -2).O).toBe(-1);
  });
  it('the sum of the oxidation numbers is the net charge', () => {
    for (const [f, q] of [['H2SO4', 0], ['Cr2O7', -2], ['KMnO4', 0], ['Fe(NO3)2', 0], ['NH4', 1], ['Al2(SO4)3', 0]] as [string, number][]) {
      const r = oxidationNumbers(f, q)!;
      expect(Object.values(r).reduce((s, e) => s + oxValue(e) * e.count, 0)).toBeCloseTo(q, 12);
    }
  });
});

describe('activity series (slides 27–28, exercise 3)', () => {
  it('Table 4.5 order and charges; hydrogen between lead and copper', () => {
    expect(SERIES.map((m) => m.symbol).join(' ')).toBe('Li K Ba Ca Na Mg Al Mn Zn Cr Fe Co Ni Sn Pb H Cu Ag Hg Pt Au');
    expect(SERIES.map((m) => m.z).join('')).toBe('112212322322222121223');
    expect(SERIES.find((m) => m.symbol === 'Cr')!.z).toBe(3);
    expect(SERIES.find((m) => m.symbol === 'Au')!.z).toBe(3);
  });
  it('slide 28: Cu + 2 Ag⁺ → Cu²⁺ + 2 Ag', () => {
    expect(displacement('Cu', 'Ag')!.eq).toBe('Cu(s) + 2 Ag^+(aq) -> Cu^2+(aq) + 2 Ag(s)');
    expect(displacement('Ag', 'Cu')).toBeNull();
  });
  it('slide 28: Ni + 2 HCl → NiCl₂ + H₂; net Ni + 2 H⁺ → Ni²⁺ + H₂', () => {
    expect(acidMolecular('Ni')).toBe('Ni(s) + 2 HCl(aq) -> NiCl2(aq) + H2(g)');
    expect(acidNet('Ni')!.eq).toBe('Ni(s) + 2 H^+(aq) -> Ni^2+(aq) + H2(g)');
    expect(acidNet('Na')!.eq).toBe('2 Na(s) + 2 H^+(aq) -> 2 Na^+(aq) + H2(g)');
    expect(acidMolecular('Al')).toBe('2 Al(s) + 6 HCl(aq) -> 2 AlCl3(aq) + 3 H2(g)');
    expect(acidNet('Cu')).toBeNull();
  });
  it('exercise 7: only Fe with Pb²⁺ reacts', () => {
    expect([['Ca', 'K'], ['Fe', 'Al'], ['Ag', 'Cu'], ['Fe', 'Pb']].map(([m, c]) => reducesCation(m, c))).toEqual([false, false, false, true]);
  });
  it('exercise 8: Fe + Cu²⁺ yes; Zn + Mg²⁺ NR; Sn + HBr yes; Li + Na⁺ → Li⁺ + Na', () => {
    expect(displacement('Fe', 'Cu')!.eq).toBe('Fe(s) + Cu^2+(aq) -> Fe^2+(aq) + Cu(s)');
    expect(displacement('Zn', 'Mg')).toBeNull();
    expect(reactsWithAcid('Sn')).toBe(true);
    expect(displacement('Li', 'Na')!.eq).toBe('Li(s) + Na^+(aq) -> Li^+(aq) + Na(s)');
  });
  it('electrons balance: Al + Cu²⁺ → 2 Al³⁺ + 3 Cu with 6 electrons; every displacement conserves charge', () => {
    const r = displacement('Al', 'Cu')!;
    expect(r.eq).toBe('2 Al(s) + 3 Cu^2+(aq) -> 2 Al^3+(aq) + 3 Cu(s)');
    expect(r.electrons).toBe(6);
    for (const A of SERIES) for (const B of SERIES) {
      if (A.symbol === 'H' || B.symbol === 'H') continue;
      const d = displacement(A.symbol, B.symbol);
      if (d) { expect(d.coefOx * A.z).toBe(d.coefRed * B.z); expect(d.electrons).toBe(d.coefOx * A.z); }
    }
  });
});
