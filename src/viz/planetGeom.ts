/**
 * Pure drawing geometry of the planetary gear (lesson planetengetriebe, lecture p. 28, Fig. 3.21), shared by the
 * step animation and the interactive figure. Physics units (R₁ = 0.8, R₂ = 2.8), y UP, angles counter-clockwise.
 * Every velocity here comes from src/physics/planetary.ts.
 */
import {
  GEAR, R3, TEETH, armLength, gearState, omega3, omegaArm, vA as vAof, vP as vPof, vQ as vQof, z3FromO,
  type Gear, type GearState, type P2,
} from '../physics/planetary';

export const TOOTH_H = 0.055;
/** Tooth shape: a clipped cosine (flat tips and gaps); odd under a half-tooth shift, so tooth faces gap. */
export const tooth = (phase: number) => Math.max(-1, Math.min(1, 1.7 * Math.cos(phase)));

/** Toothed outline of a gear with centre c, pitch radius R, N teeth, turned by th (radius R + h·tooth(N(β − th))). */
export function gearOutline(c: P2, R: number, N: number, th: number, h = TOOTH_H, perTooth = 12): P2[] {
  const n = N * perTooth;
  return Array.from({ length: n }, (_, i) => {
    const b = (2 * Math.PI * i) / n, r = R + h * tooth(N * (b - th));
    return [c[0] + r * Math.cos(b), c[1] + r * Math.sin(b)] as P2;
  });
}
export const circlePts = (c: P2, r: number, n = 96): P2[] => Array.from({ length: n }, (_, i) => [c[0] + r * Math.cos((2 * Math.PI * i) / n), c[1] + r * Math.sin((2 * Math.PI * i) / n)] as P2);
export const RING_OUT = 0.32; // width of the ring gear's body outside the teeth

/** Points of the body marks that make each part's turning visible (a few holes / a radial mark). */
export function marks(s: GearState, g: Gear = GEAR) {
  const r3 = R3(g);
  const at = (c: P2, r: number, a: number): P2 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
  return {
    sunHoles: [0, 1, 2].map((k) => at([0, 0], 0.48 * g.R1, s.th1 + (2 * Math.PI * k) / 3 + Math.PI / 2 + Math.PI / 3)),
    planetMark: [at(s.A, 0.2 * r3, s.th3 + Math.PI / 2 + Math.PI / 3), at(s.A, 0.78 * r3, s.th3 + Math.PI / 2 + Math.PI / 3)] as [P2, P2],
    planetHoles: [1, 2].map((k) => at(s.A, 0.5 * r3, s.th3 + Math.PI / 2 + Math.PI / 3 + (2 * Math.PI * k) / 3)),
    ringMarks: [0, 1, 2, 3].map((k) => at([0, 0], g.R2 + 0.6 * RING_OUT, s.th2 + Math.PI / 2 + (k * Math.PI) / 2)),
  };
}

/**
 * The velocity picture on the line O–P–A–Q (along the arm) at one instant: arrow tips (velocities drawn kv per unit,
 * perpendicular to the arm, positive = counter-clockwise sense), Z₃ and the velocity triangle of the planet.
 */
export function velocityPicture(g: Gear, w1: number, w2: number, s: GearState, kv: number) {
  const u = s.u, n: P2 = [-u[1], u[0]]; // n: direction of a positive velocity on the arm line
  const on = (d: number): P2 => [d * u[0], d * u[1]];
  const tip = (d: number, v: number): P2 => [d * u[0] + kv * v * n[0], d * u[1] + kv * v * n[1]];
  const vP = vPof(g, w1), vQ = vQof(g, w2), vA = vAof(g, w1, w2), L = armLength(g);
  const z = z3FromO(g, w1, w2);
  return {
    vP, vQ, vA, w3: omega3(g, w1, w2), wArm: omegaArm(g, w1, w2),
    O: [0, 0] as P2, P: on(g.R1), Q: on(g.R2), A: on(L),
    tipP: tip(g.R1, vP), tipQ: tip(g.R2, vQ), tipA: tip(L, vA),
    Z3: z === null ? null : on(z), z3: z,
    /** P, Q, tip(Q), tip(P): the velocity distribution on the planet's diameter PQ (two triangles when Z₃ lies between) */
    tri: [on(g.R1), on(g.R2), tip(g.R2, vQ), tip(g.R1, vP)] as P2[],
    /** along-the-arm unit vector and the velocity direction */
    u, n,
  };
}

/** A point given in the arm's frame (arm along +y) turned with the arm — keeps part labels clear of the planet. */
export const withArm = (s: GearState, p: P2): P2 => [p[0] * s.u[1] + p[1] * s.u[0], -p[0] * s.u[0] + p[1] * s.u[1]];

/** Clip the line p + λ d to the disc of radius r about O (null if it misses). */
export function clipToDisc(p: P2, d: P2, r: number): [P2, P2] | null {
  const a = d[0] * d[0] + d[1] * d[1], b = 2 * (p[0] * d[0] + p[1] * d[1]), c = p[0] * p[0] + p[1] * p[1] - r * r;
  const D = b * b - 4 * a * c;
  if (a < 1e-12 || D <= 0) return null;
  const l1 = (-b - Math.sqrt(D)) / (2 * a), l2 = (-b + Math.sqrt(D)) / (2 * a);
  return [[p[0] + l1 * d[0], p[1] + l1 * d[1]], [p[0] + l2 * d[0], p[1] + l2 * d[1]]];
}

/** The figure's start state (arm along +y, as in Fig. 3.21). */
export const lectureState = (w1: number, w2: number, g: Gear = GEAR) => gearState(g, w1, w2, 0, TEETH);

/** Gear state from the four turning angles (the interactive figure integrates them frame by frame). */
export function stateFromAngles(g: Gear, a: { th1: number; th2: number; th3: number; thArm: number }): GearState {
  const L = armLength(g), u: P2 = [-Math.sin(a.thArm), Math.cos(a.thArm)];
  return { ...a, u, A: [L * u[0], L * u[1]], P: [g.R1 * u[0], g.R1 * u[1]], Q: [g.R2 * u[0], g.R2 * u[1]] };
}
