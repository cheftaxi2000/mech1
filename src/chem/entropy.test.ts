import { describe, expect, it } from 'vitest';
import { N_A, R, k_B } from './constants';
import {
  DH_FUS_WATER, T_MELT, WATER, binom, dSisothermal, dilutedExpansionJKperMol, entropyJK, entropyKB, entropySignFromGas, expansionLattice,
  heatFlow, latticeW, macrostateW, meltingBreakEven, mulberry32, qEquilibrium, reversibleDSuniv, sampleConfig, Tequilibrium, universeBalance,
  waterEntropy, waterJumps,
} from './entropy';

describe('counting microstates (slide 18)', () => {
  it('binomial coefficients', () => {
    expect(binom(5, 2)).toBe(10); expect(binom(10, 0)).toBe(1); expect(binom(10, 10)).toBe(1);
    expect(binom(20, 10)).toBe(184756); expect(binom(40, 20)).toBe(137846528820); expect(binom(4, 5)).toBe(0);
  });
  it('S = k_B ln W: one microstate means S = 0 (exercise 5, Ex. 1; 3rd law, slide 21)', () => {
    expect(entropyKB(1)).toBe(0); expect(entropyJK(1)).toBe(0);
    expect(latticeW(8, 8)).toBe(1); // a perfect crystal: every site occupied, one arrangement
    expect(entropyKB(latticeW(8, 8))).toBe(0);
  });
  it('W adds up to entropy: independent systems multiply W and add S', () => {
    const W1 = latticeW(6, 2), W2 = latticeW(7, 3);
    expect(entropyKB(W1 * W2)).toBeCloseTo(entropyKB(W1) + entropyKB(W2), 12);
  });
  it('S grows with the number of microstates (monotonic in W)', () => {
    expect(entropyJK(100)).toBeGreaterThan(entropyJK(10));
  });
});

describe('expansion into vacuum, lattice model (slide 11, 17–18)', () => {
  it('10 particles, 10 sites per half: W_i = 1, W_f = 184756, ΔS = k_B ln 184756 = 12.13 k_B', () => {
    const e = expansionLattice(10, 10);
    expect(e.Wi).toBe(1); expect(e.Wf).toBe(184756);
    expect(e.dS_kB).toBeCloseTo(Math.log(184756), 12); expect(e.dS_kB).toBeCloseTo(12.127, 3);
    expect(e.dS_JK).toBeCloseTo(Math.log(184756) * k_B, 30);
    expect(e.pAllLeft).toBeCloseTo(1 / 184756, 15);
  });
  it('ΔS = k_B ln(W_f/W_i) = k_B ln W_f − k_B ln W_i (log identity of slide 18)', () => {
    const e = expansionLattice(8, 3);
    expect(e.dS_kB).toBeCloseTo(Math.log(binom(16, 3)) - Math.log(binom(8, 3)), 12);
  });
  it('the second law in the lattice: ΔS is never negative when the partition opens', () => {
    for (let M = 2; M <= 12; M++) for (let N = 0; N <= M; N++) expect(expansionLattice(M, N).dS_kB).toBeGreaterThanOrEqual(0);
  });
  it('dilute limit: ΔS → N k_B ln 2, i.e. R ln 2 = 5.76 J/(mol K) per mole', () => {
    const e = expansionLattice(200, 4); // N ≪ M
    expect(Math.exp(e.dS_kB)).toBeCloseTo(16, 0); // 2^4, a few percent
    expect(e.dS_kB).toBeGreaterThan(4 * Math.LN2); expect(e.dS_kB).toBeLessThan(1.05 * 4 * Math.LN2); // slightly above: sites cannot be shared
    expect(dilutedExpansionJKperMol()).toBeCloseTo(5.763, 3);
    expect(N_A * k_B).toBeCloseTo(R, 5); // slide 18 note: R = k_B·N_A = 8.31 J/(mol K)
  });
  it('pAllLeft shrinks fast with N; for N = 1 it is one half', () => {
    expect(expansionLattice(10, 1).pAllLeft).toBeCloseTo(0.5, 12);
    expect(expansionLattice(10, 5).pAllLeft).toBeLessThan(expansionLattice(10, 2).pAllLeft);
  });
});

describe('macrostates of the open box', () => {
  it('W(k) adds up to all microstates; k = 0 (all particles right) and k = N (all left) are single arrangements for N = M', () => {
    for (const [M, N] of [[10, 10], [10, 6], [5, 3], [8, 1]]) {
      const w = macrostateW(M, N);
      expect(w.reduce((a, b) => a + b, 0), `${M},${N}`).toBe(binom(2 * M, N));
    }
    const w = macrostateW(10, 10);
    expect(w[10]).toBe(1); expect(w[0]).toBe(1); expect(w[5]).toBe(252 * 252);
    expect(w.indexOf(Math.max(...w))).toBe(5); // «half and half» is by far the most likely
  });
});

describe('seeded random microstates', () => {
  it('deterministic, in range, distinct, sorted', () => {
    const a = sampleConfig(20, 7, mulberry32(42)), b = sampleConfig(20, 7, mulberry32(42));
    expect(a).toEqual(b); expect(new Set(a).size).toBe(7); expect(a).toEqual([...a].sort((x, y) => x - y));
    expect(Math.min(...a)).toBeGreaterThanOrEqual(0); expect(Math.max(...a)).toBeLessThan(20);
  });
  it('uniform over microstates: M = 3, N = 2 → P(all left) = C(3,2)/C(6,2) = 3/15', () => {
    const rnd = mulberry32(7);
    let left = 0; const n = 30000;
    for (let i = 0; i < n; i++) if (sampleConfig(6, 2, rnd).every((c) => c < 3)) left++;
    expect(left / n).toBeCloseTo(0.2, 1);
    expect(Math.abs(left / n - 0.2)).toBeLessThan(0.01);
  });
});

describe('heat flow between two blocks (slides 9–10, 15–16)', () => {
  const b = { Th: 400, Tc: 300, C: 100 };
  it('hot → cold: ΔS_hot < 0, ΔS_cold > 0, ΔS_univ > 0', () => {
    const f = heatFlow(b, 1000);
    expect(f.dSh).toBeLessThan(0); expect(f.dSc).toBeGreaterThan(0); expect(f.dSuniv).toBeGreaterThan(0);
    expect(f.Th).toBeCloseTo(390, 12); expect(f.Tc).toBeCloseTo(310, 12);
  });
  it('cold → hot (q < 0) would lower S_univ: not spontaneous', () => {
    expect(heatFlow(b, -1000).dSuniv).toBeLessThan(0);
  });
  it('q = 0 gives ΔS_univ = 0; ΔS_univ is largest at the common temperature (q = C ΔT/2)', () => {
    expect(heatFlow(b, 0).dSuniv).toBe(0);
    const q = qEquilibrium(b);
    expect(q).toBeCloseTo(5000, 9);
    const e = heatFlow(b, q);
    expect(e.Th).toBeCloseTo(Tequilibrium(b), 9); expect(e.Tc).toBeCloseTo(350, 9);
    for (const dq of [-500, -50, 50, 500]) expect(heatFlow(b, q + dq).dSuniv).toBeLessThan(e.dSuniv);
    expect(e.dSuniv).toBeCloseTo(100 * Math.log((350 * 350) / (400 * 300)), 9);
  });
  it('the reversible limit: for T_hot = T + δT the ΔS_univ per joule goes to zero', () => {
    expect(reversibleDSuniv(1, 300, 1e-6)).toBeCloseTo(0, 9);
    expect(reversibleDSuniv(1, 300, 30)).toBeGreaterThan(reversibleDSuniv(1, 300, 3));
  });
});

describe('phase changes and the 2nd law (slides 14–16)', () => {
  it('slide 14: ice melting at 0 °C: ΔS = 6.0·10³/273 = +22 J/(mol K)', () => {
    expect(dSisothermal(DH_FUS_WATER, 273)).toBeCloseTo(21.978, 3);
    expect(Math.round(dSisothermal(DH_FUS_WATER, 273))).toBe(22);
    expect(dSisothermal(DH_FUS_WATER, T_MELT)).toBeCloseTo(21.97, 2);
  });
  it('slide 15: hand at 37 °C (310 K): −19 J/(mol K), total +2.6 (the slide prints +3.0 from the rounded 22 − 19)', () => {
    const u = universeBalance(DH_FUS_WATER, 273, 310);
    expect(u.sys).toBeCloseTo(21.978, 3); expect(u.surr).toBeCloseTo(-19.355, 3);
    expect(Math.round(u.sys)).toBe(22); expect(Math.round(u.surr)).toBe(-19);
    expect(u.univ).toBeCloseTo(2.623, 3);
    expect(Math.round(u.sys) + Math.round(u.surr)).toBe(3);
    expect(u.spontaneous).toBe(true);
  });
  it('reversible melting (T_surr = T_melt): ΔS_univ = 0 (slide 15 margin)', () => {
    const u = universeBalance(DH_FUS_WATER, 273.15, 273.15);
    expect(u.univ).toBeCloseTo(0, 12); expect(u.reversible).toBe(true); expect(u.spontaneous).toBe(false);
    expect(meltingBreakEven()).toBe(T_MELT);
  });
  it('slide 8: ice melts at +1 °C but not at −1 °C', () => {
    expect(universeBalance(DH_FUS_WATER, 273.15, 274.15).univ).toBeGreaterThan(0);
    expect(universeBalance(DH_FUS_WATER, 273.15, 272.15).univ).toBeLessThan(0);
  });
  it('slide 20 («engineers»): freezing water in a colder freezer lowers S_sys but raises S_univ', () => {
    const u = universeBalance(-DH_FUS_WATER, 273.15, 263.15);
    expect(u.sys).toBeLessThan(0); expect(u.surr).toBeGreaterThan(0); expect(u.univ).toBeGreaterThan(0);
  });
});

describe('what raises entropy (slide 19, exercise class 5, Ex. 2–3)', () => {
  it('Δn_gas decides the sign', () => {
    expect(entropySignFromGas(1)).toBe('up'); expect(entropySignFromGas(-1)).toBe('down'); expect(entropySignFromGas(0)).toBe('unclear');
    // CaO(s) + CO2(g) → CaCO3(s): −1; 2 SO2 + O2 → 2 SO3: −1
    expect(entropySignFromGas(-1)).toBe('down');
  });
  it('schematic S(T) of water: increasing, jumps at melting and boiling, jump(vap) > jump(fus)', () => {
    let prev = -1;
    for (let T = 0; T <= 500; T += 2.5) { const s = waterEntropy(T).S; expect(s).toBeGreaterThanOrEqual(prev - 1e-9); prev = s; }
    expect(waterEntropy(0).S).toBe(0); // 3rd law (slide 21)
    const j = waterJumps();
    expect(j.fus).toBeCloseTo(22.0, 1); expect(j.vap).toBeCloseTo(109.1, 1); expect(j.vap).toBeGreaterThan(j.fus);
    expect(waterEntropy(WATER.Tm + 1e-9).S - waterEntropy(WATER.Tm - 1e-9).S).toBeCloseTo(j.fus, 3);
    expect(waterEntropy(WATER.Tb + 1e-9).S - waterEntropy(WATER.Tb - 1e-9).S).toBeCloseTo(j.vap, 3);
    expect(waterEntropy(298).phase).toBe('liquid'); expect(waterEntropy(400).phase).toBe('gas'); expect(waterEntropy(100).phase).toBe('solid');
    // steam at 100 °C: about 197 J/(mol K) in the tables
    expect(waterEntropy(373.15 + 1e-9).S).toBeGreaterThan(190); expect(waterEntropy(373.15 + 1e-9).S).toBeLessThan(200);
  });
});
