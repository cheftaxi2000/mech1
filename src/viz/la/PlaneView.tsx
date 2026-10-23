import { useRef, type CSSProperties } from 'react';
import { GridWarp, PLabel, Plot, usePlot } from '../plot/Plot';
import { clipLine } from '../plot/plotMath';
import type { V2 } from '../../linalg/plane2';
import { snapV, toMath, type Handle, type PItem, type View } from './planeItems';
import './la.css';

/**
 * The shared 2-D plane of the Lineare-Algebra figures: the TA's pictures re-drawn with the shared `Plot`
 * (light grid, KaTeX labels, role colours c1 / c2 / tgt / ax / miss). A scene is a list of `PItem`s; draggable tips
 * are `handles` (pointer capture on the tip itself, so the rest of the plot never blocks page scrolling on touch).
 * Taps on the empty plane call `onTap` (used to drop extra input vectors).
 */
export type HandlePhase = 'down' | 'move' | 'up' | 'key';

export function PlaneView({ view, items, handles = [], onHandle, onTap, label, className, snap = 0.5 }: {
  view: View;
  items: readonly PItem[];
  handles?: readonly Handle[];
  /** a handle was dragged (position already snapped and inside the window) */
  onHandle?: (id: string, at: V2, phase: HandlePhase) => void;
  onTap?: (at: V2) => void;
  label: string;
  className?: string;
  snap?: number;
}) {
  return (
    <div className={`la-plane${className ? ` ${className}` : ''}`}>
      <Plot x={view.x} y={view.y} w={view.w} h={view.h} grid={[view.grid, view.grid]} tick={[view.tick, view.tick]} className="la-plot" label={label}>
        <Layers view={view} items={items} handles={handles} onHandle={onHandle} onTap={onTap} snap={snap} />
      </Plot>
    </div>
  );
}

function Layers({ view, items, handles, onHandle, onTap, snap }: {
  view: View; items: readonly PItem[]; handles: readonly Handle[]; onHandle?: (id: string, at: V2, phase: HandlePhase) => void; onTap?: (at: V2) => void; snap: number;
}) {
  const fr = usePlot();
  const drag = useRef<string | null>(null);
  const tapStart = useRef<[number, number] | null>(null);
  const svgPoint = (e: React.PointerEvent): [number, number] => {
    const svg = (e.currentTarget as SVGElement).ownerSVGElement ?? (e.currentTarget as SVGSVGElement);
    const r = svg.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * view.w, ((e.clientY - r.top) / r.height) * view.h];
  };
  const place = (p: V2): V2 => {
    const q = snapV(p, snap), m = 0.3;
    return [Math.min(view.x[1] - m, Math.max(view.x[0] + m, q[0])), Math.min(view.y[1] - m, Math.max(view.y[0] + m, q[1]))];
  };
  return (
    <>
      {onTap && (
        <rect className="la-tap" x={0} y={0} width={view.w} height={view.h}
          onPointerDown={(e) => { tapStart.current = [e.clientX, e.clientY]; }}
          onPointerUp={(e) => {
            const s = tapStart.current; tapStart.current = null;
            if (!s || Math.hypot(e.clientX - s[0], e.clientY - s[1]) > 8) return;
            const [px, py] = svgPoint(e);
            onTap(snapV(toMath(view, px, py), snap));
          }} />
      )}
      {items.map((it) => <Item key={it.id} it={it} />)}
      {handles.map((h) => {
        const c: V2 = [fr.sx(h.at[0]), fr.sy(h.at[1])];
        return (
          <g key={h.id} className={`la-handle pl-${h.role}`} tabIndex={0} role="slider" aria-label={h.label ?? h.id}
            aria-valuetext={`(${h.at[0]}, ${h.at[1]})`}
            onKeyDown={(e) => {
              const d: Record<string, V2> = { ArrowLeft: [-snap, 0], ArrowRight: [snap, 0], ArrowUp: [0, snap], ArrowDown: [0, -snap] };
              const v = d[e.key];
              if (!v) return;
              e.preventDefault();
              onHandle?.(h.id, place([h.at[0] + v[0], h.at[1] + v[1]]), 'key');
            }}>
            <circle className="la-handle-vis" cx={c[0]} cy={c[1]} r={9} />
            <circle className="la-handle-hit" cx={c[0]} cy={c[1]} r={24}
              onPointerDown={(e) => { e.preventDefault(); (e.target as Element).setPointerCapture(e.pointerId); drag.current = h.id; onHandle?.(h.id, h.at, 'down'); }}
              onPointerMove={(e) => { if (drag.current !== h.id) return; const [px, py] = svgPoint(e); onHandle?.(h.id, place(toMath(view, px, py)), 'move'); }}
              onPointerUp={(e) => { if (drag.current !== h.id) return; drag.current = null; const [px, py] = svgPoint(e); onHandle?.(h.id, place(toMath(view, px, py)), 'up'); }}
              onPointerCancel={() => { drag.current = null; onHandle?.(h.id, h.at, 'up'); }} />
          </g>
        );
      })}
    </>
  );
}

function Item({ it }: { it: PItem }) {
  const fr = usePlot();
  const sx = (p: V2) => fr.sx(p[0]), sy = (p: V2) => fr.sy(p[1]);
  const op: CSSProperties = it.k === 'label' || it.k === 'warp' || it.o === undefined ? {} : { opacity: it.o };
  switch (it.k) {
    case 'arrow': {
      const A: V2 = [sx(it.a), sy(it.a)], B: V2 = [sx(it.b), sy(it.b)];
      const dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy);
      if (l < 3) return null;
      const w = it.w ?? 3, ux = dx / l, uy = dy / l, hl = Math.min(w * 2.4 + 7, l * 0.55), hw = hl * 0.6;
      const bx = B[0] - ux * hl, by = B[1] - uy * hl;
      const tri = `${B[0]},${B[1]} ${bx - uy * hw},${by + ux * hw} ${bx + uy * hw},${by - ux * hw}`;
      return (
        <g className={`pl-arrow pl-${it.role}`} style={op}>
          <line x1={A[0]} y1={A[1]} x2={B[0] - ux * hl * 0.8} y2={B[1] - uy * hl * 0.8} style={{ strokeWidth: w, strokeLinecap: it.dashed ? 'butt' : 'round', strokeDasharray: it.dashed ? '9 6' : undefined }} />
          <polygon points={tri} style={{ strokeWidth: 1, strokeLinejoin: 'round' }} />
        </g>
      );
    }
    case 'seg':
      return <line className={`pl-line pl-${it.role}${it.dashed ? ' dashed' : ''}`} x1={sx(it.a)} y1={sy(it.a)} x2={sx(it.b)} y2={sy(it.b)} style={{ ...op, ...(it.w ? { strokeWidth: it.w } : {}) }} />;
    case 'line': {
      const m = Math.abs(it.dir[0]) < 1e-12 ? Infinity : it.dir[1] / it.dir[0];
      if (!Number.isFinite(m)) return <line className={`pl-line pl-${it.role}${it.dashed ? ' dashed' : ''}`} x1={sx(it.p)} x2={sx(it.p)} y1={fr.sy(fr.y[0])} y2={fr.sy(fr.y[1])} style={{ ...op, ...(it.w ? { strokeWidth: it.w } : {}) }} />;
      const s = clipLine(fr, it.p, m);
      return s && <line className={`pl-line pl-${it.role}${it.dashed ? ' dashed' : ''}`} x1={s[0][0]} y1={s[0][1]} x2={s[1][0]} y2={s[1][1]} style={{ ...op, ...(it.w ? { strokeWidth: it.w } : {}) }} />;
    }
    case 'dot':
      return <circle className={`pl-dot pl-${it.role}${it.open ? ' open' : ''}`} cx={sx(it.at)} cy={sy(it.at)} r={it.r ?? 5} style={op} />;
    case 'ring': {
      const cx = sx(it.at), cy = sy(it.at), r = it.r ?? 16;
      return (
        <g className={`la-ring pl-${it.role}`} style={op}>
          <circle cx={cx} cy={cy} r={r} />
          <line x1={cx + r + 3} x2={cx + r + 9} y1={cy} y2={cy} /><line x1={cx - r - 3} x2={cx - r - 9} y1={cy} y2={cy} />
          <line x1={cx} x2={cx} y1={cy + r + 3} y2={cy + r + 9} /><line x1={cx} x2={cx} y1={cy - r - 3} y2={cy - r - 9} />
        </g>
      );
    }
    case 'poly': {
      const pts = it.pts.map((p) => `${sx(p).toFixed(2)},${sy(p).toFixed(2)}`).join(' ');
      const cls = `pl-curve pl-${it.role}${it.dashed ? ' dashed' : ''}${it.fill ? ' filled' : ''}`;
      return it.closed || it.fill ? <polygon className={cls} points={pts} style={op} /> : <polyline className={cls} points={pts} style={op} />;
    }
    case 'warp':
      return <GridWarp M={it.M} role={it.role} opacity={it.o ?? 0.4} n={it.n ?? 14} />;
    case 'label':
      return <PLabel x={it.at[0]} y={it.at[1]} tex={it.tex} role={it.role} dx={it.dx} dy={it.dy} anchor={it.anchor ?? 'c'} small={it.small} />;
  }
}
