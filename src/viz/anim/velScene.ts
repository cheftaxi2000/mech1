/**
 * Pure scene of the velocity derivation (lecture pp. 8–9, figure of §2.1), plane drawing in SVG units.
 *
 *  step 0  trajectory (Bahnkurve) from O; r(t) to M; the arc length s(t) from O to M
 *  step 1  the later point at t + Δt: r(t + Δt), the chord Δr = r(t + Δt) − r(t) and the arc Δs
 *  step 2  Δt → 0: the later point slides into M; the chord turns into the tangent, |Δr|/Δs → 1;
 *          the arrow Δr/Δt (drawn from M) settles on ṙ
 *  step 3  the result: tangent unit vector τ and v = ṡ τ at M
 * Every step's final frame shows what its caption says (tested in velScene.test.ts).
 */
import { fmtNum, type Lang } from '../../i18n';
import { ease, seg, type P2 } from './geometry';
import { arrowHead, sceneBuilder, type Scene } from './scene';

/** Trajectory in SVG units (y down): a cubic Bézier curve like the U-shaped curve of the lecture figure, t in [0, T_END]. */
const B: P2[] = [[48, 92], [62, 262], [262, 262], [330, 22]];
const bez = (i: 0 | 1, t: number) => { const u = 1 - t; return u * u * u * B[0][i] + 3 * u * u * t * B[1][i] + 3 * u * t * t * B[2][i] + t * t * t * B[3][i]; };
const dbez = (i: 0 | 1, t: number) => { const u = 1 - t; return 3 * u * u * (B[1][i] - B[0][i]) + 6 * u * t * (B[2][i] - B[1][i]) + 3 * t * t * (B[3][i] - B[2][i]); };
export const curve = (t: number): P2 => [bez(0, t), bez(1, t)];
export const dcurve = (t: number): P2 => [dbez(0, t), dbez(1, t)];
export const T_END = 1, T0 = 0.36, DT0 = 0.3, DT_MIN = 0.006;
/** Arrow length per unit of velocity (SVG units per (SVG unit / time)). */
export const V_SCALE = 0.25;
export const TAU_LEN = 30;

/** Arc length from t = a to t = b (Simpson, fine enough for drawing and tests). */
export function arcLength(a: number, b: number, n = 200): number {
  const h = (b - a) / n, sp = (t: number) => Math.hypot(...dcurve(t));
  let s = sp(a) + sp(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * sp(a + i * h);
  return (s * h) / 3;
}
const poly = (a: number, b: number, n = 60): P2[] => Array.from({ length: n + 1 }, (_, i) => curve(a + ((b - a) * i) / n));

/** Δt as a function of (step, t): constant DT0 in step 1, shrinking geometrically to DT_MIN in step 2. */
export function dtAt(step: number, t: number): number {
  if (step < 2) return DT0;
  if (step === 2) return DT0 * Math.pow(DT_MIN / DT0, ease(seg(t, 0.05, 0.9)));
  return DT_MIN;
}

export function velScene(step: number, t: number, lang: Lang): Scene {
  const sb = sceneBuilder();
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => sb.shape({ key, kind, cls, pts, o, r });
  const arrow = (key: string, cls: string, a: P2, b: P2, o = 1) => {
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1) return;
    S(key, 'line', cls, [a, b], o); S(key + '-h', 'polygon', cls.split(' ')[0] + '-head', arrowHead(a, b, 8), o);
  };
  const num = (v: number) => fmtNum(v, 2, lang, true);

  const O = curve(0), M = curve(T0);
  const draw = step === 0 ? ease(seg(t, 0, 0.45)) : 1; // trajectory drawing
  const show0 = step === 0 ? ease(seg(t, 0.45, 0.75)) : 1; // r(t), M
  const showS = step === 0 ? ease(seg(t, 0.7, 1)) : 1; // arc length s
  const show1 = step === 0 ? 0 : step === 1 ? ease(seg(t, 0, 0.6)) : 1; // later point, chord
  const dt = dtAt(step, t);
  const P = curve(T0 + dt);
  const fadeLater = step === 3 ? 1 - ease(seg(t, 0, 0.4)) : 1; // step 3 removes the limit construction

  // trajectory and arc length s(t)
  S('curve', 'polyline', 'an-curve', poly(0, T_END * draw, 120));
  S('s', 'polyline', 'an-s', poly(0, T0), showS);
  sb.label('lab-curve', [curve(0.9)[0] + 12, curve(0.9)[1]], String.raw`\text{${lang === 'de' ? 'Bahnkurve' : 'trajectory'}}`, 'muted', draw, 'l');
  sb.label('lab-s', [curve(0.13)[0] - 8, curve(0.13)[1]], String.raw`s(t)`, 'rho', showS * fadeLater, 'r');

  // O and r(t)
  S('O', 'circle', 'an-o', [O], 1, 3.5);
  sb.label('lab-O', [O[0] - 6, O[1] - 12], 'O', 'muted', 1, 'r');
  arrow('r', 'an-r', O, M, show0);
  sb.label('lab-r', [O[0] + 0.72 * (M[0] - O[0]) + 10, O[1] + 0.72 * (M[1] - O[1]) - 6], String.raw`\v r(t)`, 'r', show0 * fadeLater, 'l');

  // later point, chord Δr, arc Δs
  const o1 = show1 * fadeLater;
  if (o1 > 0.01) {
    arrow('r2', 'an-r thin', O, P, o1 * (step === 2 ? 1 - ease(seg(t, 0.6, 0.9)) * 0.6 : 1));
    S('ds', 'polyline', 'an-ds', poly(T0, T0 + dt, 30), o1);
    arrow('dr', 'an-dr', M, P, o1);
    S('P', 'circle', 'an-point ghost', [P], o1, 5);
    const big = dt > 0.1 ? 1 : 0;
    sb.label('lab-r2', [(O[0] + P[0]) / 2, (O[1] + P[1]) / 2 - 12], String.raw`\v r(t+\Delta t)`, 'r', o1 * big, 'c');
    sb.label('lab-dr', [(M[0] + P[0]) / 2 + 4, (M[1] + P[1]) / 2 - 14], String.raw`\Delta\v r`, 'x', o1 * big, 'c');
    sb.label('lab-ds', [curve(T0 + dt * 0.55)[0] + 8, curve(T0 + dt * 0.55)[1] + 12], String.raw`\Delta s`, 'rho', o1 * big, 'l');
  }
  // Δr/Δt from M, and the dashed tangent
  if (step === 2 || step === 3) {
    const k = step === 2 ? ease(seg(t, 0, 0.15)) * fadeLater : fadeLater;
    const q: P2 = [(P[0] - M[0]) / dt, (P[1] - M[1]) / dt];
    arrow('drdt', 'an-v thin', M, [M[0] + V_SCALE * q[0], M[1] + V_SCALE * q[1]], k * 0.85);
    const ratio = Math.hypot(P[0] - M[0], P[1] - M[1]) / arcLength(T0, T0 + dt);
    sb.label('box-limit', [392, 236], '', 'fg', k, 'tr', {
      box: true,
      rows: [
        { tex: String.raw`\Delta t = ${num(dt)}`, ink: 'fg' },
        { tex: String.raw`|\Delta\v r|/\Delta s = ${num(ratio)}`, ink: 'fg' },
      ],
    });
  }
  const dc = dcurve(T0), sdot = Math.hypot(...dc), u: P2 = [dc[0] / sdot, dc[1] / sdot];
  const tanO = step === 2 ? ease(seg(t, 0.7, 1)) : step === 3 ? 1 : 0;
  S('tangent', 'line', 'an-tangent', [[M[0] - 90 * u[0], M[1] - 90 * u[1]], [M[0] + 150 * u[0], M[1] + 150 * u[1]]], tanO);

  // result: τ and v = ṡ τ
  const show3 = step === 3 ? ease(seg(t, 0.3, 0.8)) : 0;
  const V: P2 = [M[0] + V_SCALE * dc[0], M[1] + V_SCALE * dc[1]];
  arrow('v', 'an-v', M, V, show3);
  const n: P2 = [-u[1] * 11, u[0] * 11]; // τ is drawn parallel to v, slightly offset, so both stay visible
  arrow('tau', 'an-tau', [M[0] + n[0], M[1] + n[1]], [M[0] + n[0] + TAU_LEN * u[0], M[1] + n[1] + TAU_LEN * u[1]], show3);
  sb.label('lab-v', [V[0] + 6, V[1] + 4], String.raw`\v v`, 'point', show3, 'l');
  sb.label('lab-tau', [M[0] + n[0] + TAU_LEN * u[0] * 0.6, M[1] + n[1] + TAU_LEN * u[1] * 0.6 + 14], String.raw`\v\tau`, 'fg', show3, 'c');
  sb.label('box-v', [100, 8], '', 'fg', show3, 'tl', {
    box: true,
    rows: [
      { tex: String.raw`\v v = \dot{\v r} = \dot s\,\v\tau`, ink: 'point' },
      { tex: String.raw`|\v\tau| = 1,\quad \dot s = |\v v|`, ink: 'fg' },
    ],
  });

  S('M', 'circle', 'an-point', [M], show0, 5);
  sb.label('lab-M', [M[0] - 10, M[1] + 8], 'M', 'point', show0, 'r');
  return sb.finish({ dt, step });
}
