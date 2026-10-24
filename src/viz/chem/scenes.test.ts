import { describe, expect, it } from 'vitest';
import { expectInside, expectNoOverlap, lab, shape } from '../anim/sceneTestKit';
import { ionScene, ionState, R_NA_ION, R_CL_ION } from './ionScene';
import { hydrationScene, waterPoses, IONS, nearCrystal } from './hydrationScene';
import { precipScene, neutralScene, PRECIP, layout, N_EACH, mixState } from './mixScene';
import { balanceScene, STATES } from './balanceScene';
import { waterAtoms } from './sceneKit';

describe('NaCl ion formation (slide 21)', () => {
  it('every frame inside, final labels do not overlap', () => { expectInside(ionScene, 3); expectNoOverlap(ionScene, 3); });
  it('step 0: neutral atoms with equal numbers of p and e', () => {
    const f = ionScene(0, 1, 'de');
    expect(lab(f, 'na-cnt0')?.o).toBe(1); expect(lab(f, 'cl-cnt0')?.o).toBe(1);
    expect(lab(f, 'na-cnt0')!.rows![1].tex).toContain('11'); expect(lab(f, 'cl-cnt0')!.rows![1].tex).toContain('17');
  });
  it('step 1: Na shrinks, Cl grows, counts 11/10 and 17/18, electron arrives at Cl', () => {
    const f = ionScene(1, 1, 'de');
    expect(f.data.rNa).toBeCloseTo(R_NA_ION, 6); expect(f.data.rCl).toBeCloseTo(R_CL_ION, 6);
    expect(lab(f, 'na-cnt1')!.rows![1].tex).toContain('10'); expect(lab(f, 'cl-cnt1')!.rows![1].tex).toContain('18');
    expect(f.data.ex).toBeGreaterThan(f.data.clX - f.data.rCl); expect(f.data.ex).toBeLessThan(f.data.clX);
  });
  it('step 2: the ions touch', () => {
    const s = ionState(2, 1);
    expect(s.naX + s.rNa).toBeCloseTo(s.clX - s.rCl, 6);
    expect(shape(ionScene(2, 1, 'de'), 'pull1')?.o).toBe(1);
  });
});

describe('hydration (slides 9–10)', () => {
  it('every frame inside, final labels do not overlap', () => { expectInside(hydrationScene, 3); expectNoOverlap(hydrationScene, 3); });
  it('step 1 final: waters beside a cation point their O towards it; beside an anion their H', () => {
    const P = waterPoses(1, 1);
    IONS.forEach((ion, k) => {
      for (let j = 0; j < 3; j++) {
        if (!nearCrystal(k, j)) continue;
        const { O, H1, H2 } = waterAtoms(P[3 * k + j].c, P[3 * k + j].th);
        const d = (p: readonly [number, number]) => Math.hypot(p[0] - ion.crystal[0], p[1] - ion.crystal[1]);
        if (ion.cat) expect(d(O)).toBeLessThan(Math.min(d(H1), d(H2)));
        else expect(Math.max(d(H1), d(H2))).toBeLessThan(d(O));
      }
    });
  });
  it('step 2 final: every ion has three waters at the right distance, oriented correctly', () => {
    const P = waterPoses(2, 1);
    IONS.forEach((ion, k) => {
      for (let j = 0; j < 3; j++) {
        const { O, H1, H2 } = waterAtoms(P[3 * k + j].c, P[3 * k + j].th);
        const d = (p: readonly [number, number]) => Math.hypot(p[0] - ion.free[0], p[1] - ion.free[1]);
        expect(d(P[3 * k + j].c)).toBeLessThan(25);
        if (ion.cat) expect(d(O)).toBeLessThan(Math.min(d(H1), d(H2))); else expect(Math.max(d(H1), d(H2))).toBeLessThan(d(O));
      }
    });
  });
  it('the crystal alternates cations and anions', () => {
    for (const a of IONS) for (const b of IONS) if (Math.hypot(a.crystal[0] - b.crystal[0], a.crystal[1] - b.crystal[1]) === 30) expect(a.cat).not.toBe(b.cat);
  });
});

describe('mixing two solutions (slides 13–15, 18)', () => {
  it('every frame inside, final labels do not overlap', () => {
    for (const f of [precipScene, neutralScene]) { expectInside(f, 4); expectNoOverlap(f, 4, 0.3); }
  });
  it('16 ions, 4 of each kind; no two overlap at the end of the mixing step', () => {
    const L = layout(PRECIP);
    expect(L).toHaveLength(16);
    for (const k of ['A', 'X', 'B', 'Y']) expect(L.filter((p) => p.kind === k)).toHaveLength(N_EACH);
    for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) expect(Math.hypot(L[i].p1[0] - L[j].p1[0], L[i].p1[1] - L[j].p1[1])).toBeGreaterThan(18);
  });
  it('step 0: A and X on the left, B and Y on the right', () => {
    for (const p of layout(PRECIP)) expect(p.kind === 'A' || p.kind === 'X' ? p.p0[0] < 200 : p.p0[0] > 200).toBe(true);
  });
  it('precipitation: A and Y end as a row at the bottom; spectators become rings in step 3', () => {
    const f2 = precipScene(2, 1, 'de');
    expect(f2.data.react).toBe(1);
    expect(shape(f2, 'A0')?.pts[0][1]).toBe(246);
    expect(shape(f2, 'X0-ring')).toBeUndefined();
    const f3 = precipScene(3, 1, 'de');
    expect(shape(f3, 'X0-ring')?.o).toBe(1); expect(shape(f3, 'B0-ring')?.o).toBe(1); expect(shape(f3, 'A0-ring')).toBeUndefined();
    expect(lab(f3, 'prod')?.o).toBe(1);
  });
  it('neutralisation: ions turn into four water molecules', () => {
    const f = neutralScene(2, 1, 'de');
    expect(shape(f, 'A0')).toBeUndefined();
    for (let i = 0; i < 4; i++) expect(shape(f, `h2o${i}-o`)?.o).toBe(1);
    expect(mixState(1, 1).divider).toBe(0);
  });
});

describe('balancing H₂ + O₂ → H₂O (slides 26–27)', () => {
  it('every frame inside, final labels do not overlap', () => { expectInside(balanceScene, 4); expectNoOverlap(balanceScene, 4, 0.3); });
  it('atoms are counted from the molecules: step 0 unbalanced in O, steps 2 and 3 balanced', () => {
    const count = (n: [number, number, number]) => ({ Hl: 2 * n[0], Hr: 2 * n[2], Ol: 2 * n[1], Or: n[2] });
    STATES.forEach((s) => { if (s.ledger) expect([s.ledger.H[0], s.ledger.H[1], s.ledger.O[0], s.ledger.O[1]]).toEqual([count(s.n).Hl, count(s.n).Hr, count(s.n).Ol, count(s.n).Or]); });
    const f0 = balanceScene(0, 1, 'de');
    expect(f0.data.Ol).toBe(2); expect(f0.data.Or).toBe(1); expect(lab(f0, 'lg-O-eq')?.tex).toContain('neq');
    for (const s of [2, 3]) { const f = balanceScene(s, 1, 'de'); expect(f.data.Hl).toBe(f.data.Hr); expect(f.data.Ol).toBe(f.data.Or); expect(lab(f, 'lg-O-eq')?.tex).toBe('='); }
  });
  it('step 1 shows the two equations; step 2 has a half O₂; step 3 the coefficients 2 1 2', () => {
    const f1 = balanceScene(1, 1, 'de');
    expect(lab(f1, 'lg-H-eqn')?.tex).toBe('2a = 2c'); expect(lab(f1, 'lg-O-eqn')?.tex).toBe('2b = c');
    expect(lab(f1, 'coef0')?.tex).toBe('a');
    expect(shape(balanceScene(2, 1, 'de'), 'm10-ghost')).toBeDefined();
    const f3 = balanceScene(3, 1, 'de');
    expect([lab(f3, 'coef0')?.tex, lab(f3, 'coef1')?.tex, lab(f3, 'coef2')?.tex]).toEqual(['2', '1', '2']);
    expect(shape(f3, 'm01-a')).toBeDefined(); expect(shape(f3, 'm21-o')).toBeDefined();
  });
});
