import { useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { molarMass } from '../../chem/formula';
import { fractionAbove, maxwell, meanKEMolar, vAv, vMp, vRms } from '../../chem/kinetic';
import { niceMax, niceStep } from '../../chem/lawExplorer';
import { Curve, PLabel, Path, Plot, Seg } from '../plot/Plot';
import './gasfig.css';
import './kinfig.css';

const t = String.raw;
const GASES = [
  { f: 'H2', tex: t`\mathrm{H_2}` }, { f: 'He', tex: t`\mathrm{He}` }, { f: 'H2O', tex: t`\mathrm{H_2O}` },
  { f: 'N2', tex: t`\mathrm{N_2}` }, { f: 'O2', tex: t`\mathrm{O_2}` }, { f: 'CO2', tex: t`\mathrm{CO_2}` },
] as const;
type Gas = (typeof GASES)[number]['f'];
const Mkg = (g: Gas) => molarMass(g) / 1000; // kg/mol
const SCALE = 1000; // plot f in units of 10⁻³ s/m
const ALL_ROLES = ['ct', 'ce', 'cs', 'cp', 'cn', 'cg'] as const;

interface State { gas: Gas; T: number }

/**
 * Slides 26–27: the distribution of molecular speeds. Move T and the gas; pin a curve to compare; set a speed and read the
 * fraction of molecules that are faster (the shaded area of slide 26). The three special speeds are marked.
 */
export function MaxwellExplorer() {
  const tr = useTr(), lang = useLang();
  const [cur, setCur] = useState<State>({ gas: 'N2', T: 373.15 });
  const [ref, setRef] = useState<State | null>({ gas: 'N2', T: 273.15 });
  const [v0, setV0] = useState(500);
  const [all, setAll] = useState(false);
  const f = (x: number, d: number) => fmtNum(x, d, lang, true);
  const fp = (x: number, d: number) => fmtNum(x, d, lang);
  const M0 = Mkg(cur.gas), T = cur.T;
  const rms = vRms(T, M0), mp = vMp(T, M0), av = vAv(T, M0);
  const sets = [cur, ...(ref && !all ? [ref] : [])];
  const xmax = Math.max(2000, Math.ceil((2.7 * Math.max(...sets.map((s) => vRms(s.T, Mkg(s.gas))))) / 500) * 500);
  const peak = Math.max(...(all ? GASES.map((g) => maxwell(vMp(T, Mkg(g.f)), T, Mkg(g.f))) : sets.map((s) => maxwell(vMp(s.T, Mkg(s.gas)), s.T, Mkg(s.gas))))) * SCALE;
  const ymax = niceMax(peak);
  const fr = (v: number, s: State) => maxwell(v, s.T, Mkg(s.gas)) * SCALE;
  const shade: [number, number][] = [[v0, 0]];
  for (let i = 0; i <= 60; i++) { const v = v0 + ((xmax - v0) * i) / 60; shade.push([v, fr(v, cur)]); }
  shade.push([xmax, 0]);
  const above = fractionAbove(v0, T, M0);
  const celsius = T - 273.15;
  return (
    <figure className="vdemo kinfig mx">
      <Plot x={[0, xmax]} y={[0, ymax]} grid={[500, niceStep(ymax)]} tick={[500, niceStep(ymax)]} axes={[t`v`, t`f(v)`]} className="wide mx-plot"
        label={tr('Verteilung der Molekülgeschwindigkeiten', 'Distribution of molecular speeds')}>
        {!all && <Path pts={shade} role="cp" fill />}
        {all
          ? GASES.map((g, i) => <Curve key={g.f} f={(v) => fr(v, { gas: g.f, T })} role={ALL_ROLES[i]} width={g.f === cur.gas ? 3.4 : 2} />)
          : <>
            {ref && <Curve f={(v) => fr(v, ref)} role="ref" dashed width={2.2} />}
            <Curve f={(v) => fr(v, cur)} role="cp" />
          </>}
        {!all && <>
          <Seg a={[mp, 0]} b={[mp, fr(mp, cur)]} role="cs" dashed width={1.6} />
          <Seg a={[av, 0]} b={[av, fr(av, cur)]} role="cn" dashed width={1.6} />
          <Seg a={[rms, 0]} b={[rms, fr(rms, cur)]} role="ce" dashed width={1.6} />
          <PLabel x={mp} y={ymax * 0.98} tex={t`v_{\mathrm{mp}}`} role="cs" dx={-4} anchor="r" small />
          <PLabel x={av} y={ymax * 0.88} tex={t`v_{\mathrm{av}}`} role="cn" dx={5} anchor="l" small />
          <PLabel x={rms} y={ymax * 0.78} tex={t`v_{\mathrm{rms}}`} role="ce" dx={5} anchor="l" small />
          <Seg a={[v0, 0]} b={[v0, ymax]} role="fg" width={1.4} />
        </>}
        {all && GASES.map((g, i) => {
          const m = vMp(T, Mkg(g.f));
          return <PLabel key={g.f} x={m} y={fr(m, { gas: g.f, T })} tex={g.tex} role={ALL_ROLES[i]} dy={-11} small />;
        })}
      </Plot>
      <div className="kf-controls">
        <div className="v-presets kf-gases" role="group" aria-label={tr('Gas wählen', 'Choose a gas')}>
          {GASES.map((g) => <button type="button" key={g.f} aria-pressed={cur.gas === g.f} onClick={() => setCur({ ...cur, gas: g.f })}><M>{g.tex}</M></button>)}
        </div>
        <label className="slider kf-t"><span><M>T</M></span>
          <input type="range" min={100} max={1000} step={5} value={T} aria-label={tr('Temperatur', 'Temperature')} onChange={(e) => setCur({ ...cur, T: +e.target.value })} />
          <span className="val">{fp(T, 0)} K</span></label>
        {!all && <label className="slider kf-v"><span><M>{t`v_0`}</M></span>
          <input type="range" min={100} max={xmax - 100} step={25} value={Math.min(v0, xmax - 100)} aria-label={tr('Grenzgeschwindigkeit', 'Threshold speed')} onChange={(e) => setV0(+e.target.value)} />
          <span className="val">{fp(v0, 0)} m/s</span></label>}
        <div className="v-presets kf-act">
          <button type="button" onClick={() => setRef({ ...cur })} disabled={all}>{tr('Kurve festhalten', 'Pin this curve')}</button>
          <button type="button" onClick={() => { setAll(false); setCur({ gas: 'N2', T: 373.15 }); setRef({ gas: 'N2', T: 273.15 }); setV0(500); }}>{tr('Folie: ', 'Slide: ')}<M>{t`0\,^\circ\mathrm{C}`}</M> {tr('und', 'and')} <M>{t`100\,^\circ\mathrm{C}`}</M></button>
          <button type="button" aria-pressed={all} onClick={() => setAll(!all)}>{tr('Alle Gase bei diesem T', 'All gases at this T')}</button>
        </div>
      </div>
      <div className="kf-read">
        {!all && <div className="kf-row kf-hl"><span>{tr('Schneller als', 'Faster than')} <M>{t`v_0=${f(v0, 0)}\,\mathrm{m/s}`}</M></span><b><M>{t`${f(above * 100, 0)}\,\%`}</M></b></div>}
        <div className="kf-row"><span><M>{t`v_{\mathrm{mp}}\ <\ v_{\mathrm{av}}\ <\ v_{\mathrm{rms}}`}</M></span><b><M>{t`${f(mp, 0)}\ <\ ${f(av, 0)}\ <\ ${f(rms, 0)}\ \mathrm{m/s}`}</M></b></div>
        <div className="kf-row"><span>{tr('Mittlere Bewegungsenergie pro mol', 'Average kinetic energy per mole')} <M>{t`\tfrac32RT`}</M></span><b><M>{t`${f(meanKEMolar(T) / 1000, 2)}\,\mathrm{kJ/mol}`}</M></b></div>
        <div className="kf-note">{tr('Die Energie hängt nur von', 'The energy depends only on')} <M>T</M>{tr(', nicht vom Gas (Folie 25). Aktuelle Temperatur: ', ', not on the gas (slide 25). Current temperature: ')}<M>{t`${f(celsius, 0)}\,^\circ\mathrm{C}`}</M></div>
      </div>
    </figure>
  );
}
