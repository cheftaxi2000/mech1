/**
 * Pure geometry of the Momentanzentrum construction figure (lesson ebene-bewegung, lecture p. 26, Fig. 3.19).
 * Physics units: metres (1 m = 100 px), y UP; the figure flips y. Velocities in m/s, drawn KV px per m/s.
 *
 * Given: v_A (free) and the part s of v_B perpendicular to AB. The part of v_B along AB is forced by the SdpG
 * (it equals the part of v_A along AB), so the two velocities always belong to one rigid body.
 */
import { centreFromTwo, planeVelocity, tipsIntersection, type Centre, type P2 } from '../physics/plane';

export const VBC: [number, number, number, number] = [0, 0, 400, 300];
export const KV = 70; // px per m/s
export const CPTS = { A: [1.15, 1.35] as P2, B: [2.75, 1.95] as P2, M: [2.25, 0.62] as P2 };
export const CPLATE: P2[] = [[0.62, 1.05], [1.3, 0.52], [2.4, 0.3], [3.25, 0.75], [3.4, 1.7], [2.95, 2.35], [1.85, 2.3], [0.85, 1.95]];

const AB: P2 = [CPTS.B[0] - CPTS.A[0], CPTS.B[1] - CPTS.A[1]];
const LAB = Math.hypot(AB[0], AB[1]);
/** Unit vectors along AB and perpendicular to it (n = e_z × u). */
export const U_AB: P2 = [AB[0] / LAB, AB[1] / LAB];
export const N_AB: P2 = [-U_AB[1], U_AB[0]];

/** v_B from v_A and its perpendicular part s: v_B = (v_A·u) u + s n (SdpG). */
export function vBof(vA: P2, s: number): P2 {
  const a = vA[0] * U_AB[0] + vA[1] * U_AB[1];
  return [a * U_AB[0] + s * N_AB[0], a * U_AB[1] + s * N_AB[1]];
}

export type CPreset = 'rot' | 'far' | 'trans' | 'tips' | 'rest';
/** Start: a turning about Z₀ (inside the plate) with ω₀ (counter-clockwise). */
export const Z0: P2 = [2.0, 1.25], W0 = 0.7;
const vRot = (p: P2) => planeVelocity(Z0, [0, 0], W0, p);
export const CPRESETS: Record<CPreset, { vA: P2; s: number; de: string; en: string }> = {
  rot: { vA: vRot(CPTS.A), s: vRot(CPTS.B)[0] * N_AB[0] + vRot(CPTS.B)[1] * N_AB[1], de: 'Drehung', en: 'turning' },
  far: { vA: [0.15, 0.85], s: 0.62, de: 'Lote fast parallel', en: 'nearly parallel' },
  trans: { vA: [0.55, 0.55], s: 0.55 * N_AB[0] + 0.55 * N_AB[1], de: 'Translation', en: 'translation' },
  tips: { vA: [0.95 * N_AB[0], 0.95 * N_AB[1]], s: 0.3, de: 'beide senkrecht zu AB', en: 'both perpendicular to AB' },
  rest: { vA: [0, 0], s: 0.7, de: 'A ruht', en: 'A at rest' },
};

/** Clip the infinite line p + λ d to the figure box (in metres). */
export function clipLine(p: P2, d: P2, box: [number, number, number, number] = [0.04, 0.04, 3.96, 2.96]): [P2, P2] | null {
  let lo = -Infinity, hi = Infinity;
  for (const [pi, di, a, b] of [[p[0], d[0], box[0], box[2]], [p[1], d[1], box[1], box[3]]]) {
    if (Math.abs(di) < 1e-12) { if (pi < a || pi > b) return null; continue; }
    const t1 = (a - pi) / di, t2 = (b - pi) / di;
    lo = Math.max(lo, Math.min(t1, t2)); hi = Math.min(hi, Math.max(t1, t2));
  }
  if (lo > hi) return null;
  return [[p[0] + lo * d[0], p[1] + lo * d[1]], [p[0] + hi * d[0], p[1] + hi * d[1]]];
}

/** The short line (through the possible tips of v_B) on which the SdpG keeps the tip of v_B. */
function guide(B: P2, vB: P2, s: number, k: number): [P2, P2] {
  const f: P2 = [B[0] + k * (vB[0] - s * N_AB[0]), B[1] + k * (vB[1] - s * N_AB[1])], h = 0.95;
  return [[f[0] - h * N_AB[0], f[1] - h * N_AB[1]], [f[0] + h * N_AB[0], f[1] + h * N_AB[1]]];
}

export const insideBox = (p: P2, m = 0.1) => p[0] > m && p[0] < 4 - m && p[1] > m && p[1] < 3 - m;

export interface CentreFrame {
  vA: P2; vB: P2; vM: P2 | null;
  centre: Centre;
  Z: P2 | null; zInside: boolean;
  perpA: [P2, P2] | null; perpB: [P2, P2] | null; tipsLine: [P2, P2] | null; lineAB: [P2, P2] | null;
  guideB: [P2, P2] | null;
  w: number;
}
export function centreFrame(vA: P2, s: number): CentreFrame {
  const { A, B, M } = CPTS;
  const vB = vBof(vA, s);
  const c = centreFromTwo(A, vA, B, vB, 1e-6);
  const Z = c.kind === 'point' ? c.Z : null;
  const w = c.kind === 'point' ? c.w : 0;
  const vM = c.kind === 'translation' ? vA : Z ? planeVelocity(Z, [0, 0], w, M) : null;
  const n = (v: P2): P2 => [-v[1], v[0]];
  const big = (v: P2) => Math.hypot(v[0], v[1]) > 1e-6;
  const tips = c.kind === 'point' && c.via === 'tips' ? tipsIntersection(A, vA, B, vB) : null;
  // the line through the tips (drawn in velocity scale: tips at A + v·KV/100)
  const k = KV / 100;
  const tA: P2 = [A[0] + k * vA[0], A[1] + k * vA[1]], tB: P2 = [B[0] + k * vB[0], B[1] + k * vB[1]];
  return {
    vA, vB, vM, centre: c, Z, zInside: !!Z && insideBox(Z), w,
    perpA: big(vA) ? clipLine(A, n(vA)) : null,
    perpB: big(vB) ? clipLine(B, n(vB)) : null,
    tipsLine: tips ? clipLine(tA, [tB[0] - tA[0], tB[1] - tA[1]]) : null,
    lineAB: [[A[0] - 0.55 * U_AB[0], A[1] - 0.55 * U_AB[1]], [B[0] + 0.55 * U_AB[0], B[1] + 0.55 * U_AB[1]]],
    guideB: guide(B, vB, s, k),
  };
}
