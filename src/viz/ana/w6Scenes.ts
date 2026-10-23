/**
 * Pure geometry for the week-6 figures (complex plane: polar form, multiplication, powers, roots, regions).
 * No React here; every frame is unit-tested in w6Scenes.test.ts.
 */
import {
  arg, cabs, cmul, cx, distCond, fromPolar, holds, norm2pi, reIz, roots, type C, type Rel,
} from '../../analysis/week6';
import type { P2, Range } from '../plot/plotMath';

export interface Win { x: Range; y: Range }
const PI = Math.PI;
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const ease = (t: number) => { const s = clamp01(t); return s * s * (3 - 2 * s); };

export const inside = (w: Win, p: P2, m = 0) => {
  const sx = w.x[1] - w.x[0], sy = w.y[1] - w.y[0];
  return p[0] >= w.x[0] + m * sx && p[0] <= w.x[1] - m * sx && p[1] >= w.y[0] + m * sy && p[1] <= w.y[1] - m * sy;
};

/** Points of a circular arc of radius r around c from angle a0 to a1 (either direction). */
export function arcPts(r: number, a0: number, a1: number, c: P2 = [0, 0], n = 48): P2[] {
  const k = Math.max(2, Math.ceil((n * Math.abs(a1 - a0)) / (2 * PI)) + 1);
  return Array.from({ length: k + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / k; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as P2; });
}
export const circlePts = (r: number, c: P2 = [0, 0], n = 96) => arcPts(r, 0, 2 * PI, c, n);

/** Snap a dragged position to polar steps (radius step dr in [rMin, rMax], angle step da). r < rMin/2 → 0. */
export function snapPolar(x: number, y: number, dr: number, da: number, rMin: number, rMax: number): { r: number; phi: number } {
  const r0 = Math.hypot(x, y);
  if (r0 < rMin / 2) return { r: 0, phi: 0 };
  const r = Math.max(rMin, Math.min(rMax, Math.round(r0 / dr) * dr));
  let phi = Math.round(Math.atan2(y, x) / da) * da;
  phi = norm2pi(phi);
  return { r, phi };
}

/** Label position just beyond the tip of a vector from 0 to p, in viewBox offsets (dx, dy) and an anchor side. */
export function tipOffset(p: P2, d = 12): { dx: number; dy: number; anchor: 'l' | 'r' | 't' | 'b' } {
  const l = Math.hypot(p[0], p[1]) || 1, ux = p[0] / l, uy = p[1] / l;
  // near the vertical axis the label goes to the right (above, it would hit the axis name «Im»)
  if (Math.abs(ux) <= 0.38) return { dx: d * 0.9, dy: -d * 0.4 * uy, anchor: 'l' };
  return { dx: d * ux, dy: -d * uy, anchor: ux > 0 ? 'l' : 'r' };
}

/* ------------------------------------------------------------------ multiplication, slide example as animation */

export const MUL_WIN: Win = { x: [-2, 7], y: [-1, 7] };
export const MUL_EX = { r1: 2, p1: PI / 6, r2: 3, p2: PI / 3 };

/**
 * (2e^{iπ/6})(3e^{iπ/3}) step by step.
 * step 0: z1 grows out of 0 (length 2, angle π/6).  step 1: stretch by r2 = 3 (length 2 → 6).
 * step 2: turn by φ2 = π/3 (angle π/6 → π/2); the result 6e^{iπ/2} = 6i.
 */
export function mulScene(step: number, t: number) {
  const { r1, p1, r2, p2 } = MUL_EX;
  const e = ease(t);
  const grow = step === 0 ? e : 1;
  const r = step === 0 ? r1 * grow : step === 1 ? r1 * (1 + (r2 - 1) * e) : r1 * r2;
  const phi = step <= 1 ? p1 : p1 + p2 * e;
  const cur = fromPolar(r, phi);
  return {
    z1: fromPolar(r1 * grow, p1), z2: fromPolar(r2, p2), cur, r, phi,
    showZ2: step >= 1,
    stretched: step >= 1 && e > 0,
    turnArc: step === 2 ? arcPts(1.6, p1, phi) : null,
    done: step === 2 && t >= 1,
    result: cmul(fromPolar(r1, p1), fromPolar(r2, p2)),
  };
}

/* ------------------------------------------------------------------ z^4 = −16, construction */

export const ROOT_WIN: Win = { x: [-3, 3], y: [-3, 3] };
/**
 * step 0: −16 = 16e^{iπ}: the direction θ = π (w itself lies far left, outside the picture).
 * step 1: radius ⁴√16 = 2: the circle.  step 2: start angle θ/4 = π/4 → z0.
 * step 3: turn by 2π/4 = π/2 three times → z1, z2, z3.  step 4: the square, the four solutions.
 */
export function rootAnimScene(step: number, t: number) {
  const rs = roots(cx(-16, 0), 4);
  const e = ease(t);
  const circleFrac = step < 1 ? 0 : step === 1 ? e : 1;
  const startArc = step < 2 ? 0 : step === 2 ? e : 1;
  // during step 3 a marker turns from π/4 to π/4 + 3π/2; roots appear when passed
  const turned = step < 3 ? 0 : step === 3 ? 3 * e : 3;
  const shown = rs.map((_, k) => (k === 0 ? step >= 2 && (step > 2 || t >= 1) : step > 3 || (step === 3 && turned >= k - 1e-9)));
  return {
    roots: rs.map((r) => [r.z.re, r.z.im] as P2),
    shown,
    circle: circleFrac > 0 ? arcPts(2, PI, PI + 2 * PI * circleFrac, [0, 0], 96) : null,
    startArc: startArc > 0 ? arcPts(0.8, 0, (PI / 4) * startArc) : null,
    marker: step >= 2 ? fromPolar(2, (PI / 4) * startArc + (PI / 2) * turned) : null,
    turnArc: step >= 3 && turned > 0 ? arcPts(2.35, PI / 4, PI / 4 + (PI / 2) * turned) : null,
    square: step >= 4 ? e : 0,
    showDir: true,
  };
}

/* ------------------------------------------------------------------ Re(iz) > 1, construction */

export const HALF_WIN: Win = { x: [-3, 3.5], y: [-3, 3] };
export const HALF_Z: C = cx(2, -1.5);
/**
 * step 0: a test point z = a + bi (here 2 − 1,5i).  step 1: iz = rotation by 90°: iz = ai − b, so Re(iz) = −b.
 * step 2: Re(iz) > 1 ⇔ −b > 1 ⇔ b < −1: the half-plane below the dashed line b = −1.
 */
export function halfScene(step: number, t: number) {
  const e = ease(t);
  const rot = step === 0 ? 0 : step === 1 ? e : 1;
  const iz = fromPolar(cabs(HALF_Z), arg(HALF_Z) + (PI / 2) * rot);
  return {
    z: HALF_Z, iz, rot,
    exact: cmul(cx(0, 1), HALF_Z),
    reIz: reIz(HALF_Z),
    arc: rot > 0 ? arcPts(0.9, arg(HALF_Z) - 2 * PI, arg(HALF_Z) - 2 * PI + (PI / 2) * rot) : null,
    showRe: step >= 1 && rot >= 1,
    shade: step === 2 ? e : step > 2 ? 1 : 0,
  };
}

/* ------------------------------------------------------------------ regions */

export type Cond =
  | { kind: 'dist'; c: C; rel: Rel; R: number; tex: string }
  | { kind: 'lin'; a: number; b: number; rel: Rel; d: number; tex: string; value?: (z: C) => number };

/** Does z satisfy the condition? dist: |z − c| rel R; lin: a·Re z + b·Im z rel d (or the slide's own value(z)). */
export function satisfies(cond: Cond, z: C): boolean {
  if (cond.kind === 'dist') return distCond(z, cond.c, cond.rel, cond.R);
  const v = cond.value ? cond.value(z) : cond.a * z.re + cond.b * z.im;
  return holds(v, cond.rel, cond.d);
}
/** Boundary included? (≤, ≥, =) → solid; (<, >) → dashed. */
export const boundaryIncluded = (c: Cond) => c.rel === '<=' || c.rel === '>=' || c.rel === '=';

export interface RegionPreset { id: string; conds: Cond[]; test: C; win: Win }
const DISC: Cond = { kind: 'dist', c: cx(1, 1), rel: '<=', R: 2, tex: String.raw`|z - (1 + i)| \leq 2` };
const HALF: Cond = { kind: 'lin', a: 0, b: -1, rel: '>', d: 1, tex: String.raw`\mathrm{Re}(iz) > 1`, value: reIz };
const DIAG: Cond = { kind: 'lin', a: 1, b: -1, rel: '>=', d: 0, tex: String.raw`\mathrm{Re}\,z \geq \mathrm{Im}\,z` };
const RWIN: Win = { x: [-3.5, 4.5], y: [-3.5, 4] };
export const REGION_PRESETS: RegionPreset[] = [
  { id: 'disc', conds: [DISC], test: cx(2, 2), win: RWIN },
  { id: 'half', conds: [HALF], test: cx(1, -2), win: RWIN },
  { id: 'ring', conds: [{ kind: 'dist', c: cx(0, 0), rel: '>=', R: 1, tex: String.raw`|z| \geq 1` }, { kind: 'dist', c: cx(0, 0), rel: '<', R: 2, tex: String.raw`|z| < 2` }], test: cx(1.5, 0), win: RWIN },
  { id: 'diag', conds: [DIAG], test: cx(2, 1), win: RWIN },
  { id: 'both', conds: [DISC, DIAG], test: cx(2, 0.5), win: RWIN },
];

/** Polygon (math coordinates) of the closed half-plane a x + b y ≥ d (or ≤ for '<', '<=') clipped to a big box around the window. */
export function halfPlanePoly(c: Extract<Cond, { kind: 'lin' }>, w: Win): P2[] {
  const big = 4 * Math.max(w.x[1] - w.x[0], w.y[1] - w.y[0]);
  const cx0 = (w.x[0] + w.x[1]) / 2, cy0 = (w.y[0] + w.y[1]) / 2;
  let box: P2[] = [[cx0 - big, cy0 - big], [cx0 + big, cy0 - big], [cx0 + big, cy0 + big], [cx0 - big, cy0 + big]];
  const sgn = c.rel === '<' || c.rel === '<=' ? -1 : 1;
  const f = (p: P2) => sgn * (c.a * p[0] + c.b * p[1] - c.d);
  // Sutherland–Hodgman against one line
  const out: P2[] = [];
  for (let i = 0; i < box.length; i++) {
    const P = box[i], Q = box[(i + 1) % box.length], fp = f(P), fq = f(Q);
    if (fp >= 0) out.push(P);
    if (fp * fq < 0) { const s = fp / (fp - fq); out.push([P[0] + s * (Q[0] - P[0]), P[1] + s * (Q[1] - P[1])]); }
  }
  box = out;
  return box;
}
/** The boundary line a x + b y = d as a long segment through the window. */
export function linePts(c: Extract<Cond, { kind: 'lin' }>, w: Win): [P2, P2] {
  const big = 4 * Math.max(w.x[1] - w.x[0], w.y[1] - w.y[0]);
  const n2 = c.a * c.a + c.b * c.b, p0: P2 = [(c.a * c.d) / n2, (c.b * c.d) / n2];
  const dir: P2 = [-c.b / Math.sqrt(n2), c.a / Math.sqrt(n2)];
  return [[p0[0] - big * dir[0], p0[1] - big * dir[1]], [p0[0] + big * dir[0], p0[1] + big * dir[1]]];
}
