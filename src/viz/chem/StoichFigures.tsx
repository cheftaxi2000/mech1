import { useMemo, useState } from 'react';
import { C } from '../../components/Chem';
import { M } from '../../components/Tex';
import { chemTex } from '../../chem/tex';
import { balance } from '../../chem/balance';
import { N_A } from '../../chem/constants';
import { bySymbol } from '../../chem/elements';
import { molarMass, parseFormula } from '../../chem/formula';
import { fmtNum, useLang, useTr } from '../../i18n';
import { Presets, Slider } from './ChControls';
import './chem.css';
import './stoich.css';

/** Scientific notation as TeX: 6.02 \times 10^{23} (German: decimal comma). */
export function sci(x: number, digits: number, de: boolean): string {
  if (x === 0) return '0';
  const e = Math.floor(Math.log10(Math.abs(x)));
  if (e >= -2 && e <= 4) return fmtNum(Number(x.toPrecision(digits)), Math.max(0, digits - 1 - e), de ? 'de' : 'en', true);
  const m = x / 10 ** e;
  return String.raw`${fmtNum(m, digits - 1, de ? 'de' : 'en', true)}\times 10^{${e}}`;
}

// ---------------------------------------------------------------- the balancer (slides 25–27, exercise 9)
const REACTIONS: { id: string; r: string[]; p: string[] }[] = [
  { id: 'water', r: ['H2', 'O2'], p: ['H2O'] },
  { id: 'meth', r: ['CH4', 'O2'], p: ['CO2', 'H2O'] },
  { id: 'nh3', r: ['N2', 'H2'], p: ['NH3'] },
  { id: 'rust', r: ['Fe', 'O2'], p: ['Fe2O3'] },
  { id: 'prop', r: ['C3H8', 'O2'], p: ['CO2', 'H2O'] },
  { id: 'ex9', r: ['CF4', 'Br2'], p: ['CBr4', 'F2'] },
];
const SQ_MAX = 24;

export function Balancer() {
  const tr = useTr();
  const [id, setId] = useState('water');
  const rx = REACTIONS.find((x) => x.id === id)!;
  const species = [...rx.r, ...rx.p];
  const [coef, setCoef] = useState<number[]>(() => species.map(() => 1));
  const pick = (k: string) => { setId(k); const r = REACTIONS.find((x) => x.id === k)!; setCoef([...r.r, ...r.p].map(() => 1)); };
  const set = (i: number, d: number) => setCoef((c) => c.map((v, k) => (k === i ? Math.max(1, Math.min(9, v + d)) : v)));
  const counts = useMemo(() => species.map((s) => parseFormula(s)), [species.join('|')]);
  const elements = [...new Set(counts.flatMap((c) => Object.keys(c)))];
  const side = (from: number, to: number, el: string) => counts.slice(from, to).reduce((s, c, k) => s + (c[el] ?? 0) * coef[from + k], 0);
  const nR = rx.r.length;
  const rows = elements.map((el) => ({ el, l: side(0, nR, el), r: side(nR, species.length, el) }));
  const ok = rows.every((r) => r.l === r.r);
  const eq = (cs: number[]) => {
    const f = (a: string[], off: number) => a.map((s, k) => `${cs[off + k] === 1 ? '' : `${cs[off + k]} `}${s}`).join(' + ');
    return `${f(rx.r, 0)} -> ${f(rx.p, nR)}`;
  };
  const sol = balance(rx.r, rx.p);
  const wrong = rows.filter((r) => r.l !== r.r);
  return (
    <figure className="chfig">
      <div className="chfig-body">
        <Presets label={tr('Reaktion', 'Reaction')} value={id} onPick={pick} items={REACTIONS.map((x) => ({ id: x.id, label: <C>{`${x.r.join(' + ')} -> ${x.p.join(' + ')}`}</C> }))} />
        <div className="bal-eq"><M>{chemTex(eq(coef))}</M></div>
        <div className="bal-ctl" role="group" aria-label={tr('Koeffizienten', 'Coefficients')}>
          {species.map((s, i) => (
            <div key={i} className="bal-one">
              <span className="bal-sp"><C>{s}</C></span>
              <button type="button" className="ch-btn sm" aria-label={tr(`${s} weniger`, `${s} fewer`)} onClick={() => set(i, -1)} disabled={coef[i] <= 1}><M>-</M></button>
              <b className="bal-n">{coef[i]}</b>
              <button type="button" className="ch-btn sm" aria-label={tr(`${s} mehr`, `${s} more`)} onClick={() => set(i, 1)} disabled={coef[i] >= 9}><M>+</M></button>
            </div>
          ))}
        </div>
        <div className="bal-ledger" aria-label={tr('Atombilanz', 'Atom ledger')}>
          <div className="bal-head"><span /><span>{tr('links', 'left')}</span><span>{tr('rechts', 'right')}</span></div>
          {rows.map((r) => (
            <div key={r.el} className="bal-row">
              <span className="bal-el"><C>{r.el}</C></span>
              <span className="bal-sq">{Array.from({ length: Math.min(r.l, SQ_MAX) }, (_, i) => <i key={i} className={i < r.r ? 'ok' : 'bad'} />)}<b>{r.l}</b></span>
              <span className="bal-sq">{Array.from({ length: Math.min(r.r, SQ_MAX) }, (_, i) => <i key={i} className={i < r.l ? 'ok' : 'bad'} />)}<b>{r.r}</b></span>
            </div>
          ))}
        </div>
        <p className={`chfig-status ${ok ? 'chfig-ok' : 'chfig-bad'}`} role="status">
          {ok ? tr('Ausgeglichen: auf beiden Seiten gleich viele Atome jeder Sorte.', 'Balanced: the same number of atoms of every kind on both sides.')
            : <>{tr('Noch nicht ausgeglichen: ', 'Not balanced yet: ')}{wrong.map((w, i) => <span key={w.el}>{i ? ', ' : ''}<C>{w.el}</C> {w.l} {tr('links', 'left')} / {w.r} {tr('rechts', 'right')}</span>)}</>}
        </p>
        <div className="chfig-row">
          <button type="button" className="ch-btn" onClick={() => sol && setCoef(sol)}>{tr('Lösung zeigen', 'Show solution')}</button>
          <button type="button" className="ch-btn" onClick={() => setCoef(species.map(() => 1))}>{tr('Zurücksetzen', 'Reset')}</button>
          <span className="chfig-note">{tr('Nur die Koeffizienten vor den Formeln ändern sich, nie die Indizes.', 'Only the coefficients in front of the formulae change, never the subscripts.')}</span>
        </div>
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------- grams ↔ moles ↔ molecules (slides 29–31)
const SUBSTANCES = ['H2', 'O2', 'H2O', 'CO2', 'NaCl', 'C', 'Fe', 'K'];
type Field = 'g' | 'n' | 'N';

export function MoleConverter() {
  const tr = useTr(), lang = useLang(), de = lang === 'de';
  const [formula, setFormula] = useState('H2O');
  const [custom, setCustom] = useState('');
  const [field, setField] = useState<Field>('g');
  const [text, setText] = useState('18.015');
  const active = custom.trim() || formula;
  let mass = NaN, err = false, comp: [string, number][] = [];
  try { mass = molarMass(active); comp = Object.entries(parseFormula(active)); } catch { err = true; }
  const x = Number(text.replace(',', '.').replace(/\s/g, ''));
  const valid = !err && Number.isFinite(x) && x >= 0;
  const g = !valid ? NaN : field === 'g' ? x : field === 'n' ? x * mass : (x / N_A) * mass;
  const n = !valid ? NaN : field === 'n' ? x : g / mass;
  const N = !valid ? NaN : field === 'N' ? x : n * N_A;
  const shown = (f: Field) => (f === field ? text : !valid ? '' : String(Number((f === 'g' ? g : f === 'n' ? n : N).toPrecision(5))));
  const onEdit = (f: Field, v: string) => { setField(f); setText(v); };
  const sum = comp.map(([s, k]) => `${k === 1 ? '' : `${k}\\cdot `}${fmtNum(bySymbol(s).mass, 3, lang, true)}`).join(' + ');
  const bars = SUBSTANCES.map((s) => ({ s, m: molarMass(s) }));
  const maxM = Math.max(...bars.map((b) => b.m));
  return (
    <figure className="chfig">
      <div className="chfig-body">
        <Presets label={tr('Stoff', 'Substance')} value={custom.trim() ? null : formula} onPick={(s) => { setFormula(s); setCustom(''); setField('n'); setText('1'); }} items={SUBSTANCES.map((s) => ({ id: s, label: <C>{s}</C> }))} />
        <label className="mc-custom">{tr('oder eigene Formel:', 'or your own formula:')}{' '}
          <input value={custom} placeholder="Ca(OH)2" onChange={(e) => setCustom(e.target.value)} aria-label={tr('eigene Formel', 'own formula')} />
        </label>
        {err ? <p className="chfig-bad">{tr('Diese Formel verstehe ich nicht (Gross-/Kleinschreibung der Elemente und Klammern prüfen).', 'I do not understand this formula (check capital letters and brackets).')}</p> : (
          <>
            <div className="mc-grid">
              <label><span>{tr('Masse', 'Mass')} <M>m</M></span><input inputMode="decimal" value={shown('g')} onChange={(e) => onEdit('g', e.target.value)} aria-label={tr('Masse in Gramm', 'mass in grams')} /><span><M>{String.raw`\mathrm{g}`}</M></span></label>
              <label><span>{tr('Stoffmenge', 'Amount')} <M>n</M></span><input inputMode="decimal" value={shown('n')} onChange={(e) => onEdit('n', e.target.value)} aria-label={tr('Stoffmenge in Mol', 'amount in moles')} /><span><M>{String.raw`\mathrm{mol}`}</M></span></label>
              <label><span>{tr('Teilchen', 'Particles')} <M>N</M></span><input inputMode="decimal" value={shown('N')} onChange={(e) => onEdit('N', e.target.value)} aria-label={tr('Anzahl Teilchen', 'number of particles')} /><span>{tr('Stück', 'items')}</span></label>
            </div>
            <div className="chfig-info">
              <span><M>{String.raw`M(${chemTex(active)}) = ${sum} = ${fmtNum(mass, 3, lang, true)}\,\mathrm{g\,mol^{-1}}`}</M></span>
            </div>
            {valid && <div className="chfig-info">
              <span><M p=",">{String.raw`n = m/M = ${sci(n, 3, de)}\,\mathrm{mol}`}</M></span>
              <span><M p=".">{String.raw`N = n\,N_\mathrm{A} = ${sci(N, 3, de)}`}</M></span>
            </div>}
          </>
        )}
        <div className="mc-bars" aria-label={tr('Molare Masse verschiedener Stoffe', 'molar mass of different substances')}>
          {bars.map((b) => (
            <div key={b.s} className={`mc-bar${b.s === active ? ' on' : ''}`}>
              <i style={{ height: `${(b.m / maxM) * 100}%` }} />
              <span><C>{b.s}</C></span>
              <small>{fmtNum(b.m, 1, lang)}</small>
            </div>
          ))}
        </div>
        <p className="chfig-note">{tr(<>Jeder Balken ist 1 mol, also immer dieselbe Zahl Teilchen (<M p=").">{String.raw`N_\mathrm{A} = 6{,}022\times 10^{23}`}</M> Nur die Masse unterscheidet sich.</>, <>Every bar is 1 mol, so always the same number of particles (<M p=").">{String.raw`N_\mathrm{A} = 6.022\times 10^{23}`}</M> Only the mass differs.</>)}</p>
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------- from molecules to grams (slide 31)
const L_MAX = Math.log10(N_A);
export function ScaleTable() {
  const tr = useTr(), lang = useLang(), de = lang === 'de';
  const [pos, setPos] = useState(1000);
  const lg = (pos / 1000) * L_MAX; // log10 of the number of reaction units
  const k = pos >= 1000 ? N_A : Math.round(10 ** lg);
  const exact = pos >= 1000;
  const mol = k / N_A;
  const rows: { f: string; c: number; M: number }[] = [{ f: 'H2', c: 2, M: molarMass('H2') }, { f: 'O2', c: 1, M: molarMass('O2') }, { f: 'H2O', c: 2, M: molarMass('H2O') }];
  const grams = rows.map((r) => r.c * mol * r.M);
  const left = grams[0] + grams[1];
  const show = Math.min(k, 2);
  return (
    <figure className="chfig">
      <div className="chfig-body">
        <div className="chfig-note">{tr(<>Reaktionseinheit: 2 Moleküle <C>H2</C> + 1 Molekül <C>O2</C> geben 2 Moleküle <C>H2O</C>. Wir nehmen <M>k</M> solche Einheiten.</>, <>Reaction unit: 2 molecules <C>H2</C> + 1 molecule <C>O2</C> give 2 molecules <C>H2O</C>. We take <M>k</M> such units.</>)}</div>
        <Slider label={<M>k</M>} min={0} max={1000} step={1} value={pos} onChange={setPos} aria={tr('Anzahl Reaktionseinheiten (logarithmisch)', 'number of reaction units (logarithmic)')}
          show={<M>{exact ? String.raw`N_\mathrm{A}` : sci(k, 2, de)}</M>} />
        <svg className="st-mols" viewBox="0 0 400 74" role="img" aria-label={tr('Moleküle der Reaktion', 'molecules of the reaction')}>
          {Array.from({ length: 2 * show }, (_, i) => <g key={`a${i}`}><circle className="cs-aH" cx={24 + i * 30} cy={26} r={9} /><circle className="cs-aH" cx={36 + i * 30} cy={26} r={9} /></g>)}
          {Array.from({ length: show }, (_, i) => <g key={`b${i}`}><circle className="cs-aO" cx={160 + i * 38} cy={26} r={11} /><circle className="cs-aO" cx={178 + i * 38} cy={26} r={11} /></g>)}
          {Array.from({ length: 2 * show }, (_, i) => <g key={`c${i}`}><circle className="cs-aH" cx={250 + i * 34 - 8} cy={36} r={7} /><circle className="cs-aH" cx={250 + i * 34 + 8} cy={36} r={7} /><circle className="cs-aO" cx={250 + i * 34} cy={24} r={10} /></g>)}
          {k > 2 && <text x="200" y="68" textAnchor="middle" className="st-dots">· · ·</text>}
        </svg>
        <div className="ch-scroll">
          <table className="ch-table st-table">
            <thead><tr><th /><th className="num"><C>H2</C></th><th className="num"><C>O2</C></th><th className="num"><C>H2O</C></th></tr></thead>
            <tbody>
              <tr><th>{tr('Moleküle', 'Molecules')}</th>{rows.map((r) => <td className="num" key={r.f}><M>{sci(r.c * k, 3, de)}</M></td>)}</tr>
              <tr><th>{tr('Stoffmenge', 'Amount')}</th>{rows.map((r) => <td className="num" key={r.f}><M>{sci(r.c * mol, 3, de) + String.raw`\,\mathrm{mol}`}</M></td>)}</tr>
              <tr><th>{tr('Masse', 'Mass')}</th>{grams.map((gm, i) => <td className="num" key={i}><M>{sci(gm, 3, de) + String.raw`\,\mathrm{g}`}</M></td>)}</tr>
            </tbody>
          </table>
        </div>
        <div className="st-stack" aria-label={tr('Massenerhaltung', 'conservation of mass')}>
          <div className="st-col"><div style={{ height: `${(grams[0] / grams[2]) * 100}%` }} className="h2"><span><C>H2</C></span></div><div style={{ height: `${(grams[1] / grams[2]) * 100}%` }} className="o2"><span><C>O2</C></span></div><small>{tr('vorher', 'before')}</small></div>
          <div className="st-eq"><M>=</M></div>
          <div className="st-col"><div style={{ height: '100%' }} className="h2o"><span><C>H2O</C></span></div><small>{tr('nachher', 'after')}</small></div>
        </div>
        <p className={`chfig-status ${Math.abs(left - grams[2]) < 1e-9 * grams[2] ? 'chfig-ok' : 'chfig-bad'}`}>{tr('Die Masse vorher und nachher ist gleich (Massenerhaltung).', 'The mass before and after is the same (conservation of mass).')}</p>
      </div>
    </figure>
  );
}
