/**
 * Beispiel Würfel, Rotation (lecture p. 19), handwritten solution, as a pure function of (step, t).
 * The 3D component CubeAnim only draws what this returns. Cube of edge a with A = O at the origin,
 * B = (a,0,0), E = (0,a,0), C = (a,a,a). Given: rotation, v_E = 0, v_A = (v,0,−v), v_B = (v_Bx, v, −v).
 *
 *  step 0  the data: v_A, the known part of v_B (dashed), E at rest
 *  step 1  SdpG along AB: the projections onto AB (x-direction) are equal ⇒ v_Bx = v
 *  step 2  v_A = ω × EA ⇒ ω_x = ω_z = v/a: the components ω_x e_x (blue) and ω_z e_z (green) appear at E
 *  step 3  v_B = ω × EB ⇒ ω_y = 0: a trial y-component at E (amber, dashed) shrinks to nothing
 *  step 4  ω = (v/a)(1,0,1), the diagonal of its components; μ: the line through E in the direction of ω —
 *          it passes through C
 *  step 5  check: turning the cube about μ, E and C stay where they are
 */
import { rotateAbout } from '../../physics/rotation';
import { type Vec3, add, cross, scale, sub } from '../../physics/vec';

export const CUBE = { a: 1.5, v: 1, KV: 0.55, KW: 0.6, TURN: (50 * Math.PI) / 180 };
const { a, v } = CUBE;
export const CA: Vec3 = [0, 0, 0], CB: Vec3 = [a, 0, 0], CE: Vec3 = [0, a, 0], CC: Vec3 = [a, a, a];
export const V_A: Vec3 = [v, 0, -v];
export const OMEGA: Vec3 = [v / a, 0, v / a];
export const CUBE_STEPS = 6;
export const VERTS: Vec3[] = [0, 1].flatMap((i) => [0, 1].flatMap((j) => [0, 1].map((k) => [i * a, j * a, k * a] as Vec3)));

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const seg = (t: number, t0: number, t1: number) => clamp01((t - t0) / (t1 - t0));

export interface CubeFrame {
  turn: number;
  verts: Vec3[];
  ghost: boolean;
  P: { A: Vec3; B: Vec3; C: Vec3; E: Vec3 };
  /** velocities as drawn (already scaled by KV), and v_Bx as currently known (0 = unknown) */
  vA: Vec3; vB: Vec3; vBx: number; vBknown: boolean;
  /** SdpG projections onto AB (x-direction), drawn length progress 0…1 */
  proj: number;
  EA: number; EB: number;
  /** ω arrow at E and the axis μ, drawn progress 0…1 */
  omega: number; mu: number;
  /** components ω_x e_x, ω_z e_z at E (drawn progress 0…1); trial ω_y (length factor) and the «ω_y = 0» label */
  comps: number; wy: number; wyZero: number;
}

export function cubeFrame(step: number, t: number): CubeFrame {
  const s = Math.max(0, Math.min(CUBE_STEPS - 1, step));
  const turn = s === 5 ? CUBE.TURN * ease(seg(t, 0.1, 0.9)) : 0;
  const R = (p: Vec3) => rotateAbout(p, CE, OMEGA, turn);
  const vBx = s === 0 ? 0 : s === 1 ? v * ease(seg(t, 0.35, 0.8)) : v;
  const vel = (p: Vec3) => scale(CUBE.KV, cross(OMEGA, sub(p, CE))); // v = ω × EP (E on μ)
  const A = R(CA), B = R(CB);
  return {
    turn,
    verts: VERTS.map(R),
    ghost: s === 5,
    P: { A, B, C: R(CC), E: R(CE) },
    vA: s === 5 ? vel(A) : scale(CUBE.KV, V_A),
    vB: s === 5 ? vel(B) : scale(CUBE.KV, [vBx, v, -v]),
    vBx,
    vBknown: s >= 1 && (s > 1 || t >= 0.8),
    proj: s === 0 ? 0 : s === 1 ? ease(seg(t, 0, 0.35)) : s >= 4 ? 0 : 1,
    EA: s === 2 ? ease(seg(t, 0, 0.5)) : s === 3 ? 0.35 : 0,
    EB: s === 3 ? ease(seg(t, 0, 0.5)) : 0,
    omega: s < 4 ? 0 : s === 4 ? ease(seg(t, 0, 0.5)) : 1,
    mu: s < 4 ? 0 : s === 4 ? ease(seg(t, 0.4, 0.9)) : 1,
    comps: s < 2 ? 0 : s === 2 ? ease(seg(t, 0.45, 0.9)) : s === 5 ? 1 - ease(seg(t, 0, 0.15)) : 1,
    wy: s === 3 ? 1 - ease(seg(t, 0.35, 0.8)) : 0,
    wyZero: s === 3 ? ease(seg(t, 0.8, 1)) : 0,
  };
}

/** Points of the axis μ for drawing: E − λ0·ω̂ … E + λ1·ω̂, through C. */
export const muEnds = (k: number): [Vec3, Vec3] => {
  const u = scale(1 / Math.hypot(...OMEGA), OMEGA), L = Math.hypot(a, a);
  return [add(CE, scale(-0.45, u)), add(CE, scale(-0.45 + (L + 0.95) * k, u))];
};
