import { useEffect, useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { skaterAt, type SkaterSpec } from '../../physics/skaters';
import { useReducedMotion } from '../figUtils';
import { Arrow, Frame, KLabel, t, type V } from './kfKit';

const VB: [number, number, number, number] = [0, 0, 400, 200];
const GROUND = 168, PXM = 34, CX = 200;
const F = 90, TAU = 0.5, TEND = 2.6, SLOW = 0.9; // N, s, s (simulated), real seconds per simulated second
const LEN_F = 0.5; // px per N

/**
 * Supplement to «Reaktionsprinzip»: two people on roller skates, A₁ pushes A₂. Equal and opposite forces {A₂ | F̲}, {A₁ | −F̲} act for
 * half a second; afterwards both roll away with constant speed – the lighter one faster. (Dynamics is not part of this page;
 * the picture only makes the pair visible.)
 */
export function K2Skaters() {
  const tr = useTr(), lang = useLang(), reduced = useReducedMotion();
  const [m1, setM1] = useState(60), [m2, setM2] = useState(30);
  const [phase, setPhase] = useState<'ready' | 'run' | 'done'>('ready');
  const [ts, setTs] = useState(0); // simulated seconds
  const spec: SkaterSpec = { m1, m2, F, tau: TAU };

  useEffect(() => {
    if (phase !== 'run') return;
    if (reduced) { setTs(TEND); setPhase('done'); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const s = Math.min(TEND, ((now - t0) / 1000) / SLOW);
      setTs(s);
      if (s >= TEND) { setPhase('done'); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, reduced]);

  const st = skaterAt(spec, 0, phase === 'ready' ? 0 : ts);
  const hw = (m: number) => 11 + 0.2 * m; // half width of a body grows with mass
  const h1 = hw(m1), h2 = hw(m2);
  const c1 = CX - h1 + PXM * st.x1, c2 = CX + h2 + PXM * st.x2; // centres on screen
  const e1 = c1 + h1, e2 = c2 - h2; // the facing edges (the hands)
  const pushing = phase !== 'ready' && st.pushing;
  const contact: V = [(e1 + e2) / 2, 96];
  const body = (c: number, h: number, key: string, face: 1 | -1) => (
    <g key={key}>
      <rect x={c - h} y={GROUND - 92} width={2 * h} height={84} rx={12} className="kf-body" />
      <circle cx={c + face * 2} cy={GROUND - 114} r={14} className="kf-body" />
      <circle cx={c - h * 0.55} cy={GROUND - 3} r={6} className="kf-body" /><circle cx={c + h * 0.55} cy={GROUND - 3} r={6} className="kf-body" />
    </g>
  );
  const f = (x: number, d = 2) => fmtNum(x, d, lang);
  const fl = (x: number) => fmtNum(x, 2, lang, true);
  const v1 = Math.abs(skaterAt(spec, 0, TEND).v1), v2 = Math.abs(skaterAt(spec, 0, TEND).v2);
  const rolling = phase !== 'ready' && !st.pushing;

  return (
    <Frame vb={VB} label={tr('Zwei Personen auf Rollschuhen stossen sich voneinander ab', 'Two people on roller skates push each other apart')} className="kf-skaters"
      labels={<>
        {pushing && <KLabel vb={VB} x={contact[0] + 36} y={78} ink="force" anchor="l">{t`\{A_2\,|\,\v F\}`}</KLabel>}
        {pushing && <KLabel vb={VB} x={contact[0] - 36} y={78} ink="force" anchor="r">{t`\{A_1\,|\,-\v F\}`}</KLabel>}
        {rolling && v1 > 0 && <KLabel vb={VB} x={c1 + (Math.sign(st.v1) * Math.abs(st.v1) * 40) / 2} y={GROUND - 150} ink="vel">{t`\v v_1`}</KLabel>}
        {rolling && v2 > 0 && <KLabel vb={VB} x={c2 + (st.v2 * 40) / 2} y={GROUND - 150} ink="vel">{t`\v v_2`}</KLabel>}
        <KLabel vb={VB} x={c1} y={GROUND + 18} ink="fg">{t`A_1`}</KLabel>
        <KLabel vb={VB} x={c2} y={GROUND + 18} ink="fg">{t`A_2`}</KLabel>
        <div className="vdemo-label small fg" style={{ left: `${(c1 / 400) * 100}%`, top: `${((GROUND - 48) / 200) * 100}%` }}>{m1} kg</div>
        <div className="vdemo-label small fg" style={{ left: `${(c2 / 400) * 100}%`, top: `${((GROUND - 48) / 200) * 100}%` }}>{m2} kg</div>
      </>}
      caption={<>
        <div className="kf-ctl">
          <label className="slider wide-slider"><span><M>{t`m_1`}</M></span>
            <input type="range" min={30} max={90} step={5} value={m1} disabled={phase === 'run'} onChange={(e) => { setM1(+e.target.value); setPhase('ready'); }} aria-label={tr('Masse von A1', 'Mass of A1')} />
            <span className="val">{m1} kg</span></label>
          <label className="slider wide-slider"><span><M>{t`m_2`}</M></span>
            <input type="range" min={30} max={90} step={5} value={m2} disabled={phase === 'run'} onChange={(e) => { setM2(+e.target.value); setPhase('ready'); }} aria-label={tr('Masse von A2', 'Mass of A2')} />
            <span className="val">{m2} kg</span></label>
          <div className="row">
            <button type="button" className="kf-chip go" disabled={phase === 'run'} onClick={() => { setTs(0); setPhase('run'); }}>{phase === 'done' ? tr('Nochmals', 'Again') : tr('Schubs!', 'Push!')}</button>
            <button type="button" className="kf-chip" disabled={phase === 'ready'} onClick={() => { setPhase('ready'); setTs(0); }}>{tr('Zurück', 'Back')}</button>
          </div>
        </div>
        <div className="kf-read" role="status">
          {phase === 'done' ? <div className="big">
            <div><M>{t`|\v v_1| = ${fl(v1)}\,\mathrm{m/s}`}</M>{', '}<M>{t`|\v v_2| = ${fl(v2)}\,\mathrm{m/s}`}</M></div>
          </div> : <div className="kf-note">{tr('Beim Schubs wirken die zwei Pfeile gleich lang, aber in entgegengesetzte Richtung – jeder an einem anderen Körper.', 'During the push both arrows are equally long but point in opposite directions – each on a different body.')}</div>}
          {phase === 'done' && <div>{v2 > v1 + 1e-9 ? <><M>{t`A_2`}</M> {tr('ist leichter und rollt schneller weg.', 'is lighter and rolls away faster.')}</> : v1 > v2 + 1e-9 ? <><M>{t`A_1`}</M> {tr('ist leichter und rollt schneller weg.', 'is lighter and rolls away faster.')}</> : tr('Beide sind gleich schwer und rollen gleich schnell weg.', 'Both are equally heavy and roll away equally fast.')}</div>}
          <div className="kf-note">{tr('Die Kraft ist auf ', 'The force is ')}{f(F, 0)} N{tr(' für ', ' for ')}{f(TAU, 1)} s{tr(' festgelegt (Ergänzung).', ' (supplement).')}</div>
        </div>
      </>}>
      <line x1={0} y1={GROUND + 2} x2={400} y2={GROUND + 2} className="kf-axis" />
      {body(c1, h1, 'b1', 1)}
      {body(c2, h2, 'b2', -1)}
      {pushing && <>
        <Arrow a={contact} b={[contact[0] + LEN_F * F, contact[1]]} cls="kf-f" />
        <Arrow a={[contact[0], contact[1] + 14]} b={[contact[0] - LEN_F * F, contact[1] + 14]} cls="kf-f" />
        <circle cx={contact[0]} cy={contact[1]} r={4.5} className="kf-pt solid" /><circle cx={contact[0]} cy={contact[1] + 14} r={4.5} className="kf-pt solid" />
      </>}
      {rolling && Math.abs(st.v1) > 0.01 && <Arrow a={[c1, GROUND - 136]} b={[c1 + st.v1 * 40, GROUND - 136]} cls="kf-v" />}
      {rolling && Math.abs(st.v2) > 0.01 && <Arrow a={[c2, GROUND - 136]} b={[c2 + st.v2 * 40, GROUND - 136]} cls="kf-v" />}
    </Frame>
  );
}
