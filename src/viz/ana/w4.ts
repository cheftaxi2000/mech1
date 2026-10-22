/**
 * Pure geometry of the week-4 figures (Ü4: secant → tangent, both sides, product area, chain lines, inverse mirror,
 * tangent zoom, normal). No React; tested in w4.test.ts.
 */
import type { P2, Range } from '../plot/plotMath';
import { CHAIN, INV, SQ_H, SQ_X0, TAN_EXAMPLES, chainRates, sq, tangent, type TanExample } from '../../analysis/deriv';

/* ---------------------------------------------------------------- secant → tangent animation (Ü4 p. 2) */
export const SEC_WIN = { x: [-0.45, 2.7] as Range, y: [-0.7, 5.2] as Range, w: 400, h: 340 };
/** easing used for every motion step */
export const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

export interface SecantFrame {
  h: number;
  /** how much of the slope triangle is drawn (0..1), step 1 builds it */
  tri: number;
  /** opacity of the tangent (0..1), last step */
  tan: number;
  /** number of filled table cells */
  filled: number;
  /** triangle labels Δx, Δy readable (triangle big enough) */
  triLabels: boolean;
}
export const SEC_STEPS = 5;
/**
 * Step 0: h = 1, the triangle Δx = 1, Δy = 3 is drawn. Steps 1–3: Q slides to h = 0.5, 0.1, 0.01 (geometric
 * interpolation, so the motion looks even on the way to 0). Step 4: the tangent (m = 2) appears; the secant lies on it.
 */
export function secantFrame(step: number, t: number): SecantFrame {
  const e = ease(t);
  if (step <= 0) return { h: SQ_H[0], tri: e, tan: 0, filled: t >= 1 ? 1 : 0, triLabels: true };
  if (step <= 3) {
    const a = SQ_H[step - 1], b = SQ_H[step];
    const h = a * (b / a) ** e;
    return { h, tri: 1, tan: 0, filled: t >= 1 ? step + 1 : step, triLabels: h >= 0.3 };
  }
  return { h: SQ_H[3], tri: 1, tan: e, filled: 4, triLabels: false };
}
export const secantPts = (h: number) => ({ P: [SQ_X0, sq(SQ_X0)] as P2, Q: [SQ_X0 + h, sq(SQ_X0 + h)] as P2, C: [SQ_X0 + h, sq(SQ_X0)] as P2 });

/* ---------------------------------------------------------------- left and right secants (Ü4 p. 3) */
export type SideCase = 'sq' | 'abs';
export const SIDE_CASES: Record<SideCase, { f: (x: number) => number; x0: number; x: Range; y: Range; hMax: number }> = {
  sq: { f: sq, x0: 1, x: [-0.5, 2.5], y: [-0.6, 4.4], hMax: 1 },
  abs: { f: Math.abs, x0: 0, x: [-2.4, 2.4], y: [-0.9, 2.6], hMax: 2 },
};
export function sides(c: SideCase, h: number) {
  const { f, x0 } = SIDE_CASES[c];
  const P: P2 = [x0, f(x0)], Qm: P2 = [x0 - h, f(x0 - h)], Qp: P2 = [x0 + h, f(x0 + h)];
  return { P, Qm, Qp, mLeft: (Qm[1] - P[1]) / (Qm[0] - P[0]), mRight: (Qp[1] - P[1]) / (Qp[0] - P[0]) };
}

/* ---------------------------------------------------------------- product rule area */
export const PROD_WIN = { x: [-0.35, 3.75] as Range, y: [-0.35, 2.75] as Range, w: 400, h: 302 };
export function prodRects(u: number, v: number, Du: number, Dv: number) {
  const r = (x0: number, y0: number, x1: number, y1: number): P2[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  return { main: r(0, 0, u, v), stripU: r(u, 0, u + Du, v), stripV: r(0, v, u, v + Dv), corner: r(u, v, u + Du, v + Dv) };
}

/* ---------------------------------------------------------------- chain rule: three number lines */
export const CHAIN_WIN = { x: [-0.3, 6.3] as Range, y: [-0.55, 3.05] as Range, w: 400, h: 230 };
export const CHAIN_LEVELS = { x: 0, u: 1.3, g: 2.6 } as const;
export function chainBars(dx: number) {
  const r = chainRates(dx);
  return { ...r, xBar: [CHAIN.x0, CHAIN.x0 + dx] as Range, uBar: [r.u0, r.u1] as Range, gBar: [r.g0, r.g1] as Range };
}

/* ---------------------------------------------------------------- inverse: mirror the slope triangle */
export const INV_WIN = { x: [-0.3, 6.6] as Range, y: [-0.3, 6.6] as Range, w: 400, h: 400 };
export const INV_LEG = 0.55;
/** Tangent slope triangle of f = x² + 2 at x0 (legs Δx = INV_LEG, Δy = f′(x0)·Δx), mirrored by the fraction s at y = x. */
export function invTriangle(x0: number, s: number) {
  const y0 = INV.f(x0), dy = INV.df(x0) * INV_LEG;
  const base: P2[] = [[x0, y0], [x0 + INV_LEG, y0], [x0 + INV_LEG, y0 + dy]];
  const fold = (p: P2): P2 => [p[0] + s * (p[1] - p[0]), p[1] + s * (p[0] - p[1])];
  const tri = base.map(fold);
  const slope = (tri[2][1] - tri[0][1]) / (tri[2][0] - tri[0][0]);
  return { y0, base, tri, slope, m: INV.df(x0), mInv: 1 / INV.df(x0) };
}

/* ---------------------------------------------------------------- tangent zoom (Ü4 p. 8) */
/** base windows relative to P = (x0, f(x0)); the slide's own window for 1/√(1+2x) (unequal scales) */
export const ZOOM_BASE: Record<string, { dx: Range; dy: Range }> = {
  sq: { dx: [-2, 2], dy: [-1.5, 1.5] },
  rsqrt: { dx: [-4.4, 4.4], dy: [-0.42, 0.78] },
};
export function zoomWindow(e: TanExample, z: number): { x: Range; y: Range } {
  const b = ZOOM_BASE[e.id], X = e.x0, Y = e.f(e.x0);
  return { x: [X + b.dx[0] / z, X + b.dx[1] / z], y: [Y + b.dy[0] / z, Y + b.dy[1] / z] };
}
/** largest gap |f − t| in the window, relative to the window height (how bent the curve looks) */
export function zoomBend(e: TanExample, z: number, n = 240) {
  const w = zoomWindow(e, z), t = tangent(e);
  let max = 0;
  for (let i = 0; i <= n; i++) {
    const x = w.x[0] + ((w.x[1] - w.x[0]) * i) / n;
    if (e.dom && x <= e.dom[0]) continue;
    // only what is visible: clamp both graphs to the window
    const c = (y: number) => Math.min(w.y[1], Math.max(w.y[0], y));
    max = Math.max(max, Math.abs(c(e.f(x)) - c(t(x))));
  }
  return max / (w.y[1] - w.y[0]);
}
/** a "nice" grid step (1, 2, 5 × 10^k) for about `n` steps across the span */
export function niceStep(span: number, n = 4) {
  const raw = span / n, k = 10 ** Math.floor(Math.log10(raw)), r = raw / k;
  return (r < 1.5 ? 1 : r < 3.5 ? 2 : r < 7.5 ? 5 : 10) * k;
}
export const zoomExample = (id: string) => TAN_EXAMPLES.find((e) => e.id === id)!;

/* ---------------------------------------------------------------- normal */
export const NORM_WIN = { x: [-2.5, 2.5] as Range, y: [-0.6, 3.15] as Range, w: 400, h: 300 };
export const NORM_LEG = 0.5;
/** tangent slope triangle (Δx, mΔx) at P and the same triangle turned by 90° (−mΔx, Δx): slope −1/m */
export function normalTriangles(x0: number) {
  const m = 2 * x0, P: P2 = [x0, x0 * x0], a = NORM_LEG;
  const tanTri: P2[] = [P, [P[0] + a, P[1]], [P[0] + a, P[1] + m * a]];
  const rotTri: P2[] = [P, [P[0], P[1] + a], [P[0] - m * a, P[1] + a]];
  return { m, P, tanTri, rotTri, mN: m === 0 ? Infinity : -1 / m };
}
