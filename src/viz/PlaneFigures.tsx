import { useRef, useState } from 'react';
import { M } from '../components/Tex';
import { fmtNum, useLang, useTr } from '../i18n';
import { wheelPointVelocity, type P2 } from '../physics/plane';
import { CPLATE, CPRESETS, CPTS, KV, N_AB, U_AB, VBC, centreFrame, type CPreset } from './planeGeom';
import { at } from './figUtils';

const t = String.raw;
type V = readonly [number, number];
const pts = (ps: readonly V[]) => ps.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

function Arrow({ a, b, cls }: { a: V; b: V; cls: string }) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
  if (l < 1.5) return null;
  const ux = dx / l, uy = dy / l, s = Math.min(9, 0.6 * l);
  const head = `${b[0]},${b[1]} ${b[0] - s * ux + 0.45 * s * uy},${b[1] - s * uy - 0.45 * s * ux} ${b[0] - s * ux - 0.45 * s * uy},${b[1] - s * uy + 0.45 * s * ux}`;
  return <g className={cls}><line x1={a[0]} y1={a[1]} x2={b[0] - ux * 4} y2={b[1] - uy * 4} /><polygon points={head} /></g>;
}
/** Right-angle mark (9 px) at a between the directions toward q and toward b. */
function RightAngle({ a, q, b, cls = 'gm-ra' }: { a: V; q: V; b: V; cls?: string }) {
  const u = (p: V): V => { const dx = p[0] - a[0], dy = p[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
  const e = u(q), w = u(b), k = 9;
  return <polyline className={cls} points={pts([[a[0] + k * e[0], a[1] + k * e[1]], [a[0] + k * (e[0] + w[0]), a[1] + k * (e[1] + w[1])], [a[0] + k * w[0], a[1] + k * w[1]]])} />;
}
/** Client position → figure coordinates (viewBox units). */
function svgPoint(svg: SVGSVGElement, vb: readonly number[], e: React.PointerEvent): V {
  const r = svg.getBoundingClientRect();
  return [vb[0] + ((e.clientX - r.left) / r.width) * vb[2], vb[1] + ((e.clientY - r.top) / r.height) * vb[3]];
}

/* ------------------------------------------------------------------------------------------------ */
const toS = (p: P2): V => [100 * p[0], 300 - 100 * p[1]];
const toP = (q: V): P2 => [q[0] / 100, (300 - q[1]) / 100];

/**
 * Lecture p. 26, Satz vom Momentanzentrum: the construction of Z from two points. Drag the tip of v_A (free) and
 * the tip of v_B — that one can only slide on the dashed teal line: its part along AB is fixed by the SdpG.
 * The perpendiculars to v_A through A and to v_B through B meet in Z. From Z every velocity is perpendicular to its
 * ray and as long as ω times the ray (third point M). Degenerate cases: parallel perpendiculars (translation, Z at
 * infinity) and coinciding perpendiculars (both ⊥ AB: Z from the line through the tips).
 */
export function CentreDemo() {
  const tr = useTr(), lang = useLang();
  const [vA, setVA] = useState<P2>(CPRESETS.rot.vA);
  const [s, setS] = useState(CPRESETS.rot.s);
  const drag = useRef<'A' | 'B' | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const f = centreFrame(vA, s);
  const A = toS(CPTS.A), B = toS(CPTS.B), Mp = toS(CPTS.M);
  const k = KV / 100;
  const tip = (p: P2, v: P2): V => toS([p[0] + k * v[0], p[1] + k * v[1]]);
  const tA = tip(CPTS.A, f.vA), tB = tip(CPTS.B, f.vB), tM = f.vM ? tip(CPTS.M, f.vM) : null;
  const choose = (p: CPreset) => { setVA(CPRESETS[p].vA); setS(CPRESETS[p].s); };
  const pressed = (p: CPreset) => Math.hypot(vA[0] - CPRESETS[p].vA[0], vA[1] - CPRESETS[p].vA[1]) < 1e-9 && Math.abs(s - CPRESETS[p].s) < 1e-9;

  const onDown = (e: React.PointerEvent) => {
    if (!svg.current) return;
    const q = svgPoint(svg.current, VBC, e);
    const dA = Math.hypot(q[0] - tA[0], q[1] - tA[1]), dB = Math.hypot(q[0] - tB[0], q[1] - tB[1]);
    drag.current = dA < 30 && dA <= dB ? 'A' : dB < 30 ? 'B' : null;
    if (drag.current) (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current || !svg.current || e.buttons !== 1) return;
    const p = toP(svgPoint(svg.current, VBC, e));
    if (drag.current === 'A') {
      let v: P2 = [(p[0] - CPTS.A[0]) / k, (p[1] - CPTS.A[1]) / k];
      const n = Math.hypot(v[0], v[1]);
      if (n > 1.3) v = [(1.3 * v[0]) / n, (1.3 * v[1]) / n];
      if (n < 0.06) v = [0, 0];
      // snap: v_A perpendicular to AB (the «both perpendicular» case can be reached by dragging)
      const along = v[0] * U_AB[0] + v[1] * U_AB[1];
      if (Math.abs(along) < 0.04 && n > 0.06) { const a = v[0] * N_AB[0] + v[1] * N_AB[1]; v = [a * N_AB[0], a * N_AB[1]]; }
      setVA(v);
    } else {
      let ss = ((p[0] - CPTS.B[0]) * N_AB[0] + (p[1] - CPTS.B[1]) * N_AB[1]) / k;
      ss = Math.max(-1.2, Math.min(1.2, ss));
      const sA = vA[0] * N_AB[0] + vA[1] * N_AB[1];
      if (Math.abs(ss - sA) < 0.04) ss = sA; // snap: v_B = v_A (translation)
      setS(ss);
    }
  };
  const onUp = () => { drag.current = null; };

  const Z = f.Z ? toS(f.Z) : null;
  const zShown = !!Z && f.zInside;
  const line = (seg: [P2, P2] | null, cls: string) => seg && <line x1={toS(seg[0])[0]} y1={toS(seg[0])[1]} x2={toS(seg[1])[0]} y2={toS(seg[1])[1]} className={cls} />;
  // marker at the border when Z lies outside the drawing
  const edge = (() => {
    if (!Z || zShown) return null;
    const c: V = [200, 150], dx = Z[0] - c[0], dy = Z[1] - c[1];
    const kk = Math.min(Math.abs((dx > 0 ? 386 : 14) - c[0]) / Math.abs(dx || 1e-9), Math.abs((dy > 0 ? 286 : 14) - c[1]) / Math.abs(dy || 1e-9));
    return { p: [c[0] + kk * dx, c[1] + kk * dy] as V, q: [c[0] + (kk - 26 / Math.hypot(dx, dy)) * dx, c[1] + (kk - 26 / Math.hypot(dx, dy)) * dy] as V };
  })();
  const kind = f.centre.kind === 'translation' ? 'trans' : f.centre.kind === 'point' ? f.centre.via : 'none';
  const dist = (p: V) => (Z ? Math.hypot(p[0] - Z[0], p[1] - Z[1]) / 100 : 0);
  const fx = (x: number) => fmtNum(x, 2, lang, true);
  const sp = (v: P2) => Math.hypot(v[0], v[1]);
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {(Object.keys(CPRESETS) as CPreset[]).map((p) => <button key={p} type="button" aria-pressed={pressed(p)} onClick={() => choose(p)}>{p === 'tips' ? <>{tr('beide', 'both')} <M p="">{t`\perp AB`}</M></> : p === 'rest' ? <><M>A</M> {tr('ruht', 'at rest')}</> : tr(CPRESETS[p].de, CPRESETS[p].en)}</button>)}
      </div>
      <div className="vdemo-fig wide">
        <svg ref={svg} viewBox={VBC.join(' ')} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
          aria-label={tr('Konstruktion des Momentanzentrums: Spitzen von v_A und v_B ziehbar', 'Construction of the instantaneous centre: tips of v_A and v_B draggable')}>
          <polygon points={pts(CPLATE.map(toS))} className="an-body" />
          {line(f.lineAB, 'v-line')}
          {/* SdpG: the tip of v_B can only move on this line */}
          {line(f.guideB, 'pl-guide')}
          {/* the perpendiculars */}
          {kind !== 'tips' && line(f.perpA, 'pl-perp')}
          {kind !== 'tips' && line(f.perpB, 'pl-perp')}
          {kind === 'tips' && line(f.tipsLine, 'pl-tips')}
          {/* rays from Z and right angles */}
          {zShown && Z && ([[A, tA], [B, tB], [Mp, tM]] as const).map(([p, q], i) => q && Math.hypot(p[0] - Z[0], p[1] - Z[1]) > 12 && (
            <g key={i}>
              {(i === 2 || kind === 'tips') && <line x1={Z[0]} y1={Z[1]} x2={p[0]} y2={p[1]} className="gm-pole-ray" />}
              {Math.hypot(q[0] - p[0], q[1] - p[1]) > 12 && kind !== 'tips' && <RightAngle a={p} q={Z} b={q} />}
            </g>
          ))}
          {tM && <Arrow a={Mp} b={tM} cls="rb-v pl-vm" />}
          <Arrow a={A} b={tA} cls="rb-v" />
          <Arrow a={B} b={tB} cls="rb-v" />
          <circle cx={tA[0]} cy={tA[1]} r={14} className="pl-handle" />
          <circle cx={tB[0]} cy={tB[1]} r={14} className="pl-handle" />
          {[A, B].map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={4.5} className="v-m" />)}
          <circle cx={Mp[0]} cy={Mp[1]} r={4} className="v-m" />
          {zShown && Z && <circle cx={Z[0]} cy={Z[1]} r={6} className="rl-mc" />}
          {edge && <Arrow a={edge.q} b={edge.p} cls="pl-edge" />}
        </svg>
        <div className="vdemo-label point small halo" style={at(VBC, A[0] - 14, A[1] + 12)}><M>A</M></div>
        <div className="vdemo-label point small halo" style={at(VBC, B[0] + 12, B[1] + 14)}><M>B</M></div>
        <div className="vdemo-label point small halo" style={at(VBC, Mp[0] - 14, Mp[1] + 10)}><M>M</M></div>
        <div className="vdemo-label muted small" style={at(VBC, 92, 210)}><M>{t`K_E`}</M></div>
        {sp(f.vA) > 0.15 && <div className="vdemo-label point small halo" style={at(VBC, tA[0] + (tA[0] > A[0] ? 16 : -16), tA[1] - 10)}><M>{t`\v v_A`}</M></div>}
        {sp(f.vB) > 0.15 && <div className="vdemo-label point small halo" style={at(VBC, tB[0] + (tB[0] > B[0] ? 16 : -16), tB[1] - 10)}><M>{t`\v v_B`}</M></div>}
        {tM && f.vM && sp(f.vM) > 0.15 && <div className="vdemo-label point small halo" style={at(VBC, tM[0] + (tM[0] > Mp[0] ? 16 : -16), tM[1] + 10)}><M>{t`\v v_M`}</M></div>}
        {zShown && Z && <div className="vdemo-label angle small halo" style={at(VBC, Z[0] + 13, Z[1] - 12)}><M>Z</M></div>}
        {edge && <div className="vdemo-label angle small halo" style={at(VBC, edge.q[0] - Math.sign(edge.p[0] - 200) * 14, edge.q[1] - Math.sign(edge.p[1] - 150) * 14)}><M>Z</M></div>}
      </div>
      <figcaption className="vdemo-readout">
        <div className={`v-result rt-readout ${kind === 'trans' ? '' : 'pos'}`}>
          {kind === 'trans'
            ? <span>{tr(<>Lote parallel: <M p=",">{t`\v v_A = \v v_B`}</M> Translation, <M>{t`\omega = 0`}</M> – <M>Z</M> «im Unendlichen».</>, <>Perpendiculars parallel: <M p=",">{t`\v v_A = \v v_B`}</M> translation, <M>{t`\omega = 0`}</M> – <M>Z</M> “at infinity”.</>)}</span>
            : <>
              <M>{t`\omega = ${fx(f.w)}`}</M>
              {kind === 'restingPoint'
                ? <span>{tr(<><M>A</M> ruht: <M p=".">{t`Z = A`}</M></>, <><M>A</M> is at rest: <M p=".">{t`Z = A`}</M></>)}</span>
                : <M>{t`\frac{v_A}{|\v{ZA}|} = \frac{v_B}{|\v{ZB}|} = \frac{v_M}{|\v{ZM}|} = ${fx(Math.abs(f.w))}`}</M>}
            </>}
        </div>
        {kind !== 'trans' && kind !== 'restingPoint' && Z && (
          <div className="rt-readout pl-small">
            <M>{t`|\v{ZA}| = ${fx(dist(A))}`}</M> <M>{t`v_A = ${fx(sp(f.vA))}`}</M> <M>{t`|\v{ZB}| = ${fx(dist(B))}`}</M> <M>{t`v_B = ${fx(sp(f.vB))}`}</M>
          </div>
        )}
        <p className="vdemo-note">{kind === 'tips'
          ? tr(<>Beide Geschwindigkeiten stehen senkrecht auf <M p=":">{t`AB`}</M> Die beiden Lote sind dieselbe Gerade <M p=",">{t`AB`}</M> die Richtungen allein bestimmen <M>Z</M> nicht. Die Grössen schon: Die Gerade durch die Pfeilspitzen (rot gestrichelt) trifft <M>{t`AB`}</M> in <M p=".">Z</M></>,
            <>Both velocities are perpendicular to <M p=".">{t`AB`}</M> The two perpendiculars are the same line <M p=",">{t`AB`}</M> so the directions alone do not fix <M p=".">Z</M> The sizes do: the line through the arrow tips (red, dashed) meets <M>{t`AB`}</M> in <M p=".">Z</M></>)
          : tr(<>Ziehe die Spitzen von <M>{t`\v v_A`}</M> und <M p=".">{t`\v v_B`}</M> Die Spitze von <M>{t`\v v_B`}</M> gleitet nur auf der türkisen Linie: Ihr Anteil längs <M>{t`AB`}</M> ist durch die SdpG festgelegt. Violett gestrichelt die Lote; sie schneiden sich in <M p=".">Z</M> Von <M>Z</M> aus steht jede Geschwindigkeit senkrecht auf ihrem Strahl (Winkelzeichen), auch bei <M p=".">M</M></>,
            <>Drag the tips of <M>{t`\v v_A`}</M> and <M p=".">{t`\v v_B`}</M> The tip of <M>{t`\v v_B`}</M> only slides on the teal line: its part along <M>{t`AB`}</M> is fixed by the SdpG. Purple dashed: the perpendiculars; they meet in <M p=".">Z</M> Seen from <M p=",">Z</M> every velocity is perpendicular to its ray (right-angle marks), also at <M p=".">M</M></>)}</p>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------------------------------------ */
const VBW: [number, number, number, number] = [0, 0, 400, 260];
const WR = 1, PXW = 88, WO: V = [200, 226 - PXW], GROUND = 226, KW = 34, OMEGA = 1;
const wS = (p: P2): V => [WO[0] + PXW * p[0], GROUND - PXW * p[1]];
const wP = (q: V): P2 => [(q[0] - WO[0]) / PXW, (GROUND - q[1]) / PXW];
const RIMS = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);

/**
 * Lecture p. 27, Fig. 3.20 (rollendes Rad): Z is the contact point. Drag the point P anywhere on the wheel: v_P is
 * perpendicular to ZP and v_P = ω·|ZP|. The rim arrows (thin) show the same rule everywhere; v_O = ωR.
 */
export function WheelRays() {
  const tr = useTr(), lang = useLang();
  const [P, setP] = useState<P2>([-0.62, 1.55]);
  const svg = useRef<SVGSVGElement>(null);
  const Z: V = wS([0, 0]), O = wS([0, WR]);
  const move = (e: React.PointerEvent) => {
    if (!svg.current || (e.type === 'pointermove' && e.buttons !== 1)) return;
    let p = wP(svgPoint(svg.current, VBW, e));
    const d = Math.hypot(p[0], p[1] - WR);
    if (d > WR) p = [(p[0] * WR) / d, WR + ((p[1] - WR) * WR) / d];
    setP(p);
  };
  const vel = (p: P2): V => { const v = wheelPointVelocity(0, OMEGA, p); return [KW * v[0], -KW * v[1]]; };
  const Ps = wS(P), vP = vel(P), tP: V = [Ps[0] + vP[0], Ps[1] + vP[1]];
  const vO = vel([0, WR]), tO: V = [O[0] + vO[0], O[1] + vO[1]];
  const ZP = Math.hypot(P[0], P[1]);
  const f = (x: number) => fmtNum(x, 2, lang, true);
  return (
    <figure className="vdemo">
      <div className="vdemo-fig wide">
        <svg ref={svg} viewBox={VBW.join(' ')} onPointerDown={move} onPointerMove={move} aria-label={tr('Rollendes Rad: Punkt P ziehbar', 'Rolling wheel: point P draggable')}>
          <line x1={20} y1={GROUND} x2={380} y2={GROUND} className="ld-ground" />
          {Array.from({ length: 17 }, (_, i) => <line key={i} x1={30 + i * 21} y1={GROUND} x2={22 + i * 21} y2={GROUND + 8} className="ld-hatch" />)}
          <circle cx={O[0]} cy={O[1]} r={PXW * WR} className="rl-wheel" />
          {/* the circle about Z through P: every wheel point on it is as fast as P */}
          <circle cx={Z[0]} cy={Z[1]} r={PXW * ZP} className="pl-same" />
          {RIMS.map((a, i) => {
            const p: P2 = [WR * Math.sin(a), WR + WR * Math.cos(a)], s = wS(p), v = vel(p);
            if (Math.hypot(v[0], v[1]) < 6) return null;
            return <g key={i}><line x1={Z[0]} y1={Z[1]} x2={s[0]} y2={s[1]} className="pl-ray-faint" /><Arrow a={s} b={[s[0] + v[0], s[1] + v[1]]} cls="rb-v thin pl-faint" /></g>;
          })}
          <line x1={Z[0]} y1={Z[1]} x2={Ps[0]} y2={Ps[1]} className="pl-ray" />
          <line x1={Z[0]} y1={Z[1]} x2={O[0]} y2={O[1]} className="pl-ray" />
          {ZP > 0.12 && <RightAngle a={Ps} q={Z} b={tP} />}
          <RightAngle a={O} q={Z} b={tO} />
          <Arrow a={O} b={tO} cls="rb-v" />
          {ZP > 0.04 && <Arrow a={Ps} b={tP} cls="rb-v" />}
          <circle cx={Ps[0]} cy={Ps[1]} r={14} className="pl-handle" />
          <circle cx={Ps[0]} cy={Ps[1]} r={4.5} className="v-m" />
          <circle cx={O[0]} cy={O[1]} r={3.5} className="v-o" />
          <circle cx={Z[0]} cy={Z[1]} r={6} className="rl-mc" />
          {/* ω: clockwise turning arrow */}
          <path d={`M ${O[0] - 21} ${O[1] - 18} A 28 28 0 0 1 ${O[0] + 21} ${O[1] - 18}`} className="pl-w-arc" />
          <polygon points={pts(headAt([O[0] + 21, O[1] - 18], [0.66, 0.75]))} className="pl-w-head" />
        </svg>
        <div className="vdemo-label point small halo" style={at(VBW, Ps[0] + (P[0] < 0 ? -20 : 20), Ps[1] + 14)}><M>P</M></div>
        <div className="vdemo-label small halo" style={at(VBW, O[0] - 12, O[1] + 14)}><M>O</M></div>
        <div className="vdemo-label angle small halo" style={at(VBW, Z[0] + 14, Z[1] + 14)}><M>Z</M></div>
        <div className="vdemo-label angle small halo" style={at(VBW, O[0] + 30, O[1] - 30)}><M>\omega</M></div>
        <div className="vdemo-label muted small halo" style={at(VBW, O[0] + 0.5 * PXW, O[1] + 0.52 * PXW)}><M>R</M></div>
        {ZP > 0.2 && (() => { const l = Math.hypot(vP[0], vP[1]), n: V = vP[0] / l > 0 ? [vP[1] / l, -vP[0] / l] : [-vP[1] / l, vP[0] / l]; return <div className="vdemo-label point small halo" style={at(VBW, (Ps[0] + tP[0]) / 2 + 15 * n[0], (Ps[1] + tP[1]) / 2 + 15 * n[1])}><M>{t`\v v_P`}</M></div>; })()}
        <div className="vdemo-label point small halo" style={at(VBW, tO[0] + 18, tO[1] + 2)}><M>{t`\v v_O`}</M></div>
      </div>
      <figcaption className="vdemo-readout">
        <div className="v-result pos rt-readout">
          <M p=",">{t`|\v{ZP}| = ${f(ZP)}\,R`}</M> <M>{t`v_P = \omega\,|\v{ZP}| = ${f(OMEGA * ZP)}\,\omega R`}</M>
        </div>
        <div className="v-result rt-readout"><M>{t`v_O = \omega R`}</M></div>
        <p className="vdemo-note">{tr(
          <>Ziehe <M>P</M> über das Rad. Der Strahl von <M>Z</M> nach <M>P</M> und <M>{t`\v v_P`}</M> bilden immer einen rechten Winkel, und <M>{t`v_P`}</M> wächst mit der Länge des Strahls. Gestrichelter Kreis um <M p=":">Z</M> alle Punkte darauf sind gleich schnell wie <M p=".">P</M></>,
          <>Drag <M>P</M> over the wheel. The ray from <M>Z</M> to <M>P</M> and <M>{t`\v v_P`}</M> always form a right angle, and <M>{t`v_P`}</M> grows with the length of the ray. Dashed circle about <M p=":">Z</M> all points on it are as fast as <M p=".">P</M></>)}</p>
      </figcaption>
    </figure>
  );
}

function headAt(p: V, d: V): V[] {
  const s = 9;
  return [p, [p[0] - s * d[0] + 0.45 * s * d[1], p[1] - s * d[1] - 0.45 * s * d[0]], [p[0] - s * d[0] - 0.45 * s * d[1], p[1] - s * d[1] + 0.45 * s * d[0]]];
}
