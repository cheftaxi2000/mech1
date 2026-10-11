import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Scene } from './Scene';
import { Arrow, Axes, C, Curve, Dashed, Dot, Label } from './primitives';
import { cartToCyl, cartToSph, cylToCart, sphToCart } from '../physics/coords';
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
type FsEl = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type FsDoc = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => Promise<void> | void };

/**
 * Fullscreen for a figure ("wie bei Netflix"): the browser's Fullscreen API where it is allowed, otherwise
 * (iPhone Safari, an iframe without allowfullscreen) a fixed overlay that covers the whole viewport.
 * Esc leaves both.
 */
function useFullscreen() {
  const ref = useRef<HTMLElement>(null);
  const [full, setFull] = useState(false);
  const native = useRef(false);
  useEffect(() => {
    const d = document as FsDoc;
    const on = () => {
      const isNative = (d.fullscreenElement ?? d.webkitFullscreenElement) === ref.current && !!ref.current;
      if (native.current && !isNative) { native.current = false; setFull(false); }
    };
    document.addEventListener('fullscreenchange', on);
    document.addEventListener('webkitfullscreenchange', on);
    return () => { document.removeEventListener('fullscreenchange', on); document.removeEventListener('webkitfullscreenchange', on); };
  }, []);
  useEffect(() => {
    if (!full || native.current) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setFull(false); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', key);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', key); };
  }, [full]);
  const toggle = useCallback(async () => {
    const d = document as FsDoc, el = ref.current as FsEl | null;
    if (full) {
      setFull(false);
      if (native.current) { native.current = false; try { await (d.exitFullscreen?.() ?? d.webkitExitFullscreen?.()); } catch { /* already left */ } }
      return;
    }
    setFull(true);
    const req = el?.requestFullscreen?.bind(el) ?? el?.webkitRequestFullscreen?.bind(el);
    if (req && (document.fullscreenEnabled ?? true)) {
      try { await req(); native.current = true; } catch { /* not allowed here: the CSS overlay stays */ }
    }
  }, [full]);
  return [ref, full, toggle] as const;
}

/** Demo motion M(t) for "Bewegung abspielen": a helix, ρ = 1.4, φ = 0.8 t, z = −1.2 + 0.3 t, for 0 ≤ t ≤ 8 s. */
export const MOTION_T = 8;
export const motionAt = (t: number): Vec3 => cylToCart({ rho: 1.4, phi: 0.8 * t, z: -1.2 + 0.3 * t });

export function CoordinateExplorer({ initialMode = 'cyl', height = 420 }: { initialMode?: Mode; height?: number }) {
  const lang = useLang(), tr = useTr();
  const [figRef, full, toggleFull] = useFullscreen();
  const f2 = (x: number) => fmtNum(x, 2, lang, true); // inside TeX
  const f2h = (x: number) => fmtNum(x, 2, lang); // plain HTML
  const sep = tupleSep(lang);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [vals, setVals] = useState<Record<string, number>>(() => toSliders(initialMode, cylToCart({ rho: 1.5, phi: rad(40), z: 1.2 })));
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
      { f: (t: number) => sphToCart({ r: sph.r, theta: sph.theta, psi: t }), t0: 0, t1: 2 * Math.PI, c: C.angle2, name: tr(<><M>\psi</M>-Linie (Breitenkreis)</>, <><M>\psi</M>-line (circle of latitude)</>) },
    ];
  }, [mode, lang, p[0], p[1], p[2]]); // eslint-disable-line react-hooks/exhaustive-deps

  const azimuth = mode === 'sph' ? sph.psi : cyl.phi;
  const arcR = 0.45;

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
      <Scene height={full ? '100%' : height}>
        {trail.length > 1 && <Curve f={(u) => trail[Math.min(trail.length - 1, Math.round(u))]} t0={0} t1={trail.length - 1} n={trail.length - 1} color={C.path} width={2} />}
        <Axes />
        <Dot at={p} />
        <Label at={[p[0], p[1], p[2] + 0.18]} color={C.point}>M</Label>
        {/* Construction: projection M_xy and its links */}
        <Dashed pts={[p, Mxy]} />
        <Dashed pts={[[0, 0, 0], Mxy]} />
        <Dot at={Mxy} color={C.construct} r={0.03} />
        <Label at={[Mxy[0], Mxy[1], -0.17]} color={C.axis} sub="xy">M</Label>
        {mode === 'cart' && (<>
          <Dashed pts={[Mxy, [p[0], 0, 0]]} /><Dashed pts={[Mxy, [0, p[1], 0]]} />
        </>)}
        {mode === 'sph' && <Arrow to={p} color={C.r} width={1.5} />}
        {mode !== 'cart' && cyl.rho > 0.05 && (
          <>
            <Curve f={(t) => [arcR * Math.cos(t), arcR * Math.sin(t), 0]} t0={0} t1={azimuth} color={mode === 'sph' ? C.angle2 : C.angle} width={2} />
            <Label at={[0.8 * Math.cos(azimuth / 2), 0.8 * Math.sin(azimuth / 2), 0]} color={mode === 'sph' ? C.angle2 : C.angle}>{mode === 'sph' ? 'ψ' : 'φ'}</Label>
          </>
        )}
        {mode === 'sph' && sph.r > 0.05 && (
          <>
            <Curve f={(t) => sphToCart({ r: 0.55, theta: t, psi: sph.psi })} t0={0} t1={sph.theta} color={C.angle} width={2} />
            <Label at={sphToCart({ r: 0.85, theta: sph.theta / 2, psi: sph.psi })} color={C.angle}>θ</Label>
          </>
        )}
        {showLines && lines.map((l, i) => <Curve key={i} f={l.f} t0={l.t0} t1={l.t1} color={l.c} />)}
      </Scene>
      <button type="button" className="fs-btn" onClick={toggleFull} aria-label={full ? tr('Vollbild beenden', 'Exit fullscreen') : tr('Vollbild', 'Fullscreen')} title={full ? tr('Vollbild beenden (Esc)', 'Exit fullscreen (Esc)') : tr('Vollbild', 'Fullscreen')}>
        <svg viewBox="0 0 24 24" aria-hidden="true">{full
          ? <path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6" />
          : <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />}</svg>
      </button>
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
