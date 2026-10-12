/**
 * Pure scene of the SdpG (lecture p. 12, Fig. 3.1 and the SdpG figure), plane drawing. Maths in y-up units,
 * converted to SVG (y down) at the end.
 *
 *  step 0  rigid body with M, N and a = MN; a later position (dashed): a turned, but just as long
 *  step 1  the velocities v_M and v_N — different in size and direction
 *  step 2  their projections onto the line MN are equally long (the theorem)
 *  step 3  why: v_N − v_M (drawn at N) is perpendicular to a, since |a| does not change
 *  step 4  hence a·v_N = a·v_M
 */
import type { Lang } from '../../i18n';
import { ease, seg, type P2 } from './geometry';
import { H, arrowHead, sceneBuilder, type Scene } from './scene';

type V = [number, number];
// v_M points steeply down and v_N steeply up, so the shadows on MN, the copy of v_M at N and v_N − v_M
// each get their own room (labels never sit on an arrow).
export const SM: V = [105, 140], SA: V = [165, 40], SVM: V = [55, -70], OMEGA = 0.75;
export const SN: V = [SM[0] + SA[0], SM[1] + SA[1]];
export const SVN: V = [SVM[0] - OMEGA * SA[1], SVM[1] + OMEGA * SA[0]]; // v_N = v_M + ω × a (2D)
const toS = (p: V): P2 => [p[0], H - p[1]];
const plus = (p: V, q: V, k = 1): V => [p[0] + k * q[0], p[1] + k * q[1]];
const dot = (p: V, q: V) => p[0] * q[0] + p[1] * q[1];
const LEN = Math.hypot(...SA), U: V = [SA[0] / LEN, SA[1] / LEN];
export const projM = dot(SVM, U), projN = dot(SVN, U);

function blob(c: V, rx: number, ry: number, rot: number): V[] {
  return Array.from({ length: 40 }, (_, i) => {
    const t = (2 * Math.PI * i) / 40, r = 1 + 0.08 * Math.sin(3 * t) + 0.05 * Math.cos(5 * t);
    const x = rx * r * Math.cos(t), y = ry * r * Math.sin(t);
    return [c[0] + x * Math.cos(rot) - y * Math.sin(rot), c[1] + x * Math.sin(rot) + y * Math.cos(rot)];
  });
}

export function sdpgScene(step: number, t: number, lang: Lang): Scene {
  const sb = sceneBuilder();
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => sb.shape({ key, kind, cls, pts, o, r });
  const arrow = (key: string, cls: string, a: V, b: V, o = 1) => {
    if (o <= 0.01 || Math.hypot(b[0] - a[0], b[1] - a[1]) < 1) return;
    S(key, 'line', cls, [toS(a), toS(b)], o); S(key + '-h', 'polygon', cls.split(' ')[0] + '-head', arrowHead(toS(a), toS(b), 8), o);
  };
  void lang;
  const mid: V = plus(SM, SA, 0.5), rotB = Math.atan2(SA[1], SA[0]);

  // body and a = MN
  S('body', 'polygon', 'an-body', blob(mid, 135, 62, rotB).map(toS));
  const g0 = step === 0 ? ease(seg(t, 0.35, 0.8)) : step === 1 ? 1 - ease(seg(t, 0, 0.3)) : 0; // later position
  if (g0 > 0.01) {
    const dx: V = [30, -40], ang = 0.32;
    const rot = (p: V): V => { const q = plus(p, mid, -1); return plus(plus(mid, dx), [q[0] * Math.cos(ang) - q[1] * Math.sin(ang), q[0] * Math.sin(ang) + q[1] * Math.cos(ang)]); };
    S('ghost', 'polygon', 'an-body ghost', blob(mid, 135, 62, rotB).map(rot).map(toS), g0);
    arrow('a2', 'an-r thin', rot(SM), rot(SN), g0 * 0.8);
    S('M2', 'circle', 'an-point ghost', [toS(rot(SM))], g0, 4.5);
    S('N2', 'circle', 'an-point ghost', [toS(rot(SN))], g0, 4.5);
    sb.label('lab-a2', toS(plus(rot(mid), [-U[1], U[0]], -20)), String.raw`\v a(t_2)`, 'muted', g0);
  }
  S('line', 'line', 'an-guide', [toS(plus(SM, U, -60)), toS(plus(SN, U, 95))], step >= 2 ? 1 : 0.35);
  arrow('a', 'an-r', SM, SN);
  sb.label('lab-a', toS(plus(mid, [-U[1], U[0]], -16)), String.raw`\v a`, 'r');

  // velocities
  const v1 = step === 0 ? 0 : step === 1 ? ease(seg(t, 0, 0.6)) : 1;
  arrow('vM', 'an-v', SM, plus(SM, SVM, v1), v1 > 0 ? 1 : 0);
  arrow('vN', 'an-v', SN, plus(SN, SVN, v1), v1 > 0 ? 1 : 0);
  sb.label('lab-vM', toS(plus(plus(SM, SVM), [-6, -12])), String.raw`\v v_M`, 'point', v1 > 0.8 ? 1 : 0, 'r');
  sb.label('lab-vN', toS(plus(plus(SN, SVN), [8, 6])), String.raw`\v v_N`, 'point', v1 > 0.8 ? 1 : 0, 'l');

  // projections onto MN
  const p2 = step < 2 ? 0 : step === 2 ? ease(seg(t, 0, 0.7)) : 1;
  if (p2 > 0.01) {
    const fM = plus(SM, U, projM), fN = plus(SN, U, projN);
    S('dropM', 'line', 'an-drop-g', [toS(plus(SM, SVM)), toS(fM)], p2);
    S('dropN', 'line', 'an-drop-g', [toS(plus(SN, SVN)), toS(fN)], p2);
    S('projM', 'line', 'an-proj', [toS(SM), toS(plus(SM, U, projM * p2))]);
    S('projN', 'line', 'an-proj', [toS(SN), toS(plus(SN, U, projN * p2))]);
    sb.label('lab-pM', toS(plus(plus(SM, U, projM / 2), [-U[1], U[0]], 14)), String.raw`\v v'_M`, 'rho', p2 > 0.8 ? 1 : 0);
    // v_N above and the copy of v_M below crowd the middle of N's shadow; its label sits just past the shadow's end
    // (v_N − v_M and the drop line pass exactly through that end, so keep clear of it on the far side)
    sb.label('lab-pN', toS(plus(plus(SN, U, projN + 24), [-U[1], U[0]], 13)), String.raw`\v v'_N`, 'rho', p2 > 0.8 ? 1 : 0);
  }
  // why: v_N − v_M ⟂ a
  const w3 = step < 3 ? 0 : step === 3 ? ease(seg(t, 0, 0.6)) : 1;
  if (w3 > 0.01) {
    arrow('copy', 'an-copy', SN, plus(SN, SVM), w3);
    arrow('diff', 'an-diff', plus(SN, SVM), plus(SN, SVN), w3);
    const c = plus(SN, SVM), d: V = [SVN[0] - SVM[0], SVN[1] - SVM[1]], dl = Math.hypot(...d), du: V = [d[0] / dl, d[1] / dl];
    sb.label('lab-diff', toS(plus(plus(c, d, 0.5), U, 14)), String.raw`\v v_N - \v v_M`, 'angle', w3 > 0.8 ? 1 : 0, 'l');
    // right angle between the difference and the direction of a
    const q0 = plus(c, du, 10), q1 = plus(q0, U, 10), q2 = plus(c, U, 10);
    S('ra', 'polyline', 'an-ra', [toS(q0), toS(q1), toS(q2)], w3);
    S('dline', 'line', 'an-guide', [toS(plus(c, U, -30)), toS(plus(c, U, 40))], w3 * 0.8);
  }
  const b4 = step === 4 ? ease(seg(t, 0.2, 0.7)) : 0;
  sb.label('box', [392, 292], '', 'fg', b4, 'tr', { box: true, rows: [
    { tex: String.raw`\v a\cdot(\v v_N - \v v_M) = 0`, ink: 'fg' },
    { tex: String.raw`\v a\cdot\v v_N = \v a\cdot\v v_M`, ink: 'rho' },
  ] });
  const p2box = step === 2 ? ease(seg(t, 0.6, 1)) : step === 3 ? 1 - ease(seg(t, 0, 0.3)) : 0;
  sb.label('box-proj', [392, 292], '', 'fg', p2box, 'tr', { box: true, rows: [
    { tex: String.raw`|\v v'_M| = |\v v'_N|`, ink: 'rho' },
  ] });

  S('M', 'circle', 'an-point', [toS(SM)], 1, 5); S('N', 'circle', 'an-point', [toS(SN)], 1, 5);
  sb.label('lab-M', toS(plus(SM, [-12, 10])), 'M', 'point', 1, 'r');
  sb.label('lab-N', toS(plus(SN, [-7, 17])), 'N', 'point', 1, 'r');
  return sb.finish({ step, projM, projN });
}
