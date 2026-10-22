/**
 * Pure geometry of the Analysis plots: mapping between math coordinates and the SVG viewBox, sampling a
 * function graph into polylines (broken at poles, jumps, gaps and where the graph leaves the window),
 * clipping straight lines to the window, tick positions. No React here, so everything is unit-tested.
 */
export type Range = readonly [number, number];
export type P2 = readonly [number, number];

export interface Frame {
  x: Range; y: Range;
  /** viewBox size in px-like units; the SVG scales to the container width. */
  w: number; h: number;
  /** inner padding of the drawing area (room for tick labels and arrowheads). */
  pad: number;
  sx: (x: number) => number;
  sy: (y: number) => number;
  /** inverse maps (viewBox → math), used for dragging. */
  ix: (px: number) => number;
  iy: (py: number) => number;
}

export function makeFrame(x: Range, y: Range, w = 400, h = 300, pad = 14): Frame {
  const kx = (w - 2 * pad) / (x[1] - x[0]), ky = (h - 2 * pad) / (y[1] - y[0]);
  return {
    x, y, w, h, pad,
    sx: (v) => pad + (v - x[0]) * kx,
    sy: (v) => h - pad - (v - y[0]) * ky,
    ix: (p) => x[0] + (p - pad) / kx,
    iy: (p) => y[0] + (h - pad - p) / ky,
  };
}

export interface SampleOpts {
  /** number of sample intervals across the domain (default 600). */
  n?: number;
  /** x values where the graph must be broken (poles, jumps, holes). */
  breaks?: readonly number[];
  /** extra room above/below the window before a branch is cut (fraction of the y-range, default 0.6). */
  overshoot?: number;
}

/**
 * Samples y = f(x) on [a, b] (clamped to the window) into polylines in viewBox coordinates.
 * A branch ends where f is not finite, at every x in `breaks`, and where the graph leaves the window by more than
 * `overshoot`; vertical runs to ±∞ next to a pole are therefore drawn to the window edge, never across the pole.
 */
export function sampleCurve(f: (x: number) => number, frame: Frame, dom?: Range, opts: SampleOpts = {}): P2[][] {
  const a = Math.max(dom?.[0] ?? -Infinity, frame.x[0]), b = Math.min(dom?.[1] ?? Infinity, frame.x[1]);
  if (!(b > a)) return [];
  const n = opts.n ?? 600, span = frame.y[1] - frame.y[0], ov = (opts.overshoot ?? 0.6) * span;
  const lo = frame.y[0] - ov, hi = frame.y[1] + ov;
  const breaks = [...(opts.breaks ?? [])].filter((c) => c > a && c < b).sort((p, q) => p - q);
  // split the domain at the breaks; each piece is sampled slightly inside its ends
  const cuts = [a, ...breaks, b];
  const out: P2[][] = [];
  for (let k = 0; k < cuts.length - 1; k++) {
    const p = cuts[k], q = cuts[k + 1];
    const eps = (q - p) * 1e-6;
    const p0 = k === 0 ? p : p + eps, q0 = k === cuts.length - 2 ? q : q - eps;
    const m = Math.max(8, Math.ceil((n * (q0 - p0)) / (b - a)));
    let cur: P2[] = [];
    const flush = () => { if (cur.length > 1) out.push(cur); cur = []; };
    for (let i = 0; i <= m; i++) {
      const x = p0 + ((q0 - p0) * i) / m, y = f(x);
      if (!Number.isFinite(y) || y < lo || y > hi) {
        // keep the run to the window edge visible: add the clamped point, then end the branch
        if (Number.isFinite(y) && cur.length) cur.push([frame.sx(x), frame.sy(Math.min(hi, Math.max(lo, y)))]);
        flush();
        continue;
      }
      cur.push([frame.sx(x), frame.sy(y)]);
    }
    flush();
  }
  return out;
}

/** The part of the straight line through `p` with slope `m` (math coordinates) inside the window, or null. */
export function clipLine(frame: Frame, p: P2, m: number, dom?: Range): [P2, P2] | null {
  const x0 = Math.max(dom?.[0] ?? -Infinity, frame.x[0]), x1 = Math.min(dom?.[1] ?? Infinity, frame.x[1]);
  if (!Number.isFinite(m)) return null;
  const y = (x: number) => p[1] + m * (x - p[0]);
  let a = x0, b = x1;
  if (m !== 0) {
    const xa = p[0] + (frame.y[0] - p[1]) / m, xb = p[0] + (frame.y[1] - p[1]) / m;
    a = Math.max(a, Math.min(xa, xb)); b = Math.min(b, Math.max(xa, xb));
  } else if (p[1] < frame.y[0] || p[1] > frame.y[1]) return null;
  if (!(b > a)) return null;
  return [[frame.sx(a), frame.sy(y(a))], [frame.sx(b), frame.sy(y(b))]];
}

/** Multiples of `step` inside the range (excluding 0 when `skipZero`). */
export function ticks(r: Range, step: number, skipZero = true): number[] {
  const out: number[] = [];
  for (let k = Math.ceil(r[0] / step - 1e-9); k * step <= r[1] + 1e-9; k++) {
    const v = +(k * step).toFixed(10);
    if (!(skipZero && Math.abs(v) < 1e-12)) out.push(v);
  }
  return out;
}

/** Tick text: integers plain, decimals with the language's separator, minus as U+2212. */
export function tickText(v: number, lang: 'de' | 'en'): string {
  const s = Number.isInteger(v) ? String(Math.abs(v)) : String(+Math.abs(v).toFixed(4));
  return (v < 0 ? '−' : '') + (lang === 'de' ? s.replace('.', ',') : s);
}
