import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Scene } from './Scene';
import { FullscreenButton, useFullscreen } from './useFullscreen';
import { Arrow, Axes, C, Curve, Dashed, Dot, Label } from './primitives';
import { cartToCyl, cartToSph, cylToCart, eR, ePhi, ePsi, eRho, eTheta, sphToCart } from '../physics/coords';
import { add, scale } from '../physics/vec';
import { Line } from '@react-three/drei';
import { useFigureHeight } from './useNarrow';
import type { Vec3 } from '../physics/vec';
import { M } from '../components/Tex';
import { fmtNum, tupleSep, useLang, useTr } from '../i18n';

export type Mode = 'cart' | 'cyl' | 'sph';
const deg = (r: number) => (r * 180) / Math.PI;
const rad = (d: number) => (d * Math.PI) / 180;

interface SliderDef { key: string; tex: string; min: number; max: number; step: number; unit?: string }
const SLIDERS: Record<Mode, SliderDef[]> = {
  cart: [
    { key: 'x', tex: 'x', min: -2, max: 2, step: 0.05 },
    { key: 'y', tex: 'y', min: -2, max: 2, step: 0.05 },
    { key: 'z', tex: 'z', min: -2, max: 2, step: 0.05 },
  ],
  cyl: [
    { key: 'rho', tex: '\\rho', min: 0, max: 2.5, step: 0.05 },
    { key: 'phi', tex: '\\varphi', min: 0, max: 359, step: 1, unit: '°' },
    { key: 'z', tex: 'z', min: -2, max: 2, step: 0.05 },
  ],
  sph: [
    { key: 'r', tex: 'r', min: 0, max: 2.5, step: 0.05 },
    { key: 'theta', tex: '\\theta', min: 0, max: 180, step: 1, unit: '°' },
    { key: 'psi', tex: '\\psi', min: 0, max: 359, step: 1, unit: '°' },
  ],
};

/** Slider values (angles in degrees) for a Cartesian point in the given mode. */
function toSliders(mode: Mode, p: Vec3): Record<string, number> {
  if (mode === 'cart') return { x: p[0], y: p[1], z: p[2] };
  if (mode === 'cyl') { const c = cartToCyl(p); return { rho: c.rho, phi: deg(c.phi), z: c.z }; }
  const s = cartToSph(p); return { r: s.r, theta: deg(s.theta), psi: deg(s.psi) };
}
function toCart(mode: Mode, s: Record<string, number>): Vec3 {
  if (mode === 'cart') return [s.x, s.y, s.z];
  if (mode === 'cyl') return cylToCart({ rho: s.rho, phi: rad(s.phi), z: s.z });
  return sphToCart({ r: s.r, theta: rad(s.theta), psi: rad(s.psi) });
}

/**
 * Interactive version of lecture Figs. 1.4/1.7 (Cartesian), 1.8/1.10 (cylindrical), 1.12 (spherical):
 * the point M, its construction lines, and the three coordinate lines through M.
 */
/** Demo motion M(t) for "Bewegung abspielen": a helix, ρ = 1.4, φ = 0.8 t, z = −1.2 + 0.3 t, for 0 ≤ t ≤ 8 s. */
export const MOTION_T = 8;
export const motionAt = (t: number): Vec3 => cylToCart({ rho: 1.4, phi: 0.8 * t, z: -1.2 + 0.3 * t });

/** Start view of the explorer: the lecture's orientation (Fig. 1.4: x down-right, y up-right), close enough to fill the canvas. */
export const EXPLORER_CAMERA: [number, number, number] = [4.0, -4.0, 4.6];
export const EXPLORER_TARGET: [number, number, number] = [0.3, 0.3, 0.6];
/** ψ gets its own colour (pink), clearly different from θ (purple), wherever both appear in one figure. */
export const PSI_COLOR = '#db2777';
/**
 * Start point of the explorer: ρ = 1.5 and the given φ, z. Chosen so that M does not sit on the y-axis label
 * (lesson koordinaten: φ = 40°, z = 1.7), and with the basis shown (lesson basen: φ = 70°, z = 1.5) so that
 * e_ρ and e_φ are both seen broadside (views12.test.ts).
 */
export const explorerStart = (phiDeg: number, z: number): Vec3 => cylToCart({ rho: 1.5, phi: rad(phiDeg), z });

/** Local basis at the point p in the given mode: [vector, colour, subscript]. On the z-axis only the vectors that stay defined are returned. */
export function localBasis(mode: Mode, p: Vec3): [Vec3, string, string][] {
  const cyl = cartToCyl(p), sph = cartToSph(p);
  const onAxis = cyl.rho < 0.03, atO = sph.r < 0.03;
  if (mode === 'cart') return [[[1, 0, 0], C.x, 'x'], [[0, 1, 0], C.y, 'y'], [[0, 0, 1], C.z, 'z']];
  if (mode === 'cyl') return onAxis ? [[[0, 0, 1], C.z, 'z']] // φ undefined: e_ρ, e_φ have no direction, e_z still does
    : [[eRho(cyl.phi), C.rho, 'ρ'], [ePhi(cyl.phi), C.angle, 'φ'], [[0, 0, 1], C.z, 'z']];
  if (atO) return [];
  return onAxis ? [[eR(sph.theta, sph.psi), C.r, 'r']] // ψ undefined: only e_r = ±e_z stays defined
    : [[eR(sph.theta, sph.psi), C.r, 'r'], [eTheta(sph.theta, sph.psi), C.angle, 'θ'], [ePsi(sph.psi), PSI_COLOR, 'ψ']];
}

/** A curve that can be drawn faint (the coordinate lines while the basis is shown). */
function Line3({ f, t0, t1, n = 96, color, width = 2, opacity = 1 }: { f: (t: number) => Vec3; t0: number; t1: number; n?: number; color: string; width?: number; opacity?: number }) {
  const pts = useMemo(() => Array.from({ length: n + 1 }, (_, i) => f(t0 + ((t1 - t0) * i) / n) as [number, number, number]), [f, t0, t1, n]);
  return <Line points={pts} color={color} lineWidth={width} transparent={opacity < 1} opacity={opacity} />;
}
const seg3 = (a: Vec3, b: Vec3) => (u: number): Vec3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];

/**
 * `basis`: also draw the local basis at M (lecture pp. 6–7): unit vectors tangent to the coordinate lines through M,
 * each in the colour of its coordinate line; in Cartesian mode the same basis is drawn at O as well. The coordinate
 * lines are then drawn faint, so the basis vectors on them stand out.
 * Without `basis`, the coordinates themselves are drawn as coloured lengths (x, y, z legs; ρ and z; r with θ, ψ).
 */
export function CoordinateExplorer({ initialMode = 'cyl', height = 420, basis = false, phiDeg = 40, z0 = 1.7 }: { initialMode?: Mode; height?: number; basis?: boolean; phiDeg?: number; z0?: number }) {
  const lang = useLang(), tr = useTr();
  const [figRef, full, toggleFull] = useFullscreen();
  const h = useFigureHeight(height, 320);
  const f2 = (x: number) => fmtNum(x, 2, lang, true); // inside TeX
  const f2h = (x: number) => fmtNum(x, 2, lang); // plain HTML
  const sep = tupleSep(lang);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [vals, setVals] = useState<Record<string, number>>(() => toSliders(initialMode, explorerStart(phiDeg, z0)));
  const [showLines, setShowLines] = useState(true);
  const [motionT, setMotionT] = useState<number | null>(null); // time of the demo motion, null = not playing
  const [trail, setTrail] = useState<Vec3[]>([]);
  const modeRef = useRef(mode); modeRef.current = mode;
  const p = toCart(mode, vals);

  // "Bewegung abspielen": M follows x = F_x(t), y = F_y(t), z = F_z(t); sliders and readouts follow live
  useEffect(() => {
    if (motionT === null) return;
    let raf = 0, last = performance.now(), t = motionT;
    const tick = (now: number) => {
      t = Math.min(MOTION_T, t + Math.min(now - last, 100) / 1000);
      last = now;
      const q = motionAt(t);
      setVals(toSliders(modeRef.current, q));
      setTrail((tr0) => [...tr0, q]);
      if (t >= MOTION_T) { setMotionT(null); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [motionT === null]); // eslint-disable-line react-hooks/exhaustive-deps
  const reducedMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const playMotion = () => {
    if (reducedMotion) { // no animation: show the whole trajectory and the end point at once
      const pts = Array.from({ length: 81 }, (_, i) => motionAt((MOTION_T * i) / 80));
      setTrail(pts); setVals(toSliders(mode, pts[pts.length - 1])); return;
    }
    setTrail([motionAt(0)]); setMotionT(0);
  };

  const switchMode = useCallback((m: Mode) => { setVals(toSliders(m, p)); setMode(m); }, [p]);

  const cyl = cartToCyl(p), sph = cartToSph(p);
  const noPhi = cyl.rho < 0.03, noTheta = sph.r < 0.03; // angles without meaning at this point
  const Mxy: Vec3 = [p[0], p[1], 0];
  const Mx: Vec3 = [p[0], 0, 0];

  // Coordinate lines through M: vary one coordinate, freeze the other two.
  const lines = useMemo(() => {
    const L = 2.6;
    if (mode === 'cart') return [
      { f: (t: number): Vec3 => [t, p[1], p[2]], t0: -L, t1: L, c: C.x, name: tr(<><M>x</M>-Linie</>, <><M>x</M>-line</>) },
      { f: (t: number): Vec3 => [p[0], t, p[2]], t0: -L, t1: L, c: C.y, name: tr(<><M>y</M>-Linie</>, <><M>y</M>-line</>) },
      { f: (t: number): Vec3 => [p[0], p[1], t], t0: -L, t1: L, c: C.z, name: tr(<><M>z</M>-Linie</>, <><M>z</M>-line</>) },
    ];
    if (mode === 'cyl') return [
      { f: (t: number) => cylToCart({ rho: t, phi: cyl.phi, z: p[2] }), t0: 0, t1: L, c: C.rho, name: tr(<><M>\rho</M>-Linie (Strahl <M>\perp</M> <M>z</M>-Achse)</>, <><M>\rho</M>-line (ray <M>\perp</M> <M>z</M>-axis)</>) },
      { f: (t: number) => cylToCart({ rho: cyl.rho, phi: t, z: p[2] }), t0: 0, t1: 2 * Math.PI, c: C.angle, name: tr(<><M>\varphi</M>-Linie (Kreis)</>, <><M>\varphi</M>-line (circle)</>) },
      { f: (t: number) => cylToCart({ rho: cyl.rho, phi: cyl.phi, z: t }), t0: -L, t1: L, c: C.z, name: tr(<><M>z</M>-Linie (vertikal)</>, <><M>z</M>-line (vertical)</>) },
    ];
    return [
      { f: (t: number) => sphToCart({ r: t, theta: sph.theta, psi: sph.psi }), t0: 0, t1: L, c: C.r, name: tr(<><M>r</M>-Linie (Strahl von <M p=")">O</M></>, <><M>r</M>-line (ray from <M p=")">O</M></>) },
      { f: (t: number) => sphToCart({ r: sph.r, theta: t, psi: sph.psi }), t0: 0, t1: Math.PI, c: C.angle, name: tr(<><M>\theta</M>-Linie (Meridian)</>, <><M>\theta</M>-line (meridian)</>) },
      { f: (t: number) => sphToCart({ r: sph.r, theta: sph.theta, psi: t }), t0: 0, t1: 2 * Math.PI, c: PSI_COLOR, name: tr(<><M>\psi</M>-Linie (Breitenkreis)</>, <><M>\psi</M>-line (circle of latitude)</>) },
    ];
  }, [mode, lang, p[0], p[1], p[2]]); // eslint-disable-line react-hooks/exhaustive-deps

  const azimuth = mode === 'sph' ? sph.psi : cyl.phi;
  const E = basis ? localBasis(mode, p) : [];
  const arcR = 0.45;
  // label directions at M: outward (away from the z-axis) and "clockwise" (−e_φ), so labels sit beside the lines through M
  const out: Vec3 = noPhi ? [0.7, -0.7, 0] : eRho(cyl.phi), side: Vec3 = noPhi ? [0.7, 0.7, 0] : scale(-1, ePhi(cyl.phi));
  const seg = !basis; // coloured coordinate lengths (not while the basis is shown: then the basis is the topic)
  const lineOpacity = basis ? 0.35 : 1, lineWidth = basis ? 1.4 : 2;
  return (
    <figure className={`explorer${full ? ' is-full' : ''}`} ref={figRef}>
      <div className="tabs" role="tablist">
          {(['cart', 'cyl', 'sph'] as Mode[]).map((m) => (
            <button key={m} role="tab" aria-selected={mode === m} className={mode === m ? 'active' : ''} onClick={() => switchMode(m)}>
              {{ cart: tr('Kartesisch', 'Cartesian'), cyl: tr('Zylindrisch', 'Cylindrical'), sph: tr('Sphärisch', 'Spherical') }[m]}
            </button>
          ))}
      </div>
      <div className="stage">
      <Scene height={full ? '100%' : h} camera={EXPLORER_CAMERA} target={EXPLORER_TARGET}>
        {trail.length > 1 && <Curve f={(u) => trail[Math.min(trail.length - 1, Math.round(u))]} t0={0} t1={trail.length - 1} n={trail.length - 1} color={C.path} width={2} />}
        <Axes />
        {showLines && lines.map((l, i) => <Line3 key={`${mode}-${i}`} f={l.f} t0={l.t0} t1={l.t1} color={l.c} width={lineWidth} opacity={lineOpacity} />)}
        {/* construction: the projection M_xy */}
        <Dashed pts={[p, Mxy]} />
        {(mode !== 'cyl' || !seg) && <Dashed pts={[[0, 0, 0], Mxy]} />}
        <Dot at={Mxy} color={C.construct} r={0.03} />
        <Label at={add(Mxy, [0.3 * out[0] + 0.1 * side[0], 0.3 * out[1] + 0.1 * side[1], -0.12])} color={C.axis} sub="xy">M</Label>
        {/* the coordinates as coloured lengths */}
        {seg && mode === 'cart' && (<>
          <Line3 f={seg3([0, 0, 0], Mx)} t0={0} t1={1} n={1} color={C.x} width={4.5} />
          <Line3 f={seg3(Mx, Mxy)} t0={0} t1={1} n={1} color={C.y} width={4.5} />
          <Line3 f={seg3(Mxy, p)} t0={0} t1={1} n={1} color={C.z} width={4.5} />
          {Math.abs(p[0]) > 0.25 && <Label at={[p[0] / 2, -0.2 * (Math.sign(p[1]) || 1), 0]} color={C.x}>x</Label>}
          {Math.abs(p[1]) > 0.25 && <Label at={[p[0] + 0.2 * (Math.sign(p[0]) || 1), p[1] / 2, 0]} color={C.y}>y</Label>}
          {Math.abs(p[2]) > 0.25 && <Label at={add([p[0], p[1], p[2] / 2], scale(0.2, side))} color={C.z}>z</Label>}
        </>)}
        {seg && mode === 'cyl' && (<>
          {cyl.rho > 0.02 && <Line3 f={seg3([0, 0, 0], Mxy)} t0={0} t1={1} n={1} color={C.rho} width={4.5} />}
          {Math.abs(p[2]) > 0.02 && <Line3 f={seg3(Mxy, p)} t0={0} t1={1} n={1} color={C.z} width={4.5} />}
          {cyl.rho > 0.35 && <Label at={add(scale(0.55, Mxy), scale(0.2, side))} color={C.rho}>ρ</Label>}
          {Math.abs(p[2]) > 0.3 && <Label at={add([p[0], p[1], p[2] / 2], scale(0.2, side))} color={C.z}>z</Label>}
        </>)}
        {mode === 'sph' && !noTheta && (
          <Arrow to={p} color={basis ? C.construct : C.r} width={basis ? 1.5 : 3} />
        )}
        {seg && mode === 'sph' && sph.r > 0.35 && <Label at={add(scale(0.55, p), scale(0.2, side))} color={C.r}>r</Label>}
        {mode === 'cyl' && basis && !noTheta && <Arrow to={p} color={C.r} width={1.5} />}
        <Dot at={p} />
        <Label at={add(p, [0.2 * side[0] - 0.08 * out[0], 0.2 * side[1] - 0.08 * out[1], 0.2])} color={C.point}>M</Label>
        {/* angles */}
        {mode !== 'cart' && !noPhi && (
          <>
            <Curve f={(t) => [arcR * Math.cos(t), arcR * Math.sin(t), 0]} t0={0} t1={azimuth} color={mode === 'sph' ? PSI_COLOR : C.angle} width={2.5} />
            <Label at={[0.78 * Math.cos(azimuth / 2), 0.78 * Math.sin(azimuth / 2), 0]} color={mode === 'sph' ? PSI_COLOR : C.angle}>{mode === 'sph' ? 'ψ' : 'φ'}</Label>
          </>
        )}
        {mode === 'sph' && !noTheta && (
          <>
            <Curve f={(t) => sphToCart({ r: 0.6, theta: t, psi: sph.psi })} t0={0} t1={sph.theta} color={C.angle} width={2.5} />
            <Label at={sphToCart({ r: 0.9, theta: sph.theta / 2, psi: sph.psi })} color={C.angle}>θ</Label>
          </>
        )}
        {/* local basis at M (and, in Cartesian mode, the same basis at O) */}
        {E.map(([e, c, sub]) => (
          <group key={sub}>
            <Arrow from={p} to={add(p, e)} color={c} width={4} />
            <Label at={add(p, [e[0] * 1.24, e[1] * 1.24, e[2] * 1.24 + 0.04])} color={c} vec sub={sub}>e</Label>
            {mode === 'cart' && <><Arrow to={e} color={c} width={4} /><Label at={[e[0] * 1.2 - 0.1 * e[2], e[1] * 1.2 - 0.1 * e[2], e[2] * 1.15]} color={c} vec sub={sub}>e</Label></>}
          </group>
        ))}
      </Scene>
      <FullscreenButton full={full} onClick={toggleFull} />
      </div>
      <div className="side">
      <div className="controls">
        {SLIDERS[mode].map((s) => (
          <label key={s.key} className="slider">
            <M>{s.tex}</M>
            <input type="range" min={s.min} max={s.max} step={s.step} value={vals[s.key]}
              onChange={(e) => { setMotionT(null); setVals({ ...vals, [s.key]: Number(e.target.value) }); }} aria-label={s.key} />
            <span className="val">{s.unit ? `${Math.round(vals[s.key])}${s.unit}` : f2h(vals[s.key])}</span>
          </label>
        ))}
        <div className="motion-row">
          <button type="button" className="motion-btn" onClick={motionT === null ? playMotion : () => setMotionT(null)}>
            {motionT === null ? tr('Bewegung abspielen', 'Play a motion') : tr('Anhalten', 'Stop')}
          </button>
          {(motionT !== null || trail.length > 1) && <span className="motion-note">{tr(<>Bahnkurve von <M p=":">M</M> die drei Koordinaten ändern sich mit der Zeit <M p=".">t</M></>, <>Trajectory of <M p=":">M</M> all three coordinates change with time <M p=".">t</M></>)}</span>}
        </div>
        <label className="toggle"><input type="checkbox" checked={showLines} onChange={(e) => setShowLines(e.target.checked)} /> {tr(<>Koordinatenlinien durch <M>M</M></>, <>coordinate lines through <M>M</M></>)}</label>
        {basis && E.length > 0 && (
          <ul className="legend">
            {E.map(([, c, sub]) => <li key={sub}><span className="swatch" style={{ background: c }} /><M>{`\\underline{e}_{${{ 'ρ': '\\rho', 'φ': '\\varphi', 'θ': '\\theta', 'ψ': '\\psi' }[sub] ?? sub}}`}</M>&nbsp;{tr('tangential an die', 'tangent to the')} <M>{{ 'ρ': '\\rho', 'φ': '\\varphi', 'θ': '\\theta', 'ψ': '\\psi' }[sub] ?? sub}</M>-{tr('Linie', 'line')}</li>)}
          </ul>
        )}
        {showLines && (
          <ul className="legend">
            {lines.map((l, i) => <li key={i}><span className="swatch" style={{ background: l.c }} />{l.name}</li>)}
          </ul>
        )}
      </div>
      <figcaption>
        <table className="readout">
          <tbody>
            <tr><th>{tr('Kartesisch', 'Cartesian')}</th><td><M>{`(x,y,z) = (${f2(p[0])}${sep}${f2(p[1])}${sep}${f2(p[2])})`}</M></td></tr>
            <tr><th>{tr('Zylindrisch', 'Cylindrical')}</th><td><M>{`(\\rho,\\varphi,z) = (${f2(cyl.rho)}${sep}${noPhi ? '\\text{–}' : `${deg(cyl.phi).toFixed(0)}^\\circ`}${sep}${f2(cyl.z)})`}</M></td></tr>
            <tr><th>{tr('Sphärisch', 'Spherical')}</th><td><M>{`(r,\\theta,\\psi) = (${f2(sph.r)}${sep}${noTheta ? '\\text{–}' : `${deg(sph.theta).toFixed(0)}^\\circ`}${sep}${noPhi ? '\\text{–}' : `${deg(sph.psi).toFixed(0)}^\\circ`})`}</M></td></tr>
          </tbody>
        </table>
        {noTheta ? <p className="warn">{tr(<><M p=":">{'M = O'}</M> auch <M>\theta</M> ist hier nicht definiert (wie <M>\varphi</M> und <M p=").">\psi</M></>, <><M p=":">{'M = O'}</M> here <M>\theta</M> is undefined too (like <M>\varphi</M> and <M p=").">\psi</M></>)}</p> : null}
        {!noTheta && cyl.rho < 0.03 && <p className="warn">{tr(<><M>M</M> liegt auf der <M>z</M>-Achse: <M>\varphi</M> und <M>\psi</M> sind hier nicht definiert (jeder Winkel beschreibt denselben Punkt).</>, <><M>M</M> is on the <M>z</M>-axis: <M>\varphi</M> and <M>\psi</M> are undefined here (every angle describes the same point).</>)}</p>}
      </figcaption>
      </div>
    </figure>
  );
}
