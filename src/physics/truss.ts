/**
 * Plane trusses as chains of rigid bars (lecture 3.2 «Fachwerk», example Fig. 3.24, and the Parallelogrammregel, Fig. 3.25).
 *
 * Ideal plane truss: bars are rigid bodies, joined freely rotatable at the nodes; all paths stay in one plane. So every bar
 * moves like the plane motion of lesson «Ebene Bewegung»: it has a Momentanzentrum (or translates).
 *
 * Example Fig. 3.24 (left unit L, e_x → right, e_y ↑ ; ω = z-component, positive = counter-clockwise):
 *   A(0,0) pin, C(L,0), D(L,−L), E(2L,−L), F(2L,−2L), B(3L,−2L) on a roller (moves horizontally), v_B = (−v, 0).
 *   Bars 1–5 (AC, AD, CE, CD, DE) form ONE rigid body about A («Z_{1-5} ≡ A»); the worked solution then uses
 *   bar 6 = DF, bar 7 = FB, bar 8 = EB (R-036: the print also shows a vertical line EF which a movable truss cannot contain).
 */
import { cross2, centreFromTwo, omegaFromTwo, perp, planeVelocity, type P2 } from './plane';

export type Node = 'A' | 'C' | 'D' | 'E' | 'F' | 'B';

export const nodes = (L = 1): Record<Node, P2> => ({ A: [0, 0], C: [L, 0], D: [L, -L], E: [2 * L, -L], F: [2 * L, -2 * L], B: [3 * L, -2 * L] });

export interface TrussSolution {
  L: number; v: number;
  P: Record<Node, P2>;
  /** velocities of all nodes */
  vel: Record<Node, P2>;
  /** angular velocities (z-component) of the body 1–5 and of the bars 6, 7, 8 */
  w15: number; w6: number; w7: number; w8: number;
  /** Momentanzentren */
  Z15: P2; Z6: P2; Z7: P2; Z8: P2;
}

const sub = (a: P2, b: P2): P2 => [a[0] - b[0], a[1] - b[1]];
const dot = (a: P2, b: P2) => a[0] * b[0] + a[1] * b[1];

/**
 * Solves the example from first principles (not from the lecture's numbers): unknowns ω_{1-5}, v_F; given v_B = (−v, 0).
 *  bar 8 (SdpG E–B): (v_B − v_E)·EB = 0 with v_E = ω_{1-5} e_z × AE  ⇒ ω_{1-5};
 *  bar 6 (SdpG D–F) and bar 7 (SdpG F–B) ⇒ the two components of v_F.
 */
export function solveTruss(v = 1, L = 1): TrussSolution {
  const P = nodes(L);
  const vB: P2 = [-v, 0];
  // bar 8: ω (perp(AE)·EB) = v_B·EB
  const AE = sub(P.E, P.A), EB = sub(P.B, P.E);
  const w15 = dot(vB, EB) / dot(perp(AE), EB);
  const rot = (N: Node): P2 => planeVelocity(P.A, [0, 0], w15, P[N]);
  const vD = rot('D');
  // v_F: (v_F − v_D)·DF = 0 and (v_B − v_F)·FB = 0
  const DF = sub(P.F, P.D), FB = sub(P.B, P.F);
  const det = cross2(DF, FB);
  const r1 = dot(vD, DF), r2 = dot(vB, FB); // v_F·DF = r1, v_F·FB = r2
  const vF: P2 = [(r1 * FB[1] - r2 * DF[1]) / det, (DF[0] * r2 - FB[0] * r1) / det];
  const vel: Record<Node, P2> = { A: [0, 0], C: rot('C'), D: vD, E: rot('E'), F: vF, B: vB };
  const w6 = omegaFromTwo(P.D, vD, P.F, vF);
  const w7 = omegaFromTwo(P.F, vF, P.B, vB);
  const w8 = omegaFromTwo(P.E, vel.E, P.B, vB);
  const Z = (a: Node, b: Node): P2 => {
    const c = centreFromTwo(P[a], vel[a], P[b], vel[b]);
    if (c.kind !== 'point') throw new Error(`no Momentanzentrum for ${a}${b}`);
    return c.Z;
  };
  return { L, v, P, vel, w15, w6, w7, w8, Z15: P.A, Z6: Z('D', 'F'), Z7: Z('F', 'B'), Z8: Z('E', 'B') };
}

/** The velocity of a point X of a body that turns with ω about Z: v = ω e_z × ZX. */
export const aboutCentre = (Z: P2, w: number, X: P2): P2 => planeVelocity(Z, [0, 0], w, X);

/**
 * The «alternative method» with two helper points of bar 8's body (the lecture's sketch c): H₂ lies L/2 left of Z₈ on the
 * horizontal through Z₈, H₁ lies L above Z₈ on the vertical. Their velocities are easy (v ↑ and 2v →); the SdpG E↔H₂ and
 * E↔H₁ are two linear equations for v_E. Returns v_E.
 */
export function velocityEByHelperPoints(s: TrussSolution): { H1: P2; H2: P2; vH1: P2; vH2: P2; vE: P2 } {
  const Z = s.Z8, L = s.L;
  const H2: P2 = [Z[0] - L / 2, Z[1]], H1: P2 = [Z[0], Z[1] + L];
  const vH2 = aboutCentre(Z, s.w8, H2), vH1 = aboutCentre(Z, s.w8, H1);
  // v_E·EH = v_H·EH for H = H1, H2 (E is also a point of bar 8)
  const a = sub(H2, s.P.E), b = sub(H1, s.P.E);
  const det = cross2(a, b);
  const r1 = dot(vH2, a), r2 = dot(vH1, b);
  const vE: P2 = [(r1 * b[1] - r2 * a[1]) / det, (a[0] * r2 - b[0] * r1) / det];
  return { H1, H2, vH1, vH2, vE };
}

/* ---------------------------------------------------------------- Parallelogrammregel, Fig. 3.25 */
/**
 * Closure residual of the lecture's proof: for the parallelogram ABCD (AB = DC =: a, BC = AD =: b) and the angular velocities
 * ω₁ (bar AB), ω₂ (BC), ω₃ (DC), ω₄ (AD): going once around, v_A = v_A + (ω₄ − ω₂) e_z × BC + (ω₃ − ω₁) e_z × AB,
 * i.e. the residual (ω₄ − ω₂) e_z × b + (ω₃ − ω₁) e_z × a must vanish.
 */
export function parallelogramResidual(a: P2, b: P2, w: [number, number, number, number]): P2 {
  const [w1, w2, w3, w4] = w;
  const pa = perp(a), pb = perp(b);
  return [(w4 - w2) * pb[0] + (w3 - w1) * pa[0], (w4 - w2) * pb[1] + (w3 - w1) * pa[1]];
}

/**
 * The two routes to v_C in the proof (A at rest, v_A = 0): via B, v_C = v_B + ω₂ e_z × BC with v_B = ω₁ e_z × AB;
 * via D, v_C = v_D + ω₃ e_z × DC with v_D = ω₄ e_z × AD. The gap v_C(via B) − v_C(via D) is zero exactly when the loop closes.
 */
export function parallelogramRoutes(a: P2, b: P2, w: [number, number, number, number]): { vC1: P2; vC2: P2; gap: P2 } {
  const [w1, w2, w3, w4] = w;
  const pa = perp(a), pb = perp(b);
  const vC1: P2 = [w1 * pa[0] + w2 * pb[0], w1 * pa[1] + w2 * pb[1]];
  const vC2: P2 = [w4 * pb[0] + w3 * pa[0], w4 * pb[1] + w3 * pa[1]];
  return { vC1, vC2, gap: [vC1[0] - vC2[0], vC1[1] - vC2[1]] };
}
