import { useMemo, useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { roundToSum } from './k7Draw';
import { LH, LW, L_LIM, ladderScene, wayLayers, type Way } from './K7LadderScene';
import { SceneView } from './K7Svg';
import './K7.css';

const t = String.raw;
type LadderState = { v: number; omega: number; G: number; W: number };
const LADDER_PRESETS: Record<'skript' | 'schub' | 'dreh', LadderState> = {
  skript: { v: 1, omega: 0.5, G: 20, W: 15 },
  schub: { v: 1, omega: 0, G: 20, W: 15 },
  dreh: { v: 0, omega: 0.5, G: 20, W: 15 },
};

/**
 * Lecture pp. 35–36, Fig. 5.6: the ladder with F̲_B = G and F̲_C = W, v̲_A = (v, 0, 0), ω̲ = (0, 0, ω). Weg I = every force with the velocity of its own
 * point (circled I, drawn on p. 36 as III), Weg II = R̲ and M̲_A in A (circled II, drawn as IV). Both bars end at the same line.
 */
export function LadderExplorer() {
  const tr = useTr(), lang = useLang();
  const [s, setS] = useState<LadderState>(LADDER_PRESETS.skript);
  const [way, setWay] = useState<Way>('I');
  const [pre, setPre] = useState<keyof typeof LADDER_PRESETS | null>('skript');
  const scene = useMemo(() => ladderScene(s, lang, wayLayers(way)), [s, way, lang]);
  const q = scene.parts;
  const fx = (x: number) => fmtNum(x, 1, lang, true);
  const [pb, pc] = roundToSum([q.PB, q.PC], 1), [rv, ma] = roundToSum([q.RvA, q.MAomega], 1);
  const tot = roundToSum([q.wegI], 1)[0];
  const set = (k: keyof LadderState) => (e: React.ChangeEvent<HTMLInputElement>) => { setS({ ...s, [k]: Number(e.target.value) }); setPre(null); };
  const cls = q.wegI > 0.04 ? 'pos' : q.wegI < -0.04 ? 'neg' : '';
  const sl = (k: keyof LadderState, tex: string, min: number, max: number, step: number, digits: number) => (
    <label className="slider wide-slider"><span><M>{tex}</M></span>
      <input type="range" min={min} max={max} step={step} value={s[k]} onChange={set(k)} aria-label={k} />
      <span className="val">{fmtNum(s[k], digits, lang)}</span></label>
  );
  const choose = (k: keyof typeof LADDER_PRESETS) => { setS(LADDER_PRESETS[k]); setPre(k); };
  return (
    <figure className="vdemo k7-explorer">
      <div className="v-presets" role="group" aria-label={tr('Weg', 'Route')}>
        {(['I', 'II'] as Way[]).map((w) => (
          <button key={w} type="button" aria-pressed={way === w} onClick={() => setWay(w)}>
            {w === 'I' ? tr('Weg I: Punkt für Punkt', 'Route I: point by point') : tr('Weg II: in A gebündelt', 'Route II: bundled in A')}
          </button>
        ))}
      </div>
      <SceneView scene={scene} W={LW} H={LH} className="wide"
        label={tr('Leiter nach Fig. 5.6: Gesamtleistung auf zwei Wegen', 'Ladder of Fig. 5.6: total power in two ways')} />
      <figcaption className="vdemo-readout">
        <div className="v-presets" role="group" aria-label={tr('Beispiele', 'Examples')}>
          <button type="button" aria-pressed={pre === 'skript'} onClick={() => choose('skript')}>{tr('Schieben und Drehen', 'sliding and turning')}</button>
          <button type="button" aria-pressed={pre === 'schub'} onClick={() => choose('schub')}>{tr('nur Schieben', 'sliding only')} <M p="">{t`\omega = 0`}</M></button>
          <button type="button" aria-pressed={pre === 'dreh'} onClick={() => choose('dreh')}>{tr('nur Drehen', 'turning only')} <M p="">{t`v = 0`}</M></button>
        </div>
        {sl('v', 'v', -L_LIM.v, L_LIM.v, 0.1, 1)}
        {sl('omega', t`\omega`, -L_LIM.w, L_LIM.w, 0.1, 1)}
        {sl('G', 'G', 0, L_LIM.G, 1, 0)}
        {sl('W', 'W', 0, L_LIM.W, 1, 0)}
        {way === 'I' ? (
          <div className={`v-result rt-readout ${cls}`}>
            <M>{t`P_B = ${fx(pb)}`}</M> <M>+</M> <M>{t`P_C = ${fx(pc)}`}</M> <M>{t`= ${fx(tot)}\,\text{W}`}</M>
          </div>
        ) : (
          <div className={`v-result rt-readout ${cls}`}>
            <M>{t`\v R\cdot\v v_A = ${fx(rv)}`}</M> <M>+</M> <M>{t`\v M_A\cdot\v\omega = ${fx(ma)}`}</M> <M>{t`= ${fx(tot)}\,\text{W}`}</M>
          </div>
        )}
      </figcaption>
    </figure>
  );
}
