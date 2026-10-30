import { useEffect, useState } from 'react';
import { Line } from '@react-three/drei';
import { M } from '../components/Tex';
import { fmtNum, useLang, useTr } from '../i18n';
import { add, cross, norm, scale, sub, type Vec3 } from '../physics/vec';
import { Scene } from './Scene';
import { Arrow, Axes, C, Curve, Dot, Label } from './primitives';
import { FullscreenButton, useFullscreen } from './useFullscreen';
import { useFigureHeight } from './useNarrow';
import { useInView } from './figUtils';

const t = String.raw;
const VS = 0.75; // arrow length per unit of speed
/** Points of a rigid frame (in its own rotating coordinates): a horizontal bar from the axis and a vertical post. */
const BODY: Vec3[] = [[0, 0, 1.1], [0.4, 0, 1.1], [0.8, 0, 1.1], [1.2, 0, 1.1], [1.6, 0, 1.1], [1.2, 0, 0.3], [1.2, 0, 1.8]];
const rot = (p: Vec3, a: number): Vec3 => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a), p[2]];
const O_SHIFT: Vec3 = [0.9, -0.6, 0];
/** Start angle and view: the bar points towards the viewer, so the velocities (⟂ bar) run across the screen (views12.test.ts). */
export const RF_PHI0 = -Math.PI / 4;
export const RF_CAMERA: [number, number, number] = [4.0, -4.0, 3.7];
export const RF_TARGET: [number, number, number] = [0.2, 0.2, 0.9];
export const rfPoints = (phi: number) => BODY.map((p) => rot(p, phi));

/**
 * Lecture p. 11 "Allgemein!": a rigid frame turning about the z-axis. Every point gets v = ω × r (r from O on the axis):
 * v = 0 on the axis, |v| grows with the distance from the axis, always tangent to the point's own circle.
 * Option: measure r from a point O' off the axis — then ω × r' gives wrong velocities (grey).
 */
export function RotationField() {
  const tr = useTr(), lang = useLang();
  const [ref, full, toggleFull] = useFullscreen();
  const seen = useInView(ref);
  const [w, setW] = useState(0.8);
  const [phi, setPhi] = useState(RF_PHI0);
  const h = useFigureHeight(400, 330);
  const [play, setPlay] = useState(false);
  const [wrongO, setWrongO] = useState(false);
  useEffect(() => {
    if (!play || !seen) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => { const dt = Math.min(now - last, 100) / 1000; last = now; setPhi((p) => p + w * dt); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, w, seen]);
  const omega: Vec3 = [0, 0, w];
  const pts = BODY.map((p) => rot(p, phi));
  const wl = Math.sign(w) * Math.max(0.25, Math.abs(w) * 1.6);
  return (
    <figure className={`explorer${full ? ' is-full' : ''}`} ref={ref}>
      <div className="stage">
        <Scene height={full ? '100%' : h} camera={RF_CAMERA} target={RF_TARGET}>
          <Axes size={2.0} />
          {Math.abs(w) > 0.01 && <Arrow to={[0, 0, 2.15 + 0 * wl]} from={[0, 0, 2.15 - wl]} color={C.angle} width={5} />}
          {Math.abs(w) > 0.01 && <Label at={[0.18, -0.18, 2.3]} color={C.angle} vec>ω</Label>}
          {/* the rigid frame */}
          <Line points={[pts[0], pts[4]] as [number, number, number][]} color={C.r} lineWidth={3} />
          <Line points={[pts[5], pts[6]] as [number, number, number][]} color={C.r} lineWidth={3} />
          {/* circles of the points, and v = ω × r */}
          {pts.map((p, i) => {
            const rho = Math.hypot(p[0], p[1]);
            const v = cross(omega, p);
            const vw = cross(omega, sub(p, O_SHIFT));
            return (
              <group key={i}>
                {rho > 0.05 && <Curve f={(a) => [rho * Math.cos(a), rho * Math.sin(a), p[2]]} t0={0} t1={2 * Math.PI} color={C.construct} width={1} />}
                {norm(v) > 0.02 && <Arrow from={p} to={add(p, scale(VS, v))} color={C.point} width={3} />}
                {wrongO && norm(vw) > 0.02 && <Arrow from={p} to={add(p, scale(VS, vw))} color="#94a3b8" width={2} />}
                <Dot at={p} r={0.045} />
              </group>
            );
          })}
          {wrongO && (<><Dot at={O_SHIFT} color="#94a3b8" r={0.05} /><Label at={add(O_SHIFT, [0.15, -0.15, -0.1])} color="#64748b">O'</Label></>)}
        </Scene>
        <FullscreenButton full={full} onClick={toggleFull} />
      </div>
      <div className="side">
        <div className="controls">
          <label className="slider">
            <M>{t`\dot\varphi`}</M>
            <input type="range" min={-1.5} max={1.5} step={0.01} value={w} onChange={(e) => setW(Number(e.target.value))} aria-label="phidot" />
            <span className="val">{fmtNum(w, 2, lang)}</span>
          </label>
          <div className="motion-row">
            <button type="button" className="motion-btn" onClick={() => setPlay((x) => !x)}>
              {play ? tr('Anhalten', 'Stop') : tr('Drehen lassen', 'Let it turn')}
            </button>
          </div>
          <label className="toggle"><input type="checkbox" checked={wrongO} onChange={(e) => setWrongO(e.target.checked)} />{' '}
            {tr(<>Zum Vergleich: <M>{t`\v r`}</M> von einem Punkt <M>{t`O'`}</M> neben der Achse messen (grau, falsch)</>, <>For comparison: measure <M>{t`\v r`}</M> from a point <M>{t`O'`}</M> off the axis (grey, wrong)</>)}</label>
        </div>
        <figcaption>
          <div className="v-result pos"><M>{t`\v\omega = \dot\varphi\,\v e_z = ${fmtNum(w, 2, lang, true)}\,\v e_z, \qquad \v v = \v\omega\times\v r`}</M></div>
          <p className="vdemo-note">{tr(<>Rote Pfeile: <M p=".">{t`\v v = \v\omega\times\v r`}</M> Auf der Achse ist <M p=",">{t`\v v = \v 0`}</M> doppelt so weit weg heisst doppelt so schnell. Jeder Pfeil liegt tangential an der Kreisbahn seines Punktes (grau). Kehrt <M>{t`\dot\varphi`}</M> das Vorzeichen, drehen sich <M>{t`\v\omega`}</M> und alle Pfeile um.</>,
            <>Red arrows: <M p=".">{t`\v v = \v\omega\times\v r`}</M> On the axis <M p=";">{t`\v v = \v 0`}</M> twice as far out means twice as fast. Each arrow is tangent to its point's circle (grey). If <M>{t`\dot\varphi`}</M> changes sign, <M>{t`\v\omega`}</M> and all arrows reverse.</>)}</p>
        </figcaption>
      </div>
    </figure>
  );
}
