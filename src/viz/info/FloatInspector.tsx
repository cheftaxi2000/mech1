import { useState } from 'react';
import { useTr } from '../../i18n';
import { canonicalDecimal, exactDecimal, spacing, toFloat, typedDecimal } from '../../info/float';
import './info.css';

const PRESETS = ['0.5', '0.1', '1.1', '0.3', '16777217', '1e-3'];

const short = (s: string, n = 44) => (s.length > n ? `${s.slice(0, n)}…` : s);

/** What a decimal number becomes in a `float` and in a `double`: the exact value that is really stored. */
export function FloatInspector() {
  const tr = useTr();
  const [txt, setTxt] = useState('0.1');
  const x = typedDecimal(txt);
  const rows = x === undefined ? [] : (['float', 'double'] as const).map((kind) => {
    const v = kind === 'float' ? toFloat(x) : x;
    const exact = exactDecimal(v);
    return { kind, exact, same: canonicalDecimal(txt) === exact, gap: spacing(v, kind), v };
  });
  return (
    <figure className="vdemo in-fig fi-fig">
      <div className="v-presets" role="group" aria-label={tr('Beispiele', 'Examples')}>
        {PRESETS.map((p) => <button type="button" key={p} aria-pressed={p === txt} onClick={() => setTxt(p)}><code>{p}</code></button>)}
      </div>
      <label className="in-text">
        <span>{tr('Eine Dezimalzahl eingeben', 'Type a decimal number')}</span>
        <input type="text" inputMode="decimal" value={txt} maxLength={24} spellCheck={false} onChange={(e) => setTxt(e.target.value)} aria-label={tr('Zahl', 'Number')} />
      </label>
      {rows.length === 0 ? <div className="bx-say">{tr('Keine Zahl.', 'Not a number.')}</div> : (
        <table className="fi-table">
          <thead><tr><th>{tr('Typ', 'Type')}</th><th>{tr('Wirklich gespeichert (exakt)', 'Really stored (exact)')}</th><th>{tr('Abstand zum nächsten Nachbarn', 'Gap to the next neighbour')}</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.kind} className={r.same ? 'exact' : 'inexact'}>
                <td><code>{r.kind}</code></td>
                <td><code title={r.exact}>{short(r.exact)}</code> <span className={`fi-badge ${r.same ? 'ok' : 'no'}`}>{r.same ? tr('exakt', 'exact') : tr('gerundet', 'rounded')}</span></td>
                <td><code>{r.gap.toExponential(2)}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="vdemo-note">{tr('Zwischen zwei benachbarten Zahlen gibt es keine weitere: Alles dazwischen wird auf eine der beiden gerundet.', 'There is no further number between two neighbours: everything in between is rounded to one of the two.')}</p>
    </figure>
  );
}
