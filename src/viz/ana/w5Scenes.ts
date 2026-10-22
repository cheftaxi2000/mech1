/**
 * Pure frame functions of the week-5 figures (Übung 5). Each returns what a frame shows: window, which parts are
 * visible, the positions of points and labels (math coordinates). No React; unit-tested in w5Scenes.test.ts.
 */
import { EX1, EX2, FUNS, candidates, globalExtrema, type Candidate } from '../../analysis/week5';
import type { P2, Range } from '../plot/plotMath';

export interface Win { x: Range; y: Range }
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const lerpWin = (a: Win, b: Win, t: number): Win => t >= 1 ? b : ({ x: [lerp(a.x[0], b.x[0], t), lerp(a.x[1], b.x[1], t)], y: [lerp(a.y[0], b.y[0], t), lerp(a.y[1], b.y[1], t)] });

/** A «nice» tick step (1, 2 or 5 times a power of ten) giving about `n` ticks over `span`. */
export function niceStep(span: number, n = 5): number {
  const raw = span / n, p = 10 ** Math.floor(Math.log10(raw)), m = raw / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
}
export const inside = (w: Win, p: P2, margin = 0) => {
  const mx = margin * (w.x[1] - w.x[0]), my = margin * (w.y[1] - w.y[0]);
  return p[0] >= w.x[0] + mx && p[0] <= w.x[1] - mx && p[1] >= w.y[0] + my && p[1] <= w.y[1] - my;
};

/* ------------------------------------------------------------------ Δf ≈ df (tangent), Ü5 S. 1 */

export const TAN = { x0: 1, dx0: 0.8, dx1: 0.2, f: FUNS.sq.f, fp: FUNS.sq.fp };
/** Window around P = (1, 1) scaled with Δx (s = Δx / 0,8): the zoom of step 5. */
export function tanWindow(dx: number): Win {
  const s = dx / TAN.dx0;
  return { x: [TAN.x0 - 1.2 * s, TAN.x0 + 1.75 * s], y: [TAN.f(TAN.x0) - 1.2 * s, TAN.f(TAN.x0) + 3.3 * s] };
}
export interface TanFrame {
  win: Win; dx: number; tick: number;
  P: P2; Q: P2; T: P2; // T = point on the tangent above x0 + Δx
  dxGrow: number; dfGrow: number; DfGrow: number; // 0…1: how far each arrow is drawn
  showQ: boolean; showTangent: boolean; showGap: boolean;
  gap: number; exact: number; lin: number;
}
/** Steps: 0 Δx · 1 Δf · 2 tangent and df · 3 the gap · 4 zoom in (Δx 0,8 → 0,2). */
export function tanScene(step: number, t: number): TanFrame {
  const e = ease(t);
  const dx = step < 4 ? TAN.dx0 : lerp(TAN.dx0, TAN.dx1, e);
  const { x0, f, fp } = TAN;
  const win = tanWindow(dx);
  const exact = f(x0 + dx) - f(x0), lin = fp(x0) * dx;
  return {
    win, dx, tick: niceStep(win.x[1] - win.x[0]),
    P: [x0, f(x0)], Q: [x0 + dx, f(x0 + dx)], T: [x0 + dx, f(x0) + lin],
    dxGrow: step === 0 ? e : 1,
    DfGrow: step < 1 ? 0 : step === 1 ? e : 1,
    dfGrow: step < 2 ? 0 : step === 2 ? e : 1,
    showQ: step > 0 || t > 0.6, showTangent: step >= 2, showGap: step >= 3,
    gap: exact - lin, exact, lin,
  };
}

/* ------------------------------------------------------------------ Mittelwertsatz construction, Ü5 S. 3 */

export const MVT = { a: 1, b: 3, f: FUNS.sq.f, win: { x: [0, 3.7], y: [-0.8, 11] } as Win };
export interface MvtFrame {
  A: P2; B: P2; m: number; secGrow: number;
  k: number; // downward shift of the parallel line
  cuts: P2[]; // where the shifted line meets the curve
  touch: boolean; C: P2 | null; showC: boolean;
}
/** Steps: 0 secant · 1 shift it parallel (still two cuts) · 2 until it only touches: tangent at c · 3 c = 2 on the axis. */
export function mvtScene(step: number, t: number): MvtFrame {
  const e = ease(t);
  const { a, b, f } = MVT;
  const m = (f(b) - f(a)) / (b - a);
  const k = step < 1 ? 0 : step === 1 ? 0.6 * e : step === 2 ? lerp(0.6, 1, e) : 1;
  // line y = m(x − a) + f(a) − k meets x²: x² − 4x + 3 + k = 0 → x = 2 ± √(1 − k)
  const disc = 1 - k;
  const touch = disc < 1e-9;
  const cuts: P2[] = step >= 1 && !touch ? [2 - Math.sqrt(disc), 2 + Math.sqrt(disc)].map((x) => [x, f(x)] as P2) : [];
  return { A: [a, f(a)], B: [b, f(b)], m, secGrow: step === 0 ? e : 1, k, cuts, touch, C: touch ? [2, f(2)] : null, showC: step >= 3 };
}

/* ------------------------------------------------------------------ Extremalstellen auf [a, b], Ü5 S. 5 */

export const EX1_WIN: Win = { x: [-1.05, 1.25], y: [-0.62, 0.62] };
export const EX2_WIN: Win = { x: [-2.4, 2.4], y: [-1.6, 13.5] };
export const EX2_ZOOM: Win = { x: [-1.15, 1.15], y: [-0.42, 0.3] };

export interface CandFrame {
  win: Win; tick: [number, number];
  cands: (Candidate & { shown: boolean; role: 'pt' | 'muted' | 'f' | 'g' | 'fg' })[];
  showMaxMin: boolean; max: number; min: number;
  tableCols: number; // how many table columns are filled (Bsp. 2)
}
/** Bsp. 1, x³ − x on [−1/2, 1]. Steps: 0 graph on D · 1 the ends · 2 f′ = 0 (one outside D) · 3 compare: max, min. */
export function ex1Scene(step: number): CandFrame {
  const c = candidates(EX1.fun, EX1.a, EX1.b, EX1.crit);
  const g = globalExtrema(c);
  const cands = c.map((k) => {
    const shown = k.kind === 'end' ? step >= 1 : step >= 2;
    let role: CandFrame['cands'][number]['role'] = k.inside ? 'pt' : 'muted';
    if (step >= 3 && k.inside) role = k.y === g.max ? 'f' : k.y === g.min ? 'g' : 'muted';
    return { ...k, shown, role };
  });
  return { win: EX1_WIN, tick: [0.5, 0.2], cands, showMaxMin: step >= 3, max: g.max, min: g.min, tableCols: 0 };
}
/** Bsp. 2, x⁴ − x² on [−2, 2]. Steps: 0 candidates and table · 1 global max/min · 2 zoom around 0: only a local max there. */
export function ex2Scene(step: number, t: number): CandFrame {
  const c = candidates(EX2.fun, EX2.a, EX2.b, EX2.crit);
  const g = globalExtrema(c);
  const win = step < 2 ? EX2_WIN : lerpWin(EX2_WIN, EX2_ZOOM, ease(t));
  const zoomed = step === 2 && t > 0.5;
  const cands = c.map((k) => {
    let role: CandFrame['cands'][number]['role'] = 'pt';
    if (step >= 1) role = k.y === g.max ? 'f' : k.y === g.min ? 'g' : 'fg';
    return { ...k, shown: true, role };
  });
  return {
    win, tick: zoomed ? [0.5, 0.1] : [1, 2], cands, showMaxMin: step >= 1, max: g.max, min: g.min,
    tableCols: step === 0 ? Math.min(5, Math.floor(1 + 5 * t)) : 5,
  };
}

/* ------------------------------------------------------------------ complex plane helpers, Ü5 S. 7 */

/** Snap to the half-integer grid and keep inside ±lim (dragging gives the slide's tidy numbers). */
export const snapHalf = (v: number, lim: number) => Math.max(-lim, Math.min(lim, Math.round(2 * v) / 2));
/**
 * Label position for the tip of an arrow from 0 to p: a little beyond the tip, pushed back inside the window.
 * Returns math coordinates.
 */
export function tipLabel(p: P2, win: Win, k = 0.09): P2 {
  const l = Math.hypot(p[0], p[1]) || 1;
  const sx = win.x[1] - win.x[0], sy = win.y[1] - win.y[0];
  const q: P2 = [p[0] + (k * sx * p[0]) / l, p[1] + (k * sy * p[1]) / l + (l < 1e-9 ? k * sy : 0)];
  const mx = 0.07 * sx, my = 0.07 * sy;
  return [Math.max(win.x[0] + mx, Math.min(win.x[1] - mx, q[0])), Math.max(win.y[0] + my, Math.min(win.y[1] - my, q[1]))];
}
