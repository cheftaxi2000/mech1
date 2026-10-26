import { useMemo, useRef, useState, type ReactNode } from 'react';
import { M } from '../../components/Tex';
import { useLang, useTr } from '../../i18n';
import { H_MAX, SOIL, cubeAt, densitySeries, soilRho } from '../../physics/distributed';
import { KL, KSlider, clamp, fmtSig, svgPoint, type V, type ViewBox } from './k34Common';

const t = String.raw;
const VB: ViewBox = [0, 0, 420, 300];
const X0 = 30, Y0 = 14, S = 90;
const N = 40, M2 = 30;                                     // heat-map cells
const toFig = (x: number, z: number): V => [X0 + S * x, Y0 + S * (SOIL.Z - z)];
const RHO_LO = 1800, RHO_HI = 2700;

/** h from the slider position u ∈ [0, 1]: 1 mm … 2 m, logarithmic. */
export const hOfU = (u: number) => H_MAX * 10 ** (-3.3 * (1 - u));
export const uOfH = (h: number) => 1 + Math.log10(h / H_MAX) / 3.3;
export function fmtLen(h: number, lang: 'de' | 'en'): string {
  if (h >= 0.95) return `${fmtSig(h, 2, lang)}\\,\\mathrm m`;
  if (h >= 0.0095) return `${fmtSig(h * 100, 2, lang)}\\,\\mathrm{cm}`;
  return `${fmtSig(h * 1000, 2, lang)}\\,\\mathrm{mm}`;
}

/** A tiny line plot in its own SVG with HTML (KaTeX) tick labels. */
function Plot({ vb, d, refY, cursor, xTicks, yTicks, children }: {
  vb: ViewBox; d: string; refY?: number; cursor: V; xTicks: { x: number; tex: string }[]; yTicks: { y: number; tex: string }[]; children?: ReactNode;
}) {
  const [x0, y0, w, h] = vb;
  return (
    <div className="kf-fig">
      <svg viewBox={vb.join(' ')} aria-hidden="true">
        <line className="kf-axis" x1={x0 + 44} y1={y0 + h - 30} x2={x0 + w - 10} y2={y0 + h - 30} />
        <line className="kf-axis" x1={x0 + 44} y1={y0 + h - 30} x2={x0 + 44} y2={y0 + 10} />
        {xTicks.map((k) => <line key={k.x} className="kf-tick" x1={k.x} y1={y0 + h - 30} x2={k.x} y2={y0 + h - 24} />)}
        {yTicks.map((k) => <line key={k.y} className="kf-tick" x1={x0 + 38} y1={k.y} x2={x0 + 44} y2={k.y} />)}
        {refY !== undefined && <line className="kf-ref" x1={x0 + 44} y1={refY} x2={x0 + w - 10} y2={refY} />}
        <path className="kf-curve-out" d={d} />
        <circle className="kf-cursor" cx={cursor[0]} cy={cursor[1]} r={6} />
      </svg>
      {xTicks.map((k) => <KL key={k.x} vb={vb} at={[k.x, y0 + h - 12]} ink="muted" className="small"><M>{k.tex}</M></KL>)}
      {yTicks.map((k) => <KL key={k.y} vb={vb} at={[x0 + 34, k.y]} ink="muted" className="small" anchor="r"><M>{k.tex}</M></KL>)}
      {children}
    </div>
  );
}

/**
 * The handwritten «Parenthèse» of p. 32: ΔV → 0 gives ΔM → 0, but ΔM/ΔV does not tend to 0 – it tends to ρ.
 * A soil block with a dense rock lens (teal = dense). A cube of side h around the point P: shrink it with the slider.
 */
export function DensityFigure() {
  const tr = useTr(), lang = useLang();
  const [u, setU] = useState(1);
  const [P, setP] = useState<V>([1.9, 1.6]);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef(false);
  const h = hOfU(u);
  const P3 = [P[0], SOIL.yMid, P[1]] as const;
  const cells = useMemo(() => Array.from({ length: N * M2 }, (_, k) => {
    const i = k % N, j = Math.floor(k / N);
    return soilRho([((i + 0.5) / N) * SOIL.X, SOIL.yMid, ((j + 0.5) / M2) * SOIL.Z]);
  }), []);
  const series = useMemo(() => densitySeries(P3, 48), [P[0], P[1]]); // eslint-disable-line react-hooks/exhaustive-deps
  const cur = cubeAt(P3, h);
  const rhoP = soilRho(P3);
  const fx = (x: number, d = 4) => fmtSig(x, d, lang);
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current || !svg.current || e.buttons !== 1) return;
    const q = svgPoint(svg.current, VB, e);
    setP([clamp((q[0] - X0) / S, 0.05, SOIL.X - 0.05), clamp(SOIL.Z - (q[1] - Y0) / S, 0.05, SOIL.Z - 0.05)]);
  };
  const pp = toFig(P[0], P[1]);
  const side = h * S, small = side < 9;
  // plots: h on the x-axis from 0 to 2 m
  const PV: ViewBox = [0, 0, 300, 190];
  const px = (hh: number) => 44 + (hh / H_MAX) * 246;
  const dMmax = series[series.length - 1].dM;
  const yNice = Math.ceil(dMmax / 6000) * 6000;
  const py1 = (m: number) => 160 - (m / yNice) * 148;
  const py2 = (r: number) => 160 - ((r - RHO_LO) / (RHO_HI - RHO_LO)) * 148;
  const d1 = `M${px(0)},${py1(0)}` + series.map((p) => `L${px(p.h).toFixed(1)},${py1(p.dM).toFixed(1)}`).join('');
  const d2 = `M${px(0)},${py2(rhoP)}` + series.map((p) => `L${px(p.h).toFixed(1)},${py2(p.ratio).toFixed(1)}`).join('');
  const xT = [0, 1, 2].map((v) => ({ x: px(v), tex: v === 2 ? t`2\,\mathrm m` : String(v) }));
  return (
    <figure className="kf">
      <div className="kf-fig" style={{ maxWidth: 520 }}>
        <svg ref={svg} viewBox={VB.join(' ')} onPointerMove={onMove} onPointerUp={() => { drag.current = false; }} onPointerCancel={() => { drag.current = false; }}
          role="img" aria-label={tr('Schnitt durch einen Boden mit dichter Gesteinslinse; ein Würfel um den Punkt P, Seite h', 'Section through soil with a dense rock lens; a cube around the point P, side h')}>
          {cells.map((r, k) => {
            const i = k % N, j = Math.floor(k / N);
            return <rect key={k} x={X0 + (i * S * SOIL.X) / N} y={Y0 + ((M2 - 1 - j) * S * SOIL.Z) / M2} width={(S * SOIL.X) / N + 0.4} height={(S * SOIL.Z) / M2 + 0.4} fill="var(--c-rho)" fillOpacity={0.07 + 0.88 * ((r - RHO_LO) / (RHO_HI - RHO_LO))} />;
          })}
          <rect x={X0} y={Y0} width={S * SOIL.X} height={S * SOIL.Z} fill="none" stroke="var(--muted)" strokeWidth={1.6} />
          {small ? <circle className="kf-cellsel" cx={pp[0]} cy={pp[1]} r={9} /> : <rect className="kf-probe" x={pp[0] - side / 2} y={pp[1] - side / 2} width={side} height={side} />}
          <circle className="kf-marker-ring" cx={pp[0]} cy={pp[1]} r={20} onPointerDown={(e) => { drag.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); }} />
          <circle className="kf-marker" cx={pp[0]} cy={pp[1]} r={5} onPointerDown={(e) => { drag.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); }} />
        </svg>
        <KL vb={VB} at={[pp[0] + 12, pp[1] - 13]} ink="point" anchor="l"><M>P</M></KL>
        <KL vb={VB} at={[X0 + S * SOIL.X - 4, Y0 + 12]} ink="muted" className="small" anchor="r">{tr('Schnitt durch den Boden', 'section through the soil')}</KL>
        <KL vb={VB} at={[X0 + S * 2, Y0 + S * SOIL.Z + 10]} ink="muted" className="small"><M>x</M></KL>
      </div>
      <div className="kf-controls">
        <KSlider label={<M>h</M>} min={0} max={1} step={0.005} value={u} onChange={setU} val={<M>{fmtLen(h, lang)}</M>} aria={tr('Kantenlänge h des Würfels', 'side length h of the cube')} />
      </div>
      <div className="kf-readout">
        <div className="kf-sums">
          <div className="v-result"><M>{t`\Delta V = h^3 = ${fx(cur.dV, 3)}\,\mathrm{m^3}`}</M></div>
          <div className="v-result"><M>{t`\Delta M = ${fx(cur.dM, 4)}\,\mathrm{kg}`}</M></div>
          <div className="v-result pos"><M>{t`\dfrac{\Delta M}{\Delta V} = ${fx(cur.ratio, 4)}\,\mathrm{kg/m^3}`}</M></div>
          <div className="v-result"><M>{t`\rho(P) = ${fx(rhoP, 4)}\,\mathrm{kg/m^3}`}</M></div>
        </div>
      </div>
      <div className="kf-plots">
        <div className="kf-plot">
          <figcaption>{tr('Die Masse im Würfel wird kleiner …', 'The mass in the cube gets smaller …')}</figcaption>
          <Plot vb={PV} d={d1} cursor={[px(h), py1(cur.dM)]} xTicks={xT}
            yTicks={[0, 1, 2, 3].map((k) => ({ y: py1((k * yNice) / 3), tex: k === 0 ? '0' : fmtSig((k * yNice) / 3, 3, lang) }))}>
            <KL vb={PV} at={[58, 12]} ink="muted" anchor="l" className="small"><M>{t`\Delta M\ [\mathrm{kg}]`}</M></KL>
            <KL vb={PV} at={[292, 146]} ink="muted" anchor="r" className="small"><M>h</M></KL>
          </Plot>
        </div>
        <div className="kf-plot">
          <figcaption>{tr('… aber der Quotient nähert sich einem festen Wert.', '… but the quotient approaches a fixed value.')}</figcaption>
          <Plot vb={PV} d={d2} refY={py2(rhoP)} cursor={[px(h), py2(cur.ratio)]} xTicks={xT}
            yTicks={[RHO_LO, 2250, RHO_HI].map((r) => ({ y: py2(r), tex: String(r) }))}>
            <KL vb={PV} at={[58, 12]} ink="muted" anchor="l" className="small"><M>{t`\Delta M/\Delta V\ [\mathrm{kg/m^3}]`}</M></KL>
            <KL vb={PV} at={[292, py2(rhoP) - 11]} ink="rho" anchor="r" className="small"><M>{t`\rho(P)`}</M></KL>
            <KL vb={PV} at={[292, 146]} ink="muted" anchor="r" className="small"><M>h</M></KL>
          </Plot>
        </div>
      </div>
    </figure>
  );
}
