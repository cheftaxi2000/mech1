/**
 * Step animation of the handwritten solution of the ladder (pp. 35–36), numbers L = 4 m, v = 1 m/s, ω = 0,5 1/s, G = 20 N, W = 15 N
 * (the default of the interactive ladder, so the student can set the same values there):
 *  step 0  given: v̲_A = (v, 0, 0), ω̲ = (0, 0, ω); wanted: the total power
 *  step 1  v̲_C = v̲_A + ω̲ × AC̲ and v̲_B = v̲_A + ω̲ × AB̲: a copy of v̲_A, then the rotation part ⟂ ladder, head to tail
 *  step 2  Weg I: P_B = F̲_B · v̲_B and P_C = F̲_C · v̲_C — only the shadow on the line of the force counts; bars P_B, P_C
 *  step 3  Weg II: R̲ = F̲_B + F̲_C at A, the moments M_AG, M_AW and M_A about A (⊙ / ⊗)
 *  step 4  Weg II: R̲ · v̲_A and M̲_A · ω̲ as bars
 *  step 5  both ways end at the same line: P = −(√2/2) W v + ω W L/2 − (√2/2) ω G L
 */
import type { Lang } from '../../i18n';
import { ease, seg } from '../anim/geometry';
import { NONE, ladderScene, type Layers } from './K7LadderScene';

export const SOL = { v: 1, omega: 0.5, G: 20, W: 15 };

export function solLayers(step: number, t: number): Layers {
  const e = (a: number, b: number) => ease(seg(t, a, b));
  switch (step) {
    case 0: return { ...NONE };
    case 1: return { ...NONE, vel: e(0, 0.9) };
    case 2: return { ...NONE, vel: 1, shadow: e(0, 0.5), barsI: e(0.4, 1), total: e(0.75, 1) };
    case 3: return { ...NONE, barsI: 0.4, R: e(0, 0.6), mom: e(0.4, 1), total: 1 };
    case 4: return { ...NONE, barsI: 0.4, R: 1, mom: 1, barsII: e(0.1, 0.8), total: 1 };
    default: return { ...NONE, barsI: 1, R: 1, mom: 1, barsII: 1, total: 1 };
  }
}

export const ladderSolScene = (step: number, t: number, lang: Lang) => ladderScene(SOL, lang, solLayers(step, t));
