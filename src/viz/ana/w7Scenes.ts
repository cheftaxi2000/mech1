/**
 * Frame logic of the week-7 animations (Analysis 1, Übung 7), kept pure so that the final frames can be tested:
 * - `divFrame`: S. 7 «Nullstellen finden» (known zero 1 + i → mirror → pair factor → division → 2 ± 3i).
 * - `coshFrame`: S. 8 cosh, sinh, tanh built from e^x and e^{−x}.
 */
import { ease, seg } from '../anim/geometry';

const p = (step: number, tt: number, i: number, a = 0, z = 1) => (step > i ? 1 : step === i ? ease(seg(tt, a, z)) : 0);

export const DIV_STEPS = 6;
export interface DivFrame {
  /** opacity of the four zeros 1+i, 1−i, 2+3i, 2−3i */
  zeros: [number, number, number, number];
  /** mirror line (real axis highlight) */
  mirror: number;
  /** text rows: pair factor, the three division rows, quotient, quadratic formula, result */
  rows: { pair: number; div: [number, number, number]; quotient: number; formula: number; result: number };
}
export function divFrame(step: number, tt: number): DivFrame {
  const mirror = p(step, tt, 1, 0, 0.6), pair = p(step, tt, 2, 0, 0.7);
  const d0 = p(step, tt, 3, 0, 0.3), d1 = p(step, tt, 3, 0.3, 0.6), d2 = p(step, tt, 3, 0.6, 0.85), q = p(step, tt, 3, 0.85, 1);
  const formula = p(step, tt, 4, 0, 0.5), z34 = p(step, tt, 4, 0.5, 1), result = p(step, tt, 5, 0, 0.7);
  return { zeros: [1, mirror, z34, z34], mirror: mirror * (1 - p(step, tt, 2)), rows: { pair, div: [d0, d1, d2], quotient: q, formula, result } };
}

export const COSH_STEPS = 5;
export interface CoshFrame {
  /** e^x and e^{−x} drawn at height factor h (1 → 1/2) */
  half: number;
  /** opacity of the two exponential curves */
  expO: number;
  /** cosh morph: e^x/2 + k e^{−x}/2 */
  kCosh: number;
  /** sinh morph: e^x/2 − k e^{−x}/2 */
  kSinh: number;
  /** tanh morph from sinh to tanh, and the asymptotes y = ±1 */
  kTanh: number;
  coshO: number; sinhO: number; tanhO: number;
}
/** 0 = e^x, e^{−x}; 1 = both halved; 2 = added → cosh; 3 = subtracted → sinh; 4 = divided → tanh. */
export function coshFrame(step: number, tt: number): CoshFrame {
  const half = p(step, tt, 1, 0, 0.8), add = p(step, tt, 2, 0, 0.85), sub = p(step, tt, 3, 0, 0.85), div = p(step, tt, 4, 0, 0.85);
  return {
    half, expO: 1 - 0.65 * add,
    kCosh: add, kSinh: sub, kTanh: div,
    coshO: add > 0 ? 1 : 0, sinhO: sub > 0 ? 1 : 0, tanhO: div > 0 ? 1 : 0,
  };
}
/** The three morphing curves of `coshFrame`. */
export const coshK = (x: number, k: number) => Math.exp(x) / 2 + (k * Math.exp(-x)) / 2;
export const sinhK = (x: number, k: number) => Math.exp(x) / 2 - (k * Math.exp(-x)) / 2;
export const tanhK = (x: number, k: number) => (1 - k) * Math.sinh(x) + k * Math.tanh(x);
