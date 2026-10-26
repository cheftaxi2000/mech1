import { describe, expect, it } from 'vitest';
import { ladder } from '../../physics/force';
import { ladderParts } from '../../physics/kraeftegruppe';
import { labelBox, labelOverlap, type Scene } from '../anim/scene';
import { LD, LH, LW, barX, ladderScene, lPx, wayLayers, type Way } from './K7LadderScene';
import { SOL, ladderSolScene, solLayers } from './K7LadderSolScene';

const close = (a: number, b: number, tol = 1e-6) => expect(Math.abs(a - b), `${a} vs ${b}`).toBeLessThanOrEqual(tol);
const shape = (s: Scene, k: string) => s.shapes.find((x) => x.key === k);
const lab = (s: Scene, k: string) => s.labels.find((x) => x.key === k);
const S2 = Math.SQRT1_2;

function expectInside(s: Scene, what: string) {
  for (const sh of s.shapes) for (const p of sh.pts) {
    expect(p[0], `${what} ${sh.key}`).toBeGreaterThanOrEqual(0); expect(p[0], `${what} ${sh.key}`).toBeLessThanOrEqual(LW);
    expect(p[1], `${what} ${sh.key}`).toBeGreaterThanOrEqual(0); expect(p[1], `${what} ${sh.key}`).toBeLessThanOrEqual(LH);
  }
  for (const l of s.labels) {
    const b = labelBox(l);
    expect(b.x0, `${what} ${l.key}`).toBeGreaterThanOrEqual(0); expect(b.x1, `${what} ${l.key}`).toBeLessThanOrEqual(LW);
    expect(b.y0, `${what} ${l.key}`).toBeGreaterThanOrEqual(0); expect(b.y1, `${what} ${l.key}`).toBeLessThanOrEqual(LH);
  }
}
function expectNoOverlap(s: Scene, what: string, max = 0.3) {
  const ls = s.labels.filter((l) => l.o > 0.5);
  for (let i = 0; i < ls.length; i++) for (let j = i + 1; j < ls.length; j++) expect(labelOverlap(ls[i], ls[j]), `${what}: ${ls[i].key} / ${ls[j].key}`).toBeLessThan(max);
}
const bars = (s: Scene, k: string) => { const r = shape(s, k)!; return { x0: Math.min(r.pts[0][0], r.pts[1][0]), x1: Math.max(r.pts[0][0], r.pts[1][0]) }; };

describe('ladder (Fig. 5.6): interactive scene', () => {
  const par = { v: 1, omega: 0.5, G: 20, W: 15 };
  const q = ladderParts({ ...par, L: LD.L });
  it('the numbers of the default (checked against the closed forms of the lecture)', () => {
    close(q.PB, -20 * S2 * 0.5 * 4); close(q.PC, 15 * (0.5 * 4 / 2 - S2)); close(q.RvA, -S2 * 15); close(q.MAomega, 0.5 * (15 * 2 - S2 * 20 * 4));
    close(q.wegI, q.wegII); close(q.wegI, ladder({ ...par, L: LD.L }).closed);
  });
  for (const way of ['I', 'II'] as Way[]) {
    it(`way ${way}: everything inside the figure, labels apart (both languages, extreme slider values too)`, () => {
      for (const lang of ['de', 'en'] as const) for (const p of [par, { v: -2, omega: 0.8, G: 30, W: 30 }, { v: 2, omega: -0.8, G: 0, W: 0 }, { v: 0, omega: 0, G: 10, W: 10 }]) {
        const s = ladderScene(p, lang, wayLayers(way));
        expectInside(s, `${way} ${lang} ${JSON.stringify(p)}`);
      }
      expectNoOverlap(ladderScene(par, 'de', wayLayers(way)), `way ${way} de`);
      expectNoOverlap(ladderScene(par, 'en', wayLayers(way)), `way ${way} en`);
    });
  }
  it('the two bar rows of each way end at the same line as the total: P = P_B + P_C = R·v_A + M_A·ω', () => {
    const s = ladderScene(par, 'de', wayLayers('I'));
    const pb = bars(s, 'PB'), pc = bars(s, 'PC'), rv = bars(s, 'RV'), mw = bars(s, 'MW');
    const xT = shape(s, 'total')!.pts[0][0];
    close(xT, barX(q.wegI));
    close(pb.x1, LD.X0); close(pb.x0, barX(q.PB)); // P_B < 0: the bar lies left of zero
    expect(pb.x0).toBeLessThan(LD.X0);
    close(pc.x0, barX(q.PB)); // P_C starts where P_B ended (P_C > 0 → to the right)
    close(pc.x1, barX(q.wegI));
    close(rv.x1, LD.X0); close(rv.x0, barX(q.RvA)); close(mw.x1, barX(q.RvA)); close(mw.x0, barX(q.wegII));
    close(barX(q.wegI), barX(q.wegII));
  });
  it('way I: copy of v_A + rotation part = v_B, v_C (head to tail), rotation part ⟂ ladder, shadows on the lines of the forces', () => {
    const s = ladderScene(par, 'de', wayLayers('I'));
    const A = lPx([0, 0]), B = lPx([q.m.AB[0], q.m.AB[1]]), C = lPx([q.m.AC[0], q.m.AC[1]]);
    for (const [P, k, v] of [[B, 'B', q.vB], [C, 'C', q.vC]] as const) {
      const t = shape(s, `vt${k}`)!, r = shape(s, `vr${k}`)!, sum = shape(s, `v${k}`)!;
      close(t.pts[0][0], P[0]); close(t.pts[1][0] - P[0], LD.KV * par.v); close(t.pts[1][1] - P[1], 0);
      close(r.pts[0][0], t.pts[1][0]); close(r.pts[1][0], sum.pts[1][0]); close(r.pts[1][1], sum.pts[1][1]);
      close(sum.pts[1][0] - P[0], LD.KV * v[0]); close(sum.pts[1][1] - P[1], -LD.KV * v[1]);
      // the rotation part is perpendicular to the ladder: (1,1)·(dx,−dy) = 0
      close((r.pts[1][0] - r.pts[0][0]) * S2 + -(r.pts[1][1] - r.pts[0][1]) * S2, 0);
    }
    void A;
    // shadow of v_B on F_B's line: LD.KV · (v_B · e_down)
    const sb = shape(s, 'shB-r')!;
    close(sb.pts[1][1] - sb.pts[0][1], LD.KV * q.alongG); close(sb.pts[1][0], sb.pts[0][0]);
    // at C: copy part then rotation part along F_C's line; together LD.KV · alongW
    const st = shape(s, 'shC-t')!, sr = shape(s, 'shC-r')!;
    const dir = [-S2, -S2];
    const len = (a: readonly [number, number], b: readonly [number, number]) => (b[0] - a[0]) * dir[0] + (b[1] - a[1]) * dir[1];
    close(len(st.pts[0], st.pts[1]), -LD.KV * S2 * par.v); close(len(sr.pts[0], sr.pts[1]), LD.KV * par.omega * LD.L / 2);
    close(len(st.pts[0], sr.pts[1]), LD.KV * q.alongW);
    close(sr.pts[0][0], st.pts[1][0]);
  });
  it('way II: R at A is F_B + F_C, only its horizontal part meets v_A; moments M_AG < 0 (⊗), M_AW > 0 (⊙), M_A = their sum', () => {
    const s = ladderScene(par, 'de', wayLayers('II'));
    const A = lPx([0, 0]), R = shape(s, 'R')!;
    close(R.pts[1][0] - A[0], LD.KF * q.R[0]); close(R.pts[1][1] - A[1], -LD.KF * q.R[1]);
    close(q.R[0], -S2 * par.W); close(q.R[1], S2 * par.W - par.G);
    expect(shape(s, 'sMG-x1')).toBeDefined(); expect(shape(s, 'sMG-dot')).toBeUndefined(); // ⊗
    expect(shape(s, 'sMW-dot')).toBeDefined(); // ⊙
    expect(shape(s, 'sMA-x1')).toBeDefined(); // M_A = −26.6 < 0: into the page
    close(q.MA, q.MAG + q.MAW); expect(lab(s, 'lab-sMA')!.tex).toContain('{,}');
    expect(lab(ladderScene(par, 'en', wayLayers('II')), 'lab-sMA')!.tex).not.toContain('{,}');
    const sh = shape(s, 'shR')!;
    close(Math.hypot(sh.pts[1][0] - sh.pts[0][0], sh.pts[1][1] - sh.pts[0][1]), Math.abs(LD.KV * par.v * q.R[0] / Math.hypot(...q.R)));
  });
  it('plausibility cases: ω = 0 → P_B = 0 and only W resists; v = 0 → P_B < 0, P_C > 0', () => {
    const a = ladderParts({ v: 1, omega: 0, G: 20, W: 15, L: 4 });
    close(a.PB, 0); expect(a.PC).toBeLessThan(0);
    const b = ladderParts({ v: 0, omega: 0.5, G: 20, W: 15, L: 4 });
    expect(b.PB).toBeLessThan(0); expect(b.PC).toBeGreaterThan(0);
    close(ladderParts({ v: 0, omega: 0.5, G: 20, W: 15, L: 4 }).RvA, 0);
  });
});

describe('ladder: step animation of the solution', () => {
  const q = ladderParts({ ...SOL, L: LD.L });
  it('every frame inside the figure; final frames: no overlapping labels', () => {
    for (const lang of ['de', 'en'] as const) for (let step = 0; step < 6; step++) {
      for (let i = 0; i <= 10; i++) expectInside(ladderSolScene(step, i / 10, lang), `step ${step} t ${i / 10} ${lang}`);
      expectNoOverlap(ladderSolScene(step, 1, lang), `step ${step} ${lang}`);
    }
  });
  it('final frames show what the captions say', () => {
    const s0 = ladderSolScene(0, 1, 'de');
    expect(shape(s0, 'vB')).toBeUndefined(); expect(shape(s0, 'PB')).toBeUndefined(); expect(shape(s0, 'FB')).toBeDefined(); expect(shape(s0, 'vA')).toBeDefined(); expect(shape(s0, 'om-dot')).toBeDefined();
    const s1 = ladderSolScene(1, 1, 'de');
    for (const k of ['vtB', 'vrB', 'vB', 'vtC', 'vrC', 'vC']) expect(shape(s1, k), k).toBeDefined();
    expect(shape(s1, 'PB')).toBeUndefined(); expect(shape(s1, 'shB-r')).toBeUndefined();
    const s2 = ladderSolScene(2, 1, 'de');
    expect(shape(s2, 'shB-r')).toBeDefined(); expect(shape(s2, 'PB')?.o).toBe(1); expect(shape(s2, 'PC')?.o).toBe(1); expect(shape(s2, 'RV')).toBeUndefined();
    expect(lab(s2, 'lab-PB')!.tex).toContain(`${(Math.abs(q.PB)).toFixed(1).replace('.', '{,}')}`);
    const s3 = ladderSolScene(3, 1, 'de');
    expect(shape(s3, 'R')).toBeDefined(); expect(shape(s3, 'sMA-x1')).toBeDefined(); expect(shape(s3, 'vB')).toBeUndefined(); expect(shape(s3, 'RV')).toBeUndefined();
    expect(shape(s3, 'PB')?.o).toBeCloseTo(0.4, 9);
    const s4 = ladderSolScene(4, 1, 'de');
    expect(shape(s4, 'RV')?.o).toBe(1); expect(shape(s4, 'MW')?.o).toBe(1);
    const s5 = ladderSolScene(5, 1, 'de');
    expect(shape(s5, 'PB')?.o).toBe(1); expect(shape(s5, 'MW')?.o).toBe(1);
    const xT = shape(s5, 'total')!.pts[0][0];
    close(xT, barX(q.wegI)); close(Math.min(bars(s5, 'PC').x0, bars(s5, 'PC').x1), barX(q.PB)); close(bars(s5, 'PC').x1, xT); close(bars(s5, 'MW').x0, xT);
    expect(solLayers(5, 1).total).toBe(1);
  });
  it('the animation proper: layers of the next step are not there at t = 0', () => {
    expect(solLayers(1, 0).vel).toBe(0); expect(solLayers(2, 0).shadow).toBe(0); expect(solLayers(2, 0).barsI).toBe(0);
    expect(solLayers(3, 0).R).toBe(0); expect(solLayers(4, 0).barsII).toBeCloseTo(0, 9);
  });
});
