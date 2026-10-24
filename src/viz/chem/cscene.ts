/**
 * Vocabulary of the chemistry figures (thermodynamics lessons): shapes + KaTeX labels in viewBox units, built by pure
 * functions so that every frame can be unit-tested. Same idea as viz/anim/scene.ts, but with the colour roles of
 * docs/chem/NOTATION.md and a figure size that may differ from 400 × 300.
 */
import { texWidth, labelBox as baseBox, labelOverlap as baseOverlap, type SceneLabel } from '../anim/scene';
import type { P2 } from '../anim/geometry';

export type CAnchor = 'c' | 'l' | 'r' | 'tl' | 'tr' | 'bl' | 'br';
export interface CShape { key: string; kind: 'line' | 'polyline' | 'polygon' | 'circle' | 'rect'; cls: string; pts: P2[]; r?: number; o?: number; rx?: number }
/** `ink` is one of the `ch-*` text colours of thermo.css (`e t p v n s g`) or `muted`, `fg`. */
export interface CLabel { key: string; at: P2; tex: string; ink: string; anchor: CAnchor; o: number; box?: boolean; small?: boolean }
export interface CScene { w: number; h: number; shapes: CShape[]; labels: CLabel[]; data: Record<string, number> }

const est = (tex: string) => tex.replace(/\\mathrm\{([^}]*)\}/g, '$1').replace(/\\mathbf\{([^}]*)\}/g, '$1').replace(/\\!/g, '');
const asBase = (l: CLabel): SceneLabel => ({ key: l.key, at: l.at, tex: est(l.tex), ink: 'fg', anchor: l.anchor, o: l.o, box: l.box });
export const labelBox = (l: CLabel) => baseBox(asBase(l));
export const labelOverlap = (a: CLabel, b: CLabel) => baseOverlap(asBase(a), asBase(b));
export { texWidth };

const PAD = 3;
function clamp(l: CLabel, w: number, h: number): CLabel {
  const b = labelBox(l);
  const dx = b.x0 < PAD ? PAD - b.x0 : b.x1 > w - PAD ? w - PAD - b.x1 : 0;
  const dy = b.y0 < PAD ? PAD - b.y0 : b.y1 > h - PAD ? h - PAD - b.y1 : 0;
  return dx || dy ? { ...l, at: [l.at[0] + dx, l.at[1] + dy] } : l;
}

export const arrowHeadPts = (from: P2, to: P2, size = 8): P2[] => {
  const dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
  return [to, [to[0] - size * ux + size * 0.45 * uy, to[1] - size * uy - size * 0.45 * ux], [to[0] - size * ux - size * 0.45 * uy, to[1] - size * uy + size * 0.45 * ux]];
};

/** Collects shapes and labels of a frame; `finish` drops invisible labels and keeps the rest inside the figure. */
export function cbuilder(w: number, h: number) {
  const shapes: CShape[] = [], labels: CLabel[] = [];
  const api = {
    w, h, shapes, labels,
    shape: (key: string, kind: CShape['kind'], cls: string, pts: P2[], o = 1, r?: number, rx?: number) => { if (o > 0.01) shapes.push({ key, kind, cls, pts, o, r, rx }); },
    line: (key: string, cls: string, a: P2, b: P2, o = 1) => api.shape(key, 'line', cls, [a, b], o),
    rect: (key: string, cls: string, x: number, y: number, rw: number, rh: number, o = 1, rx = 0) => api.shape(key, 'rect', cls, [[x, y], [rw, rh]], o, undefined, rx),
    circle: (key: string, cls: string, c: P2, r: number, o = 1) => api.shape(key, 'circle', cls, [c], o, r),
    /** Arrow from a to b; the line stops at the head. Not drawn when shorter than 2 units. */
    arrow: (key: string, cls: string, a: P2, b: P2, o = 1, head = 8) => {
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (len < 2 || o <= 0.01) return;
      const s = Math.min(head, len * 0.6), ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len;
      api.shape(key, 'line', cls, [a, [b[0] - ux * s * 0.7, b[1] - uy * s * 0.7]], o);
      api.shape(`${key}-h`, 'polygon', `${cls.split(' ')[0]}-head`, arrowHeadPts(a, b, s), o);
    },
    label: (key: string, at: P2, tex: string, ink = 'fg', o = 1, anchor: CAnchor = 'c', extra: Partial<CLabel> = {}) => { labels.push({ key, at, tex, ink, anchor, o, ...extra }); },
    finish: (data: Record<string, number> = {}): CScene => ({ w, h, shapes, labels: labels.filter((l) => l.o > 0.02).map((l) => clamp(l, w, h)), data }),
  };
  return api;
}

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
