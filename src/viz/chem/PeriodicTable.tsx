import { memo, useState } from 'react';
import { C } from '../../components/Chem';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { FAMILY_NAMES, PERIODIC, type Family, type PCell } from '../../chem/periodic';
import { Presets } from './ChControls';
import './chem.css';
import './periodic.css';

type Mode = 'class' | 'family';

const Cell = memo(function Cell({ e, mode, sel, onPick }: { e: PCell; mode: Mode; sel: boolean; onPick: (Z: number) => void }) {
  return (
    <button
      type="button"
      className={`pt-cell ${mode === 'class' ? `cls-${e.cls}` : `fam-${e.family}`}${sel ? ' sel' : ''}`}
      style={{ gridRow: e.row, gridColumn: e.col }}
      aria-pressed={sel}
      aria-label={`${e.Z} ${e.symbol}`}
      onClick={() => onPick(e.Z)}
      onMouseEnter={() => onPick(e.Z)}
    >
      <span className="pt-z">{e.Z}</span>
      <span className="pt-sym"><C>{e.symbol}</C></span>
    </button>
  );
});

const CLASS_NAMES: Record<PCell['cls'], [string, string]> = { metal: ['Metall', 'metal'], metalloid: ['Halbmetall', 'metalloid'], nonmetal: ['Nichtmetall', 'nonmetal'] };

/** The periodic table of lecture 1, slide 18: hover or tap an element; colour by metal / metalloid / nonmetal or by family (slide 19). */
export function PeriodicTable() {
  const tr = useTr(), lang = useLang();
  const [mode, setMode] = useState<Mode>('class');
  const [Z, setZ] = useState(19);
  const e = PERIODIC[Z - 1];
  const fams: Family[] = ['alkali', 'alkaline', 'transition', 'lanthanide', 'actinide', 'chalcogen', 'halogen', 'noble', 'other'];
  return (
    <figure className="chfig pt-fig">
      <div className="chfig-body">
        <Presets label={tr('Färbung', 'Colouring')} value={mode} onPick={setMode}
          items={[{ id: 'class' as Mode, label: tr('Metalle / Nichtmetalle', 'Metals / nonmetals') }, { id: 'family' as Mode, label: tr('Gruppennamen', 'Family names') }]} />
        <div className="pt-wrap">
          <div className="pt-grid" role="group" aria-label={tr('Periodensystem', 'Periodic table')}>
            {PERIODIC.map((c) => <Cell key={c.Z} e={c} mode={mode} sel={c.Z === Z} onPick={setZ} />)}
            {Array.from({ length: 18 }, (_, i) => <span key={`g${i}`} className="pt-gnum" style={{ gridRow: 1, gridColumn: i + 1 }} aria-hidden="true" />)}
          </div>
        </div>
        <div className="pt-legend ch-legend">
          {mode === 'class'
            ? (['metal', 'metalloid', 'nonmetal'] as const).map((k) => <span key={k}><i className={`pt-sw cls-${k}`} />{tr(...CLASS_NAMES[k])}</span>)
            : fams.map((f) => <span key={f}><i className={`pt-sw fam-${f}`} />{tr(...FAMILY_NAMES[f])}</span>)}
        </div>
      </div>
      <div className="chfig-ctl pt-detail" aria-live="polite">
        <div className={`pt-big ${mode === 'class' ? `cls-${e.cls}` : `fam-${e.family}`}`}>
          <span className="pt-big-z">{e.Z}</span>
          <span className="pt-big-sym"><C>{e.symbol}</C></span>
          <span className="pt-big-m">{fmtNum(e.mass, e.mass < 100 ? 3 : 2, lang)}</span>
        </div>
        <div className="pt-facts">
          <div><b>{lang === 'de' ? e.de : e.en}</b>{lang === 'de' ? <> <span className="ch-pill">{e.en}</span></> : <> <span className="ch-pill">{e.de}</span></>}</div>
          <div>{e.group > 0 ? <>{tr('Gruppe', 'Group')} {e.group}, </> : <>{tr('f-Block, ', 'f-block, ')}</>}{tr('Periode', 'period')} {e.period} · {tr(...CLASS_NAMES[e.cls])}{e.family !== 'other' ? <> · {tr(...FAMILY_NAMES[e.family])}</> : null}</div>
          <div><M>{String.raw`Z = ${e.Z}`}</M>{tr(': ', ': ')}{e.Z} <M>{String.raw`\mathrm{p}^{+}`}</M> {tr('und', 'and')} {e.Z} <M p=",">{String.raw`\mathrm{e}^{-}`}</M> {tr('wenn das Atom neutral ist', 'if the atom is neutral')}</div>
        </div>
      </div>
    </figure>
  );
}
