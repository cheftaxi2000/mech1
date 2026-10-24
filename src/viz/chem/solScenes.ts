/**
 * Pure scenes of «Lösungen, Ionen und Fällungsreaktionen» (lecture 3, slides 9, 11, 29). 400 × 300 viewBox.
 *  electrolyteScene   a substance dissolved in water: ions (the lamp lights up) or whole molecules (it stays dark)
 *  molarityScene      n moles of solute in V litres of solution: the dots spread out as the volume grows
 */
import { fmtNum, type Lang } from '../../i18n';
import { chemTex } from '../../chem/tex';
import { sceneBuilder, type Scene } from '../anim/scene';
import type { P2 } from '../anim/geometry';
import { beaker, disc, rng, sign, INK } from './sceneKit';

export interface Substance { id: string; formula: string; kind: 'ionic' | 'molecular' | 'none'; cat?: { tex: string; r: number }; an?: { tex: string; r: number } }
export const SUBSTANCES: Substance[] = [
  { id: 'NaCl', formula: 'NaCl', kind: 'ionic', cat: { tex: String.raw`\mathrm{Na}^{+}`, r: 8 }, an: { tex: String.raw`\mathrm{Cl}^{-}`, r: 11 } },
  { id: 'HCl', formula: 'HCl', kind: 'ionic', cat: { tex: String.raw`\mathrm{H}^{+}`, r: 6 }, an: { tex: String.raw`\mathrm{Cl}^{-}`, r: 11 } },
  { id: 'KOH', formula: 'KOH', kind: 'ionic', cat: { tex: String.raw`\mathrm{K}^{+}`, r: 10 }, an: { tex: String.raw`\mathrm{OH}^{-}`, r: 10 } },
  { id: 'sucrose', formula: 'C12H22O11', kind: 'molecular' },
  { id: 'ethanol', formula: 'CH3CH2OH', kind: 'molecular' },
  { id: 'water', formula: 'H2O', kind: 'none' },
];
export const N_ION = 8, N_MOL = 12;
const BX0 = 70, BX1 = 330, BTOP = 96, BBOT = 266, WTOP = 114;

export function electrolyteScene(sub: Substance): Scene {
  const sb = sceneBuilder();
  const lit = sub.kind === 'ionic';
  // lamp, wires and electrodes
  sb.shape({ key: 'wire', kind: 'polyline', cls: 'cs-wire', pts: [[182, 44], [120, 44], [120, 180]] });
  sb.shape({ key: 'wire2', kind: 'polyline', cls: 'cs-wire', pts: [[218, 44], [280, 44], [280, 180]] });
  beaker(sb, BX0, BTOP, BX1, BBOT, WTOP);
  sb.shape({ key: 'el1', kind: 'line', cls: 'cs-electrode', pts: [[120, 96], [120, 180]] });
  sb.shape({ key: 'el2', kind: 'line', cls: 'cs-electrode', pts: [[280, 96], [280, 180]] });
  if (lit) for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4;
    sb.shape({ key: `ray${k}`, kind: 'line', cls: 'cs-ray', pts: [[200 + 24 * Math.cos(a), 44 + 24 * Math.sin(a)], [200 + 34 * Math.cos(a), 44 + 34 * Math.sin(a)]] });
  }
  disc(sb, 'bulb', lit ? 'cs-bulb-on' : 'cs-bulb-off', [200, 44], 18);
  // particles
  const rand = rng(21 + SUBSTANCES.indexOf(sub));
  const placed: P2[] = [];
  const spot = (): P2 => {
    for (let n = 0; n < 400; n++) { const p: P2 = [96 + rand() * 208, 130 + rand() * 120]; if (Math.abs(p[0] - 120) > 16 && Math.abs(p[0] - 280) > 16 && placed.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) > 25)) { placed.push(p); return p; } }
    const p: P2 = [96 + rand() * 208, 130 + rand() * 120]; placed.push(p); return p;
  };
  if (sub.kind === 'ionic') {
    for (let i = 0; i < N_ION; i++) { const p = spot(); disc(sb, `c${i}`, 'cs-ion-cat', p, sub.cat!.r); sign(sb, `c${i}s`, p, true, sub.cat!.r); }
    for (let i = 0; i < N_ION; i++) { const p = spot(); disc(sb, `a${i}`, 'cs-ion-an', p, sub.an!.r); sign(sb, `a${i}s`, p, false, sub.an!.r); }
    sb.label('leg-c', [96, 284], sub.cat!.tex, INK.cat, 1, 'l');
    sb.label('leg-a', [170, 284], sub.an!.tex, INK.an, 1, 'l');
  } else if (sub.kind === 'molecular') {
    for (let i = 0; i < N_MOL; i++) disc(sb, `m${i}`, 'cs-solid', spot(), 9);
    sb.label('leg-m', [96, 284], chemTex(sub.formula), INK.muted, 1, 'l');
  } else sb.label('leg-m', [96, 284], chemTex(sub.formula), INK.muted, 1, 'l');
  return sb.finish({ lit: lit ? 1 : 0, ions: sub.kind === 'ionic' ? 2 * N_ION : 0, molecules: sub.kind === 'molecular' ? N_MOL : 0 });
}

// ---------------------------------------------------------------- molarity (slide 29)
const MX0 = 50, MX1 = 220, MTOP = 40, MBOT = 262, V_MAX = 2;
const DOT_N = 48;
const dotRand = rng(77);
const DOTS: P2[] = Array.from({ length: DOT_N }, () => [dotRand(), dotRand()]);
/** Dots drawn for n moles: 40 dots per mole, at most 48 (n ≤ 1.2). */
export const dotsFor = (n: number) => Math.min(DOT_N, Math.round(n * 40));
export const waterTop = (V: number) => MBOT - (MBOT - MTOP - 14) * (V / V_MAX);

export function molarityScene(n: number, V: number, lang: Lang): Scene {
  const sb = sceneBuilder();
  const top = waterTop(V);
  beaker(sb, MX0, MTOP, MX1, MBOT, top);
  // litre marks on the glass
  for (const l of [0.5, 1, 1.5, 2]) {
    const y = waterTop(l);
    sb.shape({ key: `tick${l}`, kind: 'line', cls: 'cs-tick', pts: [[MX0, y], [MX0 + (l % 1 === 0 ? 16 : 9), y]] });
    if (l % 1 === 0) sb.label(`tick${l}-l`, [MX0 - 6, y], String.raw`${l}\,\mathrm{L}`, INK.muted, 1, 'r');
  }
  const k = dotsFor(n);
  for (let i = 0; i < k; i++) {
    const p: P2 = [MX0 + 12 + DOTS[i][0] * (MX1 - MX0 - 24), MBOT - 10 - DOTS[i][1] * (MBOT - top - 20)];
    disc(sb, `d${i}`, 'cs-dot-solute', p, 5);
  }
  const c = n / V;
  sb.label('formula', [236, 140], '', INK.fg, 1, 'l', { box: true, rows: [
    { tex: String.raw`c = \dfrac{n}{V}`, ink: INK.fg },
    { tex: String.raw`= \dfrac{${fmtNum(n, 2, lang, true)}\,\mathrm{mol}}{${fmtNum(V, 2, lang, true)}\,\mathrm{L}}`, ink: INK.fg },
    { tex: String.raw`= ${fmtNum(c, 2, lang, true)}\,\mathrm{M}`, ink: INK.n }] });
  return sb.finish({ n, V, c, dots: k, top });
}
