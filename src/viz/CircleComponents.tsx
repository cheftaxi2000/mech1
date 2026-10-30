import { useRef, useState } from 'react';
import { M } from '../components/Tex';
import { fmtNum, useLang, useTr } from '../i18n';
import { Curve, Line, PArrow, PLabel, Path, Plot, Pt, Seg } from './plot/Plot';
import type { P2 } from './plot/plotMath';
import { arcPts, circlePts } from './ana/w6Scenes';
import { circleState } from './circleComp';
import { useInView, useRaf } from './chem/useFrames';
import { useReducedMotion } from './figUtils';

const t = String.raw;
const TAU = 2 * Math.PI, R = 1, KV = 0.55;

/**
 * Kreisbewegung in Komponenten (lecture p. 11, section 4): the point runs on the circle; the two shadows x(t) = R cos φ and
 * y(t) = R sin φ are drawn against time, and the velocity components v_x, v_y are the slopes of those curves (dashed
 * tangents) — the same numbers as the row ω × r in the lecture. Left: top view with r, v and its components.
 */
export function CircleComponents() {
  const tr = useTr(), lang = useLang();
  const [w, setW] = useState(1);
  const [time, setTime] = useState(0.9);
  const [playing, setPlaying] = useState(false);
  const host = useRef<HTMLElement>(null);
  const inView = useInView(host), reduced = useReducedMotion();
  useRaf((dt) => setTime((x) => (x + dt) % TAU), playing && inView && !reduced);
  const s = circleState(R, w, time);
  const f = (x: number, d = 2) => fmtNum(x, d, lang, true);
  const Mpt: P2 = [s.x, s.y];
  const vTip: P2 = [s.x + KV * s.vx, s.y + KV * s.vy];
  const vxTip: P2 = [s.x + KV * s.vx, s.y], vyTip: P2 = [s.x, s.y + KV * s.vy];
  const W = Math.max(Math.abs(w), 1e-9);
  return (
    <figure className="vdemo eu-fig cc-fig" ref={host}>
      <div className="controls">
        <label className="slider wide-slider"><span><M>{t`\dot\varphi`}</M></span>
          <input type="range" min={-2} max={2} step={0.25} value={w} aria-label={tr('Winkelgeschwindigkeit φ̇', 'Angular velocity φ̇')} onChange={(e) => setW(+e.target.value)} />
          <span className="val">{fmtNum(w, 2, lang)}</span></label>
        <label className="slider wide-slider"><span><M>t</M></span>
          <input type="range" min={0} max={TAU} step={0.02} value={time} aria-label={tr('Zeit t', 'Time t')} onChange={(e) => { setPlaying(false); setTime(+e.target.value); }} />
          <span className="val">{fmtNum(time, 2, lang)}</span></label>
        <div className="v-presets"><button type="button" className="motion-btn" aria-pressed={playing} onClick={() => setPlaying(!playing)}>{playing ? tr('Pause', 'Pause') : tr('Abspielen', 'Play')}</button></div>
      </div>
      <div className="eu-pair">
        <div className="vdemo-fig">
          <Plot x={[-1.7, 1.7]} y={[-1.7, 1.7]} w={300} h={300} grid={[0, 0]} tick={[0, 0]} axes={['x', 'y']}
            label={tr('Draufsicht: Punkt auf dem Kreis mit Ortsvektor, Geschwindigkeit und deren Komponenten', 'Top view: point on the circle with position vector, velocity and its components')}>
            <Path pts={circlePts(R)} role="aux" dashed />
            <Path pts={arcPts(0.3, 0, Math.abs(s.phi) % TAU > 1e-6 ? s.phi % TAU : 1e-6)} role="asym" />
            <Seg a={Mpt} b={[s.x, 0]} role="aux" dashed /><Seg a={Mpt} b={[0, s.y]} role="aux" dashed />
            <PArrow a={[0, 0]} b={Mpt} role="fg" />
            <Seg a={vTip} b={vxTip} role="aux" dashed /><Seg a={vTip} b={vyTip} role="aux" dashed />
            <PArrow a={Mpt} b={vxTip} role="f" /><PArrow a={Mpt} b={vyTip} role="g" />
            <PArrow a={Mpt} b={vTip} role="pt" />
            <Pt x={s.x} y={0} role="f" r={4} /><Pt x={0} y={s.y} role="g" r={4} />
            <Pt x={s.x} y={s.y} role="fg" r={5} />
            <PLabel x={s.x / 2} y={s.y / 2} tex={t`\v r`} role="fg" dx={-s.y * 14} dy={-s.x * 14} small />
            <PLabel x={vTip[0]} y={vTip[1]} tex={t`\v v`} role="pt" dx={s.vx >= 0 ? 12 : -12} dy={s.vy >= 0 ? -10 : 10} small />
          </Plot>
        </div>
        <div className="cc-col">
          <div className="vdemo-fig">
            <Plot x={[-0.4, TAU + 0.5]} y={[-1.5, 1.5]} w={420} h={190} grid={[0, 0]} tick={[0, 0]} axes={['t', '']}
              label={tr('Ort: x(t) und y(t) mit den Tangenten am aktuellen Zeitpunkt', 'Position: x(t) and y(t) with the tangents at the current time')}>
              <Curve f={(u) => R * Math.cos(w * u)} dom={[0, TAU]} role="f" /><Curve f={(u) => R * Math.sin(w * u)} dom={[0, TAU]} role="g" />
              <Seg a={[time, -1.4]} b={[time, 1.4]} role="aux" dashed />
              <Line p={[time, s.x]} m={s.vx} role="f" dashed dom={[time - 0.9, time + 0.9]} /><Line p={[time, s.y]} m={s.vy} role="g" dashed dom={[time - 0.9, time + 0.9]} />
              <Pt x={time} y={s.x} role="f" r={5} /><Pt x={time} y={s.y} role="g" r={5} />
              <PLabel x={0.6} y={1.35} tex="x(t)" role="f" small /><PLabel x={1.7} y={1.35} tex="y(t)" role="g" small />
            </Plot>
          </div>
          <div className="vdemo-fig">
            <Plot x={[-0.4, TAU + 0.5]} y={[-3, 3]} w={420} h={190} grid={[0, 0]} tick={[0, 0]} axes={['t', '']}
              label={tr('Geschwindigkeitskomponenten v_x(t) und v_y(t)', 'Velocity components v_x(t) and v_y(t)')}>
              <Curve f={(u) => -w * R * Math.sin(w * u)} dom={[0, TAU]} role="f" /><Curve f={(u) => w * R * Math.cos(w * u)} dom={[0, TAU]} role="g" />
              <Seg a={[time, -2.9]} b={[time, 2.9]} role="aux" dashed />
              <Pt x={time} y={s.vx} role="f" r={5} /><Pt x={time} y={s.vy} role="g" r={5} />
              <PLabel x={0.8} y={2.65} tex={t`v_x(t)`} role="f" small /><PLabel x={2.1} y={2.65} tex={t`v_y(t)`} role="g" small />
            </Plot>
          </div>
        </div>
      </div>
      <figcaption className="vdemo-readout">
        <div className="v-result"><M>{t`x = R\cos\varphi = ${f(s.x)},\quad y = R\sin\varphi = ${f(s.y)}`}</M></div>
        <div className="v-result pos"><M>{t`\dot x = -\dot\varphi R\sin\varphi = ${f(s.vx)},\quad \dot y = \dot\varphi R\cos\varphi = ${f(s.vy)}`}</M></div>
        <div className="v-result"><M>{t`|\v v| = |\dot\varphi|\,R = ${f(W * R)}`}</M></div>
        <p className="vdemo-note">{tr(
          <>Links der Kreis von oben: <M>{t`\v r`}</M> dunkel, <M>{t`\v v`}</M> rot, seine Komponenten blau (<M>x</M>) und gelb (<M p=")">y</M> Rechts die beiden Komponenten von <M>{t`\v r`}</M> über der Zeit. Die gestrichelten Tangenten zeigen: <b>die Komponente der Geschwindigkeit ist die Steigung der Ortskurve</b> – oben die Steigung, unten ihr Wert <M p=".">{t`v_x = \dot x`}</M> Wo <M>x</M> am grössten ist, ist die Tangente waagrecht und <M>{t`v_x = 0`}</M></>,
          <>Left: the circle from above, <M>{t`\v r`}</M> dark, <M>{t`\v v`}</M> red, its components blue (<M>x</M>) and yellow (<M p=")">y</M> Right: the two components of <M>{t`\v r`}</M> against time. The dashed tangents show: <b>the component of the velocity is the slope of the position curve</b> – the slope above, its value below: <M p=".">{t`v_x = \dot x`}</M> Where <M>x</M> is largest, the tangent is horizontal and <M>{t`v_x = 0`}</M></>)}</p>
      </figcaption>
    </figure>
  );
}
