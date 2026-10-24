import { describe, expect, it } from 'vitest';
import { expectInside, expectNoOverlap, shape } from '../anim/sceneTestKit';
import { BOXES, classify, atomScene, boxesScene, ionicScene, isoScene, molScene, zoomRadii, zoomScene, MOLS } from './atomScenes';
import { ANIONS, CATIONS } from '../../chem/ions';
import { ISOTOPES, atomicWeight } from '../../chem/atoms';

describe('atom scenes', () => {
  it("exercise 7: the classification of the six pictures gives the TA's answers", () => {
    const where = (c: string) => BOXES.map((b, i) => (classify(b).includes(c as never) ? i + 1 : 0)).filter(Boolean);
    expect([where('a'), where('b'), where('c'), where('d')]).toEqual([[1], [5, 6], [4], [2, 3]]);
  });
  it('nuclide 19-9-F⁻ has 9 p, 10 n, 10 e and the picture draws exactly that many', () => {
    const s = atomScene({ Z: 9, N: 10, q: -1 });
    expect(s.shapes.filter((x) => x.cls === 'cs-proton' || x.cls === 'cs-neutron')).toHaveLength(19);
    expect(s.shapes.filter((x) => x.cls === 'cs-proton')).toHaveLength(9);
    expect(s.shapes.filter((x) => x.cls === 'cs-electron')).toHaveLength(10);
    expect(s.data).toMatchObject({ p: 9, n: 10, e: 10 });
  });
  it("electrons stay inside the cloud, nucleons inside the electrons' ring", () => {
    const s = atomScene({ Z: 20, N: 24, q: 0 });
    for (const x of s.shapes) {
      const d = Math.hypot(x.pts[0][0] - 200, x.pts[0][1] - 128);
      if (x.cls === 'cs-electron') expect(d).toBeLessThan(76);
      if (x.cls === 'cs-proton' || x.cls === 'cs-neutron') expect(d).toBeLessThan(58);
    }
  });
  it('every atom scene is inside the frame', () => {
    for (const Z of [1, 6, 11, 17, 20]) for (const q of [-3, 0, 3]) { if (q > Z) continue; expectInside(() => atomScene({ Z, N: Z + 2, q }), 1); }
  });
  it('zoom: cloud large and nucleus a point at 10^-9.5 m; the other way round at 10^-14 m', () => {
    expect(zoomRadii(-9.5).cloud).toBeGreaterThan(10); expect(zoomRadii(-9.5).nucleus).toBeLessThan(0.01);
    expect(zoomRadii(-14).nucleus).toBeGreaterThan(10); expect(zoomRadii(-14).cloud).toBeGreaterThan(zoomRadii(-14).nucleus * 1000);
    for (let k = -14.5; k <= -8.5; k += 0.5) expectInside(() => zoomScene(k), 1);
  });
  it('isotope picture: the mean line equals the weighted mean and lies between the isotopes', () => {
    for (const el of Object.keys(ISOTOPES)) {
      expect(isoScene(el, null, 'de').data.mean).toBeCloseTo(atomicWeight(ISOTOPES[el]), 9);
      expectInside(() => isoScene(el, null, 'de'), 1);
      for (const p of [0, 50, 100]) { const g = isoScene(el, p, 'en'); expect(g.data.mean).toBeGreaterThanOrEqual(ISOTOPES[el][0].mass - 1e-9); expect(g.data.mean).toBeLessThanOrEqual(ISOTOPES[el][1].mass + 1e-9); }
    }
  });
  it('boxes, molecules and ionic compounds fit and do not overlap', () => {
    for (const s of [null, 'a', 'b', 'c', 'd'] as const) expectInside(() => boxesScene(s as never), 1);
    for (const m of Object.keys(MOLS)) for (const r of ['structural', 'ballstick', 'space'] as const) { expectInside(() => molScene(m, r), 1); expectNoOverlap(() => molScene(m, r), 1, 0.3); }
    expect(shape(molScene('CH4', 'space'), 'a0')!.r).toBeGreaterThan(shape(molScene('CH4', 'ballstick'), 'a0')!.r!);
    for (const c of CATIONS) for (const a of ANIONS) expect(ionicScene(c, a).data.charge).toBe(0);
    for (const c of CATIONS.filter((x) => x.bold)) for (const a of ANIONS.filter((x) => ['N', 'PO4', 'SO4', 'Cl'].includes(x.f))) expectInside(() => ionicScene(c, a), 1);
    expect(ionicScene(CATIONS.find((c) => c.f === 'Mg')!, ANIONS.find((a) => a.f === 'N')!).data).toMatchObject({ nCation: 3, nAnion: 2 });
  }, 30000);
});
