import { useEffect, useRef, useState } from 'react';
import { M } from '../components/Tex';
import { fmtNum, useLang, useTr } from '../i18n';
import { GEAR, R3, TEETH, omega3, omegaArm, ratioRingFixed, startAngles, type P2 } from '../physics/planetary';
import { RING_OUT, circlePts, clipToDisc, gearOutline, marks, stateFromAngles, velocityPicture, withArm } from './planetGeom';
import { at, useReducedMotion, useInView } from './figUtils';

const t = String.raw;
type V = readonly [number, number];
const VB: [number, number, number, number] = [0, 0, 400, 400];
const S = 47, KV = 34 / S; // px per unit length; drawn velocity per unit (in length units)
const sv = (p: P2): V => [200 + S * p[0], 200 - S * p[1]];
const pts = (ps: readonly P2[]) => ps.map((p) => { const q = sv(p); return `${q[0].toFixed(1)},${q[1].toFixed(1)}`; }).join(' ');

function Arrow({ a, b, cls }: { a: V; b: V; cls: string }) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
  if (l < 1.5) return null;
  const ux = dx / l, uy = dy / l, s = Math.min(9, 0.6 * l);
  const head = `${b[0]},${b[1]} ${b[0] - s * ux + 0.45 * s * uy},${b[1] - s * uy - 0.45 * s * ux} ${b[0] - s * ux - 0.45 * s * uy},${b[1] - s * uy + 0.45 * s * ux}`;
  return <g className={cls}><line x1={a[0]} y1={a[1]} x2={b[0] - ux * 4} y2={b[1] - uy * 4} /><polygon points={head} /></g>;
}

type Preset = 'fig' | 'ring' | 'sun' | 'shift' | 'neg';
const R1R2 = GEAR.R1 / GEAR.R2;
const PRESETS: Record<Preset, { w1: number; w2: number }> = {
  fig: { w1: 1, w2: 0.5 },
  ring: { w1: 1, w2: 0 },
  sun: { w1: 0, w2: 1 },
  shift: { w1: 1, w2: R1R2 },
  neg: { w1: 1, w2: -0.2 },
};
const PRESET_LABEL: Record<Preset, [React.ReactNode, React.ReactNode]> = {
  fig: [<>wie Fig. 3.21</>, <>as in Fig. 3.21</>],
  ring: [<>Hohlrad fest (<M p=")">{t`\omega_2 = 0`}</M></>, <>ring fixed (<M p=")">{t`\omega_2 = 0`}</M></>],
  sun: [<>Sonne fest (<M p=")">{t`\omega_1 = 0`}</M></>, <>sun fixed (<M p=")">{t`\omega_1 = 0`}</M></>],
  shift: [<M>{t`\omega_2R_2 = \omega_1R_1`}</M>, <M>{t`\omega_2R_2 = \omega_1R_1`}</M>],
  neg: [<M>{t`\omega_2 < 0`}</M>, <M>{t`\omega_2 < 0`}</M>],
};

/**
 * Lecture p. 28, Fig. 3.21: the planetary gear, turning. Set ω₁ (sun) and ω₂ (ring); ω₃ and ω_Arm follow from the
 * lecture's formulas and all four parts turn consistently — the teeth stay in mesh (rolling without slipping at P and Q,
 * tested in planetary.test.ts). On the arm line: v_P, v_Q, v_A, the planet's velocity triangle and Z₃.
 * Positive ω = counter-clockwise (as the arrows in Fig. 3.21).
 */
export function PlanetaryGear() {
  const host = useRef<HTMLElement>(null);
  const seen = useInView(host);
  const tr = useTr(), lang = useLang();
  const reduced = useReducedMotion();
  const [w1, setW1] = useState(PRESETS.fig.w1);
  const [w2, setW2] = useState(PRESETS.fig.w2);
  const [ang, setAng] = useState(() => startAngles(TEETH));
  const [play, setPlay] = useState(false);
  const [vel, setVel] = useState(true);
  const [rays, setRays] = useState(false);
  const rates = useRef({ w1, w2 });
  rates.current = { w1, w2 };
  useEffect(() => { if (reduced) setPlay(false); }, [reduced]);
  useEffect(() => {
    if (!play || !seen) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000; last = now;
      const { w1: a, w2: b } = rates.current, w3 = omega3(GEAR, a, b), wA = omegaArm(GEAR, a, b);
      setAng((s) => ({ th1: s.th1 + a * dt, th2: s.th2 + b * dt, th3: s.th3 + w3 * dt, thArm: s.thArm + wA * dt }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, seen]);

  const g = GEAR, st = stateFromAngles(g, ang), mk = marks(st, g);
  const vp = velocityPicture(g, w1, w2, st, KV);
  const choose = (p: Preset) => { setW1(PRESETS[p].w1); setW2(PRESETS[p].w2); };
  const isP = (p: Preset) => Math.abs(w1 - PRESETS[p].w1) < 1e-9 && Math.abs(w2 - PRESETS[p].w2) < 1e-9;
  const f = (x: number) => fmtNum(x, 2, lang, true);
  const shift = Math.abs(vp.w3) < 1e-9;
  const zIn = vp.z3 !== null && Math.abs(vp.z3) < 3.55;
  const big = (v: number) => Math.abs(v) * KV * S > 6;
  // the line through the arrow tips (through Z₃), clipped to the figure
  const tipsLine = (() => {
    const d: P2 = [vp.tipP[0] - vp.tipQ[0], vp.tipP[1] - vp.tipQ[1]];
    if (Math.hypot(d[0], d[1]) < 1e-9) return null;
    return clipToDisc(vp.tipQ, d, 3.3);
  })();
  const sideOf = (v: number): P2 => (v >= 0 ? [-vp.n[0], -vp.n[1]] : vp.n); // label opposite to the arrow
  const lab = (p: P2, v: number, k = 13): V => { const s = sideOf(v), q = sv(p); return [q[0] + k * s[0], q[1] - k * s[1]]; };
  const zAt = vp.z3 === null ? null : Math.abs(vp.z3 - g.R1) < 1e-9 ? 'P' : Math.abs(vp.z3 - g.R2) < 1e-9 ? 'Q' : null;
  const zEdge = !zIn && vp.z3 !== null ? (Math.sign(vp.z3) as 1 | -1) : null;
  const ray = (tip: P2) => { const k = 1.18; return [sv([0, 0]), sv([k * tip[0], k * tip[1]])] as const; };
  const three: P2 = [st.A[0] - (R3(g) + 0.42) * vp.n[0], st.A[1] - (R3(g) + 0.42) * vp.n[1]];
  return (
    <figure className="vdemo" ref={host}>
      <div className="v-presets">
        {(Object.keys(PRESETS) as Preset[]).map((p) => <button key={p} type="button" aria-pressed={isP(p)} onClick={() => choose(p)}>{tr(...PRESET_LABEL[p])}</button>)}
      </div>
      <div className="vdemo-fig wide pg-fig">
        <svg viewBox={VB.join(' ')} aria-label={tr('Planetengetriebe: Sonne, Hohlrad, Planet und Arm drehen sich', 'Planetary gear: sun, ring, planet and arm turning')}>
          <polygon points={pts(circlePts([0, 0], g.R2 + RING_OUT))} className="pg-ring" />
          <polygon points={pts(gearOutline([0, 0], g.R2, TEETH.N2, st.th2))} className="pg-ring-hole" />
          {mk.ringMarks.map((p, i) => <circle key={i} cx={sv(p)[0]} cy={sv(p)[1]} r={2.4} className="pg-mark" />)}
          <polygon points={pts(gearOutline([0, 0], g.R1, TEETH.N1, st.th1))} className="pg-sun" />
          {mk.sunHoles.map((p, i) => <circle key={i} cx={sv(p)[0]} cy={sv(p)[1]} r={3} className="pg-hole" />)}
          <polygon points={pts(gearOutline(st.A, R3(g), TEETH.N3, st.th3))} className="pg-planet" />
          {mk.planetHoles.map((p, i) => <circle key={i} cx={sv(p)[0]} cy={sv(p)[1]} r={3} className="pg-hole" />)}
          <line x1={sv(mk.planetMark[0])[0]} y1={sv(mk.planetMark[0])[1]} x2={sv(mk.planetMark[1])[0]} y2={sv(mk.planetMark[1])[1]} className="pg-pmark" />
          <line x1={sv([0, 0])[0]} y1={sv([0, 0])[1]} x2={sv(st.A)[0]} y2={sv(st.A)[1]} className="pg-arm" />
          {vel && (<>
            <line x1={sv([-0.3 * vp.u[0], -0.3 * vp.u[1]])[0]} y1={sv([-0.3 * vp.u[0], -0.3 * vp.u[1]])[1]} x2={sv([3.5 * vp.u[0], 3.5 * vp.u[1]])[0]} y2={sv([3.5 * vp.u[0], 3.5 * vp.u[1]])[1]} className="an-guide" />
            <polygon points={pts(vp.tri)} className="pg-tri" />
            {tipsLine && <line x1={sv(tipsLine[0])[0]} y1={sv(tipsLine[0])[1]} x2={sv(tipsLine[1])[0]} y2={sv(tipsLine[1])[1]} className="pl-tips" />}
            {rays && ([[vp.tipP, 'pg-ray-sun'], [vp.tipA, 'pg-armline'], [vp.tipQ, 'pg-ray-ring']] as const).map(([tip, cls], i) => {
              const [a, b] = ray(tip); return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className={cls} />;
            })}
            {big(vp.vP) && <Arrow a={sv(vp.P)} b={sv(vp.tipP)} cls="rb-v" />}
            {big(vp.vQ) && <Arrow a={sv(vp.Q)} b={sv(vp.tipQ)} cls="rb-v" />}
            {big(vp.vA) && <Arrow a={sv(vp.A)} b={sv(vp.tipA)} cls="rb-v" />}
            {zIn && vp.Z3 && <circle cx={sv(vp.Z3)[0]} cy={sv(vp.Z3)[1]} r={6} className="rl-mc" />}
            {zEdge && <Arrow a={sv([3.45 * zEdge * vp.u[0], 3.45 * zEdge * vp.u[1]])} b={sv([3.95 * zEdge * vp.u[0], 3.95 * zEdge * vp.u[1]])} cls="pl-edge" />}
          </>)}
          <circle cx={sv([0, 0])[0]} cy={sv([0, 0])[1]} r={3.5} className="an-o" />
          <circle cx={sv(st.A)[0]} cy={sv(st.A)[1]} r={3.5} className="pg-pin" />
          {vel && <><circle cx={sv(vp.P)[0]} cy={sv(vp.P)[1]} r={4} className="v-m" /><circle cx={sv(vp.Q)[0]} cy={sv(vp.Q)[1]} r={4} className="v-m" /></>}
        </svg>
        <div className="vdemo-label small muted halo" style={at(VB, ...sv(withArm(st, [-0.74, -0.74])))}><M>{t`\boxed{1}`}</M></div>
        <div className="vdemo-label small muted halo" style={at(VB, ...sv(withArm(st, [1.75, -2.15])))}><M>{t`\boxed{2}`}</M></div>
        <div className="vdemo-label small muted halo" style={at(VB, sv(three)[0], sv(three)[1])}><M>{t`\boxed{3}`}</M></div>
        <div className="vdemo-label small halo" style={at(VB, lab([0, 0], -1, 12)[0], lab([0, 0], -1, 12)[1] + 8)}><M>O</M></div>
        {vel && <>
          <div className="vdemo-label small point halo" style={at(VB, ...lab(vp.P, vp.vP))}><M>{zAt === 'P' ? t`P = Z_3` : 'P'}</M></div>
          <div className="vdemo-label small point halo" style={at(VB, ...lab(vp.Q, vp.vQ))}><M>{zAt === 'Q' ? t`Q = Z_3` : 'Q'}</M></div>
          <div className="vdemo-label small halo" style={at(VB, ...lab(st.A, vp.vA))}><M>A</M></div>
          {zIn && vp.Z3 && !zAt && <div className="vdemo-label small angle halo" style={at(VB, ...lab(vp.Z3, 1, 16))}><M>{t`Z_3`}</M></div>}
          {zEdge && <div className="vdemo-label small angle halo" style={at(VB, ...lab([3.6 * zEdge * vp.u[0], 3.6 * zEdge * vp.u[1]], 1, 16))}><M>{t`Z_3`}</M></div>}
        </>}
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider"><span>{tr('Sonne', 'sun')} <M>{t`\omega_1`}</M></span>
          <input type="range" min={-1} max={1} step={0.05} value={w1} onChange={(e) => setW1(Number(e.target.value))} aria-label="omega1" /><span className="val">{fmtNum(w1, 2, lang)}</span></label>
        <label className="slider wide-slider"><span>{tr('Hohlrad', 'ring')} <M>{t`\omega_2`}</M></span>
          <input type="range" min={-1} max={1} step={0.05} value={w2} onChange={(e) => setW2(Number(e.target.value))} aria-label="omega2" /><span className="val">{fmtNum(w2, 2, lang)}</span></label>
        <div className="motion-row">
          <button type="button" className="motion-btn" onClick={() => setPlay((x) => !x)}>{play ? tr('Anhalten', 'Stop') : tr('Getriebe drehen', 'Turn the gear')}</button>
          <button type="button" className="motion-btn" onClick={() => { setPlay(false); setAng(startAngles(TEETH)); }}>{tr('Lage wie im Skript', 'Position as in the notes')}</button>
        </div>
        <label className="toggle"><input type="checkbox" checked={vel} onChange={(e) => setVel(e.target.checked)} />{' '}{tr('Geschwindigkeiten auf dem Arm', 'velocities on the arm')}</label>
        <label className="toggle"><input type="checkbox" checked={rays} onChange={(e) => setRays(e.target.checked)} disabled={!vel} />{' '}{tr(<>Strahlen von <M>O</M> (Ergänzung)</>, <>rays from <M>O</M> (supplement)</>)}</label>
        <div className="v-result pos rt-readout">
          <M p=",">{t`\omega_3 = ${f(vp.w3)}`}</M> <M>{t`\omega_{\text{Arm}} = ${f(vp.wArm)}`}</M>
        </div>
        <div className="rt-readout pl-small">
          <M p=",">{t`v_P = ${f(vp.vP)}`}</M> <M p=",">{t`v_Q = ${f(vp.vQ)}`}</M> <M>{t`v_A = ${f(vp.vA)}`}</M>
        </div>
        <p className="vdemo-note">{note(w1, w2, shift, vp.z3, tr, f)}</p>
        {rays && vel && <p className="vdemo-note">{tr(
          <>Strahlen von <M p=":">O</M> rosa durch die Spitze von <M p=",">{t`v_P`}</M> grau durch die von <M p=",">{t`v_Q`}</M> sandfarben durch die von <M p=".">{t`v_A`}</M> Ihre Steigung ist die Winkelgeschwindigkeit von Sonne, Hohlrad und Arm. Der Strahl des Arms liegt immer zwischen den beiden anderen.</>,
          <>Rays from <M p=":">O</M> pink through the tip of <M p=",">{t`v_P`}</M> grey through that of <M p=",">{t`v_Q`}</M> sand through that of <M p=".">{t`v_A`}</M> Their slope is the angular velocity of sun, ring and arm. The arm’s ray always lies between the other two.</>)}</p>}
      </figcaption>
    </figure>
  );
}

function note(w1: number, w2: number, shift: boolean, z3: number | null, tr: ReturnType<typeof useTr>, f: (x: number) => string) {
  const g = GEAR;
  if (Math.abs(w1) < 1e-9 && Math.abs(w2) < 1e-9) return tr(<>Alles steht still.</>, <>Everything is at rest.</>);
  if (Math.abs(w2) < 1e-9) return tr(
    <>Das Hohlrad steht: <M>Q</M> ruht, also ist <M>Q</M> das Momentanzentrum <M>{t`Z_3`}</M> des Planeten. Der Arm dreht langsamer als die Sonne: <M p=".">{t`\omega_1/\omega_{\text{Arm}} = 1 + R_2/R_1 = ${f(ratioRingFixed(g))}`}</M></>,
    <>The ring stands still: <M>Q</M> is at rest, so <M>Q</M> is the planet’s instantaneous centre <M p=".">{t`Z_3`}</M> The arm turns more slowly than the sun: <M p=".">{t`\omega_1/\omega_{\text{Arm}} = 1 + R_2/R_1 = ${f(ratioRingFixed(g))}`}</M></>);
  if (Math.abs(w1) < 1e-9) return tr(
    <>Die Sonne steht: <M>P</M> ruht, also ist <M>{t`Z_3 = P`}</M> – der Planet rollt auf der Sonne ab.</>,
    <>The sun stands still: <M>P</M> is at rest, so <M>{t`Z_3 = P`}</M> – the planet rolls on the sun.</>);
  if (shift) return tr(
    <><M p=":">{t`\omega_2R_2 = \omega_1R_1`}</M> <M>P</M> und <M>Q</M> sind gleich schnell, also <M p=".">{t`\omega_3 = 0`}</M> Der Planet dreht sich nicht, er verschiebt sich nur (eine Translation auf einer Kreisbahn, wie eine Gondel im Riesenrad). Die Pfeilspitzen liegen auf einer Parallelen zum Arm: <M>{t`Z_3`}</M> liegt «im Unendlichen».</>,
    <><M p=":">{t`\omega_2R_2 = \omega_1R_1`}</M> <M>P</M> and <M>Q</M> are equally fast, so <M p=".">{t`\omega_3 = 0`}</M> The planet does not turn, it only shifts (a translation along a circle, like a Ferris-wheel gondola). The arrow tips lie on a parallel to the arm: <M>{t`Z_3`}</M> is “at infinity”.</>);
  if (z3 !== null && z3 > g.R1 && z3 < g.R2 && !(w2 < 0 && w1 > 0)) return tr(
    <><M>{t`v_P`}</M> und <M>{t`v_Q`}</M> zeigen in verschiedene Richtungen: <M>{t`Z_3`}</M> liegt zwischen <M>P</M> und <M p=".">Q</M></>,
    <><M>{t`v_P`}</M> and <M>{t`v_Q`}</M> point in different directions: <M>{t`Z_3`}</M> lies between <M>P</M> and <M p=".">Q</M></>);
  if (z3 !== null && z3 > g.R1 && z3 < g.R2) return tr(
    <><M>{t`v_P`}</M> und <M>{t`v_Q`}</M> zeigen in verschiedene Richtungen: <M>{t`Z_3`}</M> liegt zwischen <M>P</M> und <M p=".">Q</M> Mit <M>{t`\omega_2 < 0`}</M> dreht der Arm langsamer als bei festem Hohlrad (oder rückwärts); bei <M>{t`\omega_2 = -\omega_1R_1/R_2`}</M> steht er still.</>,
    <><M>{t`v_P`}</M> and <M>{t`v_Q`}</M> point in different directions: <M>{t`Z_3`}</M> lies between <M>P</M> and <M p=".">Q</M> With <M>{t`\omega_2 < 0`}</M> the arm turns more slowly than with the ring fixed (or backwards); at <M>{t`\omega_2 = -\omega_1R_1/R_2`}</M> it stands still.</>);
  return tr(
    <>Die Gerade durch die Pfeilspitzen (rot gestrichelt) trifft die Gerade <M>{t`QPO`}</M> (die Verlängerung des Arms) in <M p=",">{t`Z_3`}</M> dem Punkt des Planeten, der gerade ruht. Rot gefüllt: die Geschwindigkeiten auf dem Durchmesser <M>{t`PQ`}</M> des Planeten – sie wachsen linear mit dem Abstand von <M p=".">{t`Z_3`}</M></>,
    <>The line through the arrow tips (red, dashed) meets the line <M>{t`QPO`}</M> (the arm, extended) in <M p=",">{t`Z_3`}</M> the planet’s point that is at rest right now. Filled red: the velocities on the planet’s diameter <M p=":">{t`PQ`}</M> they grow linearly with the distance from <M p=".">{t`Z_3`}</M></>);
}
