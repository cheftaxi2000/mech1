import { Line } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { M } from '../../components/Tex';
import { T, useTr } from '../../i18n';
import { eqTex } from '../../linalg/lines2';
import { Scene } from '../Scene';
import { Axes, C, Dot, Label } from '../primitives';
import { FullscreenButton, useFullscreen } from '../useFullscreen';
import {
  BOX, PLANE_PRESETS, SIMPLIFY_EQS, SIMPLIFY_NEW, commonSet, labelSpots, lerpPlane, lineInBox, noneReason, pairRelation, planePolygon,
  type Common, type Plane, type V3,
} from './planesGeom';
import './l12.css';

const t = String.raw;
/** plane hues (the scene background is light in both themes, so fixed colours) and the matching CSS variables for the legend */
const CAMERA: V3 = [17, -17, 12];
const HUE = ['#2563eb', '#db2777', '#0d9488', '#9333ea'];
const CSSHUE = ['var(--a-f)', 'var(--a-g)', 'var(--a-sec)', 'var(--a-asym)'];

function PlaneMesh({ plane, color, shift = 0, label, at }: { plane: Plane; color: string; shift?: number; label: string; at: V3 | null }) {
  const poly = useMemo(() => {
    const n = Math.hypot(plane[0], plane[1], plane[2]) || 1;
    return planePolygon(plane).map((p) => [p[0] + (shift * plane[0]) / n, p[1] + (shift * plane[1]) / n, p[2] + (shift * plane[2]) / n] as V3);
  }, [plane, shift]);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    if (poly.length < 3) return g;
    const pos: number[] = [];
    for (let i = 1; i < poly.length - 1; i++) pos.push(...poly[0], ...poly[i], ...poly[i + 1]);
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }, [poly]);
  useEffect(() => () => geo.dispose(), [geo]);
  if (poly.length < 3) return null;
  return (
    <group>
      <mesh geometry={geo} renderOrder={1}>
        <meshBasicMaterial color={color} transparent opacity={0.26} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <Line points={[...poly, poly[0]] as [number, number, number][]} color={color} lineWidth={1.6} />
      {at && <Label at={at} color={color} sub={label.slice(-1)} size={0.05}>E</Label>}
    </group>
  );
}

function BoxFrame() {
  const R = BOX;
  const edges = useMemo(() => {
    const out: [number, number, number][][] = [];
    for (const a of [-R, R]) for (const b of [-R, R]) out.push([[-R, a, b], [R, a, b]], [[a, -R, b], [a, R, b]], [[a, b, -R], [a, b, R]]);
    return out;
  }, [R]);
  return <group>{edges.map((e, i) => <Line key={i} points={e} color="#cbd2dc" lineWidth={1} />)}</group>;
}

/** 0 → 1 over `ms` whenever `key` changes (instantly under reduced motion). */
function useTween(key: string, ms = 1100) {
  const [u, setU] = useState(1);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) { setU(1); return; }
    let raf = 0; const t0 = performance.now();
    const tick = (now: number) => { const v = Math.min(1, (now - t0) / ms); setU(v * v * (3 - 2 * v)); if (v < 1) raf = requestAnimationFrame(tick); };
    setU(0); raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [key, ms]);
  return u;
}

type Tab = 'point' | 'parallel' | 'twoParallel' | 'same' | 'line' | 'prism' | 'simplify';
const VARS = ['x', 'y', 'z'];
const fmtCoord = (x: number) => {
  for (let d = 1; d <= 12; d++) { const n = Math.round(x * d); if (Math.abs(n / d - x) < 1e-9) return d === 1 ? String(n) : `${n < 0 ? '-' : ''}\\tfrac{${Math.abs(n)}}{${d}}`; }
  return x.toFixed(2);
};

export function PlanesExplorer() {
  const tr = useTr();
  const [figRef, full, toggleFull] = useFullscreen();
  const [tab, setTab] = useState<Tab>('point');
  const [stage, setStage] = useState(0); // simplification: 0 three planes, 1 eq₄ added, 2 eq₃ replaced by eq₄
  const u = useTween(`${tab}-${stage}`);

  // planes on screen: [equation, colour index, name]
  let shown: { p: Plane; hue: number; name: string }[];
  if (tab === 'simplify') {
    shown = [{ p: SIMPLIFY_EQS[0], hue: 0, name: 'E1' }, { p: SIMPLIFY_EQS[1], hue: 1, name: 'E2' }];
    if (stage < 2) shown.push({ p: SIMPLIFY_EQS[2], hue: 2, name: 'E3' });
    if (stage >= 1) shown.push({ p: stage === 1 ? lerpPlane(SIMPLIFY_EQS[2], SIMPLIFY_NEW, u) : SIMPLIFY_NEW, hue: 3, name: 'E4' });
  } else {
    shown = PLANE_PRESETS.find((p) => p.id === tab)!.eqs.map((p, i) => ({ p, hue: i, name: `E${i + 1}` }));
  }
  // verdict from the exact equations (not the tweened plane)
  const exact: Plane[] = tab === 'simplify'
    ? [SIMPLIFY_EQS[0], SIMPLIFY_EQS[1], ...(stage < 2 ? [SIMPLIFY_EQS[2]] : []), ...(stage >= 1 ? [SIMPLIFY_NEW] : [])]
    : shown.map((s) => s.p);
  const common: Common = commonSet(exact);
  const shifts = shown.map((s, i) => shown.slice(0, i).filter((o) => pairRelation(o.p, s.p) === 'same').length * 0.07);
  const seg = common.kind === 'line' ? lineInBox(common.p, common.d) : null;
  const spots = labelSpots(shown.map((s) => planePolygon(s.p)), [[0, 0, 0], ...(common.kind === "point" ? [common.p] : [])], CAMERA);
  const h = 460;

  const tabs: { id: Tab; label: ReactNode }[] = [
    { id: 'point', label: tr('ein Punkt', 'one point') },
    { id: 'parallel', label: tr('drei parallel', 'three parallel') },
    { id: 'twoParallel', label: tr('zwei parallel', 'two parallel') },
    { id: 'same', label: tr('dreimal dieselbe', 'three times the same') },
    { id: 'line', label: tr('eine Gerade', 'a line') },
    { id: 'prism', label: tr('Prisma (Ergänzung)', 'prism (supplement)') },
    { id: 'simplify', label: tr('Vereinfachen', 'Simplify') },
  ];
  const eqRow = (s: { p: Plane; hue: number; name: string }, i: number) => {
    const ex = tab === 'simplify' && s.name === 'E4' ? SIMPLIFY_NEW : s.p;
    return (
      <div key={i}><span className="l12-swatch" style={{ background: CSSHUE[s.hue] }} /><M>{t`E_${s.name.slice(1)}:\ ${eqTex(ex.slice(0, 3), ex[3], VARS)}`}</M>
        {tab === 'simplify' && s.name === 'E4' && <>&nbsp;<M>{t`(= E_3 - E_2)`}</M></>}</div>
    );
  };

  return (
    <figure className={`explorer l12-planes${full ? ' is-full' : ''}`} ref={figRef}>
      <div className="tabs" role="tablist">
        {tabs.map((b) => (
          <button key={b.id} role="tab" aria-selected={tab === b.id} className={tab === b.id ? 'active' : ''} onClick={() => { setTab(b.id); setStage(0); }}>{b.label}</button>
        ))}
      </div>
      <div className="stage">
        <Scene height={full ? '100%' : h} camera={CAMERA} target={[0, 0, 0]}>
          <BoxFrame />
          <Axes size={6.2} />
          {shown.map((s, i) => <PlaneMesh key={`${tab}-${s.name}`} plane={s.p} color={HUE[s.hue]} shift={shifts[i]} label={s.name} at={spots[i]} />)}
          {common.kind === 'point' && <Dot at={common.p} color={C.point} r={0.3} />}
          {seg && <Line points={seg as [number, number, number][]} color={C.r} lineWidth={5} />}
        </Scene>
        <FullscreenButton full={full} onClick={toggleFull} />
      </div>
      <div className="side">
        <div className="controls">
          {tab === 'simplify' && (
            <div className="v-presets" role="group" aria-label={tr('Schritte der Vereinfachung', 'Steps of the simplification')}>
              {[tr('1. drei Ebenen', '1. three planes'), <>{tr('2. neue Ebene', '2. new plane')} <M>{'E_4'}</M></>, <>{tr('3. ', '3. ')}<M>{'E_3'}</M> {tr('ersetzt', 'replaced')}</>].map((l, i) => (
                <button key={i} type="button" aria-pressed={stage === i} onClick={() => setStage(i)}>{l}</button>
              ))}
            </div>
          )}
          <div className="l12-eqs">{shown.map(eqRow)}</div>
          <div className={`l12-verdict ${common.kind === 'point' ? 'one' : common.kind === 'none' ? 'none' : 'many'}`}>
            {common.kind === 'point' && <T
              de={<><b>Genau eine Lösung:</b> der rote Punkt <M p=".">{t`(${common.p.map(fmtCoord).join(',\\ ')})`}</M></>}
              en={<><b>Exactly one solution:</b> the red point <M p=".">{t`(${common.p.map(fmtCoord).join(',\\ ')})`}</M></>} />}
            {common.kind === 'line' && <T
              de={<><b>Unendlich viele Lösungen, aber auf einer Geraden</b> (dunkel): <M p=",">{t`x = ${fmtCoord(common.p[0])}`}</M> <M p=",">{t`y = ${fmtCoord(common.p[1])}`}</M> <M>z</M> beliebig.</>}
              en={<><b>Infinitely many solutions, but on a line</b> (dark): <M p=",">{t`x = ${fmtCoord(common.p[0])}`}</M> <M p=",">{t`y = ${fmtCoord(common.p[1])}`}</M> <M>z</M> arbitrary.</>} />}
            {common.kind === 'plane' && <T
              de={<><b>Unendlich viele Lösungen:</b> alle drei Gleichungen sind dieselbe Ebene (Vielfache voneinander). Jeder Punkt dieser Ebene ist eine Lösung.</>}
              en={<><b>Infinitely many solutions:</b> all three equations are the same plane (multiples of each other). Every point of this plane is a solution.</>} />}
            {common.kind === 'none' && shown.length === 3 && (() => {
              const why = noneReason(exact as [Plane, Plane, Plane]);
              return why === 'allParallel'
                ? <T de={<><b>Keine Lösung:</b> die drei Ebenen sind parallel, keine zwei berühren sich.</>} en={<><b>No solution:</b> the three planes are parallel, no two of them touch.</>} />
                : why === 'twoParallel'
                  ? <T de={<><b>Keine Lösung:</b> <M>{'E_1'}</M> und <M>{'E_2'}</M> sind parallel. <M>{'E_3'}</M> schneidet beide, aber in zwei verschiedenen Geraden.</>} en={<><b>No solution:</b> <M>{'E_1'}</M> and <M>{'E_2'}</M> are parallel. <M>{'E_3'}</M> cuts both, but in two different lines.</>} />
                  : <T de={<><b>Keine Lösung:</b> je zwei Ebenen schneiden sich, aber die drei Schnittgeraden sind parallel und treffen sich nie.</>} en={<><b>No solution:</b> every two planes cut, but the three cut lines are parallel and never meet.</>} />;
            })()}
          </div>
          {tab === 'simplify' && <p className="l12-note">{stage === 0
            ? tr('Drei schräge Ebenen; der gemeinsame Punkt ist schwer abzulesen.', 'Three tilted planes; the common point is hard to read off.')
            : stage === 1
              ? <T de={<><M>{'E_4 = E_3 - E_2'}</M> ist waagrecht, <M p=",">{t`z = \tfrac{4}{3}`}</M> und geht durch denselben Punkt.</>} en={<><M>{'E_4 = E_3 - E_2'}</M> is horizontal, <M p=",">{t`z = \tfrac{4}{3}`}</M> and passes through the same point.</>} />
              : <T de={<>Ersetzt man <M>{'E_3'}</M> durch <M p=",">{'E_4'}</M> bleibt der Schnittpunkt derselbe, und <M>z</M> lässt sich direkt ablesen.</>} en={<>Replacing <M>{'E_3'}</M> by <M p=",">{'E_4'}</M> the intersection stays the same, and <M>z</M> can be read off directly.</>} />}</p>}
          {tab === 'prism' && <p className="l12-note">{tr('Dieses Beispiel ist nicht auf den Folien; es zeigt den dritten Fall ohne Lösung.', 'This example is not on the slides; it shows the third case without a solution.')}</p>}
        </div>
        <figcaption>{tr('Jede Ebene ist nur innerhalb des Würfels gezeichnet. Seitlich ziehen dreht die Ansicht.', 'Each plane is drawn only inside the cube. Drag sideways to turn the view.')}</figcaption>
      </div>
    </figure>
  );
}
