import { useRef, useState } from 'react';
import { M } from '../../components/Tex';
import { resultant } from '../../physics/force';
import { fmtNum, tupleSep, useLang, useTr } from '../../i18n';
import { Arrow, Frame, KLabel, svgPt, t, type V } from './kfKit';
import { FIG42 } from './resultantScene';

const VB: [number, number, number, number] = [0, 0, 480, 330];
const A: V = [215, 150];
const SR = 2.2; // px per N
const MAX_F = 80;
const EQUILIBRIUM: readonly V[] = [[5, -25], [-20, -45], [-30, 5], [15, 55], [30, 10]];
const toPx = (f: V): V => [SR * f[0], -SR * f[1]];
const plus = (p: V, q: V): V => [p[0] + q[0], p[1] + q[1]];

/**
 * Lecture p. 29, Fig. 4.2, interactive: five forces at ONE point A. Drag the tips. R̲ = ΣF̲_i is the arrow from A to the end of the
 * head-to-tail chain (switch it on); it does not matter in which order the forces are laid down.
 */
export function K1Resultant() {
  const tr = useTr(), lang = useLang();
  const [F, setF] = useState<V[]>(() => FIG42.map((f) => [f[0], f[1]] as V));
  const [chain, setChain] = useState(false);
  const [rev, setRev] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const drag = useRef<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const R3 = resultant(F.map((f) => ({ F: [f[0], f[1], 0] as const })));
  const R: V = [R3[0] === 0 ? 0 : R3[0], R3[1] === 0 ? 0 : R3[1]];
  const Rn = Math.hypot(R[0], R[1]);
  const sep = tupleSep(lang), num = (x: number, d = 1) => fmtNum(x, d, lang, true);
  const order = rev ? [4, 3, 2, 1, 0] : [0, 1, 2, 3, 4];
  const zero = Rn < 0.3;

  const onDown = (e: React.PointerEvent) => {
    if (!svg.current) return;
    const q = svgPt(svg.current, VB, e);
    let best = -1, bd = 32;
    F.forEach((f, i) => { const p = plus(A, toPx(f)), d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; best = i; } });
    if (best >= 0) { drag.current = best; setSel(best); (e.currentTarget as Element).setPointerCapture?.(e.pointerId); }
  };
  const onMove = (e: React.PointerEvent) => {
    const i = drag.current;
    if (i === null || !svg.current) return;
    const q = svgPt(svg.current, VB, e);
    let fx = (q[0] - A[0]) / SR, fy = -(q[1] - A[1]) / SR;
    const n = Math.hypot(fx, fy);
    if (n > MAX_F) { fx *= MAX_F / n; fy *= MAX_F / n; }
    setF((cur) => cur.map((f, j) => (j === i ? [Math.round(fx), Math.round(fy)] as V : f)));
  };
  const onUp = () => { drag.current = null; };

  // chain: copies laid head to tail in the chosen order
  const chainPts: V[] = [A];
  order.forEach((i) => chainPts.push(plus(chainPts[chainPts.length - 1], toPx(F[i]))));
  const Rtip = plus(A, toPx(R));
  const lab = (from: V, to: V, k = 28): V => { const d = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1; return [to[0] + (k * (to[0] - from[0])) / d, to[1] + ((k - 2) * (to[1] - from[1])) / d]; };

  return (
    <Frame vb={VB} svgRef={svg} label={tr('Fünf Kräfte am Punkt A, Spitzen ziehbar; Resultierende', 'Five forces at the point A, tips draggable; resultant')}
      svgProps={{ onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: onUp } as React.SVGProps<SVGSVGElement>}
      labels={<>
        {F.map((f, i) => { const p = lab(A, plus(A, toPx(f))); return Math.hypot(f[0], f[1]) > 4 ? <KLabel key={i} vb={VB} x={p[0]} y={p[1]} ink="force">{`\\v F_${i + 1}`}</KLabel> : null; })}
        {!zero && (() => { const p = lab(A, Rtip, 30); return <KLabel vb={VB} x={p[0]} y={p[1]} ink="res">{t`\v R`}</KLabel>; })()}
        {chain && order.map((i, k) => {
          const p = chainPts[k], q = chainPts[k + 1], d = Math.hypot(q[0] - p[0], q[1] - p[1]);
          if (d < 26) return null;
          const nx = (q[1] - p[1]) / d, ny = -(q[0] - p[0]) / d;
          return <KLabel key={`c${i}`} vb={VB} x={(p[0] + q[0]) / 2 + 14 * nx} y={(p[1] + q[1]) / 2 + 14 * ny} ink="muted">{`\\v F_${i + 1}`}</KLabel>;
        })}
        {zero && <KLabel vb={VB} x={A[0] + 26} y={A[1] - 18} ink="res">{t`\v R = \v 0`}</KLabel>}
        <KLabel vb={VB} x={A[0] - 14} y={A[1] + 14} ink="point">A</KLabel>
      </>}
      caption={<>
        <div className="kf-ctl">
          <div className="row">
            <button type="button" className="kf-chip" onClick={() => setF(FIG42.map((f) => [f[0], f[1]] as V))}>{tr('Fig. 4.2', 'Fig. 4.2')}</button>
            <button type="button" className="kf-chip" onClick={() => setF(EQUILIBRIUM.map((f) => [f[0], f[1]] as V))}>{tr('Kräfte halten sich die Waage', 'Forces balance')}</button>
          </div>
          <label className="kf-check"><input type="checkbox" checked={chain} onChange={(e) => setChain(e.target.checked)} />{tr('Pfeile aneinanderhängen (Kräftepolygon)', 'chain the arrows head to tail (force polygon)')}</label>
          {chain && <div className="row" role="group" aria-label={tr('Reihenfolge', 'Order')}>
            <span className="kf-note">{tr('Reihenfolge', 'Order')}:</span>
            <button type="button" className="kf-chip" aria-pressed={!rev} onClick={() => setRev(false)}><M>{t`1\,2\,3\,4\,5`}</M></button>
            <button type="button" className="kf-chip" aria-pressed={rev} onClick={() => setRev(true)}><M>{t`5\,4\,3\,2\,1`}</M></button>
          </div>}
        </div>
        <div className="kf-wrapx">
          <table className="kf-table" aria-label={tr('Komponenten der Kräfte und der Resultierenden', 'Components of the forces and of the resultant')}>
            <thead><tr><th /><th><M>{t`F_x\ [\mathrm N]`}</M></th><th><M>{t`F_y\ [\mathrm N]`}</M></th></tr></thead>
            <tbody>
              {F.map((f, i) => <tr key={i} className={sel === i ? 'hl' : ''}><td><M>{`\\v F_${i + 1}`}</M></td><td><M>{fmtNum(f[0], 0, lang, true)}</M></td><td><M>{fmtNum(f[1], 0, lang, true)}</M></td></tr>)}
              <tr className="sum"><td><M>{t`\v R = \sum \v F_i`}</M></td><td><M>{fmtNum(R[0], 0, lang, true)}</M></td><td><M>{fmtNum(R[1], 0, lang, true)}</M></td></tr>
            </tbody>
          </table>
        </div>
        <div className="kf-read" role="status">
          <div className="big"><M>{t`\v R = (${num(R[0], 0)}${sep}${num(R[1], 0)})\,\mathrm{N}`}</M>{', '}<M>{t`|\v R| = ${num(Rn, 1)}\,\mathrm{N}`}</M></div>
          <div className="kf-note">{zero
            ? tr('Das Kräftepolygon schliesst sich: die Gruppe hat die Resultierende null. (Was das bedeutet, klärt die Statik später.)', 'The force polygon closes: the group has resultant zero. (What that means is for statics, later.)')
            : tr('Spalte für Spalte addieren: die Komponenten von R sind die Summen der Komponenten der Kräfte.', 'Add column by column: the components of R are the sums of the components of the forces.')}</div>
        </div>
      </>}>
      {chain && chainPts.slice(0, -1).map((p, k) => <Arrow key={`c${k}`} a={p} b={chainPts[k + 1]} cls="kf-f thin ghost" />)}
      {F.map((f, i) => <Arrow key={i} a={A} b={plus(A, toPx(f))} cls="kf-f" opacity={chain ? 0.55 : 1} />)}
      {!zero && <Arrow a={A} b={Rtip} cls="kf-r" />}
      <circle cx={A[0]} cy={A[1]} r={5.5} className="kf-pt solid" />
      {F.map((f, i) => { const p = plus(A, toPx(f)); return <circle key={`h${i}`} cx={p[0]} cy={p[1]} r={13} className="kf-handle" />; })}
    </Frame>
  );
}
