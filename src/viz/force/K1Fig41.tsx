import { useRef, useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, tupleSep, useLang, useTr } from '../../i18n';
import { Arrow, Frame, KLabel, svgPt, t, useTween, type V } from './kfKit';

const VB: [number, number, number, number] = [0, 0, 480, 262];
const X0 = 40, PXM = 85; // bar from x = 0 m at 40 px, 85 px per metre
const BAR_L = 4, BAR_Y0 = 137, BAR_H = 38; // bar: 4 m long, 0.4 m thick (px 137 … 175)
const SF = 3.0; // px per N
const MAX_F = 45;
const yPx = (y: number) => BAR_Y0 + BAR_H - (y / 0.4) * BAR_H; // y in m (0 = bottom edge of the bar)

interface Item { x: number; y: number; F: V; headAtA: boolean }
/** Fig. 4.1 read off the lecture: A₁ … A₅ along the bar; F₂, F₃ end at their point (arrow comes from outside), F₁, F₄, F₅ start there. */
export const FIG41: readonly Item[] = [
  { x: 0.3, y: 0, F: [4, 34], headAtA: false },
  { x: 0.8, y: 0.4, F: [-10, -29], headAtA: true },
  { x: 2.0, y: 0.2, F: [0, -20], headAtA: true },
  { x: 2.8, y: 0.4, F: [-26, -17], headAtA: false },
  { x: 3.6, y: 0, F: [26, 21], headAtA: false },
];
const LAB_A: V[] = [[0, 24], [24, 14], [-24, 10], [-4, -24], [4, 24]];

/** Position of A_i in px. */
const aPx = (it: Item): V => [X0 + it.x * PXM, yPx(it.y)];
/** Free end of the arrow (the end that is NOT at A), in px. */
const freeEnd = (it: Item): V => { const a = aPx(it); return it.headAtA ? [a[0] - SF * it.F[0], a[1] + SF * it.F[1]] : [a[0] + SF * it.F[0], a[1] - SF * it.F[1]]; };

/**
 * Fig. 4.1 (p. 29), interactive: five point-bound forces on a bar. Drag the free end of an arrow to change F̲_i,
 * drag the white dot A_i along the bar. The table shows the point-bound vectors {A_i | F̲_i} as numbers.
 * «Nur die Vektoren» takes the points away: the same five arrows are no longer the same five forces.
 */
export function K1Fig41() {
  const tr = useTr(), lang = useLang();
  const [items, setItems] = useState<Item[]>(() => FIG41.map((i) => ({ ...i })));
  const [vecOnly, setVecOnly] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const k = useTween(vecOnly ? 1 : 0, 650);
  const drag = useRef<{ i: number; what: 'A' | 'F' } | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const sep = tupleSep(lang);
  const num = (x: number, d = 1) => fmtNum(x, d, lang, true);

  const slot = (i: number): V => [X0 + PXM * 0.4 + i * 90, 150];
  /** shift of arrow i in «only vectors» mode: its middle goes to the slot */
  const shift = (i: number): V => {
    const a = aPx(items[i]), e = freeEnd(items[i]);
    const mid: V = [(a[0] + e[0]) / 2, (a[1] + e[1]) / 2], s = slot(i);
    return [(s[0] - mid[0]) * k, (s[1] - mid[1]) * k];
  };
  const ends = (i: number): [V, V] => {
    const it = items[i], a = aPx(it), e = freeEnd(it), sh = shift(i);
    const tail: V = it.headAtA ? e : a, head: V = it.headAtA ? a : e;
    return [[tail[0] + sh[0], tail[1] + sh[1]], [head[0] + sh[0], head[1] + sh[1]]];
  };

  const onDown = (e: React.PointerEvent) => {
    if (!svg.current || vecOnly) return;
    const q = svgPt(svg.current, VB, e);
    let best: { i: number; what: 'A' | 'F'; d: number } | null = null;
    items.forEach((it, i) => {
      const a = aPx(it), fe = freeEnd(it);
      const dA = Math.hypot(q[0] - a[0], q[1] - a[1]), dF = Math.hypot(q[0] - fe[0], q[1] - fe[1]);
      if (dF < 30 && (!best || dF < best.d)) best = { i, what: 'F', d: dF };
      if (dA < 22 && (!best || dA - 4 < best.d)) best = { i, what: 'A', d: dA - 4 };
    });
    if (best) { drag.current = { i: (best as { i: number }).i, what: (best as { what: 'A' | 'F' }).what }; setSel((best as { i: number }).i); (e.currentTarget as Element).setPointerCapture?.(e.pointerId); }
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || !svg.current) return;
    const q = svgPt(svg.current, VB, e);
    setItems((cur) => cur.map((it, i) => {
      if (i !== d.i) return it;
      if (d.what === 'A') return { ...it, x: Math.max(0, Math.min(BAR_L, (q[0] - X0) / PXM)) };
      const a = aPx(it);
      let Fx = it.headAtA ? (a[0] - q[0]) / SF : (q[0] - a[0]) / SF, Fy = it.headAtA ? (q[1] - a[1]) / SF : (a[1] - q[1]) / SF;
      const n = Math.hypot(Fx, Fy);
      if (n > MAX_F) { Fx *= MAX_F / n; Fy *= MAX_F / n; }
      return { ...it, F: [Math.round(Fx * 2) / 2, Math.round(Fy * 2) / 2] };
    }));
  };
  const onUp = () => { drag.current = null; };

  return (
    <Frame vb={VB} svgRef={svg} label={tr('Fig. 4.1: fünf Kräfte an einem Balken, Pfeilenden und Angriffspunkte ziehbar', 'Fig. 4.1: five forces on a bar, arrow ends and points of application draggable')}
      svgProps={{ onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: onUp } as React.SVGProps<SVGSVGElement>}
      labels={<>
        {items.map((it, i) => {
          const [tail, head] = ends(i);
          const free = it.headAtA ? tail : head, base = it.headAtA ? head : tail;
          const o = Math.hypot(free[0] - base[0], free[1] - base[1]) || 1;
          const lp: V = [free[0] + (30 * (free[0] - base[0])) / o, free[1] + (26 * (free[1] - base[1])) / o];
          const a = aPx(it);
          return (
            <div key={i}>
              <KLabel vb={VB} x={lp[0]} y={lp[1]} ink="force">{`\\v F_${i + 1}`}</KLabel>
              {k < 0.5 && <div style={{ opacity: 1 - 2 * k }}><KLabel vb={VB} x={a[0] + LAB_A[i][0]} y={a[1] + LAB_A[i][1]} ink="point">{`A_${i + 1}`}</KLabel></div>}
            </div>
          );
        })}
        <KLabel vb={VB} x={X0 + 5 * SF} y={250} ink="muted">{t`10\,\mathrm{N}`}</KLabel>
        {k > 0.9 && <KLabel vb={VB} x={240} y={236} ink="fg" small={false}>{t`\{\,?\,|\,\v F_i\}`}</KLabel>}
      </>}
      caption={<>
        <div className="kf-ctl">
          <label className="kf-check"><input type="checkbox" checked={vecOnly} onChange={(e) => { setVecOnly(e.target.checked); setSel(null); }} />{tr('nur die Vektoren (ohne Angriffspunkte)', 'only the vectors (no points of application)')}</label>
          <div className="row"><button type="button" className="kf-chip" onClick={() => { setItems(FIG41.map((i) => ({ ...i }))); setVecOnly(false); }}>{tr('Wie im Skript', 'As in the notes')}</button></div>
        </div>
        <div className="kf-wrapx">
          <table className="kf-table" aria-label={tr('Die fünf Kräfte als Zahlen', 'The five forces as numbers')}>
            <thead><tr>
              <th><M>{t`\{A_i\,|\,\v F_i\}`}</M></th>
              <th><M>{t`A_i\ [\mathrm{m}]`}</M></th>
              <th><M>{t`\v F_i\ [\mathrm{N}]`}</M></th>
              <th><M>{t`|\v F_i|`}</M></th>
            </tr></thead>
            <tbody>{items.map((it, i) => (
              <tr key={i} className={sel === i ? 'hl' : ''}>
                <td><M>{`i=${i + 1}`}</M></td>
                <td>{vecOnly ? <M>?</M> : <M>{`(${num(it.x, 1)}${sep}${num(it.y, 1)})`}</M>}</td>
                <td><M>{`(${num(it.F[0], 1)}${sep}${num(it.F[1], 1)})`}</M></td>
                <td>{fmtNum(Math.hypot(it.F[0], it.F[1]), 1, lang)}</td>
              </tr>))}</tbody>
          </table>
        </div>
        <div className="kf-note" role="status">{vecOnly
          ? tr('Ohne Angriffspunkte sind es nur noch fünf Pfeile. Welche Kraft zieht wo am Balken? Das steht nirgends mehr.', 'Without points of application there are only five arrows. Which force pulls where on the bar? It is written nowhere any more.')
          : tr('Ziehe an einem Pfeilende oder an einem Punkt. Der Pfeilmassstab ist fest: Länge = Betrag.', 'Drag an arrow end or a point. The arrow scale is fixed: length = magnitude.')}</div>
      </>}>
      <rect x={X0} y={BAR_Y0} width={BAR_L * PXM} height={BAR_H} rx={2} className="kf-body" opacity={1 - 0.85 * k} />
      {/* scale bar */}
      <g><line x1={X0} y1={236} x2={X0 + 10 * SF} y2={236} className="kf-axis" /><line x1={X0} y1={232} x2={X0} y2={240} className="kf-axis" /><line x1={X0 + 10 * SF} y1={232} x2={X0 + 10 * SF} y2={240} className="kf-axis" /></g>
      {items.map((_, i) => {
        const [tail, head] = ends(i);
        return <Arrow key={i} a={tail} b={head} cls={`kf-f${sel === i ? '' : ''}`} />;
      })}
      {items.map((it, i) => {
        const a = aPx(it), [tail, head] = ends(i), fe = it.headAtA ? tail : head;
        return (
          <g key={`p${i}`}>
            {k < 0.99 && <circle cx={a[0]} cy={a[1]} r={5.5} className="kf-pt" opacity={1 - k} />}
            {!vecOnly && <circle cx={fe[0]} cy={fe[1]} r={13} className="kf-handle" />}
            {!vecOnly && <circle cx={a[0]} cy={a[1]} r={13} className="kf-handle pt" opacity={0.7} />}
          </g>
        );
      })}
    </Frame>
  );
}
