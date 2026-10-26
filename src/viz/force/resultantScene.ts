/**
 * Pure scene of the derivation of the resultant R̲ = ΣF̲_i for a Kräftegruppe with ONE common point of application (p. 29, Fig. 4.2).
 * SVG coordinates (y down); forces in N (figure scale: 10 N ↔ SC px). The five forces are read off the lecture's Fig. 4.2
 * (directions and relative lengths measured on the page; the unit N is ours).
 *
 *  step 0  the five forces F₁ … F₅ all act at the same point A (Fig. 4.2)
 *  step 1  a copy of F₂ is laid at the tip of F₁ (head to tail): the arrow from A to its tip is F₁ + F₂
 *  step 2  a copy of F₃ at the tip of that: F₁ + F₂ + F₃
 *  step 3  a copy of F₄: F₁ + … + F₄
 *  step 4  a copy of F₅: the arrow from A to the end of the chain is the resultant R̲
 *  step 5  the chain is taken away: the five forces and R̲ at A — Fig. 4.2; {A | F̲_i} → {A | R̲}
 */
import type { Lang } from '../../i18n';
import { ease, seg, type P2 } from '../anim/geometry';
import { arrowHead, sceneBuilder, type Ink, type Scene } from '../anim/scene';

export const SC = 17; // px per 10 N
export const A0: P2 = [150, 140];
/** Fig. 4.2, in N (x to the right, y up). R = (25; 45) N lies between F₄ and F₅, as in the lecture. */
export const FIG42: readonly P2[] = [[5, -25], [-20, -45], [-30, 5], [15, 55], [55, 55]];
export const sumTo = (k: number): P2 => FIG42.slice(0, k).reduce<P2>((s, f) => [s[0] + f[0], s[1] + f[1]], [0, 0]);
/** A force (N) as a displacement on the screen. */
export const disp = (f: P2): P2 => [(f[0] / 10) * SC, -(f[1] / 10) * SC];
const plus = (p: P2, d: P2, k = 1): P2 => [p[0] + k * d[0], p[1] + k * d[1]];

const FORCE = 'force' as Ink;
const NAMES = ['F_1', 'F_2', 'F_3', 'F_4', 'F_5'];

/** "(x; y) N" with the tuple separator of the language (all numbers here are whole). */
export const tuple = (lang: Lang, p: P2) => String.raw`(${p[0]}${lang === 'de' ? ';\ ' : ',\ '}${p[1]})\,\mathrm{N}`;

export function resultantScene(step: number, t: number, lang: Lang): Scene {
  const sb = sceneBuilder();
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => sb.shape({ key, kind, cls, pts, o, r });
  const arrow = (key: string, cls: string, a: P2, b: P2, o = 1) => {
    if (o <= 0.01 || Math.hypot(b[0] - a[0], b[1] - a[1]) < 2) return;
    S(key, 'line', cls, [a, b], o); S(key + '-h', 'polygon', cls.split(' ')[0] + '-head', arrowHead(a, b, 9), o);
  };
  const lerp = (a: P2, b: P2, k: number): P2 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const unit = (a: P2, b: P2): P2 => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
  const tipLab = (key: string, a: P2, b: P2, tex: string, o: number) => {
    const u = unit(a, b);
    sb.label(key, [b[0] + 15 * u[0], b[1] + 13 * u[1]], tex, FORCE, o, 'c');
  };

  // ---- the five originals, all at A ----
  FIG42.forEach((f, i) => {
    const grow = step === 0 ? ease(seg(t, i * 0.13, i * 0.13 + 0.42)) : 1;
    const back = step === 5 ? 0.3 + 0.7 * ease(seg(t, 0.15, 0.7)) : 0.3; // dimmed while the chain is built
    const o = step === 0 || i === 0 ? 1 : back;
    const end = plus(A0, disp(f));
    arrow(`F${i + 1}`, 'kf-f', A0, lerp(A0, end, grow), o);
    const labelOn = (step === 0 && grow > 0.95) || (step === 5 && o > 0.9) || (i === 0 && step >= 1);
    tipLab(`lab-F${i + 1}`, A0, end, String.raw`\v ${NAMES[i]}`, labelOn ? 1 : 0);
  });

  // ---- chain of copies: copy k ↔ F_{k+1}, starting at the tip of R_k = F₁ + … + F_k ----
  const chainO = step === 5 ? 1 - ease(seg(t, 0, 0.55)) : 1;
  for (let k = 1; k <= 4; k++) {
    if (step < k || chainO <= 0.01) continue;
    const mine = step === k;
    const slide = mine ? ease(seg(t, 0, 0.55)) : 1; // the copy slides from A to the tip of R_k
    const base = lerp(A0, plus(A0, disp(sumTo(k))), slide);
    const tip = plus(base, disp(FIG42[k]));
    arrow(`C${k + 1}`, 'kf-f', base, tip, chainO);
    // label beside the middle of the copy
    const u = unit(base, tip), side = k === 1 ? 1 : k === 2 ? 1 : -1;
    sb.label(`lab-C${k + 1}`, [(base[0] + tip[0]) / 2 + side * 15 * u[1] * -1, (base[1] + tip[1]) / 2 + side * 15 * u[0]], String.raw`\v ${NAMES[k]}`, FORCE, slide > 0.97 ? chainO : 0, 'c');
    // partial sum R_{k+1} (dotted); the last one is R̲ itself, drawn below
    if (k < 4 && (!mine || t > 0.6)) {
      const grow = mine ? ease(seg(t, 0.6, 1)) : 1;
      arrow(`S${k + 1}`, 'kf-sum', A0, lerp(A0, plus(A0, disp(sumTo(k + 1))), grow), (mine ? 1 : 0.35) * chainO);
    }
  }
  // R̲: appears when the last copy is in place (step 4), stays in step 5
  const Rend = plus(A0, disp(sumTo(5)));
  if (step === 5 || (step === 4 && t > 0.6)) arrow('R', 'kf-r', A0, lerp(A0, Rend, step === 4 ? ease(seg(t, 0.6, 1)) : 1), 1);

  // the point A
  S('A', 'circle', 'kf-pt solid', [A0], 1, 5);
  sb.label('lab-A', [A0[0] - 15, A0[1] + 5], 'A', 'point', 1, 'c');

  // label of R̲
  if (step >= 4) tipLab('lab-R', A0, Rend, String.raw`\v R`, step === 4 ? seg(t, 0.8, 1) : 1);

  // the running read-out (box on the right): the sum of the forces laid so far, in numbers
  const rows = (k: number): { tex: string; ink: Ink }[] => {
    const head = k === 5 ? String.raw`\v R = \sum_{i=1}^{5}\v F_i` : String.raw`\sum_{i=1}^{${k}}\v F_i`;
    return [{ tex: head, ink: 'fg' }, { tex: `= ${tuple(lang, sumTo(k))}`, ink: 'fg' }];
  };
  if (step >= 1 && step <= 4) sb.label('box-sum', [392, 12], '', 'fg', seg(t, 0.75, 1), 'tr', { box: true, rows: rows(step + 1) });
  if (step === 0) sb.label('box-group', [392, 12], '', 'fg', seg(t, 0.7, 1), 'tr', { box: true, rows: [{ tex: String.raw`\{A\,|\,\v F_i\}`, ink: 'fg' }, { tex: String.raw`i = 1,\dots,5`, ink: 'muted' }] });
  if (step === 5) sb.label('box-equiv', [392, 12], '', 'fg', seg(t, 0.5, 1), 'tr', { box: true, rows: [{ tex: String.raw`\{A\,|\,\v F_i\}`, ink: 'fg' }, { tex: String.raw`\downarrow`, ink: 'muted' }, { tex: String.raw`\{A\,|\,\v R\}`, ink: 'fg' }] });

  const R = sumTo(5);
  return sb.finish({ step, rx: R[0], ry: R[1] });
}
