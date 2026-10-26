import { useRef, useState } from 'react';
import { M } from '../../components/Tex';
import { actsAlongConnection } from '../../physics/force';
import { fmtNum, useLang, useTr } from '../../i18n';
import { Arrow, Frame, KLabel, svgPt, t } from './kfKit';
import { fernPair, phys, snapA2, type V } from './k2Geom';

const VB: [number, number, number, number] = [0, 0, 480, 290];
const R1 = 9, R2 = 14; // radii of the two discs (A₁ small, A₂ large, as in the lecture's figure)
const X: [number, number] = [70, 410], Y: [number, number] = [70, 222];
const clampP = (p: V): V => [Math.max(X[0], Math.min(X[1], p[0])), Math.max(Y[0], Math.min(Y[1], p[1]))];
const TILT = (38 * Math.PI) / 180;

/**
 * Lecture p. 30: the Reaktionsprinzip with the Zusatzpostulat. Two material points A₁, A₂; drag them.
 * Apart: force and counter-force lie on the line through A₁ and A₂ (Fernkraft). Dragged together they coincide
 * (A₁(t₀) = A₂(t₀), Kontaktkraft): there is no connecting line, and the direction is free (drag the arrow tip).
 * «Verbotene Variante»: the same equal-and-opposite pair, but tilted off the connecting line.
 */
export function K2Fern() {
  const tr = useTr(), lang = useLang();
  const [A1, setA1] = useState<V>([140, 165]);
  const [A2, setA2] = useState<V>([350, 120]);
  const [mag, setMag] = useState(6);
  const [attractive, setAttractive] = useState(true);
  const [tilted, setTilted] = useState(false);
  const [angle, setAngle] = useState(-Math.PI / 2 + 0.4); // direction of F on A₂ in contact (screen angle)
  const drag = useRef<'A1' | 'A2' | 'dir' | null>(null);
  const svg = useRef<SVGSVGElement>(null);

  const contact = Math.hypot(A2[0] - A1[0], A2[1] - A1[1]) < 1e-6;
  const d = Math.hypot(A2[0] - A1[0], A2[1] - A1[1]);
  const len = 24 + 5.5 * mag;
  const lenEff = contact ? len : Math.max(14, Math.min(len, attractive ? d / 2 - R2 - 6 : len));
  const pair = contact
    ? { onA2: [Math.cos(angle) * len, Math.sin(angle) * len] as V, onA1: [-Math.cos(angle) * len, -Math.sin(angle) * len] as V }
    : fernPair(A1, A2, lenEff, attractive, tilted ? TILT : 0);
  const onLine = contact ? null : actsAlongConnection(phys(A1), phys(A2), phys(pair.onA2), 1e-6);
  const plus = (p: V, v: V): V => [p[0] + v[0], p[1] + v[1]];

  const onDown = (e: React.PointerEvent) => {
    if (!svg.current) return;
    const q = svgPt(svg.current, VB, e);
    const dist = (p: V) => Math.hypot(q[0] - p[0], q[1] - p[1]);
    const tip = plus(A2, pair.onA2);
    if (contact && dist(tip) < 26) drag.current = 'dir';
    else if (dist(A2) < 30 && dist(A2) <= dist(A1) + 1e-9) drag.current = 'A2';
    else if (dist(A1) < 26) drag.current = 'A1';
    else if (dist(A2) < 30) drag.current = 'A2';
    else drag.current = null;
    if (drag.current) (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const w = drag.current;
    if (!w || !svg.current) return;
    const q = clampP(svgPt(svg.current, VB, e));
    if (w === 'dir') { setAngle(Math.atan2(q[1] - A2[1], q[0] - A2[0])); return; }
    const other = w === 'A2' ? A1 : A2;
    const s = snapA2(other, q);
    // when the two points coincide and one of them is dragged away, the dragged one leaves first
    if (w === 'A2') setA2(s.A2); else setA1(s.A2);
  };
  const onUp = () => { drag.current = null; };

  const lineEnds = (() => {
    const u: V = [(A2[0] - A1[0]) / (d || 1), (A2[1] - A1[1]) / (d || 1)];
    return [[A1[0] - 300 * u[0], A1[1] - 300 * u[1]], [A2[0] + 300 * u[0], A2[1] + 300 * u[1]]] as const;
  })();
  const tip2 = plus(A2, pair.onA2), tip1 = plus(A1, pair.onA1);
  // label beside the middle of an arrow, on the upper side
  const lab = (from: V, to: V, k = 22): V => {
    const dx = to[0] - from[0], dy = to[1] - from[1], n = Math.hypot(dx, dy) || 1;
    let nx = -dy / n, ny = dx / n;
    if (ny > 0 || (ny === 0 && nx < 0)) { nx = -nx; ny = -ny; }
    return [from[0] + dx / 2 + k * nx, from[1] + dy / 2 + k * ny];
  };
  const l2 = lab(A2, tip2), l1 = lab(A1, tip1);

  return (
    <Frame vb={VB} svgRef={svg} label={tr('Zwei materielle Punkte, ziehbar: Kraft und Gegenkraft', 'Two material points, draggable: force and counter-force')}
      svgProps={{ onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: onUp } as React.SVGProps<SVGSVGElement>}
      labels={<>
        <KLabel vb={VB} x={l2[0]} y={l2[1]} ink="force">{t`\{A_2\,|\,\v F\}`}</KLabel>
        <KLabel vb={VB} x={l1[0]} y={l1[1]} ink="force">{t`\{A_1\,|\,-\v F\}`}</KLabel>
        {!contact && <KLabel vb={VB} x={A1[0] - 8} y={A1[1] + 28} ink="point">{t`A_1`}</KLabel>}
        {!contact && <KLabel vb={VB} x={A2[0] + 2} y={A2[1] + 36} ink="point">{t`A_2`}</KLabel>}
        {contact && (() => { let nx = -Math.sin(angle), ny = Math.cos(angle); if (ny < 0) { nx = -nx; ny = -ny; } return <KLabel vb={VB} x={A1[0] + 34 * nx} y={A1[1] + 34 * ny} ink="point">{t`A_1 = A_2`}</KLabel>; })()}
      </>}
      caption={<>
        <div className="kf-ctl">
          <div className="row" role="group" aria-label={tr('Art der Kraft', 'Kind of force')}>
            <button type="button" className="kf-chip" aria-pressed={attractive} onClick={() => setAttractive(true)}>{tr('anziehend', 'attracting')}</button>
            <button type="button" className="kf-chip" aria-pressed={!attractive} onClick={() => setAttractive(false)}>{tr('abstossend', 'repelling')}</button>
          </div>
          <label className="slider wide-slider"><span><M>{t`|\v F|`}</M></span>
            <input type="range" min={1} max={10} step={1} value={mag} onChange={(e) => setMag(+e.target.value)} aria-label={tr('Stärke der Kraft', 'Strength of the force')} />
            <span className="val">{fmtNum(mag, 0, lang)} N</span></label>
          <label className="kf-check"><input type="checkbox" checked={tilted && !contact} disabled={contact} onChange={(e) => setTilted(e.target.checked)} />{tr('Variante: Paar schief zur Verbindungsgeraden', 'variant: pair tilted off the connecting line')}</label>
          <div className="row"><button type="button" className="kf-chip" onClick={() => { setA1([140, 165]); setA2([350, 120]); setTilted(false); setAttractive(true); setMag(6); }}>{tr('Zurücksetzen', 'Reset')}</button></div>
        </div>
        <div className="kf-read" role="status">
          <div className="big">
            {contact
              ? <><M>{t`A_1(t_0) = A_2(t_0)`}</M>{' – '}<b>{tr('Kontaktkraft', 'contact force')}</b></>
              : <><M>{t`A_1(t_0) \neq A_2(t_0)`}</M>{' – '}<b>{tr('Fernkraft', 'force at a distance')}</b></>}
          </div>
          {contact
            ? <div>{tr('Die beiden Punkte fallen zusammen: Es gibt keine Verbindungsgerade mehr. Das Zusatzpostulat fordert hier nichts; die Richtung der Kraft ist frei (zieh an der Pfeilspitze).', 'The two points coincide: there is no connecting line any more. The additional postulate asks nothing here; the direction of the force is free (drag the arrow tip).')}</div>
            : <div>{onLine
              ? <>{tr('Kraft und Gegenkraft liegen auf der Geraden durch ', 'Force and counter-force lie on the line through ')}<M>{t`A_1`}</M>{tr(' und ', ' and ')}<M p="">{t`A_2`}</M>{' '}<span className="ok-mark"><M>{t`\checkmark`}</M></span></>
              : <b className="bad">{tr('Gleich gross und entgegengesetzt, aber nicht auf der Verbindungsgeraden: Das schliesst das Zusatzpostulat aus.', 'Equal and opposite, but not on the connecting line: the additional postulate rules this out.')}</b>}</div>}
          <div className="kf-note">{tr('Zieh die zwei Punkte aufeinander zu, bis sie einrasten, und wieder auseinander.', 'Drag the two points towards each other until they snap together, and apart again.')}</div>
        </div>
      </>}>
      {!contact && <line x1={lineEnds[0][0]} y1={lineEnds[0][1]} x2={lineEnds[1][0]} y2={lineEnds[1][1]} className="kf-guide line" />}
      {!contact && tilted && <>
        <line x1={A2[0] - 300 * Math.cos(Math.atan2(pair.onA2[1], pair.onA2[0]))} y1={A2[1] - 300 * Math.sin(Math.atan2(pair.onA2[1], pair.onA2[0]))} x2={A2[0] + 300 * Math.cos(Math.atan2(pair.onA2[1], pair.onA2[0]))} y2={A2[1] + 300 * Math.sin(Math.atan2(pair.onA2[1], pair.onA2[0]))} className="kf-guide" />
        <line x1={A1[0] - 300 * Math.cos(Math.atan2(pair.onA1[1], pair.onA1[0]))} y1={A1[1] - 300 * Math.sin(Math.atan2(pair.onA1[1], pair.onA1[0]))} x2={A1[0] + 300 * Math.cos(Math.atan2(pair.onA1[1], pair.onA1[0]))} y2={A1[1] + 300 * Math.sin(Math.atan2(pair.onA1[1], pair.onA1[0]))} className="kf-guide" />
      </>}
      <circle cx={A1[0]} cy={A1[1]} r={R1} className="kf-body" />
      <circle cx={A2[0]} cy={A2[1]} r={R2} className="kf-body" />
      <Arrow a={A2} b={tip2} cls="kf-f" />
      <Arrow a={A1} b={tip1} cls="kf-f" />
      <circle cx={A1[0]} cy={A1[1]} r={4.5} className="kf-pt solid" />
      <circle cx={A2[0]} cy={A2[1]} r={4.5} className="kf-pt solid" />
      <circle cx={A2[0]} cy={A2[1]} r={R2 + 6} className="kf-handle pt" opacity={contact ? 0 : 0.8} />
      <circle cx={A1[0]} cy={A1[1]} r={R1 + 6} className="kf-handle pt" opacity={contact ? 0 : 0.8} />
      {contact && <circle cx={tip2[0]} cy={tip2[1]} r={14} className="kf-handle" />}
      {contact && <circle cx={A2[0]} cy={A2[1]} r={R2 + 8} className="kf-handle pt" opacity={0.7} />}
    </Frame>
  );
}
