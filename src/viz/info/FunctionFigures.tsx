import { useState } from 'react';
import { useTr } from '../../i18n';
import type { FrameView } from '../../info/cpp/interp';
import { intersect, rectanglesOverlap, xInterval, yInterval, type Rect } from '../../info/overlap';
import { M } from '../../components/Tex';
import { NumSlider } from './InfoControls';

/** The call stack as in the notes (Subsection 6.4): one box per active function, its variables as cells; the running function on top. */
export function StackView({ frames }: { frames: FrameView[] }) {
  const tr = useTr();
  return (
    <div className="stk" aria-label={tr('Aufrufstapel', 'Call stack')}>
      {frames.map((f, k) => (
        <div key={k} className={`stk-frame${k === 0 ? ' top' : ''}`}>
          <div className="stk-fn"><code>{f.fn}</code>{k === 0 && frames.length > 1 && <span className="tr-badge"> {tr('läuft', 'running')}</span>}</div>
          <div className="stk-cells">
            {f.vars.length === 0 && <span className="tr-empty">{tr('noch keine Variablen', 'no variables yet')}</span>}
            {f.vars.map((v) => (
              <div key={v.id + v.name} className={`stk-cell${v.changed ? ' chg' : ''}${v.shadowed ? ' shadow' : ''}`} title={v.type}>
                <span className="stk-name"><code>{v.name}</code></span>
                <span className={`stk-val${v.uninit ? ' uninit' : ''}`}><code>{v.value}</code></span>
                <span className="stk-type"><code>{v.type}</code></span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** The parts of a function definition, labelled (notes Subsection 6.1). */
export function SignatureFigure() {
  const tr = useTr();
  const parts: { t: string; label?: [string, string]; tone?: number }[] = [
    { t: 'double', label: ['Typ des Rückgabewerts', 'return type'], tone: 1 },
    { t: ' pow', label: ['Name', 'name'], tone: 2 },
    { t: '(' },
    { t: 'double', label: ['Typ des Parameters', 'parameter type'], tone: 1 },
    { t: ' b', label: ['Name des Parameters', 'parameter name'], tone: 3 },
    { t: ', ' },
    { t: 'int', label: ['Typ', 'type'], tone: 1 },
    { t: ' e', label: ['Name', 'name'], tone: 3 },
    { t: ')' },
    { t: ' { … }', label: ['Rumpf: ein Block', 'body: a block'], tone: 4 },
  ];
  return (
    <figure className="vdemo sig-fig" aria-label={tr('Aufbau einer Funktionsdefinition', 'Parts of a function definition')}>
      <div className="sig-row">
        {parts.map((p, i) => (
          <span key={i} className={`sig-part${p.label ? ` sig-t${p.tone}` : ''}`}>
            <code>{p.t}</code>
            {p.label && <span className="sig-lab">{tr(...p.label)}</span>}
          </span>
        ))}
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------ rectangles (notes Subsection 6.7) */

const SC = 18, OFF = 4, SPAN = 16; // plane shows -4 … 12

const px = (v: number) => (v + OFF) * SC + 34;
const py = (v: number) => (SPAN - (v + OFF)) * SC + 6;

/** Two rectangles given by corner, width, height (negative allowed). Overlap iff the x intervals and the y intervals overlap. */
export function RectOverlap() {
  const tr = useTr();
  const [r, setR] = useState<Rect>({ x: 1, y: 1, w: 4, h: 3 });
  const [s, setS] = useState<Rect>({ x: 6, y: 2, w: -3, h: 4 });
  const xr = xInterval(r), xs = xInterval(s), yr = yInterval(r), ys = yInterval(s);
  const xo = intersect(xr, xs), yo = intersect(yr, ys);
  const both = rectanglesOverlap(r, s);
  const rect = (q: Rect, cls: string) => (
    <rect x={px(Math.min(q.x, q.x + q.w))} y={py(Math.max(q.y, q.y + q.h))} width={Math.abs(q.w) * SC} height={Math.abs(q.h) * SC} className={cls} />
  );
  const bar = (iv: { lo: number; hi: number }, cls: string, axis: 'x' | 'y', pos: number) => axis === 'x'
    ? <rect x={px(iv.lo)} y={pos} width={Math.max(iv.hi - iv.lo, 0) * SC} height="6" className={cls} />
    : <rect x={pos} y={py(iv.hi)} width="6" height={Math.max(iv.hi - iv.lo, 0) * SC} className={cls} />;
  const sliders = (q: Rect, set: (r: Rect) => void, name: string) => (
    <div className="ro-sl" role="group" aria-label={name}>
      <NumSlider label={<code>x</code>} min={0} max={8} value={q.x} onChange={(v) => set({ ...q, x: v })} aria={`${name} x`} />
      <NumSlider label={<code>y</code>} min={0} max={8} value={q.y} onChange={(v) => set({ ...q, y: v })} aria={`${name} y`} />
      <NumSlider label={<code>w</code>} min={-4} max={4} value={q.w} onChange={(v) => set({ ...q, w: v })} aria={`${name} w`} />
      <NumSlider label={<code>h</code>} min={-4} max={4} value={q.h} onChange={(v) => set({ ...q, h: v })} aria={`${name} h`} />
    </div>
  );
  const yes = tr('ja', 'yes'), no = tr('nein', 'no');
  return (
    <figure className="vdemo ro-fig">
      <div className="ro-main">
        <svg viewBox={`0 0 ${34 + SPAN * SC + 14} ${SPAN * SC + 34}`} role="img" aria-label={tr('Zwei Rechtecke und ihre Intervalle', 'Two rectangles and their intervals')} className="ro-svg">
          {Array.from({ length: SPAN + 1 }, (_, i) => i - OFF).map((v) => (
            <g key={v}>
              <line x1={px(v)} x2={px(v)} y1={py(-OFF)} y2={py(SPAN - OFF)} className="ro-grid" />
              <line x1={px(-OFF)} x2={px(SPAN - OFF)} y1={py(v)} y2={py(v)} className="ro-grid" />
            </g>
          ))}
          <line x1={px(0)} x2={px(0)} y1={py(-OFF)} y2={py(SPAN - OFF)} className="ro-axis" />
          <line x1={px(-OFF)} x2={px(SPAN - OFF)} y1={py(0)} y2={py(0)} className="ro-axis" />
          {rect(r, 'ro-r1')}{rect(s, 'ro-r2')}
          <circle cx={px(r.x)} cy={py(r.y)} r="4.5" className="ro-pt" />
          <circle cx={px(s.x)} cy={py(s.y)} r="4.5" className="ro-pt" />
          <text x={px(r.x) + 7} y={py(r.y) + 14} className="ro-lab">1</text>
          <text x={px(s.x) + 7} y={py(s.y) + 14} className="ro-lab">2</text>
          {bar(xr, 'ro-x1', 'x', py(-OFF) + 6)}{bar(xs, 'ro-x2', 'x', py(-OFF) + 14)}
          {xo && bar(xo, 'ro-xo', 'x', py(-OFF) + 22)}
          {bar(yr, 'ro-y1', 'y', 14)}{bar(ys, 'ro-y2', 'y', 22)}
          {yo && bar(yo, 'ro-yo', 'y', 6)}
        </svg>
        <div className="ro-side">
          <div className="ro-grp"><b>{tr('Rechteck 1', 'Rectangle 1')}</b>{sliders(r, setR, tr('Rechteck 1', 'Rectangle 1'))}</div>
          <div className="ro-grp"><b>{tr('Rechteck 2', 'Rectangle 2')}</b>{sliders(s, setS, tr('Rechteck 2', 'Rectangle 2'))}</div>
        </div>
      </div>
      <div className="bx-say ro-say" aria-live="polite">
        <div><span className="ro-sw ro-x1" /> <M>x</M>{tr('-Intervalle überlappen:', ' intervals overlap:')} <b className={xo ? 'tr-t' : 'tr-f'}>{xo ? yes : no}</b></div>
        <div><span className="ro-sw ro-y1" /> <M>y</M>{tr('-Intervalle überlappen:', ' intervals overlap:')} <b className={yo ? 'tr-t' : 'tr-f'}>{yo ? yes : no}</b></div>
        <div>{tr('Die Rechtecke überlappen:', 'The rectangles overlap:')} <b className={both ? 'tr-t' : 'tr-f'}>{both ? yes : no}</b> {tr('(genau dann, wenn beide Zeilen darüber «ja» sind)', '(exactly if both lines above say “yes”)')}</div>
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------ separate compilation (notes Subsection 6.9) */

/** mymath.cpp and callpow3.cpp are compiled separately into object files; the linker glues them together. */
export function BuildFigure() {
  const tr = useTr();
  const box = (x: number, y: number, w: number, h: number, cls: string, lines: string[]) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" className={cls} />
      {lines.map((l, i) => <text key={i} x={x + w / 2} y={y + 22 + i * 17} textAnchor="middle" className={i === 0 ? 'bf-t bf-b' : 'bf-t'}>{l}</text>)}
    </g>
  );
  const arrow = (x1: number, y1: number, x2: number, y2: number, mid?: string) => (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} className="bf-ar" markerEnd="url(#bf-head)" />
      {mid && <text x={(x1 + x2) / 2} y={y1 - 6} textAnchor="middle" className="bf-lab">{mid}</text>}
    </g>
  );
  return (
    <figure className="vdemo bf-fig">
      <svg viewBox="0 0 640 250" role="img" aria-label={tr('Übersetzen und Binden', 'Compiling and linking')} className="bf-svg">
        <defs><marker id="bf-head" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="currentColor" /></marker></defs>
        {box(10, 20, 130, 54, 'bf-src', ['mymath.cpp', tr('Funktion pow', 'function pow')])}
        {box(10, 150, 130, 54, 'bf-src', ['callpow3.cpp', tr('main, Aufruf pow', 'main, call of pow')])}
        {arrow(142, 47, 238, 47, 'g++ -c')}
        {arrow(142, 177, 238, 177, 'g++ -c')}
        {box(240, 20, 140, 54, 'bf-obj', ['mymath.o', tr('Maschinencode pow', 'machine code pow')])}
        {box(240, 150, 140, 54, 'bf-obj', ['callpow3.o', tr('main, «call pow ?»', 'main, “call pow ?”')])}
        <polyline points="382,47 410,47 410,112 438,112" className="bf-ar" fill="none" />
        <polyline points="382,177 410,177 410,112" className="bf-ar" fill="none" />
        <line x1="410" y1="112" x2="438" y2="112" className="bf-ar" markerEnd="url(#bf-head)" />
        <text x="412" y="104" className="bf-lab">{tr('Linker', 'linker')}</text>
        {box(440, 80, 190, 66, 'bf-exe', ['callpow3', tr('ausführbar: main + pow,', 'executable: main + pow,'), tr('«call pow» zeigt auf pow', '“call pow” points to pow')])}
      </svg>
    </figure>
  );
}
