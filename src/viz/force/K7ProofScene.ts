/**
 * Pure scene of the proof on p. 35 («Beispiel: 2 Kräfte in B»), plane special case: a plate with two forces
 * {A₁ | F̲₁}, {A₂ | F̲₂}; known in B: {v̲_B, ω̲}, ω̲ = ω e̲_z out of the page (the lecture's ⊙). One step per handwritten line:
 *
 *  step 0  given: B with v̲_B and ω̲, the forces F̲₁ at A₁, F̲₂ at A₂
 *  step 1  v̲_i = v̲_B + ω̲ × BA̲_i: a copy of v̲_B at A_i, then the rotation part ω̲ × BA̲_i ⟂ BA̲_i, sum = v̲_i
 *  step 2  P_i = F̲_i · v̲_i: |F̲_i| times the shadow of v̲_i on the line of F̲_i; the two powers stacked: Σ P_i
 *  step 3  F̲_i · v̲_i = F̲_i · v̲_B + F̲_i · (ω̲ × BA̲_i): the shadow of a sum is the sum of the shadows; every bar splits in two
 *  step 4  the translation parts: F̲₁ · v̲_B + F̲₂ · v̲_B = (F̲₁ + F̲₂) · v̲_B = R̲ · v̲_B; they move into the right stack
 *  step 5  the rotation parts: F̲_i · (ω̲ × BA̲_i) = ω̲ · (BA̲_i × F̲_i) = ω M_i; ΣM_i = M_B; they stack on top
 *  step 6  result: P = R̲ · v̲_B + M̲_B · ω̲ — the two stacks have the same height
 */
import type { Lang } from '../../i18n';
import { PROOF, plateNumbers, shadow } from '../../physics/kraeftegruppe';
import { ease, seg, type P2 } from '../anim/geometry';
import { sceneBuilder, type Ink, type Scene } from '../anim/scene';
import { FORCE, OMEGA, VEL, appear, draw, lerp2, num } from './k7Draw';

/** Pixel layout of the 400 × 300 figure. */
export const K = { S: 38, BX: 118, BY: 128, KV: 22, KF: 26, KP: 23, Y0: 206, LX: [284, 324] as const, RX: [350, 390] as const };
export const NUM = plateNumbers(PROOF);
const px = (p: P2): P2 => [K.BX + K.S * p[0], K.BY - K.S * p[1]];
const dv = (v: P2, k: number): P2 => [k * v[0], -k * v[1]]; // vector (math) → pixel offset
const add2 = (a: P2, b: P2): P2 => [a[0] + b[0], a[1] + b[1]];
const yP = (w: number) => K.Y0 - K.KP * w;
const mid = (a: number, b: number) => (a + b) / 2;

/** The plate: a rounded blob around B, A₁, A₂ (in metres). */
export const PLATE: P2[] = Array.from({ length: 28 }, (_, i) => {
  const a = (i / 28) * 2 * Math.PI, r = 1 + 0.07 * Math.sin(3 * a + 1) + 0.05 * Math.cos(2 * a);
  const x = 2.8 * r * Math.cos(a), y = 1.75 * r * Math.sin(a), c = Math.cos(0.42), s = Math.sin(0.42);
  return [0.05 + c * x - s * y, 0.05 + s * x + c * y] as P2;
});

/** Stack of signed segments from 0: returns [c0, c1] per segment. */
export const stack = (vals: number[]): [number, number][] => { let c = 0; return vals.map((v) => { const r: [number, number] = [c, c + v]; c += v; return r; }); };

export function proofScene(step: number, t: number, lang: Lang): Scene {
  const sb = sceneBuilder();
  const { S, arrow, rect, spin } = draw(sb);
  const de = lang === 'de';
  const f1 = (x: number) => num(x, 1, de);
  const n = NUM, forces = PROOF.forces;
  const B = px(PROOF.B), omegaPos = add2(B, [-48, -36]);
  const A = forces.map((f) => px(f.A));
  const Fv = forces.map((f) => f.F as P2);
  const Fhat = Fv.map((f) => { const l = Math.hypot(f[0], f[1]); return [f[0] / l, -f[1] / l] as P2; }); // unit vectors in pixels
  const along = (i: number, d: number): P2 => add2(A[i], [Fhat[i][0] * d, Fhat[i][1] * d]);
  const vtip = A.map((a, i) => add2(a, dv(n.v[i] as P2, K.KV)));
  const tcopy = A.map((a) => add2(a, dv(PROOF.vB, K.KV)));
  const vBtip = add2(B, dv(PROOF.vB, K.KV));

  // ---- the plate and the dashed lines BA_i (drawn first, under everything) ----
  S('plate', 'polygon', 'k7-body', PLATE.map(px));
  const ba = appear(step, 1, t, 0, 0.25) * (step === 2 || step >= 4 ? 0 : 1);
  A.forEach((a, i) => S('ba' + (i + 1), 'line', 'k7-guide', [B, a], ba));

  // ---- the shadows on the lines of the forces (bands under the arrows) ----
  const shV = (i: number) => K.KV * shadow(n.v[i] as P2, Fv[i]);
  const shT = (i: number) => K.KV * shadow(PROOF.vB, Fv[i]);
  const sh2 = step === 2 ? ease(seg(t, 0.1, 0.55)) : step === 3 ? 1 - ease(seg(t, 0, 0.4)) : 0;
  const sh3 = step === 3 ? ease(seg(t, 0.3, 0.9)) : 0;
  [0, 1].forEach((i) => {
    const e1 = along(i, shV(i)), eT = along(i, shT(i));
    if (sh2 > 0.01) {
      S('sh' + (i + 1) + 'p', 'line', 'k7-sh-p', [A[i], lerp2(A[i], e1, sh2)]);
      S('dr' + (i + 1), 'line', 'k7-drop', [vtip[i], lerp2(vtip[i], e1, sh2)], sh2);
    }
    if (sh3 > 0.01) {
      S('sh' + (i + 1) + 't', 'line', 'k7-sh-t', [A[i], lerp2(A[i], eT, sh3)]);
      S('sh' + (i + 1) + 'r', 'line', 'k7-sh-r', [eT, lerp2(eT, e1, sh3)]);
      S('drt' + (i + 1), 'line', 'k7-drop-t', [tcopy[i], lerp2(tcopy[i], eT, sh3)], sh3);
      S('drr' + (i + 1), 'line', 'k7-drop-r', [vtip[i], lerp2(vtip[i], e1, sh3)], sh3);
    }
  });
  // R and the shadow of v_B on R (step 4)
  const R = n.R;
  const Rtip = add2(B, dv(R, K.KF)), F1c = add2(B, dv(Fv[0], K.KF));
  const shRlen = K.KV * shadow(PROOF.vB, R);
  const shR = step === 4 ? ease(seg(t, 0.6, 0.95)) : 0;
  if (shR > 0.01) {
    const e: P2 = [B[0] + shRlen, B[1]];
    S('shR', 'line', 'k7-sh-t', [B, lerp2(B, e, shR)]);
    S('drR', 'line', 'k7-drop-t', [vBtip, lerp2(vBtip, e, shR)], shR);
  }

  // ---- vectors ----
  const ghostF = step >= 4 ? (step === 4 ? 1 - 0.55 * ease(seg(t, 0, 0.5)) : 0.45) : 1;
  const Fo = step === 0 ? ease(seg(t, 0.55, 0.9)) : ghostF;
  const Ftip = A.map((a, i) => add2(a, dv(Fv[i], K.KF)));
  const vis1 = step === 3 ? 1 : 0;
  A.forEach((a, i) => {
    const cK = step === 1 ? ease(seg(t, 0.2, 0.5)) : vis1;
    const rK = step === 1 ? ease(seg(t, 0.45, 0.75)) : vis1;
    const sK = step === 1 ? ease(seg(t, 0.7, 1)) : step === 2 ? 1 : step === 3 ? 0.3 : 0;
    arrow('vt' + (i + 1), 'k7-vt', a, tcopy[i], cK > 0 ? 1 : 0, 7, cK);
    arrow('vr' + (i + 1), 'k7-vr', tcopy[i], vtip[i], rK > 0 ? 1 : 0, 7, rK);
    arrow('v' + (i + 1), 'k7-vel', a, vtip[i], sK, 8);
  });
  Ftip.forEach((tip, i) => arrow('F' + (i + 1), 'k7-force', A[i], tip, Fo, 8));
  const vBo = step === 0 ? ease(seg(t, 0.3, 0.6)) : step === 5 ? 1 - 0.65 * ease(seg(t, 0, 0.5)) : 1;
  arrow('vB', 'k7-vel', B, vBtip, vBo, 8);
  if (step === 4) {
    const chain = ease(seg(t, 0, 0.45));
    arrow('Fc1', 'k7-force ghost', B, F1c, chain * 0.8, 7);
    arrow('Fc2', 'k7-force ghost', F1c, Rtip, chain * 0.8, 7);
  }
  const rOn = step === 4 ? ease(seg(t, 0.35, 0.8)) : step === 6 ? 1 : step === 5 ? 0.3 : 0;
  arrow('R', 'k7-force big', B, Rtip, rOn, 9);

  // ---- the turning symbols: ω (always), M_1, M_2, M_B (steps 5, 6) ----
  const oo = appear(step, 0, t, 0.25, 0.55);
  spin('om', 'k7-om', omegaPos, 11, oo);
  // ⊙M_1 + ⊙M_2 = ⊙M_B as a small column below R (step 5); in step 6 only ⊙M_B stays
  const slot = (k: number): P2 => add2(B, [30, 24 + 23 * k]);
  const m1 = step === 5 ? ease(seg(t, 0.05, 0.35)) : 0;
  const m2 = step === 5 ? ease(seg(t, 0.3, 0.6)) : 0;
  const mB = step === 5 ? ease(seg(t, 0.6, 0.9)) : step === 6 ? 1 : 0;
  spin('M1', 'k7-mom soft', slot(0), 8, m1);
  spin('M2', 'k7-mom soft', slot(1), 8, m2);
  S('Msum', 'line', 'k7-axis', [add2(slot(1), [-26, 12]), add2(slot(1), [34, 12])], step === 5 ? m2 : 0);
  spin('MB', 'k7-mom', slot(2.25), 10, mB);

  // ---- points on top ----
  S('B', 'circle', 'an-point', [B], 1, 4.2);
  A.forEach((a, i) => S('A' + (i + 1), 'circle', 'an-point', [a], 1, 4.2));

  // ---- labels on the plate ----
  sb.label('lab-B', add2(B, [-10, 13]), 'B', 'point', 1, 'c');
  sb.label('lab-A1', add2(A[0], [-12, -11]), 'A_1', 'point', 1, 'c');
  sb.label('lab-A2', add2(A[1], [-15, -9]), 'A_2', 'point', 1, 'c');
  sb.label('lab-om', add2(omegaPos, [16, 0]), String.raw`\v\omega`, OMEGA, oo > 0.9 ? 1 : 0, 'l');
  sb.label('lab-vB', add2(vBtip, [8, -8]), String.raw`\v v_B`, VEL, vBo > 0.9 ? 1 : 0, 'l');
  sb.label('lab-F1', add2(Ftip[0], [-13, 9]), String.raw`\v F_1`, FORCE, Fo > 0.9 ? 1 : 0, 'c');
  sb.label('lab-F2', add2(Ftip[1], [13, -9]), String.raw`\v F_2`, FORCE, Fo > 0.9 ? 1 : 0, 'c');
  const baLab = ba > 0.9 ? 1 : 0;
  sb.label('lab-ba1', add2(lerp2(B, A[0], 0.55), [10, 13]), String.raw`\v{BA}_1`, 'muted', baLab, 'c');
  sb.label('lab-ba2', add2(lerp2(B, A[1], 0.46), [-2, -13]), String.raw`\v{BA}_2`, 'muted', baLab, 'c');
  const vo = step === 1 ? seg(t, 0.85, 1) : step === 2 ? 1 : 0;
  sb.label('lab-v1', add2(vtip[0], [10, 7]), String.raw`\v v_1`, VEL, vo > 0.9 ? 1 : 0, 'l');
  sb.label('lab-v2', add2(vtip[1], [9, -8]), String.raw`\v v_2`, VEL, vo > 0.9 ? 1 : 0, 'l');
  sb.label('lab-R', add2(Rtip, [4, 15]), String.raw`\v R`, FORCE, rOn > 0.9 ? 1 : 0, 'l');
  sb.label('lab-RvB', add2(B, [shRlen / 2 + 2, -17]), f1(n.translation), VEL, step === 4 ? seg(t, 0.85, 1) : 0, 'c');
  const ml = (o: number) => (o > 0.9 ? 1 : 0);
  sb.label('lab-M1', add2(slot(0), [14, 0]), 'M_1', FORCE, step === 5 ? ml(m1) : 0, 'l');
  sb.label('lab-M2', add2(slot(1), [14, 0]), 'M_2', FORCE, step === 5 ? ml(m2) : 0, 'l');
  sb.label('lab-plus', add2(slot(1), [-20, 0]), '+', 'fg', step === 5 ? ml(m2) : 0, 'c');
  sb.label('lab-eqM', add2(slot(2.25), [-20, 0]), '=', 'fg', step === 5 ? ml(mB) : 0, 'c');
  sb.label('lab-MB', add2(slot(2.25), [16, 0]), String.raw`\v M_B`, FORCE, ml(mB), 'l');

  // ---- the bars on the right: two stacks of signed segments ----
  const [lx0, lx1] = K.LX, [rx0, rx1] = K.RX;
  S('zero', 'line', 'k7-axis', [[lx0 - 6, K.Y0], [rx1 + 4, K.Y0]], step >= 2 ? 1 : 0);
  const segLab = (key: string, x: number, c: [number, number], val: number, ink: Ink, o: number) =>
    sb.label(key, [x, (yP(c[0]) + yP(c[1])) / 2], f1(val), ink, o > 0.5 ? o : 0, 'c');
  const stP = stack([n.P[0], n.P[1]]);
  const parts4 = [n.trans[0], n.rot[0], n.trans[1], n.rot[1]];
  const stS = stack(parts4);
  const leftDim = step >= 4 ? (step === 4 ? 1 - 0.65 * ease(seg(t, 0.3, 0.8)) : 0.35) : 1;
  const lP = step === 2 ? ease(seg(t, 0.45, 0.95)) : step === 3 ? 1 - ease(seg(t, 0, 0.3)) : 0;
  const lS = step === 3 ? ease(seg(t, 0.2, 0.6)) : step >= 4 ? 1 : 0;
  stP.forEach((c, i) => rect('L-P' + (i + 1), i === 0 ? 'k7-seg-p' : 'k7-seg-p b', lx0, yP(c[0]), lx1, yP(c[1]), lP));
  stS.forEach((c, i) => rect(['L-t1', 'L-r1', 'L-t2', 'L-r2'][i], i % 2 ? 'k7-seg-r' : 'k7-seg-t', lx0, yP(c[0]), lx1, yP(c[1]), lS * leftDim));
  stP.forEach((c, i) => segLab('lab-LP' + (i + 1), mid(lx0, lx1), c, n.P[i], 'fg', lP));
  stS.forEach((c, i) => segLab('lab-Ls' + i, mid(lx0, lx1), c, parts4[i], i % 2 ? OMEGA : VEL, step === 3 && lS > 0.9 ? 1 : 0));
  // brackets «P_1», «P_2» to the left of the left stack
  const brO = step >= 2 ? (step === 2 ? ease(seg(t, 0.6, 1)) : step === 3 ? 1 : step === 4 ? 1 - ease(seg(t, 0, 0.5)) : 0) : 0;
  stP.forEach((c, i) => {
    const x = lx0 - 6, y0 = yP(c[0]) - 1.5, y1 = yP(c[1]) + 1.5;
    S('br' + (i + 1), 'polyline', 'k7-bracket', [[x + 3, y0], [x, y0], [x, y1], [x + 3, y1]], brO);
    sb.label('lab-br' + (i + 1), [x - 3, mid(y0, y1)], `P_${i + 1}`, 'muted', brO > 0.5 ? brO : 0, 'r');
  });
  // right stack: [t1, t2, r1, r2]; the pieces slide over from the left stack
  const stR = stack([n.trans[0], n.trans[1], n.rot[0], n.rot[1]]);
  const fromL = { t1: stS[0], t2: stS[2], r1: stS[1], r2: stS[3] };
  const toR = { t1: stR[0], t2: stR[1], r1: stR[2], r2: stR[3] };
  const mvT = step === 4 ? ease(seg(t, 0.2, 0.75)) : step > 4 ? 1 : 0;
  const mvR = step === 5 ? ease(seg(t, 0.15, 0.7)) : step > 5 ? 1 : 0;
  const pieces: { id: 't1' | 't2' | 'r1' | 'r2'; mv: number; show: boolean; val: number; ink: Ink }[] = [
    { id: 't1', mv: mvT, show: step >= 4, val: n.trans[0], ink: VEL }, { id: 't2', mv: mvT, show: step >= 4, val: n.trans[1], ink: VEL },
    { id: 'r1', mv: mvR, show: step >= 5, val: n.rot[0], ink: OMEGA }, { id: 'r2', mv: mvR, show: step >= 5, val: n.rot[1], ink: OMEGA },
  ];
  pieces.forEach((p) => {
    if (!p.show) return;
    const c0 = fromL[p.id], c1 = toR[p.id];
    const x0 = lx0 + (rx0 - lx0) * p.mv, x1 = lx1 + (rx1 - lx1) * p.mv;
    const ya = c0[0] + (c1[0] - c0[0]) * p.mv, yb = c0[1] + (c1[1] - c0[1]) * p.mv;
    rect('R-' + p.id, p.id[0] === 't' ? 'k7-seg-t' : 'k7-seg-r', x0, yP(ya), x1, yP(yb), 1);
    segLab('lab-R' + p.id, mid(x0, x1), [ya, yb], p.val, p.ink, p.mv > 0.95 ? 1 : 0);
  });
  // totals above the stacks, titles
  const tot = n.total, topY = yP(Math.max(0, tot)) - 11, totInk: Ink = tot >= 0 ? 'z' : 'y';
  const totTex = `${f1(tot)}\\,\\text{W}`;
  sb.label('tot-L', [mid(lx0, lx1), topY], totTex, totInk, step >= 2 ? (step === 2 ? seg(t, 0.8, 1) : 1) : 0, 'c');
  sb.label('tot-R', [mid(rx0, rx1), topY], totTex, totInk, step === 6 ? seg(t, 0.5, 0.9) : 0, 'c');
  sb.label('title-L', [mid(lx0, lx1), 42], String.raw`\sum P_i`, 'fg', step >= 2 ? (step === 2 ? seg(t, 0.4, 0.8) : 1) : 0, 'c');
  const rows = step >= 5
    ? [{ tex: String.raw`\v R\cdot\v v_B`, ink: VEL }, { tex: String.raw`+\ \v M_B\cdot\v\omega`, ink: OMEGA }]
    : [{ tex: String.raw`\v R\cdot\v v_B`, ink: VEL }];
  sb.label('title-R', [mid(rx0, rx1) - 2, step >= 5 ? 34 : 42], '', 'fg', step >= 4 ? (step === 4 ? seg(t, 0.6, 1) : 1) : 0, 'c', { rows });
  const eq = step === 6 ? ease(seg(t, 0.55, 0.95)) : 0;
  S('eq', 'line', 'k7-eq', [[lx1 + 2, yP(tot)], [lx1 + 2 + 7 * eq, yP(tot)]], eq > 0.01 ? 1 : 0);
  S('eq2', 'line', 'k7-eq', [[rx0 - 2, yP(tot)], [rx0 - 2 - 7 * eq, yP(tot)]], eq > 0.01 ? 1 : 0);
  sb.label('lab-eq', [mid(lx1, rx0), yP(tot)], '=', 'fg', eq > 0.9 ? 1 : 0, 'c');

  // legend: translation part / rotation part (step 1 on)
  const lg = step >= 1 ? appear(step, 1, t, 0.3, 0.7) : 0;
  sb.label('leg-t', [6, 8], String.raw`\blacksquare\ \text{${de ? 'Verschiebungsteil' : 'translation part'}}`, VEL, lg, 'tl');
  sb.label('leg-r', [6, 28], String.raw`\blacksquare\ \text{${de ? 'Drehteil' : 'rotation part'}}`, OMEGA, lg, 'tl');

  // ---- the handwritten line of the step ----
  const bo = ease(seg(t, 0.7, 1));
  const BOX: Record<number, { tex: string; ink: Ink }[]> = {
    0: [{ tex: String.raw`\text{${de ? 'in' : 'in'}}\ B\ \text{${de ? 'bekannt' : 'known'}}\colon\ \v v_B,\ \v\omega`, ink: 'fg' }],
    1: [{ tex: String.raw`\v v_i = \v v_B + \v\omega\times\v{BA}_i`, ink: 'fg' }],
    2: [{ tex: String.raw`P_i = \v F_i\cdot\v v_i,\qquad P = P_1 + P_2`, ink: 'fg' }],
    3: [{ tex: String.raw`\v F_i\cdot\v v_i = \v F_i\cdot\v v_B + \v F_i\cdot(\v\omega\times\v{BA}_i)`, ink: 'fg' }],
    4: [{ tex: String.raw`\v F_1\cdot\v v_B + \v F_2\cdot\v v_B = (\v F_1 + \v F_2)\cdot\v v_B = \v R\cdot\v v_B`, ink: VEL }],
    5: [{ tex: String.raw`\v F_i\cdot(\v\omega\times\v{BA}_i) = \v\omega\cdot(\v{BA}_i\times\v F_i)`, ink: 'fg' }, { tex: String.raw`\sum_i \v\omega\cdot(\v{BA}_i\times\v F_i) = \v\omega\cdot\v M_B`, ink: OMEGA }],
    6: [{ tex: String.raw`P = \v R\cdot\v v_B + \v M_B\cdot\v\omega\quad\text{q.e.d.}`, ink: 'z' }],
  };
  sb.label('box' + step, [6, 294], '', 'fg', bo, 'bl', { box: true, rows: BOX[step] });

  return sb.finish({ step, p1: n.P[0], p2: n.P[1], total: tot, translation: n.translation, rotation: n.rotation, mb: n.MB });
}
