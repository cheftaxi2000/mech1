/**
 * Pure helpers for the week-2 Analysis figures (W2Figures.tsx): interval TeX, drag snapping, the frames of the
 * two step animations (cancelling, sin x / x on the unit circle), the one-sided-limit probe and the L'Hôpital zoom.
 * No React here; every frame is unit-tested in w2Geom.test.ts.
 */
import type { Interval } from '../../analysis/w2';

const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** A number for TeX: integers plain, otherwise up to 2 decimals, decimal comma in German. */
export function numTex(v: number, lang: 'de' | 'en', digits = 2): string {
  const r = +v.toFixed(digits);
  const s = Number.isInteger(r) ? String(r) : String(r);
  return lang === 'de' ? s.replace('.', '{,}') : s;
}

/** Interval as TeX, e.g. "[2, 6)"; German with decimals uses ";" between the ends. */
export function ivTex(iv: Interval, lang: 'de' | 'en'): string {
  const dec = !Number.isInteger(+iv.lo.toFixed(2)) || !Number.isInteger(+iv.hi.toFixed(2));
  const sep = lang === 'de' && dec ? ';\\ ' : ',\\ ';
  return `${iv.loIn ? '[' : '('}${numTex(iv.lo, lang)}${sep}${numTex(iv.hi, lang)}${iv.hiIn ? ']' : ')'}`;
}

/** Image explorer: drag the nearer end of the domain; snap to 0,5; keep at least 0,5 between the ends; stay in [lo, hi]. */
export function dragEnd(d: Interval, x: number, which: 'lo' | 'hi', range: [number, number] = [1, 7]): Interval {
  const s = Math.round(x * 2) / 2;
  if (which === 'lo') return { ...d, lo: Math.min(Math.max(s, range[0]), d.hi - 0.5) };
  return { ...d, hi: Math.max(Math.min(s, range[1]), d.lo + 0.5) };
}
export const nearerEnd = (d: Interval, x: number): 'lo' | 'hi' => (Math.abs(x - d.lo) <= Math.abs(x - d.hi) ? 'lo' : 'hi');

/* ------------------------------------------------------------------ one-sided limit probe */

/** Slider position s ∈ [0, 1] → distance h from 2 down to 0,01 (logarithmic, so the last approach is visible). */
export const probeH = (s: number) => 2 * 200 ** -Math.min(1, Math.max(0, s));

/* ------------------------------------------------------------------ cancelling animation (Faktorisieren & Kürzen) */

export interface CancelFrame {
  /** the reduced graph (x+2)/(x+3) is drawn up to this x (−∞: not drawn). */
  reducedTo: number;
  /** distance of the two probe points from 2 (null: no probe). */
  h: number | null;
  /** the limit point (2, 4/5) is shown filled. */
  limit: boolean;
}
export const CANCEL_X: [number, number] = [-1.6, 6];
export function cancelFrame(step: number, t: number): CancelFrame {
  if (step === 0) return { reducedTo: -Infinity, h: null, limit: false };
  if (step === 1) return { reducedTo: lerp(CANCEL_X[0], CANCEL_X[1], ease(t)), h: null, limit: false };
  const e = ease(t);
  return { reducedTo: CANCEL_X[1], h: lerp(2.5, 0.04, e), limit: t >= 1 };
}

/* ------------------------------------------------------------------ sin x / x on the unit circle */

export interface SinFrame {
  x: number;
  arc: boolean; small: boolean; sector: boolean; big: boolean;
  /** show the squeeze read-out 1 ≤ x/sin x ≤ 1/cos x. */
  squeeze: boolean;
}
export const SIN_X0 = 0.9, SIN_X1 = 0.4;
export function sinFrame(step: number, t: number): SinFrame {
  const base = { x: SIN_X0, arc: true, small: step >= 1, sector: step >= 2, big: step >= 3, squeeze: step >= 4 };
  if (step === 0) return { ...base, x: lerp(0.05, SIN_X0, ease(t)) };
  if (step === 4) return { ...base, x: lerp(SIN_X0, SIN_X1, ease(t)) };
  return base;
}
/** Polygons of the three areas (math coordinates). */
export function sinShapes(x: number, n = 40) {
  const P: [number, number] = [Math.cos(x), Math.sin(x)];
  const arc: [number, number][] = Array.from({ length: n + 1 }, (_, i) => [Math.cos((x * i) / n), Math.sin((x * i) / n)]);
  return {
    P, A: [1, 0] as [number, number], T: [1, Math.tan(x)] as [number, number], foot: [P[0], 0] as [number, number],
    arc,
    small: [[0, 0], [1, 0], P] as [number, number][],
    sector: [[0, 0], ...arc] as [number, number][],
    big: [[0, 0], [1, 0], [1, Math.tan(x)]] as [number, number][],
  };
}

/* ------------------------------------------------------------------ L'Hôpital zoom */

/** Zoom slider s ∈ [0, 1] → half-width of the window from 1,5 down to 0,02. */
export const zoomW = (s: number) => 1.5 * (0.02 / 1.5) ** Math.min(1, Math.max(0, s));
/** A "nice" tick step for a window of half-width w (about two ticks per side). */
export function niceStep(w: number): number {
  const raw = w / 2, p = 10 ** Math.floor(Math.log10(raw)), m = raw / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 8 ? 5 : 10) * p;
}
export const zoomWindow = (w: number) => ({ x: [-w, w] as [number, number], y: [-2.4 * w, 2.4 * w] as [number, number], step: niceStep(w) });
