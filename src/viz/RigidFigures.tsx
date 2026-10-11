import { useEffect, useRef, useState } from 'react';
import { M } from '../components/Tex';
import { fmtNum, useLang, useTr } from '../i18n';
import { at, useReducedMotion } from './VectorFigures';

const t = String.raw;
type V = [number, number];
const DEG = Math.PI / 180;

/** SVG arrow (y-down SVG coordinates). */
function Arrow({ a, b, cls }: { a: V; b: V; cls: string }) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
  if (l < 1.5) return null;
  const ux = dx / l, uy = dy / l, s = 9;
  const head = `${b[0]},${b[1]} ${b[0] - s * ux + 0.45 * s * uy},${b[1] - s * uy - 0.45 * s * ux} ${b[0] - s * ux - 0.45 * s * uy},${b[1] - s * uy + 0.45 * s * ux}`;
  return <g className={cls}><line x1={a[0]} y1={a[1]} x2={b[0] - ux * 4} y2={b[1] - uy * 4} /><polygon points={head} /></g>;
}

/* ------------------------------------------------------------------------------------------------ */
const VB1: [number, number, number, number] = [0, 0, 400, 270];
const PM: V = [110, 160], PN: V = [290, 120];

/**
 * SdpG (lecture p. 12) to play with: choose the velocity of M (direction) and how fast the body turns (ω).
 * The velocity of N follows from rigidity, v_N = v_M + ω × MN; the projections onto MN (teal) stay equal.
 * "Body stretches" adds a stretching motion: then the projections differ — the theorem needs a rigid body.
 */
export function SdpgDemo() {
  const tr = useTr(), lang = useLang();
  const [dir, setDir] = useState(-35);
  const [w, setW] = useState(0.5);
  const [stretch, setStretch] = useState(false);
  const a: V = [PN[0] - PM[0], PN[1] - PM[1]], L = Math.hypot(...a), u: V = [a[0] / L, a[1] / L];
  const vM: V = [70 * Math.cos(dir * DEG), -70 * Math.sin(dir * DEG)]; // SVG y down
  // ω × a in the plane (counter-clockwise positive, SVG y down): (a_y, −a_x)·ω
  const k = stretch ? 0.35 : 0;
  const vN: V = [vM[0] + w * a[1] + k * a[0], vM[1] - w * a[0] + k * a[1]];
  const pM = vM[0] * u[0] + vM[1] * u[1], pN = vN[0] * u[0] + vN[1] * u[1];
  const tip = (p: V, v: V): V => [p[0] + v[0], p[1] + v[1]];
  const foot = (p: V, s: number): V => [p[0] + s * u[0], p[1] + s * u[1]];
  const f = (x: number) => fmtNum(x / 70, 2, lang, true);
  const same = Math.abs(pM - pN) < 0.5;
  return (
    <figure className="vdemo">
      <div className="vdemo-fig wide">
        <svg viewBox={VB1.join(' ')} aria-label={tr('Starrer Körper mit zwei Punkten und ihren Geschwindigkeiten', 'Rigid body with two points and their velocities')}>
          <ellipse cx={(PM[0] + PN[0]) / 2} cy={(PM[1] + PN[1]) / 2} rx={150} ry={62} transform={`rotate(${(Math.atan2(a[1], a[0]) / DEG).toFixed(1)} ${(PM[0] + PN[0]) / 2} ${(PM[1] + PN[1]) / 2})`} className={`rb-body${stretch ? ' soft' : ''}`} />
          <line x1={PM[0] - 70 * u[0]} y1={PM[1] - 70 * u[1]} x2={PN[0] + 90 * u[0]} y2={PN[1] + 90 * u[1]} className="v-line" />
          <Arrow a={PM} b={PN} cls="rb-a" />
          <line x1={tip(PM, vM)[0]} y1={tip(PM, vM)[1]} x2={foot(PM, pM)[0]} y2={foot(PM, pM)[1]} className="v-drop" />
          <line x1={tip(PN, vN)[0]} y1={tip(PN, vN)[1]} x2={foot(PN, pN)[0]} y2={foot(PN, pN)[1]} className="v-drop" />
          <line x1={PM[0]} y1={PM[1]} x2={foot(PM, pM)[0]} y2={foot(PM, pM)[1]} className="rb-proj" />
          <line x1={PN[0]} y1={PN[1]} x2={foot(PN, pN)[0]} y2={foot(PN, pN)[1]} className={`rb-proj${same ? '' : ' bad'}`} />
          <Arrow a={PM} b={tip(PM, vM)} cls="rb-v" />
          <Arrow a={PN} b={tip(PN, vN)} cls="rb-v" />
          <circle cx={PM[0]} cy={PM[1]} r={5} className="v-m" /><circle cx={PN[0]} cy={PN[1]} r={5} className="v-m" />
        </svg>
        <div className="vdemo-label point" style={at(VB1, PM[0] - 14, PM[1] + 14)}><M>M</M></div>
        <div className="vdemo-label point" style={at(VB1, PN[0] + 12, PN[1] + 16)}><M>N</M></div>
        <div className="vdemo-label point small" style={at(VB1, tip(PM, vM)[0] + 4, tip(PM, vM)[1] + 14)}><M>{t`\v v_M`}</M></div>
        <div className="vdemo-label point small" style={at(VB1, tip(PN, vN)[0] + 14, tip(PN, vN)[1] - 8)}><M>{t`\v v_N`}</M></div>
        <div className="vdemo-label muted small" style={at(VB1, (PM[0] + PN[0]) / 2 + 8, (PM[1] + PN[1]) / 2 + 16)}><M>{t`\v a`}</M></div>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider"><span>{tr('Richtung', 'Direction')} <M>{t`\v v_M`}</M></span>
          <input type="range" min={-180} max={180} step={1} value={dir} onChange={(e) => setDir(Number(e.target.value))} aria-label="dir" /><span className="val">{dir < 0 ? '\u2212' : ''}{Math.abs(dir)}°</span></label>
        <label className="slider wide-slider"><span>{tr('Drehung', 'Turning')} <M>\omega</M></span>
          <input type="range" min={-1} max={1} step={0.01} value={w} onChange={(e) => setW(Number(e.target.value))} aria-label="omega" /><span className="val">{fmtNum(w, 2, lang)}</span></label>
        <label className="toggle"><input type="checkbox" checked={stretch} onChange={(e) => setStretch(e.target.checked)} />{' '}
          {tr('Körper dehnt sich (nicht mehr starr)', 'body stretches (no longer rigid)')}</label>
        <div className={`v-result ${same ? 'pos' : 'neg'}`}><M>{t`|\v v'_M| = ${f(pM)}, \qquad |\v v'_N| = ${f(pN)}`}</M></div>
        <p className="vdemo-note">{stretch
          ? tr(<>Jetzt wird der Körper länger: <M>N</M> entfernt sich von <M p=",">M</M> die Projektionen sind verschieden. Der Satz gilt nur für starre Körper.</>, <>Now the body gets longer: <M>N</M> moves away from <M p=",">M</M> the projections differ. The theorem holds only for rigid bodies.</>)
          : tr(<>Egal wie du <M>{t`\v v_M`}</M> und die Drehung wählst: Die türkisen Projektionen auf die Gerade <M>{t`MN`}</M> sind gleich lang.</>, <>Whatever you choose for <M>{t`\v v_M`}</M> and the turning: the teal projections onto the line <M>{t`MN`}</M> are equally long.</>)}</p>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------------------------------------ */
const VB2: [number, number, number, number] = [0, 0, 400, 300];
const WALL = 330, FLOOR = 262, LPX = 230, VH = 55; // px; v_H drawn as 55 px

/**
 * Beispiel gleitende Leiter (lecture p. 13): A slides on the floor towards the wall with v_H, B slides up the wall.
 * The SdpG along AB gives v_V = v_H cot α. "Play" lets the ladder slide (α grows).
 */
export function LadderDemo() {
  const tr = useTr(), lang = useLang();
  const reduced = useReducedMotion();
  const [al, setAl] = useState(35);
  const [play, setPlay] = useState(false);
  const alRef = useRef(al); alRef.current = al;
  useEffect(() => {
    if (!play) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000; last = now;
      // A moves towards the wall with constant v_H: d(L cos α)/dt = −v_H  →  α̇ = v_H / (L sin α)  (here in units of the drawing, slowed down)
      const a = alRef.current * DEG, next = (a + (dt * 0.35) / Math.sin(a)) / DEG;
      if (next >= 80) { setAl(80); setPlay(false); return; }
      setAl(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play]);
  const a = al * DEG;
  const A: V = [WALL - LPX * Math.cos(a), FLOOR], B: V = [WALL, FLOOR - LPX * Math.sin(a)];
  const vv = VH / Math.tan(a), vvDraw = Math.min(vv, 150);
  const u: V = [Math.cos(a), -Math.sin(a)]; // A → B, SVG y down
  const pA = VH * u[0]; // v_A·u = v_H cos α
  const projB = vv * Math.sin(a); // v_B = (0, −vv) in SVG ⇒ v_B·u = vv sin α (= v_H cos α)
  const tipA: V = [A[0] + VH, A[1]], tipB: V = [B[0], B[1] - vvDraw];
  const footA: V = [A[0] + pA * u[0], A[1] + pA * u[1]], footB: V = [B[0] + projB * u[0], B[1] + projB * u[1]];
  const f = (x: number) => fmtNum(x, 2, lang, true);
  return (
    <figure className="vdemo">
      <div className="vdemo-fig wide">
        <svg viewBox={VB2.join(' ')} aria-label={tr('Gleitende Leiter', 'Sliding ladder')}>
          <line x1={20} y1={FLOOR} x2={WALL + 10} y2={FLOOR} className="ld-ground" />
          <line x1={WALL} y1={FLOOR} x2={WALL} y2={10} className="ld-ground" />
          {Array.from({ length: 14 }, (_, i) => <line key={i} x1={30 + i * 22} y1={FLOOR} x2={22 + i * 22} y2={FLOOR + 8} className="ld-hatch" />)}
          {Array.from({ length: 11 }, (_, i) => <line key={`w${i}`} x1={WALL} y1={20 + i * 22} x2={WALL + 8} y2={28 + i * 22} className="ld-hatch" />)}
          <path d={`M ${A[0] + 34} ${A[1]} A 34 34 0 0 0 ${A[0] + 34 * Math.cos(a)} ${A[1] - 34 * Math.sin(a)}`} className="v-arc" />
          <line x1={A[0] - 40 * u[0]} y1={A[1] - 40 * u[1]} x2={B[0] + 40 * u[0]} y2={B[1] + 40 * u[1]} className="v-line" />
          <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} className="ld-ladder" />
          <line x1={tipA[0]} y1={tipA[1]} x2={footA[0]} y2={footA[1]} className="v-drop" />
          {vv <= 150 && <line x1={tipB[0]} y1={tipB[1]} x2={footB[0]} y2={footB[1]} className="v-drop" />}
          <line x1={A[0]} y1={A[1]} x2={footA[0]} y2={footA[1]} className="rb-proj" />
          <line x1={B[0]} y1={B[1]} x2={footB[0]} y2={footB[1]} className="rb-proj" />
          <Arrow a={A} b={tipA} cls="rb-v" />
          <Arrow a={B} b={tipB} cls="rb-v" />
          <circle cx={A[0]} cy={A[1]} r={5} className="v-m" /><circle cx={B[0]} cy={B[1]} r={5} className="v-m" />
        </svg>
        <div className="vdemo-label point" style={at(VB2, A[0] - 4, A[1] + 22)}><M>A</M></div>
        <div className="vdemo-label point" style={at(VB2, B[0] + 22, B[1] + 4)}><M>B</M></div>
        <div className="vdemo-label angle" style={at(VB2, A[0] + 50 * Math.cos(a / 2), A[1] - 50 * Math.sin(a / 2))}><M>\alpha</M></div>
        <div className="vdemo-label muted" style={at(VB2, (A[0] + B[0]) / 2 - 16, (A[1] + B[1]) / 2 - 14)}><M>L</M></div>
        <div className="vdemo-label point small" style={at(VB2, tipA[0] + 8, tipA[1] - 14)}><M>{t`\v v_A`}</M></div>
        <div className="vdemo-label point small" style={at(VB2, tipB[0] - 22, Math.max(14, tipB[1] + 6))}><M>{t`\v v_B`}</M></div>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider"><M>\alpha</M>
          <input type="range" min={10} max={80} step={0.5} value={al} onChange={(e) => { setPlay(false); setAl(Number(e.target.value)); }} aria-label="alpha" /><span className="val">{Math.round(al)}°</span></label>
        <div className="motion-row">
          <button type="button" className="motion-btn" disabled={reduced && !play} onClick={() => { if (al >= 79.5) setAl(20); setPlay((x) => !x); }}>
            {play ? tr('Anhalten', 'Stop') : tr('Leiter rutschen lassen', 'Let the ladder slide')}
          </button>
        </div>
        <div className="v-result pos"><M>{t`v_H = 1, \qquad v_V = v_H\cot\alpha = ${f(1 / Math.tan(a))}`}</M></div>
        <p className="vdemo-note">{tr(<>Türkis: die Projektionen von <M>{t`\v v_A`}</M> und <M>{t`\v v_B`}</M> auf die Leiter – immer gleich lang. Je flacher die Leiter (kleines <M p="),">\alpha</M> desto schneller muss <M>B</M> sich bewegen.</>, <>Teal: the projections of <M>{t`\v v_A`}</M> and <M>{t`\v v_B`}</M> onto the ladder – always equally long. The flatter the ladder (small <M p="),">\alpha</M> the faster <M>B</M> has to move.</>)}{vv > 150 ? tr(' (Pfeil gekürzt.)', ' (arrow shortened.)') : ''}</p>
      </figcaption>
    </figure>
  );
}
