import { useEffect, useMemo, useRef, useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { makeWalk, pathLength, pointAtLength, theoryMfp } from '../../chem/walk';
import { useReducedMotion } from '../figUtils';
import './kinfig.css';

const t = String.raw;
const PX = 10, W = 40, H = 30, RC = 0.7, DENS1 = 0.08; // box in units; obstacle density at 1 atm
const SPEED = 22; // units per second
const PRESETS = [1, 0.5, 0.25, 0.1];
/** slide 28: at 1 atm the mean free path of air is 60 nm; it grows like 1/P */
export const MFP_1ATM_NM = 60;

/**
 * Slide 28: diffusion. A molecule (blue) flies straight until it meets another (red), then goes off in a new direction.
 * Collisions randomise its direction, so after a long way it has got only a short way from the start. At lower pressure
 * there are fewer red molecules, the straight pieces get longer — the mean free path grows like 1/P.
 */
export function DiffusionWalk() {
  const tr = useTr(), lang = useLang(), reduced = useReducedMotion();
  const [P, setP] = useState(1);
  const walk = useMemo(() => makeWalk({ seed: 11, W, H, density: DENS1 * P, rc: RC, collisions: 45 }), [P]);
  const total = useMemo(() => pathLength(walk.path), [walk]);
  const [s, setS] = useState(total);
  const [playing, setPlaying] = useState(false);
  const started = useRef(false);
  useEffect(() => { setS(reduced ? total : 0); setPlaying(!reduced); started.current = true; }, [total, reduced]);
  useEffect(() => {
    if (!playing) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      setS((v) => { const n = v + ((now - last) / 1000) * SPEED * (P < 0.3 ? 2 : 1); if (n >= total) { setPlaying(false); return total; } return n; });
      last = now; raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, total, P]);
  const { p, k } = pointAtLength(walk.path, s);
  const shown = [...walk.path.slice(0, k + 1), p];
  const cols = walk.collisionAt.filter((c) => c <= k);
  const done = walk.segLengths.slice(0, cols.length);
  const start = walk.path[0];
  const net = Math.hypot(p[0] - start[0], p[1] - start[1]);
  const mean = done.length ? done.reduce((a, b) => a + b, 0) / done.length : null;
  const th = theoryMfp(DENS1 * P, RC), th1 = theoryMfp(DENS1, RC);
  const f = (x: number, d: number) => fmtNum(x, d, lang, true);
  const pts = (ps: readonly (readonly [number, number])[]) => ps.map((q) => `${(q[0] * PX).toFixed(1)},${(q[1] * PX).toFixed(1)}`).join(' ');
  return (
    <figure className="vdemo kinfig dw">
      <div className="dw-stage">
        <svg viewBox={`0 0 ${W * PX} ${H * PX}`} role="img" aria-label={tr('Ein Molekül zickzackt zwischen vielen anderen', 'One molecule zigzags among many others')}>
          <rect className="dw-box" x={0} y={0} width={W * PX} height={H * PX} />
          {walk.obstacles.map((o, i) => <circle key={i} className="dw-red" cx={o[0] * PX} cy={o[1] * PX} r={RC * PX} />)}
          <polyline className="dw-path" points={pts(shown)} />
          {cols.map((c) => <circle key={c} className="dw-hit" cx={walk.path[c][0] * PX} cy={walk.path[c][1] * PX} r={3.4} />)}
          <line className="dw-net" x1={start[0] * PX} y1={start[1] * PX} x2={p[0] * PX} y2={p[1] * PX} />
          <circle className="dw-start" cx={start[0] * PX} cy={start[1] * PX} r={4} />
          <circle className="dw-blue" cx={p[0] * PX} cy={p[1] * PX} r={7} />
        </svg>
      </div>
      <div className="kf-controls">
        <div className="v-presets" role="group" aria-label={tr('Luftdruck', 'Air pressure')}>
          {PRESETS.map((q) => <button type="button" key={q} aria-pressed={P === q} onClick={() => setP(q)}><M>{t`${f(q, q < 0.3 ? (q === 0.1 ? 1 : 2) : q === 0.5 ? 1 : 0)}\,\mathrm{atm}`}</M></button>)}
          <button type="button" className="motion-btn" onClick={() => { if (playing) setPlaying(false); else { if (s >= total) setS(0); setPlaying(true); } }}>{playing ? tr('Pause', 'Pause') : s >= total ? tr('Nochmals', 'Replay') : tr('Abspielen', 'Play')}</button>
        </div>
      </div>
      <div className="kf-read">
        <div className="kf-row"><span>{tr('Zusammenstösse bisher', 'Collisions so far')}</span><b><M>{t`${cols.length}`}</M></b></div>
        <div className="kf-row"><span>{tr('Weg entlang der Linie', 'Distance flown along the line')}</span><b><M>{t`${f(s, 0)}`}</M></b></div>
        <div className="kf-row kf-hl"><span>{tr('Abstand vom Start (gelb gestrichelt)', 'Distance from the start (dashed)')}</span><b><M>{t`${f(net, 0)}`}</M></b></div>
        <div className="kf-row"><span>{tr('Mittlerer Abstand zwischen Stössen, gemessen', 'Average distance between collisions, measured')}</span><b>{mean === null ? '…' : <M>{t`${f(mean, 1)}`}</M>}</b></div>
        <div className="kf-row"><span>{tr('Freie Weglänge der Luft (Folie 28)', 'Mean free path of air (slide 28)')} <M>{t`\lambda\approx 60\,\mathrm{nm}\cdot\dfrac{1\,\mathrm{atm}}{P}`}</M></span><b><M>{t`\lambda\approx ${f((MFP_1ATM_NM * th) / th1, 0)}\,\mathrm{nm}`}</M></b></div>
        <div className="kf-note">{tr('Längen im Bild in Kästchen-Einheiten; ', 'Lengths in the picture are in box units; ')}<M p=".">{t`\lambda\propto 1/P`}</M></div>
      </div>
    </figure>
  );
}
