import { useEffect, useState, useRef } from 'react';
import { M } from '../components/Tex';
import { fmtNum, useLang, useTr } from '../i18n';
import { GEN, fieldFrame, mitfahrFrame, type Ride } from './genGeom';
import { at, useInView } from './figUtils';
import { Arrow } from './arrow2d';

const t = String.raw;
type V = readonly [number, number];
const DEG = Math.PI / 180;
const pts = (ps: readonly V[]) => ps.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

/* ------------------------------------------------------------------------------------------------ */
const VB1: [number, number, number, number] = [0, 0, 400, 300];
const RIDES: Record<Ride, [string, string]> = { rest: ['Kamera ruht', 'camera at rest'], B: ['Mitfahren mit B', 'ride with B'], C: ['Mitfahren mit C', 'ride with C'] };

/**
 * Lecture p. 22: ω is the same for every reference point. The plate shifts and turns. A camera riding along with B
 * (or with C), without turning, sees only a turning about that point — by the same angle φ in both cases.
 */
export function RideDemo() {
  const host = useRef<HTMLElement>(null);
  const seen = useInView(host);
  const tr = useTr(), lang = useLang();
  const [ride, setRide] = useState<Ride>('B');
  const [time, setTime] = useState(2.4);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (!play || !seen) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000; last = now;
      setTime((x) => { const y = x + 0.8 * dt; if (y >= GEN.T_END) { setPlay(false); return GEN.T_END; } return y; });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, seen]);
  const f = mitfahrFrame(ride, time);
  const deg = Math.round(f.phi / DEG);
  // angle arc at the riding point: from the direction to M at the start to the direction now
  const arc = f.ref && (() => {
    const r = 30, a0 = Math.atan2(-(f.M0[1] - f.ref[1]), f.M0[0] - f.ref[0]);
    const ps = Array.from({ length: 31 }, (_, i) => { const a = a0 + (f.phi * i) / 30; return [f.ref![0] + r * Math.cos(a), f.ref![1] - r * Math.sin(a)] as V; });
    const am = a0 + f.phi / 2;
    return { ps, lab: [f.ref[0] + 41 * Math.cos(am), f.ref[1] - 41 * Math.sin(am)] as V };
  })();
  const start = () => { if (time >= GEN.T_END - 0.01) setTime(0); setPlay((x) => !x); };
  return (
    <figure className="vdemo" ref={host}>
      <div className="v-presets">
        {(Object.keys(RIDES) as Ride[]).map((k) => <button key={k} type="button" aria-pressed={ride === k} onClick={() => setRide(k)}>{tr(...RIDES[k])}</button>)}
      </div>
      <div className="vdemo-fig wide">
        <svg viewBox={VB1.join(' ')} aria-label={tr('Platte, die sich verschiebt und dreht, aus mitfahrender Sicht', 'Plate that shifts and turns, seen from a riding camera')}>
          <polygon points={pts(f.start)} className="an-body ghost" />
          <polyline points={pts(f.traces.M)} className="gm-trace" />
          <polyline points={pts(f.traces.C)} className="gm-trace c" />
          {ride === 'rest' && <polyline points={pts(f.traces.B)} className="gm-trace b" />}
          <polygon points={pts(f.plate)} className="an-body" />
          {f.ref && (<>
            <line x1={f.ref[0]} y1={f.ref[1]} x2={f.M0[0]} y2={f.M0[1]} className="gm-ray0" />
            <line x1={f.ref[0]} y1={f.ref[1]} x2={f.M[0]} y2={f.M[1]} className="gm-ray" />
            {arc && Math.abs(f.phi) > 0.03 && <polyline points={pts(arc.ps)} className="v-arc" />}
          </>)}
          <circle cx={f.M0[0]} cy={f.M0[1]} r={4} className="v-ghost" />
          {(['B', 'C', 'M'] as const).map((k) => <circle key={k} cx={f[k][0]} cy={f[k][1]} r={4.5} className="v-m" />)}
          {f.ref && <circle cx={f.ref[0]} cy={f.ref[1]} r={8} className="gm-pin" />}
        </svg>
        <div className="vdemo-label point small" style={at(VB1, f.B[0] - 2, f.B[1] + 16)}><M>B</M></div>
        <div className="vdemo-label point small" style={at(VB1, f.C[0] + 2, f.C[1] + 16)}><M>C</M></div>
        <div className="vdemo-label point small" style={at(VB1, f.M[0] + 14, f.M[1] - 10)}><M>M</M></div>
        {arc && Math.abs(f.phi) > 0.2 && <div className="vdemo-label angle small" style={at(VB1, arc.lab[0], arc.lab[1])}><M>\varphi</M></div>}
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider"><span>{tr('Zeit', 'time')} <M>t</M></span>
          <input type="range" min={0} max={GEN.T_END} step={0.02} value={time} onChange={(e) => { setPlay(false); setTime(Number(e.target.value)); }} aria-label="t" /><span className="val">{fmtNum(time, 1, lang)}</span></label>
        <div className="motion-row">
          <button type="button" className="motion-btn" onClick={start}>{play ? tr('Anhalten', 'Stop') : tr('Bewegung abspielen', 'Play the motion')}</button>
        </div>
        <div className={`v-result rt-readout ${ride === 'rest' ? '' : 'pos'}`}>
          {ride === 'rest'
            ? <span>{tr('Die Platte verschiebt sich und dreht sich.', 'The plate shifts and turns.')}</span>
            : <><span>{tr(<>Gedreht um <M p=":">{ride}</M></>, <>Turned about <M p=":">{ride}</M></>)}</span> <M>{t`\varphi = ${deg}^\circ`}</M></>}
        </div>
        <p className="vdemo-note">{tr(
          <>Gestrichelt: wo die Platte am Anfang war, und die Bahnen von <M>M</M> und <M p=".">C</M> Fährt die Kamera mit einem Punkt mit (ohne sich zu drehen), steht dieser Punkt still, und die Platte dreht sich nur noch um ihn. Vergleiche «mit <M>B</M>» und «mit <M p="»:">C</M> Der Winkel <M>\varphi</M> ist zu jeder Zeit derselbe.</>,
          <>Dashed: where the plate was at the start, and the paths of <M>M</M> and <M p=".">C</M> If the camera rides along with a point (without turning), that point stands still and the plate only turns about it. Compare “with <M>B</M>” and “with <M p="”:">C</M> the angle <M>\varphi</M> is the same at every time.</>)}</p>
      </figcaption>
    </figure>
  );
}

/** Right-angle mark (8 px) at a between the direction toward q and the direction toward b. */
function rightAngle(a: V, q: V, b: V): V[] {
  const u = (p: V): V => { const dx = p[0] - a[0], dy = p[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
  const e = u(q), w = u(b), k = 8;
  return [[a[0] + k * e[0], a[1] + k * e[1]], [a[0] + k * (e[0] + w[0]), a[1] + k * (e[1] + w[1])], [a[0] + k * w[0], a[1] + k * w[1]]];
}

/* ------------------------------------------------------------------------------------------------ */
const VB2: [number, number, number, number] = [0, 0, 400, 280];
type Preset = 'trans' | 'rot' | 'gen';
const PRESETS: Record<Preset, { vb: [number, number]; w: number; de: string; en: string }> = {
  trans: { vb: [40, 12], w: 0, de: 'Translation', en: 'translation' },
  rot: { vb: [0, 0], w: 0.45, de: 'Drehung um B', en: 'turning about B' },
  gen: { vb: [40, 12], w: 0.45, de: 'Allgemein', en: 'general' },
};

/**
 * Lecture p. 22, Grundgleichung v_M = v_B + ω × BM: the velocity field of a plate at one instant. Set v_B and ω;
 * the arrows at every point follow. At M the split into translation part (v of the reference point, grey) and
 * turning part (ω × BM, purple) is drawn — with B or C as reference point: the split changes, v_M does not.
 */
export function FieldDemo() {
  const tr = useTr(), lang = useLang();
  const [vbx, setVbx] = useState(40);
  const [vby, setVby] = useState(12);
  const [w, setW] = useState(0.45);
  const [ref, setRef] = useState<'B' | 'C'>('B');
  const f = fieldFrame([vbx, vby], w, ref);
  const choose = (k: Preset) => { const p = PRESETS[k]; setVbx(p.vb[0]); setVby(p.vb[1]); setW(p.w); };
  const R = ref;
  const mid = (s: readonly [V, V]): V => [(s[0][0] + s[1][0]) / 2, (s[0][1] + s[1][1]) / 2];
  const rotMid = mid(f.rot), copyMid = mid(f.copy);
  const restShown = !!f.rest && f.rest[0] > 4 && f.rest[0] < 396 && f.rest[1] > 4 && f.rest[1] < 276;
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {(Object.keys(PRESETS) as Preset[]).map((k) => (
          <button key={k} type="button" aria-pressed={vbx === PRESETS[k].vb[0] && vby === PRESETS[k].vb[1] && w === PRESETS[k].w} onClick={() => choose(k)}>{tr(PRESETS[k].de, PRESETS[k].en)}</button>
        ))}
      </div>
      <div className="vdemo-fig wide">
        <svg viewBox={VB2.join(' ')} aria-label={tr('Geschwindigkeitsfeld einer Platte', 'Velocity field of a plate')}>
          <polygon points={pts(f.plate)} className="an-body" />
          {f.grid.map(([a, b], i) => <Arrow key={i} a={a} b={b} cls="rb-v thin gm-field" />)}
          <Arrow a={f.vRef[0]} b={f.vRef[1]} cls="rb-v" />
          <Arrow a={f.copy[0]} b={f.copy[1]} cls="gm-copy" />
          <Arrow a={f.rot[0]} b={f.rot[1]} cls="gm-rot" />
          <Arrow a={f.vM[0]} b={f.vM[1]} cls="rb-v" />
          {restShown && f.rest && (<>
            {/* supplement: every velocity is perpendicular to the ray from the point at rest, and its length grows with the ray */}
            {([f.vB, f.vM] as const).filter(([a, b]) => Math.hypot(a[0] - f.rest![0], a[1] - f.rest![1]) > 14 && Math.hypot(b[0] - a[0], b[1] - a[1]) > 10).map(([a, b], i) => <g key={i}>
              <line x1={f.rest![0]} y1={f.rest![1]} x2={a[0]} y2={a[1]} className="gm-pole-ray" />
              <polyline points={pts(rightAngle(a, f.rest!, b))} className="gm-ra" />
            </g>)}
            <circle cx={f.rest[0]} cy={f.rest[1]} r={5.5} className="rl-mc" />
          </>)}
          {(['B', 'C', 'M'] as const).map((k) => <circle key={k} cx={f[k][0]} cy={f[k][1]} r={k === R ? 5.5 : 4.5} className={k === R ? 'v-m gm-ref' : 'v-m'} />)}
        </svg>
        <div className="vdemo-label point small" style={at(VB2, f.B[0] - 14, f.B[1] + 10)}><M>B</M></div>
        <div className="vdemo-label point small" style={at(VB2, f.C[0] - 14, f.C[1] - 8)}><M>C</M></div>
        <div className="vdemo-label point small halo" style={at(VB2, f.M[0] - 14, f.M[1] + 12)}><M>M</M></div>
        {restShown && f.rest && <div className="vdemo-label angle small halo" style={at(VB2, Math.min(360, Math.max(40, f.rest[0])), f.rest[1] < 30 ? f.rest[1] + 18 : f.rest[1] - 16)}><M>{t`\v v = \v 0`}</M></div>}
        {Math.hypot(f.vM[1][0] - f.vM[0][0], f.vM[1][1] - f.vM[0][1]) > 12 && <div className="vdemo-label point small" style={at(VB2, f.vM[1][0] + 16, f.vM[1][1] - 6)}><M>{t`\v v_M`}</M></div>}
        {Math.hypot(f.copy[1][0] - f.copy[0][0], f.copy[1][1] - f.copy[0][1]) > 12 && <div className="vdemo-label muted small" style={at(VB2, copyMid[0], copyMid[1] + 14)}><M>{t`\v v_${R}`}</M></div>}
        {Math.hypot(f.rot[1][0] - f.rot[0][0], f.rot[1][1] - f.rot[0][1]) > 12 && <div className="vdemo-label angle small" style={at(VB2, rotMid[0] + 34, rotMid[1])}><M>{t`\v\omega\times\v{${R}M}`}</M></div>}
      </div>
      <figcaption className="vdemo-readout">
        <div className="v-presets" role="group" aria-label={tr('Bezugspunkt', 'reference point')}>
          {(['B', 'C'] as const).map((k) => <button key={k} type="button" aria-pressed={ref === k} onClick={() => setRef(k)}>{tr('Bezugspunkt', 'reference point')} <M>{k}</M></button>)}
        </div>
        <label className="slider wide-slider"><span><M>{t`v_{Bx}`}</M></span>
          <input type="range" min={-40} max={40} step={1} value={vbx} onChange={(e) => setVbx(Number(e.target.value))} aria-label="vBx" /><span className="val">{fmtNum(vbx / 100, 2, lang)}</span></label>
        <label className="slider wide-slider"><span><M>{t`v_{By}`}</M></span>
          <input type="range" min={-40} max={40} step={1} value={vby} onChange={(e) => setVby(Number(e.target.value))} aria-label="vBy" /><span className="val">{fmtNum(vby / 100, 2, lang)}</span></label>
        <label className="slider wide-slider"><span><M>\omega</M></span>
          <input type="range" min={-0.5} max={0.5} step={0.01} value={w} onChange={(e) => setW(Number(e.target.value))} aria-label="omega" /><span className="val">{fmtNum(w, 2, lang)}</span></label>
        <div className="v-result pos rt-readout"><M>{t`\v v_M = \v v_${R} + \v\omega\times\v{${R}M}`}</M></div>
        <p className="vdemo-note">{tr(
          <>Die dünnen Pfeile zeigen die Geschwindigkeit in vielen Punkten der Platte, alle aus derselben Formel. Bei <M>M</M> ist sie zerlegt: grau der Translationsteil <M p=",">{t`\v v_${R}`}</M> violett der Drehteil. Wechsle den Bezugspunkt: Die Zerlegung ändert sich, <M>{t`\v v_M`}</M> und <M>\omega</M> nicht. Violetter Punkt (das <a href="#ebene-bewegung">Momentanzentrum</a>, S. 26): Bei einer Bewegung in der Ebene mit <M>{t`\omega \ne 0`}</M> ruht in jedem Augenblick genau ein Punkt. Von ihm aus gesehen ist alles eine Drehung: Jede Geschwindigkeit steht senkrecht auf dem Strahl zu ihm (Winkelzeichen) und ist umso grösser, je länger der Strahl ist.</>,
          <>The thin arrows show the velocity at many points of the plate, all from the same formula. At <M>M</M> it is split: grey the translation part <M p=",">{t`\v v_${R}`}</M> purple the turning part. Switch the reference point: the split changes, <M>{t`\v v_M`}</M> and <M>\omega</M> do not. Purple dot (the <a href="#ebene-bewegung"><span lang="de">Momentanzentrum</span></a>, instantaneous centre, p. 26): for a motion in the plane with <M p=",">{t`\omega \ne 0`}</M> exactly one point is at rest at each instant. Seen from it everything is a turning: every velocity is perpendicular to the ray from it (right-angle marks) and the longer the ray, the larger the velocity.</>)}</p>
      </figcaption>
    </figure>
  );
}
