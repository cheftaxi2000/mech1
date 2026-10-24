/**
 * Kinetic-molecular theory (lecture 2, slides 24–28) and the van der Waals equation (slides 30, lecture 3 slides 5–7).
 * SI units unless a name says otherwise: speeds in m/s, molar mass M in kg/mol, T in K.
 */
import { R, k_B } from './constants';

// ---- speeds ----
/** root-mean-square speed (slide 27): the speed of a molecule with the average kinetic energy, √(3RT/M). */
export const vRms = (T: number, M: number) => Math.sqrt((3 * R * T) / M);
/** most probable speed, √(2RT/M) (the exercise class' cheat sheet; not on the lecture slides). */
export const vMp = (T: number, M: number) => Math.sqrt((2 * R * T) / M);
/** average (mean) speed, √(8RT/(πM)) (not on the slides; it follows from the distribution below). */
export const vAv = (T: number, M: number) => Math.sqrt((8 * R * T) / (Math.PI * M));
/** average kinetic energy per mole of molecules, (3/2) R T — the same for every gas at the same T (slide 25). */
export const meanKEMolar = (T: number) => 1.5 * R * T;
/** average kinetic energy per molecule, (3/2) k_B T. */
export const meanKEMolecule = (T: number) => 1.5 * k_B * T;

/** Maxwell–Boltzmann distribution of speeds (3-D): fraction of molecules per unit speed, in s/m. */
export function maxwell(v: number, T: number, M: number): number {
  const a = M / (2 * R * T);
  return 4 * Math.PI * Math.pow(a / Math.PI, 1.5) * v * v * Math.exp(-a * v * v);
}
/** error function (Abramowitz & Stegun 7.1.26 refined by a series for small x; error < 1e-9 for |x| < 6). */
export function erf(x: number): number {
  const ax = Math.abs(x);
  let r: number;
  if (ax < 3) { // Maclaurin series
    let term = ax, sum = ax;
    for (let n = 1; n < 80; n++) { term *= (-ax * ax) / n; sum += term / (2 * n + 1); if (Math.abs(term) < 1e-17) break; }
    r = (2 / Math.sqrt(Math.PI)) * sum;
  } else { // continued fraction for erfc
    let f = 0;
    for (let k = 60; k >= 1; k--) f = k / 2 / (ax + f);
    r = 1 - Math.exp(-ax * ax) / (Math.sqrt(Math.PI) * (ax + f));
  }
  return x < 0 ? -r : r;
}
/** fraction of molecules with speed below v (cumulative distribution): erf(x) − 2x e^{−x²}/√π, x = v/v_mp. */
export function fractionBelow(v: number, T: number, M: number): number {
  const x = v / vMp(T, M);
  return erf(x) - (2 * x * Math.exp(-x * x)) / Math.sqrt(Math.PI);
}
export const fractionAbove = (v: number, T: number, M: number) => 1 - fractionBelow(v, T, M);

/** Deterministic samples of molecular speeds from the Maxwell distribution (quantile method on a regular grid). */
export function speedQuantiles(n: number, T: number, M: number): number[] {
  const out: number[] = [];
  let lo = 0;
  const hi = 8 * vMp(T, M);
  for (let i = 0; i < n; i++) {
    const q = (i + 0.5) / n;
    let a = lo, b = hi;
    for (let k = 0; k < 50; k++) { const m = (a + b) / 2; if (fractionBelow(m, T, M) < q) a = m; else b = m; }
    out.push((a + b) / 2); lo = a;
  }
  return out;
}

// ---- mean free path ----
/** mean free path λ = k_B T/(√2 π d² P) for molecules of diameter d (m) at pressure P (Pa); not on the slides, but it explains «60 nm». */
export const meanFreePath = (T: number, P: number, d: number) => (k_B * T) / (Math.SQRT2 * Math.PI * d * d * P);
/** collisions per second of one molecule: average speed over mean free path. */
export const collisionRate = (T: number, M: number, P: number, d: number) => vAv(T, M) / meanFreePath(T, P, d);

// ---- van der Waals (slide 30): (P + n²a/V²)(V − nb) = nRT ----
/** Table 10.3 of the slides: a in L²·kPa/mol², b in L/mol. */
export const VDW_TABLE: { f: string; a: number; b: number }[] = [
  { f: 'He', a: 3.46, b: 0.0237 }, { f: 'Ne', a: 21.4, b: 0.0171 }, { f: 'Ar', a: 135, b: 0.0322 }, { f: 'Kr', a: 235, b: 0.0398 },
  { f: 'Xe', a: 425, b: 0.051 }, { f: 'H2', a: 24.7, b: 0.0266 }, { f: 'N2', a: 141, b: 0.0391 }, { f: 'O2', a: 138, b: 0.0318 },
];
/** gas constant in the units of the table: L·kPa/(mol·K) */
export const R_LKPA = R;
/** van der Waals pressure (kPa) of one mole in the molar volume Vm (L/mol) at T (K). */
export const vdwP = (Vm: number, T: number, a: number, b: number) => (R_LKPA * T) / (Vm - b) - a / (Vm * Vm);
/** ideal pressure (kPa) of one mole in Vm (L/mol). */
export const idealPm = (Vm: number, T: number) => (R_LKPA * T) / Vm;
/** compression factor Z = PV/(nRT) (slide 29 plots this against P for n = 1 mol; Z = 1 is ideal). */
export const zFactor = (P: number, Vm: number, T: number) => (P * Vm) / (R_LKPA * T);
/** the pressure that is «added» to the measured one for the attraction, n²a/V² (kPa) at n = 1 mol. */
export const attractionTerm = (Vm: number, a: number) => a / (Vm * Vm);
/** critical temperature of a van der Waals gas, 8a/(27Rb) (K); below it the isotherm has a loop. */
export const vdwTc = (a: number, b: number) => (8 * a) / (27 * R_LKPA * b);
/** Z(P) curve of the van der Waals gas as a list of (P in kPa, Z): parametrised by the molar volume, from dilute to dense. */
export function vdwZCurve(T: number, a: number, b: number, pMax: number, n = 400): [number, number][] {
  const pts: [number, number][] = [];
  let prev = 0;
  for (let i = 0; i <= n; i++) {
    // geometric spacing from 400 L/mol (dilute) down to just above b
    const Vm = Math.exp(Math.log(400) + ((Math.log(b * 1.02) - Math.log(400)) * i) / n);
    const P = vdwP(Vm, T, a, b);
    if (P < prev || P > pMax) break; // below T_c the isotherm turns back: the gas branch ends there
    prev = P;
    if (P > 0) pts.push([P, zFactor(P, Vm, T)]);
  }
  return pts;
}
