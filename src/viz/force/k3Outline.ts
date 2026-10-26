/**
 * The dashed «Systemgrenze»: the outline of the union of axis-parallel rectangles, each grown by a margin.
 * Rectangles that touch (or come closer than 2·margin) merge into one outline; far-apart ones get one outline each.
 */
export interface Rect { x0: number; y0: number; x1: number; y1: number }
export type Pt = readonly [number, number];

export function unionOutline(rects: readonly Rect[], margin: number): Pt[][] {
  if (!rects.length) return [];
  const R = rects.map((r) => ({ x0: r.x0 - margin, y0: r.y0 - margin, x1: r.x1 + margin, y1: r.y1 + margin }));
  const xs = [...new Set(R.flatMap((r) => [r.x0, r.x1]))].sort((a, b) => a - b);
  const ys = [...new Set(R.flatMap((r) => [r.y0, r.y1]))].sort((a, b) => a - b);
  const covered = (i: number, j: number) => {
    if (i < 0 || j < 0 || i >= xs.length - 1 || j >= ys.length - 1) return false;
    const cx = (xs[i] + xs[i + 1]) / 2, cy = (ys[j] + ys[j + 1]) / 2;
    return R.some((r) => cx > r.x0 && cx < r.x1 && cy > r.y0 && cy < r.y1);
  };
  // directed boundary edges, one per cell side that faces an uncovered cell (the covered cell stays on the same side)
  const edges = new Map<string, { to: Pt; used: boolean }[]>();
  const key = (p: Pt) => `${p[0]},${p[1]}`;
  const add = (a: Pt, b: Pt) => { const k = key(a); (edges.get(k) ?? edges.set(k, []).get(k)!).push({ to: b, used: false }); };
  for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) {
    if (!covered(i, j)) continue;
    const a: Pt = [xs[i], ys[j]], b: Pt = [xs[i + 1], ys[j]], c: Pt = [xs[i + 1], ys[j + 1]], d: Pt = [xs[i], ys[j + 1]];
    if (!covered(i, j - 1)) add(a, b);
    if (!covered(i + 1, j)) add(b, c);
    if (!covered(i, j + 1)) add(c, d);
    if (!covered(i - 1, j)) add(d, a);
  }
  const loops: Pt[][] = [];
  for (const [k, list] of edges) {
    for (const e0 of list) {
      if (e0.used) continue;
      const start = k.split(',').map(Number) as unknown as Pt;
      const loop: Pt[] = [start];
      let cur = e0; cur.used = true;
      for (let guard = 0; guard < 10000; guard++) {
        const p = cur.to;
        if (key(p) === k) break;
        loop.push(p);
        const next = edges.get(key(p))?.find((e) => !e.used);
        if (!next) break;
        next.used = true; cur = next;
      }
      loops.push(simplify(loop));
    }
  }
  return loops;
}

/** Drop vertices that lie on a straight line between their neighbours. */
function simplify(p: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < p.length; i++) {
    const a = p[(i + p.length - 1) % p.length], b = p[i], c = p[(i + 1) % p.length];
    const cross = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
    if (Math.abs(cross) > 1e-9) out.push(b);
  }
  return out;
}

export const pathOf = (loops: readonly (readonly Pt[])[]) => loops.map((l) => `M${l.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L')}Z`).join('');
