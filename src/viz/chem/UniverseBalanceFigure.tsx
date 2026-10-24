import { useState } from 'react';
import { M } from '../../components/Tex';
import { T, fmtNum, useLang, useTr } from '../../i18n';
import { SceneFig, ThChips, ThSlider } from './ChemFig';
import { US, universeScene, type IceMode } from './universeScene';

const t = String.raw;
const PRESETS = [
  { id: 'hand', mode: 'melt' as IceMode, T: 310.15 }, { id: 'warm', mode: 'melt' as IceMode, T: 274.15 }, { id: 'cold', mode: 'melt' as IceMode, T: 272.15 },
  { id: 'freezer', mode: 'freeze' as IceMode, T: 263.15 }, { id: 'warmfreeze', mode: 'freeze' as IceMode, T: 283.15 },
];
type PId = (typeof PRESETS)[number]['id'] | null;

/** Slides 8, 14–16, 20: the entropy of the universe decides whether ice melts (or water freezes). */
export function UniverseBalanceFigure() {
  const tr = useTr(), lang = useLang();
  const [mode, setMode] = useState<IceMode>('melt');
  const [Ts, setTs] = useState(310.15);
  const [pick, setPick] = useState<PId>('hand');
  const sc = universeScene(mode, Ts, lang);
  const f = (x: number, d = 1) => fmtNum(x, d, lang, true);
  const sg = (x: number) => (x > 0.049 ? '+' : x < -0.049 ? '-' : '') + f(Math.abs(x));
  const q = sc.data.q / 1000;
  const spont = sc.data.spont === 1, rev = sc.data.rev === 1;
  const items = [
    { id: 'hand' as const, label: <T de={<>Hand <M>{t`37\,^\circ\mathrm{C}`}</M></>} en={<>hand <M>{t`37\,^\circ\mathrm{C}`}</M></>} /> },
    { id: 'warm' as const, label: <T de={<>Luft <M>{t`+1\,^\circ\mathrm{C}`}</M></>} en={<>air <M>{t`+1\,^\circ\mathrm{C}`}</M></>} /> },
    { id: 'cold' as const, label: <T de={<>Luft <M>{t`-1\,^\circ\mathrm{C}`}</M></>} en={<>air <M>{t`-1\,^\circ\mathrm{C}`}</M></>} /> },
    { id: 'freezer' as const, label: <T de={<>Gefrierfach <M>{t`-10\,^\circ\mathrm{C}`}</M></>} en={<>freezer <M>{t`-10\,^\circ\mathrm{C}`}</M></>} /> },
    { id: 'warmfreeze' as const, label: <T de={<>Gefrieren bei <M>{t`+10\,^\circ\mathrm{C}`}</M></>} en={<>freezing at <M>{t`+10\,^\circ\mathrm{C}`}</M></>} /> },
  ];
  const choose = (id: Exclude<PId, null>) => { const p = PRESETS.find((x) => x.id === id)!; setMode(p.mode); setTs(p.T); setPick(id); };
  return (
    <figure className="th-fig th-two">
      <SceneFig scene={sc} label={tr('Drei Balken: Entropieänderung des Systems, der Umgebung und des Universums beim Schmelzen oder Gefrieren von Eis', 'Three bars: entropy change of the system, the surroundings and the universe when ice melts or freezes')} />
      <figcaption>
        <ThChips label={tr('Beispiele', 'Examples')} value={pick} onPick={choose} items={items} />
        <ThChips label={tr('Vorgang', 'Process')} value={mode} onPick={(m) => { setMode(m); setPick(null); }} items={[{ id: 'melt', label: <T de="Eis schmilzt" en="ice melts" /> }, { id: 'freeze', label: <T de="Wasser gefriert" en="water freezes" /> }]} />
        <ThSlider label={<M>{t`T_\mathrm{surr}`}</M>} min={US.Tmin} max={US.Tmax} step={0.5} value={Ts} onChange={(v) => { setTs(v); setPick(null); }} aria={tr('Temperatur der Umgebung in Kelvin', 'Temperature of the surroundings in kelvin')} show={<M>{t`${Math.round(Ts)}\,\mathrm{K}`}</M>} />
        <div className={`th-read ${rev ? '' : spont ? 'ok' : 'bad'}`} aria-live="polite">
          <M>{t`\Delta S_\mathrm{sys} = \frac{q}{T_\mathrm{sys}} = \frac{${sg(q)}\cdot 10^{3}\,\mathrm{J\,mol^{-1}}}{273\,\mathrm{K}} = ${sg(sc.data.sys)}`}</M>
          <M>{t`\Delta S_\mathrm{surr} = \frac{-q}{T_\mathrm{surr}} = \frac{${sg(-q)}\cdot 10^{3}}{${Math.round(Ts)}} = ${sg(sc.data.surr)}`}</M>
          <M>{t`\Delta S_\mathrm{univ} = ${sg(sc.data.univ)}\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</M>
          <b className="th-verdict">{rev ? <T de="Null: der umkehrbare Grenzfall." en="Zero: the reversible limit." />
            : spont ? <T de={<>Positiv: der Vorgang läuft von selbst ab (spontan).</>} en={<>Positive: the process happens by itself (spontaneous).</>} />
              : <T de={<>Negativ: der Vorgang läuft so nicht von selbst ab; die Gegenrichtung schon.</>} en={<>Negative: the process does not happen by itself in this direction; the opposite one does.</>} />}</b>
        </div>
      </figcaption>
    </figure>
  );
}
