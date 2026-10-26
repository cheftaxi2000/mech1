import { useRef, useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { contactPowers, lorentzCircle, watt } from '../../physics/powerMoment';
import { at } from '../figUtils';
import { Arrow, RightAngle, useTicker, type V2 } from './lpDraw';
import './lp.css';

const t = String.raw;
const RAD = Math.PI / 180;

/* ───────────────────────────── three pictures from everyday life (intuition box) ───────────────────────────── */
const EV_VB: [number, number, number, number] = [0, 0, 200, 128];

/** Shopping trolley: wheels, basket, push bar. `A` = the hand on the push bar. */
function Trolley() {
  return (
    <g className="lp-glyph">
      <polygon points="46,58 128,58 118,88 56,88" />
      <line x1={128} y1={58} x2={142} y2={40} />
      <circle cx={64} cy={96} r={7} /><circle cx={112} cy={96} r={7} />
      <line x1={20} y1={104} x2={188} y2={104} className="lp-ground" />
    </g>
  );
}

/**
 * Three mental pictures for «Leistung» (intuition box): pushing a trolley (force with the motion), braking it (force against
 * the motion), a stone on a string (force at a right angle to the motion). Pure drawings, no controls.
 */
export function EverydayPower() {
  const tr = useTr();
  const A: V2 = [142, 40];
  const panels = [
    { k: 'push', tag: 'plus', head: tr('Wagen anschieben', 'Pushing a trolley'), txt: tr('Die Hand drückt in Fahrtrichtung.', 'The hand pushes the way it rolls.'), sign: <M>{t`P > 0`}</M> },
    { k: 'brake', tag: 'minus', head: tr('Wagen abbremsen', 'Braking a trolley'), txt: tr('Die Hand hält gegen die Fahrtrichtung.', 'The hand holds back against the way it rolls.'), sign: <M>{t`P < 0`}</M> },
    { k: 'string', tag: 'zero', head: tr('Stein an der Schnur', 'Stone on a string'), txt: tr('Die Schnur zieht zur Mitte, quer zur Bahn.', 'The string pulls to the centre, across the path.'), sign: <M>{t`P = 0`}</M> },
  ];
  const sc: V2 = [100, 60], R = 40, st: V2 = [sc[0] + R, sc[1]]; // stone at the right of its circle, moving up
  return (
    <div className="lp-everyday" role="group" aria-label={tr('Drei Bilder aus dem Alltag', 'Three pictures from everyday life')}>
      {panels.map((p) => (
        <figure key={p.k} className="lp-ev">
          <div className="vdemo-fig lp-ev-fig">
            <svg viewBox={EV_VB.join(' ')} aria-hidden="true">
              {p.k !== 'string' && (<>
                <Trolley />
                <Arrow a={[70, 118]} b={[134, 118]} cls="lp-vel" />
                <Arrow a={A} b={p.k === 'push' ? [A[0] + 44, A[1]] : [A[0] - 44, A[1]]} cls="lp-force" />
                <circle cx={A[0]} cy={A[1]} r={4.5} className="lp-dot" />
              </>)}
              {p.k === 'string' && (<>
                <circle cx={sc[0]} cy={sc[1]} r={R} className="lp-path" />
                <line x1={sc[0]} y1={sc[1]} x2={st[0]} y2={st[1]} className="lp-string" />
                <circle cx={sc[0]} cy={sc[1]} r={3} className="lp-foot" />
                <Arrow a={st} b={[st[0], st[1] - 40]} cls="lp-vel" />
                <Arrow a={st} b={[st[0] - 40, st[1]]} cls="lp-force" />
                <RightAngle a={st} q={[st[0], st[1] - 40]} b={[st[0] - 40, st[1]]} k={8} />
                <circle cx={st[0]} cy={st[1]} r={5} className="lp-dot" />
              </>)}
            </svg>
            {p.k !== 'string' && (<>
              <div className="vdemo-label force small" style={at(EV_VB, p.k === 'push' ? A[0] + 40 : A[0] - 42, A[1] - 14)}><M>{t`\v F`}</M></div>
              <div className="vdemo-label vel small" style={at(EV_VB, 152, 118)}><M>{t`\v v_A`}</M></div>
              <div className="vdemo-label point small" style={at(EV_VB, A[0] + 4, A[1] + 15)}><M>A</M></div>
            </>)}
            {p.k === 'string' && (<>
              <div className="vdemo-label force small" style={at(EV_VB, st[0] - 36, st[1] - 14)}><M>{t`\v F`}</M></div>
              <div className="vdemo-label vel small" style={at(EV_VB, st[0] + 18, st[1] - 36)}><M>{t`\v v_A`}</M></div>
              <div className="vdemo-label point small" style={at(EV_VB, st[0] + 14, st[1] + 12)}><M>A</M></div>
            </>)}
          </div>
          <figcaption>
            <b>{p.head}</b><br />{p.txt}<br />
            <span className={`lp-sign lp-${p.tag}`}>{p.sign}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/* ───────────────────────────── Fig. 5.2 left: Normalkraft ───────────────────────────── */
const NF_VB: [number, number, number, number] = [0, 0, 400, 268];
const NF_C: V2 = [206, 178]; // contact point (M₁ on the ball, M₂ on the surface)
const NF_TH = 22 * RAD; // slope of the surface
const NF_T: V2 = [Math.cos(NF_TH), -Math.sin(NF_TH)]; // tangent (up to the right), screen coordinates
const NF_N: V2 = [-Math.sin(NF_TH), -Math.cos(NF_TH)]; // normal on the ball's side (up to the left)
const NF_R = 44, NF_KN = 15, NF_KV = 34, NF_N0 = 4; // ball radius, px per N, px per m/s, the force N = 4 N
const along = (p: V2, d: V2, s: number): V2 => [p[0] + s * d[0], p[1] + s * d[1]];

export function nfFrame(s1: number, s2: number, u: number) {
  // velocities in the (t, n) basis of the contact: tangential parts s₁, s₂; both contact points move with u along n (contact is kept)
  const N: [number, number, number] = [0, NF_N0, 0]; // N̲ = N e̲_n  (n-axis of the contact, in a 2D frame (t, n))
  const v1: [number, number, number] = [s1, u, 0], v2: [number, number, number] = [s2, u, 0];
  return { ...contactPowers(N, v1, v2), v1, v2 };
}

/**
 * Lecture p. 33, Fig. 5.2 left «Normalkraft»: a ball on a curved surface. N̲ acts on the ball at M₁, −N̲ on the surface at M₂;
 * v̲₁ and v̲₂ are the velocities of those two points and lie in the tangent plane. N̲ ⟂ v̲ ⇒ both powers are 0.
 * Supplement slider: if the surface itself moves along N̲ (an elevator floor), N̲ · v̲ is no longer 0.
 */
export function NormalForceFigure() {
  const tr = useTr(), lang = useLang();
  const [s1, setS1] = useState(1.4), [s2, setS2] = useState(-1), [u, setU] = useState(0);
  const f = nfFrame(s1, s2, u);
  const C = NF_C;
  const vec = (a: number, b: number): V2 => [a * NF_KV * NF_T[0] + b * NF_KV * NF_N[0], a * NF_KV * NF_T[1] + b * NF_KV * NF_N[1]]; // (t, n)-components → screen offset
  const v1o = vec(f.v1[0], f.v1[1]), v2o = vec(f.v2[0], f.v2[1]);
  // the surface: a gentle valley through C (concave towards the ball)
  const surf = Array.from({ length: 41 }, (_, i) => { const s = -190 + (i * 380) / 40; return [C[0] + s * NF_T[0] + 0.0028 * s * s * NF_N[0] * 0.5 * 2, C[1] + s * NF_T[1] + 0.0028 * s * s * NF_N[1] * 0.5 * 2] as V2; });
  const hatch = Array.from({ length: 27 }, (_, i) => { const s = -182 + i * 14, p = surf[Math.round(((s + 190) / 380) * 40)]; return [p, [p[0] - 9 * NF_N[0] - 6 * NF_T[0], p[1] - 9 * NF_N[1] - 6 * NF_T[1]] as V2] as const; });
  const Nt = along(C, NF_N, NF_KN * NF_N0), mNt = along(C, NF_N, -NF_KN * NF_N0);
  const centre = along(C, NF_N, NF_R);
  const fx = (x: number) => fmtNum(x, 1, lang, true);
  const sg = (x: number) => (x < 0 ? `(${fx(x)})` : fx(x));
  const P1 = Math.abs(f.P1) < 1e-9 ? 0 : f.P1, P2 = Math.abs(f.P2) < 1e-9 ? 0 : f.P2;
  const lift = Math.abs(u) > 0.005;
  const off = (d: V2, k: number): V2 => [d[0] + k * NF_N[0], d[1] + k * NF_N[1]];
  const dv1 = Math.hypot(v1o[0], v1o[1]), dv2 = Math.hypot(v2o[0], v2o[1]);
  return (
    <figure className="vdemo lp-fig">
      <div className="vdemo-fig wide">
        <svg viewBox={NF_VB.join(' ')} aria-label={tr('Normalkraft: Kugel auf gekrümmter Fläche', 'Normal force: ball on a curved surface')}>
          {hatch.map(([a, b], i) => <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="lp-hatch" />)}
          <polyline points={surf.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')} className="lp-surface" />
          <circle cx={centre[0]} cy={centre[1]} r={NF_R} className="lp-ball" />
          <Arrow a={C} b={Nt} cls="lp-force" />
          <Arrow a={C} b={mNt} cls="lp-force" />
          {dv1 > 3 && <Arrow a={off(C, 4)} b={off([C[0] + v1o[0], C[1] + v1o[1]], 4)} cls="lp-vel" />}
          {dv2 > 3 && <Arrow a={off(C, -4)} b={off([C[0] + v2o[0], C[1] + v2o[1]], -4)} cls="lp-vel" />}
          <RightAngle a={C} q={Nt} b={along(C, NF_T, 30)} k={12} />
          <circle cx={C[0]} cy={C[1]} r={4.5} className="lp-dot hollow" />
          <circle cx={C[0]} cy={C[1]} r={2} className="lp-dot" />
        </svg>
        <div className="vdemo-label force small halo" style={at(NF_VB, Nt[0] - 4, Nt[1] - 18)}><M>{t`\v N`}</M></div>
        <div className="vdemo-label force small halo" style={at(NF_VB, mNt[0] + 26, mNt[1] + 6)}><M>{t`-\v N`}</M></div>
        {dv1 > 14 && <div className="vdemo-label vel small halo" style={at(NF_VB, C[0] + v1o[0] + 20 * NF_T[0] + 4, C[1] + v1o[1] + 20 * NF_T[1] - 6)}><M>{t`\v v_1`}</M></div>}
        {dv2 > 14 && <div className="vdemo-label vel small halo" style={at(NF_VB, C[0] + v2o[0] - 20 * NF_T[0] - 8, C[1] + v2o[1] - 20 * NF_T[1] + 8)}><M>{t`\v v_2`}</M></div>}
        <div className="vdemo-label point small halo" style={at(NF_VB, C[0] - 22, C[1] - 8)}><M>{t`M_1`}</M></div>
        <div className="vdemo-label point small halo" style={at(NF_VB, C[0] + 24, C[1] + 12)}><M>{t`M_2`}</M></div>
      </div>
      <figcaption className="vdemo-readout">
        <div className="lp-sliders">
          <label className="slider"><M>{t`s_1`}</M><input type="range" min={-2} max={2} step={0.1} value={s1} onChange={(e) => setS1(Number(e.target.value))} aria-label="s1" /><span className="val">{fmtNum(s1, 1, lang)}</span></label>
          <label className="slider"><M>{t`s_2`}</M><input type="range" min={-2} max={2} step={0.1} value={s2} onChange={(e) => setS2(Number(e.target.value))} aria-label="s2" /><span className="val">{fmtNum(s2, 1, lang)}</span></label>
          <label className="slider"><M>u</M><input type="range" min={-1} max={1} step={0.1} value={u} onChange={(e) => setU(Number(e.target.value))} aria-label="u" /><span className="val">{fmtNum(u, 1, lang)}</span></label>
        </div>
        <div className="v-result rt-readout lp-formula"><M>{t`P_1 = \v N\cdot\v v_1 = N\,(s_1\cos 90^\circ + u) = ${fx(NF_N0)}\cdot ${sg(u)} = ${fx(P1)}\,\text{W}`}</M></div>
        <div className="v-result rt-readout lp-formula"><M>{t`P_2 = (-\v N)\cdot\v v_2 = -N\,(s_2\cos 90^\circ + u) = ${fx(P2)}\,\text{W}`}</M></div>
        <p className="vdemo-note">{lift
          ? tr(<>Fährt die Unterlage selbst entlang <M>{t`\v N`}</M> (<M>{t`u \neq 0`}</M> wie ein Lift), ist <M>{t`\v N`}</M> nicht mehr senkrecht zur Bewegung: <M>{t`P_1`}</M> und <M>{t`P_2`}</M> sind nicht 0, aber sie haben entgegengesetzte Vorzeichen – die Summe bleibt <M p=".">0</M></>,
            <>If the surface itself moves along <M>{t`\v N`}</M> (<M>{t`u \neq 0`}</M>, like a lift), <M>{t`\v N`}</M> is no longer perpendicular to the motion: <M>{t`P_1`}</M> and <M>{t`P_2`}</M> are not 0, but they have opposite signs – the sum stays <M p=".">0</M></>)
          : tr(<>Beide Geschwindigkeiten liegen in der Berührebene, <M>{t`\v N`}</M> steht senkrecht darauf (Winkelzeichen): <M>{t`\cos 90^\circ = 0`}</M> Egal, wie schnell die Punkte gleiten (<M>{t`s_1`}</M>, <M p=")">{t`s_2`}</M> – beide Leistungen bleiben <M p=".">0</M></>,
            <>Both velocities lie in the contact plane, <M>{t`\v N`}</M> is perpendicular to it (right-angle mark): <M>{t`\cos 90^\circ = 0`}</M> However fast the points slide (<M>{t`s_1`}</M>, <M p=")">{t`s_2`}</M> – both powers stay <M p=".">0</M></>)}</p>
      </figcaption>
    </figure>
  );
}

/* ───────────────────────────── Fig. 5.2 right: Lorentzkraft ───────────────────────────── */
const LZ_VB: [number, number, number, number] = [0, 0, 400, 270];
const LZ_C: V2 = [200, 138];
const LZ_V = 2; // speed of the charge (relative units)

/**
 * Lecture p. 33, Fig. 5.2 right «Lorentzkraft»: a charge q in a magnetic field B̲. F̲ = q v̲ × B̲ stands perpendicular to v̲
 * (and to B̲) at every moment, so P = F̲ · v̲ = 0. Seen from above, B̲ points out of the page (⊙). If only this force acts, the charge
 * runs on a circle (supplement): slower or faster turning with B, the other way round for q < 0.
 */
export function LorentzFigure() {
  const tr = useTr(), lang = useLang();
  const [B, setB] = useState(1.4), [q, setQ] = useState<1 | -1>(1);
  const box = useRef<HTMLDivElement>(null);
  const clock = useTicker(box, true, 1);
  const a = 0.35 + clock * 0.5 * B; // angle on the circle
  const Rpx = 92 / B;
  const s = q;
  const pos: V2 = [LZ_C[0] + Rpx * s * Math.sin(a), LZ_C[1] - Rpx * Math.cos(a)];
  const fr = lorentzCircle(q, B, LZ_V, a);
  // screen directions: the velocity in physics coordinates (y up) → screen (y down); for q < 0 the charge runs the other way round
  const vdir: V2 = [s * Math.cos(a), Math.sin(a)];
  const Fdir: V2 = [-s * Math.sin(a), Math.cos(a)];
  const KV = 26, KF = 11;
  const tipV: V2 = [pos[0] + KV * LZ_V * vdir[0], pos[1] + KV * LZ_V * vdir[1]];
  const Fmag = Math.hypot(fr.F[0], fr.F[1]);
  const tipF: V2 = [pos[0] + KF * Fmag * Fdir[0], pos[1] + KF * Fmag * Fdir[1]];
  const dots: V2[] = [];
  for (let x = 40; x < 380; x += 52) for (let y = 34; y < 250; y += 50) dots.push([x, y]);
  const f1 = (x: number) => fmtNum(x, 1, lang, true), f2 = (x: number) => fmtNum(x, 2, lang, true);
  const P = Math.abs(fr.P) < 1e-9 ? 0 : fr.P;
  return (
    <figure className="vdemo lp-fig">
      <div className="v-presets">
        <button type="button" aria-pressed={q === 1} onClick={() => setQ(1)}><M>{t`q > 0`}</M></button>
        <button type="button" aria-pressed={q === -1} onClick={() => setQ(-1)}><M>{t`q < 0`}</M></button>
      </div>
      <div className="vdemo-fig wide" ref={box}>
        <svg viewBox={LZ_VB.join(' ')} aria-label={tr('Lorentzkraft: Ladung im Magnetfeld, von oben gesehen', 'Lorentz force: charge in a magnetic field, seen from above')}>
          {dots.map((d, i) => <g key={i}><circle cx={d[0]} cy={d[1]} r={5} className="lp-bring" /><circle cx={d[0]} cy={d[1]} r={1.7} className="lp-bdot" /></g>)}
          <circle cx={LZ_C[0]} cy={LZ_C[1]} r={Rpx} className="lp-path" />
          <line x1={pos[0]} y1={pos[1]} x2={LZ_C[0]} y2={LZ_C[1]} className="lp-string" />
          <circle cx={LZ_C[0]} cy={LZ_C[1]} r={2.5} className="lp-foot" />
          <Arrow a={pos} b={tipV} cls="lp-vel" />
          <Arrow a={pos} b={tipF} cls="lp-force" />
          <RightAngle a={pos} q={tipV} b={tipF} k={9} />
          <circle cx={pos[0]} cy={pos[1]} r={6.5} className="lp-charge" />
        </svg>
        <div className="vdemo-label force small halo" style={at(LZ_VB, tipF[0] + 14 * Fdir[0], tipF[1] + 14 * Fdir[1])}><M>{t`\v F`}</M></div>
        <div className="vdemo-label vel small halo" style={at(LZ_VB, tipV[0] + 18 * vdir[0], tipV[1] + 18 * vdir[1])}><M>{t`\v v`}</M></div>
        <div className="vdemo-label point small halo" style={at(LZ_VB, pos[0] - 16 * (vdir[0] + Fdir[0]) * 0.7, pos[1] - 16 * (vdir[1] + Fdir[1]) * 0.7)}><M>{q > 0 ? '+q' : '-q'}</M></div>
        <div className="vdemo-label omega small halo" style={at(LZ_VB, 372, 250)}><M>{t`\v B\ \odot`}</M></div>
      </div>
      <figcaption className="vdemo-readout">
        <div className="lp-sliders">
          <label className="slider"><M>B</M><input type="range" min={1} max={2.5} step={0.1} value={B} onChange={(e) => setB(Number(e.target.value))} aria-label="B" /><span className="val">{fmtNum(B, 1, lang)}</span></label>
        </div>
        <div className="v-result rt-readout lp-formula"><M>{t`\v F = q\,\v v\times\v B,\qquad |\v F| = |q|\,v\,B = ${f1(Math.abs(q))}\cdot ${f1(LZ_V)}\cdot ${f1(B)} = ${f2(Fmag)}`}</M></div>
        <div className="v-result rt-readout lp-formula lp-zero"><M>{t`P = \v F\cdot\v v = ${f2(P)}\ \ (\text{${tr('immer', 'always')}})`}</M></div>
        <p className="vdemo-note">{tr(
          <>Von oben gesehen zeigt <M>{t`\v B`}</M> aus der Seite heraus (<M p=").">{t`\odot`}</M> Das Kreuzprodukt <M>{t`\v v\times\v B`}</M> steht senkrecht auf <M>{t`\v v`}</M> – in jedem Augenblick, wohin sich die Ladung auch bewegt. Darum ist <M p=",">{t`\v F\cdot\v v = 0`}</M> die Kraft lenkt die Ladung nur ab. (Ergänzung, kommt mit der Dynamik: Das Tempo bleibt dabei gleich; wirkt nur diese Kraft, läuft die Ladung auf einem Kreis, enger bei grösserem <M p=".)">B</M></>,
          <>Seen from above, <M>{t`\v B`}</M> points out of the page (<M p=").">{t`\odot`}</M> The cross product <M>{t`\v v\times\v B`}</M> is perpendicular to <M>{t`\v v`}</M> – at every moment, wherever the charge moves. So <M p=",">{t`\v F\cdot\v v = 0`}</M> the force only deflects the charge. (Supplement, comes with dynamics: its speed stays the same; if only this force acts, the charge runs on a circle, tighter for larger <M p=".)">B</M></>)}</p>
      </figcaption>
    </figure>
  );
}

/* ───────────────────────────── watts in everyday numbers (supplement) ───────────────────────────── */
export const WATT_MARKS = [
  { id: 'unit', F: 1, v: 1, de: '1 N bei 1 m/s', en: '1 N at 1 m/s', FtexDe: String.raw`1\,\text{N}`, vtex: String.raw`1\,\text{m/s}` },
  { id: 'bike', F: 15, v: 7, de: 'Velo bei 25 km/h', en: 'bike at 25 km/h', FtexDe: String.raw`15\,\text{N}`, vtex: String.raw`7\,\text{m/s}` },
  { id: 'car', F: 500, v: 100 / 3.6, de: 'Auto bei 100 km/h', en: 'car at 100 km/h', FtexDe: String.raw`500\,\text{N}`, vtex: String.raw`28\,\text{m/s}` },
  { id: 'train', F: 200000, v: 20, de: 'Lokomotive bei 72 km/h', en: 'locomotive at 72 km/h', FtexDe: String.raw`200\,\text{kN}`, vtex: String.raw`20\,\text{m/s}` },
] as const;
export const wattMarkValue = (m: { F: number; v: number }) => watt(m.F, m.v);

/** Logarithmic scale from 1 W to 10 MW with four F · v examples (supplement, rounded numbers). */
export function WattScale() {
  const tr = useTr(), lang = useLang();
  const vb: [number, number, number, number] = [0, 0, 400, 128];
  const x = (P: number) => 30 + (Math.log10(P) / 7) * 340; // 1 W … 10 MW
  const ticks = [[1, '1\\,\\text{W}'], [1e1, '10'], [1e2, '100'], [1e3, '1\\,\\text{kW}'], [1e4, '10'], [1e5, '100'], [1e6, '1\\,\\text{MW}'], [1e7, '10']] as const;
  const fmtP = (P: number) => (P >= 1e6 ? `${fmtNum(P / 1e6, 0, lang, true)}\\,\\text{MW}` : P >= 1e3 ? `${fmtNum(P / 1e3, 0, lang, true)}\\,\\text{kW}` : `${fmtNum(P, 0, lang, true)}\\,\\text{W}`);
  const rows = [100, 72, 100, 72]; // alternate heights so the labels do not collide
  return (
    <figure className="vdemo lp-fig">
      <div className="vdemo-fig wide">
        <svg viewBox={vb.join(' ')} aria-label={tr('Leistung auf einer logarithmischen Skala', 'Power on a logarithmic scale')}>
          <line x1={x(1)} y1={30} x2={x(1e7)} y2={30} className="lp-axis" />
          {ticks.map(([P]) => <line key={P} x1={x(P)} y1={25} x2={x(P)} y2={35} className="lp-scaletick" />)}
          {WATT_MARKS.map((m, i) => { const P = wattMarkValue(m); return (
            <g key={m.id}><line x1={x(P)} y1={30} x2={x(P)} y2={rows[i] - 24} className="lp-mark-stem" /><circle cx={x(P)} cy={30} r={5} className="lp-mark" /></g>
          ); })}
        </svg>
        {ticks.map(([P, tex]) => <div key={P} className="vdemo-label muted small" style={at(vb, x(P), 12)}><M>{tex}</M></div>)}
        {WATT_MARKS.map((m, i) => { const P = wattMarkValue(m); return (
          <div key={m.id} className="vdemo-label dark small halo lp-markrow" style={at(vb, Math.min(352, Math.max(48, x(P))), rows[i])}>
            <div>{tr(m.de, m.en)}</div>
            <div><M>{t`${m.FtexDe}\cdot ${m.vtex} ${m.id === 'unit' ? '=' : '\\approx'} ${fmtP(P)}`}</M></div>
          </div>
        ); })}
      </div>
    </figure>
  );
}
