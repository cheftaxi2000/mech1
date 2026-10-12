/**
 * Pure scene of the proof on p. 21 (Fig. 3.11): in a Kreiselung (only O at rest) a whole axis μ through O is
 * momentarily at rest. Oblique view as in the lecture; the two planes E_M, E_N open like a book.
 *
 *  step 0  the body with O at rest, two points M, N and their velocities
 *  step 1  |r_M| = const ⇒ v_M ⊥ r_M; the plane E_M through M ⊥ v_M contains r_M, hence O
 *  step 2  the same for N; E_M and E_N intersect in a line μ through O
 *  step 3  A on μ: AM lies in E_M ⊥ v_M, so the SdpG gives v_A·AM = v_M·AM = 0; likewise v_A·AN = 0
 *  step 4  O is at rest too: v_A·AO = 0. AM, AN, AO point in three directions not in one plane ⇒ v_A = 0
 *  step 5  every point of μ is at rest: momentary rotation about μ, v = ω × r
 */
import type { Lang } from '../../i18n';
import { kreiselVelocity } from '../../physics/kreisel';
import { rotateAbout } from '../../physics/rotation';
import { type Vec3, add, cross, dot, normalize, scale, sub } from '../../physics/vec';
import { ease, hull, project, seg, type P2, type View } from './geometry';
import { arrowHead, sceneBuilder, type Scene } from './scene';

export const VIEW_K: View = { alpha: -Math.PI / 4, beta: (26 * Math.PI) / 180, cx: 200, cy: 250, s: 70 };
const pr = (p: Vec3): P2 => project(p, VIEW_K);
/** Direction of μ (= direction of ω), and the two in-plane directions of E_M, E_N perpendicular to μ. */
export const KD = normalize([0.12, 0.08, 1]);
const perp = (az: number): Vec3 => { const h: Vec3 = [Math.cos(az), Math.sin(az), 0]; return normalize(sub(h, scale(dot(h, KD), KD))); };
const PM = perp((170 * Math.PI) / 180), PN = perp((70 * Math.PI) / 180);
export const KP = {
  O: [0, 0, 0] as Vec3,
  M: add(scale(0.8, KD), scale(1.3, PM)),
  N: add(scale(1.6, KD), scale(1.2, PN)),
  A: scale(2.25, KD),
  W: 0.6, // |ω|: sets the drawn length of the velocities
};
export const OMEGA_K = scale(KP.W, KD);
const SQ = 0.26;
/** ω drawn along μ beyond its upper end (μ is drawn up to 2.75 along KD). */
export const W_FROM = 2.85, W_LEN = 0.95;

export function kreiselProofScene(step: number, t: number, lang: Lang): Scene {
  void lang;
  const sb = sceneBuilder();
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => sb.shape({ key, kind, cls, pts, o, r });
  const arrow = (key: string, cls: string, a: Vec3, b: Vec3, o = 1) => {
    if (o <= 0.01) return;
    const A2 = pr(a), B2 = pr(b);
    if (Math.hypot(B2[0] - A2[0], B2[1] - A2[1]) < 1) return;
    S(key, 'line', cls, [A2, B2], o); S(key + '-h', 'polygon', cls.split(' ')[0] + '-head', arrowHead(A2, B2, 8), o);
  };
  const square = (key: string, c: Vec3, a: Vec3, b: Vec3, o: number) => {
    const u = normalize(a), w = normalize(b);
    if (o > 0.01) S(key, 'polyline', 'an-ra', [add(c, scale(SQ, u)), add(add(c, scale(SQ, u)), scale(SQ, w)), add(c, scale(SQ, w))].map(pr), o);
  };
  const { O, M, N, A } = KP;
  const vM = kreiselVelocity(OMEGA_K, M), vN = kreiselVelocity(OMEGA_K, N);
  const fadeIn = (s: number, a = 0, b = 0.5) => (step < s ? 0 : step === s ? ease(seg(t, a, b)) : 1);

  // the body: an egg standing on its tip O (faint)
  const C0 = scale(1.25, KD);
  const blob: P2[] = [];
  for (let i = 0; i < 18; i++) for (let j = 1; j < 18; j++) {
    const th = (Math.PI * j) / 18, ph = (2 * Math.PI * i) / 18;
    blob.push(pr(add(C0, add(add(scale(1.55 * Math.sin(th) * Math.cos(ph), PM), scale(1.5 * Math.sin(th) * Math.sin(ph), PN)), scale(1.25 * Math.cos(th), KD)))));
  }
  blob.push(pr(O), pr(scale(2.5, KD)));
  S('body', 'polygon', 'an-body kr-body', hull(blob));

  // the planes E_M (step 1) and E_N (step 2): patches spanned by μ and the direction toward M or N
  const patch = (p: Vec3): P2[] => [[-0.12, -0.35], [2.45, -0.35], [2.45, 1.65], [-0.12, 1.65]].map(([a, b]) => pr(add(scale(a, KD), scale(b, p))));
  const eM = fadeIn(1, 0.45, 0.85), eN = fadeIn(2, 0.3, 0.65);
  const dim = step === 5 ? 1 - 0.6 * ease(seg(t, 0, 0.4)) : 1;
  if (eM > 0.01) S('EM', 'polygon', 'kr-plane em', patch(PM), eM * dim);
  if (eN > 0.01) S('EN', 'polygon', 'kr-plane en', patch(PN), eN * dim);
  sb.label('lab-EM', add2(pr(add(scale(2.3, KD), scale(1.55, PM))), [-4, 12]), 'E_M', 'x', eM > 0.9 ? dim : 0, 'r');
  sb.label('lab-EN', add2(pr(add(scale(2.3, KD), scale(1.55, PN))), [4, 12]), 'E_N', 'z', eN > 0.9 ? dim : 0, 'l');

  // μ = E_M ∩ E_N (step 2, after E_N)
  const mu = fadeIn(2, 0.6, 0.95);
  if (mu > 0.01) S('mu', 'line', 'an-leg-rho', [pr(scale(-0.12, KD)), pr(scale(2.75, KD))], mu);
  sb.label('lab-mu', add2(pr(scale(2.75, KD)), [12, 4]), String.raw`\mu`, 'rho', mu > 0.9 ? 1 : 0, 'l');

  // r_M, r_N with the right angle to the velocity
  const rM = fadeIn(1, 0, 0.3), rN = fadeIn(2, 0, 0.3);
  arrow('rM', 'an-r', O, M, rM);
  arrow('rN', 'an-r', O, N, rN);
  sb.label('lab-rM', add2(pr(scale(0.5, M)), [4, 14]), String.raw`\v r_M`, 'r', rM > 0.9 ? 1 : 0, 'c');
  sb.label('lab-rN', add2(pr(scale(0.5, N)), [-8, 8]), String.raw`\v r_N`, 'r', rN > 0.9 ? 1 : 0, 'r');
  square('ra-M', M, scale(-1, M), vM, step === 1 ? ease(seg(t, 0.2, 0.45)) : step === 2 ? 1 : 0);
  square('ra-N', N, scale(-1, N), vN, step === 2 ? ease(seg(t, 0.2, 0.45)) : 0);

  // step 3–4: A on μ and the three directions AM, AN, AO
  const aO = fadeIn(3, 0, 0.3);
  const legM = fadeIn(3, 0.2, 0.5), legO = fadeIn(4, 0, 0.4);
  if (legM > 0.01 && step < 5) {
    S('AM', 'line', 'kr-leg', [pr(A), pr(M)], legM);
    S('AN', 'line', 'kr-leg', [pr(A), pr(N)], legM);
  }
  if (legO > 0.01 && step < 5) S('AO', 'line', 'kr-leg strong', [pr(A), pr(O)], legO);

  // step 5: ω along μ, more points of μ at rest, the momentary circles of M and N about μ
  const rot = step === 5 ? ease(seg(t, 0.2, 0.6)) : 0;
  if (rot > 0.01) {
    // ω is a free vector ∥ μ: drawn as the continuation of μ above its end (as in Fig. 3.11), not on top of μ
    arrow('omega', 'kr-omega', scale(W_FROM, KD), scale(W_FROM + W_LEN * rot, KD));
    for (const [k, P] of [['cM', M], ['cN', N]] as const) S(k, 'polyline', 'an-path', Array.from({ length: 61 }, (_, i) => pr(rotateAbout(P, O, KD, (2 * Math.PI * i) / 60))), rot);
    for (const [i, a] of [0.75, 1.5, 2.6].entries()) S(`rest${i}`, 'circle', 'an-point ghost', [pr(scale(a, KD))], rot, 4);
  }
  sb.label('lab-omega', add2(pr(scale(W_FROM + 0.6 * W_LEN, KD)), [-10, 0]), String.raw`\v\omega`, 'angle', rot > 0.9 ? 1 : 0, 'r');

  // velocities of M and N
  const VS = 1.6;
  arrow('vM', 'an-v', M, add(M, scale(VS, vM)));
  arrow('vN', 'an-v', N, add(N, scale(VS, vN)));
  sb.label('lab-vM', add2(pr(add(M, scale(VS, vM))), [4, 15]), String.raw`\v v_M`, 'point', 1, 'c');
  sb.label('lab-vN', add2(pr(add(N, scale(VS, vN))), [9, -3]), String.raw`\v v_N`, 'point', 1, 'l');

  // boxes (top right)
  const box = (key: string, o: number, rows: { tex: string; ink: 'fg' | 'rho' | 'point' | 'angle' | 'muted' }[]) => sb.label(key, [394, 6], '', 'fg', o, 'tr', { box: true, rows });
  box('box1', step === 1 ? ease(seg(t, 0.75, 1)) : 0, [
    { tex: String.raw`|\v r_M| = \text{${lang === 'de' ? 'konst.' : 'const.'}}\ \Rightarrow\ \v v_M \perp \v r_M`, ink: 'fg' },
    { tex: String.raw`E_M \perp \v v_M\ \Rightarrow\ O \in E_M`, ink: 'muted' },
  ]);
  box('box2', step === 2 ? ease(seg(t, 0.75, 1)) : 0, [
    { tex: String.raw`O \in E_M,\ \ O \in E_N`, ink: 'fg' },
    { tex: String.raw`\mu = E_M \cap E_N`, ink: 'rho' },
  ]);
  box('box3', step === 3 ? ease(seg(t, 0.6, 1)) : 0, [
    { tex: String.raw`\v v_A\cdot\v{AM} = \v v_M\cdot\v{AM} = 0`, ink: 'fg' },
    { tex: String.raw`\v v_A\cdot\v{AN} = \v v_N\cdot\v{AN} = 0`, ink: 'fg' },
  ]);
  box('box4', step === 4 ? ease(seg(t, 0.5, 1)) : 0, [
    { tex: String.raw`\v v_A\cdot\v{AO} = \v v_O\cdot\v{AO} = 0`, ink: 'fg' },
    { tex: String.raw`\Rightarrow\ \v v_A = \v 0`, ink: 'point' },
  ]);
  box('box5', step === 5 ? ease(seg(t, 0.6, 1)) : 0, [
    { tex: String.raw`\v v = \v\omega\times\v r`, ink: 'fg' },
    { tex: String.raw`\v\omega \parallel \mu`, ink: 'angle' },
  ]);

  // points; O is held (a small support below it)
  const o2 = pr(O);
  S('pin', 'polygon', 'kr-pin', [o2, [o2[0] - 9, o2[1] + 15], [o2[0] + 9, o2[1] + 15]]);
  S('pin-base', 'line', 'kr-pin-base', [[o2[0] - 15, o2[1] + 15], [o2[0] + 15, o2[1] + 15]]);
  S('O', 'circle', 'an-o', [o2], 1, 3.5);
  sb.label('lab-O', add2(o2, [-15, 4]), 'O', 'fg', 1, 'c');
  S('M', 'circle', 'an-point', [pr(M)], 1, 4.5);
  S('N', 'circle', 'an-point', [pr(N)], 1, 4.5);
  sb.label('lab-M', add2(pr(M), [0, -15]), 'M', 'point', 1, 'c');
  sb.label('lab-N', add2(pr(N), [15, 3]), 'N', 'point', 1, 'c');
  if (aO > 0.01) S('A', 'circle', 'an-point', [pr(A)], aO, 4.5);
  sb.label('lab-A', add2(pr(A), [13, 6]), 'A', 'point', aO > 0.9 ? 1 : 0, 'c');

  const AM = sub(M, A), AN = sub(N, A), AO = sub(O, A);
  return sb.finish({ step, vMrM: dot(vM, M), vNrN: dot(vN, N), vA: Math.hypot(...kreiselVelocity(OMEGA_K, A)), spat: dot(cross(AM, AN), AO) });
}

function add2(p: P2, q: P2): P2 { return [p[0] + q[0], p[1] + q[1]]; }

