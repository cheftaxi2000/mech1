import { useEffect, useMemo, useRef, useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { attackPoint, offsetFromLine, simulateBox, stateAt, type BoxSpec, type P2 } from '../../physics/matchbox';
import { useReducedMotion } from '../figUtils';
import { Arrow, Frame, KLabel, svgPt, t, type V } from './kfKit';

const VB: [number, number, number, number] = [0, 0, 400, 250];
const SPX = 76; // px per grid cell (= 1 length unit)
const BOX: BoxSpec = { w: 2.2, h: 1.2, m: 1 };
const FMAG = 0.8, T = 1.5, PLAY_S = 2.4;
const START: V = [112, 125];
const ARROW = 62;

const DIRS = { right: [1, 0], up_right: [Math.SQRT1_2, Math.SQRT1_2], up: [0, 1] } as const;
type Dir = keyof typeof DIRS;
const PRESETS: { id: string; de: string; en: string; r: P2 }[] = [
  { id: 'cm', de: 'Schwerpunkt', en: 'centre of mass', r: [0, 0] },
  { id: 'end', de: 'linkes Ende', en: 'left end', r: [-1.1, 0] },
  { id: 'top', de: 'Mitte oben', en: 'middle, top', r: [0, 0.6] },
  { id: 'corner', de: 'Ecke oben rechts', en: 'top right corner', r: [1.1, 0.6] },
];

const toScreen = (x: number, y: number): V => [START[0] + SPX * x, START[1] - SPX * y];
const corners: P2[] = [[-BOX.w / 2, -BOX.h / 2], [BOX.w / 2, -BOX.h / 2], [BOX.w / 2, BOX.h / 2], [-BOX.w / 2, BOX.h / 2]];
const pts = (ps: readonly V[]) => ps.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
const bodyPt = (s: { x: number; y: number; th: number }, rr: P2): V => { const p = attackPoint(s, rr); return toScreen(p[0], p[1]); };
const outline = (s: { x: number; y: number; th: number }): V[] => corners.map((c) => { const p = attackPoint(s, c); return toScreen(p[0], p[1]); });

/**
 * Supplement to p. 29: the SAME force vector F̲ pulls at different points A of a body on a smooth table (view from above).
 * Drag A (or tap anywhere on the body), press «Los»: the centre of mass always moves the same way, only the turning depends on A.
 * The dynamics itself (what turns a body) comes later in the course; the picture shows that A belongs to the force.
 */
export function K1Matchbox() {
  const tr = useTr(), lang = useLang(), reduced = useReducedMotion();
  const [r, setR] = useState<P2>([1.1, 0.6]);
  const [dir, setDir] = useState<Dir>('right');
  const [phase, setPhase] = useState<'set' | 'run' | 'done'>('set');
  const [u, setU] = useState(0); // 0..1 progress of the run
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const F: P2 = [FMAG * DIRS[dir][0], FMAG * DIRS[dir][1]];
  const samples = useMemo(() => simulateBox(BOX, r, F, T), [r, F[0], F[1]]); // eslint-disable-line react-hooks/exhaustive-deps
  const final = samples[samples.length - 1];

  useEffect(() => {
    if (phase !== 'run') return;
    if (reduced) { setU(1); setPhase('done'); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / (PLAY_S * 1000));
      setU(k);
      if (k >= 1) { setPhase('done'); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, reduced]);

  const reset = () => { setPhase('set'); setU(0); };
  const go = () => { setU(0); setPhase('run'); };
  const setPoint = (p: P2) => { reset(); setR([Math.max(-BOX.w / 2, Math.min(BOX.w / 2, p[0])), Math.max(-BOX.h / 2, Math.min(BOX.h / 2, p[1]))]); };

  const place = (e: React.PointerEvent) => {
    if (!svg.current) return;
    const q = svgPt(svg.current, VB, e);
    setPoint([(q[0] - START[0]) / SPX, -(q[1] - START[1]) / SPX]);
  };
  const down = (e: React.PointerEvent) => {
    if (phase === 'run') return;
    dragging.current = true; (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    place(e);
  };
  const move = (e: React.PointerEvent) => { if (dragging.current) place(e); };
  const up = () => { dragging.current = false; };

  const s = phase === 'set' ? { x: 0, y: 0, th: 0 } : stateAt(samples, T, u * T);
  const A = attackPoint(s, r), aS = toScreen(A[0], A[1]);
  const fdir: V = [DIRS[dir][0], -DIRS[dir][1]]; // screen direction of F
  const tip: V = [aS[0] + ARROW * fdir[0], aS[1] + ARROW * fdir[1]];
  const cm = toScreen(s.x, s.y);
  const trail = phase === 'set' ? [] : samples.filter((_, i) => i <= Math.round(u * 240)).filter((_, i) => i % 6 === 0);
  const d0 = offsetFromLine(r, F);
  const straight = d0 < 0.02;
  const f = (x: number) => fmtNum(x, 2, lang);
  const deg = (final.th * 180) / Math.PI;
  // the line of action through A (in the start position) and the perpendicular from the centre of mass
  const aStart = toScreen(r[0], r[1]);
  const L = 230;
  const line: [V, V] = [[aStart[0] - L * fdir[0], aStart[1] - L * fdir[1]], [aStart[0] + L * fdir[0], aStart[1] + L * fdir[1]]];
  const foot: V = (() => { const cs = toScreen(0, 0); const k = (cs[0] - aStart[0]) * fdir[0] + (cs[1] - aStart[1]) * fdir[1]; return [aStart[0] + k * fdir[0], aStart[1] + k * fdir[1]]; })();
  const grid: number[] = [];
  for (let x = 0; x <= 400; x += SPX) grid.push(x);

  return (
    <Frame vb={VB} svgRef={svg} label={tr('Körper auf glattem Tisch: Angriffspunkt ziehbar', 'Body on a smooth table: point of application draggable')} className="kf-matchbox"
      svgProps={{ onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up, 'data-phase': phase } as React.SVGProps<SVGSVGElement>}
      labels={<>
        <KLabel vb={VB} x={tip[0] + 12 * fdir[0]} y={tip[1] + 12 * fdir[1] - (dir === 'right' ? 12 : 0)} ink="force" anchor={dir === 'up' ? 'b' : 'l'}>{t`\{A\,|\,\v F\}`}</KLabel>
        <KLabel vb={VB} x={cm[0] + 12} y={cm[1] + 13} ink="fg">S</KLabel>
        {phase === 'set' && !straight && <KLabel vb={VB} x={(foot[0] + toScreen(0, 0)[0]) / 2 + 10} y={(foot[1] + toScreen(0, 0)[1]) / 2} ink="point" anchor="l">d</KLabel>}
      </>}
      caption={<>
        <div className="kf-ctl">
          <div className="row" role="group" aria-label={tr('Wo greift die Kraft an?', 'Where does the force act?')}>
            {PRESETS.map((p) => <button type="button" key={p.id} className="kf-chip" aria-pressed={Math.abs(r[0] - p.r[0]) < 1e-9 && Math.abs(r[1] - p.r[1]) < 1e-9} onClick={() => setPoint(p.r)}>{tr(p.de, p.en)}</button>)}
          </div>
          <div className="row" role="group" aria-label={tr('Richtung der Kraft', 'Direction of the force')}>
            <span className="kf-note">{tr('Richtung von', 'Direction of')} <M>{t`\v F`}</M>:</span>
            {([['right', t`\rightarrow`], ['up_right', t`\nearrow`], ['up', t`\uparrow`]] as const).map(([id, tex]) => (
              <button type="button" key={id} className="kf-chip" aria-pressed={dir === id} onClick={() => { reset(); setDir(id); }} aria-label={id}><M>{tex}</M></button>
            ))}
          </div>
          <div className="row">
            <button type="button" className="kf-chip go" onClick={go} disabled={phase === 'run'}>{phase === 'done' ? tr('Nochmals', 'Again') : tr('Los!', 'Go!')}</button>
            <button type="button" className="kf-chip" onClick={reset} disabled={phase === 'set'}>{tr('Zurück', 'Back')}</button>
          </div>
        </div>
        <div className="kf-read" role="status">
          <div>{straight
            ? tr('Die Gerade durch A in Richtung der Kraft trifft den Schwerpunkt: der Körper wird nur verschoben.', 'The line through A in the direction of the force hits the centre of mass: the body is only shifted.')
            : tr('Die Gerade durch A in Richtung der Kraft geht am Schwerpunkt vorbei: der Körper dreht sich zusätzlich.', 'The line through A in the direction of the force misses the centre of mass: the body also turns.')}</div>
          {phase === 'done' ? <div className="big">
            <div>{tr('Schwerpunkt: ', 'Centre of mass: ')}{tr(`${f(Math.hypot(final.x, final.y))} Kästchen weit`, `${f(Math.hypot(final.x, final.y))} squares`)}{' – '}{tr('bei jedem Angriffspunkt gleich', 'the same for every point of application')}</div>
            <div>{tr('Drehung: ', 'Turning: ')}<M>{t`${fmtNum(Math.abs(deg), 0, lang, true)}^\circ`}</M> {Math.abs(deg) < 0.5 ? '' : deg < 0 ? tr('im Uhrzeigersinn', 'clockwise') : tr('gegen den Uhrzeigersinn', 'counter-clockwise')}</div>
            <div className="kf-note">{tr('Abstand der Geraden vom Schwerpunkt', 'Distance of the line from the centre of mass')}{' '}<M>{t`d = ${fmtNum(d0, 2, lang, true)}`}</M>{' '}{tr('Kästchen', 'squares')}</div>
          </div> : <div className="kf-note">{phase === 'run' ? tr('Der Körper bewegt sich …', 'The body is moving …') : tr('Drücke «Los!»: Dann siehst du, wie weit der Schwerpunkt wandert und wie stark sich der Körper dreht.', 'Press “Go!”: then you see how far the centre of mass travels and how much the body turns.')}</div>}
          <div className="kf-note">{tr('Reibung ist ausgeschaltet.', 'Friction is switched off.')}</div>
        </div>
      </>}>
      {/* the table with its grid */}
      {grid.map((x) => <line key={`gx${x}`} x1={x} y1={0} x2={x} y2={250} className="kf-gridl" />)}
      {[0, 55, 125, 195, 250].map((y) => <line key={`gy${y}`} x1={0} y1={y} x2={400} y2={y} className="kf-gridl" />)}
      {/* start pose as a ghost, once the body has moved */}
      {phase !== 'set' && <polygon points={pts(outline({ x: 0, y: 0, th: 0 }))} className="kf-body ghost" />}
      {/* line of action and lever */}
      <polygon points={pts(outline(s))} className="kf-body" />
      <line x1={bodyPt(s, [-0.37, -0.6])[0]} y1={bodyPt(s, [-0.37, -0.6])[1]} x2={bodyPt(s, [-0.37, 0.6])[0]} y2={bodyPt(s, [-0.37, 0.6])[1]} className="kf-stripe" />
      {phase === 'set' && <line x1={line[0][0]} y1={line[0][1]} x2={line[1][0]} y2={line[1][1]} className="kf-guide line" />}
      {phase === 'set' && !straight && <line x1={foot[0]} y1={foot[1]} x2={toScreen(0, 0)[0]} y2={toScreen(0, 0)[1]} className="kf-lever" />}
      {trail.length > 1 && <polyline points={pts(trail.map((p) => toScreen(p.x, p.y)))} className="kf-trail" />}
      {/* centre of mass */}
      <g className="kf-cm"><line x1={cm[0] - 6} y1={cm[1] - 6} x2={cm[0] + 6} y2={cm[1] + 6} /><line x1={cm[0] - 6} y1={cm[1] + 6} x2={cm[0] + 6} y2={cm[1] - 6} /></g>
      {/* the force, with its tail at A */}
      <Arrow a={aS} b={tip} cls="kf-f" />
      <circle cx={aS[0]} cy={aS[1]} r={5.5} className="kf-pt solid" />
      {phase === 'set' && <circle cx={aS[0]} cy={aS[1]} r={17} className="kf-handle pt" />}
    </Frame>
  );
}
