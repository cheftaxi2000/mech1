import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { M } from '../../components/Tex';
import { T, fmtNum, useLang, useTr, type Lang } from '../../i18n';
import type { TestMotion } from '../../physics/statik';
import type { P2 } from '../anim/geometry';
import type { Scene } from '../anim/scene';
import { useInView, useReducedMotion } from '../figUtils';
import { SceneView, svgPoint } from '../force/K7Svg';
import {
  AXIS_PROOF, SH, SW, axisProofScene, axisScene, coupleScene, cube39Scene, cube43Scene, discScene, equivScene, groupMomentAnim,
  groupMomentScene, halfCircleAnim, halfCircleScene, linkageScene, momentPointScene, parallelScene, polygonScene, proofScene,
  seesawScene, singleForceScene, twoForcesScene, waageScene, type AxisPar, type Pf,
} from './statikScenes';
import '../force/K7.css';
import './statik.css';

const t = String.raw;

function Chips<K extends string>({ items, value, onPick, label }: { items: { id: K; label: ReactNode }[]; value: K; onPick: (k: K) => void; label: string }) {
  return <div className="v-presets" role="group" aria-label={label}>{items.map((it) => <button key={it.id} type="button" aria-pressed={value === it.id} onClick={() => onPick(it.id)}>{it.label}</button>)}</div>;
}
function Slider({ label, min, max, step, value, onChange, show }: { label: ReactNode; min: number; max: number; step: number; value: number; onChange: (v: number) => void; show: ReactNode }) {
  return <label className="slider"><span>{label}</span><input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} /><span className="val">{show}</span></label>;
}
const n1 = (x: number, lang: Lang, d = 1) => fmtNum(x, d, lang, true);

/** Generic renderer for a step-animation scene (used inside StepPlayer). */
export function StatikAnim({ build, step, t: tt, label, H = SH }: { build: (s: number, t: number, l: Lang) => Scene; step: number; t: number; label: string; H?: number }) {
  const lang = useLang();
  const scene = useMemo(() => build(step, tt, lang), [build, step, tt, lang]);
  return <SceneView scene={scene} W={SW} H={H} label={label} className="st-anim" />;
}
export const ProofFig = (p: { step: number; t: number }) => { const tr = useTr(); return <StatikAnim build={proofScene} {...p} label={tr('Beweis des Äquivalenzsatzes mit Testbewegungen', 'Proof of the equivalence theorem with test motions')} />; };
export const HalfCircleAnimFig = (p: { step: number; t: number }) => { const tr = useTr(); return <StatikAnim build={halfCircleAnim} {...p} H={320} label={tr('Resultierende einer Linienlast auf einem Halbkreis', 'Resultant of a line load on a half circle')} />; };
export const Cube39Fig = (p: { step: number; t: number }) => { const tr = useTr(); return <StatikAnim build={cube39Scene} {...p} label={tr('Würfel: Moment einer Kraft bezüglich O', 'Cube: moment of a force about O')} />; };
export const AxisProofFig = (p: { step: number; t: number }) => { const tr = useTr(); return <StatikAnim build={axisProofScene} {...p} label={tr('Moment bezüglich einer Achse: unabhängig von B', 'Moment about an axis: independent of B')} />; };
export const GroupMomentFig = (p: { step: number; t: number }) => { const tr = useTr(); return <StatikAnim build={groupMomentAnim} {...p} label={tr('Moment einer Kräftegruppe: Wechsel des Bezugspunktes', 'Moment of a group: change of reference point')} />; };
export const TwoForcesFig = (p: { step: number; t: number }) => { const tr = useTr(); return <StatikAnim build={twoForcesScene} {...p} label={tr('Zwei Kräfte in einer Ebene werden zu einer Einzelkraft', 'Two forces in a plane become a single force')} />; };
export const Cube43Fig = (p: { step: number; t: number }) => { const tr = useTr(); return <StatikAnim build={cube43Scene} {...p} label={tr('Würfel mit vier Kräften im Gleichgewicht', 'Cube with four forces in equilibrium')} />; };
export const WaageFig = (p: { step: number; t: number }) => { const tr = useTr(); return <StatikAnim build={waageScene} {...p} H={260} label={tr('Waage im Gleichgewicht: Lagerkräfte', 'Scale in equilibrium: support forces')} />; };

/* ---------------------------------------------------------------- p. 37 Wippe / Hebel */
export function SeesawExplorer() {
  const tr = useTr(), lang = useLang();
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<'wippe' | 'hebel'>('wippe');
  const [FA, setFA] = useState(2);
  const [a, setA] = useState(1.5);
  const [alpha, setAlpha] = useState(1.1);
  const [tilt, setTilt] = useState(0);
  const FB = 3, b = 1;
  const box = useRef<HTMLElement>(null);
  const visible = useInView(box);
  useEffect(() => {
    if (reduced || !visible) return;
    let raf = 0; const t0 = performance.now();
    const loop = (now: number) => { setTilt(0.06 * Math.sin((now - t0) / 500)); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced, visible]);
  const scene = seesawScene({ mode, FA, FB, a, b, alpha, tilt: reduced ? 0.05 : tilt }, lang);
  const bal = (b / a) * FB;
  return (
    <figure className="vdemo" ref={box}>
      <SceneView scene={scene} W={SW} H={260} label={tr('Wippe oder Hebel mit zwei Kräften und ihren Leistungen bei einer kleinen Drehung', 'Seesaw or lever with two forces and their powers during a small rotation')} />
      <figcaption className="vdemo-readout">
        <Chips label={tr('Form', 'Shape')} value={mode} onPick={setMode} items={[{ id: 'wippe', label: <T de="Wippe" en="Seesaw" /> }, { id: 'hebel', label: <T de="Hebel" en="Lever" /> }]} />
        <Slider label={<M>{t`F_A`}</M>} min={0.5} max={6} step={0.25} value={FA} onChange={setFA} show={<M>{n1(FA, lang, 2)}</M>} />
        <Slider label={<M>a</M>} min={0.5} max={2.2} step={0.05} value={a} onChange={setA} show={<M>{n1(a, lang, 2)}</M>} />
        {mode === 'hebel' && <Slider label={<M>\alpha</M>} min={0.3} max={2.8} step={0.05} value={alpha} onChange={setAlpha} show={<M>{t`${Math.round((alpha * 180) / Math.PI)}^\circ`}</M>} />}
        <button type="button" className="motion-btn" onClick={() => setFA(bal)}><T de={<>Gleichgewicht: <M>{t`F_A = \tfrac{b}{a}F_B`}</M></>} en={<>Equilibrium: <M>{t`F_A = \tfrac{b}{a}F_B`}</M></>} /></button>
        <p className="vdemo-note"><T
          de={<>Der Balken wackelt ein wenig: eine kleine, gedachte Drehung mit <M p=".">\omega</M> <M>{t`F_A`}</M> wird dabei angehoben (negative Leistung), <M>{t`F_B`}</M> sinkt (positive Leistung). Ist die Summe für jede solche Drehung null, ist die Wippe im Gleichgewicht.{mode === 'hebel' ? <> Beim Hebel kommt in beiden Leistungen derselbe Faktor <M>{t`\sin\alpha`}</M> vor; er kürzt sich weg.</> : null}</>}
          en={<>The beam wobbles a little: a small, imagined rotation with <M p=".">\omega</M> <M>{t`F_A`}</M> is lifted (negative power), <M>{t`F_B`}</M> goes down (positive power). If the sum is zero for every such rotation, the seesaw is in equilibrium.{mode === 'hebel' ? <> On the lever both powers contain the same factor <M p=";">{t`\sin\alpha`}</M> it cancels.</> : null}</>} /></p>
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- p. 37 Fig. 6.1 / 6.2 */
export function EquivExplorer() {
  const tr = useTr(), lang = useLang();
  const [fig, setFig] = useState<'61' | '62'>('61');
  const [motion, setMotion] = useState<TestMotion>('ty');
  const scene = equivScene(fig, motion, lang);
  return (
    <figure className="vdemo">
      <SceneView scene={scene} W={SW} H={SH} label={tr('Zwei Kräftegruppen am selben Balken und ihre Leistung bei einer Testbewegung', 'Two groups of forces on the same beam and their power for a test motion')} />
      <figcaption className="vdemo-readout">
        <Chips label={tr('Gruppe', 'Group')} value={fig} onPick={setFig} items={[{ id: '61', label: <T de="Figur 6.1" en="Fig. 6.1" /> }, { id: '62', label: <T de="Figur 6.2" en="Fig. 6.2" /> }]} />
        <Chips label={tr('Testbewegung', 'Test motion')} value={motion} onPick={setMotion} items={[
          { id: 'tx', label: <T de="in x-Richtung schieben" en="push in x-direction" /> }, { id: 'ty', label: <T de="in y-Richtung schieben" en="push in y-direction" /> },
          { id: 'rotA', label: <T de={<>drehen um <M>A</M></>} en={<>turn about <M>A</M></>} /> }, { id: 'rotP', label: <T de={<>drehen um <M>P</M></>} en={<>turn about <M>P</M></>} /> },
        ]} />
        <p className="vdemo-note"><T
          de={<>Oben die Gruppe <M p=",">{t`\{G\}`}</M> unten <M p=":">{t`\{G^*\}`}</M> nur die Resultierende in <M p=".">A</M> Die Pfeile an den Punkten sind die Geschwindigkeiten der gewählten Bewegung. Bei Figur 6.1 sind die Balken immer gleich hoch, bei Figur 6.2 genügt eine Bewegung mit verschiedener Leistung: Die Gruppen sind nicht äquivalent.</>}
          en={<>Top: the group <M p=",">{t`\{G\}`}</M> bottom: <M p=",">{t`\{G^*\}`}</M> only the resultant at <M p=".">A</M> The arrows at the points are the velocities of the chosen motion. In Fig. 6.1 the bars are always equal; in Fig. 6.2 one motion with different power is enough: the groups are not equivalent.</>} /></p>
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- shared drag helper */
function useDragPoints(points: P2[], set: (i: number, p: P2) => void, W: number, H: number, radius = 26) {
  const svgRef = useRef<SVGSVGElement>(null);
  const active = useRef<number | null>(null);
  const handlers = {
    onPointerDown: (e: React.PointerEvent) => {
      const p = svgPoint(svgRef.current!, W, H, e);
      let best = radius, k: number | null = null;
      points.forEach((q, i) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < best) { best = d; k = i; } });
      active.current = k;
      if (k !== null) (e.target as Element).setPointerCapture?.(e.pointerId);
    },
    onPointerMove: (e: React.PointerEvent) => { if (active.current === null) return; set(active.current, svgPoint(svgRef.current!, W, H, e)); },
    onPointerUp: () => { active.current = null; },
  };
  return { svgRef, handlers };
}

/* ---------------------------------------------------------------- p. 38 Fig. 6.3 */
const POLY0: Pf[] = [{ A: [70, 120], F: [-0.9, -1.6] }, { A: [110, 175], F: [0.6, -1.4] }, { A: [150, 90], F: [2.6, 0.3] }];
export function PolygonExplorer() {
  const tr = useTr(), lang = useLang();
  const [fs, setFs] = useState<Pf[]>(POLY0);
  const tips: P2[] = fs.map((f) => [f.A[0] + 32 * f.F[0], f.A[1] - 32 * f.F[1]]);
  const { svgRef, handlers } = useDragPoints(tips, (i, p) => setFs(fs.map((f, k) => (k === i ? { ...f, F: [(p[0] - f.A[0]) / 32, -(p[1] - f.A[1]) / 32] } : f))), SW, SH);
  const scene = polygonScene(fs, lang);
  const R = [scene.data.Rx, scene.data.Ry];
  return (
    <figure className="vdemo">
      <SceneView scene={scene} W={SW} H={SH} svgRef={svgRef} handlers={handlers} className="st-drag" label={tr('Drei Kräfte an einem Körper und ihr Kraftpolygon', 'Three forces on a body and their force polygon')}
        extra={tips.map((p, i) => <circle key={i} className="k7-handle" cx={p[0]} cy={p[1]} r={13} />)} />
      <figcaption className="vdemo-readout">
        <div className="v-result"><M>{t`\v R = \textstyle\sum\v F_i = (${n1(R[0], lang, 2)};\ ${n1(R[1], lang, 2)})`}</M></div>
        <button type="button" className="motion-btn" onClick={() => setFs(POLY0)}><T de="Zurücksetzen" en="Reset" /></button>
        <p className="vdemo-note"><T
          de={<>Ziehe an den Pfeilspitzen. Rechts werden die Kräfte Spitze an Ende gelegt; der schwarze Pfeil vom Anfang zum Ende ist <M p=".">{t`\v R`}</M> Wo die Kräfte am Körper angreifen, spielt dafür keine Rolle: <M>{t`\v R`}</M> ist ein freier Vektor.</>}
          en={<>Drag the arrow tips. On the right the forces are placed tip to tail; the black arrow from start to end is <M p=".">{t`\v R`}</M> Where the forces act on the body does not matter for this: <M>{t`\v R`}</M> is a free vector.</>} /></p>
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- p. 38 half circle */
export function HalfCircleExplorer() {
  const tr = useTr(), lang = useLang();
  const [n, setN] = useState(6);
  const scene = halfCircleScene(n, lang);
  return (
    <figure className="vdemo">
      <SceneView scene={scene} W={SW} H={320} label={tr('Linienlast auf einem Halbkreis, in n Stücke geteilt, und die Summe der Stücke', 'Line load on a half circle, split into n pieces, and their sum')} />
      <figcaption className="vdemo-readout">
        <Slider label={<M>n</M>} min={2} max={60} step={1} value={n} onChange={setN} show={<M>{String(n)}</M>} />
        <p className="vdemo-note"><T
          de={<>Die Last wird in <M>n</M> Stücke geteilt, jedes Stück ist eine kleine Kraft zum Mittelpunkt. Ihre Summe (schwarz) zeigt immer senkrecht nach unten: Die x-Anteile links und rechts heben sich auf. Mit wachsendem <M>n</M> nähert sich <M>{t`R_y`}</M> dem Wert <M p=".">{t`-2qr`}</M></>}
          en={<>The load is split into <M>n</M> pieces; each piece is a small force towards the centre. Their sum (black) always points straight down: the x-parts on the left and right cancel. As <M>n</M> grows, <M>{t`R_y`}</M> approaches <M p=".">{t`-2qr`}</M></>} /></p>
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- p. 39 moment about a point */
export function MomentPointExplorer() {
  const tr = useTr(), lang = useLang();
  const [s, setS] = useState(0);
  const [O, setO] = useState<P2>([0.6, 0.5]);
  const px = (p: P2): P2 => [40 + 50 * p[0], 260 - 50 * p[1]];
  const { svgRef, handlers } = useDragPoints([px(O)], (_i, p) => setO([Math.max(0, Math.min(7.5, (p[0] - 40) / 50)), Math.max(0, Math.min(5, (260 - p[1]) / 50))]), SW, SH);
  const scene = momentPointScene(O, s, lang);
  return (
    <figure className="vdemo">
      <SceneView scene={scene} W={SW} H={SH} svgRef={svgRef} handlers={handlers} className="st-drag" label={tr('Moment einer Kraft bezüglich O; A gleitet auf der Wirkungslinie', 'Moment of a force about O; A slides on the line of action')}
        extra={<circle className="k7-handle" cx={px(O)[0]} cy={px(O)[1]} r={13} />} />
      <figcaption className="vdemo-readout">
        <Slider label={<T de={<><M>A</M> verschieben</>} en={<>move <M>A</M></>} />} min={-1.6} max={1.6} step={0.02} value={s} onChange={setS} show={<M>{n1(s, lang, 2)}</M>} />
        <p className="vdemo-note"><T
          de={<>Schiebe <M>A</M> auf der Wirkungslinie: <M>{t`\v{OA}`}</M> ändert sich, das Moment nicht. Der Hebelarm <M>a</M> (grün) ist der senkrechte Abstand von <M>O</M> zur Linie, und der hängt nur von der Linie ab. Ziehe auch <M p=".">O</M></>}
          en={<>Slide <M>A</M> along the line of action: <M>{t`\v{OA}`}</M> changes, the moment does not. The lever arm <M>a</M> (green) is the perpendicular distance from <M>O</M> to the line, and it depends only on the line. Drag <M>O</M> too.</>} /></p>
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- p. 39–40 moment about an axis */
type AxisPreset = 'skew' | 'cubeL' | 'cubeR' | 'meets' | 'parallel';
const AXIS_PRESETS: Record<AxisPreset, AxisPar> = {
  skew: AXIS_PROOF,
  cubeL: { A: [1.5, 0, 0.0001], F: [0, 1.4, 1.2], zB: 0 },
  cubeR: { A: [1.5, 1.5, 0.0001], F: [0, 1.4, 1.2], zB: 0 },
  meets: { A: [1.6, 0, 0.9], F: [-1.4, 0, 1.2], zB: -0.6 },
  parallel: { A: [1.4, 0.8, 0.4], F: [0, 0, 1.8], zB: -0.6 },
};
export function AxisMomentExplorer() {
  const tr = useTr(), lang = useLang();
  const [pre, setPre] = useState<AxisPreset>('skew');
  const [zB, setZB] = useState(AXIS_PRESETS.skew.zB);
  const [split, setSplit] = useState(true);
  const p = { ...AXIS_PRESETS[pre], zB };
  const scene = axisScene(p, { split: split ? 1 : 0, lever: split ? 1 : 0 }, lang);
  return (
    <figure className="vdemo">
      <SceneView scene={scene} W={SW} H={SH} label={tr('Moment einer Kraft bezüglich der Achse gamma', 'Moment of a force about the axis gamma')} />
      <figcaption className="vdemo-readout">
        <Chips label={tr('Lage der Kraft', 'Position of the force')} value={pre} onPick={(k) => { setPre(k); setZB(AXIS_PRESETS[k].zB); }} items={[
          { id: 'skew', label: <T de="windschief" en="skew" /> }, { id: 'meets', label: <T de="schneidet die Achse" en="meets the axis" /> },
          { id: 'parallel', label: <T de="parallel" en="parallel" /> }, { id: 'cubeL', label: <T de="Würfel links" en="cube left" /> }, { id: 'cubeR', label: <T de="Würfel rechts" en="cube right" /> },
        ]} />
        <Slider label={<T de={<><M>B</M> auf der Achse</>} en={<><M>B</M> on the axis</>} />} min={-1.2} max={2.2} step={0.05} value={zB} onChange={setZB} show={<M>{n1(zB, lang, 2)}</M>} />
        <label className="toggle"><input type="checkbox" checked={split} onChange={(e) => setSplit(e.target.checked)} />{' '}<T de={<>Zerlegung <M>{t`\v F_\gamma + \v F^\perp`}</M> und Hebelarm <M>a</M></>} en={<>Split <M>{t`\v F_\gamma + \v F^\perp`}</M> and lever arm <M>a</M></>} /></label>
        <p className="vdemo-note"><T
          de={<>Schiebe <M>B</M> auf der Achse: <M>{t`M_\gamma`}</M> bleibt gleich. Nur <M>{t`\v F^\perp`}</M> (blau, senkrecht zur Achse) dreht um die Achse, <M>{t`\v F_\gamma`}</M> (gelb) zieht nur längs. Schneidet die Wirkungslinie die Achse oder ist sie parallel, ist <M p=".">{t`M_\gamma = 0`}</M></>}
          en={<>Slide <M>B</M> along the axis: <M>{t`M_\gamma`}</M> stays the same. Only <M>{t`\v F^\perp`}</M> (blue, normal to the axis) turns about the axis; <M>{t`\v F_\gamma`}</M> (yellow) only pulls along it. If the line of action meets the axis or is parallel to it, <M p=".">{t`M_\gamma = 0`}</M></>} /></p>
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- p. 40 group moment */
export function GroupMomentExplorer() {
  const tr = useTr(), lang = useLang();
  const [P, setP] = useState<P2>([4.6, 0.7]);
  const px = (p: P2): P2 => [40 + 60 * p[0], 270 - 60 * p[1]];
  const { svgRef, handlers } = useDragPoints([px(P)], (_i, q) => setP([Math.max(0.2, Math.min(6.0, (q[0] - 40) / 60)), Math.max(0.2, Math.min(4.0, (270 - q[1]) / 60))]), SW, SH);
  const scene = groupMomentScene(P, { tri: 1, R: 1, direct: 0.35 }, lang);
  return (
    <figure className="vdemo">
      <SceneView scene={scene} W={SW} H={SH} svgRef={svgRef} handlers={handlers} className="st-drag" label={tr('Moment einer Kräftegruppe bezüglich eines verschiebbaren Punktes P', 'Moment of a group of forces about a movable point P')}
        extra={<circle className="k7-handle" cx={px(P)[0]} cy={px(P)[1]} r={14} />} />
      <figcaption className="vdemo-readout">
        <p className="vdemo-note"><T
          de={<>Ziehe <M p=".">P</M> Rechts oben: <M>{t`M_O`}</M> (fest), der Zusatz <M>{t`(\v R\times\v{OP})_z`}</M> und ihre Summe <M>{t`M_P`}</M> (direkt aus allen Kräften gerechnet). Auf der Wirkungslinie von <M>{t`\v R`}</M> durch <M>O</M> ist der Zusatz null.</>}
          en={<>Drag <M p=".">P</M> Top right: <M>{t`M_O`}</M> (fixed), the extra term <M>{t`(\v R\times\v{OP})_z`}</M> and their sum <M>{t`M_P`}</M> (computed directly from all forces). On the line of action of <M>{t`\v R`}</M> through <M>O</M> the extra term is zero.</>} /></p>
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- p. 41 Fig. 6.8 */
export function SingleForceExplorer() {
  const tr = useTr(), lang = useLang();
  const [A2, setA2] = useState<P2>([3.4, 1.4]);
  const px = (p: P2): P2 => [40 + 60 * p[0], 270 - 60 * p[1]];
  const snap = (p: P2): P2 => { const A: P2 = [1.6, 2.0], F: P2 = [1.2, 0.5], l = Math.hypot(F[0], F[1]); const s = ((p[0] - A[0]) * F[0] + (p[1] - A[1]) * F[1]) / l / l; const q: P2 = [A[0] + s * F[0], A[1] + s * F[1]]; return Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.12 ? q : p; };
  const { svgRef, handlers } = useDragPoints([px(A2)], (_i, q) => setA2(snap([Math.max(0.2, Math.min(6.2, (q[0] - 40) / 60)), Math.max(0.2, Math.min(4.2, (270 - q[1]) / 60))])), SW, SH);
  const scene = singleForceScene(A2, lang);
  return (
    <figure className="vdemo">
      <SceneView scene={scene} W={SW} H={SH} svgRef={svgRef} handlers={handlers} className="st-drag" label={tr('Gleiche Einzelkraft an einem anderen Punkt: äquivalent nur auf der Wirkungslinie', 'The same single force at another point: equivalent only on the line of action')}
        extra={<circle className="k7-handle" cx={px(A2)[0]} cy={px(A2)[1]} r={14} />} />
      <figcaption className="vdemo-readout">
        <p className="vdemo-note"><T
          de={<>Ziehe <M p=".">{t`A'`}</M> Die Kraft <M>{t`\v F'`}</M> ist immer gleich gross und gleich gerichtet wie <M p=",">{t`\v F`}</M> also stimmt <M>{t`\v R`}</M> immer. Das Moment stimmt nur, wenn <M>{t`A'`}</M> auf der Wirkungslinie liegt (sie rastet ein).</>}
          en={<>Drag <M p=".">{t`A'`}</M> The force <M>{t`\v F'`}</M> always has the same size and direction as <M p=",">{t`\v F`}</M> so <M>{t`\v R`}</M> always matches. The moment matches only when <M>{t`A'`}</M> lies on the line of action (it snaps onto it).</>} /></p>
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- p. 41 Fig. 6.9 */
export function LinkageExplorer() {
  const tr = useTr(), lang = useLang();
  const reduced = useReducedMotion();
  const [th, setTh] = useState(1.2);
  const [play, setPlay] = useState(false);
  const box = useRef<HTMLElement>(null);
  const visible = useInView(box);
  useEffect(() => {
    if (!play || !visible) return;
    let raf = 0, last = performance.now();
    const loop = (now: number) => { const dt = (now - last) / 1000; last = now; setTh((x) => { const y = x + 0.6 * dt; return y > 2.2 ? 0.9 : y; }); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [play, visible]);
  const scene = linkageScene(th, lang);
  return (
    <figure className="vdemo" ref={box}>
      <SceneView scene={scene} W={SW} H={SH} label={tr('Parallelogramm-Mechanismus: dieselbe Kraft in O und in A', 'Parallelogram mechanism: the same force at O and at A')} />
      <figcaption className="vdemo-readout">
        <Slider label={<M>\theta</M>} min={0.9} max={2.2} step={0.01} value={th} onChange={setTh} show={<M>{t`${Math.round((th * 180) / Math.PI)}^\circ`}</M>} />
        {!reduced && <button type="button" className="motion-btn" onClick={() => setPlay(!play)}>{play ? tr('Anhalten', 'Pause') : tr('Bewegen', 'Move')}</button>}
        <p className="vdemo-note"><T
          de={<>Beide Kräfte liegen auf derselben Wirkungslinie (gestrichelt). An einem starren Körper wären sie äquivalent. Der Mechanismus ist aber nicht starr: <M>O</M> sitzt fest, die Kraft dort leistet nichts, in <M>A</M> leistet sie etwas. Darum darf man die Kraft hier nicht verschieben.</>}
          en={<>Both forces lie on the same line of action (dashed). On a rigid body they would be equivalent. But the mechanism is not rigid: <M>O</M> is fixed, the force there does no work, at <M>A</M> it does. So here the force must not be moved.</>} /></p>
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- p. 42 parallel forces → couple */
export function ParallelExplorer() {
  const tr = useTr(), lang = useLang();
  const [F2, setF2] = useState(1);
  const F1 = 2;
  const scene = parallelScene(F1, F2, lang);
  return (
    <figure className="vdemo">
      <SceneView scene={scene} W={SW} H={SH} label={tr('Zwei parallele Kräfte und ihre Resultierende; bei entgegengesetzt gleichen Kräften ein Kräftepaar', 'Two parallel forces and their resultant; for opposite equal forces a couple')} />
      <figcaption className="vdemo-readout">
        <Slider label={<M>{t`F_2`}</M>} min={-3} max={3} step={0.1} value={F2} onChange={setF2} show={<M>{n1(F2, lang, 1)}</M>} />
        <div className="v-presets">
          <button type="button" onClick={() => setF2(1)}><M>{t`F_2 = \tfrac12 F_1`}</M></button>
          <button type="button" onClick={() => setF2(2)}><M>{t`F_2 = F_1`}</M></button>
          <button type="button" onClick={() => setF2(-2)}><M>{t`F_2 = -F_1`}</M></button>
        </div>
        <p className="vdemo-note"><T
          de={<>Die Resultierende sitzt dort, wo <M p=",">{t`F_1 a = F_2 b`}</M> näher bei der grösseren Kraft. Zieh <M>{t`F_2`}</M> in die Gegenrichtung: <M>{t`\v R`}</M> wird kürzer und wandert immer weiter hinaus. Bei <M>{t`F_2 = -F_1`}</M> gibt es keine Einzelkraft mehr, nur noch ein Kräftepaar.</>}
          en={<>The resultant sits where <M p=",">{t`F_1 a = F_2 b`}</M> closer to the larger force. Turn <M>{t`F_2`}</M> the other way: <M>{t`\v R`}</M> gets shorter and moves further and further out. At <M>{t`F_2 = -F_1`}</M> there is no single force any more, only a couple.</>} /></p>
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- p. 43 Fig. 6.16 couples */
export function CoupleExplorer() {
  const tr = useTr(), lang = useLang();
  const [c, setC] = useState(2);
  const [th, setTh] = useState(0.6);
  const scene = coupleScene(c, th, lang);
  return (
    <figure className="vdemo">
      <SceneView scene={scene} W={SW} H={240} label={tr('Zwei statisch äquivalente Kräftepaare', 'Two statically equivalent couples')} />
      <figcaption className="vdemo-readout">
        <Slider label={<M>c</M>} min={0.6} max={3} step={0.05} value={c} onChange={setC} show={<M>{n1(c, lang, 2)}</M>} />
        <Slider label={<M>\theta</M>} min={-1.5} max={1.5} step={0.02} value={th} onChange={setTh} show={<M>{t`${Math.round((th * 180) / Math.PI)}^\circ`}</M>} />
        <p className="vdemo-note"><T
          de={<>Rechts das blaue Paar: <M>c</M>-mal stärkere Kräfte im <M>c</M>-mal kleineren Abstand, beliebig gedreht und verschoben. Das Moment <M>{t`b\,|\v F|`}</M> bleibt gleich, also sind die Paare äquivalent.</>}
          en={<>On the right the blue couple: <M>c</M> times stronger forces at a <M>c</M> times smaller distance, turned and moved at will. The moment <M>{t`b\,|\v F|`}</M> stays the same, so the couples are equivalent.</>} /></p>
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- p. 44 Fig. 6.23 */
export function DiscFigure() {
  const tr = useTr(), lang = useLang();
  const [poly, setPoly] = useState(true);
  const scene = discScene(poly, lang);
  return (
    <figure className="vdemo">
      <SceneView scene={scene} W={SW} H={SH} label={tr('Scheibe zwischen zwei schrägen Wänden mit drei Lasten; Kraftpolygon', 'Disc between two inclined walls with three loads; force polygon')} />
      <figcaption className="vdemo-readout">
        <label className="toggle"><input type="checkbox" checked={poly} onChange={(e) => setPoly(e.target.checked)} />{' '}<T de="Kraftpolygon zeigen" en="Show the force polygon" /></label>
        <p className="vdemo-note"><T
          de={<>Alle Wirkungslinien gehen durch den Mittelpunkt, also gibt es kein Moment. Es bleiben zwei Komponentenbedingungen für die zwei Unbekannten <M>A</M> und <M p=".">B</M> Im Gleichgewicht schliesst sich das Kraftpolygon.</>}
          en={<>All lines of action pass through the centre, so there is no moment. Two component conditions remain for the two unknowns <M>A</M> and <M p=".">B</M> In equilibrium the force polygon closes.</>} /></p>
      </figcaption>
    </figure>
  );
}
