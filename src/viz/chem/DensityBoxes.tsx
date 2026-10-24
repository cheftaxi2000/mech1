import { useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { R_SLIDE, gasDensity } from '../../chem/gas';
import { molarMass } from '../../chem/formula';
import './gasfig.css';

const t = String.raw;
const GASES = [
  { f: 'He', tex: t`\mathrm{He}`, cls: 'dn-he', r: 3.4, M: molarMass('He') },
  { f: 'N2', tex: t`\mathrm{N_2}`, cls: 'dn-n2', r: 4.6, M: molarMass('N2') },
  { f: 'CO2', tex: t`\mathrm{CO_2}`, cls: 'dn-co2', r: 5.4, M: molarMass('CO2') },
] as const;
const RHO_MAX = 4;
/** number of particles drawn per box: proportional to n/V = P/RT (the same in all three boxes — Avogadro) */
export const dotCount = (P: number, T: number) => Math.max(3, Math.round(12 * (P / T) * 300));
const spots = (n: number) => Array.from({ length: n }, (_, k) => [((k * 37 + 13) % 101) / 101, ((k * 59 + 29) % 103) / 103] as const);

/**
 * Slide 21: the same volume, the same P and T hold the same number of molecules of every ideal gas (Avogadro);
 * the density ρ = P·M_w/(R·T) then differs only by the molar mass.
 */
export function DensityBoxes() {
  const tr = useTr(), lang = useLang();
  const [P, setP] = useState(1), [T, setT] = useState(298);
  const f = (x: number, d: number) => fmtNum(x, d, lang, true);
  const N = dotCount(P, T);
  const nV = P / (R_SLIDE.latm * T);
  return (
    <figure className="vdemo gasfig dn-fig">
      <div className="dn-boxes">
        {GASES.map((g) => {
          const rho = gasDensity(P, g.M, T);
          return (
            <div key={g.f} className="dn-col">
              <svg viewBox="0 0 100 100" role="img" aria-label={`${g.f}`}>
                <rect className="dn-box" x={2} y={2} width={96} height={96} rx={3} />
                {spots(N).map(([x, y], i) => <circle key={i} className={g.cls} cx={9 + x * 82} cy={9 + y * 82} r={g.r} />)}
              </svg>
              <div className="dn-name"><M>{g.tex}</M> <span className="dn-m"><M>{t`M_w=${f(g.M, 1)}\,\mathrm{g/mol}`}</M></span></div>
              <div className="dn-bar"><i className={g.cls} style={{ width: `${Math.min(100, (rho / RHO_MAX) * 100)}%` }} /></div>
              <div className="dn-rho"><M>{t`\rho=${f(rho, 2)}\,\mathrm{g/L}`}</M></div>
            </div>
          );
        })}
      </div>
      <div className="gb-controls">
        <label className="slider gb-p"><span><M>P</M></span>
          <input type="range" min={0.5} max={3} step={0.1} value={P} aria-label={tr('Druck P', 'Pressure P')} onChange={(e) => setP(+e.target.value)} />
          <span className="val">{fmtNum(P, 1, lang)} atm</span></label>
        <label className="slider gb-t"><span><M>T</M></span>
          <input type="range" min={200} max={500} step={5} value={T} aria-label={tr('Temperatur T', 'Temperature T')} onChange={(e) => setT(+e.target.value)} />
          <span className="val">{T} K</span></label>
      </div>
      <div className="gb-row dn-sum">
        <span>{tr('In jedem Kasten gleich viele Teilchen:', 'The same number of particles in every box:')} <M>{t`\dfrac{n}{V}=\dfrac{P}{RT}`}</M></span>
        <b><M>{t`${f(nV, 4)}\,\mathrm{mol/L}`}</M></b>
      </div>
    </figure>
  );
}
