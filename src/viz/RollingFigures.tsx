import { useEffect, useRef, useState } from 'react';
import { M } from '../components/Tex';
import { fmtNum, useLang, useTr } from '../i18n';
import { contactVelocity, momentaryCentre, slip, wheelVelocity, type P2 } from '../physics/rolling';
import { at } from './VectorFigures';

const t = String.raw;
type V = [number, number];
const VB: [number, number, number, number] = [0, 0, 400, 250];
const PX = 52; // px per unit length (R = 1)
const AS = 22; // px of arrow per unit of speed
const GROUND = 196, CY = GROUND - PX, X_MIN = 70, X_MAX = 330;
const RIM = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);

function Arrow({ a, b, cls }: { a: V; b: V; cls: string }) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
  if (l < 1.5) return null;
  const ux = dx / l, uy = dy / l, s = Math.min(9, 0.6 * l);
  const head = `${b[0]},${b[1]} ${b[0] - s * ux + 0.45 * s * uy},${b[1] - s * uy - 0.45 * s * ux} ${b[0] - s * ux - 0.45 * s * uy},${b[1] - s * uy + 0.45 * s * ux}`;
  return <g className={cls}><line x1={a[0]} y1={a[1]} x2={b[0] - ux * 4} y2={b[1] - uy * 4} /><polygon points={head} /></g>;
}

type Preset = 'roll' | 'locked' | 'spin' | 'belt';
const PRESETS: Record<Preset, { vc: number; w: number; u: number; de: string; en: string }> = {
  roll: { vc: 1, w: 1, u: 0, de: 'Rollen', en: 'rolling' },
  locked: { vc: 1, w: 0, u: 0, de: 'Rad blockiert', en: 'wheel locked' },
  spin: { vc: 0.3, w: 1.6, u: 0, de: 'Durchdrehen', en: 'wheel spin' },
  belt: { vc: 0.5, w: 1.3, u: -0.8, de: 'Band läuft', en: 'belt running' },
};

/**
 * Lecture p. 20, Gleiten / Rollen: a wheel Z₁ (radius R = 1) on a belt Z₂ that moves with speed u (u = 0: ground
 * at rest). Choose the speed v_C of the centre, the spin ω (positive: turning forward, clockwise) and u.
 * At the contact point the wheel's tangential velocity v_C − ωR is compared with the belt's u: equal ⇒ rolling,
 * different ⇒ sliding. Arrows: v = v_C + ω × CP at the rim; purple dot: the momentary centre (v = 0).
 */
export function RollingWheel() {
  const tr = useTr(), lang = useLang();
    const [vc, setVc] = useState(1);
  const [w, setW] = useState(1);
  const [u, setU] = useState(0);
  const [play, setPlay] = useState(false);
  const [vel, setVel] = useState(true);
  const [trail, setTrail] = useState(true);
  const [st, setSt] = useState({ x: 120, th: 0.6, belt: 0 });
  const params = useRef({ vc, w, u });
  params.current = { vc, w, u };
  useEffect(() => {
    if (!play) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000; last = now;
      const p = params.current;
      setSt((s) => {
        let x = s.x + p.vc * PX * dt;
        if (x > X_MAX) x = X_MIN; else if (x < X_MIN) x = X_MAX;
        return { x, th: s.th + p.w * dt, belt: s.belt + p.u * PX * dt };
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play]);
  const choose = (k: Preset) => { const p = PRESETS[k]; setVc(p.vc); setW(p.w); setU(p.u); };

  const C: V = [st.x, CY];
  const toS = (p: P2): V => [C[0] + PX * p[0], C[1] - PX * p[1]]; // wheel coordinates (y up, units) → SVG
  const arrowAt = (p: P2): [V, V] => { const v = wheelVelocity(vc, w, p); return [toS(p), [toS(p)[0] + AS * v[0], toS(p)[1] - AS * v[1]]]; };
  const A: V = [st.x, GROUND]; // the wheel's contact point (A, as in the lecture's figure on p. 20)
  const vK = contactVelocity(vc, w, 1), s = slip(vc, w, 1, u), rolling = Math.abs(s) < 0.02;
  const mc = momentaryCentre(vc, w), mcS = mc ? toS(mc) : null;
  const mark: V = [C[0] + PX * Math.sin(st.th), C[1] - PX * Math.cos(st.th)];
  const f = (x: number) => fmtNum(x, 2, lang, true);
  // path of the red rim point with the current v_C and ω (cycloid when rolling), through its present position
  const path = Array.from({ length: 481 }, (_, i) => { const tau = -8 + (16 * i) / 480, a = st.th + w * tau; return [C[0] + PX * (vc * tau + Math.sin(a)), C[1] - PX * Math.cos(a)] as V; })
    .filter((p) => p[0] > -10 && p[0] < 410);
  const ticks = Array.from({ length: 22 }, (_, i) => ((i * 20 + st.belt) % 440 + 440) % 440 - 20);
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {(Object.keys(PRESETS) as Preset[]).map((k) => (
          <button key={k} type="button" aria-pressed={vc === PRESETS[k].vc && w === PRESETS[k].w && u === PRESETS[k].u} onClick={() => choose(k)}>{tr(PRESETS[k].de, PRESETS[k].en)}</button>
        ))}
      </div>
      <div className="vdemo-fig wide">
        <svg viewBox={VB.join(' ')} aria-label={tr('Rad auf einem Band, mit Geschwindigkeiten', 'Wheel on a belt, with velocities')}>
          <rect x={0} y={GROUND} width={400} height={18} className="rl-belt" />
          {ticks.map((x, i) => <line key={i} x1={x} y1={GROUND + 4} x2={x + 7} y2={GROUND + 14} className="rl-tick" />)}
          {trail && path.length > 1 && <polyline points={path.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')} className="rl-trail" />}
          <circle cx={C[0]} cy={C[1]} r={PX} className="rl-wheel" />
          {[0, 1, 2, 3, 4, 5].map((i) => { const a = st.th + (i * Math.PI) / 3; return <line key={i} x1={C[0]} y1={C[1]} x2={C[0] + PX * 0.92 * Math.sin(a)} y2={C[1] - PX * 0.92 * Math.cos(a)} className="rl-spoke" />; })}
          {vel && RIM.map((a, i) => { const [p, q] = arrowAt([Math.sin(a), Math.cos(a)]); return a === Math.PI ? null : <Arrow key={i} a={p} b={q} cls="rb-v thin" />; })}
          {vel && (() => { const [p, q] = arrowAt([0, 0]); return <Arrow a={p} b={q} cls="rb-v" />; })()}
          {/* contact point: velocity of the wheel point (red) and of the belt (blue) */}
          <Arrow a={[A[0], A[1] - 3]} b={[A[0] + AS * vK, A[1] - 3]} cls="rb-v" />
          <Arrow a={[A[0], A[1] + 6]} b={[A[0] + AS * u, A[1] + 6]} cls="rl-vbelt" />
          <circle cx={mark[0]} cy={mark[1]} r={5} className="v-m" />
          <circle cx={C[0]} cy={C[1]} r={3.5} className="v-o" />
          <circle cx={A[0]} cy={A[1]} r={4} className="v-m" />
          {/* the momentary centre: a ring drawn last, so it stays visible when it sits on A */}
          {mcS && mcS[1] > 6 && mcS[1] < 244 && <circle cx={mcS[0]} cy={mcS[1]} r={8} className="rl-mc-ring" />}
        </svg>
        <div className="vdemo-label small halo" style={at(VB, C[0] + 11, C[1] - 13)}><M>C</M></div>
        <div className="vdemo-label point small" style={at(VB, A[0] - 14, A[1] + 26)}><M>A</M></div>
        <div className="vdemo-label muted small" style={at(VB, 24, GROUND + 28)}><M>{t`Z_2`}</M></div>
        <div className="vdemo-label muted small halo" style={at(VB, C[0] - 0.45 * PX, C[1] - 0.42 * PX)}><M>{t`Z_1`}</M></div>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider"><span>{tr('Mittelpunkt', 'centre')} <M>{t`v_C`}</M></span>
          <input type="range" min={-0.5} max={1.5} step={0.05} value={vc} onChange={(e) => setVc(Number(e.target.value))} aria-label="vC" /><span className="val">{fmtNum(vc, 2, lang)}</span></label>
        <label className="slider wide-slider"><span>{tr('Drehung', 'spin')} <M>\omega</M></span>
          <input type="range" min={-0.5} max={2} step={0.05} value={w} onChange={(e) => setW(Number(e.target.value))} aria-label="omega" /><span className="val">{fmtNum(w, 2, lang)}</span></label>
        <label className="slider wide-slider"><span>{tr('Band', 'belt')} <M>u</M></span>
          <input type="range" min={-1} max={1} step={0.05} value={u} onChange={(e) => setU(Number(e.target.value))} aria-label="u" /><span className="val">{fmtNum(u, 2, lang)}</span></label>
        <div className="motion-row">
          <button type="button" className="motion-btn" onClick={() => setPlay((x) => !x)}>{play ? tr('Anhalten', 'Stop') : tr('Bewegung abspielen', 'Play the motion')}</button>
        </div>
        <label className="toggle"><input type="checkbox" checked={vel} onChange={(e) => setVel(e.target.checked)} />{' '}{tr('Geschwindigkeiten am Rand', 'velocities on the rim')}</label>
        <label className="toggle"><input type="checkbox" checked={trail} onChange={(e) => setTrail(e.target.checked)} />{' '}{tr('Bahn des roten Randpunkts', 'path of the red rim point')}</label>
        <div className={`v-result rt-readout ${rolling ? 'pos' : 'neg'}`}>
          <M p=",">{t`v_t(Z_1) = v_C - \omega R = ${f(vK)}`}</M> <M>{t`v_t(Z_2) = u = ${f(u)}`}</M>
          <b className="tr-chip">{rolling ? tr('Rollen', 'rolling') : tr('Gleiten', 'sliding')}</b>
        </div>
        <p className="vdemo-note">{tr(
          <>Am Kontaktpunkt <M p=":">A</M> rot die Geschwindigkeit des Radpunkts, blau die des Bandes. Beide haben keinen Anteil senkrecht zum Band (Kontakt). Sind die waagrechten Anteile gleich, rollt das Rad, sonst gleitet es. Violetter Ring: der Punkt, um den sich das Rad gerade dreht. Beim Rollen auf ruhendem Boden ist das genau <M p=".">A</M></>,
          <>At the contact point <M p=":">A</M> red is the velocity of the wheel point, blue that of the belt. Neither has a part perpendicular to the belt (contact). If the horizontal parts are equal the wheel rolls, otherwise it slides. Purple ring: the point about which the wheel is turning at this instant. When rolling on ground at rest this is exactly <M p=".">A</M></>)}</p>
      </figcaption>
    </figure>
  );
}
