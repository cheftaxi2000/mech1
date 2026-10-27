import { useState, type ReactNode } from 'react';
import { Code, tokenize } from '../../components/Code';
import { useTr } from '../../i18n';
import type { Prog } from '../../info/cpp/programs';

/** A program the compiler must reject: the code and the message g++ prints (recorded phrase, checked against g++ in the tests). */
export function CompileFail({ prog, label }: { prog: Prog; label?: string }) {
  const tr = useTr();
  return (
    <figure className="vdemo lst-fig">
      <Code code={prog.code} label={label} />
      <div className="tr-out cf-out">
        <div className="tr-out-h">{tr('Der Compiler lehnt das ab', 'The compiler rejects this')}</div>
        <pre><code><span className="tr-warn">error:</span> {prog.compileError}</code></pre>
      </div>
    </figure>
  );
}

export interface ScopeBar { name: string; from: number; to: number; tone: 1 | 2 | 3; /** lines inside [from, to] in which the name is shadowed */ skip?: [number, number] }

/** Code with one coloured bar per variable: the bar spans the lines in which that variable can be seen. */
export function ScopeFigure({ code, bars, label, caption }: { code: string; bars: ScopeBar[]; label?: string; caption?: ReactNode }) {
  const lines = code.replace(/\n$/, '').split('\n');
  return (
    <figure className="vdemo sc-fig" aria-label={label}>
      <div className="sc-legend">
        {bars.map((b) => <span key={b.name + b.from} className="sc-key"><i className={`sc-sw sc-t${b.tone}`} /><code>{b.name}</code></span>)}
      </div>
      <pre className="code sc-code" tabIndex={0}>
        <code>
          {lines.map((ln, i) => (
            <span key={i} className="cl sc-row">
              <span className="cn" aria-hidden="true">{i + 1}</span>
              <span className="sc-bars" aria-hidden="true">
                {bars.map((b, k) => {
                  const n = i + 1, on = n >= b.from && n <= b.to && !(b.skip && n >= b.skip[0] && n <= b.skip[1]);
                  const edge = (m: number) => on && (m === n) ;
                  return <i key={k} className={`sc-b ${on ? `sc-t${b.tone} on` : ''}${edge(b.from) || (b.skip && n === b.skip[1] + 1 && on) ? ' top' : ''}${edge(b.to) || (b.skip && n === b.skip[0] - 1 && on) ? ' bot' : ''}`} />;
                })}
              </span>
              <span className="ct">{tokenize(ln).map((t, k) => <span key={k} className={`tk-${t.kind}`}>{t.text}</span>)}{ln === '' && ' '}</span>
            </span>
          ))}
        </code>
      </pre>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/* ------------------------------------------------------------------ flow diagrams (notes Figures 5.4 – 5.8) */

type Pt = [number, number];
interface FNode { id: string; kind: 'stmt' | 'cond' | 'dot'; x: number; y: number; text?: [string, string] }
interface FEdge { pts: Pt[]; /** no arrowhead (the edge flows into a merge dot) */ plain?: boolean; label?: { x: number; y: number; text: string; anchor?: 'start' | 'middle' | 'end' }; jump?: boolean }
interface Flow { w: number; h: number; nodes: FNode[]; edges: FEdge[]; code: string }

const COND: [string, string] = ['Bedingung', 'condition'];
const STMT: [string, string] = ['Anweisung', 'statement'];

const FLOWS: Record<'if' | 'ifelse' | 'for' | 'break' | 'continue', Flow> = {
  if: {
    w: 330, h: 230,
    code: 'if (condition)\n    statement',
    nodes: [
      { id: 'c', kind: 'cond', x: 120, y: 50, text: COND },
      { id: 's', kind: 'stmt', x: 120, y: 135, text: STMT },
      { id: 'm', kind: 'dot', x: 120, y: 190 },
    ],
    edges: [
      { pts: [[120, 4], [120, 24]] },
      { pts: [[120, 76], [120, 120]], label: { x: 128, y: 98, text: 'true', anchor: 'start' } },
      { pts: [[120, 150], [120, 190]], plain: true },
      { pts: [[188, 50], [270, 50], [270, 190], [120, 190]], plain: true, label: { x: 196, y: 42, text: 'false', anchor: 'start' } },
      { pts: [[120, 190], [120, 226]] },
    ],
  },
  ifelse: {
    w: 330, h: 250,
    code: 'if (condition)\n    statement1\nelse\n    statement2',
    nodes: [
      { id: 'c', kind: 'cond', x: 165, y: 50, text: COND },
      { id: 's1', kind: 'stmt', x: 70, y: 135, text: ['Anweisung 1', 'statement 1'] },
      { id: 's2', kind: 'stmt', x: 260, y: 135, text: ['Anweisung 2', 'statement 2'] },
      { id: 'm', kind: 'dot', x: 165, y: 200 },
    ],
    edges: [
      { pts: [[165, 4], [165, 24]] },
      { pts: [[97, 50], [70, 50], [70, 120]], label: { x: 62, y: 42, text: 'true', anchor: 'end' } },
      { pts: [[233, 50], [260, 50], [260, 120]], label: { x: 268, y: 42, text: 'false', anchor: 'start' } },
      { pts: [[70, 150], [70, 200], [165, 200]], plain: true },
      { pts: [[260, 150], [260, 200], [165, 200]], plain: true },
      { pts: [[165, 200], [165, 246]] },
    ],
  },
  for: {
    w: 360, h: 330,
    code: 'for (init; condition; expression)\n    statement',
    nodes: [
      { id: 'i', kind: 'stmt', x: 170, y: 28, text: ['Init-Anweisung', 'init statement'] },
      { id: 'c', kind: 'cond', x: 170, y: 100, text: COND },
      { id: 's', kind: 'stmt', x: 170, y: 190, text: STMT },
      { id: 'e', kind: 'stmt', x: 170, y: 255, text: ['Ausdruck', 'expression'] },
    ],
    edges: [
      { pts: [[170, 43], [170, 74]] },
      { pts: [[170, 126], [170, 175]], label: { x: 178, y: 152, text: 'true', anchor: 'start' } },
      { pts: [[170, 205], [170, 240]] },
      { pts: [[170, 270], [170, 292], [40, 292], [40, 100], [102, 100]] },
      { pts: [[238, 100], [320, 100], [320, 326]], label: { x: 246, y: 92, text: 'false', anchor: 'start' } },
    ],
  },
  break: {
    w: 360, h: 330,
    code: 'for (init; condition; expression) {\n    ...\n    break;\n    ...\n}',
    nodes: [
      { id: 'i', kind: 'stmt', x: 170, y: 28, text: ['Init-Anweisung', 'init statement'] },
      { id: 'c', kind: 'cond', x: 170, y: 100, text: COND },
      { id: 's', kind: 'stmt', x: 170, y: 190, text: STMT },
      { id: 'e', kind: 'stmt', x: 170, y: 255, text: ['Ausdruck', 'expression'] },
    ],
    edges: [
      { pts: [[170, 43], [170, 74]] },
      { pts: [[170, 126], [170, 175]], label: { x: 178, y: 152, text: 'true', anchor: 'start' } },
      { pts: [[170, 205], [170, 240]] },
      { pts: [[170, 270], [170, 292], [40, 292], [40, 100], [102, 100]] },
      { pts: [[238, 100], [320, 100], [320, 326]], label: { x: 246, y: 92, text: 'false', anchor: 'start' } },
      { pts: [[240, 190], [320, 190]], label: { x: 246, y: 182, text: 'break', anchor: 'start' }, jump: true },
    ],
  },
  continue: {
    w: 360, h: 330,
    code: 'for (init; condition; expression) {\n    ...\n    continue;\n    ...\n}',
    nodes: [
      { id: 'i', kind: 'stmt', x: 170, y: 28, text: ['Init-Anweisung', 'init statement'] },
      { id: 'c', kind: 'cond', x: 170, y: 100, text: COND },
      { id: 's', kind: 'stmt', x: 170, y: 190, text: STMT },
      { id: 'e', kind: 'stmt', x: 170, y: 255, text: ['Ausdruck', 'expression'] },
    ],
    edges: [
      { pts: [[170, 43], [170, 74]] },
      { pts: [[170, 126], [170, 175]], label: { x: 178, y: 152, text: 'true', anchor: 'start' } },
      { pts: [[170, 205], [170, 240]] },
      { pts: [[170, 270], [170, 292], [40, 292], [40, 100], [102, 100]] },
      { pts: [[238, 100], [320, 100], [320, 326]], label: { x: 246, y: 92, text: 'false', anchor: 'start' } },
      { pts: [[240, 190], [286, 190], [286, 255], [240, 255]], label: { x: 292, y: 226, text: 'continue', anchor: 'start' }, jump: true },
    ],
  },
};

export type FlowKind = keyof typeof FLOWS;

/** Control-flow diagram: statements are boxes, conditions diamonds, jumps (break/continue) are drawn in red. */
export function FlowDiagram({ kind }: { kind: FlowKind }) {
  const tr = useTr();
  const f = FLOWS[kind];
  const id = `fl-${kind}`;
  return (
    <figure className="vdemo flow-fig">
      <div className="flow-row">
        <svg viewBox={`0 0 ${f.w} ${f.h}`} role="img" aria-label={tr('Flussdiagramm', 'Flow diagram')} className="flow-svg">
          <defs>
            <marker id={id} markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="currentColor" /></marker>
            <marker id={`${id}-j`} markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="var(--bad)" /></marker>
          </defs>
          {f.edges.map((e, i) => (
            <g key={i}>
              <polyline points={e.pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={e.jump ? 'var(--bad)' : 'currentColor'} strokeWidth={e.jump ? 2.4 : 1.6} markerEnd={e.plain ? undefined : `url(#${e.jump ? `${id}-j` : id})`} />
              {e.label && <text x={e.label.x} y={e.label.y} textAnchor={e.label.anchor ?? 'middle'} className="flow-lab" fill={e.jump ? 'var(--bad)' : 'currentColor'}>{e.label.text}</text>}
            </g>
          ))}
          {f.nodes.map((n) => n.kind === 'dot' ? <circle key={n.id} cx={n.x} cy={n.y} r="3.5" fill="currentColor" /> : (
            <g key={n.id}>
              {n.kind === 'cond'
                ? <polygon points={`${n.x},${n.y - 26} ${n.x + 68},${n.y} ${n.x},${n.y + 26} ${n.x - 68},${n.y}`} className="flow-cond" />
                : <rect x={n.x - 64} y={n.y - 15} width="128" height="30" rx="5" className="flow-stmt" />}
              <text x={n.x} y={n.y + 4.5} textAnchor="middle" className="flow-t">{tr(...(n.text as [string, string]))}</text>
            </g>
          ))}
        </svg>
        <Code code={f.code} label={tr('Code', 'Code')} className="flow-code" />
      </div>
    </figure>
  );
}

const FLOW_NAMES: Record<FlowKind, [string, string]> = {
  if: ['if', 'if'], ifelse: ['if-else', 'if-else'], for: ['for', 'for'], break: ['for + break', 'for + break'], continue: ['for + continue', 'for + continue'],
};

/** Pick one of the five diagrams of the notes (Figures 5.4 – 5.8). */
export function FlowViewer({ initial = 'if' }: { initial?: FlowKind }) {
  const tr = useTr();
  const [k, setK] = useState<FlowKind>(initial);
  return (
    <div className="flow-viewer">
      <div className="v-presets" role="group" aria-label={tr('Kontrollstruktur', 'Control structure')}>
        {(Object.keys(FLOWS) as FlowKind[]).map((x) => <button type="button" key={x} aria-pressed={x === k} onClick={() => setK(x)}><code>{FLOW_NAMES[x][0]}</code></button>)}
      </div>
      <FlowDiagram kind={k} />
    </div>
  );
}
