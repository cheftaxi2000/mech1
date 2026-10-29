import { useRef, useState } from 'react';
import { M } from '../components/Tex';
import { fmtNum, useLang, useTr } from '../i18n';
import { ladderMZ } from '../physics/plane';
import { PD, PV, phiFromA, polodeFrame, toWorld } from './polodeGeom';
import { at } from './figUtils';
import { useInView, useRaf, useReducedMotion } from './chem/useFrames';

const t = String.raw;
type V = readonly [number, number];
const pts = (ps: readonly V[]) => ps.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
const DEG = Math.PI / 180;
/** cos φ grows by this much per second while the ladder slides (A moves left at constant speed). */
const COS_RATE = 0.3;

function Arrow({ a, b, cls }: { a: V; b: V; cls: string }) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
  if (l < 2) return null;
  const ux = dx / l, uy = dy / l, s = Math.min(9, 0.6 * l);
  const head = `${b[0]},${b[1]} ${b[0] - s * ux + 0.45 * s * uy},${b[1] - s * uy - 0.45 * s * ux} ${b[0] - s * ux - 0.45 * s * uy},${b[1] - s * uy + 0.45 * s * ux}`;
  return <g className={cls}><line x1={a[0]} y1={a[1]} x2={b[0] - ux * 4} y2={b[1] - uy * 4} /><polygon points={head} /></g>;
}

/**
 * Supplement to the ladder (p. 27): where does the instantaneous centre Z wander to?
 * In the room Z runs on the circle of radius L about the corner (fixed polode); in the ladder, Z runs on the circle
 * of radius L/2 about its middle (moving polode). The small circle rolls without slipping inside the big one —
 * the swept arcs are equally long. Every point of the ladder then runs on an ellipse (trammel of Archimedes).
 * Drag A or B, use the angle slider, or let the ladder slide (Play).
 */
export function PolodeDemo() {
  const tr = useTr(), lang = useLang();
  const [phi, setPhi] = useState(50 * DEG);
  const [s, setS] = useState(0.3);
  const [playing, setPlaying] = useState(false);
  const drag = useRef<'A' | 'B' | null>(null);
  const svg = useRef<SVGSVGElement>(null), host = useRef<HTMLElement>(null);
  const reduced = useReducedMotion(), inView = useInView(host);
  const f = polodeFrame(phi, s), world = ladderMZ(PD.L, phi, PD.VH);

  useRaf((dt) => {
    const c = Math.cos(phi) + COS_RATE * dt;
    const next = Math.acos(Math.min(1, c));
    if (next <= PD.PHI_MIN) { setPhi(PD.PHI_MIN); setPlaying(false); } else setPhi(next);
  }, playing && inView && !reduced);

  const play = () => { if (playing) { setPlaying(false); return; } if (phi <= PD.PHI_MIN + 0.01) setPhi(PD.PHI_MAX); setPlaying(true); };
  const pos = (e: React.PointerEvent): V => {
    const r = svg.current!.getBoundingClientRect();
    return [PV[0] + ((e.clientX - r.left) / r.width) * PV[2], PV[1] + ((e.clientY - r.top) / r.height) * PV[3]];
  };
  const onDown = (e: React.PointerEvent) => {
    if (!svg.current) return;
    const q = pos(e), dA = Math.hypot(q[0] - f.A[0], q[1] - f.A[1]), dB = Math.hypot(q[0] - f.B[0], q[1] - f.B[1]);
    drag.current = Math.min(dA, dB) < 40 ? (dA <= dB ? 'A' : 'B') : null;
    if (drag.current) { setPlaying(false); (e.target as Element).setPointerCapture?.(e.pointerId); }
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current || !svg.current || e.buttons !== 1) return;
    const w = toWorld(pos(e));
    if (drag.current === 'A') setPhi(phiFromA(w[0]));
    else setPhi(Math.max(PD.PHI_MIN, Math.min(PD.PHI_MAX, Math.asin(Math.max(0, Math.min(1, w[1] / PD.L))))));
  };
  const onUp = () => { drag.current = null; };

  const ff = (x: number, d = 2) => fmtNum(x, d, lang, true);
  const tipP: V = [f.P[0] + f.vP[0], f.P[1] + f.vP[1]];
  const zp = Math.hypot(f.P[0] - f.Z[0], f.P[1] - f.Z[1]);
  const mid = Math.abs(s - 0.5) < 0.026;
  const lab = (p: V, dx: number, dy: number): React.CSSProperties => at(PV, p[0] + dx, p[1] + dy);
  const z0 = polodeFrame(PD.PHI_MAX, s).Z;

  return (
    <figure className="vdemo polode" ref={host}>
      <div className="vdemo-fig wide">
        <svg ref={svg} viewBox={PV.join(' ')} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
          role="img" aria-label={tr('Leiter mit fester und beweglicher Polbahn: A oder B ziehbar', 'Ladder with fixed and moving centrode: A or B draggable')}>
          <line x1={14} y1={f.C[1]} x2={f.C[0] + 4} y2={f.C[1]} className="ld-ground" />
          <line x1={f.C[0]} y1={f.C[1]} x2={f.C[0]} y2={20} className="ld-ground" />
          {Array.from({ length: 14 }, (_, i) => <line key={'f' + i} x1={28 + i * 21} y1={f.C[1]} x2={20 + i * 21} y2={f.C[1] + 8} className="ld-hatch" />)}
          {Array.from({ length: 11 }, (_, i) => <line key={'w' + i} x1={f.C[0]} y1={30 + i * 20} x2={f.C[0] + 8} y2={38 + i * 20} className="ld-hatch" />)}
          {/* moving polode: circle about M through A, B, C, Z (the ladder «extended to the plane») */}
          <polyline points={pts(f.movingAll)} className="pd-moving-all" />
          <polyline points={pts(f.movingSwept)} className="pd-moving" />
          {/* fixed polode: quarter circle about the corner */}
          <polyline points={pts(f.fixedAll)} className="pd-fixed-all" />
          <polyline points={pts(f.fixedSwept)} className="pd-fixed" />
          <circle cx={z0[0]} cy={z0[1]} r={4.5} className="pl-z-ghost" />
          {/* path of P */}
          <polyline points={pts(f.pathAll)} className="an-path" />
          <polyline points={pts(f.pathDone)} className="pd-path" />
          {/* ladder, rays and velocity of P */}
          <line x1={f.A[0]} y1={f.A[1]} x2={f.B[0]} y2={f.B[1]} className="ld-body" />
          <line x1={f.Z[0]} y1={f.Z[1]} x2={f.P[0]} y2={f.P[1]} className="pl-ray" />
          <Arrow a={f.P} b={tipP} cls="rb-v" />
          <circle cx={f.A[0]} cy={f.A[1]} r={16} className="pl-handle" />
          <circle cx={f.B[0]} cy={f.B[1]} r={16} className="pl-handle" />
          <circle cx={f.A[0]} cy={f.A[1]} r={4} className="an-point" />
          <circle cx={f.B[0]} cy={f.B[1]} r={4} className="an-point" />
          <circle cx={f.M[0]} cy={f.M[1]} r={3} className="pd-m" />
          <circle cx={f.P[0]} cy={f.P[1]} r={5} className="v-m" />
          <circle cx={f.Z[0]} cy={f.Z[1]} r={6.5} className="rl-mc" />
        </svg>
        <div className="vdemo-label fg small halo" style={lab(f.C, 12, 14)}><M>C</M></div>
        <div className="vdemo-label point small halo" style={lab(f.A, 0, 20)}><M>A</M></div>
        <div className="vdemo-label point small halo" style={lab(f.B, 14, -4)}><M>B</M></div>
        <div className="vdemo-label angle small halo" style={lab(f.Z, -14, -13)}><M>Z</M></div>
        <div className="vdemo-label muted small halo" style={lab(f.M, 12, 12)}><M>M</M></div>
        <div className="vdemo-label point small halo" style={lab(f.P, Math.cos(phi) > 0.6 ? 14 : -14, 16)}><M>P</M></div>
        {zp > 22 && <div className="vdemo-label point small halo" style={lab(tipP, (f.vP[0] / Math.hypot(...f.vP)) * 16, (f.vP[1] / Math.hypot(...f.vP)) * 16)}><M>{t`\v v_P`}</M></div>}
        <div className="vdemo-label pd-lab-fixed small halo" style={at(PV, 300 - 190 * 0.72 - 8, 62)}>{tr('feste Polbahn', 'fixed centrode')}</div>
        <div className="vdemo-label pd-lab-moving small halo" style={at(PV, 352, 296)}>{tr('bewegliche Polbahn', 'moving centrode')}</div>
      </div>
      <div className="controls">
        <label className="slider wide-slider"><span><M>\varphi</M></span>
          <input type="range" min={Math.round(PD.PHI_MIN / DEG)} max={Math.round(PD.PHI_MAX / DEG)} step={1} value={Math.round(phi / DEG)}
            aria-label={tr('Leiterwinkel φ', 'Ladder angle φ')} onChange={(e) => { setPlaying(false); setPhi(+e.target.value * DEG); }} />
          <span className="val">{Math.round(phi / DEG)}°</span></label>
        <label className="slider wide-slider"><span><M>s</M></span>
          <input type="range" min={0} max={1} step={0.05} value={s} aria-label={tr('Punkt P auf der Leiter (Anteil s der Länge von A aus)', 'Point P on the ladder (fraction s of the length from A)')}
            onChange={(e) => setS(+e.target.value)} />
          <span className="val">{fmtNum(s, 2, lang)}</span></label>
        <div className="v-presets">
          <button type="button" className="motion-btn" onClick={play} aria-pressed={playing}>{playing ? tr('Pause', 'Pause') : tr('Leiter rutschen lassen', 'Let the ladder slide')}</button>
          <button type="button" onClick={() => setS(0.5)} aria-pressed={mid}>{tr('P in der Mitte', 'P at the middle')}</button>
          <button type="button" onClick={() => { setPlaying(false); setPhi(50 * DEG); }}>{tr('Zurück', 'Reset')}</button>
        </div>
      </div>
      <figcaption className="vdemo-readout">
        <div className="v-result pos rt-readout">
          <M p=",">{t`|\v{CZ}| = L`}</M> <M p=",">{t`|\v{MZ}| = \tfrac{L}{2}`}</M> <M>{t`|\v{MA}| = |\v{MB}| = |\v{MC}| = \tfrac{L}{2}`}</M>
        </div>
        <div className="rt-readout pl-small">
          <M p=",">{t`s_{\text{${tr('fest', 'fixed')}}} = ${ff(f.arcFixed)}\,L`}</M> <M p=",">{t`s_{\text{${tr('beweglich', 'moving')}}} = ${ff(f.arcMoving)}\,L`}</M>{' '}
          <M>{t`\omega = ${ff(Math.abs(world.w))}\,v_H/L`}</M>
        </div>
        <div className="rt-readout pl-small">
          <M p=",">{t`|\v{ZP}| = ${ff(zp / PD.S)}\,L`}</M> <M>{t`v_P = \omega\,|\v{ZP}| = ${ff(Math.abs(world.w) * zp / PD.S)}\,v_H`}</M>
        </div>
        <p className="vdemo-note">{tr(
          <>Im Raum läuft <M>Z</M> auf dem violetten Viertelkreis um die Ecke <M p=".">C</M> In der Leiter (gedanklich zur Ebene erweitert) läuft <M>Z</M> auf dem türkisen Kreis um die Mitte <M p=".">M</M> Der kleine Kreis rollt ohne Gleiten im grossen: die beiden dicken Bögen sind gleich lang. Darum bewegt sich jeder Punkt <M>P</M> der Leiter auf einer Ellipse (Halbachsen <M>{t`(1-s)L`}</M> und <M p=")">{t`sL`}</M> und <M>{t`\v v_P`}</M> steht senkrecht auf <M p=".">{t`\v{ZP}`}</M> <M>A</M> und <M>B</M> laufen auf Geraden, die Mitte auf einem Kreis. Ziehe <M>A</M> oder <M p=",">B</M> oder lass die Leiter rutschen.</>,
          <>In the room <M>Z</M> runs on the purple quarter circle about the corner <M p=".">C</M> In the ladder (imagined extended to the plane) <M>Z</M> runs on the teal circle about the middle <M p=".">M</M> The small circle rolls without slipping inside the big one: the two thick arcs have equal length. That is why every point <M>P</M> of the ladder moves on an ellipse (semi-axes <M>{t`(1-s)L`}</M> and <M p=")">{t`sL`}</M> and <M>{t`\v v_P`}</M> is perpendicular to <M p=".">{t`\v{ZP}`}</M> <M>A</M> and <M>B</M> run on straight lines, the middle on a circle. Drag <M>A</M> or <M p=",">B</M> or let the ladder slide.</>)}</p>
      </figcaption>
    </figure>
  );
}
