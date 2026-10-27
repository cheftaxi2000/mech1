import { useMemo, useState } from 'react';
import { M } from '../../components/Tex';
import { useTr } from '../../i18n';
import { allOutcomes, buildTree, evalNode, evalWith, fullParen, ready, start, type EvalState } from '../../info/expr';
import { NumSlider } from './InfoControls';
import './info.css';

export interface ExprPreset { src: string; vars: Record<string, number> }

const RX = 64, RY = 62, R = 17;

/**
 * An expression tree (notes Fig. 3.1–3.4) to evaluate by hand: click a node whose operands are already evaluated.
 * Whichever order you choose is valid; for «bad» expressions the result depends on it.
 */
export function ExprTree({ presets, showParens = true }: { presets: ExprPreset[]; showParens?: boolean }) {
  const tr = useTr();
  const [pi, setPi] = useState(0);
  const [vars, setVars] = useState<Record<string, number>>(presets[0].vars);
  const preset = presets[pi];
  const tree = useMemo(() => buildTree(preset.src), [preset.src]);
  const [st, setSt] = useState<EvalState>(() => start(buildTree(presets[0].src), presets[0].vars));
  const [order, setOrder] = useState<number[]>([]);
  const names = useMemo(() => [...new Set(tree.nodes.filter((n) => n.kind === 'var').map((n) => n.label))], [tree]);
  const outcomes = useMemo(() => allOutcomes(tree, vars), [tree, vars]);
  const reset = (v = vars, t = tree) => { setSt(start(t, v)); setOrder([]); };
  const pick = (id: number) => { setSt((s) => evalNode(tree, s, id)); setOrder((o) => [...o, id]); };
  const run = (how: 'left' | 'right' | 'random') => {
    const o = evalWith(tree, vars, (r) => (how === 'left' ? Math.min(...r) : how === 'right' ? Math.max(...r) : r[Math.floor(Math.random() * r.length)]));
    let s = start(tree, vars); for (const id of o.order) s = evalNode(tree, s, id);
    setSt(s); setOrder(o.order);
  };
  const leaves = Math.max(...tree.nodes.map((n) => n.x)) + 1;
  const W = Math.max(260, leaves * RX + 30), H = (Math.max(...tree.nodes.map((n) => n.depth)) + 1) * RY + 10;
  const px = (x: number) => 20 + R + x * RX, py = (d: number) => R + 8 + d * RY;
  const rdy = new Set(ready(tree, st));
  const done = st.values[tree.root] !== undefined;
  const bad = outcomes.length > 1;
  const val = (x: number | undefined) => (x === undefined ? '' : Number.isNaN(x) ? '' : String(x));

  return (
    <figure className="vdemo in-fig et-fig">
      <div className="v-presets" role="group" aria-label={tr('Ausdruck', 'Expression')}>
        {presets.map((p, i) => (
          <button type="button" key={p.src} aria-pressed={i === pi} onClick={() => { setPi(i); setVars(p.vars); reset(p.vars, buildTree(p.src)); }}><code>{p.src}</code></button>
        ))}
      </div>
      {showParens && <div className="et-paren"><span>{tr('Der Compiler liest:', 'The compiler reads:')}</span> <code className="ic">{fullParen(preset.src)}</code></div>}
      {names.length > 0 && (
        <div className="in-inputs">
          {names.map((n) => <NumSlider key={n} label={<M>{n}</M>} min={0} max={30} value={vars[n] ?? 0} onChange={(v) => { const nv = { ...vars, [n]: v }; setVars(nv); reset(nv); }} aria={tr(`Wert von ${n}`, `Value of ${n}`)} />)}
        </div>
      )}
      <svg className="et-svg" viewBox={`0 0 ${W} ${H}`} role="group" aria-label={tr('Ausdrucksbaum', 'Expression tree')} style={{ maxWidth: W * 1.1 }}>
        {tree.nodes.map((n) => n.children.map((c) => <line key={`${n.id}-${c}`} className="et-edge" x1={px(n.x)} y1={py(n.depth)} x2={px(tree.nodes[c].x)} y2={py(tree.nodes[c].depth)} />))}
        {tree.nodes.map((n) => {
          const isReady = rdy.has(n.id) && n.kind !== 'lvalue', isDone = st.values[n.id] !== undefined;
          return (
            <g key={n.id} className={`et-node ${n.kind}${isDone ? ' done' : ''}${isReady ? ' ready' : ''}`} transform={`translate(${px(n.x)},${py(n.depth)})`}
              role={isReady ? 'button' : undefined} tabIndex={isReady ? 0 : undefined} aria-label={isReady ? tr(`Knoten ${n.label} auswerten`, `Evaluate node ${n.label}`) : undefined}
              onClick={isReady ? () => pick(n.id) : undefined} onKeyDown={isReady ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(n.id); } } : undefined}>
              <circle r={R} />
              <text y="5">{n.label}</text>
              {isDone && n.kind !== 'lvalue' && <text className="et-val" y={R + 14}>{val(st.values[n.id])}</text>}
              {order.includes(n.id) && <text className="et-ord" x={R - 2} y={-R + 6}>{order.indexOf(n.id) + 1}</text>}
            </g>
          );
        })}
      </svg>
      <div className="bx-say" aria-live="polite">
        {st.error ? <b className="tr-warn">{st.error}</b>
          : done ? <>{tr('Ergebnis:', 'Result:')} <b>{val(st.values[tree.root])}</b>{Object.keys(vars).some((k) => st.vars[k] !== vars[k]) && <> · {tr('Variablen danach:', 'variables afterwards:')} {Object.entries(st.vars).map(([k, v]) => <code key={k} className="ic">{k} = {v}</code>).reduce<React.ReactNode[]>((a, x) => (a.length ? [...a, ' ', x] : [x]), [])}</>}</>
          : <>{tr('Klicke einen hervorgehobenen Knoten an: Er darf ausgewertet werden, weil seine Operanden schon bekannt sind (Blätter immer).', 'Click a highlighted node: it may be evaluated because its operands are known already (leaves always).')}</>}
      </div>
      <div className="in-controls">
        <button type="button" className="motion-btn" onClick={() => reset()}>↺</button>
        <button type="button" className="motion-btn" onClick={() => run('left')}>{tr('Von links', 'Left first')}</button>
        <button type="button" className="motion-btn" onClick={() => run('right')}>{tr('Von rechts', 'Right first')}</button>
        <button type="button" className="motion-btn" onClick={() => run('random')}>{tr('Zufällig', 'Random')}</button>
        <span className="in-counter">{bad
          ? <b className="tr-warn">{tr('Schlechter Ausdruck: mögliche Ergebnisse', 'Bad expression: possible results')} {outcomes.map((o) => o.result).join(' / ')}</b>
          : <>{tr('Alle gültigen Reihenfolgen geben', 'Every valid order gives')} <b>{outcomes[0]?.result}</b></>}</span>
      </div>
    </figure>
  );
}
