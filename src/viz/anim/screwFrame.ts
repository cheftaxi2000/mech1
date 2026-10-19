/**
 * Fig. 3.16 «Zentralachse und Schraube» (lecture p. 24) as a pure function of (step, t): every arrow, line, dot and
 * label of the animation, in world coordinates (z up). ScrewAnim.tsx only draws what this returns.
 *
 *  step 0  the Kinemate {v_B, ω} in B
 *  step 1  v_B = v_ω + v_B^⊥ (part along ω, part perpendicular to ω)
 *  step 2  walk along g (⊥ ω and ⊥ v_B^⊥): ω × BP = −ω x e^⊥ grows with x, v_P = v_ω + (v_B^⊥ − ω x) e^⊥
 *  step 3  at x = v_B^⊥/ω the perpendicular part vanishes: Z; the line ζ ∥ ω through Z has v = v_ω
 *  step 4  beyond Z (B*) the perpendicular part points the other way
 *  step 5  all perpendicular parts together are a turning about ζ: v_P = v_ω + ω × ZP
 *  step 6  the motion itself: turning with ω about ζ and sliding with v_ω along ζ — a screw (Schraubung)
 */
import { screwPosition } from '../../physics/screw';
import { type Vec3, add, cross, norm, scale, sub } from '../../physics/vec';
import type { LabelPart } from '../RichLabel';
import { SG, SG_AXIS, SG_G, SG_VPERP, SG_VW, SG_XZ } from '../screwGeom';

export const SCREW_STEPS = 7;
export type Col = 'v' | 'vw' | 'perp' | 'rot' | 'omega' | 'zeta' | 'dark' | 'muted';
export interface FArrow { key: string; from: Vec3; to: Vec3; col: Col; w: number; o?: number }
export interface FLine { key: string; pts: Vec3[]; col: Col; w: number; dashed?: boolean; o?: number }
export interface FDot { key: string; at: Vec3; col: Col; r: number }
export interface FLabel { key: string; at: Vec3; parts: LabelPart[]; col: Col }
export interface ScrewFrame {
  /** pose of the body: turned by `angle` about ζ (the vertical line through Z), shifted by `shift` */
  angle: number; shift: Vec3;
  /** step 7: faint copies of the body every quarter turn it has passed (like the steps of a spiral staircase) */
  ghosts: { angle: number; shift: Vec3 }[];
  /** where the camera is (the view moves back in step 7) */
  cam: Cam;
  arrows: FArrow[]; lines: FLine[]; dots: FDot[]; labels: FLabel[];
  /** for tests: where P is on g (distance x from B), or null */
  x: number | null;
}

/** Start view (z up), as in Fig. 3.16: ζ on the left, B to the right, g running down to the left, v_B^⊥ up to the left. */
export interface Cam { pos: Vec3; target: Vec3 }
/** steps 1–6: close around B, g and Z; step 7 moves back and up so the whole turn fits (same direction of view) */
export const CAM_CLOSE: Cam = { target: [0, 0.3, 0.2], pos: [2.66, -1.235, 2.6] };
export const CAM_WIDE: Cam = { target: [0, 0.12, 0.8], pos: [3.68, -2.01, 4.12] };
export const SA_TARGET = CAM_CLOSE.target, SA_CAMERA = CAM_CLOSE.pos;
const lerp3 = (a: Vec3, b: Vec3, k: number): Vec3 => add(a, scale(k, sub(b, a)));

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const seg = (t: number, t0: number, t1: number) => clamp01((t - t0) / (t1 - t0));

const { B, vB, omega, KV, KW } = SG;
const Z = SG_AXIS.point;
const W = norm(omega);
/** P on g at distance x from B */
export const onG = (x: number): Vec3 => add(B, scale(x, SG_G.dir));
/** velocity at P from the Grundgleichung */
const vAt = (P: Vec3): Vec3 => add(vB, cross(omega, sub(P, B)));
/** x at the end of step 3 (P between B and Z) and of step 5 (B*, beyond Z) */
export const X_P = 0.6 * SG_XZ;
export const X_BSTAR = SG_XZ + 0.3;
/** the faint velocity arrows along g (the lecture's fan) */
export const COMB = [0.6 * SG_XZ, SG_XZ + 0.45];
/** points of the circle about ζ through B (step 6): their perpendicular parts are ω × ZP */
export const RING = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4 + Math.PI / 2);
const R_B = norm(sub(B, Z));
const ringPt = (a: number): Vec3 => [Z[0] + R_B * Math.cos(a), Z[1] + R_B * Math.sin(a), Z[2]];
/** the line ζ as drawn */
export const ZETA_LO = -0.62, ZETA_HI = 1.45, ZETA_HI7 = 2.0;
/** a second point on ζ (the lecture's Z′) */
export const ZP: Vec3 = [Z[0], Z[1], 1.0];
/** the screw motion of step 7: one full turn (T = 2π/ω) */
export const T_TURN = (2 * Math.PI) / W;
/** body points whose paths are traced in step 7: B (a helix) and Z (a straight line along ζ) */
export const TRACKED: { key: string; p: Vec3; col: Col }[] = [
  { key: 'B', p: B, col: 'v' },
  { key: 'Z', p: Z, col: 'zeta' },
];
const ul = (t: string, sub?: string, sup?: string): LabelPart => ({ t, u: true, sub, sup });

export function screwFrame(step: number, t: number): ScrewFrame {
  const s = Math.max(0, Math.min(SCREW_STEPS - 1, step));
  const arrows: FArrow[] = [], lines: FLine[] = [], dots: FDot[] = [], labels: FLabel[] = [];
  const vtip = (P: Vec3, v: Vec3, k = 1) => add(P, scale(KV * k, v));
  let angle = 0, shift: Vec3 = [0, 0, 0], x: number | null = null;
  const ghosts: { angle: number; shift: Vec3 }[] = [];
  let cam: Cam = CAM_CLOSE;
  const lo: Vec3 = [Z[0], Z[1], ZETA_LO], hi: Vec3 = [Z[0], Z[1], ZETA_HI];

  if (s < 6) {
    // ---- the Kinemate in B (steps 1–6). ω is a free vector: drawn just beside B so v_ω (on B) stays visible.
    const grow = s === 0 ? ease(seg(t, 0.1, 0.8)) : 1;
    const wFrom = add(B, [0, 0.34, 0]);
    arrows.push({ key: 'omega', from: wFrom, to: add(wFrom, scale(KW * grow, omega)), col: 'omega', w: 5 });
    arrows.push({ key: 'vB', from: B, to: vtip(B, vB, grow), col: 'v', w: 3.5 });
    if (grow > 0.9) {
      labels.push({ key: 'omega', at: add(wFrom, [0, 0.1, KW + 0.1]), parts: [ul('ω')], col: 'omega' });
      labels.push({ key: 'vB', at: add(vtip(B, vB), [0, 0.04, 0.13]), parts: [ul('v', 'B')], col: 'v' });
    }
    // ---- step 2: v_B = v_ω + v_B^⊥ at B
    const split = s === 0 ? 0 : s === 1 ? ease(seg(t, 0.1, 0.7)) : 1;
    if (split > 0.01) {
      arrows.push({ key: 'vwB', from: B, to: vtip(B, SG_VW, split), col: 'vw', w: 4 });
      arrows.push({ key: 'vpB', from: B, to: vtip(B, SG_VPERP, split), col: 'perp', w: 4 });
      if (s === 1 && t > 0.7) {
        const o = ease(seg(t, 0.7, 0.9));
        lines.push({ key: 'par1', pts: [vtip(B, SG_VW), vtip(B, vB)], col: 'muted', w: 1.2, dashed: true, o });
        lines.push({ key: 'par2', pts: [vtip(B, SG_VPERP), vtip(B, vB)], col: 'muted', w: 1.2, dashed: true, o });
      }
      if (split > 0.9) {
        if (s === 1) labels.push({ key: 'vpB', at: add(vtip(B, SG_VPERP), [0.02, -0.17, -0.06]), parts: [ul('v', 'B', '⊥')], col: 'perp' });
        if (s === 1) labels.push({ key: 'vwB', at: add(vtip(B, SG_VW), [0, 0.18, -0.02]), parts: [ul('v', 'ω')], col: 'vw' });
      }
    }
    dots.push({ key: 'B', at: B, col: 'v', r: 0.045 });
    labels.push({ key: 'B', at: add(B, [0.12, 0.12, -0.13]), parts: [{ t: 'B' }], col: 'v' });

    // ---- steps 3–6: the line g, P walking along it
    if (s >= 2) {
      const gIn = s === 2 ? ease(seg(t, 0, 0.2)) : 1;
      const g0 = onG(-0.42), g1 = onG(X_BSTAR + 0.3);
      lines.push({ key: 'g', pts: [g0, add(g0, scale(gIn, sub(g1, g0)))], col: 'dark', w: 1.6 });
      if (gIn > 0.9) labels.push({ key: 'g', at: add(g0, [0.06, 0.06, 0.1]), parts: [{ t: 'g' }], col: 'dark' });
      x = s === 2 ? X_P * ease(seg(t, 0.2, 0.85))
        : s === 3 ? X_P + (SG_XZ - X_P) * ease(seg(t, 0, 0.35))
        : s === 4 ? SG_XZ + (X_BSTAR - SG_XZ) * ease(seg(t, 0.05, 0.55))
        : X_BSTAR;
      const P = onG(x);
      // step 6 fades the walk out (the fan, P's arrows) and draws the circle about ζ instead
      const walk = s === 5 ? 1 - ease(seg(t, 0, 0.3)) : 1;
      // the fan of velocities along g (the points P has passed), and the straight line through their tips
      if (walk > 0.01) {
        for (const c of COMB.filter((c) => c < x! - 1e-6)) {
          const Q = onG(c);
          arrows.push({ key: `comb${c.toFixed(3)}`, from: Q, to: vtip(Q, vAt(Q)), col: 'v', w: 1.5, o: 0.5 * walk });
        }
        if (x > 0.05) lines.push({ key: 'tips', pts: [vtip(B, vB), vtip(P, vAt(P))], col: 'v', w: 1, dashed: true, o: 0.6 * walk });
      }
      // at P: copy of v_B^⊥ (orange), ω × BP (purple, against e^⊥), v_ω (blue), and the sum v_P (red)
      const rot = cross(omega, sub(P, B));
      const atZ = Math.abs(x - SG_XZ) < 1e-6;
      // at Z the two perpendicular arrows cancel: they fade out (step 4) and come back when P moves on (step 5)
      const perpO = walk * (s === 3 ? 1 - ease(seg(t, 0.3, 0.5)) : s === 4 ? ease(seg(t, 0.05, 0.2)) : 1);
      if (perpO > 0.01 && x > 0.02) {
        arrows.push({ key: 'copyP', from: P, to: vtip(P, SG_VPERP), col: 'perp', w: 2.6, o: perpO });
        arrows.push({ key: 'rotP', from: P, to: vtip(P, rot), col: 'rot', w: 3.5, o: perpO });
      }
      if (walk > 0.01 && x > 0.02) {
        if (!atZ) arrows.push({ key: 'vwP', from: P, to: vtip(P, SG_VW), col: 'vw', w: 3, o: walk });
        if (!atZ) arrows.push({ key: 'vP', from: P, to: vtip(P, vAt(P)), col: 'v', w: 3.2, o: walk });
      }
      if (s === 2 && x > 0.3) {
        labels.push({ key: 'rotP', at: add(vtip(P, rot), [0.1, 0.1, -0.07]), parts: [ul('ω'), { t: '×', up: true }, ul('BP')], col: 'rot' });
        labels.push({ key: 'vP', at: add(vtip(P, vAt(P)), [0, -0.14, 0.12]), parts: [ul('v', 'P')], col: 'v' });
        labels.push({ key: 'P', at: add(P, [0.13, 0.13, -0.14]), parts: [{ t: 'P' }], col: 'v' });
        // the distance x from B to P, marked just in front of g
        const off: Vec3 = [0.12, 0, -0.03];
        lines.push({ key: 'xbar', pts: [add(B, off), add(P, off)], col: 'dark', w: 1.2 });
        labels.push({ key: 'x', at: add(scale(0.5, add(B, P)), [0.26, 0, -0.08]), parts: [{ t: 'x' }], col: 'dark' });
      }
      if (s === 4 && t > 0.5) {
        const Bs = onG(X_BSTAR);
        labels.push({ key: 'Bs', at: add(Bs, [0.05, -0.3, -0.02]), parts: [{ t: 'B*' }], col: 'v' });
        labels.push({ key: 'vBs', at: add(vtip(Bs, vAt(Bs)), [-0.12, -0.12, 0.14]), parts: [ul('v', 'B*')], col: 'v' });
      }
      if (s >= 3) {
        if (walk > 0.5 && !atZ) dots.push({ key: 'P', at: P, col: 'v', r: 0.04 });
        // Z, ζ and the points on ζ
        const zIn = s === 3 ? ease(seg(t, 0.35, 0.55)) : 1;
        if (zIn > 0.01) {
          dots.push({ key: 'Z', at: Z, col: 'zeta', r: 0.05 });
          arrows.push({ key: 'vZ', from: Z, to: vtip(Z, SG_VW, zIn), col: 'vw', w: 4 });
          if (zIn > 0.9) {
            labels.push({ key: 'Z', at: add(Z, [0.12, -0.12, -0.13]), parts: [{ t: 'Z' }], col: 'zeta' });
            if (s === 3) labels.push({ key: 'vZ', at: add(Z, [0, -0.36, 0.28]), parts: [ul('v', 'Z'), { t: '=', up: true }, ul('v', 'ω')], col: 'vw' });
          }
        }
        const zeta = s === 3 ? ease(seg(t, 0.55, 0.9)) : 1;
        if (zeta > 0.01) {
          const mid = scale(0.5, add(lo, hi)), half = scale(0.5 * zeta, sub(hi, lo));
          lines.push({ key: 'zeta', pts: [sub(mid, half), add(mid, half)], col: 'zeta', w: 4, o: 0.85 });
          if (zeta > 0.9) {
            labels.push({ key: 'zeta', at: add(hi, [0, -0.12, 0.02]), parts: [{ t: 'ζ' }], col: 'zeta' });
            dots.push({ key: "Z'", at: ZP, col: 'zeta', r: 0.04 });
            arrows.push({ key: "vZ'", from: ZP, to: vtip(ZP, SG_VW), col: 'vw', w: 4 });
            labels.push({ key: "Z'", at: add(ZP, [0, -0.16, -0.04]), parts: [{ t: 'Z′' }], col: 'zeta' });
          }
        }
      }
      // step 6: all perpendicular parts together are a turning about ζ: v^⊥ = ω × ZP on the circle through B
      if (s === 5) {
        const ring = ease(seg(t, 0.3, 0.85));
        if (ring > 0.01) {
          const n = 64, a0 = Math.PI / 2;
          lines.push({ key: 'ring', pts: Array.from({ length: n + 1 }, (_, i) => ringPt(a0 + (2 * Math.PI * ring * i) / n)), col: 'perp', w: 1.3, dashed: true, o: 0.85 });
          for (const a of RING) {
            if (a - a0 > 2 * Math.PI * ring + 1e-9 || Math.abs(a - a0) < 1e-9) continue; // B carries its own v_B^⊥
            const Q = ringPt(a);
            arrows.push({ key: `ring${a.toFixed(2)}`, from: Q, to: vtip(Q, cross(omega, sub(Q, Z))), col: 'perp', w: 2.6 });
          }
        }
        if (ring > 0.95) {
          const Q = ringPt(Math.PI); // the point of the circle on the far left
          labels.push({ key: 'ringLab', at: add(vtip(Q, cross(omega, sub(Q, Z))), [0, 0.05, 0.15]), parts: [ul('ω'), { t: '×', up: true }, ul('ZP')], col: 'perp' });
        }
      }
    }
  } else {
    // ---- step 7: the screw motion (one full turn, the Kinemate kept constant)
    const k = ease(seg(t, 0, 0.14));
    cam = { pos: lerp3(CAM_CLOSE.pos, CAM_WIDE.pos, k), target: lerp3(CAM_CLOSE.target, CAM_WIDE.target, k) };
    const u = seg(t, 0.16, 0.97), time = u * T_TURN;
    angle = W * time; shift = scale(time, SG_VW);
    for (let j = 0; j < 4 && j / 4 <= u - 0.02; j++) { const tk = (j / 4) * T_TURN; ghosts.push({ angle: W * tk, shift: scale(tk, SG_VW) }); }
    const hi7: Vec3 = [Z[0], Z[1], ZETA_HI + (ZETA_HI7 - ZETA_HI) * k];
    lines.push({ key: 'zeta', pts: [lo, hi7], col: 'zeta', w: 4, o: 0.85 });
    labels.push({ key: 'zeta', at: add(hi7, [0, -0.12, 0.02]), parts: [{ t: 'ζ' }], col: 'zeta' });
    // ω on ζ, below the body
    const w0: Vec3 = [Z[0], Z[1], ZETA_LO + 0.02];
    arrows.push({ key: 'omega', from: w0, to: add(w0, scale(0.5, omega)), col: 'omega', w: 5 });
    labels.push({ key: 'omega', at: add(w0, [0, 0.17, 0.3]), parts: [ul('ω')], col: 'omega' });
    for (const tr of TRACKED) {
      const n = Math.max(2, Math.round(160 * u));
      const pts = Array.from({ length: n + 1 }, (_, i) => screwPosition(B, vB, omega, tr.p, (time * i) / n));
      if (u > 0.005) lines.push({ key: `trail${tr.key}`, pts, col: tr.col, w: 2.4, o: 0.9 });
      const now = pts[pts.length - 1];
      dots.push({ key: `trk${tr.key}`, at: now, col: tr.col, r: 0.045 });
      const v = add(SG_VW, cross(omega, sub(now, add(Z, shift)))); // v = v_ω + ω × ZP, Z moved along ζ
      arrows.push({ key: `v${tr.key}`, from: now, to: vtip(now, v), col: tr.key === 'Z' ? 'vw' : 'v', w: 3 });
    }
    const nowB = screwPosition(B, vB, omega, B, time);
    labels.push({ key: 'B', at: add(nowB, [0, 0, -0.17]), parts: [{ t: 'B' }], col: 'v' });
    const nowZ = screwPosition(B, vB, omega, Z, time);
    labels.push({ key: 'Z', at: add(nowZ, [0.12, -0.12, -0.13]), parts: [{ t: 'Z' }], col: 'zeta' });
  }
  return { angle, shift, ghosts, arrows, lines, dots, labels, x, cam };
}
