/**
 * Pure scene of the lecture's "Anschaulich" argument (p. 15): why a point C on the axis μ is at rest.
 * SVG coordinates (y down).
 *
 *  step 0  A and B are at rest, C lies on μ between them; a supposed velocity v_C, split into a part
 *          along μ and a part across μ (dashed parallelogram: the two parts add up to v_C)
 *  step 1  the part along μ vanishes: SdpG with A gives v_C·AC = v_A·AC = 0
 *  step 2  the part across μ vanishes: C would leave the line AB, the angle at C would no longer be 180°
 *          (dashed: where C would get to); in a rigid body angles do not change ⇒ v_C = 0
 */
import type { Lang } from '../../i18n';
import { ease, seg, type P2 } from './geometry';
import { arrowHead, sceneBuilder, type Scene } from './scene';

const L0: P2 = [40, 205], L1: P2 = [372, 125];
const LEN = Math.hypot(L1[0] - L0[0], L1[1] - L0[1]);
export const U: P2 = [(L1[0] - L0[0]) / LEN, (L1[1] - L0[1]) / LEN]; // along μ
export const N: P2 = [U[1], -U[0]]; // across μ, pointing up on the screen
const on = (s: number): P2 => [L0[0] + s * (L1[0] - L0[0]), L0[1] + s * (L1[1] - L0[1])];
export const RA = on(0.17), RC = on(0.5), RB = on(0.83);
export const ALONG = 58, ACROSS = 62; // the supposed v_C = ALONG·U + ACROSS·N (px)
const DISP = 42; // how far C would get across μ in step 2 (px)
const plus = (p: P2, q: P2, k = 1): P2 => [p[0] + k * q[0], p[1] + k * q[1]];

function blob(c: P2, rx: number, ry: number, rot: number): P2[] {
  return Array.from({ length: 44 }, (_, i) => {
    const t = (2 * Math.PI * i) / 44, r = 1 + 0.07 * Math.sin(3 * t + 0.5) + 0.04 * Math.cos(5 * t);
    const x = rx * r * Math.cos(t), y = ry * r * Math.sin(t);
    return [c[0] + x * Math.cos(rot) - y * Math.sin(rot), c[1] + x * Math.sin(rot) + y * Math.cos(rot)];
  });
}

/** Interior angle at C' of the bent line A–C'–B (radians); 180° when C' lies on μ. */
export function bentAngle(k: number): number {
  const c = plus(RC, N, DISP * k);
  const a: P2 = [RA[0] - c[0], RA[1] - c[1]], b: P2 = [RB[0] - c[0], RB[1] - c[1]];
  return Math.acos((a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b)));
}

export function restScene(step: number, t: number, lang: Lang): Scene {
  void lang;
  const sb = sceneBuilder();
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => sb.shape({ key, kind, cls, pts, o, r });
  const arrow = (key: string, cls: string, a: P2, b: P2, o = 1) => {
    if (o <= 0.01 || Math.hypot(b[0] - a[0], b[1] - a[1]) < 1) return;
    S(key, 'line', cls, [a, b], o); S(key + '-h', 'polygon', cls.split(' ')[0] + '-head', arrowHead(a, b, 8), o);
  };

  // body and axis μ
  S('body', 'polygon', 'an-body', blob(RC, 176, 64, Math.atan2(U[1], U[0])));
  S('mu', 'line', 'an-axis', [L0, L1]);
  sb.label('lab-mu', [L1[0] - 2, L1[1] + 16], String.raw`\mu`, 'fg', 1, 'r');

  // how much of each part of the supposed v_C is left
  const v0 = step === 0 ? ease(seg(t, 0, 0.35)) : 1;
  const parts = step === 0 ? ease(seg(t, 0.45, 0.85)) : 1;
  const along = step === 0 ? 1 : step === 1 ? 1 - ease(seg(t, 0.3, 0.8)) : 0;
  const across = step < 2 ? 1 : 1 - ease(seg(t, 0.5, 0.85));
  const vC = plus(plus(RC, U, ALONG * along), N, ACROSS * across);
  arrow('vC', 'an-v thin', RC, vC, v0 * along);
  sb.label('lab-vC', plus(vC, [8, -8]), String.raw`\v v_C`, 'point', v0 > 0.9 && along > 0.5 ? 1 : 0, 'l');
  arrow('along', 'an-erho', RC, plus(RC, U, ALONG * along), parts * (along > 0.02 ? 1 : 0));
  sb.label('lab-along', plus(plus(RC, U, ALONG * 0.6), N, -16), String.raw`\v v_{C\parallel}`, 'rho', parts > 0.9 && along > 0.5 ? 1 : 0, 'c');
  arrow('across', 'an-ephi', RC, plus(RC, N, ACROSS * across), parts * (across > 0.02 ? 1 : 0));
  // parallelogram completion: the two parts add up to v_C (dashed sides from each tip to the tip of v_C)
  const pc = parts * (along > 0.02 && across > 0.02 ? 1 : 0) * v0;
  if (pc > 0.01) {
    S('par-a', 'line', 'an-guide', [plus(RC, U, ALONG * along), vC], pc);
    S('par-b', 'line', 'an-guide', [plus(RC, N, ACROSS * across), vC], pc);
  }
  sb.label('lab-across', plus(plus(RC, N, ACROSS * 0.62), U, -12), String.raw`\v v_{C\perp}`, 'angle', parts > 0.9 && across > 0.5 ? 1 : 0, 'r');

  // step 1: SdpG with A along AC
  const s1 = step === 1 ? ease(seg(t, 0, 0.3)) : 0;
  if (s1 > 0.01) S('AC', 'line', 'an-proj', [RA, RC], s1 * 0.8);
  const box1 = step === 1 ? ease(seg(t, 0.6, 1)) : 0;
  sb.label('box1', [392, 292], '', 'fg', box1, 'tr', { box: true, rows: [
    { tex: String.raw`\v v_C\cdot\v{AC} = \v v_A\cdot\v{AC} = 0`, ink: 'rho' },
  ] });

  // step 2: if C moved across μ, the line A–C–B would bend
  const k = step === 2 ? ease(seg(t, 0, 0.45)) : 0;
  if (k > 0.01) {
    const c2 = plus(RC, N, DISP * k);
    S('bent', 'polyline', 'an-guide', [RA, c2, RB], 1);
    S('C2', 'circle', 'an-point ghost', [c2], 1, 5);
    // interior angle at C' (opens downward, away from N)
    const a1 = Math.atan2(RA[1] - c2[1], RA[0] - c2[0]), a2 = Math.atan2(RB[1] - c2[1], RB[0] - c2[0]);
    let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const mid = a1 + d / 2;
    if (Math.cos(mid) * -N[0] + Math.sin(mid) * -N[1] < 0) d = d > 0 ? d - 2 * Math.PI : d + 2 * Math.PI;
    S('gamma', 'polyline', 'an-arc', Array.from({ length: 25 }, (_, i) => { const a = a1 + (d * i) / 24; return [c2[0] + 22 * Math.cos(a), c2[1] + 22 * Math.sin(a)] as P2; }), k);
    sb.label('lab-gamma', plus(plus(c2, U, 26), N, 12), String.raw`\gamma < 180^\circ`, 'angle', k > 0.9 ? 1 : 0, 'l');
  }
  const box2 = step === 2 ? ease(seg(t, 0.7, 1)) : 0;
  sb.label('box2', [392, 292], '', 'fg', box2, 'tr', { box: true, rows: [
    { tex: String.raw`\v v_C = \v 0`, ink: 'point' },
  ] });

  // the three points of μ
  for (const [key, p] of [['A', RA], ['B', RB], ['C', RC]] as const) S(key, 'circle', 'an-point', [p], 1, 5);
  sb.label('lab-A', plus(RA, [-4, 18]), 'A', 'point', 1, 'c');
  sb.label('lab-B', plus(RB, [4, 18]), 'B', 'point', 1, 'c');
  sb.label('lab-C', plus(RC, [-17, 14]), 'C', 'point', 1, 'c');
  sb.label('lab-vA', plus(RA, [-6, -24]), String.raw`\v v_A = \v 0`, 'muted', 1, 'c');
  sb.label('lab-vB', plus(RB, [2, -26]), String.raw`\v v_B = \v 0`, 'muted', 1, 'c');
  return sb.finish({ step, along, across, gamma: (bentAngle(k) * 180) / Math.PI });
}
