/**
 * Pure part of the shared 2-D plane of the Lineare-Algebra figures (column picture, transformation of the plane):
 * the list of things a scene wants drawn (arrows, lines, dots, KaTeX labels, ...), the choice of a window that fits
 * a set of points with square units, snapping, and hit-testing of draggable tips. No React here: unit-tested.
 * `PlaneView.tsx` draws these items with the shared `Plot`.
 */
import type { Role } from '../plot/Plot';
import type { M2, V2 } from '../../linalg/plane2';

export type PRole = Role;
export type Anchor = 'c' | 'l' | 'r' | 't' | 'b';

export type PItem =
  /** arrow from a to b; `w` = stroke width, `o` = opacity (ghosts), `dashed` */
  | { k: 'arrow'; id: string; a: V2; b: V2; role: PRole; w?: number; o?: number; dashed?: boolean }
  /** infinite line through p along dir (clipped to the window) */
  | { k: 'line'; id: string; p: V2; dir: V2; role: PRole; dashed?: boolean; w?: number; o?: number }
  | { k: 'seg'; id: string; a: V2; b: V2; role: PRole; dashed?: boolean; w?: number; o?: number }
  /** a dot; `open` = hollow */
  | { k: 'dot'; id: string; at: V2; role: PRole; r?: number; open?: boolean; o?: number }
  /** target ring (circle with four ticks) around a point */
  | { k: 'ring'; id: string; at: V2; role: PRole; r?: number; o?: number }
  /** KaTeX label at a math position, offset (dx, dy) in viewBox units */
  | { k: 'label'; id: string; at: V2; tex: string; role: PRole; dx?: number; dy?: number; anchor?: Anchor; small?: boolean; prio?: number }
  /** polyline / polygon in math coordinates */
  | { k: 'poly'; id: string; pts: V2[]; role: PRole; closed?: boolean; fill?: boolean; dashed?: boolean; o?: number }
  /** the images of the grid lines x = i, y = j under M */
  | { k: 'warp'; id: string; M: M2; role: PRole; o?: number; n?: number };

export type Handle = { id: string; at: V2; role: PRole; label?: string };

export interface View {
  x: readonly [number, number];
  y: readonly [number, number];
  w: number;
  h: number;
  /** grid spacing and tick-label spacing */
  grid: number;
  tick: number;
}

/** Plot's own inner padding (see plotMath.makeFrame). */
export const PLOT_PAD = 14;

/**
 * A window that contains `pts` (and the origin) with `margin` units to spare, has square units, integer width and
 * integer lower-left corner. The window only changes when a point really leaves it, so a figure stays calm while dragging.
 */
export function fitView(pts: readonly V2[], w = 560, h = 420, o: { margin?: number; minSpan?: number } = {}): View {
  const m = o.margin ?? 0.7, minSpan = o.minSpan ?? 8;
  const iw = w - 2 * PLOT_PAD, ih = h - 2 * PLOT_PAD;
  let x0 = 0, x1 = 0, y0 = 0, y1 = 0;
  for (const p of pts) {
    if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) continue;
    x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]);
  }
  x0 -= m; x1 += m; y0 -= m; y1 += m;
  const k = ih / iw;
  let xr = Math.max(minSpan, Math.ceil(Math.max(x1 - x0, (y1 - y0) / k) - 1e-9));
  for (let guard = 0; guard < 400; guard++, xr++) {
    const yr = xr * k;
    let ox = Math.round((x0 + x1) / 2 - xr / 2), oy = Math.round((y0 + y1) / 2 - yr / 2);
    if (ox > x0) ox = Math.floor(x0);
    if (ox + xr < x1) ox = Math.ceil(x1 - xr);
    if (oy > y0) oy = Math.floor(y0);
    if (oy + yr < y1) oy = Math.ceil(y1 - yr);
    if (ox <= x0 + 1e-9 && ox + xr >= x1 - 1e-9 && oy <= y0 + 1e-9 && oy + yr >= y1 - 1e-9) {
      const grid = xr <= 16 ? 1 : xr <= 32 ? 2 : 5;
      const tick = xr <= 13 ? 1 : xr <= 26 ? 2 : xr <= 60 ? 5 : 10;
      return { x: [ox, ox + xr], y: [oy, oy + yr], w, h, grid, tick };
    }
  }
  return { x: [-minSpan / 2, minSpan / 2], y: [-minSpan * k / 2, minSpan * k / 2], w, h, grid: 1, tick: 1 };
}

/** viewBox pixel -> math, for a view (same maths as plotMath.makeFrame). */
export function toMath(v: View, px: number, py: number): V2 {
  const kx = (v.w - 2 * PLOT_PAD) / (v.x[1] - v.x[0]), ky = (v.h - 2 * PLOT_PAD) / (v.y[1] - v.y[0]);
  return [v.x[0] + (px - PLOT_PAD) / kx, v.y[0] + (v.h - PLOT_PAD - py) / ky];
}
export function toPx(v: View, p: V2): V2 {
  const kx = (v.w - 2 * PLOT_PAD) / (v.x[1] - v.x[0]), ky = (v.h - 2 * PLOT_PAD) / (v.y[1] - v.y[0]);
  return [PLOT_PAD + (p[0] - v.x[0]) * kx, v.h - PLOT_PAD - (p[1] - v.y[0]) * ky];
}

/** Round to the nearest multiple of `step` (never -0). */
export const snapTo = (v: number, step = 0.5) => Math.round(v / step) * step + 0;
export const snapV = (p: V2, step = 0.5): V2 => [snapTo(p[0], step), snapTo(p[1], step)];
/** Keep a dragged tip inside the window (with a margin in units). */
export function clampToView(v: View, p: V2, margin = 0.3): V2 {
  return [Math.min(v.x[1] - margin, Math.max(v.x[0] + margin, p[0])), Math.min(v.y[1] - margin, Math.max(v.y[0] + margin, p[1]))];
}

/** Which handle is under a pointer at viewBox position (px, py)? Nearest within `reach` viewBox units. */
export function pickHandle(v: View, hs: readonly Handle[], px: number, py: number, reach = 26): string | null {
  let best: string | null = null, bd = reach;
  for (const h of hs) {
    const q = toPx(v, h.at), d = Math.hypot(q[0] - px, q[1] - py);
    if (d < bd) { bd = d; best = h.id; }
  }
  return best;
}

/**
 * Where to put the label of an arrow tip so that it sits just beyond the tip, on the side the arrow points to
 * (anchor chosen so the label never covers the tip). `dir` is the math direction of the arrow.
 */
export function tipLabel(dir: V2, gap = 8): { dx: number; dy: number; anchor: Anchor } {
  const sx = dir[0], sy = -dir[1]; // screen direction
  if (Math.abs(sx) >= Math.abs(sy)) return { dx: Math.sign(sx || 1) * gap, dy: Math.sign(sy) * Math.min(6, Math.abs(sy) / (Math.abs(sx) || 1) * gap), anchor: sx >= 0 ? 'l' : 'r' };
  return { dx: Math.sign(sx) * Math.min(6, Math.abs(sx) / (Math.abs(sy) || 1) * gap), dy: Math.sign(sy) * gap, anchor: sy >= 0 ? 't' : 'b' };
}

/**
 * Label beside a segment: perpendicular to `dir` (math direction), on the left of the direction of travel when
 * `side` = 1, anchored so that the label's near edge sits `off` units away from the segment.
 */
export function sideLabel(dir: V2, off = 8, side: 1 | -1 = 1): { dx: number; dy: number; anchor: Anchor } {
  return tipLabel([-dir[1] * side, dir[0] * side], off);
}

/** The points a scene wants inside the window (for fitView), collected from its items. */
export function itemPoints(items: readonly PItem[]): V2[] {
  const out: V2[] = [];
  for (const it of items) {
    if (it.k === 'arrow' || it.k === 'seg') out.push(it.a, it.b);
    else if (it.k === 'dot' || it.k === 'ring' || it.k === 'label') out.push(it.at);
    else if (it.k === 'poly') out.push(...it.pts);
  }
  return out;
}

/** Number as TeX: German decimal comma protected by braces, true minus, at most `d` decimals, zeros dropped. */
export function ntex(x: number, d = 2, lang: 'de' | 'en' = 'en'): string {
  let s = (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d);
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
  if (s === '-0') s = '0';
  return lang === 'de' ? s.replace('.', '{,}') : s;
}
/** Tuple as TeX column vector. */
export const vtex = (v: V2, d = 2, lang: 'de' | 'en' = 'en') => String.raw`\begin{pmatrix}${ntex(v[0], d, lang)}\\${ntex(v[1], d, lang)}\end{pmatrix}`;
/** Coefficient in brackets when negative: (-1). */
export const ctex = (v: number, d = 2, lang: 'de' | 'en' = 'en') => (v < -1e-9 ? `(${ntex(v, d, lang)})` : ntex(v, d, lang));

/* ---------- label placement (port of the visualisation's placeLabels) ---------- */
type Box = [number, number, number, number];
const hit = (a: Box, b: Box) => !(a[2] < b[0] || b[2] < a[0] || a[3] < b[1] || b[3] < a[1]);

/** Rough size of a KaTeX label in viewBox units (conservative: phone width, where labels are largest relative to the plot). */
export function labelSize(tex: string, small = false, w = 560): [number, number] {
  const h = (small ? 18 : 21) * (w / 560);
  const body = tex
    .replace(/\\(mathrm|text|operatorname)\{([^}]*)\}/g, '$2')
    .replace(/\\(Rightarrow|checkmark|varnothing)/g, 'MM')
    .replace(/\\[a-zA-Z]+/g, '').replace(/[{}\\]/g, '').replace(/\s+/g, '');
  const sub = (body.match(/[_^]./g) ?? []).length;
  const n = body.replace(/[_^]/g, '').length - 0.35 * sub;
  return [Math.max(1, n) * 0.58 * h + 6, h + 2];
}

/** Box (viewBox units) of a label placed at px + (dx, dy) with an anchor. */
export function labelBox(px: V2, dx: number, dy: number, anchor: Anchor, size: [number, number]): Box {
  const [w, h] = size, x = px[0] + dx, y = px[1] + dy;
  const cx = anchor === 'l' ? x + w / 2 : anchor === 'r' ? x - w / 2 : x;
  const cy = anchor === 't' ? y + h / 2 : anchor === 'b' ? y - h / 2 : y;
  return [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];
}

/**
 * Moves labels so that they do not overlap each other, the given obstacles (tips, rings) or the window edge.
 * Each label first tries the place the scene asked for, then positions around its point at growing distance.
 * Labels with `fixed` ids are kept as they are (but block the others). Returns new items; order is kept.
 */
export function placeLabels(items: readonly PItem[], v: View, obstacles: { at: V2; r: number }[] = [], fixed: (id: string) => boolean = () => false): PItem[] {
  const placed: Box[] = obstacles.map((o) => { const p = toPx(v, o.at); return [p[0] - o.r, p[1] - o.r, p[0] + o.r, p[1] + o.r]; });
  // the axes and their tick numbers
  const O = toPx(v, [Math.min(Math.max(0, v.x[0]), v.x[1]), Math.min(Math.max(0, v.y[0]), v.y[1])]);
  placed.push([0, O[1] - 2, v.w, O[1] + 2], [O[0] - 2, 0, O[0] + 2, v.h]);
  for (let k = Math.ceil(v.x[0] / v.tick); k * v.tick <= v.x[1]; k++) { if (k === 0) continue; const x = toPx(v, [k * v.tick, 0])[0]; placed.push([x - 8, O[1] + 4, x + 8, O[1] + 19]); }
  for (let k = Math.ceil(v.y[0] / v.tick); k * v.tick <= v.y[1]; k++) { if (k === 0) continue; const y = toPx(v, [0, k * v.tick])[1]; placed.push([O[0] - 20, y - 6, O[0] - 3, y + 6]); }
  // arrows and segments block labels too (sampled every ~14 units, so a label never sits on a drawn line)
  const span = Math.hypot(v.x[1] - v.x[0], v.y[1] - v.y[0]);
  for (const it of items) {
    if (it.k !== 'arrow' && it.k !== 'seg' && it.k !== 'line') continue;
    if ((it.o ?? 1) < 0.3) continue;
    const ends: [V2, V2] = it.k === 'line'
      ? (() => { const n = Math.hypot(it.dir[0], it.dir[1]) || 1, d: V2 = [(it.dir[0] / n) * span, (it.dir[1] / n) * span]; return [[it.p[0] - d[0], it.p[1] - d[1]], [it.p[0] + d[0], it.p[1] + d[1]]]; })()
      : [it.a, it.b];
    const a = toPx(v, ends[0]), b = toPx(v, ends[1]), L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.ceil(L / 14);
    const r = Math.max(2, (it.w ?? 2) / 2 + 1);
    for (let i = 0; i <= n; i++) { const x = a[0] + ((b[0] - a[0]) * i) / Math.max(1, n), y = a[1] + ((b[1] - a[1]) * i) / Math.max(1, n); placed.push([x - r, y - r, x + r, y + r]); }
  }
  const inside = (b: Box) => b[0] >= 2 && b[1] >= 2 && b[2] <= v.w - 2 && b[3] <= v.h - 2;
  const out = items.slice();
  const labels = out.map((it, i) => ({ it, i })).filter((e) => e.it.k === 'label') as { it: Extract<PItem, { k: 'label' }>; i: number }[];
  // fixed ones first
  for (const e of labels) if (fixed(e.it.id)) placed.push(labelBox(toPx(v, e.it.at), e.it.dx ?? 0, e.it.dy ?? 0, e.it.anchor ?? 'c', labelSize(e.it.tex, e.it.small, v.w)));
  labels.sort((a, b) => (a.it.prio ?? 5) - (b.it.prio ?? 5));
  for (const e of labels) {
    if (fixed(e.it.id)) continue;
    const L = e.it, P = toPx(v, L.at), size = labelSize(L.tex, L.small, v.w);
    const want = labelBox(P, L.dx ?? 0, L.dy ?? 0, L.anchor ?? 'c', size);
    const ok = (b: Box) => inside(b) && !placed.some((q) => hit(q, b));
    let best: Box | null = ok(want) ? want : null;
    if (!best) {
      const c0: V2 = [(want[0] + want[2]) / 2 - P[0], (want[1] + want[3]) / 2 - P[1]];
      const dir = Math.hypot(c0[0], c0[1]) > 1 ? Math.atan2(c0[1], c0[0]) : -Math.PI / 4;
      const base = Math.max(8, Math.hypot(c0[0], c0[1]) - Math.max(size[0], size[1]) / 2);
      outer: for (const rad of [base, base + 12, base + 26, base + 44]) {
        for (const d of [0, 0.5, -0.5, 1, -1, 1.5, -1.5, 2.1, -2.1, Math.PI]) {
          const a = dir + d;
          // distance from the point to the box centre so that the box edge is `rad` away in direction a
          const ex = Math.abs(Math.cos(a)) * size[0] / 2 + Math.abs(Math.sin(a)) * size[1] / 2;
          const cx = P[0] + Math.cos(a) * (rad + ex), cy = P[1] + Math.sin(a) * (rad + ex);
          const b: Box = [cx - size[0] / 2, cy - size[1] / 2, cx + size[0] / 2, cy + size[1] / 2];
          if (ok(b)) { best = b; break outer; }
        }
      }
    }
    if (!best) {
      // keep the wish, but inside the window
      const dx = Math.max(0, 2 - want[0]) - Math.max(0, want[2] - (v.w - 2)), dy = Math.max(0, 2 - want[1]) - Math.max(0, want[3] - (v.h - 2));
      best = [want[0] + dx, want[1] + dy, want[2] + dx, want[3] + dy];
    }
    placed.push(best);
    out[e.i] = { ...L, anchor: 'c', dx: (best[0] + best[2]) / 2 - P[0], dy: (best[1] + best[3]) / 2 - P[1] };
  }
  return out;
}
