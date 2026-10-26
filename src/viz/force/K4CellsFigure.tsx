import { useId, useMemo, useRef, useState } from 'react';
import { M } from '../../components/Tex';
import { useLang, useTr } from '../../i18n';
import { ROOF, roofCellAt, roofGrid, roofS, roofTotal, type RoofKind } from '../../physics/distributed';
import { KL, clamp, fmtSig, svgPoint, type V, type ViewBox } from './k34Common';

const t = String.raw;
const VB: ViewBox = [0, 0, 600, 330];
const X0 = 24, Y0 = 14, S = 70;            // roof corner (top left) and scale: px per metre
const SMAX = 2400;                          // N/m² at the top of the colour scale
const HS = [2, 1, 0.5, 0.25, 0.1, 0.01];
const px = (x: number, y: number): V => [X0 + S * x, Y0 + S * (ROOF.b - y)]; // metres (y up) → figure

const alpha = (s: number) => 0.07 + 0.88 * Math.min(1, s / SMAX);

/**
 * p. 32, Flächenkraftdichte: a roof under snow, s(x, y) in N/m². Cut it into squares of side h: every square carries ΔF.
 * Pick a point P: ΔF/ΔA of the square around P approaches s(P) when h shrinks, while ΔF itself goes to 0.
 * All squares together always give R = ∬ s dA.
 */
export function CellsFigure() {
  const tr = useTr(), lang = useLang();
  const [kind, setKind] = useState<RoofKind>('drift');
  const [h, setH] = useState(1);
  const [P, setP] = useState<V>([4.4, 2.2]);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef(false);
  const gid = useId().replace(/:/g, '');
  const gridH = Math.max(h, 0.25);
  const grid = useMemo(() => roofGrid(kind, gridH), [kind, gridH]);
  const R = useMemo(() => roofTotal(kind), [kind]);
  const cell = roofCellAt(kind, P, h);
  const nCells = Math.round((ROOF.a / h) * (ROOF.b / h));
  const fx = (x: number, d = 3) => fmtSig(x, d, lang);
  const kinds: { id: RoofKind; de: string; en: string }[] = [
    { id: 'flat', de: 'gleichmässig', en: 'even' }, { id: 'ramp', de: 'nach rechts mehr', en: 'more to the right' }, { id: 'drift', de: 'Schneewehe', en: 'snow drift' },
  ];
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current || !svg.current || e.buttons !== 1) return;
    const q = svgPoint(svg.current, VB, e);
    setP([clamp((q[0] - X0) / S, 0.001, ROOF.a - 0.001), clamp(ROOF.b - (q[1] - Y0) / S, 0.001, ROOF.b - 0.001)]);
  };
  const c0 = px(cell.i * h, (cell.j + 1) * h); // top-left corner of the marked square
  const pp = px(P[0], P[1]);
  const small = h * S < 9;
  return (
    <figure className="kf">
      <div className="kf-patch-row" role="group" aria-label={tr('Schneelast', 'snow load')}>
        {kinds.map((k) => <button key={k.id} type="button" className="kf-chip small" aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>{tr(k.de, k.en)}</button>)}
      </div>
      <div className="kf-fig" style={{ maxWidth: 720 }}>
        <svg ref={svg} viewBox={VB.join(' ')} onPointerMove={onMove} onPointerUp={() => { drag.current = false; }} onPointerCancel={() => { drag.current = false; }}
          role="img" aria-label={tr('Dach mit Schneelast, in Quadrate zerlegt; ein Punkt P ist ziehbar', 'Roof with snow load, cut into squares; a point P can be dragged')}>
          <defs>
            <linearGradient id={`g${gid}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="var(--c-force)" stopOpacity={alpha(0)} /><stop offset="1" stopColor="var(--c-force)" stopOpacity={alpha(SMAX)} />
            </linearGradient>
          </defs>
          <rect x={X0} y={Y0} width={S * ROOF.a} height={S * ROOF.b} fill="var(--panel)" />
          {Array.from({ length: grid.ny }, (_, j) => Array.from({ length: grid.nx }, (_, i) => {
            const dF = grid.dF[j * grid.nx + i], s = dF / (gridH * gridH);
            return <rect key={`${i}-${j}`} className={gridH >= 0.25 && h >= 0.25 ? 'kf-cell' : undefined} x={X0 + i * gridH * S} y={Y0 + (grid.ny - 1 - j) * gridH * S} width={gridH * S + 0.4} height={gridH * S + 0.4} fill="var(--c-force)" fillOpacity={alpha(s)} />;
          }))}
          <rect x={X0} y={Y0} width={S * ROOF.a} height={S * ROOF.b} fill="none" stroke="var(--muted)" strokeWidth={1.6} />
          {/* the square around P */}
          {small
            ? <circle className="kf-cellsel" cx={pp[0]} cy={pp[1]} r={9} />
            : <rect className="kf-cellsel" x={c0[0]} y={c0[1]} width={h * S} height={h * S} />}
          <circle className="kf-marker-ring" cx={pp[0]} cy={pp[1]} r={20} onPointerDown={(e) => { drag.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); }} />
          <circle className="kf-marker" cx={pp[0]} cy={pp[1]} r={5} onPointerDown={(e) => { drag.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); }} />
          {/* colour scale */}
          <rect x={500} y={Y0} width={20} height={S * ROOF.b} fill={`url(#g${gid})`} stroke="var(--muted)" strokeWidth={1} />
          {[0, 1200, 2400].map((v) => <line key={v} className="kf-tick" x1={520} y1={Y0 + S * ROOF.b * (1 - v / SMAX)} x2={526} y2={Y0 + S * ROOF.b * (1 - v / SMAX)} />)}
          {/* axis ticks */}
          {[0, 2, 4, 6].map((x) => <line key={x} className="kf-tick" x1={X0 + S * x} y1={Y0 + S * ROOF.b} x2={X0 + S * x} y2={Y0 + S * ROOF.b + 5} />)}
        </svg>
        <KL vb={VB} at={[pp[0] + 12, pp[1] - 14]} ink="point" anchor="l"><M>P</M></KL>
        {[0, 2, 4, 6].map((x) => <KL key={x} vb={VB} at={[X0 + S * x, Y0 + S * ROOF.b + 17]} ink="muted" className="small"><M>{x === 6 ? t`6\,\mathrm m` : String(x)}</M></KL>)}
        <KL vb={VB} at={[X0 + S * 3, Y0 + S * ROOF.b + 38]} ink="muted" className="small"><M>x</M></KL>
        <KL vb={VB} at={[510, Y0 - 1]} ink="muted" className="small" anchor="b"><M>{t`s`}</M></KL>
        {[0, 1200, 2400].map((v) => <KL key={v} vb={VB} at={[532, Y0 + S * ROOF.b * (1 - v / SMAX)]} ink="muted" anchor="l" className="small"><M>{v === 2400 ? t`2400\,\mathrm{N/m^2}` : String(v)}</M></KL>)}
      </div>
      <div className="kf-patch-row" role="group" aria-label={tr('Kantenlänge der Quadrate', 'side length of the squares')}>
        <span className="kf-cap" style={{ color: 'var(--muted)', alignSelf: 'center' }}>{tr('Quadrate mit Kante', 'squares with side')}</span>
        {HS.map((v) => <button key={v} type="button" className="kf-chip small" aria-pressed={h === v} onClick={() => setH(v)}><M>{t`h = ${fx(v, 2)}\,\mathrm m`}</M></button>)}
      </div>
      <div className="kf-readout">
        <div className="kf-sums">
          <div className="v-result"><M>{t`\Delta A = h^2 = ${fx(cell.dA, 3)}\,\mathrm{m^2}`}</M></div>
          <div className="v-result"><M>{t`\Delta F = ${fx(cell.dF, 4)}\,\mathrm N`}</M></div>
          <div className="v-result"><M>{t`\dfrac{\Delta F}{\Delta A} = ${fx(cell.ratio, 4)}\,\mathrm{N/m^2}`}</M></div>
          <div className="v-result"><M>{t`s(P) = ${fx(roofS(kind, P[0], P[1]), 4)}\,\mathrm{N/m^2}`}</M></div>
        </div>
        <div className="kf-sums">
          <div className="v-result pos"><M>{t`\sum \Delta F = R = \iint s\,\mathrm dA = ${fx(R / 1000, 4)}\,\mathrm{kN}`}</M> <span className="kf-empty">({tr(`alle ${nCells.toLocaleString('de-CH').replace(/’/g, ' ')} Quadrate zusammen`, `all ${nCells.toLocaleString('en')} squares together`)})</span></div>
        </div>
      </div>
    </figure>
  );
}
