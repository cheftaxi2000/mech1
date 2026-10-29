import { useEffect, useRef, useState, type ReactNode } from 'react';
import { M } from '../../components/Tex';
import { useTr } from '../../i18n';
import { at, useReducedMotion } from '../figUtils';
import './force.css';
import { arrowHeadPoints } from '../arrow2d';

export type V = readonly [number, number];
export const t = String.raw;

/** Client position → figure coordinates (viewBox units). */
export function svgPt(svg: SVGSVGElement, vb: readonly number[], e: { clientX: number; clientY: number }): V {
  const r = svg.getBoundingClientRect();
  return [vb[0] + ((e.clientX - r.left) / r.width) * vb[2], vb[1] + ((e.clientY - r.top) / r.height) * vb[3]];
}

export const f1 = (x: number) => x.toFixed(1);

/** Head polygon of an arrow ending in b (pointing from a to b). */
export function headPoints(a: V, b: V, size = 11): string {
  return arrowHeadPoints(a, b, size, 0.7);
}

/**
 * Arrow from a to b: `cls` = line class (e.g. "kf-f"), the head takes `cls-head`.
 * `double` draws a second head (moments, lecture chapter 5).
 */
export function Arrow({ a, b, cls, head = 11, opacity, double }: { a: V; b: V; cls: string; head?: number; opacity?: number; double?: boolean }) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
  if (l < 2) return null;
  const ux = dx / l, uy = dy / l, back = Math.min(head, 0.7 * l) * 0.8;
  const cut: V = [b[0] - ux * back, b[1] - uy * back];
  const b2: V = [b[0] - ux * head * 0.95, b[1] - uy * head * 0.95];
  const hc = cls.split(' ')[0] + '-head';
  return (
    <g opacity={opacity}>
      <line className={cls} x1={a[0]} y1={a[1]} x2={double ? b2[0] - ux * back : cut[0]} y2={double ? b2[1] - uy * back : cut[1]} />
      <polygon className={hc} points={headPoints(a, b, head)} />
      {double && l > 2.2 * head && <polygon className={hc} points={headPoints(a, b2, head)} />}
    </g>
  );
}

/** HTML label (KaTeX) over an SVG with the given viewBox. `ink`: force | res | inner | vel | fg | ang | point | muted. */
export function KLabel({ vb, x, y, ink = 'fg', small = true, halo = true, children, dx = 0, dy = 0, anchor }: {
  vb: readonly [number, number, number, number]; x: number; y: number; ink?: string; small?: boolean; halo?: boolean; children: string; dx?: number; dy?: number; anchor?: 'l' | 'r' | 'b' | 't';
}) {
  const tr = anchor === 'l' ? 'translate(0,-50%)' : anchor === 'r' ? 'translate(-100%,-50%)' : anchor === 't' ? 'translate(-50%,0)' : anchor === 'b' ? 'translate(-50%,-100%)' : undefined;
  return (
    <div className={`vdemo-label ${ink}${small ? ' small' : ''}${halo ? ' halo' : ''}`} style={{ ...at(vb as [number, number, number, number], x + dx, y + dy), ...(tr ? { transform: tr } : {}) }}>
      <M>{children}</M>
    </div>
  );
}

/** Label just beyond the tip b of an arrow a→b, kept clear of the drag handle. */
export function beyond(a: V, b: V, k = 22): V {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
  return [b[0] + (k * dx) / l, b[1] + (k * dy) / l];
}

/** Smoothly follows `target` (0…1); jumps under prefers-reduced-motion. */
export function useTween(target: number, ms = 450): number {
  const reduced = useReducedMotion();
  const [v, setV] = useState(target);
  const ref = useRef(target);
  useEffect(() => {
    if (reduced || typeof requestAnimationFrame === 'undefined') { ref.current = target; setV(target); return; }
    const from = ref.current, t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / ms), e = k * k * (3 - 2 * k);
      ref.current = from + (target - from) * e;
      setV(ref.current);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, reduced]);
  return v;
}

/** The standard figure frame: drawing + labels on the left, read-out / controls on the right (≥ 1024 px, see styles.css). */
export function Frame({ vb, svgRef, children, labels, caption, className = '', label, svgProps }: {
  vb: readonly [number, number, number, number]; svgRef?: React.Ref<SVGSVGElement>; children: ReactNode; labels?: ReactNode; caption?: ReactNode; className?: string; label: string;
  svgProps?: React.SVGProps<SVGSVGElement>;
}) {
  return (
    <figure className="vdemo">
      <div className={`vdemo-fig wide ${className}`}>
        <svg ref={svgRef} className="kf-svg" viewBox={vb.join(' ')} aria-label={label} {...svgProps}>{children}</svg>
        {labels}
      </div>
      {caption && <figcaption className="vdemo-readout kf-read">{caption}</figcaption>}
    </figure>
  );
}

/** Sentence above a figure: what to look at. */
export function See({ children }: { children: ReactNode }) {
  const tr = useTr();
  return <p className="kf-see"><b>{tr('Was du sehen sollst:', 'What to look for:')}</b>{' '}{children}</p>;
}
