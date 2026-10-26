import { useRef, useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { alongDirection } from '../../physics/powerMoment';
import { power, powerKind, powerAngle } from '../../physics/force';
import { at } from '../figUtils';
import { Arrow, arcPath, svgPoint, useTicker, type V2 } from './lpDraw';
import './lp.css';

const t = String.raw;
type F2 = [number, number];

/* ─────────────────────────────── geometry of the power explorer ─────────────────────────────── */
export const PE_VB: [number, number, number, number] = [0, 0, 400, 276];
export const PE_A: V2 = [140, 118]; // the point A (the track runs through it, to the right)
export const PE_KF = 26; // px per newton
export const PE_KV = 42; // px per m/s
const F_MAX = 3.5, V_MIN = 0.5, V_MAX = 3;
const BAR_Y = 244, BAR_X0 = 200, BAR_K = 12.5; // power bar: zero at x = 200, 12.5 px per watt (|P| ≤ 12 W)

export type PePreset = 'pp' | 'p' | 'm' | 'mm' | 'z';
/** The five handwritten sketches of p. 33 (v to the right in all of them). */
export const PE_PRESETS: Record<PePreset, { F: F2; tex: string }> = {
  pp: { F: [3.4, 0], tex: String.raw`P = \mathord{+}\mathord{+}` },
  p: { F: [2.6, 1.5], tex: String.raw`P = \mathord{+}` },
  m: { F: [-1.5, 2.6], tex: String.raw`P = \mathord{-}` },
  mm: { F: [-3.4, 0], tex: String.raw`P = \mathord{-}\mathord{-}` },
  z: { F: [0, 3.2], tex: String.raw`P = 0` },
};

/** Everything the figure shows, as a pure function of the force and the speed (tested). */
export function powerFrame(F: F2, v: number) {
  const Fv: [number, number, number] = [F[0], F[1], 0], vv: [number, number, number] = [v, 0, 0];
  const P = power(Fv, vv), kind = powerKind(Fv, vv, 1e-9);
  const alpha = powerAngle(Fv, vv); // null when F = 0
  const sp = alongDirection(Fv, vv);
  return { P, kind, alpha, par: sp.par, perp: F[1], Fabs: Math.hypot(F[0], F[1]) };
}

function useDrag(vb: readonly number[], onMove: (p: V2, who: string) => void, pick: (p: V2) => string | null) {
  const svg = useRef<SVGSVGElement>(null);
  const who = useRef<string | null>(null);
  return {
    svg,
    props: {
      onPointerDown: (e: React.PointerEvent<SVGSVGElement>) => {
        if (!svg.current) return;
        who.current = pick(svgPoint(svg.current, vb, e));
        if (who.current) { e.currentTarget.setPointerCapture?.(e.pointerId); onMove(svgPoint(svg.current, vb, e), who.current); }
      },
      onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => {
        if (!who.current || !svg.current || e.buttons !== 1) return;
        onMove(svgPoint(svg.current, vb, e), who.current);
      },
      onPointerUp: () => { who.current = null; },
      onPointerCancel: () => { who.current = null; },
    },
  };
}

/**
 * Lecture p. 33, P = F̲ · v̲_A: the point A moves to the right with v̲ (the track slides by underneath). Drag the tip of F̲ (anywhere)
 * and the tip of v̲ (its length). Only the part of F̲ along v̲ counts: it is drawn on the track (green: with the motion,
 * amber: against it) and is exactly what the power bar shows. The five chips are the handwritten sketches of the page.
 */
export function PowerExplorer() {
  const tr = useTr(), lang = useLang();
  const [F, setF] = useState<F2>(PE_PRESETS.p.F);
  const [v, setV] = useState(2);
  const fig = useRef<HTMLDivElement>(null);
  const clock = useTicker(fig, true, 1);
  const fr = powerFrame(F, v);
  const [Ax, Ay] = PE_A;
  const tipF: V2 = [Ax + PE_KF * F[0], Ay - PE_KF * F[1]], tipV: V2 = [Ax + PE_KV * v, Ay];
  const foot: V2 = [Ax + PE_KF * F[0], Ay];
  const cls = fr.kind === 'drive' ? 'lp-plus' : fr.kind === 'resist' ? 'lp-minus' : 'lp-zero';

  const { svg, props } = useDrag(PE_VB, (p, who) => {
    if (who === 'F') {
      let fx = (p[0] - Ax) / PE_KF, fy = (Ay - p[1]) / PE_KF;
      const n = Math.hypot(fx, fy);
      if (n > F_MAX) { fx *= F_MAX / n; fy *= F_MAX / n; }
      if (Math.abs(fx) < 0.08) fx = 0; // snap: F ⟂ v, leistungslos
      if (Math.abs(fy) < 0.08) fy = 0; // snap: F ∥ v
      setF([fx, fy]);
    } else setV(Math.max(V_MIN, Math.min(V_MAX, (p[0] - Ax) / PE_KV)));
  }, (p) => {
    const dF = Math.hypot(p[0] - tipF[0], p[1] - tipF[1]), dV = Math.hypot(p[0] - tipV[0], p[1] - tipV[1]);
    return dF < 30 && dF <= dV ? 'F' : dV < 30 ? 'V' : null;
  });

  // sliding track: sleepers every 36 px move to the left with the speed of A (the picture stays, the ground moves by)
  const off = (clock * PE_KV * 0.5 * v) % 36;
  const ticks = Array.from({ length: 13 }, (_, i) => i * 36 - off).filter((x) => x > 4 && x < 396);
  const f1 = (x: number) => fmtNum(x, 1, lang, true), f2 = (x: number) => fmtNum(x, 2, lang, true);
  const par = (x: number) => (Math.abs(x) >= 0.05 && x < 0 ? `(${f1(x)})` : f1(x)); // negative numbers in brackets
  const P = fr.P, barEnd = BAR_X0 + BAR_K * P;
  const alphaDeg = fr.alpha === null ? null : (fr.alpha * 180) / Math.PI;
  // α arc: from the direction of v (angle 0) to the direction of F; screen y is flipped
  const aF = Math.atan2(-F[1], F[0]);
  const showAlpha = fr.alpha !== null && fr.Fabs > 0.4 && fr.alpha > 0.08;
  const alphaTex = alphaDeg === null ? '' : fmtNum(alphaDeg, 0, lang, true);
  const Pn = fmtNum(Math.abs(P) < 0.005 ? 0 : P, 1, lang, true);
  const chip = fr.kind === 'drive'
    ? tr(<>Antriebskraft: <M>{t`\alpha < \tfrac{\pi}{2}`}</M>, <M>{t`P > 0`}</M></>, <>driving force (<span lang="de">Antriebskraft</span>): <M>{t`\alpha < \tfrac{\pi}{2}`}</M>, <M>{t`P > 0`}</M></>)
    : fr.kind === 'resist'
      ? tr(<>Widerstandskraft: <M>{t`\alpha > \tfrac{\pi}{2}`}</M>, <M>{t`P < 0`}</M></>, <>resisting force (<span lang="de">Widerstandskraft</span>): <M>{t`\alpha > \tfrac{\pi}{2}`}</M>, <M>{t`P < 0`}</M></>)
      : fr.Fabs === 0
        ? tr(<>keine Kraft: <M>{t`\v F = \v 0`}</M>, <M>{t`P = 0`}</M></>, <>no force: <M>{t`\v F = \v 0`}</M>, <M>{t`P = 0`}</M></>)
        : tr(<>leistungslos: <M>{t`\alpha = \tfrac{\pi}{2}`}</M>, <M>{t`P = 0`}</M></>, <>no power (<span lang="de">leistungslos</span>): <M>{t`\alpha = \tfrac{\pi}{2}`}</M>, <M>{t`P = 0`}</M></>);
  const pressed = (k: PePreset) => Math.hypot(F[0] - PE_PRESETS[k].F[0], F[1] - PE_PRESETS[k].F[1]) < 1e-9;

  return (
    <figure className="vdemo lp-fig">
      <div className="v-presets">
        {(Object.keys(PE_PRESETS) as PePreset[]).map((k) => (
          <button key={k} type="button" aria-pressed={pressed(k)} onClick={() => setF(PE_PRESETS[k].F)}><M>{PE_PRESETS[k].tex}</M></button>
        ))}
      </div>
      <div className="vdemo-fig wide" ref={fig}>
        <svg ref={svg} viewBox={PE_VB.join(' ')} {...props}
          aria-label={tr('Leistung: Spitzen von F und v ziehbar', 'Power: tips of F and v draggable')}>
          {/* the track A moves along, with sliding sleepers */}
          <line x1={6} y1={Ay} x2={394} y2={Ay} className="lp-track" />
          {ticks.map((x) => <line key={x} x1={x} y1={Ay + 5} x2={x} y2={Ay + 13} className="lp-tick" />)}
          {/* the part of F along v (the one that counts), and the rest */}
          {Math.abs(F[0]) > 0.02 && <line x1={Ax} y1={Ay} x2={foot[0]} y2={foot[1]} className={`lp-band ${cls}`} />}
          {Math.abs(F[1]) > 0.02 && Math.abs(F[0]) > 0.02 && <line x1={tipF[0]} y1={tipF[1]} x2={foot[0]} y2={foot[1]} className="lp-drop" />}
          {Math.abs(F[0]) > 0.02 && Math.abs(F[1]) > 0.02 && <circle cx={foot[0]} cy={foot[1]} r={3} className="lp-foot" />}
          {showAlpha && <path d={arcPath(PE_A, 26, 0, aF)} className="lp-arc" />}
          <Arrow a={PE_A} b={tipV} cls="lp-vel" />
          <Arrow a={PE_A} b={tipF} cls="lp-force" />
          <circle cx={tipF[0]} cy={tipF[1]} r={14} className="lp-handle force" />
          <circle cx={tipV[0]} cy={tipV[1]} r={14} className="lp-handle vel" />
          <circle cx={Ax} cy={Ay} r={5.5} className="lp-dot" />
          {/* power bar */}
          <line x1={50} y1={BAR_Y} x2={350} y2={BAR_Y} className="lp-barline" />
          <line x1={BAR_X0} y1={BAR_Y - 9} x2={BAR_X0} y2={BAR_Y + 9} className="lp-barzero" />
          {Math.abs(P) > 0.01 && <line x1={BAR_X0} y1={BAR_Y} x2={barEnd} y2={BAR_Y} className={`lp-barfill ${cls}`} />}
        </svg>
        <div className="vdemo-label point small halo" style={at(PE_VB, Ax - 12, Ay + 15)}><M>A</M></div>
        {fr.Fabs > 0.3 && (() => {
          const dx = tipF[0] - Ax, dy = tipF[1] - Ay, l = Math.hypot(dx, dy) || 1;
          return <div className="vdemo-label force small halo" style={at(PE_VB, tipF[0] + (26 * dx) / l, tipF[1] + (22 * dy) / l)}><M>{t`\v F`}</M></div>;
        })()}
        <div className="vdemo-label point small halo" style={at(PE_VB, tipV[0] + 20, Ay - 14)}><M>{t`\v v_A`}</M></div>
        {showAlpha && (() => { const am = aF / 2; return <div className="vdemo-label angle small halo" style={at(PE_VB, Ax + 44 * Math.cos(am), Ay + 44 * Math.sin(am))}><M>\alpha</M></div>; })()}
        {Math.abs(F[0]) > 0.5 && <div className={`vdemo-label small halo ${cls.replace('lp-', '')}`} style={at(PE_VB, (Ax + foot[0]) / 2, Ay + 26)}><M>{t`|\v F|\cos\alpha`}</M></div>}
        <div className="vdemo-label minus small halo" style={at(PE_VB, 24, BAR_Y - 16)}><M>{t`P < 0`}</M></div>
        <div className="vdemo-label plus small halo" style={at(PE_VB, 376, BAR_Y - 16)}><M>{t`P > 0`}</M></div>
        <div className={`vdemo-label small halo ${cls.replace('lp-', '')}`} style={at(PE_VB, BAR_X0, BAR_Y + 24)}><M>{t`P = ${Pn}\,\text{W}`}</M></div>
      </div>
      <figcaption className="vdemo-readout">
        <div className={`v-result rt-readout lp-class ${cls}`}>{chip}</div>
        <div className="v-result rt-readout lp-formula">
          <M>{t`P = \v F\cdot\v v_A = F_x v_x + F_y v_y`}</M>
          <M>{t`= ${par(F[0])}\cdot ${f1(v)} + ${par(F[1])}\cdot 0 = ${Pn}\,\text{W}`}</M>
        </div>
        {fr.alpha !== null && (
          <div className="v-result rt-readout lp-formula">
            <M>{t`P = |\v F|\,|\v v_A|\cos\alpha`}</M>
            <M>{t`= ${f2(fr.Fabs)}\cdot ${f1(v)}\cdot\cos ${alphaTex}^\circ = ${Pn}\,\text{W}`}</M>
          </div>
        )}
        <p className="vdemo-note">{tr(
          <>Ziehe die Spitze von <M>{t`\v F`}</M> und die Spitze von <M p=".">{t`\v v_A`}</M> Der dicke Streifen auf der Bahn ist der Teil von <M>{t`\v F`}</M> längs <M p=":">{t`\v v_A`}</M> nur er zählt – der Rest (gestrichelt) wird mit 0 multipliziert. Der Balken unten zeigt <M p=".">P</M></>,
          <>Drag the tip of <M>{t`\v F`}</M> and the tip of <M p=".">{t`\v v_A`}</M> The thick strip on the track is the part of <M>{t`\v F`}</M> along <M p=":">{t`\v v_A`}</M> only it counts – the rest (dashed) is multiplied by 0. The bar at the bottom shows <M p=".">P</M></>)}</p>
      </figcaption>
    </figure>
  );
}
