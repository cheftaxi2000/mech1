/**
 * Pure scene of the derivation ė_ρ = φ̇ e_φ (lecture p. 10, top view of the xy-plane like the lecture figure).
 *
 *  step 0  e_ρ at M and its components cos φ, sin φ  →  e_ρ = cos φ e_x + sin φ e_y
 *  step 1  e_φ = e_ρ turned by 90°, components −sin φ, cos φ
 *  step 2  M turns on by Δφ: e_ρ turns by the same Δφ; both arrows drawn at M, the change Δe_ρ is the chord
 *  step 3  Δφ → 0: Δe_ρ/Δφ becomes a unit arrow in the direction of e_φ, i.e. de_ρ/dφ = e_φ
 *  step 4  with time: ė_ρ = φ̇ · de_ρ/dφ = φ̇ e_φ, drawn at the tip of e_ρ
 */
import { fmtNum, type Lang } from '../../i18n';
import { ease, seg, type P2 } from './geometry';
import { DEG, arrowHead, sceneBuilder, type Scene } from './scene';

export const O: P2 = [56, 266];
export const RHO_PX = 150, U = 88, PHI0 = 35 * DEG, DPHI0 = 40 * DEG, DPHI_MIN = 2 * DEG, PHIDOT = 0.6;
const dir = (a: number): P2 => [Math.cos(a), -Math.sin(a)]; // SVG y points down
const add = (p: P2, d: P2, k = 1): P2 => [p[0] + k * d[0], p[1] + k * d[1]];
export const M: P2 = add(O, dir(PHI0), RHO_PX);

export function dphiAt(step: number, t: number): number {
  if (step < 2) return 0;
  if (step === 2) return DPHI0 * ease(seg(t, 0.1, 0.8));
  if (step === 3) return DPHI0 * Math.pow(DPHI_MIN / DPHI0, ease(seg(t, 0.05, 0.85)));
  return DPHI_MIN;
}

export function erhoScene(step: number, t: number, lang: Lang): Scene {
  const sb = sceneBuilder();
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => sb.shape({ key, kind, cls, pts, o, r });
  const arrow = (key: string, cls: string, a: P2, b: P2, o = 1) => {
    if (o <= 0.01 || Math.hypot(b[0] - a[0], b[1] - a[1]) < 1) return;
    S(key, 'line', cls, [a, b], o); S(key + '-h', 'polygon', cls.split(' ')[0] + '-head', arrowHead(a, b, 8), o);
  };
  const arc = (c: P2, r: number, a0: number, a1: number, n = 24): P2[] => Array.from({ length: n + 1 }, (_, i) => add(c, dir(a0 + ((a1 - a0) * i) / n), r));
  const num = (v: number) => fmtNum(v, 2, lang, true);

  // axes, O, ray to M, angle φ
  S('ax-x', 'line', 'an-axis', [O, [392, O[1]]]); S('ax-x-h', 'polygon', 'an-axis-head', arrowHead(O, [392, O[1]]));
  S('ax-y', 'line', 'an-axis', [O, [O[0], 12]]); S('ax-y-h', 'polygon', 'an-axis-head', arrowHead(O, [O[0], 12]));
  sb.label('lab-x', [384, O[1] + 16], 'x', 'muted'); sb.label('lab-y', [O[0] - 14, 18], 'y', 'muted');
  sb.label('lab-O', [O[0] - 10, O[1] + 12], 'O', 'muted');
  S('ray', 'line', 'an-guide', [O, M]);
  S('phi-arc', 'polyline', 'an-arc', arc(O, 46, 0, PHI0));
  sb.label('lab-phi', add(O, dir(PHI0 / 2), 64), String.raw`\varphi`, 'angle');

  const eR = add(M, dir(PHI0), U), eP = add(M, dir(PHI0 + Math.PI / 2), U);
  // step 0: e_ρ and its components
  const g0 = step === 0 ? ease(seg(t, 0, 0.35)) : 1;
  const c0 = step === 0 ? ease(seg(t, 0.35, 0.7)) : step === 1 ? 1 - 0.75 * ease(seg(t, 0, 0.3)) : 0;
  arrow('erho', 'an-erho', M, add(M, dir(PHI0), U * g0));
  sb.label('lab-erho', add(eR, [10, -4]), String.raw`\v e_\rho`, 'rho', g0 > 0.8 ? 1 : 0, 'l');
  S('erho-cx', 'line', 'an-leg-x thin', [M, [eR[0], M[1]]], c0);
  S('erho-cy', 'line', 'an-leg-y thin', [[eR[0], M[1]], eR], c0);
  sb.label('lab-cos', [(M[0] + eR[0]) / 2, M[1] + 14], String.raw`\cos\varphi`, 'x', step === 0 ? c0 : 0);
  sb.label('lab-sin', [eR[0] + 8, (M[1] + eR[1]) / 2], String.raw`\sin\varphi`, 'y', step === 0 ? c0 : 0, 'l');
  const b0 = step === 0 ? ease(seg(t, 0.7, 1)) : 0;
  sb.label('box-erho', [394, 6], String.raw`\v e_\rho = \cos\varphi\,\v e_x + \sin\varphi\,\v e_y`, 'fg', b0, 'tr', { box: true });

  // step 1: e_φ
  const g1 = step === 0 ? 0 : step === 1 ? ease(seg(t, 0, 0.35)) : 1;
  const c1 = step === 1 ? ease(seg(t, 0.35, 0.7)) : 0;
  arrow('ephi', 'an-ephi', M, add(M, dir(PHI0 + Math.PI / 2), U * g1));
  sb.label('lab-ephi', add(eP, [-8, -6]), String.raw`\v e_\varphi`, 'angle', g1 > 0.8 ? 1 : 0, 'r');
  S('ephi-cx', 'line', 'an-leg-x thin', [M, [eP[0], M[1]]], c1);
  S('ephi-cy', 'line', 'an-leg-y thin', [[eP[0], M[1]], eP], c1);
  sb.label('lab-msin', [(M[0] + eP[0]) / 2, M[1] + 14], String.raw`-\sin\varphi`, 'x', c1);
  sb.label('lab-pcos', [eP[0] - 8, (M[1] + eP[1]) / 2 + 10], String.raw`\cos\varphi`, 'y', c1, 'r');
  const ra = step >= 1 ? g1 : 0; // right angle between e_ρ and e_φ
  S('ra', 'polyline', 'an-ra', [add(M, dir(PHI0), 12), add(add(M, dir(PHI0), 12), dir(PHI0 + Math.PI / 2), 12), add(M, dir(PHI0 + Math.PI / 2), 12)], ra);
  const b1 = step === 1 ? ease(seg(t, 0.7, 1)) : 0;
  sb.label('box-ephi', [394, 6], String.raw`\v e_\varphi = -\sin\varphi\,\v e_x + \cos\varphi\,\v e_y`, 'fg', b1, 'tr', { box: true });

  // steps 2–3: turn by Δφ
  const dphi = dphiAt(step, t);
  const lim = step === 2 ? ease(seg(t, 0, 0.15)) : step === 3 ? 1 : step === 4 ? 1 - ease(seg(t, 0, 0.35)) : 0;
  if (lim > 0.01) {
    S('unit', 'polyline', 'an-guide', arc(M, U, PHI0 - 0.6, PHI0 + Math.PI / 2 + 0.3, 48), lim * 0.8);
    const M2 = add(O, dir(PHI0 + dphi), RHO_PX);
    S('ray2', 'line', 'an-guide', [O, M2], lim * 0.7);
    S('M2', 'circle', 'an-point ghost', [M2], lim, 5);
    const eR2 = add(M, dir(PHI0 + dphi), U);
    arrow('erho2', 'an-erho thin', M, eR2, lim);
    if (dphi > 0.05) {
      S('dphi-arc', 'polyline', 'an-arc', arc(M, 34, PHI0, PHI0 + dphi, 12), lim);
      arrow('de', 'an-dr', eR, eR2, lim);
    }
    const big = dphi > 15 * DEG ? lim : 0;
    sb.label('lab-dphi', add(M, dir(PHI0 + dphi / 2), 50), String.raw`\Delta\varphi`, 'angle', big);
    const mid: P2 = [(eR[0] + eR2[0]) / 2, (eR[1] + eR2[1]) / 2];
    sb.label('lab-de', add(mid, dir(PHI0 + dphi / 2), 16), String.raw`\Delta\v e_\rho`, 'x', big, 'l');
    sb.label('lab-M2', add(M2, [10, -2]), String.raw`M'`, 'point', big * (step === 2 ? 1 : 0), 'l');
    if (step >= 3) {
      const chord: P2 = [eR2[0] - eR[0], eR2[1] - eR[1]], len = Math.hypot(...chord) / U;
      const q = len / Math.max(dphi, 1e-9); // |Δe_ρ| / Δφ (in units of e)
      const u: P2 = [chord[0] / (len * U), chord[1] / (len * U)];
      arrow('dq', 'an-v thin', eR, add(eR, u, U * q), lim);
      sb.label('box-lim', [394, 150], '', 'fg', lim, 'tr', { box: true, rows: [
        { tex: String.raw`\Delta\varphi = ${Math.round(dphi / DEG)}^\circ`, ink: 'fg' },
        { tex: String.raw`|\Delta\v e_\rho|/\Delta\varphi = ${num(q)}`, ink: 'fg' },
      ] });
      sb.label('lab-dq', add(eR, u, U * q + 14), String.raw`\tfrac{\Delta\v e_\rho}{\Delta\varphi}`, 'point', step === 3 ? ease(seg(t, 0.85, 1)) : 0, 'c');
    }
  }
  // step 4: ė_ρ = φ̇ e_φ at the tip of e_ρ
  const r4 = step === 4 ? ease(seg(t, 0.3, 0.75)) : 0;
  const dot = add(eR, dir(PHI0 + Math.PI / 2), U * PHIDOT);
  arrow('edot', 'an-v', eR, dot, r4);
  sb.label('lab-edot', add(dot, [-8, -8]), String.raw`\dot{\v e}_\rho`, 'point', r4, 'r');
  sb.label('box-edot', [394, 6], String.raw`\dot{\v e}_\rho = \dot\varphi\,\v e_\varphi`, 'point', r4, 'tr', { box: true });

  S('M', 'circle', 'an-point', [M], 1, 5);
  sb.label('lab-M', add(M, [-8, -6]), 'M', 'point', 1, 'r');
  return sb.finish({ dphi, step });
}
