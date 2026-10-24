import { useState } from 'react';
import { M } from '../../components/Tex';
import { chemTex } from '../../chem/tex';
import { T, fmtNum, useLang, useTr } from '../../i18n';
import { SceneFig, ThChips, ThSlider } from './ChemFig';
import { calScene, type CalKind } from './calScene';

const t = String.raw;
const W2O = chemTex('H2O');

/** Slides 20–22: coffee-cup calorimeter and bomb — the water's temperature change tells the heat of the reaction. */
export function CalorimeterFigure() {
  const tr = useTr(), lang = useLang();
  const [kind, setKind] = useState<CalKind>('p');
  const [q, setQ] = useState(-5), [m, setM] = useState(150);
  const sc = calScene(kind, q, m, lang);
  const f = (x: number, d = 1) => fmtNum(x, d, lang, true);
  const sg = (x: number, d = 1) => (x > 0.004 ? '+' : x < -0.004 ? '-' : '') + f(Math.abs(x), d);
  const qw = -q;
  const sym = kind === 'p' ? t`\Delta H_\mathrm{rxn}` : t`\Delta E_\mathrm{rxn}`;
  return (
    <figure className="th-fig th-two">
      <SceneFig scene={sc} label={tr('Kalorimeter: ein Gefäss mit Wasser, einem Thermometer und der Reaktionsprobe', 'Calorimeter: a vessel with water, a thermometer and the reaction sample')} />
      <figcaption>
        <ThChips label={tr('Bauart', 'Type')} value={kind} onPick={setKind} items={[
          { id: 'p', label: <T de="Becher (konstanter Druck)" en="cup (constant pressure)" /> },
          { id: 'v', label: <T de="Bombe (konstantes Volumen)" en="bomb (constant volume)" /> },
        ]} />
        <ThSlider label={<M>{t`q_\mathrm{rxn}`}</M>} min={-8} max={8} step={0.5} value={q} onChange={setQ} ink="t" aria={tr('Reaktionswärme in Kilojoule', 'Heat of reaction in kilojoules')}
          show={<M>{t`${sg(q)}\,\text{kJ}`}</M>} />
        <ThSlider label={<M>m</M>} min={100} max={300} step={10} value={m} onChange={setM} aria={tr('Masse des Wassers in Gramm', 'Mass of water in grams')}
          show={<M>{t`${m}\,\text{g}`}</M>} />
        <div className="th-read" aria-live="polite">
          <M>{t`${sym} = q_\mathrm{rxn} = ${sg(q)}\,\text{kJ} \;\Rightarrow\; q_{${W2O}} = -q_\mathrm{rxn} = ${sg(qw)}\,\text{kJ}`}</M>
          <M>{t`\Delta T = \frac{q_{${W2O}}}{m\,C_\mathrm{s}} = \frac{${sg(qw)}\cdot 10^{3}\,\mathrm{J}}{${m}\,\mathrm{g}\cdot ${lang === 'de' ? '4{,}18' : '4.18'}\,\mathrm{J\,g^{-1}\,K^{-1}}} = ${sg(sc.data.dT)}\,\mathrm{K}`}</M>
          <b className="th-verdict">{q < -0.05 ? <T de="Exotherm: das Wasser wird wärmer." en="Exothermic: the water warms up." /> : q > 0.05 ? <T de="Endotherm: das Wasser wird kälter." en="Endothermic: the water cools down." /> : <T de="Keine Reaktionswärme: die Temperatur bleibt." en="No heat of reaction: the temperature stays." />}</b>
        </div>
      </figcaption>
    </figure>
  );
}
