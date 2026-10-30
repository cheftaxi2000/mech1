import { describe, expect, it } from 'vitest';
import { STRUCTS, electronsAround, formalCharge, type LStruct } from '../../chem/bonding';
import { bornHaberRoute, bondRoute, BOND_RXNS } from '../../chem/bonding';
import { expectInside, expectNoOverlap, lab, shape } from './cTestKit';
import { COV_STEPS, HCN_STEPS, NACL_STEPS, covalentScene, hcnScene, lewisScene, naclScene } from './bondScenes';
import { hessScene, hessSteps } from './hessScene';
import { PROCESS_STEPS, REMOVE_STEPS, VIEW0, moleculeScene, processScene, removeScene } from './vseprScene';
import { maxLonePairs, type Domains } from '../../chem/vsepr';

describe('Lewis structure scene', () => {
  const all = Object.entries(STRUCTS) as [string, LStruct][];
  it('draws every electron exactly once and stays inside the frame', () => {
    for (const [id, s] of all) for (const book of ['none', 'dots', 'fc', 'ox'] as const) {
      const sc = lewisScene(s, { book, numbers: book === 'ox' ? 'ox' : 'fc', octet: true, w: 380, h: 240 });
      const drawn = s.atoms.reduce((n, a) => n + 2 * a.lp + (a.rad ?? 0), 0) + 2 * s.bonds.reduce((n, b) => n + b.order, 0);
      expect(sc.data.electrons, `${id} ${book}`).toBe(drawn);
      const dots = sc.shapes.filter((x) => x.kind === 'circle' && x.cls.startsWith('bd-e')).length;
      expect(dots, `${id} ${book}`).toBe(book === 'none' ? drawn - 2 * s.bonds.reduce((n, b) => n + b.order, 0) : drawn);
      for (const x of sc.shapes) for (const p of x.pts) { expect(p[0], `${id} ${x.key}`).toBeGreaterThanOrEqual(0); expect(p[0]).toBeLessThanOrEqual(380); expect(p[1], `${id} ${x.key}`).toBeGreaterThanOrEqual(0); expect(p[1]).toBeLessThanOrEqual(240); }
    }
  });
  it('formal-charge labels show the computed values; octet counts', () => {
    const sc = lewisScene(STRUCTS.NCSa as LStruct, { numbers: 'fc', octet: true });
    expect([0, 1, 2].map((i) => lab(sc, `n${i}`)!.tex)).toEqual(['-2', '0', '+1']);
    expect(formalCharge(STRUCTS.NCSa as LStruct, 0)).toBe(-2);
    const bf3 = lewisScene(STRUCTS.BF3 as LStruct, { octet: true });
    expect(lab(bf3, 'cnt0')!.tex).toBe('6');
    expect(shape(bf3, 'ring0')!.cls).toContain('bd-ring-off');
    expect(electronsAround(STRUCTS.BF3 as LStruct, 1)).toBe(8);
  });
  it('ions get brackets and their charge', () => {
    const sc = lewisScene(STRUCTS.CN as LStruct);
    expect(shape(sc, 'brL')).toBeTruthy();
    expect(lab(sc, 'charge')!.tex).toBe('-');
  });
  it('oxidation-number mode gives both electrons of H–Cl to Cl (colour of Cl)', () => {
    const sc = lewisScene(STRUCTS.HCl as LStruct, { book: 'ox' });
    expect(shape(sc, 'be0-0a')!.cls).toContain('bd-c1');
    expect(shape(sc, 'be0-0b')!.cls).toContain('bd-c1');
    const fc = lewisScene(STRUCTS.HCl as LStruct, { book: 'fc' });
    expect(shape(fc, 'be0-0a')!.cls).toContain('bd-c0');
    expect(shape(fc, 'be0-0b')!.cls).toContain('bd-c1');
  });
});

describe('NaCl electron transfer (slide 7)', () => {
  it('frames inside, final labels apart', () => { expectInside(naclScene, NACL_STEPS); expectNoOverlap(naclScene, NACL_STEPS); });
  it('step 1 ends with the electron at chlorine; step 2 makes ions; step 4 shows the lattice', () => {
    const s1 = naclScene(1, 1, 'de');
    expect(s1.data.ex).toBeCloseTo(s1.data.endX, 6);
    expect(s1.data.ey).toBeCloseTo(s1.data.endY, 6);
    expect(lab(naclScene(2, 1, 'de'), 'naSym')!.tex).toContain('^+');
    expect(lab(naclScene(2, 1, 'de'), 'clCfg')!.tex).toContain('Ar');
    const s4 = naclScene(4, 1, 'en');
    expect(s4.shapes.filter((x) => x.key.startsWith('l')).length).toBeGreaterThanOrEqual(18);
    expect(lab(s4, 'latName')).toBeTruthy();
  });
});

describe('sharing a pair (slide 9)', () => {
  for (const mol of ['H2', 'Cl2'] as const) {
    it(`${mol}: inside, final labels apart, the pair ends between the nuclei, then a line`, () => {
      const b = (s: number, t: number, l: 'de' | 'en') => covalentScene(mol, s, t, l);
      expectInside(b, COV_STEPS); expectNoOverlap(b, COV_STEPS);
      expect(covalentScene(mol, 2, 1, 'de').data.pairX).toBeCloseTo(260, 6);
      expect(shape(covalentScene(mol, 3, 1, 'de'), 'bond')).toBeTruthy();
      expect(lab(covalentScene(mol, 2, 1, 'de'), 'cntA')!.tex).toContain(mol === 'H2' ? '2' : '8');
    });
  }
});

describe('HCN by the five rules (slide 17)', () => {
  it('inside, final labels apart', () => { expectInside(hcnScene, HCN_STEPS); expectNoOverlap(hcnScene, HCN_STEPS); });
  it('bank: 10 electrons, 4 used by the single bonds, 6 by N; C has 4, then 8 after the triple bond', () => {
    expect(hcnScene(1, 1, 'de').data.used).toBe(0);
    expect(hcnScene(2, 1, 'de').data.used).toBe(4);
    expect(hcnScene(3, 1, 'de').data.used).toBe(10);
    expect(hcnScene(4, 1, 'de').data.cCount).toBe(4);
    const s5 = hcnScene(5, 1, 'de');
    expect(s5.data.cCount).toBe(8);
    expect(shape(s5, 'cn2')).toBeTruthy();
    expect(shape(s5, 'lp1a')).toBeFalsy();
  });
});

describe('enthalpy diagrams reuse the Hess scene', () => {
  it('Born–Haber and bond-enthalpy routes: inside, labels apart, net arrow named', () => {
    const bh = bornHaberRoute();
    const b1 = (s: number, t: number, l: 'de' | 'en') => hessScene(bh, s, t, l);
    expectInside(b1, hessSteps(bh));
    const fin = hessScene(bh, hessSteps(bh) - 1, 1, 'de');
    expect(lab(fin, 'net-name')!.tex).toContain('lat');
    expect(lab(fin, 'val4')!.tex).toContain('I_1');
    for (const r of BOND_RXNS) {
      const rt = bondRoute(r);
      expectInside((s, t, l) => hessScene(rt, s, t, l), hessSteps(rt));
      expectNoOverlap((s, t, l) => hessScene(rt, s, t, l), hessSteps(rt));
    }
  });
});

describe('VSEPR scenes', () => {
  it('explorer: every (domains, lone pairs) is drawn inside with the right number of atoms and lobes', () => {
    for (const n of [2, 3, 4, 5, 6] as Domains[]) for (let lp = 0; lp <= maxLonePairs(n); lp++) for (const view of [VIEW0, { yaw: 2.1, pitch: -0.9 }]) {
      const sc = moleculeScene(n, lp, view, true, true);
      expect(sc.shapes.filter((x) => x.key.startsWith('at')).length).toBe(n - lp);
      expect(sc.shapes.filter((x) => /^lp\d+$/.test(x.key)).length).toBe(lp);
      for (const x of sc.shapes) for (const p of x.pts) { expect(p[0]).toBeGreaterThanOrEqual(0); expect(p[0]).toBeLessThanOrEqual(sc.w); expect(p[1]).toBeGreaterThanOrEqual(0); expect(p[1]).toBeLessThanOrEqual(sc.h); }
    }
  });
  it('removing atoms: 4 → 3 → 2 atoms', () => {
    expectInside(removeScene, REMOVE_STEPS); expectNoOverlap(removeScene, REMOVE_STEPS);
    expect([0, 1, 2].map((s) => removeScene(s, 1, 'de').data.atoms)).toEqual([4, 3, 2]);
    expect(lab(removeScene(2, 1, 'en'), 'name')!.tex).toContain('bent');
  });
  it('NH3 process: inside; folds into the tetrahedron, then shows only the pyramid', () => {
    expectInside(processScene, PROCESS_STEPS); expectNoOverlap(processScene, PROCESS_STEPS);
    expect(processScene(2, 1, 'de').data.fold).toBe(1);
    expect(shape(processScene(3, 1, 'de'), 'base')).toBeTruthy();
    expect(lab(processScene(3, 1, 'en'), 'stepLab')!.tex).toContain('trigonal pyramidal');
  });
});
