import { describe, expect, it } from 'vitest';
import { ATOMIC_RADIUS, FIRST_IE, ISOELECTRONIC, SUCCESSIVE_IE, coreElectrons, meanRadius, probabilityInside, zeffEstimate } from './trends';
import { ELEMENTS, bySymbol } from './elements';
import { valenceElectrons } from './config';

const els = ELEMENTS.filter((e) => e.Z <= 54);
const groupOf = (g: number) => els.filter((e) => e.group === g).sort((a, b) => a.period - b.period);
const periodOf = (p: number, g0: number, g1: number) => els.filter((e) => e.period === p && e.group >= g0 && e.group <= g1).sort((a, b) => a.group - b.group);
const mono = (xs: number[], dir: 1 | -1) => xs.every((x, i) => i === 0 || (x - xs[i - 1]) * dir > 0);

describe('data completeness', () => {
  it('radii and ionisation energies for every element Z ≤ 54', () => {
    for (const e of els) { expect(ATOMIC_RADIUS[e.symbol], e.symbol).toBeGreaterThan(0); expect(FIRST_IE[e.symbol], e.symbol).toBeGreaterThan(0); }
    expect(Object.keys(ATOMIC_RADIUS)).toHaveLength(54);
    expect(Object.keys(FIRST_IE)).toHaveLength(54);
  });
  it('slide 30 spot checks (units 10² pm): H 0.31, C 0.76, Na 1.66, K 2.03, Rb 2.20, Xe 1.40', () => {
    expect([ATOMIC_RADIUS.H, ATOMIC_RADIUS.C, ATOMIC_RADIUS.Na, ATOMIC_RADIUS.K, ATOMIC_RADIUS.Rb, ATOMIC_RADIUS.Xe]).toEqual([31, 76, 166, 203, 220, 140]);
  });
});

describe('slide 29: atomic radii increase down a group and decrease across a period', () => {
  it('down groups 1, 2, 13–17: strictly increasing', () => {
    for (const g of [1, 2, 13, 14, 15, 16, 17]) {
      const r = groupOf(g).map((e) => ATOMIC_RADIUS[e.symbol]);
      expect(mono(r, 1), `group ${g}: ${r}`).toBe(true);
    }
  });
  it('across periods 2 and 3 (groups 1–17): strictly decreasing', () => {
    for (const p of [2, 3]) {
      const r = periodOf(p, 1, 17).map((e) => ATOMIC_RADIUS[e.symbol]);
      expect(mono(r, -1), `period ${p}: ${r}`).toBe(true);
    }
  });
  it('across period 4 and 5 from group 1 to group 12 the radius falls on the whole (K > Cr > Ni; Rb > Mo > Pd)', () => {
    expect(ATOMIC_RADIUS.K).toBeGreaterThan(ATOMIC_RADIUS.Cr);
    expect(ATOMIC_RADIUS.Cr).toBeGreaterThan(ATOMIC_RADIUS.Ni);
    expect(ATOMIC_RADIUS.Rb).toBeGreaterThan(ATOMIC_RADIUS.Mo);
    expect(ATOMIC_RADIUS.Mo).toBeGreaterThan(ATOMIC_RADIUS.Pd);
  });
});

describe('slide 28: effective nuclear charge', () => {
  it('Z_eff estimate rises by one per element across a period (Na … Ar: 1 … 8) and is constant down a main group', () => {
    expect(['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'].map((s) => zeffEstimate(bySymbol(s).Z))).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    for (const g of [1, 2, 13, 14, 15, 16, 17]) expect(new Set(groupOf(g).filter((e) => e.period > 1).map((e) => zeffEstimate(e.Z))).size, `group ${g}`).toBe(1);
  });
  it('is not defined for the d block; the number of core electrons of K is 18', () => {
    expect(zeffEstimate(bySymbol('Fe').Z)).toBeNull();
    expect(coreElectrons(1)).toBe(0);
    expect(coreElectrons(19)).toBe(18);
  });
});

describe('slide 32: ionisation energy', () => {
  it('increases across a period (Li < Ne, Na < Ar, K < Kr) and decreases down groups 1, 2, 17, 18', () => {
    expect(FIRST_IE.Li).toBeLessThan(FIRST_IE.Ne);
    expect(FIRST_IE.Na).toBeLessThan(FIRST_IE.Ar);
    expect(FIRST_IE.K).toBeLessThan(FIRST_IE.Kr);
    for (const g of [1, 2, 17, 18]) { const ie = groupOf(g).map((e) => FIRST_IE[e.symbol]); expect(mono(ie, -1), `group ${g}: ${ie}`).toBe(true); }
  });
  it('the two dips of period 2 and 3: Be > B (s before p) and N > O (pairing in 2p); Mg > Al, P > S', () => {
    expect(FIRST_IE.Be).toBeGreaterThan(FIRST_IE.B);
    expect(FIRST_IE.N).toBeGreaterThan(FIRST_IE.O);
    expect(FIRST_IE.Mg).toBeGreaterThan(FIRST_IE.Al);
    expect(FIRST_IE.P).toBeGreaterThan(FIRST_IE.S);
  });
  it('I₂ > I₁ for every element in the table; the big jump comes after the valence electrons (Na after 1, Mg after 2, Al after 3)', () => {
    for (const [s, ie] of Object.entries(SUCCESSIVE_IE)) {
      expect(ie[0], s).toBe(FIRST_IE[s]);
      expect(mono(ie, 1), s).toBe(true);
      const jumps = ie.slice(1).map((v, i) => v / ie[i]);
      expect(jumps.indexOf(Math.max(...jumps)) + 1, s).toBe(valenceElectrons(bySymbol(s).Z));
    }
  });
});

describe('slide 31: ionic radii', () => {
  it('isoelectronic series: 10 electrons each, radius falls as Z rises', () => {
    for (const i of ISOELECTRONIC) expect(i.Z - i.charge, i.symbol).toBe(10);
    expect(mono(ISOELECTRONIC.map((i) => i.Z), 1)).toBe(true);
    expect(ISOELECTRONIC.map((i) => i.radius)).toEqual([126, 119, 116, 86, 68]);
    expect(mono(ISOELECTRONIC.map((i) => i.radius), -1)).toBe(true);
  });
  it('cations are smaller than the neutral atom (Na, Mg, Al), anions larger (O, F) — with the slide values', () => {
    for (const i of ISOELECTRONIC) {
      if (i.charge > 0) expect(i.radius, i.symbol).toBeLessThan(ATOMIC_RADIUS[i.symbol]);
      else expect(i.radius, i.symbol).toBeGreaterThan(ATOMIC_RADIUS[i.symbol]);
    }
  });
});

describe('penetration (hydrogen-like functions; why s < p < d inside a shell)', () => {
  it('⟨r⟩ = ½(3n² − ℓ(ℓ+1)): 3s 13.5, 3p 12.5, 3d 10.5 a₀ — the mean distance does not grow from s to d (CH-601)', () => {
    expect([0, 1, 2].map((l) => meanRadius(3, l))).toEqual([13.5, 12.5, 10.5]);
    expect(probabilityInside(3, 0, 60) ).toBeCloseTo(1, 4);
  });
  it('but the chance to be close to the nucleus falls from s to p to d: P(r < 1 a₀) for n = 3 and n = 2', () => {
    const p3 = [0, 1, 2].map((l) => probabilityInside(3, l, 1));
    expect(p3[0]).toBeGreaterThan(p3[1]);
    expect(p3[1]).toBeGreaterThan(p3[2]);
    expect(probabilityInside(2, 0, 1)).toBeGreaterThan(probabilityInside(2, 1, 1));
    expect(p3[0]).toBeGreaterThan(0.005);
  });
});
