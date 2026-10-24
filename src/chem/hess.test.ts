import { describe, expect, it } from 'vitest';
import { HESS_EXAMPLES, coef, formationHessRoute, formationTable, waterRoute } from './hess';
import { chemTex } from './tex';
import { dHrxn, parseReaction } from './thermo';

describe('Hess routes (slides 25, 28)', () => {
  it('water route: levels 0, −483.6, −571.6; total −571.6 (slide prints −572)', () => {
    const r = waterRoute();
    expect(r.levels.map((l) => l.H)).toEqual([0, -483.6, -571.6]);
    expect(r.total).toBeCloseTo(-571.6, 9);
    expect(r.steps.map((s) => s.dH)).toEqual([-483.6, -88]);
  });
  it('propane: reactants → elements → 3 CO₂ + 4 H₂ + 2 O₂ → products, exactly the levels of slide 28', () => {
    const r = formationHessRoute(parseReaction('C3H8(g) + 5 O2(g) -> 3 CO2(g) + 4 H2O(l)'));
    expect(r.levels).toHaveLength(4);
    expect(r.levels[0].tex).toBe(chemTex('C3H8(g) + 5 O2(g)'));
    expect(r.levels[1].tex).toBe(chemTex('3 C(graphite) + 4 H2(g) + 5 O2(g)')); // «Elements»
    expect(r.levels[2].tex).toBe(chemTex('3 CO2(g) + 4 H2(g) + 2 O2(g)'));
    expect(r.levels[3].tex).toBe(chemTex('3 CO2(g) + 4 H2O(l)'));
    const H = r.levels.map((l) => l.H);
    expect(H[0]).toBe(0); expect(H[1]).toBeCloseTo(103.85, 9); expect(H[2]).toBeCloseTo(103.85 - 1180.5, 9); expect(H[3]).toBeCloseTo(-2219.85, 9);
    expect(r.steps.map((s) => s.kind)).toEqual(['unform', 'form', 'form']);
  });
  it('the last level is always the product side and its H equals ΔH°_rxn, for every example', () => {
    for (const ex of HESS_EXAMPLES) {
      const r = ex.route();
      expect(r.levels[r.levels.length - 1].H, ex.id).toBeCloseTo(dHrxn(ex.rxn!), 9);
      expect(r.total, ex.id).toBeCloseTo(dHrxn(ex.rxn!), 9);
      expect(r.levels[r.levels.length - 1].tex, ex.id).toBe(r.productsTex);
      expect(r.levels[0].H).toBe(0);
      // levels are the partial sums of the steps
      let H = 0;
      r.steps.forEach((s, i) => { H += s.dH; expect(r.levels[i + 1].H, `${ex.id} ${i}`).toBeCloseTo(H, 9); });
    }
  });
  it('atom bookkeeping: every intermediate level keeps all atoms (checked via the formula strings)', () => {
    // CaO + 2 HF: after unforming CaO the level contains Ca and ½ O₂; after unforming 2 HF: H₂ and F₂ as well
    const r = formationHessRoute(parseReaction('CaO(s) + 2 HF(g) -> CaF2(s) + H2O(g)'));
    expect(r.levels[1].tex).toBe(chemTex('2 HF(g) + 1/2 O2(g) + Ca(s)'));
    expect(r.levels[2].tex).toBe(chemTex('H2(g) + 1/2 O2(g) + F2(g) + Ca(s)'));
    expect(r.levels[3].tex).toBe(chemTex('CaF2(s) + H2(g) + 1/2 O2(g)'));
    expect(r.levels[4].tex).toBe(chemTex('CaF2(s) + H2O(g)'));
  });
  it('iron oxide: elementary reactant C(s) and element product Fe(s) take no step of their own', () => {
    const r = formationHessRoute(parseReaction('Fe2O3(s) + 3 C(s) -> 2 Fe(s) + 3 CO(g)'));
    expect(r.steps.map((s) => s.species)).toEqual(['Fe2O3(s)', 'CO(g)']);
    expect(r.steps[0].dH).toBeCloseTo(822.16, 9); expect(r.steps[1].dH).toBeCloseTo(-331.5, 9);
    expect(r.total).toBeCloseTo(490.66, 9);
    expect(r.levels[1].tex).toBe(chemTex('3 C(graphite) + 3/2 O2(g) + 2 Fe(s)'));
  });
  it('methanol: +110.5 then −201.2 → −90.7 kJ', () => {
    const r = formationHessRoute(parseReaction('CO(g) + 2 H2(g) -> CH3OH(g)'));
    expect(r.steps.map((s) => s.dH)).toEqual([110.5, -201.2]);
    expect(r.total).toBeCloseTo(-90.7, 9);
  });
  it('coefficients are written as the lecture does', () => {
    expect([coef(1), coef(2), coef(1.5), coef(0.5), coef(1 / 3)]).toEqual(['', '2', '3/2', '1/2', '1/3']);
  });
});

describe('table of slide 29', () => {
  it('propane: −(−103.85) + 3(−393.5) + 4(−285.8) = −2219.85', () => {
    const t = formationTable(parseReaction('C3H8(g) + 5 O2(g) -> 3 CO2(g) + 4 H2O(l)'));
    expect(t.rows.map((r) => r.contribution)).toEqual([103.85, 0, -1180.5, -1143.2]);
    expect(t.total).toBeCloseTo(-2219.85, 9);
  });
});
