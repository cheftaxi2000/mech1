/**
 * The body and Kinemate shared by the figures of lesson «Kinemate, Zentralachse & Schraube» (L13): the invariants
 * explorer, the Fig. 3.16 animation and the screw explorer. Pure data, tested in screwGeom.test.ts.
 *
 * Laid out like the lecture's Fig. 3.16: ω vertical, B to the right of the central axis ζ, the line g through B
 * running down to the left to Z (on ζ) and on to B*. World coordinates are z-up (Scene); here
 *   ω = (0, 0, 1),  B = (0, 0.75, 0),  v_B = (−0.75, 0, 0.25)   ⇒   ζ: the vertical line through Z = (0, 0, 0),
 *   e^⊥ = (−1, 0, 0), g = e_ω × e^⊥ = (0, −1, 0), |BZ| = v_B^⊥/ω = 0.75, pitch p = v_ω/ω = 0.25.
 */
import { centralAxis, lineG, vOmegaPart, vPerpPart } from '../physics/screw';
import { type Vec3, norm } from '../physics/vec';

export const SG = {
  B: [0, 0.75, 0] as Vec3,
  vB: [-0.75, 0, 0.25] as Vec3,
  omega: [0, 0, 1] as Vec3,
  /** the slab-shaped body: x across, y along g, z height (top face z = 0 contains B, Z and B*) */
  box: { x: [-0.5, 0.5], y: [-0.6, 1.05], z: [-0.25, 0] } as Record<'x' | 'y' | 'z', [number, number]>,
  /** drawing scales: velocity → length, ω → length */
  KV: 1.1,
  KW: 0.72,
};

export const SG_AXIS = centralAxis(SG.B, SG.vB, SG.omega)!;
export const SG_VW = vOmegaPart(SG.vB, SG.omega);
export const SG_VPERP = vPerpPart(SG.vB, SG.omega);
export const SG_G = lineG(SG.vB, SG.omega)!;
/** x of Z on g: v_B^⊥/ω */
export const SG_XZ = SG_G.vPerp / norm(SG.omega);

type P3 = [number, number, number];
const { x: X, y: Y, z: Zr } = SG.box;
/** the 8 corners, indexed i·4 + j·2 + k (i: x, j: y, k: z) */
export const SG_VERTS: Vec3[] = [0, 1].flatMap((i) => [0, 1].flatMap((j) => [0, 1].map((k) => [X[i], Y[j], Zr[k]] as Vec3)));
/** the 12 edges as pairs of corner indices */
export const SG_EDGES: [number, number][] = (() => {
  const e: [number, number][] = [];
  for (let i = 0; i < 8; i++) for (const bit of [1, 2, 4]) if (!(i & bit)) e.push([i, i | bit]);
  return e;
})();
export const SG_CENTER: Vec3 = [(X[0] + X[1]) / 2, (Y[0] + Y[1]) / 2, (Zr[0] + Zr[1]) / 2];
export const SG_SIZE: P3 = [X[1] - X[0], Y[1] - Y[0], Zr[1] - Zr[0]];
