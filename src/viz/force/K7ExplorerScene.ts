/**
 * Pure scene of the reference-point explorer (lesson K7, section 3): a plate with up to three forces, the reference
 * point B with the package {v̲_B, ω}, and two waterfall bars that show the same power in two ways:
 *   row group A: P_i = F̲_i · v̲_i, each force with the velocity of its own point (laid end to end, one row per force)
 *   row group B: R̲ · v̲_B and M̲_B · ω (rose and purple, one row each, end to end)
 * Both groups end at the same vertical line: moving B changes the two pieces of group B, never the total.
 */
import type { Lang } from '../../i18n';
import { plateNumbers, type Plate } from '../../physics/kraeftegruppe';
import type { P2 } from '../anim/geometry';
import type { Ink } from '../anim/scene';
import { FORCE, OMEGA, VEL, draw, num, roundToSum } from './k7Draw';
import { makeScene } from './K7Svg';

export const EW = 520, EH = 478;
/** Layout: plate coordinates (m, y up) → pixels, force and velocity scales, power scale. */
export const E = { OX: 260, OY: 132, S: 62, KF: 38, KV: 34, X0: 300, KW: 15, XMIN: 112, XMAX: 512, ROWS: { A: [314, 336, 358], B: [414, 436] } as const, YT: 462 };
export const ePx = (p: P2): P2 => [E.OX + E.S * p[0], E.OY - E.S * p[1]];
export const eMeter = (q: P2): P2 => [(q[0] - E.OX) / E.S, (E.OY - q[1]) / E.S];
const add2 = (a: P2, b: P2): P2 => [a[0] + b[0], a[1] + b[1]];
const dv = (v: P2, k: number): P2 => [k * v[0], -k * v[1]];
/** The plate: a rounded blob (metres). */
export const E_PLATE: P2[] = Array.from({ length: 36 }, (_, i) => {
  const a = (i / 36) * 2 * Math.PI, r = 1 + 0.05 * Math.sin(3 * a + 1) + 0.035 * Math.cos(2 * a);
  const x = 3.5 * r * Math.cos(a), y = 1.95 * r * Math.sin(a), c = Math.cos(0.1), s = Math.sin(0.1);
  return [c * x - s * y, s * x + c * y] as P2;
});
/** Limits for dragging: inside the plate's bounding box. */
export const E_LIM = { x: 3.3, y: 1.75, F: 3.5, v: 2.8, w: 2 };

const clampX = (x: number) => Math.max(E.XMIN, Math.min(E.XMAX, x));
const barX = (w: number) => clampX(E.X0 + E.KW * w);
const mag = (v: P2) => Math.hypot(v[0], v[1]);

/** Label position beyond the tip of an arrow a → b: a little further along it, `side` (−1, 0, 1) = shifted sideways. */
function beyond(a: P2, b: P2, side: number): P2 {
  const d: P2 = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1]) || 1, u: P2 = [d[0] / l, d[1] / l];
  return [b[0] + u[0] * 15 - u[1] * 11 * side, b[1] + u[1] * 13 + u[0] * 11 * side];
}

export function explorerScene(p: Plate, lang: Lang) {
  const sc = makeScene(EW, EH);
  const { S, arrow, spin, rect } = draw(sc);
  const de = lang === 'de';
  const n = plateNumbers(p);
  const f1 = (x: number) => num(x, 1, de);
  const B = ePx(p.B);

  S('plate', 'polygon', 'k7-body', E_PLATE.map(ePx));

  // forces, their points and the velocity of each point (thin)
  p.forces.forEach((f, i) => {
    const used = mag(f.F) > 0.04, A = ePx(f.A), tip = add2(A, dv(f.F, E.KF));
    if (!used) return;
    arrow('v' + (i + 1), 'k7-vt thin', A, add2(A, dv(n.v[i] as P2, E.KV)), 1, 6);
    arrow('F' + (i + 1), 'k7-force', A, tip, 1, 8);
    S('A' + (i + 1), 'circle', 'an-point', [A], 1, 3.8);
    sc.label('lab-F' + (i + 1), beyond(A, tip, 1), `\\v F_${i + 1}`, FORCE, 1, 'c');
  });

  // the package at B: v_B (rose), R (vermilion), ω and M_B as turning arrows
  const vtip = add2(B, dv(p.vB, E.KV)), Rtip = add2(B, dv(n.R, E.KF));
  arrow('vB', 'k7-vel', B, vtip, 1, 8);
  arrow('R', 'k7-force big', B, Rtip, 1, 9);
  // counter-clockwise (positive): ⊙ with a ccw arc; clockwise (negative): ⊗ with a cw arc
  const turn = (key: string, cls: string, r: number, val: number) => { if (Math.abs(val) >= 0.04) spin(key, cls, B, r, 1, val > 0); };
  turn('om', 'k7-om', 14, p.omega);
  turn('MB', 'k7-mom', 24, n.MB);
  S('B', 'circle', 'k7-bpoint', [B], 1, 5);
  sc.label('lab-B', add2(B, [6, -33]), 'B', 'point', 1, 'c');
  sc.label('lab-vB', beyond(B, vtip, 0), '\\v v_B', VEL, mag(p.vB) > 0.04 ? 1 : 0, 'c');
  sc.label('lab-R', beyond(B, Rtip, -1), '\\v R', FORCE, mag(n.R) > 0.04 ? 1 : 0, 'c');
  sc.label('lab-om', add2(B, [-31, -25]), '\\v\\omega', OMEGA, Math.abs(p.omega) >= 0.04 ? 1 : 0, 'c');
  sc.label('lab-MB', add2(B, [-37, 27]), '\\v M_B', FORCE, Math.abs(n.MB) >= 0.04 ? 1 : 0, 'c');

  // ---- the bars ----
  const rows = E.ROWS;
  S('zero', 'line', 'k7-axis', [[E.X0, 300], [E.X0, 448]]);
  const used = p.forces.map((f) => mag(f.F) > 0.04);
  const P = n.P;
  const shownP = roundToSum(P, 1);
  const total = n.total, shownT = roundToSum([n.translation, n.rotation], 1);
  const bar = (key: string, cls: string, y: number, from: number, to: number, label: string, ink: Ink, val: string) => {
    const x0 = barX(Math.min(from, to)), x1 = barX(Math.max(from, to));
    if (x1 - x0 >= 0.6) rect(key, cls, x0, y - 6, x1, y + 6, 1);
    sc.label('lab-' + key, [to >= from ? x1 + 4 : x0 - 4, y], val, ink, 1, to >= from ? 'l' : 'r');
    sc.label('row-' + key, [8, y], label, ink, 1, 'l');
  };
  let c = 0;
  P.forEach((v, i) => {
    const row = rows.A[i];
    if (used[i]) {
      bar('PA' + (i + 1), i % 2 ? 'k7-seg-p b' : 'k7-seg-p', row, c, c + v, `P_${i + 1}`, 'fg', f1(shownP[i]));
      c += v;
    } else {
      sc.label('row-PA' + (i + 1), [8, row], `P_${i + 1}`, 'muted', 1, 'l');
    }
  });
  bar('RV', 'k7-seg-t', rows.B[0], 0, n.translation, '\\v R\\cdot\\v v_B', VEL, f1(shownT[0]));
  bar('MW', 'k7-seg-r', rows.B[1], n.translation, n.translation + n.rotation, '\\v M_B\\cdot\\v\\omega', OMEGA, f1(shownT[1]));
  sc.label('head-A', [8, 288], String.raw`\sum_i \v F_i\cdot\v v_i\ \ \text{${de ? '(einzeln)' : '(one by one)'}}`, 'muted', 1, 'l');
  sc.label('head-B', [8, 388], String.raw`\v R\cdot\v v_B + \v M_B\cdot\v\omega\ \ \text{${de ? '(in ' : '(bundled in '}}B\text{${de ? ' gebündelt)' : ')'}}`, 'muted', 1, 'l');
  const xT = barX(total), ink: Ink = total >= 0 ? 'z' : 'y';
  S('total', 'line', total >= 0 ? 'k7-total pos' : 'k7-total neg', [[xT, 300], [xT, 448]]);
  sc.label('lab-total', [Math.max(70, Math.min(EW - 70, xT)), E.YT], String.raw`P = ${f1(roundToSum([total], 1)[0])}\,\text{W}`, ink, 1, 'c');
  return Object.assign(sc.finish({ total, translation: n.translation, rotation: n.rotation, sumP: n.sumP, mb: n.MB, rx: n.R[0], ry: n.R[1] }), { numbers: n });
}
