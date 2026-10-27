import { useState } from 'react';
import { M } from '../../components/Tex';
import { useTr } from '../../i18n';
import { apply, bits, size, toSigned } from '../../info/wrap';
import './info.css';

const t = String.raw;

/** All 2^B bit patterns on a ring. The pointer moves; reading the same pattern as `int` or as `unsigned` gives two numbers, and the seams show where each type wraps. */
export function WrapRing() {
  const tr = useTr();
  const [B, setB] = useState(4);
  const [u, setU] = useState(7);
  const [msg, setMsg] = useState<string | null>(null);
  const N = size(B), CX = 150, CY = 150, RR = 108;
  const pos = (k: number, r = RR) => { const a = -Math.PI / 2 + ((k + 0.5) * 2 * Math.PI) / N; return [CX + r * Math.cos(a), CY + r * Math.sin(a)] as const; };
  // the ring is turned by half a step: the seams of unsigned (top) and int (bottom) fall between two patterns
  const labels = B <= 4;
  const op = (o: '+' | '-' | '*', k: number) => {
    const r = apply(u, o, k, B);
    setU(r.u);
    setMsg(r.wrapped ? tr(`Überlauf: das exakte Ergebnis ${r.exact} liegt ausserhalb von int, es bleibt ${toSigned(r.u, B)}.`, `Overflow: the exact result ${r.exact} is outside of int, what remains is ${toSigned(r.u, B)}.`) : null);
  };
  const changeB = (nb: number) => { setB(nb); setU((x) => x % size(nb)); setMsg(null); };
  const [px, py] = pos(u);
  return (
    <figure className="vdemo in-fig wr-fig">
      <div className="v-presets" role="group" aria-label={tr('Anzahl Bits', 'Number of bits')}>
        <span className="tr-inl"><M>B</M> =</span>
        {[3, 4, 5].map((b) => <button type="button" key={b} aria-pressed={b === B} onClick={() => changeB(b)}>{b}</button>)}
      </div>
      <svg className="wr-svg" viewBox="0 0 300 300" role="img" aria-label={tr('Ring aller Bitmuster', 'Ring of all bit patterns')}>
        <circle cx={CX} cy={CY} r={RR} className="wr-ring" />
        {Array.from({ length: N }, (_, k) => { const [x, y] = pos(k); return <circle key={k} cx={x} cy={y} r={labels ? 3 : 2.5} className={`wr-dot${k === u ? ' on' : ''}`} />; })}
        {labels && Array.from({ length: N }, (_, k) => {
          const [x, y] = pos(k, RR + 22), [x2, y2] = pos(k, RR - 20);
          return (
            <g key={k}>
              <text x={x} y={y + 4} className="wr-un">{k}</text>
              <text x={x2} y={y2 + 4} className="wr-sg">{toSigned(k, B)}</text>
            </g>
          );
        })}
        {/* seams: where unsigned (top) and int (bottom) wrap */}
        <line x1={CX} y1={CY - RR - 36} x2={CX} y2={CY - RR + 4} className="wr-seam un" />
        <line x1={CX} y1={CY + RR - 4} x2={CX} y2={CY + RR + 36} className="wr-seam sg" />
        <circle cx={px} cy={py} r="9" className="wr-ptr" />
        <text x={CX} y={CY - 8} className="wr-mid">{bits(u, B)}</text>
        <text x={CX} y={CY + 14} className="wr-mid sm">int {toSigned(u, B)} · unsigned {u}</text>
      </svg>
      <div className="wr-legend">
        <span className="un">{tr('aussen: als unsigned gelesen, Sprung oben', 'outer: read as unsigned, wraps at the top')}</span>
        <span className="sg">{tr('innen: als int gelesen, Sprung unten', 'inner: read as int, wraps at the bottom')}</span>
      </div>
      <div className="bx-say" aria-live="polite">
        {msg ?? <>{tr('Das Bitmuster', 'The bit pattern')} <code className="ic">{bits(u, B)}</code> {tr('ist als', 'is')} <code className="ic">int</code> <M>{t`${toSigned(u, B)}`}</M> {tr('und als', 'and as')} <code className="ic">unsigned</code> <M>{t`${u}`}</M>{tr(' – dieselben Bits, zwei Lesarten.', ' – the same bits, two readings.')}</>}
      </div>
      <div className="in-controls">
        <button type="button" className="motion-btn primary" onClick={() => op('+', 1)}><M>+1</M></button>
        <button type="button" className="motion-btn" onClick={() => op('-', 1)}><M>-1</M></button>
        <button type="button" className="motion-btn" onClick={() => op('+', 3)}><M>+3</M></button>
        <button type="button" className="motion-btn" onClick={() => op('*', 2)}><M>{t`\cdot 2`}</M></button>
        <button type="button" className="motion-btn" onClick={() => { setU(0); setMsg(null); }}>0</button>
        <button type="button" className="motion-btn" onClick={() => { setU(size(B - 1) - 1); setMsg(null); }}>{tr('grösster int', 'largest int')}</button>
      </div>
    </figure>
  );
}
