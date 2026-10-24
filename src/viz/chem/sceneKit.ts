/**
 * Small helpers for the chemistry scenes (pure functions, see `viz/anim/scene.ts` for the scene vocabulary):
 * seeded random numbers, interpolation, and drawing of atoms, ions and water molecules as circles.
 * Classes `cs-*` are defined in `chem.css`.
 */
import { ease, seg, type P2 } from '../anim/geometry';
import type { Ink, sceneBuilder } from '../anim/scene';

export type SB = ReturnType<typeof sceneBuilder>;

/** Deterministic random numbers (mulberry32), so the particle pictures look the same every time. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const lerp2 = (a: P2, b: P2, u: number): P2 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
/** Angle interpolation along the shorter way round. */
export function lerpAngle(a: number, b: number, u: number): number {
  let d = (b - a) % (2 * Math.PI);
  if (d > Math.PI) d -= 2 * Math.PI;
  if (d < -Math.PI) d += 2 * Math.PI;
  return a + d * u;
}
export { ease, seg };

/** A filled circle. */
export function disc(sb: SB, key: string, cls: string, c: P2, r: number, o = 1) {
  if (o <= 0.01) return;
  sb.shape({ key, kind: 'circle', cls, pts: [c], r, o });
}

/** A «+» or «−» sign drawn with two lines inside an ion. */
export function sign(sb: SB, key: string, c: P2, plus: boolean, r: number, o = 1) {
  if (o <= 0.01) return;
  const s = r * 0.5;
  sb.shape({ key: `${key}-h`, kind: 'line', cls: 'cs-sign', pts: [[c[0] - s, c[1]], [c[0] + s, c[1]]], o });
  if (plus) sb.shape({ key: `${key}-v`, kind: 'line', cls: 'cs-sign', pts: [[c[0], c[1] - s], [c[0], c[1] + s]], o });
}

/** Water molecule: O at `c`, the H atoms on the side opposite to `theta` (the direction of the O end, i.e. of the dipole's negative end). */
export const WATER_L = 11, WATER_HALF = (52.25 * Math.PI) / 180, WATER_RO = 7, WATER_RH = 4.6;
export function waterAtoms(c: P2, theta: number): { O: P2; H1: P2; H2: P2 } {
  const h = (a: number): P2 => [c[0] - WATER_L * Math.cos(a), c[1] - WATER_L * Math.sin(a)];
  return { O: c, H1: h(theta + WATER_HALF), H2: h(theta - WATER_HALF) };
}
export function water(sb: SB, key: string, c: P2, theta: number, o = 1) {
  const { O, H1, H2 } = waterAtoms(c, theta);
  disc(sb, `${key}-h1`, 'cs-wH', H1, WATER_RH, o);
  disc(sb, `${key}-h2`, 'cs-wH', H2, WATER_RH, o);
  disc(sb, `${key}-o`, 'cs-wO', O, WATER_RO, o);
}

/** Chemistry inks (`.ink-cat` … in chem.css) in addition to the shared ones of `scene.ts`. */
export const INK = {
  cat: 'cat' as unknown as Ink, an: 'an' as unknown as Ink, el: 'el' as unknown as Ink, n: 'n' as unknown as Ink,
  e: 'e' as unknown as Ink, s: 's' as unknown as Ink, v: 'v' as unknown as Ink, p: 'p' as unknown as Ink,
  fg: 'fg' as Ink, muted: 'muted' as Ink,
};

/** Rectangle as a polygon. */
export const rect = (x0: number, y0: number, x1: number, y1: number): P2[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

/** Open beaker outline (a polyline) and its water body (a polygon). */
export function beaker(sb: SB, x0: number, y0: number, x1: number, y1: number, waterTop: number, o = 1) {
  sb.shape({ key: 'water', kind: 'polygon', cls: 'cs-water', pts: rect(x0, waterTop, x1, y1), o });
  sb.shape({ key: 'glass', kind: 'polyline', cls: 'cs-glass', pts: [[x0, y0], [x0, y1], [x1, y1], [x1, y0]], o });
}
