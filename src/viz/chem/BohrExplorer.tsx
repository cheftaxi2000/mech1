import { useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { SERIES, balmerNm, levelEnergy, nm, regionOf, transition, visibleRGB, type Region } from '../../chem/light';
import './gasfig.css';
import './lightfig.css';

const t = String.raw;
const N = [1, 2, 3, 4, 5, 6];
const orbitR = (n: number) => 16 + 24 * (n - 1);
const CX = 150, CY = 150;
const levelY = (n: number) => 26 + (-levelEnergy(n) / -levelEnergy(1)) * 236;
const stripX = (l: number) => 14 + (372 * (l - 400)) / 300;
const REGION: Record<Region, [string, string]> = {
  gamma: ['Gammastrahlung', 'gamma rays'], xray: ['Röntgenstrahlung', 'X-rays'], uv: ['Ultraviolett', 'ultraviolet'], visible: ['sichtbares Licht', 'visible light'],
  ir: ['Infrarot', 'infrared'], micro: ['Mikrowellen', 'microwaves'], radio: ['Radiowellen', 'radio waves'],
};
const PRESETS: { de: string; en: string; ni: number; nf: number }[] = [
  { de: 'Folie 11: ', en: 'Slide 11: ', ni: 3, nf: 1 },
  { de: 'rote Linie: ', en: 'red line: ', ni: 3, nf: 2 },
  { de: 'blaugrüne Linie: ', en: 'blue-green line: ', ni: 4, nf: 2 },
  { de: 'violette Linie: ', en: 'violet line: ', ni: 6, nf: 2 },
  { de: 'Übung 2: ', en: 'Exercise 2: ', ni: 1, nf: Infinity },
];
const wiggle = (a: [number, number], b: [number, number], amp: number, waves: number): string => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  return Array.from({ length: 41 }, (_, i) => {
    const s = i / 40, w = Math.sin(2 * Math.PI * waves * s) * amp * Math.min(1, s * 6, (1 - s) * 6);
    return `${(a[0] + dx * s - uy * w).toFixed(1)},${(a[1] + dy * s + ux * w).toFixed(1)}`;
  }).join(' ');
};

/**
 * Slides 8–11: the hydrogen atom in Bohr's picture. Pick the orbit the electron starts on and the orbit it ends on. The
 * orbit picture, the energy levels and the spectrum strip show the same jump: the photon that is emitted (down) or absorbed
 * (up), its energy ΔE = E_f − E_i, its wavelength λ = hc/|ΔE| and, if it is visible, its place among the four lines of slide 8.
 */
export function BohrExplorer() {
  const tr = useTr(), lang = useLang();
  const [ni, setNi] = useState(3), [nf, setNf] = useState(1);
  const same = ni === nf;
  const tn = transition(ni, nf);
  const lam = nm(tn.lambda);
  const vis = !same && lam >= 400 && lam <= 700;
  const rgb = !same ? visibleRGB(lam) : null;
  const photonCol = rgb ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : 'var(--ch-el)';
  const f = (x: number, d: number) => fmtNum(x, d, lang, true);
  const ang = -0.75, ang0 = -0.75;
  const pos = (n: number, a: number): [number, number] => { const R = Number.isFinite(n) ? orbitR(n) : 146; return [CX + R * Math.cos(a), CY + R * Math.sin(a)]; };
  const e1 = pos(ni, ang0), e2 = pos(nf, ang);
  const mid: [number, number] = [(e1[0] + e2[0]) / 2, (e1[1] + e2[1]) / 2];
  const out: [number, number] = [mid[0] + (tn.emitted ? 50 : -50) * 0.9, mid[1] - 40];
  const yi = levelY(ni), yf = levelY(nf);
  const unit = (x: number, d: number) => t`${f(x, d)}\cdot10^{-18}\,\mathrm J`;
  const ser = SERIES[Math.min(ni, nf)];
  const lines = balmerNm(6);
  return (
    <figure className="vdemo lightfig bx">
      <div className="bx-grid">
        <div className="bx-orbits">
          <svg viewBox="0 0 300 300" role="img" aria-label={tr('Bohr-Bahnen mit Elektron und Photon', 'Bohr orbits with electron and photon')}>
            {N.map((n) => <circle key={n} className="bx-orbit" cx={CX} cy={CY} r={orbitR(n)} />)}
            <circle className="bx-nuc" cx={CX} cy={CY} r={6} />
            {!same && <line className="bx-jump" x1={e1[0]} y1={e1[1]} x2={e2[0]} y2={e2[1]} />}
            {!same && <circle className="bx-ghost" cx={e1[0]} cy={e1[1]} r={6} />}
            {!same && <polyline className="bx-photon" points={wiggle(tn.emitted ? mid : out, tn.emitted ? out : mid, 5, 3)} style={{ stroke: photonCol }} />}
            <circle className="bx-e" cx={e2[0]} cy={e2[1]} r={7} />
            {N.map((n) => <text key={n} className="bx-n" x={CX - orbitR(n) * 0.71 - 3} y={CY + orbitR(n) * 0.71 + 12} textAnchor="end">{n}</text>)}
          </svg>
          <div className="bx-cap"><M>{t`n=1,2,3,\dots`}</M> {tr('(Folie 10: nicht massstäblich)', '(slide 10: not to scale)')}</div>
        </div>
        <div className="bx-levels">
          <svg viewBox="0 0 220 300" role="img" aria-label={tr('Energieniveaus des Wasserstoffatoms', 'Energy levels of the hydrogen atom')}>
            <line className="bx-axis" x1={30} y1={14} x2={30} y2={286} />
            <polygon className="bx-axis-h" points="30,8 25,18 35,18" />
            <line className="bx-inf" x1={40} x2={150} y1={levelY(Infinity)} y2={levelY(Infinity)} />
            {N.map((n) => <line key={n} className={`bx-level${n === ni || n === nf ? ' on' : ''}`} x1={40} x2={150} y1={levelY(n)} y2={levelY(n)} />)}
            {!same && <g>
              <line className="bx-arrow" x1={95} x2={95} y1={yi} y2={Number.isFinite(nf) ? yf + (yf > yi ? -9 : 9) : yf + 9} style={{ stroke: tn.emitted ? 'var(--ch-t)' : 'var(--ch-p)' }} />
              <polygon className="bx-arrow-h" points={yf > yi ? `95,${yf} 90,${yf - 10} 100,${yf - 10}` : `95,${yf} 90,${yf + 10} 100,${yf + 10}`} style={{ fill: tn.emitted ? 'var(--ch-t)' : 'var(--ch-p)' }} />
              <polyline className="bx-photon" points={wiggle(tn.emitted ? [112, (yi + yf) / 2] : [168, (yi + yf) / 2], tn.emitted ? [168, (yi + yf) / 2] : [112, (yi + yf) / 2], 4.5, 3)} style={{ stroke: photonCol }} />
            </g>}
            <circle className="bx-e" cx={55} cy={yf} r={5.5} />
          </svg>
          {N.filter((n) => n <= 3 || n === ni || n === nf).map((n) => <div key={n} className="bx-l" style={{ left: `${(158 / 220) * 100}%`, top: `${(levelY(n) / 300) * 100}%` }}><M>{t`n=${n}`}</M></div>)}
          <div className="bx-l" style={{ left: `${(158 / 220) * 100}%`, top: `${((levelY(Infinity) - 13) / 300) * 100}%` }}><M>{t`n=\infty`}</M></div>
          <div className="bx-l muted" style={{ left: `${(14 / 220) * 100}%`, top: `${(levelY(Infinity) / 300) * 100}%` }}><M>0</M></div>
          <div className="bx-l e" style={{ left: `${(14 / 220) * 100}%`, top: `${(8 / 300) * 100}%` }}><M>E</M></div>
        </div>
      </div>
      <div className="bx-sel">
        <div className="bx-row"><span><M>{t`n_i`}</M> {tr('Start', 'start')}</span>
          <div className="v-presets" role="group" aria-label={tr('Startbahn', 'Starting orbit')}>
            {N.map((n) => <button type="button" key={n} aria-pressed={ni === n} onClick={() => setNi(n)}><M>{String(n)}</M></button>)}
          </div></div>
        <div className="bx-row"><span><M>{t`n_f`}</M> {tr('Ziel', 'target')}</span>
          <div className="v-presets" role="group" aria-label={tr('Zielbahn', 'Target orbit')}>
            {N.map((n) => <button type="button" key={n} aria-pressed={nf === n} onClick={() => setNf(n)}><M>{String(n)}</M></button>)}
            <button type="button" aria-pressed={!Number.isFinite(nf)} onClick={() => setNf(Infinity)}><M>{t`\infty`}</M></button>
          </div></div>
        <div className="v-presets bx-pre" role="group" aria-label={tr('Beispiele', 'Examples')}>
          {PRESETS.map((p) => <button type="button" key={p.de} aria-pressed={p.ni === ni && p.nf === nf} onClick={() => { setNi(p.ni); setNf(p.nf); }}>{tr(p.de, p.en)}<M>{t`${p.ni}\to ${Number.isFinite(p.nf) ? String(p.nf) : '\\infty'}`}</M></button>)}
        </div>
      </div>
      <div className="bx-strip">
        <svg viewBox="0 0 400 56" role="img" aria-label={tr('Spektrum von 400 bis 700 nm mit den Linien des Wasserstoffs', 'Spectrum from 400 to 700 nm with the lines of hydrogen')}>
          <rect className="bx-sbg" x={14} y={6} width={372} height={26} />
          {lines.map((l) => { const c = visibleRGB(l.nm)!; return <rect key={l.n} x={stripX(l.nm) - 1.5} y={6} width={3} height={26} fill={`rgb(${c[0]},${c[1]},${c[2]})`} />; })}
          {Array.from({ length: 7 }, (_, i) => 400 + i * 50).map((l) => <line key={l} className="bx-tick" x1={stripX(l)} x2={stripX(l)} y1={32} y2={37} />)}
          {vis && <polygon className="bx-mark" points={`${stripX(lam)},${34} ${stripX(lam) - 6},${47} ${stripX(lam) + 6},${47}`} />}
        </svg>
        {[400, 450, 500, 550, 600, 650, 700].map((l) => <span key={l} className="bx-sl" style={{ left: `${(stripX(l) / 400) * 100}%` }}>{l}</span>)}
        <div className="bx-snote">{tr('Wellenlänge in nm. Die vier hellen Linien sind die sichtbaren Linien des Wasserstoffs (Folie 8).', 'Wavelength in nm. The four bright lines are the visible lines of hydrogen (slide 8).')}</div>
      </div>
      <table className="gb-table bx-table">
        <tbody>
          {same
            ? <tr><th colSpan={2}>{tr('Start und Ziel sind gleich: nichts passiert.', 'Start and target are the same: nothing happens.')}</th></tr>
            : <>
              <tr><th><M>{t`\Delta E=E_f-E_i`}</M></th><td><M>{t`${tn.dE < 0 ? '-' : '+'}${f(Math.abs(tn.dE) / 1e-18, 2)}\cdot10^{-18}\,\mathrm J`}</M></td></tr>
              <tr><th>{tn.emitted ? tr('Das Elektron fällt: Photon wird abgegeben', 'The electron falls: a photon is emitted') : tr('Das Elektron steigt: Photon wird aufgenommen', 'The electron rises: a photon is absorbed')}</th><td><M>{t`E_{\mathrm{ph}}=${unit(tn.photonE / 1e-18, 2)}`}</M></td></tr>
              <tr><th><M>{t`\lambda=\dfrac{hc}{E_{\mathrm{ph}}}`}</M></th><td><M>{t`${f(lam, lam < 1000 ? 1 : 0)}\,\mathrm{nm}`}</M></td></tr>
              <tr><th><M>{t`\dfrac1\lambda=R_H\Bigl(\dfrac{1}{n_1^2}-\dfrac{1}{n_2^2}\Bigr)`}</M></th><td><M>{t`n_1=${Math.min(ni, nf)},\ n_2=${Number.isFinite(Math.max(ni, nf)) ? String(Math.max(ni, nf)) : '\\infty'}`}</M></td></tr>
              <tr className="gb-sum"><th>{tr('Bereich', 'Region')}{ser ? <> · {tr('Serie', 'series')} {ser[0]}</> : null}</th><td>{tr(...REGION[regionOf(lam)])}{vis ? '' : tr(' (nicht im Streifen)', ' (not in the strip)')}</td></tr>
            </>}
        </tbody>
      </table>
    </figure>
  );
}
