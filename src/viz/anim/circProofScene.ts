/**
 * Pure scene of proof 2 (lecture p. 16): every point P off the axis moves on a circle about μ.
 * Oblique view like the lecture's figure: μ vertical through O, D, A (all at rest); P off the axis;
 * D is the foot of the perpendicular from P onto μ.
 *
 *  step 0  set-up: μ with O, D, A; P with DP ⊥ μ; r_P from O
 *  step 1  goal: the circle about μ through P; v_P may point neither outward (along DP) nor up (along μ)
 *  step 2  SdpG for P and D (v_D = 0): v_P·DP = 0, so v_P ⊥ DP
 *  step 3  DP·DA stays constant (rigid body); its derivative gives v_P·DA = 0, so v_P ⊥ μ
 *  step 4  in cylindrical coordinates ρ̇ = 0 and ż = 0: P runs on the circle r_P = R e_ρ + z₀ e_z
 */
import type { Lang } from '../../i18n';
import { type Vec3, add, dot, scale, sub } from '../../physics/vec';
import { ease, project, seg, type P2, type View } from './geometry';
import { arrowHead, sceneBuilder, type Scene } from './scene';

export const CP = { R: 1.6, Z0: 1.35, ZA: 2.25, PHI0: 0.2 };
export const VIEW: View = { alpha: -Math.PI / 4, beta: (35 * Math.PI) / 180, cx: 172, cy: 282, s: 88 };
const EZ: Vec3 = [0, 0, 1];
const pr = (p: Vec3): P2 => project(p, VIEW);
const ur = (phi: number): Vec3 => [Math.cos(phi), Math.sin(phi), 0];
const ut = (phi: number): Vec3 => [-Math.sin(phi), Math.cos(phi), 0];
export const pointP = (phi: number): Vec3 => add(scale(CP.R, ur(phi)), [0, 0, CP.Z0]);
const O: Vec3 = [0, 0, 0], D: Vec3 = [0, 0, CP.Z0], A: Vec3 = [0, 0, CP.ZA];
const VLEN = 1.05, SQ = 0.2;

export function circProofScene(step: number, t: number, lang: Lang): Scene {
  const sb = sceneBuilder();
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => sb.shape({ key, kind, cls, pts, o, r });
  const arrow = (key: string, cls: string, a: Vec3, b: Vec3, o = 1) => {
    if (o <= 0.01) return;
    const A2 = pr(a), B2 = pr(b);
    if (Math.hypot(B2[0] - A2[0], B2[1] - A2[1]) < 1) return;
    S(key, 'line', cls, [A2, B2], o); S(key + '-h', 'polygon', cls.split(' ')[0] + '-head', arrowHead(A2, B2, 8), o);
  };
  const square = (key: string, c: Vec3, a: Vec3, b: Vec3, o: number) => {
    if (o > 0.01) S(key, 'polyline', 'an-ra', [add(c, scale(SQ, a)), add(add(c, scale(SQ, a)), scale(SQ, b)), add(c, scale(SQ, b))].map(pr), o);
  };
  const circle = (phi0: number, phi1: number, n = 72): P2[] => Array.from({ length: n + 1 }, (_, i) => pr(pointP(phi0 + ((phi1 - phi0) * i) / n)));

  const phi = step === 4 ? CP.PHI0 + 2 * Math.PI * ease(seg(t, 0.05, 0.85)) : CP.PHI0;
  const P = pointP(phi), uR = ur(phi), uT = ut(phi);

  // axis μ with the points at rest
  S('mu', 'line', 'an-axis', [pr([0, 0, -0.12]), pr([0, 0, 2.75])]);
  sb.label('lab-mu', add2(pr([0, 0, 2.75]), [0, -14]), String.raw`\mu`, 'fg', 1, 'c');

  // the circle: goal (dashed) from step 1, drawn solid while P runs round in step 4
  const goal = step === 0 ? 0 : step === 1 ? ease(seg(t, 0, 0.5)) : 1;
  if (goal > 0.01) S('circle-goal', 'polyline', 'an-path', circle(0, 2 * Math.PI), goal);
  if (step === 4 && phi > CP.PHI0 + 0.01) S('circle', 'polyline', 'an-circ', circle(CP.PHI0, phi));

  // r_P and DP
  arrow('rP', 'an-r', O, P);
  const mOP = pr(scale(0.55, P));
  sb.label('lab-rP', add2(mOP, [-4, -13]), String.raw`\v r_P`, 'r', 1, 'r');
  S('DP', 'line', 'an-rho', [pr(D), pr(P)]);
  square('ra-D', D, uR, EZ, step === 4 ? 1 - ease(seg(t, 0, 0.2)) : 1);
  sb.label('lab-R', add2(pr(add(D, scale(0.5 * CP.R, uR))), [4, -14]), 'R', 'rho', step === 4 ? ease(seg(t, 0.85, 1)) : 0, 'c');

  // step 1: the two forbidden directions at P (outward along DP, upward along μ)
  const forbidR = step === 1 ? ease(seg(t, 0.4, 0.8)) : step === 2 ? 1 - ease(seg(t, 0, 0.3)) : 0;
  const forbidZ = step === 1 ? ease(seg(t, 0.4, 0.8)) : step === 2 ? 1 : step === 3 ? 1 - ease(seg(t, 0, 0.3)) : 0;
  arrow('out', 'an-copy', P, add(P, scale(0.6, uR)), forbidR);
  arrow('up', 'an-copy', P, add(P, scale(0.6, EZ)), forbidZ);

  // v_P (tangent) from step 2 on
  const vo = step < 2 ? 0 : step === 2 ? ease(seg(t, 0.25, 0.6)) : 1;
  arrow('vP', 'an-v', P, add(P, scale(VLEN * vo, uT)), vo > 0.01 ? 1 : 0);
  sb.label('lab-vP', add2(pr(add(P, scale(VLEN * vo, uT))), [6, -12]), String.raw`\v v_P`, 'point', vo > 0.9 ? 1 : 0, 'l');
  const fade4 = step === 4 ? 1 - ease(seg(t, 0, 0.2)) : 1;
  square('ra-PD', P, scale(-1, uR), uT, step < 2 ? 0 : step === 2 ? ease(seg(t, 0.55, 0.8)) : fade4);
  const s3 = step < 3 ? 0 : step === 3 ? ease(seg(t, 0.3, 0.7)) : fade4;
  if (s3 > 0.01) S('vert', 'line', 'an-guide', [pr(add(P, scale(-0.45, EZ))), pr(add(P, scale(0.75, EZ)))], s3);
  square('ra-Pz', P, EZ, uT, s3);

  const box = (key: string, o: number, rows: { tex: string; ink: 'fg' | 'rho' | 'point' | 'z' }[]) => sb.label(key, [392, 8], '', 'fg', o, 'tr', { box: true, rows });
  box('box2', step === 2 ? ease(seg(t, 0.6, 1)) : 0, [
    { tex: String.raw`\v v_P\cdot\v{DP} = \v v_D\cdot\v{DP} = 0`, ink: 'fg' },
    { tex: String.raw`\v v_P \perp \v{DP}`, ink: 'rho' },
  ]);
  box('box3', step === 3 ? ease(seg(t, 0.6, 1)) : 0, [
    { tex: String.raw`\v{DP}\cdot\v{DA} = \text{${lang === 'de' ? 'konst.' : 'const.'}}`, ink: 'fg' },
    { tex: String.raw`\Rightarrow\ \v v_P\cdot\v{DA} = 0`, ink: 'fg' },
    { tex: String.raw`\v v_P \perp \mu`, ink: 'z' },
  ]);
  box('box4', step === 4 ? ease(seg(t, 0.8, 1)) : 0, [
    { tex: String.raw`\dot\rho = 0,\ \ \dot z = 0`, ink: 'fg' },
    { tex: String.raw`\v r_P = R\,\v e_\rho + z_0\,\v e_z`, ink: 'point' },
  ]);

  // points
  S('O', 'circle', 'an-o', [pr(O)], 1, 3.5);
  for (const [k, p] of [['D', D], ['A', A]] as const) S(k, 'circle', 'an-point', [pr(p)], 1, 4.5);
  S('P', 'circle', 'an-point', [pr(P)], 1, 5);
  sb.label('lab-O', add2(pr(O), [-14, 2]), 'O', 'fg', 1, 'c');
  sb.label('lab-D', add2(pr(D), [-15, 2]), 'D', 'point', 1, 'c');
  sb.label('lab-A', add2(pr(A), [-15, 2]), 'A', 'point', 1, 'c');
  sb.label('lab-P', add2(pr(P), [4, 17]), 'P', 'point', 1, 'c');
  const vP = scale(VLEN, uT);
  return sb.finish({ step, phi, vDP: dot(vP, sub(P, D)), vDA: dot(vP, sub(A, D)) });
}

function add2(p: P2, q: P2): P2 { return [p[0] + q[0], p[1] + q[1]]; }
