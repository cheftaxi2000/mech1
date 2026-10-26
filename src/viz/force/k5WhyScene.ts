/**
 * Supplement «Warum ist P = F̲ · v̲ plausibel?» (not in the lecture notes): the push F̲ · dr̲ over a short time, divided by dt.
 *
 *  step 0  the force F̲ and the velocity v̲ at the point A
 *  step 1  in the short time dt the point moves by d r̲ = v̲ dt (from A to A′)
 *  step 2  only the part of F̲ along the motion helps: |F̲| cos α (drop line, thick strip on the track)
 *  step 3  that part times the distance is the area of a rectangle: |F̲| cos α · |d r̲| (the «push» F̲ · d r̲)
 *  step 4  divided by dt the side |d r̲| becomes |v̲|: the area is the power P = F̲ · v̲
 *
 * Numbers: F̲ = (2,6; 1,5) N, v̲ = (2,0; 0) m/s, dt = 0,5 s (chosen for drawing only; the argument holds for every dt).
 */
import type { Lang } from '../../i18n';
import { fmtNum } from '../../i18n';
import { power, powerAngle } from '../../physics/force';
import { pushOver } from '../../physics/powerMoment';
import { ease, seg, type P2 } from '../anim/geometry';
import { arrowHead, sceneBuilder, type Ink, type Scene } from '../anim/scene';

export const WHY = { F: [2.6, 1.5] as [number, number], v: 2, dt: 0.5 };
export const WHY_STEPS = 5;

const KF = 36, KV = 50, KR = 50, KA = 20; // px per N, per m/s, per m; rect height px per N
const A: P2 = [128, 112];
const force = 'force' as unknown as Ink; // styles.css has .ink-force

export function whyNumbers() {
  const Fv: [number, number, number] = [WHY.F[0], WHY.F[1], 0], vv: [number, number, number] = [WHY.v, 0, 0];
  const dr = WHY.v * WHY.dt;
  return { Fpar: WHY.F[0], dr, push: pushOver(Fv, vv, WHY.dt), P: power(Fv, vv), Fabs: Math.hypot(...WHY.F), alpha: powerAngle(Fv, vv) ?? 0 };
}

export function whyScene(step: number, t: number, lang: Lang): Scene {
  const sb = sceneBuilder();
  const n = whyNumbers();
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => sb.shape({ key, kind, cls, pts, o, r });
  const arrow = (key: string, cls: string, a: P2, b: P2, o = 1) => {
    if (o <= 0.01 || Math.hypot(b[0] - a[0], b[1] - a[1]) < 1) return;
    S(key, 'line', cls, [a, b], o); S(key + '-h', 'polygon', cls + '-head', arrowHead(a, b, 9), o);
  };
  const f1 = (x: number) => fmtNum(x, 1, lang, true);
  const mv = (p: P2, dx: number, dy = 0): P2 => [p[0] + dx, p[1] + dy];

  const Fv: P2 = [KF * WHY.F[0], -KF * WHY.F[1]];
  const tipF = mv(A, Fv[0], Fv[1]);
  const tipV = mv(A, KV * WHY.v);
  const Ap = mv(A, KR * n.dr);
  const foot = mv(A, KF * n.Fpar);

  // track
  S('track', 'line', 'lp-s-track', [[16, A[1]], [384, A[1]]]);

  // step 1: A glides to A′
  const glide = step === 1 ? ease(seg(t, 0.1, 0.85)) : step > 1 ? 1 : 0;
  const Apos = mv(A, KR * n.dr * glide);
  if (step >= 1) S('ghost', 'circle', 'lp-s-ghost', [A], 1, 5.5);
  S('A', 'circle', 'lp-s-dot', [Apos], 1, 5.5);
  // the velocity arrow (long) fades back once d r̲ is drawn
  const vo = step === 0 ? ease(seg(t, 0.15, 0.7)) : step === 1 ? 1 - 0.55 * ease(seg(t, 0.4, 0.9)) : step >= 2 ? 0.45 : 0;
  arrow('v', 'lp-s-vel', A, tipV, vo);
  const dro = step === 1 ? ease(seg(t, 0.55, 1)) : step >= 2 ? 1 : 0;
  arrow('dr', 'lp-s-dr', mv(A, 0, 14), mv(Ap, 0, 14), dro);
  if (dro > 0.01) { S('dr-l', 'line', 'lp-s-drtick', [mv(A, 0, 8), mv(A, 0, 20)], dro); S('dr-r', 'line', 'lp-s-drtick', [mv(Ap, 0, 8), mv(Ap, 0, 20)], dro); }
  // the force at A
  const fo = step === 0 ? ease(seg(t, 0, 0.6)) : 1;
  arrow('F', 'lp-s-force', A, mv(A, Fv[0] * (step === 0 ? fo : 1), Fv[1] * (step === 0 ? fo : 1)), fo);

  // step 2: drop line, strip on the track, α
  const proj = step === 2 ? ease(seg(t, 0.1, 0.8)) : step > 2 ? 1 : 0;
  if (proj > 0.01) {
    S('drop', 'line', 'lp-s-drop', [tipF, [tipF[0], tipF[1] + (A[1] - tipF[1]) * proj]], proj);
    S('strip', 'line', 'lp-s-strip', [A, mv(A, KF * n.Fpar * proj)], 0.9);
    S('alpha', 'polyline', 'lp-s-arc', Array.from({ length: 13 }, (_, i) => { const a = (-n.alpha * i) / 12; return [A[0] + 26 * Math.cos(a), A[1] + 26 * Math.sin(a)] as P2; }), proj);
  }

  // step 3: the rectangle |F| cos α × |d r̲| below the track
  const hRect = KA * n.Fpar;
  const rect = (w: number): P2[] => [mv(A, 0, 26), mv(A, w, 26), mv(A, w, 26 + hRect), mv(A, 0, 26 + hRect)];
  const r3 = step === 3 ? ease(seg(t, 0.1, 0.8)) : step === 4 ? 1 : 0;
  const widen = step === 4 ? ease(seg(t, 0.1, 0.75)) : 0; // step 4: the width |d r̲| grows to |v̲|
  const width = KR * n.dr + (KV * WHY.v - KR * n.dr) * widen;
  if (r3 > 0.01) S('rect', 'polygon', 'lp-s-rect', rect(width), r3);

  // labels
  sb.label('A', mv(A, -14, 16), 'A', 'point', 1, 'c');
  sb.label('Ap', mv(Ap, 12, -16), String.raw`A'`, 'point', step >= 1 && glide > 0.95 ? 1 : 0, 'c');
  sb.label('F', mv(tipF, 16, -12), String.raw`\v F`, force, fo > 0.9 ? 1 : 0, 'c');
  sb.label('v', mv(tipV, 4, -18), String.raw`\v v_A`, 'point', vo > 0.9 && step === 0 ? 1 : 0, 'c');
  sb.label('dr', mv(Ap, 40, 6), String.raw`\mathrm{d}\v r = \v v\,\mathrm{d}t`, 'point', step === 1 && dro > 0.9 ? 1 : 0, 'l');
  sb.label('Fcos', mv(foot, 0, 30), String.raw`|\v F|\cos\alpha`, 'z', step === 2 && proj > 0.9 ? 1 : 0, 'c');
  sb.label('alpha', mv(A, 40, -9), String.raw`\alpha`, 'angle', step === 2 && proj > 0.9 ? 1 : 0, 'c');
  const box = (key: string, o: number, rows: { tex: string; ink: Ink }[]) => sb.label(key, [6, 294], '', 'fg', o, 'bl', { box: true, rows });
  box('box3', step === 3 ? ease(seg(t, 0.8, 1)) : 0, [{ tex: String.raw`|\v F|\cos\alpha\cdot|\mathrm{d}\v r| = ${f1(n.Fpar)}\cdot ${f1(n.dr)} = ${f1(n.push)}\,\text{N}\,\text{m}`, ink: 'z' }]);
  box('box4', step === 4 ? ease(seg(t, 0.75, 1)) : 0, [
    { tex: String.raw`\dfrac{|\mathrm{d}\v r|}{\mathrm{d}t} = |\v v_A|`, ink: 'fg' },
    { tex: String.raw`P = |\v F|\cos\alpha\cdot|\v v_A| = ${f1(n.Fpar)}\cdot ${f1(WHY.v)} = ${f1(n.P)}\,\text{W}`, ink: 'z' },
  ]);
  // labels on the rectangle: its two sides
  sb.label('side1', mv(A, width / 2, 26 + hRect + 14), step === 3 ? String.raw`|\mathrm{d}\v r|` : String.raw`|\v v_A|`, 'point', r3 > 0.95 && (step === 3 || widen > 0.95) ? 1 : 0, 'c');
  sb.label('side2', mv(A, -44, 26 + hRect / 2), String.raw`|\v F|\cos\alpha`, 'z', r3 > 0.95 ? 1 : 0, 'c');

  return sb.finish({ step, glide, proj, width, recto: r3, push: n.push, power: n.P, fpar: n.Fpar, dr: n.dr });
}
