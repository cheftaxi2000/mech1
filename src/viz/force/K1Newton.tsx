import { useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr, type Lang } from '../../i18n';
import { t } from './kfKit';
import { SCALE_ITEMS, weightOfMass } from '../../physics/kraftScale';
import './force.css';

/** log axis from 1 mN (0 %) to 1 MN (100 %): 9 decades */
export const LOG_MIN = -3, LOG_SPAN = 9;
export const pct = (newton: number) => Math.max(0, Math.min(100, ((Math.log10(newton) - LOG_MIN) / LOG_SPAN) * 100));

/** two significant digits, with the unit that keeps the number readable: "0,98 N", "12 kN" */
export function fmtForce(n: number, lang: Lang): string {
  const unit = n >= 1e6 ? 'MN' : n >= 1e3 ? 'kN' : 'N';
  const v = n >= 1e6 ? n / 1e6 : n >= 1e3 ? n / 1e3 : n;
  const dig = v >= 100 ? 0 : v >= 10 ? 0 : v >= 1 ? 1 : v >= 0.1 ? 2 : 4;
  return `${fmtNum(v, dig, lang)} ${unit}`;
}
export function fmtMass(m: number, lang: Lang): string {
  if (m >= 1000) return `${fmtNum(m / 1000, m >= 10000 ? 0 : 1, lang)} t`;
  if (m >= 1) return `${fmtNum(m, m >= 10 ? 0 : 1, lang)} kg`;
  return `${fmtNum(m * 1000, m >= 0.01 ? 0 : 1, lang)} g`;
}

/**
 * «How big is 1 N?» — weights of everyday things on a logarithmic bar chart (supplement, not in the Skript).
 * The purple row follows the slider: the weight of any mass from 1 g to 100 t.
 */
export function K1Newton() {
  const tr = useTr(), lang = useLang();
  const [lg, setLg] = useState(0.4); // log10 of the mass in kg
  const m = 10 ** lg, w = weightOfMass(m);
  const ticks: [number, string][] = [[0.01, `${fmtNum(0.01, 2, lang)} N`], [1, '1 N'], [100, '100 N'], [1e4, '10 kN'], [1e6, '1 MN']];
  return (
    <figure className="vdemo kf-wide">
      <div className="kf-log" role="group" aria-label={tr('Gewichtskräfte alltäglicher Dinge auf einer logarithmischen Skala', 'Weights of everyday things on a logarithmic scale')}>
        {SCALE_ITEMS.map((it) => {
          const f = weightOfMass(it.m);
          return (
            <div key={it.id} className={`r${it.id === 'apple' ? ' anchor' : ''}`}>
              <span className="nm">{tr(it.de, it.en)} <span className="kf-note">({fmtMass(it.m, lang)})</span></span>
              <span className="bar"><i style={{ width: `${pct(f)}%` }} /></span>
              <span className="vl">{fmtForce(f, lang)}</span>
            </div>
          );
        })}
        <div className="r you">
          <span className="nm"><b>{tr('Dein Gegenstand', 'Your object')}</b> <span className="kf-note">({fmtMass(m, lang)})</span></span>
          <span className="bar"><i style={{ width: `${pct(w)}%` }} /></span>
          <span className="vl"><b>{fmtForce(w, lang)}</b></span>
        </div>
        <div className="ax"><span />
          <span className="scale">{ticks.map(([v, lab]) => <span key={v} style={{ left: `${pct(v)}%` }}>{lab}</span>)}</span>
          <span /></div>
      </div>
      <div className="kf-ctl" style={{ marginTop: 8 }}>
        <label className="slider wide-slider"><span><M>m</M></span>
          <input type="range" min={-3} max={5} step={0.02} value={lg} onChange={(e) => setLg(+e.target.value)} aria-label={tr('Masse des Gegenstands', 'Mass of the object')} />
          <span className="val">{fmtMass(m, lang)}</span></label>
        <p className="kf-note" style={{ margin: 0 }}>{tr('Jeder Teilstrich der Skala ist 100-mal so viel wie der vorige. Die Erde zieht einen Gegenstand der Masse ', 'Each tick of the scale is 100 times the previous one. The Earth pulls an object of mass ')}<M>m</M>{tr(' mit der Gewichtskraft ', ' with the weight force ')}<M p=".">{lang === 'de' ? t`G \approx 9{,}81\,\tfrac{\mathrm{N}}{\mathrm{kg}}\cdot m` : t`G \approx 9.81\,\tfrac{\mathrm{N}}{\mathrm{kg}}\cdot m`}</M></p>
      </div>
    </figure>
  );
}
