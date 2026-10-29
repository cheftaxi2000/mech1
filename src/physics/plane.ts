/**
 * Plane motion and the instantaneous centre (lecture pp. 26–27).
 *
 * - p. 26: in a plane motion every point keeps v_z = 0. From v_A = v_P + ω × PA the z-component reads
 *   v_Az = v_Pz + ω_x PA_y − ω_y PA_x, so ω_x PA_y − ω_y PA_x = 0 for every PA in the plane ⇒ ω = (0, 0, ω_z) or 0.
 * - Satz vom Momentanzentrum: for ω ≠ 0 exactly one point Z of the (extended) plane is at rest; every velocity is
 *   perpendicular to the ray from Z and has the size ω r.
 * - Fig. 3.20 (rolling wheel) and the ladder of p. 27 (solution with the Momentanzentrum: app supplement, R-022).
 *
 * Planar vectors are [x, y]; ω is the z-component of ω̲ (positive = counter-clockwise, e_z out of the page).
 */
import { cross, type Vec3 } from './vec';

export type P2 = readonly [number, number];

const sub2 = (a: P2, b: P2): P2 => [a[0] - b[0], a[1] - b[1]];
const dot2 = (a: P2, b: P2) => a[0] * b[0] + a[1] * b[1];
/** z-component of a × b for planar a, b. */
export const cross2 = (a: P2, b: P2) => a[0] * b[1] - a[1] * b[0];
/** e_z × a: a turned by +90°. */
export const perp = (a: P2): P2 => [-a[1], a[0]];
const len2 = (a: P2) => Math.hypot(a[0], a[1]);

/** Grundgleichung in the plane: v_M = v_B + ω e_z × BM. */
export function planeVelocity(B: P2, vB: P2, w: number, M: P2): P2 {
  const r = sub2(M, B);
  return [vB[0] - w * r[1], vB[1] + w * r[0]];
}

/** p. 26: the z-component that ω × PA adds to v_A (with PA in the plane E: PA_z = 0). */
export const outOfPlane = (omega: Vec3, PA: P2): number => cross(omega, [PA[0], PA[1], 0])[2];

/**
 * p. 26, «∀ PA_x, PA_y»: if ω_x PA_y − ω_y PA_x = 0 holds for two non-parallel vectors PA = a, b, then ω_x = ω_y = 0.
 * Solves the 2×2 system [a_y, −a_x; b_y, −b_x]·(ω_x, ω_y) = (c_a, c_b) for given right-hand sides (Cramer).
 * Returns null when a ∥ b (one direction alone does not decide: R-011).
 */
export function tiltFromTwoDirections(a: P2, b: P2, ca: number, cb: number): [number, number] | null {
  const det = a[1] * -b[0] - -a[0] * b[1]; // = cross2(a, b)
  if (Math.abs(det) < 1e-12) return null;
  return [(ca * -b[0] - -a[0] * cb) / det, (a[1] * cb - b[1] * ca) / det];
}

/** ω of a plane motion from two velocities of the same rigid body: ω = (AB × (v_B − v_A))_z / |AB|². */
export function omegaFromTwo(A: P2, vA: P2, B: P2, vB: P2): number {
  const ab = sub2(B, A);
  return cross2(ab, sub2(vB, vA)) / dot2(ab, ab);
}

/** SdpG defect (p. 12): v_A·AB − v_B·AB; zero for velocities of a rigid body. */
export const sdpgDefect2 = (A: P2, vA: P2, B: P2, vB: P2) => { const ab = sub2(B, A); return dot2(vA, ab) - dot2(vB, ab); };

/** The point at rest: v_Z = v_A + ω e_z × AZ = 0 ⇒ AZ = (e_z × v_A)/ω. */
export function restPoint(A: P2, vA: P2, w: number): P2 | null {
  if (Math.abs(w) < 1e-12) return null;
  const q = perp(vA);
  return [A[0] + q[0] / w, A[1] + q[1] / w];
}

export type Centre =
  | { kind: 'point'; Z: P2; w: number; via: 'perpendiculars' | 'tips' | 'restingPoint' }
  | { kind: 'translation' }
  | { kind: 'inconsistent' };

/**
 * The lecture's construction of the Momentanzentrum from two points A, B of the body:
 * Z lies on the perpendicular to v_A through A and on the perpendicular to v_B through B.
 * Degenerate cases (handled honestly):
 *  - v_A = v_B: translation, ω = 0, «Z at infinity»;
 *  - both perpendiculars are the same line (v_A ∥ v_B, both ⊥ AB): the directions do not fix Z; the sizes do —
 *    Z is where the line through the arrow tips meets the line AB;
 *  - one point at rest: Z is that point.
 * Velocities that violate the SdpG (not a rigid body) give 'inconsistent'.
 */
export function centreFromTwo(A: P2, vA: P2, B: P2, vB: P2, tol = 1e-9): Centre {
  const ab = sub2(B, A), L = len2(ab), scaleV = Math.max(len2(vA), len2(vB), 1e-12);
  if (Math.abs(sdpgDefect2(A, vA, B, vB)) > tol * L * scaleV) return { kind: 'inconsistent' };
  const dv = sub2(vB, vA);
  if (len2(dv) < tol * scaleV) return { kind: 'translation' };
  const w = omegaFromTwo(A, vA, B, vB);
  if (len2(vA) < tol * scaleV) return { kind: 'point', Z: A, w, via: 'restingPoint' };
  if (len2(vB) < tol * scaleV) return { kind: 'point', Z: B, w, via: 'restingPoint' };
  const nA = perp(vA), nB = perp(vB), det = cross2(nA, nB);
  if (Math.abs(det) > tol * len2(nA) * len2(nB)) {
    // A + s nA = B + u nB  ⇒  s = (AB × nB)/(nA × nB)
    const s = cross2(ab, nB) / det;
    return { kind: 'point', Z: [A[0] + s * nA[0], A[1] + s * nA[1]], w, via: 'perpendiculars' };
  }
  // parallel perpendiculars and not a translation: both velocities ⊥ AB (the SdpG then reads 0 = 0).
  // Signed sizes along the common direction n: v = ω·(signed distance from Z) ⇒ Z = A + AB·a/(a − b).
  const n = [vA[0] / len2(vA), vA[1] / len2(vA)] as P2, a = dot2(vA, n), b = dot2(vB, n);
  const k = a / (a - b);
  return { kind: 'point', Z: [A[0] + k * ab[0], A[1] + k * ab[1]], w, via: 'tips' };
}

/** Where the line through the tips of the (parallel) arrows at A and B meets the line AB (the «tips» construction). */
export function tipsIntersection(A: P2, vA: P2, B: P2, vB: P2): P2 | null {
  const tA: P2 = [A[0] + vA[0], A[1] + vA[1]], tB: P2 = [B[0] + vB[0], B[1] + vB[1]];
  const d1 = sub2(B, A), d2 = sub2(tB, tA), det = cross2(d1, d2);
  if (Math.abs(det) < 1e-12) return null;
  const s = cross2(sub2(tA, A), d2) / det;
  return [A[0] + s * d1[0], A[1] + s * d1[1]];
}

/* ---------------------------------------------------------------- Fig. 3.20: rolling wheel */
/**
 * Wheel of radius R rolling on the ground y = 0 to the right, centre O = (x_O, R), angular speed ω > 0 clockwise
 * (so ω̲ = −ω e_z). Z = contact point (x_O, 0). Velocity of a wheel point P: v_P = −ω e_z × ZP.
 */
export function wheelPointVelocity(xO: number, w: number, P: P2): P2 {
  return planeVelocity([xO, 0], [0, 0], -w, P);
}

/* ---------------------------------------------------------------- p. 27: ladder with the Momentanzentrum (R-022) */
/**
 * Ladder AB of length L, A on the floor, B at the wall (wall x = 0 on the right, corner C = (0, 0)), floor angle φ.
 * A = (−L cos φ, 0), B = (0, L sin φ). Given v_A = (−v_H, 0) (A moves left, B slides down).
 * Momentanzentrum: perpendicular to v_A through A (vertical) ∩ perpendicular to v_B through B (horizontal).
 */
export function ladderMZ(L: number, phi: number, vH: number) {
  const A: P2 = [-L * Math.cos(phi), 0], B: P2 = [0, L * Math.sin(phi)], C: P2 = [0, 0];
  const Z: P2 = [A[0], B[1]];
  const ZA = L * Math.sin(phi), ZB = L * Math.cos(phi);
  const w = -vH / (L * Math.sin(phi)); // ω̲ = w e_z: negative = clockwise
  const vV = Math.abs(w) * ZB; // = v_H cot φ
  const vA: P2 = [-vH, 0], vB: P2 = [0, -vV];
  return { A, B, C, Z, ZA, ZB, w, vV, vA, vB, ZC: len2(sub2(Z, C)) };
}
/** Ladder state at time t when A moves left with constant v_H, starting at angle φ₀ (φ decreases). */
export function ladderAt(L: number, phi0: number, vH: number, t: number) {
  const xA = -L * Math.cos(phi0) - vH * t;
  const phi = Math.acos(Math.min(1, -xA / L));
  return { phi, ...ladderMZ(L, phi, vH) };
}

/* ---------------------------------------------------------------- ladder: polodes (fixed and moving centrode, app supplement) */
/**
 * The ladder's instantaneous centre Z = (−L cos φ, L sin φ) traces
 *  - in the room (fixed polode, «Rastpolbahn»): the circle of radius L about the corner C, and
 *  - in the ladder (moving polode, «Gangpolbahn»): the circle of radius L/2 about the middle M of the ladder (Thales: A, B, C and Z lie on it).
 * The ladder moves as if the small circle rolled without slipping inside the big one (a Cardan circle pair).
 * Consequently every point P of the ladder at the fraction s from A (s = 0: A, s = 1: B) runs on an ellipse with the
 * semi-axes L(1−s) (horizontal) and sL (vertical) — the trammel of Archimedes; A and B run on straight lines.
 */
export function ladderPoint(L: number, phi: number, s: number): P2 {
  return [-L * (1 - s) * Math.cos(phi), s * L * Math.sin(phi)];
}
/** Middle of the ladder. */
export const ladderMiddle = (L: number, phi: number): P2 => ladderPoint(L, phi, 0.5);
/** Z in the body frame of the ladder (origin M, first axis along A→B): the point (L/2)(cos(π − 2φ), sin(π − 2φ)) of the moving polode. */
export function ladderZBody(L: number, phi: number): P2 {
  return [(-L / 2) * Math.cos(2 * phi), (L / 2) * Math.sin(2 * phi)];
}
/** Body-frame point of the moving polode at body angle β, placed in the room for the ladder at angle φ. */
export function movingPolodePoint(L: number, phi: number, beta: number): P2 {
  const M = ladderMiddle(L, phi), a = phi + beta;
  return [M[0] + (L / 2) * Math.cos(a), M[1] + (L / 2) * Math.sin(a)];
}
/** Velocity of the ladder point at fraction s when A slides left with v_H: v_P = ω̲ × ZP with ω from the instantaneous centre. */
export function ladderPointVelocity(L: number, phi: number, vH: number, s: number): P2 {
  const m = ladderMZ(L, phi, vH);
  return planeVelocity(m.Z, [0, 0], m.w, ladderPoint(L, phi, s));
}
