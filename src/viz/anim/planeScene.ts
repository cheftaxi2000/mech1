/**
 * Pure scene of «3.1 Ebene Bewegung» (lecture p. 26): why a plane motion forces ω ⊥ E. Oblique view as Fig. 1.4
 * (x toward the lower right, y toward the upper right, z up); the plate K_E lies in the plane E (z = 0).
 *
 *  step 0  the plate moves in its plane E; every point stays in E, so v_P = (v_Px, v_Py, 0)
 *  step 1  a second point A: v_A = v_P + ω × PA; with ω ⊥ E the part ω × PA lies in E as well
 *  step 2  ω tilted (ω_y ≠ 0), PA along x: ω × PA gets a z-part v_Az = −ω_y PA_x — A would leave E ⇒ ω_y = 0
 *  step 3  ω tilted the other way (ω_x ≠ 0), PA along y: v_Az = ω_x PA_y ⇒ ω_x = 0
 *  step 4  so ω = (0, 0, ω_z) ⊥ E (rotation about μ ⊥ E through the point at rest Z) or ω = 0 (translation)
 */
import type { Lang } from '../../i18n';
import { outOfPlane } from '../../physics/plane';
import { add, cross, scale, type Vec3 } from '../../physics/vec';
import { ease, project, seg, type P2, type View } from './geometry';
import { arrowHead, sceneBuilder, type Scene } from './scene';

export const PV: View = { alpha: -Math.PI / 4, beta: (27 * Math.PI) / 180, cx: 168, cy: 178, s: 74 };
const pr = (p: Vec3): P2 => project(p, PV);
/** The plate (body cross-section K_E) relative to P, and the marked points. */
const PLATE: [number, number][] = [[-1.25, -0.55], [-0.6, -1.2], [0.55, -1.05], [1.55, -0.35], [1.55, 0.55], [0.75, 1.55], [-0.35, 1.35], [-1.2, 0.7]];
export const PE = { P: [0, 0, 0] as Vec3, AX: [1.2, 0, 0] as Vec3, AY: [0, 1.25, 0] as Vec3, vP: [0.9, 0.2, 0] as Vec3, WZ: 0.6, TILT: 0.45, KV: 1.05, KW: 1.25 };
/** ω of each step's final frame (steps 2 and 3 tilted). */
export const omegaOf = (step: number): Vec3 => (step === 2 ? [0, -PE.TILT, PE.WZ] : step === 3 ? [PE.TILT, 0, PE.WZ] : [0, 0, PE.WZ]);

export function planeScene(step: number, t: number, lang: Lang): Scene {
  const sb = sceneBuilder();
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => sb.shape({ key, kind, cls, pts, o, r });
  const arrow = (key: string, cls: string, a: Vec3, b: Vec3, o = 1, head = 8) => {
    if (o <= 0.01) return;
    const A2 = pr(a), B2 = pr(b);
    if (Math.hypot(B2[0] - A2[0], B2[1] - A2[1]) < 1) return;
    S(key, 'line', cls, [A2, B2], o); S(key + '-h', 'polygon', cls.split(' ')[0] + '-head', arrowHead(A2, B2, head), o);
  };
  const de = lang === 'de';

  // step 0: the plate slides and turns in E (ends in the rest position)
  const mv = step === 0 ? 1 - ease(seg(t, 0, 0.6)) : 0;
  const sh: Vec3 = [-0.55 * mv, -0.35 * mv, 0], th = 0.5 * mv;
  const place = (p: Vec3): Vec3 => add(sh, [Math.cos(th) * p[0] - Math.sin(th) * p[1], Math.sin(th) * p[0] + Math.cos(th) * p[1], 0]);

  // the plane E (larger, faint) and the plate K_E
  S('E', 'polygon', 'pl-plane', [pr([-1.55, -1.45, 0]), pr([2.15, -1.45, 0]), pr([2.15, 2.1, 0]), pr([-1.55, 2.1, 0])]);
  sb.label('lab-E', add2(pr([2.15, -1.45, 0]), [0, -14]), 'E', 'muted', 1, 'c');
  S('plate', 'polygon', 'an-body', PLATE.map(([x, y]) => pr(place([x, y, 0]))));
  sb.label('lab-KE', pr(place([-0.75, -0.1, 0])), 'K_E', 'muted', 1, 'c');

  // small axis tripod (bottom left)
  const T0: P2 = [42, 252];
  for (const [k, d, ink] of [['x', [1, 0, 0], 'x'], ['y', [0, 1, 0], 'y'], ['z', [0, 0, 1], 'z']] as const) {
    const e = sub2(pr(d as unknown as Vec3), pr([0, 0, 0])), n = Math.hypot(e[0], e[1]), q: P2 = [T0[0] + (32 * e[0]) / n, T0[1] + (32 * e[1]) / n];
    S('ax-' + k, 'line', 'an-axis', [T0, q]); S('ax-' + k + '-h', 'polygon', 'an-axis-head', arrowHead(T0, q, 6));
    sb.label('lab-ax-' + k, [q[0] + (9 * e[0]) / n, q[1] + (9 * e[1]) / n - (k === 'z' ? 4 : 0)], k, ink, 1, 'c');
  }

  const P = place(PE.P), AX = place(PE.AX), AY = place(PE.AY);
  // v_P (in the plane)
  const vpo = step === 0 ? ease(seg(t, 0.6, 0.9)) : 1;
  arrow('vP', 'an-v', P, add(P, scale(PE.KV, PE.vP)), vpo);
  sb.label('lab-vP', add2(pr(add(P, scale(PE.KV, PE.vP))), [12, -6]), String.raw`\v v_P`, 'point', vpo > 0.9 ? 1 : 0, 'l');
  const box0 = step === 0 ? ease(seg(t, 0.8, 1)) : 0;
  sb.label('box0', [8, 8], '', 'fg', box0, 'tl', { box: true, rows: [{ tex: String.raw`\v v_P = (v_{Px},\, v_{Py},\, 0)`, ink: 'point' }] });

  // ω (purple) at P: vertical, tilting in steps 2 and 3
  const tilt = step === 2 || step === 3 ? ease(seg(t, 0, 0.35)) : 0;
  const w0 = omegaOf(1), w1 = omegaOf(step);
  const w: Vec3 = [w0[0] + (w1[0] - w0[0]) * tilt, w0[1] + (w1[1] - w0[1]) * tilt, w0[2]];
  const wo = step === 0 ? 0 : step === 1 ? ease(seg(t, 0, 0.3)) : 1;
  arrow('omega', 'kr-omega', P, add(P, scale(PE.KW / PE.WZ * 0.75, w)), wo, 10);
  sb.label('lab-w', add2(pr(add(P, scale((PE.KW / PE.WZ) * 0.75, w))), [9, -6]), String.raw`\v\omega`, 'angle', wo > 0.9 ? 1 : 0, 'l');

  // the point A of steps 1–2 (along x) and of step 3 (along y)
  const which = step === 3 ? AY : AX;
  const show = step >= 1 && step <= 3 ? 1 : 0;
  const pa = step === 1 ? ease(seg(t, 0.15, 0.45)) : show;
  arrow('PA', 'an-r', P, which, pa);
  sb.label('lab-PA', add2(midpoint(pr(P), pr(which)), step === 3 ? [-14, -8] : [-6, 14]), String.raw`\v{PA}`, 'r', pa > 0.9 ? 1 : 0, 'c');
  const wxPA = cross(w, sub3(which, P));
  const vo = step === 1 ? ease(seg(t, 0.45, 0.8)) : show;
  const vPa = add(which, scale(PE.KV, PE.vP));
  const dec = step === 1 ? vo : 0; // the split v_P + ω × PA is drawn in step 1 only
  arrow('vP-copy', 'an-copy', which, vPa, dec);
  arrow('wxPA', 'an-diff', vPa, add(vPa, scale(PE.KV, wxPA)), dec);
  const vA = add(PE.vP, wxPA);
  arrow('vA', 'an-v', which, add(which, scale(PE.KV, vA)), step === 1 ? ease(seg(t, 0.6, 0.9)) : show);
  const tipA = pr(add(which, scale(PE.KV, vA)));
  sb.label('lab-vA', add2(tipA, [10, -4]), String.raw`\v v_A`, 'point', (step === 1 && t > 0.9) || step === 2 || step === 3 ? 1 : 0, 'l');
  // the z-part (green) and the in-plane foot of v_A
  const vz = step === 2 || step === 3 ? ease(seg(t, 0.35, 0.65)) : 0;
  if (vz > 0.01) {
    const foot = add(which, scale(PE.KV, [vA[0], vA[1], 0]));
    S('vA-foot', 'line', 'an-guide', [pr(add(which, [0, 0, 0])), pr(foot)], vz);
    arrow('vAz', 'an-leg-z', foot, add(foot, [0, 0, PE.KV * vA[2]]), vz, 9);
    sb.label('lab-vAz', add2(pr(add(foot, [0, 0, 0.5 * PE.KV * vA[2]])), [10, 0]), String.raw`v_{Az}`, 'z', vz > 0.9 ? 1 : 0, 'l');
  }
  sb.label('lab-A', add2(pr(which), step === 3 ? [12, 10] : [-2, 16]), 'A', 'point', show ? (step === 1 ? (pa > 0.9 ? 1 : 0) : 1) : 0, 'c');
  if (show && pa > 0.01) S('A', 'circle', 'an-point', [pr(which)], pa, 4.5);

  const box1 = step === 1 ? ease(seg(t, 0.8, 1)) : 0;
  sb.label('box1', [8, 8], '', 'fg', box1, 'tl', { box: true, rows: [{ tex: String.raw`\v v_A = \v v_P + \v\omega\times\v{PA}`, ink: 'fg' }, { tex: String.raw`v_{Az} = 0 \ \checkmark`, ink: 'z' }] });
  const box2 = step === 2 ? ease(seg(t, 0.7, 1)) : 0;
  sb.label('box2', [8, 8], '', 'fg', box2, 'tl', { box: true, rows: [
    { tex: String.raw`\v{PA} = (PA_x,\, 0,\, 0)`, ink: 'r' },
    { tex: String.raw`v_{Az} = -\omega_y PA_x`, ink: 'z' },
    { tex: String.raw`v_{Az} = 0\ \Rightarrow\ \omega_y = 0`, ink: 'angle' },
  ] });
  const box3 = step === 3 ? ease(seg(t, 0.7, 1)) : 0;
  sb.label('box3', [8, 8], '', 'fg', box3, 'tl', { box: true, rows: [
    { tex: String.raw`\v{PA} = (0,\, PA_y,\, 0)`, ink: 'r' },
    { tex: String.raw`v_{Az} = \omega_x PA_y`, ink: 'z' },
    { tex: String.raw`v_{Az} = 0\ \Rightarrow\ \omega_x = 0`, ink: 'angle' },
  ] });

  // step 4: ω ⊥ E; the axis μ through the point at rest Z, perpendicular to E
  const mu = step === 4 ? ease(seg(t, 0.1, 0.6)) : 0;
  const Z: Vec3 = [P[0] - PE.vP[1] / PE.WZ, P[1] + PE.vP[0] / PE.WZ, 0];
  if (mu > 0.01) {
    S('mu', 'line', 'an-leg-rho', [pr(add(Z, [0, 0, -0.55])), pr(add(Z, [0, 0, -0.55 + 1.6 * mu]))], 1);
    S('Z', 'circle', 'rl-mc', [pr(Z)], mu, 5.5);
  }
  sb.label('lab-mu', add2(pr(add(Z, [0, 0, -0.42])), [-10, 0]), String.raw`\mu`, 'rho', mu > 0.9 ? 1 : 0, 'r');
  sb.label('lab-Z', add2(pr(Z), [-14, 10]), 'Z', 'angle', mu > 0.9 ? 1 : 0, 'c');
  const box4 = step === 4 ? ease(seg(t, 0.6, 0.95)) : 0;
  sb.label('box4', [392, 8], '', 'fg', box4, 'tr', { box: true, rows: [
    { tex: String.raw`\v\omega = (0,\, 0,\, \omega_z)`, ink: 'angle' },
    { tex: String.raw`\text{${de ? 'Rotation, ' : 'rotation, '}}\mu\perp E`, ink: 'angle' },
    { tex: String.raw`\text{${de ? 'oder' : 'or'}}\ \v\omega = \v 0\text{: ${de ? 'Translation' : 'translation'}}`, ink: 'muted' },
  ] });

  // P on top
  S('P', 'circle', 'an-point', [pr(P)], 1, 4.5);
  sb.label('lab-P', add2(pr(P), [-6, 15]), 'P', 'point', 1, 'c');
  return sb.finish({ step, tilt, vaz: vA[2], vazx: outOfPlane(omegaOf(2), [PE.AX[0], PE.AX[1]]), vazy: outOfPlane(omegaOf(3), [PE.AY[0], PE.AY[1]]) });
}

const add2 = (a: P2, b: P2): P2 => [a[0] + b[0], a[1] + b[1]];
const sub2 = (a: P2, b: P2): P2 => [a[0] - b[0], a[1] - b[1]];
const sub3 = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const midpoint = (a: P2, b: P2): P2 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
