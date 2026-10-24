import { useState } from 'react';
import { M } from '../../components/Tex';
import { T, fmtNum, useLang, useTr } from '../../i18n';
import { SceneFig, ThChips, ThSlider } from './ChemFig';
import { mixScene } from './thermoMixScene';

const t = String.raw;

/** Exercise 4, Ex. 6: heat lost by the coffee equals heat gained by the spoon. */
export function MixFigure() {
  const tr = useTr(), lang = useLang();
  const [m, setM] = useState(45), [Ts, setTs] = useState(25);
  const [pick, setPick] = useState<'ta' | null>('ta');
  const sc = mixScene(m, Ts, lang);
  const f = (x: number, d = 1) => fmtNum(x, d, lang, true);
  return (
    <figure className="th-fig th-two">
      <SceneFig scene={sc} label={tr('Temperaturachse: Kaffee kühlt ab, Löffel wärmt sich auf, beide enden bei derselben Temperatur', 'Temperature axis: the coffee cools, the spoon warms up, both end at the same temperature')} />
      <figcaption>
        <ThChips label={tr('Beispiel', 'Example')} value={pick} onPick={() => { setM(45); setTs(25); setPick('ta'); }} items={[{ id: 'ta', label: <T de="Aufgabe 6: 45 g, 25 °C" en="Exercise 6: 45 g, 25 °C" /> }]} />
        <ThSlider label={<M>{t`m_\mathrm{spoon}`}</M>} min={5} max={400} step={5} value={m} onChange={(v) => { setM(v); setPick(null); }} aria={tr('Masse des Löffels in Gramm', 'Mass of the spoon in grams')} show={<M>{t`${m}\,\mathrm{g}`}</M>} />
        <ThSlider label={<M>{t`T_\mathrm{spoon}`}</M>} min={0} max={60} step={1} value={Ts} onChange={(v) => { setTs(v); setPick(null); }} aria={tr('Anfangstemperatur des Löffels in Grad Celsius', 'Starting temperature of the spoon in degrees Celsius')} show={<M>{t`${Ts}\,^\circ\mathrm{C}`}</M>} />
        <div className="th-read" aria-live="polite">
          <M>{t`q_\mathrm{coffee} = ${f(sc.data.qc / 1000, 2)}\,\mathrm{kJ},\quad q_\mathrm{spoon} = ${f(sc.data.qs / 1000, 2)}\,\mathrm{kJ}`}</M>
          <M>{t`T_\mathrm{eq} = ${f(sc.data.Teq)}\,^\circ\mathrm{C},\quad \Delta T_\mathrm{coffee} = ${f(sc.data.dTc, 2)}\,\mathrm{K}`}</M>
        </div>
      </figcaption>
    </figure>
  );
}
