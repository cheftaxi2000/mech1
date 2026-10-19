/**
 * Planetengetriebe (lecture p. 28, Fig. 3.21): sun gear 1 (radius R₁, centre O, ω₁), ring gear 2 (R₂, centre O, ω₂),
 * planet gear 3 (R₃, momentary centre Z₃, ω₃) and the arm (length L, turning about O, ω_Arm).
 * Geometry: R₃ = ½(R₂ − R₁), L = R₁ + R₃ = ½(R₂ + R₁).
 * Sign convention (implicit in the figure, R-023): every ω is counted in the same sense — positive counter-clockwise
 * (all velocities on the line QPO drawn to the left at the top).
 *
 * The lecture's handwritten solution:  v_P = ω₁R₁,  v_Q = ω₂R₂,  Z₃P·ω₃ = v_P,  (Z₃P + PQ)·ω₃ = v_Q,  PQ = R₂ − R₁
 *   ⇒ ω₃ = (ω₂R₂ − ω₁R₁)/(R₂ − R₁);  v_A = ½(v_P + v_Q);  ω_Arm·L = v_A  ⇒  ω_Arm = ω₂R₂/(R₂+R₁) + ω₁R₁/(R₂+R₁).
 */
export type P2 = readonly [number, number];

export interface Gear { R1: number; R2: number }
export const R3 = ({ R1, R2 }: Gear) => (R2 - R1) / 2;
export const armLength = ({ R1, R2 }: Gear) => R1 + R3({ R1, R2 });

/** v_P = ω₁R₁ (P on the sun, rolling: the planet has the same velocity there). Signed: positive = to the left (at the top). */
export const vP = (g: Gear, w1: number) => w1 * g.R1;
/** v_Q = ω₂R₂ (Q on the ring). */
export const vQ = (g: Gear, w2: number) => w2 * g.R2;
/** ω₃ = (ω₂R₂ − ω₁R₁)/(R₂ − R₁). */
export const omega3 = (g: Gear, w1: number, w2: number) => (w2 * g.R2 - w1 * g.R1) / (g.R2 - g.R1);
/** v_A = ½(v_P + v_Q): A is the midpoint of PQ and the velocity grows linearly along PQ. */
export const vA = (g: Gear, w1: number, w2: number) => (vP(g, w1) + vQ(g, w2)) / 2;
/** ω_Arm = v_A / L. */
export const omegaArm = (g: Gear, w1: number, w2: number) => vA(g, w1, w2) / armLength(g);
/** The boxed result written as a weighted mean of ω₁ and ω₂ (weights R₁/(R₁+R₂), R₂/(R₁+R₂)). */
export const omegaArmBoxed = (g: Gear, w1: number, w2: number) => w2 * (g.R2 / (g.R2 + g.R1)) + w1 * (g.R1 / (g.R2 + g.R1));
/** Übersetzungsverhältnis with the ring fixed (ω₂ = 0): i = ω₁/ω_Arm = 1 + R₂/R₁. */
export const ratioRingFixed = (g: Gear) => 1 + g.R2 / g.R1;
/**
 * Signed distance Z₃P (from Z₃ up to P along the arm line, towards Q) with Z₃P·ω₃ = v_P; null when ω₃ = 0
 * (ω₂R₂ = ω₁R₁: the planet only shifts, Z₃ «at infinity»).
 */
export function z3P(g: Gear, w1: number, w2: number): number | null {
  const w3 = omega3(g, w1, w2);
  return Math.abs(w3) < 1e-12 ? null : vP(g, w1) / w3;
}
/** Position of Z₃ on the arm line, as signed distance from O (P is at R₁, Q at R₂, A at L). */
export function z3FromO(g: Gear, w1: number, w2: number): number | null {
  const d = z3P(g, w1, w2);
  return d === null ? null : g.R1 - d;
}
/** Velocity (signed, to the left at the top) of the planet point at signed distance s from O on the arm line. */
export const planetLineVelocity = (g: Gear, w1: number, w2: number, s: number) => vP(g, w1) + omega3(g, w1, w2) * (s - g.R1);

/* ------------------------------------------------------------------ the gear in motion (2D, y up, angles ccw) */
export interface GearState {
  th1: number; th2: number; th3: number; thArm: number;
  /** planet centre A, contact points P (sun–planet) and Q (planet–ring) */
  A: P2; P: P2; Q: P2;
  /** unit vector from O along the arm (towards A) */
  u: P2;
}
/** Start angles: arm along +y (the lecture's drawing); planet and ring turned by half a tooth so the teeth mesh. */
export interface Teeth { N1: number; N2: number; N3: number }
export function startAngles(t: Teeth) { return { th1: 0, th2: Math.PI / t.N2, th3: Math.PI / t.N3, thArm: 0 }; }

/** State at time t with constant ω₁, ω₂ (the planet turns with ω₃, the arm with ω_Arm). */
export function gearState(g: Gear, w1: number, w2: number, t: number, teeth: Teeth, t0 = startAngles(teeth)): GearState {
  const w3 = omega3(g, w1, w2), wA = omegaArm(g, w1, w2), L = armLength(g);
  const thArm = t0.thArm + wA * t;
  const u: P2 = [-Math.sin(thArm), Math.cos(thArm)];
  return {
    th1: t0.th1 + w1 * t, th2: t0.th2 + w2 * t, th3: t0.th3 + w3 * t, thArm,
    A: [L * u[0], L * u[1]], P: [g.R1 * u[0], g.R1 * u[1]], Q: [g.R2 * u[0], g.R2 * u[1]], u,
  };
}

/** Velocity of a material point at position p of a body turning with ω about the fixed point c, plus v_c. */
export const bodyVelocity = (c: P2, vc: P2, w: number, p: P2): P2 => [vc[0] - w * (p[1] - c[1]), vc[1] + w * (p[0] - c[0])];

/** Velocities of sun, planet and ring material points at the contacts P and Q, and of the arm and planet at A. */
export function contactVelocities(g: Gear, w1: number, w2: number, s: GearState) {
  const w3 = omega3(g, w1, w2), wA = omegaArm(g, w1, w2);
  const vAarm = bodyVelocity([0, 0], [0, 0], wA, s.A); // A as a point of the arm
  return {
    sunP: bodyVelocity([0, 0], [0, 0], w1, s.P),
    planetP: bodyVelocity(s.A, vAarm, w3, s.P),
    ringQ: bodyVelocity([0, 0], [0, 0], w2, s.Q),
    planetQ: bodyVelocity(s.A, vAarm, w3, s.Q),
    armA: vAarm,
  };
}

/**
 * Meshing phases: a tooth of one gear must face a gap of the other at the contact.
 *   sun–planet:  N₁(α − θ₁) + N₃(α + π − θ₃) ≡ π   (α = direction from O to A)
 *   planet–ring: N₂(α − θ₂) − N₃(α − θ₃) ≡ 0
 * Rolling without slipping keeps both constant (tested over time). Returned modulo 2π in [0, 2π).
 */
export function meshPhases(s: GearState, n: Teeth) {
  const a = s.thArm + Math.PI / 2, m = (x: number) => ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  return { sunPlanet: m(n.N1 * (a - s.th1) + n.N3 * (a + Math.PI - s.th3)), planetRing: m(n.N2 * (a - s.th2) - n.N3 * (a - s.th3)) };
}

/** The gear of the app's figures: radii in the proportions of Fig. 3.21, teeth in the same proportions (N₂ = N₁ + 2N₃). */
export const GEAR: Gear = { R1: 0.8, R2: 2.8 };
export const TEETH: Teeth = { N1: 16, N2: 56, N3: 20 };
