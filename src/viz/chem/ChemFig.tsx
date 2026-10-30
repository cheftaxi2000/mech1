import type { PointerEventHandler, ReactNode, Ref } from 'react';
import { M } from '../../components/Tex';
import type { CScene } from './cscene';
import './thermo.css';

const pts = (ps: readonly (readonly [number, number])[]) => ps.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

/** Renders a CScene: SVG shapes plus KaTeX labels (percent-positioned HTML, like AnimFigure). */
export function SceneFig({ scene, label, className, children, svgRef, onPointerDown, onPointerMove, onPointerUp, draggable }: {
  scene: CScene; label: string; className?: string; children?: ReactNode; svgRef?: Ref<SVGSVGElement>; draggable?: boolean;
  onPointerDown?: PointerEventHandler<SVGSVGElement>; onPointerMove?: PointerEventHandler<SVGSVGElement>; onPointerUp?: PointerEventHandler<SVGSVGElement>;
}) {
  const { w, h } = scene;
  const data = Object.fromEntries(Object.entries(scene.data).map(([k, v]) => [`data-${k.toLowerCase()}`, Number.isFinite(v) ? v.toFixed(4) : String(v)]));
  return (
    <div className={`anim-fig th-draw${className ? ` ${className}` : ''}`} style={{ ['--th-fs' as string]: `${((3.9 * 400) / w).toFixed(2)}cqw` }} {...data}>
      <svg ref={svgRef} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={label}
        className={draggable ? 'th-drag' : undefined} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        {scene.shapes.map((s) => {
          const o = s.o ?? 1;
          switch (s.kind) {
            case 'line': return <line key={s.key} className={s.cls} x1={s.pts[0][0]} y1={s.pts[0][1]} x2={s.pts[1][0]} y2={s.pts[1][1]} opacity={o} />;
            case 'polyline': return <polyline key={s.key} className={s.cls} points={pts(s.pts)} opacity={o} />;
            case 'polygon': return <polygon key={s.key} className={s.cls} points={pts(s.pts)} opacity={o} />;
            case 'circle': return <circle key={s.key} className={s.cls} cx={s.pts[0][0]} cy={s.pts[0][1]} r={s.r ?? 4} opacity={o} />;
            case 'rect': return <rect key={s.key} className={s.cls} x={s.pts[0][0]} y={s.pts[0][1]} width={Math.max(0, s.pts[1][0])} height={Math.max(0, s.pts[1][1])} rx={s.rx ?? 0} opacity={o} />;
          }
        })}
        {children}
      </svg>
      {scene.labels.map((l) => (
        <div key={l.key} className={`anim-label th-label ink-c-${l.ink}${l.box ? ' abox' : ''}${l.small ? ' small' : ''}`} data-anchor={l.anchor} data-key={l.key}
          style={{ left: `${(l.at[0] / w) * 100}%`, top: `${(l.at[1] / h) * 100}%`, opacity: l.o }}>
          <M>{l.tex}</M>
        </div>
      ))}
    </div>
  );
}

/** Range slider in the look of the other figures: label (TeX) · slider · read-out. */
export function ThSlider({ label, min, max, step, value, onChange, show, aria, ink }: {
  label: ReactNode; min: number; max: number; step: number; value: number; onChange: (v: number) => void; show: ReactNode; aria: string; ink?: string;
}) {
  return (
    <label className={`slider wide-slider th-slider${ink ? ` ink-c-${ink}` : ''}`}>
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={aria} />
      <span className="val">{show}</span>
    </label>
  );
}

/** Row of toggle buttons (exactly one is pressed). */
export function ThChips<K extends string>({ items, value, onPick, label }: { items: readonly { id: K; label: ReactNode }[]; value: K | null; onPick: (id: K) => void; label: string }) {
  return (
    <div className="v-presets th-chips" role="group" aria-label={label}>
      {items.map((it) => <button key={it.id} type="button" aria-pressed={value === it.id} onClick={() => onPick(it.id)}>{it.label}</button>)}
    </div>
  );
}
