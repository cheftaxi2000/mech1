import { useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { RHO_HG_EXACT, RHO_WATER, columnHeight, convertP, manometerP } from '../../chem/gas';
import { at } from '../figUtils';
import './gasfig.css';

const t = String.raw;
const G = 9.80665;
const VB1: [number, number, number, number] = [0, 0, 220, 280];
const VB2: [number, number, number, number] = [0, 0, 240, 280];
const SCALE2 = 0.42; // px per mm of mercury in the manometer
export const MANOMETER_SLIDE_H = 136.4 - 103.8; // mm, the two mercury levels printed on the slide (lecture 2, slide 13)

/**
 * Slides 12–13: barometer and manometer side by side. One «weather» slider sets the atmospheric pressure, the
 * barometer shows how high it holds up a column of mercury (or water), the manometer shows how a gas pressure
 * appears as a height difference h: P_gas = P_atm + ρ g h.
 */
export function PressureTools() {
  const tr = useTr(), lang = useLang();
  const [patm, setPatm] = useState(101.325); // kPa
  const [liquid, setLiquid] = useState<'hg' | 'water'>('hg');
  const [pgas, setPgas] = useState(105.67); // kPa
  const f = (x: number, d: number) => fmtNum(x, d, lang, true);
  const fp = (x: number, d: number) => fmtNum(x, d, lang);
  const rho = liquid === 'hg' ? RHO_HG_EXACT : RHO_WATER;
  const h = columnHeight(patm * 1e3, rho, G); // m
  const hMax = columnHeight(106e3, rho, G);
  const k = 196 / hMax; // px per m
  const surface = 214, tubeL = 96, tubeR = 118, topY = 20;
  const yTop = surface - h * k;
  // manometer: h in mm of mercury (> 0: the open side stands higher)
  const hm = ((pgas - patm) * 1e3) / (RHO_HG_EXACT * G) * 1000; // mm
  const d = Math.max(-110, Math.min(110, hm * SCALE2));
  const mid = 150, yl = mid + d / 2, yr = mid - d / 2;
  const Pa = patm * 1e3;
  const setH = (mm: number) => setPgas(manometerP(Pa, RHO_HG_EXACT, mm / 1000, G) / 1e3);
  const unitRow: [string, number][] = [
    ['Pa', Pa], ['kPa', convertP(Pa, 'Pa', 'kPa')], ['bar', convertP(Pa, 'Pa', 'bar')], ['atm', convertP(Pa, 'Pa', 'atm')], ['torr', convertP(Pa, 'Pa', 'torr')],
  ];
  const dec = (u: string) => (u === 'Pa' ? 0 : u === 'kPa' ? 1 : u === 'torr' ? 0 : 3);
  return (
    <figure className="vdemo gasfig pt-fig">
      <div className="pt-grid">
        <div className="pt-panel">
          <div className="pt-title">{tr('Barometer', 'Barometer')}</div>
          <div className="gb-stage pt-stage">
            <svg viewBox={VB1.join(' ')} role="img" aria-label={tr('Barometer: eine Flüssigkeitssäule wird vom Luftdruck getragen', 'Barometer: a liquid column held up by the air pressure')}>
              <rect className={`pt-liq ${liquid}`} x={14} y={surface} width={150} height={44} />
              <polyline className="pt-glass" points={`${14},${surface - 8} ${14},${258} ${164},${258} ${164},${surface - 8}`} />
              <rect className={`pt-liq ${liquid}`} x={tubeL + 1.5} y={yTop} width={tubeR - tubeL - 3} height={surface - yTop + 30} />
              <polyline className="pt-glass" points={`${tubeL},${topY} ${tubeL},${246} ${tubeR},${246} ${tubeR},${topY} ${tubeL},${topY}`} />
              {[24, 50, 132, 156].map((x) => <g key={x}><line className="pt-arr" x1={x} y1={surface - 52} x2={x} y2={surface - 12} /><polygon className="pt-arr-h" points={`${x},${surface - 8} ${x - 5},${surface - 17} ${x + 5},${surface - 17}`} /></g>)}
              <line className="pt-dash" x1={tubeR + 4} x2={186} y1={yTop} y2={yTop} />
              <line className="pt-dash" x1={tubeR + 4} x2={186} y1={surface} y2={surface} />
              <line className="pt-dim" x1={178} x2={178} y1={surface} y2={yTop + 7} /><polygon className="pt-dim-h" points={`178,${yTop} 173,${yTop + 9} 183,${yTop + 9}`} />
            </svg>
            <div className="vdemo-label pt-l p" style={at(VB1, 22, surface - 62)}><M>{t`P_{\mathrm{atm}}`}</M></div>
            <div className="vdemo-label pt-l v" style={at(VB1, 200, (yTop + surface) / 2)}><M>h</M></div>
            <div className="vdemo-label pt-l m" style={at(VB1, tubeR + 38, topY + 14)}>{yTop - topY > 26 ? tr('Vakuum', 'vacuum') : ''}</div>
          </div>
          <div className="pt-read"><M>{liquid === 'hg' ? t`h=${f(h * 1000, 0)}\,\mathrm{mm}` : t`h=${f(h, 2)}\,\mathrm{m}`}</M></div>
          <div className="v-presets pt-liquid" role="group" aria-label={tr('Flüssigkeit', 'Liquid')}>
            <button type="button" aria-pressed={liquid === 'hg'} onClick={() => setLiquid('hg')}>{tr('Quecksilber', 'Mercury')}</button>
            <button type="button" aria-pressed={liquid === 'water'} onClick={() => setLiquid('water')}>{tr('Wasser', 'Water')}</button>
          </div>
        </div>
        <div className="pt-panel">
          <div className="pt-title">{tr('Manometer', 'Manometer')}</div>
          <div className="gb-stage pt-stage">
            <svg viewBox={VB2.join(' ')} role="img" aria-label={tr('Manometer: U-Rohr mit Quecksilber, links das Gas, rechts offen', 'Manometer: U-tube with mercury, gas on the left, open on the right')}>
              <circle className="pt-bulb" cx={30} cy={62} r={26} />
              {[[22, 56], [36, 66], [26, 70], [38, 52], [20, 68]].map(([x, y], i) => <circle key={i} className="pt-gas" cx={x} cy={y} r={2.8} />)}
              <rect className="pt-gasfill" x={54} y={54} width={16} height={16} />
              <rect className="pt-gasfill" x={70} y={40} width={22} height={yl - 40} />
              <polygon className="pt-liq hg" points={`70,${yl} 92,${yl} 92,240 140,240 140,${yr} 162,${yr} 162,262 70,262`} />
              <polyline className="pt-glass" points="70,40 70,262 162,262 162,20" />
              <polyline className="pt-glass" points="92,40 92,240 140,240 140,20" />
              <line className="pt-glass" x1={70} y1={40} x2={92} y2={40} />
              <line className="pt-glass" x1={54} y1={54} x2={70} y2={54} /><line className="pt-glass" x1={54} y1={70} x2={70} y2={70} />
              <line className="pt-arr" x1={151} y1={0} x2={151} y2={16} /><polygon className="pt-arr-h" points="151,26 146,15 156,15" />
              <line className="pt-dash" x1={162} x2={200} y1={yr} y2={yr} />
              <line className="pt-dash" x1={92} x2={200} y1={yl} y2={yl} />
              {Math.abs(d) > 6 && <g><line className="pt-dim" x1={190} x2={190} y1={d > 0 ? yl : yr} y2={d > 0 ? yr + 7 : yl + 7} />
                <polygon className="pt-dim-h" points={d > 0 ? `190,${yr} 185,${yr + 9} 195,${yr + 9}` : `190,${yl} 185,${yl - 9} 195,${yl - 9}`} /></g>}
            </svg>
            <div className="vdemo-label pt-l p" style={at(VB2, 122, 10)}><M>{t`P_{\mathrm{atm}}`}</M></div>
            <div className="vdemo-label pt-l g" style={at(VB2, 30, 100)}><M>{t`P_{\mathrm{gas}}`}</M></div>
            {Math.abs(d) > 6 && <div className="vdemo-label pt-l v" style={at(VB2, 214, (yl + yr) / 2)}><M>h</M></div>}
            <div className="vdemo-label pt-l m" style={at(VB2, 116, 272)}><M>{t`\mathrm{Hg}`}</M></div>
          </div>
          <div className="pt-read"><M>{t`h=${f(hm, 1)}\,\mathrm{mm}`}</M></div>
          <div className="v-presets pt-liquid" role="group" aria-label={tr('Beispiele', 'Examples')}>
            <button type="button" onClick={() => setH(MANOMETER_SLIDE_H)} aria-pressed={Math.abs(hm - MANOMETER_SLIDE_H) < 0.5}>{tr('Folie', 'Slide')}</button>
            <button type="button" onClick={() => setH(120)} aria-pressed={Math.abs(hm - 120) < 0.5}>{tr('120 mm Hg', '120 mm Hg')}</button>
            <button type="button" onClick={() => setH(-40)} aria-pressed={Math.abs(hm + 40) < 0.5}>{tr('Unterdruck', 'Below atm.')}</button>
          </div>
        </div>
      </div>
      <div className="gb-controls pt-sliders">
        <label className="slider pt-w"><span><M>{t`P_{\mathrm{atm}}`}</M></span>
          <input type="range" min={60} max={105} step={0.5} value={patm} aria-label={tr('Luftdruck', 'Air pressure')} onChange={(e) => setPatm(+e.target.value)} />
          <span className="val">{fp(patm, 1)} kPa</span></label>
        <label className="slider pt-g"><span><M>{t`P_{\mathrm{gas}}`}</M></span>
          <input type="range" min={60} max={130} step={0.5} value={Math.round(pgas * 2) / 2} aria-label={tr('Gasdruck', 'Gas pressure')} onChange={(e) => setPgas(+e.target.value)} />
          <span className="val">{fp(pgas, 1)} kPa</span></label>
      </div>
      <div className="pt-units" role="group" aria-label={tr('Derselbe Luftdruck in fünf Einheiten', 'The same air pressure in five units')}>
        {unitRow.map(([u, v]) => <span key={u}><M>{t`${f(v, dec(u))}\,\mathrm{${u}}`}</M></span>)}
      </div>
    </figure>
  );
}
