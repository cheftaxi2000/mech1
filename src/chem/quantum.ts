/**
 * Quantum numbers and hydrogen energies (lecture 6, slides 13–21; exercise class 6, pp. 3, 5–6).
 */
import { R_H, h, c_light } from './constants';

export const L_LETTERS = 'spdfghik';
export const subshellLetter = (l: number) => L_LETTERS[l];

/** ℓ = 0, 1, …, n − 1 (slide 14). */
export const allowedL = (n: number): number[] => Array.from({ length: n }, (_, l) => l);
/** m_ℓ = −ℓ, …, +ℓ (slide 14). */
export const allowedMl = (l: number): number[] => Array.from({ length: 2 * l + 1 }, (_, i) => i - l);
export const orbitalsInSubshell = (l: number) => 2 * l + 1;
export const orbitalsInShell = (n: number) => n * n;
export const electronsInSubshell = (l: number) => 2 * (2 * l + 1);
export const electronsInShell = (n: number) => 2 * n * n;

export interface QState { n: number; l: number; ml: number; ms: 0.5 | -0.5 }
/** All distinct sets (n, ℓ, m_ℓ, m_s) of a shell: 2n² states (Pauli: one electron each). */
export function quantumStates(n: number): QState[] {
  const out: QState[] = [];
  for (const l of allowedL(n)) for (const ml of allowedMl(l)) for (const ms of [0.5, -0.5] as const) out.push({ n, l, ml, ms });
  return out;
}

/** Energy of the hydrogen level n in joules: E_n = −R_H / n² (exercise class 6, p. 3; R_H here is the Rydberg energy, 2.18·10⁻¹⁸ J). */
export const hydrogenEnergy = (n: number) => (n === Infinity ? 0 : -R_H / (n * n));
/** ΔE = E_f − E_i in joules; > 0: electron moves outwards, photon absorbed. */
export const hydrogenTransition = (ni: number, nf: number) => hydrogenEnergy(nf) - hydrogenEnergy(ni);
/** Wavelength in metres of the photon of the transition (absorbed or emitted): λ = hc/|ΔE| (exercise class 6, Ex 2). */
export const photonWavelength = (ni: number, nf: number) => (h * c_light) / Math.abs(hydrogenTransition(ni, nf));
