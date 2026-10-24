/**
 * Vocabulary of the pure chemistry animation scenes (gasScenes, …): a scene function maps (step, t, lang) to a
 * `CScene`; `ChemAnim` renders it. Same idea as `viz/anim/scene.ts`, but with the chemistry colour roles
 * (docs/chem/NOTATION.md): p blue, v green, t red, n purple, e amber, s teal, g indigo, el gold.
 *
 * Shape classes (see chem.css): `c` base, ink `i-p i-v i-t i-n i-e i-s i-g i-el i-fg i-muted`, modifiers
 * `f` (solid fill), `soft` (light fill), `dash`, `w1`, `w3`, `w4`.
 */
import { clampLabel, labelBox, labelOverlap, type Anchor, type Ink, type SceneLabel } from '../anim/scene';

export { W, H } from '../anim/scene';
export type { Anchor } from '../anim/scene';
export type P2 = readonly [number, number];

export type CInk = 'cp' | 'cv' | 'ct' | 'cn' | 'ce' | 'cs' | 'cg' | 'cel' | 'fg' | 'muted';
export interface CShape { key: string; kind: 'line' | 'polyline' | 'polygon' | 'circle'; cls: string; pts: P2[]; r?: number; o?: number }
export interface CLabel { key: string; at: P2; tex: string; ink: CInk; anchor: Anchor; o: number; box?: boolean; rows?: { tex: string; ink: CInk }[] }
export interface CScene { shapes: CShape[]; labels: CLabel[]; data: Record<string, number> }

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Progress of the sub-interval [a, b] of the step's time t. */
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const ease = (x: number) => { const k = clamp01(x); return k * k * (3 - 2 * k); };
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const lerp2 = (a: P2, b: P2, k: number): P2 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

/** the shared width estimator counts «\mathrm» as seven characters; strip the font commands first */
const plain = (tex: string) => tex.replace(/\\(mathrm|mathbf|mathit|operatorname)/g, '').replace(/\\[,;:!]/g, ' ').replace(/\\(bigl|bigr|Bigl|Bigr)/g, '');
const asLabel = (l: CLabel): SceneLabel => ({ ...l, tex: plain(l.tex), ink: l.ink as unknown as Ink, rows: l.rows?.map((r) => ({ tex: plain(r.tex), ink: r.ink as unknown as Ink })) });
export const boxOf = (l: CLabel) => labelBox(asLabel(l));
export const overlap = (a: CLabel, b: CLabel) => labelOverlap(asLabel(a), asLabel(b));

/** arrow head triangle at `to` pointing away from `from` */
export function head(from: P2, to: P2, size = 8): P2[] {
  const dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  return [to, [to[0] - size * ux + size * 0.45 * uy, to[1] - size * uy - size * 0.45 * ux], [to[0] - size * ux - size * 0.45 * uy, to[1] - size * uy + size * 0.45 * ux]];
}

/** Collects shapes and labels; `finish` clamps the labels into the frame and drops the invisible ones. */
export function builder() {
  const shapes: CShape[] = [];
  const labels: CLabel[] = [];
  const api = {
    shapes, labels,
    shape: (s: CShape) => { if ((s.o ?? 1) > 0.01) shapes.push(s); },
    line: (key: string, cls: string, a: P2, b: P2, o = 1) => api.shape({ key, kind: 'line', cls, pts: [a, b], o }),
    poly: (key: string, cls: string, pts: P2[], o = 1, closed = false) => api.shape({ key, kind: closed ? 'polygon' : 'polyline', cls, pts, o }),
    rect: (key: string, cls: string, x: number, y: number, w: number, h: number, o = 1) => api.shape({ key, kind: 'polygon', cls, pts: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], o }),
    dot: (key: string, cls: string, c: P2, r: number, o = 1) => api.shape({ key, kind: 'circle', cls, pts: [c], r, o }),
    /** a line with a head (two shapes: `key` and `key-h`) */
    arrow: (key: string, cls: string, a: P2, b: P2, o = 1, hs = 8) => {
      if (o <= 0.01 || Math.hypot(b[0] - a[0], b[1] - a[1]) < 2) return;
      const k = Math.hypot(b[0] - a[0], b[1] - a[1]), s = Math.min(hs, k * 0.6);
      const back: P2 = [b[0] - ((b[0] - a[0]) / k) * s * 0.8, b[1] - ((b[1] - a[1]) / k) * s * 0.8];
      api.shape({ key, kind: 'line', cls, pts: [a, back], o });
      api.shape({ key: key + '-h', kind: 'polygon', cls: cls + ' f', pts: head(a, b, s), o });
    },
    label: (key: string, at: P2, tex: string, ink: CInk, o = 1, anchor: Anchor = 'c', extra: Partial<CLabel> = {}) => { labels.push({ key, at, tex, ink, anchor, o, ...extra }); },
    finish: (data: Record<string, number>): CScene => ({ shapes, labels: labels.filter((l) => l.o > 0.02).map((l) => { const c = clampLabel(asLabel(l)); return { ...l, at: c.at }; }), data }),
  };
  return api;
}
