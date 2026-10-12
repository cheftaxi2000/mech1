/**
 * Pure scene of "Rollen: momentane Rotation" (lecture p. 20): a cylinder rolls on a plane without sliding.
 * Oblique view: x (rolling direction) to the right, the cylinder's axis along y into the picture, z up.
 *
 *  step 0  the cylinder on the plane: contact line AB, its own axis CD, a marked line on its surface
 *  step 1  it rolls to the right without sliding; the points touching the ground are at rest
 *  step 2  A and B at rest ⇒ momentary rotation about μ = AB: velocities grow linearly with the height (C: v, top: 2v)
 *  step 3  it rolls on: another line touches, μ moves along (dashed: where μ just was) — rotation only momentary
 */
import type { Lang } from '../../i18n';
import { type Vec3 } from '../../physics/vec';
import { ease, hull, project, seg, type P2, type View } from './geometry';
import { arrowHead, sceneBuilder, type Scene } from './scene';

export const RS = { R: 0.72, L: 1.6, X0: 0.45, X1: 1.6, X2: 2.3, BETA_M: -0.9, KV: 0.62 };
export const VIEW_R: View = { alpha: -2.02, beta: (20 * Math.PI) / 180, cx: 109, cy: 262, s: 80 };
const pr = (p: Vec3): P2 => project(p, VIEW_R);
const N = 48;


/** Centre x of the cylinder in each step's frame (rolling without sliding: turned angle = distance / R). */
export function rollX(step: number, t: number): number {
  if (step === 0) return RS.X0;
  if (step === 1) return RS.X0 + (RS.X1 - RS.X0) * ease(seg(t, 0.05, 0.8));
  if (step === 2) return RS.X1;
  return RS.X1 + (RS.X2 - RS.X1) * ease(seg(t, 0.05, 0.75));
}
/** Velocity (along x) of the front-face point at height z above the ground, as drawn: proportional to z. */
export const drawnV = (z: number) => (RS.KV * z) / RS.R;

export function rollScene(step: number, t: number, lang: Lang): Scene {
  void lang;
  const sb = sceneBuilder();
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => sb.shape({ key, kind, cls, pts, o, r });
  const arrow = (key: string, cls: string, a: Vec3, b: Vec3, o = 1) => {
    if (o <= 0.01) return;
    const A2 = pr(a), B2 = pr(b);
    if (Math.hypot(B2[0] - A2[0], B2[1] - A2[1]) < 1) return;
    S(key, 'line', cls, [A2, B2], o); S(key + '-h', 'polygon', cls.split(' ')[0] + '-head', arrowHead(A2, B2, 8), o);
  };
  const { R, L } = RS;
  const xc = rollX(step, t), turn = (xc - RS.X0) / R;
  const rim = (y: number, b: number): Vec3 => [xc + R * Math.sin(b), y, R + R * Math.cos(b)];
  const circle = (y: number) => Array.from({ length: N }, (_, i) => pr(rim(y, (2 * Math.PI * i) / N)));

  // ground
  S('ground', 'polygon', 'rl-ground', [pr([-0.45, -0.35, 0]), pr([3.75, -0.35, 0]), pr([3.75, L + 0.35, 0]), pr([-0.45, L + 0.35, 0])]);

  // where μ was a moment ago (step 3)
  const old = step === 3 ? ease(seg(t, 0.1, 0.5)) : 0;
  if (old > 0.01) S('mu-old', 'line', 'an-guide', [pr([RS.X1, -0.25, 0]), pr([RS.X1, L + 0.25, 0])], old);

  // the cylinder: silhouette, back face (dashed), front face
  S('back', 'polyline', 'an-guide', [...circle(L), circle(L)[0]]);
  S('body', 'polygon', 'an-body', hull([...circle(0), ...circle(L)]));
  S('front', 'polygon', 'an-body', circle(0));
  // a marked line on the surface: it turns with the cylinder
  const bm = RS.BETA_M + turn;
  const facing = Math.sin(bm) * Math.cos(VIEW_R.beta) * Math.cos(VIEW_R.alpha) + Math.cos(bm) * Math.sin(VIEW_R.beta); // n·(towards the viewer)
  S('mark', 'line', facing >= 0 ? 'rl-mark' : 'rl-mark hidden', [pr(rim(0, bm)), pr(rim(L, bm))]);
  // its own axis CD
  S('CD', 'line', 'an-guide', [pr([xc, 0, R]), pr([xc, L, R])]);

  // contact line AB = μ
  const showMu = step >= 2 ? 1 : 0;
  S('AB', 'line', showMu ? 'an-leg-rho' : 'an-r thin', [pr([xc, -0.25 * showMu, 0]), pr([xc, L + 0.25 * showMu, 0])]);
  sb.label('lab-mu', addP(pr([xc, L + 0.25, 0]), [-8, -6]), String.raw`\mu`, 'rho', step >= 2 ? (step === 2 ? ease(seg(t, 0.6, 1)) : 1) : 0, 'r');

  // velocities on the front face: proportional to the height above AB
  const vo = step < 2 ? 0 : step === 2 ? ease(seg(t, 0.1, 0.6)) : 1;
  const hs = [0.5, 1, 1.5, 2].map((k) => k * R);
  for (const [i, z] of hs.entries()) arrow(`v${i}`, i === 1 ? 'an-v' : 'an-v thin', [xc, 0, z], [xc + drawnV(z) * vo, 0, z], vo > 0.01 ? 1 : 0);
  if (vo > 0.01) S('env', 'line', 'an-guide', [pr([xc, 0, 0]), pr([xc + drawnV(2 * R) * vo, 0, 2 * R])], vo);
  sb.label('lab-vC', addP(pr([xc + drawnV(R), 0, R]), [8, 2]), String.raw`\v v_C`, 'point', vo > 0.9 ? 1 : 0, 'l');
  sb.label('lab-v2', addP(pr([xc + drawnV(2 * R), 0, 2 * R]), [8, -2]), String.raw`2\,\v v_C`, 'point', vo > 0.9 ? 1 : 0, 'l');

  // step 1: the contact points are at rest
  const rest = step === 1 ? ease(seg(t, 0.8, 1)) : 0;
  sb.label('box1', [392, 8], '', 'fg', rest, 'tr', { box: true, rows: [{ tex: String.raw`\v v_A = \v v_B = \v 0`, ink: 'rho' }] });
  const box2 = step === 2 ? ease(seg(t, 0.6, 1)) : 0;
  sb.label('box2', [392, 8], '', 'fg', box2, 'tr', { box: true, rows: [
    { tex: String.raw`\v v_A = \v v_B = \v 0`, ink: 'fg' },
    { tex: String.raw`\Rightarrow\ \text{${lang === 'de' ? 'Rotation um' : 'rotation about'}}\ \mu = AB`, ink: 'rho' },
  ] });

  // points
  for (const [k, p] of [['A', [xc, 0, 0]], ['B', [xc, L, 0]], ['C', [xc, 0, R]], ['D', [xc, L, R]]] as const) S(k, 'circle', 'an-point', [pr(p as Vec3)], 1, 4.5);
  sb.label('lab-A', addP(pr([xc, 0, 0]), [6, 15]), 'A', 'point', 1, 'c');
  sb.label('lab-B', addP(pr([xc, L, 0]), [-15, 6]), 'B', 'point', 1, 'c');
  sb.label('lab-C', addP(pr([xc, 0, R]), [-14, 2]), 'C', 'point', 1, 'c');
  sb.label('lab-D', addP(pr([xc, L, R]), [-14, -4]), 'D', 'point', 1, 'c');
  return sb.finish({ step, xc, turn, vC: drawnV(R), vTop: drawnV(2 * R) });
}

function addP(p: P2, q: P2): P2 { return [p[0] + q[0], p[1] + q[1]]; }
