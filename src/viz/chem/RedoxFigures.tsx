import { useMemo, useState, type ReactNode } from 'react';
import { C } from '../../components/Chem';
import { M } from '../../components/Tex';
import { chemTex } from '../../chem/tex';
import { tex as fracTex, num } from '../../linalg/frac';
import { SERIES, acidMolecular, acidNet, displacement } from '../../chem/activity';
import { parseFormula } from '../../chem/formula';
import { oxidationNumbers, type Rule } from '../../chem/oxnum';
import { ACIDS, BASES, neutralisation } from '../../chem/precip';
import { useTr } from '../../i18n';
import { AnimFigure } from '../anim/AnimFigure';
import { Presets, Slider } from './ChControls';
import { acidScene, dispScene, N_ACID } from './redoxScenes';
import './chem.css';
import './loes.css';

// ---------------------------------------------------------------- acid strength (slides 17, 19)
export function AcidStrength() {
  const tr = useTr();
  const [split, setSplit] = useState(10);
  const scene = useMemo(() => acidScene(split), [split]);
  return (
    <figure className="chfig">
      <div className="chfig-body">
        <Presets label={tr('Beispiel', 'Example')} value={split === 10 ? 'strong' : split === 2 ? 'weak' : null} onPick={(k) => setSplit(k === 'strong' ? 10 : 2)}
          items={[{ id: 'strong', label: <span>{tr('starke Säure', 'strong acid')} (<C>HCl</C>)</span> }, { id: 'weak', label: <span>{tr('schwache Säure', 'weak acid')} (<C>HF</C>)</span> }]} />
        <AnimFigure build={() => scene} step={0} t={1} />
      </div>
      <div className="chfig-ctl">
        <Slider label={<span>{tr('gespalten', 'split')}</span>} min={0} max={N_ACID} step={1} value={split} onChange={setSplit} aria={tr('Wie viele Säuremoleküle ihr Wasserstoff-Ion abgeben', 'how many acid molecules release their hydrogen ion')} show={<span>{split} / {N_ACID}</span>} />
        <p className="chfig-note">{tr(<>Je mehr Moleküle ihr <C>H^+</C> abgeben, desto mehr <C>H^+</C> in der Lösung und desto stärker die Säure. Die Zahlen sind nur ein Bild, keine Messwerte (der pH-Wert kommt in Vorlesung 13).</>, <>The more molecules release their <C>H^+</C>, the more <C>H^+</C> in the solution and the stronger the acid. The numbers are only a picture, not measured values (pH comes in lecture 13).</>)}</p>
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------- neutralisation lab (slides 17–21, exercise 3)
export function NeutralLab() {
  const tr = useTr();
  const [a, setA] = useState('HCl'), [b, setB] = useState('NaOH');
  const acid = ACIDS.find((x) => x.f === a)!, base = BASES.find((x) => x.f === b)!;
  const n = neutralisation(acid, base);
  return (
    <figure className="chfig">
      <div className="chfig-body">
        <div className="ion-pick"><b>{tr('Säure', 'Acid')}</b><Presets label={tr('Säure', 'Acid')} value={a} onPick={setA} items={ACIDS.map((x) => ({ id: x.f, label: <C>{x.f}</C> }))} /></div>
        <div className="ion-pick"><b>{tr('Base', 'Base')}</b><Presets label={tr('Base', 'Base')} value={b} onPick={setB} items={BASES.map((x) => ({ id: x.f, label: <C>{x.f}</C> }))} /></div>
        <div role="status">
          <div className="lab-eq"><b>{tr('Molekulare Gleichung', 'Molecular equation')}</b><M>{chemTex(n.molecular)}</M></div>
          <div className="lab-eq"><b>{tr('Vollständige Ionengleichung', 'Complete ionic equation')}</b><M>{chemTex(n.complete)}</M></div>
          <div className="lab-eq"><b>{tr('Nettoionengleichung', 'Net ionic equation')}</b><M>{chemTex(n.net)}</M></div>
        </div>
        <p className="chfig-note">
          {base.cation === null ? tr(<>Ammoniak enthält kein <C>OH^-</C> und nimmt das <C>H^+</C> trotzdem auf: Es ist eine Base. Es entsteht nur das Salz, kein Wasser.</>, <>Ammonia contains no <C>OH^-</C> and still takes up the <C>H^+</C>: it is a base. Only the salt forms, no water.</>)
            : n.baseSolid ? tr('Diese Base ist unlöslich (Tabelle): Sie bleibt in der Nettogleichung als Feststoff stehen.', 'This base is insoluble (chart): it stays in the net equation as a solid.')
            : n.saltSolid ? tr('Das Salz ist unlöslich: Es fällt aus, und es gibt keine Zuschauer-Ionen.', 'The salt is insoluble: it precipitates, and there are no spectator ions.')
            : tr(<>Das Salz bleibt gelöst. Die Zuschauer-Ionen fallen in der Nettogleichung weg, es bleibt <C>{'H^+ + OH^- -> H2O'}</C></>, <>The salt stays dissolved. The spectator ions drop out of the net equation; what remains is <C>{'H^+ + OH^- -> H2O'}</C></>)}
        </p>
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------- oxidation numbers (slide 26, exercise 3)
const OX_PRESETS: { f: string; q: number }[] = [
  { f: 'H2O', q: 0 }, { f: 'MgCl2', q: 0 }, { f: 'CO2', q: 0 }, { f: 'NH3', q: 0 }, { f: 'NaH', q: 0 }, { f: 'H2O2', q: 0 }, { f: 'SO4', q: -2 },
  { f: 'Fe(NO3)2', q: 0 }, { f: 'KMnO4', q: 0 }, { f: 'Cr2O7', q: -2 }, { f: 'NH4', q: 1 }, { f: 'O2', q: 0 },
];
const RULE: Record<Rule, [ReactNode, ReactNode]> = {
  elemental: ['Element in reiner Form: 0', 'atom in elemental form: 0'],
  monatomic: ['einatomiges Ion: Ionenladung', 'monatomic ion: ionic charge'],
  F: [<><C>F</C>: immer <M>-1</M></>, <><C>F</C>: always <M>-1</M></>],
  O: [<><C>O</C>: <M>-2</M></>, <><C>O</C>: <M>-2</M></>],
  peroxide: [<>Peroxid: <C>O</C> ist <M>-1</M></>, <>peroxide: <C>O</C> is <M>-1</M></>],
  H: [<><C>H</C>: <M>+1</M></>, <><C>H</C>: <M>+1</M></>],
  hydride: [<><C>H</C> an einem Metall: <M>-1</M></>, <><C>H</C> bonded to a metal: <M>-1</M></>],
  halogen: [<><C>Cl</C>, <C>Br</C>, <C>I</C>: <M>-1</M></>, <><C>Cl</C>, <C>Br</C>, <C>I</C>: <M>-1</M></>],
  group1: [<>Alkalimetall (und Ag): <M>+1</M> (Ionentabelle)</>, <>alkali metal (and Ag): <M>+1</M> (ion table)</>],
  group2: [<>Erdalkalimetall (und Zn, Cd): <M>+2</M> (Ionentabelle)</>, <>alkaline earth metal (and Zn, Cd): <M>+2</M> (ion table)</>],
  metal3: [<><C>Al</C>: <M>+3</M> (Ionentabelle)</>, <><C>Al</C>: <M>+3</M> (ion table)</>],
  sum: ['der Rest folgt aus der Summe: sie ergibt die Gesamtladung', 'the rest follows from the sum: it gives the net charge'],
};
const signed = (x: number) => (x > 0 ? `+${x}` : x < 0 ? `-${-x}` : '0');

export function OxNumCalc() {
  const tr = useTr();
  const [text, setText] = useState('H2SO4');
  const [q, setQ] = useState(0);
  let res: ReturnType<typeof oxidationNumbers> = null, bad = false;
  let order: string[] = [];
  try { order = Object.keys(parseFormula(text)); res = oxidationNumbers(text, q); } catch { bad = true; }
  const charge = (n: number) => `${n === 0 ? '' : n > 0 ? '^' + (n === 1 ? '' : n) + '+' : '^' + (n === -1 ? '' : -n) + '-'}`;
  const total = res ? order.reduce((s, e) => s + num(res![e].value) * res![e].count, 0) : 0;
  return (
    <figure className="chfig">
      <div className="chfig-body">
        <Presets label={tr('Beispiele', 'Examples')} value={OX_PRESETS.find((p) => p.f === text && p.q === q)?.f ?? null} onPick={(f) => { const p = OX_PRESETS.find((x) => x.f === f)!; setText(p.f); setQ(p.q); }}
          items={OX_PRESETS.map((p) => ({ id: p.f, label: <C>{p.f + charge(p.q)}</C> }))} />
        <div className="ox-in">
          <label>{tr('Formel', 'Formula')}: <input value={text} onChange={(e) => setText(e.target.value)} aria-label={tr('Formel ohne Ladung', 'formula without charge')} /></label>
          <label>{tr('Ladung', 'Charge')}: <Presets label={tr('Ladung', 'Charge')} value={q} onPick={setQ} items={[-3, -2, -1, 0, 1, 2].map((v) => ({ id: v, label: <M>{signed(v)}</M> }))} /></label>
        </div>
        {bad || !res ? <p className="chfig-bad">{tr('Diese Formel kann ich so nicht auswerten (Gross-/Kleinschreibung prüfen; mehrere unbekannte Elemente gehen nur mit Klammern wie Fe(NO3)2).', 'I cannot evaluate this formula (check capital letters; several unknown elements work only with brackets like Fe(NO3)2).')}</p> : (
          <>
            <div className="ox-row" role="group" aria-label={tr('Oxidationszahlen', 'oxidation numbers')}>
              {order.map((e) => {
                const v = num(res![e].value);
                const c = res![e].count;
                return (
                  <div className="ox-col" key={e}>
                    <span><C>{c > 1 ? e + c : e}</C></span>
                    <span className={`ox-num ${v > 0 ? 'pos' : v < 0 ? 'neg' : 'zero'}`}><M>{Number.isInteger(v) ? signed(v) : (v < 0 ? '-' : '+') + fracTex(res![e].value).replace('-', '')}</M></span>
                  </div>
                );
              })}
            </div>
            <ul className="chfig-note">
              {order.map((e) => <li key={e}><C>{e}</C>: {tr(...RULE[res![e].rule])}</li>)}
            </ul>
            <p className="chfig-status chfig-ok">{tr('Kontrolle: Die Summe aller Oxidationszahlen (Zahl der Atome mal Oxidationszahl) ist', 'Check: the sum of all oxidation numbers (number of atoms times oxidation number) is')} <M p=".">{String.raw`${q === 0 ? '0' : signed(q)}`}</M> {Math.abs(total - q) < 1e-9 ? tr('Das ist die Gesamtladung.', 'This is the net charge.') : ''}</p>
          </>
        )}
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------- activity series (slides 27–28, exercise 3)
const ELEC = (m: { symbol: string; z: number }) => (m.symbol === 'H' ? 'H2(g) -> 2 H^+(aq) + 2 e^-' : `${m.symbol}(s) -> ${m.symbol}^${m.z === 1 ? '' : m.z}+(aq) + ${m.z === 1 ? '' : m.z + ' '}e^-`);

export function ActivityLab() {
  const tr = useTr(), lang = tr('de', 'en') as 'de' | 'en';
  const [m, setM] = useState('Cu'), [c, setC] = useState('Ag');
  const scene = useMemo(() => dispScene(m, c, lang), [m, c, lang]);
  const eq = c === 'H' ? acidNet(m) : displacement(m, c);
  const metals = SERIES.filter((x) => x.symbol !== 'H');
  return (
    <figure className="chfig">
      <div className="chfig-body">
        <div className="act-ladder" role="list" aria-label={tr('Aktivitätsreihe', 'activity series')}>
          <div className="act-arrow">{tr('↓ leicht zu oxidieren (oben) … schwer zu oxidieren (unten)', '↓ easy to oxidise (top) … hard to oxidise (bottom)')}</div>
          {SERIES.map((x, i) => (
            <button key={x.symbol} type="button" role="listitem" className={`act-row${x.symbol === 'H' ? ' h' : ''}${x.symbol === m ? ' sel-m' : ''}${x.symbol === c ? ' sel-c' : ''}`}
              onClick={() => { if (x.symbol !== 'H') setM(x.symbol); }} aria-label={`${x.symbol}`}>
              <span className="act-arrow">{i + 1}</span>
              <span><C>{x.symbol === 'H' ? 'H2' : x.symbol}</C></span>
              <span><M>{chemTex(ELEC(x))}</M></span>
              <span className="act-arrow">{x.symbol === m ? tr('Metall', 'metal') : x.symbol === c ? tr('Ion', 'ion') : ''}</span>
            </button>
          ))}
        </div>
        <div className="ion-pick"><b>{tr('Metall (Feststoff) in die Lösung stellen', 'Put the metal (solid) into the solution')}</b>
          <Presets label={tr('Metall', 'Metal')} value={m} onPick={setM} items={metals.map((x) => ({ id: x.symbol, label: <C>{x.symbol}</C> }))} /></div>
        <div className="ion-pick"><b>{tr('… von diesem Kation oder von einer Säure', '… of this cation or of an acid')}</b>
          <Presets label={tr('Kation', 'Cation')} value={c} onPick={setC} items={[{ id: 'H', label: <span><C>H^+</C> ({tr('Säure', 'acid')})</span> }, ...metals.map((x) => ({ id: x.symbol, label: <C>{`${x.symbol}^${x.z === 1 ? '' : x.z}+`}</C> }))]} /></div>
        <AnimFigure build={() => scene} step={0} t={1} />
        {m === c ? <p className="chfig-bad">{tr('Dasselbe Metall mit seinem eigenen Ion: nichts passiert.', 'The same metal with its own ion: nothing happens.')}</p> : eq ? (
          <div role="status">
            <div className="lab-eq"><b>{tr('Nettoionengleichung', 'Net ionic equation')}</b><M>{chemTex(eq.eq)}</M></div>
            {c === 'H' && <div className="lab-eq"><b>{tr('mit Salzsäure', 'with hydrochloric acid')}</b><M>{chemTex(acidMolecular(m)!)}</M></div>}
            <p className="chfig-ok">{tr(<>Reaktion: <C>{m}</C> steht über {c === 'H' ? <C>H2</C> : <C>{c}</C>} in der Reihe, gibt also Elektronen ab. Insgesamt wandern <M>{String.raw`${eq.electrons}`}</M> Elektronen.</>,
              <>Reaction: <C>{m}</C> sits above {c === 'H' ? <C>H2</C> : <C>{c}</C>} in the series, so it gives up electrons. In total <M>{String.raw`${eq.electrons}`}</M> electrons move.</>)}</p>
          </div>
        ) : (
          <p className="chfig-bad" role="status">{tr(<>Keine Reaktion («NR»): <C>{m}</C> steht unter {c === 'H' ? <C>H2</C> : <C>{c}</C>} in der Reihe. Das Kation ist das «schwerere» Metall-Ion und nimmt keine Elektronen von <C>{m}</C> auf.</>,
            <>No reaction (“NR”): <C>{m}</C> sits below {c === 'H' ? <C>H2</C> : <C>{c}</C>} in the series. It is harder to oxidise than the other, so it does not give electrons to the ion.</>)}</p>
        )}
        <p className="chfig-note">{tr(<>Regel der Folie: Jedes Metall kann von den Kationen unter ihm in der Reihe oxidiert werden. Jedes Metall über Wasserstoff reagiert mit Säure zu <C>H2</C></>, <>Rule of the slide: any metal can be oxidised by the metal cations below it in the series. Any metal above hydrogen reacts with an acid to form <C>H2</C></>)}</p>
      </div>
    </figure>
  );
}
