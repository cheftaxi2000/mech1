import { useState } from 'react';
import { useTr } from '../../i18n';
import { fullParen } from '../../info/expr';
import './info.css';

/** Type an expression, see the parenthesization the compiler uses (computed from the precedence rules, never typed by hand). */
export function ParenView({ presets }: { presets: string[] }) {
  const tr = useTr();
  const [src, setSrc] = useState(presets[0]);
  let out: string | null = null, err = false;
  try { out = fullParen(src); } catch { err = true; }
  return (
    <figure className="vdemo in-fig pv-fig">
      <div className="v-presets" role="group" aria-label={tr('Beispiele', 'Examples')}>
        {presets.map((p, i) => <button type="button" key={p} aria-pressed={p === src} onClick={() => setSrc(p)}>{i + 1}</button>)}
      </div>
      <label className="in-text"><span>{tr('Ausdruck', 'Expression')}</span><input type="text" value={src} spellCheck={false} onChange={(e) => setSrc(e.target.value)} aria-label={tr('Ausdruck', 'Expression')} style={{ flex: 1, width: 'auto', minWidth: '14em' }} /></label>
      <div className="bx-say" aria-live="polite">
        {err ? <b className="tr-warn">{tr('Das ist kein gültiger Ausdruck.', 'This is not a valid expression.')}</b> : <><span>{tr('Der Compiler liest:', 'The compiler reads:')}</span> <code className="ic">{out}</code></>}
      </div>
    </figure>
  );
}
