import { useState } from 'react';
import { M } from '../../components/Tex';
import { useTr } from '../../i18n';
import { sigDigits } from '../../chem/gas';
import './gasfig.css';

const t = String.raw;
const EXAMPLES = ['63,29', '60,01', '0,002', '7,0', '0,070', '700'];

/** The TA's counting rules (exercise 2, p. 1): type or pick a number, the digits that count are highlighted. */
export function SigFigTool() {
  const tr = useTr();
  const [txt, setTxt] = useState('0,070');
  const r = sigDigits(txt);
  return (
    <figure className="vdemo gasfig sf-fig">
      <div className="v-presets" role="group" aria-label={tr('Beispiele der Übung', 'Examples of the exercise class')}>
        {EXAMPLES.map((e) => <button type="button" key={e} onClick={() => setTxt(e)} aria-pressed={txt === e}><M>{e.replace(',', '{,}')}</M></button>)}
      </div>
      <label className="sf-in">
        <span>{tr('Eine Zahl eingeben', 'Type a number')}</span>
        <input type="text" inputMode="decimal" value={txt} maxLength={16} spellCheck={false} onChange={(e) => setTxt(e.target.value)} aria-label={tr('Zahl', 'Number')} />
      </label>
      <div className="sf-digits" aria-hidden="true">
        {r.chars.map((c, i) => <span key={i} className={c.sig ? 'sf-d sig' : 'sf-d'}>{c.ch}</span>)}
      </div>
      <div className="gb-row sf-count">
        <span>{tr('Zählende Ziffern (SigFigs)', 'Significant digits (SigFigs)')}</span>
        <b><M>{t`${r.count}`}</M></b>
      </div>
    </figure>
  );
}
