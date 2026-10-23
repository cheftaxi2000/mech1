import { createContext, useContext, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { M } from '../../components/Tex';
import { useLang } from '../../i18n';
import { clipLine, makeFrame, sampleCurve, ticks, tickText, type Frame, type P2, type Range, type SampleOpts } from './plotMath';

/**
 * Shared 2D plot for the Analysis chapters (D-023). One look everywhere: light grid, axes with arrowheads,
 * KaTeX_Main tick numbers, function graphs that break at poles and jumps, open circles for holes.
 *
 * Colour roles (classes; see the "plot" block in styles.css and docs/analysis/NOTATION.md):
 *   f    – the function being studied (blue)          g    – a second / derived / inverse function (magenta)
 *   ref  – the original before a transformation (grey dashed)
 *   tan  – tangent (magenta)   sec – secant (teal, dashed)   asym – asymptote (purple dashed)
 *   pt   – marked point (red)  band – strip / interval highlight (teal fill)   aux – helper line (grey)
 *
 * Children use `usePlot()` for the frame; labels are KaTeX in an HTML overlay (`<PLabel>`).
 */
const Ctx = createContext<Frame | null>(null);
const LayerCtx = createContext<HTMLDivElement | null>(null);
export const usePlot = () => { const f = useContext(Ctx); if (!f) throw new Error('usePlot outside <Plot>'); return f; };

export type Role = 'f' | 'g' | 'ref' | 'tan' | 'sec' | 'asym' | 'pt' | 'aux' | 'band' | 'muted' | 'fg'
  // Linear algebra (docs/linalg/NOTATION.md): first column / e₁ green, second column / e₂ blue, target b red, A x dark, miss orange, product purple
  | 'c1' | 'c2' | 'tgt' | 'ax' | 'miss' | 'c3';

export interface PlotProps {
  x: Range; y: Range;
  /** viewBox size; default 400 × 300. */
  w?: number; h?: number;
  /** grid spacing per axis (0 = no grid lines). */
  grid?: [number, number];
  /** tick label spacing per axis (0 = no labels). */
  tick?: [number, number];
  /** axis names, as TeX; default x, y. */
  axes?: [string, string];
  /** extra class on the wrapper (e.g. "wide"). */
  className?: string;
  /** pointer handlers in math coordinates (for draggable points). */
  onDrag?: (x: number, y: number, phase: 'down' | 'move' | 'up') => void;
  /** accessible description of the picture. */
  label?: string;
  children?: ReactNode;
}

export function Plot({ x, y, w = 400, h = 300, grid = [1, 1], tick = [1, 1], axes = ['x', 'y'], className, onDrag, label, children }: PlotProps) {
  const lang = useLang();
  const frame = makeFrame(x, y, w, h);
  const svg = useRef<SVGSVGElement>(null);
  const [layer, setLayer] = useState<HTMLDivElement | null>(null);
  const down = useRef(false);
  const toMath = (e: React.PointerEvent): [number, number] => {
    const r = svg.current!.getBoundingClientRect();
    return [frame.ix(((e.clientX - r.left) / r.width) * w), frame.iy(((e.clientY - r.top) / r.height) * h)];
  };
  const X0 = frame.sx(Math.min(Math.max(0, x[0]), x[1])), Y0 = frame.sy(Math.min(Math.max(0, y[0]), y[1]));
  const gx = grid[0] ? ticks(x, grid[0], false) : [], gy = grid[1] ? ticks(y, grid[1], false) : [];
  const tx = tick[0] ? ticks(x, tick[0]) : [], ty = tick[1] ? ticks(y, tick[1]) : [];
  const right = frame.sx(x[1]) + 6, top = frame.sy(y[1]) - 6;
  const clipId = useId();
  return (
    <Ctx.Provider value={frame}><LayerCtx.Provider value={layer}>
      <div className={`plot-fig${className ? ` ${className}` : ''}`} style={{ aspectRatio: `${w} / ${h}` }}>
        <svg ref={svg} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}
          className={onDrag ? 'draggable' : undefined}
          onPointerDown={onDrag && ((e) => { down.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); onDrag(...toMath(e), 'down'); })}
          onPointerMove={onDrag && ((e) => { if (down.current) onDrag(...toMath(e), 'move'); })}
          onPointerUp={onDrag && ((e) => { down.current = false; onDrag(...toMath(e), 'up'); })}>
          <g className="pl-grid">
            {gx.map((v) => <line key={`gx${v}`} x1={frame.sx(v)} x2={frame.sx(v)} y1={frame.sy(y[0])} y2={frame.sy(y[1])} />)}
            {gy.map((v) => <line key={`gy${v}`} y1={frame.sy(v)} y2={frame.sy(v)} x1={frame.sx(x[0])} x2={frame.sx(x[1])} />)}
          </g>
          <g className="pl-axis">
            <line x1={frame.sx(x[0])} x2={right} y1={Y0} y2={Y0} />
            <polygon points={`${right + 2},${Y0} ${right - 6},${Y0 - 4} ${right - 6},${Y0 + 4}`} />
            <line y1={frame.sy(y[0])} y2={top} x1={X0} x2={X0} />
            <polygon points={`${X0},${top - 2} ${X0 - 4},${top + 6} ${X0 + 4},${top + 6}`} />
          </g>
          <g className="pl-ticks">
            {tx.map((v) => <g key={`tx${v}`}><line x1={frame.sx(v)} x2={frame.sx(v)} y1={Y0 - 3} y2={Y0 + 3} /><text x={frame.sx(v)} y={Y0 + 15} textAnchor="middle">{tickText(v, lang)}</text></g>)}
            {ty.map((v) => <g key={`ty${v}`}><line y1={frame.sy(v)} y2={frame.sy(v)} x1={X0 - 3} x2={X0 + 3} /><text x={X0 - 6} y={frame.sy(v) + 4} textAnchor="end">{tickText(v, lang)}</text></g>)}
          </g>
          <clipPath id={clipId}><rect x={frame.pad - 5} y={frame.pad - 5} width={w - 2 * frame.pad + 10} height={h - 2 * frame.pad + 10} /></clipPath>
          <g clipPath={`url(#${clipId})`}>{children}</g>
        </svg>
        <div className="plot-label pl-ink-muted" style={pos(frame, right - 2, Y0 - 12)}><M>{axes[0]}</M></div>
        <div className="plot-label pl-ink-muted" style={pos(frame, X0 + 12, top + 4)}><M>{axes[1]}</M></div>
        <div className="plot-layer" ref={setLayer} />
      </div>
    </LayerCtx.Provider></Ctx.Provider>
  );
}

const pos = (f: Frame, px: number, py: number) => ({ left: `${(px / f.w) * 100}%`, top: `${(py / f.h) * 100}%` });

/** Graph of y = f(x). `dom` restricts the domain; `breaks` lists poles/jumps; `role` picks the colour. */
export function Curve({ f, dom, role = 'f', breaks, dashed, width, n }: { f: (x: number) => number; dom?: Range; role?: Role; breaks?: readonly number[]; dashed?: boolean; width?: number; n?: number }) {
  const fr = usePlot();
  const opts: SampleOpts = { breaks, n };
  return (
    <g className={`pl-curve pl-${role}${dashed ? ' dashed' : ''}`} style={width ? { strokeWidth: width } : undefined}>
      {sampleCurve(f, fr, dom, opts).map((br, i) => <polyline key={i} points={br.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ')} />)}
    </g>
  );
}

/** Parametric curve (x(s), y(s)), s in [a, b] — e.g. a circle or the mirror image of a graph. */
export function Path({ pts, role = 'f', dashed, closed, fill }: { pts: readonly P2[]; role?: Role; dashed?: boolean; closed?: boolean; fill?: boolean }) {
  const fr = usePlot();
  const s = pts.map((p) => `${fr.sx(p[0]).toFixed(2)},${fr.sy(p[1]).toFixed(2)}`).join(' ');
  const cls = `pl-curve pl-${role}${dashed ? ' dashed' : ''}${fill ? ' filled' : ''}`;
  return closed || fill ? <polygon className={cls} points={s} /> : <polyline className={cls} points={s} />;
}

/** A point; `open` draws a hole (graph not defined there). */
export function Pt({ x, y, role = 'pt', open, r = 4.5 }: { x: number; y: number; role?: Role; open?: boolean; r?: number }) {
  const fr = usePlot();
  return <circle className={`pl-dot pl-${role}${open ? ' open' : ''}`} cx={fr.sx(x)} cy={fr.sy(y)} r={r} />;
}

/** Segment between two points (math coordinates). */
export function Seg({ a, b, role = 'aux', dashed, width }: { a: P2; b: P2; role?: Role; dashed?: boolean; width?: number }) {
  const fr = usePlot();
  return <line className={`pl-line pl-${role}${dashed ? ' dashed' : ''}`} x1={fr.sx(a[0])} y1={fr.sy(a[1])} x2={fr.sx(b[0])} y2={fr.sy(b[1])} style={width ? { strokeWidth: width } : undefined} />;
}

/** Infinite straight line through p with slope m, clipped to the window (tangents, secants, oblique asymptotes). */
export function Line({ p, m, role = 'tan', dashed, dom }: { p: P2; m: number; role?: Role; dashed?: boolean; dom?: Range }) {
  const fr = usePlot();
  const s = clipLine(fr, p, m, dom);
  return s && <line className={`pl-line pl-${role}${dashed ? ' dashed' : ''}`} x1={s[0][0]} y1={s[0][1]} x2={s[1][0]} y2={s[1][1]} />;
}

/** Vertical line x = c (e.g. a vertical asymptote). */
export function VLine({ x, role = 'asym', dashed = true }: { x: number; role?: Role; dashed?: boolean }) {
  const fr = usePlot();
  return <line className={`pl-line pl-${role}${dashed ? ' dashed' : ''}`} x1={fr.sx(x)} x2={fr.sx(x)} y1={fr.sy(fr.y[0])} y2={fr.sy(fr.y[1])} />;
}

/** Horizontal line y = c. */
export function HLine({ y, role = 'asym', dashed = true }: { y: number; role?: Role; dashed?: boolean }) {
  const fr = usePlot();
  return <line className={`pl-line pl-${role}${dashed ? ' dashed' : ''}`} y1={fr.sy(y)} y2={fr.sy(y)} x1={fr.sx(fr.x[0])} x2={fr.sx(fr.x[1])} />;
}

/** Horizontal strip y0 ≤ y ≤ y1 (bounds, ε-band) or vertical strip with `vertical`. */
export function Band({ from, to, vertical, role = 'band' }: { from: number; to: number; vertical?: boolean; role?: Role }) {
  const fr = usePlot();
  if (vertical) {
    const a = fr.sx(Math.max(from, fr.x[0])), b = fr.sx(Math.min(to, fr.x[1]));
    return <rect className={`pl-band pl-${role}`} x={Math.min(a, b)} width={Math.abs(b - a)} y={fr.sy(fr.y[1])} height={fr.sy(fr.y[0]) - fr.sy(fr.y[1])} />;
  }
  const a = fr.sy(Math.max(from, fr.y[0])), b = fr.sy(Math.min(to, fr.y[1]));
  return <rect className={`pl-band pl-${role}`} y={Math.min(a, b)} height={Math.abs(b - a)} x={fr.sx(fr.x[0])} width={fr.sx(fr.x[1]) - fr.sx(fr.x[0])} />;
}

/** Arrow from a to b (math coordinates), e.g. Δx and Δy of a slope triangle. */
export function PArrow({ a, b, role = 'aux', head = 7 }: { a: P2; b: P2; role?: Role; head?: number }) {
  const fr = usePlot();
  const A: P2 = [fr.sx(a[0]), fr.sy(a[1])], B: P2 = [fr.sx(b[0]), fr.sy(b[1])];
  const dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy);
  if (l < 2) return null;
  const ux = dx / l, uy = dy / l, s = Math.min(head, 0.5 * l);
  const tri = `${B[0]},${B[1]} ${B[0] - s * ux + 0.5 * s * uy},${B[1] - s * uy - 0.5 * s * ux} ${B[0] - s * ux - 0.5 * s * uy},${B[1] - s * uy + 0.5 * s * ux}`;
  return <g className={`pl-arrow pl-${role}`}><line x1={A[0]} y1={A[1]} x2={B[0] - ux * s * 0.8} y2={B[1] - uy * s * 0.8} /><polygon points={tri} /></g>;
}

/**
 * KaTeX label at a math position, offset by (dx, dy) viewBox units. It is written as a child of <Plot> (next to the
 * shapes it names) and rendered through a portal into the HTML overlay, like the Mechanik figures (no foreignObject:
 * iPad Safari mis-places HTML inside SVG). `anchor` says which side of the label touches the point.
 */
export function PLabel({ x, y, tex, role = 'fg', dx = 0, dy = 0, anchor = 'c', small, halo = true }: { x: number; y: number; tex: string; role?: Role; dx?: number; dy?: number; anchor?: 'c' | 'l' | 'r' | 't' | 'b'; small?: boolean; halo?: boolean }) {
  const fr = usePlot(), layer = useContext(LayerCtx);
  if (!layer) return null;
  const px = fr.sx(x) + dx, py = fr.sy(y) + dy;
  return createPortal(
    <div className={`plot-label pl-ink-${role} a-${anchor}${small ? ' small' : ''}${halo ? ' halo' : ''}`} style={pos(fr, px, py)}>
      <M>{tex}</M>
    </div>, layer);
}

/** Straight line a·x + b·y = c clipped to the window (a linear equation in two unknowns, Übung 2). */
export function ELine({ a, b, c, role = 'f', dashed, width }: { a: number; b: number; c: number; role?: Role; dashed?: boolean; width?: number }) {
  const fr = usePlot();
  const pts: P2[] = [];
  const push = (x: number, y: number) => { if (x >= fr.x[0] - 1e-9 && x <= fr.x[1] + 1e-9 && y >= fr.y[0] - 1e-9 && y <= fr.y[1] + 1e-9) pts.push([x, y]); };
  if (Math.abs(b) > 1e-12) for (const x of fr.x) push(x, (c - a * x) / b);
  if (Math.abs(a) > 1e-12) for (const y of fr.y) push((c - b * y) / a, y);
  if (pts.length < 2) return null;
  let [p, q] = [pts[0], pts[1]];
  let best = -1;
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]); if (d > best) { best = d; p = pts[i]; q = pts[j]; } }
  return <line className={`pl-line pl-${role}${dashed ? ' dashed' : ''}`} x1={fr.sx(p[0])} y1={fr.sy(p[1])} x2={fr.sx(q[0])} y2={fr.sy(q[1])} style={width ? { strokeWidth: width } : undefined} />;
}

/** The grid lines x = i, y = j (|i|, |j| ≤ n) after the linear map M = [[m11, m12], [m21, m22]]: what a matrix does to the plane. */
export function GridWarp({ M, n = 6, role = 'aux', opacity = 0.35 }: { M: readonly [readonly [number, number], readonly [number, number]]; n?: number; role?: Role; opacity?: number }) {
  const fr = usePlot();
  const T = (x: number, y: number) => `${fr.sx(M[0][0] * x + M[0][1] * y).toFixed(1)},${fr.sy(M[1][0] * x + M[1][1] * y).toFixed(1)}`;
  const k = [] as number[];
  for (let i = -n; i <= n; i++) k.push(i);
  return (
    <g className={`pl-line pl-${role}`} style={{ opacity, strokeWidth: 1 }} fill="none">
      {k.map((i) => <polyline key={`v${i}`} points={`${T(i, -n)} ${T(i, n)}`} />)}
      {k.map((j) => <polyline key={`h${j}`} points={`${T(-n, j)} ${T(n, j)}`} />)}
    </g>
  );
}
