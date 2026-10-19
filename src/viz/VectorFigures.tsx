import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { M } from '../components/Tex';
import { fmtNum, useLang, useTr } from '../i18n';
import { cross, norm, type Vec3 } from '../physics/vec';
import { Scene } from './Scene';
import { Arrow, C, Curve, Dashed, Dot, Label } from './primitives';

const DEG = Math.PI / 180;
const t = String.raw;

export { at, useReducedMotion } from './figUtils';
import { at } from './figUtils';

/** SVG arc around O from angle a0 to a1 (radians, counter-clockwise, y up), radius r. */
function arcPath(a0: number, a1: number, r: number) {
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0, sweep = a1 > a0 ? 0 : 1;
  return `M ${(r * Math.cos(a0)).toFixed(2)} ${(-r * Math.sin(a0)).toFixed(2)} A ${r} ${r} 0 ${large} ${sweep} ${(r * Math.cos(a1)).toFixed(2)} ${(-r * Math.sin(a1)).toFixed(2)}`;
}

/* ------------------------------------------------------------------------------------------------ */

const DVB: [number, number, number, number] = [-150, -125, 320, 225];
const U = 60; // px per unit length
const A_LEN = 2; // |a|

/**
 * Scalar product as a projection (lecture p. 5, right figure): drag the tip of b. The bar on the line of a
 * is |b| cos φ, the projection of b onto the a-direction; a · b = |a| · (that bar). Negative for φ > 90°.
 */
export function DotDemo() {
  const tr = useTr(), lang = useLang();
  const [b, setB] = useState<[number, number]>([1.6 * Math.cos(55 * DEG), 1.6 * Math.sin(55 * DEG)]);
  const svg = useRef<SVGSVGElement>(null);
  const place = (e: React.PointerEvent) => {
    if (!svg.current || (e.type === 'pointermove' && e.buttons !== 1)) return;
    const r = svg.current.getBoundingClientRect();
    let x = (DVB[0] + ((e.clientX - r.left) / r.width) * DVB[2]) / U, y = -(DVB[1] + ((e.clientY - r.top) / r.height) * DVB[3]) / U;
    const n = Math.hypot(x, y);
    if (n < 0.2) return;
    const len = Math.min(1.85, Math.max(0.5, n));
    let a = Math.atan2(y, x);
    if (Math.abs(Math.abs(a) - Math.PI / 2) < 2.5 * DEG) a = Math.sign(a) * Math.PI / 2; // snap to the right angle
    x = len * Math.cos(a); y = len * Math.sin(a);
    setB([x, y]);
  };
  const preset = (deg: number) => setB([1.6 * Math.cos(deg * DEG), 1.6 * Math.sin(deg * DEG)]);

  const bLen = Math.hypot(b[0], b[1]);
  const phi = Math.acos(Math.max(-1, Math.min(1, b[0] / bLen))); // angle between a (= along +x) and b
  const phiDeg = Math.round(phi / DEG);
  const proj = Math.abs(phiDeg - 90) < 0.5 ? 0 : b[0]; // |b| cos φ
  const dotv = A_LEN * proj;
  const sign = Math.abs(dotv) < 0.005 ? 'zero' : dotv > 0 ? 'pos' : 'neg';
  const bx = b[0] * U, by = -b[1] * U, fx = proj * U;
  const angB = Math.atan2(b[1], b[0]);
  const mid = angB / 2;
  const f = (x: number) => fmtNum(x, 2, lang, true);
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <svg ref={svg} viewBox={DVB.join(' ')} onPointerDown={place} onPointerMove={place} aria-label={tr('Vektor b, Spitze ziehbar', 'Vector b, tip draggable')}>
          <line x1={DVB[0] + 4} y1={0} x2={DVB[0] + DVB[2] - 4} y2={0} className="v-line" />
          <path d={arcPath(0, angB, 30)} className="v-arc" />
          <line x1={bx} y1={by} x2={fx} y2={0} className="v-drop" />
          {Math.abs(by) > 12 && Math.abs(fx) > 12 && <path d={`M ${fx + (fx > 0 ? -9 : 9)} 0 v ${by < 0 ? -9 : 9} h ${fx > 0 ? 9 : -9}`} className="v-right" />}
          {sign !== 'zero' && <line x1={0} y1={0} x2={fx} y2={0} className={`v-proj ${sign}`} />}
          <line x1={0} y1={0} x2={A_LEN * U - 10} y2={0} className="v-a" />
          <path d={`M ${A_LEN * U} 0 l -13 -6 v 12 z`} className="v-a-head" />
          <line x1={0} y1={0} x2={bx} y2={by} className="v-b" />
          <path d={`M ${bx} ${by} l -13 -6 v 12 z`} transform={`rotate(${(-angB / DEG).toFixed(1)} ${bx} ${by})`} className="v-b-head" />
          <circle cx={bx} cy={by} r={16} className="v-handle" />
          <circle cx={0} cy={0} r={3} className="v-o" />
        </svg>
        <div className="vdemo-label x" style={at(DVB, A_LEN * U + 8, 16)}><M>{t`\v a`}</M></div>
        <div className="vdemo-label y" style={at(DVB, bx * 1.13 + 10 * Math.sign(bx || 1), by * 1.13 - 14)}><M>{t`\v b`}</M></div>
        <div className="vdemo-label angle" style={at(DVB, 50 * Math.cos(mid), -50 * Math.sin(mid))}><M>\varphi</M></div>
        {sign !== 'zero' && <div className={`vdemo-label proj ${sign}`} style={at(DVB, fx / 2, by > 0 ? -16 : 18)}><M>{t`|\v b|\cos\varphi`}</M></div>}
        <div className="vdemo-label muted" style={at(DVB, -10, 12)}><M>O</M></div>
      </div>
      <figcaption className="vdemo-readout">
        <div><M>{t`\varphi = ${phiDeg}^\circ,\quad |\v a| = 2,\quad |\v b| = ${f(bLen)}`}</M></div>
        <div className={`v-result ${sign}`}><M>{t`\v a\cdot\v b = |\v a|\,\big(|\v b|\cos\varphi\big) = 2\cdot(${f(proj)}) = ${f(dotv)}`}</M></div>
        <div className="v-presets" role="group" aria-label={tr('Winkel wählen', 'Choose an angle')}>
          {[0, 60, 90, 120, 180].map((d) => (
            <button type="button" key={d} onClick={() => preset(d)} aria-pressed={phiDeg === d && Math.abs(bLen - 1.6) < 0.01}><M>{t`${d}^\circ`}</M></button>
          ))}
        </div>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------------------------------------ */

/** Filled parallelogram O, a, a + b, b (double-sided, translucent). */
function Parallelogram({ a, b, color }: { a: Vec3; b: Vec3; color: string }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = [0, 0, 0, a[0], a[1], a[2], a[0] + b[0], a[1] + b[1], a[2] + b[2], b[0], b[1], b[2]];
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    return g;
  }, [a, b]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial color={color} transparent opacity={0.22} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

const CA = 1.6, CB = 1.3; // |a|, |b| in the cross-product figure

/**
 * Cross product (lecture p. 5, figure with the parallelogram): a along e_x, b in the xy-plane at angle φ.
 * c = a × b stands perpendicular to both; its length equals the shaded area |a||b| sin φ.
 */
export function CrossDemo() {
  const tr = useTr(), lang = useLang();
  const [phiDeg, setPhiDeg] = useState(60);
  const [swap, setSwap] = useState(false);
  const p = phiDeg * DEG;
  const a: Vec3 = useMemo(() => [CA, 0, 0], []);
  const b: Vec3 = useMemo(() => [CB * Math.cos(p), CB * Math.sin(p), 0], [p]);
  const c = useMemo(() => (swap ? cross(b, a) : cross(a, b)), [a, b, swap]);
  const area = norm(c);
  const f = (x: number) => fmtNum(x, 2, lang, true);
  const cTip: Vec3 = [c[0], c[1], c[2]];
  return (
    <figure className="explorer cross-demo">
      <Scene height={380} camera={[3.4, -3.9, 2.9]} target={[0.75, 0.45, 0.55]}>
        <Line points={[[-0.6, 0, 0], [2.2, 0, 0]]} color={C.construct} lineWidth={1} dashed dashSize={0.05} gapSize={0.04} />
        {area > 1e-3 && <Parallelogram a={a} b={b} color={C.rho} />}
        <Dashed pts={[a, [a[0] + b[0], a[1] + b[1], 0], b]} color={C.rho} />
        <Arrow to={a} color={C.x} width={3} />
        <Arrow to={b} color={C.y} width={3} />
        {area > 1e-3 && <Arrow to={cTip} color={C.z} width={3} />}
        {phiDeg > 3 && <Curve f={(s) => [0.42 * Math.cos(s), 0.42 * Math.sin(s), 0]} t0={0} t1={p} color={C.angle} width={2} />}
        {phiDeg > 3 && <Label at={[0.62 * Math.cos(p / 2), 0.62 * Math.sin(p / 2), 0]} color={C.angle}>φ</Label>}
        <Dot at={[0, 0, 0]} color={C.axis} r={0.035} />
        <Label at={[-0.14, -0.14, -0.1]} color={C.axis}>O</Label>
        <Label at={[a[0] + 0.14, -0.12, 0]} color={C.x} vec>a</Label>
        <Label at={[b[0] * 1.14, b[1] * 1.14 + 0.04, 0.02]} color={C.y} vec>b</Label>
        {area > 1e-3 && <Label at={[0.05, -0.18, c[2] + (c[2] > 0 ? 0.14 : -0.14)]} color={C.z} vec>c</Label>}
      </Scene>
      <div className="controls">
        <label className="slider">
          <M>\varphi</M>
          <input type="range" min={0} max={180} step={1} value={phiDeg} onChange={(e) => setPhiDeg(Number(e.target.value))} aria-label="phi" />
          <span className="val">{phiDeg}°</span>
        </label>
        <label className="toggle">
          <input type="checkbox" checked={swap} onChange={(e) => setSwap(e.target.checked)} />{' '}
          {tr(<>Reihenfolge vertauschen: <M>{t`\v c = \v b\times\v a`}</M></>, <>Swap the order: <M>{t`\v c = \v b\times\v a`}</M></>)}
        </label>
      </div>
      <figcaption>
        <div className="v-result pos"><M>{t`|\v c| = |\v a|\,|\v b|\sin\varphi = ${f(CA)}\cdot ${f(CB)}\cdot\sin ${phiDeg}^\circ = ${f(area)}`}</M></div>
        <p className="vdemo-note">
          {tr(<>Die Länge von <M>{t`\v c`}</M> ist der Flächeninhalt des türkisen Parallelogramms. <M>{t`\v c`}</M> steht senkrecht auf <M>{t`\v a`}</M> und <M p=".">{t`\v b`}</M> {swap ? <>Vertauscht man die Reihenfolge, zeigt <M>{t`\v c`}</M> nach unten.</> : <>Rechte Hand: Daumen <M p=",">{t`\v a`}</M> Zeigefinger <M p=",">{t`\v b`}</M> Mittelfinger <M p=".">{t`\v c`}</M></>}</>,
            <>The length of <M>{t`\v c`}</M> is the area of the teal parallelogram. <M>{t`\v c`}</M> is perpendicular to <M>{t`\v a`}</M> and <M p=".">{t`\v b`}</M> {swap ? <>Swapping the order makes <M>{t`\v c`}</M> point down.</> : <>Right hand: thumb <M p=",">{t`\v a`}</M> index finger <M p=",">{t`\v b`}</M> middle finger <M p=".">{t`\v c`}</M></>}</>)}
        </p>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------------------------------------ */

/** e1 → e2 → e3 → e1: along the arrows the cross product is +, against them − (lecture p. 5 "Rechtssystem"). */
export function CycleDiagram() {
  const vb: [number, number, number, number] = [-100, -95, 200, 185];
  const R = 62;
  const node = (k: number): [number, number] => { const a = (90 - 120 * k) * DEG; return [R * Math.cos(a), -R * Math.sin(a)]; };
  const arc = (k: number) => {
    const a0 = (90 - 120 * k - 24) * DEG, a1 = (90 - 120 * (k + 1) + 24) * DEG;
    const p0 = [R * Math.cos(a0), -R * Math.sin(a0)], p1 = [R * Math.cos(a1), -R * Math.sin(a1)];
    return `M ${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A ${R} ${R} 0 0 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`;
  };
  const tr = useTr();
  return (
    <figure className="cycle">
      <div className="cycle-fig">
        <svg viewBox={vb.join(' ')} aria-label={tr('Zyklus e1, e2, e3', 'Cycle e1, e2, e3')}>
          <defs>
            <marker id="cyc-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" className="cyc-head" />
            </marker>
          </defs>
          {[0, 1, 2].map((k) => <path key={k} d={arc(k)} className="cyc-arc" markerEnd="url(#cyc-head)" />)}
        </svg>
        {(['x', 'y', 'z'] as const).map((ax, k) => { const [x, y] = node(k); return (
          <div key={ax} className={`vdemo-label ${ax}`} style={at(vb, x, y)}><M>{t`\v e_${k + 1}`}</M></div>
        ); })}
        <div className="vdemo-label plus" style={at(vb, 0, 0)}><M>+</M></div>
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------------------------------------ */

/** "c1 e_1 + c2 e_2 − c3 e_3" with proper signs (coefficients formatted by `f`), e.g. for vector readouts. */
export const combo = (f: (x: number) => string, cs: [number, string][]) =>
  cs.map(([c, b], i) => `${i === 0 ? (c < 0 ? '-' : '') : c < 0 ? ' - ' : ' + '}${f(Math.abs(c))}\\,${b}`).join('');

/** Demo motion for the position vector: r(t) on a tilted ellipse, 0 ≤ t ≤ 2π (seconds ≙ radians). */
export const pvMotion = (s: number): Vec3 => [1.2 + 0.5 * Math.cos(s), 0.5 + 0.5 * Math.sin(s), 1.5 + 0.35 * Math.sin(s + 0.8)];
/** Start time and view of the position-vector figure: r is drawn well clear of e_y (views12.test.ts). */
export const PV_T0 = 2.8;
export const PV_CAMERA: [number, number, number] = [3.8, -4.1, 3.2];
export const PV_TARGET: [number, number, number] = [0.8, 0.45, 0.85];

/**
 * Lecture p. 5: the position vector r from O to M, the motion t → r(t), and its decomposition in the Cartesian
 * basis r = r_x e_x + r_y e_y + r_z e_z (components laid head to tail, each in its axis colour).
 */
export function PositionVectorFigure() {
  const tr = useTr(), lang = useLang();
  const [s, setS] = useState(PV_T0);
  const [play, setPlay] = useState(false);
  const [parts, setParts] = useState(true);
  useEffect(() => {
    if (!play) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000; last = now;
      setS((v) => (v + dt * 0.8) % (2 * Math.PI));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play]);
  const r = pvMotion(s);
  const X: Vec3 = [r[0], 0, 0], XY: Vec3 = [r[0], r[1], 0];
  const f = (x: number) => fmtNum(x, 2, lang, true);
  return (
    <figure className="explorer">
      <Scene height={400} camera={PV_CAMERA} target={PV_TARGET}>
        <Line points={[[0, 0, 0], [2.3, 0, 0]]} color={C.axis} lineWidth={1} />
        <Line points={[[0, 0, 0], [0, 1.9, 0]]} color={C.axis} lineWidth={1} />
        <Line points={[[0, 0, 0], [0, 0, 2.3]]} color={C.axis} lineWidth={1} />
        <Label at={[2.45, 0, 0]} color={C.axis}>x</Label>
        <Label at={[0, 2.05, 0]} color={C.axis}>y</Label>
        <Label at={[0, 0, 2.45]} color={C.axis}>z</Label>
        <Curve f={pvMotion} t0={0} t1={2 * Math.PI} color={C.path} width={1.5} />
        <Arrow to={[1, 0, 0]} color={C.x} width={4} /><Label at={[0.85, -0.22, -0.1]} color={C.x} vec sub="x">e</Label>
        <Arrow to={[0, 1, 0]} color={C.y} width={4} /><Label at={[-0.12, 1.05, -0.18]} color={C.y} vec sub="y">e</Label>
        <Arrow to={[0, 0, 1]} color={C.z} width={4} /><Label at={[-0.2, -0.2, 0.9]} color={C.z} vec sub="z">e</Label>
        {parts && (<>
          <Line points={[[0, 0, 0], X as [number, number, number]]} color={C.x} lineWidth={2} dashed dashSize={0.07} gapSize={0.04} />
          <Line points={[X as [number, number, number], XY as [number, number, number]]} color={C.y} lineWidth={2} dashed dashSize={0.07} gapSize={0.04} />
          <Line points={[XY as [number, number, number], r as [number, number, number]]} color={C.z} lineWidth={2} dashed dashSize={0.07} gapSize={0.04} />
        </>)}
        <Arrow to={r} color={C.r} width={3} />
        <Label at={[r[0] * 0.55 - 0.12, r[1] * 0.55 - 0.12, r[2] * 0.55 + 0.16]} color={C.r} vec>r</Label>
        <Dot at={r} />
        <Label at={[r[0], r[1], r[2] + 0.2]} color={C.point}>M</Label>
        <Dot at={[0, 0, 0]} color={C.axis} r={0.03} />
        <Label at={[-0.14, -0.14, -0.1]} color={C.axis}>O</Label>
      </Scene>
      <div className="controls">
        <div className="motion-row">
          <button type="button" className="motion-btn" onClick={() => setPlay((v) => !v)}>
            {play ? tr('Anhalten', 'Stop') : tr('Bewegung abspielen', 'Play the motion')}
          </button>
          <label className="slider grow has-val">
            <M>t</M>
            <input type="range" min={0} max={6.28} step={0.01} value={s} onChange={(e) => { setPlay(false); setS(Number(e.target.value)); }} aria-label="t" />
            <span className="val">{fmtNum(s, 2, lang)}&nbsp;s</span>
          </label>
        </div>
        <label className="toggle"><input type="checkbox" checked={parts} onChange={(e) => setParts(e.target.checked)} />{' '}
          {tr(<>Komponenten <M>{t`r_x\v e_x + r_y\v e_y + r_z\v e_z`}</M> zeigen</>, <>show the components <M>{t`r_x\v e_x + r_y\v e_y + r_z\v e_z`}</M></>)}</label>
      </div>
      <figcaption>
        <div className="v-result"><M>{t`\v r = ` + combo(f, [[r[0], t`\v e_x`], [r[1], t`\v e_y`], [r[2], t`\v e_z`]])}</M></div>
      </figcaption>
    </figure>
  );
}
