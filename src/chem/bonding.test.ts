import { describe, expect, it } from 'vitest';
import {
  BOND_H, BOND_L, BOND_RXNS, BORN_HABER_NACL, HX, STRUCTS, assignedFC, bondRxnH, bondType, coulombKJ, deltaEN, dipoleD,
  drawnElectrons, electronDirs, electronsAround, formalCharge, formalCharges, fcSize, latticeEnergyNaCl, lewisDots,
  octetsOk, oxidationNumber, partialCharge, valence, valenceSum, ION_RADIUS, type LStruct,
} from './bonding';
import { HF as HF_TABLE, dHrxn, parseReaction } from './thermo';
import { DIRS, angleDeg, bondAngles, lonePairSlots, maxLonePairs, shape, type Domains } from './vsepr';

const all = Object.entries(STRUCTS) as [string, LStruct][];

describe('Lewis symbols (slide 5)', () => {
  it('at most two dots per side, all electrons placed, spread out first', () => {
    for (let n = 0; n <= 8; n++) {
      const d = lewisDots(n);
      expect(d.r + d.l + d.t + d.b).toBe(n);
      expect(Math.max(d.r, d.l, d.t, d.b)).toBeLessThanOrEqual(2);
      if (n <= 4) expect(Math.max(d.r, d.l, d.t, d.b)).toBe(n ? 1 : 0);
    }
  });
  it('sulfur [Ne]3s²3p⁴ has 6 valence electrons; Li…Ne have 1…8', () => {
    expect(valence('S')).toBe(6);
    expect(['Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'].map(valence)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});

describe('Lewis structures (slides 9–23, exercise 7)', () => {
  it('every structure uses exactly the available valence electrons', () => {
    for (const [id, s] of all) expect(drawnElectrons(s), id).toBe(valenceSum(s));
  });
  it('sum of formal charges = charge of the molecule (slide 18, margin note)', () => {
    for (const [id, s] of all) expect(formalCharges(s).reduce((a, b) => a + b, 0), id).toBe(s.charge);
  });
  it('sum of oxidation numbers = charge', () => {
    for (const [id, s] of all) expect(s.atoms.reduce((n, _, i) => n + oxidationNumber(s, i), 0), id).toBe(s.charge);
  });
  it('slide 18: CN⁻ C −1, N 0', () => { expect(formalCharges(STRUCTS.CN)).toEqual([-1, 0]); });
  it('slide 19: CO₂ 0 0 0 vs −1 0 +1; electrons assigned 6 4 6 / 7 4 5', () => {
    expect(formalCharges(STRUCTS.CO2)).toEqual([0, 0, 0]);
    expect(formalCharges(STRUCTS.CO2b)).toEqual([-1, 0, 1]);
    expect([0, 1, 2].map((i) => assignedFC(STRUCTS.CO2b, i))).toEqual([7, 4, 5]);
  });
  it('slide 19: NCS⁻ (−2 0 +1), (−1 0 0), (0 0 −1)', () => {
    expect(formalCharges(STRUCTS.NCSa)).toEqual([-2, 0, 1]);
    expect(formalCharges(STRUCTS.NCSb)).toEqual([-1, 0, 0]);
    expect(formalCharges(STRUCTS.NCSc)).toEqual([0, 0, -1]);
    // the two with the smallest charges tie (sum 1); N is more electronegative than S → the middle one dominates
    expect(fcSize(STRUCTS.NCSb)).toBe(fcSize(STRUCTS.NCSc));
  });
  it('slide 17: HCN has 10 valence electrons, every atom satisfied', () => {
    expect(valenceSum(STRUCTS.HCN)).toBe(10);
    expect(octetsOk(STRUCTS.HCN)).toBe(true);
  });
  it('slide 20: HCl oxidation numbers +1 −1, formal charges 0 0', () => {
    expect([0, 1].map((i) => oxidationNumber(STRUCTS.HCl, i))).toEqual([1, -1]);
    expect(formalCharges(STRUCTS.HCl)).toEqual([0, 0]);
  });
  it('slide 21: ozone 0 +1 −1, both resonance structures have octets', () => {
    expect(formalCharges(STRUCTS.O3a)).toEqual([0, 1, -1]);
    expect(formalCharges(STRUCTS.O3b)).toEqual([-1, 1, 0]);
    expect(octetsOk(STRUCTS.O3a) && octetsOk(STRUCTS.O3b)).toBe(true);
  });
  it('slide 23: exceptions — NO 11 electrons, B in BF₃ 6, P in PF₅ 10; BF₃ dominant all 0, minor F +1 B −1', () => {
    expect(valenceSum(STRUCTS.NO)).toBe(11);
    expect(electronsAround(STRUCTS.BF3, 0)).toBe(6);
    expect(electronsAround(STRUCTS.PF5, 0)).toBe(10);
    expect(formalCharges(STRUCTS.BF3)).toEqual([0, 0, 0, 0]);
    expect(formalCharges(STRUCTS.BF3d)).toEqual([-1, 1, 0, 0]);
  });
  it('exercise 7: XeO₃ — K satisfies all octets, N has all formal charges 0', () => {
    expect(octetsOk(STRUCTS.XeO3K)).toBe(true);
    expect(formalCharges(STRUCTS.XeO3K)).toEqual([3, -1, -1, -1]);
    expect(formalCharges(STRUCTS.XeO3L)).toEqual([2, -1, -1, 0]);
    expect(formalCharges(STRUCTS.XeO3M)).toEqual([1, 0, 0, -1]);
    expect(formalCharges(STRUCTS.XeO3N)).toEqual([0, 0, 0, 0]);
    expect(electronsAround(STRUCTS.XeO3N, 0)).toBe(14);
    expect(formalCharge(STRUCTS.XeO3N, 0)).toBe(0);
  });
  it('lone pairs are never drawn on top of a bond', () => {
    for (const [id, s] of all) s.atoms.forEach((a, i) => {
      const dirs = electronDirs(s, i);
      expect(dirs.length, id).toBe(a.lp + (a.rad ?? 0));
      for (const b of s.bonds.filter((b) => b.a === i || b.b === i)) {
        const o = s.atoms[b.a === i ? b.b : b.a];
        const bd = (Math.atan2(o.y - a.y, o.x - a.x) * 180) / Math.PI;
        for (const d of dirs) expect(Math.abs(((d - bd) % 360 + 540) % 360 - 180), `${id} atom ${i}`).toBeGreaterThan(40);
      }
    });
  });
});

describe('electronegativity and polarity (slides 11–16)', () => {
  it('HF: 4.0 − 2.1 = 1.9 → polar; LiF 3.0 → ionic; Cl₂ nonpolar (slide 14)', () => {
    expect(deltaEN('H', 'F')).toBeCloseTo(1.9, 10);
    expect(bondType('H', 'F')).toBe('polar');
    expect(deltaEN('Li', 'F')).toBeCloseTo(3.0, 10);
    expect(bondType('Li', 'F')).toBe('ionic');
    expect(bondType('Cl', 'Cl')).toBe('nonpolar');
  });
  it('MnO vs Mn₂O₇: same ΔEN 2.0 (slide 16, handwritten «2.1» there)', () => { expect(deltaEN('Mn', 'O')).toBeCloseTo(2.0, 10); });
});

describe('dipole moments (slide 15)', () => {
  it('a proton and an electron 0.1 nm apart: 4.8 D', () => { expect(dipoleD(1, 100)).toBeCloseTo(4.8, 1); });
  it('HCl partial charge 0.18 (slide 20), HF 0.41 from |μ| = 1.8 D', () => {
    expect(partialCharge(HX.HCl.mu, HX.HCl.r)).toBeCloseTo(0.18, 2);
    expect(partialCharge(HX.HF.mu, HX.HF.r)).toBeCloseTo(0.41, 2);
    expect(HX.HF.mu.toFixed(1)).toBe('1.8');
  });
});

describe('Born–Haber cycle (slide 8)', () => {
  it('the five steps add up to ≈ +788 kJ/mol', () => {
    expect(BORN_HABER_NACL).toHaveLength(5);
    expect(latticeEnergyNaCl()).toBeCloseTo(786.5, 1);
    expect(-HF_TABLE['NaCl(s)']).toBe(BORN_HABER_NACL[0].dH);
    expect(Math.abs(latticeEnergyNaCl() - 788)).toBeLessThan(2);
  });
  it('ΔH°f[Cl(g)] is half the Cl–Cl bond enthalpy (242.6 / 2; table 242)', () => {
    expect(BORN_HABER_NACL[2].dH).toBeCloseTo(242.6 / 2, 6);
    expect(Math.abs(2 * BORN_HABER_NACL[2].dH - BOND_H['Cl-Cl'])).toBeLessThan(1);
  });
  it('Coulomb pair energy: larger for higher charges and smaller ions', () => {
    const nacl = coulombKJ(1, 1, ION_RADIUS['Na+'] + ION_RADIUS['Cl-']);
    const mgo = coulombKJ(2, 2, ION_RADIUS['Mg2+'] + ION_RADIUS['O2-']);
    const kcl = coulombKJ(1, 1, ION_RADIUS['K+'] + ION_RADIUS['Cl-']);
    expect(nacl).toBeCloseTo(491, 0);
    expect(mgo / nacl).toBeGreaterThan(4);
    expect(kcl).toBeLessThan(nacl);
  });
});

describe('bond enthalpies and lengths (slides 24–25)', () => {
  it('estimated ΔH_rxn', () => {
    const h = Object.fromEntries(BOND_RXNS.map((r) => [r.id, bondRxnH(r)]));
    expect(h.hcl).toBe(436 + 242 - 2 * 431);
    expect(h.hcl).toBe(-184);
    expect(h.ch4).toBe(4 * 413 + 2 * 495 - (2 * 799 + 4 * 463));
    expect(h.ch4).toBe(-808);
    expect(h.nh3).toBe(-97);
    expect(h.chlor).toBe(413 + 242 - 328 - 431);
    // the lesson compares with the formation enthalpies (water vapour): −802 kJ
    expect(dHrxn(parseReaction('CH4(g) + 2 O2(g) -> CO2(g) + 2 H2O(g)'))).toBeCloseTo(-802.3, 1);
  });
  it('more shared pairs → shorter and stronger, for C–C, C–N, C–O, N–N', () => {
    for (const [a, b] of [['C', 'C'], ['C', 'N'], ['C', 'O'], ['N', 'N']]) {
      const k = ['-', '=', '#'].map((o) => `${a}${o}${b}`);
      const L = k.map((x) => BOND_L[x]), H = k.map((x) => BOND_H[x]);
      expect(L[0]).toBeGreaterThan(L[1]); expect(L[1]).toBeGreaterThan(L[2]);
      expect(H[0]).toBeLessThan(H[1]); expect(H[1]).toBeLessThan(H[2]);
    }
    expect([BOND_L['N-N'], BOND_L['N=N'], BOND_L['N#N']]).toEqual([147, 124, 110]); // slide 10
  });
});

describe('VSEPR (slides 26–32)', () => {
  it('ideal domain angles: 180, 120, 109.5, 90/120, 90', () => {
    const near = (n: Domains) => { const d = DIRS[n]; const a: number[] = []; for (let i = 0; i < d.length; i++) for (let j = i + 1; j < d.length; j++) a.push(Math.round(angleDeg(d[i], d[j]) * 10) / 10); return [...new Set(a)].sort((x, y) => x - y); };
    expect(near(2)).toEqual([180]);
    expect(near(3)).toEqual([120]);
    expect(near(4)).toEqual([109.5]);
    expect(near(5)).toEqual([90, 120, 180]);
    expect(near(6)).toEqual([90, 180]);
  });
  it('all directions are unit vectors', () => {
    for (const n of [2, 3, 4, 5, 6] as Domains[]) for (const v of DIRS[n]) expect(Math.hypot(...v)).toBeCloseTo(1, 10);
  });
  it('molecular geometries of the tables', () => {
    const g = (n: Domains, lp: number) => shape(n, lp).molGeom;
    expect([g(2, 0), g(3, 0), g(3, 1), g(4, 0), g(4, 1), g(4, 2)]).toEqual(['linear', 'trigonal-planar', 'bent', 'tetrahedral', 'trigonal-pyramidal', 'bent']);
    expect([g(5, 0), g(5, 1), g(5, 2), g(5, 3), g(6, 0), g(6, 1), g(6, 2)]).toEqual(['trigonal-bipyramidal', 'seesaw', 't-shaped', 'linear', 'octahedral', 'square-pyramidal', 'square-planar']);
    expect(shape(4, 1).example).toBe('NH3');
    expect(maxLonePairs(6)).toBe(2); // exercise 7 p. 13: 6 domains with 3 or 4 lone pairs «not possible» in the table
  });
  it('lone pairs sit where they have most room: equatorial in the bipyramid, opposite in the octahedron', () => {
    for (const lp of [1, 2, 3]) for (const i of lonePairSlots(5, lp)) expect(DIRS[5][i][1]).toBeCloseTo(0, 10);
    const [a, b] = lonePairSlots(6, 2).map((i) => DIRS[6][i]);
    expect(angleDeg(a, b)).toBeCloseTo(180, 10);
    // XeF₂: three equatorial lone pairs leave the two axial atoms at 180°
    expect(bondAngles(shape(5, 3))).toEqual([180]);
    // square planar: 90° and 180°
    expect(bondAngles(shape(6, 2))).toEqual([90, 180]);
    // bent (4 domains) keeps the tetrahedral angle in the model; the real H₂O angle is smaller (104.5°)
    expect(bondAngles(shape(4, 2))).toEqual([109.5]);
  });
});

describe('enthalpy routes', () => {
  it('Born–Haber route: six levels, net = lattice energy; labels parse', async () => {
    const { bornHaberRoute, bondRoute } = await import('./bonding');
    const r = bornHaberRoute();
    expect(r.levels).toHaveLength(6);
    expect(r.total).toBeCloseTo(786.5, 1);
    expect(r.levels[5].H).toBeCloseTo(r.total, 9);
    expect(r.levels[4].tex).toContain('e');
    const c = bondRoute(BOND_RXNS[1]);
    expect(c.total).toBe(-808);
    expect(c.levels[1].H).toBe(2642);
  });
});
