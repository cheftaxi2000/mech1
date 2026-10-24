import { describe, expect, it } from 'vitest';
import { R, k_B } from './constants';
import { molarMass } from './formula';
import {
  R_LKPA, VDW_TABLE, attractionTerm, collisionRate, erf, fractionAbove, fractionBelow, idealPm, maxwell, meanFreePath, meanKEMolar, meanKEMolecule,
  speedQuantiles, vAv, vMp, vRms, vdwP, vdwTc, vdwZCurve, zFactor,
} from './kinetic';

const kg = (f: string) => molarMass(f) / 1000;
const simpson = (f: (x: number) => number, a: number, b: number, n = 4000) => {
  const h = (b - a) / n; let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
};

describe('speeds (slides 26–27)', () => {
  const T = 298.15, M = kg('N2');
  it('the distribution is normalised and has the right mean, rms and peak', () => {
    const f = (v: number) => maxwell(v, T, M), top = 8 * vMp(T, M);
    expect(simpson(f, 0, top)).toBeCloseTo(1, 6);
    expect(simpson((v) => v * f(v), 0, top)).toBeCloseTo(vAv(T, M), 1);
    expect(Math.sqrt(simpson((v) => v * v * f(v), 0, top))).toBeCloseTo(vRms(T, M), 1);
    // most probable speed = the maximum of f
    const vs = Array.from({ length: 2000 }, (_, i) => (i * top) / 2000);
    const peak = vs.reduce((a, b) => (f(b) > f(a) ? b : a));
    expect(peak).toBeCloseTo(vMp(T, M), -1);
  });
  it('v_mp < v_av < v_rms, in the fixed ratio 1 : 2/√π : √(3/2) (exercise 4c)', () => {
    expect(vMp(T, M)).toBeLessThan(vAv(T, M)); expect(vAv(T, M)).toBeLessThan(vRms(T, M));
    expect(vAv(T, M) / vMp(T, M)).toBeCloseTo(2 / Math.sqrt(Math.PI), 12);
    expect(vRms(T, M) / vMp(T, M)).toBeCloseTo(Math.sqrt(1.5), 12);
  });
  it('v_rms is the speed of the average kinetic energy: ½ M v_rms² = (3/2) R T; N₂ at 25 °C ≈ 515 m/s (slide: ≈ 500 m/s)', () => {
    expect(0.5 * M * vRms(T, M) ** 2).toBeCloseTo(meanKEMolar(T), 6);
    expect(meanKEMolecule(T)).toBeCloseTo(meanKEMolar(T) / 6.02214076e23, 25);
    expect(vRms(T, M)).toBeCloseTo(515, 0);
  });
  it('lighter molecules are faster at the same T (exercise 4a): He > O₂; all have the same mean kinetic energy', () => {
    expect(vRms(T, kg('He'))).toBeGreaterThan(vRms(T, kg('O2')));
    expect(vRms(T, kg('He')) / vRms(T, kg('O2'))).toBeCloseTo(Math.sqrt(molarMass('O2') / molarMass('He')), 12);
    expect(0.5 * kg('He') * vRms(T, kg('He')) ** 2).toBeCloseTo(0.5 * kg('O2') * vRms(T, kg('O2')) ** 2, 6);
  });
  it('hotter is faster (exercise 4b): v ∝ √T, and a hotter curve has its peak further right and lower', () => {
    expect(vRms(373.15, M) / vRms(273.15, M)).toBeCloseTo(Math.sqrt(373.15 / 273.15), 12);
    expect(maxwell(vMp(373.15, M), 373.15, M)).toBeLessThan(maxwell(vMp(273.15, M), 273.15, M));
  });
  it('slide 26 caption: for N₂ fewer than half the molecules are faster than 500 m/s at 0 °C, more than half at 100 °C', () => {
    expect(fractionAbove(500, 273.15, kg('N2'))).toBeLessThan(0.5);
    expect(fractionAbove(500, 373.15, kg('N2'))).toBeGreaterThan(0.5);
    expect(fractionAbove(500, 273.15, kg('N2'))).toBeCloseTo(0.379, 3);
  });
  it('cumulative fraction agrees with integrating the curve; erf is accurate', () => {
    expect(fractionBelow(600, T, M)).toBeCloseTo(simpson((v) => maxwell(v, T, M), 0, 600), 6);
    expect(fractionBelow(0, T, M)).toBeCloseTo(0, 12);
    expect(fractionBelow(1e4, T, M)).toBeCloseTo(1, 9);
    expect(erf(0.5)).toBeCloseTo(0.5204998778, 9); expect(erf(1)).toBeCloseTo(0.8427007929, 9); expect(erf(3.5)).toBeCloseTo(0.9999992569, 9); expect(erf(-1)).toBeCloseTo(-0.8427007929, 9);
  });
  it('speed quantiles reproduce the mean and rms of the distribution', () => {
    const v = speedQuantiles(400, T, M);
    expect(v.reduce((a, b) => a + b, 0) / v.length).toBeCloseTo(vAv(T, M), -1);
    expect(Math.sqrt(v.reduce((a, b) => a + b * b, 0) / v.length) / vRms(T, M)).toBeCloseTo(1, 2);
    expect([...v].sort((a, b) => a - b)).toEqual(v);
  });
});

describe('mean free path and collisions (slide 28)', () => {
  const d = 3.7e-10;
  it('air at 1 atm: λ of the order of the slide’s 60 nm, about 10¹⁰ collisions per second', () => {
    const l = meanFreePath(293.15, 101325, d);
    expect(l).toBeGreaterThan(40e-9); expect(l).toBeLessThan(90e-9);
    const rate = collisionRate(293.15, 0.029, 101325, d);
    expect(Math.log10(rate)).toBeGreaterThan(9.5); expect(Math.log10(rate)).toBeLessThan(10.5);
  });
  it('λ ∝ 1/P: a thousand times less pressure, a thousand times longer path; at the edge of space centimetres to decimetres', () => {
    expect(meanFreePath(293, 101.325, d) / meanFreePath(293, 101325, d)).toBeCloseTo(1000, 6);
    const high = meanFreePath(190, 0.03, d);
    expect(high).toBeGreaterThan(0.05); expect(high).toBeLessThan(0.5);
  });
  it('k_B and R are consistent', () => { expect(R / 6.02214076e23).toBeCloseTo(k_B, 28); });
});

describe('van der Waals (slide 30; table 10.3)', () => {
  it('a = b = 0 is the ideal gas', () => {
    for (const Vm of [0.5, 2, 20]) expect(vdwP(Vm, 300, 0, 0)).toBeCloseTo(idealPm(Vm, 300), 9);
  });
  it('dilute gases are ideal: Z → 1 for large molar volume (slide 29: all curves start at 1.0)', () => {
    for (const g of VDW_TABLE) { const Vm = 5000, P = vdwP(Vm, 300, g.a, g.b); expect(zFactor(P, Vm, 300)).toBeCloseTo(1, 2); }
  });
  it('the two corrections: attraction lowers P below the repulsive term; the covolume nb raises it', () => {
    const { a, b } = VDW_TABLE.find((g) => g.f === 'N2')!;
    const Vm = 1;
    expect(vdwP(Vm, 300, a, 0)).toBeLessThan(idealPm(Vm, 300)); // a alone: lower pressure
    expect(vdwP(Vm, 300, 0, b)).toBeGreaterThan(idealPm(Vm, 300)); // b alone: higher pressure
    // (P + a/V²)(V − b) = RT holds exactly
    const P = vdwP(Vm, 300, a, b);
    expect((P + attractionTerm(Vm, a)) * (Vm - b)).toBeCloseTo(R_LKPA * 300, 9);
  });
  it('N₂ at 300 K: Z dips below 1 at moderate pressure, then rises above 1 (the shape of slide 29); H₂ only rises', () => {
    const n2 = VDW_TABLE.find((g) => g.f === 'N2')!, h2 = VDW_TABLE.find((g) => g.f === 'H2')!;
    const zn = vdwZCurve(300, n2.a, n2.b, 1e5), zh = vdwZCurve(300, h2.a, h2.b, 1e5);
    expect(Math.min(...zn.map((p) => p[1]))).toBeLessThan(1);
    expect(zn[zn.length - 1][1]).toBeGreaterThan(1);
    expect(Math.min(...zh.map((p) => p[1]))).toBeGreaterThan(0.98);
    expect(zh[zh.length - 1][1]).toBeGreaterThan(1.1);
    expect(zn[0][1]).toBeCloseTo(1, 1);
  });
  it('the stronger the attraction (a), the lower the dip: Xe below N₂ below He at the same T', () => {
    const z = (f: string, T: number) => { const g = VDW_TABLE.find((x) => x.f === f)!; return Math.min(...vdwZCurve(T, g.a, g.b, 5e4).map((p) => p[1])); };
    expect(z('Xe', 350)).toBeLessThan(z('N2', 350)); expect(z('N2', 350)).toBeLessThan(z('He', 350));
  });
  it('critical temperature: N₂ ≈ 128 K (real 126 K); Z(P) curves are monotone in P', () => {
    const n2 = VDW_TABLE.find((g) => g.f === 'N2')!;
    expect(vdwTc(n2.a, n2.b)).toBeCloseTo(128.5, 0);
    const c = vdwZCurve(100, n2.a, n2.b, 1e5);
    for (let i = 1; i < c.length; i++) expect(c[i][0]).toBeGreaterThan(c[i - 1][0]);
  });
  it('worked example of the lesson: 1.00 mol N₂ in 1.00 L at 300 K — ideal 2494 kPa, van der Waals 2455 kPa (−1.6 %); the two corrections nearly cancel', () => {
    const n2 = VDW_TABLE.find((g) => g.f === 'N2')!;
    const ideal = idealPm(1, 300), real = vdwP(1, 300, n2.a, n2.b);
    expect(ideal).toBeCloseTo(2494.2, 0);
    expect(real).toBeCloseTo(2454.7, 0);
    expect((real - ideal) / ideal).toBeCloseTo(-0.0158, 3);
    expect(attractionTerm(1, n2.a)).toBe(141);
    expect(1 / (1 - n2.b)).toBeCloseTo(1.0407, 4);
    expect(((ideal / (1 - n2.b)) - ideal) / ideal).toBeCloseTo(0.0407, 4); // b alone: +4.1 %
    expect(-141 / ideal).toBeCloseTo(-0.0565, 4); // a alone: −5.7 %
  });
});
