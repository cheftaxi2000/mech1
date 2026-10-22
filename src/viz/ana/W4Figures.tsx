import { useState, type ReactNode } from 'react';
import { M } from '../../components/Tex';
import { T, useLang, useTr, type Lang } from '../../i18n';
import { Curve, Line, PArrow, PLabel, Path, Plot, Pt, Seg, usePlot } from '../plot/Plot';
import { clipLine, type P2 } from '../plot/plotMath';
import { INV, PROD, SQ_H, TAN_EXAMPLES, productAreas, sq } from '../../analysis/deriv';
import {
  CHAIN_LEVELS, CHAIN_WIN, INV_WIN, NORM_WIN, PROD_WIN, SEC_WIN, SIDE_CASES, chainBars, invTriangle, niceStep, normalTriangles,
  prodRects, secantFrame, secantPts, sides, zoomBend, zoomWindow, type SideCase,
} from './w4';

const t = String.raw;

/** Number with at most `d` decimals, trailing zeros dropped; German comma; `tex` protects the comma in KaTeX. */
export function num(x: number, d: number, lang: Lang, tex = true): string {
  let s = (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d);
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
  if (lang === 'de') s = s.replace('.', tex ? '{,}' : ',');
  return s;
}

/** A straight line with a custom class (the shared <Line> only knows the shared roles). */
function CLine({ p, m, cls }: { p: P2; m: number; cls: string }) {
  const fr = usePlot();
  if (!Number.isFinite(m)) return <line className={`pl-line ${cls}`} x1={fr.sx(p[0])} x2={fr.sx(p[0])} y1={fr.sy(fr.y[0])} y2={fr.sy(fr.y[1])} />;
  const s = clipLine(fr, p, m);
  return s && <line className={`pl-line ${cls}`} x1={s[0][0]} y1={s[0][1]} x2={s[1][0]} y2={s[1][1]} />;
}

function Slider({ label, min, max, step, value, onChange, show, aria }: { label: ReactNode; min: number; max: number; step: number; value: number; onChange: (v: number) => void; show: ReactNode; aria: string }) {
  return (
    <label className="slider wide-slider">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={aria} />
      <span className="val">{show}</span>
    </label>
  );
}

/* ================================================================ 1. secant → tangent (Ü4 p. 2), StepPlayer frame */
export function SecantFig({ step, t: tt }: { step: number; t: number }) {
  const tr = useTr(), lang = useLang();
  const fr = secantFrame(step, tt);
  const { P, Q, C } = secantPts(fr.h);
  const m = (Q[1] - P[1]) / (Q[0] - P[0]);
  const a = Math.min(1, fr.tri * 2), b = Math.max(0, fr.tri * 2 - 1);
  const H: P2 = [P[0] + a * (C[0] - P[0]), P[1]], V: P2 = [C[0], C[1] + b * (Q[1] - C[1])];
  return (
    <div className="w4-secant">
      <Plot x={SEC_WIN.x} y={SEC_WIN.y} w={SEC_WIN.w} h={SEC_WIN.h} grid={[0.5, 1]} tick={[1, 1]}
        label={tr('Parabel y = x², Sekante durch P und Q, Q rutscht zu P', 'Parabola y = x², secant through P and Q, Q slides towards P')}>
        <Curve f={sq} />
        {fr.tan > 0 && <g style={{ opacity: fr.tan }}><Line p={P} m={2} role="tan" /></g>}
        <Line p={P} m={m} role="sec" dashed />
        {a > 0 && <PArrow a={P} b={H} />}
        {b > 0 && <PArrow a={C} b={V} />}
        <Pt x={P[0]} y={P[1]} />
        <Pt x={Q[0]} y={Q[1]} />
        <PLabel x={P[0]} y={P[1]} dx={-8} dy={-14} anchor="r" tex="P(1, 1)" role="pt" />
        {fr.h > 0.2 && <PLabel x={Q[0]} y={Q[1]} dx={-10} dy={-2} anchor="r" tex="Q" role="pt" />}
        {fr.triLabels && a >= 1 && <PLabel x={(P[0] + C[0]) / 2} y={P[1]} dy={6} anchor="t" small role="aux" tex={t`\Delta x = ${num(fr.h, 2, lang)}`} />}
        {fr.triLabels && b >= 1 && <PLabel x={C[0]} y={(C[1] + Q[1]) / 2} dx={8} anchor="l" small role="aux" tex={t`\Delta y = ${num(Q[1] - P[1], 2, lang)}`} />}
        <PLabel x={0.12} y={4.7} anchor="l" role="sec" tex={t`\text{${tr('Sekante', 'secant')}: } m = ${num(m, 2, lang)}`} />
        {fr.tan > 0.5 && <PLabel x={0.12} y={4.05} anchor="l" role="tan" tex={t`\text{${tr('Tangente', 'tangent')}: } m = 2`} />}
        <PLabel x={0.4} y={0.75} anchor="c" role="f" tex="f(x) = x^2" />
      </Plot>
      <table className="w4-table">
        <tbody>
          <tr><th><M>h</M></th>{SQ_H.map((h) => <th key={h}><M>{num(h, 2, lang)}</M></th>)}</tr>
          <tr><th>{tr('Steigung', 'slope')}</th>{SQ_H.map((h, i) => <td key={h} className={i < fr.filled ? 'on' : ''}>{i < fr.filled ? <M>{num(2 + h, 2, lang)}</M> : '…'}</td>)}</tr>
        </tbody>
      </table>
    </div>
  );
}

/* ================================================================ 2. from the left and from the right (Ü4 p. 3) */
export function SidesFigure() {
  const tr = useTr(), lang = useLang();
  const [c, setC] = useState<SideCase>('sq');
  const [h, setH] = useState(0.8);
  const cs = SIDE_CASES[c], hh = Math.min(h, cs.hMax);
  const s = sides(c, hh);
  const agree = c === 'sq';
  return (
    <figure className="vdemo w4-sides">
      <div className="vdemo-fig">
        <Plot x={cs.x} y={cs.y} w={400} h={c === "sq" ? 300 : 260} grid={[0.5, 1]} tick={[1, 1]}
          label={tr('Sekanten von links und von rechts an den Punkt P', 'Secants from the left and from the right at the point P')}>
          <Curve f={cs.f} breaks={c === 'abs' ? [0] : undefined} />
          {agree && <g style={{ opacity: 0.55 }}><Line p={s.P} m={2} role="tan" /></g>}
          <Line p={s.P} m={s.mLeft} role="asym" dashed />
          <Line p={s.P} m={s.mRight} role="sec" dashed />
          <Pt x={s.Qm[0]} y={s.Qm[1]} role="asym" />
          <Pt x={s.Qp[0]} y={s.Qp[1]} role="sec" />
          <Pt x={s.P[0]} y={s.P[1]} />
          <PLabel x={s.P[0]} y={s.P[1]} dy={18} anchor="c" tex="P" role="pt" />
          <PLabel x={s.Qm[0]} y={s.Qm[1]} dx={-8} dy={-12} anchor="r" small tex="Q_-" role="asym" />
          <PLabel x={s.Qp[0]} y={s.Qp[1]} dx={8} dy={10} anchor="l" small tex="Q_+" role="sec" />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="v-presets" role="group">
          <button type="button" aria-pressed={c === 'sq'} onClick={() => setC('sq')}><M>{t`f(x) = x^2,\ x_0 = 1`}</M></button>
          <button type="button" aria-pressed={c === 'abs'} onClick={() => setC('abs')}><M>{t`f(x) = |x|,\ x_0 = 0`}</M></button>
        </div>
        <Slider label={<M>h</M>} min={0.02} max={cs.hMax} step={0.01} value={hh} onChange={setH} aria="h" show={<M>{num(hh, 2, lang)}</M>} />
        <div className="w4-pair">
          <span className="w4-left-ink"><M>{t`m_\text{${tr('links', 'left')}} = ${num(s.mLeft, 2, lang)}`}</M></span>
          <span className="w4-right-ink"><M>{t`m_\text{${tr('rechts', 'right')}} = ${num(s.mRight, 2, lang)}`}</M></span>
        </div>
        <p className="vdemo-note">{agree
          ? tr('Beide Sekanten drehen in die Tangente (blass): beide Steigungen gehen gegen 2.', 'Both secants turn into the tangent (pale): both slopes tend to 2.')
          : <T de={<>Die Sekanten drehen sich nie: Links bleibt die Steigung <M p=",">-1</M> rechts <M p=".">+1</M> Kein gemeinsamer Wert, also keine Tangente.</>}
              en={<>The secants never turn: on the left the slope stays <M p=",">-1</M> on the right <M p=".">+1</M> No common value, so no tangent.</>} />}</p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ 3. product rule: the area picture (supplement) */
export function ProductArea() {
  const tr = useTr(), lang = useLang();
  const [h, setH] = useState(0.5);
  const { u, v, du, dv } = PROD;
  const a = productAreas(u, v, du, dv, h);
  const R = prodRects(u, v, a.Du, a.Dv);
  return (
    <figure className="vdemo w4-prod">
      <div className="vdemo-fig">
        <Plot x={PROD_WIN.x} y={PROD_WIN.y} w={PROD_WIN.w} h={PROD_WIN.h} grid={[0, 0]} tick={[0, 0]} axes={['', '']}
          label={tr('Rechteck u mal v wächst um zwei Streifen und ein Eckchen', 'Rectangle u times v grows by two strips and a small corner')}>
          <Path pts={R.main} role="f" fill />
          {h > 0 && <><Path pts={R.stripU} role="sec" fill /><Path pts={R.stripV} role="g" fill /><Path pts={R.corner} role="pt" fill /></>}
          <PLabel x={u / 2} y={v / 2} tex="u\,v" role="f" />
          <PLabel x={u / 2} y={0} dy={12} anchor="t" small tex="u" role="fg" />
          <PLabel x={0} y={v / 2} dx={-8} anchor="r" small tex="v" role="fg" />
          {a.Du > 0.3 && <PLabel x={u + a.Du / 2} y={0} dy={12} anchor="t" small tex="\Delta u" role="sec" />}
          {a.Dv > 0.25 && <PLabel x={0} y={v + a.Dv / 2} dx={-8} anchor="r" small tex="\Delta v" role="g" />}
          {a.Du > 0.35 && <PLabel x={u + a.Du / 2} y={v / 2} small tex="\Delta u\, v" role="sec" />}
          {a.Dv > 0.25 && <PLabel x={u / 2} y={v + a.Dv / 2} small tex="u\,\Delta v" role="g" />}
          {a.Du > 0.55 && <PLabel x={u + a.Du / 2} y={v + a.Dv / 2} small tex="\Delta u\,\Delta v" role="pt" />}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <Slider label={<M>h</M>} min={0} max={1} step={0.01} value={h} onChange={setH} aria="h" show={<M>{num(h, 2, lang)}</M>} />
        <M>{t`\Delta u = u'h,\quad \Delta v = v'h`}</M>
        {h > 0 && <M>{t`\frac{\Delta(uv)}{h} = \underbrace{u'v}_{${num(du * v, 2, lang)}} + \underbrace{uv'}_{${num(u * dv, 2, lang)}} + \underbrace{u'v'\,h}_{${num(a.cornerPerH, 2, lang)}} = ${num(a.perH, 2, lang)}`}</M>}
        <p className="vdemo-note"><T
          de={<>Hier: <M p=".">{t`u = 2{,}4;\ v = 1{,}6;\ u' = 1;\ v' = 0{,}8`}</M> Schieb <M>h</M> gegen <M p=":">0</M> Die Streifen werden dünn, das rote Eckchen verschwindet viel schneller.</>}
          en={<>Here: <M p=".">{t`u = 2.4,\ v = 1.6,\ u' = 1,\ v' = 0.8`}</M> Slide <M>h</M> towards <M p=":">0</M> the strips get thin, the red corner vanishes much faster.</>} /></p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ 4. chain rule: three stretched number lines (supplement) */
export function ChainLines() {
  const tr = useTr(), lang = useLang();
  const [dx, setDx] = useState(0.4);
  const b = chainBars(dx);
  const L = CHAIN_LEVELS;
  const nums = [1, 2, 3, 4, 5, 6];
  const line = (y: number, name: string, role: 'f' | 'sec' | 'g') => (
    <g key={name}>
      {y !== 0 && <PArrow a={[0, y]} b={[CHAIN_WIN.x[1] - 0.05, y]} role="fg" head={6} />}
      {y !== 0 && nums.map((n) => <Seg key={n} a={[n, y - 0.06]} b={[n, y + 0.06]} role="fg" />)}
      {y !== 0 && nums.map((n) => <PLabel key={`l${n}`} x={n} y={y} dy={13} small tex={String(n)} role="muted" />)}
      <PLabel x={CHAIN_WIN.x[1]} y={y} dx={-6} dy={-14} anchor="r" small tex={name} role={role} />
    </g>
  );
  return (
    <figure className="vdemo w4-chain">
      <div className="vdemo-fig">
        <Plot x={CHAIN_WIN.x} y={CHAIN_WIN.y} w={CHAIN_WIN.w} h={CHAIN_WIN.h} grid={[0, 0]} tick={[1, 0]} axes={['', '']}
          label={tr('Drei Zahlengeraden x, u, g: ein kleines Stück wird zweimal gestreckt', 'Three number lines x, u, g: a small piece is stretched twice')}>
          {line(L.x, 'x', 'f')}{line(L.u, 'u = x^2', 'sec')}{line(L.g, 'g = u^2', 'g')}
          <Seg a={[b.xBar[0], L.x]} b={[b.uBar[0], L.u]} dashed />
          <Seg a={[b.xBar[1], L.x]} b={[b.uBar[1], L.u]} dashed />
          <Seg a={[b.uBar[0], L.u]} b={[b.gBar[0], L.g]} dashed />
          <Seg a={[b.uBar[1], L.u]} b={[b.gBar[1], L.g]} dashed />
          <Seg a={[b.xBar[0], L.x]} b={[b.xBar[1], L.x]} role="f" width={7} />
          <Seg a={[b.uBar[0], L.u]} b={[b.uBar[1], L.u]} role="sec" width={7} />
          <Seg a={[b.gBar[0], L.g]} b={[b.gBar[1], L.g]} role="g" width={7} />
          <PLabel x={(b.xBar[0] + b.xBar[1]) / 2} y={L.x} dy={-14} small tex="\Delta x" role="f" />
          <PLabel x={(b.uBar[0] + b.uBar[1]) / 2} y={L.u} dy={-14} small tex="\Delta u" role="sec" />
          <PLabel x={(b.gBar[0] + b.gBar[1]) / 2} y={L.g} dy={-14} small tex="\Delta g" role="g" />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <Slider label={<M>{t`\Delta x`}</M>} min={0.05} max={0.5} step={0.01} value={dx} onChange={setDx} aria="dx" show={<M>{num(dx, 2, lang)}</M>} />
        <M>{t`\frac{\Delta g}{\Delta x} = \frac{\Delta g}{\Delta u}\cdot\frac{\Delta u}{\Delta x} = ${num(b.rG, 2, lang)}\cdot ${num(b.rU, 2, lang)} = ${num(b.rTotal, 2, lang)}`}</M>
        <p className="vdemo-note"><T
          de={<>Für kleines <M p=":">{t`\Delta x`}</M> Streckung <M>2</M> mal Streckung <M>2</M> ergibt <M p=".">{t`4 = (x^4)'(1)`}</M></>}
          en={<>For small <M p=":">{t`\Delta x`}</M> stretch <M>2</M> times stretch <M>2</M> gives <M p=".">{t`4 = (x^4)'(1)`}</M></>} /></p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ 5. inverse: mirror the slope triangle (Ü4 p. 7) */
export function InverseMirror() {
  const tr = useTr(), lang = useLang();
  const [x0, setX0] = useState(1);
  const [s, setS] = useState(0);
  const IT = invTriangle(x0, s);
  const [A, B, C] = IT.tri;
  const flipped = s > 0.5;
  return (
    <figure className="vdemo w4-inv">
      <div className="vdemo-fig">
        <Plot x={INV_WIN.x} y={INV_WIN.y} w={INV_WIN.w} h={INV_WIN.h} grid={[1, 1]} tick={[1, 1]}
          label={tr('f(x) = x² + 2 und ihre Umkehrfunktion, Steigungsdreieck an y = x gespiegelt', 'f(x) = x² + 2 and its inverse, slope triangle mirrored at y = x')}>
          <Line p={[0, 0]} m={1} role="ref" dashed />
          <Curve f={INV.f} dom={[0, 2.2]} />
          <Curve f={INV.finv} dom={[2, INV_WIN.x[1]]} role="g" />
          {s > 0 && <g style={{ opacity: 0.3 }}>
            <Seg a={IT.base[0]} b={IT.base[1]} role="sec" width={3} /><Seg a={IT.base[1]} b={IT.base[2]} role="asym" width={3} />
          </g>}
          <Seg a={A} b={C} role="fg" />
          <Seg a={A} b={B} role="sec" width={3.5} />
          <Seg a={B} b={C} role="asym" width={3.5} />
          <Pt x={IT.base[0][0]} y={IT.base[0][1]} />
          {s > 0 && <Pt x={A[0]} y={A[1]} />}
          <PLabel x={(A[0] + B[0]) / 2} y={(A[1] + B[1]) / 2} dx={flipped ? 9 : 0} dy={flipped ? 0 : 8} anchor={flipped ? 'l' : 't'} small tex="\Delta x" role="sec" />
          <PLabel x={(B[0] + C[0]) / 2} y={(B[1] + C[1]) / 2} dx={flipped ? 0 : 9} dy={flipped ? -8 : 0} anchor={flipped ? 'b' : 'l'} small tex="\Delta y" role="asym" />
          <PLabel x={IT.base[0][0]} y={IT.base[0][1]} dx={-9} anchor="r" small tex="(x_0, y_0)" role="pt" />
          {s >= 1 && <PLabel x={A[0]} y={A[1]} dy={13} anchor="t" small tex="(y_0, x_0)" role="pt" />}
          <PLabel x={1.75} y={INV.f(1.75)} dx={-10} anchor="r" tex="f" role="f" />
          <PLabel x={3} y={INV.finv(3)} dx={6} dy={12} anchor="l" tex="f^{-1}" role="g" />
          <PLabel x={5.6} y={5.6} dx={8} dy={10} anchor="l" small tex="y = x" role="ref" />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <Slider label={<M>{t`x_0`}</M>} min={0.4} max={1.6} step={0.05} value={x0} onChange={setX0} aria="x0" show={<M>{num(x0, 2, lang)}</M>} />
        <Slider label={tr('spiegeln', 'mirror')} min={0} max={1} step={0.02} value={s} onChange={setS} aria="mirror" show={<M>{num(s * 100, 0, lang) + t`\,\%`}</M>} />
        <M>{t`f'(x_0) = \frac{\Delta y}{\Delta x} = 2x_0 = ${num(IT.m, 2, lang)}`}</M>
        <M>{t`(f^{-1})'(y_0) = \frac{\Delta x}{\Delta y} = \frac{1}{2x_0} = ${num(IT.mInv, 3, lang)}`}</M>
        <p className="vdemo-note">{tr('Beim Spiegeln tauschen die beiden Katheten ihre Rollen: Was hoch war, geht jetzt nach rechts.', 'Mirroring swaps the roles of the two legs: what went up now goes to the right.')}</p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ 6. tangent = zoom in (Ü4 p. 8) */
export function TangentZoom() {
  const tr = useTr(), lang = useLang();
  const [id, setId] = useState<'sq' | 'rsqrt'>('sq');
  const [lz, setLz] = useState(0);
  const e = TAN_EXAMPLES.find((q) => q.id === id)!;
  const z = 10 ** lz;
  const w = zoomWindow(e, z);
  const sx = niceStep(w.x[1] - w.x[0]), sy = niceStep(w.y[1] - w.y[0]);
  const bend = zoomBend(e, z);
  const P: P2 = [e.x0, e.f(e.x0)];
  return (
    <figure className="vdemo w4-zoom">
      <div className="vdemo-fig">
        <Plot x={w.x} y={w.y} w={400} h={300} grid={[sx, sy]} tick={[sx, sy]}
          label={tr('Graph und Tangente, immer stärker vergrössert', 'Graph and tangent, zoomed in more and more')}>
          <Curve f={e.f} dom={e.dom ? [e.dom[0] + 1e-6, Infinity] : undefined} />
          <Line p={P} m={e.df(e.x0)} role="tan" />
          <Pt x={P[0]} y={P[1]} />
          <PLabel x={P[0]} y={P[1]} dx={6} dy={14} anchor="l" tex="P" role="pt" />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="v-presets" role="group">
          <button type="button" aria-pressed={id === 'sq'} onClick={() => setId('sq')}><M>{t`x^2,\ x_0 = 1`}</M></button>
          <button type="button" aria-pressed={id === 'rsqrt'} onClick={() => setId('rsqrt')}><M>{t`\frac{1}{\sqrt{1+2x}},\ x_0 = 4`}</M></button>
        </div>
        <Slider label={tr('Zoom', 'zoom')} min={0} max={2} step={0.02} value={lz} onChange={setLz} aria="zoom" show={<M>{t`${num(z, z < 10 ? 1 : 0, lang)}\times`}</M>} />
        <span className="w4-tan-ink"><M>{id === 'sq' ? t`t(x) = 2x - 1` : t`t(x) = \frac{13 - x}{27}`}</M></span>
        <span>{tr('grösste Lücke Kurve–Tangente im Bild:', 'largest gap curve–tangent in the picture:')} <M>{t`${num(bend * 100, 1, lang)}\,\%`}</M> {tr('der Bildhöhe', 'of the picture height')}</span>
        <p className="vdemo-note">{id === 'sq'
          ? tr('Zehnmal näher hinschauen: die Lücke wird zehnmal kleiner. Bald sieht die Parabel aus wie ihre Tangente.', 'Look ten times closer: the gap gets ten times smaller. Soon the parabola looks like its tangent.')
          : tr('Wie auf der Folie sind die Achsen ungleich gestreckt (die y-Achse stärker), sonst sähe man die Krümmung kaum.', 'As on the slide the axes are stretched unequally (the y-axis more), otherwise the bending would hardly show.')}</p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ 7. normal (Ü4 p. 9) */
export function NormalFigure() {
  const tr = useTr(), lang = useLang();
  const [x0, setX0] = useState(0.8);
  const n = normalTriangles(x0);
  const { P, m } = n;
  const u = Math.hypot(1, m), tanDir: P2 = [1 / u, m / u], norDir: P2 = [-m / u, 1 / u];
  const fr = { k: 400 / 5 }; // px per unit (equal scales)
  const k = 10 / fr.k; // right-angle mark size in units
  const ra: P2[] = [
    [P[0] - k * tanDir[0], P[1] - k * tanDir[1]],
    [P[0] - k * tanDir[0] + k * norDir[0], P[1] - k * tanDir[1] + k * norDir[1]],
    [P[0] + k * norDir[0], P[1] + k * norDir[1]],
  ];
  const nl: P2 = [P[0] + 1.05 * norDir[0], P[1] + 1.05 * norDir[1]];
  const tl: P2 = [P[0] + 1.25 * tanDir[0] * Math.sign(m || 1), P[1] + 1.25 * tanDir[1] * Math.sign(m || 1)];
  return (
    <figure className="vdemo w4-norm">
      <div className="vdemo-fig">
        <Plot x={NORM_WIN.x} y={NORM_WIN.y} w={NORM_WIN.w} h={NORM_WIN.h} grid={[0.5, 0.5]} tick={[1, 1]}
          label={tr('Parabel mit Tangente und Normale im Punkt P', 'Parabola with tangent and normal at the point P')}>
          <Curve f={sq} />
          <Line p={P} m={m} role="tan" />
          <CLine p={P} m={n.mN} cls="w4-normal-line" />
          <Path pts={ra} role="fg" />
          {m !== 0 && <>
            <Seg a={n.tanTri[0]} b={n.tanTri[1]} role="sec" width={3} /><Seg a={n.tanTri[1]} b={n.tanTri[2]} role="asym" width={3} />
            <Seg a={n.rotTri[0]} b={n.rotTri[1]} role="sec" width={3} /><Seg a={n.rotTri[1]} b={n.rotTri[2]} role="asym" width={3} />
          </>}
          <Pt x={P[0]} y={P[1]} />
          <PLabel x={P[0]} y={P[1]} dx={m >= 0 ? 10 : -10} dy={12} anchor={m >= 0 ? 'l' : 'r'} tex="P" role="pt" />
          <PLabel x={tl[0]} y={tl[1]} dy={-12} tex="t" role="tan" />
          <PLabel x={nl[0]} y={nl[1]} dx={m >= 0 ? -10 : 4} dy={m >= 0 ? 0 : -14} anchor={m >= 0 ? 'r' : 'l'} tex="n" role="asym" />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <Slider label={<M>{t`x_0`}</M>} min={-1.2} max={1.2} step={0.05} value={x0} onChange={setX0} aria="x0" show={<M>{num(x0, 2, lang)}</M>} />
        <span className="w4-tan-ink"><M>{t`m_t = f'(x_0) = 2x_0 = ${num(m, 2, lang)}`}</M></span>
        <span className="w4-normal-ink">{m === 0
          ? <><M>{t`m_t = 0`}</M>: {tr('Die Normale ist senkrecht,', 'the normal is vertical,')} <M p=".">{t`x = x_0`}</M></>
          : <M>{t`m_n = -\frac{1}{f'(x_0)} = ${num(n.mN, 2, lang)}`}</M>}</span>
        <p className="vdemo-note"><T
          de={<>Das Steigungsdreieck der Tangente, um <M>{t`90^\circ`}</M> gedreht, ist das Steigungsdreieck der Normale.</>}
          en={<>The slope triangle of the tangent, turned by <M p=",">{t`90^\circ`}</M> is the slope triangle of the normal.</>} /></p>
      </figcaption>
    </figure>
  );
}
