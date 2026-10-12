/**
 * Pure scene of «Allgemeinste Bewegung» (lecture p. 22) for a plate moving in its plane.
 *
 *  step 0  the plate moves: it shifts and turns at the same time (paths of B and M)
 *  step 1  at one instant: r_M = r_B + ρ with ρ = BM
 *  step 2  derivative: v_M = v_B + ρ̇ (ρ̇ = velocity of M relative to B)
 *  step 3  riding along with B: the plate only turns about B, M runs on a circle ⇒ ρ̇ = ω* × ρ ⊥ ρ
 *  step 4  v_M = v_B + ω* × BM: translation part plus turning part
 */
import type { Lang } from '../../i18n';
import { placeAt, planarVelocity, type P2 as Q2 } from '../../physics/general';
import { GEN, MOTION, PLATE, PTS } from '../genGeom';
import { ease, seg, type P2 } from './geometry';
import { arrowHead, sceneBuilder, type Scene } from './scene';

export const T_STAR = 2; // the instant of steps 1–4
const KV = 1.6; // drawn arrow length per unit of velocity (s)
const Z = 1.15; // zoom: physics px (y up) → SVG
const sv = (p: Q2): P2 => [16 + Z * (p[0] - 10), 56 + Z * (215 - p[1])];
const O_S: P2 = sv([125, 20]);

export function genScene(step: number, t: number, lang: Lang): Scene {
  void lang;
  const sb = sceneBuilder();
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => sb.shape({ key, kind, cls, pts, o, r });
  const arrow = (key: string, cls: string, a: P2, b: P2, o = 1) => {
    if (o <= 0.01 || Math.hypot(b[0] - a[0], b[1] - a[1]) < 1) return;
    S(key, 'line', cls, [a, b], o); S(key + '-h', 'polygon', cls.split(' ')[0] + '-head', arrowHead(a, b, 8), o);
  };
  const tau = step === 0 ? T_STAR * ease(seg(t, 0.05, 0.85)) : T_STAR;

  // step 3: seen from B riding along — B stays put, the plate turns about B (from 40° back up to now)
  const ride = step === 3 ? ease(seg(t, 0.05, 0.6)) : 1;
  const dth = step === 3 ? -0.7 * (1 - ride) : 0;
  const Bw = MOTION.B(tau);
  const at = (p: Q2): P2 => {
    const q = placeAt(MOTION, p, tau);
    if (!dth) return sv(q);
    const c = Math.cos(dth), s = Math.sin(dth), x = q[0] - Bw[0], y = q[1] - Bw[1];
    return sv([Bw[0] + c * x - s * y, Bw[1] + s * x + c * y]);
  };
  const B = at(PTS.B), M = at(PTS.M);

  // step 0: where the plate started (ghost) and the paths of B and M
  if (step === 0) {
    S('ghost', 'polygon', 'an-body ghost', PLATE.map((p) => sv(placeAt(MOTION, p, 0))));
    const n = 40;
    for (const [k, p] of [['pathB', PTS.B], ['pathM', PTS.M]] as const)
      if (tau > 0.02) S(k, 'polyline', 'an-path', Array.from({ length: n + 1 }, (_, i) => sv(placeAt(MOTION, p, (tau * i) / n))));
  }
  // step 3: the circle of M about B
  const circ = step === 3 ? ease(seg(t, 0.45, 0.75)) : 0;
  const rBM = Math.hypot(M[0] - B[0], M[1] - B[1]);
  if (circ > 0.01) S('circle', 'polyline', 'an-path', Array.from({ length: 73 }, (_, i) => [B[0] + rBM * Math.cos((2 * Math.PI * i) / 72), B[1] + rBM * Math.sin((2 * Math.PI * i) / 72)] as P2), circ);
  if (step === 3 && ride < 0.999) {
    const arc = Array.from({ length: 25 }, (_, i) => { const a = -0.7 * (1 - ride) * (1 - i / 24), q = placeAt(MOTION, PTS.M, tau); const x = q[0] - Bw[0], y = q[1] - Bw[1]; return sv([Bw[0] + Math.cos(a) * x - Math.sin(a) * y, Bw[1] + Math.sin(a) * x + Math.cos(a) * y]); });
    S('arcM', 'polyline', 'an-circ', arc);
  }

  // the plate
  S('plate', 'polygon', 'an-body', PLATE.map(at));

  // step 1: position vectors from O
  const pos = step === 1 ? ease(seg(t, 0, 0.6)) : step === 2 ? 1 - ease(seg(t, 0, 0.3)) : 0;
  arrow('rB', 'an-r', O_S, B, pos); arrow('rM', 'an-r', O_S, M, pos);
  sb.label('lab-rB', mid(O_S, B, [-14, 0]), String.raw`\v r_B`, 'r', pos > 0.9 ? 1 : 0, 'c');
  sb.label('lab-rM', mid(O_S, M, [16, 8]), String.raw`\v r_M`, 'r', pos > 0.9 ? 1 : 0, 'c');
  const rho = step >= 1 && step !== 3 ? (step === 1 ? ease(seg(t, 0.3, 0.8)) : 1) : step === 3 ? 1 : 0;
  arrow('rho', 'an-erho', B, M, rho);
  sb.label('lab-rho', mid(B, M, [12, 8]), String.raw`\v\rho`, 'rho', rho > 0.9 && step !== 4 ? 1 : 0, 'c');
  if (pos > 0.01) { S('O', 'circle', 'an-o', [O_S], pos, 3.5); }
  sb.label('lab-O', [O_S[0] + 14, O_S[1] - 4], 'O', 'fg', pos > 0.9 ? 1 : 0, 'c');

  // velocities at the instant (steps 2–4)
  const vB = planarVelocity(MOTION, PTS.B, T_STAR), vM = planarVelocity(MOTION, PTS.M, T_STAR);
  const rel: Q2 = [vM[0] - vB[0], vM[1] - vB[1]];
  const d = (v: Q2): P2 => [Z * KV * v[0], -Z * KV * v[1]];
  const plus = (p: P2, q: P2): P2 => [p[0] + q[0], p[1] + q[1]];
  const vo = step === 2 || step === 4 ? ease(seg(t, 0, 0.5)) : 0;
  const tri = step === 2 || step === 4 ? ease(seg(t, 0.3, 0.7)) : 0;
  arrow('vB', 'an-v', B, plus(B, d(vB)), vo);
  arrow('vB-copy', 'an-copy', M, plus(M, d(vB)), tri);
  arrow('rel', 'an-diff', plus(M, d(vB)), plus(plus(M, d(vB)), d(rel)), tri);
  arrow('vM', 'an-v', M, plus(M, d(vM)), step === 2 || step === 4 ? ease(seg(t, 0.6, 0.9)) : 0);
  // step 3: ρ̇ at M, tangent to the circle
  const rd = step === 3 ? ease(seg(t, 0.65, 0.9)) : 0;
  arrow('rhodot', 'an-diff', M, plus(M, d(rel)), rd);
  sb.label('lab-vB', plus(plus(B, d(vB)), [0, 15]), String.raw`\v v_B`, 'point', vo > 0.9 ? 1 : 0, 'c');
  sb.label('lab-vM', plus(plus(M, d(vM)), [8, -8]), String.raw`\v v_M`, 'point', (step === 2 || step === 4) && t > 0.85 ? 1 : 0, 'l');
  sb.label('lab-rel', plus(plus(M, d(vB)), [4, -14]), String.raw`\dot{\v\rho}`, 'angle', tri > 0.9 && step === 2 ? 1 : 0, 'l');
  sb.label('lab-copy', plus(M, [0.55 * d(vB)[0], 14]), String.raw`\v v_B`, 'muted', tri > 0.9 ? 1 : 0, 'c');
  sb.label('lab-rhodot', plus(plus(M, d(rel)), [-8, -10]), String.raw`\dot{\v\rho}`, 'angle', rd > 0.9 ? 1 : 0, 'r');
  // ω* ⊙ at B (out of the page: the plate turns counter-clockwise)
  const wo = step === 3 ? ease(seg(t, 0.65, 0.9)) : step === 4 ? 1 : 0;
  if (wo > 0.01) { S('w-ring', 'circle', 'kr-dot-ring', [plus(B, [-24, 16])], wo, 7); S('w-dot', 'circle', 'kr-dot', [plus(B, [-24, 16])], wo, 2); }
  sb.label('lab-w', plus(B, [-36, 16]), String.raw`\v\omega^*`, 'angle', wo > 0.9 ? 1 : 0, 'r');

  // boxes (top left)
  const box = (key: string, o: number, rows: { tex: string; ink: 'fg' | 'rho' | 'point' | 'angle' | 'muted' }[]) => sb.label(key, [6, 6], '', 'fg', o, 'tl', { box: true, rows });
  box('box1', step === 1 ? ease(seg(t, 0.75, 1)) : 0, [{ tex: String.raw`\v r_M = \v r_B + \v\rho`, ink: 'fg' }]);
  box('box2', step === 2 ? ease(seg(t, 0.8, 1)) : 0, [{ tex: String.raw`\v v_M = \v v_B + \dot{\v\rho}`, ink: 'fg' }]);
  box('box3', step === 3 ? ease(seg(t, 0.8, 1)) : 0, [{ tex: String.raw`|\v\rho| = \text{${lang === 'de' ? 'konst.' : 'const.'}}\ \Rightarrow\ \dot{\v\rho} = \v\omega^*\times\v\rho`, ink: 'angle' }]);
  box('box4', step === 4 ? ease(seg(t, 0.8, 1)) : 0, [
    { tex: String.raw`\v v_M = \v v_B + \v\omega^*\times\v{BM}`, ink: 'fg' },
    { tex: String.raw`\text{${lang === 'de' ? 'Translationsteil' : 'translation part'}: }\v v_B`, ink: 'muted' },
    { tex: String.raw`\text{${lang === 'de' ? 'Drehteil' : 'turning part'}: }\v\omega^*\times\v{BM}`, ink: 'angle' },
  ]);

  // points
  S('B', 'circle', 'an-point', [B], 1, 4.5); S('M', 'circle', 'an-point', [M], 1, 4.5);
  sb.label('lab-B', plus(B, [-4, 16]), 'B', 'point', 1, 'c');
  sb.label('lab-M', plus(M, [-14, -6]), 'M', 'point', 1, 'c');

  return sb.finish({ step, tau, rhoDotDotRho: rel[0] * (placeAt(MOTION, PTS.M, T_STAR)[0] - MOTION.B(T_STAR)[0]) + rel[1] * (placeAt(MOTION, PTS.M, T_STAR)[1] - MOTION.B(T_STAR)[1]), w: GEN.W });
}

function mid(a: P2, b: P2, off: P2): P2 { return [(a[0] + b[0]) / 2 + off[0], (a[1] + b[1]) / 2 + off[1]]; }
