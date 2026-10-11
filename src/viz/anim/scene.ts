/**
 * Shared vocabulary of the pure animation scenes (cylScene, sphScene): shape and label types,
 * label-size estimation and clamping, small geometry helpers. A scene function maps (step, t, lang)
 * to a Scene; AnimFigure renders it. Colours are semantic and identical in every animation:
 * x blue, y amber, z green, ρ teal, r dark, angles purple, points red (see styles.css --c-*).
 */
import type { P2 } from './geometry';

export const W = 400, H = 300;
export const TAU = 2 * Math.PI;
export const DEG = Math.PI / 180;

export type Ink = 'muted' | 'point' | 'angle' | 'x' | 'y' | 'z' | 'rho' | 'r' | 'fg';
export type Anchor = 'c' | 'l' | 'r' | 'tl' | 'tr';
export interface Shape {
  key: string;
  kind: 'line' | 'polyline' | 'polygon' | 'circle';
  cls: string;
  pts: P2[];
  r?: number;
  o?: number;
}
export interface SceneLabel {
  key: string;
  at: P2;
  tex: string;
  ink: Ink;
  anchor: Anchor;
  o: number;
  box?: boolean;
  rows?: { tex: string; ink: Ink }[];
}
/** `data` carries values for tests and data-* attributes (e.g. the current angle). */
export interface Scene { shapes: Shape[]; labels: SceneLabel[]; data: Record<string, number> }

/** Angle in [0, 2π). */
export const wrap = (a: number) => ((a % TAU) + TAU) % TAU;

const FONT = 15.6; // label font size in viewBox units (matches the CSS clamp at a 400 px wide figure)
/** Rough rendered width of a TeX label in viewBox units; good enough for keeping labels inside the frame. */
export function texWidth(tex: string): number {
  const s = tex
    .replace(/\\ /g, '\u0000') // explicit TeX space
    .replace(/ /g, '') // source spaces are ignored by KaTeX
    .replace(/\u0000/g, ' ')
    .replace(/\\(dfrac|tfrac|frac)\{([^}]*)\}\{([^}]*)\}/g, (_, _c, a, b) => (a.length > b.length ? a : b))
    .replace(/\\(sqrt)\{([^}]*)\}/g, (_, _c, a) => `v${a}`)
    .replace(/\\(varphi|rho|theta|psi|pi|Delta|tau)/g, 'a')
    .replace(/\\v(?![a-z])/g, '')
    .replace(/\\(dot|tfrac|cdot)/g, (m) => (m === '\\cdot' ? '.' : ''))
    .replace(/\\(cos|sin|tan|arccos)/g, (m) => 'a'.repeat(m.length - 1))
    .replace(/\\circ/g, '.')
    .replace(/\\colon/g, ':')
    .replace(/\\(qquad|quad)/g, '  ')
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\{,\}/g, ',')
    .replace(/\\[,!;]/g, ' ')
    .replace(/[{}^_]/g, '');
  return s.length * 0.56 * FONT + 6;
}
const tall = (tex: string) => /\\(dfrac|tfrac|frac|sqrt)/.test(tex);
export function labelBox(l: SceneLabel): { x0: number; y0: number; x1: number; y1: number } {
  const rows = l.rows ?? [{ tex: l.tex, ink: l.ink }];
  const w = Math.max(...rows.map((r) => texWidth(r.tex))) + (l.box ? 16 : 0);
  const h = rows.reduce((acc, r) => acc + (tall(r.tex) ? 2.3 : l.box ? 1.65 : 1.35) * FONT, 0) + (l.box ? 16 : 0); // boxes: padding + KaTeX strut
  const [x, y] = l.at;
  switch (l.anchor) {
    case 'l': return { x0: x, y0: y - h / 2, x1: x + w, y1: y + h / 2 };
    case 'r': return { x0: x - w, y0: y - h / 2, x1: x, y1: y + h / 2 };
    case 'tl': return { x0: x, y0: y, x1: x + w, y1: y + h };
    case 'tr': return { x0: x - w, y0: y, x1: x, y1: y + h };
    default: return { x0: x - w / 2, y0: y - h / 2, x1: x + w / 2, y1: y + h / 2 };
  }
}
const PAD = 4;
/** Shift a label so that its (estimated) box lies inside the figure. */
export function clampLabel(l: SceneLabel): SceneLabel {
  const b = labelBox(l);
  const dx = b.x0 < PAD ? PAD - b.x0 : b.x1 > W - PAD ? W - PAD - b.x1 : 0;
  const dy = b.y0 < PAD ? PAD - b.y0 : b.y1 > H - PAD ? H - PAD - b.y1 : 0;
  return dx || dy ? { ...l, at: [l.at[0] + dx, l.at[1] + dy] } : l;
}
/** Fraction of the smaller label box covered by the other (0 = disjoint). */
export function labelOverlap(a: SceneLabel, b: SceneLabel): number {
  const A = labelBox(a), B = labelBox(b);
  const w = Math.min(A.x1, B.x1) - Math.max(A.x0, B.x0), h = Math.min(A.y1, B.y1) - Math.max(A.y0, B.y0);
  if (w <= 0 || h <= 0) return 0;
  return (w * h) / Math.min((A.x1 - A.x0) * (A.y1 - A.y0), (B.x1 - B.x0) * (B.y1 - B.y0));
}

export function arrowHead(from: P2, to: P2, size = 7): P2[] {
  const dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  return [to, [to[0] - size * ux + size * 0.45 * uy, to[1] - size * uy - size * 0.45 * ux], [to[0] - size * ux - size * 0.45 * uy, to[1] - size * uy + size * 0.45 * ux]];
}

/** Collects shapes and labels; finish() drops invisible labels and clamps the rest into the frame. */
export function sceneBuilder() {
  const shapes: Shape[] = [];
  const labels: SceneLabel[] = [];
  return {
    shapes, labels,
    shape: (s: Shape) => { shapes.push(s); },
    label: (key: string, at: P2, tex: string, ink: Ink, o = 1, anchor: Anchor = 'c', extra: Partial<SceneLabel> = {}) => {
      labels.push({ key, at, tex, ink, anchor, o, ...extra });
    },
    finish: (data: Record<string, number>): Scene => ({ shapes, labels: labels.filter((l) => l.o > 0.02).map(clampLabel), data }),
  };
}
