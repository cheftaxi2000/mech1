import { useState } from 'react';
import { M } from '../../components/Tex';
import { T, fmtNum, useLang, useTr } from '../../i18n';
import { DE_WATER_L, DH_WATER_L, W_RANGE, stateFnScene } from './stateFnScene';
import { SceneFig, ThChips, ThSlider } from './ChemFig';

const t = String.raw;

/** Slide 15: the same ΔE reached by two methods; q and w depend on the method. */
export function StateFunctionFigure() {
  const tr = useTr(), lang = useLang();
  const [w2, setW2] = useState(7.4);
  const [pick, setPick] = useState<'open' | 'free' | null>('open');
  const f = (x: number) => fmtNum(x, 1, lang, true);
  const sg = (x: number) => (x > 0.04 ? '+' : x < -0.04 ? '-' : '') + f(Math.abs(x));
  const q2 = DE_WATER_L - w2;
  return (
    <figure className="th-fig th-two">
      <SceneFig scene={stateFnScene(w2, lang)} label={tr('Zwei Wege mit derselben Höhendifferenz und zwei Balkengruppen: q und w sind verschieden, ΔE ist gleich', 'Two paths with the same height difference and two groups of bars: q and w differ, ΔE is the same')} />
      <figcaption>
        <ThChips label={tr('Beispiele', 'Examples')} value={pick} onPick={(id) => { setPick(id); setW2(id === 'open' ? 7.4 : -150); }} items={[
          { id: 'open', label: <T de="Kolben gegen die Luft" en="piston against the air" /> },
          { id: 'free', label: <T de="Kolben treibt eine Maschine an" en="piston drives a machine" /> },
        ]} />
        <ThSlider label={<M>{t`w`}</M>} min={W_RANGE[0]} max={W_RANGE[1]} step={0.5} value={w2} ink="e" onChange={(v) => { setW2(v); setPick(null); }}
          aria={tr('Arbeit w bei Methode 2 in Kilojoule', 'Work w in method 2 in kilojoules')} show={<M>{t`${sg(w2)}\,\mathrm{kJ}`}</M>} />
        <div className="th-read">
          <M>{t`\text{1: } q = ${sg(DE_WATER_L)},\ w = 0 \;\Rightarrow\; \Delta E = ${sg(DE_WATER_L)}\,\mathrm{kJ}`}</M>
          <M>{t`\text{2: } q = ${sg(q2)},\ w = ${sg(w2)} \;\Rightarrow\; \Delta E = ${sg(q2 + w2)}\,\mathrm{kJ}`}</M>
        </div>
        <p className="th-note"><T
          de={<>Zahlen (Ergänzung): <M>{t`\Delta H = ${fmtNum(DH_WATER_L, 1, 'de', true)}\,\mathrm{kJ}`}</M> aus den Bildungsenthalpien; <M>{t`\Delta E = \Delta H - \Delta n\,RT`}</M> mit <M p=".">{t`\Delta n = -3`}</M> Warum, sehen wir in der nächsten Lektion.</>}
          en={<>Numbers (supplement): <M>{t`\Delta H = ${fmtNum(DH_WATER_L, 1, 'en', true)}\,\mathrm{kJ}`}</M> from the enthalpies of formation; <M>{t`\Delta E = \Delta H - \Delta n\,RT`}</M> with <M p=".">{t`\Delta n = -3`}</M> We see why in the next lesson.</>} /></p>
      </figcaption>
    </figure>
  );
}
