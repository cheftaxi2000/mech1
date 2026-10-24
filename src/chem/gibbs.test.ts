import { describe, expect, it } from 'vitest';
import { PRESETS, REACTIONS, THERMO, caseOf, crossoverT, dSsurr, dSuniv, deltaRxn, gasCount, gibbs, minusTdS, spontaneousRange } from './gibbs';

const rx = (id: string) => REACTIONS.find((r) => r.id === id)!;

describe('ΔS of a reaction (slides 22–23)', () => {
  it('N2 + 3 H2 -> 2 NH3: −199 J/(mol K), gas molecules 4 -> 2', () => {
    expect(deltaRxn('S', rx('nh3'))).toBe(-199);
    expect(gasCount(rx('nh3').reactants)).toBe(4);
    expect(gasCount(rx('nh3').products)).toBe(2);
  });
  it('with the unrounded Appendix C values the result is −198 J/(mol K), as the lecture rounds', () => {
    const S = 2 * 192.5 - (191.5 + 3 * 130.58);
    expect(S).toBeCloseTo(-198.24, 2);
    expect(Math.abs(S - deltaRxn('S', rx('nh3')))).toBeLessThan(1);
  });
  it('entropy falls when gas molecules disappear (exercise 4d, 2e), rises when they appear', () => {
    expect(deltaRxn('S', rx('caco3'))).toBeCloseTo(-160.47, 2);
    expect(deltaRxn('S', rx('so3'))).toBeCloseTo(-189.6, 1);
    expect(deltaRxn('S', rx('o3'))).toBeCloseTo(139.8, 1);
  });
});

describe('why ΔS_sys is not enough (slide 24)', () => {
  const dH = deltaRxn('H', rx('nh3')), dS = deltaRxn('S', rx('nh3'));
  it('ΔH = −92.4 kJ, ΔS_surr = +310 J/K, ΔS_univ = +111 J/K', () => {
    expect(dH).toBeCloseTo(-92.4, 10);
    expect(dSsurr(dH, 298)).toBeCloseTo(310.07, 2);
    expect(Math.round(dSsurr(dH, 298))).toBe(310);
    expect(Math.round(dSuniv(dH, dS, 298))).toBe(111);
  });
  it('ΔS_univ changes sign at T = ΔH/ΔS ≈ 464 K', () => {
    expect(dSuniv(dH, dS, 464.3)).toBeCloseTo(0, 1);
    expect(dSuniv(dH, dS, 400)).toBeGreaterThan(0);
    expect(dSuniv(dH, dS, 600)).toBeLessThan(0);
  });
});

describe('ΔG = ΔH − TΔS (slides 25–26)', () => {
  it('−TΔS_univ equals ΔG_sys for any numbers (the algebra of slide 25)', () => {
    for (const [dH, dS, T] of [[-92.4, -199, 298], [50, 120, 400], [-5, 30, 100], [10, -10, 1000]]) {
      expect((-T * dSuniv(dH, dS, T)) / 1000).toBeCloseTo(gibbs(dH, dS, T), 10);
    }
  });
  it('NH3: ΔG = −33.1 kJ from ΔH and ΔS; −33.3 kJ from ΔG°f; the same up to rounding', () => {
    const dH = deltaRxn('H', rx('nh3')), dS = deltaRxn('S', rx('nh3'));
    expect(gibbs(dH, dS, 298)).toBeCloseTo(-33.098, 3);
    expect(deltaRxn('G', rx('nh3'))).toBeCloseTo(-33.32, 2);
    expect(Math.abs(gibbs(dH, dS, 298) - deltaRxn('G', rx('nh3')))).toBeLessThan(0.5);
  });
  it('ΔG°f route and ΔH − TΔS route agree within 1.5 kJ for all listed reactions at 298.15 K', () => {
    for (const r of REACTIONS) {
      const a = deltaRxn('G', r), b = gibbs(deltaRxn('H', r), deltaRxn('S', r), 298.15);
      expect(Math.abs(a - b), r.id).toBeLessThan(1.5);
    }
  });
});

describe('exercise class 5, p. 13', () => {
  it('Ex 6a: ΔG° = 2·ΔG°f(ZnO) = −636.4 kJ, spontaneous', () => {
    expect(deltaRxn('G', rx('zno'))).toBeCloseTo(-636.4, 10);
  });
  it('Ex 6b: ΔG° = 856.3 kJ from the table values (the slide has 848.3, CH-501), nonspontaneous either way', () => {
    expect(deltaRxn('G', rx('nabr'))).toBeCloseTo(856.34, 2);
    expect(deltaRxn('G', rx('nabr'))).toBeGreaterThan(0);
  });
  it('Ex 7: ΔG°(298 K) = −794.8 kJ (slide: −795); crossover T = 5115 K', () => {
    expect(gibbs(-844, -165, 298)).toBeCloseTo(-794.83, 2);
    expect(Math.round(gibbs(-844, -165, 298))).toBe(-795);
    expect(crossoverT(-844, -165)).toBeCloseTo(5115.15, 2);
    expect(Math.round(crossoverT(-844, -165)!)).toBe(5115);
    expect(gibbs(-844, -165, 5000)).toBeLessThan(0);
    expect(gibbs(-844, -165, 5300)).toBeGreaterThan(0);
  });
});

describe('four sign cases (slide 29) and the crossover temperature', () => {
  it('classifies the table rows', () => {
    expect(caseOf(-1, 1)).toBe(1); expect(caseOf(1, -1)).toBe(2); expect(caseOf(-1, -1)).toBe(3); expect(caseOf(1, 1)).toBe(4);
    expect(caseOf(0, 1)).toBeNull();
  });
  it('agrees with a numerical scan of ΔG over T = 1…10000 K', () => {
    for (const [dH, dS] of [[-10, 20], [10, -20], [-10, -20], [10, 20], [-92.4, -199], [178.3, 160.5]]) {
      const r = spontaneousRange(dH, dS);
      for (const T of [1, 10, 100, 273, 500, 1000, 2000, 5000, 10000]) {
        const spont = gibbs(dH, dS, T) < 0;
        const pred = r.kind === 'all' ? true : r.kind === 'none' ? false : r.kind === 'below' ? T < r.T : T > r.T;
        expect(pred, `${dH},${dS},${T}`).toBe(spont);
      }
    }
  });
  it('ΔG = 0 exactly at the crossover temperature', () => {
    for (const [dH, dS] of [[-92.4, -199], [178.3, 160.5], [6.01, 22]]) expect(gibbs(dH, dS, crossoverT(dH, dS)!)).toBeCloseTo(0, 10);
    expect(crossoverT(-10, 5)).toBeNull();
  });
  it('lines of ΔG against T start at ΔH (T = 0) with slope −ΔS', () => {
    expect(gibbs(-20, 50, 0)).toBe(-20);
    expect(gibbs(-20, 50, 100) - gibbs(-20, 50, 0)).toBeCloseTo(minusTdS(50, 100), 12);
  });
  it('presets: ozone (cases 1 and 2), ice (3 and 4), NH3 (3, 464 K), lead sulfide (3, 5115 K)', () => {
    const p = (id: string) => PRESETS.find((x) => x.id === id)!;
    expect(p('o3-decay').dH).toBeCloseTo(-284.6, 10);
    expect(p('o3-decay').dS).toBeCloseTo(139.8, 10);
    expect(caseOf(p('o3-decay').dH, p('o3-decay').dS)).toBe(1);
    expect(caseOf(p('o3-form').dH, p('o3-form').dS)).toBe(2);
    expect(caseOf(p('freeze').dH, p('freeze').dS)).toBe(3);
    expect(caseOf(p('melt').dH, p('melt').dS)).toBe(4);
    expect(crossoverT(p('melt').dH, p('melt').dS)).toBeCloseTo(273.15, 6);
    expect(p('melt').dS).toBeCloseTo(22.0, 1);
    expect(crossoverT(p('nh3').dH, p('nh3').dS)).toBeCloseTo(464.3, 1);
    expect(caseOf(p('nh3').dH, p('nh3').dS)).toBe(3);
    expect(Math.round(crossoverT(p('pbs').dH, p('pbs').dS)!)).toBe(5115);
  });
  it('limestone CaCO3 -> CaO + CO2 turns spontaneous at about 1110 K (supplement)', () => {
    const r = rx('caco3');
    expect(crossoverT(-deltaRxn('H', r), -deltaRxn('S', r))).toBeCloseTo(1110, -1);
  });
  it('the elements have ΔH°f = ΔG°f = 0', () => {
    for (const s of ['N2(g)', 'H2(g)', 'O2(g)', 'Zn(s)']) expect(THERMO[s]).toMatchObject({ H: 0, G: 0 });
  });
});
