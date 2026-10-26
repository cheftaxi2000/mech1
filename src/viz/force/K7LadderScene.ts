/**
 * Pure scene of the ladder (Fig. 5.6, pp. 35–36): the ladder at 45° with A, C (midpoint), B, the forces F̲_B = G (down) and
 * F̲_C = W (⟂ ladder, pushing from the lower right onto C, as drawn in the Skript), v̲_A = (v, 0, 0), ω̲ = (0, 0, ω).
 * The lecture solves the task in two ways (circled I and II on p. 35, drawn on p. 36 as III and IV):
 *   Weg I  («Punkt für Punkt»): P = F̲_B · v̲_B + F̲_C · v̲_C, v̲_i = v̲_A + ω̲ × A_iA̲ drawn as a copy of v̲_A plus a rotation part;
 *          only the shadow of v̲_i on the line of F̲_i counts (p. 36, III).
 *   Weg II («in A gebündelt»): R̲ = F̲_B + F̲_C, M̲_A = AB̲ × F̲_B + AC̲ × F̲_C, P = R̲ · v̲_A + M̲_A · ω̲ (p. 36, IV).
 * Both ways end at the same vertical line in the bars below. `Layers` says which parts are visible (0…1): the
 * interactive figure shows one way at a time, the step animation of the solution builds the layers up one by one.
 */
import type { Lang } from '../../i18n';
import { ladderParts, type P2 as Q2 } from '../../physics/kraeftegruppe';
import type { Ladder } from '../../physics/force';
import { seg } from '../anim/geometry';
import type { P2 } from '../anim/geometry';
import type { Ink } from '../anim/scene';
import { FORCE, OMEGA, VEL, draw, num, roundToSum } from './k7Draw';
import { makeScene } from './K7Svg';

export const LW = 520, LH = 478;
export const LD = { AX: 118, AY: 262, S: 60, KF: 2.4, KV: 36, X0: 300, KW: 1.9, XMIN: 120, XMAX: 508, ROWS: { I: [334, 356], II: [410, 432] } as const, YT: 462, L: 4 };
const S2 = Math.SQRT1_2;
export const lPx = (p: Q2): P2 => [LD.AX + LD.S * p[0], LD.AY - LD.S * p[1]];
const dv = (v: Q2, k: number): P2 => [k * v[0], -k * v[1]];
const add2 = (a: P2, b: P2): P2 => [a[0] + b[0], a[1] + b[1]];
const mid2 = (a: P2, b: P2): P2 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const clampX = (x: number) => Math.max(LD.XMIN, Math.min(LD.XMAX, x));
export const barX = (w: number) => clampX(LD.X0 + LD.KW * w);
export type Way = 'I' | 'II';
/** Limits of the sliders. */
export const L_LIM = { v: 2, w: 0.8, G: 30, W: 30 };

/** Which layers are visible, each 0…1 (a layer that grows, like the velocity arrows, uses the value as its progress). */
export interface Layers {
  /** Weg I: copy of v̲_A + rotation part = v̲_B, v̲_C, drawn head to tail */ vel: number;
  /** Weg I: lines of action, shadows of the velocities on them */ shadow: number;
  /** Weg I: bars P_B, P_C */ barsI: number;
  /** Weg II: R̲ at A (F̲_B + F̲_C) and the shadow of v̲_A on it */ R: number;
  /** Weg II: moments about A as ⊙ / ⊗ */ mom: number;
  /** Weg II: bars R̲·v̲_A, M̲_A·ω̲ */ barsII: number;
  /** the total line and its label */ total: number;
}
export const NONE: Layers = { vel: 0, shadow: 0, barsI: 0, R: 0, mom: 0, barsII: 0, total: 0 };
/** What the interactive figure shows for each way (the other way's bars stay visible, dimmed). */
export const wayLayers = (way: Way): Layers => (way === 'I'
  ? { vel: 1, shadow: 1, barsI: 1, R: 0, mom: 0, barsII: 0.4, total: 1 }
  : { vel: 0, shadow: 0, barsI: 0.4, R: 1, mom: 1, barsII: 1, total: 1 });

export function ladderScene(par: Omit<Ladder, 'L'>, lang: Lang, ly: Layers) {
  const sc = makeScene(LW, LH);
  const { S, arrow, spin, rect } = draw(sc);
  const de = lang === 'de';
  const f1 = (x: number) => num(x, 1, de);
  const q = ladderParts({ ...par, L: LD.L });
  const { m } = q;
  const A = lPx([0, 0]), B = lPx([m.AB[0], m.AB[1]]), C = lPx([m.AC[0], m.AC[1]]);
  const { G, W, v, omega } = par;
  const nrm: P2 = [-S2, -S2]; // along the ladder (pixels), perpendicular to it, up-left
  const rowsI = LD.ROWS.I, rowsII = LD.ROWS.II;
  const gDir: P2 = [0, 1], wDir: P2 = [-S2, -S2]; // unit vectors of F_B and F_C in pixels
  const along = (P: P2, d: P2, len: number): P2 => [P[0] + d[0] * len, P[1] + d[1] * len];
  const lab = (o: number) => (o > 0.9 ? 1 : 0);

  // ---- ladder: two rails, rungs, joints A, C, B ----
  const hw = 0.17 * LD.S;
  const rail = (sgn: number): P2[] => [add2(A, [nrm[0] * hw * sgn, nrm[1] * hw * sgn]), add2(B, [nrm[0] * hw * sgn, nrm[1] * hw * sgn])];
  S('ladder-fill', 'polygon', 'k7-ladder-fill', [...rail(1), ...rail(-1).reverse()]);
  for (let i = 1; i < 8; i++) {
    const k = i / 8, p: P2 = [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k];
    S('rung' + i, 'line', 'k7-rung', [add2(p, [nrm[0] * hw, nrm[1] * hw]), add2(p, [-nrm[0] * hw, -nrm[1] * hw])]);
  }
  S('rail1', 'line', 'k7-rail', rail(1)); S('rail2', 'line', 'k7-rail', rail(-1));
  // dimension lines L/2 (upper left of the ladder, as in the Skript)
  const dimOff = 0.62 * LD.S, off = (P: P2): P2 => add2(P, [nrm[0] * dimOff, nrm[1] * dimOff]);
  const dimA = off(A), dimC = off(C), dimB = off(B);
  S('dim1', 'line', 'k7-dim', [dimA, dimC]); S('dim2', 'line', 'k7-dim', [dimC, dimB]);
  for (const [k, p] of [['a', dimA], ['c', dimC], ['b', dimB]] as const) S('dimt-' + k, 'line', 'k7-dim', [add2(p, [nrm[0] * 5, nrm[1] * 5]), add2(p, [-nrm[0] * 9, -nrm[1] * 9])]);
  sc.label('lab-L2a', add2(mid2(dimA, dimC), [nrm[0] * 14, nrm[1] * 14]), 'L/2', 'muted', 1, 'c');
  sc.label('lab-L2b', add2(mid2(dimC, dimB), [nrm[0] * 14, nrm[1] * 14]), 'L/2', 'muted', 1, 'c');
  // 45° at A
  const arcR = 34;
  S('ang', 'polyline', 'k7-dim', Array.from({ length: 9 }, (_, i) => { const a = (i / 8) * (Math.PI / 4); return [A[0] + arcR * Math.cos(a), A[1] - arcR * Math.sin(a)] as P2; }));
  sc.label('lab-45', add2(A, [arcR + 18, -19]), String.raw`45^\circ`, 'muted', 1, 'c');
  // axes triad
  const T0: P2 = [36, 270];
  arrow('ex', 'k7-axis-a', T0, add2(T0, [26, 0]), 1, 6); arrow('ey', 'k7-axis-a', T0, add2(T0, [0, -26]), 1, 6);
  S('ez', 'circle', 'k7-axis-z', [add2(T0, [-18, 0])], 1, 5); S('ez-dot', 'circle', 'k7-axis-zd', [add2(T0, [-18, 0])], 1, 1.5);
  sc.label('lab-ex', add2(T0, [36, 3]), String.raw`\e{x}`, 'muted', 1, 'c'); sc.label('lab-ey', add2(T0, [5, -36]), String.raw`\e{y}`, 'muted', 1, 'c'); sc.label('lab-ez', add2(T0, [-18, 15]), String.raw`\e{z}`, 'muted', 1, 'c');

  // ---- Weg I, drawn under the arrows: lines of action, shadows, drop lines ----
  const vAtip = add2(A, dv([v, 0], LD.KV));
  const bt = add2(B, dv([v, 0], LD.KV)), bv = add2(B, dv(q.vB, LD.KV));
  const ct = add2(C, dv([v, 0], LD.KV)), cv = add2(C, dv(q.vC, LD.KV));
  const rB = LD.KV * q.alongG; // v_A ⟂ F_B: the copy has no shadow on F_B's line, the rotation part has all of it
  const tCs = LD.KV * -S2 * v, rCs = LD.KV * omega * LD.L / 2;
  const sh = ly.shadow;
  if (sh > 0.01) {
    const grow = (a: P2, b: P2): P2 => [a[0] + (b[0] - a[0]) * sh, a[1] + (b[1] - a[1]) * sh];
    S('lineG', 'line', 'k7-loa', [along(B, gDir, -56), along(B, gDir, 88)], sh);
    S('lineW', 'line', 'k7-loa', [along(C, wDir, -78), along(C, wDir, 78)], sh);
    S('shB-r', 'line', 'k7-sh-r', [B, grow(B, along(B, gDir, rB))]);
    S('shC-t', 'line', 'k7-sh-t', [C, grow(C, along(C, wDir, tCs))]);
    S('shC-r', 'line', 'k7-sh-r', [along(C, wDir, tCs), grow(along(C, wDir, tCs), along(C, wDir, tCs + rCs))]);
    S('dropB', 'line', 'k7-drop', [bv, grow(bv, along(B, gDir, rB))]);
    S('dropC', 'line', 'k7-drop', [cv, grow(cv, along(C, wDir, tCs + rCs))]);
  }
  const vk = ly.vel;
  if (vk > 0.01) {
    const k1 = seg(vk, 0, 0.4), k2 = seg(vk, 0.3, 0.7), k3 = seg(vk, 0.6, 1);
    arrow('vtB', 'k7-vt', B, bt, 1, 7, k1); arrow('vrB', 'k7-vr', bt, bv, 1, 7, k2); arrow('vB', 'k7-vel', B, bv, 1, 8, k3);
    arrow('vtC', 'k7-vt', C, ct, 1, 7, k1); arrow('vrC', 'k7-vr', ct, cv, 1, 7, k2); arrow('vC', 'k7-vel', C, cv, 1, 8, k3);
    const out = (P: P2, tip: P2, k = 14): P2 => { const d: P2 = [tip[0] - P[0], tip[1] - P[1]], l = Math.hypot(d[0], d[1]) || 1; return [tip[0] + (d[0] / l) * k, tip[1] + (d[1] / l) * (k - 3)]; };
    sc.label('lab-vB', out(B, bv), String.raw`\v v_B`, VEL, lab(k3), 'c');
    sc.label('lab-vC', out(C, cv, 18), String.raw`\v v_C`, VEL, lab(k3), 'c');
  }

  // ---- the forces (as in the Skript: F_B starts at B and points down; F_C points onto C from the lower right) ----
  const FBtip = add2(B, [0, G * LD.KF]);
  const Ftail = add2(C, [S2 * W * LD.KF, S2 * W * LD.KF]); // tail of F_C; the head is at C
  arrow('FB', 'k7-force', B, FBtip, G > 0.4 ? 1 : 0, 8);
  arrow('FC', 'k7-force', Ftail, C, W > 0.4 ? 1 : 0, 8);
  if (W > 0.4) { const k = 8, a1: P2 = [S2, -S2], a2: P2 = [S2, S2]; S('ra', 'polyline', 'k7-ra', [add2(C, [a1[0] * k, a1[1] * k]), add2(C, [(a1[0] + a2[0]) * k, (a1[1] + a2[1]) * k]), add2(C, [a2[0] * k, a2[1] * k])]); }
  sc.label('lab-FB', add2(FBtip, [20, -2]), String.raw`\v F_B`, FORCE, G > 0.4 ? 1 : 0, 'c');
  sc.label('lab-FC', add2(Ftail, [10, 14]), String.raw`\v F_C`, FORCE, W > 0.4 ? 1 : 0, 'c');
  sc.label('lab-G', add2(FBtip, [0, 20]), String.raw`|\v F_B| = G`, FORCE, G > 0.4 ? 1 : 0, 'c');
  sc.label('lab-W', add2(Ftail, [14, 30]), String.raw`|\v F_C| = W`, FORCE, W > 0.4 ? 1 : 0, 'l');

  // ---- Weg II: R at A (F_B and F_C copied to A and added), the moments about A ----
  const R = q.R, rk = ly.R;
  if (rk > 0.01) {
    const FB2: Q2 = [m.FB[0], m.FB[1]], FC2: Q2 = [m.FC[0], m.FC[1]];
    const c1 = add2(A, dv(FB2, LD.KF)), c2 = add2(c1, dv(FC2, LD.KF)), Rtip = add2(A, dv(R, LD.KF)), hasR = Math.hypot(R[0], R[1]) > 0.4;
    const kc = seg(rk, 0, 0.5), kr = seg(rk, 0.4, 1);
    arrow('Fc1', 'k7-force ghost', A, c1, 1, 6, kc); arrow('Fc2', 'k7-force ghost', c1, c2, 1, 6, kc);
    arrow('R', 'k7-force big', A, Rtip, hasR ? 1 : 0, 9, kr);
    sc.label('lab-R', add2(Rtip, [R[0] < 0 ? -14 : 14, 10]), String.raw`\v R`, FORCE, hasR ? lab(kr) : 0, 'c');
    // shadow of v_A on R: only the horizontal part of R counts
    const shl = LD.KV * (v * R[0]) / (Math.hypot(...R) || 1);
    if (hasR && Math.abs(shl) > 1 && kr > 0.5) {
      const Rd: P2 = [R[0], -R[1]], rl = Math.hypot(...Rd), Ru: P2 = [Rd[0] / rl, Rd[1] / rl];
      S('shR', 'line', 'k7-sh-t', [A, along(A, Ru, shl)], kr);
      S('dropR', 'line', 'k7-drop', [vAtip, along(A, Ru, shl)], kr);
    }
  }
  const mk = ly.mom;
  if (mk > 0.01) {
    // the moments about A as ⊙ / ⊗ in a column on the right (the lecture's notation on p. 36)
    const X = 380, ys = [150, 188, 234];
    const sym = (key: string, y: number, val: number, soft: boolean, o: number) => spin(key, soft ? 'k7-mom soft' : 'k7-mom', [X, y], soft ? 10 : 12, Math.abs(val) > 0.05 ? o : 0, val > 0);
    sym('sMG', ys[0], q.MAG, true, seg(mk, 0, 0.4)); sym('sMW', ys[1], q.MAW, true, seg(mk, 0.3, 0.7)); sym('sMA', ys[2], q.MA, false, seg(mk, 0.6, 1));
    sc.label('head-M', [X - 32, 118], String.raw`\text{${de ? 'Momente bezüglich' : 'moments about'}}\ A`, 'muted', lab(mk), 'l');
    sc.label('lab-sMG', [X + 20, ys[0]], String.raw`M_{AG} = ${f1(q.MAG)}`, FORCE, lab(seg(mk, 0, 0.4)), 'l');
    sc.label('lab-sMW', [X + 20, ys[1]], String.raw`M_{AW} = ${f1(q.MAW)}`, FORCE, lab(seg(mk, 0.3, 0.7)), 'l');
    sc.label('lab-sMA', [X + 20, ys[2]], String.raw`M_A = ${f1(q.MA)}`, FORCE, lab(seg(mk, 0.6, 1)), 'l');
    sc.label('plus-M', [X - 20, ys[1]], '+', 'fg', lab(seg(mk, 0.3, 0.7)), 'c'); sc.label('eq-M', [X - 20, ys[2]], '=', 'fg', lab(seg(mk, 0.6, 1)), 'c');
  }
  // ---- v_A and ω at A (always) ----
  arrow('vA', 'k7-vel', A, vAtip, Math.abs(v) > 0.04 ? 1 : 0, 8);
  sc.label('lab-vA', add2(vAtip, [0, 15]), String.raw`\v v_A`, VEL, Math.abs(v) > 0.04 ? 1 : 0, 'c');
  spin('om', 'k7-om', add2(A, [-30, -26]), 9, Math.abs(omega) > 0.04 ? 1 : 0, omega > 0);
  sc.label('lab-om', add2(A, [-52, -26]), String.raw`\v\omega`, OMEGA, Math.abs(omega) > 0.04 ? 1 : 0, 'c');
  S('pA', 'circle', 'k7-pivot', [A], 1, 5); S('pB', 'circle', 'k7-pivot', [B], 1, 5); S('pC', 'circle', 'k7-pivot', [C], 1, 5);
  sc.label('lab-A', add2(A, [-17, 3]), 'A', 'fg', 1, 'c');
  sc.label('lab-B', add2(B, [14, -9]), 'B', 'fg', 1, 'c');
  sc.label('lab-C', add2(C, [19, 2]), 'C', 'fg', 1, 'c');

  // ---- bars: Weg I (two rows) and Weg II (two rows), both ending at the same total ----
  const total = q.wegI, shownT = roundToSum([total], 1)[0];
  const anyBars = Math.max(ly.barsI, ly.barsII);
  S('zero', 'line', 'k7-axis', [[LD.X0, 318], [LD.X0, 448]], anyBars);
  const bar = (key: string, cls: string, y: number, from: number, to: number, label: string, ink: Ink, val: string, o: number) => {
    const x0 = barX(Math.min(from, to)), x1 = barX(Math.max(from, to));
    if (x1 - x0 >= 0.6) rect(key, cls, x0, y - 7, x1, y + 7, o);
    sc.label('lab-' + key, [to >= from ? x1 + 4 : x0 - 4, y], val, ink, o > 0.3 ? o : 0, to >= from ? 'l' : 'r');
    sc.label('row-' + key, [8, y], label, ink, o > 0.3 ? o : 0, 'l');
  };
  const [pb, pc] = roundToSum([q.PB, q.PC], 1), [rv, ma] = roundToSum([q.RvA, q.MAomega], 1);
  bar('PB', 'k7-seg-p', rowsI[0], 0, q.PB, String.raw`P_B = \v F_B\cdot\v v_B`, 'fg', f1(pb), ly.barsI);
  bar('PC', 'k7-seg-p b', rowsI[1], q.PB, q.PB + q.PC, String.raw`P_C = \v F_C\cdot\v v_C`, 'fg', f1(pc), ly.barsI);
  bar('RV', 'k7-seg-t', rowsII[0], 0, q.RvA, String.raw`\v R\cdot\v v_A`, VEL, f1(rv), ly.barsII);
  bar('MW', 'k7-seg-r', rowsII[1], q.RvA, q.RvA + q.MAomega, String.raw`\v M_A\cdot\v\omega`, OMEGA, f1(ma), ly.barsII);
  sc.label('head-I', [8, 313], String.raw`\text{${de ? 'Weg I: jede Kraft mit der Geschwindigkeit ihres Punktes' : 'Route I: each force with the velocity of its point'}}`, 'muted', ly.barsI > 0.3 ? ly.barsI : 0, 'l');
  sc.label('head-II', [8, 388], String.raw`\text{${de ? 'Weg II: gebündelt in' : 'Route II: bundled in'}}\ A`, 'muted', ly.barsII > 0.3 ? ly.barsII : 0, 'l');
  const xT = barX(total), ink: Ink = total >= 0 ? 'z' : 'y';
  S('total', 'line', total >= 0 ? 'k7-total pos' : 'k7-total neg', [[xT, 318], [xT, 448]], ly.total);
  sc.label('lab-total', [Math.max(70, Math.min(LW - 70, xT)), LD.YT], String.raw`P = ${f1(shownT)}\,\text{W}`, ink, lab(ly.total), 'c');
  return Object.assign(sc.finish({ total, wegi: q.wegI, wegii: q.wegII, pb: q.PB, pc: q.PC, rva: q.RvA, maw: q.MAomega }), { parts: q });
}
