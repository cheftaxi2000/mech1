import { useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { R_SLIDE } from '../../chem/gas';
import { FLASH_S, createSim, idealPSim, measuredP, setCount, setT, setWidth, type Sim } from '../../chem/particles';
import { at } from '../figUtils';
import { useSim } from './useSim';
import './gasfig.css';

const t = String.raw;
/** one simulated particle stands for this many moles (so 20 particles = 0.40 mol) */
export const MOL_PER_PARTICLE = 0.02;
const PX = 180, X0 = 20, Y0 = 14;
const VB: [number, number, number, number] = [0, 0, 400, 236];
const BASE = { n: 0.4, T: 300, V: 10 };
const M_HE = 4.003, M_N2 = 28.01;

/** The box with the particles, the wall flashes and the piston (right wall). */
function BoxSvg({ sim, kinds }: { sim: Sim; kinds: { cls: string; r: number; dumbbell?: boolean }[] }) {
  const tr = useTr();
  const right = X0 + sim.W * PX;
  const sx = (x: number) => X0 + x * PX, sy = (y: number) => Y0 + (1 - y) * PX;
  return (
    <svg viewBox={VB.join(' ')} role="img" aria-label={tr('Gasteilchen in einer Box mit beweglichem Kolben', 'Gas particles in a box with a movable piston')}>
      <rect className="gb-box" x={X0} y={Y0} width={sim.W * PX} height={PX} />
      <rect className="gb-piston" x={right} y={Y0} width={9} height={PX} />
      <line className="gb-rod" x1={right + 9} y1={Y0 + PX / 2} x2={VB[2] - 6} y2={Y0 + PX / 2} />
      <g>
        {sim.flashes.map((f, i) => {
          const o = 1 - f.age / FLASH_S;
          const x = f.side === 'l' ? X0 : f.side === 'r' ? right : sx(f.x), y = f.side === 't' ? Y0 : f.side === 'b' ? Y0 + PX : sy(f.y);
          const horiz = f.side === 't' || f.side === 'b';
          return <line key={i} className="gb-flash" opacity={o} x1={horiz ? x - 9 : x} x2={horiz ? x + 9 : x} y1={horiz ? y : y - 9} y2={horiz ? y : y + 9} />;
        })}
      </g>
      <g>
        {sim.parts.map((p, i) => {
          const k = kinds[p.s];
          return k.dumbbell
            ? <g key={i} className={k.cls}><circle cx={sx(p.x) - k.r * 0.55} cy={sy(p.y)} r={k.r} /><circle cx={sx(p.x) + k.r * 0.55} cy={sy(p.y)} r={k.r} /></g>
            : <circle key={i} className={k.cls} cx={sx(p.x)} cy={sy(p.y)} r={k.r} />;
        })}
      </g>
      <line className="gb-dim" x1={X0} x2={right} y1={Y0 + PX + 14} y2={Y0 + PX + 14} />
      <line className="gb-dim" x1={X0} x2={X0} y1={Y0 + PX + 9} y2={Y0 + PX + 19} />
      <line className="gb-dim" x1={right} x2={right} y1={Y0 + PX + 9} y2={Y0 + PX + 19} />
    </svg>
  );
}

function Gauge({ parts, ideal, max, unitTex }: { parts: { value: number | null; cls: string }[]; ideal: number; max: number; unitTex: string }) {
  const lang = useLang();
  const pct = (v: number) => `${Math.min(100, (v / max) * 100)}%`;
  let acc = 0;
  return (
    <div className="gb-gauge" aria-hidden="true">
      <div className="gb-track">
        {parts.map((p, i) => {
          if (p.value === null) return null;
          const left = acc; acc += p.value;
          return <i key={i} className={p.cls} style={{ left: pct(left), width: pct(p.value) }} />;
        })}
        <b className="gb-tick" style={{ left: pct(ideal) }} />
      </div>
      <div className="gb-scale"><M>0</M><M>{t`${fmtNum(max / 2, 0, lang, true)}`}</M><M>{t`${fmtNum(max, 0, lang, true)}\,${unitTex}`}</M></div>
    </div>
  );
}

function PlayBtn({ playing, set }: { playing: boolean; set: (b: boolean) => void }) {
  const tr = useTr();
  return <button type="button" className="motion-btn" onClick={() => set(!playing)}>{playing ? tr('Pause', 'Pause') : tr('Abspielen', 'Play')}</button>;
}

/* ------------------------------------------------------------------------------------------------ */

/**
 * Slides 10–11 and 24–25: a gas as particles hitting the wall. The pressure shown is MEASURED from the wall hits of the
 * simulation (impulse per second per wall length), next to the value of the ideal gas law for the same n, T, V.
 */
export function PressureBox() {
  const tr = useTr(), lang = useLang();
  const [st, setSt] = useState(BASE);
  const { sim, playing, setPlaying, touch, hostRef } = useSim(() => createSim({ seed: 20, W: BASE.V / 10, T: BASE.T, masses: [28], counts: [Math.round(BASE.n / MOL_PER_PARTICLE)], keep: 10 }));
  const apply = (n: { n: number; T: number; V: number }) => {
    setSt(n);
    setT(sim, n.T); setWidth(sim, n.V / 10); setCount(sim, 0, Math.round(n.n / MOL_PER_PARTICLE));
    touch();
  };
  const R = R_SLIDE.latm;
  const Pid = (st.n * R * st.T) / st.V;
  const raw = measuredP(sim), c = Pid / idealPSim(sim);
  const Pm = raw === null ? null : raw * c;
  const f = (x: number, d: number) => fmtNum(x, d, lang);
  const ft = (x: number, d: number) => fmtNum(x, d, lang, true);
  const presets: [string, string, { n: number; T: number; V: number }][] = [
    ['Ausgangszustand', 'Starting state', BASE],
    ['Volumen halbieren', 'Halve the volume', { ...BASE, V: BASE.V / 2 }],
    ['Temperatur verdoppeln', 'Double the temperature', { ...BASE, T: 2 * BASE.T }],
    ['Doppelt so viele Teilchen', 'Twice as many particles', { ...BASE, n: 2 * BASE.n }],
  ];
  return (
    <figure className="vdemo gasfig" ref={hostRef}>
      <div className="gb-stage">
        <BoxSvg sim={sim} kinds={[{ cls: 'gb-p', r: 4.6 }]} />
        <div className="vdemo-label gb-vlab" style={at(VB, X0 + (sim.W * PX) / 2, Y0 + PX + 28)}><M>{t`V=${ft(st.V, 1)}\,\mathrm{L}`}</M></div>
      </div>
      <div className="gb-body">
        <div className="gb-controls">
          <label className="slider gb-t"><span><M>T</M></span>
            <input type="range" min={100} max={600} step={10} value={st.T} aria-label={tr('Temperatur T', 'Temperature T')} onChange={(e) => apply({ ...st, T: +e.target.value })} />
            <span className="val">{st.T} K</span></label>
          <label className="slider gb-v"><span><M>V</M></span>
            <input type="range" min={5} max={20} step={0.5} value={st.V} aria-label={tr('Volumen V', 'Volume V')} onChange={(e) => apply({ ...st, V: +e.target.value })} />
            <span className="val">{f(st.V, 1)} L</span></label>
          <label className="slider gb-n"><span><M>n</M></span>
            <input type="range" min={0.1} max={0.8} step={MOL_PER_PARTICLE} value={st.n} aria-label={tr('Stoffmenge n', 'Amount n')} onChange={(e) => apply({ ...st, n: Math.round(+e.target.value / MOL_PER_PARTICLE) * MOL_PER_PARTICLE })} />
            <span className="val">{f(st.n, 2)} mol</span></label>
        </div>
        <div className="gb-readout">
          <div className="gb-row"><span>{tr('Druck aus den Wandstössen', 'Pressure from the wall hits')}</span><b className="gb-cp">{Pm === null ? '…' : <M>{t`${ft(Pm, 2)}\,\mathrm{atm}`}</M>}</b></div>
          <div className="gb-row"><span>{tr('Rechnung', 'Calculation')} <M>{t`P=\dfrac{nRT}{V}`}</M></span><b>{<M>{t`${ft(Pid, 2)}\,\mathrm{atm}`}</M>}</b></div>
          <Gauge parts={[{ value: Pm, cls: 'gb-fill-p' }]} ideal={Pid} max={8} unitTex={t`\mathrm{atm}`} />
        </div>
      </div>
      <div className="gb-foot">
        <div className="v-presets" role="group" aria-label={tr('Beispiele', 'Examples')}>
          {presets.map(([de, en, s]) => (
            <button type="button" key={de} onClick={() => apply(s)} aria-pressed={s.n === st.n && s.T === st.T && s.V === st.V}>{tr(de, en)}</button>
          ))}
        </div>
        <PlayBtn playing={playing} set={setPlaying} />
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------------------------------------ */

const MIX_PRESETS: { id: string; he: number; n2: number }[] = [
  { id: 'i', he: 5, n2: 2 }, { id: 'ii', he: 3, n2: 1 }, { id: 'iii', he: 2, n2: 5 },
];

/**
 * Slides 22–23 and exercise 5: two ideal gases in the same box. Each species hits the wall as if it were alone, so the
 * measured partial pressures add up to the total (Dalton). Both species have the same average kinetic energy, the light
 * helium atoms are just faster.
 */
export function MixBox() {
  const tr = useTr(), lang = useLang();
  const [st, setSt] = useState({ he: 5, n2: 2, T: 300 });
  const { sim, playing, setPlaying, touch, hostRef } = useSim(() => createSim({ seed: 31, W: 1, T: 300, masses: [M_HE, M_N2], counts: [5, 2], keep: 16 }), 4);
  const apply = (s: { he: number; n2: number; T: number }) => {
    setSt(s); setT(sim, s.T); setCount(sim, 0, s.he); setCount(sim, 1, s.n2); touch();
  };
  const V = 10, R = R_SLIDE.latm;
  const nHe = st.he * MOL_PER_PARTICLE, nN = st.n2 * MOL_PER_PARTICLE, nTot = nHe + nN;
  const pHe = (nHe * R * st.T) / V, pN = (nN * R * st.T) / V, pTot = pHe + pN;
  const cal = (s: number) => { const i = idealPSim(sim, s); return i > 0 ? (s === 0 ? pHe : pN) / i : 0; };
  const raw = [measuredP(sim, 0), measuredP(sim, 1)];
  const mHe = raw[0] === null ? null : raw[0] * cal(0), mN = raw[1] === null ? null : raw[1] * cal(1);
  const rho = (nHe * M_HE + nN * M_N2) / V; // g/L
  const f = (x: number, d: number) => fmtNum(x, d, lang, true);
  const X = (n: number) => (nTot > 0 ? n / nTot : 0);
  const ratio = Math.sqrt(M_N2 / M_HE);
  return (
    <figure className="vdemo gasfig" ref={hostRef}>
      <div className="gb-stage">
        <BoxSvg sim={sim} kinds={[{ cls: 'gb-he', r: 3.8 }, { cls: 'gb-n2', r: 4.6, dumbbell: true }]} />
        <ul className="gb-legend">
          <li><svg viewBox="0 0 14 14" width="14" height="14"><circle className="gb-he" cx="7" cy="7" r="4.5" /></svg><M>{t`\mathrm{He}`}</M></li>
          <li><svg viewBox="0 0 20 14" width="20" height="14"><g className="gb-n2"><circle cx="6" cy="7" r="4.6" /><circle cx="11.5" cy="7" r="4.6" /></g></svg><M>{t`\mathrm{N_2}`}</M></li>
        </ul>
      </div>
      <div className="gb-body">
        <div className="gb-controls">
          <label className="slider gb-he-s"><span><M>{t`\mathrm{He}`}</M></span>
            <input type="range" min={0} max={10} step={1} value={st.he} aria-label={tr('Anzahl He-Atome', 'Number of He atoms')} onChange={(e) => apply({ ...st, he: +e.target.value })} />
            <span className="val">{st.he}</span></label>
          <label className="slider gb-n2-s"><span><M>{t`\mathrm{N_2}`}</M></span>
            <input type="range" min={0} max={10} step={1} value={st.n2} aria-label={tr('Anzahl N2-Moleküle', 'Number of N2 molecules')} onChange={(e) => apply({ ...st, n2: +e.target.value })} />
            <span className="val">{st.n2}</span></label>
          <label className="slider gb-t"><span><M>T</M></span>
            <input type="range" min={100} max={600} step={10} value={st.T} aria-label={tr('Temperatur T', 'Temperature T')} onChange={(e) => apply({ ...st, T: +e.target.value })} />
            <span className="val">{st.T} K</span></label>
        </div>
        <table className="gb-table">
          <thead><tr><th /><th><M>n</M></th><th><M>{t`X_i`}</M></th><th><M>{t`P_i`}</M> {tr('gemessen', 'measured')}</th><th><M>{t`P_i=n_iRT/V`}</M></th></tr></thead>
          <tbody>
            <tr><th><M>{t`\mathrm{He}`}</M></th><td><M>{t`${f(nHe, 2)}`}</M></td><td><M>{t`${f(X(nHe), 2)}`}</M></td><td className="gb-cp">{mHe === null ? '…' : <M>{t`${f(mHe, 2)}`}</M>}</td><td><M>{t`${f(pHe, 2)}`}</M></td></tr>
            <tr><th><M>{t`\mathrm{N_2}`}</M></th><td><M>{t`${f(nN, 2)}`}</M></td><td><M>{t`${f(X(nN), 2)}`}</M></td><td className="gb-cp">{mN === null ? '…' : <M>{t`${f(mN, 2)}`}</M>}</td><td><M>{t`${f(pN, 2)}`}</M></td></tr>
            <tr className="gb-sum"><th><M>{t`\mathrm{tot}`}</M></th><td><M>{t`${f(nTot, 2)}`}</M></td><td><M>{t`${f(1, 2)}`}</M></td><td className="gb-cp">{mHe === null || mN === null ? '…' : <M>{t`${f(mHe + mN, 2)}`}</M>}</td><td><M>{t`${f(pTot, 2)}`}</M></td></tr>
          </tbody>
        </table>
        <div className="gb-unit"><M>{t`n:\ \mathrm{mol},\quad P:\ \mathrm{atm}`}</M></div>
        <Gauge parts={[{ value: mHe, cls: 'gb-fill-he' }, { value: mN, cls: 'gb-fill-n2' }]} ideal={pTot} max={4} unitTex={t`\mathrm{atm}`} />
        <div className="gb-read2">
          <div><span>{tr('Dichte', 'Density')} <M>{t`\rho=m/V`}</M></span><b><M>{t`${f(rho, 2)}\,\mathrm{g/L}`}</M></b></div>
          <div><span>{tr('Mittlere kinetische Energie', 'Average kinetic energy')} <M>{t`\overline{E_k}`}</M></span><b>{tr('bei allen Gasen gleich', 'the same for every gas')}</b></div>
          <div><span>{tr('Tempo', 'Speed')} <M>{t`v_{\mathrm{He}}/v_{\mathrm{N_2}}`}</M></span><b><M>{t`\sqrt{\dfrac{M_{\mathrm{N_2}}}{M_{\mathrm{He}}}}=${f(ratio, 1)}`}</M></b></div>
        </div>
      </div>
      <div className="gb-foot">
        <div className="v-presets" role="group" aria-label={tr('Proben der Übung', 'Samples of the exercise')}>
          {MIX_PRESETS.map((p) => (
            <button type="button" key={p.id} onClick={() => apply({ ...st, he: p.he, n2: p.n2 })} aria-pressed={st.he === p.he && st.n2 === p.n2}><M>{t`(\mathrm{${p.id}})`}</M></button>
          ))}
        </div>
        <PlayBtn playing={playing} set={setPlaying} />
      </div>
    </figure>
  );
}

