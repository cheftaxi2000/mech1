import { useEffect, useState } from 'react';
import { Line } from '@react-three/drei';
import { M } from '../components/Tex';
import { fmtNum, useLang, useTr } from '../i18n';
import { HELIX, helix, helixVelocity, lineX, lineXdot } from '../physics/velocity';
import { add, norm, scale } from '../physics/vec';
import { Scene } from './Scene';
import { Arrow, Axes, C, Curve, Dashed, Dot, Label } from './primitives';
import { FullscreenButton, useFullscreen } from './useFullscreen';
import { at, useReducedMotion } from './VectorFigures';

const t = String.raw;

/* ------------------------------------------------------------------------------------------------ */
const VB: [number, number, number, number] = [0, 0, 400, 250];
const T0 = 1.0, TX = (tt: number) => 46 + 112 * tt, XY = (x: number) => 228 - 72 * x, TRACK = 26, XX = (x: number) => 46 + 112 * x;

/**
 * Rectilinear motion (lecture p. 8): M on a straight line at distance x(t) from A (top), and the graph of x(t).
 * The slope of the secant through t and t + Δt is the mean velocity Δx/Δt; for Δt → 0 it becomes the tangent slope ẋ.
 */
export function SecantDemo() {
  const tr = useTr(), lang = useLang();
  const [k, setK] = useState(0); // slider 0 … 1 → Δt from 1.6 down to 0.01 (geometric)
  const dt = 1.6 * Math.pow(0.01 / 1.6, k);
  const x0 = lineX(T0), x1 = lineX(T0 + dt), slope = (x1 - x0) / dt, v = lineXdot(T0);
  const graph = Array.from({ length: 61 }, (_, i) => { const tt = (2.9 * i) / 60; return `${TX(tt).toFixed(1)},${XY(lineX(tt)).toFixed(1)}`; }).join(' ');
  const line = (m: number, x: number, tt: number, a: number, b: number) => [[TX(a), XY(x + m * (a - tt))], [TX(b), XY(x + m * (b - tt))]] as const;
  const sec = line(slope, x0, T0, 0.05, 2.9), tan = line(v, x0, T0, 0.05, 2.9);
  const f = (n: number) => fmtNum(n, 2, lang, true);
  return (
    <figure className="vdemo">
      <div className="vdemo-fig wide">
        <svg viewBox={VB.join(' ')} aria-label={tr('Gerade Bewegung und Graph von x(t)', 'Rectilinear motion and graph of x(t)')}>
          {/* the straight track with A and M */}
          <line x1={XX(0)} y1={TRACK} x2={392} y2={TRACK} className="v-track" />
          <path d={`M 392 ${TRACK} l -10 -5 v 10 z`} className="v-track-head" />
          <circle cx={XX(0)} cy={TRACK} r={3.5} className="v-o" />
          <line x1={XX(0)} y1={TRACK + 12} x2={XX(x0)} y2={TRACK + 12} className="v-span" />
          <circle cx={XX(x1)} cy={TRACK} r={5} className="v-ghost" />
          <circle cx={XX(x0)} cy={TRACK} r={5.5} className="v-m" />
          {/* graph */}
          <line x1={TX(0)} y1={XY(0)} x2={TX(3.05)} y2={XY(0)} className="v-axis" />
          <line x1={TX(0)} y1={XY(0)} x2={TX(0)} y2={64} className="v-axis" />
          <polyline points={graph} className="v-graph" />
          <line x1={tan[0][0]} y1={tan[0][1]} x2={tan[1][0]} y2={tan[1][1]} className="v-tan" />
          <line x1={sec[0][0]} y1={sec[0][1]} x2={sec[1][0]} y2={sec[1][1]} className="v-sec" />
          <line x1={TX(T0)} y1={XY(x0)} x2={TX(T0 + dt)} y2={XY(x0)} className="v-dt" />
          <line x1={TX(T0 + dt)} y1={XY(x0)} x2={TX(T0 + dt)} y2={XY(x1)} className="v-dx" />
          <circle cx={TX(T0)} cy={XY(x0)} r={4.5} className="v-m" />
          <circle cx={TX(T0 + dt)} cy={XY(x1)} r={4} className="v-ghost" />
        </svg>
        <div className="vdemo-label muted" style={at(VB, XX(0), TRACK - 14)}><M>A</M></div>
        <div className="vdemo-label point" style={at(VB, XX(x0), TRACK - 14)}><M>M</M></div>
        <div className="vdemo-label muted" style={at(VB, 384, TRACK - 14)}><M>x</M></div>
        <div className="vdemo-label muted small" style={at(VB, (XX(0) + XX(x0)) / 2, TRACK + 24)}><M>{t`x(t)`}</M></div>
        <div className="vdemo-label muted" style={at(VB, TX(3.0), XY(0) + 13)}><M>t</M></div>
        <div className="vdemo-label muted" style={at(VB, TX(0) - 12, 66)}><M>x</M></div>
        {dt > 0.25 && <div className="vdemo-label x small" style={at(VB, TX(T0 + dt / 2), XY(x0) + 12)}><M>{t`\Delta t`}</M></div>}
        {dt > 0.25 && <div className="vdemo-label rho small" style={at(VB, TX(T0 + dt) + 18, (XY(x0) + XY(x1)) / 2)}><M>{t`\Delta x`}</M></div>}
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider grow wide-slider">
          <M>{t`\Delta t`}</M>
          <input type="range" min={0} max={1} step={0.005} value={k} onChange={(e) => setK(Number(e.target.value))} aria-label="dt" />
        </label>
        <div><M>{t`\Delta t = ${f(dt)}\qquad \frac{\Delta x}{\Delta t} = ${f(slope)}\qquad \dot x(t) = ${f(v)}`}</M></div>
        <p className="vdemo-note">{tr(<>Blau: Sekante, ihre Steigung ist die mittlere Geschwindigkeit <M p=".">{t`\Delta x/\Delta t`}</M> Rot gestrichelt: Tangente mit Steigung <M p=".">{t`\dot x`}</M> Schiebe <M>{t`\Delta t`}</M> gegen null.</>,
          <>Blue: the secant, whose slope is the mean velocity <M p=".">{t`\Delta x/\Delta t`}</M> Red dashed: the tangent with slope <M p=".">{t`\dot x`}</M> Slide <M>{t`\Delta t`}</M> towards zero.</>)}</p>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------------------------------------ */
const V_ARROW = 1.1; // arrow length per (m/s)

/**
 * Lecture p. 9, 2.2: velocity in the Cartesian basis. M moves on a helix; v = ẋ e_x + ẏ e_y + ż e_z is drawn at M
 * (components head to tail) together with τ. ṡ stays constant while the direction of v keeps changing.
 */
export function HelixVelocity() {
  const tr = useTr(), lang = useLang();
  const reduced = useReducedMotion();
  const [ref, full, toggleFull] = useFullscreen();
  const [time, setTime] = useState(6.25);
  const [play, setPlay] = useState(false);
  const [parts, setParts] = useState(true);
  useEffect(() => {
    if (!play) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000; last = now;
      setTime((v) => (v + dt > HELIX.T ? 0 : v + dt));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play]);
  const p = helix(time), v = helixVelocity(time), sdot = norm(v);
  const a1 = add(p, [V_ARROW * v[0], 0, 0]), a2 = add(a1, [0, V_ARROW * v[1], 0]), tip = add(p, scale(V_ARROW, v));
  const tau = scale(1 / sdot, v);
  const f = (n: number) => fmtNum(n, 2, lang, true);
  return (
    <figure className={`explorer${full ? ' is-full' : ''}`} ref={ref}>
      <div className="stage">
        <Scene height={full ? "100%" : 400} camera={[3.7, -3.7, 2.9]} target={[0, 0, 0.45]}>
          <Axes size={2.0} />
          <Curve f={helix} t0={0} t1={HELIX.T} n={240} color={C.construct} width={1.5} />
          <Curve f={helix} t0={0} t1={time} n={Math.max(2, Math.round(time * 24))} color={C.path} width={2.5} />
          {parts && (<>
            <Line points={[p as [number, number, number], a1 as [number, number, number]]} color={C.x} lineWidth={2.5} dashed dashSize={0.06} gapSize={0.04} />
            <Line points={[a1 as [number, number, number], a2 as [number, number, number]]} color={C.y} lineWidth={2.5} dashed dashSize={0.06} gapSize={0.04} />
            <Line points={[a2 as [number, number, number], tip as [number, number, number]]} color={C.z} lineWidth={2.5} dashed dashSize={0.06} gapSize={0.04} />
          </>)}
          <Dashed pts={[[0, 0, 0], p]} />
          <Arrow to={tip} from={p} color={C.point} width={3.5} />
          <Label at={add(tip, scale(0.18, tau))} color={C.point} vec>v</Label>
          <Arrow from={p} to={add(p, scale(0.45, tau))} color={C.r} width={4} />
          <Dot at={p} />
          <Label at={[p[0], p[1], p[2] - 0.22]} color={C.point}>M</Label>
        </Scene>
        <FullscreenButton full={full} onClick={toggleFull} />
      </div>
      <div className="side">
        <div className="controls">
          <div className="motion-row">
            <button type="button" className="motion-btn" onClick={() => setPlay((x) => !x)} disabled={reduced && !play}>
              {play ? tr('Anhalten', 'Stop') : tr('Bewegung abspielen', 'Play the motion')}
            </button>
            <label className="slider grow">
              <M>t</M>
              <input type="range" min={0} max={HELIX.T} step={0.01} value={time} onChange={(e) => { setPlay(false); setTime(Number(e.target.value)); }} aria-label="t" />
            </label>
          </div>
          <label className="toggle"><input type="checkbox" checked={parts} onChange={(e) => setParts(e.target.checked)} />{' '}
            {tr(<>Komponenten <M>{t`\dot x\,\v e_x + \dot y\,\v e_y + \dot z\,\v e_z`}</M> zeigen</>, <>show the components <M>{t`\dot x\,\v e_x + \dot y\,\v e_y + \dot z\,\v e_z`}</M></>)}</label>
        </div>
        <figcaption>
          <div className="v-result"><M>{t`\v v = ${f(v[0])}\,\v e_x + ${f(v[1])}\,\v e_y + ${f(v[2])}\,\v e_z`}</M></div>
          <div className="v-result pos"><M>{t`\dot s = |\v v| = ${f(sdot)}`}</M></div>
          <p className="vdemo-note">{tr(<>Rot: <M p=",">{t`\v v`}</M> tangential an die Bahn. Schwarz: <M p=",">{t`\v\tau`}</M> Länge 1. Die Schnelligkeit <M>{t`\dot s`}</M> bleibt konstant, die Richtung von <M>{t`\v v`}</M> nicht.</>,
            <>Red: <M p=",">{t`\v v`}</M> tangent to the path. Black: <M p=",">{t`\v\tau`}</M> length 1. The speed <M>{t`\dot s`}</M> stays constant, the direction of <M>{t`\v v`}</M> does not.</>)}</p>
        </figcaption>
      </div>
    </figure>
  );
}
