import { useState } from 'react';
import { M } from '../../components/Tex';
import { T, fmtNum, useLang, useTr } from '../../i18n';
import { WATER, waterEntropy, waterJumps } from '../../chem/entropy';
import { PLabel, Plot, Pt, Seg, Curve } from '../plot/Plot';
import { ThSlider } from './ChemFig';
import './thermo.css';

const t = String.raw;
const f0 = (T0: number) => waterEntropy(T0).S;

function PhaseIcons({ phase }: { phase: 'solid' | 'liquid' | 'gas' }) {
  const tr = useTr();
  const grid = Array.from({ length: 16 }, (_, i) => [14 + (i % 4) * 22, 14 + Math.floor(i / 4) * 18] as const);
  const liquid = [[16, 70], [40, 62], [66, 72], [90, 64], [24, 48], [52, 42], [78, 50], [18, 26], [44, 22], [70, 28], [92, 20], [34, 12], [60, 78], [84, 38]] as const;
  const gas = [[14, 18], [70, 12], [40, 40], [90, 56], [22, 72], [58, 66], [84, 24]] as const;
  const panels: { id: 'solid' | 'liquid' | 'gas'; pts: readonly (readonly [number, number])[]; name: string }[] = [
    { id: 'solid', pts: grid, name: tr('fest', 'solid') }, { id: 'liquid', pts: liquid, name: tr('flüssig', 'liquid') }, { id: 'gas', pts: gas, name: tr('gasförmig', 'gas') },
  ];
  return (
    <div className="th-phases" role="group" aria-label={tr('Teilchenbilder der drei Zustände', 'Particle pictures of the three states')}>
      {panels.map((p) => (
        <div key={p.id} className={`th-phase${p.id === phase ? ' on' : ''}`}>
          <svg viewBox="0 0 106 90" aria-hidden="true">{p.pts.map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r={6} className="th-atom" />)}</svg>
          <span>{p.name}</span>
        </div>
      ))}
    </div>
  );
}

/** Slide 19, exercise 5 p. 5: entropy of water versus temperature — it rises with T and jumps at melting and boiling (supplement values). */
export function EntropyStaircase() {
  const tr = useTr(), lang = useLang();
  const [Tk, setTk] = useState(298);
  const cur = waterEntropy(Tk), j = waterJumps();
  const f = (x: number, d = 0) => fmtNum(x, d, lang, true);
  return (
    <figure className="th-fig th-two">
      <div className="th-draw-plot">
        <Plot x={[0, 500]} y={[0, 220]} w={420} h={300} grid={[100, 50]} tick={[100, 50]} axes={['T', 'S']} className="wide"
          label={tr('Entropie von Wasser gegen die Temperatur: steigt, mit Sprüngen beim Schmelzen und Sieden', 'Entropy of water versus temperature: rises, with jumps at melting and boiling')}>
          <Curve f={f0} dom={[0, 500]} breaks={[WATER.Tm, WATER.Tb]} role="cs" width={3} n={400} />
          <Seg a={[WATER.Tm, f0(WATER.Tm - 1e-9)]} b={[WATER.Tm, f0(WATER.Tm + 1e-9)]} role="cs" dashed width={2} />
          <Seg a={[WATER.Tb, f0(WATER.Tb - 1e-9)]} b={[WATER.Tb, f0(WATER.Tb + 1e-9)]} role="cs" dashed width={2} />
          <Pt x={Tk} y={cur.S} role="pt" r={6} />
          <PLabel x={110} y={90} tex={tr('fest', 'solid') === 'fest' ? String.raw`\text{fest}` : String.raw`\text{solid}`} role="muted" small />
          <PLabel x={322} y={140} tex={tr('flüssig', 'liquid') === 'flüssig' ? String.raw`\text{flüssig}` : String.raw`\text{liquid}`} role="muted" small />
          <PLabel x={440} y={206} tex={tr('gasförmig', 'gas') === 'gasförmig' ? String.raw`\text{gasförmig}` : String.raw`\text{gas}`} role="muted" small />
          <PLabel x={WATER.Tm} y={50} tex={String.raw`\Delta S_\mathrm{fus}`} role="cs" small dx={-26} />
          <PLabel x={WATER.Tb} y={110} tex={String.raw`\Delta S_\mathrm{vap}`} role="cs" small dx={-30} />
        </Plot>
      </div>
      <figcaption>
        <ThSlider label={<M>T</M>} min={1} max={500} step={1} value={Tk} onChange={setTk} aria={tr('Temperatur in Kelvin', 'Temperature in kelvin')} show={<M>{t`${Tk}\,\mathrm{K}`}</M>} />
        <PhaseIcons phase={cur.phase} />
        <div className="th-read" aria-live="polite">
          <M>{t`S \approx ${f(cur.S)}\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</M>
          <M>{t`\Delta S_\mathrm{fus} = \frac{\Delta H_\mathrm{fus}}{T_\mathrm{m}} \approx ${f(j.fus)},\quad \Delta S_\mathrm{vap} = \frac{\Delta H_\mathrm{vap}}{T_\mathrm{b}} \approx ${f(j.vap)}\ \mathrm{J\,mol^{-1}\,K^{-1}}`}</M>
        </div>
        <p className="th-note"><T de={<>Schematisch, mit ungefähren Werten für Wasser (nicht aus den Folien). Bei <M>{t`T = 0`}</M> ist <M>{t`S = 0`}</M> (3. Hauptsatz).</>} en={<>Schematic, with approximate values for water (not from the slides). At <M>{t`T = 0`}</M> we have <M>{t`S = 0`}</M> (3rd law).</>} /></p>
      </figcaption>
    </figure>
  );
}
