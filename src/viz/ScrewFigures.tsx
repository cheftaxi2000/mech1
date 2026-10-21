import { useEffect, useMemo, useState } from 'react';
import { M } from '../components/Tex';
import { fmtNum, tupleSep, useLang, useTr } from '../i18n';
import { rigidVelocity } from '../physics/rigid';
import { screwPosition, vOmegaPart, vOmegaSigned, vPerpPart } from '../physics/screw';
import { type Vec3, add, cross, norm, scale, sub } from '../physics/vec';
import { Scene } from './Scene';
import { ScrewBody } from './anim/ScrewAnim';
import { CAM_CLOSE, CAM_WIDE } from './anim/screwFrame';
import { DrawFrame, type DrawList } from './screwDraw';
import { SG, SG_AXIS, SG_VERTS, SG_VPERP } from './screwGeom';
import type { LabelPart } from './RichLabel';
import { FullscreenButton, useFullscreen } from './useFullscreen';
import { useFigureHeight } from './useNarrow';

const t = String.raw;
type P3 = [number, number, number];
const ul = (s: string, sub?: string, sup?: string): LabelPart => ({ t: s, u: true, sub, sup });
const { B, vB, omega, KV, KW, box } = SG;
const W_OFF: Vec3 = [0, 0.34, 0]; // ω is drawn just beside the point (a free vector), so v_ω on the point stays visible

/** Pure content of the invariants explorer (tested): the Kinemate in B, and at P the copy of ω and v_P = v_ω + v_P^⊥. */
export function invariantScene(P: Vec3, all: boolean): DrawList & { vP: Vec3; vw: number; vperp: number } {
  const d: DrawList = { arrows: [], lines: [], dots: [], labels: [] };
  const vt = (Q: Vec3, v: Vec3) => add(Q, scale(KV, v));
  const vP = rigidVelocity(vB, omega, B, P), vwP = vOmegaPart(vP, omega), vpP = vPerpPart(vP, omega);
  // the Kinemate in B
  d.arrows.push({ key: 'vB', from: B, to: vt(B, vB), col: 'v', w: 3.2 });
  d.arrows.push({ key: 'wB', from: add(B, W_OFF), to: add(add(B, W_OFF), scale(KW, omega)), col: 'omega', w: 5 });
  d.dots.push({ key: 'B', at: B, col: 'v', r: 0.045 });
  d.labels.push({ key: 'B', at: add(B, [0.12, 0.12, -0.13]), parts: [{ t: 'B' }], col: 'v' });
  d.labels.push({ key: 'vB', at: add(vt(B, vB), [0, 0.04, 0.13]), parts: [ul('v', 'B')], col: 'v' });
  d.labels.push({ key: 'wB', at: add(add(B, W_OFF), [0, 0.1, KW + 0.1]), parts: [ul('ω')], col: 'omega' });
  // the split at B too (faint), so the blue v_ω at P can be compared with the one at B: same arrow
  d.arrows.push({ key: 'vwB', from: B, to: vt(B, vOmegaPart(vB, omega)), col: 'vw', w: 3, o: 0.55 });
  d.arrows.push({ key: 'vpB', from: B, to: vt(B, vPerpPart(vB, omega)), col: 'perp', w: 2.6, o: 0.45 });
  // every corner (toggle): the full velocity faint, its part along ω blue — all blue arrows are the same
  if (all) SG_VERTS.forEach((Q, i) => {
    const v = rigidVelocity(vB, omega, B, Q);
    d.arrows.push({ key: `c${i}`, from: Q, to: vt(Q, v), col: 'v', w: 1.6, o: 0.45 });
    d.arrows.push({ key: `cw${i}`, from: Q, to: vt(Q, vOmegaPart(v, omega)), col: 'vw', w: 3 });
  });
  // at P: ω′ = ω, and v_P split into v_ω (blue, along ω) and v_P^⊥ (orange)
  const near = norm(sub(P, B)) < 0.05;
  if (!near) {
    d.arrows.push({ key: 'wP', from: add(P, W_OFF), to: add(add(P, W_OFF), scale(KW, omega)), col: 'omega', w: 5 });
    d.labels.push({ key: 'wP', at: add(add(P, W_OFF), [0, 0.1, KW + 0.1]), parts: [ul('ω', undefined, '′')], col: 'omega' });
    d.arrows.push({ key: 'vP', from: P, to: vt(P, vP), col: 'v', w: 3.2 });
    d.arrows.push({ key: 'vwP', from: P, to: vt(P, vwP), col: 'vw', w: 4 });
    if (norm(vpP) * KV > 0.03) {
      d.arrows.push({ key: 'vpP', from: P, to: vt(P, vpP), col: 'perp', w: 4 });
      d.lines.push({ key: 'par1', pts: [vt(P, vwP), vt(P, vP)], col: 'muted', w: 1.1, dashed: true });
      d.lines.push({ key: 'par2', pts: [vt(P, vpP), vt(P, vP)], col: 'muted', w: 1.1, dashed: true });
      d.labels.push({ key: 'vpP', at: add(vt(P, vpP), scale(0.16 / Math.max(1e-9, norm(vpP)), vpP)), parts: [ul('v', 'P', '⊥')], col: 'perp' });
    }
    d.dots.push({ key: 'P', at: P, col: 'v', r: 0.045 });
    d.labels.push({ key: 'P', at: add(P, [0.13, 0.13, -0.14]), parts: [{ t: 'P' }], col: 'v' });
    d.labels.push({ key: 'vwP', at: add(vt(P, vwP), [0, -0.16, 0.06]), parts: [ul('v', 'ω')], col: 'vw' });
  }
  return { ...d, vP, vw: vOmegaSigned(vP, omega), vperp: norm(vpP) };
}

/**
 * Lecture p. 24, «Wie verändert sich die Kinemate je nach Ort?»: a body with a fixed Kinemate {v_B, ω}. The student moves
 * P through the body; at P the same ω is drawn (1st invariant) and v_P is split into its part along ω (blue — the
 * same at every point: 2nd invariant) and the part perpendicular to ω (orange — it changes from point to point).
 */
export function InvariantExplorer() {
  const tr = useTr(), lang = useLang();
  const [ref, full, toggleFull] = useFullscreen();
  const h = useFigureHeight(420, 340);
  const [along, setAlong] = useState(-0.5);
  const [across, setAcross] = useState(0.45);
  const [height, setHeight] = useState(0);
  const [all, setAll] = useState(false);
  const P: Vec3 = [across, along, height];
  const sc = invariantScene(P, all);
  const n = (x: number, d = 2) => fmtNum(x, d, lang, true);
  const sl = (label: string, v: number, set: (x: number) => void, lo: number, hi: number, aria: string) => (
    <label className="slider text-label"><span>{label}</span>
      <input type="range" min={lo} max={hi} step={0.01} value={v} onChange={(e) => set(Number(e.target.value))} aria-label={aria} />
      <span className="val">{fmtNum(v, 2, lang)}</span></label>
  );
  return (
    <figure className={`explorer${full ? ' is-full' : ''}`} ref={ref}>
      <div className="stage">
        <Scene height={full ? '100%' : h} camera={CAM_CLOSE.pos as P3} target={CAM_CLOSE.target as P3}>
          <ScrewBody angle={0} shift={[0, 0, 0]} />
          <DrawFrame f={sc} />
        </Scene>
        <FullscreenButton full={full} onClick={toggleFull} />
      </div>
      <div className="side">
        <div className="controls">
          <p className="za-panel-title">{tr(<>Punkt <M>P</M> im Körper verschieben</>, <>Move the point <M>P</M> through the body</>)}</p>
          {sl(tr('längs', 'along'), along, setAlong, box.y[0], box.y[1], tr('P längs', 'P along'))}
          {sl(tr('quer', 'across'), across, setAcross, box.x[0], box.x[1], tr('P quer', 'P across'))}
          {sl(tr('Höhe', 'height'), height, setHeight, box.z[0], box.z[1], tr('P Höhe', 'P height'))}
          <div className="v-presets za-left">
            <button type="button" onClick={() => { setAlong(B[1]); setAcross(B[0]); setHeight(B[2]); }}>{tr(<><M>P</M> auf <M>B</M></>, <><M>P</M> onto <M>B</M></>)}</button>
          </div>
          <label className="toggle"><input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} />{' '}{tr('Geschwindigkeiten aller Ecken', 'velocities of all corners')}</label>
        </div>
        <figcaption>
          <div className="v-result rt-readout pos"><M>{t`\v\omega' = \v\omega`}</M><b className="tr-chip">{tr('1. Invariante', '1st invariant')}</b></div>
          <div className="v-result rt-readout pos za-gap"><M>{`\\v v_P\\cdot\\v e_\\omega = ${n(sc.vw)} = \\v v_B\\cdot\\v e_\\omega`}</M><b className="tr-chip">{tr('2. Invariante', '2nd invariant')}</b></div>
          <div className="v-result rt-readout za-gap"><M>{`|\\v v_P^\\perp| = ${n(sc.vperp)}`}</M><M>{`|\\v v_P| = ${n(norm(sc.vP))}`}</M><span className="za-muted">{tr('ändern sich', 'they change')}</span></div>
          <p className="vdemo-note">{tr(
            <>Violett: <M>{t`\v\omega`}</M> in <M>B</M> und in <M p=".">P</M> Blau: der Teil der Geschwindigkeit entlang <M p=",">{t`\v\omega`}</M> orange: der Teil senkrecht dazu. Wohin du <M>P</M> auch schiebst – der blaue Pfeil bleibt gleich. Schiebst du <M>P</M> nur in der Höhe (entlang <M p=")">{t`\v\omega`}</M> ändert sich gar nichts.</>,
            <>Purple: <M>{t`\v\omega`}</M> at <M>B</M> and at <M p=".">P</M> Blue: the part of the velocity along <M p=";">{t`\v\omega`}</M> orange: the part perpendicular to it. Wherever you move <M p=",">P</M> the blue arrow stays the same. If you only change the height of <M>P</M> (along <M p="),">{t`\v\omega`}</M> nothing changes at all.</>)}</p>
        </figcaption>
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------------------------------------ */
export type ScrewMode = 'screw' | 'rot' | 'trans';
export const SCREW_MODES: Record<ScrewMode, { de: string; en: string }> = {
  screw: { de: 'Schraube', en: 'screw' },
  rot: { de: 'Rotation', en: 'rotation' },
  trans: { de: 'Translation', en: 'translation' },
};
/** duration of the motion shown: one full turn (2π/ω); for the translation (ω = 0) a time that keeps the body in view */
const T_TRANS = 2;

/**
 * Pure content of the screw explorer (tested): the Kinemate in B for the chosen case, the pose of the body after the
 * fraction u of the motion shown, the paths of B and Z, faint copies every quarter turn.
 */
export function screwExplorerScene(mode: ScrewMode, p: number, u: number) {
  const w: Vec3 = mode === 'trans' ? [0, 0, 0] : omega;
  const vBm: Vec3 = mode === 'trans' ? vB : add(SG_VPERP, [0, 0, mode === 'rot' ? 0 : p]);
  const T = mode === 'trans' ? T_TRANS : (2 * Math.PI) / norm(omega);
  const time = u * T;
  const Z = SG_AXIS.point;
  const pose = (tt: number) => mode === 'trans'
    ? { angle: 0, shift: scale(tt, vBm) }
    : { angle: norm(w) * tt, shift: scale(tt, vOmegaPart(vBm, w)) };
  const d: DrawList = { arrows: [], lines: [], dots: [], labels: [] };
  const vt = (Q: Vec3, v: Vec3) => add(Q, scale(KV, v));
  const zLo: Vec3 = [Z[0], Z[1], -0.62], zHi: Vec3 = [Z[0], Z[1], 2.0];
  if (mode !== 'trans') {
    d.lines.push({ key: 'zeta', pts: [zLo, zHi], col: 'zeta', w: 4, o: 0.85 });
    d.labels.push({ key: 'zeta', at: add(zHi, [0, -0.12, 0.02]), parts: [{ t: 'ζ' }], col: 'zeta' });
    const w0: Vec3 = [Z[0], Z[1], -0.6];
    d.arrows.push({ key: 'omega', from: w0, to: add(w0, scale(0.5, w)), col: 'omega', w: 5 });
    d.labels.push({ key: 'omega', at: add(w0, [0, 0.2, 0.12]), parts: [ul('ω')], col: 'omega' });
  }
  const now = pose(time);
  // a translation has no central axis: then only B (no point Z, no teal ζ-coloured path)
  const tracked = mode === 'trans' ? ([['B', B, 'v']] as const) : ([['B', B, 'v'], ['Z', Z, 'zeta']] as const);
  for (const [key, p0, col] of tracked) {
    const n = Math.max(2, Math.round(160 * u));
    const pts = Array.from({ length: n + 1 }, (_, i) => screwPosition(B, vBm, w, p0, (time * i) / n));
    if (u > 0.005) d.lines.push({ key: `trail${key}`, pts, col, w: 2.4, o: 0.9 });
    const at = pts[pts.length - 1];
    d.dots.push({ key, at, col, r: 0.045 });
    // v = v_ω + ω × ZP with Z where it is now (it moved along ζ); for the translation v = v_B everywhere
    const vv = mode === 'trans' ? vBm : add(vOmegaPart(vBm, w), cross(w, sub(at, add(Z, now.shift))));
    d.arrows.push({ key: `v${key}`, from: at, to: vt(at, vv), col: key === 'Z' && mode !== 'trans' ? 'vw' : 'v', w: 3 });
    d.labels.push({ key, at: add(at, key === 'B' ? [0, 0, -0.17] : [0.12, -0.12, -0.13]), parts: [{ t: key }], col });
  }
  const ghosts = [0, 1, 2, 3].filter((j) => j / 4 <= u - 0.02).map((j) => pose((j / 4) * T));
  return { ...d, pose: now, ghosts, vB: vBm, omega: w, T };
}

/**
 * Lecture p. 25, Spezialfälle: play the motion that belongs to a Kinemate (kept constant): a screw about ζ, a pure
 * rotation (v_B ⊥ ω: no sliding, ζ is the rotation axis), a translation (ω = 0: no axis, straight parallel paths).
 * The pitch slider sets v_ω = p ω (v_B^⊥ and therefore ζ stay the same).
 */
export function ScrewExplorer() {
  const tr = useTr(), lang = useLang();
  const [ref, full, toggleFull] = useFullscreen();
  const h = useFigureHeight(440, 340);
  const [mode, setMode] = useState<ScrewMode>('screw');
  const [p, setP] = useState(0.25);
  const [u, setU] = useState(0.62);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (!play) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000; last = now;
      setU((x) => { const y = x + dt / 9; if (y >= 1) { setPlay(false); return 1; } return y; });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play]);
  const sc = useMemo(() => screwExplorerScene(mode, p, u), [mode, p, u]);
  const pitch = mode === 'screw' ? p : 0;
  const n = (x: number, d = 2) => fmtNum(x, d, lang, true);
  const tup = (v: Vec3) => `(${v.map((c) => n(c)).join(tupleSep(lang))})`;
  const start = () => { if (u >= 0.999) setU(0); setPlay((x) => !x); };
  const chip = mode === 'trans' ? tr('Translation – keine Achse', 'translation – no axis')
    : Math.abs(pitch) < 1e-9 ? tr(<>Rotation um <M p=":">\zeta</M> kein <M>{t`\v v_\omega`}</M></>, <>rotation about <M p=":">\zeta</M> no <M>{t`\v v_\omega`}</M></>)
    : tr(<>Schraube um <M>\zeta</M></>, <>screw about <M>\zeta</M></>);
  return (
    <figure className={`explorer${full ? ' is-full' : ''}`} ref={ref}>
      <div className="stage">
        <Scene height={full ? '100%' : h} camera={CAM_WIDE.pos as P3} target={CAM_WIDE.target as P3}>
          {/* a negative pitch screws the body downwards: lift the whole picture by half its travel so it stays in view */}
          <group position={[0, 0, -0.5 * Math.min(0, 2 * Math.PI * pitch)]}>
          {sc.ghosts.map((g, i) => <ScrewBody key={i} angle={g.angle} shift={g.shift} ghost />)}
          <ScrewBody angle={sc.pose.angle} shift={sc.pose.shift} />
          <DrawFrame f={sc} />
          </group>
        </Scene>
        <FullscreenButton full={full} onClick={toggleFull} />
      </div>
      <div className="side">
        <div className="controls">
          <div className="v-presets">
            {(Object.keys(SCREW_MODES) as ScrewMode[]).map((m) => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => { setMode(m); if (m === 'screw' && Math.abs(p) < 0.02) setP(0.25); }}>{tr(SCREW_MODES[m].de, SCREW_MODES[m].en)}</button>
            ))}
          </div>
          <label className="slider text-label"><span>{tr('Steigung', 'pitch')} <M>p</M></span>
            <input type="range" min={-0.4} max={0.4} step={0.01} value={pitch} disabled={mode !== 'screw'}
              onChange={(e) => setP(Number(e.target.value))} aria-label={tr('Steigung p', 'pitch p')} />
            <span className="val">{fmtNum(pitch, 2, lang)}</span></label>
          <label className="slider text-label"><span>{tr('Zeit', 'time')}</span>
            <input type="range" min={0} max={100} step={1} value={Math.round(u * 100)} onChange={(e) => { setPlay(false); setU(Number(e.target.value) / 100); }} aria-label={tr('Zeit', 'time')} />
            <span className="val">{Math.round(u * 100)} %</span></label>
          <div className="motion-row">
            <button type="button" className="motion-btn" onClick={start}>{play ? tr('Anhalten', 'Stop') : tr('Bewegung abspielen', 'Play the motion')}</button>
          </div>
        </div>
        <figcaption>
          <div className={`v-result rt-readout ${mode === 'trans' ? '' : 'pos'}`}><b className="tr-chip">{chip}</b></div>
          <div className="v-result rt-readout za-gap">
            <M>{`\\v v_B = ${tup(sc.vB)}`}</M><M>{`\\v\\omega = ${tup(sc.omega)}`}</M>
          </div>
          {mode !== 'trans' && <div className="v-result rt-readout za-gap">
            <M>{`v_\\omega = p\\,\\omega = ${n(pitch)}`}</M><M>{`2\\pi p = ${n(2 * Math.PI * pitch)}`}</M>
          </div>}
          <p className="vdemo-note">{mode === 'trans'
            ? tr(<>Mit <M>{t`\v\omega = \v 0`}</M> gibt es keine Zentralachse: Alle Punkte haben dieselbe Geschwindigkeit <M>{t`\v v_B`}</M> und laufen auf parallelen, gleich langen Geraden.</>,
              <>With <M>{t`\v\omega = \v 0`}</M> there is no central axis: all points have the same velocity <M>{t`\v v_B`}</M> and move along parallel straight lines of equal length.</>)
            : Math.abs(pitch) < 1e-9
              ? tr(<><M>{t`\v v_B`}</M> steht senkrecht auf <M p=",">{t`\v\omega`}</M> also <M p=".">{t`\v v_\omega = \v 0`}</M> Der Körper dreht sich nur noch um <M p=":">\zeta</M> <M>\zeta</M> ist die Rotationsachse, <M>B</M> läuft auf einem Kreis, <M>Z</M> ruht.</>,
                <><M>{t`\v v_B`}</M> is perpendicular to <M p=",">{t`\v\omega`}</M> so <M p=".">{t`\v v_\omega = \v 0`}</M> The body only turns about <M p=":">\zeta</M> <M>\zeta</M> is the rotation axis, <M>B</M> moves on a circle, <M>Z</M> is at rest.</>)
              : tr(<>Pro Umdrehung rückt jeder Punkt um <M>{t`2\pi p`}</M> entlang <M>\zeta</M> vor; <M>B</M> läuft auf einer Schraubenlinie, <M>Z</M> geradeaus. Bei <M>{t`p < 0`}</M> zeigt <M>{t`\v v_\omega`}</M> gegen <M>{t`\v\omega`}</M> (Linksgewinde).</>,
                <>Per turn every point advances by <M>{t`2\pi p`}</M> along <M p=";">\zeta</M> <M>B</M> moves on a helix, <M>Z</M> straight on. For <M>{t`p < 0`}</M> <M>{t`\v v_\omega`}</M> points against <M>{t`\v\omega`}</M> (left-handed thread).</>)}</p>
        </figcaption>
      </div>
    </figure>
  );
}
