import { createContext, useContext, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { M } from '../../components/Tex';
import './labelfig.css';

/**
 * A plain SVG canvas (viewBox units, y down) with KaTeX labels in an HTML overlay, like the shared `Plot`
 * but without axes: for bar ledgers, level diagrams, orbital boxes, periodic tables. Labels are written as
 * children (`<FLabel x y tex />`) next to the shapes they name and portalled into the overlay (no foreignObject).
 */
interface Ctx { w: number; h: number; layer: HTMLDivElement | null }
const FigCtx = createContext<Ctx | null>(null);

export type Ink = 'p' | 'v' | 't' | 'n' | 'e' | 's' | 'g' | 'cat' | 'an' | 'el' | 'fg' | 'muted';

export function LabelFig({ w, h, label, className, children }: { w: number; h: number; label: string; className?: string; children: ReactNode }) {
  const [layer, setLayer] = useState<HTMLDivElement | null>(null);
  return (
    <FigCtx.Provider value={{ w, h, layer }}>
      <div className={`plot-fig lf${className ? ` ${className}` : ''}`} style={{ aspectRatio: `${w} / ${h}` }}>
        <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>{children}</svg>
        <div className="plot-layer" ref={setLayer} />
      </div>
    </FigCtx.Provider>
  );
}

/** KaTeX label at viewBox position (x, y); `anchor` says which side of the label touches the point. */
export function FLabel({ x, y, tex, ink = 'fg', anchor = 'c', small, halo = true, opacity }: { x: number; y: number; tex: string; ink?: Ink; anchor?: 'c' | 'l' | 'r' | 't' | 'b'; small?: boolean; halo?: boolean; opacity?: number }) {
  const c = useContext(FigCtx);
  if (!c?.layer || !tex) return null;
  return createPortal(
    <div className={`plot-label lf-ink-${ink} a-${anchor}${small ? ' small' : ''}${halo ? ' halo' : ''}`}
      style={{ left: `${(x / c.w) * 100}%`, top: `${(y / c.h) * 100}%`, ...(opacity !== undefined ? { opacity } : {}) }}>
      <M>{tex}</M>
    </div>, c.layer);
}

/** Arrow in viewBox units; `ink` picks the colour from the chemistry roles. */
export function FArrow({ x1, y1, x2, y2, ink = 'fg', width = 2.4, opacity = 1, dashed }: { x1: number; y1: number; x2: number; y2: number; ink?: Ink; width?: number; opacity?: number; dashed?: boolean }) {
  const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy);
  if (l < 3) return null;
  const ux = dx / l, uy = dy / l, s = Math.min(9, 0.45 * l);
  const tip = `${x2},${y2} ${x2 - s * ux + 0.5 * s * uy},${y2 - s * uy - 0.5 * s * ux} ${x2 - s * ux - 0.5 * s * uy},${y2 - s * uy + 0.5 * s * ux}`;
  return (
    <g className={`lf-stroke lf-${ink}`} style={{ opacity }}>
      <line x1={x1} y1={y1} x2={x2 - ux * s * 0.8} y2={y2 - uy * s * 0.8} strokeWidth={width} strokeDasharray={dashed ? '6 5' : undefined} strokeLinecap="round" />
      <polygon points={tip} stroke="none" />
    </g>
  );
}
