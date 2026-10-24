import { useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { frequency, photonEnergy, regionOf, visibleRGB, type Region } from '../../chem/light';
import './gasfig.css';
import './lightfig.css';

const t = String.raw;
const LMIN = 100, LMAX = 2000; // nm, logarithmic slider
const WIN = 2000; // nm shown in the wave window
const W = 400, H = 150, X0 = 14, X1 = 386, MID = 82, AMP = 44;
export const sliderToNm = (s: number) => LMIN * Math.pow(LMAX / LMIN, s);
export const nmToSlider = (l: number) => Math.log(l / LMIN) / Math.log(LMAX / LMIN);
const xs = (l: number) => 14 + (372 * Math.log(l / LMIN)) / Math.log(LMAX / LMIN);
const REGION: Record<Region, [string, string]> = {
  gamma: ['Gammastrahlung', 'gamma rays'], xray: ['Röntgenstrahlung', 'X-rays'], uv: ['Ultraviolett', 'ultraviolet'], visible: ['sichtbares Licht', 'visible light'],
  ir: ['Infrarot', 'infrared'], micro: ['Mikrowellen', 'microwaves'], radio: ['Radiowellen', 'radio waves'],
};
const PRESETS: [number, string, string][] = [[430, 'blau', 'blue'], [530, 'grün', 'green'], [630, 'rot', 'red']];

/**
 * Slide 7: light as a wave. The slider sets the wavelength λ (logarithmic, 100 nm … 2000 nm); the picture shows the wave
 * over a window of 2000 nm, so short waves are crowded and long waves are stretched. Frequency ν = c/λ and the photon energy
 * E = hν follow. Under the wave a strip of the spectrum shows where this wavelength sits (ultraviolet – visible – infrared).
 */
export function LightWave() {
  const tr = useTr(), lang = useLang();
  const [s, setS] = useState(nmToSlider(530));
  const lam = sliderToNm(s);
  const rgb = visibleRGB(lam);
  const col = rgb ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : 'var(--muted)';
  const nu = frequency(lam * 1e-9), E = photonEnergy(lam * 1e-9);
  const region = regionOf(lam);
  const f = (x: number, d: number) => fmtNum(x, d, lang, true);
  const pts = Array.from({ length: 400 }, (_, i) => {
    const nmPos = (i / 399) * WIN;
    return `${(X0 + (nmPos / WIN) * (X1 - X0)).toFixed(1)},${(MID - AMP * Math.cos((2 * Math.PI * nmPos) / lam)).toFixed(1)}`;
  }).join(' ');
  const pxLam = ((X1 - X0) * lam) / WIN;
  const stripes = Array.from({ length: 37 }, (_, i) => 380 + i * 10);
  const sx = xs(lam);
  return (
    <figure className="vdemo lightfig lw">
      <div className="lw-stage">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={tr('Lichtwelle mit Wellenlänge', 'Light wave with wavelength')}>
          <line className="lw-axis" x1={X0} x2={X1} y1={MID} y2={MID} />
          <polyline className="lw-wave" points={pts} style={{ stroke: col }} />
          {pxLam < 330 && <g>
            <line className="lw-dim" x1={X0} x2={X0 + pxLam} y1={MID - AMP - 12} y2={MID - AMP - 12} />
            <line className="lw-dim" x1={X0} x2={X0} y1={MID - AMP - 17} y2={MID - AMP - 7} />
            <line className="lw-dim" x1={X0 + pxLam} x2={X0 + pxLam} y1={MID - AMP - 17} y2={MID - AMP - 7} />
          </g>}
          <polygon className="lw-prop" points={`${X1 - 30},${H - 14} ${X1 - 8},${H - 14} ${X1 - 8},${H - 19} ${X1},${H - 12} ${X1 - 8},${H - 5} ${X1 - 8},${H - 10} ${X1 - 30},${H - 10}`} />
        </svg>
        {pxLam < 330 && <div className="lw-label" style={{ left: `${((X0 + pxLam / 2) / W) * 100}%`, top: `${((MID - AMP - 24) / H) * 100}%` }}><M>\lambda</M></div>}
        <div className="lw-label muted" style={{ left: `${((X1 - 40) / W) * 100}%`, top: `${((H - 12) / H) * 100}%` }}><M>c</M></div>
      </div>
      <div className="lw-strip">
        <svg viewBox="0 0 400 52" role="img" aria-label={tr('Lage im Spektrum', 'Position in the spectrum')}>
          <rect className="lw-bg" x={14} y={10} width={372} height={22} />
          {stripes.map((w) => { const c = visibleRGB(w + 5)!; return <rect key={w} x={xs(w)} y={10} width={xs(w + 10) - xs(w) + 0.5} height={22} fill={`rgb(${c[0]},${c[1]},${c[2]})`} />; })}
          <rect className="lw-frame" x={14} y={10} width={372} height={22} />
          <polygon className="lw-mark" points={`${sx},${34} ${sx - 6},${46} ${sx + 6},${46}`} />
        </svg>
        <span className="lw-r" style={{ left: `${(xs(220) / 400) * 100}%` }}>{tr('Ultraviolett', 'ultraviolet')}</span>
        <span className="lw-r" style={{ left: `${(xs(1000) / 400) * 100}%` }}>{tr('Infrarot', 'infrared')}</span>
        <span className="lw-r vis" style={{ left: `${(xs(530) / 400) * 100}%` }}>{tr('sichtbar', 'visible')}</span>
      </div>
      <div className="lw-controls">
        <label className="slider lw-s"><span><M>\lambda</M></span>
          <input type="range" min={0} max={1} step={0.002} value={s} aria-label={tr('Wellenlänge', 'Wavelength')} onChange={(e) => setS(+e.target.value)} />
          <span className="val">{fmtNum(Math.round(lam), 0, lang)} nm</span></label>
        <div className="v-presets" role="group" aria-label={tr('Beispiele der Folie', 'Examples of the slide')}>
          {PRESETS.map(([l, de, en]) => <button type="button" key={l} aria-pressed={Math.abs(lam - l) < 3} onClick={() => setS(nmToSlider(l))}>{l} nm {tr(de, en)}</button>)}
          <button type="button" onClick={() => setS(nmToSlider(200))}>{tr('200 nm Ultraviolett', '200 nm ultraviolet')}</button>
          <button type="button" onClick={() => setS(nmToSlider(1000))}>{tr('1000 nm Infrarot', '1000 nm infrared')}</button>
        </div>
      </div>
      <table className="gb-table lw-table">
        <tbody>
          <tr><th><M>{t`\nu=\dfrac{c}{\lambda}`}</M></th><td><M>{t`${f(nu / 1e14, 2)}\cdot10^{14}\,\mathrm{Hz}`}</M></td></tr>
          <tr><th><M>{t`E=h\nu=\dfrac{hc}{\lambda}`}</M></th><td><M>{t`${f(E / 1e-19, 2)}\cdot10^{-19}\,\mathrm J`}</M></td></tr>
          <tr className="gb-sum"><th>{tr('Bereich', 'Region')}</th><td>{tr(...REGION[region])}</td></tr>
        </tbody>
      </table>
      <div className="lw-ebar" aria-hidden="true"><i style={{ width: `${Math.min(100, (E / 20e-19) * 100)}%`, background: rgb ? col : 'var(--ch-el)' }} /></div>
      <div className="lw-note">{tr('Balken: Energie eines Photons. Kurze Welle, hohe Frequenz, viel Energie.', 'Bar: energy of one photon. Short wave, high frequency, lots of energy.')}</div>
    </figure>
  );
}
