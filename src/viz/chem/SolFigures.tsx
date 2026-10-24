import { useMemo, useState } from 'react';
import { C } from '../../components/Chem';
import { M } from '../../components/Tex';
import { chemTex } from '../../chem/tex';
import { ANIONS, CATIONS, ionicFormula, ionStr, type Ion } from '../../chem/ions';
import { metathesis } from '../../chem/precip';
import { solubility } from '../../chem/solubility';
import { fmtNum, useLang, useTr } from '../../i18n';
import { AnimFigure } from '../anim/AnimFigure';
import { Presets, Slider } from './ChControls';
import { SUBSTANCES, electrolyteScene, molarityScene } from './solScenes';
import './chem.css';
import './loes.css';

const cat = (f: string, z: number) => CATIONS.find((c) => c.f === f && c.z === z)!;
const an = (f: string, z: number) => ANIONS.find((a) => a.f === f && a.z === z)!;

// ---------------------------------------------------------------- electrolyte or not (slides 9, 11)
export function ElectrolyteBeaker() {
  const tr = useTr();
  const [id, setId] = useState('NaCl');
  const sub = SUBSTANCES.find((s) => s.id === id)!;
  const scene = useMemo(() => electrolyteScene(sub), [sub]);
  const NAME: Record<string, [string, string]> = { sucrose: ['Zucker', 'sugar'], ethanol: ['Ethanol', 'ethanol'], water: ['reines Wasser', 'pure water'] };
  return (
    <figure className="chfig">
      <div className="chfig-body">
        <Presets label={tr('Stoff im Wasser', 'Substance in water')} value={id} onPick={setId}
          items={SUBSTANCES.map((s) => ({ id: s.id, label: s.kind === 'molecular' ? <span><C>{s.formula}</C></span> : <C>{s.formula}</C> }))} />
        <AnimFigure build={() => scene} step={0} t={1} />
        <p className={`chfig-status ${sub.kind === 'ionic' ? 'chfig-ok' : 'chfig-note'}`} role="status">
          {sub.kind === 'ionic' ? tr(<>Elektrolyt: Der Stoff zerfällt in Ionen, die Lampe leuchtet.</>, <>Electrolyte: the substance splits into ions, the lamp lights up.</>)
            : sub.kind === 'molecular' ? tr(<>Nichtelektrolyt ({tr(NAME[sub.id][0], NAME[sub.id][1])}): ganze Moleküle, keine Ionen, die Lampe bleibt dunkel.</>, <>Nonelectrolyte ({NAME[sub.id][1]}): whole molecules, no ions, the lamp stays dark.</>)
            : tr('Reines Wasser enthält praktisch keine Ionen: Die Lampe bleibt dunkel.', 'Pure water contains practically no ions: the lamp stays dark.')}
        </p>
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------- the solubility chart as an interactive checker (slide 16)
const CHART_CATS: [string, number][] = [['Na', 1], ['K', 1], ['NH4', 1], ['Ag', 1], ['Mg', 2], ['Ca', 2], ['Ba', 2], ['Pb', 2], ['Zn', 2], ['Cu', 2], ['Fe', 3], ['Al', 3]];
const CHART_ANS: [string, number][] = [['NO3', -1], ['CH3COO', -1], ['Cl', -1], ['Br', -1], ['I', -1], ['SO4', -2], ['S', -2], ['CO3', -2], ['PO4', -3], ['OH', -1]];

export function SolubilityChart() {
  const tr = useTr();
  const [sel, setSel] = useState<[string, number, string, number]>(['Ag', 1, 'Cl', -1]);
  const c = cat(sel[0], sel[1]), a = an(sel[2], sel[3]);
  const v = solubility(c, a);
  const f = ionicFormula(c, a).formula;
  const group = (i: string) => (['Na', 'K'].includes(i) ? tr('Alkalimetall-Kationen', 'alkali metal cations') : i);
  void group;
  return (
    <figure className="chfig">
      <div className="chfig-body">
        <div className="ch-scroll">
          <table className="sol-chart" aria-label={tr('Löslichkeitstabelle', 'solubility chart')}>
            <thead>
              <tr><th />{CHART_CATS.map(([f0, z]) => <th key={f0 + z}><C>{ionStr({ f: f0, z })}</C></th>)}</tr>
            </thead>
            <tbody>
              {CHART_ANS.map(([af, az]) => (
                <tr key={af}>
                  <th><C>{ionStr({ f: af, z: az })}</C></th>
                  {CHART_CATS.map(([cf, cz]) => {
                    const r = solubility(cat(cf, cz), an(af, az));
                    const on = sel[0] === cf && sel[1] === cz && sel[2] === af && sel[3] === az;
                    return (
                      <td key={cf + cz}>
                        <button type="button" className={`sol-cell ${r.soluble ? 'yes' : 'no'}${r.exception ? ' exc' : ''}`} aria-pressed={on}
                          aria-label={`${ionicFormula(cat(cf, cz), an(af, az)).formula}: ${r.soluble ? tr('löslich', 'soluble') : tr('unlöslich', 'insoluble')}`}
                          onClick={() => setSel([cf, cz, af, az])} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ch-legend">
          <span><i className="neu" style={{ background: 'color-mix(in srgb, var(--ch-v) 40%, var(--panel))', color: 'var(--ch-v)' }} />{tr('löslich', 'soluble')}</span>
          <span><i className="neu" style={{ background: 'color-mix(in srgb, var(--ch-e) 55%, var(--panel))', color: 'var(--ch-e)' }} />{tr('unlöslich (Niederschlag)', 'insoluble (precipitate)')}</span>
          <span>{tr('Doppelter Rand: eine «Ausnahme» der Regel', 'Double rim: an “exception” to the rule')}</span>
        </div>
        <div className="chfig-info" role="status">
          <span><C>{f}</C>: <b className={v.soluble ? 'chfig-ok' : 'chfig-bad'}>{v.soluble ? tr('löslich', 'soluble') : tr('unlöslich', 'insoluble')}</b></span>
          <span style={{ whiteSpace: 'normal' }}>
            {v.exception
              ? (v.soluble
                ? tr(<>Verbindungen mit <C>{ionStr(a)}</C> lösen sich normalerweise nicht – aber <C>{ionStr(c)}</C> ist eine Ausnahme.</>, <>Compounds with <C>{ionStr(a)}</C> normally do not dissolve – but <C>{ionStr(c)}</C> is an exception.</>)
                : tr(<>Verbindungen mit <C>{ionStr(a)}</C> lösen sich normalerweise – aber <C>{ionStr(c)}</C> ist eine Ausnahme.</>, <>Compounds with <C>{ionStr(a)}</C> normally dissolve – but <C>{ionStr(c)}</C> is an exception.</>))
              : (v.soluble
                ? tr(<>Verbindungen mit <C>{ionStr(a)}</C> lösen sich (hier keine Ausnahme).</>, <>Compounds with <C>{ionStr(a)}</C> dissolve (no exception here).</>)
                : tr(<>Verbindungen mit <C>{ionStr(a)}</C> lösen sich nicht (hier keine Ausnahme).</>, <>Compounds with <C>{ionStr(a)}</C> do not dissolve (no exception here).</>))}
          </span>
        </div>
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------- mixing two solutions (slides 13–16, exercise 3)
const LAB_CATS = CHART_CATS.filter(([f0]) => f0 !== 'Al');
const LAB_ANS = CHART_ANS.filter(([f0]) => f0 !== 'S');
type Pair = [string, number];

export function PrecipLab() {
  const tr = useTr();
  const [A, setA] = useState<Pair>(['Ag', 1]), [X, setX] = useState<Pair>(['NO3', -1]), [B, setB] = useState<Pair>(['K', 1]), [Y, setY] = useState<Pair>(['Cl', -1]);
  const iA = cat(...A), iB = cat(...B), iX = an(...X), iY = an(...Y);
  const row = (label: string, list: Pair[], val: Pair, set: (p: Pair) => void, kind: 'c' | 'a') => (
    <div className="ion-pick">
      <b>{label}</b>
      <div className="ion-row" role="group" aria-label={label}>
        {list.map((p) => {
          const ion = kind === 'c' ? cat(...p) : an(...p);
          return <button key={ionStr(ion)} type="button" className="ion-btn bold" aria-pressed={p[0] === val[0] && p[1] === val[1]} onClick={() => set(p)}><C>{ionStr(ion)}</C></button>;
        })}
      </div>
    </div>
  );
  const s1 = solubility(iA, iX), s2 = solubility(iB, iY);
  const same = (iA.f === iB.f && iA.z === iB.z) || (iX.f === iY.f && iX.z === iY.z);
  const ok = s1.soluble === true && s2.soluble === true && !same;
  const m = ok ? metathesis(iA, iX, iB, iY) : null;
  const f1 = ionicFormula(iA, iX).formula, f2 = ionicFormula(iB, iY).formula;
  return (
    <figure className="chfig">
      <div className="chfig-body">
        {row(tr('Lösung 1: Kation', 'Solution 1: cation'), LAB_CATS, A, setA, 'c')}
        {row(tr('Lösung 1: Anion', 'Solution 1: anion'), LAB_ANS, X, setX, 'a')}
        {row(tr('Lösung 2: Kation', 'Solution 2: cation'), LAB_CATS, B, setB, 'c')}
        {row(tr('Lösung 2: Anion', 'Solution 2: anion'), LAB_ANS, Y, setY, 'a')}
        <div className="chfig-info">
          <span>{tr('Lösung 1', 'Solution 1')}: <C>{f1}</C> <b className={s1.soluble ? 'chfig-ok' : 'chfig-bad'}>{s1.soluble ? tr('löst sich', 'dissolves') : tr('löst sich nicht', 'does not dissolve')}</b></span>
          <span>{tr('Lösung 2', 'Solution 2')}: <C>{f2}</C> <b className={s2.soluble ? 'chfig-ok' : 'chfig-bad'}>{s2.soluble ? tr('löst sich', 'dissolves') : tr('löst sich nicht', 'does not dissolve')}</b></span>
        </div>
        {!ok && <p className="chfig-bad" role="status">{same ? tr('Wähle zwei verschiedene Kationen und zwei verschiedene Anionen.', 'Choose two different cations and two different anions.')
          : tr('Ein gewählter Stoff löst sich nicht in Wasser, also gibt es keine Lösung zum Mischen. Wähle ein anderes Paar.', 'One of the chosen compounds does not dissolve in water, so there is no solution to mix. Choose another pair.')}</p>}
        {m && (
          <div role="status">
            <div className="lab-eq"><b>{tr('Molekulare Gleichung', 'Molecular equation')}</b><M>{chemTex(m.molecular)}</M></div>
            <div className="lab-eq"><b>{tr('Vollständige Ionengleichung', 'Complete ionic equation')}</b><M>{chemTex(m.complete)}</M></div>
            {m.reacts
              ? <div className="lab-eq"><b>{tr('Nettoionengleichung', 'Net ionic equation')}</b><M>{chemTex(m.net)}</M></div>
              : <p className="chfig-bad">{tr('Beide Produkte lösen sich: Alle Ionen bleiben gelöst, es gibt keine Reaktion («NR»). Die Ionen mischen sich nur.', 'Both products dissolve: all ions stay dissolved, there is no reaction (“NR”). The ions only mix.')}</p>}
            <div className="chfig-info">
              <span>{tr('Zuschauer-Ionen', 'Spectator ions')}: {m.spectatorKeys.map((k) => <span key={k}> <M p={m.spectatorKeys.indexOf(k) < m.spectatorKeys.length - 1 ? ',' : ''}>{chemTex(k)}</M></span>)}</span>
              {m.reacts && <span>{tr('Niederschlag', 'Precipitate')}: {m.precipitates.map((p) => <C key={p.f}>{p.f}</C>)}</span>}
            </div>
          </div>
        )}
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------- molarity (slide 29, exercise 3 example 1)
export function DilutionFigure() {
  const tr = useTr(), lang = useLang();
  const [n, setN] = useState(0.5), [V, setV] = useState(1);
  const scene = useMemo(() => molarityScene(n, V, lang), [n, V, lang]);
  const c = n / V;
  return (
    <figure className="chfig">
      <div className="chfig-body">
        <AnimFigure build={() => scene} step={0} t={1} />
      </div>
      <div className="chfig-ctl">
        <Slider label={<M>n</M>} min={0.05} max={1.2} step={0.05} value={n} onChange={setN} aria={tr('Stoffmenge des gelösten Stoffs', 'amount of dissolved substance')} show={<M>{String.raw`${fmtNum(n, 2, lang, true)}\,\mathrm{mol}`}</M>} />
        <Slider label={<M>V</M>} min={0.1} max={2} step={0.05} value={V} onChange={setV} aria={tr('Volumen der Lösung', 'volume of the solution')} show={<M>{String.raw`${fmtNum(V, 2, lang, true)}\,\mathrm{L}`}</M>} />
        <div className="chfig-info">
          <span><M>{String.raw`c = ${fmtNum(c, 2, lang, true)}\,\mathrm{M}`}</M></span>
          <span>{c > 1.5 ? tr('sehr konzentriert', 'very concentrated') : c < 0.3 ? tr('verdünnt', 'dilute') : tr('mittel', 'medium')}</span>
        </div>
        <p className="chfig-note">{tr('Stoffmenge gleich lassen und mehr Wasser zugeben (Volumen grösser): Die Punkte rücken auseinander, die Konzentration sinkt.', 'Keep the amount and add more water (larger volume): the dots move apart and the concentration falls.')}</p>
      </div>
    </figure>
  );
}

export type { Ion };
