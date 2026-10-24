/**
 * Slides 29–31 (lecture 1): the sample problem «how many grams of O₂ react with 2.00 g of H₂?» by the mole route.
 *  step 0  given: 2.00 g H₂; wanted: ? g O₂
 *  step 1  grams → moles: divide by the molar mass 2.00 g/mol, giving 1.00 mol H₂
 *  step 2  the equation 2 H₂ + O₂ → 2 H₂O says 2 mol H₂ per 1 mol O₂: multiply by ½, giving 0.500 mol O₂
 *  step 3  moles → grams: multiply by 32.0 g/mol, giving 16.0 g O₂
 * Numbers are those of the slide (atomic weights 1.00 and 16.0). SVG coordinates (400 × 300).
 */
import { fmtNum, type Lang } from '../../i18n';
import { chemTex } from '../../chem/tex';
import { sceneBuilder, arrowHead, type Scene } from '../anim/scene';
import type { P2 } from '../anim/geometry';
import { disc, ease, rect, seg, INK } from './sceneKit';

export const M_H2 = 2.00, M_O2 = 32.0, G_H2 = 2.00;
export const N_H2 = G_H2 / M_H2, N_O2 = N_H2 / 2, G_O2 = N_O2 * M_O2;
const BX = [14, 112, 210, 308], BW = 78, BY0 = 96, BY1 = 150;

export function sampleScene(step: number, t: number, lang: Lang): Scene {
  void lang;
  const sb = sceneBuilder();
  const u = step === 0 ? 1 : ease(seg(t, 0.05, 0.8));
  // visibility of the four boxes and the three arrows
  const boxO = [1, step >= 1 ? (step === 1 ? u : 1) : 0, step >= 2 ? (step === 2 ? u : 1) : 0, step >= 3 ? (step === 3 ? u : 1) : 0];
  const f = (x: number) => fmtNum(x, x < 10 ? (x < 1 ? 3 : 2) : 1, lang, true);
  const body: [string, string][] = [
    [String.raw`${f(G_H2)}\,\mathrm{g}`, 'H2'], [String.raw`${f(N_H2)}\,\mathrm{mol}`, 'H2'],
    [String.raw`${f(N_O2)}\,\mathrm{mol}`, 'O2'], [String.raw`${f(G_O2)}\,\mathrm{g}`, 'O2'],
  ];
  for (let i = 0; i < 4; i++) {
    const x0 = BX[i], o = boxO[i];
    const known = i === 0 || boxO[i] > 0.01;
    sb.shape({ key: `box${i}`, kind: 'polygon', cls: i === 3 && step === 3 ? 'cs-note-box' : 'cs-box', pts: rect(x0, BY0, x0 + BW, BY1), o: known ? 1 : 0.5 });
    if (known) sb.label(`val${i}`, [x0 + BW / 2, 117], body[i][0], INK.fg, o);
    else sb.label(`val${i}`, [x0 + BW / 2, 117], i === 3 ? String.raw`?\,\mathrm{g}` : String.raw`?\,\mathrm{mol}`, INK.muted, 1);
    sb.label(`sp${i}`, [x0 + BW / 2, 138], chemTex(body[i][1]), i < 2 ? INK.p : INK.cat, 1);
  }
  const arrows: { from: number; tex: string }[] = [
    { from: 0, tex: String.raw`\div\, 2{,}00\,\mathrm{g/mol}` }, { from: 1, tex: String.raw`\times\,\tfrac{1}{2}` }, { from: 2, tex: String.raw`\times\, 32{,}0\,\mathrm{g/mol}` },
  ];
  arrows.forEach((a, k) => {
    const o = step >= k + 1 ? (step === k + 1 ? u : 1) : 0;
    const p0: P2 = [BX[a.from] + BW + 2, 123], p1: P2 = [BX[a.from + 1] - 2, 123];
    sb.shape({ key: `ar${k}`, kind: 'line', cls: 'cs-pull', pts: [p0, p1], o });
    sb.shape({ key: `ar${k}-h`, kind: 'polygon', cls: 'cs-pull-head', pts: arrowHead(p0, p1, 7), o });
    sb.label(`af${k}`, [(p0[0] + p1[0]) / 2, 70], lang === 'de' ? a.tex : a.tex.replace('{,}', '.'), INK.e, o);
  });
  // the picture under the boxes: the ratio 2 : 1 of the equation
  if (step >= 2) {
    const o = step === 2 ? u : 1;
    for (let k = 0; k < 2; k++) { disc(sb, `h${k}a`, 'cs-aH', [BX[1] + 22 + k * 36, 200], 10, o); disc(sb, `h${k}b`, 'cs-aH', [BX[1] + 36 + k * 36, 200], 10, o); }
    disc(sb, 'o-a', 'cs-aO', [BX[2] + 28, 200], 12, o); disc(sb, 'o-b', 'cs-aO', [BX[2] + 50, 200], 12, o);
    sb.label('ratio', [200, 236], chemTex('2 H2 + O2 -> 2 H2O'), INK.fg, o, 'c', { box: true });
  }
  return sb.finish({ g1: G_H2, n1: N_H2, n2: N_O2, g2: G_O2, step });
}
