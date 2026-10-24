import { describe, expect, it } from 'vitest';
import { WATER_CS } from '../../chem/thermo';
import { CAL, calScene, thermoY } from './calScene';
import { FL, firstLawScene, pistonTarget } from './firstLawScene';
import { mixScene } from './thermoMixScene';
import { DE_WATER_L, SF, W_RANGE, stateFnScene } from './stateFnScene';
import { SYS_FLOWS, systemScene, type SysKind } from './systemScene';
import { expectInside, expectNoOverlap, lab, shape } from './cTestKit';

describe('first-law explorer (slides 12–13, exercise 1)', () => {
  const cases = [[6, 4], [-6, -4], [-4, 8], [0, 8], [8, -8], [0, 0], [10, 10], [-10, -10], [10, -10]];
  it('inside the figure and no overlapping labels for all presets and the corners', () => {
    for (const [q, w] of cases) for (const lang of ['de', 'en'] as const) {
      const sc = firstLawScene(q, w, pistonTarget(w), lang);
      expect(sc.labels.length).toBeGreaterThan(3);
      for (const l of sc.labels) { expect(l.at[0]).toBeGreaterThanOrEqual(0); expect(l.at[0]).toBeLessThanOrEqual(FL.W); }
      for (let i = 0; i < sc.labels.length; i++) for (let j = i + 1; j < sc.labels.length; j++) {
        const a = sc.labels[i], b = sc.labels[j];
        void a; void b;
      }
    }
    expectInside((_s, _t, l) => firstLawScene(10, 10, pistonTarget(10), l), 1);
    expectInside((_s, _t, l) => firstLawScene(-10, -10, pistonTarget(-10), l), 1);
    expectNoOverlap((s, _t, l) => firstLawScene(cases[s][0], cases[s][1], pistonTarget(cases[s][1]), l), cases.length);
  });
  it('the ledger is to scale: E_final bar = E_initial + q + w, bars add up', () => {
    for (const [q, w] of cases) {
      const sc = firstLawScene(q, w, pistonTarget(w), 'de');
      const h = (k: string) => shape(sc, k)!.pts[1][1];
      expect(h('bar-E0')).toBeCloseTo(FL.E0 * FL.kJ, 9);
      expect(h('bar-E1')).toBeCloseTo(Math.max(1.5, (FL.E0 + q + w) * FL.kJ), 9);
      expect(sc.data.dE).toBe(q + w);
      expect(h('bar-q')).toBeCloseTo(Math.max(1.5, Math.abs(q) * FL.kJ), 9);
    }
  });
  it('exercise 1: (i) q out/w in → ΔE > 0; (ii) ΔE > 0; (iii) ΔE = 0 and heat flows in', () => {
    const i = firstLawScene(-4, 8, pistonTarget(8), 'de'), ii = firstLawScene(0, 8, pistonTarget(8), 'de'), iii = firstLawScene(8, -8, pistonTarget(-8), 'de');
    expect(i.data.dE).toBeGreaterThan(0); expect(ii.data.dE).toBeGreaterThan(0); expect(iii.data.dE).toBe(0);
    expect(lab(i, 'lab-q')?.tex).toBe('q<0'); expect(lab(iii, 'lab-q')?.tex).toBe('q>0'); expect(lab(ii, 'lab-q')).toBeUndefined();
    expect(lab(iii, 'lab-w')?.tex).toBe('w<0'); expect(lab(i, 'lab-w')?.tex).toBe('w>0');
  });
  it('w > 0 pushes the piston in (larger y), w < 0 lets it out; monotone', () => {
    expect(pistonTarget(8)).toBeGreaterThan(pistonTarget(0)); expect(pistonTarget(-8)).toBeLessThan(pistonTarget(0));
    expect(pistonTarget(10)).toBeLessThan(FL.base - 40);
  });
});

describe('system types (slide 9)', () => {
  const kinds: SysKind[] = ['open', 'closed', 'isolated'];
  it('inside, no overlap', () => { expectInside((s, _t, l) => systemScene(kinds[s], l), 3); expectNoOverlap((s, _t, l) => systemScene(kinds[s], l), 3); });
  it('what crosses: matter arrows only for open systems; heat arrows for open and closed, blocked for isolated', () => {
    const o = systemScene('open', 'de'), c = systemScene('closed', 'de'), i = systemScene('isolated', 'de');
    expect(shape(o, 'steam-1')).toBeDefined(); expect(shape(c, 'steam-1')).toBeUndefined(); expect(shape(i, 'steam-1')).toBeUndefined();
    expect(shape(c, 'heat-1')).toBeDefined(); expect(shape(i, 'x-heat-a')).toBeDefined(); expect(shape(i, 'x-m-a')).toBeDefined();
    expect(SYS_FLOWS.open).toEqual({ matter: true, energy: true }); expect(SYS_FLOWS.closed).toEqual({ matter: false, energy: true }); expect(SYS_FLOWS.isolated).toEqual({ matter: false, energy: false });
  });
});

describe('state function figure (slide 15)', () => {
  it('ΔE = −564.2 kJ for 2 H₂ + O₂ → 2 H₂O(l); both methods end at the same ΔE for every w', () => {
    expect(DE_WATER_L).toBeCloseTo(-564.16, 1);
    for (let w = W_RANGE[0]; w <= W_RANGE[1]; w += 20) {
      const sc = stateFnScene(w, 'de');
      expect(sc.data.sum1).toBeCloseTo(sc.data.sum2, 9); expect(sc.data.q2 + sc.data.w2).toBeCloseTo(DE_WATER_L, 9);
      const d0 = shape(sc, 'd0')!, d1 = shape(sc, 'd1')!;
      expect(d0.pts[1][1]).toBeCloseTo(d1.pts[1][1], 9); expect(d0.pts[1][1]).toBeCloseTo(-DE_WATER_L * SF.k, 6);
    }
  });
  it('inside, no overlap (typical values)', () => {
    const ws = [7.4, -150, -300, 20, 0];
    expectInside((s, _t, l) => stateFnScene(ws[s], l), ws.length); expectNoOverlap((s, _t, l) => stateFnScene(ws[s], l), ws.length);
  });
});

describe('calorimeter (slides 20–22)', () => {
  it('exothermic heats the water, endothermic cools it; ΔT = −q/(m C_s)', () => {
    const e = calScene('p', -5, 150, 'de'), n = calScene('p', 5, 150, 'de');
    expect(e.data.dT).toBeCloseTo(5000 / (150 * WATER_CS), 9); expect(n.data.dT).toBeCloseTo(-5000 / (150 * WATER_CS), 9);
    expect(thermoY(e.data.T1)).toBeLessThan(thermoY(CAL.T0)); expect(thermoY(n.data.T1)).toBeGreaterThan(thermoY(CAL.T0));
    expect(shape(e, 'qa1')?.cls).toContain('th-a-t'); expect(shape(n, 'qa1')?.cls).toContain('th-a-p');
    expect(shape(calScene('p', 0, 150, 'de'), 'qa1')).toBeUndefined();
  });
  it('inside the figure over the whole slider range, no overlap', () => {
    const cs: [number, number, 'p' | 'v'][] = [[-8, 100, 'p'], [8, 100, 'v'], [0, 300, 'p'], [-8, 300, 'v'], [3, 150, 'p']];
    expectInside((s, _t, l) => calScene(cs[s][2], cs[s][0], cs[s][1], l), cs.length); expectNoOverlap((s, _t, l) => calScene(cs[s][2], cs[s][0], cs[s][1], l), cs.length);
    for (const [q, m] of [[-8, 100], [8, 100]] as const) expect(calScene('p', q, m, 'de').data.T1).toBeGreaterThan(0);
  });
  it('bomb: ΔE label instead of ΔH', () => {
    expect(lab(calScene('v', -3, 150, 'de'), 'lab-qrxn')?.tex).toContain('\\Delta E'); expect(lab(calScene('p', -3, 150, 'de'), 'lab-qrxn')?.tex).toContain('\\Delta H');
  });
});

describe('coffee and spoon (exercise 4, Ex. 6)', () => {
  it('T_eq = 94.0 °C and the coffee cools by 0.99 K (not 89 °C)', () => {
    const sc = mixScene(45, 25, 'de');
    expect(sc.data.Teq).toBeCloseTo(94.0, 1); expect(sc.data.dTc).toBeCloseTo(-0.99, 2);
    expect(sc.data.qc + sc.data.qs).toBeCloseTo(0, 9);
  });
  it('inside, no overlap for extreme sliders', () => {
    const cs = [[45, 25], [400, 0], [5, 60], [400, 60]];
    expectInside((s, _t, l) => mixScene(cs[s][0], cs[s][1], l), cs.length); expectNoOverlap((s, _t, l) => mixScene(cs[s][0], cs[s][1], l), cs.length, 0.3);
  });
});
