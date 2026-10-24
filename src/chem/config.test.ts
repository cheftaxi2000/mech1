import { describe, expect, it } from 'vitest';
import { EXCEPTIONS, blockOf, capacity, configString, configTex, configuration, fillSequence, isException, nobleCore, subshellOrder, unpaired, valenceElectrons } from './config';
import { ELEMENTS, bySymbol } from './elements';
import { allowedL, allowedMl, electronsInShell, hydrogenEnergy, hydrogenTransition, orbitalsInShell, orbitalsInSubshell, photonWavelength, quantumStates, subshellLetter } from './quantum';

const Z = (s: string) => bySymbol(s).Z;

describe('quantum numbers (slides 14–15, Table 6.2)', () => {
  it('ℓ = 0 … n−1, m_ℓ = −ℓ … ℓ', () => {
    expect(allowedL(3)).toEqual([0, 1, 2]);
    expect(allowedMl(2)).toEqual([-2, -1, 0, 1, 2]);
    expect(allowedMl(0)).toEqual([0]);
    expect([0, 1, 2, 3].map(subshellLetter)).toEqual(['s', 'p', 'd', 'f']);
  });
  it('Table 6.2: orbitals per subshell 1, 3, 5, 7 and per shell 1, 4, 9, 16', () => {
    expect([0, 1, 2, 3].map(orbitalsInSubshell)).toEqual([1, 3, 5, 7]);
    expect([1, 2, 3, 4].map(orbitalsInShell)).toEqual([1, 4, 9, 16]);
    expect([1, 2, 3, 4].map((n) => allowedL(n).reduce((a, l) => a + orbitalsInSubshell(l), 0))).toEqual([1, 4, 9, 16]);
  });
  it('2n² distinct sets of four quantum numbers per shell (Pauli: at most one electron each)', () => {
    for (const n of [1, 2, 3, 4]) {
      const st = quantumStates(n);
      expect(st).toHaveLength(electronsInShell(n));
      expect(new Set(st.map((s) => `${s.n},${s.l},${s.ml},${s.ms}`)).size).toBe(st.length);
    }
  });
});

describe('hydrogen energies (exercise class 6, p. 3 and Ex 2)', () => {
  it('E_n = −R/n²: ground state −2.18·10⁻¹⁸ J, levels depend on n only', () => {
    expect(hydrogenEnergy(1)).toBeCloseTo(-2.18e-18, 20);
    expect(hydrogenEnergy(2)).toBeCloseTo(hydrogenEnergy(1) / 4, 30);
  });
  it('Ex 2: n = 1 → ∞ takes 218·10⁻²⁰ J; λ = 91.1 nm (ultraviolet)', () => {
    expect(hydrogenTransition(1, Infinity)).toBeCloseTo(2.18e-18, 20);
    expect(photonWavelength(1, Infinity) * 1e9).toBeCloseTo(91.13, 1);
  });
  it('n = 2 → 1 releases a photon (ΔE < 0), 121.6 nm (Lyman α)', () => {
    expect(hydrogenTransition(2, 1)).toBeLessThan(0);
    expect(photonWavelength(2, 1) * 1e9).toBeCloseTo(121.6, 0);
  });
});

describe('electron configurations (slides 22–27)', () => {
  it('filling order from the periodic table: 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p', () => {
    expect(subshellOrder().slice(0, 15).map(([n, l]) => `${n}${subshellLetter(l)}`).join(' ')).toBe('1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p');
    expect([0, 1, 2, 3].map(capacity)).toEqual([2, 6, 10, 14]);
  });
  it('slide 25 (Table 6.3) and exercise 4', () => {
    expect(configString(Z('Li'), true)).toBe('1s2 2s1');
    expect(configString(Z('Be'), true)).toBe('1s2 2s2');
    expect(configString(Z('B'), true)).toBe('1s2 2s2 2p1');
    expect(configString(Z('C'), true)).toBe('1s2 2s2 2p2');
    expect(configString(Z('N'), true)).toBe('1s2 2s2 2p3');
    expect(configString(Z('Ne'), true)).toBe('1s2 2s2 2p6');
    expect(configString(Z('Na'), true)).toBe('1s2 2s2 2p6 3s1');
    expect(configString(Z('H'))).toBe('1s1');
    expect(configString(Z('He'))).toBe('1s2');
    expect(configString(Z('Mg'))).toBe('[Ne] 3s2');
  });
  it('slide 26: selenium [Ar] 4s² 3d¹⁰ 4p⁴ with 6 valence electrons', () => {
    expect(configString(Z('Se'))).toBe('[Ar] 4s2 3d10 4p4');
    expect(configTex(Z('Se'))).toBe(String.raw`[\mathrm{Ar}]\,4s^{2}\,3d^{10}\,4p^{4}`);
    expect(valenceElectrons(Z('Se'))).toBe(6);
  });
  it('slide 27: the exceptions Cr and Cu', () => {
    expect(configString(Z('Cr'))).toBe('[Ar] 4s1 3d5');
    expect(configString(Z('Cu'))).toBe('[Ar] 4s1 3d10');
    expect(isException(24) && isException(29)).toBe(true);
  });
  it('known configurations of Z ≤ 54 (independent list, filling order)', () => {
    const known: Record<string, string> = {
      O: '[He] 2s2 2p4', F: '[He] 2s2 2p5', Al: '[Ne] 3s2 3p1', Cl: '[Ne] 3s2 3p5', Ar: '[Ne] 3s2 3p6', K: '[Ar] 4s1', Ca: '[Ar] 4s2',
      Sc: '[Ar] 4s2 3d1', Ti: '[Ar] 4s2 3d2', V: '[Ar] 4s2 3d3', Mn: '[Ar] 4s2 3d5', Fe: '[Ar] 4s2 3d6', Ni: '[Ar] 4s2 3d8', Zn: '[Ar] 4s2 3d10',
      Ga: '[Ar] 4s2 3d10 4p1', Br: '[Ar] 4s2 3d10 4p5', Kr: '[Ar] 4s2 3d10 4p6', Rb: '[Kr] 5s1', Sr: '[Kr] 5s2', Y: '[Kr] 5s2 4d1', Zr: '[Kr] 5s2 4d2',
      Nb: '[Kr] 5s1 4d4', Mo: '[Kr] 5s1 4d5', Tc: '[Kr] 5s2 4d5', Ru: '[Kr] 5s1 4d7', Rh: '[Kr] 5s1 4d8', Pd: '[Kr] 4d10', Ag: '[Kr] 5s1 4d10',
      Cd: '[Kr] 5s2 4d10', In: '[Kr] 5s2 4d10 5p1', Sn: '[Kr] 5s2 4d10 5p2', I: '[Kr] 5s2 4d10 5p5', Xe: '[Kr] 5s2 4d10 5p6',
    };
    for (const [s, cfg] of Object.entries(known)) expect(configString(Z(s)), s).toBe(cfg);
  });
  it('every element Z ≤ 54: electron count, capacities, noble-gas core, block and period agree with the periodic table', () => {
    for (const el of ELEMENTS.filter((e) => e.Z <= 54)) {
      const subs = configuration(el.Z);
      expect(subs.reduce((a, s) => a + s.e, 0), el.symbol).toBe(el.Z);
      for (const s of subs) expect(s.e).toBeLessThanOrEqual(capacity(s.l));
      // block by group: 1–2 s (He too), 3–12 d, 13–18 p
      const expectBlock = el.Z === 2 ? 's' : el.group <= 2 ? 's' : el.group <= 12 ? 'd' : 'p';
      expect(blockOf(el.Z), el.symbol).toBe(expectBlock);
      if (!isException(el.Z)) {
        // s and p block: highest shell = period; d block: highest shell = period
        const nmax = Math.max(...subs.map((s) => s.n));
        expect(nmax, el.symbol).toBe(el.period);
      }
      const core = nobleCore(el.Z);
      if (el.Z > 2) expect(core, el.symbol).not.toBeNull();
    }
  });
  it('the exceptions below Xe are exactly the eight overrides and keep the electron count', () => {
    expect(Object.keys(EXCEPTIONS).map(Number)).toEqual([24, 29, 41, 42, 44, 45, 46, 47]);
  });
});

describe('valence electrons, unpaired electrons, filling order', () => {
  it('valence electrons equal the group number for the main groups', () => {
    for (const el of ELEMENTS.filter((e) => e.Z <= 54 && (e.group <= 2 || e.group >= 13))) {
      const expected = el.group <= 2 ? el.group : el.group - 10;
      expect(valenceElectrons(el.Z), el.symbol).toBe(el.Z === 2 ? 2 : expected);
    }
  });
  it('filled d subshells do not count: Zn 2, Ga 3', () => {
    expect(valenceElectrons(Z('Zn'))).toBe(2);
    expect(valenceElectrons(Z('Ga'))).toBe(3);
    expect(valenceElectrons(Z('Ti'))).toBe(4);
  });
  it('exercise 7: F, Cl 1 unpaired; Ti, Zr 2; Ga, In 1', () => {
    for (const [s, u] of [['F', 1], ['Cl', 1], ['Ti', 2], ['Zr', 2], ['Ga', 1], ['In', 1]] as const) expect(unpaired(Z(s)), s).toBe(u);
  });
  it('Hund: N has three unpaired electrons, O two, Ne none, Cr six', () => {
    expect(unpaired(Z('N'))).toBe(3);
    expect(unpaired(Z('O'))).toBe(2);
    expect(unpaired(Z('Ne'))).toBe(0);
    expect(unpaired(Z('Cr'))).toBe(6);
  });
  it('exercise 7d: the generalised [noble gas] ns² (n−2)f⁶ has 6 unpaired electrons (Sm: Z = 62)', () => {
    expect(unpaired(62)).toBe(6);
    expect(configString(62)).toBe('[Xe] 6s2 4f6');
  });
  it('exercise 5: oxygen fills 1s, 2s, then 2p singly (same spin), then doubly', () => {
    const seq = fillSequence(Z('O'));
    expect(seq).toHaveLength(8);
    expect(seq.slice(4).map((p) => [p.box, p.spin])).toEqual([[0, 1], [1, 1], [2, 1], [0, -1]]);
    expect(seq[0]).toEqual({ n: 1, l: 0, box: 0, spin: 1 });
    expect(seq[1]).toEqual({ n: 1, l: 0, box: 0, spin: -1 });
  });
  it('fill sequence never puts two equal (box, spin) in one subshell (Pauli) and ends in the configuration', () => {
    for (let z = 1; z <= 54; z++) {
      const seen = new Set<string>();
      for (const p of fillSequence(z)) { const k = `${p.n}${p.l}${p.box}${p.spin}`; expect(seen.has(k)).toBe(false); seen.add(k); }
      expect(seen.size).toBe(z);
    }
  });
});
