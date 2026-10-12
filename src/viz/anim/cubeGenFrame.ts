/**
 * Beispiel Würfel, allgemeine Bewegung (lecture p. 23 + handwritten continuation), as a pure function of (step, t).
 * Cube of edge L with B at the origin (x toward the viewer, y to the right, z up), P₁ = (L,L,0), P₂ = (0,L,L),
 * P₃ = (0,0,L). Given v₁ = (−v,0,0), v₂ = (0,0,v), v₃ = (−v,0,0); wanted v_B and ω ("Kinemate in B").
 *
 *  step 0  the data; v_B unknown
 *  step 1  v₃ = v₁ + ω × P₁P₃ and v₁ = v₃ ⇒ ω × P₁P₃ = 0 ⇒ ω ∥ P₁P₃ (a space diagonal): ω = (ω_x, ω_x, −ω_x)
 *  step 2  v₂ = v₃ + ω × P₃P₂: at P₂ the copy of v₃ plus (v, 0, v) ends at the tip of v₂ ⇒ ω_x = v/L
 *  step 3  v_B = v₃ + ω × P₃B = (−2v, v, 0)
 *  step 4  every corner: v = v_B + ω × BM (one corner named M as an example: M = (0, L, 0), v_M = (−v, v, v))
 */
import { rigidVelocity } from '../../physics/rigid';
import { type Vec3, scale } from '../../physics/vec';

export const CG = { L: 1.5, v: 1, KV: 0.85, KW: 0.65 };
const { L, v } = CG;
export const GB: Vec3 = [0, 0, 0], G1: Vec3 = [L, L, 0], G2: Vec3 = [0, L, L], G3: Vec3 = [0, 0, L];
export const GV1: Vec3 = [-v, 0, 0], GV2: Vec3 = [0, 0, v], GV3: Vec3 = [-v, 0, 0];
export const G_OMEGA: Vec3 = scale(v / L, [1, 1, -1]);
export const G_VB: Vec3 = [-2 * v, v, 0];
export const GEN_CUBE_STEPS = 5;
export const G_VERTS: Vec3[] = [0, 1].flatMap((i) => [0, 1].flatMap((j) => [0, 1].map((k) => [i * L, j * L, k * L] as Vec3)));
/** The four corners that are not B, P₁, P₂, P₃; the one at G_M_INDEX is named M in step 4. */
export const G_OTHERS: Vec3[] = [[L, 0, 0], [0, L, 0], [L, 0, L], [L, L, L]];
export const G_M_INDEX = 1;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const seg = (t: number, t0: number, t1: number) => clamp01((t - t0) / (t1 - t0));

export interface CubeGenFrame {
  /** drawn progress 0…1 of each element */
  diag: number; edge32: number; copy32: number; diff: number; omega: number; edge3B: number; vB: number; others: number;
  /** velocities as drawn (scaled by KV) */
  v1: Vec3; v2: Vec3; v3: Vec3; vBd: Vec3; diffVec: Vec3;
  othersV: Vec3[];
}

export function cubeGenFrame(step: number, t: number): CubeGenFrame {
  const s = Math.max(0, Math.min(GEN_CUBE_STEPS - 1, step));
  const k = CG.KV;
  return {
    diag: s === 0 ? 0 : s === 1 ? ease(seg(t, 0.2, 0.7)) : 1,
    edge32: s === 2 ? ease(seg(t, 0, 0.25)) : 0,
    copy32: s === 2 ? ease(seg(t, 0.2, 0.4)) : 0,
    diff: s === 2 ? ease(seg(t, 0.4, 0.65)) : 0,
    omega: s < 2 ? 0 : s === 2 ? ease(seg(t, 0.6, 0.95)) : 1,
    edge3B: s === 3 ? ease(seg(t, 0, 0.35)) : 0,
    vB: s < 3 ? 0 : s === 3 ? ease(seg(t, 0.35, 0.8)) : 1,
    others: s === 4 ? ease(seg(t, 0.1, 0.7)) : 0,
    v1: scale(k, GV1), v2: scale(k, GV2), v3: scale(k, GV3), vBd: scale(k, G_VB),
    diffVec: scale(k, [GV2[0] - GV3[0], GV2[1] - GV3[1], GV2[2] - GV3[2]]),
    othersV: G_OTHERS.map((P) => scale(k, rigidVelocity(G_VB, G_OMEGA, GB, P))),
  };
}
