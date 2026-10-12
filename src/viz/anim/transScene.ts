/**
 * Pure scene of Fig. 3.4 (lecture p. 13): translation, congruent trajectories. SVG coordinates (y down).
 *
 *  step 0  body at t1 with M, N and a = MN
 *  step 1  the body moves to time t without turning: a is the same arrow; the displacements R_M(t), R_N(t) are equal
 *  step 2  on to t2: the paths of M and N — the same curve, shifted by a (congruent)
 *  step 3  at time t: v_M = v_N (because ȧ = 0)
 */
import type { Lang } from '../../i18n';
import { ease, seg, type P2 } from './geometry';
import { arrowHead, sceneBuilder, type Scene } from './scene';

export const TA: P2 = [62, -78]; // a = MN (constant)
export const pathM = (s: number): P2 => [48 + 240 * s, 238 - 40 * s - 70 * Math.sin(Math.PI * s)];
export const pathN = (s: number): P2 => { const m = pathM(s); return [m[0] + TA[0], m[1] + TA[1]]; };
export const dPath = (s: number): P2 => [240, -40 - 70 * Math.PI * Math.cos(Math.PI * s)]; // dM/ds = dN/ds
export const S_T = 0.48, S_T2 = 1;
const V_SCALE = 0.32;

function body(s: number): P2[] {
  const m = pathM(s), c: P2 = [m[0] + TA[0] / 2, m[1] + TA[1] / 2], rot = Math.atan2(TA[1], TA[0]);
  return Array.from({ length: 36 }, (_, i) => {
    const t = (2 * Math.PI * i) / 36, r = 1 + 0.07 * Math.sin(3 * t);
    const x = 72 * r * Math.cos(t), y = 34 * r * Math.sin(t);
    return [c[0] + x * Math.cos(rot) - y * Math.sin(rot), c[1] + x * Math.sin(rot) + y * Math.cos(rot)];
  });
}

export function transScene(step: number, t: number, lang: Lang): Scene {
  void lang;
  const sb = sceneBuilder();
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => sb.shape({ key, kind, cls, pts, o, r });
  const arrow = (key: string, cls: string, a: P2, b: P2, o = 1) => {
    if (o <= 0.01 || Math.hypot(b[0] - a[0], b[1] - a[1]) < 1) return;
    S(key, 'line', cls, [a, b], o); S(key + '-h', 'polygon', cls.split(' ')[0] + '-head', arrowHead(a, b, 8), o);
  };
  const s = step === 0 ? 0 : step === 1 ? S_T * ease(seg(t, 0.1, 0.8)) : step === 2 ? S_T + (S_T2 - S_T) * ease(seg(t, 0.1, 0.8)) : S_T;
  const at = (k: string, ss: number, o: number, ghost: boolean) => {
    S(`body-${k}`, 'polygon', ghost ? 'an-body ghost' : 'an-body', body(ss), o);
    arrow(`a-${k}`, ghost ? 'an-r thin' : 'an-r', pathM(ss), pathN(ss), o);
    S(`M-${k}`, 'circle', ghost ? 'an-point ghost' : 'an-point', [pathM(ss)], o, 4.5);
    S(`N-${k}`, 'circle', ghost ? 'an-point ghost' : 'an-point', [pathN(ss)], o, 4.5);
  };
  // trajectories (step 2 on), drawn up to the current s
  const tr = step >= 2 ? 1 : 0;
  if (tr) {
    const n = 48, upto = step === 2 ? s : S_T2;
    S('pathM', 'polyline', 'an-curve', Array.from({ length: n + 1 }, (_, i) => pathM((upto * i) / n)));
    S('pathN', 'polyline', 'an-curve', Array.from({ length: n + 1 }, (_, i) => pathN((upto * i) / n)));
  }
  // ghost at t1 once the body has moved
  if (step >= 1) at('t1', 0, 0.7, true);
  if (step === 2 || step === 3) at('t', S_T, step === 2 ? 0.7 : 1, step === 2);
  if (step === 2 && s > S_T + 0.02) at('t2', s, 1, false);
  if (step <= 1) at('now', s, 1, false);
  // displacements R_M(t), R_N(t)
  const disp = step === 1 ? ease(seg(t, 0.75, 1)) : step === 2 ? 1 - ease(seg(t, 0, 0.3)) : 0;
  arrow('RM', 'an-dr', pathM(0), pathM(S_T), disp);
  arrow('RN', 'an-dr', pathN(0), pathN(S_T), disp);
  // velocities at t
  const v3 = step === 3 ? ease(seg(t, 0.15, 0.7)) : 0;
  const d = dPath(S_T), vv: P2 = [V_SCALE * d[0] * v3, V_SCALE * d[1] * v3];
  arrow('vM', 'an-v', pathM(S_T), [pathM(S_T)[0] + vv[0], pathM(S_T)[1] + vv[1]], v3 > 0.01 ? 1 : 0);
  arrow('vN', 'an-v', pathN(S_T), [pathN(S_T)[0] + vv[0], pathN(S_T)[1] + vv[1]], v3 > 0.01 ? 1 : 0);

  // labels: M and N on the solid body; the times t₁, t, t₂ below the M end of each position (as in Fig. 3.4)
  const cur = step <= 2 ? s : S_T;
  const m = pathM(cur), nn = pathN(cur);
  sb.label('lab-M', [m[0] + 8, m[1] + 14], 'M', 'point', 1, 'l');
  sb.label('lab-N', [nn[0] + 8, nn[1] - 8], 'N', 'point', 1, 'l');
  sb.label('lab-a', [(m[0] + nn[0]) / 2 + 12, (m[1] + nn[1]) / 2 + 6], String.raw`\v a`, 'r', 1, 'l');
  const LA = Math.hypot(TA[0], TA[1]);
  const timeAt = (ss: number): P2 => [pathM(ss)[0] - (36 * TA[0]) / LA, pathM(ss)[1] - (36 * TA[1]) / LA];
  if (step >= 1) sb.label('lab-t1', timeAt(0), 't_1', 'muted', 1, 'c');
  if (step >= 2) sb.label('lab-t', timeAt(S_T), 't', 'muted', step === 2 ? ease(seg(t, 0.3, 0.5)) : 1, 'c');
  const rmid = [(pathM(0)[0] + pathM(S_T)[0]) / 2, (pathM(0)[1] + pathM(S_T)[1]) / 2] as P2;
  const rnid = [(pathN(0)[0] + pathN(S_T)[0]) / 2, (pathN(0)[1] + pathN(S_T)[1]) / 2] as P2;
  sb.label('lab-RM', [rmid[0] + 6, rmid[1] + 14], String.raw`\v R_M(t)`, 'x', disp, 'l');
  sb.label('lab-RN', [rnid[0] - 12, rnid[1] - 14], String.raw`\v R_N(t)`, 'x', disp, 'r');
  if (step === 2) sb.label('lab-t2', timeAt(s), 't_2', 'muted', ease(seg(t, 0.8, 1)), 'c');
  sb.label('lab-vM', [pathM(S_T)[0] + vv[0] + 4, pathM(S_T)[1] + vv[1] + 12], String.raw`\v v_M`, 'point', v3 > 0.8 ? 1 : 0, 'l');
  sb.label('lab-vN', [pathN(S_T)[0] + vv[0] + 6, pathN(S_T)[1] + vv[1] - 6], String.raw`\v v_N`, 'point', v3 > 0.8 ? 1 : 0, 'l');
  sb.label('box', [392, 292], String.raw`\dot{\v a} = \v v_N - \v v_M = \v 0`, 'fg', v3, 'tr', { box: true });
  return sb.finish({ step, s });
}
