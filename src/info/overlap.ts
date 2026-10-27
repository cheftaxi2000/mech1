/** Pure model of the rectangle example (notes Code 6.2): the same logic as the C++ program (tested against it). */
export interface Rect { x: number; y: number; w: number; h: number }
export interface Interval { lo: number; hi: number }

/** The (generalized) interval [a, b] with [a, b] := [b, a] if a > b. */
export const interval = (a: number, b: number): Interval => ({ lo: Math.min(a, b), hi: Math.max(a, b) });

export const intervalsOverlap = (a1: number, b1: number, a2: number, b2: number) =>
  Math.max(a1, b1) >= Math.min(a2, b2) && Math.min(a1, b1) <= Math.max(a2, b2);

export const xInterval = (r: Rect) => interval(r.x, r.x + r.w);
export const yInterval = (r: Rect) => interval(r.y, r.y + r.h);

export const rectanglesOverlap = (r: Rect, s: Rect) =>
  intervalsOverlap(r.x, r.x + r.w, s.x, s.x + s.w) && intervalsOverlap(r.y, r.y + r.h, s.y, s.y + s.h);

/** The common part of two intervals (null if they do not overlap). */
export const intersect = (a: Interval, b: Interval): Interval | null => {
  const lo = Math.max(a.lo, b.lo), hi = Math.min(a.hi, b.hi);
  return lo <= hi ? { lo, hi } : null;
};
