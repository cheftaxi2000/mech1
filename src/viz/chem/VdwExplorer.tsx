import { useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { VDW_TABLE, attractionTerm, idealPm, vdwP, vdwTc, vdwZCurve, zFactor } from '../../chem/kinetic';
import { niceMax, niceStep } from '../../chem/lawExplorer';
import { Curve, HLine, Path, Plot, Pt, Seg } from '../plot/Plot';
import './gasfig.css';
import './kinfig.css';

const t = String.raw;
const TEX: Record<string, string> = { He: t`\mathrm{He}`, Ne: t`\mathrm{Ne}`, Ar: t`\mathrm{Ar}`, Kr: t`\mathrm{Kr}`, Xe: t`\mathrm{Xe}`, H2: t`\mathrm{H_2}`, N2: t`\mathrm{N_2}`, O2: t`\mathrm{O_2}` };
const P_MAX = 1e5; // kPa = 100 MPa, as on slide 29

/**
 * Slides 29–30 and lecture 3, slides 5–7: real gases. Left: PV/(nRT) against P for one mole, like slide 29 (ideal = 1).
 * Right: the isotherm P(V) of one mole, ideal against van der Waals, with a state point whose two corrections you can read:
 * the attraction term n²a/V² added to P and the volume nb taken away from V.
 */
export function VdwExplorer() {
  const tr = useTr(), lang = useLang();
  const [gas, setGas] = useState('N2');
  const [T, setT] = useState(300);
  const [s, setS] = useState(0.35); // position of the state point: log₁₀ of the molar volume between 1.5 b and 5 L/mol
  const g = VDW_TABLE.find((x) => x.f === gas)!;
  const { a, b } = g;
  const lo = Math.log10(1.5 * b), hi = Math.log10(5);
  const Vm = 10 ** (lo + s * (hi - lo));
  const Pv = vdwP(Vm, T, a, b), Pi = idealPm(Vm, T);
  const ok = Pv > 0;
  const f = (x: number, d: number) => fmtNum(x, d, lang, true);
  const zc = vdwZCurve(T, a, b, P_MAX);
  const zPts = zc.map(([P, z]) => [P / 1000, z] as [number, number]);
  const Vmax = 1;
  const Ymax = niceMax(idealPm(0.12, T) / 1000);
  const tc = vdwTc(a, b);
  return (
    <figure className="vdemo kinfig vw">
      <div className="v-presets kf-gases" role="group" aria-label={tr('Gas wählen', 'Choose a gas')}>
        {VDW_TABLE.map((x) => <button type="button" key={x.f} aria-pressed={gas === x.f} onClick={() => setGas(x.f)}><M>{TEX[x.f]}</M></button>)}
      </div>
      <div className="vw-plots">
        <Plot x={[0, 100]} y={[0, 2]} grid={[20, 0.5]} tick={[20, 0.5]} axes={[t`P`, t`Z`]} className="vw-plot" label={tr('PV/nRT gegen P', 'PV/nRT against P')}>
          <HLine y={1} role="aux" />
          <Path pts={zPts} role="cp" />
          {ok && Pv / 1000 <= 100 && <Pt x={Pv / 1000} y={zFactor(Pv, Vm, T)} role="fg" r={6} />}
        </Plot>
        <Plot x={[0, Vmax]} y={[0, Ymax]} grid={[0.2, niceStep(Ymax)]} tick={[0.2, niceStep(Ymax)]} axes={[t`V`, t`P`]} className="vw-plot" label={tr('Isotherme: ideal und van der Waals', 'Isotherm: ideal and van der Waals')}>
          <Curve f={(V) => idealPm(V, T) / 1000} dom={[0.02, Vmax]} role="ref" dashed width={2.2} />
          <Curve f={(V) => vdwP(V, T, a, b) / 1000} dom={[b * 1.001, Vmax]} breaks={[b]} role="cp" />
          <Seg a={[b, 0]} b={[b, Ymax]} role="cv" dashed width={1.4} />
          {Vm <= Vmax && ok && <Seg a={[Vm, 0]} b={[Vm, Pv / 1000]} role="aux" dashed />}
          {Vm <= Vmax && ok && <Pt x={Vm} y={Pv / 1000} role="fg" r={6} />}
          {Vm <= Vmax && <Pt x={Vm} y={Pi / 1000} role="ref" r={4.5} />}
        </Plot>
      </div>
      <div className="kf-controls">
        <label className="slider kf-t"><span><M>T</M></span>
          <input type="range" min={100} max={600} step={5} value={T} aria-label={tr('Temperatur', 'Temperature')} onChange={(e) => setT(+e.target.value)} />
          <span className="val">{fmtNum(T, 0, lang)} K</span></label>
        <label className="slider kf-v"><span><M>V</M></span>
          <input type="range" min={0} max={1} step={0.005} value={s} aria-label={tr('Molares Volumen', 'Molar volume')} onChange={(e) => setS(+e.target.value)} />
          <span className="val">{fmtNum(Vm, Vm < 1 ? 3 : 2, lang)} L</span></label>
      </div>
      <table className="gb-table kf-table">
        <tbody>
          <tr><th><M>{t`P_{\mathrm{ideal}}=\dfrac{RT}{V}`}</M></th><td><M>{t`${f(Pi / 1000, 2)}\,\mathrm{MPa}`}</M></td></tr>
          <tr><th><M>{t`P_{\mathrm{vdW}}=\dfrac{RT}{V-b}-\dfrac{a}{V^2}`}</M></th><td>{ok ? <M>{t`${f(Pv / 1000, 2)}\,\mathrm{MPa}`}</M> : tr('gasförmig nicht mehr möglich', 'no gas state any more')}</td></tr>
          <tr className="kf-corr"><th>{tr('Anziehung: addiert zu', 'Attraction: added to')} <M>P</M>: <M>{t`\dfrac{n^2a}{V^2}`}</M></th><td><M>{t`${f(attractionTerm(Vm, a) / 1000, 3)}\,\mathrm{MPa}`}</M></td></tr>
          <tr className="kf-corr"><th>{tr('Eigenes Volumen: abgezogen von', 'Own volume: subtracted from')} <M>V</M>: <M>{t`nb`}</M></th><td><M>{t`${f(b, 4)}\,\mathrm{L}\ =\ ${f((100 * b) / Vm, 0)}\,\%\ \text{${tr('von', 'of')}}\ V`}</M></td></tr>
          <tr className="gb-sum"><th><M>{t`Z=\dfrac{PV}{nRT}`}</M></th><td>{ok ? <M>{t`${f(zFactor(Pv, Vm, T), 2)}`}</M> : '–'}</td></tr>
        </tbody>
      </table>
      <div className="kf-note">
        {tr('Links: ', 'Left: ')}<M p=",">{t`Z=PV/(nRT)`}</M> <M>P</M> {tr('in', 'in')} <M p=".">{t`\mathrm{MPa}`}</M> {tr('Rechts: ', 'Right: ')}<M>P</M> {tr('in', 'in')} <M p=",">{t`\mathrm{MPa}`}</M> <M>V</M> {tr('in', 'in')} <M p=".">{t`\mathrm{L}`}</M> <M p=",">{t`a=${f(a, a < 10 ? 2 : 0)}\,\mathrm{L^2\,kPa/mol^2}`}</M> <M p=".">{t`b=${f(b, 4)}\,\mathrm{L/mol}`}</M> {tr('Unterhalb von', 'Below')} <M>{t`T_c=${f(tc, 0)}\,\mathrm{K}`}</M> {tr('ist die Kurve nicht mehr eindeutig (das Gas verflüssigt sich).', 'the curve is no longer unique (the gas liquefies).')}
      </div>
    </figure>
  );
}
