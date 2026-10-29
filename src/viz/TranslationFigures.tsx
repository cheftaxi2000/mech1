import { useEffect, useState, useRef } from 'react';
import { M } from '../components/Tex';
import { fmtNum, useLang, useTr } from '../i18n';
import { crankA, crankB, rodOmega, rodPoint, rodVelocity } from '../physics/translation';
import { at, useInView } from './figUtils';

const t = String.raw;
type V = [number, number];
const DEG = Math.PI / 180;

function Arrow({ a, b, cls }: { a: V; b: V; cls: string }) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
  if (l < 1.5) return null;
  const ux = dx / l, uy = dy / l, s = Math.min(9, 0.6 * l); // short arrows keep a short head
  const head = `${b[0]},${b[1]} ${b[0] - s * ux + 0.45 * s * uy},${b[1] - s * uy - 0.45 * s * ux} ${b[0] - s * ux - 0.45 * s * uy},${b[1] - s * uy + 0.45 * s * ux}`;
  return <g className={cls}><line x1={a[0]} y1={a[1]} x2={b[0] - ux * 4} y2={b[1] - uy * 4} /><polygon points={head} /></g>;
}

function useLoop(play: boolean, speed: number, set: (f: (x: number) => number) => void, seen: boolean) {
  useEffect(() => {
    if (!play || !seen) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => { const dt = Math.min(now - last, 100) / 1000; last = now; set((x) => x + dt * speed); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, speed, set, seen]);
}

/* ------------------------------------------------------------------------------------------------ */
export type Mode = 'line' | 'curve' | 'circle' | 'rot';
const VB: [number, number, number, number] = [0, 0, 400, 290];
const OFF: V[] = [[0, 0], [58, -46], [104, 6]]; // M, N, P in the body
const RECT: V[] = [[-26, -70], [128, -70], [128, 28], [-26, 28]];
const PIVOT: V = [205, 150], BASE: V = [-75, 20];
/** Circular translation: M runs on a circle of radius R about (cx, cy); the other points on shifted copies. */
export const CIRC = { cx: 128, cy: 162, R: 80 };
/** One full cycle of the demo lasts T seconds (the phase u grows by SPEED per second). */
export const DEMO_SPEED = 0.12, DEMO_T = 1 / DEMO_SPEED;
const rotv = (p: V, a: number): V => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)];

/** Position of a body point (offset o) at phase u ∈ [0,1) for each kind of motion (SVG coordinates). */
function place(mode: Mode, o: V, u: number): V {
  const w = 2 * Math.PI * u;
  switch (mode) {
    case 'line': { const s = 0.5 - 0.5 * Math.cos(w); return [56 + 200 * s + o[0], 236 - 110 * s + o[1]]; }
    case 'curve': { const s = 0.5 - 0.5 * Math.cos(w); return [56 + 200 * s + o[0], 236 - 110 * s - 55 * Math.sin(Math.PI * s) + o[1]]; }
    case 'circle': return [CIRC.cx + CIRC.R * Math.cos(w) + o[0], CIRC.cy + CIRC.R * Math.sin(w) + o[1]];
    case 'rot': { const ang = w; const q = rotv([BASE[0] + o[0], BASE[1] + o[1]], ang); return [PIVOT[0] + q[0], PIVOT[1] + q[1]]; }
  }
}

const VS = 0.55; // px of arrow per px/s of velocity

function segDist(c: V, a: V, b: V) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy;
  const k = l2 < 1e-9 ? 0 : Math.max(0, Math.min(1, ((c[0] - a[0]) * dx + (c[1] - a[1]) * dy) / l2));
  return Math.hypot(c[0] - a[0] - k * dx, c[1] - a[1] - k * dy);
}

/**
 * Centre for a label near p: a spot on a circle of radius r that keeps at least `free` from every segment.
 * Spots are tried outward from `prefer` (default lower left, the lecture's habit), so a label only moves when an
 * arrow comes near.
 */
export function freeSpot(p: V, segs: [V, V][], r = 15, free = 11, prefer = 2.2): V {
  let best: V = p, bestD = -1;
  for (let j = 0; j < 16; j++) {
    const k = j % 2 ? (j + 1) / 2 : -j / 2;
    const ang = prefer + (k / 16) * 2 * Math.PI;
    const c: V = [p[0] + r * Math.cos(ang), p[1] + r * Math.sin(ang)];
    const d = Math.min(free, ...segs.map(([a, b]) => segDist(c, a, b)));
    if (d > bestD + 0.5) { bestD = d; best = c; }
  }
  return best;
}

/** Everything TranslationDemo draws at phase u (pure, unit-tested): points, velocity arrows, label spots. */
export function demoFrame(mode: Mode, u: number) {
  const pts = OFF.map((o) => place(mode, o, u));
  const vel = OFF.map((o) => { const h = 1e-4, a = place(mode, o, u + h), b = place(mode, o, u - h); return [(a[0] - b[0]) / (2 * h) * 0.12, (a[1] - b[1]) / (2 * h) * 0.12] as V; });
  const tips = pts.map((p, i): V => [p[0] + VS * vel[i][0], p[1] + VS * vel[i][1]]);
  const segs: [V, V][] = [[pts[0], pts[1]], [pts[0], pts[2]], ...pts.map((p, i): [V, V] => [p, tips[i]])];
  if (mode === 'rot') segs.push([PIVOT, PIVOT]);
  // the label of a sits beside the middle of MN, on the side away from P
  const mid: V = [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2];
  const dx = pts[1][0] - pts[0][0], dy = pts[1][1] - pts[0][1], l = Math.hypot(dx, dy);
  let nx = -dy / l, ny = dx / l;
  if (nx * (pts[2][0] - mid[0]) + ny * (pts[2][1] - mid[1]) > 0) { nx = -nx; ny = -ny; }
  const aLabel = freeSpot(mid, segs, 12, 11, Math.atan2(ny, nx));
  // the label of b = MP: beside the middle of MP, on the side away from N, clear of a's label
  const midB: V = [(pts[0][0] + pts[2][0]) / 2, (pts[0][1] + pts[2][1]) / 2];
  const ex = pts[2][0] - pts[0][0], ey = pts[2][1] - pts[0][1], lb = Math.hypot(ex, ey);
  let mx = -ey / lb, my = ex / lb;
  if (mx * (pts[1][0] - midB[0]) + my * (pts[1][1] - midB[1]) > 0) { mx = -mx; my = -my; }
  const bLabel = freeSpot(midB, [...segs, [aLabel, aLabel]], 12, 11, Math.atan2(my, mx));
  const labels: V[] = [];
  pts.forEach((p) => {
    const others: [V, V][] = [...pts.filter((q) => q !== p).map((q): [V, V] => [q, q]), [aLabel, aLabel], [bLabel, bLabel], ...labels.map((q): [V, V] => [q, q])];
    labels.push(freeSpot(p, [...segs, ...others]));
  });
  return { pts, vel, tips, labels, aLabel, bLabel, segs };
}

/**
 * Lecture p. 13–14: translation. Three points M, N, P of one body; the arrows a = MN and b = MP. In a translation
 * they never turn, every point has the same velocity and all paths are congruent (shifted copies) — straight,
 * curved or circular (Ferris-wheel gondola). "Rotation" is shown for comparison.
 */
export function TranslationDemo() {
  const tr = useTr(), lang = useLang();
  const [mode, setMode] = useState<Mode>('circle');
  const [u, setU] = useState(0.12);
  const [play, setPlay] = useState(false);
  const host = useRef<HTMLElement>(null);
  useLoop(play, DEMO_SPEED, setU, useInView(host));
  const { pts, vel, tips, labels, aLabel, bLabel } = demoFrame(mode, u);
  const uu = ((u % 1) + 1) % 1;
  const rect = RECT.map((c) => place(mode, c, u));
  const paths = OFF.map((o) => Array.from({ length: 97 }, (_, i) => place(mode, o, i / 96)).map((p) => p.join(',')).join(' '));
  const speeds = vel.map((v) => Math.hypot(...v));
  const equal = Math.max(...speeds) - Math.min(...speeds) < 0.5 && Math.abs(Math.atan2(vel[0][1], vel[0][0]) - Math.atan2(vel[1][1], vel[1][0])) < 0.01;
  const names = ['M', 'N', 'P'];
  const MODES: [Mode, string, string][] = [['line', 'geradlinig', 'straight'], ['curve', 'krummlinig', 'curved'], ['circle', 'kreisförmig', 'circular'], ['rot', 'Vergleich: Drehung', 'compare: rotation']];
  return (
    <figure className="vdemo" ref={host}>
      <div className="tabs" role="tablist">
        {MODES.map(([m, de, en]) => (
          <button key={m} role="tab" aria-selected={mode === m} className={mode === m ? 'active' : ''} onClick={() => setMode(m)}>{tr(de, en)}</button>
        ))}
      </div>
      <div className="vdemo-fig wide">
        <svg viewBox={VB.join(' ')} aria-label={tr('Körper mit drei Punkten und ihren Bahnen', 'Body with three points and their paths')}>
          {/* M's path strong, the paths of N and P faint (shifted copies in a translation) */}
          {paths.map((p, i) => <polyline key={i} points={p} className={i === 0 ? 'tr-path3a main' : 'tr-path3a'} />)}
          <polygon points={rect.map((p) => p.join(',')).join(' ')} className={`rb-body${mode === 'rot' ? ' rot' : ''}`} />
          <Arrow a={pts[0]} b={pts[1]} cls="rb-a" />
          <Arrow a={pts[0]} b={pts[2]} cls="rb-a thin" />
          {pts.map((p, i) => <Arrow key={`v${i}`} a={p} b={tips[i]} cls="rb-v" />)}
          {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={5} className="v-m" />)}
          {mode === 'rot' && <circle cx={PIVOT[0]} cy={PIVOT[1]} r={4} className="v-o" />}
        </svg>
        {labels.map((p, i) => <div key={i} className="vdemo-label point small" style={at(VB, p[0], p[1])}><M>{names[i]}</M></div>)}
        <div className="vdemo-label muted small" style={at(VB, aLabel[0], aLabel[1])}><M>{t`\v a`}</M></div>
        <div className="vdemo-label muted small" style={at(VB, bLabel[0], bLabel[1])}><M>{t`\v b`}</M></div>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider"><M>t</M>
          <input type="range" min={0} max={1} step={0.002} value={uu} onChange={(e) => { setPlay(false); setU(Number(e.target.value)); }} aria-label="t" /><span className="val">{fmtNum(uu * DEMO_T, 1, lang)} s</span></label>
        <div className="motion-row">
          <button type="button" className="motion-btn" onClick={() => setPlay((x) => !x)}>{play ? tr('Anhalten', 'Stop') : tr('Bewegung abspielen', 'Play the motion')}</button>
        </div>
        <div className={`v-result ${equal ? 'pos' : 'neg'}`}><M>{t`|\v v_M| = ${fmtNum(speeds[0] / 40, 2, lang, true)},\ |\v v_N| = ${fmtNum(speeds[1] / 40, 2, lang, true)},\ |\v v_P| = ${fmtNum(speeds[2] / 40, 2, lang, true)}`}</M></div>
        <p className="vdemo-note">{mode === 'rot'
          ? tr(<>Drehung um den schwarzen Punkt: <M>{t`\v a`}</M> dreht sich mit. Die Bahnen sind Kreise um denselben Mittelpunkt, aber verschieden gross; die roten Pfeile sind verschieden – <b>keine</b> Translation.</>, <>Rotation about the black dot: <M>{t`\v a`}</M> turns along. The paths are circles about the same centre, but of different size; the red arrows differ – <b>not</b> a translation.</>)
          : mode === 'circle'
            ? tr(<>Wie eine Gondel im Riesenrad: Jeder Punkt fährt einen Kreis, aber der Körper dreht sich nicht. Alle Kreise sind gleich gross, nur verschoben; <M>{t`\v a`}</M> bleibt gleich, alle roten Pfeile sind gleich.</>, <>Like a Ferris-wheel gondola: every point travels on a circle, but the body does not turn. All circles are equal, only shifted; <M>{t`\v a`}</M> stays the same, all red arrows are equal.</>)
            : tr(<><M>{t`\v a`}</M> behält Länge <em>und</em> Richtung. Alle drei Bahnen sind dieselbe Kurve, nur verschoben (kongruent); alle roten Pfeile sind gleich.</>, <><M>{t`\v a`}</M> keeps its length <em>and</em> direction. All three paths are the same curve, only shifted (congruent); all red arrows are equal.</>)}</p>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------------------------------------ */
const VB2: [number, number, number, number] = [0, 0, 400, 230];
const O2: V = [92, 130], R2 = 1, L2 = 2.6, S2 = 56; // px per unit
const toS = (p: [number, number]): V => [O2[0] + S2 * p[0], O2[1] - S2 * p[1]];

/** The chip «momentane Translation» shows only when ω_rod reads 0,00 (below the 2-digit display resolution). */
export const isMomentary = (om: number) => Math.abs(om) < 0.005;

/**
 * Supplement for "momentane Translation" (lecture p. 14): slider crank. The rod A–B moves in a mixture of
 * translation and turning; exactly when the crank stands vertical (θ = 90° or 270°) the rod does not turn
 * (ω_rod = 0) and all its points have the same velocity — but only at that instant.
 */
export function SliderCrank() {
  const tr = useTr(), lang = useLang();
  const [th, setTh] = useState(60);
  const [play, setPlay] = useState(false);
  const host = useRef<HTMLElement>(null);
  useLoop(play, 40, setTh, useInView(host));
  const a = (((th % 360) + 360) % 360) * DEG, w = 1;
  const A = toS(crankA(a, R2)), B = toS(crankB(a, R2, L2));
  const ks = [0, 0.5, 1];
  const P = ks.map((k) => toS(rodPoint(a, R2, L2, k)));
  const Vv = ks.map((k) => { const v = rodVelocity(a, R2, L2, k, w); return [v[0] * 34, -v[1] * 34] as V; });
  const om = rodOmega(a, R2, L2, w);
  const momentary = isMomentary(om);
  const out = Math.hypot(A[0] - O2[0], A[1] - O2[1]) || 1; // A's label sits radially outside the crank circle, clear of v_A
  const lA: V = [A[0] + (18 * (A[0] - O2[0])) / out, A[1] + (18 * (A[1] - O2[1])) / out];
  const deg = Math.round(((th % 360) + 360) % 360);
  return (
    <figure className="vdemo" ref={host}>
      <div className="vdemo-fig wide">
        <svg viewBox={VB2.join(' ')} aria-label={tr('Kurbeltrieb', 'Slider crank')}>
          <circle cx={O2[0]} cy={O2[1]} r={S2 * R2} className="tr-path" />
          {/* guide of the slider B only where B travels, so the crank circle does not cross it */}
          <line x1={toS([R2 + 0.15, 0])[0]} y1={O2[1] + 14} x2={392} y2={O2[1] + 14} className="ld-ground" />
          <rect x={B[0] - 20} y={B[1] - 13} width={40} height={26} rx={3} className="tr-slider" />
          <line x1={O2[0]} y1={O2[1]} x2={A[0]} y2={A[1]} className="tr-crank" />
          <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} className={`tr-rod3a${momentary ? ' on' : ''}`} />
          {P.map((p, i) => <Arrow key={i} a={p} b={[p[0] + Vv[i][0], p[1] + Vv[i][1]]} cls="rb-v" />)}
          {P.map((p, i) => <circle key={`p${i}`} cx={p[0]} cy={p[1]} r={4.5} className="v-m" />)}
          <circle cx={O2[0]} cy={O2[1]} r={4} className="v-o" />
        </svg>
        <div className="vdemo-label muted small" style={at(VB2, O2[0] - 12, O2[1] + 4)}><M>O</M></div>
        <div className="vdemo-label point small" style={at(VB2, lA[0], lA[1])}><M>A</M></div>
        <div className="vdemo-label point small" style={at(VB2, B[0] + 4, B[1] + 26)}><M>B</M></div>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider"><span>{tr('Kurbelwinkel', 'crank angle')}</span>
          <input type="range" min={0} max={360} step={1} value={deg} onChange={(e) => { setPlay(false); setTh(Number(e.target.value)); }} aria-label="theta" /><span className="val">{deg}°</span></label>
        <div className="motion-row">
          <button type="button" className="motion-btn" onClick={() => setPlay((x) => !x)}>{play ? tr('Anhalten', 'Stop') : tr('Kurbel drehen', 'Turn the crank')}</button>
          <button type="button" className="motion-btn" onClick={() => { setPlay(false); setTh(90); }}>{tr('Kurbel senkrecht', 'Crank vertical')}</button>
        </div>
        <div className={`v-result ${momentary ? 'pos' : ''}`}><M>{t`\omega_{\text{${tr('Stange', 'rod')}}} = ${fmtNum(om, 2, lang, true)}`}</M>{momentary ? <b className="tr-chip">{tr('momentane Translation', 'momentary translation')}</b> : null}</div>
        <p className="vdemo-note">{tr(<>Rote Pfeile: Geschwindigkeiten von drei Punkten der Stange <M p=".">{t`AB`}</M> Meist sind sie verschieden, weil sich die Stange auch dreht. Steht die Kurbel senkrecht, dreht sich die Stange in diesem Augenblick nicht: Alle Pfeile sind gleich. Einen Augenblick später nicht mehr.</>,
          <>Red arrows: velocities of three points of the rod <M p=".">{t`AB`}</M> Usually they differ because the rod also turns. When the crank is vertical, the rod does not turn at that instant: all arrows are equal. A moment later they are not.</>)}</p>
      </figcaption>
    </figure>
  );
}
