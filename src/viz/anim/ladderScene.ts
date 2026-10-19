/**
 * Pure scene of the ladder on p. 27 solved with the Momentanzentrum (the notes say «Löse mit SMZ», the student wrote
 * «Lösung fehlt» — the solution is an app supplement, R-022). Floor below, wall on the right, as in the notes;
 * e_x to the right, e_y up, e_z out of the page.
 *
 *  step 0  given: v_A = (−v_H, 0, 0) to the left; v_B = (0, −v_V, 0) points down, its size is wanted
 *  step 1  perpendicular to v_A through A: the vertical through A
 *  step 2  perpendicular to v_B through B: the horizontal through B
 *  step 3  they meet in Z; |ZA| = L sin φ, |ZB| = L cos φ
 *  step 4  v_A = ω·|ZA| ⇒ ω = v_H/(L sin φ), clockwise
 *  step 5  v_B = ω·|ZB| ⇒ v_V = ω L cos φ = v_H cot φ (the SdpG result)
 *  step 6  the ladder slides down: Z moves — always at distance L from the corner C (a quarter circle)
 */
import type { Lang } from '../../i18n';
import { ladderMZ, type P2 as Q2 } from '../../physics/plane';
import { ease, seg, type P2 } from './geometry';
import { arrowHead, sceneBuilder, type Scene } from './scene';

const DEG = Math.PI / 180;
export const LS = { L: 1, VH: 1, PHI0: 50 * DEG, PHI1: 34 * DEG, S: 186, CX: 330, CY: 268, KV: 52 };
const sv = (p: Q2): P2 => [LS.CX + LS.S * p[0], LS.CY - LS.S * p[1]];
/** The angle φ in each step's frame (step 6 slides from φ₀ down to φ₁). */
export const ladderPhi = (step: number, t: number) => (step < 6 ? LS.PHI0 : LS.PHI0 + (LS.PHI1 - LS.PHI0) * ease(seg(t, 0.05, 0.85)));

export function ladderScene(step: number, t: number, lang: Lang): Scene {
  const sb = sceneBuilder();
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => sb.shape({ key, kind, cls, pts, o, r });
  const arrow = (key: string, cls: string, a: P2, b: P2, o = 1, head = 8) => {
    if (o <= 0.01 || Math.hypot(b[0] - a[0], b[1] - a[1]) < 1) return;
    S(key, 'line', cls, [a, b], o); S(key + '-h', 'polygon', cls.split(' ')[0] + '-head', arrowHead(a, b, head), o);
  };
  const de = lang === 'de';
  const phi = ladderPhi(step, t);
  const m = ladderMZ(LS.L, phi, LS.VH);
  const A = sv(m.A), B = sv(m.B), C = sv(m.C), Z = sv(m.Z);

  // floor and wall with hatching
  S('floor', 'line', 'ld-ground', [[14, LS.CY], [LS.CX + 4, LS.CY]]);
  S('wall', 'line', 'ld-ground', [[LS.CX, LS.CY], [LS.CX, 22]]);
  for (let i = 0; i < 15; i++) S('hf' + i, 'line', 'ld-hatch', [[26 + i * 21, LS.CY], [18 + i * 21, LS.CY + 8]]);
  for (let i = 0; i < 12; i++) S('hw' + i, 'line', 'ld-hatch', [[LS.CX, 30 + i * 20], [LS.CX + 8, 38 + i * 20]]);

  // step 6: the quarter circle of radius L about the corner, and the path of Z so far
  const circ = step === 6 ? ease(seg(t, 0, 0.25)) : 0;
  if (circ > 0.01) {
    S('circle', 'polyline', 'an-guide', Array.from({ length: 46 }, (_, i) => sv([-Math.cos((i * 2 * DEG)), Math.sin(i * 2 * DEG)])), circ);
    const n = 30, trail = Array.from({ length: n + 1 }, (_, i) => { const p = LS.PHI0 + ((phi - LS.PHI0) * i) / n; return sv([-Math.cos(p), Math.sin(p)]); });
    if (Math.abs(phi - LS.PHI0) > 0.005) S('trail', 'polyline', 'pl-trail', trail);
    S('Z0', 'circle', 'pl-z-ghost', [sv(ladderMZ(LS.L, LS.PHI0, LS.VH).Z)], 1, 5);
    S('rect', 'polygon', 'pl-rect', [Z, A, C, B], circ);
    S('CZ', 'line', 'pl-cz', [C, Z], circ);
  }
  sb.label('lab-C', [C[0] + 14, C[1] + 14], 'C', 'fg', step === 6 ? 1 : 0, 'c');

  // the perpendiculars (step 1: through A, step 2: through B)
  const pA = step === 1 ? ease(seg(t, 0.1, 0.7)) : step > 1 ? 1 : 0;
  const pB = step === 2 ? ease(seg(t, 0.1, 0.7)) : step > 2 ? 1 : 0;
  if (pA > 0.01) S('perpA', 'line', 'pl-perp', [A, [A[0], A[1] - (A[1] - 14) * pA]]);
  if (pB > 0.01) S('perpB', 'line', 'pl-perp', [B, [B[0] - (B[0] - 14) * pB, B[1]]]);
  if (pA > 0.9) S('raA', 'polyline', 'an-ra', rightAngle(A, [A[0] - 10, A[1]], [A[0], A[1] - 10]));
  if (pB > 0.9) S('raB', 'polyline', 'an-ra', rightAngle(B, [B[0], B[1] + 10], [B[0] - 10, B[1]]));

  // the ladder, the angle φ at A, length L
  S('ladder', 'line', 'ld-body', [A, B]);
  const arc = Array.from({ length: 21 }, (_, i) => { const a = (phi * i) / 20; return [A[0] + 34 * Math.cos(a), A[1] - 34 * Math.sin(a)] as P2; });
  S('phi-arc', 'polyline', 'an-arc', arc);
  sb.label('lab-phi', [A[0] + 48 * Math.cos(phi / 2), A[1] - 48 * Math.sin(phi / 2)], String.raw`\varphi`, 'angle', 1, 'c');
  const lp: P2 = [A[0] + 0.3 * (B[0] - A[0]), A[1] + 0.3 * (B[1] - A[1])]; // not at the middle: the diagonal CZ crosses there
  sb.label('lab-L', [lp[0] - 15 * Math.sin(phi), lp[1] - 15 * Math.cos(phi)], 'L', 'fg', 1, 'c');

  // Z, the distances, ω
  const zo = step === 3 ? ease(seg(t, 0.2, 0.5)) : step > 3 ? 1 : 0;
  const dist = step === 3 ? ease(seg(t, 0.5, 0.8)) : step > 3 && step < 6 ? 1 : 0;
  if (dist > 0.01) {
    S('dZA', 'line', 'pl-dist', [[Z[0] - 10, Z[1]], [A[0] - 10, A[1]]], dist);
    S('dZB', 'line', 'pl-dist', [[Z[0], Z[1] - 10], [B[0], B[1] - 10]], dist);
    for (const [k, p, q] of [['tA1', [Z[0] - 14, Z[1]], [Z[0] - 6, Z[1]]], ['tA2', [A[0] - 14, A[1]], [A[0] - 6, A[1]]], ['tB1', [Z[0], Z[1] - 14], [Z[0], Z[1] - 6]], ['tB2', [B[0], B[1] - 14], [B[0], B[1] - 6]]] as const)
      S(k, 'line', 'pl-dist', [p as unknown as P2, q as unknown as P2], dist);
  }
  sb.label('lab-ZA', [Z[0] - 14, (Z[1] + A[1]) / 2], String.raw`L\sin\varphi`, 'angle', dist > 0.9 ? 1 : 0, 'r');
  sb.label('lab-ZB', [(Z[0] + B[0]) / 2, Z[1] - 22], String.raw`L\cos\varphi`, 'angle', dist > 0.9 ? 1 : 0, 'c');
  const wo = step === 4 ? ease(seg(t, 0.15, 0.5)) : step > 4 ? 1 : 0;
  if (wo > 0.01) {
    // clockwise turning arrow about Z (SVG y down: clockwise on screen = decreasing math angle)
    const r = 17, a0 = 165 * DEG, a1 = a0 - 150 * DEG * wo;
    const ps = Array.from({ length: 25 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / 24; return [Z[0] + r * Math.cos(a), Z[1] - r * Math.sin(a)] as P2; });
    S('w-arc', 'polyline', 'pl-w-arc', ps);
    S('w-arc-h', 'polygon', 'pl-w-head', arrowHead(ps[ps.length - 2], ps[ps.length - 1], 8));
  }
  sb.label('lab-w', [Z[0] - 22, Z[1] - 24], String.raw`\omega`, 'angle', wo > 0.9 ? 1 : 0, 'c');
  if (zo > 0.01) S('Z', 'circle', 'rl-mc', [Z], zo, 6);
  sb.label('lab-Z', [Z[0] + 14, Z[1] + 14], 'Z', 'angle', zo > 0.9 ? 1 : 0, 'c');

  // velocities
  const vA: P2 = [A[0] + LS.KV * m.vA[0], A[1]];
  arrow('vA', 'an-v', A, vA);
  sb.label('lab-vA', [vA[0] + 2, vA[1] - 15], String.raw`\v v_A`, 'point', 1, 'c');
  const known = step === 5 ? ease(seg(t, 0.2, 0.6)) : step === 6 ? 1 : 0;
  const vB: P2 = [B[0], B[1] + LS.KV * m.vV];
  if (known < 0.99) S('vB-dir', 'line', 'pl-dir', [B, [B[0], B[1] + 54]], 1 - known);
  if (known < 0.99) S('vB-dir-h', 'polygon', 'pl-dir-head', arrowHead(B, [B[0], B[1] + 54], 8), 1 - known);
  arrow('vB', 'an-v', B, vB, known);
  sb.label('lab-vB', [B[0] + 14, B[1] + 0.6 * (known > 0.5 ? LS.KV * m.vV : 54)], String.raw`\v v_B`, 'point', 1, 'l');

  // boxes (top left)
  const box = (key: string, o: number, rows: { tex: string; ink: 'fg' | 'point' | 'angle' | 'muted' | 'rho' }[]) => sb.label(key, [6, 6], '', 'fg', o, 'tl', { box: true, rows });
  box('box0', step === 0 ? ease(seg(t, 0.4, 0.8)) : 0, [
    { tex: String.raw`\v v_A = (-v_H,\, 0,\, 0)`, ink: 'point' },
    { tex: String.raw`\v v_B = (0,\, -v_V,\, 0)\ \ ?`, ink: 'point' },
  ]);
  box('box1', step === 1 ? ease(seg(t, 0.6, 0.95)) : 0, [{ tex: String.raw`Z\ \text{${de ? 'auf dem Lot zu' : 'on the perpendicular to'}}\ \v v_A`, ink: 'fg' }]);
  box('box2', step === 2 ? ease(seg(t, 0.6, 0.95)) : 0, [{ tex: String.raw`Z\ \text{${de ? 'auf dem Lot zu' : 'on the perpendicular to'}}\ \v v_B`, ink: 'fg' }]);
  box('box3', step === 3 ? ease(seg(t, 0.75, 1)) : 0, [{ tex: String.raw`|\v{ZA}| = L\sin\varphi`, ink: 'angle' }, { tex: String.raw`|\v{ZB}| = L\cos\varphi`, ink: 'angle' }]);
  box('box4', step === 4 ? ease(seg(t, 0.5, 0.85)) : 0, [{ tex: String.raw`v_H = \omega\, L\sin\varphi`, ink: 'fg' }, { tex: String.raw`\omega = \frac{v_H}{L\sin\varphi}`, ink: 'angle' }]);
  box('box5', step === 5 ? ease(seg(t, 0.55, 0.9)) : 0, [{ tex: String.raw`v_V = \omega\, L\cos\varphi = \frac{v_H}{\tan\varphi}`, ink: 'point' }, { tex: String.raw`\text{${de ? '= SdpG-Resultat' : '= SdpG result'}}\ \checkmark`, ink: 'muted' }]);
  box('box6', step === 6 ? ease(seg(t, 0.6, 0.95)) : 0, [{ tex: String.raw`|\v{CZ}| = L`, ink: 'angle' }, { tex: String.raw`\text{${de ? 'Z wandert auf einem Kreis' : 'Z moves on a circle'}}`, ink: 'muted' }]);

  // points
  S('A', 'circle', 'an-point', [A], 1, 4.5); S('B', 'circle', 'an-point', [B], 1, 4.5);
  sb.label('lab-A', [A[0] - 4, A[1] + 17], 'A', 'point', 1, 'c');
  sb.label('lab-B', [B[0] - 14, B[1] - 14], 'B', 'point', 1, 'c');
  return sb.finish({ step, phi, w: m.w, vv: m.vV, zc: m.ZC });
}

/** Right-angle mark at a between the directions toward p and q (8 px). */
function rightAngle(a: P2, p: P2, q: P2): P2[] {
  const u = (b: P2): P2 => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
  const e = u(p), f = u(q), k = 9;
  return [[a[0] + k * e[0], a[1] + k * e[1]], [a[0] + k * (e[0] + f[0]), a[1] + k * (e[1] + f[1])], [a[0] + k * f[0], a[1] + k * f[1]]];
}
