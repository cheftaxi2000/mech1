/**
 * The plate of lesson 12 (general motion, lecture p. 22) — pure data shared by the step animation and the two
 * interactive figures. Units: SVG pixels with y pointing UP (the figures flip y); time in seconds.
 * B moves on a gentle wave from left to right while the plate turns counter-clockwise.
 */
import { placeAt, planarRestPoint, type PlanarMotion, type P2 } from '../physics/general';

/** Outline of the plate, relative to B, at θ = 0. */
export const PLATE: P2[] = [[-34, -26], [62, -40], [112, -14], [104, 30], [44, 52], [-26, 38]];
/** Marked body points (relative to B at θ = 0). */
export const PTS = { B: [0, 0] as P2, M: [86, 4] as P2, C: [36, 30] as P2 };

export const GEN = { X0: 66, Y0: 96, V: 50, A: 26, K: 0.9, TH0: -0.4, W: 0.42, T_END: 4 };
export const MOTION: PlanarMotion = {
  B: (t) => [GEN.X0 + GEN.V * t, GEN.Y0 + GEN.A * Math.sin(GEN.K * t)],
  vB: (t) => [GEN.V, GEN.A * GEN.K * Math.cos(GEN.K * t)],
  theta: (t) => GEN.TH0 + GEN.W * t,
  omega: () => GEN.W,
};

// ------------------------------------------------------------------------------------------------
// «Mitfahren» (p. 22, ω the same for every reference point): the plate seen by a camera at rest or riding along
// with B or C (without turning). Pure frame, SVG coordinates (y down, 400 × 300).

export type Ride = 'rest' | 'B' | 'C';
export const RIDE_CENTRE: P2 = [200, 150];
const HH = 300;
export function mitfahrFrame(ride: Ride, t: number) {
  const ref = ride === 'rest' ? null : PTS[ride];
  const pos = (p: P2, tt: number): P2 => {
    const q = placeAt(MOTION, p, tt);
    if (!ref) return [q[0], HH - q[1]];
    const c = placeAt(MOTION, ref, tt);
    return [RIDE_CENTRE[0] + q[0] - c[0], RIDE_CENTRE[1] - (q[1] - c[1])];
  };
  const n = 60;
  const trace = (p: P2) => Array.from({ length: n + 1 }, (_, i) => pos(p, (t * i) / n));
  const phi = MOTION.theta(t) - MOTION.theta(0);
  return {
    plate: PLATE.map((p) => pos(p, t)),
    start: PLATE.map((p) => pos(p, 0)),
    B: pos(PTS.B, t), C: pos(PTS.C, t), M: pos(PTS.M, t), M0: pos(PTS.M, 0),
    traces: { B: trace(PTS.B), C: trace(PTS.C), M: trace(PTS.M) },
    phi, ref: ref ? pos(ref, t) : null,
  };
}

// ------------------------------------------------------------------------------------------------
// Grundgleichung (p. 22): the velocity field of the plate at one instant, v_M = v_B + ω × BM.
export const FIELD = { H: 280, B: [92, 100] as P2, TH: 0.25, ZOOM: 1.3, KV: 0.9, GRID: 34 };
const fieldPlace = (p: P2): P2 => { const c = FIELD.ZOOM * Math.cos(FIELD.TH), s = FIELD.ZOOM * Math.sin(FIELD.TH); return [FIELD.B[0] + c * p[0] - s * p[1], FIELD.B[1] + s * p[0] + c * p[1]]; };
const toSvg = (q: P2): P2 => [q[0], FIELD.H - q[1]];
/** Point-in-polygon (even–odd rule). */
export function inside(p: P2, poly: P2[]): boolean {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}
export function fieldFrame(vB: P2, w: number, ref: 'B' | 'C') {
  const poly = PLATE.map(fieldPlace);
  const vel = (q: P2): P2 => [vB[0] - w * (q[1] - FIELD.B[1]), vB[1] + w * (q[0] - FIELD.B[0])]; // physics, y up
  const arrow = (q: P2, v: P2): [P2, P2] => [toSvg(q), toSvg([q[0] + FIELD.KV * v[0], q[1] + FIELD.KV * v[1]])];
  const grid: [P2, P2][] = [];
  for (let x = 30; x < 330; x += FIELD.GRID) for (let y = 20; y < 260; y += FIELD.GRID) if (inside([x, y], poly)) grid.push(arrow([x, y], vel([x, y])));
  const R = fieldPlace(PTS[ref]), Mq = fieldPlace(PTS.M);
  const vR = vel(R), vM = vel(Mq), rot: P2 = [vM[0] - vR[0], vM[1] - vR[1]];
  const M = toSvg(Mq), Mc = toSvg([Mq[0] + FIELD.KV * vR[0], Mq[1] + FIELD.KV * vR[1]]);
  const rest = planarRestPoint(vB, w, FIELD.B);
  return {
    plate: poly.map(toSvg), grid,
    B: toSvg(FIELD.B), C: toSvg(fieldPlace(PTS.C)), M, ref: toSvg(R),
    vRef: arrow(R, vR), vB: arrow(FIELD.B, vel(FIELD.B)), copy: [M, Mc] as [P2, P2], rot: [Mc, toSvg([Mq[0] + FIELD.KV * vM[0], Mq[1] + FIELD.KV * vM[1]])] as [P2, P2], vM: arrow(Mq, vM),
    rest: rest ? toSvg(rest) : null, rotPart: rot, vMval: vM,
  };
}
