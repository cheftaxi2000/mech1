/**
 * Pure frame and geometry functions of the week-3 Analysis figures (Übung 3, Übung 4 p. 1). No React here, so every
 * frame — windows, curves, points, labels — is unit-tested in w3scenes.test.ts.
 */
import {
  P_MAX_X, afterStep, bisect, bruch, bruchInv, f5, longDivide, p, type BisectStep, type Poly, type Tr, zwsF, ZWS_ROOT,
} from '../../analysis/week3';

export type P2 = readonly [number, number];
export type Range = readonly [number, number];
type Lang = 'de' | 'en';

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const ease = (t: number) => { const s = clamp01(t); return s * s * (3 - 2 * s); };
const lerp = (a: number, b: number, s: number) => a + (b - a) * s;
const lerpR = (a: Range, b: Range, s: number): Range => [lerp(a[0], b[0], s), lerp(a[1], b[1], s)];
/** Sub-interval [a, b] of the step time, rescaled to 0…1. */
export const phase = (t: number, a: number, b: number) => ease((t - a) / (b - a));

/** Number for TeX: at most `d` decimals, trailing zeros dropped, German decimal comma. */
export function texNum(v: number, lang: Lang, d = 2): string {
  const s = String(+v.toFixed(d));
  return lang === 'de' ? s.replace('.', '{,}') : s;
}
/** A "nice" tick step for a window of the given width (about `n` ticks). */
export function niceStep(width: number, n = 4): number {
  const raw = width / n, e = 10 ** Math.floor(Math.log10(raw)), m = raw / e;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * e;
}

/* ------------------------------------------------------------------ transformation explorer */
/** The live formula of y = d · p(c(x − a)) + b, written the way one would by hand. */
export function trTex({ a, b, c, d }: Tr, lang: Lang, f = 'p'): string {
  const n = (v: number) => texNum(Math.abs(v), lang);
  const shift = a === 0 ? 'x' : `x ${a > 0 ? '-' : '+'} ${n(a)}`;
  const inner = c === 1 ? shift : c === -1 ? (a === 0 ? '-x' : `-(${shift})`) : a === 0 ? `${c < 0 ? '-' : ''}${n(c)}x` : `${c < 0 ? '-' : ''}${n(c)}(${shift})`;
  const outer = d === 1 ? '' : d === -1 ? '-' : d === 0 ? '0 \\cdot ' : `${d < 0 ? '-' : ''}${n(d)}\\,`;
  const bb = b === 0 ? '' : ` ${b > 0 ? '+' : '-'} ${n(b)}`;
  return `${outer}${f}(${inner})${bb}`;
}

/* ------------------------------------------------------------------ bisection animation (ZWS supplement) */
export const BISECT = bisect(zwsF, 1, 2, 24);
/** Number of halvings shown one by one before the jump to «after 20 halvings». */
export const BISECT_SHOWN = 4;

export interface BisectFrame {
  x: Range; y: Range; tick: [number, number];
  /** the interval that is still searched (teal band) */
  band: Range;
  /** the endpoints with their signs */
  ends: { x: number; y: number; sign: -1 | 1 }[];
  /** the midpoint being tested (if any) */
  mid?: { x: number; y: number; sign: -1 | 1 | 0; alpha: number };
  /** the half that is dropped (faded band), while it fades */
  dropped?: { from: number; to: number; alpha: number };
  /** final frame: the root */
  root?: { x: number; y: number };
  readout: { k: number; a: number; b: number };
}
const viewOf = (a: number, b: number): { x: Range; y: Range } => {
  const w = b - a, x: Range = [a - 0.45 * w, b + 0.45 * w];
  const y0 = zwsF(x[0]), y1 = zwsF(x[1]), s = y1 - y0;
  return { x, y: [Math.min(y0, -0.12 * s) - 0.12 * s, Math.max(y1, 0.12 * s) + 0.12 * s] };
};
const START_VIEW = { x: [0.4, 2.4] as Range, y: [-2.2, 6.4] as Range };
const sgn = (v: number): -1 | 1 | 0 => (v > 0 ? 1 : v < 0 ? -1 : 0);

/**
 * Step 0: the interval [1, 2] with f(1) < 0 < f(2). Steps 1…BISECT_SHOWN: test the midpoint, drop the half without a
 * sign change, zoom in. Last step: after 20 halvings, back to the first view with the root c ≈ 1.3247.
 */
export function bisectFrame(step: number, t: number): BisectFrame {
  const last = BISECT_SHOWN + 1;
  const ends = (a: number, b: number) => [{ x: a, y: zwsF(a), sign: -1 as const }, { x: b, y: zwsF(b), sign: 1 as const }];
  const ticks = (x: Range, y: Range): [number, number] => [niceStep(x[1] - x[0]), niceStep(y[1] - y[0])];
  if (step <= 0) {
    return { ...START_VIEW, tick: [0.5, 2], band: [1, 2], ends: ends(1, 2), readout: { k: 0, a: 1, b: 2 } };
  }
  if (step >= last) {
    const s = BISECT[19], [a, b] = afterStep(s);
    const z = phase(t, 0, 0.7);
    const from = viewOf(...afterStep(BISECT[BISECT_SHOWN - 1]));
    const x = lerpR(from.x, START_VIEW.x, z), y = lerpR(from.y, START_VIEW.y, z);
    return { x, y, tick: z < 1 ? ticks(x, y) : [0.5, 2], band: [a, b], ends: [], root: { x: ZWS_ROOT, y: 0 }, readout: { k: 20, a, b } };
  }
  const st: BisectStep = BISECT[step - 1];
  const [na, nb] = afterStep(st);
  const prev = step === 1 ? START_VIEW : viewOf(st.a, st.b);
  const next = viewOf(na, nb);
  const midIn = phase(t, 0, 0.3), drop = phase(t, 0.35, 0.65), zoom = phase(t, 0.65, 1);
  const x = lerpR(prev.x, next.x, zoom), y = lerpR(prev.y, next.y, zoom);
  const band: Range = [lerp(st.a, na, drop), lerp(st.b, nb, drop)];
  const keptLeft = na === st.a;
  return {
    x, y, tick: ticks(x, y), band,
    ends: ends(band[0], band[1]).map((e) => ({ ...e, x: e.x, y: zwsF(e.x) })),
    mid: { x: st.m, y: st.fm, sign: sgn(st.fm), alpha: midIn },
    dropped: drop < 1 ? { from: keptLeft ? st.m : st.a, to: keptLeft ? st.b : st.m, alpha: 1 - drop } : undefined,
    readout: { k: drop >= 1 ? step : step - 1, a: drop >= 1 ? na : st.a, b: drop >= 1 ? nb : st.b },
  };
}

/* ------------------------------------------------------------------ Ü4 p. 1: maximum → minimum */
export interface RecipFrame {
  x: Range; y: Range; tick: [number, number];
  /** branches of the moving curve, in math coordinates */
  curve: P2[][];
  /** faint original f5 (steps 2 and 3) */
  ghost: P2[][];
  /** the special point (moving), and where it started */
  pt: P2; from?: P2;
  label: 'max' | 'min' | 'moved';
}
const T_GRID = Array.from({ length: 721 }, (_, i) => -1.45 + (1.9 * i) / 720);
/** Branches of the points (x(t), y(t)) that stay finite and below `cap`. */
function branches(pts: P2[], cap: number): P2[][] {
  const out: P2[][] = []; let cur: P2[] = [];
  for (const q of pts) {
    if (Number.isFinite(q[0]) && Number.isFinite(q[1]) && q[1] <= cap) cur.push(q);
    else { if (cur.length > 1) out.push(cur); cur = []; }
  }
  if (cur.length > 1) out.push(cur);
  return out;
}
export const F5_MAX = f5(-0.5);
/**
 * Step 0: f5(t) near t = −1/2, its positive local maximum. Step 1: every value y becomes 1/y (drawn as y^(1−2s), so
 * the value 1 stays put and the maximum turns into a minimum). Step 2: put 1/x into f5 — each point (t, y) moves
 * sideways to (1/t, y); only the branch between the zeros t = −1 and t = 0 is followed.
 */
export function recipFrame(step: number, t: number): RecipFrame {
  const yTop0 = 0.42, yTop1 = 9;
  const base = T_GRID.map((u) => [u, f5(u)] as P2);
  if (step <= 0) {
    return { x: [-1.45, 0.45], y: [0, yTop0], tick: [0.5, 0.1], curve: branches(base, yTop0 * 2), ghost: [], pt: [-0.5, F5_MAX], label: 'max' };
  }
  if (step === 1) {
    const s = phase(t, 0.1, 0.9);
    const top = yTop0 * (yTop1 / yTop0) ** phase(t, 0, 0.8);
    const pw = 1 - 2 * s;
    const pts = base.map(([u, v]) => [u, v === 0 ? (pw > 0 ? 0 : Infinity) : v ** pw] as P2);
    return { x: [-1.45, 0.45], y: [0, top], tick: [0.5, top < 1.5 ? 0.2 : 2], curve: branches(pts, top * 3), ghost: s > 0.5 ? branches(base, top) : [], pt: [-0.5, F5_MAX ** pw], label: s < 1 ? 'max' : 'min' };
  }
  const s = phase(t, 0.15, 0.95);
  const zx = phase(t, 0, 0.9);
  const x = lerpR([-1.45, 0.45], [-6.4, 0.4], zx);
  const mid = T_GRID.filter((u) => u > -1 && u < 0).map((u) => [lerp(u, 1 / u, s), 1 / f5(u)] as P2);
  return {
    x, y: [0, yTop1], tick: [zx < 0.5 ? 0.5 : 1, 2], curve: branches(mid, yTop1 * 3), ghost: [],
    pt: [lerp(-0.5, -2, s), 1 / F5_MAX], from: [-0.5, 1 / F5_MAX], label: s < 1 ? 'min' : 'moved',
  };
}

/* ------------------------------------------------------------------ mirror at y = x */
export type MirrorId = 'lin' | 'sq' | 'exp' | 'bruch' | 'sin';
/** an interval on an axis; `holes` are excluded points (open circles) */
export interface AxisSet { from: number; to: number; holes?: number[]; openFrom?: boolean; openTo?: boolean; tex: string }
export interface MirrorEx {
  f: (x: number) => number; finv: (x: number) => number;
  dom: Range; win: Range; P: P2;
  fTex: string; invTex: string;
  /** asymptotes of f: vertical x = …, horizontal y = … */
  vas?: number[]; has?: number[];
  D: AxisSet; W: AxisSet;
  /** draw the whole unrestricted function faintly (sin) */
  full?: (x: number) => number;
}
const INF = 1e3;
export const MIRROR: Record<MirrorId, MirrorEx> = {
  lin: { f: (x) => 2 * x + 3, finv: (x) => (x - 3) / 2, dom: [-INF, INF], win: [-4.5, 4.5], P: [0, 3], fTex: 'f(x) = 2x + 3', invTex: 'f^{-1}(x) = \\tfrac{x-3}{2}',
    D: { from: -INF, to: INF, tex: '\\mathbb R' }, W: { from: -INF, to: INF, tex: '\\mathbb R' } },
  sq: { f: (x) => x * x, finv: Math.sqrt, dom: [0, INF], win: [-1, 4.2], P: [1.5, 2.25], fTex: 'g(x) = x^2', invTex: 'g^{-1}(x) = \\sqrt x',
    D: { from: 0, to: INF, tex: '[0, \\infty)' }, W: { from: 0, to: INF, tex: '[0, \\infty)' } },
  exp: { f: Math.exp, finv: Math.log, dom: [-INF, INF], win: [-3, 4.5], P: [1, Math.E], fTex: 'h(x) = e^x', invTex: 'h^{-1}(x) = \\ln x',
    D: { from: -INF, to: INF, tex: '\\mathbb R' }, W: { from: 0, to: INF, openFrom: true, tex: '(0, \\infty)' } },
  bruch: { f: bruch, finv: bruchInv, dom: [-INF, INF], win: [-6, 4.5], P: [2, bruch(2)], fTex: 'y = \\tfrac{x-1}{x+2}', invTex: 'y^{-1}(x) = -\\tfrac{2x+1}{x-1}',
    vas: [-2], has: [1], D: { from: -INF, to: INF, holes: [-2], tex: '\\mathbb R \\setminus \\{-2\\}' }, W: { from: -INF, to: INF, holes: [1], tex: '\\mathbb R \\setminus \\{1\\}' } },
  sin: { f: Math.sin, finv: Math.asin, dom: [-Math.PI / 2, Math.PI / 2], win: [-2, 2], P: [1.2, Math.sin(1.2)], fTex: '\\sin', invTex: '\\arcsin', full: Math.sin,
    D: { from: -Math.PI / 2, to: Math.PI / 2, tex: '[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}]' }, W: { from: -1, to: 1, tex: '[-1, 1]' } },
};
/** Mirror image of a point at y = x, reached at s = 1 along the perpendicular to y = x. */
export const mirrorAt = ([x, y]: P2, s: number): P2 => [lerp(x, y, s), lerp(y, x, s)];

/** Points of the graph of f on its domain inside the window (branches at poles / where the graph leaves). */
export function graphPts(ex: MirrorEx, n = 500): P2[][] {
  const [w0, w1] = ex.win, pad = (w1 - w0) * 0.6;
  const a = Math.max(ex.dom[0], w0), b = Math.min(ex.dom[1], w1);
  const out: P2[][] = []; let cur: P2[] = [];
  const brk = [...(ex.vas ?? [])];
  for (let i = 0; i <= n; i++) {
    const x = a + ((b - a) * i) / n, y = ex.f(x);
    const crossed = cur.length > 0 && brk.some((v) => (cur[cur.length - 1][0] - v) * (x - v) <= 0);
    if (crossed || !Number.isFinite(y) || y < w0 - pad || y > w1 + pad) { if (cur.length > 1) out.push(cur); cur = []; if (crossed && Number.isFinite(y) && y > w0 - pad && y < w1 + pad) cur.push([x, y]); continue; }
    cur.push([x, y]);
  }
  if (cur.length > 1) out.push(cur);
  return out;
}

export interface MirrorFrame {
  /** the graph of f (blue), always drawn from step 0 on */
  f: P2[][];
  /** the moving copy (magenta) — the mirror image once s = 1 */
  g: P2[][] | null;
  point?: { P: P2; Q: P2; s: number };
  /** asymptotes: lines of f (fixed) and of the moving copy as segments */
  asym: { a: P2; b: P2; moving: boolean }[];
  /** domain / range sets as segments on the axes, f's and the moving ones */
  sets: { a: P2; b: P2; role: 'f' | 'g'; holes: P2[] }[];
  showInv: boolean;
}
/** Step 0: f and the mirror line. 1: one point (a, b) → (b, a). 2: the whole graph. 3: D and W swap. */
export function mirrorFrame(id: MirrorId, step: number, t: number): MirrorFrame {
  const ex = MIRROR[id], G = graphPts(ex);
  const [w0, w1] = ex.win;
  const vline = (x: number): [P2, P2] => [[x, w0 - 1], [x, w1 + 1]];
  const hline = (y: number): [P2, P2] => [[w0 - 1, y], [w1 + 1, y]];
  const fAsym = [...(ex.vas ?? []).map(vline), ...(ex.has ?? []).map(hline)];
  const sOf = step < 2 ? 0 : step === 2 ? phase(t, 0.1, 0.9) : 1;
  const moving = sOf > 0 ? G.map((br) => br.map((q) => mirrorAt(q, sOf))) : null;
  const asym = [
    ...fAsym.map(([a, b]) => ({ a, b, moving: false })),
    ...(sOf > 0 ? fAsym.map(([a, b]) => ({ a: mirrorAt(a, sOf), b: mirrorAt(b, sOf), moving: true })) : []),
  ];
  const point = step >= 1 ? { P: ex.P, Q: mirrorAt(ex.P, step === 1 ? phase(t, 0.15, 0.85) : 1), s: step === 1 ? phase(t, 0.15, 0.85) : 1 } : undefined;
  const sets: MirrorFrame['sets'] = [];
  if (step >= 3) {
    const k = phase(t, 0.15, 0.85);
    const cl = (v: number) => Math.max(w0 - 1, Math.min(w1 + 1, v));
    // D(f) on the x-axis, W(f) on the y-axis (blue); their mirror images swing to the other axis (magenta)
    const Dseg: [P2, P2] = [[cl(ex.D.from), 0], [cl(ex.D.to), 0]], Wseg: [P2, P2] = [[0, cl(ex.W.from)], [0, cl(ex.W.to)]];
    const dh = (ex.D.holes ?? []).map((h) => [h, 0] as P2), wh = (ex.W.holes ?? []).map((h) => [0, h] as P2);
    sets.push({ a: Dseg[0], b: Dseg[1], role: 'f', holes: dh }, { a: Wseg[0], b: Wseg[1], role: 'f', holes: wh });
    sets.push({ a: mirrorAt(Wseg[0], k), b: mirrorAt(Wseg[1], k), role: 'g', holes: wh.map((q) => mirrorAt(q, k)) });
    sets.push({ a: mirrorAt(Dseg[0], k), b: mirrorAt(Dseg[1], k), role: 'g', holes: dh.map((q) => mirrorAt(q, k)) });
  }
  return { f: G, g: moving, point, asym, sets, showInv: sOf >= 1 };
}

/* ------------------------------------------------------------------ long division layout */
/** A term c·x^k as TeX; `lead` = first in its row (no binary sign spacing). */
export function termTex(c: number, k: number, lead: boolean, lang: Lang = 'en'): string {
  const a = Math.abs(c), sign = c < 0 ? '-' : '+';
  const coef = k > 0 && a === 1 ? '' : texNum(a, lang, 4);
  const body = `${coef}${k === 0 ? '' : k === 1 ? 'x' : `x^${k}`}`;
  return lead ? (c < 0 ? `-${body}` : body) : `{}${sign}${body}`;
}
export function polyTex(q: Poly, lang: Lang = 'en'): string {
  const n = q.length - 1; let s = ''; let first = true;
  q.forEach((c, i) => { if (c === 0) return; s += termTex(c, n - i, first, lang); first = false; });
  return s || '0';
}
export interface DivRow { cells: (string | null)[]; line: boolean; kind: 'num' | 'sub' | 'rest'; step: number }
export interface DivLayout { cols: number; rows: DivRow[]; quotient: string[]; rest: Poly; num: Poly; den: Poly }
/**
 * The slide's layout of num : den: the dividend on top, then per quotient term the subtracted product «−(…)»
 * (underlined) and the new remainder, bringing down only as many terms as the divisor has.
 * Columns are the powers n … 0 of the dividend.
 */
export function divLayout(num: Poly, den: Poly, lang: Lang = 'en'): DivLayout {
  const n = num.length - 1, m = den.length - 1, { q, r, steps } = longDivide(num, den);
  const rows: DivRow[] = [];
  const nonzeroCells = (vals: (number | null)[], wrap: boolean): (string | null)[] => {
    const idx = vals.map((v, i) => (v !== null && v !== 0 ? i : -1)).filter((i) => i >= 0);
    return vals.map((v, i) => {
      if (v === null || v === 0) return null;
      let s = termTex(v, n - i, i === idx[0], lang);
      if (wrap && i === idx[0]) s = `-(${s}`;
      if (wrap && i === idx[idx.length - 1]) s = `${s})`;
      return s;
    });
  };
  rows.push({ cells: nonzeroCells(num, false), line: false, kind: 'num', step: 0 });
  steps.forEach((st, k) => {
    rows.push({ cells: nonzeroCells(st.sub.map((v, i) => (i >= k && i <= k + m ? v : null)), true), line: true, kind: 'sub', step: k + 1 });
    const lo = k + 1, hi = Math.min(n, k + 1 + m);
    let cells = nonzeroCells(st.rest.map((v, i) => (i >= lo && i <= hi ? v : null)), false);
    if (cells.every((c) => c === null)) cells = st.rest.map((_, i) => (i === hi ? '0' : null));
    rows.push({ cells, line: false, kind: 'rest', step: k + 1 });
  });
  return { cols: n + 1, rows, quotient: q.map((c, i) => termTex(c, q.length - 1 - i, i === 0, lang)), rest: r, num, den };
}
/** The full result line: q(x) + r/den. */
export function divResultTex(L: DivLayout, lang: Lang = 'en'): string {
  const rest = L.rest.every((c) => c === 0) ? '' : ` + \\frac{${polyTex(L.rest, lang)}}{${polyTex(L.den, lang)}}`;
  return `${polyTex(longDivide(L.num, L.den).q, lang)}${rest}`;
}

/* ------------------------------------------------------------------ horizontal-line test presets */
export type HId = 'lin' | 'sq' | 'sq0' | 'cube' | 'exp';
export interface HPreset {
  f: (x: number) => number; dom: Range; Z: Range; zOpen?: boolean;
  tex: string; c: number; injective: boolean; surjective: boolean;
}
export const HWIN = { x: [-3.2, 3.2] as Range, y: [-4, 9] as Range };
export const HLINE: Record<HId, HPreset> = {
  lin: { f: (x) => 2 * x + 1, dom: [-INF, INF], Z: [-INF, INF], tex: 'f(x) = 2x + 1,\\ \\mathbb R \\to \\mathbb R', c: 3, injective: true, surjective: true },
  sq: { f: (x) => x * x, dom: [-INF, INF], Z: [-INF, INF], tex: 'g(x) = x^2,\\ \\mathbb R \\to \\mathbb R', c: 4, injective: false, surjective: false },
  sq0: { f: (x) => x * x, dom: [0, INF], Z: [0, INF], tex: 'x^2,\\ [0, \\infty) \\to [0, \\infty)', c: 4, injective: true, surjective: true },
  cube: { f: (x) => x ** 3, dom: [-INF, INF], Z: [-INF, INF], tex: 'x^3,\\ \\mathbb R \\to \\mathbb R', c: 8, injective: true, surjective: true },
  exp: { f: Math.exp, dom: [-INF, INF], Z: [-INF, INF], tex: 'e^x,\\ \\mathbb R \\to \\mathbb R', c: -1, injective: true, surjective: false },
};

/** The value p takes at the local maximum (the tracked point of the transformation explorer). */
export const P_MAX: P2 = [P_MAX_X, p(P_MAX_X)];
