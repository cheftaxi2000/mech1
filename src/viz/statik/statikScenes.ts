/**
 * Pure scenes of chapter 6 «Statik» (HS 2018 notes, pp. 37–44). Every function maps parameters (and, for step
 * animations, (step, t, lang)) to a Scene: SVG shapes + KaTeX labels in viewBox units. Rendered by `SceneView`
 * (viz/force/K7Svg.tsx); frame tests in statikScenes.test.ts. Colours: forces vermilion, the second (equivalent) group
 * blue, velocities rose, ω̲ / moments / angles purple, axes and helper lines grey.
 */
import type { Lang } from '../../i18n';
import { cross, dot, norm, scale, sub, add, type Vec3 } from '../../physics/vec';
import { moment, resultant } from '../../physics/force';
import {
  FIG61, axisLeverArm, axisMoment, coupleMoment, cube39, cube43, disc623, groupMoment, groupPower, halfCircleSum, intersection2,
  linkage, parallelResultant, splitAxis, testMotion, type PointForce, type TestMotion,
} from '../../physics/statik';
import { camera, ease, seg, type P2 } from '../anim/geometry';
import type { Ink, Scene } from '../anim/scene';
import { makeScene } from '../force/K7Svg';
import { FORCE, OMEGA, VEL, appear, draw, num } from '../force/k7Draw';

const t = String.raw;
export const SW = 420, SH = 300;
const BLUE: Ink = 'x';
type SB = ReturnType<typeof makeScene>;
const kit = (W = SW, H = SH) => { const sb = makeScene(W, H); return { sb, ...draw(sb) }; };
const sgn = (x: number, de: boolean, d = 1) => (x > 0.0005 ? '+' : x < -0.0005 ? '-' : '') + num(Math.abs(x), d, de);

/** Signed power bars (P(G) red, P(G*) blue) on the right of a figure. */
function powerBars(sb: SB, S: ReturnType<typeof draw>['S'], x: number, y0: number, vals: { v: number; cls: string; tex: string; ink: Ink }[], k = 26) {
  S('pb-axis', 'line', 'k7-axis', [[x - 8, y0], [x + 30 * vals.length + 4, y0]]);
  vals.forEach((b, i) => {
    const xl = x + i * 30, h = -b.v * k;
    S(`pb${i}`, 'polygon', b.cls, [[xl, y0], [xl + 20, y0], [xl + 20, y0 + h], [xl, y0 + h]]);
    sb.label(`pbl${i}`, [xl + 10, y0 + (b.v >= 0 ? 14 : -14)], b.tex, b.ink, 1, 'c');
  });
}

/* ================================================================ p. 37: Wippe and Hebel (explorer) */

export interface SeesawPar { mode: 'wippe' | 'hebel'; FA: number; FB: number; a: number; b: number; alpha: number; tilt: number }
/** Beam through the pivot P; F_A at distance a on the left (down), F_B at distance b on the right (down); a small virtual rotation `tilt` (rad, ccw). */
export function seesawScene(p: SeesawPar, lang: Lang): Scene {
  const { sb, S, arrow, arc } = kit(SW, 260);
  const de = lang === 'de';
  const P: P2 = [190, 150], k = 52;
  const base = p.mode === 'wippe' ? 0 : -(Math.PI / 2 - p.alpha); // the lever is inclined; the forces stay vertical
  const dir = (ang: number): P2 => [Math.cos(ang), -Math.sin(ang)];
  const ang = base + p.tilt;
  const L: P2 = [P[0] - k * p.a * dir(ang)[0], P[1] - k * p.a * dir(ang)[1]];
  const Rp: P2 = [P[0] + k * p.b * dir(ang)[0], P[1] + k * p.b * dir(ang)[1]];
  // ghost of the beam before the virtual rotation
  if (Math.abs(p.tilt) > 1e-3) {
    const L0: P2 = [P[0] - k * p.a * dir(base)[0], P[1] - k * p.a * dir(base)[1]];
    const R0: P2 = [P[0] + k * p.b * dir(base)[0], P[1] + k * p.b * dir(base)[1]];
    S('ghost', 'line', 'k7-guide', [L0, R0]);
  }
  S('beam', 'line', 'st-beam', [L, Rp]);
  S('pivot', 'polygon', 'st-support', [[P[0], P[1]], [P[0] - 12, P[1] + 20], [P[0] + 12, P[1] + 20]]);
  S('pivotc', 'circle', 'st-pin', [P], 1, 4.5);
  const fs = 14;
  arrow('FA', 'k7-force', [L[0], L[1] - fs * p.FA], L, 1, 9);
  arrow('FB', 'k7-force', [Rp[0], Rp[1] - fs * p.FB], Rp, 1, 9);
  sb.label('lFA', [L[0] - 10, L[1] - fs * p.FA - 4], t`F_A`, FORCE, 1, 'r');
  sb.label('lFB', [Rp[0] + 10, Rp[1] - fs * p.FB - 4], t`F_B`, FORCE, 1, 'l');
  sb.label('la', [(L[0] + P[0]) / 2, (L[1] + P[1]) / 2 + 16], 'a', 'fg');
  sb.label('lb', [(Rp[0] + P[0]) / 2, (Rp[1] + P[1]) / 2 + 16], 'b', 'fg');
  arc('om', 'k7-om', P, 30, -0.9 * Math.PI, -0.35 * Math.PI, 1, 1);
  sb.label('lom', [P[0] + 6, P[1] + 40], t`\omega`, OMEGA, 1, 'l');
  if (p.mode === 'hebel') sb.label('lal', [P[0] - 26, P[1] + 30], t`\alpha`, OMEGA, 1, 'c');
  const s = p.mode === 'wippe' ? 1 : Math.sin(p.alpha);
  const PA = -p.FA * 1 * p.a * s, PB = p.FB * 1 * p.b * s;
  powerBars(sb, S, 316, 150, [
    { v: PA, cls: 'k7-seg-t', tex: t`P_A`, ink: VEL },
    { v: PB, cls: 'k7-seg-t', tex: t`P_B`, ink: VEL },
    { v: PA + PB, cls: Math.abs(PA + PB) < 1e-6 ? 'k7-seg-p' : 'k7-seg-r', tex: t`P`, ink: 'fg' },
  ], 10);
  sb.label('sum', [370, 20], t`P = ${sgn(PA + PB, de)}\,\omega`, 'fg', 1, 'c');
  return sb.finish({ PA, PB, P: PA + PB });
}

/* ================================================================ p. 37: Fig. 6.1 / 6.2 equivalence tester */

const beamPx = (x: number): P2 => [120 + 70 * x, 120];
/** Two beams: the group G (top, red) and G* (bottom, blue); the chosen test motion drawn as velocity arrows; power bars on the right. */
export function equivScene(fig: '61' | '62', motion: TestMotion | null, lang: Lang, labels = true): Scene {
  const { sb, S, arrow, spin } = kit();
  const de = lang === 'de';
  const G = fig === '61' ? FIG61.G : FIG61.G62, Gs = FIG61.Gstar;
  const rows: [PointForce[], number, string, Ink][] = [[G, 0, 'k7-force', FORCE], [Gs, 130, 'st-blue', BLUE]];
  rows.forEach(([g, dy, cls, ink], r) => {
    const px = (x: number): P2 => [beamPx(x)[0], beamPx(x)[1] - 40 + dy];
    S(`beam${r}`, 'line', 'st-beam', [px(-1.25), px(1.25)]);
    for (const x of [-1, 0, 1]) S(`pt${r}${x}`, 'circle', 'st-pt', [px(x)], 1, 3.6);
    g.forEach((f, i) => {
      const tip = px(f.A[0]);
      arrow(`f${r}${i}`, cls, [tip[0] - 40 * f.F[0], tip[1] + 40 * f.F[1] - 2], [tip[0], tip[1] - 3], 1, 9);
      if (labels) sb.label(`fl${r}${i}`, [tip[0] - 40 * f.F[0] + (f.F[0] ? 12 : 12), tip[1] + 40 * f.F[1] - 6], g.length === 1 ? (r === 1 ? t`\v R` : t`\v F`) : fig === '62' && i === 1 ? t`\v F_2^*` : t`\v F_${i + 1}`, ink, 1, 'l');
    });
    if (labels) {
      sb.label(`A1${r}`, [px(-1)[0], px(-1)[1] + 15], t`A_1`, 'muted');
      sb.label(`A${r}`, [px(0)[0], px(0)[1] + 15], 'A', 'muted');
      sb.label(`A2${r}`, [px(1)[0], px(1)[1] + 15], t`A_2`, 'muted');
      sb.label(`name${r}`, [16, px(0)[1] - 30], r === 0 ? t`\{G\}` : t`\{G^*\}`, ink, 1, 'l');
    }
    if (motion) {
      const m = testMotion(motion);
      for (const x of [-1, 0, 1]) {
        const v = add(m.vB, cross(m.omega, sub([x, 0, 0], m.B)));
        const o: P2 = [px(x)[0] + 9, px(x)[1] + 9];
        if (norm(v) > 1e-9) arrow(`v${r}${x}`, 'k7-vel', o, [o[0] + 30 * v[0], o[1] - 30 * v[1]], 0.85, 8);
      }
      if (motion === 'rotP' || motion === 'rotA') {
        const c = motion === 'rotP' ? px(FIG61.P[0]) : px(0);
        spin(`sp${r}`, 'k7-om', [c[0], c[1] + (motion === 'rotA' ? 30 : 0)], 9, 1, true);
        if (motion === 'rotP') { S(`P${r}`, 'circle', 'st-pt', [c], 1, 3.6); if (labels) sb.label(`Pl${r}`, [c[0] - 8, c[1] - 14], 'P', 'muted', 1, 'r'); }
      }
    }
  });
  let pG = 0, pS = 0;
  if (motion) {
    const m = testMotion(motion);
    pG = groupPower(G, m.B, m.vB, m.omega); pS = groupPower(Gs, m.B, m.vB, m.omega);
    powerBars(sb, S, 330, 150, [
      { v: pG, cls: 'st-bar-red', tex: t`P(G)`, ink: FORCE },
      { v: pS, cls: 'st-bar-blue', tex: t`P(G^*)`, ink: BLUE },
    ], 26);
    const same = Math.abs(pG - pS) < 1e-9;
    sb.label('verdict', [360, 26], same ? t`P(G) = P(G^*)` : t`P(G) \ne P(G^*)`, same ? 'z' : 'y', 1, 'c');
  }
  void de;
  return sb.finish({ pG, pS });
}

/* ================================================================ p. 37: proof of the theorem (step animation) */

export const PROOF_STEPS = 4;
/** 0 = two groups; 1 = a pure translation v̲: P = v̲·R̲ ⇒ R̲ = R̲*; 2 = a pure rotation about O: P = ω̲·M̲_O ⇒ M̲_O = M̲*_O; 3 = every motion is v̲ + ω̲: both conditions suffice. */
export function proofScene(step: number, tt: number, lang: Lang): Scene {
  const { sb, S, arrow, spin } = kit();
  const de = lang === 'de';
  const G: PointForce[] = [{ A: [-1, 0, 0], F: [0.4, -1, 0] }, { A: [1, 0, 0], F: [-0.2, -1.2, 0] }];
  const R = resultant(G), MO = groupMoment([0, 0, 0], G);
  const Gs: PointForce[] = [{ A: [0, 0, 0], F: R }];
  const coupleK = MO[2]; // G* = R̲ at O plus a couple with the same moment
  const pr = (i: number) => appear(step, i, tt, 0, 0.7);
  const rows: [number, string, Ink][] = [[0, 'k7-force', FORCE], [130, 'st-blue', BLUE]];
  rows.forEach(([dy, cls, ink], r) => {
    const px = (x: number): P2 => [150 + 70 * x, 80 + dy];
    S(`beam${r}`, 'line', 'st-beam', [px(-1.3), px(1.3)]);
    S(`O${r}`, 'circle', 'st-pt', [px(0)], 1, 3.6);
    sb.label(`Ol${r}`, [px(0)[0] + 2, px(0)[1] + 15], 'O', 'muted', 1, 'c');
    const g = r === 0 ? G : Gs;
    g.forEach((f, i) => { const tip = px(f.A[0]); arrow(`f${r}${i}`, cls, [tip[0] - 40 * f.F[0], tip[1] + 40 * f.F[1]], [tip[0], tip[1] - 3], 1, 9); });
    if (r === 1) spin('cpl', 'st-blue-mom', px(0.75), 13, 1, coupleK > 0);
    sb.label(`name${r}`, [14, px(0)[1] - 36], r === 0 ? t`\{G\}` : t`\{G^*\}`, ink, 1, 'l');
    // the test motion
    if (step === 1) for (const x of [-1, 0, 1]) arrow(`v${r}${x}`, 'k7-vel', [px(x)[0], px(x)[1] + 14], [px(x)[0] + 34, px(x)[1] + 14], pr(1), 8);
    if (step === 2) { spin(`om${r}`, 'k7-om', [px(0)[0], px(0)[1] + 34], 9, pr(2), true); for (const x of [-1, 1]) arrow(`vr${r}${x}`, 'k7-vel', px(x), [px(x)[0], px(x)[1] - 34 * x], pr(2), 8); }
  });
  const lines = [
    de ? t`\text{Gleiche Leistung für jede Starrkörperbewegung?}` : t`\text{Same power for every rigid-body motion?}`,
    t`\v\omega = 0:\ P(G) - P(G^*) = \v v_O\cdot(\v R - \v R^*) = 0 \ \Rightarrow\ \v R = \v R^*`,
    t`\v v_O = 0:\ P(G) - P(G^*) = \v\omega\cdot(\v M_O - \v M_O^*) = 0 \ \Rightarrow\ \v M_O = \v M_O^*`,
    t`\v R = \v R^*,\ \v M_O = \v M_O^* \ \Leftrightarrow\ P(G) = P(G^*)`,
  ];
  sb.label('line', [SW / 2, SH - 18], lines[Math.min(step, 3)], step === 3 ? 'z' : 'fg', 1, 'c');
  return sb.finish({ step, R: R[1], M: MO[2] });
}

/* ================================================================ p. 38: Fig. 6.3 force polygon (explorer) */

export interface Pf { A: P2; F: P2 }
/** Body with forces at A_i (left); tip-to-tail polygon and R̲ (right, starting anywhere: free vector). */
export function polygonScene(fs: Pf[], lang: Lang): Scene {
  const { sb, S, arrow } = kit();
  void lang;
  const body: P2[] = [[40, 110], [100, 60], [170, 95], [190, 170], [120, 215], [55, 190]];
  S('body', 'polygon', 'k7-body', body);
  const k = 32;
  fs.forEach((f, i) => {
    S(`A${i}`, 'circle', 'st-pt', [f.A], 1, 3.6);
    arrow(`F${i}`, 'k7-force', f.A, [f.A[0] + k * f.F[0], f.A[1] - k * f.F[1]], 1, 9);
    sb.label(`Fl${i}`, [f.A[0] + k * f.F[0] + 10, f.A[1] - k * f.F[1]], t`\v F_${i + 1}`, FORCE, 1, 'l');
    sb.label(`Al${i}`, [f.A[0] - 8, f.A[1] + 12], t`A_${i + 1}`, 'muted', 1, 'r');
  });
  // polygon
  let cur: P2 = [290, 150];
  const start = cur;
  fs.forEach((f, i) => {
    const nxt: P2 = [cur[0] + k * f.F[0], cur[1] - k * f.F[1]];
    arrow(`P${i}`, 'k7-force ghost', cur, nxt, 1, 8);
    sb.label(`Pl${i}`, [(cur[0] + nxt[0]) / 2 + 8, (cur[1] + nxt[1]) / 2 - 8], t`\v F_${i + 1}`, FORCE, 0.8, 'l');
    cur = nxt;
  });
  const R = fs.reduce<P2>((s, f) => [s[0] + f.F[0], s[1] + f.F[1]], [0, 0]);
  arrow('R', 'st-res', start, cur, 1, 10);
  sb.label('Rl', [(start[0] + cur[0]) / 2 - 12, (start[1] + cur[1]) / 2 + 12], t`\v R`, 'fg', 1, 'r');
  return sb.finish({ Rx: R[0], Ry: R[1] });
}

/* ================================================================ p. 38: half circle with line load */

const HC = { cx: 200, cy: 200, r: 130 };
/** Explorer: n elements dF̲ (pointing to M) and their sum, drawn tip to tail from M. */
export function halfCircleScene(n: number, lang: Lang): Scene {
  const { sb, S, arrow } = kit(SW, 320);
  const de = lang === 'de';
  const q = 1, r = 1;
  const arcPts: P2[] = Array.from({ length: 61 }, (_, i) => { const a = (Math.PI * i) / 60; return [HC.cx + HC.r * Math.cos(a), HC.cy - HC.r * Math.sin(a)]; });
  S('arc', 'polyline', 'st-beam', arcPts);
  S('base', 'line', 'k7-axis', [[HC.cx - HC.r - 20, HC.cy], [HC.cx + HC.r + 20, HC.cy]]);
  S('M', 'circle', 'st-pin', [[HC.cx, HC.cy]], 1, 4);
  sb.label('Ml', [HC.cx + 6, HC.cy + 14], 'M', 'muted', 1, 'l');
  const len = Math.min(40, 260 / n);
  for (let k = 0; k < n; k++) {
    const phi = ((k + 0.5) * Math.PI) / n;
    const p: P2 = [HC.cx + HC.r * Math.cos(phi), HC.cy - HC.r * Math.sin(phi)];
    arrow(`d${k}`, 'k7-force thin', [p[0] + len * Math.cos(phi), p[1] - len * Math.sin(phi)], p, n > 40 ? 0.5 : 0.9, n > 30 ? 5 : 7);
  }
  const R = halfCircleSum(q, r, n);
  const sc = 38;
  arrow('R', 'st-res', [HC.cx, HC.cy - 6], [HC.cx + sc * R[0], HC.cy - 6 - sc * R[1]], 1, 10);
  sb.label('Rl', [HC.cx + 10, HC.cy + 40], t`\v R`, 'fg', 1, 'l');
  sb.label('val', [SW / 2, 304], t`n = ${n}:\ R_x = ${num(R[0], 3, de)}\,qr,\ R_y = ${num(R[1], 3, de)}\,qr`, 'fg', 1, 'c');
  return sb.finish({ n, Rx: R[0], Ry: R[1] });
}

export const HCA_STEPS = 5;
/** Animation: 0 load; 1 one element dF̲ with its components; 2 the x-components cancel in pairs; 3 the y-components add up; 4 R̲ = −2qr e̲_y as a free vector. */
export function halfCircleAnim(step: number, tt: number, lang: Lang): Scene {
  const { sb, S, arrow } = kit(SW, 320);
  void lang;
  const arcPts: P2[] = Array.from({ length: 61 }, (_, i) => { const a = (Math.PI * i) / 60; return [HC.cx + HC.r * Math.cos(a), HC.cy - HC.r * Math.sin(a)]; });
  S('arc', 'polyline', 'st-beam', arcPts);
  S('base', 'line', 'k7-axis', [[HC.cx - HC.r - 20, HC.cy], [HC.cx + HC.r + 20, HC.cy]]);
  S('M', 'circle', 'st-pin', [[HC.cx, HC.cy]], 1, 4);
  sb.label('Ml', [HC.cx + 6, HC.cy + 14], 'M', 'muted', 1, 'l');
  sb.label('x', [HC.cx + HC.r + 22, HC.cy - 10], 'x', 'muted', 1, 'c');
  const N = 12, len = 30;
  const loadO = step === 0 ? 1 : 0.35;
  for (let k = 0; k < N; k++) {
    const phi = ((k + 0.5) * Math.PI) / N;
    const p: P2 = [HC.cx + HC.r * Math.cos(phi), HC.cy - HC.r * Math.sin(phi)];
    arrow(`d${k}`, 'k7-force thin', [p[0] + len * Math.cos(phi), p[1] - len * Math.sin(phi)], p, loadO, 7);
  }
  sb.label('q', [HC.cx - HC.r - 30, HC.cy - 70], t`q`, FORCE, step === 0 ? 1 : 0.4, 'c');
  // one element at φ = 50°
  const ph = (50 * Math.PI) / 180, P: P2 = [HC.cx + HC.r * Math.cos(ph), HC.cy - HC.r * Math.sin(ph)];
  const o1 = appear(step, 1, tt, 0, 0.6) * (step >= 2 ? 0.3 : 1);
  const L = 70, start: P2 = [P[0] + L * Math.cos(ph), P[1] - L * Math.sin(ph)];
  arrow('dF', 'k7-force', start, P, o1, 10);
  const oL = step >= 2 ? 0 : o1;
  sb.label('dFl', [start[0] + 8, start[1] - 4], t`d\v F`, FORCE, oL, 'l');
  arrow('dFx', 'st-comp-x', start, [P[0], start[1]], o1, 8);
  arrow('dFy', 'st-comp-y', [P[0], start[1]], P, o1, 8);
  sb.label('dFxl', [(start[0] + P[0]) / 2, start[1] - 12], t`dF\cos\varphi`, 'x', oL, 'c');
  sb.label('dFyl', [P[0] - 8, (start[1] + P[1]) / 2], t`dF\sin\varphi`, 'y', oL, 'r');
  S('phiArc', 'polyline', 'k7-om', Array.from({ length: 16 }, (_, i) => { const a = (ph * i) / 15; return [HC.cx + 34 * Math.cos(a), HC.cy - 34 * Math.sin(a)] as P2; }), o1);
  sb.label('phil', [HC.cx + 46, HC.cy - 14], t`\varphi`, OMEGA, oL, 'c');
  // x-components cancel in mirrored pairs
  const o2 = appear(step, 2, tt, 0, 0.6) * (step >= 3 ? 0.35 : 1);
  for (const deg of [20, 50, 80]) {
    const a = (deg * Math.PI) / 180;
    for (const side of [1, -1]) {
      const y = HC.cy - HC.r * Math.sin(a) - 4, x = HC.cx + side * HC.r * Math.cos(a);
      arrow(`cx${deg}${side}`, 'st-comp-x', [x + side * 34 * Math.cos(a), y], [x, y], o2, 7);
    }
  }
  sb.label('cancel', [SW / 2, 24], t`R_x = \int_0^\pi -q r\cos\varphi\,d\varphi = 0`, 'x', o2 > 0.3 ? 1 : o2, 'c');
  // y-components add up
  const o3 = appear(step, 3, tt, 0, 0.6);
  const ys = [20, 50, 80, 100, 130, 160];
  let yy = 82;
  ys.forEach((deg, i) => {
    const a = (deg * Math.PI) / 180, l = 18 * Math.sin(a);
    arrow(`st${i}`, 'st-comp-y', [384, yy], [384, yy + l], o3, 6);
    yy += l;
  });
  sb.label('addy', [SW / 2, 50], t`R_y = \int_0^\pi -q r\sin\varphi\,d\varphi = q r\cos\varphi\Big|_0^\pi = -2qr`, 'y', o3, 'c');
  const o4 = appear(step, 4, tt, 0, 0.6);
  arrow('R', 'st-res', [HC.cx, HC.cy - 90], [HC.cx, HC.cy - 90 + 76], o4, 11);
  sb.label('Rl', [HC.cx + 12, HC.cy - 54], t`\v R = -2qr\,\v e_y`, 'fg', o4, 'l');
  return sb.finish({ step });
}

/* ================================================================ p. 39: moment about a point, Verschiebungssatz (explorer) */

/** O, the line of action W through A with direction F̲; A slides by s along W. Shows OA̲, the lever arm a and |M̲_O| = |F̲| a. */
export function momentPointScene(O: P2, s: number, lang: Lang): Scene {
  const { sb, S, arrow, spin } = kit();
  const de = lang === 'de';
  const k = 50, A0: P2 = [3.1, 2.2], F: P2 = [-0.55, 1.05]; // metres, N
  const px = (p: P2): P2 => [40 + k * p[0], 260 - k * p[1]];
  const A: P2 = [A0[0] + s * F[0], A0[1] + s * F[1]];
  const Op: P2 = O;
  // line of action
  const far = (u: number): P2 => px([A0[0] + u * F[0], A0[1] + u * F[1]]);
  S('W', 'line', 'st-line', [far(-2.8), far(2.8)]);
  sb.label('Wl', [far(2.5)[0] + 10, far(2.5)[1]], 'W', FORCE, 0.9, 'l');
  // foot of the perpendicular from O
  const fl = Math.hypot(F[0], F[1]), u: P2 = [F[0] / fl, F[1] / fl];
  const OA: P2 = [A[0] - Op[0], A[1] - Op[1]];
  const along = OA[0] * u[0] + OA[1] * u[1];
  const foot: P2 = [A[0] - along * u[0], A[1] - along * u[1]];
  const a = Math.abs(OA[0] * u[1] - OA[1] * u[0]);
  S('lever', 'line', 'st-lever', [px(Op), px(foot)]);
  sb.label('al', [(px(Op)[0] + px(foot)[0]) / 2 + 4, (px(Op)[1] + px(foot)[1]) / 2 + 12], 'a', 'z', 1, 'c');
  arrow('OA', 'st-r', px(Op), px(A), 1, 8);
  sb.label('OAl', [(px(Op)[0] + px(A)[0]) / 2 - 12, (px(Op)[1] + px(A)[1]) / 2 - 6], t`\v{OA}`, 'fg', 1, 'r');
  arrow('F', 'k7-force', px(A), px([A[0] + F[0], A[1] + F[1]]), 1, 10);
  sb.label('Fl', [px([A[0] + F[0], A[1] + F[1]])[0] + 10, px([A[0] + F[0], A[1] + F[1]])[1]], t`\v F`, FORCE, 1, 'l');
  S('Ap', 'circle', 'st-pt', [px(A)], 1, 4);
  sb.label('Al', [px(A)[0] + 10, px(A)[1] + 12], 'A', 'muted', 1, 'l');
  S('Op', 'circle', 'st-pin', [px(Op)], 1, 4.5);
  sb.label('Ol', [px(Op)[0] - 8, px(Op)[1] + 12], 'O', 'muted', 1, 'r');
  const Mz = OA[0] * F[1] - OA[1] * F[0];
  spin('M', 'k7-om', [px(Op)[0], px(Op)[1]], 16, 1, Mz > 0);
  sb.label('Mv', [SW - 14, 20], t`|\v M_O| = |\v F|\,a = ${num(fl, 2, de)}\cdot ${num(a, 2, de)} = ${num(Math.abs(Mz), 2, de)}`, 'fg', 1, 'tr');
  return sb.finish({ Mz, a, ax: A[0], ay: A[1] });
}

/* ================================================================ oblique 3D helpers */

export interface View3 { alpha: number; beta: number; cx: number; cy: number; s: number }
export const CUBE_VIEW: View3 = { alpha: -1.15, beta: 0.38, cx: 120, cy: 230, s: 70 };
export function proj(p: Vec3, v: View3): P2 {
  const c = camera(v.alpha, v.beta);
  return [v.cx + v.s * dot(p, c.R), v.cy - v.s * dot(p, c.U)];
}
function cubeEdges(S: ReturnType<typeof draw>['S'], L: number, v: View3, o = 1) {
  const V: Vec3[] = [[0, 0, 0], [L, 0, 0], [L, L, 0], [0, L, 0], [0, 0, L], [L, 0, L], [L, L, L], [0, L, L]];
  const E: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  E.forEach(([a, b], i) => S(`ce${i}`, 'line', a === 3 || b === 3 ? 'k7-guide' : 'st-edge', [proj(V[a], v), proj(V[b], v)], o));
}
function axes3(sb: SB, S: ReturnType<typeof draw>['S'], arrow: ReturnType<typeof draw>['arrow'], v: View3, len = 2.6) {
  const O = proj([0, 0, 0], v);
  (['x', 'y', 'z'] as const).forEach((n, i) => {
    const e: Vec3 = [i === 0 ? len : 0, i === 1 ? len : 0, i === 2 ? len : 0];
    arrow(`ax${n}`, 'st-axis3', O, proj(e, v), 0.8, 7);
    const p = proj(scale(1.07, e), v);
    sb.label(`axl${n}`, p, n, 'muted', 0.9, 'c');
  });
  void S;
}

/* ================================================================ p. 39: cube example (step animation) */

export const CUBE39_STEPS = 3;
/** 0 = F̲ at A; 1 = M̲_O = OA̲ × F̲; 2 = with OB̲ (B on the same line of action): the same M̲_O = (0, 0, LF). */
export function cube39Scene(step: number, tt: number, lang: Lang): Scene {
  const { sb, S, arrow } = kit();
  void lang;
  const L = 1.6, v: View3 = { ...CUBE_VIEW, cx: 110, cy: 240, s: 76 };
  const c = cube39(L, 1);
  cubeEdges(S, L, v);
  axes3(sb, S, arrow, v, 2.4);
  const P = (p: Vec3) => proj(p, v);
  arrow('F', 'k7-force', P(c.A), P(add(c.A, [0, 0.9, 0])), 1, 10);
  sb.label('Fl', [P(add(c.A, [0, 0.9, 0]))[0] + 10, P(add(c.A, [0, 0.9, 0]))[1]], t`\v F`, FORCE, 1, 'l');
  S('W', 'line', 'st-line', [P([L, -0.3, 0]), P([L, L + 1.2, 0])], 0.8);
  S('Ap', 'circle', 'st-pt', [P(c.A)], 1, 4); sb.label('Al', [P(c.A)[0] + 10, P(c.A)[1] + 10], 'A', 'muted', 1, 'l');
  S('Bp', 'circle', 'st-pt', [P(c.B)], 1, 4); sb.label('Bl', [P(c.B)[0] + 2, P(c.B)[1] + 16], 'B', 'muted', 1, 'c');
  sb.label('Ol', [P([0, 0, 0])[0] - 10, P([0, 0, 0])[1] + 12], 'O', 'muted', 1, 'r');
  const o1 = appear(step, 1, tt, 0, 0.6), o2 = appear(step, 2, tt, 0, 0.6);
  arrow('OA', 'st-r', P([0, 0, 0]), P(c.A), o1 * (step >= 2 ? 0.4 : 1), 8);
  sb.label('OAl', [(P([0, 0, 0])[0] + P(c.A)[0]) / 2 - 4, (P([0, 0, 0])[1] + P(c.A)[1]) / 2 - 10], t`\v{OA}`, 'fg', o1 * (step >= 2 ? 0.4 : 1), 'c');
  arrow('OB', 'st-r', P([0, 0, 0]), P(c.B), o2, 8);
  sb.label('OBl', [(P([0, 0, 0])[0] + P(c.B)[0]) / 2, (P([0, 0, 0])[1] + P(c.B)[1]) / 2 + 14], t`\v{OB}`, 'fg', o2, 'c');
  const om = Math.max(o1, o2);
  arrow('M', 'st-mom', P([0, 0, 0]), P([0, 0, 1.25]), om, 10);
  sb.label('Ml', [P([0, 0, 1.25])[0] - 10, P([0, 0, 1.25])[1]], t`\v M_O`, OMEGA, om, 'r');
  const tex = step === 0 ? t`\v F = (0, F, 0)^\mathsf{T}\ \text{in } A,\quad \v M_O = \,?` : step === 1
    ? t`\v M_O = \v{OA}\times\v F = (0, 0, LF)^\mathsf{T}`
    : t`\v M_O = \v{OB}\times\v F = (0, 0, LF)^\mathsf{T}`;
  sb.label('eq', [SW / 2, 22], tex, 'fg', 1, 'c');
  return sb.finish({ step, Mz: cross(c.A, c.F)[2] });
}

/* ================================================================ p. 39–40: moment about an axis (explorer + proof animation) */

export interface AxisPar { A: Vec3; F: Vec3; zB: number }
const AXV: View3 = { alpha: -1.0, beta: 0.32, cx: 150, cy: 210, s: 62 };
/** Axis γ = z-axis; B = (0, 0, zB) on it; force F̲ at A. Layers: 'base' always; 'split' F̲_γ, F̲^⊥; 'lever' a; 'proof' B′ and B′B. */
export function axisScene(p: AxisPar, layers: { split?: number; lever?: number; proof?: number }, lang: Lang): Scene {
  const { sb, S, arrow } = kit();
  const de = lang === 'de';
  const P = (q: Vec3) => proj(q, AXV);
  const e: Vec3 = [0, 0, 1], B: Vec3 = [0, 0, p.zB];
  // plane E⊥ through A (a parallelogram)
  const h = p.A[2], sz = 2.4;
  S('plane', 'polygon', 'st-plane', [P([-1.2, -1.2, h]), P([sz, -1.2, h]), P([sz, sz, h]), P([-1.2, sz, h])], 0.9);
  sb.label('El', P([sz - 0.2, -1.0, h]), t`E^\perp`, 'muted', 0.9, 'c');
  S('axis', 'line', 'st-axisg', [P([0, 0, -1.4]), P([0, 0, 2.8])]);
  arrow('eg', 'st-axisg-arrow', P([0, 0, 2.2]), P([0, 0, 2.8]), 1, 9);
  sb.label('gl', [P([0, 0, 2.8])[0] - 12, P([0, 0, 2.8])[1]], t`\gamma`, OMEGA, 1, 'r');
  S('Bp', 'circle', 'st-pt', [P(B)], 1, 4);
  sb.label('Bl', [P(B)[0] - 10, P(B)[1]], 'B', 'muted', 1, 'r');
  S('Ap', 'circle', 'st-pt', [P(p.A)], 1, 4);
  sb.label('Al', [P(p.A)[0] + 4, P(p.A)[1] + 14], 'A', 'muted', 1, 'l');
  const fs = 0.55;
  arrow('F', 'k7-force', P(p.A), P(add(p.A, scale(fs, p.F))), 1, 10);
  sb.label('Fl', [P(add(p.A, scale(fs, p.F)))[0] + 10, P(add(p.A, scale(fs, p.F)))[1]], t`\v F`, FORCE, 1, 'l');
  const { Fg, Fperp } = splitAxis(e, p.F);
  const os = layers.split ?? 0;
  arrow('Fg', 'st-comp-y', P(p.A), P(add(p.A, scale(fs, Fg))), os, 8);
  sb.label('Fgl', [P(add(p.A, scale(fs, Fg)))[0] - 8, P(add(p.A, scale(fs, Fg)))[1]], t`\v F_\gamma`, 'y', os, 'r');
  arrow('Fp', 'st-comp-x', P(p.A), P(add(p.A, scale(fs, Fperp))), os, 8);
  sb.label('Fpl', [P(add(p.A, scale(fs, Fperp)))[0] + 8, P(add(p.A, scale(fs, Fperp)))[1] + 12], t`\v F^\perp`, 'x', os, 'l');
  // lever arm: from the axis point B′ = (0, 0, h) perpendicular to the line A + u F⊥
  const Bp: Vec3 = [0, 0, h];
  const ol = layers.lever ?? 0;
  const a = axisLeverArm(e, B, p.A, p.F);
  if (norm(Fperp) > 1e-9) {
    const u = scale(1 / norm(Fperp), Fperp);
    const BA = sub(p.A, Bp), foot = sub(p.A, scale(dot(BA, u), u));
    S('lineFp', 'line', 'st-line', [P(add(foot, scale(-1, u))), P(add(foot, scale(2.2, u)))], ol * 0.8);
    S('lev', 'line', 'st-lever', [P(Bp), P(foot)], ol);
    sb.label('levl', [(P(Bp)[0] + P(foot)[0]) / 2, (P(Bp)[1] + P(foot)[1]) / 2 - 10], 'a', 'z', ol, 'c');
  }
  const op = layers.proof ?? 0;
  S('Bpp', 'circle', 'st-pt', [P(Bp)], Math.max(op, ol), 3.6);
  sb.label('Bppl', [P(Bp)[0] - 10, P(Bp)[1] - 2], t`B'`, 'muted', Math.max(op, ol), 'r');
  arrow('ABp', 'st-r', P(p.A), P(Bp), op, 8);
  arrow('BpB', 'st-comp-y', P(Bp), P(B), op * (Math.abs(h - p.zB) > 0.05 ? 1 : 0), 8);
  const Mg = axisMoment(e, B, p.A, p.F);
  sb.label('val', [SW - 12, 18], t`M_\gamma = \v e_\gamma\cdot\v M_B = ${num(Mg, 2, de)}`, 'fg', 1, 'tr');
  if (ol > 0.5) sb.label('val2', [SW - 12, 44], t`|\v F^\perp|\,a = ${num(norm(Fperp), 2, de)}\cdot ${num(a, 2, de)} = ${num(norm(Fperp) * a, 2, de)}`, 'z', ol, 'tr');
  return sb.finish({ Mg, a, Fperp: norm(Fperp) });
}
export const AXIS_STEPS = 5;
export const AXIS_PROOF: AxisPar = { A: [1.6, 0.6, 0.9], F: [-1.6, 0.9, 1.4], zB: -0.6 };
/** 0 = force and axis; 1 = B′: AB̲ = AB̲′ + B′B̲; 2 = the term e̲_γ·(F̲ × B′B̲) vanishes (B′B̲ ∥ e̲_γ); 3 = F̲ = F̲_γ + F̲^⊥, the F̲_γ term vanishes; 4 = M_γ = |F̲^⊥| a. */
export function axisProofScene(step: number, tt: number, lang: Lang): Scene {
  const p = (i: number) => appear(step, i, tt, 0, 0.6);
  const base = axisScene(AXIS_PROOF, { proof: step >= 1 && step <= 2 ? p(1) : step > 2 ? 0.25 : 0, split: p(3), lever: p(4) }, lang);
  const lines = [
    t`M_\gamma := \v e_\gamma\cdot\v M_B = \v e_\gamma\cdot(\v F\times\v{AB})`,
    t`\v{AB} = \v{AB'} + \v{B'B}`,
    t`\v e_\gamma\cdot(\v F\times\v{B'B}) = 0\quad(\v{B'B}\parallel\v e_\gamma)`,
    t`\v F = \v F_\gamma + \v F^\perp:\ \ (\v F_\gamma\times\v{AB'})\cdot\v e_\gamma = 0`,
    t`M_\gamma = (\v F^\perp\times\v{AB'})\cdot\v e_\gamma,\quad |M_\gamma| = |\v F^\perp|\,a`,
  ];
  base.labels.push({ key: 'line', at: [SW / 2, SH - 16], tex: lines[Math.min(step, 4)], ink: 'fg', anchor: 'c', o: 1 });
  base.data.step = step;
  return base;
}

/* ================================================================ p. 40: moment of a group about P (explorer + derivation) */

export const GROUP: PointForce[] = [{ A: [1.2, 2.6, 0], F: [1, 0.6, 0] }, { A: [3.4, 3, 0], F: [0.2, -1.2, 0] }, { A: [2.6, 1, 0], F: [-0.7, -0.5, 0] }];
const gpx = (p: Vec3 | P2): P2 => [40 + 60 * p[0], 270 - 60 * p[1]];
/** Forces of GROUP, O fixed at (0.4, 0.6), P movable; layers: direct moments about P, the vectors PO̲ and OA̲_i, R̲ at O. */
export function groupMomentScene(Pp: P2, layers: { tri?: number; R?: number; direct?: number }, lang: Lang): Scene {
  const { sb, S, arrow, spin } = kit();
  const de = lang === 'de';
  const O: Vec3 = [0.6, 1.7, 0], P: Vec3 = [Pp[0], Pp[1], 0];
  GROUP.forEach((f, i) => {
    S(`A${i}`, 'circle', 'st-pt', [gpx(f.A)], 1, 3.6);
    arrow(`F${i}`, 'k7-force', gpx(f.A), gpx(add(f.A, f.F)), 1, 9);
    const tip = gpx(add(f.A, f.F)), ln = Math.hypot(f.F[0], f.F[1]);
    sb.label(`Fl${i}`, [tip[0] + (16 * f.F[0]) / ln, tip[1] - (16 * f.F[1]) / ln], t`\v F_${i + 1}`, FORCE, 1, 'c');
    sb.label(`Al${i}`, [gpx(f.A)[0] - 6, gpx(f.A)[1] + 12], t`A_${i + 1}`, 'muted', 1, 'r');
  });
  const ot = layers.tri ?? 0, oR = layers.R ?? 0, od = layers.direct ?? 0;
  GROUP.forEach((f, i) => arrow(`PA${i}`, 'st-r thin', gpx(P), gpx(f.A), od, 7));
  arrow('PO', 'st-r', gpx(P), gpx(O), ot, 8);
  sb.label('POl', [(gpx(P)[0] + gpx(O)[0]) / 2 - 10, (gpx(P)[1] + gpx(O)[1]) / 2 + 4], t`\v{PO}`, 'fg', ot, 'r');
  GROUP.forEach((f, i) => arrow(`OA${i}`, 'st-r thin', gpx(O), gpx(f.A), ot * 0.7, 7));
  const R = resultant(GROUP);
  arrow('R', 'st-res', gpx(O), gpx(add(O, R)), oR, 10);
  sb.label('Rl', [gpx(add(O, R))[0] + 8, gpx(add(O, R))[1] + 10], t`\v R`, 'fg', oR, 'l');
  S('O', 'circle', 'st-pin', [gpx(O)], 1, 4.5); sb.label('Ol', [gpx(O)[0] - 8, gpx(O)[1] + 12], 'O', 'muted', 1, 'r');
  S('P', 'circle', 'k7-bpoint', [gpx(P)], 1, 6); sb.label('Pl', [gpx(P)[0] + 10, gpx(P)[1] + 12], 'P', 'point', 1, 'l');
  const MO = groupMoment(O, GROUP)[2], MP = groupMoment(P, GROUP)[2];
  spin('MP', 'k7-om', gpx(P), 15, 1, MP > 0);
  const shift = cross(R, sub(P, O))[2];
  sb.label('v1', [SW - 10, 18], t`M_O = ${num(MO, 2, de)}`, 'fg', 1, 'tr');
  sb.label('v2', [SW - 10, 42], t`(\v R\times\v{OP})_z = ${num(shift, 2, de)}`, 'fg', 1, 'tr');
  sb.label('v3', [SW - 10, 66], t`M_P = ${num(MP, 2, de)}`, OMEGA, 1, 'tr');
  return sb.finish({ MO, MP, shift });
}
export const GM_STEPS = 4;
export const GM_P: P2 = [4.6, 0.7];
/** 0 = M̲_P = Σ PA̲_i × F̲_i; 1 = PA̲_i = PO̲ + OA̲_i; 2 = Σ PO̲ × F̲_i = PO̲ × R̲ (R̲ drawn at O); 3 = M̲_P = M̲_O + R̲ × OP̲. */
export function groupMomentAnim(step: number, tt: number, lang: Lang): Scene {
  const a = (i: number) => appear(step, i, tt, 0, 0.6);
  const s = groupMomentScene(GM_P, { direct: step === 0 ? 1 : 0.25, tri: a(1), R: a(2) }, lang);
  const lines = [
    t`\v M_P = \textstyle\sum_i \v{PA}_i\times\v F_i`,
    t`\v{PA}_i = \v{PO} + \v{OA}_i`,
    t`\textstyle\sum_i(\v{PO} + \v{OA}_i)\times\v F_i = \v{PO}\times\v R + \v M_O`,
    t`\v M_P = \v M_O + \v{PO}\times\v R = \v M_O + \v R\times\v{OP}`,
  ];
  s.labels.push({ key: 'line', at: [SW / 2 - 40, SH - 14], tex: lines[Math.min(step, 3)], ink: step === 3 ? 'z' : 'fg', anchor: 'c', o: 1 });
  s.data.step = step;
  return s;
}

/* ================================================================ p. 41: Fig. 6.8 single forces (explorer) */

/** F̲ at A fixed; the same F̲ at a movable A′: equivalent only if A′ lies on the line of action. */
export function singleForceScene(A2: P2, lang: Lang): Scene {
  const { sb, S, arrow } = kit();
  void lang;
  const A: P2 = [1.6, 2.0], F: P2 = [1.2, 0.5];
  const px = (p: P2): P2 => [40 + 60 * p[0], 270 - 60 * p[1]];
  const far = (u: number): P2 => px([A[0] + u * F[0], A[1] + u * F[1]]);
  S('W', 'line', 'st-line', [far(-1.4), far(3.3)]);
  arrow('F', 'k7-force', px(A), px([A[0] + F[0], A[1] + F[1]]), 1, 10);
  S('A', 'circle', 'st-pt', [px(A)], 1, 4); sb.label('Al', [px(A)[0] - 8, px(A)[1] + 10], 'A', 'muted', 1, 'r');
  sb.label('Fl', [px([A[0] + F[0], A[1] + F[1]])[0], px([A[0] + F[0], A[1] + F[1]])[1] - 14], t`\v F`, FORCE, 1, 'c');
  const off = (A2[0] - A[0]) * F[1] - (A2[1] - A[1]) * F[0];
  const onLine = Math.abs(off) / Math.hypot(F[0], F[1]) < 0.06;
  arrow('F2', onLine ? 'st-blue' : 'st-blue ghost', px(A2), px([A2[0] + F[0], A2[1] + F[1]]), 1, 10);
  S('A2', 'circle', 'k7-bpoint', [px(A2)], 1, 6);
  sb.label('A2l', [px(A2)[0] - 8, px(A2)[1] + 12], t`A'`, BLUE, 1, 'r');
  sb.label('F2l', [px([A2[0] + F[0], A2[1] + F[1]])[0] + 8, px([A2[0] + F[0], A2[1] + F[1]])[1] + 10], t`\v F'`, BLUE, 1, 'l');
  const dM = -off; // moment difference about O = 0 is (A′ − A) × F
  sb.label('verdict', [SW - 10, 18], onLine ? t`\v M_O = \v M'_O\ \Rightarrow\ \text{äquivalent}` : t`\v M_O - \v M'_O = \v{A'A}\times\v F \ne 0`, onLine ? 'z' : 'y', 1, 'tr');
  return sb.finish({ on: onLine ? 1 : 0, dM });
}

/* ================================================================ p. 41: Fig. 6.9 linkage (explorer) */

export function linkageScene(theta: number, lang: Lang): Scene {
  const { sb, S, arrow } = kit();
  const de = lang === 'de';
  const L = linkage(theta, 1);
  const px = (p: Vec3): P2 => [90 + 90 * p[0], 230 - 90 * p[1]];
  for (const [k, p] of [['O', L.O], ['D', L.D]] as const) {
    const q = px(p);
    S(`sup${k}`, 'polygon', 'st-support', [q, [q[0] - 12, q[1] + 18], [q[0] + 12, q[1] + 18]]);
  }
  S('l1', 'line', 'st-link', [px(L.O), px(L.C)]);
  S('l2', 'line', 'st-link', [px(L.D), px(L.A)]);
  S('top', 'line', 'st-link', [px(L.C), px(L.A)]);
  for (const p of [L.O, L.D, L.C, L.A]) S(`j${p.join()}`, 'circle', 'st-joint', [px(p)], 1, 5);
  sb.label('Ol', [px(L.O)[0] - 12, px(L.O)[1] - 6], 'O', 'muted', 1, 'r');
  sb.label('Al', [px(L.A)[0] + 4, px(L.A)[1] - 14], 'A', 'muted', 1, 'l');
  const dir = sub(L.A, L.O), u = scale(1 / norm(dir), dir), F = scale(0.7, u);
  S('W', 'line', 'st-line', [px(add(L.O, scale(-0.4, u))), px(add(L.A, scale(0.9, u)))], 0.8);
  arrow('FA', 'k7-force', px(L.A), px(add(L.A, F)), 1, 10);
  arrow('FO', 'st-blue', px(L.O), px(add(L.O, F)), 1, 10);
  sb.label('FAl', [px(add(L.A, F))[0] + 6, px(add(L.A, F))[1] - 8], t`\v F`, FORCE, 1, 'l');
  sb.label('FOl', [px(add(L.O, F))[0] + 6, px(add(L.O, F))[1] - 8], t`\v F`, BLUE, 1, 'l');
  arrow('vA', 'k7-vel', px(L.A), px(add(L.A, scale(0.45, L.vA))), 1, 9);
  sb.label('vAl', [px(add(L.A, scale(0.45, L.vA)))[0] - 8, px(add(L.A, scale(0.45, L.vA)))[1] - 8], t`\v v_A`, VEL, 1, 'r');
  const PA = dot(F, L.vA);
  sb.label('pa', [SW - 10, 18], t`P_A = \v F\cdot\v v_A = ${num(PA, 2, de)}\,\omega`, FORCE, 1, 'tr');
  sb.label('po', [SW - 10, 42], t`P_O = \v F\cdot\v 0 = 0`, BLUE, 1, 'tr');
  return sb.finish({ PA });
}

/* ================================================================ p. 41–42: Fig. 6.11 / 6.12 (step animation) */

export const TWO_STEPS = 4;
/** Two forces in a plane: 0 = given; 1 = slide both along their lines to S; 2 = add at S (parallelogram) → R̲; 3 = R̲ may slide along its line (to A). */
export function twoForcesScene(step: number, tt: number, lang: Lang): Scene {
  const { sb, S, arrow } = kit();
  void lang;
  const F1: Vec3 = [1.0, 0.5, 0], F2: Vec3 = [1.1, -0.45, 0], A1: Vec3 = [2.2, 3.2, 0], A2: Vec3 = [2.6, 1.0, 0];
  const Sx = intersection2(A1, F1, A2, F2)!;
  const px = (p: Vec3): P2 => [50 + 60 * p[0], 285 - 60 * p[1]];
  const k1 = ease(seg(step > 1 ? 1 : step === 1 ? tt : 0, 0, 0.8));
  const P1 = add(A1, scale(k1, sub(Sx, A1))), P2v = add(A2, scale(k1, sub(Sx, A2)));
  for (const [k, A, F] of [['1', A1, F1], ['2', A2, F2]] as const) {
    S(`W${k}`, 'line', 'st-line', [px(add(Sx, scale(-0.4, F))), px(add(A, scale(2.2, F)))], 0.7);
    S(`A${k}`, 'circle', 'st-pt', [px(A)], 1, 3.6);
    sb.label(`Al${k}`, [px(A)[0] + 2, px(A)[1] + (k === '1' ? -14 : 14)], t`A_${k}`, 'muted', 1, 'c');
  }
  arrow('F1', 'k7-force', px(P1), px(add(P1, F1)), 1, 10);
  arrow('F2', 'k7-force', px(P2v), px(add(P2v, F2)), 1, 10);
  sb.label('F1l', [px(add(P1, F1))[0] + 6, px(add(P1, F1))[1] - 8], t`\v F_1`, FORCE, 1, 'l');
  sb.label('F2l', [px(add(P2v, F2))[0] + 6, px(add(P2v, F2))[1] + 10], t`\v F_2`, FORCE, 1, 'l');
  S('S', 'circle', 'st-pin', [px(Sx)], 1, 4.5);
  sb.label('Sl', [px(Sx)[0] - 6, px(Sx)[1] + 14], 'S', 'muted', 1, 'r');
  const R = add(F1, F2);
  const o2 = appear(step, 2, tt, 0, 0.6);
  S('par1', 'line', 'k7-guide', [px(add(Sx, F1)), px(add(Sx, R))], o2);
  S('par2', 'line', 'k7-guide', [px(add(Sx, F2)), px(add(Sx, R))], o2);
  const k3 = ease(seg(step > 3 ? 1 : step === 3 ? tt : 0, 0, 0.8));
  const RA = add(Sx, scale(k3 * 1.8, scale(1 / norm(R), R)));
  arrow('R', 'st-res', px(RA), px(add(RA, R)), o2, 11);
  sb.label('Rl', [px(add(RA, R))[0] + 6, px(add(RA, R))[1] + 12], t`\v R`, 'fg', o2, 'l');
  S('WR', 'line', 'st-line-res', [px(Sx), px(add(Sx, scale(2.8, R)))], appear(step, 3, tt, 0, 0.4) * 0.8);
  return sb.finish({ Sx: Sx[0], Sy: Sx[1], k3 });
}

/* ================================================================ p. 42: parallel forces and the couple (explorer) */

/** F₁ (fixed, down) at x₁ = 0, F₂ (signed: > 0 down, < 0 up) at x₂ = 4; R̲ at x_R, or a couple when F₂ = −F₁. */
export function parallelScene(F1: number, F2: number, lang: Lang): Scene {
  const { sb, S, arrow, spin } = kit();
  const de = lang === 'de';
  const x1 = 0, x2 = 4;
  const px = (x: number): P2 => [80 + 55 * x, 150];
  S('line', 'line', 'k7-axis', [[20, 150], [SW - 20, 150]]);
  const k = 26;
  const force = (key: string, x: number, F: number, cls: string, ink: Ink, tex: string) => {
    const p = px(x), tail: P2 = [p[0], p[1] - k * F];
    if (Math.abs(F) > 1e-6) arrow(key, cls, F > 0 ? tail : p, F > 0 ? p : [p[0], p[1] + k * F], 1, 10);
    S(`${key}W`, 'line', 'st-line', [[p[0], 40], [p[0], 260]], 0.6);
    sb.label(`${key}l`, [p[0] + 8, F > 0 ? p[1] - k * F + 6 : p[1] - k * F - 6], tex, ink, Math.abs(F) > 1e-6 ? 1 : 0, 'l');
  };
  force('F1', x1, F1, 'k7-force', FORCE, t`\v F_1`);
  force('F2', x2, F2, 'k7-force', FORCE, t`\v F_2`);
  const r = parallelResultant(F1, x1, F2, x2);
  if (r && px(r.xR)[0] > 10 && px(r.xR)[0] < SW - 10) {
    force('R', r.xR, r.R, 'st-res', 'fg', t`\v R`);
    if (r.xR > x1 && r.xR < x2) {
      S('aLine', 'line', 'st-lever', [[px(x1)[0], 190], [px(r.xR)[0], 190]]);
      S('bLine', 'line', 'st-lever', [[px(r.xR)[0], 196], [px(x2)[0], 196]]);
      sb.label('al', [(px(x1)[0] + px(r.xR)[0]) / 2, 204], 'a', 'z', 1, 'c');
      sb.label('bl', [(px(r.xR)[0] + px(x2)[0]) / 2, 210], 'b', 'z', 1, 'c');
    }
  }
  if (!r) {
    spin('cpl', 'k7-om', [px(2)[0], 150], 22, 1, false);
    sb.label('cplv', [SW - 10, 18], t`\v R = 0:\ \text{${de ? 'Kräftepaar' : 'couple'}},\ M = ${num(Math.abs(F1) * (x2 - x1), 1, de)}`, OMEGA, 1, 'tr');
  } else sb.label('rv', [SW - 10, 18], t`R = ${num(r.R, 1, de)},\ x_R = ${num(r.xR, 2, de)}`, 'fg', 1, 'tr');
  return sb.finish({ R: r ? r.R : 0, xR: r ? r.xR : NaN, couple: r ? 0 : 1 });
}

/** Fig. 6.16: the couple {F̲, b} and an equivalent one {cF̲, b/c} turned by θ — same moment. */
export function coupleScene(c: number, theta: number, lang: Lang): Scene {
  const { sb, S, arrow, spin } = kit(SW, 240);
  const de = lang === 'de';
  const F = 1, b = 2;
  const pair = (key: string, cx: number, cy: number, Fm: number, bm: number, th: number, cls: string, ink: Ink) => {
    const u: P2 = [Math.cos(th), -Math.sin(th)], n: P2 = [-u[1], u[0]]; // force direction (down when th = 0 → n) and arm direction
    const half = (bm * 46) / 2;
    const A: P2 = [cx - u[0] * half, cy - u[1] * half], A2: P2 = [cx + u[0] * half, cy + u[1] * half];
    const L = 36 * Fm;
    arrow(`${key}1`, cls, [A[0] - n[0] * L / 2, A[1] - n[1] * L / 2], [A[0] + n[0] * L / 2, A[1] + n[1] * L / 2], 1, 9);
    arrow(`${key}2`, cls, [A2[0] + n[0] * L / 2, A2[1] + n[1] * L / 2], [A2[0] - n[0] * L / 2, A2[1] - n[1] * L / 2], 1, 9);
    S(`${key}b`, 'line', 'st-lever', [A, A2]);
    sb.label(`${key}bl`, [cx + n[0] * 12, cy + n[1] * 12 - 8], bm === b ? 'b' : t`b'`, 'z', 1, 'c');
    sb.label(`${key}F`, [A[0] - n[0] * L / 2 - 10, A[1] - n[1] * L / 2], Fm === F ? t`\v F` : t`\v F'`, ink, 1, 'r');
  };
  pair('p', 110, 120, F, b, 0, 'k7-force', FORCE);
  pair('q', 300, 120, F * c, b / c, theta, 'st-blue', BLUE);
  spin('m1', 'k7-om', [110, 120], 12, 0.6, false);
  spin('m2', 'k7-om', [300, 120], 12, 0.6, false);
  sb.label('v', [SW / 2, 222], t`M = b\,|\v F| = ${num(b * F, 1, de)},\qquad M' = b'\,|\v F'| = \tfrac{b}{c}\cdot c|\v F| = ${num((b / c) * c * F, 1, de)}`, OMEGA, 1, 'c');
  return sb.finish({ M: b * F, M2: (b / c) * c * F });
}

/* ================================================================ p. 43: cube in equilibrium (step animation) */

export const CUBE43_STEPS = 4;
const CV: View3 = { alpha: -1.15, beta: 0.36, cx: 110, cy: 220, s: 82 };
/** 0 = the four forces; 1 = Σ F_x, Σ F_y, Σ F_z = 0; 2 = moments about A of F̲_B, F̲_C, F̲_D; 3 = M̲_A = 0 → equilibrium. */
export function cube43Scene(step: number, tt: number, lang: Lang): Scene {
  const { sb, S, arrow } = kit();
  const de = lang === 'de';
  const a = 1.5, g = cube43(1, 1);
  const P = (p: Vec3) => proj(p, CV);
  cubeEdges(S, a, CV, 0.9);
  axes3(sb, S, arrow, CV, 2.2);
  const names = ['A', 'B', 'C', 'D'];
  const pos: Vec3[] = [[0, 0, 0], [a, a, 0], [a, 0, 0], [0, a, a]];
  const fs = 0.75;
  g.forEach((f, i) => {
    S(`p${i}`, 'circle', 'st-pt', [P(pos[i])], 1, 3.6);
    sb.label(`n${i}`, [P(pos[i])[0] + (i === 0 ? -12 : 8), P(pos[i])[1] + 14], names[i], 'muted', 1, i === 0 ? 'r' : 'l');
    arrow(`F${i}`, 'k7-force', P(pos[i]), P(add(pos[i], scale(fs, f.F))), 1, 10);
    sb.label(`Fl${i}`, [P(add(pos[i], scale(fs, f.F)))[0] + 8, P(add(pos[i], scale(fs, f.F)))[1] - 6], t`\v F_${names[i]}`, FORCE, 1, 'l');
  });
  const o2 = appear(step, 2, tt, 0, 0.6) * (step >= 3 ? 0.4 : 1);
  [1, 2, 3].forEach((i) => arrow(`r${i}`, 'st-r thin', P(pos[0]), P(pos[i]), o2, 7));
  const lines = [
    de ? t`\v F_A, \v F_B, \v F_C\ \text{längs der Achsen},\ \v F_D = (F, -F, -F)` : t`\v F_A, \v F_B, \v F_C\ \text{along the axes},\ \v F_D = (F, -F, -F)`,
    t`\textstyle\sum F_x = \sum F_y = \sum F_z = 0\ \checkmark`,
    t`\v M_A = (0, -aF, 0) + (0, 0, aF) + (0, aF, -aF)`,
    de ? t`\v M_A = \v 0\ \checkmark\quad\Rightarrow\ \text{Gleichgewicht}` : t`\v M_A = \v 0\ \checkmark\quad\Rightarrow\ \text{equilibrium}`,
  ];
  sb.label('line', [SW / 2, 18], lines[Math.min(step, 3)], step === 3 ? 'z' : 'fg', 1, 'c');
  return sb.finish({ step, R: norm(resultant(g)), M: norm(groupMoment([0, 0, 0], g)) });
}

/* ================================================================ p. 44: Fig. 6.23 disc (force polygon) */

export function discScene(showPolygon: boolean, lang: Lang): Scene {
  const { sb, S, arrow } = kit();
  const de = lang === 'de';
  const { A, B } = disc623();
  const s = Math.SQRT1_2, k = 9, C: P2 = [120, 150], r = 58;
  const circ: P2[] = Array.from({ length: 49 }, (_, i) => [C[0] + r * Math.cos((i / 48) * 2 * Math.PI), C[1] + r * Math.sin((i / 48) * 2 * Math.PI)]);
  S('disc', 'polygon', 'k7-body', circ);
  S('c', 'circle', 'st-pin', [C], 1, 3.5);
  // walls under 45°
  S('wA', 'line', 'st-wall', [[C[0] - r * s - 30, C[1] + r * s - 30], [C[0] - r * s + 30, C[1] + r * s + 30]]);
  S('wB', 'line', 'st-wall', [[C[0] + r * s - 30, C[1] + r * s + 30], [C[0] + r * s + 30, C[1] + r * s - 30]]);
  const F: { key: string; v: P2; at: P2; tex: string; cls: string; ink: Ink }[] = [
    { key: 'G', v: [0, -8], at: C, tex: t`\v G`, cls: 'k7-force', ink: FORCE },
    { key: 'F1', v: [4, 0], at: [C[0] - r, C[1]], tex: t`\v F_1`, cls: 'k7-force', ink: FORCE },
    { key: 'F2', v: [-10 * s, -10 * s], at: [C[0] + r * s, C[1] - r * s], tex: t`\v F_2`, cls: 'k7-force', ink: FORCE },
    { key: 'A', v: [A * s, A * s], at: [C[0] - r * s, C[1] + r * s], tex: t`\v A`, cls: 'st-blue', ink: BLUE },
    { key: 'B', v: [-B * s, B * s], at: [C[0] + r * s, C[1] + r * s], tex: t`\v B`, cls: 'st-blue', ink: BLUE },
  ];
  F.forEach((f) => {
    const tail: P2 = f.key === 'G' ? [C[0], C[1] - k * 8] : [f.at[0] - k * f.v[0] * 0.5, f.at[1] + k * f.v[1] * 0.5];
    const tip: P2 = f.key === 'G' ? C : f.at;
    arrow(f.key, f.cls, tail, tip, 1, 9);
    sb.label(`${f.key}l`, [tail[0] + (f.key === 'F1' ? -4 : 10), tail[1] + (f.key === 'F1' ? -12 : 0)], f.tex, f.ink, 1, f.key === 'F1' ? 'c' : 'l');
  });
  if (showPolygon) {
    let cur: P2 = [330, 150];
    const k2 = 8;
    F.forEach((f) => {
      const nxt: P2 = [cur[0] + k2 * f.v[0], cur[1] - k2 * f.v[1]];
      arrow(`poly${f.key}`, f.cls, cur, nxt, 1, 8);
      sb.label(`pl${f.key}`, [(cur[0] + nxt[0]) / 2 + 8, (cur[1] + nxt[1]) / 2], f.tex, f.ink, 0.85, 'l');
      cur = nxt;
    });
    sb.label('closed', [340, 288], de ? t`\text{geschlossen:}\ \v R = 0` : t`\text{closed:}\ \v R = 0`, 'z', 1, 'c');
  }
  sb.label('vals', [SW - 10, 18], t`A = 10 + 2\sqrt2 \approx ${num(A, 2, de)},\ \ B = 6\sqrt2 \approx ${num(B, 2, de)}`, BLUE, 1, 'tr');
  return sb.finish({ A, B });
}

/* ================================================================ p. 44: Waage (step animation) */

export const WAAGE_STEPS = 4;
/** 0 = the scale; 1 = cut free: A_x, A_y, A_z at the pivot; 2 = Σ F_y: A_y = F₁ + F₂; 3 = Σ M_z^(A): F₁ a₁ − F₂ a₂ = 0. */
export function waageScene(step: number, tt: number, lang: Lang): Scene {
  const { sb, S, arrow } = kit(SW, 260);
  void lang;
  const F1 = 3, F2 = 2, a1 = 1.2, a2 = (a1 * F1) / F2;
  const A: P2 = [190, 140], k = 70;
  const L: P2 = [A[0] - k * a1, A[1]], R: P2 = [A[0] + k * a2, A[1]];
  S('beam', 'line', 'st-beam', [L, R]);
  const o1 = appear(step, 1, tt, 0, 0.6);
  S('sup', 'polygon', 'st-support', [[A[0], A[1]], [A[0] - 14, A[1] + 22], [A[0] + 14, A[1] + 22]], 1 - o1 * 0.8);
  S('pin', 'circle', 'st-pin', [A], 1, 4.5);
  arrow('F1', 'k7-force', [L[0], L[1] - 14 * F1], L, 1, 10);
  arrow('F2', 'k7-force', [R[0], R[1] - 14 * F2], R, 1, 10);
  sb.label('F1l', [L[0] - 8, L[1] - 14 * F1], t`F_1`, FORCE, 1, 'r');
  sb.label('F2l', [R[0] + 8, R[1] - 14 * F2], t`F_2`, FORCE, 1, 'l');
  arrow('Ay', 'st-blue', [A[0], A[1] + 70], [A[0], A[1] + 4], o1, 10);
  sb.label('Ayl', [A[0] + 8, A[1] + 56], t`A_y`, BLUE, o1, 'l');
  arrow('Ax', 'st-blue ghost', [A[0] - 46, A[1] + 8], [A[0] - 6, A[1] + 8], o1 * 0.7, 8);
  sb.label('Axl', [A[0] - 50, A[1] + 22], t`A_x`, BLUE, o1 * 0.7, 'c');
  S('a1', 'line', 'st-lever', [[L[0], A[1] + 34], [A[0], A[1] + 34]]);
  S('a2', 'line', 'st-lever', [[A[0], A[1] + 40], [R[0], A[1] + 40]]);
  sb.label('a1l', [(L[0] + A[0]) / 2, A[1] + 48], t`a_1`, 'z', 1, 'c');
  sb.label('a2l', [(R[0] + A[0]) / 2 + 20, A[1] + 54], t`a_2`, 'z', 1, 'c');
  const lines = [
    t`\text{Waage}`,
    t`\textstyle\sum F_z = A_z = 0,\ \ \sum F_x = A_x = 0`,
    t`\textstyle\sum F_y = A_y - F_1 - F_2 = 0\ \Rightarrow\ A_y = F_1 + F_2`,
    t`\textstyle\sum M_z^{(A)} = F_1 a_1 - F_2 a_2 = 0\ \Rightarrow\ a_2 = a_1\,\frac{F_1}{F_2}`,
  ];
  sb.label('line', [SW / 2, 22], lines[Math.min(step, 3)], step >= 2 ? 'z' : 'fg', 1, 'c');
  return sb.finish({ step, Ay: F1 + F2, a2 });
}

export { coupleMoment, moment };
