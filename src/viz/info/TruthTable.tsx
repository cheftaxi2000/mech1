import { useMemo, useState } from 'react';
import { M } from '../../components/Tex';
import { useTr } from '../../i18n';
import { dnf, equivalent, vector, vectorString } from '../../info/logic';
import './info.css';

const ROWS: [number, number][] = [[0, 0], [0, 1], [1, 0], [1, 1]];

/** Compare two boolean formulas row by row: equal columns mean equivalent formulas. */
export function TruthCompare({ presets }: { presets: [string, string][] }) {
  const tr = useTr();
  const [pi, setPi] = useState(0);
  const [a, setA] = useState(presets[0][0]), [b, setB] = useState(presets[0][1]);
  const res = useMemo(() => {
    try { return { va: vector(a), vb: vector(b), eq: equivalent(a, b) }; } catch (e) { return { error: (e as Error).message }; }
  }, [a, b]);
  return (
    <figure className="vdemo in-fig tt-fig">
      <div className="v-presets" role="group" aria-label={tr('Beispiele', 'Examples')}>
        {presets.map((p, i) => <button type="button" key={i} aria-pressed={i === pi} onClick={() => { setPi(i); setA(p[0]); setB(p[1]); }}>{i + 1}</button>)}
      </div>
      <div className="tt-inputs">
        <label className="in-text"><span>A</span><input type="text" value={a} spellCheck={false} onChange={(e) => setA(e.target.value)} aria-label={tr('Formel A', 'Formula A')} /></label>
        <label className="in-text"><span>B</span><input type="text" value={b} spellCheck={false} onChange={(e) => setB(e.target.value)} aria-label={tr('Formel B', 'Formula B')} /></label>
      </div>
      {'error' in res ? <div className="bx-say"><b className="tr-warn">{tr('Das kann ich nicht auswerten:', 'I cannot evaluate this:')}</b> {res.error}</div> : (
        <>
          <table className="tt-table">
            <thead><tr><th><M>x</M></th><th><M>y</M></th><th>A</th><th>B</th></tr></thead>
            <tbody>
              {ROWS.map(([x, y], i) => (
                <tr key={i} className={res.va[i] !== res.vb[i] ? 'diff' : ''}><td>{x}</td><td>{y}</td><td>{res.va[i] ? 1 : 0}</td><td>{res.vb[i] ? 1 : 0}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="bx-say" aria-live="polite">
            {res.eq ? <b className="tr-t">{tr('Gleichwertig: In jeder Zeile steht dasselbe.', 'Equivalent: every row is the same.')}</b> : <b className="tr-f">{tr('Nicht gleichwertig: Die markierten Zeilen unterscheiden sich.', 'Not equivalent: the marked rows differ.')}</b>}
            {' '}<code className="ic">{vectorString(res.va)}</code> / <code className="ic">{vectorString(res.vb)}</code>
          </div>
        </>
      )}
      <p className="vdemo-note">{tr('Erlaubt sind die Variablen', 'Allowed are the variables')} <M>x</M> {tr('und', 'and')} <M>y</M> {tr('sowie', 'as well as')} <code className="ic">! && || == !=</code> {tr('und Klammern.', 'and parentheses.')}</p>
    </figure>
  );
}

/** Theorem 4.1 as a toy: choose the output column, get a formula built exactly like in the proof. */
export function TruthBuilder() {
  const tr = useTr();
  const [v, setV] = useState<boolean[]>([false, true, true, false]);
  const f = dnf(v);
  return (
    <figure className="vdemo in-fig tt-fig">
      <table className="tt-table">
        <thead><tr><th><M>x</M></th><th><M>y</M></th><th>{tr('Ausgabe (anklicken)', 'output (click)')}</th></tr></thead>
        <tbody>
          {ROWS.map(([x, y], i) => (
            <tr key={i}><td>{x}</td><td>{y}</td><td><button type="button" className="tt-bit" aria-pressed={v[i]} onClick={() => setV((o) => o.map((b, k) => (k === i ? !b : b)))} aria-label={tr(`Zeile ${i + 1}: ${v[i] ? 1 : 0}`, `Row ${i + 1}: ${v[i] ? 1 : 0}`)}>{v[i] ? 1 : 0}</button></td></tr>
          ))}
        </tbody>
      </table>
      <div className="bx-say"><span>{tr('Jede Zeile mit Ausgabe 1 ergibt einen Term; alle Terme werden mit', 'Every row with output 1 gives a term; all terms are joined with')} <code className="ic">||</code> {tr('verbunden:', ':')}</span><br /><code className="ic tt-f-code">{f}</code>
        <br /><span className="tr-inl">{tr('Kontrolle: die Formel liefert', 'Check: the formula yields')} <code className="ic">{vectorString(vector(f))}</code> {vectorString(vector(f)) === vectorString(v) ? <b className="tr-t">✓</b> : <b className="tr-f">✗</b>}</span></div>
    </figure>
  );
}
