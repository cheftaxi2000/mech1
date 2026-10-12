/**
 * Pure scene of proof 3 (lecture p. 17): all points turn with the same angular speed. View from above,
 * along μ (μ is the point O). Maths in y-up units around O, converted to SVG (y down) at the end.
 *
 *  step 0  P and Q on their circles; v_P = φ̇_P e_z × r_P, v_Q = φ̇_Q e_z × r_Q — suppose Q turned faster
 *  step 1  then the distance PQ would change (ghosts: start positions) — impossible in a rigid body
 *  step 2  back to the start; SdpG: the projections of v_P and v_Q onto PQ must be equal — they are not
 *  step 3  v_P·PQ = φ̇_P X and v_Q·PQ = φ̇_Q X with the same X = (e_z × r_P)·r_Q (the shaded parallelogram)
 *  step 4  X ≠ 0, so φ̇_Q = φ̇_P: v_Q shrinks until both projections are equal
 */
import { fmtNum, type Lang } from '../../i18n';
import { ease, seg, type P2 } from './geometry';
import { arrowHead, sceneBuilder, type Scene } from './scene';

type V = [number, number];
export const OC: V = [262, 150]; // O in SVG coordinates
export const OM = { rhoP: 82, phiP: (212 * Math.PI) / 180, rhoQ: 122, phiQ: (110 * Math.PI) / 180, wP: 1, wQwrong: 1.5, k: 0.6 };
const toS = (p: V): P2 => [OC[0] + p[0], OC[1] - p[1]];
const plus = (p: V, q: V, s = 1): V => [p[0] + s * q[0], p[1] + s * q[1]];
const dot = (p: V, q: V) => p[0] * q[0] + p[1] * q[1];
const polar = (r: number, a: number): V => [r * Math.cos(a), r * Math.sin(a)];
const perp = (p: V): V => [-p[1], p[0]]; // e_z × p
const sc = (p: V, k: number): V => [k * p[0], k * p[1]];

/** Positions, velocities (drawn length k·φ̇·ρ) and the SdpG projections onto PQ for angles turned aP, aQ. */
export function omegaGeom(aP: number, aQ: number, wQ: number) {
  const rP = polar(OM.rhoP, OM.phiP + aP), rQ = polar(OM.rhoQ, OM.phiQ + aQ);
  const vP: V = [OM.k * OM.wP * perp(rP)[0], OM.k * OM.wP * perp(rP)[1]];
  const vQ: V = [OM.k * wQ * perp(rQ)[0], OM.k * wQ * perp(rQ)[1]];
  const d: V = [rQ[0] - rP[0], rQ[1] - rP[1]], L = Math.hypot(...d), u: V = [d[0] / L, d[1] / L];
  const X = dot(perp(rP), rQ); // (e_z × r_P)·r_Q
  return { rP, rQ, vP, vQ, u, L, X, projP: dot(vP, u), projQ: dot(vQ, u) };
}

export function omegaScene(step: number, t: number, lang: Lang): Scene {
  const sb = sceneBuilder();
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => sb.shape({ key, kind, cls, pts, o, r });
  const arrow = (key: string, cls: string, a: V, b: V, o = 1) => {
    if (o <= 0.01 || Math.hypot(b[0] - a[0], b[1] - a[1]) < 1) return;
    S(key, 'line', cls, [toS(a), toS(b)], o); S(key + '-h', 'polygon', cls.split(' ')[0] + '-head', arrowHead(toS(a), toS(b), 8), o);
  };
  const num = (v: number) => fmtNum(v, 2, lang, true);

  // how far P and Q have turned (step 1 only), and the angular speed of Q
  const TURN = 0.5;
  const run = step === 1 ? ease(seg(t, 0.1, 0.8)) : step === 2 ? 1 - ease(seg(t, 0, 0.3)) : 0;
  const wQ = step < 4 ? OM.wQwrong : OM.wQwrong + (OM.wP - OM.wQwrong) * ease(seg(t, 0.1, 0.7));
  const g = omegaGeom(TURN * OM.wP * run, TURN * OM.wQwrong * run, wQ);
  const g0 = omegaGeom(0, 0, wQ);

  // circles about O
  S('cP', 'polyline', 'an-guide', Array.from({ length: 97 }, (_, i) => toS(polar(OM.rhoP, (2 * Math.PI * i) / 96))));
  S('cQ', 'polyline', 'an-guide', Array.from({ length: 97 }, (_, i) => toS(polar(OM.rhoQ, (2 * Math.PI * i) / 96))));

  // step 3+: the parallelogram of r_P and r_Q (its signed area is X)
  const par = step < 3 ? 0 : step === 3 ? ease(seg(t, 0, 0.5)) : 1;
  if (par > 0.01) {
    S('par', 'polygon', 'an-tri', [toS([0, 0]), toS(g.rP), toS(plus(g.rP, g.rQ)), toS(g.rQ)], par);
    // X sits deep in the parallelogram, towards its far corner: its centre lies on the diagonal PQ, where the line and the shadows are
    sb.label('lab-X', toS(sc(plus(g.rP, g.rQ), 0.8)), 'X', 'angle', par > 0.9 ? 1 : 0, 'c');
  }
  arrow('rP', 'an-r', [0, 0], g.rP);
  arrow('rQ', 'an-r', [0, 0], g.rQ);
  sb.label('lab-rP', toS(plus(sc(g.rP, 0.5), perp(g.rP), -0.16)), String.raw`\v r_P`, 'r', run < 0.05 ? 1 : 0, 'c');
  // r_Q's label on the outer side of its arrow (the line PQ runs close by on the inner side)
  sb.label('lab-rQ', toS(plus(sc(g.rQ, 0.5), perp(g.rQ), -0.15)), String.raw`\v r_Q`, 'r', run < 0.05 ? 1 : 0, 'c');

  // step 1: ghosts at the start and the stretched / shortened distance
  if (run > 0.01) {
    S('P0', 'circle', 'an-point ghost', [toS(g0.rP)], run, 5);
    S('Q0', 'circle', 'an-point ghost', [toS(g0.rQ)], run, 5);
    S('PQ0', 'line', 'an-guide', [toS(g0.rP), toS(g0.rQ)], run);
  }
  S('PQ', 'line', 'an-r thin', [toS(g.rP), toS(g.rQ)], step === 0 ? ease(seg(t, 0.5, 0.9)) : 1);
  const box1 = step === 1 ? ease(seg(t, 0.7, 1)) : 0;
  sb.label('box1', [6, 294], '', 'fg', box1, 'bl', { box: true, rows: [
    { tex: String.raw`|\v{PQ}|\colon\ ${num(1)} \to ${num(g.L / g0.L)}`, ink: 'fg' },
  ] });

  // velocities
  const vo = step === 0 ? ease(seg(t, 0, 0.5)) : 1;
  arrow('vP', 'an-v', g.rP, plus(g.rP, g.vP, vo));
  arrow('vQ', 'an-v', g.rQ, plus(g.rQ, g.vQ, vo));
  sb.label('lab-vP', toS(plus(plus(g.rP, g.vP), [10, -4])), String.raw`\v v_P`, 'point', vo > 0.9 ? 1 : 0, 'l');
  sb.label('lab-vQ', toS(plus(plus(g.rQ, g.vQ), [-6, 12])), String.raw`\v v_Q`, 'point', vo > 0.9 ? 1 : 0, 'r');

  // step 2+: SdpG projections onto PQ
  const pj = step < 2 ? 0 : step === 2 ? ease(seg(t, 0.35, 0.8)) : 1;
  if (pj > 0.01) {
    S('line', 'line', 'an-guide', [toS(plus(g.rP, g.u, -60)), toS(plus(g.rQ, g.u, 6))], pj);
    const fP = plus(g.rP, g.u, g.projP), fQ = plus(g.rQ, g.u, g.projQ);
    const dimDrop = step === 3 ? 1 - 0.7 * ease(seg(t, 0, 0.4)) : step === 4 ? 0.3 : 1; // step 3 is about X: drops step back
    S('dropP', 'line', 'an-drop-g', [toS(plus(g.rP, g.vP)), toS(fP)], pj * dimDrop);
    S('dropQ', 'line', 'an-drop-g', [toS(plus(g.rQ, g.vQ)), toS(fQ)], pj * dimDrop);
    S('projP', 'line', 'an-proj', [toS(g.rP), toS(plus(g.rP, g.u, g.projP * pj))]);
    S('projQ', 'line', 'an-proj', [toS(g.rQ), toS(plus(g.rQ, g.u, g.projQ * pj))]);
    const side = (k: number): V => [g.u[1] * k, -g.u[0] * k];
    sb.label('lab-pP', toS(plus(plus(g.rP, g.u, g.projP * 0.8), side(-16))), String.raw`\v v'_P`, 'rho', pj > 0.8 ? 1 : 0, 'c');
    sb.label('lab-pQ', toS(plus(plus(g.rQ, g.u, g.projQ / 2), side(-17))), String.raw`\v v'_Q`, 'rho', pj > 0.8 ? 1 : 0, 'c');
  }
  const box = (key: string, o: number, rows: { tex: string; ink: 'fg' | 'rho' | 'point' | 'angle' }[]) => sb.label(key, [6, 294], '', 'fg', o, 'bl', { box: true, rows });
  box('box2', step === 2 ? ease(seg(t, 0.7, 1)) : 0, [
    { tex: String.raw`\v v_P\cdot\v{PQ} = \v v_Q\cdot\v{PQ}\ \ (\text{SdpG})`, ink: 'fg' },
    { tex: String.raw`|\v v'_P| \ne |\v v'_Q|`, ink: 'point' },
  ]);
  box('box3', step === 3 ? ease(seg(t, 0.5, 1)) : 0, [
    { tex: String.raw`\v v_P\cdot\v{PQ} = \dot\varphi_P\, X`, ink: 'fg' },
    { tex: String.raw`\v v_Q\cdot\v{PQ} = \dot\varphi_Q\, X`, ink: 'fg' },
    { tex: String.raw`X = (\v e_z\times\v r_P)\cdot\v r_Q`, ink: 'angle' },
  ]);
  box('box4', step === 4 ? ease(seg(t, 0.6, 1)) : 0, [
    { tex: String.raw`\dot\varphi_P\, X = \dot\varphi_Q\, X,\ \ X \ne 0`, ink: 'fg' },
    { tex: String.raw`\Rightarrow\ \dot\varphi_P = \dot\varphi_Q`, ink: 'point' },
  ]);

  // points
  S('O', 'circle', 'an-o', [toS([0, 0])], 1, 3.5);
  S('P', 'circle', 'an-point', [toS(g.rP)], 1, 5);
  S('Q', 'circle', 'an-point', [toS(g.rQ)], 1, 5);
  sb.label('lab-O', toS([12, -12]), String.raw`O\ (\mu)`, 'fg', 1, 'l');
  sb.label('lab-P', toS(plus(g.rP, [-15, 5])), 'P', 'point', 1, 'c');
  sb.label('lab-Q', toS(plus(g.rQ, g.rQ, 14 / OM.rhoQ)), 'Q', 'point', 1, 'c');
  return sb.finish({ step, wQ, projP: g.projP, projQ: g.projQ, L: g.L / g0.L, X: g.X });
}
