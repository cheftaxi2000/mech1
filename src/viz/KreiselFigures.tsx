import { useEffect, useMemo, useState } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { M } from '../components/Tex';
import { useTr } from '../i18n';
import { coneAxis, conePoint, kreiselVelocity, rollingSpin } from '../physics/kreisel';
import { type Vec3, add, cross, dot, norm, normalize, scale } from '../physics/vec';
import { CONE, H, MODES, R, U0, coneBodyPoint, kreiselFrame, M0, type Mode } from './kreiselGeom';
import { Scene } from './Scene';
import { Arrow, C, Dot, Label } from './primitives';
import { FullscreenButton, useFullscreen } from './useFullscreen';

const t = String.raw;
type P3 = [number, number, number];
const DEG = Math.PI / 180;

const RIM = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);
const SPOKES = Array.from({ length: 6 }, (_, i) => (i * Math.PI) / 3 + Math.PI / 6);
const VS = 0.28;
/** Label position next to a point, on the side opposite to its velocity arrow (above it when the point is at rest). */
const awayFrom = (p: Vec3, v: Vec3): Vec3 => (norm(v) * VS > 0.04 ? add(p, add(scale(-0.24, normalize(v)), [0, 0, 0.06])) : add(p, [0, 0, 0.22]));

function ConeBody({ phi, psi }: { phi: number; psi: number }) {
  const matrix = useMemo(() => {
    const P = (p0: Vec3) => conePoint(CONE.GAM, phi, psi, p0);
    const e3 = coneAxis(CONE.GAM, phi), u = normalize(P(U0)); // U0 is ⊥ the axis: turning keeps it a unit vector ⊥ e3
    const y = scale(-1, e3), z = cross(u, y);
    const m = new THREE.Matrix4().makeBasis(new THREE.Vector3(...u), new THREE.Vector3(...y), new THREE.Vector3(...z));
    m.setPosition(...scale(H / 2, e3));
    return m;
  }, [phi, psi]);
  const base = useMemo(() => Array.from({ length: 73 }, (_, i) => conePoint(CONE.GAM, phi, psi, coneBodyPoint(1, (2 * Math.PI * i) / 72)) as P3), [phi, psi]);
  return (
    <group>
      <mesh matrix={matrix} matrixAutoUpdate={false}>
        <coneGeometry args={[R, H, 48]} />
        <meshBasicMaterial color="#94a3b8" transparent opacity={0.2} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <Line points={base} color="#475569" lineWidth={1.6} />
      {SPOKES.map((a) => <Line key={a} points={[[0, 0, 0], conePoint(CONE.GAM, phi, psi, coneBodyPoint(1, a)) as P3]} color="#94a3b8" lineWidth={1} />)}
    </group>
  );
}

/**
 * Lecture p. 20–21: Kreiselung — only O is at rest. A cone rolls on the floor about its apex O (like a paper cup
 * rolling in a circle on a table). Every point stays at the same distance from O (paths on spheres); at each
 * instant a whole axis μ through O is at rest (teal), the velocities are v = ω × r. The presets compare rolling
 * (μ = line of contact) with turning without spin (μ vertical) and fast spin (μ tilted): μ always passes through O.
 */
export function KreiselExplorer() {
  const tr = useTr();
  const [ref, full, toggleFull] = useFullscreen();
  const [phi, setPhi] = useState(100 * DEG);
  const [mode, setMode] = useState<Mode>('roll');
  const [play, setPlay] = useState(false);
  const [vel, setVel] = useState(true);
  const [sphere, setSphere] = useState(true);
  useEffect(() => {
    if (!play) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => { const dt = Math.min(now - last, 100) / 1000; last = now; setPhi((p) => (p + 0.45 * dt) % (2 * Math.PI)); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play]);
  const k = MODES[mode].k;
  const f = kreiselFrame(phi, k);
  const { L } = CONE;
  const Mp = f.P(M0), Cb = f.P(coneBodyPoint(1, 0, 0));
  const trail = useMemo(() => {
    const ratio = k * rollingSpin(CONE.GAM, 1);
    return Array.from({ length: 241 }, (_, i) => { const p = phi - 2 * Math.PI + (2 * Math.PI * i) / 240; return conePoint(CONE.GAM, p, ratio * p, M0) as P3; });
  }, [phi, k]);
  const wl = Math.min(1.7, 0.62 * norm(f.omega));
  const muEnd = scale(L + 0.45, f.axis), muStart = scale(-(L + 0.45), f.axis);
  // label the end above the floor; on the floor (rolling) the end away from the cone
  const muLabel = Math.abs(muEnd[2] - muStart[2]) > 1e-6 ? (muEnd[2] > muStart[2] ? muEnd : muStart) : (dot(muEnd, f.contact) < 0 ? muEnd : muStart);
  const samples: Vec3[] = [...RIM.map((a) => coneBodyPoint(1, a)), coneBodyPoint(0.5, 0), coneBodyPoint(1, 0, 0)];
  const deg = Math.round(phi / DEG);
  return (
    <figure className={`explorer${full ? ' is-full' : ''}`} ref={ref}>
      <div className="stage">
        <Scene height={full ? '100%' : 420} camera={[4.3, -4.6, 3.3]} target={[0, 0.1, 0.45]}>
          {/* the floor and the circle on which the rim touches it */}
          <mesh position={[0, 0, -0.002]}>
            <circleGeometry args={[L + 0.6, 64]} />
            <meshBasicMaterial color="#cbd5e1" transparent opacity={0.35} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
          <Line points={Array.from({ length: 97 }, (_, i) => [L * Math.cos((2 * Math.PI * i) / 96), L * Math.sin((2 * Math.PI * i) / 96), 0] as P3)} color={C.construct} lineWidth={1} dashed dashSize={0.06} gapSize={0.05} />
          {/* sphere of radius |OM| = L and the path of M on it */}
          {sphere && (<>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <sphereGeometry args={[L, 48, 24, 0, 2 * Math.PI, 0, Math.PI / 2]} />
              <meshBasicMaterial color="#94a3b8" transparent opacity={0.07} depthWrite={false} side={THREE.FrontSide} />
            </mesh>
            <Line points={trail} color={C.point} lineWidth={1.3} dashed dashSize={0.07} gapSize={0.06} transparent opacity={0.5} />
          </>)}
          {/* the line of contact (on the floor) */}
          <Line points={[[0, 0, 0.003], [f.contact[0], f.contact[1], 0.003]]} color={C.r} lineWidth={2.2} />
          <ConeBody phi={phi} psi={f.psi} />
          {/* the momentary axis μ (at rest) and ω */}
          <Line points={[muStart as P3, muEnd as P3]} color={C.rho} lineWidth={4} />
          <Label at={add(muLabel, [0, 0, 0.14])} color={C.rho}>μ</Label>
          <Arrow from={[0, 0, 0]} to={scale(wl, f.axis)} color={C.angle} width={5} />
          <Label at={add(scale(wl + 0.2, f.axis), [0, 0, 0.12])} color={C.angle} vec>ω</Label>
          {/* velocities v = ω × r */}
          {vel && samples.map((p0, i) => {
            const p = f.P(p0), v = kreiselVelocity(f.omega, p);
            return norm(v) * VS > 0.04 ? <Arrow key={i} from={p} to={add(p, scale(VS, v))} color={C.point} width={2.5} /> : null;
          })}
          <Dot at={Cb} r={0.05} />
          <Label at={awayFrom(Cb, kreiselVelocity(f.omega, Cb))} color={C.point}>C</Label>
          {/* r = OM (dark, the colour of position vectors): its length stays the same */}
          <Line points={[[0, 0, 0], Mp as P3]} color={C.r} lineWidth={1.8} />
          <Dot at={Mp} r={0.07} />
          <Label at={awayFrom(Mp, kreiselVelocity(f.omega, Mp))} color={C.point}>M</Label>
          <Dot at={[0, 0, 0]} color={C.r} r={0.07} />
          <Label at={[-0.2, -0.22, 0.05]} color={C.r}>O</Label>
        </Scene>
        <FullscreenButton full={full} onClick={toggleFull} />
      </div>
      <div className="side">
        <div className="controls">
          <div className="v-presets">
            {(Object.keys(MODES) as Mode[]).map((m) => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>{tr(MODES[m].de, MODES[m].en)}</button>
            ))}
          </div>
          <label className="slider text-label"><span>{tr('Lage', 'position')}</span>
            <input type="range" min={0} max={359} step={1} value={deg} onChange={(ev) => { setPlay(false); setPhi(Number(ev.target.value) * DEG); }} aria-label="phi" />
            <span className="val">{deg}°</span></label>
          <div className="motion-row">
            <button type="button" className="motion-btn" onClick={() => setPlay((x) => !x)}>
              {play ? tr('Anhalten', 'Stop') : tr('Abrollen lassen', 'Let it roll')}
            </button>
          </div>
          <label className="toggle"><input type="checkbox" checked={vel} onChange={(ev) => setVel(ev.target.checked)} />{' '}{tr('Geschwindigkeiten', 'velocities')}</label>
          <label className="toggle"><input type="checkbox" checked={sphere} onChange={(ev) => setSphere(ev.target.checked)} />{' '}{tr(<>Kugel um <M>O</M> und Bahn von <M>M</M></>, <>sphere about <M>O</M> and path of <M>M</M></>)}</label>
        </div>
        <figcaption>
          <div className={`v-result rt-readout ${f.rolling ? 'pos' : 'neg'}`}>
            <M>{t`\v v = \v\omega\times\v r`}</M>
            <b className="tr-chip">{f.rolling ? tr('Achse ist die Berührlinie', 'axis is the line of contact') : tr('Berührlinie gleitet', 'line of contact slides')}</b>
          </div>
          <p className="vdemo-note">{tr(
            <>Nur die Spitze <M>O</M> ruht immer. In jedem Augenblick ruht aber eine ganze Achse <M>\mu</M> durch <M>O</M> (türkis) – dort sind die Geschwindigkeiten null, weiter weg werden sie grösser. Beim Rollen ist <M>\mu</M> die Berührlinie mit dem Boden (schwarz), wie beim rollenden Zylinder. <M>M</M> bleibt immer gleich weit von <M>O</M> entfernt: Seine Bahn liegt auf einer Kugel um <M p=".">O</M></>,
            <>Only the tip <M>O</M> is always at rest. At each instant, though, a whole axis <M>\mu</M> through <M>O</M> is at rest (teal) – there the velocities are zero, further away they grow. When rolling, <M>\mu</M> is the line of contact with the floor (black), as for the rolling cylinder. <M>M</M> always stays at the same distance from <M p=":">O</M> its path lies on a sphere about <M p=".">O</M></>)}</p>
        </figcaption>
      </div>
    </figure>
  );
}
