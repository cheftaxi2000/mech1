/**
 * Drawing helpers shared by the pure scenes of lesson K7 (K7ProofScene, K7LadderScene) and the interactive figures:
 * arrows with one or two heads (moments and ω̲ get a double head), arcs, stacked bars, plain-language «ink» names.
 * Colours (see styles.css and K7.css): forces vermilion, velocities rose, ω̲ and angles purple, power > 0 green, < 0 amber.
 */
import type { Ink, SceneLabel, Shape } from '../anim/scene';
import { arrowHead } from '../anim/scene';
import { clamp01, ease, seg, type P2 } from '../anim/geometry';

/** The vermilion «force» ink exists in styles.css (.ink-force); the scene type of the shared kit does not list it yet. */
export const FORCE = 'force' as unknown as Ink;
/** Velocities use the point colour (rose) — the same token as in the kinematics chapters. */
export const VEL: Ink = 'point';
export const OMEGA: Ink = 'angle';

type Builder = { shape: (s: Shape) => void };
type Kind = 'line' | 'polyline' | 'polygon' | 'circle';

/** Opacity of an element that appears during step `k` (between t = a and t = b) and stays afterwards. */
export const appear = (step: number, k: number, t: number, a = 0, b = 1) => (step < k ? 0 : step === k ? ease(seg(t, a, b)) : 1);
/** Opacity of an element that is visible from the start of step `k0` and fades out during step `k1`. */
export const fade = (step: number, k0: number, k1: number, t: number, a = 0, b = 0.6, to = 0) =>
  step < k0 ? 0 : step < k1 ? 1 : step === k1 ? 1 - (1 - to) * ease(seg(t, a, b)) : to;

export const lerp2 = (a: P2, b: P2, k: number): P2 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
export const len2 = (a: P2, b: P2) => Math.hypot(b[0] - a[0], b[1] - a[1]);

export function draw(sb: Builder) {
  const S = (key: string, kind: Kind, cls: string, pts: P2[], o = 1, r?: number) => { if (o > 0.01) sb.shape({ key, kind, cls, pts, o, r }); };
  /** Arrow a → b; the arrow grows from a with `k` ∈ [0, 1]. */
  const arrow = (key: string, cls: string, a: P2, b: P2, o = 1, head = 8, k = 1) => {
    if (o <= 0.01 || k <= 0.01) return;
    const e = lerp2(a, b, clamp01(k));
    if (len2(a, e) < 1.5) return;
    S(key, 'line', cls, [a, e], o); S(key + '-h', 'polygon', cls.split(' ')[0] + '-head', arrowHead(a, e, head), o);
  };
  /** Arc of radius r about c from angle a0 to a1 (mathematical angles, counter-clockwise positive, y up on the screen). */
  const arcPts = (c: P2, r: number, a0: number, a1: number, n = 28): P2[] =>
    Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)] as P2; });
  /** Arc with one or two arrowheads at the end (the lecture-style turning arrow; two heads = moment M̲ or ω̲ as a vector). */
  const arc = (key: string, cls: string, c: P2, r: number, a0: number, a1: number, o = 1, heads: 1 | 2 = 2, k = 1) => {
    if (o <= 0.01 || k <= 0.01) return;
    const aEnd = a0 + (a1 - a0) * clamp01(k), dir = a1 >= a0 ? 1 : -1;
    const pt = (a: number): P2 => [c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)];
    const h = Math.min(7.5, 0.7 * r), d = h / r, w = Math.min(3.6, 0.42 * h + 0.6); // head length (px, radians) and half width
    S(key, 'polyline', cls, arcPts(c, r, a0, aEnd - dir * d * (heads === 2 ? 1.2 : 0.6), Math.max(6, Math.round((28 * Math.abs(aEnd - a0)) / Math.PI))), o);
    // a head follows the arc: tip on the arc, base one head-length back, corners in radial direction
    const head = (a: number, suffix: string) => {
      const tip = pt(a), ab = a - dir * d, bc = pt(ab), rad: P2 = [Math.cos(ab), -Math.sin(ab)];
      S(key + suffix, 'polygon', cls.split(' ')[0] + '-head', [tip, [bc[0] + w * rad[0], bc[1] + w * rad[1]], [bc[0] - w * rad[0], bc[1] - w * rad[1]]], o);
    };
    head(aEnd, '-h');
    if (heads === 2 && Math.abs(aEnd - a0) > 0.8) head(aEnd - dir * d * 0.95, '-h2');
  };
  /**
   * The lecture's ⊙ (vector pointing out of the page) or ⊗ (into the page) with a double-head arc around it, counter-clockwise
   * for ⊙ (positive), clockwise for ⊗ (negative): ω̲ or a moment M̲ seen from above.
   */
  const spin = (key: string, cls: string, c: P2, r: number, o = 1, ccw = true) => {
    if (o <= 0.01) return;
    const c0 = cls.split(' ')[0];
    if (ccw) S(key + '-dot', 'circle', c0 + '-dot', [c], o, 2.6);
    else { const q = 3.2; S(key + '-x1', 'line', c0 + '-cross', [[c[0] - q, c[1] - q], [c[0] + q, c[1] + q]], o); S(key + '-x2', 'line', c0 + '-cross', [[c[0] - q, c[1] + q], [c[0] + q, c[1] - q]], o); }
    if (ccw) arc(key, cls, c, r, 0.2 * Math.PI, 1.75 * Math.PI, o, 2);
    else arc(key, cls, c, r, 0.8 * Math.PI, -0.75 * Math.PI, o, 2);
  };
  /** Rectangle as a polygon. */
  const rect = (key: string, cls: string, x0: number, y0: number, x1: number, y1: number, o = 1) =>
    S(key, 'polygon', cls, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], o);
  return { S, arrow, arc, arcPts, spin, rect };
}

/** Number as TeX (decimal comma in German), always with the same number of digits. */
export const num = (x: number, digits: number, de: boolean) => {
  const v = Math.abs(x) < 0.5 * 10 ** -digits ? 0 : x;
  const s = v.toFixed(digits);
  return (de ? s.replace('.', '{,}') : s);
};

/**
 * Round values to `digits` decimals so that the rounded values add up to the rounded sum
 * (largest-remainder rule): the numbers on screen never contradict «a + b = c» by a rounding step.
 */
export function roundToSum(values: number[], digits = 1): number[] {
  const u = 10 ** digits, scaled = values.map((v) => v * u), fl = scaled.map(Math.floor);
  let rest = Math.round(scaled.reduce((a, b) => a + b, 0)) - fl.reduce((a, b) => a + b, 0);
  const order = scaled.map((v, i) => [v - fl[i], i] as const).sort((a, b) => b[0] - a[0]);
  for (let k = 0; rest > 0 && k < order.length; k++, rest--) fl[order[k][1]] += 1;
  return fl.map((v) => (Object.is(v, -0) ? 0 : v / u));
}

export type { SceneLabel };
