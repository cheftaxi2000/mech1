import { useState } from 'react';
import { M } from '../../components/Tex';
import { T, fmtNum, useLang, useTr } from '../../i18n';
import { SceneFig, ThChips, ThSlider } from './ChemFig';
import { HF, heatScene } from './heatScene';
import { useRaf, useReducedMotion } from './useFrames';

const t = String.raw;

/** Slides 9–10, 15–16: heat between two blocks and the entropy of the universe. */
export function HeatFlowFigure() {
  const tr = useTr(), lang = useLang();
  const reduced = useReducedMotion();
  const [dT, setDT] = useState(100), [x, setX] = useState(0.5), [playing, setPlaying] = useState(false);
  useRaf((dt) => setX((v) => { const n = v + dt * 0.35; if (n >= 1) { setPlaying(false); return 1; } return n; }), playing && !reduced);
  const sc = heatScene(dT, x, lang);
  const f = (v: number, d = 2) => fmtNum(v, d, lang, true);
  const sg = (v: number, d = 2) => (v > 0.0049 ? '+' : v < -0.0049 ? '-' : '') + f(Math.abs(v), d);
  const items = [
    { id: 'small', label: <T de="ein bisschen Wärme" en="a little heat" /> }, { id: 'eq', label: <T de="bis zum Ausgleich" en="until equal" /> },
    { id: 'rev', label: <T de="Wärme rückwärts" en="heat backwards" /> }, { id: 'over', label: <T de="darüber hinaus" en="beyond" /> },
  ] as const;
  const pick = (id: (typeof items)[number]['id']) => { setPlaying(false); setX(id === 'small' ? 0.2 : id === 'eq' ? 1 : id === 'rev' ? -0.3 : 1.8); };
  const cur = Math.abs(x - 0.2) < 1e-9 ? 'small' : x === 1 ? 'eq' : Math.abs(x + 0.3) < 1e-9 ? 'rev' : Math.abs(x - 1.8) < 1e-9 ? 'over' : null;
  return (
    <figure className="th-fig th-two">
      <SceneFig scene={sc} label={tr('Zwei Blöcke tauschen Wärme aus; rechts die Entropieänderung des Universums in Abhängigkeit von der übertragenen Wärme', 'Two blocks exchange heat; on the right the entropy change of the universe as a function of the heat transferred')} />
      <figcaption>
        <ThChips label={tr('Beispiele', 'Examples')} value={cur} onPick={pick} items={items.map((i) => ({ id: i.id, label: i.label }))} />
        <ThSlider label={<M>{t`q/q^{*}`}</M>} min={HF.X0} max={HF.X1} step={0.05} value={x} onChange={(v) => { setPlaying(false); setX(v); }} aria={tr('Übertragene Wärme in Einheiten von q*', 'Heat transferred in units of q*')} ink="t"
          show={<M>{t`${f(x)}`}</M>} />
        <ThSlider label={<M>{t`\Delta T`}</M>} min={2} max={100} step={1} value={dT} onChange={(v) => setDT(v)} aria={tr('Temperaturunterschied der Blöcke in Kelvin', 'Temperature difference of the blocks in kelvin')} show={<M>{t`${dT}\,\mathrm{K}`}</M>} />
        <div className="th-chips v-presets"><button type="button" onClick={() => { setX(0); setPlaying(!reduced); if (reduced) setX(1); }}>{tr('Abspielen: bis zum Ausgleich', 'Play: until equal')}</button></div>
        <div className={`th-read ${sc.data.dSuniv > 0.0005 ? 'ok' : sc.data.dSuniv < -0.0005 ? 'bad' : ''}`} aria-live="polite">
          <M>{t`q = ${f(sc.data.q, 0)}\,\mathrm{J}`}</M>
          <M>{t`\Delta S_\mathrm{univ} = (${sg(sc.data.dSh)}) + (${sg(sc.data.dSc)}) = ${sg(sc.data.dSuniv)}\,\mathrm{J\,K^{-1}}`}</M>
          <b className="th-verdict">{sc.data.dSuniv > 0.0005 ? <T de="Heiss → kalt: die Entropie des Universums wächst." en="Hot → cold: the entropy of the universe grows." />
            : sc.data.dSuniv < -0.0005 ? <T de="Kalt → heiss von selbst: das wäre eine Entropieabnahme, das passiert nicht." en="Cold → hot by itself: that would lower the entropy, it does not happen." />
              : <T de="Nichts ist passiert: die Entropie ist unverändert." en="Nothing happened: the entropy is unchanged." />}</b>
        </div>
      </figcaption>
    </figure>
  );
}
