/**
 * Pure 3D frames for the lesson «Leistung bei Rotation und das Moment» (lecture pp. 33–35). z up, units: 1 length unit = 1 m,
 * 1 N, 1 m/s, 1 rad/s, 1 N·m are all drawn with length 1 (so a volume in the picture equals the number it stands for).
 *
 * The body K is a disc turning about the vertical axis μ ≡ z through O; P is a point of the disc, F̲ a force at P.
 *
 * deriveFrame — the derivation of p. 33:
 *   step 0  body, axis μ, ω̲, the point O on μ, the point P and OP̲
 *   step 1  v̲_P = ω̲ × OP̲ (tangent to the circle of P, ⟂ ω̲ and ⟂ OP̲)
 *   step 2  the force F̲ at P; only its part along v̲_P counts: P = F̲ · v̲_P
 *   step 3  the parallelepiped on (ω̲, OP̲, F̲), read as base (ω̲, OP̲) × height: (ω̲ × OP̲) · F̲ = v̲_P · F̲
 *   step 4  the same volume read as base (OP̲, F̲) × height: ω̲ · (OP̲ × F̲); the arrow OP̲ × F̲ is named M̲_O
 *   step 5  result P = ω̲ · M̲_O = ω M_z (only the part of M̲_O along the axis counts)
 *
 * refAnimFrame — the proof of p. 34 that P does not depend on the reference point O′ on μ (M̲_O′ ≠ M̲_O, same axis component):
 *   step 0  M̲_O at O and M̲_O′ at O′ are different arrows
 *   step 1  O′P̲ = O′O̲ + OP̲
 *   step 2  M̲_O′ = O′O̲ × F̲ + M̲_O (the arrows added)
 *   step 3  O′O̲ ∥ ω̲, so O′O̲ × F̲ ⟂ ω̲ and ω̲ · (O′O̲ × F̲) = 0
 *   step 4  both arrows have the same part along the axis: ω̲ · M̲_O′ = ω̲ · M̲_O, P = ω M_z
 */
import { fmtNum, type Lang } from '../../i18n';
import { moment, power, rotVelocity } from '../../physics/force';
import { heightOverBase, momentShift } from '../../physics/powerMoment';
import { add, cross, dot, norm, scale, sub, type Vec3 } from '../../physics/vec';
import { ease, seg } from '../anim/geometry';
import type { LabelPart } from '../RichLabel';

export type Col = 'force' | 'force2' | 'vel' | 'omega' | 'axis' | 'dark' | 'muted' | 'plus' | 'minus' | 'point';
export interface FArrow { key: string; from: Vec3; to: Vec3; col: Col; w: number; o?: number; double?: boolean }
export interface FLine { key: string; pts: Vec3[]; col: Col; w: number; dashed?: boolean; o?: number }
export interface FDot { key: string; at: Vec3; col: Col; r: number; o?: number }
export interface FLabel { key: string; at: Vec3; parts: LabelPart[]; col: Col; o?: number }
export interface FFace { key: string; pts: Vec3[]; col: Col; o: number }
export interface Frame3 {
  arrows: FArrow[]; lines: FLine[]; dots: FDot[]; labels: FLabel[]; faces: FFace[];
  /** opacity of the disc (the body K) */
  disc: number;
  /** the equation the step shows (TeX), '' = none */
  eq: string;
  /** camera of this frame (the figure's default view when absent) */
  cam?: { pos: Vec3; target: Vec3 };
  data: Record<string, number>;
}

/** The lesson's example: P at (1,2; 0; 0) on the x-axis, F̲ = (−0,5; 0,8; 0,5) N, ω = 1 rad/s about z, O′ at (0, 0, 1,2). */
export const K6 = {
  O: [0, 0, 0] as Vec3,
  P: [1.2, 0, 0] as Vec3,
  F: [-0.5, 0.8, 0.5] as Vec3,
  omega: [0, 0, 1] as Vec3,
  Op: [0, 0, 1.2] as Vec3,
  R_DISC: 1.65,
  /** drawn length of a moment per N·m in the reference-point figures (the derivation uses 1) */
  KM: 0.8,
};
export const K6_CAMERA: Vec3 = [4.0, -2.7, 3.4];
export const K6_TARGET: Vec3 = [0.7, -0.1, 0.8];
const DIRV: Vec3 = [4.1, -3.2, 3.2];
const camAt = (target: Vec3, k: number) => ({ target, pos: add(target, scale(k, DIRV)) });
/** views of the reference-point figures: wide (O, O′, P and the disc), close (the moment arrows around O) */
export const REF_CAM_WIDE = camAt([0.85, -0.3, 1.05], 0.8);
export const REF_CAM_CLOSE = camAt([0.35, -0.2, 0.8], 0.68);
const lerp3 = (a: Vec3, b: Vec3, k: number): Vec3 => add(a, scale(k, sub(b, a)));
const lerpCam = (a: { pos: Vec3; target: Vec3 }, b: { pos: Vec3; target: Vec3 }, k: number) => ({ pos: lerp3(a.pos, b.pos, k), target: lerp3(a.target, b.target, k) });

const ul = (t: string, sub?: string): LabelPart => ({ t, u: true, sub });
const up = (t: string): LabelPart => ({ t, up: true });
export const LAB = {
  omega: [ul('ω')], OP: [ul('OP')], vP: [ul('v', 'P')], F: [ul('F')], MO: [ul('M', 'O')], MOp: [ul('M', 'O′')], D: [ul('O′O'), up('×'), ul('F')],
  O: [{ t: 'O' }], Op: [{ t: 'O′' }], P: [{ t: 'P' }], mu: [{ t: 'μ' }], Mz: [{ t: 'M', sub: 'z' }], Mzp: [{ t: 'M', sub: 'z′' }],
} satisfies Record<string, LabelPart[]>;

const unit = (v: Vec3): Vec3 => scale(1 / norm(v), v);
const f2 = (x: number, lang: Lang) => fmtNum(x, 2, lang, true);

/** The 12 edges of the parallelepiped on a, b, c with a common vertex at the origin. */
export function boxEdges(a: Vec3, b: Vec3, c: Vec3): Vec3[][] {
  const V = (i: number, j: number, k: number): Vec3 => add(add(scale(i, a), scale(j, b)), scale(k, c));
  const e: Vec3[][] = [];
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { e.push([V(i, j, 0), V(i, j, 1)]); e.push([V(i, 0, j), V(i, 1, j)]); e.push([V(0, i, j), V(1, i, j)]); }
  return e;
}

/** circle of radius r about the z axis in the plane z = 0, from angle a0 to a1 */
const circle = (r: number, a0: number, a1: number, n = 64): Vec3[] => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [r * Math.cos(a), r * Math.sin(a), 0] as Vec3; });

/** Everything the derivation frames need, computed once (exported for the tests). */
export function deriveNumbers() {
  const { O, P, F, omega } = K6;
  const OP = sub(P, O), vP = rotVelocity(omega, O, P), M = moment(O, { A: P, F });
  const vhat = unit(vP), mhat = unit(M);
  const par = dot(F, vhat); // length of the strip (part of F along v_P)
  const Pw = power(F, vP);
  const h1 = heightOverBase(omega, OP, F), h2 = heightOverBase(OP, F, omega);
  return { OP, vP, M, vhat, mhat, par, P: Pw, h1, h2, base1: norm(cross(omega, OP)), base2: norm(cross(OP, F)), Mz: M[2] };
}

export const DERIVE_STEPS = 6;
export function deriveFrame(step: number, t: number, lang: Lang): Frame3 {
  const s = Math.max(0, Math.min(DERIVE_STEPS - 1, step));
  const { O, P, F, omega } = K6;
  const N = deriveNumbers();
  const arrows: FArrow[] = [], lines: FLine[] = [], dots: FDot[] = [], labels: FLabel[] = [], faces: FFace[] = [];
  /** progress of something that is introduced in step k between t0 and t1 and stays afterwards */
  const intro = (k: number, t0 = 0, t1 = 1) => (s < k ? 0 : s === k ? ease(seg(t, t0, t1)) : 1);
  const tipAt = (from: Vec3, v: Vec3, g: number): Vec3 => add(from, scale(g, v));
  let eq = '';

  // ---- always: the axis μ, the point O, ω̲, P and OP̲
  const zlo: Vec3 = [0, 0, -0.7], zhi: Vec3 = [0, 0, 1.85];
  lines.push({ key: 'mu', pts: [zlo, zhi], col: 'axis', w: 3.5 });
  labels.push({ key: 'mu', at: add(zhi, [0.1, 0, 0.1]), parts: LAB.mu, col: 'axis' });
  dots.push({ key: 'O', at: O, col: 'dark', r: 0.045 });
  labels.push({ key: 'O', at: [-0.2, -0.12, -0.14], parts: LAB.O, col: 'dark' });
  const gW = intro(0, 0.1, 0.55), gOP = intro(0, 0.4, 0.95);
  arrows.push({ key: 'omega', from: O, to: tipAt(O, omega, gW), col: 'omega', w: 5, double: true });
  if (gW > 0.9) labels.push({ key: 'omega', at: add(omega, [0.12, 0.08, 0.1]), parts: LAB.omega, col: 'omega' });
  arrows.push({ key: 'OP', from: O, to: tipAt(O, N.OP, gOP), col: 'dark', w: 3 });
  dots.push({ key: 'P', at: P, col: 'point', r: 0.05, o: gOP > 0.95 ? 1 : 0 });
  if (gOP > 0.95) {
    labels.push({ key: 'P', at: add(P, [0.2, -0.14, -0.16]), parts: LAB.P, col: 'point' });
    labels.push({ key: 'OP', at: add(scale(0.5, P), [0.05, -0.28, 0.02]), parts: LAB.OP, col: 'dark' });
  }

  // ---- step 1: v_P = ω × OP, tangent to the circle of P
  const gC = intro(1, 0, 0.6), gV = intro(1, 0.35, 1);
  if (gC > 0.01) lines.push({ key: 'circ', pts: circle(norm(N.OP), Math.atan2(N.OP[1], N.OP[0]), Math.atan2(N.OP[1], N.OP[0]) + 2 * Math.PI * gC), col: 'muted', w: 1.4, dashed: true, o: s === 1 ? 1 : 0.7 });
  const vO = s >= 3 ? (s === 3 ? 1 - 0.4 * intro(3, 0, 0.4) : 0.6) : 1;
  if (gV > 0.01) arrows.push({ key: 'vP', from: P, to: tipAt(P, N.vP, gV), col: 'vel', w: 4, o: vO });
  if (gV > 0.9) labels.push({ key: 'vP', at: add(add(P, N.vP), [-0.05, 0.12, 0.14]), parts: LAB.vP, col: 'vel', o: vO });
  if (s === 1 && gV > 0.9) eq = String.raw`\v v_P = \v\omega\times\v{OP}`;

  // ---- step 2: F at P, the strip along v_P
  const gF = intro(2, 0, 0.55), gS = intro(2, 0.5, 1);
  if (gF > 0.01) arrows.push({ key: 'F', from: P, to: tipAt(P, F, gF), col: 'force', w: 4.5 });
  if (gF > 0.9) labels.push({ key: 'F', at: add(add(P, F), [0.08, 0.06, 0.14]), parts: LAB.F, col: 'force' });
  const stripO = s === 2 ? 1 : s === 3 ? 1 - ease(seg(t, 0, 0.4)) : 0;
  if (stripO > 0.01) {
    const foot = add(P, scale(N.par * gS, N.vhat));
    lines.push({ key: 'strip', pts: [P, foot], col: N.par >= 0 ? 'plus' : 'minus', w: 7, o: 0.75 * stripO });
    lines.push({ key: 'drop', pts: [add(P, F), add(P, scale(N.par, N.vhat))], col: 'muted', w: 1.3, dashed: true, o: stripO * gS });
  }
  if (s === 2 && gS > 0.95) eq = String.raw`P = \v F\cdot\v v_P = ${f2(N.P, lang)}\,\text{W}`;

  // ---- step 3: the parallelepiped on (ω, OP, F), base (ω, OP)
  const gE = intro(3, 0, 0.5), gB = intro(3, 0.35, 0.85);
  const boxO = s <= 2 ? 0 : s === 5 ? 1 - 0.8 * ease(seg(t, 0, 0.6)) : 1;
  if (boxO > 0 && s >= 3) {
    for (const [i, e] of boxEdges(omega, N.OP, F).entries()) lines.push({ key: `box${i}`, pts: e, col: 'muted', w: 1.2, o: 0.85 * gE * boxO });
    // F as a free copy at O (only for the volume picture)
    arrows.push({ key: 'Fc', from: O, to: tipAt(O, F, gE), col: 'force', w: 2.4, o: 0.75 * boxO });
  }
  const f1o = s === 3 ? gB : s === 4 ? 1 - ease(seg(t, 0, 0.35)) : 0;
  if (f1o > 0.01) {
    faces.push({ key: 'base1', pts: [O, omega, add(omega, N.OP), N.OP], col: 'vel', o: 0.3 * f1o });
    const foot1 = sub(F, scale(dot(F, N.vhat), N.vhat));
    lines.push({ key: 'h1', pts: [F, foot1], col: 'dark', w: 1.8, dashed: true, o: f1o });
  }
  if (s === 3 && gB > 0.95) eq = String.raw`V = |\v v_P|\cdot h = \v v_P\cdot\v F = ${f2(N.P, lang)}`;

  // ---- step 4: the same box, base (OP, F); the normal is M_O
  const gM = intro(4, 0.25, 0.85), f2o = s === 4 ? ease(seg(t, 0.05, 0.4)) : s === 5 ? 1 - ease(seg(t, 0, 0.5)) : 0;
  if (f2o > 0.01) {
    faces.push({ key: 'base2', pts: [O, N.OP, add(N.OP, F), F], col: 'force', o: 0.3 * f2o });
    const foot2 = sub(omega, scale(dot(omega, N.mhat), N.mhat));
    lines.push({ key: 'h2', pts: [omega, foot2], col: 'dark', w: 1.8, dashed: true, o: f2o });
  }
  const mO = s < 4 ? 0 : 1;
  if (mO && gM > 0.01) arrows.push({ key: 'MO', from: O, to: tipAt(O, N.M, gM), col: 'force', w: 5, double: true });
  if (s >= 4 && gM > 0.9) labels.push({ key: 'MO', at: add(N.M, [0.12, -0.12, 0.12]), parts: LAB.MO, col: 'force' });
  if (s === 4 && gM > 0.95) eq = String.raw`V = |\v M_O|\cdot h' = \v\omega\cdot\v M_O = ${f2(dot(omega, N.M), lang)},\quad \v M_O = \v{OP}\times\v F`;

  // ---- step 5: only the part of M_O along the axis counts
  const gA = intro(5, 0.3, 0.95);
  if (s === 5 && gA > 0.01) {
    const zt: Vec3 = [0, 0, N.Mz * gA];
    lines.push({ key: 'Mz', pts: [O, zt], col: 'plus', w: 8, o: 0.8 });
    lines.push({ key: 'Mdrop', pts: [add(O, N.M), [0, 0, N.Mz]], col: 'muted', w: 1.3, dashed: true, o: gA });
    dots.push({ key: 'Mzdot', at: [0, 0, N.Mz], col: 'plus', r: 0.04, o: gA });
    if (gA > 0.9) labels.push({ key: 'Mz', at: [0.32, 0.12, N.Mz * 0.5], parts: LAB.Mz, col: 'plus' });
  }
  if (s === 5 && gA > 0.95) eq = String.raw`P = \v\omega\cdot\v M_O = \omega\,M_z = ${f2(1, lang)}\cdot ${f2(N.Mz, lang)} = ${f2(N.P, lang)}\,\text{W}`;

  return { arrows, lines, dots, labels, faces, disc: 1, eq, data: { step: s, par: N.par, P: N.P, V1: N.base1 * N.h1, V2: N.base2 * N.h2 } };
}

// ───────────────────────────── p. 34: the reference point O′ ─────────────────────────────

export const REF_STEPS = 5;
const KM = K6.KM;
type Cam = { pos: Vec3; target: Vec3 };

export function refNumbers(h: number, F: Vec3 = K6.F) {
  const O = K6.O, Op: Vec3 = [0, 0, h], P = K6.P;
  const s = momentShift(O, Op, P, F);
  return { Op, ...s, Mz: s.MO[2], Mzp: s.MOp[2], P: dot(K6.omega, s.MO), Pp: dot(K6.omega, s.MOp) };
}

/** Screen-fixed offsets: world vector for `right` units to the right and `upward` units up on the screen of camera `cam` (labels stay beside their arrows from any camera). */
export function screenOffset(cam: Cam, right: number, upward: number): Vec3 {
  const f = unit(sub(cam.target, cam.pos)), r = unit(cross(f, [0, 0, 1])), u = cross(r, f);
  return add(scale(right, r), scale(upward, u));
}

/** Camera of the reference-point animation: wide in steps 0–1, close in steps 2–4 (it moves during the first part of step 2). */
export function refCam(step: number, t: number): Cam {
  if (step < 2) return REF_CAM_WIDE;
  if (step === 2) return lerpCam(REF_CAM_WIDE, REF_CAM_CLOSE, ease(seg(t, 0, 0.3)));
  return REF_CAM_CLOSE;
}

export function refAnimFrame(step: number, t: number, lang: Lang): Frame3 {
  const s = Math.max(0, Math.min(REF_STEPS - 1, step));
  const { O, P, F, omega } = K6;
  const R = refNumbers(K6.Op[2]);
  const Op = R.Op;
  const cam = refCam(s, t);
  const arrows: FArrow[] = [], lines: FLine[] = [], dots: FDot[] = [], labels: FLabel[] = [], faces: FFace[] = [];
  const intro = (k: number, t0 = 0, t1 = 1) => (s < k ? 0 : s === k ? ease(seg(t, t0, t1)) : 1);
  const lab = (key: string, at: Vec3, parts: LabelPart[], col: Col, right = 0, upward = 0) => labels.push({ key, at: add(at, screenOffset(cam, right, upward)), parts, col });
  const tip = (from: Vec3, v: Vec3, g = 1): Vec3 => add(from, scale(g * KM, v));
  let eq = '';
  const near = s >= 2; // close view: the picture is reduced to the arrows around O

  lines.push({ key: 'mu', pts: [[0, 0, -0.7], [0, 0, 2.35]], col: 'axis', w: 3.5 });
  lab('mu', [0, 0, 2.35], LAB.mu, 'axis', 0.12, 0.05);
  dots.push({ key: 'O', at: O, col: 'dark', r: 0.045 }, { key: 'Op', at: Op, col: 'dark', r: 0.045 }, { key: 'P', at: P, col: 'point', r: 0.05, o: near ? 0 : 1 });
  lab('O', O, LAB.O, 'dark', -0.14, -0.1);
  lab('Op', Op, LAB.Op, 'dark', -0.16, 0.06);
  if (!near) lab('P', P, LAB.P, 'point', 0.12, -0.12);
  arrows.push({ key: 'omega', from: O, to: add(O, omega), col: 'omega', w: 4, double: true, o: s === 3 ? 1 : 0.5 });
  if (s === 3) lab('omega', omega, LAB.omega, 'omega', 0.14, 0.05);
  if (!near) arrows.push({ key: 'F', from: P, to: add(P, F), col: 'force', w: 3.2, o: 0.8 });
  if (!near) lab('F', add(P, F), LAB.F, 'force', 0.14, 0.08);
  if (!near) lines.push({ key: 'OP', pts: [O, P], col: 'dark', w: 2.2 });

  // ---- step 0: two moments, two different arrows
  const g0 = intro(0, 0.1, 0.85);
  const fadeM = s === 0 ? 1 : s === 1 ? 1 - ease(seg(t, 0, 0.4)) : 0;
  lines.push({ key: 'OpP', pts: [Op, P], col: 'dark', w: 2.2, dashed: true, o: s <= 1 ? 1 : 0.3 * 0 });
  if (fadeM > 0.01) {
    arrows.push({ key: 'MO', from: O, to: tip(O, R.MO, g0), col: 'force', w: 5, double: true, o: fadeM });
    arrows.push({ key: 'MOp', from: Op, to: tip(Op, R.MOp, g0), col: 'force2', w: 5, double: true, o: fadeM });
    if (s === 0 && g0 > 0.9) {
      lab('MO', tip(O, R.MO), LAB.MO, 'force', -0.2, 0.08);
      lab('MOp', tip(Op, R.MOp), LAB.MOp, 'force2', 0.2, 0.06);
      eq = String.raw`\v M_O \neq \v M_{O'}`;
    }
  }

  // ---- step 1: O′P = O′O + OP (the triangle in the vertical plane through O, O′ and P)
  if (s === 1) {
    const g1 = intro(1, 0.35, 0.7), g2 = intro(1, 0.65, 1);
    arrows.push({ key: 'OpO', from: Op, to: add(Op, scale(g1, sub(O, Op))), col: 'axis', w: 5 });
    if (g1 > 0.9) lab('OpO', scale(0.5, Op), [ul('O′O')], 'axis', 0.3, 0.05);
    if (g2 > 0.9) lab('OpP', scale(0.5, add(Op, P)), [ul('O′P')], 'dark', 0.2, 0.2);
    if (g2 > 0.9) lab('OPl', scale(0.5, P), LAB.OP, 'dark', 0.1, -0.22);
    if (g2 > 0.95) eq = String.raw`\v{O'P} = \v{O'O} + \v{OP}`;
  }

  // ---- steps 2–4: only the moment arrows around O. M_O′ slides down to O, D closes the triangle
  if (near) {
    const slide = s === 2 ? ease(seg(t, 0.15, 0.55)) : 1;
    const fromMOp = scale(1 - slide, Op);
    const gD = intro(2, 0.55, 1);
    arrows.push({ key: 'MO', from: O, to: tip(O, R.MO), col: 'force', w: 5, double: true });
    arrows.push({ key: 'MOp', from: fromMOp, to: add(fromMOp, scale(KM, R.MOp)), col: 'force2', w: 5, double: true });
    if (gD > 0.01) arrows.push({ key: 'D', from: tip(O, R.MO), to: add(tip(O, R.MO), scale(gD * KM, R.D)), col: 'dark', w: 3 });
    if (slide > 0.95) {
      lab('MO', tip(O, R.MO), LAB.MO, 'force', -0.22, 0.04);
      lab('MOp', tip(O, R.MOp), LAB.MOp, 'force2', 0.26, 0.0);
    }
    if (gD > 0.9) lab('D', add(tip(O, R.MO), scale(0.7 * KM, R.D)), LAB.D, 'dark', 0.12, 0.22);
    if (s === 2 && gD > 0.95) eq = String.raw`\v M_{O'} = \v{O'O}\times\v F + \v M_O`;
  }

  // ---- step 3: D ⟂ ω (a right angle at O between D and ω)
  if (s === 3) {
    const g3 = intro(3, 0.1, 0.8);
    const Dc = scale(KM, R.D), u = scale(0.2 / norm(Dc), Dc), q: Vec3 = [0, 0, 0.2];
    lines.push({ key: 'Dcopy', pts: [O, scale(g3, Dc)], col: 'dark', w: 2.4, dashed: true, o: 0.9 });
    lines.push({ key: 'ra', pts: [u, add(u, q), q], col: 'dark', w: 1.5, o: g3 });
    if (eq === '' && g3 > 0.95) eq = String.raw`\v\omega\cdot(\v{O'O}\times\v F) = 0`;
  }

  // ---- step 4: the same part along the axis
  if (s === 4) {
    const g4 = intro(4, 0.2, 0.9), z = KM * R.Mz;
    lines.push({ key: 'dropO', pts: [tip(O, R.MO), [0, 0, z]], col: 'dark', w: 2.2, dashed: true, o: g4 });
    lines.push({ key: 'dropOp', pts: [tip(O, R.MOp), [0, 0, z]], col: 'dark', w: 2.2, dashed: true, o: g4 });
    lines.push({ key: 'Mz', pts: [O, [0, 0, z * g4]], col: 'plus', w: 8, o: 0.8 });
    dots.push({ key: 'Mzdot', at: [0, 0, z], col: 'plus', r: 0.045, o: g4 });
    if (g4 > 0.9) lab('Mz', [0, 0, z * 0.4], [{ t: 'M', sub: 'z' }], 'plus', -0.3, -0.2);
    if (g4 > 0.95) eq = String.raw`\v\omega\cdot\v M_{O'} = \v\omega\cdot\v M_O = \omega M_z = ${f2(R.P, lang)}\,\text{W}`;
  }
  return { arrows, lines, dots, labels, faces, disc: near ? 0.35 : 1, eq, cam, data: { step: s, Mz: R.Mz, Mzp: R.Mzp, P: R.P } };
}

// ───────────────────────────── the explorer with the slider for O′ ─────────────────────────────

export interface RefOptions { h: number; F: Vec3; showD: boolean }
export const EXPLORER_CAM: Cam = camAt([0.85, -0.3, 1.0], 0.95);
export function refExplorerFrame({ h, F, showD }: RefOptions): Frame3 {
  const { O, P } = K6;
  const cam = EXPLORER_CAM;
  const R = refNumbers(h, F);
  const Op = R.Op;
  const arrows: FArrow[] = [], lines: FLine[] = [], dots: FDot[] = [], labels: FLabel[] = [], faces: FFace[] = [];
  const lab = (key: string, at: Vec3, parts: LabelPart[], col: Col, right = 0, upward = 0) => labels.push({ key, at: add(at, screenOffset(cam, right, upward)), parts, col });
  const tip = (from: Vec3, v: Vec3): Vec3 => add(from, scale(KM, v));
  const zlo = Math.min(-0.7, h - 0.4, h + KM * R.Mzp - 0.3, KM * R.Mz - 0.3), zhi = Math.max(1.5, h + 0.5, h + KM * R.Mzp + 0.35, KM * R.Mz + 0.35);
  lines.push({ key: 'mu', pts: [[0, 0, zlo], [0, 0, zhi]], col: 'axis', w: 3.5 });
  lab('mu', [0, 0, zhi], LAB.mu, 'axis', 0.12, 0.05);
  dots.push({ key: 'O', at: O, col: 'dark', r: 0.045 }, { key: 'Op', at: Op, col: 'dark', r: 0.045 }, { key: 'P', at: P, col: 'point', r: 0.05 });
  const near = Math.abs(h) < 0.3;
  lab('O', O, LAB.O, 'dark', -0.14, near ? -0.14 : -0.08);
  if (!near) lab('Op', Op, LAB.Op, 'dark', -0.16, 0.06);
  lab('P', P, LAB.P, 'point', 0.12, -0.12);
  arrows.push({ key: 'F', from: P, to: add(P, F), col: 'force', w: 3.2, o: 0.85 });
  lab('F', add(P, F), LAB.F, 'force', 0.14, 0.08);
  lines.push({ key: 'OP', pts: [O, P], col: 'dark', w: 2.2 });
  if (Math.abs(h) > 0.02) lines.push({ key: 'OpP', pts: [Op, P], col: 'dark', w: 2.2, dashed: true });
  // the two moments, each drawn from its own point
  arrows.push({ key: 'MO', from: O, to: tip(O, R.MO), col: 'force', w: 5, double: true });
  arrows.push({ key: 'MOp', from: Op, to: tip(Op, R.MOp), col: 'force2', w: 5, double: true, o: Math.abs(h) < 0.02 ? 0.35 : 1 });
  lab('MO', tip(O, R.MO), LAB.MO, 'force', -0.2, 0.06);
  if (!near) lab('MOp', tip(Op, R.MOp), LAB.MOp, 'force2', 0.2, 0.06);
  // the parts along the axis: the same length for both (offset sideways so they do not hide each other)
  const off = 0.07;
  if (Math.abs(R.Mz) > 0.01) {
    lines.push({ key: 'Mz', pts: [[-off, 0, 0], [-off, 0, KM * R.Mz]], col: 'plus', w: 7, o: 0.85 });
    lines.push({ key: 'Mzp', pts: [[off, 0, h], [off, 0, h + KM * R.Mzp]], col: 'plus', w: 7, o: 0.85 });
    lines.push({ key: 'dropO', pts: [tip(O, R.MO), [-off, 0, KM * R.Mz]], col: 'muted', w: 1.2, dashed: true });
    lines.push({ key: 'dropOp', pts: [tip(Op, R.MOp), [off, 0, h + KM * R.Mzp]], col: 'muted', w: 1.2, dashed: true });
  }
  if (showD && Math.abs(h) > 0.02 && norm(R.D) > 0.02) {
    arrows.push({ key: 'MOpC', from: O, to: tip(O, R.MOp), col: 'force2', w: 2.4, double: true, o: 0.55 });
    arrows.push({ key: 'D', from: tip(O, R.MO), to: add(tip(O, R.MO), scale(KM, R.D)), col: 'dark', w: 4 });
    lab('D', add(tip(O, R.MO), scale(0.5 * KM, R.D)), LAB.D, 'dark', 0.15, -0.2);
  }
  return { arrows, lines, dots, labels, faces, disc: 1, eq: '', cam, data: { h, Mz: R.Mz, Mzp: R.Mzp, P: R.P, Pp: R.Pp } };
}
