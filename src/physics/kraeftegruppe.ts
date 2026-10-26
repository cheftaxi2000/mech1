/**
 * Leistung einer Kräftegruppe am starren Körper (Skript pp. 34–36), plane version for the figures of the lesson
 * `leistung-kraeftegruppe`: a plate that moves in the xy-plane (ω̲ = ω e̲_z, v̲_B in the plane) pushed by forces in the plane.
 * Everything is computed with the 3D functions of `force.ts` (the numeric source of truth); this file only adds the
 * bookkeeping the figures need (per-force powers, the split into translation and rotation part, a change of the
 * reference point) and the worked numbers of the proof (p. 35).
 */
import { cross, dot, sub, type Vec3 } from './vec';
import { ladder, powerReduced, powerSplit, rigidVelocity, type Ladder, type PointForce } from './force';

export type P2 = readonly [number, number];
const v3 = (p: P2): Vec3 => [p[0], p[1], 0];
const p2 = (v: Vec3): P2 => [v[0], v[1]];

/** A force in the plane: {A | F̲}. */
export interface Force2 { A: P2; F: P2 }
/** The state of the plate: forces, the reference point B, the Kinemate {v̲_B, ω} at B. */
export interface Plate { forces: readonly Force2[]; B: P2; vB: P2; omega: number }

const pf = (f: Force2): PointForce => ({ A: v3(f.A), F: v3(f.F) });

/** Everything the figures show for one plate. */
export function plateNumbers(p: Plate) {
  const fs = p.forces.map(pf), B = v3(p.B), vB = v3(p.vB), om: Vec3 = [0, 0, p.omega];
  const v = fs.map((f) => p2(rigidVelocity(B, vB, om, f.A)));
  const split = fs.map((f) => powerSplit(f, B, vB, om));
  const red = powerReduced(fs, B, vB, om);
  return {
    /** v̲_i = v̲_B + ω̲ × BA̲_i */
    v,
    /** P_i = F̲_i · v̲_i and its two parts F̲_i · v̲_B (translation) and ω̲ · (BA̲_i × F̲_i) (rotation) */
    P: split.map((s) => s.total), trans: split.map((s) => s.trans), rot: split.map((s) => s.rot),
    /** the moment of each force about B (z-component): M_i = (BA̲_i × F̲_i)_z */
    Mi: fs.map((f) => cross(sub(f.A, B), f.F)[2]),
    R: p2(red.R), MB: red.M[2],
    /** R̲ · v̲_B, M̲_B · ω̲ and their sum; Σ F̲_i · v̲_i */
    translation: red.translation, rotation: red.rotation, total: red.total,
    sumP: split.reduce((s, x) => s + x.total, 0),
  };
}

/** The same motion, described at another reference point B′: v̲_B′ = v̲_B + ω̲ × BB̲′ (ω̲ is the same for every point). */
export function moveReference(p: Plate, B2: P2): Plate {
  const vB2 = p2(rigidVelocity(v3(p.B), v3(p.vB), [0, 0, p.omega], v3(B2)));
  return { ...p, B: B2, vB: vB2 };
}

/** Signed length of the shadow of u on the direction of f (used for the drop lines of the figures). */
export const shadow = (u: P2, f: P2): number => { const n = Math.hypot(f[0], f[1]); return n === 0 ? 0 : (u[0] * f[0] + u[1] * f[1]) / n; };

/** ω̲ × r̲ for ω̲ = ω e̲_z and a plane vector r̲. */
export const rotPart = (omega: number, r: P2): P2 => [-omega * r[1], omega * r[0]];

// ───────────────────────────── the plate of the proof animation (p. 35) ─────────────────────────────

/** Two forces F̲₁ at A₁, F̲₂ at A₂; B known with {v̲_B, ω}. Numbers chosen so that all parts are different and nothing is zero. */
export const PROOF: Plate = {
  B: [0, 0], vB: [1, 1], omega: 1,
  forces: [{ A: [-1.5, -1], F: [0.5, -1] }, { A: [1.5, 1], F: [1, 1] }],
};

// ───────────────────────────── Fig. 5.6, the ladder: parts for the figures (pp. 35–36) ─────────────────────────────

const S2 = Math.SQRT1_2;
/** Directions of the two forces of the ladder: F̲_B = G·(0, −1), F̲_C = W·(−√2/2, √2/2). */
export const LADDER_DIR = { G: [0, -1] as P2, W: [-S2, S2] as P2 };

/**
 * Both ways of the lecture for the ladder, with the pieces the figures draw.
 * Weg I (circled I, p. 35 right / III on p. 36): each force with the velocity of its own point.
 * Weg II (circled II, p. 35 left / IV on p. 36): R̲ and M̲_A in A, then R̲ · v̲_A + ω̲ · M̲_A.
 */
export function ladderParts(par: Ladder) {
  const m = ladder(par);
  const { L, G, W, v, omega } = par;
  // Weg I: the part of v̲_B along G̲ (only this part counts), the part of v̲_C along W̲
  const vB: P2 = [m.vB[0], m.vB[1]], vC: P2 = [m.vC[0], m.vC[1]];
  const alongG = shadow(vB, LADDER_DIR.G), alongW = shadow(vC, LADDER_DIR.W);
  // v̲_B = v̲_A + ω̲ × AB̲: the rotation parts
  const rotB: P2 = rotPart(omega, [m.AB[0], m.AB[1]]), rotC: P2 = rotPart(omega, [m.AC[0], m.AC[1]]);
  // Weg II: R̲ at A, the moments of the two forces about A (z-components)
  const R: P2 = [m.red.R[0], m.red.R[1]];
  const MAG = cross(m.AB, m.FB)[2], MAW = cross(m.AC, m.FC)[2];
  return {
    m, vB, vC, rotB, rotC, alongG, alongW,
    PB: G * alongG, PC: W * alongW,
    R, MAG, MAW, MA: MAG + MAW,
    RvA: dot(m.red.R, m.vA), MAomega: omega * (MAG + MAW),
    wegI: G * alongG + W * alongW,
    wegII: dot(m.red.R, m.vA) + omega * (MAG + MAW),
    L, G, W, v, omega,
  };
}
