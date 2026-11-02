import { describe, expect, it } from 'vitest';
import type { Lang } from '../../i18n';
import { labelBox, labelOverlap, type Scene } from '../anim/scene';
import {
  AXIS_STEPS, CUBE39_STEPS, CUBE43_STEPS, GM_STEPS, HCA_STEPS, PROOF_STEPS, SH, SW, TWO_STEPS, WAAGE_STEPS, axisProofScene, axisScene,
  coupleScene, cube39Scene, cube43Scene, discScene, equivScene, groupMomentAnim, groupMomentScene, halfCircleAnim, halfCircleScene,
  linkageScene, momentPointScene, parallelScene, polygonScene, proofScene, seesawScene, singleForceScene, twoForcesScene, waageScene,
} from './statikScenes';

const LANGS: Lang[] = ['de', 'en'];
const TS = [0, 0.25, 0.5, 0.75, 1];

function inside(s: Scene, W: number, H: number, tag: string) {
  for (const sh of s.shapes) for (const p of sh.pts) {
    expect(p[0], `${tag} ${sh.key}`).toBeGreaterThanOrEqual(-1); expect(p[0], `${tag} ${sh.key}`).toBeLessThanOrEqual(W + 1);
    expect(p[1], `${tag} ${sh.key}`).toBeGreaterThanOrEqual(-1); expect(p[1], `${tag} ${sh.key}`).toBeLessThanOrEqual(H + 1);
  }
  for (const l of s.labels) {
    const b = labelBox(l);
    expect(b.x1 - b.x0, `${tag} ${l.key} wider than the figure`).toBeLessThanOrEqual(W);
  }
}
function noOverlap(s: Scene, tag: string, max = 0.25) {
  const ls = s.labels.filter((l) => l.o > 0.5);
  for (let i = 0; i < ls.length; i++) for (let j = i + 1; j < ls.length; j++)
    expect(labelOverlap(ls[i], ls[j]), `${tag}: ${ls[i].key} / ${ls[j].key}`).toBeLessThan(max);
}
function anim(build: (s: number, t: number, l: Lang) => Scene, steps: number, H = SH) {
  for (const lang of LANGS) for (let s = 0; s < steps; s++) {
    for (const t of TS) inside(build(s, t, lang), SW, H, `${lang} ${s} ${t}`);
    noOverlap(build(s, 1, lang), `${lang} step ${s}`);
  }
}

describe('step animations: frames inside, final labels apart', () => {
  it('proof of the theorem', () => anim(proofScene, PROOF_STEPS));
  it('half circle', () => anim(halfCircleAnim, HCA_STEPS, 320));
  it('cube p. 39', () => anim(cube39Scene, CUBE39_STEPS));
  it('axis proof', () => anim(axisProofScene, AXIS_STEPS));
  it('group moment', () => anim(groupMomentAnim, GM_STEPS));
  it('two forces', () => anim(twoForcesScene, TWO_STEPS));
  it('cube p. 43', () => anim(cube43Scene, CUBE43_STEPS));
  it('Waage', () => anim(waageScene, WAAGE_STEPS, 260));
});

describe('final frames show what the captions say', () => {
  it('cube p. 39: M_O = (0, 0, LF) with L = 1.6, F = 1', () => { expect(cube39Scene(2, 1, 'de').data.Mz).toBeCloseTo(1.6, 9); });
  it('cube p. 43: R = 0, M_A = 0', () => { const d = cube43Scene(3, 1, 'de').data; expect(d.R).toBeCloseTo(0, 12); expect(d.M).toBeCloseTo(0, 12); });
  it('group moment: M_P = M_O + (R × OP)_z', () => { const d = groupMomentAnim(3, 1, 'de').data; expect(d.MP).toBeCloseTo(d.MO + d.shift, 12); });
  it('two forces: R slides along its line in the last step', () => { expect(twoForcesScene(3, 1, 'de').data.k3).toBe(1); expect(twoForcesScene(2, 1, 'de').data.k3).toBe(0); });
  it('Waage: A_y = F₁ + F₂, a₂ = a₁ F₁/F₂', () => { const d = waageScene(3, 1, 'de').data; expect(d.Ay).toBe(5); expect(d.a2).toBeCloseTo(1.8, 12); });
  it('half circle step 4 shows R̲', () => { expect(halfCircleAnim(4, 1, 'de').shapes.some((s) => s.key === 'R')).toBe(true); });
});

describe('explorers', () => {
  it('seesaw: zero power at F_A = (b/a) F_B; inside', () => {
    for (const mode of ['wippe', 'hebel'] as const) {
      const s = seesawScene({ mode, FA: 3 / 1.5, FB: 3, a: 1.5, b: 1, alpha: 1.1, tilt: 0.05 }, 'de');
      expect(s.data.P).toBeCloseTo(0, 12);
      inside(s, SW, 260, mode);
    }
  });
  it('equivalence tester: Fig 6.1 equal powers for all motions, Fig 6.2 not for tx', () => {
    for (const m of ['tx', 'ty', 'rotA', 'rotP'] as const) { const d = equivScene('61', m, 'de').data; expect(d.pG).toBeCloseTo(d.pS, 12); inside(equivScene('61', m, 'en'), SW, SH, m); }
    const d = equivScene('62', 'tx', 'de').data;
    expect(Math.abs(d.pG - d.pS)).toBeGreaterThan(0.1);
  });
  it('polygon, half circle, moment point, axis, group, single force, linkage, parallel, couple, disc: inside', () => {
    inside(polygonScene([{ A: [70, 120], F: [-0.9, -1.6] }, { A: [110, 175], F: [0.6, -1.4] }, { A: [150, 90], F: [2.6, 0.3] }], 'de'), SW, SH, 'poly');
    for (const n of [2, 6, 60]) inside(halfCircleScene(n, 'de'), SW, 320, `hc${n}`);
    for (const s of [-1.6, 0, 1.6]) { const sc = momentPointScene([0.6, 0.5], s, 'de'); inside(sc, SW, SH, `mp${s}`); }
    expect(momentPointScene([0.6, 0.5], -1.6, 'de').data.Mz).toBeCloseTo(momentPointScene([0.6, 0.5], 1.6, 'de').data.Mz, 12);
    inside(axisScene({ A: [1.6, 0.6, 0.9], F: [-1.2, 1.6, 1.5], zB: 2.2 }, { split: 1, lever: 1, proof: 1 }, 'de'), SW, SH, 'axis');
    expect(axisScene({ A: [1.6, 0, 0.9], F: [-1.4, 0, 1.2], zB: 0 }, {}, 'de').data.Mg).toBeCloseTo(0, 12);
    for (const P of [[0.2, 0.2], [6.0, 4.0], [4.6, 0.7]] as const) inside(groupMomentScene([P[0], P[1]], { tri: 1, R: 1, direct: 1 }, 'de'), SW, SH, `gm${P}`);
    expect(singleForceScene([1.6 + 1.2, 2.0 + 0.5], 'de').data.on).toBe(1);
    expect(singleForceScene([3, 1], 'de').data.on).toBe(0);
    for (const th of [0.9, 1.5, 2.2]) inside(linkageScene(th, 'de'), SW, SH, `lk${th}`);
    for (const F2 of [-3, -2, -1, 0, 1, 2, 3]) inside(parallelScene(2, F2, 'de'), SW, SH, `par${F2}`);
    expect(parallelScene(2, -2, 'de').data.couple).toBe(1);
    expect(parallelScene(2, 2, 'de').data.xR).toBeCloseTo(2, 12);
    for (const c of [0.6, 1, 3]) { const d = coupleScene(c, 0.6, 'de'); inside(d, SW, 240, `cp${c}`); expect(d.data.M2).toBeCloseTo(d.data.M, 12); }
    inside(discScene(true, 'de'), SW, SH, 'disc');
  });
});
