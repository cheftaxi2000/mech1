import { describe, expect, it } from 'vitest';
import { moveReference, plateNumbers, type Plate } from '../../physics/kraeftegruppe';
import { labelBox, labelOverlap, type Scene } from '../anim/scene';
import { E, EH, EW, E_LIM, E_PLATE, eMeter, ePx, explorerScene } from './K7ExplorerScene';
import { PRESETS } from './K7Figures';
import { ladderScene, wayLayers } from './K7LadderScene';
import { proofScene } from './K7ProofScene';
import { ladderSolScene } from './K7LadderSolScene';

const close = (a: number, b: number, tol = 1e-6) => expect(Math.abs(a - b), `${a} vs ${b}`).toBeLessThanOrEqual(tol);
const shape = (s: Scene, k: string) => s.shapes.find((x) => x.key === k);
const lab = (s: Scene, k: string) => s.labels.find((x) => x.key === k);
const xs = (s: Scene, k: string) => { const r = shape(s, k)!; return [Math.min(r.pts[0][0], r.pts[1][0]), Math.max(r.pts[0][0], r.pts[1][0])]; };

describe('reference-point explorer: scene', () => {
  const sc = (p: Plate) => explorerScene(p, 'de');
  it('coordinate maps are inverse to each other', () => {
    for (const p of [[0, 0], [1.3, -0.7], [-3, 1.5]] as const) { const q = eMeter(ePx(p)); close(q[0], p[0]); close(q[1], p[1]); }
  });
  it('all presets: everything inside the figure, labels apart, shape and label keys unique', () => {
    for (const [id, p] of Object.entries(PRESETS)) for (const lang of ['de', 'en'] as const) {
      const s = explorerScene(p, lang);
      for (const sh of s.shapes) for (const pt of sh.pts) { expect(pt[0], `${id} ${sh.key}`).toBeGreaterThanOrEqual(0); expect(pt[0]).toBeLessThanOrEqual(EW); expect(pt[1], `${id} ${sh.key}`).toBeGreaterThanOrEqual(0); expect(pt[1]).toBeLessThanOrEqual(EH); }
      for (const l of s.labels) { const b = labelBox(l); expect(b.x0, l.key).toBeGreaterThanOrEqual(0); expect(b.x1, l.key).toBeLessThanOrEqual(EW); expect(b.y0, l.key).toBeGreaterThanOrEqual(0); expect(b.y1, l.key).toBeLessThanOrEqual(EH); }
      const ls = s.labels.filter((l) => l.o > 0.5);
      for (let i = 0; i < ls.length; i++) for (let j = i + 1; j < ls.length; j++) expect(labelOverlap(ls[i], ls[j]), `${id}: ${ls[i].key} / ${ls[j].key}`).toBeLessThan(0.3);
      expect(new Set(s.shapes.map((x) => x.key)).size, `${id} shape keys`).toBe(s.shapes.length);
      expect(new Set(s.labels.map((x) => x.key)).size, `${id} label keys`).toBe(s.labels.length);
    }
  });
  it('the plate contains the points of every preset', () => {
    const half = (p: readonly [number, number]) => Math.hypot(p[0] / 3.4, p[1] / 1.9) < 1;
    for (const p of Object.values(PRESETS)) { expect(half(p.B)).toBe(true); for (const f of p.forces) expect(half(f.A)).toBe(true); }
    expect(E_PLATE.length).toBeGreaterThan(10);
    expect(E_LIM.x).toBeLessThan(3.4);
  });
  it('the total line stays put when B moves; only the split between R·v_B and M_B·ω changes', () => {
    for (const p of Object.values(PRESETS)) {
      const a = sc(p), n = plateNumbers(p);
      for (const B2 of [[1.5, 1], [-2.5, -1], [0, 1.7], [3, -1.5]] as const) {
        const q = moveReference(p, B2), b = sc(q);
        close(shape(a, 'total')!.pts[0][0], shape(b, 'total')!.pts[0][0], 1e-6);
        close(b.data.total, a.data.total, 1e-9);
        close(b.data.sumP, a.data.sumP, 1e-9);
        // group A is untouched by the move: every force keeps the velocity of its own point
        for (const k of ['PA1', 'PA2']) { const sa = shape(a, k), sb = shape(b, k); if (sa && sb) { close(xs(a, k)[0], xs(b, k)[0]); close(xs(a, k)[1], xs(b, k)[1]); } }
        void n;
      }
    }
    const p = PRESETS.skript, a = sc(p), b = sc(moveReference(p, [3, -1.5]));
    expect(Math.abs(xs(a, 'RV')[1] - xs(b, 'RV')[1]) + Math.abs(xs(a, 'RV')[0] - xs(b, 'RV')[0])).toBeGreaterThan(5);
  });
  it('waterfall rows: group A ends at the total line, group B ends at the total line', () => {
    for (const p of Object.values(PRESETS)) {
      const s = sc(p), n = plateNumbers(p);
      const barX = (w: number) => Math.max(E.XMIN, Math.min(E.XMAX, E.X0 + E.KW * w));
      const xT = shape(s, 'total')!.pts[0][0];
      close(xT, barX(n.total));
      // last used force row ends at the total (the rows of unused forces have no bar)
      const used = p.forces.map((f, i) => (Math.hypot(f.F[0], f.F[1]) > 0.04 ? i : -1)).filter((i) => i >= 0);
      const last = used[used.length - 1];
      let c = 0; n.P.forEach((v, i) => { if (used.includes(i)) c += v; });
      void last;
      close(barX(c), xT, 1e-6);
      close(barX(n.translation + n.rotation), xT, 1e-6);
      const rv = shape(s, 'RV'), mw = shape(s, 'MW');
      if (rv) { const [a0, a1] = xs(s, 'RV'); expect(Math.abs(a0 - E.X0) < 1e-6 || Math.abs(a1 - E.X0) < 1e-6).toBe(true); }
      if (mw) { const [b0, b1] = xs(s, 'MW'); expect(Math.abs(b0 - barX(n.translation)) < 1e-6 || Math.abs(b1 - barX(n.translation)) < 1e-6).toBe(true); }
    }
  });
  it('special cases of the presets', () => {
    const punkt = plateNumbers(PRESETS.punkt);
    close(punkt.MB, 0); close(punkt.rotation, 0); close(punkt.total, punkt.translation); // one point: P = R·v_A
    const paar = plateNumbers(PRESETS.paar);
    close(Math.hypot(...paar.R), 0); close(paar.translation, 0); close(paar.total, paar.rotation); expect(paar.total).toBeGreaterThan(1);
    const schub = plateNumbers(PRESETS.schub);
    close(schub.rotation, 0); close(schub.total, schub.translation);
    const dreh = plateNumbers(PRESETS.dreh);
    close(dreh.translation, 0); close(dreh.total, dreh.rotation);
    // … but only in B: described in another point, the same body motion has R·v_B ≠ 0
    expect(Math.abs(plateNumbers(moveReference(PRESETS.dreh, [2, 1])).translation)).toBeGreaterThan(0.1);
    close(plateNumbers(moveReference(PRESETS.dreh, [2, 1])).total, dreh.total, 1e-9);
  });
  it('numbers on screen add up (largest-remainder rounding): R·v_B + M_B·ω = P and P_1 + P_2 + … = P', () => {
    for (const p of Object.values(PRESETS)) for (const B2 of [[0, 0], [1.3, 0.4], [-2.2, -0.9]] as const) {
      const s = explorerScene(moveReference(p, B2), 'en');
      const val = (k: string) => { const l = lab(s, k); return l ? Number(l.tex.replace('\\,\\text{W}', '').replace('P = ', '')) : NaN; };
      const a = Number(lab(s, 'lab-RV')!.tex), b = Number(lab(s, 'lab-MW')!.tex), tot = val('lab-total');
      close(a + b, tot, 1e-9);
      const ps = ['lab-PA1', 'lab-PA2', 'lab-PA3'].map((k) => lab(s, k)).filter(Boolean).map((l) => Number(l!.tex));
      close(ps.reduce((x, y) => x + y, 0), tot, 1e-9);
    }
  });
});

describe('all K7 scenes: unique keys', () => {
  it('proof, ladder', () => {
    const scenes: Scene[] = [];
    for (let st = 0; st < 7; st++) scenes.push(proofScene(st, 1, 'de'));
    for (const w of ['I', 'II'] as const) scenes.push(ladderScene({ v: 1, omega: 0.5, G: 20, W: 15 }, 'de', wayLayers(w)));
    for (let st = 0; st < 6; st++) scenes.push(ladderSolScene(st, 1, 'de'));
    for (const s of scenes) {
      expect(new Set(s.shapes.map((x) => x.key)).size).toBe(s.shapes.length);
      const dup = s.labels.map((x) => x.key).filter((k, i, a) => a.indexOf(k) !== i);
      expect(dup).toEqual([]);
    }
  });
});
