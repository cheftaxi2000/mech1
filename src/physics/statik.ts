/**
 * Kapitel 6 «Statik» (HS 2018 Mitschrift, printed pp. 37–44): statische Äquivalenz, Resultierende, Moment einer Kraft
 * bezüglich eines Punktes und einer Achse, Moment einer Kräftegruppe, Dyname, spezielle Kräftegruppen, Gleichgewicht.
 * The numeric source of truth for the chapter-6 lessons; every worked example of the pages is checked in statik.test.ts.
 * Built on the 3D functions of vec.ts and force.ts (moment, rigidVelocity, powerSum).
 */
import { add, cross, dot, norm, scale, sub, type Vec3 } from './vec';
import { moment, powerSum, resultant, type PointForce } from './force';

export type { PointForce };

/* ------------------------------------------------------------------ groups of forces */

/** Moment of a group about P: M̲_P = Σ PA̲_i × F̲_i (p. 40). */
export const groupMoment = (P: Vec3, g: readonly PointForce[]): Vec3 =>
  g.reduce<Vec3>((m, f) => add(m, moment(P, f)), [0, 0, 0]);
/** Dyname in P: {R̲, M̲_P} (p. 41). */
export const dyname = (P: Vec3, g: readonly PointForce[]) => ({ R: resultant(g), M: groupMoment(P, g) });
/** Change of the reference point (p. 40, boxed): M̲_P = M̲_O + R̲ × OP̲. */
export const shiftMoment = (MO: Vec3, R: Vec3, O: Vec3, P: Vec3): Vec3 => add(MO, cross(R, sub(P, O)));
/** Power of a group for the rigid-body motion {v̲_B, ω̲}: Σ F̲_i · v̲_i (= R̲·v̲_B + ω̲·M̲_B, p. 34). */
export const groupPower = (g: readonly PointForce[], B: Vec3, vB: Vec3, omega: Vec3) => powerSum(g, B, vB, omega);
/** Statically equivalent (p. 37): same R̲ and the same moment about one (hence every) point. */
export function equivalent(g: readonly PointForce[], h: readonly PointForce[], tol = 1e-9): boolean {
  const O: Vec3 = [0, 0, 0];
  return norm(sub(resultant(g), resultant(h))) < tol && norm(sub(groupMoment(O, g), groupMoment(O, h))) < tol;
}
/** Equilibrium (p. 43): R̲ = 0 and M̲_P = 0. */
export const inEquilibrium = (g: readonly PointForce[], P: Vec3 = [0, 0, 0], tol = 1e-9) =>
  norm(resultant(g)) < tol && norm(groupMoment(P, g)) < tol;

/* ------------------------------------------------------------------ p. 37: Wippe, Hebel, Fig. 6.1 / 6.2 */

/** Seesaw (Wippe) with arms a (left, F_A down) and b (right, F_B down), turning with ω about the pivot: P = −F_A ω a + F_B ω b. */
export const seesawPower = (FA: number, FB: number, a: number, b: number, omega: number) => -FA * omega * a + FB * omega * b;
/** Lever at angle α: P = −F_B ω b sin α + F_A ω a sin α; zero for F_A = (b/a) F_B whatever α. */
export const leverPower = (FA: number, FB: number, a: number, b: number, alpha: number, omega: number) =>
  -FB * omega * b * Math.sin(alpha) + FA * omega * a * Math.sin(alpha);
/** The balancing force on the seesaw: F_A = (b/a) F_B. */
export const seesawBalance = (FB: number, a: number, b: number) => (b / a) * FB;

/** Fig. 6.1 / 6.2: beam on the x-axis, A in the middle, A₁ = A − a e̲_x, A₂ = A + a e̲_x (a = 1). */
export const FIG61 = {
  G: [{ A: [-1, 0, 0], F: [0, -1, 0] }, { A: [1, 0, 0], F: [0, -1, 0] }] as PointForce[],
  /** R̲ = F̲₁ + F̲₂ at A */
  Gstar: [{ A: [0, 0, 0], F: [0, -2, 0] }] as PointForce[],
  /** Fig. 6.2: F̲₂* of the same size as F̲₂ but at 45° (pointing down-left), the group {F̲₁, F̲₂*} vs {R̲} */
  G62: [{ A: [-1, 0, 0], F: [0, -1, 0] }, { A: [1, 0, 0], F: [-Math.SQRT1_2, -Math.SQRT1_2, 0] }] as PointForce[],
  P: [-1.6, 0, 0] as Vec3,
};
export type TestMotion = 'tx' | 'ty' | 'rotA' | 'rotP';
/** The rigid-body motions used to test equivalence: translations along x and y, rotations about A and about P. */
export function testMotion(m: TestMotion, P: Vec3 = FIG61.P): { B: Vec3; vB: Vec3; omega: Vec3 } {
  const O: Vec3 = [0, 0, 0];
  if (m === 'tx') return { B: O, vB: [1, 0, 0], omega: [0, 0, 0] };
  if (m === 'ty') return { B: O, vB: [0, 1, 0], omega: [0, 0, 0] };
  if (m === 'rotA') return { B: O, vB: [0, 0, 0], omega: [0, 0, 1] };
  return { B: P, vB: [0, 0, 0], omega: [0, 0, 1] };
}

/* ------------------------------------------------------------------ p. 38: Resultierende, half circle */

/** Half circle of radius r, line load q pointing to the centre (dF̲ = −q r dφ e̲_g): resultant of n elements (midpoint rule). */
export function halfCircleSum(q: number, r: number, n: number): Vec3 {
  let R: Vec3 = [0, 0, 0];
  for (let k = 0; k < n; k++) {
    const phi = ((k + 0.5) * Math.PI) / n, dphi = Math.PI / n;
    R = add(R, [-q * r * dphi * Math.cos(phi), -q * r * dphi * Math.sin(phi), 0]);
  }
  return R;
}
/** Exact: R̲ = −2 q r e̲_y. */
export const halfCircleExact = (q: number, r: number): Vec3 => [0, -2 * q * r, 0];

/* ------------------------------------------------------------------ p. 39–40: moment about a point and about an axis */

/** Lever arm a = distance of O from the line of action of F̲ through A: |M̲_O| = |F̲| a. */
export function leverArmLine(O: Vec3, A: Vec3, F: Vec3): number {
  const m = cross(sub(A, O), F);
  return norm(F) === 0 ? 0 : norm(m) / norm(F);
}
/** Point A moved along the line of action by s (in units of F̲). */
export const alongLine = (A: Vec3, F: Vec3, s: number): Vec3 => add(A, scale(s, F));
/** Moment about an axis γ through B with unit direction e: M_γ = e̲_γ · M̲_B (p. 39). */
export const axisMoment = (e: Vec3, B: Vec3, A: Vec3, F: Vec3): number => dot(e, cross(sub(A, B), F));
/** Split F̲ into F̲_γ (along the axis) and F̲^⊥ (normal to it). */
export function splitAxis(e: Vec3, F: Vec3) {
  const Fg = scale(dot(F, e), e);
  return { Fg, Fperp: sub(F, Fg) };
}
/** Korollar 2: a = distance between the axis and the line of action of F̲^⊥ through A (both seen in the plane E^⊥). */
export function axisLeverArm(e: Vec3, B: Vec3, A: Vec3, F: Vec3): number {
  const { Fperp } = splitAxis(e, F);
  const n = norm(Fperp);
  if (n < 1e-12) return 0;
  const BA = sub(A, B), BAperp = sub(BA, scale(dot(BA, e), e)); // A projected into the plane through B normal to e
  return norm(cross(BAperp, Fperp)) / n;
}
/** p. 39 cube: OA̲ = (L, L, 0), OB̲ = (L, 0, 0), F̲ = (0, F, 0) along the edge through B and A. */
export const cube39 = (L: number, F: number) => ({ O: [0, 0, 0] as Vec3, A: [L, L, 0] as Vec3, B: [L, 0, 0] as Vec3, F: [0, F, 0] as Vec3 });
/** p. 40 cube examples: axis z through the origin; A = (a, 0, 0) (left) or (a, a, 0) (right); F̲ = (0, F⊥, F_γ). */
export const cube40 = (a: number, Fperp: number, Fgamma: number, right: boolean) => ({
  A: (right ? [a, a, 0] : [a, 0, 0]) as Vec3, F: [0, Fperp, Fgamma] as Vec3, e: [0, 0, 1] as Vec3, B: [0, 0, 0] as Vec3,
});

/* ------------------------------------------------------------------ p. 41–43: special groups */

/** Two parallel forces F₁, F₂ (signed, along −e̲_y) at x₁, x₂ on a line: R = F₁ + F₂ at x_R with F₁ (x_R − x₁) = F₂ (x₂ − x_R). null for a couple (F₁ + F₂ = 0). */
export function parallelResultant(F1: number, x1: number, F2: number, x2: number): { R: number; xR: number } | null {
  const R = F1 + F2;
  if (Math.abs(R) < 1e-12) return null;
  return { R, xR: (F1 * x1 + F2 * x2) / R };
}
/** Moment of a couple {A | F̲}, {A′ | −F̲}: M̲ = F̲ × AA̲′ = A′A̲ × F̲, the same about every point (p. 42). */
export const coupleMoment = (A: Vec3, A2: Vec3, F: Vec3): Vec3 => cross(sub(A, A2), F);
/** Two non-parallel forces in a plane: their lines of action meet in S (p. 42, Fig. 6.12). */
export function intersection2(A1: Vec3, F1: Vec3, A2: Vec3, F2: Vec3): Vec3 | null {
  const det = F1[0] * -F2[1] - F1[1] * -F2[0];
  if (Math.abs(det) < 1e-12) return null;
  const dx = A2[0] - A1[0], dy = A2[1] - A1[1];
  const s = (dx * -F2[1] - dy * -F2[0]) / det;
  return [A1[0] + s * F1[0], A1[1] + s * F1[1], 0];
}

/**
 * Fig. 6.9: parallelogram linkage. Fixed supports O = (0, 0) and D = (d, 0); cranks of length l at angle θ from the x-axis;
 * top bar from C = O + l(cos θ, sin θ) to A = D + l(cos θ, sin θ). Both cranks turn with the same θ̇ = ω.
 */
export function linkage(theta: number, omega: number, l = 1.3, d = 2) {
  const u: Vec3 = [Math.cos(theta), Math.sin(theta), 0];
  const O: Vec3 = [0, 0, 0], D: Vec3 = [d, 0, 0];
  const C = add(O, scale(l, u)), A = add(D, scale(l, u));
  const vA = cross([0, 0, omega], sub(A, D)); // the top bar translates: v̲_C = v̲_A
  return { O, D, C, A, vA, vC: vA, vO: [0, 0, 0] as Vec3 };
}

/* ------------------------------------------------------------------ p. 43–44: equilibrium */

/** p. 43 cube (side a, A at the origin, x right, y back, z up): C = (a, 0, 0), B = (a, a, 0), D = (0, a, a). */
export function cube43(a: number, F: number): PointForce[] {
  return [
    { A: [0, 0, 0], F: [-F, 0, 0] },
    { A: [a, a, 0], F: [0, F, 0] },
    { A: [a, 0, 0], F: [0, 0, F] },
    { A: [0, a, a], F: [F, -F, -F] },
  ];
}
/**
 * Fig. 6.23 (Aufgabe 1): a disc with G = 8 (down), F₁ = 4 (to the right), F₂ = 10 (from the upper right at 45°, down-left),
 * supported at A (push up-right at 45°) and B (push up-left at 45°); all lines through the centre. Returns |A| = 10 + 2√2, |B| = 6√2 (not solved in the notes).
 */
export function disc623(G = 8, F1 = 4, F2 = 10) {
  const s = Math.SQRT1_2;
  // x: F1 − F2 s + A s − B s = 0 ;  y: −G − F2 s + A s + B s = 0
  const AminusB = (F2 * s - F1) / s, AplusB = (G + F2 * s) / s;
  return { A: (AminusB + AplusB) / 2, B: (AplusB - AminusB) / 2 };
}
/** p. 44 Waage: forces F₁ at −a₁ and F₂ at +a₂ (down), support A: A_y = F₁ + F₂, balance a₂ = a₁ F₁ / F₂. */
export const scaleBalance = (F1: number, a1: number, F2: number) => ({ Ay: F1 + F2, a2: (a1 * F1) / F2 });
