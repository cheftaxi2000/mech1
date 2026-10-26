import { useMemo, type PointerEventHandler, type Ref } from 'react';
import { M } from '../../components/Tex';
import type { Scene, SceneLabel, Shape } from '../anim/scene';
import { labelBox } from '../anim/scene';
import type { P2 } from '../anim/geometry';
import type { Ink, Anchor } from '../anim/scene';

/**
 * A scene builder with its own figure size (the shared sceneBuilder is fixed to 400 × 300) and a renderer for it:
 * SVG shapes plus KaTeX labels positioned in % of the figure, like AnimFigure, but with pointer handlers for dragging.
 * Used by the interactive figures of lesson K7.
 */
export function makeScene(W: number, H: number) {
  const shapes: Shape[] = [];
  const labels: SceneLabel[] = [];
  const PAD = 3;
  const clamp = (l: SceneLabel): SceneLabel => {
    const b = labelBox(l);
    const dx = b.x0 < PAD ? PAD - b.x0 : b.x1 > W - PAD ? W - PAD - b.x1 : 0;
    const dy = b.y0 < PAD ? PAD - b.y0 : b.y1 > H - PAD ? H - PAD - b.y1 : 0;
    return dx || dy ? { ...l, at: [l.at[0] + dx, l.at[1] + dy] as P2 } : l;
  };
  return {
    W, H, shapes, labels,
    shape: (s: Shape) => { shapes.push(s); },
    label: (key: string, at: P2, tex: string, ink: Ink, o = 1, anchor: Anchor = 'c', extra: Partial<SceneLabel> = {}) => { labels.push({ key, at, tex, ink, anchor, o, ...extra }); },
    finish: (data: Record<string, number> = {}): Scene => ({ shapes, labels: labels.filter((l) => l.o > 0.02).map(clamp), data }),
  };
}

const pts = (ps: readonly P2[]) => ps.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

/** Draws a scene; `onPointerDown/Move/Up` make it draggable. `extra` (SVG) is drawn on top of the shapes, e.g. drag handles. */
export function SceneView({ scene, W, H, svgRef, label, handlers, extra, className = '' }: {
  scene: Scene; W: number; H: number; svgRef?: Ref<SVGSVGElement>; label: string;
  handlers?: { onPointerDown?: PointerEventHandler; onPointerMove?: PointerEventHandler; onPointerUp?: PointerEventHandler };
  extra?: React.ReactNode; className?: string;
}) {
  const shapes = useMemo(() => scene.shapes.filter((s) => (s.o ?? 1) > 0.01), [scene]);
  return (
    <div className={`vdemo-fig k7-fig ${className}`}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} {...handlers} onPointerCancel={handlers?.onPointerUp}>
        {shapes.map((s) => {
          const o = s.o ?? 1;
          switch (s.kind) {
            case 'line': return <line key={s.key} className={s.cls} x1={s.pts[0][0]} y1={s.pts[0][1]} x2={s.pts[1][0]} y2={s.pts[1][1]} opacity={o} />;
            case 'polyline': return <polyline key={s.key} className={s.cls} points={pts(s.pts)} opacity={o} />;
            case 'polygon': return <polygon key={s.key} className={s.cls} points={pts(s.pts)} opacity={o} />;
            case 'circle': return <circle key={s.key} className={s.cls} cx={s.pts[0][0]} cy={s.pts[0][1]} r={s.r ?? 4} opacity={o} />;
          }
        })}
        {extra}
      </svg>
      {scene.labels.map((l) => (
        <div key={l.key} className={`anim-label ink-${l.ink}${l.box ? ' abox' : ''}`} data-anchor={l.anchor} data-key={l.key}
          style={{ left: `${(l.at[0] / W) * 100}%`, top: `${(l.at[1] / H) * 100}%`, opacity: l.o }}>
          {l.rows ? l.rows.map((r, k) => <div key={k} className={`row ink-${r.ink}`}><M>{r.tex}</M></div>) : <M>{l.tex}</M>}
        </div>
      ))}
    </div>
  );
}

/** Client position → figure coordinates. */
export function svgPoint(svg: SVGSVGElement, W: number, H: number, e: { clientX: number; clientY: number }): P2 {
  const r = svg.getBoundingClientRect();
  return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H];
}
