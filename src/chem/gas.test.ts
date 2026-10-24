import { describe, expect, it } from 'vitest';
import { R, k_B, N_A } from './constants';
import { molarMass } from './formula';
import {
  G_EARTH, MOLAR_VOLUME_STP, R_SLIDE, RHO_HG, RHO_HG_EXACT, RHO_WATER, STP, ZERO_C, columnHeight, columnPressure, convertP, cToK, decimalPlaces, gasDensity,
  hydrostatic, idealN, idealP, idealT, idealV, kToC, manometerP, molarMassFromDensity, moleFractions, partialFromTotal, partialPressures, roundSig,
  roundToDecimals, sigDigits, solveFinal, toPa,
} from './gas';

describe('constants as printed on slides 17–18', () => {
  it('the three R values agree with each other (units), and with the SI value', () => {
    expect(R_SLIDE.si).toBeCloseTo(R, 3);
    expect(R_SLIDE.latm).toBeCloseTo(R_SLIDE.si / 101.325, 4); // m³·Pa = J; 1 L·atm = 101.325 J
    expect(R_SLIDE.ltorr).toBeCloseTo(R_SLIDE.latm * 760, 1);
  });
  it('molar volume at STP is 22.41 L (slide 17), from V = nRT/P — in L·atm and in SI', () => {
    expect(idealV(1, STP.T, STP.P_atm)).toBeCloseTo(MOLAR_VOLUME_STP, 2);
    expect(((R_SLIDE.si * STP.T) / (STP.P_kPa * 1000)) * 1000).toBeCloseTo(MOLAR_VOLUME_STP, 1); // m³ → L
  });
  it('pressure units: 760 torr = 1 atm = 101.325 kPa = 1.01325 bar (slide 12)', () => {
    expect(convertP(760, 'torr', 'atm')).toBeCloseTo(1, 12);
    expect(convertP(1, 'atm', 'kPa')).toBeCloseTo(101.325, 9);
    expect(convertP(1, 'atm', 'bar')).toBeCloseTo(1.01325, 9);
    expect(convertP(1, 'bar', 'Pa')).toBe(1e5);
    expect(toPa(760, 'mmHg')).toBeCloseTo(101325, 6);
  });
  it('temperature scales: −273.15 °C = 0 K, a step of 1 °C is a step of 1 K', () => {
    expect(cToK(-273.15)).toBe(0);
    expect(cToK(25) - cToK(24)).toBeCloseTo(1, 12);
    expect(kToC(273.15)).toBe(0);
    expect(ZERO_C).toBe(273.15);
  });
});

describe('ideal gas law and the three laws it combines (slides 14–18)', () => {
  it('Boyle: halve the volume at fixed n, T → pressure doubles', () => {
    const P1 = idealP(0.5, 300, 10), P2 = idealP(0.5, 300, 5);
    expect(P2 / P1).toBeCloseTo(2, 12);
    expect(P1 * 10).toBeCloseTo(P2 * 5, 12); // PV = const
  });
  it('Charles: V/T is constant at fixed n, P; V is linear in T(K) and zero at 0 K', () => {
    const V = (T: number) => idealV(0.5, T, 1);
    expect(V(200) / 200).toBeCloseTo(V(400) / 400, 12);
    expect(V(0)).toBe(0);
    expect(V(cToK(100)) / V(cToK(0))).toBeCloseTo(373.15 / 273.15, 12);
    expect(V(cToK(100)) / V(cToK(50))).toBeLessThan(1.2); // 100 °C is not «twice» 50 °C: only the Kelvin scale counts
  });
  it('Avogadro: V/n is the same for every gas at the same P, T (= 22.41 L/mol at STP)', () => {
    expect(idealV(2, 273.15, 1) / 2).toBeCloseTo(idealV(0.1, 273.15, 1) / 0.1, 12);
  });
  it('the four rearrangements of slide 19 are consistent', () => {
    const n = 0.37, T = 310, V = 4.2, P = idealP(n, T, V);
    expect(idealV(n, T, P)).toBeCloseTo(V, 12);
    expect(idealN(P, V, T)).toBeCloseTo(n, 12);
    expect(idealT(P, V, n)).toBeCloseTo(T, 10);
  });
  it('A → B + C doubles the pressure at fixed V, T (slide 18)', () => {
    expect(idealP(2 * 0.3, 300, 5) / idealP(0.3, 300, 5)).toBeCloseTo(2, 12);
  });
});

describe('problem types (slides 19–20, exercise 2)', () => {
  it('type 3, slide 20: balloon 6.0 L, 101.3 → 45.6 kPa, 22 → −21 °C: V_f = 11 L', () => {
    const r = solveFinal({ P: 101.3, V: 6.0, T: cToK(22), n: 1 }, { P: 45.6, T: cToK(-21), n: 1 });
    expect(r.variable).toBe('V');
    expect(r.value).toBeCloseTo(11.39, 2);
    expect(roundSig(r.value, 2)).toBe(11);
    // the two correction factors of the animation: pressure drop first, then cooling
    const afterP = 6.0 * (101.3 / 45.6), afterT = afterP * (cToK(-21) / cToK(22));
    expect(afterP).toBeCloseTo(13.33, 2);
    expect(afterT).toBeCloseTo(r.value, 12);
    // forgetting Kelvin (using °C directly) gives nonsense, as the handwritten note warns
    expect(6.0 * (101.3 / 45.6) * (-21 / 22)).toBeLessThan(0);
  });
  it('type 2, slide 19, ex. 1 (n, T const): P_f = P_i V_i / V_f; ex. 2 (n, V const): P_f = P_i T_f/T_i', () => {
    const i = { P: 2, V: 10, T: 300, n: 1 };
    expect(solveFinal(i, { V: 4, T: 300, n: 1 }).value).toBeCloseTo(5, 12);
    expect(solveFinal(i, { V: 10, T: 600, n: 1 }).value).toBeCloseTo(4, 12);
    expect(solveFinal(i, { P: 2, V: 10, n: 1 }).variable).toBe('T');
  });
  it('solveFinal needs exactly one unknown', () => {
    expect(() => solveFinal({ P: 1, V: 1, T: 1, n: 1 }, { P: 1 })).toThrow();
    expect(() => solveFinal({ P: 1, V: 1, T: 1, n: 1 }, { P: 1, V: 1, T: 1, n: 1 })).toThrow();
  });
  it('exercise 2, tennis ball: 144 cm³, 0.33 g N₂ at 24 °C → 2.0·10⁵ Pa (the TA writes 20·10⁵, a power of ten off)', () => {
    const M = 28, m = 0.33, V = 144e-6, T = cToK(24);
    const P = (m * R_SLIDE.si * T) / (V * M);
    expect(P).toBeGreaterThan(2.0e5);
    expect(P).toBeLessThan(2.05e5);
    expect(roundSig(P, 2)).toBe(2.0e5);
    expect(molarMass('N2')).toBeCloseTo(28.01, 2);
    expect(idealP(m / molarMass('N2'), T, 0.144)).toBeCloseTo(P / 101325, 1); // the same value in atm
  });
  it('exercise 3: 50.0 L at 1.875 MPa → 101.3 kPa: V = 925 L (the TA writes 926 L)', () => {
    const V2 = (1875 * 50.0) / 101.3;
    expect(V2).toBeCloseTo(925.47, 2);
    expect(roundSig(V2, 3)).toBe(925);
  });
  it('exercise 2 bonus: 130 g NaN₃ → n(N₂) = 3.0 mol → V = 0.074 m³ at 27 °C, 100.8 kPa', () => {
    const n = (130 / (23 + 3 * 14)) * 1.5;
    expect(n).toBeCloseTo(3.0, 12);
    const V = (n * R_SLIDE.si * 300) / 100800;
    expect(V).toBeCloseTo(0.0742, 4);
    expect(roundSig(V, 2)).toBeCloseTo(0.074, 12);
    expect(molarMass('NaN3')).toBeCloseTo(65.01, 1);
  });
});

describe('density and molar mass (slide 21)', () => {
  it('ρ = P M_w/(R T): N₂ at STP is 1.25 g/L (= 28.01/22.41)', () => {
    const rho = gasDensity(1, 28.01, 273.15);
    expect(rho).toBeCloseTo(1.25, 2);
    expect(rho).toBeCloseTo(28.01 / MOLAR_VOLUME_STP, 2);
  });
  it('M_w = ρRT/P inverts it', () => {
    expect(molarMassFromDensity(gasDensity(1.3, 44.01, 350), 350, 1.3)).toBeCloseTo(44.01, 10);
  });
  it('same P, T → the density is proportional to M_w (Avogadro): CO₂ is denser than N₂ than He', () => {
    const d = (M: number) => gasDensity(1, M, 298.15);
    expect(d(44.01) / d(28.01)).toBeCloseTo(44.01 / 28.01, 12);
    expect(d(4.003)).toBeLessThan(d(28.01));
    expect(d(28.96)).toBeCloseTo(1.18, 2); // air at 25 °C
  });
  it('hot air is lighter: ρ falls like 1/T', () => {
    expect(gasDensity(1, 28.96, 373.15) / gasDensity(1, 28.96, 293.15)).toBeCloseTo(293.15 / 373.15, 12);
  });
});

describe('mixtures (slides 22–23, exercise 5)', () => {
  it('Dalton: P_tot is the sum of the partial pressures; P_i = X_i P_tot', () => {
    const ns = [0.2, 0.5, 0.3], T = 300, V = 12;
    const Pi = partialPressures(ns, T, V);
    const Ptot = idealP(1.0, T, V);
    expect(Pi.reduce((a, b) => a + b, 0)).toBeCloseTo(Ptot, 12);
    expect(partialFromTotal(ns, Ptot).every((x, i) => Math.abs(x - Pi[i]) < 1e-12)).toBe(true);
    expect(moleFractions(ns).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
  });
  it('problem set 2: X(CO₂) = 0.75, X(H₂O) = 0.25 means 3 : 1 in moles and in pressure', () => {
    expect(moleFractions([3, 1])).toEqual([0.75, 0.25]);
  });
  it('exercise 5: samples (i) 5 He + 2 N₂, (ii) 3 He + 1 N₂, (iii) 2 He + 5 N₂ — the TA’s ranking', () => {
    const samples = [{ He: 5, N2: 2 }, { He: 3, N2: 1 }, { He: 2, N2: 5 }];
    const ntot = samples.map((s) => s.He + s.N2);
    expect(ntot).toEqual([7, 4, 7]); // (a) P_i = P_iii > P_ii (same V, T)
    const he = samples.map((s) => s.He);
    expect(he[0]).toBeGreaterThan(he[1]); expect(he[1]).toBeGreaterThan(he[2]); // (b) P_He,i > P_He,ii > P_He,iii
    const mass = samples.map((s) => 4.003 * s.He + 28.01 * s.N2); // density ∝ mass in the same volume
    expect(mass[2]).toBeGreaterThan(mass[0]); expect(mass[0]).toBeGreaterThan(mass[1]); // (c) ρ_iii > ρ_i > ρ_ii
  });
});

describe('barometer and manometer (slides 11–13, exercise 2 p. 6)', () => {
  it('slide 11: a 10⁴ kg air column on 1 m² presses with ≈ 10⁵ Pa ≈ 100 kPa ≈ 1 bar', () => {
    expect(columnPressure(1e4, 1, 9.8)).toBeCloseTo(9.8e4, 6);
    expect(columnPressure(1e4, 1)).toBeCloseTo(98_100, 6);
  });
  it('slide 12: P = ρ g h; 760 mm of mercury ≈ 101 kPa (13.5 g/cm³ rounds a little low)', () => {
    expect(hydrostatic(RHO_HG, 0.76)).toBeCloseTo(100_650.6, 1);
    expect(hydrostatic(RHO_HG_EXACT, 0.76, 9.80665)).toBeCloseTo(101_325, -2);
    expect(columnHeight(101325, RHO_HG_EXACT, 9.80665)).toBeCloseTo(0.76, 3);
  });
  it('the same pressure holds up ≈ 10.3 m of water, 13.6 times higher than mercury', () => {
    const h = columnHeight(101325, RHO_WATER, 9.80665);
    expect(h).toBeCloseTo(10.33, 2);
    expect(h / columnHeight(101325, RHO_HG_EXACT, 9.80665)).toBeCloseTo(RHO_HG_EXACT / RHO_WATER, 9);
  });
  it('manometer figure (slide 13): levels 136.4 mm and 103.8 mm differ by h = 32.6 mm → P_gas = 760 + 32.6 mm Hg', () => {
    const h = 136.4 - 103.8;
    expect(h).toBeCloseTo(32.6, 12);
    const Pa = manometerP(101325, RHO_HG_EXACT, h / 1000, 9.80665);
    expect(convertP(Pa, 'Pa', 'mmHg')).toBeCloseTo(792.6, 0);
    expect(convertP(Pa, 'Pa', 'kPa')).toBeCloseTo(105.67, 1);
  });
  it('blood pressure «120 over 80» mm Hg is 16 kPa over 10.7 kPa', () => {
    expect(convertP(120, 'mmHg', 'kPa')).toBeCloseTo(16.0, 1);
    expect(convertP(80, 'mmHg', 'kPa')).toBeCloseTo(10.67, 2);
  });
  it('G_EARTH is the 9.81 of the exercise class', () => { expect(G_EARTH).toBe(9.81); });
});

describe('significant figures (exercise 2, p. 1–3)', () => {
  it('counting rules on the TA’s examples', () => {
    expect(sigDigits('63,29').count).toBe(4);
    expect(sigDigits('60,01').count).toBe(4);
    expect(sigDigits('0,002').count).toBe(1);
    expect(sigDigits('7,0').count).toBe(2);
    expect(sigDigits('0,070').count).toBe(2);
    expect(sigDigits('700').count).toBe(1);
    expect(sigDigits('1,00e8').count).toBe(3);
    expect(sigDigits('12.001').count).toBe(5);
    expect(sigDigits('0').count).toBe(0);
  });
  it('marks the digits that count', () => {
    expect(sigDigits('0,070').chars.map((c) => c.sig)).toEqual([false, false, false, true, true]);
    expect(sigDigits('700').chars.map((c) => c.sig)).toEqual([true, false, false]);
    expect(sigDigits('7,0').chars.map((c) => c.sig)).toEqual([true, false, true]);
  });
  it('addition keeps the least decimal places: 20,43 + 1,322 + 83,1 = 104,852 → 104,9 (the TA’s sheet has 104,842 → 104,8)', () => {
    const sum = 20.43 + 1.322 + 83.1;
    expect(sum).toBeCloseTo(104.852, 6);
    const d = Math.min(decimalPlaces('20,43'), decimalPlaces('1,322'), decimalPlaces('83,1'));
    expect(d).toBe(1);
    expect(roundToDecimals(sum, d)).toBe(104.9);
  });
  it('multiplication keeps the least sig. figs: 6,221 · 5,2 = 32,3492 → 32', () => {
    expect(roundSig(6.221 * 5.2, 2)).toBe(32);
  });
  it('rounding: 7,248 → 7,25 (3) and 7,2 (2); 0.5 rounds up', () => {
    expect(roundSig(7.248, 3)).toBe(7.25);
    expect(roundSig(7.248, 2)).toBe(7.2);
    expect(roundSig(2.5, 1)).toBe(3);
    expect(roundSig(-2.5, 1)).toBe(-3);
    expect(roundSig(0.00123456, 3)).toBeCloseTo(0.00123, 12);
  });
  it('logarithm: log10(1,00·10⁸) = 8,000 (three digits after the comma)', () => {
    expect(Math.log10(1.0e8)).toBe(8);
  });
  it('exercise 1 a, b, c; the TA’s b is 46, not 47: (8,1 + 7,26)·3,0 = 15,4·3,0 = 46,2 → 46', () => {
    const a = roundToDecimals(roundSig(2.0 * 7.14, 2) + 9.00009, 0);
    expect(a).toBe(23);
    const b1 = roundToDecimals(8.1 + 7.26, 1);
    expect(b1).toBeCloseTo(15.4, 12);
    expect(roundSig(b1 * 3.0, 2)).toBe(46);
    expect(roundSig((8.1 + 7.26) * 3.0, 2)).toBe(46);
    expect(-Math.log10(1.0e3)).toBeCloseTo(-3, 12);
  });
});

describe('constants relations used in the lesson text', () => {
  it('k_B = R/N_A (the TA’s sheet calls R the “Boltzmann constant”)', () => {
    expect(R / N_A / k_B).toBeCloseTo(1, 9);
  });
});
