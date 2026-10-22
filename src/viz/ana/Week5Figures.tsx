import { useState } from 'react';
import { M, MD } from '../../components/Tex';
import { fmtNum, useLang, useTr, type Lang } from '../../i18n';
import {
  FUNS, boxDiagonal, cabs, cadd, classify, conj, csub, cx, cylinder, lhQuotient, mvtPoints, rectangle, secantSlope,
  signIntervals, type C, type Fun,
} from '../../analysis/week5';
import { Band, Curve, HLine, Line, PArrow, PLabel, Path, Plot, Pt, Seg } from '../plot/Plot';
import { makeFrame, type P2, type Range } from '../plot/plotMath';
import { at } from '../figUtils';
import { MVT, TAN, ex1Scene, ex2Scene, mvtScene, snapHalf, tanScene, tipLabel, type CandFrame, type Win } from './w5Scenes';

const t = String.raw;
const n = (x: number, d: number, lang: Lang) => fmtNum(x, d, lang, true);
/** Number with as many decimals as needed (up to `d`), TeX. */
const nn = (x: number, lang: Lang, d = 2) => n(x, Number.isInteger(Math.round(x * 1e6) / 1e6) ? 0 : d, lang).replace(/(\{,\}\d*?)0+$/, '$1').replace(/\{,\}$/, '');

/* =============================================================== 1 · Δf ≈ df (tangent), step animation */

export function TanFigure({ step, t: tt }: { step: number; t: number }) {
  const tr = useTr(), lang = useLang();
  const s = tanScene(step, tt);
  const sx = s.win.x[1] - s.win.x[0], sy = s.win.y[1] - s.win.y[0];
  const off = 0.03 * sx, below = s.P[1] - 0.08 * sy;
  const xr = s.P[0] + s.dx;
  return (
    <div className="w5-anim">
      <Plot x={s.win.x} y={s.win.y} grid={[s.tick, s.tick]} tick={[s.tick, s.tick]}
        label={tr('Graph von f mit Tangente: Δf auf der Kurve, df auf der Tangente', 'Graph of f with tangent: Δf on the curve, df on the tangent')}>
        <Curve f={TAN.f} />
        {s.showTangent && <Line p={s.P} m={TAN.fp(TAN.x0)} role="tan" />}
        <Seg a={s.P} b={[s.P[0] + s.dx * s.dxGrow, s.P[1]]} role="aux" dashed />
        <PArrow a={[s.P[0], below]} b={[s.P[0] + s.dx * s.dxGrow, below]} role="aux" />
        {s.DfGrow > 0 && <PArrow a={[xr + off, s.P[1]]} b={[xr + off, s.P[1] + s.exact * s.DfGrow]} role="f" />}
        {s.dfGrow > 0 && <PArrow a={[xr - off, s.P[1]]} b={[xr - off, s.P[1] + s.lin * s.dfGrow]} role="tan" />}
        {s.showGap && <Seg a={s.T} b={s.Q} role="pt" width={4} />}
        <Pt x={s.P[0]} y={s.P[1]} />
        {s.showQ && <Pt x={s.Q[0]} y={s.Q[1]} role="f" />}
        {s.dfGrow >= 1 && <Pt x={s.T[0]} y={s.T[1]} role="tan" r={3.5} />}
        <PLabel x={s.P[0] + s.dx / 2} y={below} dy={13} tex={t`\Delta x`} role="aux" />
        <PLabel x={s.P[0]} y={s.P[1]} dx={-8} dy={-12} anchor="r" tex={t`f(x)`} role="pt" small />
        {s.showQ && <PLabel x={s.Q[0]} y={s.Q[1]} dx={-9} anchor="r" tex={t`f(x+\Delta x)`} role="f" small />}
        {s.DfGrow >= 1 && <PLabel x={xr + off} y={s.P[1] + 0.5 * s.exact} dx={7} anchor="l" tex={t`\Delta f`} role="f" />}
        {s.dfGrow >= 1 && <PLabel x={xr - off} y={s.P[1] + 0.45 * s.lin} dx={-7} anchor="r" tex={t`df`} role="tan" />}
        {s.showGap && <PLabel x={xr + off} y={(s.T[1] + s.Q[1]) / 2} dx={12} anchor="l" tex={t`\Delta f - df`} role="pt" small />}
      </Plot>
      <div className="w5-read">
        <M>{t`\Delta x = ${n(s.dx, 2, lang)}`}</M>
        {s.DfGrow >= 1 && <M>{t`\Delta f = ${n(s.exact, 4, lang)}`}</M>}
        {s.dfGrow >= 1 && <M>{t`df = ${n(s.lin, 4, lang)}`}</M>}
        {s.showGap && <M>{t`\Delta f - df = ${n(s.gap, 4, lang)}`}</M>}
      </div>
    </div>
  );
}

/* =============================================================== 2 · rectangle: the strip b·Δa (interactive) */

export function RectErrorFig() {
  const tr = useTr(), lang = useLang();
  const [a, setA] = useState(12), [b, setB] = useState(3), [da, setDa] = useState(0.1);
  const r = rectangle(a, b, da);
  const asSlide = a === 12 && b === 3 && Math.abs(da - 0.1) < 1e-9;
  const right = a + da > 12.5;
  const pct = 100 * r.rA;
  return (
    <figure className="vdemo">
      <div className="vdemo-fig wide">
        <Plot x={[0, 18]} y={[0, 7]} w={400} h={172} grid={[1, 1]} tick={[2, 1]} axes={['', '']}
          label={tr('Rechteck a mal b, rechts der blaue Streifen b mal Delta a', 'Rectangle a by b, on the right the blue strip b times Delta a')}>
          <Path pts={[[0, 0], [a, 0], [a, b], [0, b]]} role="g" fill />
          <g className="w5-strip"><Path pts={[[a, 0], [a + da, 0], [a + da, b], [a, b]]} role="f" fill /></g>
          <PLabel x={a / 2} y={b} dy={-11} tex="a" role="g" />
          <PLabel x={0} y={b / 2} dx={9} anchor="l" tex="b" role="g" />
          <PLabel x={a + da / 2} y={b} dy={-11} tex={t`\Delta a`} role="f" />
          <PLabel x={right ? a : a + da} y={b / 2} dx={right ? -7 : 7} anchor={right ? 'r' : 'l'} tex={t`\Delta A = b\,\Delta a`} role="f" small />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider"><span><M>a</M></span>
          <input type="range" min={4} max={16} step={0.5} value={a} onChange={(e) => setA(Number(e.target.value))} aria-label="a" /><span className="val">{fmtNum(a, 1, lang)} m</span></label>
        <label className="slider wide-slider"><span><M>b</M></span>
          <input type="range" min={1} max={6} step={0.5} value={b} onChange={(e) => setB(Number(e.target.value))} aria-label="b" /><span className="val">{fmtNum(b, 1, lang)} m</span></label>
        <label className="slider wide-slider"><span><M>{t`|\Delta a|`}</M></span>
          <input type="range" min={0} max={1.5} step={0.05} value={da} onChange={(e) => setDa(Number(e.target.value))} aria-label="Delta a" /><span className="val">{fmtNum(da, 2, lang)} m</span></label>
        <div className="v-result"><M>{t`A = a\,b = ${nn(r.A, lang)}\ \mathrm{m}^2`}</M></div>
        <div className="v-result pos"><M>{t`E_A = b\,|\Delta a| = ${nn(b, lang)}\cdot ${nn(da, lang)} = ${nn(r.EA, lang, 3)}\ \mathrm{m}^2`}</M></div>
        <div className="v-result pos"><M>{t`r_A = \frac{|\Delta a|}{a} = \frac{${nn(da, lang)}}{${nn(a, lang)}} \approx ${n(pct, 3, lang)}\,\%`}</M></div>
        <div className="v-presets"><button type="button" aria-pressed={asSlide} onClick={() => { setA(12); setB(3); setDa(0.1); }}>{tr('Werte der Übung', 'Values from the class')}</button></div>
        <p className="vdemo-note">{tr('Ändere ', 'Change ')}<M p=":">b</M>{tr(' Der Streifen wird höher, ', ' the strip gets taller, ')}<M>{t`E_A`}</M>{tr(' grösser – ', ' bigger – ')}<M>{t`r_A`}</M>{tr(' bleibt gleich.', ' stays the same.')}</p>
      </figcaption>
    </figure>
  );
}

/* =============================================================== 3 · cylinder: ring = circumference × Δr */

export function RingFig() {
  const tr = useTr(), lang = useLang();
  const [pc, setPc] = useState(10);
  const eps = pc / 100;
  const c = cylinder(1, 1, eps);
  const VB = [0, 0, 400, 250] as [number, number, number, number];
  const O = [200, 92] as const, R = 55, R2 = R * (1 + eps);
  const L = 2 * Math.PI * R, x0 = 200 - L / 2, ys = 200, hS = Math.max(1.2, eps * R);
  const ring = `M ${O[0] - R2} ${O[1]} a ${R2} ${R2} 0 1 0 ${2 * R2} 0 a ${R2} ${R2} 0 1 0 ${-2 * R2} 0 Z M ${O[0] - R} ${O[1]} a ${R} ${R} 0 1 0 ${2 * R} 0 a ${R} ${R} 0 1 0 ${-2 * R} 0 Z`;
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <svg viewBox={VB.join(' ')} className="w5-static" aria-label={tr('Kreisfläche von oben, darum ein dünner Ring; unten der Ring aufgerollt als Streifen', 'Disc seen from above with a thin ring; below, the ring unrolled into a strip')}>
          <circle cx={O[0]} cy={O[1]} r={R} className="w5-body" />
          <path d={ring} className="w5-extra" fillRule="evenodd" />
          <line x1={O[0]} y1={O[1]} x2={O[0] + R} y2={O[1]} className="w5-dim" />
          <circle cx={O[0]} cy={O[1]} r={2.5} className="w5-dot" />
          <rect x={x0} y={ys - hS} width={L} height={hS} className="w5-extra" />
          <line x1={x0} x2={x0 + L} y1={ys + 10} y2={ys + 10} className="w5-dim" />
        </svg>
        <div className="vdemo-label small halo pl-ink-g" style={at(VB, O[0] + R / 2, O[1] - 11)}><M>r</M></div>
        <div className="vdemo-label small halo pl-ink-f" style={at(VB, O[0] + R2 + 22, O[1] - 26)}><M>{t`\Delta r`}</M></div>
        <div className="vdemo-label small halo pl-ink-g" style={at(VB, O[0], O[1] + R + 24)}><M>{t`\pi r^2`}</M></div>
        <div className="vdemo-label small halo pl-ink-f" style={at(VB, 200, ys + 24)}><M>{t`2\pi r`}</M></div>
        <div className="vdemo-label small halo pl-ink-f" style={at(VB, x0 - 4, ys - hS / 2 - 14)}><M>{t`\Delta r`}</M></div>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider"><span><M>{t`\tfrac{|\Delta r|}{r}`}</M></span>
          <input type="range" min={1} max={25} step={1} value={pc} onChange={(e) => setPc(Number(e.target.value))} aria-label="Delta r / r" /><span className="val">{pc} %</span></label>
        <div className="v-result pos"><M>{t`\frac{|\Delta V|}{V} \approx \frac{2\pi r\,|\Delta r|}{\pi r^2} = 2\,\frac{|\Delta r|}{r} = ${nn(100 * c.approx, lang)}\,\%`}</M></div>
        <div className="v-result"><M>{t`\text{${tr('exakt', 'exact')}: } (1 + ${n(eps, 2, lang)})^2 - 1 = ${n(100 * c.exact, 2, lang)}\,\%`}</M></div>
        <div className="v-presets"><button type="button" aria-pressed={pc === 1} onClick={() => setPc(1)}>{tr('1 % wie in der Übung', '1 % as in the class')}</button></div>
      </figcaption>
    </figure>
  );
}

/* =============================================================== 4 · Quader with the space diagonal (static) */

export function BoxDiagram() {
  const tr = useTr(), lang = useLang();
  const q = boxDiagonal(25, 20, 50, 1);
  const VB = [0, 0, 300, 230] as [number, number, number, number];
  const k = 3, A = 25 * k, Cc = 50 * k, D = [0.62 * 20 * k * 0.7, -0.62 * 20 * k * 0.7] as const;
  const p0 = [60, 200] as const;
  const P = (x: number, z: number, back: boolean) => [p0[0] + x + (back ? D[0] : 0), p0[1] - z + (back ? D[1] : 0)] as const;
  const fr = [P(0, 0, false), P(A, 0, false), P(A, Cc, false), P(0, Cc, false)];
  const bk = [P(0, 0, true), P(A, 0, true), P(A, Cc, true), P(0, Cc, true)];
  const poly = (ps: readonly (readonly [number, number])[]) => ps.map((p) => p.join(',')).join(' ');
  return (
    <figure className="vdemo">
      <div className="vdemo-fig w5-box">
        <svg viewBox={VB.join(' ')} className="w5-static" aria-label={tr('Quader mit Raumdiagonale d', 'Box with space diagonal d')}>
          <polyline points={poly([bk[0], bk[3]])} className="w5-hidden" />
          <polyline points={poly([bk[0], bk[1]])} className="w5-hidden" />
          <polyline points={poly([fr[0], bk[0]])} className="w5-hidden" />
          <polygon points={poly(fr)} className="w5-edge" />
          <polyline points={poly([fr[1], bk[1], bk[2], bk[3], fr[3]])} className="w5-edge" />
          <polyline points={poly([fr[2], bk[2]])} className="w5-edge" />
          <line x1={fr[0][0]} y1={fr[0][1]} x2={bk[2][0]} y2={bk[2][1]} className="w5-diag" />
        </svg>
        <div className="vdemo-label small halo pl-ink-f" style={at(VB, (fr[0][0] + fr[1][0]) / 2, fr[0][1] + 14)}><M>{t`a = 25`}</M></div>
        <div className="vdemo-label small halo pl-ink-f" style={at(VB, (fr[1][0] + bk[1][0]) / 2 + 30, (fr[1][1] + bk[1][1]) / 2 + 4)}><M>{t`b = 20`}</M></div>
        <div className="vdemo-label small halo pl-ink-f" style={at(VB, bk[1][0] + 34, (bk[1][1] + bk[2][1]) / 2)}><M>{t`c = 50`}</M></div>
        <div className="vdemo-label small halo pl-ink-g" style={at(VB, (fr[0][0] + bk[2][0]) / 2 - 12, (fr[0][1] + bk[2][1]) / 2 - 8)}><M>d</M></div>
      </div>
      <div className="vdemo-readout">
        <div className="v-result"><M>{t`d = \sqrt{25^2 + 20^2 + 50^2} = \sqrt{3525} \approx ${n(q.d, 2, lang)}`}</M></div>
      </div>
    </figure>
  );
}

/* =============================================================== 5 · Mittelwertsatz: parallel shift (step animation) */

export function MvtFigure({ step, t: tt }: { step: number; t: number }) {
  const tr = useTr();
  const s = mvtScene(step, tt);
  const { A, B } = s;
  const ext = (u: number): P2 => [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u];
  return (
    <div className="w5-anim">
      <Plot x={MVT.win.x} y={MVT.win.y} grid={[1, 1]} tick={[1, 2]}
        label={tr('Parabel mit Sekante; eine parallele Gerade wird verschoben, bis sie die Kurve berührt', 'Parabola with secant; a parallel line is shifted until it touches the curve')}>
        <Curve f={MVT.f} dom={[0.2, 3.6]} />
        <Seg a={ext(-0.12)} b={ext(-0.12 + 1.22 * s.secGrow)} role="sec" dashed />
        {step >= 1 && <Line p={[A[0], A[1] - s.k]} m={s.m} role="tan" />}
        {s.cuts.map((p, i) => <Pt key={i} x={p[0]} y={p[1]} role="muted" r={3.5} />)}
        {s.showC && s.C && <Seg a={s.C} b={[s.C[0], 0]} role="aux" dashed />}
        <Pt x={A[0]} y={A[1]} role="fg" /><Pt x={B[0]} y={B[1]} role="fg" />
        {s.C && <Pt x={s.C[0]} y={s.C[1]} role="tan" r={5} />}
        <PLabel x={A[0]} y={A[1]} dx={-8} dy={-12} anchor="r" tex="(1, 1)" small />
        <PLabel x={B[0]} y={B[1]} dx={-10} dy={-4} anchor="r" tex="(3, 9)" small />
        <PLabel x={1.55} y={4.6} anchor="r" tex={t`\text{${tr('Sekante', 'secant')}: } m = 4`} role="sec" small />
        {s.C && <PLabel x={s.C[0]} y={s.C[1]} dx={10} dy={12} anchor="l" tex="(2, 4)" role="tan" small />}
        {s.C && <PLabel x={2.25} y={2.1} anchor="l" tex={t`\text{${tr('Tangente', 'tangent')}: } m = 4`} role="tan" small />}
        {s.showC && <PLabel x={2} y={0} dx={12} dy={-10} anchor="l" tex="c = 2" role="pt" small />}
      </Plot>
      <div className="w5-read">
        <M>{t`m_{\text{${tr('Sekante', 'secant')}}} = \frac{9 - 1}{3 - 1} = 4`}</M>
        {s.showC && <M>{t`f'(c) = 2c = 4 \;\Rightarrow\; c = 2`}</M>}
      </div>
    </div>
  );
}

/* =============================================================== 6 · Mittelwertsatz explorer (drag a and b) */

type MvtKey = 'sq' | 'cubic' | 'rolle' | 'abs';
const MVT_PRESETS: Record<MvtKey, { fun: Fun; win: Win; a: number; b: number; tick: [number, number]; tex: string; de: string; en: string }> = {
  sq: { fun: FUNS.sq, win: { x: [-0.6, 3.8], y: [-1.2, 12] }, a: 1, b: 3, tick: [1, 2], tex: 'x^2', de: 'Übung', en: 'class' },
  cubic: { fun: FUNS.cubic, win: { x: [-2.5, 2.5], y: [-3.6, 3.6] }, a: -2, b: 2, tick: [1, 1], tex: 'x^3 - 3x', de: 'zwei Stellen', en: 'two points' },
  rolle: { fun: FUNS.cubic, win: { x: [-2.5, 2.5], y: [-3.6, 3.6] }, a: -Math.sqrt(3), b: Math.sqrt(3), tick: [1, 1], tex: 'x^3 - 3x', de: 'Rolle', en: 'Rolle' },
  abs: { fun: FUNS.abs, win: { x: [-2, 2], y: [-0.7, 2.3] }, a: -1, b: 1, tick: [1, 1], tex: '|x|', de: 'Knick', en: 'kink' },
};

export function MvtExplorer() {
  const tr = useTr(), lang = useLang();
  const [key, setKey] = useState<MvtKey>('sq');
  const [ab, setAb] = useState<[number, number]>([1, 3]);
  const [drag, setDrag] = useState<0 | 1 | null>(null);
  const P = MVT_PRESETS[key];
  const { f, fp } = P.fun;
  const [a, b] = ab;
  const m = secantSlope(f, a, b);
  const cs = mvtPoints(fp, a, b, m);
  const kink = key === 'abs' && a < 0 && b > 0;
  const level = Math.abs(f(a) - f(b)) < 1e-6;
  const choose = (k: MvtKey) => { setKey(k); setAb([MVT_PRESETS[k].a, MVT_PRESETS[k].b]); };
  const onDrag = (x: number, _y: number, phase: 'down' | 'move' | 'up') => {
    if (phase === 'up') { setDrag(null); return; }
    let which = drag;
    if (phase === 'down') { which = Math.abs(x - a) <= Math.abs(x - b) ? 0 : 1; setDrag(which); }
    if (which === null) return;
    const lo = P.win.x[0] + 0.15, hi = P.win.x[1] - 0.15;
    let v = Math.round(Math.max(lo, Math.min(hi, x)) * 20) / 20;
    // snap to the preset's special ends (±√3 for Rolle)
    for (const s of [MVT_PRESETS.rolle.a, MVT_PRESETS.rolle.b]) if (key !== 'sq' && Math.abs(v - s) < 0.04) v = s;
    setAb(which === 0 ? [Math.min(v, b - 0.25), b] : [a, Math.max(v, a + 0.25)]);
  };
  const list = cs === 'all' ? [] : cs;
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {(Object.keys(MVT_PRESETS) as MvtKey[]).map((k) => (
          <button key={k} type="button" aria-pressed={key === k} onClick={() => choose(k)}>
            <M>{MVT_PRESETS[k].tex}</M> <span className="w5-btn-sub">{tr(MVT_PRESETS[k].de, MVT_PRESETS[k].en)}</span>
          </button>
        ))}
      </div>
      <div className="vdemo-fig wide">
        <Plot x={P.win.x} y={P.win.y} grid={[1, 1]} tick={P.tick} onDrag={onDrag}
          label={tr('Graph mit Sekante von a nach b und den Tangenten, die parallel zur Sekante sind; a und b ziehbar', 'Graph with the secant from a to b and the tangents parallel to it; a and b draggable')}>
          <Band from={a} to={b} vertical />
          <Curve f={f} n={key === 'abs' ? 2 : 600} breaks={key === 'abs' ? [0] : undefined} />
          {key === 'abs' && <Seg a={[-0.0001, 0]} b={[0.0001, 0]} role="f" />}
          <Line p={[a, f(a)]} m={m} role="sec" dashed />
          {list.map((c, i) => <Line key={i} p={[c, f(c)]} m={fp(c)} role="tan" />)}
          {[a, b].map((x, i) => <Seg key={i} a={[x, 0]} b={[x, f(x)]} role="aux" dashed />)}
          {list.map((c, i) => <Pt key={i} x={c} y={f(c)} role="tan" r={5} />)}
          <Pt x={a} y={f(a)} r={6} /><Pt x={b} y={f(b)} r={6} />
          <PLabel x={a} y={f(a)} dx={-10} dy={-12} anchor="r" tex="a" role="pt" />
          <PLabel x={b} y={f(b)} dx={10} dy={-12} anchor="l" tex="b" role="pt" />
          {list.map((c, i) => <PLabel key={i} x={c} y={f(c)} dx={c < (a + b) / 2 ? -10 : 10} dy={14} anchor={c < (a + b) / 2 ? 'r' : 'l'} tex={list.length > 1 ? `c_${i + 1}` : 'c'} role="tan" />)}
          {key === 'abs' && kink && <PLabel x={0} y={0} dx={8} dy={14} anchor="l" tex={t`\text{${tr('Knick', 'kink')}}`} role="pt" small />}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="v-result"><M>{`f(x) = ${P.tex}`}</M></div>
        <div className="v-result"><M>{t`m = \frac{f(b) - f(a)}{b - a} = ${n(m, 2, lang)}`}</M></div>
        <div className={`v-result${list.length || cs === 'all' ? ' pos' : ' neg'}`}>
          {cs === 'all' ? <span>{tr('Gerades Stück: jedes ', 'Straight piece: every ')}<M>c</M>{tr(' passt.', ' works.')}</span>
            : list.length ? <M>{list.map((c, i) => `${list.length > 1 ? `c_${i + 1}` : 'c'} = ${n(c, 2, lang)}`).join(t`,\quad `)}</M>
            : <span>{tr('Kein ', 'No ')}<M>c</M>{tr(' mit ', ' with ')}<M p=".">{t`f'(c) = m`}</M></span>}
        </div>
        <p className="vdemo-note">{kink
          ? <>{tr('Gleiche Höhe, aber keine waagerechte Tangente: ', 'Equal heights, but no horizontal tangent: ')}<M>{t`|x|`}</M>{tr(' ist bei ', ' is not differentiable at ')}<M>0</M>{tr(' nicht differenzierbar. Der Satz verlangt das.', '. The theorem requires that.')}</>
          : level ? <>{tr('Gleiche Höhe: ', 'Equal heights: ')}<M p=",">{t`f(a) = f(b)`}</M>{tr(' also ', ' so ')}<M>{t`m = 0`}</M>{tr(' – waagerechte Tangenten (Rolle).', ' – horizontal tangents (Rolle).')}</>
          : <>{tr('Ziehe die roten Punkte ', 'Drag the red points ')}<M>a</M>{tr(' und ', ' and ')}<M p=".">b</M>{tr(' Magenta: die Tangenten mit derselben Steigung wie die Sekante.', ' Magenta: the tangents with the same slope as the secant.')}</>}</p>
      </figcaption>
    </figure>
  );
}

/* =============================================================== 7 · Extremum, Krümmung: f, sign of f′ and f″ */

type CurvKey = 'x3' | 'x4' | 'x3x' | 'x4x2';
const CURV: Record<CurvKey, { fun: Fun; win: Win; tex: string; tick: [number, number] }> = {
  x3: { fun: FUNS.x3, win: { x: [-1.6, 1.6], y: [-2, 2] }, tex: 'x^3', tick: [1, 1] },
  x4: { fun: FUNS.x4, win: { x: [-1.6, 1.6], y: [-1, 2.4] }, tex: 'x^4', tick: [1, 1] },
  x3x: { fun: FUNS.x3x, win: { x: [-1.4, 1.4], y: [-2.6, 2.6] }, tex: 'x^3 + x', tick: [1, 1] },
  x4x2: { fun: FUNS.x4x2, win: { x: [-1.4, 1.4], y: [-0.5, 1.1] }, tex: 'x^4 - x^2', tick: [0.5, 0.5] },
};
const VERDICT: Record<ReturnType<typeof classify>, [string, string]> = {
  min: ['lokales Minimum', 'local minimum'], max: ['lokales Maximum', 'local maximum'],
  saddle: ['Sattelpunkt', 'saddle point'], inflection: ['Wendepunkt', 'inflection point'], none: ['nichts Besonderes', 'nothing special'],
};

function SignBar({ g, x, label, x0 }: { g: (v: number) => number; x: Range; label: string; x0: number }) {
  const fr = makeFrame(x, [0, 1], 400, 300);
  const iv = signIntervals(g, x[0], x[1]);
  const VB = [0, 0, 400, 26] as [number, number, number, number];
  return (
    <div className="w5-bar">
      <svg viewBox={VB.join(' ')} aria-hidden="true">
        {iv.map((s, i) => <rect key={i} x={fr.sx(s.from)} width={fr.sx(s.to) - fr.sx(s.from)} y={4} height={18} className={s.s > 0 ? 'w5-plus' : s.s < 0 ? 'w5-minus' : 'w5-zero'} />)}
        {iv.slice(1).map((s, i) => <line key={i} x1={fr.sx(s.from)} x2={fr.sx(s.from)} y1={1} y2={25} className="w5-cut" />)}
        <line x1={fr.sx(x0)} x2={fr.sx(x0)} y1={0} y2={26} className="w5-x0" />
      </svg>
      {iv.map((s, i) => (fr.sx(s.to) - fr.sx(s.from) > 34) && <div key={i} className="vdemo-label small w5-sign" style={at(VB, fr.sx(s.from) + 0.3 * (fr.sx(s.to) - fr.sx(s.from)), 13)}><M>{s.s > 0 ? '+' : s.s < 0 ? '-' : '0'}</M></div>)}
      <div className="w5-bar-name"><M>{label}</M></div>
    </div>
  );
}

export function CurvatureExplorer() {
  const tr = useTr(), lang = useLang();
  const [key, setKey] = useState<CurvKey>('x3');
  const [x0, setX0] = useState(0);
  const P = CURV[key], { f, fp, fpp } = P.fun;
  const curv = signIntervals(fpp, P.win.x[0], P.win.x[1]);
  const snaps = [0, ...signIntervals(fp, P.win.x[0], P.win.x[1]).slice(1).map((s) => s.from), ...curv.slice(1).map((s) => s.from)];
  const setX = (x: number) => {
    let v = Math.max(P.win.x[0] + 0.05, Math.min(P.win.x[1] - 0.05, x));
    for (const s of snaps) if (Math.abs(v - s) < 0.05) v = s;
    setX0(v);
  };
  const verdict = classify(P.fun, x0);
  const k2 = fpp(x0);
  const sx = P.win.x[1] - P.win.x[0];
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {(Object.keys(CURV) as CurvKey[]).map((k) => <button key={k} type="button" aria-pressed={key === k} onClick={() => { setKey(k); setX0(0); }}><M>{CURV[k].tex}</M></button>)}
      </div>
      <div className="vdemo-fig wide">
        <Plot x={P.win.x} y={P.win.y} grid={P.tick} tick={P.tick} onDrag={(x, _y, ph) => { if (ph !== 'up') setX(x); }}
          label={tr('Graph, blau wo f zweistrich positiv (konvex), magenta wo negativ (konkav); Punkt x0 ziehbar', 'Graph, blue where f double prime is positive (convex), magenta where negative (concave); point x0 draggable')}>
          {curv.map((s, i) => <Curve key={i} f={f} dom={[s.from, s.to]} role={s.s < 0 ? 'g' : 'f'} />)}
          <Line p={[x0, f(x0)]} m={fp(x0)} role="aux" dashed />
          <Pt x={x0} y={f(x0)} r={6} />
          <PLabel x={x0} y={f(x0)} dx={10} dy={-14} anchor="l" tex="x_0" role="pt" />
          <PLabel x={P.win.x[0] + 0.03 * sx} y={P.win.y[1]} dy={14} anchor="l" tex={`f(x) = ${P.tex}`} role="fg" small />
        </Plot>
        <SignBar g={fp} x={P.win.x} label="f'" x0={x0} />
        <SignBar g={fpp} x={P.win.x} label="f''" x0={x0} />
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider"><span><M>{t`x_0`}</M></span>
          <input type="range" min={P.win.x[0] + 0.05} max={P.win.x[1] - 0.05} step={0.01} value={x0} onChange={(e) => setX(Number(e.target.value))} aria-label="x0" /><span className="val">{fmtNum(x0, 2, lang)}</span></label>
        <div className="v-result"><M>{t`f'(x_0) = ${n(fp(x0), 2, lang)},\qquad f''(x_0) = ${n(k2, 2, lang)}`}</M></div>
        <div className="v-result pos"><M>{t`\text{${tr('bei', 'at')} } x_0 = ${n(x0, 2, lang)}\text{: ${tr(...VERDICT[verdict])}}`}</M></div>
        <p className="vdemo-note"><span className="w5-key w5-plus" /> <M>{t`f'' > 0`}</M>{tr(' konvex (Linkskurve)', ' convex (left turn)')} · <span className="w5-key w5-minus" /> <M>{t`f'' < 0`}</M>{tr(' konkav (Rechtskurve)', ' concave (right turn)')}</p>
      </figcaption>
    </figure>
  );
}

/* =============================================================== 8 · Extremalstellen auf [a, b] (step animations) */

const roleOf = (r: CandFrame['cands'][number]['role']) => r;
function CandPlot({ s, fun, dom, labels, band = true }: { s: CandFrame; fun: Fun; dom: Range; band?: boolean; labels: (c: CandFrame['cands'][number]) => { tex: string; dx: number; dy: number; anchor: 'l' | 'r' | 'c' } | null }) {
  const tr = useTr();
  return (
    <Plot x={s.win.x} y={s.win.y} grid={s.tick} tick={s.tick} label={tr('Graph auf dem Intervall mit den Kandidaten', 'Graph on the interval with the candidates')}>
      {band && <Band from={dom[0]} to={dom[1]} vertical />}
      <Curve f={fun.f} role="ref" dashed />
      <Curve f={fun.f} dom={dom} />
      {s.showMaxMin && <HLine y={s.max} role="f" />}
      {s.showMaxMin && <HLine y={s.min} role="g" />}
      {s.cands.filter((c) => c.shown).map((c, i) => <Pt key={i} x={c.x} y={c.y} role={roleOf(c.role)} open={!c.inside} r={5.5} />)}
      {s.cands.filter((c) => c.shown).map((c, i) => { const l = labels(c); return l && <PLabel key={i} x={c.x} y={c.y} dx={l.dx} dy={l.dy} anchor={l.anchor} tex={l.tex} role={c.inside ? roleOf(c.role) === 'muted' ? 'fg' : roleOf(c.role) : 'muted'} small />; })}
    </Plot>
  );
}

export function Ex1Figure({ step }: { step: number; t: number }) {
  const tr = useTr();
  const s = ex1Scene(step);
  const lab = (c: CandFrame['cands'][number]) => {
    if (!c.inside) return { tex: t`-\tfrac{1}{\sqrt3} \notin D_f`, dx: -2, dy: -20, anchor: 'r' as const };
    if (c.x === -0.5) return { tex: (step >= 3 ? t`\max = ` : '') + t`\tfrac38`, dx: 6, dy: -20, anchor: 'l' as const };
    if (c.x === 1) return { tex: t`f(1) = 0`, dx: -8, dy: -14, anchor: 'r' as const };
    return { tex: (step >= 3 ? t`\min = ` : '') + t`-\tfrac{2}{3\sqrt3}`, dx: 0, dy: 20, anchor: 'c' as const };
  };
  return (
    <div className="w5-anim">
      <CandPlot s={s} fun={FUNS.x3mx} dom={[-0.5, 1]} labels={lab} />
      <div className="w5-read">
        <M>{t`f(x) = x^3 - x,\quad D_f = [-\tfrac12, 1]`}</M>
        {step >= 2 && <M>{t`f'(x) = 3x^2 - 1 = 0 \Rightarrow x = \pm\tfrac{1}{\sqrt3}`}</M>}
        {step < 2 && <span className="w5-muted">{tr('Graph nur auf dem Band erlaubt', 'graph allowed on the band only')}</span>}
      </div>
    </div>
  );
}

export function Ex2Figure({ step, t: tt }: { step: number; t: number }) {
  const tr = useTr();
  const s = ex2Scene(step, tt);
  const zoomed = step === 2 && tt > 0.5;
  const lab = (c: CandFrame['cands'][number]) => {
    if (Math.abs(c.x) === 2) return zoomed ? null : { tex: '12', dx: c.x < 0 ? 10 : -10, dy: 16, anchor: c.x < 0 ? 'l' as const : 'r' as const };
    if (c.x === 0) return step >= 2 && zoomed ? { tex: t`\text{${tr('lokales Maximum', 'local maximum')}}`, dx: 0, dy: -18, anchor: 'c' as const } : null;
    return zoomed ? { tex: t`-\tfrac14`, dx: 0, dy: 18, anchor: 'c' as const } : null;
  };
  const cols = ['-2', t`-\tfrac{1}{\sqrt2}`, '0', t`\tfrac{1}{\sqrt2}`, '2'], vals = ['12', t`-\tfrac14`, '0', t`-\tfrac14`, '12'];
  const k = s.tableCols;
  const row = (arr: string[]) => arr.map((v, i) => (i < k ? v : t`\phantom{-\tfrac14}`)).join(' & ');
  return (
    <div className="w5-anim">
      <CandPlot s={s} fun={FUNS.x4x2} dom={[-2, 2]} labels={lab} band={false} />
      {!zoomed && s.showMaxMin && <div className="w5-read"><M>{t`\color{#3b82f6}\max(g) = 12 \text{ ${tr('bei', 'at')} } x = \pm 2`}</M></div>}
      <div className="w5-read"><M>{t`\begin{array}{c|ccccc} x & ${row(cols)} \\ \hline g(x) & ${row(vals)} \end{array}`}</M></div>
      {s.showMaxMin && <div className="w5-read"><M>{t`\color{#ec4899}\min(g) = -\tfrac14 \text{ ${tr('bei', 'at')} } x = \pm\tfrac{1}{\sqrt2}`}</M></div>}
    </div>
  );
}

/* =============================================================== 9 · L'Hôpital example: who wins? */

export function LhPlot() {
  const tr = useTr(), lang = useLang();
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <Plot x={[0, 3]} y={[-2.5, 10]} grid={[0.5, 1]} tick={[1, 2]} label={tr('ln x wächst langsam, e hoch 2x sehr schnell', 'ln x grows slowly, e to the 2x very fast')}>
          <Curve f={Math.log} dom={[0.01, 3]} />
          <Curve f={(x) => Math.exp(2 * x)} role="g" />
          <PLabel x={2.55} y={Math.log(2.55)} dy={-14} tex={t`\ln x`} role="f" />
          <PLabel x={1.1} y={Math.exp(2.2)} dx={-8} anchor="r" tex={t`e^{2x}`} role="g" />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="v-result"><M>{t`\frac{\ln 3}{e^{6}} \approx ${n(lhQuotient(3), 4, lang)},\qquad \frac{\ln 10}{e^{20}} \approx ${n(lhQuotient(10) * 1e9, 1, lang)}\cdot 10^{-9}`}</M></div>
      </figcaption>
    </figure>
  );
}

/* =============================================================== 10 · Zahlenmengen (static) */

export function NumberSets() {
  const tr = useTr();
  const VB = [0, 0, 400, 236] as [number, number, number, number];
  const R = [
    { k: 'C', x: 4, y: 4, w: 392, h: 228, tex: t`\mathbb C`, ex: t`i,\ 3 + 4i`, ex0: [346, 120] },
    { k: 'R', x: 16, y: 32, w: 290, h: 190, tex: t`\mathbb R`, ex: t`\sqrt2,\ \pi`, ex0: [270, 126] },
    { k: 'Q', x: 28, y: 60, w: 206, h: 152, tex: t`\mathbb Q`, ex: t`\tfrac12,\ -0{,}75`, ex0: [196, 136] },
    { k: 'Z', x: 40, y: 88, w: 116, h: 114, tex: t`\mathbb Z`, ex: t`-3`, ex0: [138, 146] },
    { k: 'N', x: 52, y: 116, w: 66, h: 76, tex: t`\mathbb N`, ex: t`0, 1, 2`, ex0: [85, 160] },
  ];
  return (
    <figure className="vdemo">
      <div className="vdemo-fig w5-sets">
        <svg viewBox={VB.join(' ')} className="w5-static" aria-label={tr('Verschachtelte Zahlenmengen N, Z, Q, R, C mit Beispielen', 'Nested number sets N, Z, Q, R, C with examples')}>
          {R.map((r) => <rect key={r.k} x={r.x} y={r.y} width={r.w} height={r.h} rx={12} className={`w5-set w5-set-${r.k}`} />)}
        </svg>
        {R.map((r) => <div key={r.k} className="vdemo-label w5-set-name" style={at(VB, r.x + 14, r.y + 14)}><M>{r.tex}</M></div>)}
        {R.map((r) => <div key={r.k + 'e'} className="vdemo-label small muted" style={at(VB, r.ex0[0], r.ex0[1])}><M>{r.ex}</M></div>)}
      </div>
    </figure>
  );
}

/* =============================================================== 11 · the complex plane: z, z̄, z₁ ± z₂ (drag) */

/** a + bi as TeX with tidy signs (1i → i, 0 parts dropped); numbers rounded to halves. */
export function cTex(z: C, lang: Lang): string {
  const num = (v: number) => nn(v, lang, 1);
  const re = Math.abs(z.re) < 1e-9 ? 0 : z.re, im = Math.abs(z.im) < 1e-9 ? 0 : z.im;
  const imPart = (v: number) => (Math.abs(v) === 1 ? 'i' : `${num(Math.abs(v))}i`);
  if (im === 0) return num(re);
  if (re === 0) return (im < 0 ? '-' : '') + imPart(im);
  return `${num(re)} ${im < 0 ? '-' : '+'} ${imPart(im)}`;
}
const par = (v: number, lang: Lang) => (v < 0 ? `(${nn(v, lang, 1)})` : nn(v, lang, 1));

type CMode = 'conj' | 'add' | 'sub';
const CWIN: Win = { x: [-4.5, 5.5], y: [-5, 5] };
export function ComplexExplorer() {
  const tr = useTr(), lang = useLang();
  const [mode, setMode] = useState<CMode>('conj');
  const [z1, setZ1] = useState<C>(cx(3, 4));
  const [z2, setZ2] = useState<C>(cx(1, 2));
  const [drag, setDrag] = useState<1 | 2 | null>(null);
  const choose = (m: CMode) => { setMode(m); if (m === 'conj') setZ1(cx(3, 4)); else { setZ1(cx(3, 1)); setZ2(cx(1, 2)); } };
  const onDrag = (x: number, y: number, phase: 'down' | 'move' | 'up') => {
    if (phase === 'up') { setDrag(null); return; }
    let w = drag;
    if (phase === 'down') {
      const d1 = Math.hypot(x - z1.re, y - z1.im), d2 = Math.hypot(x - z2.re, y - z2.im);
      w = mode === 'conj' || d1 <= d2 ? 1 : 2;
      setDrag(w);
    }
    const p = cx(snapHalf(x, 4.5), Math.max(-4.5, Math.min(4.5, Math.round(2 * y) / 2)));
    const q = cx(Math.max(-4, Math.min(5, p.re)), p.im);
    if (w === 1) setZ1(q); else if (w === 2) setZ2(q);
  };
  const P = (z: C): P2 => [z.re, z.im];
  const res = mode === 'add' ? cadd(z1, z2) : csub(z1, z2);
  const zb = conj(z1), mz2 = cx(-z2.re, -z2.im);
  const lab = (z: C, tex: string, role: 'f' | 'g' | 'sec' | 'muted') => {
    const l = Math.hypot(z.re, z.im);
    if (l < 1e-9) { const q = tipLabel(P(z), CWIN); return <PLabel x={q[0]} y={q[1]} tex={tex} role={role} small />; }
    const ux = z.re / l, uy = z.im / l;
    const anchor = ux > 0.35 ? 'l' : ux < -0.35 ? 'r' : uy > 0 ? 'b' : 't';
    return <PLabel x={z.re} y={z.im} dx={12 * ux} dy={-12 * uy} anchor={anchor} tex={tex} role={role} small />;
  };
  const mid = (z: C) => { const l = Math.hypot(z.re, z.im) || 1; return [z.re / 2 - (0.55 * z.im) / l, z.im / 2 + (0.55 * z.re) / l] as P2; };
  const slideVals = mode === 'conj' ? z1.re === 3 && z1.im === 4 : z1.re === 3 && z1.im === 1 && z2.re === 1 && z2.im === 2;
  return (
    <figure className="vdemo">
      <div className="v-presets">
        <button type="button" aria-pressed={mode === 'conj'} onClick={() => choose('conj')}><M>{t`z,\ \bar z`}</M></button>
        <button type="button" aria-pressed={mode === 'add'} onClick={() => choose('add')}><M>{t`z_1 + z_2`}</M></button>
        <button type="button" aria-pressed={mode === 'sub'} onClick={() => choose('sub')}><M>{t`z_1 - z_2`}</M></button>
      </div>
      <div className="vdemo-fig w5-cplane">
        <Plot x={CWIN.x} y={CWIN.y} w={400} h={400} grid={[1, 1]} tick={[1, 1]} axes={[t`\mathrm{Re}`, t`\mathrm{Im}`]} onDrag={onDrag}
          label={tr('Komplexe Ebene mit ziehbaren Punkten', 'Complex plane with draggable points')}>
          {mode === 'conj' && <>
            <Seg a={P(z1)} b={[z1.re, 0]} role="f" dashed /><Seg a={P(z1)} b={[0, z1.im]} role="f" dashed />
            <Seg a={P(zb)} b={[zb.re, 0]} role="g" dashed /><Seg a={P(zb)} b={[0, zb.im]} role="g" dashed />
            <PArrow a={[0, 0]} b={P(z1)} role="f" /><PArrow a={[0, 0]} b={P(zb)} role="g" />
            <Pt x={z1.re} y={z1.im} role="f" r={6} /><Pt x={zb.re} y={zb.im} role="g" r={5} />
            {lab(z1, `z = ${cTex(z1, lang)}`, 'f')}
            {lab(zb, t`\bar z = ${cTex(zb, lang)}`, 'g')}
            {cabs(z1) > 1.5 && <PLabel x={mid(z1)[0]} y={mid(z1)[1]} tex={t`|z| = ${n(cabs(z1), Number.isInteger(cabs(z1)) ? 0 : 2, lang)}`} role="f" small />}
          </>}
          {mode !== 'conj' && <>
            {mode === 'add' && <><Seg a={P(z1)} b={P(res)} role="sec" dashed /><Seg a={P(z2)} b={P(res)} role="f" dashed /></>}
            {mode === 'sub' && <><PArrow a={[0, 0]} b={P(mz2)} role="aux" /><Seg a={P(z1)} b={P(res)} role="aux" dashed /><Seg a={P(z2)} b={P(z1)} role="g" dashed /></>}
            <PArrow a={[0, 0]} b={P(z1)} role="f" /><PArrow a={[0, 0]} b={P(z2)} role="sec" /><PArrow a={[0, 0]} b={P(res)} role="g" />
            <Pt x={z1.re} y={z1.im} role="f" r={6} /><Pt x={z2.re} y={z2.im} role="sec" r={6} />
            {lab(z1, t`z_1`, 'f')}{lab(z2, t`z_2`, 'sec')}
            {lab(res, mode === 'add' ? t`z_1 + z_2` : t`z_1 - z_2`, 'g')}
            {mode === 'sub' && lab(mz2, t`-z_2`, 'muted')}
          </>}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        {mode === 'conj' ? <>
          <div className="v-result"><M>{t`\mathrm{Re}(z) = ${nn(z1.re, lang, 1)},\quad \mathrm{Im}(z) = ${nn(z1.im, lang, 1)}`}</M></div>
          <div className="v-result pos"><M>{t`|z| = \sqrt{${par(z1.re, lang)}^2 + ${par(z1.im, lang)}^2} = ${n(cabs(z1), Number.isInteger(cabs(z1)) ? 0 : 2, lang)}`}</M></div>
          <p className="vdemo-note">{tr('Ziehe ', 'Drag ')}<M p=".">z</M> <M>{t`\bar z`}</M>{tr(' ist das Spiegelbild an der reellen Achse.', ' is its mirror image in the real axis.')}</p>
        </> : <>
          <div className="v-result pos"><M>{t`z_1 ${mode === 'add' ? '+' : '-'} z_2 = (${nn(z1.re, lang, 1)} ${mode === 'add' ? '+' : '-'} ${par(z2.re, lang)}) + (${nn(z1.im, lang, 1)} ${mode === 'add' ? '+' : '-'} ${par(z2.im, lang)})i = ${cTex(res, lang)}`}</M></div>
          <p className="vdemo-note">{mode === 'add'
            ? <>{tr('Pfeile aneinanderhängen: ', 'Put the arrows head to tail: ')}<M>{t`z_2`}</M>{tr(' an die Spitze von ', ' at the tip of ')}<M p=".">{t`z_1`}</M>{tr(' Die Summe ist die Diagonale des Parallelogramms.', ' The sum is the diagonal of the parallelogram.')}</>
            : <><M>{t`z_1 - z_2 = z_1 + (-z_2)`}</M>{tr(' – und gleich dem Pfeil von der Spitze von ', ' – and equal to the arrow from the tip of ')}<M>{t`z_2`}</M>{tr(' zur Spitze von ', ' to the tip of ')}<M>{t`z_1`}</M>{tr(' (gestrichelt).', ' (dashed).')}</>}</p>
        </>}
        <div className="v-presets"><button type="button" aria-pressed={slideVals} onClick={() => choose(mode)}>{tr('Werte der Übung', 'Values from the class')}</button></div>
      </figcaption>
    </figure>
  );
}

/* =============================================================== 12 · multiplying: every term with every term */

export function MulGrid({ step, t: tt }: { step: number; t: number }) {
  const tr = useTr();
  const sub = step >= 1, coll = step >= 2;
  const fade = (k: number) => ({ opacity: step > k ? 1 : step === k ? Math.min(1, 0.25 + tt) : 0 });
  const cell = (re: boolean, tex: string, alt?: string) => (
    <td className={coll ? (re ? 'w5-re' : 'w5-im') : ''}><M>{sub && alt ? alt : tex}</M></td>
  );
  const grid = (h: [string, string, string, string], c: [string, string, string, string], alt: string) => (
    <table className="w5-grid">
      <thead><tr><th><M>\cdot</M></th><th><M>{h[2]}</M></th><th><M>{h[3]}</M></th></tr></thead>
      <tbody>
        <tr><th><M>{h[0]}</M></th>{cell(true, c[0])}{cell(false, c[1])}</tr>
        <tr><th><M>{h[1]}</M></th>{cell(false, c[2])}<td className={`${coll ? 'w5-re' : ''}${step === 1 ? ' w5-flash' : ''}`}><M>{sub ? alt : c[3]}</M></td></tr>
      </tbody>
    </table>
  );
  return (
    <div className="w5-anim w5-mul" aria-label={tr('Rechteck-Schema fürs Ausmultiplizieren', 'Grid for multiplying out')}>
      <div className="w5-grids">
        {grid(['a', 'bi', 'c', 'di'], ['ac', 'adi', 'bci', 'bd\\,i^2'], '-bd')}
        {grid(['3', 'i', '1', '2i'], ['3', '6i', 'i', '2i^2'], '-2')}
      </div>
      <div className="w5-read" style={fade(2)}>
        <M>{t`(a + bi)(c + di) = {\color{#3b82f6}(ac - bd)} + {\color{#ec4899}(ad + bc)}\,i`}</M>
        <M>{t`(3 + i)(1 + 2i) = {\color{#3b82f6}(3 - 2)} + {\color{#ec4899}(6 + 1)}\,i = 1 + 7i`}</M>
      </div>
    </div>
  );
}

/* =============================================================== 13 · dividing: expand with the conjugate */

const DIV_LINES = [
  t`\frac{3 + i}{1 + 2i} = \frac{(3 + i)\,{\color{#ec4899}(1 - 2i)}}{(1 + 2i)\,{\color{#ec4899}(1 - 2i)}}`,
  t`= \frac{3 - 6i + i - 2i^2}{1 - 4i^2}`,
  t`= \frac{3 - 5i + 2}{1 + 4} = \frac{5 - 5i}{5}`,
  t`= 1 - i`,
];
const DIV_CHECK = t`\begin{aligned} \text{Check: } &(1 - i)(1 + 2i) \\ &= 1 + 2i - i - 2i^2 = 3 + i\ \checkmark \end{aligned}`;
export function DivSteps({ step, t: tt }: { step: number; t: number }) {
  return (
    <div className="w5-anim w5-div">
      {DIV_LINES.map((l, i) => (
        <div key={i} className={`w5-line${i === step ? ' now' : ''}`} style={{ opacity: i < step ? 0.75 : i === step ? Math.min(1, 0.2 + 1.2 * tt) : 0 }}>
          <MD>{l}</MD>
          {i === DIV_LINES.length - 1 && <MD>{DIV_CHECK}</MD>}
        </div>
      ))}
    </div>
  );
}
