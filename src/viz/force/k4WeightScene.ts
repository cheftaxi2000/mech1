/**
 * Pure scene «Gewicht als Volumenkraft» (Skript p. 32, handwritten «das Gewicht»), one step per line:
 *  step 0  a body (box a × b × c) with the axes of the lecture; its weight sits in every little piece
 *  step 1  one small cube dV with its weight dG = −ρ g dV e_z
 *  step 2  the body is cut into many cubes, each with its own dG (the arrows differ: ρ may vary); G is the sum = −∭ ρ g dV e_z
 *  step 3  homogeneous body: ρ g is the same everywhere, all arrows are equal and add up to one: G = −ρ g V e_z
 */
import type { Lang } from '../../i18n';
import { ease, type P2 } from '../anim/geometry';
import { arrowHead, sceneBuilder, type Ink, type Scene } from '../anim/scene';
import { boxFaces } from './k4Box';

const OUT = 'out' as Ink;
export const WB = { a: 3, b: 2, c: 2, na: 4, nc: 3, d: 0.5 };
/** length factor of the small arrows in the cells of the left face (varying density in step 2, equal in step 3) */
export const cellK = (i: number, k: number, equal: number) => {
  const varying = 0.62 + 0.38 * Math.sin(1.7 * i + 2.1 * k + 0.4);
  return varying + (0.8 - varying) * equal;
};

export function weightScene(step: number, t: number, _lang: Lang): Scene {
  const sb = sceneBuilder();
  const e = ease(t);
  const { a, b, c, na, nc, d } = WB;
  const f = boxFaces(a, b, c);
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => { if (o > 0.01) sb.shape({ key, kind, cls, pts, o, r }); };
  const arrow = (key: string, a0: P2, b0: P2, o = 1, head = 7, cls = 'out') => {
    if (o <= 0.01 || Math.hypot(b0[0] - a0[0], b0[1] - a0[1]) < 3) return;
    S(key, 'line', `ks-${cls}`, [a0, b0], o); S(`${key}-h`, 'polygon', `ks-${cls}-h`, arrowHead(a0, b0, head), o);
  };
  // the body
  S('left', 'polygon', 'ks-body', f.left); S('right', 'polygon', 'ks-body', f.right); S('top', 'polygon', 'ks-body', f.top);
  // axes as in the lecture (small triad at the lower left)
  const O: P2 = [36, 268], ax = (v: [number, number, number]): P2 => { const p = f.P(v[0], v[1], v[2]), o = f.P(0, 0, 0); return [O[0] + 0.75 * (p[0] - o[0]), O[1] + 0.75 * (p[1] - o[1])]; };
  for (const [k, v, ink] of [['x', [1, 0, 0], 'x'], ['y', [0, 1, 0], 'y'], ['z', [0, 0, 1], 'z']] as const) {
    arrow(`ax-${k}`, O, ax(v as unknown as [number, number, number]), 1, 6, 'ld');
    const q = ax(v as unknown as [number, number, number]);
    sb.label(`ax-${k}`, [q[0] + (k === 'z' ? 0 : 9), q[1] + (k === 'z' ? -9 : 0)], `\\e ${k}`, ink, 1, 'c');
  }
  // step 1: one small cube dV at the near top corner
  const near: [number, number, number] = [a - d, 0, c - d];
  const Q = (x: number, y: number, z: number): P2 => f.P(near[0] + x, near[1] + y, near[2] + z);
  const cubeO = step === 1 ? e : step === 2 ? 1 - e : 0;
  S('dv-top', 'polygon', 'ks-bar', [Q(0, 0, d), Q(d, 0, d), Q(d, d, d), Q(0, d, d)], cubeO);
  S('dv-left', 'polygon', 'ks-bar', [Q(0, 0, 0), Q(d, 0, 0), Q(d, 0, d), Q(0, 0, d)], cubeO);
  S('dv-right', 'polygon', 'ks-bar', [Q(d, 0, 0), Q(d, d, 0), Q(d, d, d), Q(d, 0, d)], cubeO);
  const dvc = Q(d / 2, d / 2, d / 2);
  arrow('dG', dvc, [dvc[0], dvc[1] + 52 * (step === 1 ? e : step === 2 ? 1 - e : 0)], cubeO, 7);
  S('dv-dot', 'circle', 'ks-dot', [dvc], cubeO, 3);
  sb.label('dV', [dvc[0] + 22, dvc[1] - 26], '\\mathrm dV', 'muted', cubeO, 'l');
  sb.label('dG', [dvc[0] + 12, dvc[1] + 58], '\\mathrm d\\v G = -\\rho\\,g\\,\\mathrm dV\\,\\v e_z', OUT, cubeO, 'l');

  // step 2/3: the grid of cubes on the left face, a small arrow in each cell
  const gridO = step === 2 ? e : step === 3 ? 1 : 0;
  if (gridO > 0.01) {
    for (let i = 1; i < na; i++) S(`gx${i}`, 'line', 'ks-cut', [f.P((a * i) / na, 0, 0), f.P((a * i) / na, 0, c)], gridO);
    for (let k = 1; k < nc; k++) S(`gz${k}`, 'line', 'ks-cut', [f.P(0, 0, (c * k) / nc), f.P(a, 0, (c * k) / nc)], gridO);
    const small = step === 3 ? 1 - e : 1;
    const equal = step === 3 ? e : 0;
    for (let i = 0; i < na; i++) for (let k = 0; k < nc; k++) {
      const p = f.P(((i + 0.5) * a) / na, 0, ((k + 0.5) * c) / nc);
      arrow(`cell-${i}-${k}`, [p[0], p[1] - 9], [p[0], p[1] - 9 + 22 * cellK(i, k, equal)], gridO * small, 5);
    }
  }
  // step 3: one big arrow G from the centre
  const bigO = step === 3 ? e : 0;
  const gTip: P2 = [f.centre[0], f.centre[1] + 96 * bigO];
  arrow('G', f.centre, gTip, bigO, 10);
  S('G-dot', 'circle', 'ks-dot', [f.centre], bigO, 4);
  sb.label('G', [f.centre[0] + 14, gTip[1] - 8], '\\v G', OUT, bigO, 'l');

  // formulas
  if (step === 2) sb.label('eq', [388, 12], '', 'fg', e, 'tr', { box: true, rows: [{ tex: `\\v G = \\sum \\mathrm d\\v G`, ink: 'fg' }, { tex: `= -\\iiint_V \\rho\\,g\\,\\mathrm dV\\,\\v e_z`, ink: OUT }] });
  if (step === 3) sb.label('eq', [388, 12], '', 'fg', e, 'tr', { box: true, rows: [{ tex: `\\rho,\\ g\\ \\text{const.}`, ink: 'muted' }, { tex: `\\v G = -\\rho\\,g\\,V\\,\\v e_z`, ink: OUT }] });
  if (step === 0) sb.label('V', [f.top[2][0] + 6, f.top[2][1] - 4], 'V', 'rho', 1, 'l');
  return sb.finish({ step, big: bigO, cubes: na * nc });
}
