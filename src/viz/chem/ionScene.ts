/**
 * Slide 21 (lecture 1): how NaCl forms its ions, in three steps.
 *  step 0  a neutral Na atom (11 p⁺, 11 e⁻) and a neutral Cl atom (17 p⁺, 17 e⁻)
 *  step 1  one electron moves from Na to Cl: Na shrinks to Na⁺ (11 p⁺, 10 e⁻), Cl grows to Cl⁻ (17 p⁺, 18 e⁻)
 *  step 2  the oppositely charged ions attract each other until they touch
 * SVG coordinates (400 × 300).
 */
import type { Lang } from '../../i18n';
import { sceneBuilder, arrowHead, type Scene } from '../anim/scene';
import { ease, seg, disc, lerp, INK } from './sceneKit';

export const Y = 140;
export const NA0 = 100, CL0 = 300, NA1 = 168, CL1 = 232;
export const R_NA = 38, R_NA_ION = 24, R_CL = 30, R_CL_ION = 40;

export interface IonState { u: number; v: number; naX: number; clX: number; rNa: number; rCl: number }
export function ionState(step: number, t: number): IonState {
  const u = step === 0 ? 0 : step === 1 ? ease(seg(t, 0.1, 0.85)) : 1;
  const v = step < 2 ? 0 : ease(seg(t, 0.1, 0.9));
  return { u, v, naX: lerp(NA0, NA1, v), clX: lerp(CL0, CL1, v), rNa: lerp(R_NA, R_NA_ION, u), rCl: lerp(R_CL, R_CL_ION, u) };
}

export function ionScene(step: number, t: number, lang: Lang): Scene {
  void lang;
  const sb = sceneBuilder();
  const s = ionState(step, t);
  // clouds
  disc(sb, 'na-atom', 'cs-cloud', [s.naX, Y], s.rNa, 1 - s.u);
  disc(sb, 'na-ion', 'cs-cloud-cat', [s.naX, Y], s.rNa, s.u);
  disc(sb, 'cl-atom', 'cs-cloud', [s.clX, Y], s.rCl, 1 - s.u);
  disc(sb, 'cl-ion', 'cs-cloud-an', [s.clX, Y], s.rCl, s.u);
  disc(sb, 'na-nuc', 'cs-nucleus', [s.naX, Y], 4.5);
  disc(sb, 'cl-nuc', 'cs-nucleus', [s.clX, Y], 4.5);
  // the moving electron: from the rim of Na, on an arc, to the rim of Cl
  const x0 = s.naX + s.rNa - 9, x1 = s.clX - s.rCl + 11;
  const ex = lerp(x0, x1, s.u), ey = Y - 38 * Math.sin(Math.PI * s.u) - 2;
  disc(sb, 'electron', 'cs-electron', [ex, ey], 5.5);
  // attraction arrows in step 2
  if (s.v > 0.02) {
    for (const k of [-1, 1]) {
      const from: [number, number] = [200 + k * 62, 86], to: [number, number] = [200 + k * 14, 86];
      sb.shape({ key: `pull${k}`, kind: 'line', cls: 'cs-pull', pts: [from, to], o: s.v });
      sb.shape({ key: `pull${k}-h`, kind: 'polygon', cls: 'cs-pull-head', pts: arrowHead(from, to, 8), o: s.v });
    }
  }
  // names above
  sb.label('na-name0', [s.naX - 22, 62], String.raw`\mathrm{Na}`, INK.fg, 1 - s.u);
  sb.label('na-name1', [s.naX - 22, 62], String.raw`\mathrm{Na}^{+}`, INK.cat, s.u);
  sb.label('cl-name0', [s.clX + 22, 62], String.raw`\mathrm{Cl}`, INK.fg, 1 - s.u);
  sb.label('cl-name1', [s.clX + 22, 62], String.raw`\mathrm{Cl}^{-}`, INK.an, s.u);
  // particle counts below
  const rows = (p: number, e: number) => [{ tex: String.raw`${p}\,\mathrm{p}^{+}`, ink: INK.cat }, { tex: String.raw`${e}\,\mathrm{e}^{-}`, ink: INK.el }];
  const early = s.u < 0.5;
  sb.label('na-cnt0', [s.naX - 22, 214], '', INK.fg, early ? 1 : 0, 'c', { rows: rows(11, 11) });
  sb.label('na-cnt1', [s.naX - 22, 214], '', INK.fg, early ? 0 : 1, 'c', { rows: rows(11, 10) });
  sb.label('cl-cnt0', [s.clX + 22, 214], '', INK.fg, early ? 1 : 0, 'c', { rows: rows(17, 17) });
  sb.label('cl-cnt1', [s.clX + 22, 214], '', INK.fg, early ? 0 : 1, 'c', { rows: rows(17, 18) });
  // legend
  disc(sb, 'leg-e', 'cs-electron', [118, 276], 5.5);
  sb.label('leg-e-l', [128, 276], String.raw`\mathrm{e}^{-}`, INK.el, 1, 'l');
  disc(sb, 'leg-n', 'cs-nucleus', [218, 276], 4.5);
  sb.label('leg-n-l', [228, 276], String.raw`\mathrm{p}^{+}`, INK.cat, 1, 'l');
  return sb.finish({ u: s.u, v: s.v, rNa: s.rNa, rCl: s.rCl, naX: s.naX, clX: s.clX, ex, ey });
}
