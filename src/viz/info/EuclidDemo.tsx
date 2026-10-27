import { useMemo, useState } from 'react';
import { M } from '../../components/Tex';
import { useTr } from '../../i18n';
import { commonDivisors, euclidTrace } from '../../info/euclid';
import { NumSlider, useInterval } from './InfoControls';
import './info.css';

const t = String.raw;
const PRESETS: [number, number][] = [[12, 8], [35, 14], [13, 8], [40, 3]];

/** Fig. 1.1 of the notes made interactive: both lengths as bars, the ghost shows where each bar was before; below it the
 *  table of values over time and the set of common divisors – the thing that never changes. */
export function EuclidDemo() {
  const tr = useTr();
  const [a0, setA] = useState(12), [b0, setB] = useState(8);
  const [i, setI] = useState(0);
  const [play, setPlay] = useState(false);
  const trace = useMemo(() => euclidTrace(a0, b0), [a0, b0]);
  const last = trace.length - 1;
  const cur = trace[Math.min(i, last)], prev = i > 0 ? trace[Math.min(i, last) - 1] : null;
  const divs = useMemo(() => commonDivisors(a0, b0), [a0, b0]);
  useInterval(play, 900, () => setI((k) => { if (k >= last) { setPlay(false); return k; } return k + 1; }));
  const reset = (a: number, b: number) => { setA(a); setB(b); setI(0); setPlay(false); };
  const H = 170, scale = H / Math.max(a0, b0);
  const bar = (v: number) => v * scale;

  return (
    <figure className="vdemo in-fig">
      <div className="v-presets" role="group" aria-label={tr('Beispiele', 'Examples')}>
        {PRESETS.map(([a, b]) => (
          <button type="button" key={`${a}-${b}`} aria-pressed={a === a0 && b === b0} onClick={() => reset(a, b)}><M>{t`(${a},\,${b})`}</M></button>
        ))}
      </div>
      <div className="in-inputs">
        <NumSlider label={<M>a</M>} min={1} max={40} value={a0} onChange={(v) => reset(v, b0)} aria={tr('Anfangswert a', 'Start value a')} />
        <NumSlider label={<M>b</M>} min={1} max={40} value={b0} onChange={(v) => reset(a0, v)} aria={tr('Anfangswert b', 'Start value b')} />
      </div>
      <div className="eu-main">
        <svg className="eu-bars" viewBox="0 0 300 215" role="img" aria-label={tr('Zwei Balken a und b; der kürzere wird vom längeren abgezogen', 'Two bars a and b; the shorter one is subtracted from the longer one')}>
          <line x1="20" x2="280" y1="190" y2="190" stroke="var(--line-strong, var(--line))" />
          {([['a', cur.a, prev?.a, 90], ['b', cur.b, prev?.b, 200]] as const).map(([name, v, pv, x]) => (
            <g key={name}>
              {pv !== undefined && pv !== v && <rect className={`ghost ${name}`} x={x - 26} y={190 - bar(pv)} width="52" height={bar(pv)} />}
              <rect className={`bar-${name}`} x={x - 26} y={190 - bar(v)} width="52" height={bar(v)} />
              <text x={x} y={206}>{name}</text>
              <text className="val" x={x} y={190 - bar(Math.max(v, pv ?? 0)) - 6}>{v}</text>
            </g>
          ))}
        </svg>
        <div style={{ minWidth: 0 }}>
          <table className="eu-table">
            <thead><tr><th>{tr('Schritt', 'Step')}</th><th><M>a</M></th><th><M>b</M></th><th /></tr></thead>
            <tbody>
              {trace.slice(0, i + 1).map((s, k) => (
                <tr key={k} className={k === i ? 'now' : ''}>
                  <td>{k}</td><td className="a">{s.a}</td><td className="b">{s.b}</td>
                  <td className="op">{s.op === 'a-b' ? <M>{t`a \leftarrow a-b`}</M> : s.op === 'b-a' ? <M>{t`b \leftarrow b-a`}</M> : tr('Start', 'start')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="eu-div" aria-live="polite">
        <span className="lab">{tr('Gemeinsame Teiler von', 'Common divisors of')} <M>a</M> {tr('und', 'and')} <M p=":">b</M></span>
        {divs.map((d) => <span key={d} className={`chip${d === divs.at(-1) ? ' max' : ''}`}>{d}</span>)}
      </div>
      <div className="in-controls">
        <button type="button" className="motion-btn" onClick={() => { setPlay(false); setI((k) => Math.max(0, k - 1)); }} disabled={i === 0}>‹ {tr('Zurück', 'Back')}</button>
        <button type="button" className="motion-btn primary" onClick={() => { setPlay(false); setI((k) => Math.min(last, k + 1)); }} disabled={i >= last}>{tr('Schritt', 'Step')} ›</button>
        <button type="button" className="motion-btn" onClick={() => { if (i >= last) setI(0); setPlay((p) => !p); }}>{play ? tr('Pause', 'Pause') : tr('Abspielen', 'Play')}</button>
        <button type="button" className="motion-btn" onClick={() => { setI(0); setPlay(false); }}>↺</button>
        <span className="in-counter">{i >= last
          ? <>{tr('Fertig:', 'Done:')} <M>{t`a = b = ${cur.a}`}</M></>
          : tr(`Schritt ${i} von ${last}`, `Step ${i} of ${last}`)}</span>
      </div>
    </figure>
  );
}
