import { ladderMZ, ladderMiddle, ladderPoint, ladderPointVelocity, movingPolodePoint, type P2 } from '../physics/plane';

/**
 * Pure geometry of the polode figure (ladder supplement), in viewBox units (y down).
 * Corner C at the lower right; floor to the left, wall above C, as in the ladder figure of the notes.
 */
export const PV: [number, number, number, number] = [0, 0, 400, 320];
export const PD = { L: 1, S: 190, CX: 300, CY: 250, PHI_MAX: 78 * Math.PI / 180, PHI_MIN: 20 * Math.PI / 180, VH: 1, KV: 56 };
type V = readonly [number, number];
export const toScreen = (p: P2): V => [PD.CX + PD.S * p[0], PD.CY - PD.S * p[1]];
export const toWorld = (q: V): P2 => [(q[0] - PD.CX) / PD.S, (PD.CY - q[1]) / PD.S];
/** Ladder angle for a dragged position of A on the floor (cos φ = −x_A / L), clamped to the shown range. */
export const phiFromA = (xA: number) => Math.max(PD.PHI_MIN, Math.min(PD.PHI_MAX, Math.acos(Math.max(0, Math.min(1, -xA / PD.L)))));

const steps = (a: number, b: number, n: number) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);

export interface PolodeFrame {
  A: V; B: V; C: V; M: V; Z: V; P: V;
  /** whole fixed polode (quarter circle about C) and the part Z has swept since φ = PHI_MAX */
  fixedAll: V[]; fixedSwept: V[];
  /** moving polode (circle about M through A, B, C, Z) and the equally long part that has touched the fixed one */
  movingAll: V[]; movingSwept: V[];
  /** path of P (a quarter ellipse) and the part already travelled */
  pathAll: V[]; pathDone: V[];
  vP: V; vA: V; vB: V;
  /** arc lengths in units of L */
  arcFixed: number; arcMoving: number;
}

export function polodeFrame(phi: number, s: number): PolodeFrame {
  const { L, PHI_MAX, KV, VH } = PD;
  const m = ladderMZ(L, phi, VH), M = ladderMiddle(L, phi), P = ladderPoint(L, phi, s);
  const fixedAt = (f: number): P2 => [-L * Math.cos(f), L * Math.sin(f)];
  const fixedAll = steps(0, Math.PI / 2, 40).map((f) => toScreen(fixedAt(f)));
  const fixedSwept = steps(PHI_MAX, phi, 24).map((f) => toScreen(fixedAt(f)));
  const movingAll = steps(0, 2 * Math.PI, 72).map((a) => toScreen([M[0] + (L / 2) * Math.cos(a), M[1] + (L / 2) * Math.sin(a)]));
  const movingSwept = steps(Math.PI - 2 * PHI_MAX, Math.PI - 2 * phi, 24).map((b) => toScreen(movingPolodePoint(L, phi, b)));
  const pathAll = steps(0, Math.PI / 2, 40).map((f) => toScreen(ladderPoint(L, f, s)));
  const pathDone = steps(PHI_MAX, phi, 24).map((f) => toScreen(ladderPoint(L, f, s)));
  const vel = (sf: number): V => { const v = ladderPointVelocity(L, phi, VH, sf); return [KV * v[0], -KV * v[1]]; };
  return {
    A: toScreen(m.A), B: toScreen(m.B), C: toScreen(m.C), M: toScreen(M), Z: toScreen(m.Z), P: toScreen(P),
    fixedAll, fixedSwept, movingAll, movingSwept, pathAll, pathDone,
    vP: vel(s), vA: vel(0), vB: vel(1),
    arcFixed: L * (PHI_MAX - phi), arcMoving: (L / 2) * 2 * (PHI_MAX - phi),
  };
}
