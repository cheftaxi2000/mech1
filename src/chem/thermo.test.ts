import { describe, expect, it } from 'vitest';
import {
  HF, SLIDE23, WATER_CS, calorimeterDT, calorimeterQrxn, deltaE, dEfromdH, dHfromdE, dHrxn, dnGas, energyKind, enthalpyBars,
  equilibriumTemp, formationRoute, heatKind, heatMolar, heatSpecific, hessLevels, hf, parseReaction, pistonWorkJ, pvTermKJ, pvWorkJ,
} from './thermo';

const rx = (s: string) => dHrxn(parseReaction(s));

describe('first law and sign convention (slides 12–13, exercise 4 Ex. 1)', () => {
  it('ΔE = q + w', () => expect(deltaE(30, -12)).toBe(18));
  it('heat kinds: q > 0 endothermic (ice melting), q < 0 exothermic (combustion)', () => {
    expect(heatKind(5)).toBe('endothermic'); expect(heatKind(-5)).toBe('exothermic'); expect(heatKind(0)).toBe('neutral');
  });
  it('exercise 4, Ex. 1: the three boxes (relative arrow lengths: q 1, w 2 / w 2 / q 2 = w 2)', () => {
    // (i) q leaves (−1), w enters (+2); (ii) only w enters (+2); (iii) q enters (+2), w leaves (−2)
    const boxes = [{ q: -1, w: 2 }, { q: 0, w: 2 }, { q: 2, w: -2 }];
    const endo = boxes.map((b, i) => (b.q > 0 ? i + 1 : 0)).filter(Boolean), exo = boxes.map((b, i) => (b.q < 0 ? i + 1 : 0)).filter(Boolean);
    expect(endo).toEqual([3]); expect(exo).toEqual([1]);
    expect(boxes.map((b, i) => (energyKind(deltaE(b.q, b.w)) === 'gain' ? i + 1 : 0)).filter(Boolean)).toEqual([1, 2]);
    expect(boxes.filter((b) => deltaE(b.q, b.w) < 0)).toHaveLength(0);
    expect(boxes.map((b, i) => (energyKind(deltaE(b.q, b.w)) === 'none' ? i + 1 : 0)).filter(Boolean)).toEqual([3]);
  });
});

describe('pressure–volume work (slide 16)', () => {
  it('w = −F·Δx = −P·A·Δx = −P·ΔV', () => {
    const P = 101325, A = 0.01, dx = 0.2; // 1 atm, 100 cm², 20 cm
    const r = pistonWorkJ(P, A, dx);
    expect(r.F).toBeCloseTo(P * A, 9);
    expect(r.w).toBeCloseTo(-P * r.dV, 9);
    expect(r.dV).toBeCloseTo(0.002, 12); // 2 L
    expect(r.w).toBeCloseTo(-202.65, 9);
  });
  it('same result with P in atm and V in L (1 L·atm = 101.325 J); compression gives w > 0', () => {
    expect(pvWorkJ(1, 2)).toBeCloseTo(-202.65, 9);
    expect(pvWorkJ(1, -2)).toBeCloseTo(202.65, 9);
  });
});

describe('enthalpy (slides 16–18)', () => {
  it('ΔH = ΔE + PΔV = q_p + w + (−w) = q_p for any split of ΔE into q and w', () => {
    for (const [qp, w] of [[-572, 7.43], [10, -3], [0, 0], [4.2, 4.2]]) {
      const b = enthalpyBars(qp, w);
      expect(b.dH).toBeCloseTo(qp, 12); expect(b.PdV).toBeCloseTo(-w, 12); expect(b.dE).toBeCloseTo(qp + w, 12);
    }
  });
  it('ΔH − ΔE = Δn·RT for ideal gases: 2 H₂ + O₂ → 2 H₂O(l) at 298.15 K, Δn = −3', () => {
    const rxn = parseReaction('2 H2(g) + O2(g) -> 2 H2O(l)');
    expect(dnGas(rxn)).toBe(-3);
    expect(pvTermKJ(-3, 298.15)).toBeCloseTo(-7.437, 3);
    expect(dEfromdH(-571.6, -3, 298.15)).toBeCloseTo(-564.16, 2);
    expect(dHfromdE(dEfromdH(-571.6, -3, 298.15), -3, 298.15)).toBeCloseTo(-571.6, 9);
  });
  it('ΔH ≈ ΔE when no gas is formed or used (small ΔV)', () => {
    const rxn = parseReaction('CO(g) + 2 H2(g) -> CH3OH(g)');
    expect(dnGas(rxn)).toBe(-2);
    expect(parseReaction('CaO(s) + CO2(g) -> CaCO3(s)')).toBeDefined();
    expect(dnGas(parseReaction('CaCO3(s) -> CaO(s) + CO2(g)'))).toBe(1);
    expect(dnGas(parseReaction('Fe2O3(s) + 3 C(s) -> 2 Fe(s) + 3 CO(g)'))).toBe(3);
  });
});

describe('calorimetry (slides 20–22, exercise 4 Ex. 6)', () => {
  it('q = n·C_m·ΔT and q = m·C_s·ΔT, sign check ΔT > 0 ⇒ q > 0', () => {
    expect(heatSpecific(100, WATER_CS, 1)).toBeCloseTo(418, 9);
    expect(heatSpecific(100, WATER_CS, -2)).toBeLessThan(0);
    expect(heatMolar(2, 75.3, 10)).toBeCloseTo(1506, 9); // 2 mol of liquid water
  });
  it('coffee cup calorimeter: exothermic reaction warms the water, endothermic cools it', () => {
    expect(calorimeterDT(-10, 100)).toBeGreaterThan(0);
    expect(calorimeterDT(+10, 100)).toBeLessThan(0);
    expect(calorimeterDT(-10, 100)).toBeCloseTo(23.923, 3);
    expect(calorimeterQrxn(calorimeterDT(-3.7, 250), 250)).toBeCloseTo(-3.7, 12);
  });
  it('exercise 6: coffee 180 g at 95 °C + silver spoon 45 g at 25 °C → 94.0 °C (the TA wrote 89 °C: slip)', () => {
    const T = equilibriumTemp([{ m: 180, Cs: 4.18, T: 95 }, { m: 45, Cs: 0.24, T: 25 }]);
    expect(T).toBeCloseTo(94.0, 1);
    expect(T).toBeCloseTo(71748 / 763.2, 9);
    expect(95 - T).toBeCloseTo(0.99, 2); // the coffee cools by about 1 K
    // check the balance of heats: q_coffee = −q_spoon
    expect(heatSpecific(180, 4.18, T - 95) + heatSpecific(45, 0.24, T - 25)).toBeCloseTo(0, 9);
    // the value 89 °C does not balance
    expect(Math.abs(heatSpecific(180, 4.18, 89 - 95) + heatSpecific(45, 0.24, 89 - 25))).toBeGreaterThan(1000);
  });
});

describe('Hess’s law and enthalpies of formation (slides 23–29, exercises 3–5)', () => {
  it('slides 23–25: −483.6 + (−88) = −572 (−571.6) kJ', () => {
    const { levels, total } = hessLevels([SLIDE23.dH1, SLIDE23.dH2]);
    expect(levels).toEqual([0, -483.6, -571.6]);
    expect(total).toBeCloseTo(-571.6, 9);
    expect(Math.round(total)).toBe(SLIDE23.dHrxn);
  });
  it('the numbers of slide 23 follow from the formation table', () => {
    expect(rx('2 H2(g) + O2(g) -> 2 H2O(g)')).toBeCloseTo(-483.6, 9);
    expect(rx('2 H2O(g) -> 2 H2O(l)')).toBeCloseTo(-88, 9);
    expect(rx('2 H2(g) + O2(g) -> 2 H2O(l)')).toBeCloseTo(-571.6, 9);
  });
  it('rules of slide 19: extensive, reverse reaction has the opposite sign', () => {
    const a = rx('2 H2(g) + O2(g) -> 2 H2O(l)');
    expect(rx('H2(g) + 1/2 O2(g) -> H2O(l)')).toBeCloseTo(a / 2, 9);
    expect(rx('2 H2O(l) -> 2 H2(g) + O2(g)')).toBeCloseTo(-a, 9);
    // the state matters: gas vs liquid water
    expect(rx('2 H2(g) + O2(g) -> 2 H2O(g)')).not.toBeCloseTo(a, 0);
  });
  it('slide 27: propane combustion −2220 kJ (with the table values −2219.85)', () => {
    const r = parseReaction('C3H8(g) + 5 O2(g) -> 3 CO2(g) + 4 H2O(l)');
    expect(dHrxn(r)).toBeCloseTo(-2219.85, 9);
    expect(Math.round(dHrxn(r))).toBe(-2220);
    // the rounded numbers printed on slide 27 give −2222, not −2220 (source slip CH-…)
    expect(-(-104) + 3 * -394 + 4 * -286).toBe(-2222);
    // slide 26 prints ΔH_f(propane) = −103.9, slide 28 uses 103.85
    expect(hf('C3H8(g)')).toBe(-103.85);
  });
  it('slide 28 / exercise 4: the three steps +103.85, −1181 (−1180.5), −1143 (−1143.2) add up to the red arrow', () => {
    const r = parseReaction('C3H8(g) + 5 O2(g) -> 3 CO2(g) + 4 H2O(l)');
    const route = formationRoute(r);
    expect(route.map((s) => s.species)).toEqual(['C3H8(g)', 'CO2(g)', 'H2O(l)']);
    expect(route.map((s) => s.kind)).toEqual(['unform', 'form', 'form']);
    const [d1, d2, d3] = route.map((s) => s.dH);
    expect(d1).toBeCloseTo(103.85, 9);
    expect(d2).toBeCloseTo(-1180.5, 9); expect(-Math.round(-d2)).toBe(-1181); // half away from zero, as printed
    expect(d3).toBeCloseTo(-1143.2, 9); expect(Math.round(d3)).toBe(-1143);
    expect(d1 + d2 + d3).toBeCloseTo(dHrxn(r), 9);
    expect(hessLevels(route.map((s) => s.dH)).total).toBeCloseTo(dHrxn(r), 9);
  });
  it('path independence: the route through the elements equals the direct sum for every reaction in the lesson', () => {
    for (const s of [
      '2 H2(g) + O2(g) -> 2 H2O(l)', 'CO(g) + 2 H2(g) -> CH3OH(g)', 'CaO(s) + 2 HF(g) -> CaF2(s) + H2O(g)',
      'Fe2O3(s) + 3 C(s) -> 2 Fe(s) + 3 CO(g)', 'CH4(g) + 2 O2(g) -> CO2(g) + 2 H2O(l)', 'C2H5OH(l) + 3 O2(g) -> 2 CO2(g) + 3 H2O(l)',
      'CaCO3(s) -> CaO(s) + CO2(g)', 'N2(g) + 3 H2(g) -> 2 NH3(g)',
    ]) {
      const r = parseReaction(s);
      expect(hessLevels(formationRoute(r).map((x) => x.dH)).total, s).toBeCloseTo(dHrxn(r), 9);
    }
  });
  it('exercise 4, Ex. 3: CO + 2 H₂ → CH₃OH(g): −90.7 kJ/mol', () => {
    expect(rx('CO(g) + 2 H2(g) -> CH3OH(g)')).toBeCloseTo(-90.7, 9);
  });
  it('exercise 4, Ex. 5: (a) −288.7 kJ/mol exothermic, (b) +490.7 kJ/mol endothermic', () => {
    const a = rx('CaO(s) + 2 HF(g) -> CaF2(s) + H2O(g)'), b = rx('Fe2O3(s) + 3 C(s) -> 2 Fe(s) + 3 CO(g)');
    expect(a).toBeCloseTo(-288.7, 9); expect(heatKind(a)).toBe('exothermic');
    expect(b).toBeCloseTo(490.66, 9); expect(b.toFixed(1)).toBe('490.7'); expect(heatKind(b)).toBe('endothermic');
  });
  it('elements have ΔH_f = 0; unknown species are rejected', () => {
    for (const e of ['H2(g)', 'O2(g)', 'N2(g)', 'C(graphite)', 'Fe(s)']) expect(hf(e)).toBe(0);
    expect(() => hf('XeF6(s)')).toThrow();
    expect(Object.keys(HF).length).toBeGreaterThan(35);
  });
  it('parser: coefficients, fractions, single species', () => {
    const r = parseReaction('H2(g) + 1/2 O2(g) -> H2O(l)');
    expect(r.reactants).toEqual([{ n: 1, species: 'H2(g)' }, { n: 0.5, species: 'O2(g)' }]);
    expect(r.products).toEqual([{ n: 1, species: 'H2O(l)' }]);
    expect(() => parseReaction('H2 O2')).toThrow();
  });
  it('energy conservation of an exothermic reaction: ΔH < 0 means heat leaves, calorimeter water warms', () => {
    const q = rx('C3H8(g) + 5 O2(g) -> 3 CO2(g) + 4 H2O(l)');
    expect(calorimeterDT(q, 1000)).toBeGreaterThan(0);
  });
});
