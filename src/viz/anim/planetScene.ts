/**
 * Pure scene of the Planetengetriebe (lecture p. 28, Fig. 3.21) and its handwritten solution, one step per line:
 *
 *  step 0  the gear turns: sun 1 and ring 2 about O, the planet 3 rolls between them and takes the arm along
 *  step 1  P, Q ∈ [3]: P is where planet and sun touch, Q where planet and ring touch
 *  step 2  P ∈ [1]: v_P = ω₁R₁ (rolling: sun and planet are equally fast at P)
 *  step 3  Q ∈ [2]: v_Q = ω₂R₂
 *  step 4  the planet turns momentarily about Z₃ (line through the arrow tips): Z₃P·ω₃ = v_P, (Z₃P + PQ)·ω₃ = v_Q
 *  step 5  subtract: PQ·ω₃ = v_Q − v_P ⇒ ω₃ = (ω₂R₂ − ω₁R₁)/(R₂ − R₁)
 *  step 6  A is the midpoint of PQ: v_A = ½(v_P + v_Q)
 *  step 7  A belongs to the arm, which turns about O: ω_Arm·L = v_A ⇒ the boxed result
 * Values as drawn in Fig. 3.21 (all arrows to the left, v_Q > v_P): ω₁ = 1, ω₂ = 0.5; R₁ = 0.8, R₂ = 2.8.
 */
import type { Lang } from '../../i18n';
import { GEAR, R3, TEETH, armLength, gearState, type P2 as Q2 } from '../../physics/planetary';
import { RING_OUT, circlePts, gearOutline, marks, velocityPicture, withArm } from '../planetGeom';
import { ease, seg, type P2 } from './geometry';
import { arrowHead, sceneBuilder, type Ink, type Scene } from './scene';

export const PS = { W1: 1, W2: 0.5, CX: 272, CY: 147, S: 40, KV: 52, T0: -5 };
const sv = (p: Q2): P2 => [PS.CX + PS.S * p[0], PS.CY - PS.S * p[1]];

export function planetScene(step: number, t: number, lang: Lang): Scene {
  const sb = sceneBuilder();
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => sb.shape({ key, kind, cls, pts, o, r });
  const arrow = (key: string, cls: string, a: P2, b: P2, o = 1, head = 8) => {
    if (o <= 0.01 || Math.hypot(b[0] - a[0], b[1] - a[1]) < 1) return;
    S(key, 'line', cls, [a, b], o); S(key + '-h', 'polygon', cls.split(' ')[0] + '-head', arrowHead(a, b, head), o);
  };
  const de = lang === 'de';
  const g = GEAR;
  const tau = step === 0 ? PS.T0 * (1 - ease(seg(t, 0, 0.8))) : 0;
  const st = gearState(g, PS.W1, PS.W2, tau, TEETH);
  const vp = velocityPicture(g, PS.W1, PS.W2, gearState(g, PS.W1, PS.W2, 0, TEETH), PS.KV / PS.S);
  const mk = marks(st);

  // the gear: ring (annulus), sun, planet, arm
  S('ring-out', 'polygon', 'pg-ring', circlePts([0, 0], g.R2 + RING_OUT).map(sv));
  S('ring-in', 'polygon', 'pg-ring-hole', gearOutline([0, 0], g.R2, TEETH.N2, st.th2).map(sv));
  mk.ringMarks.forEach((p, i) => S('rm' + i, 'circle', 'pg-mark', [sv(p)], 1, 2.2));
  S('sun', 'polygon', 'pg-sun', gearOutline([0, 0], g.R1, TEETH.N1, st.th1).map(sv));
  mk.sunHoles.forEach((p, i) => S('sh' + i, 'circle', 'pg-hole', [sv(p)], 1, 2.6));
  S('planet', 'polygon', 'pg-planet', gearOutline(st.A, R3(g), TEETH.N3, st.th3).map(sv));
  mk.planetHoles.forEach((p, i) => S('ph' + i, 'circle', 'pg-hole', [sv(p)], 1, 2.6));
  S('planet-mark', 'line', 'pg-pmark', mk.planetMark.map(sv));
  const armHi = step === 7 ? ease(seg(t, 0, 0.3)) : 0;
  S('arm', 'line', armHi > 0.5 ? 'pg-arm hi' : 'pg-arm', [sv([0, 0]), sv(st.A)]);
  S('O', 'circle', 'an-o', [sv([0, 0])], 1, 3.5);
  S('Apin', 'circle', 'pg-pin', [sv(st.A)], 1, 3.5);
  sb.label('lab-O', [sv([0, 0])[0] + 9, sv([0, 0])[1] + 11], 'O', 'fg', 1, 'l');

  // part numbers (as in the lecture's legend)
  const num = (k: string, p: Q2, ink: Ink = 'muted') => sb.label('n' + k, sv(p), String.raw`\boxed{${k}}`, ink, 1, 'c');
  num('1', withArm(st, [-0.72, -0.72])); num('2', withArm(st, [1.7, -2.05])); num('3', [st.A[0] + 1.42, st.A[1] - 0.15]);
  sb.label('lab-arm', [sv([0, 0])[0] + 9, sv([0, 0.42])[1]], String.raw`\text{Arm}`, armHi > 0.5 ? 'fg' : 'muted', step === 0 ? 1 : 0, 'l');

  // step 0: the legend
  const lg = step === 0 ? ease(seg(t, 0.7, 1)) : 0;
  sb.label('box0', [6, 6], '', 'fg', lg, 'tl', { box: true, rows: [
    { tex: String.raw`\boxed{1}\ \text{${de ? 'Sonnenrad' : 'sun gear'}}\ R_1,\ \omega_1`, ink: 'fg' },
    { tex: String.raw`\boxed{2}\ \text{${de ? 'Hohlrad' : 'ring gear'}}\ R_2,\ \omega_2`, ink: 'fg' },
    { tex: String.raw`\boxed{3}\ \text{${de ? 'Planetenrad' : 'planet'}}\ R_3,\ \omega_3`, ink: 'fg' },
    { tex: String.raw`\text{Arm}\ L,\ \omega_{\text{Arm}}`, ink: 'fg' },
  ] });

  // step 1: P and Q on the line through O
  const pq = step === 0 ? 0 : step === 1 ? ease(seg(t, 0.1, 0.5)) : 1;
  if (pq > 0.01) S('line', 'line', 'an-guide', [sv([0, -0.25]), sv([0, g.R2 + 0.5])], pq);
  const box = (key: string, o: number, rows: { tex: string; ink: Ink }[]) => sb.label(key, [6, 294], '', 'fg', o, 'bl', { box: true, rows });
  box('box1', step === 1 ? ease(seg(t, 0.55, 0.9)) : 0, [{ tex: String.raw`P,\ Q \in \boxed{3}`, ink: 'point' }, { tex: String.raw`P\colon \boxed{3}\ \text{${de ? 'berührt' : 'touches'}}\ \boxed{1}`, ink: 'muted' }, { tex: String.raw`Q\colon \boxed{3}\ \text{${de ? 'berührt' : 'touches'}}\ \boxed{2}`, ink: 'muted' }]);

  // step 2: v_P, radius R₁; step 3: v_Q, radius R₂
  const r1 = step === 2 ? ease(seg(t, 0, 0.35)) : 0, r2 = step === 3 ? ease(seg(t, 0, 0.35)) : 0;
  if (r1 > 0.01) S('R1', 'line', 'pg-radius', [sv([0, 0]), sv(vp.P)], r1);
  if (r2 > 0.01) S('R2', 'line', 'pg-radius', [sv([0, 0]), sv(vp.Q)], r2);
  sb.label('lab-R1', [sv([0, 0])[0] - 8, sv([0, 0.45 * g.R1])[1]], 'R_1', 'fg', r1 > 0.9 ? 1 : 0, 'r');
  sb.label('lab-R2', [sv([0, 0])[0] - 8, sv([0, 0.8 * g.R2])[1]], 'R_2', 'fg', r2 > 0.9 ? 1 : 0, 'r');
  const ap = step === 2 ? ease(seg(t, 0.3, 0.7)) : step > 2 ? 1 : 0;
  const aq = step === 3 ? ease(seg(t, 0.3, 0.7)) : step > 3 ? 1 : 0;
  arrow('vP', 'an-v', sv(vp.P), sv(vp.tipP), ap);
  arrow('vQ', 'an-v', sv(vp.Q), sv(vp.tipQ), aq);
  sb.label('lab-vP', [sv(vp.tipP)[0] - 8, sv(vp.tipP)[1] + 12], String.raw`\omega_1R_1`, 'point', ap > 0.9 ? 1 : 0, 'r');
  sb.label('lab-vQ', [sv(vp.tipQ)[0] - 6, sv(vp.tipQ)[1] - 12], String.raw`\omega_2R_2`, 'point', aq > 0.9 ? 1 : 0, 'r');
  box('box2', step === 2 ? ease(seg(t, 0.65, 0.95)) : 0, [{ tex: String.raw`P \in \boxed{1}\colon\ v_P = \omega_1R_1`, ink: 'point' }]);
  box('box3', step === 3 ? ease(seg(t, 0.65, 0.95)) : 0, [{ tex: String.raw`Q \in \boxed{2}\colon\ v_Q = \omega_2R_2`, ink: 'point' }]);

  // step 4: line through the tips → Z₃; the velocity triangle of the planet
  const zl = step === 4 ? ease(seg(t, 0.05, 0.5)) : step > 4 ? 1 : 0;
  const Z3 = vp.Z3!;
  if (zl > 0.01) {
    const a = sv(vp.tipQ), b = sv(Z3);
    S('tips', 'line', 'pl-tips', [a, [a[0] + (b[0] - a[0]) * zl, a[1] + (b[1] - a[1]) * zl]]);
    S('tri', 'polygon', 'pg-tri', [sv(Z3), sv(vp.Q), sv(vp.tipQ)], zl);
  }
  const zo = step === 4 ? ease(seg(t, 0.45, 0.65)) : step > 4 ? 1 : 0;
  if (zo > 0.01) S('Z3', 'circle', 'rl-mc', [sv(Z3)], zo, 5.5);
  sb.label('lab-Z3', [sv(Z3)[0] + 12, sv(Z3)[1] + 12], 'Z_3', 'angle', zo > 0.9 ? 1 : 0, 'l');
  // distances Z₃P and PQ (dimension lines right of the line)
  const dm = step === 4 ? ease(seg(t, 0.6, 0.85)) : step === 5 ? 1 : 0;
  if (dm > 0.01) {
    const x = 30;
    const d1a = sv(Z3), d1b = sv(vp.P), d2b = sv(vp.Q);
    S('dZ3P', 'line', 'pl-dist', [[d1a[0] + x, d1a[1]], [d1b[0] + x, d1b[1]]], dm);
    S('dPQ', 'line', 'pg-dist2', [[d1b[0] + x + 10, d1b[1]], [d2b[0] + x + 10, d2b[1]]], dm);
    for (const [k, p, c] of [['e1', d1a, 'pl-dist'], ['e2', d1b, 'pl-dist'], ['e3', d1b, 'pg-dist2'], ['e4', d2b, 'pg-dist2']] as const) {
      const o = c === 'pl-dist' ? x : x + 10;
      S('d' + k, 'line', c, [[p[0] + o - 4, p[1]], [p[0] + o + 4, p[1]]], dm);
    }
  }
  sb.label('lab-Z3P', [sv(Z3)[0] + 36, (sv(Z3)[1] + sv(vp.P)[1]) / 2], String.raw`Z_3P`, 'angle', dm > 0.9 ? 1 : 0, 'l');
  sb.label('lab-PQ', [sv(vp.P)[0] + 46, sv([0, 0.5 * (g.R1 + g.R2) + 0.45])[1]], 'PQ', 'fg', dm > 0.9 ? 1 : 0, 'l');
  box('box4', step === 4 ? ease(seg(t, 0.75, 1)) : 0, [
    { tex: String.raw`Z_3P\cdot\omega_3 = v_P = \omega_1R_1`, ink: 'fg' },
    { tex: String.raw`(Z_3P + PQ)\cdot\omega_3 = v_Q`, ink: 'fg' },
    { tex: String.raw`\phantom{(Z_3P + PQ)\cdot\omega_3} = \omega_2R_2`, ink: 'fg' },
  ]);

  box('box5', step === 5 ? ease(seg(t, 0.55, 0.95)) : 0, [
    { tex: String.raw`PQ\cdot\omega_3 = \omega_2R_2 - \omega_1R_1`, ink: 'fg' },
    { tex: String.raw`PQ = R_2 - R_1`, ink: 'muted' },
    { tex: String.raw`\omega_3 = \frac{\omega_2R_2 - \omega_1R_1}{R_2 - R_1}`, ink: 'angle' },
  ]);

  // step 6: v_A, its tip on the line through the tips
  const aa = step === 6 ? ease(seg(t, 0.15, 0.6)) : step > 6 ? 1 : 0;
  arrow('vA', 'an-v', sv(vp.A), sv(vp.tipA), aa);
  sb.label('lab-vA', [sv(vp.tipA)[0] - 8, sv(vp.tipA)[1] + 11], String.raw`v_A`, 'point', aa > 0.9 ? 1 : 0, 'r');
  box('box6', step === 6 ? ease(seg(t, 0.6, 0.95)) : 0, [
    { tex: String.raw`A\ \text{${de ? 'Mitte von' : 'midpoint of'}}\ PQ`, ink: 'muted' },
    { tex: String.raw`v_A = \tfrac12\,(\omega_2R_2 + \omega_1R_1)`, ink: 'point' },
  ]);

  // step 7: the arm turns about O: its velocities grow linearly from O (dashed line from O through the tip of v_A)
  const al = step === 7 ? ease(seg(t, 0.2, 0.55)) : 0;
  if (al > 0.01) {
    const o = sv([0, 0]), b = sv(vp.tipA);
    S('armline', 'line', 'pg-armline', [o, [o[0] + (b[0] - o[0]) * al, o[1] + (b[1] - o[1]) * al]]);
    S('dL', 'line', 'pg-dist2', [[o[0] + 22, o[1]], [sv(vp.A)[0] + 22, sv(vp.A)[1]]], al);
    S('dL1', 'line', 'pg-dist2', [[o[0] + 18, o[1]], [o[0] + 26, o[1]]], al); S('dL2', 'line', 'pg-dist2', [[sv(vp.A)[0] + 18, sv(vp.A)[1]], [sv(vp.A)[0] + 26, sv(vp.A)[1]]], al);
  }
  sb.label('lab-L', [sv([0, 0])[0] + 28, sv([0, 0.62 * armLength(g)])[1]], 'L', 'fg', al > 0.9 ? 1 : 0, 'l');
  box('box7', step === 7 ? ease(seg(t, 0.55, 0.95)) : 0, [
    { tex: String.raw`\omega_{\text{Arm}}\cdot L = v_A`, ink: 'fg' },
    { tex: String.raw`\omega_{\text{Arm}} = \omega_2\,\frac{R_2}{R_2 + R_1}`, ink: 'angle' },
    { tex: String.raw`\phantom{\omega_{\text{Arm}}} + \omega_1\,\frac{R_1}{R_2 + R_1}`, ink: 'angle' },
  ]);

  // points (from step 1)
  if (pq > 0.01) {
    S('P', 'circle', 'an-point', [sv(vp.P)], pq, 4.2); S('Q', 'circle', 'an-point', [sv(vp.Q)], pq, 4.2);
  }
  sb.label('lab-P', [sv(vp.P)[0] + 8, sv(vp.P)[1] - 9], 'P', 'point', pq > 0.9 ? 1 : 0, 'l');
  sb.label('lab-Q', [sv(vp.Q)[0] + 8, sv(vp.Q)[1] + 10], 'Q', 'point', pq > 0.9 ? 1 : 0, 'l');
  sb.label('lab-A', [sv(st.A)[0] + 8, sv(st.A)[1] + 10], 'A', 'fg', pq > 0.9 ? 1 : 0, 'l');
  return sb.finish({ step, tau, armangle: st.thArm, w3: vp.w3, warm: vp.wArm, z3: vp.z3 ?? NaN });
}
