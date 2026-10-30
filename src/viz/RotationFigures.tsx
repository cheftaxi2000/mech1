import { useEffect, useMemo, useState } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { M } from '../components/Tex';
import { fmtNum, useLang, useTr } from '../i18n';
import { rotateAbout, rotationVelocity } from '../physics/rotation';
import { type Vec3, add, norm, scale } from '../physics/vec';
import { DOOR, FOOT, doorFrame, doorPoint, footNumbers } from './rotGeom';
import { Scene } from './Scene';
import { Arrow, C, Curve, Dashed, Dot, Label } from './primitives';
import { FullscreenButton, useFullscreen } from './useFullscreen';
import { at, useInView } from './figUtils';
import { Arrow as Arrow2 } from './arrow2d';

const t = String.raw;
type V = [number, number];
const DEG = Math.PI / 180;

/* ------------------------------------------------------------------------------------------------ */
const TRACK: [number, number][] = [[2.3, 1.5], [1.25, 0.95], [0.55, 0.45]]; // (s, r) of the three marked points
const GRID: [number, number][] = [[2.3, 0.35], [2.3, 0.7], [2.3, 1.05], [2.3, 1.5], [1.6, 1.5], [0.9, 1.5], [0.2, 1.5]];
const VS = 0.42;

function DoorBody({ beta, phi }: { beta: number; phi: number }) {
  const { D: d, R0, R1, H } = DOOR;
  const corners = useMemo(() => {
    const c: Vec3[] = [];
    for (const s of [0, H]) for (const r of [R0, R1]) for (const dd of [-d, d]) c.push(doorPoint(beta, phi, s, r, dd));
    return c;
  }, [beta, phi, d, R0, R1, H]);
  // 12 edges of the box: pairs of corners differing in exactly one index bit (s: 4, r: 2, d: 1)
  const edges = useMemo(() => {
    const segs: [number, number, number][] = [];
    for (let i = 0; i < 8; i++) for (const bit of [1, 2, 4]) if (!(i & bit)) segs.push(corners[i] as [number, number, number], corners[i | bit] as [number, number, number]);
    return segs;
  }, [corners]);
  const { matrix, size } = useMemo(() => {
    const { e, u0, w0 } = doorFrame(beta);
    const u = rotateAbout(u0, [0, 0, 0], e, phi), w = rotateAbout(w0, [0, 0, 0], e, phi);
    const m = new THREE.Matrix4().makeBasis(new THREE.Vector3(...u), new THREE.Vector3(...w), new THREE.Vector3(...e));
    m.setPosition(...doorPoint(beta, phi, H / 2, (R0 + R1) / 2));
    return { matrix: m, size: [R1 - R0, 2 * d, H] as [number, number, number] };
  }, [beta, phi, d, R0, R1, H]);
  return (
    <group>
      <mesh matrix={matrix} matrixAutoUpdate={false}>
        <boxGeometry args={size} />
        <meshBasicMaterial color="#94a3b8" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <Line points={edges} segments color="#64748b" lineWidth={1.5} />
    </group>
  );
}

/**
 * Lecture p. 15–18: rotation of a body (a door) about the axis μ through the two points A and B at rest.
 * Shows the three properties — points on μ at rest, every other point on a circle about μ, the same angle
 * for every point — and, on request, the velocity distribution v = ω × r (Fig. 3.8). The axis can be tilted:
 * μ does not have to be the z-axis.
 */
export function RotationExplorer() {
  const tr = useTr(), lang = useLang();
  const [ref, full, toggleFull] = useFullscreen();
  const seen = useInView(ref);
  const [w, setW] = useState(0.8);
  const [phi, setPhi] = useState(60 * DEG);
  const [tilt, setTilt] = useState(0);
  const [play, setPlay] = useState(false);
  const [paths, setPaths] = useState(true);
  const [angles, setAngles] = useState(true);
  const [vel, setVel] = useState(false);
  useEffect(() => {
    if (!play || !seen) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => { const dt = Math.min(now - last, 100) / 1000; last = now; setPhi((p) => p + w * dt); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, w, seen]);
  const beta = tilt * DEG;
  const { e } = doorFrame(beta);
  const omega = scale(w, e);
  const A = doorPoint(beta, 0, DOOR.sA, 0), B = doorPoint(beta, 0, DOOR.sB, 0);
  const phiWrapped = ((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const shown = phiWrapped > Math.PI ? phiWrapped - 2 * Math.PI : phiWrapped; // −180° … 180°
  const wl = Math.sign(w) * Math.max(0.3, Math.abs(w) * 0.7);
  const top = doorPoint(beta, 0, 2.95, 0);
  return (
    <figure className={`explorer${full ? ' is-full' : ''}`} ref={ref}>
      <div className="stage">
        <Scene height={full ? '100%' : 420} camera={[5.3, -5.1, 3.9]} target={[0.3, 0.5, 1.45]}>
          {/* axis μ, the hinges A, B and ω */}
          <Line points={[doorPoint(beta, 0, -0.45, 0), doorPoint(beta, 0, 3.2, 0)] as [number, number, number][]} color={C.r} lineWidth={2} />
          <Label at={add(doorPoint(beta, 0, -0.62, 0), [0.14, 0.14, 0])} color={C.r}>μ</Label>
          {Math.abs(w) > 0.01 && <Arrow from={wl > 0 ? top : add(top, scale(-wl, e))} to={wl > 0 ? add(top, scale(wl, e)) : top} color={C.angle} width={5} />}
          {Math.abs(w) > 0.01 && <Label at={add(add(top, scale(Math.abs(wl) * 0.55, e)), [0.2, 0.2, 0])} color={C.angle} vec>ω</Label>}
          <DoorBody beta={beta} phi={phi} />
          <Dot at={A} r={0.06} /><Dot at={B} r={0.06} />
          <Label at={add(A, [-0.2, -0.12, 0])} color={C.point}>A</Label>
          <Label at={add(B, [-0.2, -0.12, 0])} color={C.point}>B</Label>
          {/* the three marked points: circle about μ, the angle turned since φ = 0 */}
          {TRACK.map(([s, r], i) => {
            const p = doorPoint(beta, phi, s, r), p0 = doorPoint(beta, 0, s, r), foot = doorPoint(beta, 0, s, 0);
            return (
              <group key={i}>
                {paths && <Curve f={(a) => doorPoint(beta, a, s, r)} t0={0} t1={2 * Math.PI} color={C.construct} width={1.2} />}
                {angles && Math.abs(shown) > 0.02 && (<>
                  <Curve f={(a) => doorPoint(beta, a, s, r)} t0={0} t1={shown} n={48} color={C.angle} width={3} />
                  <Dashed pts={[foot, p0]} color={C.angle} />
                  <Dashed pts={[foot, p]} color={C.angle} />
                  <Dot at={p0} color={C.construct} r={0.04} />
                </>)}
                {angles && i === 1 && Math.abs(shown) > 0.15 && <Label at={add(doorPoint(beta, shown / 2, s, r + 0.24), [0, 0, 0.08])} color={C.angle}>φ</Label>}
                <Dot at={p} r={0.055} />
              </group>
            );
          })}
          {/* velocity distribution (Fig. 3.8) */}
          {vel && GRID.map(([s, r], i) => {
            const p = doorPoint(beta, phi, s, r), v = rotationVelocity(omega, DOOR.A0, p);
            return norm(v) > 0.02 ? <Arrow key={i} from={p} to={add(p, scale(VS, v))} color={C.point} width={3} /> : null;
          })}
          {vel && <Dot at={doorPoint(beta, phi, 2.3, 0)} color={C.point} r={0.045} />}
        </Scene>
        <FullscreenButton full={full} onClick={toggleFull} />
      </div>
      <div className="side">
        <div className="controls">
          <label className="slider text-label"><span>{tr('Winkel', 'angle')} <M>\varphi</M></span>
            <input type="range" min={-180} max={180} step={1} value={Math.round(shown / DEG)} onChange={(ev) => { setPlay(false); setPhi(Number(ev.target.value) * DEG); }} aria-label="phi" />
            <span className="val">{Math.round(shown / DEG)}°</span></label>
          <label className="slider text-label"><M>{t`\dot\varphi`}</M>
            <input type="range" min={-1.5} max={1.5} step={0.01} value={w} onChange={(ev) => setW(Number(ev.target.value))} aria-label="phidot" />
            <span className="val">{fmtNum(w, 2, lang)}</span></label>
          <label className="slider text-label"><span>{tr('Neigung', 'tilt')} <M>\mu</M></span>
            <input type="range" min={0} max={50} step={1} value={tilt} onChange={(ev) => setTilt(Number(ev.target.value))} aria-label="tilt" />
            <span className="val">{tilt}°</span></label>
          <div className="motion-row">
            <button type="button" className="motion-btn" onClick={() => setPlay((x) => !x)}>
              {play ? tr('Anhalten', 'Stop') : tr('Drehen lassen', 'Let it turn')}
            </button>
          </div>
          <label className="toggle"><input type="checkbox" checked={paths} onChange={(ev) => setPaths(ev.target.checked)} />{' '}{tr(<>Bahnen (Kreise um <M p=")">\mu</M></>, <>paths (circles about <M p=")">\mu</M></>)}</label>
          <label className="toggle"><input type="checkbox" checked={angles} onChange={(ev) => setAngles(ev.target.checked)} />{' '}{tr('Gedrehter Winkel', 'angle turned')}</label>
          <label className="toggle"><input type="checkbox" checked={vel} onChange={(ev) => setVel(ev.target.checked)} />{' '}{tr('Geschwindigkeiten (Fig. 3.8)', 'velocities (Fig. 3.8)')}</label>
        </div>
        <figcaption>
          <div className="v-result pos rt-readout"><M p=",">{t`\varphi = ${Math.round(shown / DEG)}^\circ \ \text{${tr('für alle Punkte', 'for every point')}}`}</M> <M>{t`\v\omega = \dot\varphi\,\v e_\mu = ${fmtNum(w, 2, lang, true)}\,\v e_\mu`}</M></div>
          <p className="vdemo-note">{tr(
            <><M>A</M> und <M>B</M> ruhen, also auch die ganze Achse <M p=".">\mu</M> Jeder andere Punkt fährt einen Kreis um <M>\mu</M> (grau); alle drei markierten Punkte haben sich um denselben Winkel <M>\varphi</M> gedreht (violett). Der violette Pfeil <M>{t`\v\omega`}</M> liegt auf der Achse und ist <M>{t`|\dot\varphi|`}</M> lang. Zeigt der Daumen der rechten Hand in seine Richtung, laufen die Finger im Drehsinn; mit <M>{t`\dot\varphi < 0`}</M> kehrt er um. Mit «Geschwindigkeiten»: <M p=",">{t`\v v = \v\omega\times\v r`}</M> doppelt so weit von der Achse heisst doppelt so schnell.</>,
            <><M>A</M> and <M>B</M> are at rest, hence the whole axis <M p=".">\mu</M> Every other point travels on a circle about <M>\mu</M> (grey); all three marked points have turned by the same angle <M>\varphi</M> (purple). The purple arrow <M>{t`\v\omega`}</M> lies on the axis and is <M>{t`|\dot\varphi|`}</M> long. If the thumb of the right hand points along it, the fingers follow the turning; with <M>{t`\dot\varphi < 0`}</M> it reverses. With “velocities”: <M p=";">{t`\v v = \v\omega\times\v r`}</M> twice as far from the axis means twice as fast.</>)}</p>
        </figcaption>
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------------------------------------ */
const VB: [number, number, number, number] = [0, 0, 400, 280];
const AX = 110, AY = 150, MX = 290, U = 60, WLEN = 48; // μ at x = AX; A = (AX, AY); M = (MX, AY); 60 px per unit

/**
 * Lecture p. 18: |v_M| = |ω|·|AM|, A the foot of the perpendicular from M on μ; v = ω × r holds for any O on μ.
 * Side view of μ; v_M points into the page (⊗). The shaded parallelogram of ω and OM has the area |ω × OM|.
 */
export function FootDemo() {
  const tr = useTr(), lang = useLang();
  const [s, setS] = useState(0.9); // height of O above A, in units
  const O: V = [AX, AY - U * s], Mp: V = [MX, AY], Ap: V = [AX, AY];
  const Wt: V = [AX, O[1] - WLEN];
  const n = footNumbers(s);
  const a0 = -Math.PI / 2, a1 = Math.atan2(Mp[1] - O[1], Mp[0] - O[0]);
  const arc = Array.from({ length: 25 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / 24; return `${(O[0] + 26 * Math.cos(a)).toFixed(1)},${(O[1] + 26 * Math.sin(a)).toFixed(1)}`; }).join(' ');
  const am = (a0 + a1) / 2;
  const f = (x: number) => fmtNum(x, 2, lang, true);
  return (
    <figure className="vdemo">
      <div className="vdemo-fig wide">
        <svg viewBox={VB.join(' ')} aria-label={tr('Achse mit Punkt M, Fusspunkt A und verschiebbarem O', 'Axis with point M, foot A and a movable O')}>
          <polygon points={[O, Wt, [MX, Wt[1] + (AY - O[1])], Mp].map((p) => p.join(',')).join(' ')} className="rt-par" />
          <line x1={AX} y1={10} x2={AX} y2={272} className="rt-axis" />
          <line x1={Ap[0]} y1={Ap[1]} x2={Mp[0]} y2={Mp[1]} className="rt-am" />
          <polyline points={`${AX + 11},${AY} ${AX + 11},${AY - 11} ${AX},${AY - 11}`} className="v-right" />
          <polyline points={arc} className="v-arc" />
          <Arrow2 a={O} b={Wt} cls="rt-w" />
          <Arrow2 a={O} b={toward(Mp, O, 11)} cls="rb-a" />
          <circle cx={Ap[0]} cy={Ap[1]} r={4.5} className="v-m" />
          <circle cx={O[0]} cy={O[1]} r={4.5} className="v-o" />
          <g className="rt-into"><circle cx={Mp[0]} cy={Mp[1]} r={10} /><line x1={Mp[0] - 6} y1={Mp[1] - 6} x2={Mp[0] + 6} y2={Mp[1] + 6} /><line x1={Mp[0] + 6} y1={Mp[1] - 6} x2={Mp[0] - 6} y2={Mp[1] + 6} /></g>
        </svg>
        <div className="vdemo-label small" style={at(VB, AX - 16, 18)}><M>\mu</M></div>
        <div className="vdemo-label angle small" style={at(VB, AX - 16, Wt[1] + 12)}><M>{t`\v\omega`}</M></div>
        <div className="vdemo-label small" style={at(VB, AX - 15, O[1] + 2)}><M>O</M></div>
        <div className="vdemo-label point small" style={at(VB, AX - 15, AY + 12)}><M>A</M></div>
        <div className="vdemo-label point small" style={at(VB, MX + 20, AY - 14)}><M>M</M></div>
        <div className="vdemo-label point small" style={at(VB, MX + 26, AY + 20)}><M>{t`\v v_M`}</M></div>
        <div className="vdemo-label rho small" style={at(VB, (AX + MX) / 2, AY + 16)}><M>{t`|\v{AM}|`}</M></div>
        <div className="vdemo-label angle small" style={at(VB, O[0] + 40 * Math.cos(am), O[1] + 40 * Math.sin(am))}><M>\alpha</M></div>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider"><span>{tr(<><M>O</M> auf <M>\mu</M> verschieben</>, <>move <M>O</M> along <M>\mu</M></>)}</span>
          <input type="range" min={-1.6} max={1.4} step={0.01} value={s} onChange={(e) => setS(Number(e.target.value))} aria-label="O" /><span className="val">{fmtNum(s, 2, lang)}</span></label>
        <div className="v-result rt-readout"><M p=",">{t`|\v{OM}| = ${f(n.OM)}`}</M> <M p=",">{t`\sin\alpha = ${f(n.sinA)}`}</M> <M>{t`|\v{OM}|\sin\alpha = ${f(n.height)} = |\v{AM}|`}</M></div>
        <div className="v-result pos rt-readout"><M>{t`|\v v_M| = |\v\omega\times\v{OM}| = |\v\omega|\,|\v{AM}|`}</M> <M>{t`= ${fmtNum(FOOT.W, 0, lang, true)}\cdot ${f(FOOT.AM)} = ${f(n.v)}`}</M></div>
        <p className="vdemo-note">{tr(
          <>Violett schattiert: das Parallelogramm aus <M>{t`\v\omega`}</M> und <M p=".">{t`\v{OM}`}</M> Seine Fläche ist <M p=".">{t`|\v\omega\times\v{OM}|`}</M> Verschiebst du <M p=",">O</M> wird es schief – aber die Grundseite <M>{t`|\v\omega|`}</M> und die Höhe <M>{t`|\v{AM}|`}</M> bleiben gleich, also auch <M p=".">{t`|\v v_M|`}</M> Das Zeichen <M>\otimes</M> heisst: <M>{t`\v v_M`}</M> zeigt in die Bildebene hinein.</>,
          <>Shaded purple: the parallelogram of <M>{t`\v\omega`}</M> and <M p=".">{t`\v{OM}`}</M> Its area is <M p=".">{t`|\v\omega\times\v{OM}|`}</M> If you move <M p=",">O</M> it gets slanted – but the base <M>{t`|\v\omega|`}</M> and the height <M>{t`|\v{AM}|`}</M> stay the same, and so does <M p=".">{t`|\v v_M|`}</M> The sign <M>\otimes</M> means: <M>{t`\v v_M`}</M> points into the page.</>)}</p>
      </figcaption>
    </figure>
  );
}

/** The point at distance d from p in the direction of q (an arrow that stops at the rim of a symbol). */
const toward = (p: V, q: V, d: number): V => { const l = Math.hypot(q[0] - p[0], q[1] - p[1]); return [p[0] + (d * (q[0] - p[0])) / l, p[1] + (d * (q[1] - p[1])) / l]; };

