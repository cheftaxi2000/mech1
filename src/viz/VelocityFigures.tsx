import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Line } from '@react-three/drei';
import { M } from '../components/Tex';
import { fmtNum, useLang, useTr } from '../i18n';
import { HELIX, helix, helixVelocity, lineX, lineXdot } from '../physics/velocity';
import { add, norm, scale, sub, type Vec3 } from '../physics/vec';
import { inside, posOf, qAt, timeToEdge, velocityOf, velocityTerms, type CMode, type Q } from '../physics/curvMotion';
import { Scene } from './Scene';
import { Arrow, Axes, C, Curve, Dashed, Dot, Label } from './primitives';
import { FullscreenButton, useFullscreen } from './useFullscreen';
import { at, useReducedMotion } from './VectorFigures';

const t = String.raw;
/** "c1 e_1 + c2 e_2 − c3 e_3" with proper signs (coefficients formatted by `f`). */
const combo = (f: (x: number) => string, cs: [number, string][]) =>
  cs.map(([c, b], i) => `${i === 0 ? (c < 0 ? '-' : '') : c < 0 ? ' - ' : ' + '}${f(Math.abs(c))}\\,${b}`).join('');

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
 * A point M moving on a trajectory r(t); v(t) is drawn at M (Cartesian components head to tail) together with τ.
 * Used for the helix (lecture p. 9, 2.2) and the example of p. 10.
 */
export function PathVelocity({ r, v: vel, T, t0, camera, target, note, axes = 2.0, arrow = V_ARROW }: {
  r: (t: number) => Vec3; v: (t: number) => Vec3; T: number; t0: number;
  camera: [number, number, number]; target: [number, number, number]; note: ReactNode; axes?: number; arrow?: number;
}) {
  const tr = useTr(), lang = useLang();
  const reduced = useReducedMotion();
  const [ref, full, toggleFull] = useFullscreen();
  const [time, setTime] = useState(t0);
  const [play, setPlay] = useState(false);
  const [parts, setParts] = useState(true);
  useEffect(() => {
    if (!play) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000; last = now;
      setTime((x) => (x + dt > T ? 0 : x + dt));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, T]);
  const p = r(time), v = vel(time), sdot = norm(v);
  const a1 = add(p, [arrow * v[0], 0, 0]), a2 = add(a1, [0, arrow * v[1], 0]), tip = add(p, scale(arrow, v));
  const tau = scale(1 / sdot, v);
  const f = (n: number) => fmtNum(n, 2, lang, true);
  return (
    <figure className={`explorer${full ? ' is-full' : ''}`} ref={ref}>
      <div className="stage">
        <Scene height={full ? '100%' : 400} camera={camera} target={target}>
          <Axes size={axes} />
          <Curve f={r} t0={0} t1={T} n={240} color={C.construct} width={1.5} />
          {time > 0.02 && <Curve f={r} t0={0} t1={time} n={Math.max(2, Math.round((time / T) * 240))} color={C.path} width={2.5} />}
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
              <input type="range" min={0} max={T} step={0.01} value={time} onChange={(e) => { setPlay(false); setTime(Number(e.target.value)); }} aria-label="t" />
            </label>
          </div>
          <label className="toggle"><input type="checkbox" checked={parts} onChange={(e) => setParts(e.target.checked)} />{' '}
            {tr(<>Komponenten <M>{t`\dot x\,\v e_x + \dot y\,\v e_y + \dot z\,\v e_z`}</M> zeigen</>, <>show the components <M>{t`\dot x\,\v e_x + \dot y\,\v e_y + \dot z\,\v e_z`}</M></>)}</label>
        </div>
        <figcaption>
          <div className="v-result"><M>{t`\v v = ` + combo(f, [[v[0], t`\v e_x`], [v[1], t`\v e_y`], [v[2], t`\v e_z`]])}</M></div>
          <div className="v-result pos"><M>{t`\dot s = |\v v| = ${f(sdot)}`}</M></div>
          <p className="vdemo-note">{note}</p>
        </figcaption>
      </div>
    </figure>
  );
}

/** Lecture p. 9, 2.2: the helix. ṡ stays constant while the direction of v keeps changing. */
export function HelixVelocity() {
  const tr = useTr();
  return (
    <PathVelocity r={helix} v={helixVelocity} T={HELIX.T} t0={6.25} camera={[3.7, -3.7, 2.9]} target={[0, 0, 0.45]}
      note={tr(<>Rot: <M p=",">{t`\v v`}</M> tangential an die Bahn. Schwarz: <M p=",">{t`\v\tau`}</M> Länge 1. Die Schnelligkeit <M>{t`\dot s`}</M> bleibt konstant, die Richtung von <M>{t`\v v`}</M> nicht.</>,
        <>Red: <M p=",">{t`\v v`}</M> tangent to the path. Black: <M p=",">{t`\v\tau`}</M> length 1. The speed <M>{t`\dot s`}</M> stays constant, the direction of <M>{t`\v v`}</M> does not.</>)} />
  );
}

/* ------------------------------------------------------------------------------------------------ */
const START: Record<CMode, Q> = { cyl: [1.2, -20 * Math.PI / 180, 0.3], sph: [1.5, 65 * Math.PI / 180, -20 * Math.PI / 180] };
const RATES = {
  cyl: [{ tex: String.raw`\dot\rho`, min: -0.4, max: 0.4, v: 0 }, { tex: String.raw`\dot\varphi`, min: -1, max: 1, v: 0.6 }, { tex: String.raw`\dot z`, min: -0.4, max: 0.4, v: 0.15 }],
  sph: [{ tex: String.raw`\dot r`, min: -0.4, max: 0.4, v: 0 }, { tex: String.raw`\dot\theta`, min: -0.6, max: 0.6, v: 0.25 }, { tex: String.raw`\dot\psi`, min: -1, max: 1, v: 0.6 }],
};
const defaultRates = (m: CMode): Q => [RATES[m][0].v, RATES[m][1].v, RATES[m][2].v];
const VA = 1.3; // arrow length per unit of speed
const AHEAD = 6, BEHIND = 2.5; // seconds of the trajectory drawn ahead of / behind M

/**
 * Lecture p. 10: velocity in the cylindrical / spherical basis. Choose the rates of the three coordinates; at M the
 * three terms are drawn head to tail (each in the colour of its basis vector) and their sum v. The dashed red line is
 * the trajectory M follows with these rates — v is always tangent to it (curvMotion.test.ts). Changing a rate keeps M
 * where it is and bends the trajectory from there on; "Play" moves M and leaves a solid trail.
 */
export function CurvilinearVelocity() {
  const tr = useTr(), lang = useLang();
  const reduced = useReducedMotion();
  const [ref, full, toggleFull] = useFullscreen();
  const [mode, setMode] = useState<CMode>('cyl');
  const [rates, setRates] = useState<Q>(defaultRates('cyl'));
  const [q0, setQ0] = useState<Q>(START.cyl); // state when the current rates were set
  const [time, setTime] = useState(0); // time since then
  const [play, setPlay] = useState(false);
  const [atEdge, setAtEdge] = useState(false);
  const [trail, setTrail] = useState<Vec3[]>([]);
  const [lines, setLines] = useState(false);
  const live = useRef({ mode, rates, q0 }); live.current = { mode, rates, q0 };

  useEffect(() => {
    if (!play) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000; last = now;
      const { mode: m, rates: r, q0: a } = live.current;
      setTime((x) => {
        const nx = x + dt;
        if (!inside(m, qAt(a, r, nx))) { setPlay(false); setAtEdge(true); return x; }
        setTrail((tl) => (tl.length > 900 ? tl.slice(-900) : tl).concat([posOf(m, qAt(a, r, nx))]));
        return nx;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play]);

  const q = qAt(q0, rates, time);
  const reset = (m: CMode, keepRates = false) => {
    setMode(m); if (!keepRates) setRates(defaultRates(m)); setQ0(START[m]); setTime(0); setPlay(false); setAtEdge(false); setTrail([]);
  };
  const setRate = (i: number, val: number) => {
    const nr = [...rates] as unknown as [number, number, number]; nr[i] = val;
    setQ0(q); setTime(0); setRates(nr); // M stays where it is; the path bends from here
    setAtEdge(false);
  };
  const p = posOf(mode, q);
  const terms = velocityTerms(mode, q, rates);
  const v = velocityOf(mode, q, rates);
  const names = mode === 'cyl'
    ? [[C.rho, String.raw`\dot\rho\,\v e_\rho`], [C.angle, String.raw`\rho\dot\varphi\,\v e_\varphi`], [C.z, String.raw`\dot z\,\v e_z`]]
    : [[C.r, String.raw`\dot r\,\v e_r`], [C.angle, String.raw`r\dot\theta\,\v e_\theta`], [C.angle2, String.raw`r\sin\theta\,\dot\psi\,\v e_\psi`]];
  let cur = p;
  const chain = terms.map((w, i) => { const a = cur; cur = add(cur, scale(VA, w)); return { a, b: cur, c: names[i][0] }; });
  // the trajectory through M with the current rates (ahead and behind, as far as it stays drawable)
  const tf = timeToEdge(mode, q, rates, 1, AHEAD), tb = timeToEdge(mode, q, rates, -1, BEHIND);
  const pathPts = Array.from({ length: 121 }, (_, i) => posOf(mode, qAt(q, rates, -tb + ((tf + tb) * i) / 120)));
  const f = (x: number) => fmtNum(x, 2, lang, true);
  const sdot = norm(v);
  const coeffs = mode === 'cyl' ? [rates[0], q[0] * rates[1], rates[2]] : [rates[0], q[0] * rates[1], q[0] * Math.sin(q[1]) * rates[2]];
  const basisTex = mode === 'cyl' ? [t`\v e_\rho`, t`\v e_\varphi`, t`\v e_z`] : [t`\v e_r`, t`\v e_\theta`, t`\v e_\psi`];
  return (
    <figure className={`explorer${full ? ' is-full' : ''}`} ref={ref}>
      <div className="tabs" role="tablist">
        {(['cyl', 'sph'] as CMode[]).map((m) => (
          <button key={m} role="tab" aria-selected={mode === m} className={mode === m ? 'active' : ''} onClick={() => reset(m)}>
            {m === 'cyl' ? tr('Zylindrisch', 'Cylindrical') : tr('Sphärisch', 'Spherical')}
          </button>
        ))}
      </div>
      <div className="stage">
        <Scene height={full ? '100%' : 400} camera={[3.6, -3.6, 2.8]} target={[0.4, -0.1, 0.4]}>
          <Axes size={1.8} />
          <Dashed pts={[p, [p[0], p[1], 0]]} />
          {lines && (mode === 'cyl'
            ? (<>
              <Curve f={(a) => posOf('cyl', [q[0], a, q[2]])} t0={0} t1={2 * Math.PI} color={C.angle} width={1.2} />
              <Curve f={(a) => posOf('cyl', [a, q[1], q[2]])} t0={0} t1={2.4} n={2} color={C.rho} width={1.2} />
              <Curve f={(a) => posOf('cyl', [q[0], q[1], a])} t0={-1.4} t1={2} n={2} color={C.z} width={1.2} />
            </>)
            : (<>
              <Curve f={(a) => posOf('sph', [q[0], q[1], a])} t0={0} t1={2 * Math.PI} color={C.angle2} width={1.2} />
              <Curve f={(a) => posOf('sph', [q[0], a, q[2]])} t0={0} t1={Math.PI} color={C.angle} width={1.2} />
              <Curve f={(a) => posOf('sph', [a, q[1], q[2]])} t0={0} t1={2.4} n={2} color={C.r} width={1.2} />
            </>))}
          {tf + tb > 0.05 && <Line points={pathPts as [number, number, number][]} color={C.path} lineWidth={1.8} dashed dashSize={0.07} gapSize={0.05} />}
          {trail.length > 1 && <Line points={trail as [number, number, number][]} color={C.path} lineWidth={3} />}
          {chain.map(({ a, b, c }, i) => norm(sub(b, a)) > 0.02 && <Arrow key={i} from={a} to={b} color={c} width={3} />)}
          {sdot > 0.02 && <Arrow from={p} to={add(p, scale(VA, v))} color={C.point} width={4} />}
          {sdot > 0.02 && <Label at={add(add(p, scale(VA, v)), scale(0.2 / sdot, v))} color={C.point} vec>v</Label>}
          <Dot at={p} />
          <Label at={[p[0], p[1], p[2] - 0.22]} color={C.point}>M</Label>
        </Scene>
        <FullscreenButton full={full} onClick={toggleFull} />
      </div>
      <div className="side">
        <div className="controls">
          {RATES[mode].map((r, i) => (
            <label key={mode + i} className="slider">
              <M>{r.tex}</M>
              <input type="range" min={r.min} max={r.max} step={0.01} value={rates[i]} aria-label={`rate-${i}`}
                onChange={(e) => setRate(i, Number(e.target.value))} />
              <span className="val">{fmtNum(rates[i], 2, lang)}</span>
            </label>
          ))}
          <div className="motion-row">
            <button type="button" className="motion-btn" disabled={(reduced && !play) || atEdge} onClick={() => setPlay((x) => !x)}>
              {play ? tr('Anhalten', 'Stop') : tr('Bewegung abspielen', 'Play the motion')}
            </button>
            <button type="button" className="motion-btn" onClick={() => reset(mode, true)}>{tr('Zurück zum Start', 'Back to start')}</button>
          </div>
          {atEdge && <p className="warn">{tr(<><M>M</M> hat den Rand des Bildes (oder die Achse) erreicht. Ändere eine Rate oder gehe zurück zum Start.</>, <><M>M</M> has reached the edge of the picture (or the axis). Change a rate or go back to the start.</>)}</p>}
          <ul className="legend">
            {names.map(([c, tex], i) => <li key={i}><span className="swatch" style={{ background: c }} /><M>{tex}</M></li>)}
            <li><span className="swatch" style={{ background: C.point }} /><M>{t`\v v`}</M>&nbsp;{tr('(Summe)', '(sum)')}</li>
            <li><span className="swatch dashed" style={{ color: C.path }} />{tr(<>Bahn von <M>M</M> mit diesen Raten</>, <>path of <M>M</M> with these rates</>)}</li>
          </ul>
          <label className="toggle"><input type="checkbox" checked={lines} onChange={(e) => setLines(e.target.checked)} />{' '}
            {tr(<>Koordinatenlinien durch <M>M</M> zeigen (zum Vergleich – das ist nicht die Bahn)</>, <>show the coordinate lines through <M>M</M> (for comparison – they are not the path)</>)}</label>
        </div>
        <figcaption>
          <div className="v-result pos"><M>{t`\v v = ` + combo(f, coeffs.map((k, i) => [k, basisTex[i]] as [number, string]))}</M></div>
          <p className="vdemo-note">{tr(<><M>{t`\v v`}</M> liegt immer tangential an der <b>Bahn</b> (rot gestrichelt). Am Kreis der <span className="nowrap"><M>\varphi</M>-Linie</span> liegt <M>{t`\v v`}</M> nur, wenn sich allein <M>\varphi</M> ändert.</>,
            <><M>{t`\v v`}</M> is always tangent to the <b>path</b> (red dashed). It is tangent to the circle of the <span className="nowrap"><M>\varphi</M>-line</span> only when <M>\varphi</M> alone changes.</>)}</p>
        </figcaption>
      </div>
    </figure>
  );
}
