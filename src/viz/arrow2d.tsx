type V = readonly [number, number];

/**
 * The one 2-D arrow of the course (every SVG figure draws its vectors with it).
 * The head is a slightly notched (barbed) arrowhead, which reads as a direction better than a plain triangle at
 * small sizes; the shaft has round caps and ends inside the notch, so no gap or bump shows at the tip. Short arrows
 * get a proportionally smaller head (at most `maxFrac` of the length).
 */
export function arrowHeadPoints(a: V, b: V, size = 9, maxFrac = 0.6): string {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
  const ux = dx / l, uy = dy / l, s = Math.min(size, maxFrac * l), w = 0.46 * s, n = 0.74 * s;
  const f = (x: number, y: number) => `${x.toFixed(2)},${y.toFixed(2)}`;
  return [
    f(b[0], b[1]),
    f(b[0] - s * ux + w * uy, b[1] - s * uy - w * ux),
    f(b[0] - n * ux, b[1] - n * uy),
    f(b[0] - s * ux - w * uy, b[1] - s * uy + w * ux),
  ].join(' ');
}

/** Where the shaft ends (inside the notch of the head). */
export function arrowShaftEnd(a: V, b: V, size = 9, maxFrac = 0.6): V {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, s = Math.min(size, maxFrac * l);
  return [b[0] - (dx / l) * 0.74 * s, b[1] - (dy / l) * 0.74 * s];
}

/** `cls` colours both parts the way the figure CSS always did: `<g class=cls>` with `line` and `polygon` children. */
export function Arrow({ a, b, cls, head = 9 }: { a: V; b: V; cls: string; head?: number }) {
  if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1.5) return null;
  const e = arrowShaftEnd(a, b, head);
  return (
    <g className={cls}>
      <line x1={a[0]} y1={a[1]} x2={e[0]} y2={e[1]} strokeLinecap="round" />
      <polygon points={arrowHeadPoints(a, b, head)} />
    </g>
  );
}
