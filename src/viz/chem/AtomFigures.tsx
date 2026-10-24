import { useMemo, useState } from 'react';
import { C } from '../../components/Chem';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { ISOTOPES, commonMassNumber, counts, ionKind, naturalWeight } from '../../chem/atoms';
import { ANIONS, CATIONS, ionicFormula, ionStr, type Ion } from '../../chem/ions';
import { cellByZ } from '../../chem/periodic';
import { AnimFigure } from '../anim/AnimFigure';
import type { Scene } from '../anim/scene';
import { Presets, Slider } from './ChControls';
import { BOXES, boxesScene, classify, atomScene, ionicScene, isoScene, molScene, zoomRadii, zoomScene, MOLS, type Cat, type Rep } from './atomScenes';
import './chem.css';
import './atoms.css';

/** A static scene in the animation frame. */
function Still({ scene }: { scene: Scene }) {
  return <AnimFigure build={() => scene} step={0} t={1} />;
}

// ---------------------------------------------------------------- zoom into the atom (slide 14)
export function ZoomFigure() {
  const tr = useTr(), lang = useLang();
  const [k, setK] = useState(-9.5);
  const r = zoomRadii(k);
  const scene = useMemo(() => zoomScene(k), [k]);
  return (
    <figure className="chfig">
      <Still scene={scene} />
      <div className="chfig-ctl">
        <Slider label={tr('Zoom', 'Zoom')} min={-14.5} max={-8.5} step={0.1} value={k} onChange={setK} aria={tr('Bildbreite als Zehnerpotenz', 'picture width as a power of ten')}
          show={<M>{String.raw`10^{${fmtNum(k, 1, lang, true)}}\,\mathrm{m}`}</M>} />
        <p className="chfig-note">
          {r.nucleus < 3
            ? tr('Der Kern ist so klein, dass man ihn hier nur als Punkt (im gestrichelten Kreis) sieht.', 'The nucleus is so small that you only see it as a dot (inside the dashed circle).')
            : r.cloud > 1200 ? tr('Jetzt füllt der Kern fast das Bild, die Elektronenwolke ist weit ausserhalb.', 'Now the nucleus nearly fills the picture; the electron cloud is far outside.')
            : tr('Beide sind sichtbar.', 'Both are visible.')}
        </p>
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------- atom builder (slides 15, 16, 21; exercise 8)
const PRESETS: { id: string; Z: number; A: number; q: number; tex: string }[] = [
  { id: 'c12', Z: 6, A: 12, q: 0, tex: String.raw`{}^{12}\mathrm{C}` },
  { id: 'c13', Z: 6, A: 13, q: 0, tex: String.raw`{}^{13}\mathrm{C}` },
  { id: 'na', Z: 11, A: 23, q: 1, tex: String.raw`{}^{23}\mathrm{Na}^{+}` },
  { id: 'cl', Z: 17, A: 35, q: -1, tex: String.raw`{}^{35}\mathrm{Cl}^{-}` },
  { id: 'f', Z: 9, A: 19, q: -1, tex: String.raw`{}^{19}\mathrm{F}^{-}` },
];
export function AtomBuilder() {
  const tr = useTr(), lang = useLang();
  const [Z, setZ] = useState(6), [N, setN] = useState(6), [q, setQ] = useState(0);
  const cell = cellByZ(Z)!;
  const qq = Math.min(q, Z); // never remove more electrons than there are
  const cnt = counts(Z, Z + N, qq);
  const scene = useMemo(() => atomScene({ Z, N, q: qq }), [Z, N, qq]);
  const kind = ionKind(qq);
  const setElement = (z: number) => { setZ(z); setN(commonMassNumber(cellByZ(z)!.symbol) - z); setQ((x) => Math.min(x, z)); };
  return (
    <figure className="chfig">
      <div className="chfig-body">
        <Presets label={tr('Beispiele', 'Examples')} value={PRESETS.find((p) => p.Z === Z && p.A === Z + N && p.q === qq)?.id ?? null}
          onPick={(id) => { const p = PRESETS.find((x) => x.id === id)!; setZ(p.Z); setN(p.A - p.Z); setQ(p.q); }}
          items={PRESETS.map((p) => ({ id: p.id, label: <M>{p.tex}</M> }))} />
        <Still scene={scene} />
      </div>
      <div className="chfig-ctl">
        <Slider label={<M>Z</M>} min={1} max={20} step={1} value={Z} onChange={setElement} aria={tr('Ordnungszahl (Protonen)', 'atomic number (protons)')}
          show={<span><C>{cell.symbol}</C> {lang === 'de' ? cell.de : cell.en}</span>} />
        <Slider label={<M>N</M>} min={0} max={Math.max(12, Math.round(1.6 * Z) + 4)} step={1} value={Math.min(N, Math.max(12, Math.round(1.6 * Z) + 4))} onChange={setN} aria={tr('Neutronen', 'neutrons')} show={N} />
        <Slider label={<M>q</M>} min={-3} max={3} step={1} value={qq} onChange={setQ} aria={tr('Ladung', 'charge')} show={<M>{qq === 0 ? '0' : `${qq > 0 ? '+' : '−'}${Math.abs(qq)}`}</M>} />
        <div className="chfig-info">
          <span>{tr('Massenzahl', 'Mass number')} <M>{String.raw`A = Z + N = ${cnt.massNumber}`}</M></span>
          <span>{kind === 'neutral' ? tr('neutrales Atom', 'neutral atom') : kind === 'cation' ? tr('Kation: Elektronen fehlen', 'cation: electrons removed') : tr('Anion: Elektronen dazu', 'anion: electrons added')}</span>
        </div>
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------- isotope explorer (slide 17)
const ISO_EL = ['B', 'C', 'Cl', 'Cu', 'Br', 'Ag'];
export function IsotopeExplorer() {
  const tr = useTr(), lang = useLang();
  const [sym, setSym] = useState('Cl');
  const nat = ISOTOPES[sym][1].abundance * 100;
  const [pct, setPct] = useState<number | null>(null);
  const shown = pct ?? nat;
  return (
    <figure className="chfig">
      <div className="chfig-body">
        <Presets label={tr('Element', 'Element')} value={sym} onPick={(s) => { setSym(s); setPct(null); }} items={ISO_EL.map((s) => ({ id: s, label: <C>{s}</C> }))} />
        <AnimFigure build={(_s, _t, l) => isoScene(sym, pct, l)} step={0} t={1} />
      </div>
      <div className="chfig-ctl">
        <Slider label={<M>{String.raw`{}^{${ISOTOPES[sym][1].A}}\mathrm{${sym}}`}</M>} min={0} max={100} step={0.5} value={Math.round(shown * 2) / 2}
          onChange={setPct} aria={tr('Anteil des schweren Isotops', 'share of the heavy isotope')} show={<M>{String.raw`${fmtNum(shown, 1, lang, true)}\,\%`}</M>} />
        <div className="chfig-row">
          <button type="button" className="ch-btn sm" onClick={() => setPct(null)} disabled={pct === null}>{tr('natürliche Mischung', 'natural mixture')}</button>
          <span className="chfig-info"><span>{tr('Tabellenwert', 'table value')} <M>{String.raw`${fmtNum(naturalWeight(sym), 2, lang, true)}\,\mathrm{u}`}</M></span></span>
        </div>
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------- six pictures (exercise 1, ex. 7)
const CAT_LABEL: Record<Cat, [string, string]> = {
  a: ['(a) reines Element', '(a) pure element'], b: ['(b) Gemisch aus zwei Elementen', '(b) mixture of two elements'],
  c: ['(c) reine Verbindung', '(c) pure compound'], d: ['(d) Gemisch aus Element und Verbindung', '(d) mixture of an element and a compound'],
};
export function MixtureBoxes() {
  const tr = useTr();
  const [sel, setSel] = useState<Cat | null>(null);
  const hits = sel ? BOXES.map((b, i) => (classify(b).includes(sel) ? i + 1 : 0)).filter(Boolean) : [];
  return (
    <figure className="chfig">
      <div className="chfig-body">
        <Presets label={tr('Beschreibung wählen', 'Choose a description')} value={sel} onPick={(c) => setSel(sel === c ? null : c)}
          items={(['a', 'b', 'c', 'd'] as Cat[]).map((c) => ({ id: c, label: tr(...CAT_LABEL[c]) }))} />
        <Still scene={boxesScene(sel)} />
        <div className="ch-legend">
          <span><i className="neu" style={{ background: '#3f7be0', color: '#2551a3' }} />{tr('Atom A', 'atom A')}</span>
          <span><i className="neu" style={{ background: '#c9a05a', color: '#8c6a2c' }} />{tr('Atom B', 'atom B')}</span>
        </div>
        <p className="chfig-status chfig-note">{sel ? tr(`Passt zu Bild ${hits.join(' und ')}.`, `Fits picture ${hits.join(' and ')}.`) : tr('Wähle eine Beschreibung: die passenden Bilder werden hervorgehoben.', 'Choose a description: the matching pictures are highlighted.')}</p>
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------- molecule views (slide 20)
export function MoleculeViews() {
  const tr = useTr();
  const [name, setName] = useState('CH4'), [rep, setRep] = useState<Rep>('ballstick');
  return (
    <figure className="chfig">
      <div className="chfig-body">
        <Presets label={tr('Molekül', 'Molecule')} value={name} onPick={setName} items={Object.keys(MOLS).map((n) => ({ id: n, label: <C>{MOLS[n].tex}</C> }))} />
        <Presets label={tr('Darstellung', 'Representation')} value={rep} onPick={setRep}
          items={[{ id: 'structural' as Rep, label: tr('Strukturformel', 'structural formula') }, { id: 'ballstick' as Rep, label: tr('Kugel-Stab-Modell', 'ball-and-stick') }, { id: 'space' as Rep, label: tr('Kalottenmodell', 'space-filling') }]} />
        <Still scene={molScene(name, rep)} />
        <p className="chfig-note">{rep === 'structural' ? tr('Zeigt nur, welche Atome verbunden sind – nicht die räumliche Form.', 'Shows only which atoms are connected – not the 3D shape.')
          : rep === 'ballstick' ? tr(<>Zeigt die Bindungswinkel: das Wasser-Molekül ist gewinkelt, <C>CO2</C> gestreckt.</>, <>Shows the bond angles: water is bent, <C>CO2</C> is straight.</>)
          : tr('Zeigt auch, wie viel Platz die Elektronenwolken einnehmen.', 'Also shows how much room the electron clouds take up.')}</p>
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------- ionic compound builder (slides 21–24)
export function IonicBuilder() {
  const tr = useTr(), lang = useLang();
  const [c, setC] = useState<Ion>(CATIONS.find((x) => x.f === 'Mg')!), [a, setA] = useState<Ion>(ANIONS.find((x) => x.f === 'N')!);
  const f = ionicFormula(c, a);
  const btn = (i: Ion, on: boolean, pick: (i: Ion) => void) => (
    <button key={ionStr(i)} type="button" aria-pressed={on} className={i.bold ? 'ion-btn bold' : 'ion-btn'} onClick={() => pick(i)}><C>{ionStr(i)}</C></button>
  );
  return (
    <figure className="chfig">
      <div className="chfig-body">
        <div><b>{tr('Kation', 'Cation')}</b></div>
        <div className="ion-row" role="group" aria-label={tr('Kation wählen', 'choose a cation')}>{CATIONS.map((i) => btn(i, i === c, setC))}</div>
        <div><b>{tr('Anion', 'Anion')}</b></div>
        <div className="ion-row" role="group" aria-label={tr('Anion wählen', 'choose an anion')}>{ANIONS.map((i) => btn(i, i === a, setA))}</div>
        <p className="chfig-note">{tr('Fett gedruckte Ionen: die häufigsten, auch in den Folien fett.', 'Bold ions: the most common ones, also bold on the slides.')}</p>
        <Still scene={ionicScene(c, a)} />
        <div className="chfig-info">
          <span><M>{String.raw`${f.nCation}\cdot(${c.z > 0 ? '+' : '−'}${c.z}) + ${f.nAnion}\cdot(${a.z > 0 ? '+' : '−'}${Math.abs(a.z)}) = 0`}</M></span>
          <span>{lang === 'de' ? `${c.de} + ${a.de}` : `${c.en} + ${a.en}`}</span>
        </div>
      </div>
    </figure>
  );
}
