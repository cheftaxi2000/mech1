import { useEffect, useRef, useState, type ReactElement } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, tupleSep, useLang, useTr } from '../../i18n';
import { MOLAR_VOLUME_STP, STP, cToK, kToC, type GasState } from '../../chem/gas';
import { LAW_DEFS, RANGES, START, curve, lawConstant, lawState, niceMax, niceStep, type LawId } from '../../chem/lawExplorer';
import { Curve, PLabel, Plot, Pt, Seg, VLine } from '../plot/Plot';
import { useReducedMotion } from '../figUtils';
import './gasfig.css';

const t = String.raw;
const NAME: Record<LawId, [string, string]> = {
  boyle: ['Boyle (n, T fest)', 'Boyle (n, T fixed)'],
  charles: ['Charles (n, P fest)', 'Charles (n, P fixed)'],
  avogadro: ['Avogadro (P, T fest)', 'Avogadro (P, T fixed)'],
  pt: ['P–T (n, V fest)', 'P–T (n, V fixed)'],
};
const UNIT: Record<keyof GasState, string> = { P: t`\mathrm{atm}`, V: t`\mathrm{L}`, T: t`\mathrm{K}`, n: t`\mathrm{mol}` };
const CONSTTEX: Record<LawId, string> = { boyle: t`PV`, charles: t`V/T`, avogadro: t`V/n`, pt: t`P/T` };
const CONSTUNIT: Record<LawId, string> = { boyle: t`\mathrm{L\,atm}`, charles: t`\mathrm{L\,K^{-1}}`, avogadro: t`\mathrm{L\,mol^{-1}}`, pt: t`\mathrm{atm\,K^{-1}}` };
const ROLE = { P: 'cp', V: 'cv', T: 'ct', n: 'cn' } as const;
const ghost = (v: number, k: keyof GasState): number[] => [v * 0.5, v * 2].filter((x) => x >= RANGES[k].min * 0.3);

/**
 * Slides 14–19: the three gas laws (and the P–T relation of slide 19) as curves. Two of the four variables are held
 * fixed, the student moves a third, the fourth follows from PV = nRT; the state point travels along the curve and the
 * constant of the law stays the same.
 */
export function GasLawExplorer() {
  const tr = useTr(), lang = useLang(), reduced = useReducedMotion();
  const [law, setLaw] = useState<LawId>('boyle');
  const [s0, setS0] = useState<GasState>(START);
  const [play, setPlay] = useState(false);
  const def = LAW_DEFS[law];
  const s = lawState(law, s0);
  const f = (x: number, d: number) => fmtNum(x, d, lang, true);
  const fp = (x: number, d: number) => fmtNum(x, d, lang);
  const f0 = curve(law, s);
  const free = def.free;
  const set = (k: keyof GasState, v: number) => setS0((o) => ({ ...o, [k]: v }));

  // ping-pong sweep of the free variable
  const ph = useRef(0);
  useEffect(() => {
    if (!play) return;
    let raf = 0, last = performance.now();
    const r = RANGES[free];
    const tick = (now: number) => {
      ph.current = (ph.current + (now - last) / 7000) % 1; last = now;
      const u = ph.current < 0.5 ? ph.current * 2 : 2 - ph.current * 2;
      const v = r.min + u * (r.max - r.min);
      setS0((o) => ({ ...o, [free]: Math.round(v / (r.step / 4)) * (r.step / 4) }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, free]);
  useEffect(() => { if (reduced) setPlay(false); }, [reduced]);

  const gridOf = (max: number) => niceStep(max);
  // ---- panels ----
  let panels: ReactElement[] = [];
  if (law === 'boyle') {
    const Pmax = niceMax(f0(RANGES.V.min)), invMax = 1 / RANGES.V.min;
    panels = [
      <Plot key="a" x={[0, 20]} y={[0, Pmax]} grid={[5, gridOf(Pmax)]} tick={[5, gridOf(Pmax)]} axes={[t`V\ (\mathrm{L})`, t`P\ (\mathrm{atm})`]} className="gf-plot" label={tr('P gegen V', 'P against V')}>
        {ghost(s.T, 'T').map((T) => <Curve key={T} f={curve('boyle', { ...s, T })} dom={[RANGES.V.min, 20]} role="aux" dashed width={1.6} />)}
        <Curve f={f0} dom={[RANGES.V.min, 20]} role="cp" />
        <Seg a={[s.V, 0]} b={[s.V, s.P]} role="aux" dashed /><Seg a={[0, s.P]} b={[s.V, s.P]} role="aux" dashed />
        <Pt x={s.V} y={s.P} role="fg" r={6} />
        <PLabel x={s.V} y={s.P} tex={t`\bigl(${f(s.V, 1)}${tupleSep(lang)}${f(s.P, 2)}\bigr)`} role="fg" dx={8} dy={-14} anchor="l" small />
      </Plot>,
      <Plot key="b" x={[0, invMax]} y={[0, Pmax]} grid={[0.1, gridOf(Pmax)]} tick={[0.1, gridOf(Pmax)]} axes={[t`1/V\ (\mathrm{L^{-1}})`, t`P\ (\mathrm{atm})`]} className="gf-plot" label={tr('P gegen 1/V: eine Gerade', 'P against 1/V: a straight line')}>
        {ghost(s.T, 'T').map((T) => <Curve key={T} f={(x) => curve('boyle', { ...s, T })(1 / x)} dom={[0.01, invMax]} role="aux" dashed width={1.6} />)}
        <Curve f={(x) => f0(1 / x)} dom={[0.02, invMax]} role="cp" />
        <Seg a={[1 / s.V, 0]} b={[1 / s.V, s.P]} role="aux" dashed /><Seg a={[0, s.P]} b={[1 / s.V, s.P]} role="aux" dashed />
        <Pt x={1 / s.V} y={s.P} role="fg" r={6} />
      </Plot>,
    ];
  } else if (law === 'charles') {
    const Vmax = niceMax(f0(500)), cut = 150; // below 150 K a real gas has long since become a liquid: dashed
    panels = [
      <Plot key="a" x={[-300, 250]} y={[0, Vmax]} grid={[100, gridOf(Vmax)]} tick={[100, gridOf(Vmax)]} axes={[t`T\ (^\circ\mathrm{C})`, t`V\ (\mathrm{L})`]} className="gf-plot" label={tr('V gegen T in °C', 'V against T in °C')}>
        {ghost(s.P, 'P').map((P) => <Curve key={P} f={(c) => curve('charles', { ...s, P })(cToK(c))} dom={[-ZC, 250]} role="aux" dashed width={1.6} />)}
        <Curve f={(c) => f0(cToK(c))} dom={[kToC(cut), 250]} role="cv" />
        <Curve f={(c) => f0(cToK(c))} dom={[-ZC, kToC(cut)]} role="cv" dashed />
        <VLine x={-ZC} role="asym" />
        <PLabel x={-ZC} y={Vmax * 0.9} tex={t`${f(-273.15, 2)}\,^\circ\mathrm{C}`} role="g" dx={6} anchor="l" small />
        <Seg a={[kToC(s.T), 0]} b={[kToC(s.T), s.V]} role="aux" dashed /><Seg a={[-300, s.V]} b={[kToC(s.T), s.V]} role="aux" dashed />
        <Pt x={kToC(s.T)} y={s.V} role="fg" r={6} />
      </Plot>,
      <Plot key="b" x={[0, 600]} y={[0, Vmax]} grid={[100, gridOf(Vmax)]} tick={[100, gridOf(Vmax)]} axes={[t`T\ (\mathrm{K})`, t`V\ (\mathrm{L})`]} className="gf-plot" label={tr('V gegen T in K: eine Gerade durch den Nullpunkt', 'V against T in K: a straight line through the origin')}>
        {ghost(s.P, 'P').map((P) => <Curve key={P} f={curve('charles', { ...s, P })} dom={[0, 600]} role="aux" dashed width={1.6} />)}
        <Curve f={f0} dom={[cut, 600]} role="cv" /><Curve f={f0} dom={[0, cut]} role="cv" dashed />
        <Seg a={[s.T, 0]} b={[s.T, s.V]} role="aux" dashed /><Seg a={[0, s.V]} b={[s.T, s.V]} role="aux" dashed />
        <Pt x={s.T} y={s.V} role="fg" r={6} />
      </Plot>,
    ];
  } else if (law === 'avogadro') {
    const Vmax = niceMax(f0(RANGES.n.max));
    panels = [
      <Plot key="a" x={[0, 1.2]} y={[0, Vmax]} grid={[0.2, gridOf(Vmax)]} tick={[0.2, gridOf(Vmax)]} axes={[t`n\ (\mathrm{mol})`, t`V\ (\mathrm{L})`]} className="gf-plot" label={tr('V gegen n', 'V against n')}>
        {ghost(s.P, 'P').map((P) => <Curve key={P} f={curve('avogadro', { ...s, P })} dom={[0, 1.2]} role="aux" dashed width={1.6} />)}
        <Curve f={f0} dom={[0, 1.2]} role="cv" />
        <Seg a={[s.n, 0]} b={[s.n, s.V]} role="aux" dashed /><Seg a={[0, s.V]} b={[s.n, s.V]} role="aux" dashed />
        <Pt x={s.n} y={s.V} role="fg" r={6} />
      </Plot>,
    ];
  } else {
    const Pmax = niceMax(f0(600));
    panels = [
      <Plot key="a" x={[0, 600]} y={[0, Pmax]} grid={[100, gridOf(Pmax)]} tick={[100, gridOf(Pmax)]} axes={[t`T\ (\mathrm{K})`, t`P\ (\mathrm{atm})`]} className="gf-plot" label={tr('P gegen T', 'P against T')}>
        {ghost(s.V, 'V').map((V) => <Curve key={V} f={curve('pt', { ...s, V })} dom={[0, 600]} role="aux" dashed width={1.6} />)}
        <Curve f={f0} dom={[0, 600]} role="cp" />
        <Seg a={[s.T, 0]} b={[s.T, s.P]} role="aux" dashed /><Seg a={[0, s.P]} b={[s.T, s.P]} role="aux" dashed />
        <Pt x={s.T} y={s.P} role="fg" r={6} />
      </Plot>,
    ];
  }

  const statePreset = law === 'avogadro' ? { P: STP.P_atm, T: STP.T } : null;
  const kind = (k: keyof GasState) => (k === free ? 'free' : def.fixed.includes(k) ? 'fixed' : 'follows');
  const rows = (['P', 'V', 'T', 'n'] as (keyof GasState)[]);
  return (
    <figure className="vdemo gasfig gf">
      <div className="v-presets gf-tabs" role="tablist" aria-label={tr('Gasgesetz wählen', 'Choose a gas law')}>
        {(Object.keys(LAW_DEFS) as LawId[]).map((id) => (
          <button type="button" role="tab" key={id} aria-selected={law === id} aria-pressed={law === id} onClick={() => { setLaw(id); setPlay(false); }}>{tr(...NAME[id])}</button>
        ))}
      </div>
      <div className={`gf-plots n${panels.length}`}>{panels}</div>
      <div className="gb-controls gf-sliders">
        {[free, ...def.fixed].map((k) => {
          const r = RANGES[k];
          return (
            <label key={k} className={`slider gf-s gf-${kind(k)} ${ROLE[k]}`}>
              <span><M>{k}</M></span>
              <input type="range" min={r.min} max={r.max} step={r.step} value={s0[k]} aria-label={`${k}`} onChange={(e) => { setPlay(false); set(k, +e.target.value); }} />
              <span className="val">{fp(s[k], k === 'n' || k === 'P' ? 2 : k === 'V' ? 1 : 0)} {k === 'P' ? 'atm' : k === 'V' ? 'L' : k === 'T' ? 'K' : 'mol'}</span>
            </label>
          );
        })}
        <div className="gf-note">{tr('Die oberste Regel bewegst du; die anderen beiden bleiben fest.', 'You move the top slider; the other two stay fixed.')}</div>
      </div>
      <table className="gb-table gf-table">
        <tbody>
          {rows.map((k) => (
            <tr key={k} className={`gf-r-${kind(k)}`}>
              <th><M>{k}</M></th>
              <td><M>{t`${f(s[k], k === 'n' || k === 'P' ? 2 : k === 'V' ? 2 : 1)}\,${UNIT[k]}`}</M>{k === 'T' ? <> <M>{t`=\ ${f(kToC(s.T), 1)}\,^\circ\mathrm{C}`}</M></> : null}</td>
              <td className="gf-tag">{kind(k) === 'free' ? tr('du bewegst', 'you move') : kind(k) === 'fixed' ? tr('fest', 'fixed') : <>{tr('folgt aus', 'follows from')} <M>{t`PV=nRT`}</M></>}</td>
            </tr>
          ))}
          <tr className="gb-sum"><th><M>{CONSTTEX[law]}</M></th><td colSpan={2}><M>{t`=\ ${f(lawConstant(law, s), law === 'pt' ? 4 : law === 'charles' ? 4 : 3)}\,${CONSTUNIT[law]}`}</M> <span className="gf-tag">{tr('bleibt konstant', 'stays constant')}</span></td></tr>
        </tbody>
      </table>
      <div className="gb-foot">
        <div className="v-presets">
          {statePreset && <button type="button" onClick={() => setS0((o) => ({ ...o, ...statePreset }))} aria-pressed={s0.T === STP.T && s0.P === STP.P_atm}>{tr('STP: 0 °C, 1 atm', 'STP: 0 °C, 1 atm')}</button>}
          <button type="button" onClick={() => { setS0(START); setPlay(false); }}>{tr('Zurücksetzen', 'Reset')}</button>
        </div>
        <button type="button" className="motion-btn" onClick={() => setPlay((p) => !p)}>{play ? tr('Pause', 'Pause') : tr('Abspielen', 'Play')}</button>
      </div>
      {law === 'avogadro' && <p className="gf-hint">{tr(`Molares Volumen bei STP: ${fmtNum(MOLAR_VOLUME_STP, 2, lang)} L pro mol, für jedes ideale Gas gleich.`, `Molar volume at STP: ${fmtNum(MOLAR_VOLUME_STP, 2, lang)} L per mol, the same for every ideal gas.`)}</p>}
    </figure>
  );
}
const ZC = 273.15;
