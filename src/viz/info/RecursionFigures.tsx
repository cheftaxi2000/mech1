import { useMemo, useState } from 'react';
import { useTr } from '../../i18n';
import type { Trace } from '../../info/cpp/interp';
import { callTree, decreaseDepth, divideDepth, fibCalls, type CallNode } from '../../info/recursion';
import { NumSlider } from './InfoControls';

interface Placed { node: CallNode; x: number; y: number; label: string }

/** Tidy layout: leaves get consecutive slots, a parent sits above the middle of its children. */
function layout(roots: CallNode[], slot: number, rowH: number, label: (n: CallNode) => string): { placed: Placed[]; edges: [Placed, Placed][]; w: number; h: number } {
  const placed: Placed[] = [];
  const edges: [Placed, Placed][] = [];
  let leaf = 0, maxDepth = 0;
  const go = (n: CallNode): Placed => {
    maxDepth = Math.max(maxDepth, n.depth);
    const kids = n.children.map(go);
    const x = kids.length ? (kids[0].x + kids[kids.length - 1].x) / 2 : slot / 2 + slot * leaf++;
    const p: Placed = { node: n, x, y: 18 + n.depth * rowH, label: label(n) };
    placed.push(p);
    kids.forEach((k) => edges.push([p, k]));
    return p;
  };
  roots.forEach(go);
  return { placed, edges, w: Math.max(slot * Math.max(leaf, 1), slot), h: 40 + maxDepth * rowH };
}

const hue = (s: string) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };

/**
 * The call tree of a run, in step with the stepper: calls appear when they happen, a return fills in the value.
 * `colorSame` colours calls with equal arguments alike (the repeated subproblems of `fib`).
 */
export function CallTree({ trace, step, colorSame = false }: { trace: Trace; step: number; colorSame?: boolean }) {
  const tr = useTr();
  const roots = useMemo(() => callTree(trace), [trace]);
  const names = useMemo(() => { const set = new Set<string>(); const walk = (n: CallNode) => { set.add(n.label.split('(')[0]); n.children.forEach(walk); }; roots.forEach(walk); return set; }, [roots]);
  const fullMax = useMemo(() => { let m = 0; const walk = (n: CallNode) => { m = Math.max(m, n.label.length); n.children.forEach(walk); }; roots.forEach(walk); return m; }, [roots]);
  const short = names.size === 1 && fullMax > 14; // long labels drop the function name
  const text = (n: CallNode) => (short ? n.label.slice(n.label.indexOf('(')) : n.label);
  const widest = useMemo(() => { let m = 0; const walk = (n: CallNode) => { m = Math.max(m, text(n).length + (n.value ? n.value.length + 3 : 0)); n.children.forEach(walk); }; roots.forEach(walk); return m; }, [roots, short]); // eslint-disable-line react-hooks/exhaustive-deps
  const slot = Math.max(54, widest * 7.4 + 14);
  const { placed, edges, w, h } = useMemo(() => layout(roots, slot, 52, text), [roots, slot, short]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!placed.length) return null;
  const state = (n: CallNode) => (n.from > step ? 'future' : n.to !== undefined && n.to <= step ? 'done' : 'active');
  const activeDeepest = Math.max(-1, ...placed.filter((p) => state(p.node) === 'active').map((p) => p.node.depth));
  return (
    <div className="ct-wrap" aria-label={tr('Aufrufbaum', 'Call tree')}>
      <svg viewBox={`0 0 ${w} ${h}`} width={Math.max(w, 120)} className="ct-svg" role="img" aria-label={tr('Baum der Aufrufe', 'Tree of calls')}>
        {edges.map(([a, b]) => <line key={a.node.id + '-' + b.node.id} x1={a.x} y1={a.y + 13} x2={b.x} y2={b.y - 13} className={`ct-edge ${state(b.node)}`} />)}
        {placed.map((p) => {
          const st = state(p.node);
          const label = p.label + (st === 'done' && p.node.value !== undefined ? ` → ${p.node.value}` : '');
          const bw = Math.max(40, label.length * 7.2 + 12);
          const colour = colorSame ? `hsl(${hue(p.node.label)} 70% 50%)` : undefined;
          return (
            <g key={p.node.id} className={`ct-node ${st}${st === 'active' && p.node.depth === activeDeepest ? ' top' : ''}`}>
              <rect x={p.x - bw / 2} y={p.y - 13} width={bw} height={26} rx={7} style={colour && st !== 'future' ? { stroke: colour } : undefined} />
              <text x={p.x} y={p.y + 4} textAnchor="middle">{label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** How many calls does `fib(n)` make, compared with the n − 1 additions of the loop? */
export function FibGrowth() {
  const tr = useTr();
  const [n, setN] = useState(20);
  const calls = fibCalls(n);
  const loop = Math.max(n - 1, 0);
  const fmt = (x: bigint | number) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const logw = (x: bigint | number) => Math.min(100, (Math.log10(Number(x) + 1) / 11) * 100);
  return (
    <figure className="vdemo fg2-fig">
      <NumSlider label={<code>n</code>} min={1} max={50} value={n} onChange={setN} aria={tr('n', 'n')} />
      <div className="fg2-row"><span>{tr('rekursives fib(n): Aufrufe', 'recursive fib(n): calls')}</span><div className="fg2-bar"><i style={{ width: `${logw(calls)}%` }} className="r" /></div><b>{fmt(calls)}</b></div>
      <div className="fg2-row"><span>{tr('Schleife: Additionen', 'loop: additions')}</span><div className="fg2-bar"><i style={{ width: `${logw(loop)}%` }} className="l" /></div><b>{fmt(loop)}</b></div>
      <p className="fg2-say">{tr('Die Balken sind logarithmisch: Jeder Strich nach rechts bedeutet einen Faktor 10. Bei ', 'The bars are logarithmic: each step to the right means a factor of 10. At ')}<code>n = 50</code>{tr(' sind es gut 40 Milliarden Aufrufe gegen 49 Additionen.', ' it is a good 40 billion calls against 49 additions.')}</p>
    </figure>
  );
}

/** Recursion depth of the two strategies for the sum of n numbers. */
export function DepthCompare() {
  const tr = useTr();
  const [n, setN] = useState(16);
  const a = decreaseDepth(n), b = divideDepth(n);
  return (
    <figure className="vdemo dc-fig">
      <NumSlider label={<code>n</code>} min={1} max={64} value={n} onChange={setN} aria={tr('Länge des Vektors', 'Length of the vector')} />
      <div className="dc-row"><span>{tr('Teilen und Herrschen', 'divide and conquer')}</span><div className="dc-bar"><i className="b" style={{ width: `${(b / 65) * 100}%` }} /></div><b>{b}</b></div>
      <div className="dc-row"><span>{tr('Verkleinern und Herrschen', 'decrease and conquer')}</span><div className="dc-bar"><i className="a" style={{ width: `${(a / 65) * 100}%` }} /></div><b>{a}</b></div>
      <p className="fg2-say">{tr('Gleichzeitig aktive Aufrufe (ohne main) beim Summieren von ', 'Calls active at the same time (without main) when summing ')}<code>{n}</code>{tr(' Zahlen: Halbieren hält den Stapel flach.', ' numbers: halving keeps the stack flat.')}</p>
    </figure>
  );
}
