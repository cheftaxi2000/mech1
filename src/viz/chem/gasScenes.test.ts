import { describe, expect, it } from 'vitest';
import { idealV, roundSig, solveFinal, cToK } from '../../chem/gas';
import { AIR, BALLOON, BARO, CYL, DALTON, IGL_STATES, airColumnScene, balloonScene, balloonV, baroScene, daltonScene, iglScene, iglV } from './gasScenes';
import { expectInside, expectNoOverlap, lab, shape } from './sceneTestKit';

describe('air column (slide 11)', () => {
  it('every frame inside the figure; final labels do not overlap', () => { expectInside(airColumnScene, 4); expectNoOverlap(airColumnScene, 4); });
  it('final frames show what the captions say', () => {
    const f0 = airColumnScene(0, 1, 'de');
    expect(f0.data.rise).toBe(1); expect(lab(f0, 'lab-A')?.o).toBe(1); expect(lab(f0, 'lab-m')).toBeUndefined();
    const f1 = airColumnScene(1, 1, 'de');
    expect(lab(f1, 'lab-m')?.o).toBe(1); expect(shape(f1, 'g0')).toBeDefined(); expect(lab(f1, 'lab-F')).toBeUndefined();
    const f2 = airColumnScene(2, 1, 'de');
    expect(lab(f2, 'lab-F')?.o).toBe(1); expect(shape(f2, 'F')).toBeDefined(); expect(lab(f2, 'lab-P')).toBeUndefined();
    const f3 = airColumnScene(3, 1, 'en');
    expect(lab(f3, 'lab-P')?.o).toBe(1); expect(shape(f3, 'p4')).toBeDefined();
    expect(AIR.top).toBeLessThan(AIR.ground);
  });
  it('the air is denser at the bottom than at the top', () => {
    const f = airColumnScene(0, 1, 'de');
    const ys = f.shapes.filter((s) => /^m\d+$/.test(s.key)).map((s) => s.pts[0][1]);
    const mid = (AIR.top + AIR.ground) / 2;
    expect(ys.filter((y) => y > mid).length).toBeGreaterThan(ys.filter((y) => y <= mid).length * 2);
  });
});

describe('barometer (slide 12)', () => {
  it('every frame inside; final labels do not overlap', () => { expectInside(baroScene, 5); expectNoOverlap(baroScene, 5); });
  it('final frames show what the captions say', () => {
    const f0 = baroScene(0, 1, 'de');
    expect(lab(f0, 'lab-Patm')?.o).toBe(1); expect(lab(f0, 'lab-h')?.o).toBe(1); expect(lab(f0, 'f1')).toBeUndefined();
    const f1 = baroScene(1, 1, 'de');
    expect(shape(f1, 'W')).toBeDefined(); expect(lab(f1, 'f1')?.o).toBe(1); expect(lab(f1, 'f2')).toBeUndefined();
    const f2 = baroScene(2, 1, 'de');
    expect(shape(f2, 'A-line')).toBeDefined(); expect(lab(f2, 'f2')?.o).toBe(1); expect(lab(f2, 'f3')).toBeUndefined();
    const f3 = baroScene(3, 1, 'en');
    expect(lab(f3, 'f3')?.o).toBe(1); expect(lab(f3, 'f4')).toBeUndefined();
    const f4 = baroScene(4, 1, 'en');
    expect(lab(f4, 'f4')?.o).toBe(1); expect(lab(f4, 'f5')?.o).toBe(1);
  });
  it('the mercury column stands above the bath level and below the closed top', () => {
    expect(BARO.tubeTop).toBeLessThan(BARO.hTop); expect(BARO.hTop).toBeLessThan(BARO.bathTop);
  });
});

describe('ideal gas law from three laws (slides 14–18)', () => {
  it('every frame inside; final labels do not overlap', () => { expectInside(iglScene, 5); expectNoOverlap(iglScene, 5); });
  it('volume follows V ∝ nT/P in every frame (pure law, no extra freedom)', () => {
    for (let s = 0; s < 5; s++) for (const t of [0, 0.3, 0.7, 1]) {
      const d = iglScene(s, t, 'de').data;
      expect(d.V).toBeCloseTo((d.n * d.T) / d.P, 9);
      expect(d.hPx).toBeCloseTo(CYL.unit * d.V, 9);
    }
  });
  it('step 1 (Boyle): P doubles → V halves; step 2 (Charles): T doubles → V doubles; step 3: n doubles → V doubles', () => {
    const f0 = iglScene(0, 1, 'de').data, s0 = iglScene(0, 0, 'de').data;
    expect(f0.V / s0.V).toBeCloseTo(0.5, 9);
    const f1 = iglScene(1, 1, 'de').data, s1 = iglScene(1, 0, 'de').data;
    expect(f1.V / s1.V).toBeCloseTo(2, 9); expect(f1.P).toBe(s1.P); expect(f1.n).toBe(s1.n);
    const f2 = iglScene(2, 1, 'de').data, s2 = iglScene(2, 0, 'de').data;
    expect(f2.V / s2.V).toBeCloseTo(2, 9); expect(f2.P).toBe(s2.P); expect(f2.T).toBe(s2.T);
  });
  it('steps 4 and 5 show the combined law and PV = nRT; the cylinder stays inside the figure at the largest volume', () => {
    expect(iglScene(3, 1, 'de').labels.some((l) => l.key === 'law3' && l.o === 1)).toBe(true);
    const f4 = iglScene(4, 1, 'de');
    expect(lab(f4, 'law4')?.o).toBe(1); expect(lab(f4, 'law5')?.o).toBe(1); expect(lab(f4, 'law3')?.o ?? 0).toBeLessThan(0.5);
    expect(iglV(IGL_STATES[2])).toBe(2);
    expect(CYL.bottom - CYL.unit * 2).toBeGreaterThan(44); // the piston never leaves the cylinder drawing
  });
  it('the numbers agree with the real law: doubling P halves V in litres as well', () => {
    expect(idealV(1, 300, 2) / idealV(1, 300, 1)).toBeCloseTo(0.5, 12);
  });
});

describe('balloon, type 3 problem (slide 20)', () => {
  it('every frame inside; final labels do not overlap', () => { expectInside(balloonScene, 4); expectNoOverlap(balloonScene, 4); });
  it('volumes after each step: 6.0 L → 13.3 L (pressure) → 11.4 L (cooling) = the solveFinal answer; reported as 11 L', () => {
    expect(balloonV[0]).toBe(6.0);
    expect(balloonV[1]).toBeCloseTo(13.33, 2);
    expect(balloonV[2]).toBeCloseTo(11.39, 2);
    const r = solveFinal({ P: BALLOON.Pi, V: BALLOON.Vi, T: BALLOON.Ti, n: 1 }, { P: BALLOON.Pf, T: BALLOON.Tf, n: 1 });
    expect(balloonV[2]).toBeCloseTo(r.value, 12);
    expect(roundSig(r.value, 2)).toBe(11);
    expect(BALLOON.Ti).toBeCloseTo(cToK(22), 12);
  });
  it('final frames: step 1 shows the bigger balloon and the pressure factor; step 2 the smaller one; step 3 the result', () => {
    const f0 = balloonScene(0, 1, 'de').data, f1 = balloonScene(1, 1, 'de').data, f2 = balloonScene(2, 1, 'de').data, f3 = balloonScene(3, 1, 'de').data;
    expect(f0.V).toBe(6); expect(f1.V).toBeGreaterThan(f0.V); expect(f1.P).toBeCloseTo(45.6, 9);
    expect(f2.V).toBeLessThan(f1.V); expect(f2.Tc).toBeCloseTo(-21, 9); expect(f2.V).toBeGreaterThan(f0.V);
    expect(f3.o3).toBe(1); expect(f3.V).toBeCloseTo(11.39, 2);
    expect(f1.r).toBeGreaterThan(f0.r); expect(f2.r).toBeLessThan(f1.r);
    expect(lab(balloonScene(1, 1, 'de'), 'f1')?.o).toBe(1); expect(lab(balloonScene(1, 1, 'de'), 'f2')).toBeUndefined();
    expect(lab(balloonScene(2, 1, 'de'), 'f2')?.o).toBe(1);
    expect(lab(balloonScene(3, 1, 'de'), 'res')?.o).toBe(1);
  });
  it('the balloon rises while the pressure falls and stays inside the picture', () => {
    expect(balloonScene(1, 1, 'de').data.y).toBeLessThan(balloonScene(0, 1, 'de').data.y);
  });
});

describe('Dalton (slide 22)', () => {
  it('every frame inside; final labels do not overlap', () => { expectInside(daltonScene, 4); expectNoOverlap(daltonScene, 4); });
  it('the stacked bar of the mixture is exactly the two single bars on top of each other: P_tot = P_1 + P_2', () => {
    const f = daltonScene(3, 1, 'de');
    const b1 = shape(f, 'barC1')!, b2 = shape(f, 'barC2')!, a = shape(f, 'barA')!, b = shape(f, 'barB')!;
    const h = (s: typeof a) => Math.abs(s.pts[2][1] - s.pts[0][1]);
    expect(h(b1)).toBeCloseTo(h(a), 9); expect(h(b2)).toBeCloseTo(h(b), 9);
    expect(b2.pts[2][1]).toBeCloseTo(b1.pts[0][1], 9); // the second bar sits on the first
    expect(h(a) / h(b)).toBeCloseTo(DALTON.n1 / DALTON.n2, 9); // pressure ∝ number of particles (same V, T)
  });
  it('final frames: A alone, B added, mixture box filled, equation shown', () => {
    expect(shape(daltonScene(0, 1, 'de'), 'boxB')).toBeUndefined();
    expect(shape(daltonScene(1, 1, 'de'), 'boxB')).toBeDefined(); expect(shape(daltonScene(1, 1, 'de'), 'boxC')).toBeUndefined();
    const f2 = daltonScene(2, 1, 'de');
    expect(shape(f2, 'boxC')).toBeDefined(); expect(f2.shapes.filter((s) => /^c[ab]\d+$/.test(s.key)).length).toBe(DALTON.n1 + DALTON.n2);
    expect(lab(f2, 'law')).toBeUndefined();
    expect(lab(daltonScene(3, 1, 'de'), 'law')?.o).toBe(1);
  });
  it('the mixture particles end inside box C', () => {
    const f = daltonScene(2, 1, 'de');
    for (const s of f.shapes.filter((x) => /^c[ab]\d+$/.test(x.key))) {
      expect(s.pts[0][0]).toBeGreaterThan(DALTON.cx); expect(s.pts[0][0]).toBeLessThan(DALTON.cx + DALTON.boxW);
    }
  });
});
