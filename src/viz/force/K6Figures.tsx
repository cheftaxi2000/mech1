import { useEffect, useRef, useState, type ReactNode } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { angleOPF, leverArm2D, momentZ2D, radialTangential } from '../../physics/powerMoment';
import { at, useReducedMotion } from '../figUtils';
import { Arrow, RightAngle, arcPath, svgPoint, useOnScreen, type V2 } from './lpDraw';
import './lp.css';

const t = String.raw;
const DEG = 180 / Math.PI;

/** Drag helper: pointer down picks a handle, move reports the pointer in viewBox units. */
function useHandles(vb: readonly number[], pick: (p: V2) => string | null, move: (p: V2, who: string) => void) {
  const svg = useRef<SVGSVGElement>(null);
  const who = useRef<string | null>(null);
  return {
    svg,
    props: {
      onPointerDown: (e: React.PointerEvent<SVGSVGElement>) => {
        if (!svg.current) return;
        const p = svgPoint(svg.current, vb, e);
        who.current = pick(p);
        if (who.current) { e.currentTarget.setPointerCapture?.(e.pointerId); move(p, who.current); }
      },
      onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => { if (who.current && svg.current && e.buttons === 1) move(svgPoint(svg.current, vb, e), who.current); },
      onPointerUp: () => { who.current = null; },
      onPointerCancel: () => { who.current = null; },
    },
  };
}

/* ═══════════════════════════════ the lever arm (top view) ═══════════════════════════════ */
const LV_VB: [number, number, number, number] = [0, 0, 400, 290];
const LV_O: V2 = [200, 150];
const LV_K = 62; // px per m
const LV_KF = 40; // px per N
const toS = (p: [number, number], o: V2 = LV_O, k = LV_K): V2 => [o[0] + k * p[0], o[1] - k * p[1]];
const toP = (q: V2): [number, number] => [(q[0] - LV_O[0]) / LV_K, (LV_O[1] - q[1]) / LV_K];

type LvPreset = 'oblique' | 'across' | 'along' | 'through';
const LV_PRESETS: Record<LvPreset, { P: [number, number]; F: [number, number]; de: ReactNode; en: ReactNode }> = {
  oblique: { P: [1.3, 0.5], F: [0.2, 1.5], de: 'schräg', en: 'oblique' },
  across: { P: [1.5, 0], F: [0, 1.5], de: 'quer zum Arm', en: 'across the arm' },
  along: { P: [1.5, 0], F: [1.4, 0], de: 'längs des Arms', en: 'along the arm' },
  through: { P: [1.4, 0.7], F: [-1.3, -0.65], de: <>durch <M>O</M></>, en: <>through <M>O</M></> },
};

/** Clip the line through p with direction d to the rectangle [m, W−m] × [m, H−m] (screen). */
function clipScreen(p: V2, d: V2, m = 10): [V2, V2] | null {
  const box = [m, m, LV_VB[2] - m, LV_VB[3] - m];
  let lo = -Infinity, hi = Infinity;
  for (const [pi, di, a, b] of [[p[0], d[0], box[0], box[2]], [p[1], d[1], box[1], box[3]]] as const) {
    if (Math.abs(di) < 1e-9) { if (pi < a || pi > b) return null; continue; }
    const t1 = (a - pi) / di, t2 = (b - pi) / di;
    lo = Math.max(lo, Math.min(t1, t2)); hi = Math.min(hi, Math.max(t1, t2));
  }
  return lo > hi ? null : [[p[0] + lo * d[0], p[1] + lo * d[1]], [p[0] + hi * d[0], p[1] + hi * d[1]]];
}


/** Position of a label beside the segment a–b: its middle, pushed k px to the side that lies below (down) or above it on the screen. */
function sideAt(a: V2, b: V2, k: number, down: boolean): React.CSSProperties {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
  let nx = -dy / l, ny = dx / l;
  if ((ny > 0) !== down) { nx = -nx; ny = -ny; }
  return at(LV_VB, (a[0] + b[0]) / 2 + k * nx, (a[1] + b[1]) / 2 + k * ny);
}

/**
 * Lecture pp. 34–35, M̲_O = OP̲ × F̲ = F̲ × PO̲ (top view, the axis comes out of the page). Drag P and the tip of F̲.
 * The dashed perpendicular from O to the line of action is the lever arm d; |M̲_O| = |F̲| d = |OP̲||F̲| sin φ.
 * The sense of the curved arrow is the right-hand rule: counter-clockwise ⇔ M̲_O points toward you (⊙).
 */
export function LeverFigure() {
  const tr = useTr(), lang = useLang();
  const [P0, setP0] = useState<[number, number]>(LV_PRESETS.oblique.P);
  const [s, setS] = useState(0);
  const [F, setF] = useState<[number, number]>(LV_PRESETS.oblique.F);
  const [reading, setReading] = useState<'OPxF' | 'FxPO'>('OPxF');
  const nf = Math.hypot(F[0], F[1]);
  const u: [number, number] = nf > 0 ? [F[0] / nf, F[1] / nf] : [1, 0];
  const P: [number, number] = [P0[0] + s * u[0], P0[1] + s * u[1]];
  const Ps = toS(P), tipF = toS([P[0] + (LV_KF / LV_K) * F[0], P[1] + (LV_KF / LV_K) * F[1]]);
  const Mz = momentZ2D(P, F), { d, foot } = leverArm2D(P, F);
  const phi = angleOPF(P, F);
  const rOP = Math.hypot(P[0], P[1]);
  const ccw = Mz > 0.005, cw = Mz < -0.005;
  const footS = toS(foot);
  const dirS: V2 = [u[0], -u[1]];
  const line = nf > 0 ? clipScreen(Ps, dirS) : null;

  const { svg, props } = useHandles(LV_VB, (p) => {
    const dP = Math.hypot(p[0] - Ps[0], p[1] - Ps[1]), dF = Math.hypot(p[0] - tipF[0], p[1] - tipF[1]);
    return dF < 28 && dF <= dP ? 'F' : dP < 28 ? 'P' : null;
  }, (p, who) => {
    const q = toP(p);
    if (who === 'P') {
      const c: [number, number] = [Math.max(-3.1, Math.min(3.1, q[0])), Math.max(-2.1, Math.min(2.1, q[1]))];
      if (Math.hypot(c[0], c[1]) < 0.25) return;
      setP0(c); setS(0);
    } else {
      let fx = (q[0] - P[0]) * (LV_K / LV_KF), fy = (q[1] - P[1]) * (LV_K / LV_KF);
      const n = Math.hypot(fx, fy);
      if (n > 2.4) { fx *= 2.4 / n; fy *= 2.4 / n; }
      if (Math.abs(fx) < 0.06) fx = 0;
      if (Math.abs(fy) < 0.06) fy = 0;
      setP0(P); setS(0); setF([fx, fy]);
    }
  });

  // the angle at P: φ between OP̲ (extended beyond P) and F̲, or π − φ between F̲ and PO̲
  const aF = Math.atan2(Ps[1] - tipF[1], tipF[0] - Ps[0]); // physics angle of F
  const aOP = Math.atan2(P[1], P[0]);
  const stubLen = 38;
  const dirOP: V2 = [Math.cos(aOP), -Math.sin(aOP)]; // screen direction O → P
  const showAngle = phi !== null && nf > 0.2 && rOP > 0.3 && phi > 0.1 && phi < Math.PI - 0.1;
  const aRef = reading === 'OPxF' ? aOP : aOP + Math.PI; // reference direction at P
  // arc from the reference direction to F, the short way (screen angles are the negative of the physics angles)
  let da = aF - aRef; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
  const arc = arcPath(Ps, 22, -aRef, -(aRef + da));
  const midA = -(aRef + da / 2);
  const f2 = (x: number) => fmtNum(x, 2, lang, true);
  const phiShown = phi === null ? 0 : reading === 'OPxF' ? phi : Math.PI - phi;
  const phiDeg = fmtNum(phiShown * DEG, 0, lang, true);
  const pressed = (k: LvPreset) => Math.hypot(P0[0] - LV_PRESETS[k].P[0], P0[1] - LV_PRESETS[k].P[1]) < 1e-9 && Math.hypot(F[0] - LV_PRESETS[k].F[0], F[1] - LV_PRESETS[k].F[1]) < 1e-9 && s === 0;
  // curved arrow for the sense of M_z, on the left of O
  const sense = ccw ? arcPath(LV_O, 34, (210 / DEG), (150 / DEG)) : cw ? arcPath(LV_O, 34, (150 / DEG), (210 / DEG)) : '';
  const senseEnd: V2 = ccw ? [LV_O[0] + 34 * Math.cos(150 / DEG), LV_O[1] + 34 * Math.sin(150 / DEG)] : [LV_O[0] + 34 * Math.cos(210 / DEG), LV_O[1] + 34 * Math.sin(210 / DEG)];
  const senseDir: V2 = ccw ? [Math.sin(150 / DEG) * -1, Math.cos(150 / DEG)] : [Math.sin(210 / DEG), -Math.cos(210 / DEG)];

  return (
    <figure className="vdemo lp-fig">
      <div className="v-presets">
        {(Object.keys(LV_PRESETS) as LvPreset[]).map((k) => (
          <button key={k} type="button" aria-pressed={pressed(k)} onClick={() => { setP0(LV_PRESETS[k].P); setF(LV_PRESETS[k].F); setS(0); }}>{tr(LV_PRESETS[k].de, LV_PRESETS[k].en)}</button>
        ))}
      </div>
      <div className="vdemo-fig wide">
        <svg ref={svg} viewBox={LV_VB.join(' ')} {...props} aria-label={tr('Hebelarm und Moment: P und die Spitze von F ziehbar', 'Lever arm and moment: P and the tip of F draggable')}>
          {line && <line x1={line[0][0]} y1={line[0][1]} x2={line[1][0]} y2={line[1][1]} className="lp-action" />}
          {nf > 0 && d > 0.05 && <>
            <line x1={LV_O[0]} y1={LV_O[1]} x2={footS[0]} y2={footS[1]} className="lp-lever" />
            {d > 0.25 && <RightAngle a={footS} q={LV_O} b={[footS[0] + dirS[0] * 20, footS[1] + dirS[1] * 20]} k={8} />}
            <circle cx={footS[0]} cy={footS[1]} r={3} className="lp-foot" />
          </>}
          <line x1={LV_O[0]} y1={LV_O[1]} x2={Ps[0] - dirOP[0] * 6} y2={Ps[1] - dirOP[1] * 6} className="lp-op" />
          {showAngle && <path d={arc} className="lp-arc" />}
          {showAngle && (reading === 'OPxF'
            ? <line x1={Ps[0]} y1={Ps[1]} x2={Ps[0] + dirOP[0] * stubLen} y2={Ps[1] + dirOP[1] * stubLen} className="lp-stub" />
            : <Arrow a={Ps} b={[Ps[0] - dirOP[0] * stubLen, Ps[1] - dirOP[1] * stubLen]} cls="lp-dark thin" head={7} />)}
          <Arrow a={Ps} b={tipF} cls="lp-force" />
          {sense && <g className="lp-a lp-force"><path d={sense} className="lp-sense" /><polygon points={`${senseEnd[0]},${senseEnd[1]} ${senseEnd[0] - 7 * senseDir[0] + 3.5 * senseDir[1]},${senseEnd[1] - 7 * senseDir[1] - 3.5 * senseDir[0]} ${senseEnd[0] - 7 * senseDir[0] - 3.5 * senseDir[1]},${senseEnd[1] - 7 * senseDir[1] + 3.5 * senseDir[0]}`} /></g>}
          <circle cx={Ps[0]} cy={Ps[1]} r={14} className="lp-handle point" />
          <circle cx={tipF[0]} cy={tipF[1]} r={14} className="lp-handle force" />
          <circle cx={Ps[0]} cy={Ps[1]} r={5} className="lp-dot" />
          <circle cx={LV_O[0]} cy={LV_O[1]} r={4.5} className="lp-dot o" />
        </svg>
        <div className="vdemo-label dark small halo" style={at(LV_VB, LV_O[0] + 14, LV_O[1] + 14)}><M>O</M></div>
        <div className="vdemo-label point small halo" style={at(LV_VB, Ps[0] + 16, Ps[1] + 16)}><M>P</M></div>
        {rOP > 0.6 && <div className="vdemo-label dark small halo" style={sideAt(LV_O, Ps, 15, true)}><M>{t`\v{OP}`}</M></div>}
        {nf > 0.3 && (() => { const dx = tipF[0] - Ps[0], dy = tipF[1] - Ps[1], l = Math.hypot(dx, dy); return <div className="vdemo-label force small halo" style={at(LV_VB, tipF[0] + (22 * dx) / l, tipF[1] + (20 * dy) / l)}><M>{t`\v F`}</M></div>; })()}
        {nf > 0 && d > 0.45 && <div className="vdemo-label dark small halo" style={sideAt(LV_O, footS, 13, false)}><M>d</M></div>}
        {showAngle && <div className="vdemo-label angle small halo" style={at(LV_VB, Ps[0] + 40 * Math.cos(midA), Ps[1] + 40 * Math.sin(midA))}><M>{reading === 'OPxF' ? t`\varphi` : t`\pi-\varphi`}</M></div>}
        {showAngle && reading === 'FxPO' && <div className="vdemo-label dark small halo" style={at(LV_VB, Ps[0] - dirOP[0] * (stubLen + 14) + 0, Ps[1] - dirOP[1] * (stubLen + 14) + 4)}><M>{t`\v{PO}`}</M></div>}
        {sense && <div className="vdemo-label force small halo" style={at(LV_VB, LV_O[0] - 62, LV_O[1])}><M>{ccw ? t`\v M_O\ \odot` : t`\v M_O\ \otimes`}</M></div>}
      </div>
      <figcaption className="vdemo-readout">
        <div className="v-presets lp-readings">
          <button type="button" aria-pressed={reading === 'OPxF'} onClick={() => setReading('OPxF')}><M>{t`\v{OP}\times\v F`}</M></button>
          <button type="button" aria-pressed={reading === 'FxPO'} onClick={() => setReading('FxPO')}><M>{t`\v F\times\v{PO}`}</M></button>
        </div>
        <div className="lp-sliders">
          <label className="slider lp-wide"><span>{tr('P längs der Wirkungslinie', 'P along the line of action')}</span><input type="range" min={-1.5} max={1.5} step={0.05} value={s} onChange={(e) => setS(Number(e.target.value))} aria-label={tr('P längs der Wirkungslinie', 'P along the line of action')} /><span className="val">{fmtNum(s, 2, lang)}</span></label>
        </div>
        <div className="v-result rt-readout lp-formula">
          {reading === 'OPxF'
            ? <><M>{t`|\v M_O| = |\v{OP}|\,|\v F|\sin\varphi`}</M><M>{t`= ${f2(rOP)}\cdot ${f2(nf)}\cdot\sin ${phiDeg}^\circ = ${f2(Math.abs(Mz))}\ \text{N}\,\text{m}`}</M></>
            : <><M>{t`|\v M_O| = |\v F|\,|\v{PO}|\sin(\pi-\varphi)`}</M><M>{t`= ${f2(nf)}\cdot ${f2(rOP)}\cdot\sin ${phiDeg}^\circ = ${f2(Math.abs(Mz))}\ \text{N}\,\text{m}`}</M></>}
        </div>
        <div className="v-result rt-readout lp-formula"><M p=",">{t`|\v M_O| = |\v F|\,d = ${f2(nf)}\cdot ${f2(d)} = ${f2(nf * d)}\ \text{N}\,\text{m}`}</M><M>{t`|\v{OP}| = ${f2(rOP)}\ \text{m}`}</M></div>
        <div className="v-result rt-readout lp-formula"><M>{t`M_z = x\,F_y - y\,F_x`}</M><M>{t`= ${f2(P[0])}\cdot ${f2(F[1])} - (${f2(P[1])})\cdot ${f2(F[0])} = ${f2(Mz)}\ \text{N}\,\text{m}`}</M></div>
        <p className="vdemo-note">{tr(
          <>Ziehe <M>P</M> und die Spitze von <M p=".">{t`\v F`}</M> Der Schieber verschiebt <M>P</M> entlang der Wirkungslinie: <M>{t`|\v{OP}|`}</M> ändert sich, der Hebelarm <M>d</M> und das Moment bleiben. {ccw ? <>Der gebogene Pfeil läuft gegen den Uhrzeigersinn: <M>{t`\v M_O`}</M> zeigt aus der Seite zu dir (<M p=").">{t`\odot`}</M></> : cw ? <>Der gebogene Pfeil läuft im Uhrzeigersinn: <M>{t`\v M_O`}</M> zeigt in die Seite hinein (<M p=").">{t`\otimes`}</M></> : <>Hier ist <M p=",">{t`\v M_O = \v 0`}</M> die Wirkungslinie geht durch <M p=".">O</M></>}</>,
          <>Drag <M>P</M> and the tip of <M p=".">{t`\v F`}</M> The slider moves <M>P</M> along the line of action: <M>{t`|\v{OP}|`}</M> changes, the lever arm <M>d</M> and the moment stay. {ccw ? <>The curved arrow runs counter-clockwise: <M>{t`\v M_O`}</M> points out of the page toward you (<M p=").">{t`\odot`}</M></> : cw ? <>The curved arrow runs clockwise: <M>{t`\v M_O`}</M> points into the page (<M p=").">{t`\otimes`}</M></> : <>Here <M p=",">{t`\v M_O = \v 0`}</M> the line of action passes through <M p=".">O</M></>}</>)}</p>
      </figcaption>
    </figure>
  );
}

/* ═══════════════════════════════ power in rotation: the turning wheel ═══════════════════════════════ */
const WH_VB: [number, number, number, number] = [0, 0, 400, 290];
const WH_O: V2 = [200, 142];
const WH_K = 50; // px per m
const WH_R = 2.05; // radius of the wheel (m)
const WH_KF = 38; // px per N
const WH_KV = 22; // px per m/s

type WhPreset = 'tangential' | 'oblique' | 'radial' | 'brake';
const WH_PRESETS: Record<WhPreset, { F: [number, number]; de: string; en: string }> = {
  tangential: { F: [0, 1.4], de: 'tangential', en: 'tangential' },
  oblique: { F: [0.7, 1.2], de: 'schräg', en: 'oblique' },
  radial: { F: [1.3, 0], de: 'radial (leistungslos)', en: 'radial (no power)' },
  brake: { F: [0, -1.3], de: 'gegen die Drehung', en: 'against the turning' },
};

/**
 * Lecture p. 33/34 in the picture: a wheel turns with ω̲ (axis toward you). The force F̲ at P is fixed to the wheel, so the whole
 * picture turns along. Only the tangential part F_t of F̲ is along v̲_P = ω r e_t, therefore P = F̲ · v̲_P = F_t ω r = ω M_z with M_z = r F_t.
 */
export function WheelPower() {
  const tr = useTr(), lang = useLang();
  const [F, setF] = useState<[number, number]>(WH_PRESETS.oblique.F);
  const [r, setR] = useState(1.5);
  const [w, setW] = useState(1);
  const [turn, setTurn] = useState(true);
  const [theta, setTheta] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const visible = useOnScreen(box), reduced = useReducedMotion();
  const wRef = useRef(w); wRef.current = w;
  useEffect(() => {
    if (!turn || !visible || reduced) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => { const dt = Math.min(now - last, 100); last = now; setTheta((a) => (a + (wRef.current * dt) / 1000) % (2 * Math.PI)); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [turn, visible, reduced]);

  const c = Math.cos(theta), sn = Math.sin(theta);
  /** body-frame point (m, y up) → screen */
  const S = (p: [number, number]): V2 => [WH_O[0] + WH_K * (c * p[0] - sn * p[1]), WH_O[1] - WH_K * (sn * p[0] + c * p[1])];
  /** body-frame vector (any unit) × k px → screen offset */
  const D = (v: [number, number], k: number): V2 => [k * (c * v[0] - sn * v[1]), -k * (sn * v[0] + c * v[1])];
  /** screen → body frame (m) */
  const toBody = (q: V2): [number, number] => { const x = (q[0] - WH_O[0]) / WH_K, y = (WH_O[1] - q[1]) / WH_K; return [c * x + sn * y, -sn * x + c * y]; };
  const P: [number, number] = [r, 0];
  const Ps = S(P);
  const tipF: V2 = [Ps[0] + D(F, WH_KF)[0], Ps[1] + D(F, WH_KF)[1]];
  const { Fr, Ft } = radialTangential(P, F);
  const vP = w * r; // tangential speed, along +e_t
  const power = Ft * vP, Mz = momentZ2D(P, F);
  const tipFt: V2 = [Ps[0] + D([0, Ft], WH_KF)[0], Ps[1] + D([0, Ft], WH_KF)[1]];
  const tipFr: V2 = [Ps[0] + D([Fr, 0], WH_KF)[0], Ps[1] + D([Fr, 0], WH_KF)[1]];
  const tipV: V2 = [Ps[0] + D([0, Math.sign(w || 1)], WH_KV * Math.abs(vP))[0], Ps[1] + D([0, Math.sign(w || 1)], WH_KV * Math.abs(vP))[1]];
  const kind = Math.abs(power) < 0.005 ? 'zero' : power > 0 ? 'plus' : 'minus';
  const f2 = (x: number) => fmtNum(x, 2, lang, true);
  const par = (x: number) => (x < -0.004 ? `(${f2(x)})` : f2(x));
  const BAR_X = 200, BAR_K = 14, BAR_Y = 268;
  const barEnd = BAR_X + BAR_K * Math.max(-9, Math.min(9, power));
  const rot = -theta * DEG;
  const pressed = (k: WhPreset) => Math.hypot(F[0] - WH_PRESETS[k].F[0], F[1] - WH_PRESETS[k].F[1]) < 1e-9;

  const { svg, props } = useHandles(WH_VB, (p) => {
    const dF = Math.hypot(p[0] - tipF[0], p[1] - tipF[1]), dP = Math.hypot(p[0] - Ps[0], p[1] - Ps[1]);
    return dF < 28 && dF <= dP ? 'F' : dP < 26 ? 'P' : null;
  }, (p, who) => {
    const q = toBody(p);
    if (who === 'P') setR(Math.max(0.5, Math.min(2.0, q[0])));
    else {
      let fx = (q[0] - r) * (WH_K / WH_KF), fy = q[1] * (WH_K / WH_KF);
      const n = Math.hypot(fx, fy);
      if (n > 2.2) { fx *= 2.2 / n; fy *= 2.2 / n; }
      if (Math.abs(fx) < 0.06) fx = 0;
      if (Math.abs(fy) < 0.06) fy = 0;
      setF([fx, fy]);
    }
  });

  const spokes = [0, 90, 180, 270];
  const lab = (p: V2, dx = 0, dy = 0): React.CSSProperties => at(WH_VB, p[0] + dx, p[1] + dy);
  return (
    <figure className="vdemo lp-fig">
      <div className="v-presets">
        {(Object.keys(WH_PRESETS) as WhPreset[]).map((k) => (
          <button key={k} type="button" aria-pressed={pressed(k)} onClick={() => setF(WH_PRESETS[k].F)}>{tr(WH_PRESETS[k].de, WH_PRESETS[k].en)}</button>
        ))}
      </div>
      <div className="vdemo-fig wide" ref={box}>
        <svg ref={svg} viewBox={WH_VB.join(' ')} {...props} aria-label={tr('Leistung beim drehenden Rad: F und P ziehbar', 'Power in a turning wheel: F and P draggable')}>
          <g transform={`rotate(${rot.toFixed(2)} ${WH_O[0]} ${WH_O[1]})`}>
            <circle cx={WH_O[0]} cy={WH_O[1]} r={WH_K * WH_R} className="lp-wheel" />
            {spokes.map((a) => <line key={a} x1={WH_O[0]} y1={WH_O[1]} x2={WH_O[0] + WH_K * WH_R * Math.cos(a / DEG)} y2={WH_O[1] - WH_K * WH_R * Math.sin(a / DEG)} className={a === 0 ? 'lp-spoke main' : 'lp-spoke'} />)}
            {Math.abs(Fr) > 0.03 && Math.abs(Ft) > 0.03 && <line x1={tipFr[0]} y1={tipFr[1]} x2={tipF[0]} y2={tipF[1]} className="lp-drop" />}
            {Math.abs(Ft) > 0.03 && Math.abs(Fr) > 0.03 && <line x1={tipFt[0]} y1={tipFt[1]} x2={tipF[0]} y2={tipF[1]} className="lp-drop" />}
            {Math.abs(Fr) > 0.03 && <Arrow a={Ps} b={tipFr} cls="lp-grey thin" head={7} />}
            {Math.abs(Ft) > 0.03 && <line x1={Ps[0]} y1={Ps[1]} x2={tipFt[0]} y2={tipFt[1]} className={`lp-band lp-${kind === 'zero' ? 'zero' : kind}`} />}
            <Arrow a={Ps} b={tipV} cls="lp-vel" />
            <Arrow a={Ps} b={tipF} cls="lp-force" />
            <RightAngle a={Ps} q={[Ps[0] + D([-1, 0], 20)[0], Ps[1] + D([-1, 0], 20)[1]]} b={[Ps[0] + D([0, 1], 20)[0], Ps[1] + D([0, 1], 20)[1]]} k={8} />
            <circle cx={tipF[0]} cy={tipF[1]} r={13} className="lp-handle force" />
            <circle cx={Ps[0]} cy={Ps[1]} r={14} className="lp-handle point" />
            <circle cx={Ps[0]} cy={Ps[1]} r={5} className="lp-dot" />
          </g>
          <circle cx={WH_O[0]} cy={WH_O[1]} r={4.5} className="lp-dot o" />
          <circle cx={WH_O[0]} cy={WH_O[1]} r={11} className="lp-wring" />
          <line x1={50} y1={BAR_Y} x2={350} y2={BAR_Y} className="lp-barline" />
          <line x1={BAR_X} y1={BAR_Y - 9} x2={BAR_X} y2={BAR_Y + 9} className="lp-barzero" />
          {Math.abs(power) > 0.01 && <line x1={BAR_X} y1={BAR_Y} x2={barEnd} y2={BAR_Y} className={`lp-barfill lp-${kind}`} />}
        </svg>
        <div className="vdemo-label dark small halo" style={lab(WH_O, 14, 16)}><M>O</M></div>
        <div className="vdemo-label omega small halo" style={lab(WH_O, -22, -22)}><M>{t`\v\omega\ \odot`}</M></div>
        <div className="vdemo-label point small halo" style={lab(Ps, D([0.35, -0.9], 22)[0], D([0.35, -0.9], 22)[1])}><M>P</M></div>
        <div className="vdemo-label force small halo" style={lab(tipF, D(F, 1)[0] / Math.max(1, Math.hypot(F[0], F[1])) * 22, D(F, 1)[1] / Math.max(1, Math.hypot(F[0], F[1])) * 22)}><M>{t`\v F`}</M></div>
        <div className="vdemo-label vel small halo" style={lab(tipV, D([0, Math.sign(w || 1)], 1)[0] * 18, D([0, Math.sign(w || 1)], 1)[1] * 18)}><M>{t`\v v_P`}</M></div>
        {Math.abs(Ft) > 0.3 && Math.abs(Fr) > 0.3 && <div className={`vdemo-label small halo ${kind}`} style={lab(tipFt, D([0, Math.sign(Ft)], 1)[0] * 4 + D([-1, 0], 1)[0] * 24, D([0, Math.sign(Ft)], 1)[1] * 4 + D([-1, 0], 1)[1] * 24)}><M>{t`F_t`}</M></div>}
        {Math.abs(Fr) > 0.3 && <div className="vdemo-label zero small halo" style={lab(tipFr, D([Math.sign(Fr), 0], 1)[0] * 16 + D([0, -1], 1)[0] * 12, D([Math.sign(Fr), 0], 1)[1] * 16 + D([0, -1], 1)[1] * 12)}><M>{t`F_r`}</M></div>}
        <div className="vdemo-label minus small halo" style={at(WH_VB, 28, BAR_Y - 16)}><M>{t`P < 0`}</M></div>
        <div className="vdemo-label plus small halo" style={at(WH_VB, 372, BAR_Y - 16)}><M>{t`P > 0`}</M></div>
        <div className={`vdemo-label small halo ${kind}`} style={at(WH_VB, Math.max(60, Math.min(340, barEnd + (power >= 0 ? 38 : -38))), BAR_Y - 17)}><M>{t`P = ${f2(Math.abs(power) < 0.005 ? 0 : power)}\,\text{W}`}</M></div>
      </div>
      <figcaption className="vdemo-readout">
        <div className="lp-sliders">
          <label className="slider"><M>\omega</M><input type="range" min={-2} max={2} step={0.1} value={w} onChange={(e) => setW(Number(e.target.value))} aria-label="omega" /><span className="val">{fmtNum(w, 1, lang)}</span></label>
          <label className="slider"><M>r</M><input type="range" min={0.5} max={2} step={0.05} value={r} onChange={(e) => setR(Number(e.target.value))} aria-label="r" /><span className="val">{fmtNum(r, 2, lang)}</span></label>
        </div>
        <div className="lp-toggles"><label className="toggle"><input type="checkbox" checked={turn} onChange={(e) => setTurn(e.target.checked)} /> {tr('Rad dreht sich (Bild dreht mit)', 'wheel turns (the picture turns along)')}</label></div>
        <div className="v-result rt-readout lp-formula"><M>{t`P = \v F\cdot\v v_P = F_t\cdot\omega r`}</M><M>{t`= ${par(Ft)}\cdot ${par(w)}\cdot ${f2(r)} = ${f2(Math.abs(power) < 0.005 ? 0 : power)}\,\text{W}`}</M></div>
        <div className="v-result rt-readout lp-formula"><M>{t`P = \omega\,M_z = \omega\,(r\,F_t)`}</M><M>{t`= ${par(w)}\cdot ${f2(Mz)} = ${f2(Math.abs(w * Mz) < 0.005 ? 0 : w * Mz)}\,\text{W}`}</M></div>
        <p className="vdemo-note">{tr(
          <>Die Kraft ist am Rad festgeschweisst, darum dreht das ganze Bild mit. Nur <M>{t`F_t`}</M> (der Teil längs <M>{t`\v v_P`}</M>, vollfarbig) zählt; <M>{t`F_r`}</M> (grau, gestrichelt) zeigt zur Nabe hin oder von ihr weg und ist leistungslos. <M>{t`F_t`}</M> mal <M>r</M> ist genau das Moment <M p=".">{t`M_z`}</M> Ziehe <M>P</M> entlang der Speiche und die Spitze von <M p=".">{t`\v F`}</M></>,
          <>The force is welded to the wheel, so the whole picture turns along. Only <M>{t`F_t`}</M> (the part along <M>{t`\v v_P`}</M>, full colour) counts; <M>{t`F_r`}</M> (grey, dashed) points toward or away from the hub and does no power. <M>{t`F_t`}</M> times <M>r</M> is exactly the moment <M p=".">{t`M_z`}</M> Drag <M>P</M> along the spoke and the tip of <M p=".">{t`\v F`}</M></>)}</p>
      </figcaption>
    </figure>
  );
}

