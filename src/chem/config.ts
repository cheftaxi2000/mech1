/**
 * Electron configurations (lecture 6, slides 22–27; exercise class 6, pp. 7–9).
 * Fill order: "use the periodic table" = Madelung order (n + ℓ, then n); capacities s 2, p 6, d 10, f 14.
 * Exceptions (Z ≤ 54): Cr and Cu are on slide 27; Nb, Mo, Ru, Rh, Pd, Ag are the further ones of the periodic table of Brown (not on the slides).
 */
import { subshellLetter } from './quantum';

export interface Sub { n: number; l: number; e: number }

/** Subshells in filling order: 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p 7s 5f 6d 7p. */
export function subshellOrder(): [n: number, l: number][] {
  const all: [number, number][] = [];
  for (let n = 1; n <= 7; n++) for (let l = 0; l <= Math.min(3, n - 1); l++) all.push([n, l]);
  return all.sort((a, b) => a[0] + a[1] - (b[0] + b[1]) || a[0] - b[0]);
}
export const capacity = (l: number) => 2 * (2 * l + 1);

/** Final occupations of the exceptions below Xe, as [n, ℓ, electrons] overrides of the Madelung filling. */
export const EXCEPTIONS: Record<number, [number, number, number][]> = {
  24: [[4, 0, 1], [3, 2, 5]], // Cr  [Ar] 4s¹ 3d⁵   (slide 27)
  29: [[4, 0, 1], [3, 2, 10]], // Cu  [Ar] 4s¹ 3d¹⁰  (slide 27)
  41: [[5, 0, 1], [4, 2, 4]], // Nb
  42: [[5, 0, 1], [4, 2, 5]], // Mo
  44: [[5, 0, 1], [4, 2, 7]], // Ru
  45: [[5, 0, 1], [4, 2, 8]], // Rh
  46: [[5, 0, 0], [4, 2, 10]], // Pd  [Kr] 4d¹⁰
  47: [[5, 0, 1], [4, 2, 10]], // Ag
};
export const SLIDE_EXCEPTIONS = [24, 29];
export const isException = (Z: number) => Z in EXCEPTIONS;

/** Occupied subshells of the neutral atom with Z electrons, in filling order. */
export function configuration(Z: number): Sub[] {
  let left = Z;
  const subs: Sub[] = [];
  for (const [n, l] of subshellOrder()) {
    if (left <= 0) break;
    const e = Math.min(left, capacity(l));
    subs.push({ n, l, e });
    left -= e;
  }
  if (left > 0) throw new Error(`Z = ${Z} is too large`);
  const ov = EXCEPTIONS[Z];
  if (ov) for (const [n, l, e] of ov) {
    const s = subs.find((x) => x.n === n && x.l === l);
    if (s) s.e = e; else subs.push({ n, l, e });
  }
  return subs.filter((s) => s.e > 0);
}

export const NOBLE_GASES: [Z: number, symbol: string][] = [[2, 'He'], [10, 'Ne'], [18, 'Ar'], [36, 'Kr'], [54, 'Xe'], [86, 'Rn']];

/** Largest noble gas with fewer electrons than Z (the "core" of the shorthand), or null. */
export function nobleCore(Z: number): { Z: number; symbol: string } | null {
  let core: { Z: number; symbol: string } | null = null;
  for (const [z, symbol] of NOBLE_GASES) if (z < Z) core = { Z: z, symbol };
  return core;
}

/** The subshells after the noble-gas core: [Ar] 4s² 3d¹⁰ 4p⁴ → 4s² 3d¹⁰ 4p⁴. */
export function outerConfiguration(Z: number): Sub[] {
  const core = nobleCore(Z);
  if (!core) return configuration(Z);
  const coreSubs = configuration(core.Z);
  return configuration(Z)
    .map((s) => ({ ...s, e: s.e - (coreSubs.find((x) => x.n === s.n && x.l === s.l)?.e ?? 0) }))
    .filter((s) => s.e > 0);
}

/** Plain text, e.g. "[Ar] 4s2 3d10 4p4" (tests), `full` without the noble-gas shorthand. */
export function configString(Z: number, full = false): string {
  const core = full ? null : nobleCore(Z);
  const subs = full ? configuration(Z) : outerConfiguration(Z);
  return [core ? `[${core.symbol}]` : '', ...subs.map((s) => `${s.n}${subshellLetter(s.l)}${s.e}`)].filter(Boolean).join(' ');
}

/** KaTeX, e.g. `[\mathrm{Ar}]\,4s^{2}\,3d^{10}\,4p^{4}` (the lecture's order: 4s² 3d¹⁰ 4p⁴). */
export function configTex(Z: number, full = false): string {
  const core = full ? null : nobleCore(Z);
  const subs = full ? configuration(Z) : outerConfiguration(Z);
  return [core ? String.raw`[\mathrm{${core.symbol}}]` : '', ...subs.map((s) => `${s.n}${subshellLetter(s.l)}^{${s.e}}`)].filter(Boolean).join(String.raw`\,`);
}

/** Valence electrons (slide 26): the electrons after the noble-gas core; completely filled d (10) or f (14) subshells do not count. */
export function valenceElectrons(Z: number): number {
  return outerConfiguration(Z).filter((s) => !(s.l === 2 && s.e === 10) && !(s.l === 3 && s.e === 14)).reduce((a, s) => a + s.e, 0);
}

export interface Placement { n: number; l: number; box: number; spin: 1 | -1 }
/** Order in which the electrons are placed: subshell after subshell; inside a subshell Hund's rule (every box once with spin up, then pair up). */
export function fillSequence(Z: number): Placement[] {
  const out: Placement[] = [];
  for (const s of configuration(Z)) {
    const nb = 2 * s.l + 1;
    for (let k = 0; k < s.e; k++) out.push(k < nb ? { n: s.n, l: s.l, box: k, spin: 1 } : { n: s.n, l: s.l, box: k - nb, spin: -1 });
  }
  return out;
}

/** Unpaired electrons: singly occupied boxes (exercise class 6, Ex 5 and 7). */
export function unpaired(Z: number): number {
  return configuration(Z).reduce((a, s) => { const nb = 2 * s.l + 1; return a + (s.e <= nb ? s.e : 2 * nb - s.e); }, 0);
}

/** Block of the periodic table: the type of the last subshell filled in the Madelung order (He belongs to the s block, as on slide 23). */
export function blockOf(Z: number): 's' | 'p' | 'd' | 'f' {
  let left = Z, last = 0;
  for (const [, l] of subshellOrder()) { if (left <= 0) break; last = l; left -= capacity(l); }
  return subshellLetter(last) as 's' | 'p' | 'd' | 'f';
}
