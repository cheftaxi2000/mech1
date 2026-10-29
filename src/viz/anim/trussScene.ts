/**
 * Pure scene of the truss example Fig. 3.24 (lecture 3.2 «Fachwerk»): bars 1–5 turn as one body about A, B slides with v_B = (−v, 0, 0).
 * e_x → right, e_y ↑, ω counter-clockwise positive. All numbers come from physics/truss.ts (solved from first principles).
 *
 *  step 0  given: A pin, B on a roller with v_B; wanted: ω_i, Z_i of all bars
 *  step 1  bars 1–5 are one body, Z_{1-5} ≡ A: v_C ⊥ AC, v_D ⊥ AD, v_E ⊥ AE (directions)
 *  step 2  bar 8: Z₈ = ⊥ to v_B through B ∩ ⊥ to v_E through E (the line AE); |Z₈B| = L/2, ω₈ = 2v/L
 *  step 3  v_E = ω₈ × Z₈E, so ω₁₋₅ = v/L; v_C, v_D, v_E drawn
 *  step 4  bar 6: v_F ⊥ DF (SdpG) and v_F,x = v_B,x (SdpG bar 7) ⇒ v_F = (−v, −v); Z₆ = middle of DF, ω₆ = 2v/L
 *  step 5  bar 7: Z₇ below B at distance L, ω₇ = v/L
 */
import type { Lang } from '../../i18n';
import { solveTruss, type Node } from '../../physics/truss';
import { ease, seg, type P2 } from './geometry';
import { arrowHead, sceneBuilder, type Scene } from './scene';

const DEG = Math.PI / 180;
export const TS = { S: 58, CX: 50, CY: 50, KV: 30, V: 1, L: 1 };
const sol = solveTruss(TS.V, TS.L);
const pt = (p: readonly [number, number]): P2 => [TS.CX + TS.S * p[0], TS.CY - TS.S * p[1]];
const NODES = Object.fromEntries((Object.keys(sol.P) as Node[]).map((n) => [n, pt(sol.P[n])])) as Record<Node, P2>;
const vec = (n: Node, k = TS.KV): P2 => [NODES[n][0] + k * sol.vel[n][0], NODES[n][1] - k * sol.vel[n][1]];

const BARS: { key: string; a: Node; b: Node; grp: 15 | 6 | 7 | 8; n: string }[] = [
  { key: 'b1', a: 'A', b: 'C', grp: 15, n: '1' }, { key: 'b2', a: 'A', b: 'D', grp: 15, n: '2' }, { key: 'b3', a: 'C', b: 'E', grp: 15, n: '3' },
  { key: 'b4', a: 'C', b: 'D', grp: 15, n: '4' }, { key: 'b5', a: 'D', b: 'E', grp: 15, n: '5' },
  { key: 'b6', a: 'D', b: 'F', grp: 6, n: '6' }, { key: 'b7', a: 'F', b: 'B', grp: 7, n: '7' }, { key: 'b8', a: 'E', b: 'B', grp: 8, n: '8' },
];

export function trussScene(step: number, t: number, lang: Lang): Scene {
  const sb = sceneBuilder();
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => sb.shape({ key, kind, cls, pts, o, r });
  const arrow = (key: string, cls: string, a: P2, b: P2, o = 1, head = 8) => {
    if (o <= 0.01 || Math.hypot(b[0] - a[0], b[1] - a[1]) < 1) return;
    const e: P2 = [a[0] + (b[0] - a[0]) * o, a[1] + (b[1] - a[1]) * o];
    S(key, 'line', cls, [a, e]); if (o > 0.95) S(key + '-h', 'polygon', cls.split(' ')[0] + '-head', arrowHead(a, b, head));
  };
  const de = lang === 'de';
  const sk = (k: number, a: number, b: number) => (step === k ? ease(seg(t, a, b)) : step > k ? 1 : 0); // appears during step k, stays
  const active: Record<number, 15 | 6 | 7 | 8 | 0> = { 0: 0, 1: 15, 2: 8, 3: 15, 4: 6, 5: 7 };
  const act = active[step];

  // supports: pin A (wall), roller B (ground below)
  S('wall', 'line', 'ld-ground', [[NODES.A[0] - 12, NODES.A[1] - 30], [NODES.A[0] - 12, NODES.A[1] + 30]]);
  for (let i = 0; i < 6; i++) S('hw' + i, 'line', 'ld-hatch', [[NODES.A[0] - 12, NODES.A[1] - 26 + i * 10], [NODES.A[0] - 20, NODES.A[1] - 18 + i * 10]]);
  S('rollerA', 'line', 'ld-ground', [[NODES.A[0] - 12, NODES.A[1]], [NODES.A[0], NODES.A[1]]]);
  const gy = NODES.B[1] + 24;
  S('ground', 'line', 'ld-ground', [[NODES.B[0] - 30, gy], [NODES.B[0] + 30, gy]]);
  for (let i = 0; i < 7; i++) S('hg' + i, 'line', 'ld-hatch', [[NODES.B[0] - 26 + i * 9, gy], [NODES.B[0] - 32 + i * 9, gy + 7]]);
  S('rol1', 'circle', 'tr-roll', [[NODES.B[0] - 9, gy - 4]], 1, 4); S('rol2', 'circle', 'tr-roll', [[NODES.B[0] + 9, gy - 4]], 1, 4);
  S('stem', 'line', 'ld-ground', [NODES.B, [NODES.B[0], gy - 8]]);

  // bars
  for (const b of BARS) S(b.key, 'line', 'tr-bar' + (act === b.grp ? ' on' : ''), [NODES[b.a], NODES[b.b]]);
  const numPos: Record<string, P2> = {
    b1: [NODES.A[0] + 0.5 * (NODES.C[0] - NODES.A[0]), NODES.A[1] - 11], b2: [NODES.A[0] + 0.4 * 58 - 11, NODES.A[1] + 0.4 * 58 + 6], b3: [NODES.C[0] + 0.3 * 58 + 12, NODES.C[1] + 0.3 * 58 - 6],
    b4: [NODES.C[0] + 11, NODES.C[1] + 36], b5: [(NODES.D[0] + NODES.E[0]) / 2, NODES.D[1] + 11], b6: [(NODES.D[0] + NODES.F[0]) / 2 - 12, (NODES.D[1] + NODES.F[1]) / 2 + 6],
    b7: [(NODES.F[0] + NODES.B[0]) / 2, NODES.F[1] - 11], b8: [(NODES.E[0] + NODES.B[0]) / 2 - 13, (NODES.E[1] + NODES.B[1]) / 2 + 8],
  };
  for (const b of BARS) sb.label('n' + b.n, numPos[b.key], b.n, 'muted', 1, 'c');

  // step 0: v_B
  const bo: P2 = [NODES.B[0], NODES.B[1] + 9];
  const vB: P2 = [bo[0] + TS.KV * sol.vel.B[0], bo[1]];
  arrow('vB', 'an-v', bo, vB, 1);
  sb.label('lab-vB', [vB[0] - 6, vB[1] + 1], String.raw`\v v_B`, 'point', 1, 'r');

  // step 1: directions of v_C, v_D, v_E (dashed, perpendicular to the lines from A)
  const dirs = sk(1, 0.1, 0.8);
  if (dirs > 0.01) for (const n of ['C', 'D', 'E'] as const) {
    const d = [NODES[n][0] - NODES.A[0], NODES[n][1] - NODES.A[1]]; const l = Math.hypot(d[0], d[1]); const u: P2 = [-d[1] / l, d[0] / l];
    if (step < 3) S('dir' + n, 'line', 'pl-dir', [[NODES[n][0] - 30 * u[0] * dirs, NODES[n][1] - 30 * u[1] * dirs], [NODES[n][0] + 30 * u[0] * dirs, NODES[n][1] + 30 * u[1] * dirs]]);
  }
  // step 2: the perpendiculars and Z₈
  const pB = sk(2, 0.05, 0.5), pE = sk(2, 0.3, 0.75);
  if (pB > 0.01) S('perpB', 'line', 'pl-perp', [NODES.B, [NODES.B[0], NODES.B[1] + (pt(sol.Z8)[1] - NODES.B[1]) * pB * 1.0 - 0 * 0]]);
  if (pE > 0.01) S('perpE', 'line', 'pl-perp', [NODES.E, [NODES.E[0] + (pt(sol.Z8)[0] - NODES.E[0]) * pE, NODES.E[1] + (pt(sol.Z8)[1] - NODES.E[1]) * pE]]);
  const z8 = sk(2, 0.6, 0.85);
  if (z8 > 0.01) S('Z8', 'circle', 'rl-mc', [pt(sol.Z8)], z8, 6);
  sb.label('lab-Z8', [pt(sol.Z8)[0] + 18, pt(sol.Z8)[1] - 14], String.raw`Z_8`, 'angle', z8 > 0.9 ? 1 : 0, 'c');
  const d8 = sk(2, 0.8, 1);
  if (d8 > 0.01 && step >= 2) { // |Z₈B| = L/2: dimension line right of B
    const zb: P2 = pt(sol.Z8);
    S('dZ8', 'line', 'pl-dist', [[zb[0] + 14, zb[1]], [zb[0] + 14, NODES.B[1]]], d8);
    sb.label('lab-dZ8', [zb[0] + 17, (zb[1] + NODES.B[1]) / 2], String.raw`\tfrac{L}{2}`, 'angle', d8 > 0.9 && step === 2 ? 1 : 0, 'l');
  }
  const rotArc = (key: string, c: P2, ccw: boolean, o: number, a0deg: number, r = 20) => {
    if (o <= 0.01) return;
    const sweep = 105 * DEG * o * (ccw ? 1 : -1), a0 = a0deg * DEG;
    const ps = Array.from({ length: 25 }, (_, i) => { const a = a0 + (sweep * i) / 24; return [c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)] as P2; });
    S(key, 'polyline', 'pl-w-arc', ps); if (o > 0.95) S(key + '-h', 'polygon', 'pl-w-head', arrowHead(ps[ps.length - 2], ps[ps.length - 1], 8));
  };
  rotArc('w8', pt(sol.Z8), false, step === 2 ? ease(seg(t, 0.8, 1)) : step >= 2 && step <= 3 ? 1 : 0, 150, 18);
  sb.label('lab-w8', [pt(sol.Z8)[0] - 32, pt(sol.Z8)[1] - 22], String.raw`\omega_8`, 'angle', step === 2 && t > 0.9 || step === 3 ? 1 : 0, 'c');

  // step 3: v_E, v_D, v_C and ω₁₋₅
  const vk = sk(3, 0.05, 0.6);
  for (const n of ['E', 'D', 'C'] as const) arrow('v' + n, 'an-v', NODES[n], [NODES[n][0] + (vec(n)[0] - NODES[n][0]) * vk, NODES[n][1] + (vec(n)[1] - NODES[n][1]) * vk], 1);
  if (step >= 3) {
    sb.label('lab-vE', [vec('E')[0] + 12, vec('E')[1] + 4], String.raw`\v v_E`, 'point', vk > 0.9 ? 1 : 0, 'c');
    sb.label('lab-vD', [vec('D')[0] + 12, vec('D')[1] - 4], String.raw`\v v_D`, 'point', vk > 0.9 ? 1 : 0, 'c');
    sb.label('lab-vC', [vec('C')[0] + 14, vec('C')[1] - 2], String.raw`\v v_C`, 'point', vk > 0.9 ? 1 : 0, 'c');
  }
  const wk = sk(3, 0.6, 0.95);
  rotArc('w15', NODES.A, true, step === 3 ? wk : step > 3 ? 1 : 0, -70, 20);
  sb.label('lab-w15', [NODES.A[0] + 46, NODES.A[1] + 16], String.raw`\omega_{1\text{-}5}`, 'angle', step === 3 && wk > 0.9 || step > 3 ? 1 : 0, 'c');

  // step 4: v_F, Z₆, ω₆
  const f4 = sk(4, 0.05, 0.5);
  if (step >= 4) {
    const e = vec('F'); arrow('vF', 'an-v', NODES.F, [NODES.F[0] + (e[0] - NODES.F[0]) * f4, NODES.F[1] + (e[1] - NODES.F[1]) * f4], 1);
    sb.label('lab-vF', [e[0] - 4, e[1] + 14], String.raw`\v v_F`, 'point', f4 > 0.9 ? 1 : 0, 'c');
  }
  const z6 = sk(4, 0.5, 0.8);
  if (z6 > 0.01) S('Z6', 'circle', 'rl-mc', [pt(sol.Z6)], z6, 6);
  sb.label('lab-Z6', [pt(sol.Z6)[0] + 14, pt(sol.Z6)[1] + 14], String.raw`Z_6`, 'angle', z6 > 0.9 ? 1 : 0, 'c');
  rotArc('w6', pt(sol.Z6), false, sk(4, 0.7, 1), 40, 16);

  // step 5: Z₇ and ω₇
  const p7 = sk(5, 0.05, 0.6);
  if (p7 > 0.01) {
    const z7 = pt(sol.Z7);
    S('perpB7', 'line', 'pl-perp', [NODES.B, [NODES.B[0], NODES.B[1] + (z7[1] - NODES.B[1]) * p7]]);
    S('perpF7', 'line', 'pl-perp', [NODES.F, [NODES.F[0] + (z7[0] - NODES.F[0]) * p7, NODES.F[1] + (z7[1] - NODES.F[1]) * p7]]);
  }
  const z7o = sk(5, 0.55, 0.85);
  if (z7o > 0.01) S('Z7', 'circle', 'rl-mc', [pt(sol.Z7)], z7o, 6);
  sb.label('lab-Z7', [pt(sol.Z7)[0] + 18, pt(sol.Z7)[1] + 2], String.raw`Z_7`, 'angle', z7o > 0.9 ? 1 : 0, 'c');
  rotArc('w7', pt(sol.Z7), true, sk(5, 0.75, 1), 200, 16);

  // points and names
  for (const n of Object.keys(NODES) as Node[]) S('pt' + n, 'circle', 'an-point', [NODES[n]], 1, 4.5);
  const off: Record<Node, P2> = { A: [-2, -16], C: [10, -14], D: [-14, -6], E: [-14, -12], F: [-14, 8], B: [-16, -12] };
  for (const n of Object.keys(NODES) as Node[]) sb.label('lab-' + n, [NODES[n][0] + off[n][0], NODES[n][1] + off[n][1]], n, 'point', 1, 'c');

  // boxes (right side, free area)
  const box = (key: string, o: number, rows: { tex: string; ink: 'fg' | 'point' | 'angle' | 'muted' }[]) => sb.label(key, [394, 6], '', 'fg', o, 'tr', { box: true, rows });
  box('box0', step === 0 ? ease(seg(t, 0.4, 0.8)) : 0, [{ tex: String.raw`\v v_B = (-v,\,0,\,0)`, ink: 'point' }, { tex: String.raw`\omega_i,\ Z_i\ ?`, ink: 'angle' }]);
  box('box1', step === 1 ? ease(seg(t, 0.6, 0.95)) : 0, [{ tex: String.raw`Z_{1\text{-}5} \equiv A`, ink: 'angle' }, { tex: String.raw`\v v_C\perp AC`, ink: 'fg' }, { tex: String.raw`\v v_D\perp AD`, ink: 'fg' }, { tex: String.raw`\v v_E\perp AE`, ink: 'fg' }]);
  box('box2', step === 2 ? ease(seg(t, 0.75, 1)) : 0, [{ tex: String.raw`|Z_8B| = \tfrac L2`, ink: 'angle' }, { tex: String.raw`\omega_8 = \frac{2v}{L}`, ink: 'angle' }]);
  box('box3', step === 3 ? ease(seg(t, 0.8, 1)) : 0, [{ tex: String.raw`\omega_{1\text{-}5}|AE|`, ink: 'fg' }, { tex: String.raw`= \omega_8|Z_8E|`, ink: 'fg' }, { tex: String.raw`\omega_{1\text{-}5} = \tfrac vL`, ink: 'angle' }]);
  box('box4', step === 4 ? ease(seg(t, 0.75, 1)) : 0, [{ tex: String.raw`\v v_F = (-v,-v,0)`, ink: 'point' }, { tex: String.raw`\omega_6 = \tfrac{2v}{L}`, ink: 'angle' }]);
  box('box5', step === 5 ? ease(seg(t, 0.8, 1)) : 0, [{ tex: String.raw`|Z_7B| = L`, ink: 'angle' }, { tex: String.raw`\omega_7 = \tfrac vL`, ink: 'angle' }]);
  void de;
  return sb.finish({ step, w15: sol.w15, w6: sol.w6, w7: sol.w7, w8: sol.w8 });
}
