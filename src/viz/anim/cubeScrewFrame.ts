/**
 * Problem Fig. 3.30 (lecture p. 25 + the handwritten solution) as a pure function of (step, t).
 * Cube of edge 1 m, B at the origin (x toward the viewer, y to the right, z up), Kinemate in B:
 * v_B = (0, 2, 2) m/s, ω = (0, 2, 0) s⁻¹. Every number comes from physics/screw.ts (fig330Solution).
 *
 *  step 0  the data
 *  step 1  v_ω = (v_B · e_ω) e_ω = (0, 2, 0) and v_B^⊥ = (0, 0, 2)
 *  step 2  P ∈ ζ ⇔ v_B + ω × BP = v_ω: at P = (1, 0, 0) the copy of v_B plus ω × BP = (0, 0, −2) gives v_ω
 *  step 3  y_P is arbitrary: P slides along ω and nothing changes (ω × ω = 0) — the whole line is ζ
 *  step 4  ζ: (1, 0, 0) + λ (0, 1, 0): position vector of one point plus λ times a direction
 *  step 5  if the Kinemate stayed the same: the cube screws about ζ (a quarter turn)
 */
import { rigidVelocity } from '../../physics/rigid';
import { FIG330, fig330Solution, screwPosition } from '../../physics/screw';
import { type Vec3, add, cross, norm, scale, sub } from '../../physics/vec';
import type { LabelPart } from '../RichLabel';
import type { Cam, FArrow, FDot, FLabel, FLine } from './screwFrame';

export const CUBE_SCREW_STEPS = 6;
export const CS = { KV: 0.27, KW: 0.27 };
export const SOL = fig330Solution();
const { B, vB, omega, edge: L } = FIG330;
export const CS_VERTS: Vec3[] = [0, 1].flatMap((i) => [0, 1].flatMap((j) => [0, 1].map((k) => [i * L, j * L, k * L] as Vec3)));
/** the cube's corner on ζ where the construction happens */
export const CS_P: Vec3 = [SOL.xP, 0, SOL.zP];
/** ω drawn as a free vector above the cube's back top edge (the 1st invariant: the same everywhere) */
export const CS_W0: Vec3 = [0, 0.2, 1.22];
/** the quarter turn of step 6: time t = (π/2)/|ω| */
export const CS_T = Math.PI / 2 / norm(omega);
export const CS_CAM: Cam = { target: [0.55, 0.95, 0.42], pos: [0.55 + 4.15, 0.95 + 1.0, 0.42 + 2.35] };

export interface CubeScrewFrame {
  /** pose of the cube: corners as drawn */
  verts: Vec3[];
  /** the start position, drawn faintly once the cube has moved */
  ghost: boolean;
  arrows: FArrow[]; lines: FLine[]; dots: FDot[]; labels: FLabel[];
  /** for tests: where P is */
  P: Vec3 | null;
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const seg = (t: number, t0: number, t1: number) => clamp01((t - t0) / (t1 - t0));
const ul = (t: string, sub?: string, sup?: string): LabelPart => ({ t, u: true, sub, sup });
const up = (t: string): LabelPart => ({ t, up: true });

export function cubeScrewFrame(step: number, t: number): CubeScrewFrame {
  const s = Math.max(0, Math.min(CUBE_SCREW_STEPS - 1, step));
  const arrows: FArrow[] = [], lines: FLine[] = [], dots: FDot[] = [], labels: FLabel[] = [];
  const { KV, KW } = CS;
  const vt = (P: Vec3, v: Vec3, k = 1) => add(P, scale(KV * k, v));
  let verts = CS_VERTS, P: Vec3 | null = null;

  if (s < 5) {
    // the data (always): v_B at B, ω as a free vector
    const grow = s === 0 ? ease(seg(t, 0.1, 0.7)) : 1;
    arrows.push({ key: 'vB', from: B, to: vt(B, vB, grow), col: 'v', w: 3.5 });
    arrows.push({ key: 'omega', from: CS_W0, to: add(CS_W0, scale(KW * grow, omega)), col: 'omega', w: 5 });
    if (grow > 0.9) {
      labels.push({ key: 'vB', at: add(vt(B, vB), [0, 0.05, 0.13]), parts: [ul('v', 'B')], col: 'v' });
      labels.push({ key: 'omega', at: add(CS_W0, [0, KW * norm(omega) + 0.14, 0.04]), parts: [ul('ω')], col: 'omega' });
    }
    // step 2: the split v_B = v_ω + v_B^⊥
    const split = s === 0 ? 0 : s === 1 ? ease(seg(t, 0.1, 0.65)) : 1;
    if (split > 0.01) {
      arrows.push({ key: 'vwB', from: B, to: vt(B, SOL.vw, split), col: 'vw', w: 4.5 });
      arrows.push({ key: 'vpB', from: B, to: vt(B, SOL.vperp, split), col: 'perp', w: 4.5 });
      if (split > 0.9 && s === 1) {
        lines.push({ key: 'par1', pts: [vt(B, SOL.vw), vt(B, vB)], col: 'muted', w: 1.2, dashed: true });
        lines.push({ key: 'par2', pts: [vt(B, SOL.vperp), vt(B, vB)], col: 'muted', w: 1.2, dashed: true });
      }
      if (split > 0.9 && s <= 2) {
        labels.push({ key: 'vwB', at: add(vt(B, SOL.vw), [0, -0.12, -0.12]), parts: [ul('v', 'ω')], col: 'vw' });
        labels.push({ key: 'vpB', at: add(vt(B, SOL.vperp), [0, -0.16, 0.02]), parts: [ul('v', 'B', '⊥')], col: 'perp' });
      }
    }
    // steps 3–5: the point P on ζ and its velocity v_P = v_B + ω × BP = v_ω
    if (s >= 2) {
      const yP = s === 3 ? 1.0 * ease(seg(t, 0.1, 0.8)) : s === 4 ? 1.0 : 0;
      P = [CS_P[0], CS_P[1] + yP, CS_P[2]];
      const tri = s === 2 ? ease(seg(t, 0.15, 0.75)) : 1;
      const bp = s === 2 ? ease(seg(t, 0, 0.25)) : 1;
      // BP (position vector, dark)
      arrows.push({ key: 'BP', from: B, to: add(B, scale(bp, sub(P, B))), col: 'dark', w: 2.4 });
      // at P: the copy of v_B (grey), from its tip ω × BP (purple, pointing down), together v_ω (blue)
      const rot = cross(omega, sub(P, B));
      if (tri > 0.01) {
        arrows.push({ key: 'copy', from: P, to: vt(P, vB, Math.min(1, tri * 2)), col: 'muted', w: 2.4 });
        if (tri > 0.5) arrows.push({ key: 'rot', from: vt(P, vB), to: add(vt(P, vB), scale(KV * (tri - 0.5) * 2, rot)), col: 'rot', w: 3.5 });
        if (tri > 0.95) arrows.push({ key: 'vP', from: P, to: vt(P, rigidVelocity(vB, omega, B, P)), col: 'vw', w: 4.5 });
      }
      dots.push({ key: 'P', at: P, col: 'v', r: 0.04 });
      labels.push({ key: 'P', at: add(P, [0.12, 0.02, -0.16]), parts: [{ t: 'P' }], col: 'v' });
      if (s === 2 && tri > 0.95) {
        labels.push({ key: 'rot', at: add(add(vt(P, vB), scale(KV * 0.5, rot)), [0, 0.32, 0]), parts: [ul('ω'), up('×'), ul('BP')], col: 'rot' });
        labels.push({ key: 'vP', at: add(vt(P, SOL.vw), [0.1, 0.12, -0.12]), parts: [ul('v', 'P'), up('='), ul('v', 'ω')], col: 'vw' });
        labels.push({ key: 'BP', at: add(scale(0.55, add(B, P)), [0, -0.14, 0.06]), parts: [ul('BP')], col: 'dark' });
      }
      // step 4: the line ζ appears behind the sliding P
      if (s >= 3) {
        const grow3 = s === 3 ? ease(seg(t, 0.1, 0.8)) : 1;
        const z0: Vec3 = add(SOL.axis.point, scale(-0.55, SOL.axis.dir)), z1: Vec3 = add(SOL.axis.point, scale(1.0 * grow3 + 0.55 * grow3, SOL.axis.dir));
        lines.push({ key: 'zeta', pts: [z0, add(z0, scale(grow3, sub(z1, z0)))], col: 'zeta', w: 5, o: 0.85 });
        if (grow3 > 0.9) labels.push({ key: 'zeta', at: add(z1, [0, 0.12, 0.08]), parts: [{ t: 'ζ' }], col: 'zeta' });
      }
      // step 5: ζ = (1, 0, 0) + λ (0, 1, 0)
      if (s === 4) {
        const k = ease(seg(t, 0.1, 0.6));
        arrows.push({ key: 'pos', from: B, to: add(B, scale(k, SOL.axis.point)), col: 'dark', w: 3 });
        const d = ease(seg(t, 0.45, 0.9));
        if (d > 0.01) arrows.push({ key: 'dir', from: SOL.axis.point, to: add(SOL.axis.point, scale(d, SOL.axis.dir)), col: 'zeta', w: 5 });
        if (t > 0.6) labels.push({ key: 'pos', at: add(scale(0.5, SOL.axis.point), [0, -0.3, 0.02]), parts: [up('(1, 0, 0)')], col: 'dark' });
        if (d > 0.9) labels.push({ key: 'dir', at: add(SOL.axis.point, [0.06, 0.5, -0.2]), parts: [up('(0, 1, 0)')], col: 'zeta' });
      }
    }
    dots.push({ key: 'B', at: B, col: 'v', r: 0.045 });
    labels.push({ key: 'B', at: [0.02, -0.15, -0.1], parts: [{ t: 'B' }], col: 'v' });
  } else {
    // step 6: the cube screws about ζ (a quarter turn), if the Kinemate stayed the same
    const u = ease(seg(t, 0.08, 0.95)), time = u * CS_T;
    verts = CS_VERTS.map((p) => screwPosition(B, vB, omega, p, time));
    const z0: Vec3 = add(SOL.axis.point, scale(-0.55, SOL.axis.dir)), z1: Vec3 = add(SOL.axis.point, scale(2.75, SOL.axis.dir));
    lines.push({ key: 'zeta', pts: [z0, z1], col: 'zeta', w: 5, o: 0.85 });
    labels.push({ key: 'zeta', at: add(z1, [0, 0.12, 0.08]), parts: [{ t: 'ζ' }], col: 'zeta' });
    const n = Math.max(2, Math.round(60 * u));
    const trail = Array.from({ length: n + 1 }, (_, i) => screwPosition(B, vB, omega, B, (time * i) / n));
    if (u > 0.01) lines.push({ key: 'trailB', pts: trail, col: 'v', w: 2.2, o: 0.85 });
    const Bn = trail[trail.length - 1];
    const Zn = add(SOL.axis.point, scale(time, SOL.vw)); // the point of ζ that started at (1, 0, 0)
    arrows.push({ key: 'vB', from: Bn, to: vt(Bn, add(SOL.vw, cross(omega, sub(Bn, Zn)))), col: 'v', w: 3 });
    dots.push({ key: 'B', at: Bn, col: 'v', r: 0.045 });
    labels.push({ key: 'B', at: add(Bn, [0.1, -0.14, -0.08]), parts: [{ t: 'B' }], col: 'v' });
    // ω drawn on ζ, beyond the cube's start position (at the left)
    const w0 = add(SOL.axis.point, scale(-0.55, SOL.axis.dir));
    arrows.push({ key: 'omega', from: w0, to: add(w0, scale(KW, omega)), col: 'omega', w: 5 });
    labels.push({ key: 'omega', at: add(w0, [0, 0.27, 0.14]), parts: [ul('ω')], col: 'omega' });
  }
  return { verts, ghost: s === 5 && t > 0.08, arrows, lines, dots, labels, P };
}
