import { describe, expect, it } from 'vitest';
import { advance, countOf, createSim, idealPSim, kSim, massDensity, meanKE, meanSpeed, measuredP, rand, setCount, setT, setWidth, vrmsSim } from './particles';

const N2 = 28, HE = 4;
const run = (sim: ReturnType<typeof createSim>, s: number) => { advance(sim, s); return sim; };

describe('seeded particle box (pressure from wall hits)', () => {
  it('is deterministic: the same seed gives the same motion, another seed a different one', () => {
    const a = createSim({ seed: 7, W: 1, T: 300, masses: [N2], counts: [20] });
    const b = createSim({ seed: 7, W: 1, T: 300, masses: [N2], counts: [20] });
    const c = createSim({ seed: 8, W: 1, T: 300, masses: [N2], counts: [20] });
    run(a, 3.3); run(b, 3.3); run(c, 3.3);
    expect(a.parts).toEqual(b.parts);
    expect(a.parts[0].x).not.toBe(c.parts[0].x);
    const x = { seed: 1 }; const r = Array.from({ length: 1000 }, () => rand(x));
    expect(Math.min(...r)).toBeGreaterThanOrEqual(0); expect(Math.max(...r)).toBeLessThan(1);
    expect(r.reduce((s, v) => s + v, 0) / r.length).toBeCloseTo(0.5, 1);
  });
  it('particles never leave the box and the kinetic energy is conserved (elastic walls)', () => {
    const sim = createSim({ seed: 3, W: 1.6, T: 450, masses: [N2, HE], counts: [30, 30] });
    const e0 = meanKE(sim);
    for (let k = 0; k < 40; k++) {
      advance(sim, 0.37);
      for (const p of sim.parts) { expect(p.x).toBeGreaterThanOrEqual(0); expect(p.x).toBeLessThanOrEqual(sim.W); expect(p.y).toBeGreaterThanOrEqual(0); expect(p.y).toBeLessThanOrEqual(1); }
    }
    expect(meanKE(sim) / e0).toBeCloseTo(1, 9);
  });
  it('average kinetic energy is kT for every species (2-D); light particles are faster (slide 26)', () => {
    const sim = createSim({ seed: 11, W: 1, T: 300, masses: [N2, HE], counts: [800, 800] });
    expect(meanKE(sim, 0) / (kSim * 300)).toBeCloseTo(1, 1);
    expect(meanKE(sim, 1) / (kSim * 300)).toBeCloseTo(1, 1);
    expect(meanKE(sim, 0)).toBeCloseTo(meanKE(sim, 1), 1);
    expect(meanSpeed(sim, 1) / meanSpeed(sim, 0)).toBeCloseTo(Math.sqrt(N2 / HE), 1); // v ∝ 1/√m
    expect(vrmsSim(300, N2)).toBeCloseTo(0.4, 12);
  });
  it('the measured pressure agrees with P·A = N·k·T (kinetic theory) within a few percent', () => {
    const sim = createSim({ seed: 5, W: 1.2, T: 300, masses: [N2], counts: [300] });
    run(sim, 6);
    const P = measuredP(sim)!, Pi = idealPSim(sim);
    expect(P / Pi).toBeGreaterThan(0.94); expect(P / Pi).toBeLessThan(1.06);
  });
  it('Boyle: halving the box halves the area and doubles the measured pressure', () => {
    const sim = createSim({ seed: 9, W: 1.6, T: 300, masses: [N2], counts: [300] });
    run(sim, 6); const P1 = measuredP(sim)!;
    setWidth(sim, 0.8); expect(measuredP(sim)).toBeNull(); // the measurement starts afresh
    run(sim, 6); const P2 = measuredP(sim)!;
    expect(P2 / P1).toBeGreaterThan(1.85); expect(P2 / P1).toBeLessThan(2.15);
  });
  it('T doubles → P doubles (slide 25: P ∝ T at fixed V); n doubles → P doubles', () => {
    const sim = createSim({ seed: 2, W: 1, T: 300, masses: [N2], counts: [200] });
    run(sim, 6); const P1 = measuredP(sim)!;
    setT(sim, 600); run(sim, 6); const P2 = measuredP(sim)!;
    expect(P2 / P1).toBeGreaterThan(1.85); expect(P2 / P1).toBeLessThan(2.15);
    setCount(sim, 0, 400); expect(countOf(sim, 0)).toBe(400); run(sim, 6); const P3 = measuredP(sim)!;
    expect(P3 / P2).toBeGreaterThan(1.85); expect(P3 / P2).toBeLessThan(2.15);
    setCount(sim, 0, 100); expect(countOf(sim, 0)).toBe(100);
  });
  it('Dalton: partial pressures follow the numbers of particles and add up to the total', () => {
    const sim = createSim({ seed: 4, W: 1, T: 300, masses: [HE, N2], counts: [300, 100] });
    run(sim, 8);
    const pHe = measuredP(sim, 0)!, pN = measuredP(sim, 1)!, tot = measuredP(sim)!;
    expect(pHe + pN).toBeCloseTo(tot, 9);
    expect(pHe / tot).toBeGreaterThan(0.70); expect(pHe / tot).toBeLessThan(0.80); // X_He = 0.75
    expect(idealPSim(sim, 0) / idealPSim(sim)).toBeCloseTo(0.75, 12);
  });
  it('the heavier gas makes the box denser at equal particle number (exercise 5c)', () => {
    const a = createSim({ seed: 1, W: 1, T: 300, masses: [HE, N2], counts: [5, 2] });
    const b = createSim({ seed: 1, W: 1, T: 300, masses: [HE, N2], counts: [3, 1] });
    const c = createSim({ seed: 1, W: 1, T: 300, masses: [HE, N2], counts: [2, 5] });
    expect(massDensity(c)).toBeGreaterThan(massDensity(a)); expect(massDensity(a)).toBeGreaterThan(massDensity(b));
  });
  it('flashes are recorded at the wall and fade', () => {
    const sim = createSim({ seed: 6, W: 1, T: 300, masses: [N2], counts: [40] });
    advance(sim, 0.2);
    expect(sim.flashes.length).toBeGreaterThan(0);
    advance(sim, 1);
    expect(sim.flashes.every((f) => f.age <= 0.36)).toBe(true);
  });
});
