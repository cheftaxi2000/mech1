import { useEffect, useState, type RefObject } from 'react';
import { useReducedMotion } from '../figUtils';

/**
 * Small drawing helpers shared by the figures of the lessons «Leistung» and «Leistung bei Rotation» (K5, K6).
 * 2D figures are SVG with KaTeX labels laid over it (see `at` in figUtils); colours come from lp.css.
 */
export type V2 = readonly [number, number];
export const pts = (ps: readonly V2[]) => ps.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

/** Arrow from a to b: line plus head; `double` draws the second head of a moment (M̲) or of ω̲. Hidden when shorter than 2 px. */
export function Arrow({ a, b, cls, double = false, head = 9 }: { a: V2; b: V2; cls: string; double?: boolean; head?: number }) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
  if (l < 2) return null;
  const ux = dx / l, uy = dy / l, s = Math.min(head, 0.55 * l);
  const headAt = (px: number, py: number) => `${px},${py} ${px - s * ux + 0.46 * s * uy},${py - s * uy - 0.46 * s * ux} ${px - s * ux - 0.46 * s * uy},${py - s * uy + 0.46 * s * ux}`;
  const gap = double ? 0.85 * s : 0;
  const end: V2 = [b[0] - ux * (0.7 * s + gap), b[1] - uy * (0.7 * s + gap)];
  return (
    <g className={`lp-a ${cls}`}>
      <line x1={a[0]} y1={a[1]} x2={end[0]} y2={end[1]} />
      <polygon points={headAt(b[0], b[1])} />
      {double && <polygon points={headAt(b[0] - ux * gap, b[1] - uy * gap)} />}
    </g>
  );
}

/** Right-angle mark (k px) at a between the directions toward q and toward b. */
export function RightAngle({ a, q, b, k = 9, cls = 'lp-ra' }: { a: V2; q: V2; b: V2; k?: number; cls?: string }) {
  const u = (p: V2): V2 => { const dx = p[0] - a[0], dy = p[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
  const e = u(q), w = u(b);
  return <polyline className={cls} points={pts([[a[0] + k * e[0], a[1] + k * e[1]], [a[0] + k * (e[0] + w[0]), a[1] + k * (e[1] + w[1])], [a[0] + k * w[0], a[1] + k * w[1]]])} />;
}

/** Circular arc about c from angle a0 to a1 (radians, screen y downward: positive = clockwise on screen). */
export function arcPath(c: V2, r: number, a0: number, a1: number): string {
  const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 0.12));
  return Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return `${i ? 'L' : 'M'}${(c[0] + r * Math.cos(a)).toFixed(1)},${(c[1] + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
}

/** Pointer position in viewBox units. */
export function svgPoint(svg: SVGSVGElement, vb: readonly number[], e: { clientX: number; clientY: number }): V2 {
  const r = svg.getBoundingClientRect();
  return [vb[0] + ((e.clientX - r.left) / r.width) * vb[2], vb[1] + ((e.clientY - r.top) / r.height) * vb[3]];
}

/** True while the element is at least a little on screen (animations pause otherwise). */
export function useOnScreen(ref: RefObject<Element | null>): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return on;
}

/**
 * Seconds since the figure became visible; stands still when the figure is off screen, when the viewer prefers reduced
 * motion, or when `run` is false. Used for the sliding track, the circling charge, the turning wheel.
 */
export function useTicker(ref: RefObject<Element | null>, run = true, speed = 1): number {
  const reduced = useReducedMotion();
  const visible = useOnScreen(ref);
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!run || reduced || !visible) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => { const dt = Math.min(now - last, 100); last = now; setT((x) => x + (speed * dt) / 1000); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, reduced, visible, speed]);
  return t;
}
