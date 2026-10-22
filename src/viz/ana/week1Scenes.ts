/**
 * Pure frame functions of the week-1 animations (Analysis 1, Übung 1). Each returns a list of shapes in math
 * coordinates for the shared <Plot>; Week1Figures.tsx only draws them. Unit-tested in week1Scenes.test.ts:
 * labels inside the window, colour roles, and that every step's final frame (t = 1) shows what its caption says.
 */
import type { P2, Range } from '../plot/plotMath';
import { KB, MB, side } from '../../analysis/folgen';
import { AR, GI, geoSum, group } from '../../analysis/reihen';

export type Lang = 'de' | 'en';
export type SRole = 'f' | 'g' | 'ref' | 'sec' | 'asym' | 'pt' | 'aux' | 'muted' | 'fg' | 'grp0' | 'grp1' | 'grp2' | 'grp3';
export interface SPoint { x: number; y: number; role: SRole; r?: number }
export interface SLabel { x: number; y: number; tex: string; role: SRole; anchor?: 'c' | 'l' | 'r' | 't' | 'b'; dx?: number; dy?: number; small?: boolean }
export interface SPoly { pts: P2[]; role: SRole; fill?: boolean; dashed?: boolean }
export interface SLine { at: number; role: SRole; dashed?: boolean }
export interface Scene {
  x: Range; y: Range; w?: number; h?: number;
  grid?: [number, number]; tick?: [number, number]; axes?: [string, string];
  bands: { from: number; to: number }[];
  hlines: SLine[]; vlines: SLine[];
  polys: SPoly[];
  pts: SPoint[];
  labels: SLabel[];
}
const empty = (s: Pick<Scene, 'x' | 'y'> & Partial<Scene>): Scene => ({ bands: [], hlines: [], vlines: [], polys: [], pts: [], labels: [], ...s });

export const ease = (t: number) => { const c = Math.min(1, Math.max(0, t)); return c * c * (3 - 2 * c); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Number for TeX: German decimal comma as {,}. */
export const num = (x: number, d: number, lang: Lang) => {
  const s = (+x.toFixed(d)).toString();
  return lang === 'de' ? s.replace('.', '{,}') : s;
};
const rect = (x0: number, y0: number, x1: number, y1: number): P2[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

/* ================================================================ «konvergent ⇒ beschränkt» (U01 p. 10) */
export const KB_STEPS = 4;
export function kbScene(step: number, t: number, lang: Lang): Scene {
  const e = ease(t), { a, L, eps, N, lo, hi, nMax } = KB;
  const s = empty({ x: [0, nMax + 0.6], y: [-0.45, 1.95], grid: [1, 0.5], tick: [2, 0.5], axes: ['n', 'a_n'] });
  const shown = step === 0 ? 1 + Math.floor(e * (nMax - 1) + 1e-9) : nMax;
  s.hlines.push({ at: L, role: 'asym', dashed: true });
  s.labels.push({ x: nMax + 0.4, y: L, tex: 'L = 1', role: 'asym', anchor: 'r', dy: step >= 1 ? -26 : -12, small: true });
  const half = step === 1 ? eps * e : step >= 1 ? eps : 0;
  if (half > 0) s.bands.push({ from: L - half, to: L + half });
  if (step >= 1) {
    s.vlines.push({ at: N - 0.5, role: 'aux', dashed: true });
    s.labels.push({ x: N - 0.5, y: -0.45, tex: `N = ${N}`, role: 'muted', anchor: 'l', dx: 4, dy: -12, small: true });
    s.labels.push({ x: nMax + 0.4, y: L - eps, tex: `L \\pm \\varepsilon`, role: 'sec', anchor: 'r', dy: 12, small: true });
  }
  for (let n = 1; n <= shown; n++) {
    const before = n < N;
    const role: SRole = step === 0 ? 'f' : step === 3 && e > 0.5 ? 'f' : before ? 'pt' : 'f';
    s.pts.push({ x: n, y: a(n), role, r: step === 2 && before ? 4.5 + 2 * Math.sin(Math.PI * e) : 4 });
  }
  if (step >= 2) {
    const fade = step === 2 ? e : 1;
    if (fade > 0.3) {
      s.labels.push({ x: 2, y: a(2), tex: 'a_2', role: 'pt', anchor: 'l', dx: 9, dy: -4, small: true });
      s.labels.push({ x: 1, y: a(1), tex: 'a_1', role: 'pt', anchor: 'l', dx: 9, dy: 8, small: true });
      s.labels.push({ x: 3, y: a(3), tex: 'a_3', role: 'pt', anchor: 'l', dx: 9, dy: 6, small: true });
    }
  }
  if (step === 3) {
    const top = lerp(L + eps, hi, e), bot = lerp(L - eps, lo, e);
    s.hlines.push({ at: top, role: 'g' }, { at: bot, role: 'g' });
    if (e > 0.6) {
      s.labels.push({ x: 7, y: hi, tex: `a_n \\le ${num(hi, 1, lang)}`, role: 'g', anchor: 'b', dy: -5, small: true });
      s.labels.push({ x: 7, y: lo, tex: `a_n \\ge ${num(lo, 1, lang)}`, role: 'g', anchor: 't', dy: 5, small: true });
    }
  }
  return s;
}

/* ================================================================ «beschränkt & monoton ⇒ konvergent» */
export const MB_STEPS = 4;
export function mbScene(step: number, t: number, lang: Lang): Scene {
  const e = ease(t), { a, S, eps, bound0, N, nMax } = MB;
  const s = empty({ x: [0, nMax + 0.6], y: [-0.15, 1.85], grid: [1, 0.5], tick: [2, 0.5], axes: ['n', 'a_n'] });
  const shown = step === 0 ? 1 + Math.floor(e * (nMax - 1) + 1e-9) : nMax;
  const bound = step === 0 ? bound0 : step === 1 ? lerp(bound0, S, e) : S;
  s.hlines.push({ at: bound, role: 'g' });
  s.labels.push(step === 0 || (step === 1 && e < 0.5)
    ? { x: nMax + 0.4, y: bound, tex: `a_n \\le ${num(bound0, 1, lang)}`, role: 'g', anchor: 'r', dy: -12, small: true }
    : { x: nMax + 0.4, y: bound, tex: 'S = 1', role: 'g', anchor: 'r', dy: -12, small: true });
  const half = step === 2 ? eps * e : step === 3 ? eps : 0;
  if (half > 0) s.bands.push({ from: S - half, to: S });
  if (step >= 2) s.labels.push({ x: nMax + 0.4, y: S - eps, tex: 'S - \\varepsilon', role: 'sec', anchor: 'r', dy: 12, small: true });
  for (let n = 1; n <= shown; n++) {
    let role: SRole = 'f';
    if (step === 2 && n === N && e > 0.5) role = 'pt';
    if (step === 3) role = n < N ? 'muted' : n === N ? 'pt' : e > 0.4 ? 'f' : 'muted';
    s.pts.push({ x: n, y: a(n), role, r: n === N && step >= 2 ? 5 : 4 });
  }
  if ((step === 2 && e > 0.5) || step === 3) {
    s.labels.push({ x: N, y: a(N), tex: `a_N = a_{${N}}`, role: 'pt', anchor: 't', dy: 9, small: true });
    s.vlines.push({ at: N - 0.5, role: 'aux', dashed: true });
  }
  return s;
}

/* ================================================================ the root trick as areas (U01 p. 11) */
export const ROOT_STEPS = 4;
export const ROOT_N = 2;
/** n during step 4: 2 → 50. */
export const rootN = (step: number, t: number) => (step < 3 ? ROOT_N : ROOT_N * 25 ** ease(t));
export function rootScene(step: number, t: number, lang: Lang): Scene {
  const e = ease(t), n = rootN(step, t), sd = side(n), d = sd - 1;
  const s = empty({ x: [-0.3, 2.45], y: [-0.3, 2.45], w: 360, h: 360, grid: [0, 0], tick: [0, 0], axes: ['', ''] });
  // unit square and the square of area 1 + 1/n
  s.polys.push({ pts: rect(0, 0, 1, 1), role: 'ref', fill: true });
  s.polys.push({ pts: rect(0, 0, sd, sd), role: 'f' });
  s.labels.push({ x: 0.5, y: 0.5, tex: '1', role: 'muted' });
  // the right strip δ × s stays; the top strip 1 × δ turns and stands on it
  const right = rect(1, 0, sd, sd);
  const turn = step === 0 ? 0 : step === 1 ? e : 1;
  const c0: P2 = [0.5, (1 + sd) / 2], c1: P2 = [(1 + sd) / 2, sd + 0.5];
  const cx = lerp(c0[0], c1[0], turn), cy = lerp(c0[1], c1[1], turn), th = (Math.PI / 2) * turn;
  const corner = (u: number, v: number): P2 => [cx + u * Math.cos(th) - v * Math.sin(th), cy + u * Math.sin(th) + v * Math.cos(th)];
  const top: P2[] = [corner(-0.5, -d / 2), corner(0.5, -d / 2), corner(0.5, d / 2), corner(-0.5, d / 2)];
  if (step <= 1) {
    s.polys.push({ pts: right, role: 'g', fill: true }, { pts: top, role: 'g', fill: true });
  } else {
    // one rectangle δ·(s+1); in step 3 its width is stretched by n (area n·δ·(s+1) = 1)
    const wid = step === 2 ? lerp(d, ROOT_N * d, e) : n * d;
    s.polys.push({ pts: rect(1, 0, 1 + wid, sd + 1), role: 'g', fill: true });
  }
  if (step === 0) {
    s.labels.push({ x: (1 + sd) / 2, y: sd / 2, tex: '\\delta', role: 'g', anchor: 'l', dx: 12, small: true });
    s.labels.push({ x: 0.5, y: (1 + sd) / 2, tex: '\\delta', role: 'g', anchor: 'b', dy: -16, small: true });
    s.labels.push({ x: sd, y: sd, tex: 's^2 = 1 + \\tfrac1n', role: 'f', anchor: 'l', dx: 6, dy: -12 });
  } else if (step === 1) {
    if (e > 0.7) {
      s.labels.push({ x: sd, y: (sd + 1) / 2, tex: '\\delta\\,(s+1) = \\tfrac1n', role: 'g', anchor: 'l', dx: 10 });
      s.labels.push({ x: (1 + sd) / 2, y: sd + 1, tex: '\\delta', role: 'g', anchor: 'b', dy: -6, small: true });
    }
  } else if (step === 2) {
    const wid = lerp(d, ROOT_N * d, e);
    if (e > 0.7) {
      s.labels.push({ x: 1 + wid, y: (sd + 1) / 2, tex: 'n\\delta\\,(s+1) = 1', role: 'g', anchor: 'l', dx: 8 });
      s.labels.push({ x: 1 + wid / 2, y: sd + 1, tex: 'n\\delta', role: 'g', anchor: 'b', dy: -6, small: true });
    }
  } else {
    s.labels.push({ x: 1 + n * d, y: (sd + 1) / 2, tex: `n\\delta = ${num(n * d, 3, lang)}`, role: 'g', anchor: 'l', dx: 8 });
    s.labels.push({ x: 1 + n * d, y: (sd + 1) / 2, tex: `s + 1 = ${num(sd + 1, 3, lang)}`, role: 'f', anchor: 'l', dx: 8, dy: 26, small: true });
    s.labels.push({ x: 1 + n * d, y: (sd + 1) / 2, tex: `n = ${Math.round(n)}`, role: 'muted', anchor: 'l', dx: 8, dy: -26, small: true });
  }
  return s;
}

/* ================================================================ Gauss pairing (U01 p. 11, 4 + 8 + … + 24) */
export const GAUSS_STEPS = 3;
export function gaussScene(step: number, t: number, lang: Lang): Scene {
  void lang;
  const e = ease(t), { a1, d, n } = AR, an = a1 + d * (n - 1), pair = a1 + an;
  const s = empty({ x: [0, n + 0.7], y: [0, 31], grid: [0, 4], tick: [1, 4], axes: ['k', ''] });
  const grow = step === 0 ? e : 1;
  for (let k = 1; k <= n; k++) {
    const h = (a1 + d * (k - 1)) * grow;
    s.polys.push({ pts: rect(k - 0.38, 0, k + 0.38, h), role: 'f', fill: true });
    if (step === 0 && e > 0.8) s.labels.push({ x: k, y: h, tex: String(a1 + d * (k - 1)), role: 'f', anchor: 'b', dy: -4, small: true });
  }
  if (step >= 1) {
    const drop = step === 1 ? lerp(34, 0, e) : 0;
    for (let k = 1; k <= n; k++) {
      const base = a1 + d * (k - 1), h = an - d * (k - 1);
      s.polys.push({ pts: rect(k - 0.38, base + drop, k + 0.38, base + h + drop), role: 'g', fill: true });
      if (step === 1 && e > 0.8) {
        s.labels.push({ x: k, y: base / 2, tex: String(base), role: 'f', small: true });
        s.labels.push({ x: k, y: base + h / 2, tex: String(h), role: 'g', small: true });
      }
    }
  }
  if (step >= 1 && (step > 1 || e > 0.8)) {
    s.hlines.push({ at: pair, role: 'asym', dashed: true });
    s.labels.push({ x: n + 0.6, y: pair, tex: `a_1 + a_n = ${pair}`, role: 'asym', anchor: 'r', dy: -12, small: true });
  }
  if (step === 2) s.labels.push({ x: (n + 1) / 2, y: pair / 2, tex: `${n}\\cdot ${pair} = ${n * pair} = 2S_${n}`, role: 'fg' });
  return s;
}

/* ================================================================ 3 + 3/2 + 3/4 + … = 6: the gap halves */
export const HALF_STEPS = 5;
export function halfScene(step: number, t: number, lang: Lang): Scene {
  const e = ease(t), { a1, q } = GI, lim = a1 / (1 - q);
  const s = empty({ x: [-0.2, 6.6], y: [-0.9, 1.7], grid: [0, 0], tick: [1, 0], axes: ['', ''] });
  s.polys.push({ pts: rect(0, 0, lim, 1), role: 'ref', dashed: true });
  s.vlines.push({ at: lim, role: 'asym', dashed: true });
  s.labels.push({ x: lim, y: 1.7, tex: 'S_\\infty = 6', role: 'asym', anchor: 't', dy: 4, small: true });
  const count = step < 4 ? step + 1 : 4 + Math.floor(e * 8);
  const frac = step < 4 ? e : 1;
  const texPiece = ['3', '\\tfrac32', '\\tfrac34', '\\tfrac38'];
  for (let k = 1; k <= count; k++) {
    const x0 = geoSum(a1, q, k - 1), x1 = geoSum(a1, q, k);
    const xe = k === count && step < 4 ? lerp(x0, x1, frac) : x1;
    s.polys.push({ pts: rect(x0, 0, xe, 1), role: k % 2 ? 'f' : 'g', fill: true });
    if (k <= 3 && (k < count || frac > 0.7)) s.labels.push({ x: (x0 + x1) / 2, y: 0.5, tex: texPiece[k - 1], role: k % 2 ? 'f' : 'g', small: k > 2 });
  }
  const done = step < 4 ? (frac > 0.7 ? step + 1 : step) : 12;
  if (done >= 1) {
    const Sn = geoSum(a1, q, done), gap = lim - Sn;
    s.labels.push({ x: Sn, y: 1, tex: step < 4 ? `S_${done} = ${num(Sn, 3, lang)}` : 'S_n \\to 6', role: 'fg', anchor: step < 4 ? 'b' : 'r', dy: -6, dx: step < 4 ? 0 : -4, small: true });
    if (step < 4) s.labels.push({ x: lim, y: -0.45, tex: `6 - S_${done} = ${num(gap, 3, lang)}`, role: 'asym', anchor: 'r', small: true });
    else s.labels.push({ x: lim, y: -0.45, tex: '6 - S_n = 6\\cdot\\left(\\tfrac12\\right)^{n} \\to 0', role: 'asym', anchor: 'r', small: true });
  }
  return s;
}

/* ================================================================ harmonic series: grouping proof (U02 p. 2) */
export const HARM_STEPS = 5;
export const HARM_K = 16;
const GROLE: SRole[] = ['grp0', 'grp1', 'grp2', 'grp3'];
/** Colour of term k: blue 1 + 1/2, magenta 1/3 + 1/4, green 1/5 … 1/8, purple 1/9 … 1/16 (as on the slide, purple = bracket). */
export const harmGroupOf = (k: number) => (k <= 2 ? 0 : k <= 4 ? 1 : k <= 8 ? 2 : 3);
export function harmScene(step: number, t: number, lang: Lang): Scene {
  void lang;
  const e = ease(t);
  const s = empty({ x: [0, HARM_K + 0.6], y: [0, 1.15], grid: [0, 0.25], tick: [1, 0.25], axes: ['k', ''] });
  // groups that are already cut (step m cuts group m; group 0 = 1 + 1/2 is coloured in step 0)
  for (let k = 1; k <= HARM_K; k++) {
    const g = harmGroupOf(k), h = 1 / k;
    const active = g <= step;
    const role: SRole = active ? GROLE[g] : 'aux';
    if (!active || g === 0) { s.polys.push({ pts: rect(k - 1, 0, k, h), role, fill: true }); continue; }
    const low = 2 ** -Math.ceil(Math.log2(k)); // the group's smallest term 1/2^m
    const cut = g < step ? 1 : e; // in its own step the bar sinks to the low level
    s.polys.push({ pts: rect(k - 1, 0, k, h), role, dashed: true });
    s.polys.push({ pts: rect(k - 1, 0, k, lerp(h, low, cut)), role, fill: true });
  }
  if (step >= 0) s.labels.push({ x: 1, y: 1, tex: '1 + \\tfrac12', role: 'grp0', anchor: 'l', dx: 30, dy: -2 });
  const lab = ['', '\\tfrac14 + \\tfrac14 = \\tfrac12', '4\\cdot\\tfrac18 = \\tfrac12', '8\\cdot\\tfrac1{16} = \\tfrac12'];
  for (let m = 1; m <= Math.min(step, 3); m++) {
    if (m === step && e < 0.7) continue;
    const [a, b] = group(m + 1), mid = (a - 1 + b) / 2; // scene group m = the slide's terms 1/(2^m + 1) … 1/2^(m+1)
    s.labels.push({ x: mid, y: m === 1 ? 0.42 : m === 2 ? 0.3 : 0.18, tex: `\\ge ${lab[m]}`, role: GROLE[m], anchor: 'b', small: true });
  }
  if (step === 4 && e > 0.3) s.labels.push({ x: HARM_K + 0.5, y: 0.75, tex: 'S_{16} \\ge 1 + 4\\cdot\\tfrac12 = 3', role: 'fg', anchor: 'r' });
  return s;
}
