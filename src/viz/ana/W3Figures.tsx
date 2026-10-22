import { useEffect, useRef, useState, type ReactNode } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, tupleSep, useLang, useTr } from '../../i18n';
import { Band, Curve, HLine, Line, PArrow, PLabel, Path, Plot, Pt, Seg, VLine, usePlot } from '../plot/Plot';
import { useReducedMotion } from '../figUtils';
import { StepPlayer, type AnimStep } from '../anim/StepPlayer';
import {
  P_ROOTS, asym, hits, holeF, jumpH, movePoint, p, pOfRecip, poleG, recipP, transform, zwsF, type Poly, type Tr,
} from '../../analysis/week3';
import {
  BISECT_SHOWN, HLINE, HWIN, MIRROR, P_MAX, bisectFrame, divLayout, divResultTex, mirrorFrame, polyTex, recipFrame, texNum,
  trTex, type HId, type MirrorId, type P2, type Range,
} from './w3scenes';

const t = String.raw;
type Lang = 'de' | 'en';
const num = (v: number, lang: Lang, d = 2) => fmtNum(v, d, lang, true);

/** A thick translucent segment on an axis (domain / target set). Local: the shared Seg has no opacity. */
function AxisSet({ a, b, role, w = 7, opacity = 0.5 }: { a: P2; b: P2; role: 'f' | 'g' | 'sec'; w?: number; opacity?: number }) {
  const fr = usePlot();
  return <line className={`pl-line pl-${role}`} style={{ strokeWidth: w, opacity, strokeLinecap: 'butt' }}
    x1={fr.sx(a[0])} y1={fr.sy(a[1])} x2={fr.sx(b[0])} y2={fr.sy(b[1])} />;
}

function Slider({ label, value, min, max, step, onChange, shown, aria }: { label: ReactNode; value: number; min: number; max: number; step: number; onChange: (v: number) => void; shown: string; aria: string }) {
  return (
    <label className="slider wide-slider"><span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={aria} />
      <span className="val">{shown}</span></label>
  );
}

/** Animate a number from `from` to `to` (ease in-out); respects reduced motion (jumps). */
function useSweep(set: (v: number) => void) {
  const reduced = useReducedMotion();
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return (from: number, to: number, ms = 2400) => {
    cancelAnimationFrame(raf.current);
    if (reduced) { set(to); return; }
    const t0 = performance.now();
    const tick = (now: number) => {
      const s = Math.min(1, (now - t0) / ms), e = s * s * (3 - 2 * s);
      set(from + (to - from) * e);
      if (s < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
}

/* ================================================================== Stetigkeit: Grenzwerte von links und rechts */
type LId = 'cont' | 'hole' | 'pole' | 'jump';
const LIM: Record<LId, { f: (x: number) => number; a: number; x: Range; y: Range; tick: [number, number]; breaks?: number[]; name: string; tex: string }> = {
  cont: { f: (x) => x + 1, a: 1, x: [-1.5, 3.3], y: [-1, 4.6], tick: [1, 1], name: 'f', tex: 'f(x) = x + 1' },
  hole: { f: holeF, a: 1, x: [-1.5, 3.3], y: [-1, 4.6], tick: [1, 1], name: 'f', tex: 'f(x) = \\frac{x^2-1}{x-1}' },
  pole: { f: poleG, a: 0, x: [-3, 3], y: [-5, 5], tick: [1, 2], breaks: [0], name: 'g', tex: 'g(x) = \\frac{1}{x}' },
  jump: { f: jumpH, a: 4, x: [-0.6, 6.4], y: [-4.6, 1.6], tick: [2, 2], breaks: [4], name: 'h', tex: 'h(x)' },
};
/** Ü3 p. 1–2: two red points approach a from the left and from the right; compare with the value f(a). */
export function LimitExplorer() {
  const tr = useTr(), lang = useLang();
  const [id, setId] = useState<LId>('hole');
  const [h, setH] = useState(1.2);
  const sweep = useSweep(setH);
  const L = LIM[id], a = L.a, f = L.f;
  const xl = a - h, xr = a + h, yl = f(xl), yr = f(xr);
  const n = L.name;
  const fa = id === 'cont' ? 2 : id === 'jump' ? -2 : null;
  const verdict: Record<LId, [ReactNode, ReactNode]> = {
    cont: [<>Links, rechts und <M>{t`f(1)`}</M> geben dasselbe: <b>stetig</b> bei <M p=".">{t`a = 1`}</M></>, <>Left, right and <M>{t`f(1)`}</M> agree: <b>continuous</b> at <M p=".">{t`a = 1`}</M></>],
    hole: [<>Beide Seiten gehen gegen <M p=",">2</M> aber <M>{t`f(1)`}</M> gibt es nicht: <b>hebbare Lücke</b>.</>, <>Both sides tend to <M p=",">2</M> but <M>{t`f(1)`}</M> does not exist: a <b><span lang="de">hebbare Lücke</span></b> (removable gap).</>],
    pole: [<>Links geht es nach <M p=",">{t`-\infty`}</M> rechts nach <M p=":">{t`+\infty`}</M> <b>Polstelle</b>.</>, <>On the left it runs to <M p=",">{t`-\infty`}</M> on the right to <M p=":">{t`+\infty`}</M> a <b><span lang="de">Polstelle</span></b> (pole).</>],
    jump: [<>Links <M p=",">{t`\to -2 = h(4)`}</M> rechts <M p=":">0</M> <b>Sprungstelle</b>.</>, <>Left <M p=",">{t`\to -2 = h(4)`}</M> right <M p=":">0</M> a <b><span lang="de">Sprungstelle</span></b> (jump).</>],
  };
  const big = (v: number) => (Math.abs(v) > 999 ? (v > 0 ? '> 999' : '< -999') : `= ${num(v, lang)}`);
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {(['cont', 'hole', 'pole', 'jump'] as LId[]).map((k) => (
          <button key={k} type="button" aria-pressed={id === k} onClick={() => { setId(k); setH(1.2); }}>
            {k === 'cont' ? tr('stetig', 'continuous') : k === 'hole' ? tr('Loch', 'hole') : k === 'pole' ? tr('Pol', 'pole') : tr('Sprung', 'jump')}
          </button>
        ))}
      </div>
      <div className="vdemo-fig wide">
        <Plot x={L.x} y={L.y} tick={L.tick} grid={[L.tick[0] / (id === 'jump' ? 2 : 1), L.tick[1] / (id === 'pole' ? 2 : 1)]}
          label={tr('Graph mit zwei Punkten, die sich der Stelle a von links und rechts nähern', 'Graph with two points approaching a from the left and the right')}>
          <Seg a={[a, L.y[0]]} b={[a, L.y[1]]} role="aux" dashed />
          {id === 'pole' && <VLine x={0} />}
          <Curve f={f} breaks={L.breaks ?? (id === 'hole' ? [1] : undefined)} />
          {id === 'hole' && <Pt x={1} y={2} role="f" open />}
          {id === 'cont' && <Pt x={1} y={2} role="f" />}
          {id === 'jump' && <><Pt x={4} y={-2} role="f" /><Pt x={4} y={0} role="f" open /></>}
          <Seg a={[xl, 0]} b={[xl, yl]} role="pt" dashed />
          <Seg a={[xr, 0]} b={[xr, yr]} role="pt" dashed />
          <Pt x={xl} y={yl} /><Pt x={xr} y={yr} />
          <PLabel x={a} y={L.y[0]} dy={-10} dx={10} tex="a" role="muted" small anchor="l" />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="rt-readout pl-ink-f"><M>{id === 'jump' ? t`h(x) = \begin{cases} -2-\sqrt{4-x}, & x \le 4\\ 0, & x > 4 \end{cases}` : L.tex}</M></div>
        <Slider label={tr('Abstand', 'distance')} value={h} min={0.01} max={1.5} step={0.01} onChange={setH} shown={fmtNum(h, 2, lang)} aria="h" />
        <button type="button" className="motion-btn" onClick={() => sweep(1.4, 0.01)}>{tr(<>Punkte zu <M>a</M> laufen lassen</>, <>Let the points run to <M>a</M></>)}</button>
        <div className="v-result rt-readout">
          <div><M>{`${n}(a - ${num(h, lang)}) ${big(yl)}`}</M></div>
          <div><M>{fa === null ? `${n}(a)\\ ${tr('\\text{existiert nicht}', '\\text{does not exist}')}` : `${n}(a) = ${num(fa, lang)}`}</M></div>
          <div><M>{`${n}(a + ${num(h, lang)}) ${big(yr)}`}</M></div>
        </div>
        <p className="vdemo-note">{tr(...verdict[id])}</p>
      </figcaption>
    </figure>
  );
}

/** Ü3 p. 1 recap: the four kinds of intervals on a number line (filled = Rand dabei, open = Rand nicht dabei). */
export function IntervalStrip() {
  const tr = useTr();
  const rows: [string, string, boolean, boolean][] = [
    ['(a, b)', 'a < x < b', false, false], ['[a, b]', 'a \\le x \\le b', true, true],
    ['(a, b]', 'a < x \\le b', false, true], ['[a, b)', 'a \\le x < b', true, false],
  ];
  return (
    <figure className="vdemo w3-intervals" aria-label={tr('Vier Arten von Intervallen', 'Four kinds of intervals')}>
      {rows.map(([iv, cond, l, r]) => (
        <div key={iv} className="w3-iv-row">
          <span className="w3-iv-tex"><M>{iv}</M></span>
          <svg viewBox="0 0 160 24" aria-hidden="true">
            <line x1={6} x2={154} y1={12} y2={12} className="w3-iv-axis" />
            <line x1={40} x2={120} y1={12} y2={12} className="w3-iv-seg" />
            <circle cx={40} cy={12} r={5} className={`w3-iv-end${l ? '' : ' open'}`} />
            <circle cx={120} cy={12} r={5} className={`w3-iv-end${r ? '' : ' open'}`} />
          </svg>
          <span className="w3-iv-tex"><M>{cond}</M></span>
        </div>
      ))}
    </figure>
  );
}

/* ================================================================== Zwischenwertsatz */
type ZId = 'b1' | 'b2' | 'many' | 'jump';
const ZWS: Record<ZId, { f: (x: number) => number; a: number; b: number; m: number; x: Range; y: Range; tick: [number, number]; breaks?: number[]; tex: string }> = {
  b1: { f: zwsF, a: 1, b: 2, m: 0, x: [-0.3, 2.4], y: [-2.2, 6.2], tick: [1, 1], tex: 'f(x) = x^3 - x - 1' },
  b2: { f: jumpH, a: -1, b: 4, m: -Math.PI, x: [-1.8, 5.4], y: [-4.8, 1], tick: [1, 1], breaks: [4], tex: 'h(x)' },
  many: { f: p, a: -2, b: 3, m: 2, x: [-2.5, 3.4], y: [-12, 17], tick: [1, 5], tex: 'p(x)' },
  jump: { f: jumpH, a: 3, b: 5, m: -1, x: [2.2, 5.8], y: [-3.6, 1], tick: [1, 1], breaks: [4], tex: 'h(x)' },
};
/** Ü3 p. 3: the horizontal line at height m between f(a) and f(b) must be crossed — if f is continuous on [a, b]. */
export function IvtFigure() {
  const tr = useTr(), lang = useLang();
  const [id, setId] = useState<ZId>('b1');
  const Z = ZWS[id];
  const [m, setM] = useState(Z.m);
  const fa = Z.f(Z.a), fb = Z.f(Z.b), lo = Math.min(fa, fb), hi = Math.max(fa, fb);
  const cs = hits(Z.f, Z.a, Z.b, m);
  const choose = (k: ZId) => { setId(k); setM(ZWS[k].m); };
  const mTex = id === 'b2' && Math.abs(m + Math.PI) < 1e-9 ? '-\\pi' : num(m, lang);
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {(['b1', 'b2', 'many', 'jump'] as ZId[]).map((k) => (
          <button key={k} type="button" aria-pressed={id === k} onClick={() => choose(k)}>
            {k === 'b1' ? tr('Bsp. 1', 'Ex. 1') : k === 'b2' ? tr('Bsp. 2', 'Ex. 2') : k === 'many' ? tr('mehrere', 'several') : tr('mit Sprung', 'with a jump')}
          </button>
        ))}
      </div>
      <div className="vdemo-fig wide">
        <Plot x={Z.x} y={Z.y} tick={Z.tick} label={tr('Zwischenwertsatz: waagerechte Linie auf Höhe m wird geschnitten', 'Intermediate value theorem: the horizontal line at height m is crossed')}>
          <Band from={lo} to={hi} />
          <Curve f={Z.f} breaks={Z.breaks} role="ref" dashed />
          <Curve f={Z.f} dom={[Z.a, Z.b]} breaks={Z.breaks} />
          {(id === 'b2' || id === 'jump') && Z.b > 4 && <Pt x={4} y={0} role="f" open />}
          {id === 'jump' && <Pt x={4} y={-2} role="f" />}
          <AxisSet a={[Z.a, 0]} b={[Z.b, 0]} role="sec" />
          <HLine y={m} role="g" dashed={false} />
          {cs.map((c, i) => <g key={i}><Seg a={[c, 0]} b={[c, m]} role="pt" dashed /><Pt x={c} y={m} /></g>)}
          <Pt x={Z.a} y={fa} role="f" /><Pt x={Z.b} y={fb} role="f" />
          <PLabel x={Z.a} y={fa} dx={10} dy={fa < m ? 12 : -12} tex="f(a)" role="f" small anchor="l" />
          <PLabel x={Z.b} y={fb} dx={8} dy={fb < m ? 14 : -14} tex="f(b)" role="f" small anchor="l" />
          <PLabel x={Z.x[1]} y={m} dx={-6} dy={-12} tex="m" role="g" anchor="r" />
          {cs.map((c, i) => <PLabel key={`c${i}`} x={c} y={0} dx={0} dy={m >= 0 ? 16 : -14} tex={cs.length > 1 ? `c_${i + 1}` : 'c'} role="pt" small />)}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="rt-readout pl-ink-f"><M>{`${Z.tex}${tr(',\\ ', ',\\ ')}[a, b] = [${num(Z.a, lang)}${tr(';\\ ', ',\\ ')}${num(Z.b, lang)}]`}</M></div>
        <Slider label={<M>m</M>} value={m} min={lo} max={hi} step={(hi - lo) / 200} onChange={setM} shown={fmtNum(m, 2, lang)} aria="m" />
        <div className="v-result rt-readout">
          <M p=",">{`f(a) = ${num(fa, lang)}`}</M> <M>{`f(b) = ${num(fb, lang)}`}</M>
        </div>
        <div className={`v-result ${cs.length ? 'pos' : 'neg'}`}>
          {cs.length === 0
            ? tr(<>Kein <M>c</M> mit <M p="!">{`f(c) = ${mTex}`}</M> Die Linie geht durch den Sprung.</>, <>No <M>c</M> with <M p="!">{`f(c) = ${mTex}`}</M> The line passes through the jump.</>)
            : cs.length === 1
              ? <M>{`f(c) = ${mTex}\\ ${tr('\\text{bei}', '\\text{at}')}\\ c \\approx ${num(cs[0], lang)}`}</M>
              : <>{tr(`${cs.length} Treffer:`, `${cs.length} hits:`)} <M>{cs.map((c, i) => `c_${i + 1} \\approx ${num(c, lang)}`).join(tr(';\\ ', ',\\ '))}</M></>}
        </div>
      </figcaption>
    </figure>
  );
}

/** The bisection animation frame (supplement to the ZWS). */
export function BisectPlot({ step, t: tt }: { step: number; t: number }) {
  const lang = useLang(), tr = useTr();
  const F = bisectFrame(step, tt);
  const final = step > BISECT_SHOWN;
  return (
    <div className="w3-anim">
      <Plot x={F.x} y={F.y} tick={F.tick} grid={F.tick} label={tr('Halbierungsverfahren für die Nullstelle', 'Bisection for the root')}>
        <Band from={F.band[0]} to={F.band[1]} vertical />
        {F.dropped && <g opacity={F.dropped.alpha}><Band from={F.dropped.from} to={F.dropped.to} vertical role="aux" /></g>}
        <Curve f={zwsF} />
        {F.ends.map((e, i) => <Pt key={i} x={e.x} y={e.y} role="f" />)}
        {F.mid && <g opacity={F.mid.alpha}><Seg a={[F.mid.x, 0]} b={[F.mid.x, F.mid.y]} role="pt" dashed /><Pt x={F.mid.x} y={F.mid.y} /></g>}
        {F.root && <Pt x={F.root.x} y={0} role="g" r={5.5} />}
        {F.mid && F.mid.alpha > 0.5 && <PLabel x={F.mid.x} y={F.mid.y} dx={10} dy={F.mid.y > 0 ? -12 : 12} anchor="l" small role="pt"
          tex={`f(${texNum(F.mid.x, lang, 4)}) ${F.mid.sign > 0 ? '>' : '<'} 0`} />}
        {final && F.root && <PLabel x={F.root.x} y={0} dx={-8} dy={-16} anchor="r" role="g" tex={`c \\approx ${num(F.root.x, lang, 4)}`} />}
        {step === 0 && F.ends.map((e, i) => <PLabel key={`e${i}`} x={e.x} y={e.y} dx={i ? -10 : 10} dy={i ? 0 : 16} anchor={i ? 'r' : 'l'} small role="f" tex={i ? 'f(2) = 5 > 0' : 'f(1) = -1 < 0'} />)}
      </Plot>
      <div className="w3-anim-read"><M>{`[${texNum(F.readout.a, lang, final ? 6 : 4)}${lang === 'de' ? ';\\ ' : ',\\ '}${texNum(F.readout.b, lang, final ? 6 : 4)}]`}</M>
        {' '}<span className="pl-small">{tr(`nach ${F.readout.k} Halbierungen`, `after ${F.readout.k} halvings`)}</span></div>
    </div>
  );
}

/* ================================================================== Transformationen */
const C_VALUES = [-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2];
type TPre = 'id' | 'a' | 'b' | 'c' | 'd' | 'neg';
const TPRE: Record<TPre, Tr & { tex: string }> = {
  id: { a: 0, b: 0, c: 1, d: 1, tex: 'p(x)' },
  a: { a: -2, b: 0, c: 1, d: 1, tex: 'p(x+2)' },
  b: { a: 0, b: 4, c: 1, d: 1, tex: 'p(x)+4' },
  c: { a: 0, b: 0, c: 2, d: 1, tex: 'p(2x)' },
  d: { a: 0, b: 0, c: 1, d: 2, tex: '2p(x)' },
  neg: { a: 0, b: 0, c: -1, d: 1, tex: 'p(-x)' },
};
/** Ü3 p. 4: y = d · p(c(x − a)) + b with the original p dashed; the local maximum is tracked. */
export function TransformExplorer() {
  const tr = useTr(), lang = useLang();
  const [T, setT] = useState<Tr>(TPRE.a);
  const set = (k: keyof Tr) => (v: number) => setT((o) => ({ ...o, [k]: v }));
  const g = transform(p, T);
  const [mx, my] = movePoint(P_MAX, T);
  const same = (k: TPre) => (['a', 'b', 'c', 'd'] as const).every((q) => TPRE[k][q] === T[q]);
  const pt = (q: P2) => `(${num(q[0], lang)}${tupleSep(lang)}${num(q[1], lang)})`;
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {(Object.keys(TPRE) as TPre[]).map((k) => <button key={k} type="button" aria-pressed={same(k)} onClick={() => setT(TPRE[k])}><M>{TPRE[k].tex}</M></button>)}
      </div>
      <div className="vdemo-fig wide">
        <Plot x={[-4, 4]} y={[-12, 14]} tick={[1, 5]} grid={[1, 5]} label={tr('Graph von p gestrichelt, veränderter Graph magenta', 'Graph of p dashed, transformed graph magenta')}>
          <Curve f={p} role="ref" dashed />
          <Curve f={g} role="g" />
          <Pt x={P_MAX[0]} y={P_MAX[1]} role="ref" />
          <PArrow a={P_MAX} b={[mx, my]} role="aux" />
          <Pt x={mx} y={my} />
          <PLabel x={2.55} y={p(2.55)} dx={14} tex="p" role="muted" anchor="l" />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="v-result pos rt-readout"><M>{`y = ${trTex(T, lang)}`}</M></div>
        <Slider label={<M>a</M>} value={T.a} min={-3} max={3} step={0.5} onChange={set('a')} shown={fmtNum(T.a, 1, lang)} aria="a" />
        <Slider label={<M>b</M>} value={T.b} min={-6} max={6} step={1} onChange={set('b')} shown={fmtNum(T.b, 0, lang)} aria="b" />
        <Slider label={<M>c</M>} value={C_VALUES.indexOf(T.c)} min={0} max={C_VALUES.length - 1} step={1} onChange={(i) => set('c')(C_VALUES[i])} shown={fmtNum(T.c, 1, lang)} aria="c" />
        <Slider label={<M>d</M>} value={T.d} min={-2} max={2} step={0.5} onChange={set('d')} shown={fmtNum(T.d, 1, lang)} aria="d" />
        <p className="vdemo-note">{tr(
          <>Hochpunkt <M>{pt(P_MAX)}</M> wandert nach <M p=".">{pt([mx, my])}</M> Die neue Kurve erreicht den alten Wert bei <M p=".">{t`x = a + x_0/c`}</M></>,
          <>The maximum <M>{pt(P_MAX)}</M> moves to <M p=".">{pt([mx, my])}</M> The new curve reaches the old value at <M p=".">{t`x = a + x_0/c`}</M></>)}</p>
      </figcaption>
    </figure>
  );
}

/** Ü3 p. 5: Kehrwert der y-Werte 1/p(x) and Kehrwert im x einsetzen p(1/x), with one point followed. */
export function ReciprocalFigure() {
  const tr = useTr(), lang = useLang();
  const [mode, setMode] = useState<'y' | 'x'>('y');
  const [x0, setX0] = useState(1.5);
  const u = 1 / x0;
  const yWin: Range = mode === 'y' ? [-3, 3] : [-12, 12];
  return (
    <figure className="vdemo">
      <div className="v-presets">
        <button type="button" aria-pressed={mode === 'y'} onClick={() => { setMode('y'); setX0(1.5); }}><M>{t`1/p(x)`}</M></button>
        <button type="button" aria-pressed={mode === 'x'} onClick={() => { setMode('x'); setX0(-0.8); }}><M>{t`p(1/x)`}</M></button>
      </div>
      <div className="vdemo-fig wide">
        <Plot x={[-4, 4]} y={yWin} tick={mode === 'y' ? [1, 1] : [1, 5]} grid={mode === 'y' ? [1, 1] : [1, 5]}
          label={tr('Kehrwert: Graph von p gestrichelt und der neue Graph', 'Reciprocal: graph of p dashed and the new graph')}>
          <Curve f={p} role="ref" dashed />
          {mode === 'y' && P_ROOTS.map((r) => <VLine key={r} x={r} />)}
          {mode === 'y' ? <Curve f={recipP} role="g" breaks={P_ROOTS} n={1200} /> : <Curve f={pOfRecip} role="g" breaks={[0]} n={1400} />}
          {mode === 'y' ? <>
            <Seg a={[x0, p(x0)]} b={[x0, recipP(x0)]} role="aux" dashed />
            <Pt x={x0} y={p(x0)} role="ref" /><Pt x={x0} y={recipP(x0)} />
          </> : <>
            <Seg a={[u, p(u)]} b={[x0, p(u)]} role="aux" dashed />
            <Pt x={u} y={p(u)} role="ref" /><Pt x={x0} y={pOfRecip(x0)} />
          </>}
          {mode === 'y'
            ? <PLabel x={3.1} y={1.3} anchor="l" role="g" tex="1/p(x)" />
            : <PLabel x={-3.9} y={yWin[1]} dy={16} dx={4} anchor="l" role="g" tex="p(1/x)" />}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <Slider label={<M>x</M>} value={x0} min={-4} max={4} step={0.02} onChange={(v) => setX0(Math.abs(v) < 0.1 ? (v < 0 ? -0.1 : 0.1) : v)} shown={fmtNum(x0, 2, lang)} aria="x" />
        <div className="v-result pos rt-readout">
          {mode === 'y'
            ? <M>{`p(${num(x0, lang)}) = ${num(p(x0), lang)} \\ \\Rightarrow\\ \\tfrac{1}{p} = ${num(recipP(x0), lang)}`}</M>
            : <M>{`\\tfrac{1}{x} = ${num(u, lang)} \\ \\Rightarrow\\ p(${num(u, lang)}) = ${num(p(u), lang)}`}</M>}
        </div>
        <p className="vdemo-note">{mode === 'y'
          ? tr('Senkrecht: gleiche Stelle, neuer Wert. Wo p klein ist, wird der Kehrwert gross.', 'Vertical: same place, new value. Where p is small, the reciprocal is large.')
          : tr('Waagerecht: gleicher Wert, neue Stelle. Der rote Punkt holt sich den Wert von der Stelle 1/x.', 'Horizontal: same value, new place. The red point takes its value from the place 1/x.')}</p>
      </figcaption>
    </figure>
  );
}

/** Ü4 p. 1: frame of the max → min animation. */
export function RecipPlot({ step, t: tt }: { step: number; t: number }) {
  const tr = useTr(), lang = useLang();
  const F = recipFrame(step, tt);
  const curveTex = step === 0 ? 'f_5(t)' : step === 1 ? (F.label === 'min' ? '\\tfrac{1}{f_5(t)}' : '') : (F.label === 'moved' ? '\\tilde f_5(x)' : '');
  const val = num(F.pt[1], lang, F.pt[1] < 1 ? 3 : 2);
  const ptTex = F.label === 'max' ? `\\text{Max}\\ ${val}` : `\\text{Min}\\ ${val}`;
  const xAxis = step < 2 || F.label !== 'moved' ? (step < 2 ? 't' : 't,\\ x') : 'x';
  return (
    <div className="w3-anim">
      <Plot x={F.x} y={F.y} tick={F.tick} grid={F.tick} axes={[xAxis, 'y']} label={tr('Kehrwert macht aus dem Maximum ein Minimum; 1/x verschiebt die Stelle', 'The reciprocal turns the maximum into a minimum; 1/x moves the place')}>
        {F.ghost.map((b, i) => <Path key={`g${i}`} pts={b} role="ref" dashed />)}
        {step === 2 && F.from && <><Pt x={F.from[0]} y={F.from[1]} role="ref" /><PArrow a={F.from} b={F.pt} role="aux" /></>}
        {F.curve.map((b, i) => <Path key={i} pts={b} role={step === 0 ? 'f' : 'g'} />)}
        <Seg a={[F.pt[0], 0]} b={F.pt} role="pt" dashed />
        <Pt x={F.pt[0]} y={F.pt[1]} />
        <PLabel x={F.pt[0]} y={F.pt[1]} dx={10} dy={step === 0 ? -14 : 16} anchor="l" small role="pt" tex={ptTex} />
        <PLabel x={F.pt[0]} y={0} dy={-12} dx={-6} anchor="r" small role="pt" tex={step === 2 && F.label === 'moved' ? 'x = -2' : 't = -\\tfrac12'} />
        {curveTex && <PLabel x={F.x[0]} y={F.y[1]} dx={8} dy={16} anchor="l" role={step === 0 ? 'f' : 'g'} tex={curveTex} />}
      </Plot>
    </div>
  );
}

/* ================================================================== Injektiv / surjektiv */
/** Ü3 p. 6: the slide's three arrow diagrams D → Z. */
export function ArrowDiagrams() {
  const tr = useTr();
  const D4 = [52, 80, 108, 136];
  const diagrams: { title: ReactNode; z: number[]; map: [number, number][]; note: ReactNode }[] = [
    { title: tr('injektiv', 'injective'), z: D4, map: [[0, 2], [1, 1], [2, 0], [3, 3]], note: tr('kein Ziel doppelt', 'no target twice') },
    { title: tr('surjektiv', 'surjective'), z: [60, 94, 128], map: [[0, 0], [1, 0], [2, 1], [3, 2]], note: tr('jedes Ziel getroffen', 'every target hit') },
    { title: tr('bijektiv', 'bijective'), z: D4, map: [[0, 0], [1, 1], [2, 2], [3, 3]], note: tr('jedes Ziel genau einmal', 'every target exactly once') },
  ];
  return (
    <figure className="vdemo w3-arrows">
      {diagrams.map((dg, k) => (
        <div key={k} className="w3-arrow-panel">
          <div className="w3-arrow-svg">
            <svg viewBox="0 0 170 180" role="img" aria-label={String(dg.title)}>
              <ellipse cx={48} cy={96} rx={26} ry={66} className="w3-set" />
              <ellipse cx={122} cy={96} rx={26} ry={66} className="w3-set" />
              {dg.map.map(([i, j], q) => {
                const a: P2 = [52, D4[i]], b: P2 = [114, dg.z[j]];
                const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l;
                const tip = `${b[0]},${b[1]} ${b[0] - 8 * ux + 3.5 * uy},${b[1] - 8 * uy - 3.5 * ux} ${b[0] - 8 * ux - 3.5 * uy},${b[1] - 8 * uy + 3.5 * ux}`;
                return <g key={q} className="w3-map"><line x1={a[0]} y1={a[1]} x2={b[0] - 6 * ux} y2={b[1] - 6 * uy} /><polygon points={tip} /></g>;
              })}
              {D4.map((y) => <circle key={`d${y}`} cx={46} cy={y} r={3.4} className="w3-dot" />)}
              {dg.z.map((y) => <circle key={`z${y}`} cx={120} cy={y} r={3.4} className="w3-dot" />)}
            </svg>
            <div className="vdemo-label muted small" style={{ left: '28%', top: '7%' }}><M>D</M></div>
            <div className="vdemo-label muted small" style={{ left: '72%', top: '7%' }}><M>Z</M></div>
          </div>
          <div className="w3-arrow-title"><b>{dg.title}</b><br /><span className="pl-small">{dg.note}</span></div>
        </div>
      ))}
    </figure>
  );
}

/** Ü3 p. 5–6 and A-009: drag a horizontal line y = c and count where it meets the graph. */
export function HorizontalLineTest() {
  const tr = useTr(), lang = useLang();
  const [id, setId] = useState<HId>('sq');
  const P = HLINE[id];
  const [c, setC] = useState(P.c);
  const lo = Math.max(P.dom[0], HWIN.x[0] - 30), hi = Math.min(P.dom[1], HWIN.x[1] + 30);
  const xs = hits(P.f, lo, hi, c);
  const inZ = c >= P.Z[0] && c <= P.Z[1];
  const clampC = (v: number) => Math.max(HWIN.y[0] + 0.2, Math.min(HWIN.y[1] - 0.2, v));
  const choose = (k: HId) => { setId(k); setC(HLINE[k].c); };
  const label: Record<HId, ReactNode> = {
    lin: <M>{t`2x+1`}</M>, sq: <><M>{t`x^2`}</M> <M>{t`\text{auf}\ \mathbb R`}</M></>, sq0: <><M>{t`x^2`}</M> <M>{t`\text{auf}\ [0,\infty)`}</M></>,
    cube: <M>{t`x^3`}</M>, exp: <M>{t`e^x`}</M>,
  };
  const labelEn: Record<HId, ReactNode> = { ...label, sq: <><M>{t`x^2`}</M> <M>{t`\text{on}\ \mathbb R`}</M></>, sq0: <><M>{t`x^2`}</M> <M>{t`\text{on}\ [0,\infty)`}</M></> };
  const verdict = !inZ
    ? tr(<><M>c</M> liegt nicht im Zielbereich – diese Linie zählt nicht.</>, <><M>c</M> is not in the target set – this line does not count.</>)
    : xs.length >= 2 ? tr(<>{xs.length} Treffer: zwei <M>x</M> liefern denselben Wert – <b>nicht injektiv</b>.</>, <>{xs.length} hits: two values of <M>x</M> give the same value – <b>not injective</b>.</>)
      : xs.length === 0 ? tr(<>Kein Treffer, obwohl <M>c</M> im Zielbereich liegt – <b>nicht surjektiv</b>.</>, <>No hit although <M>c</M> is in the target set – <b>not surjective</b>.</>)
        : tr('Genau ein Treffer.', 'Exactly one hit.');
  const mark = (ok: boolean) => (ok ? '✓' : '✗');
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {(Object.keys(HLINE) as HId[]).map((k) => <button key={k} type="button" aria-pressed={id === k} onClick={() => choose(k)}>{lang === 'de' ? label[k] : labelEn[k]}</button>)}
      </div>
      <div className="vdemo-fig wide">
        <Plot x={HWIN.x} y={HWIN.y} tick={[1, 2]} onDrag={(_, y) => setC(clampC(y))}
          label={tr('Waagerechte Linie ziehen und Schnittpunkte zählen', 'Drag the horizontal line and count the intersections')}>
          <AxisSet a={[0, Math.max(P.Z[0], HWIN.y[0] - 1)]} b={[0, Math.min(P.Z[1], HWIN.y[1] + 1)]} role="sec" w={9} opacity={0.45} />
          <AxisSet a={[Math.max(P.dom[0], HWIN.x[0] - 1), 0]} b={[Math.min(P.dom[1], HWIN.x[1] + 1), 0]} role="f" w={9} opacity={0.35} />
          {id === 'sq0' && <Curve f={P.f} dom={[-10, 0]} role="ref" dashed />}
          <Curve f={P.f} dom={P.dom} />
          <HLine y={c} role="g" dashed={false} />
          {xs.map((x, i) => <g key={i}><Seg a={[x, 0]} b={[x, c]} role="pt" dashed /><Pt x={x} y={c} /></g>)}
          <PLabel x={HWIN.x[1]} y={c} dx={-6} dy={-12} anchor="r" role="g" tex="y = c" />
          <PLabel x={0} y={HWIN.y[1]} dx={-10} dy={22} anchor="r" small role="sec" tex="Z" />
          <PLabel x={HWIN.x[0]} y={0} dx={6} dy={-14} anchor="l" small role="f" tex="D" />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="v-result rt-readout"><M>{P.tex}</M></div>
        <Slider label={<M>c</M>} value={c} min={HWIN.y[0] + 0.2} max={HWIN.y[1] - 0.2} step={0.05} onChange={setC} shown={fmtNum(c, 2, lang)} aria="c" />
        <p className="vdemo-note">{tr('Ziehe die magenta Linie (oder den Regler).', 'Drag the magenta line (or the slider).')}</p>
        <div className={`v-result ${!inZ || xs.length === 1 ? '' : 'neg'}`}>{verdict}</div>
        <div className="rt-readout pl-small">
          {tr('injektiv', 'injective')} {mark(P.injective)} · {tr('surjektiv', 'surjective')} {mark(P.surjective)} · {tr('bijektiv', 'bijective')} {mark(P.injective && P.surjective)}
        </div>
      </figcaption>
    </figure>
  );
}

/* ================================================================== Umkehrfunktion: Spiegelung an y = x */
/** Label places (math point + offset in viewBox units) of f, f⁻¹, P and its mirror image Q, per example. */
const MLABEL: Record<MirrorId, { Pf: P2; off: [number, number]; inv: P2; ioff: [number, number]; Poff: [number, number]; Qoff: [number, number] }> = {
  lin: { Pf: [-2, -1], off: [-34, 0], inv: [2.5, -0.25], ioff: [20, 34], Poff: [-36, -6], Qoff: [16, 18] },
  sq: { Pf: [1.9, 3.61], off: [-36, 0], inv: [2.9, Math.sqrt(2.9)], ioff: [0, -22], Poff: [-44, -6], Qoff: [30, 16] },
  exp: { Pf: [1.3, Math.exp(1.3)], off: [50, 0], inv: [3.2, Math.log(3.2)], ioff: [0, -24], Poff: [-40, -6], Qoff: [-10, 24] },
  bruch: { Pf: [3.4, (3.4 - 1) / 5.4], off: [0, 18], inv: [3, -3.5], ioff: [14, 26], Poff: [8, -16], Qoff: [34, -4] },
  sin: { Pf: [-1.3, Math.sin(-1.3)], off: [0, 18], inv: [-0.4, Math.asin(-0.4)], ioff: [-36, 0], Poff: [30, 16], Qoff: [-34, -12] },
};
const NAMES: Record<MirrorId, [string, string]> = { lin: ['f', 'f^{-1}'], sq: ['g', 'g^{-1}'], exp: ['h', 'h^{-1}'], bruch: ['y', 'y^{-1}'], sin: ['\\sin', '\\arcsin'] };
/** Ü3 p. 7–8: mirroring the graph at y = x, with a choice of the slide's examples. */
export function MirrorPlayer({ steps }: { steps: (id: MirrorId) => AnimStep[] }) {
  const tr = useTr();
  const [id, setId] = useState<MirrorId>('exp');
  const names: Record<MirrorId, string> = { lin: tr('Bsp. 1', 'Ex. 1'), sq: tr('Bsp. 2', 'Ex. 2'), exp: tr('Bsp. 3', 'Ex. 3'), bruch: tr('Bsp. 4', 'Ex. 4'), sin: tr('Bsp. 5', 'Ex. 5') };
  return (
    <div className="w3-mirror">
      <div className="v-presets">
        {(Object.keys(MIRROR) as MirrorId[]).map((k) => <button key={k} type="button" aria-pressed={id === k} onClick={() => setId(k)}>{names[k]}</button>)}
      </div>
      <StepPlayer key={id} steps={steps(id)} label={tr('Animation: Spiegelung des Graphen an der Geraden y = x', 'Animation: mirroring the graph at the line y = x')}>
        {(s, tt) => <MirrorPlot id={id} step={s} t={tt} />}
      </StepPlayer>
    </div>
  );
}
function MirrorPlot({ id, step, t: tt }: { id: MirrorId; step: number; t: number }) {
  const lang = useLang(), tr = useTr();
  const ex = MIRROR[id], F = mirrorFrame(id, step, tt), L = MLABEL[id];
  const w = ex.win, tk = w[1] - w[0] > 6 ? 2 : 1;
  const pt = (q: P2) => `(${texNum(q[0], lang)}${tupleSep(lang)}${texNum(q[1], lang)})`;
  const Q: P2 = [ex.P[1], ex.P[0]];
  return (
    <div className="w3-anim w3-square">
      <Plot x={w} y={w} w={340} h={340} tick={[tk, tk]} label={tr('Graph und Spiegelgerade y = x', 'Graph and mirror line y = x')}>
        <Line p={[0, 0]} m={1} role="ref" dashed />
        {ex.full && <Curve f={ex.full} role="ref" dashed />}
        {F.asym.map((a, i) => <Seg key={`a${i}`} a={a.a} b={a.b} role="asym" dashed />)}
        {F.sets.map((s, i) => <g key={`s${i}`}><AxisSet a={s.a} b={s.b} role={s.role} w={s.role === 'f' ? 9 : 4} opacity={s.role === 'f' ? 0.35 : 0.9} />
          {s.holes.map((h, j) => <Pt key={j} x={h[0]} y={h[1]} role={s.role} open r={3.6} />)}</g>)}
        {F.f.map((b, i) => <Path key={`f${i}`} pts={b} role="f" />)}
        {F.g && F.g.map((b, i) => <Path key={`g${i}`} pts={b} role="g" />)}
        {F.point && <>
          <Seg a={F.point.P} b={F.point.Q} role="aux" dashed />
          <Pt x={F.point.P[0]} y={F.point.P[1]} />
          <Pt x={F.point.Q[0]} y={F.point.Q[1]} />
          <PLabel x={ex.P[0]} y={ex.P[1]} dx={L.Poff[0]} dy={L.Poff[1]} small role="pt" tex={pt(ex.P)} />
          {F.point.s >= 1 && <PLabel x={Q[0]} y={Q[1]} dx={L.Qoff[0]} dy={L.Qoff[1]} small role="pt" tex={pt(Q)} />}
        </>}
        <PLabel x={L.Pf[0]} y={L.Pf[1]} dx={L.off[0]} dy={L.off[1]} role="f" small tex={ex.fTex} />
        {F.showInv && <PLabel x={L.inv[0]} y={L.inv[1]} dx={L.ioff[0]} dy={L.ioff[1]} role="g" small tex={ex.invTex} />}
        <PLabel x={w[1]} y={w[1]} dx={-12} dy={22} anchor="r" small role="muted" tex="y = x" />
      </Plot>
      <div className={`w3-anim-read${step >= 3 ? ' w3-hl' : ''}`}>
        <M>{`${NAMES[id][0]}: ${ex.D.tex} \\to ${ex.W.tex}`}</M>
        {F.showInv && <>{' '}<span className="pl-small">·</span>{' '}<M>{`${NAMES[id][1]}: ${ex.W.tex} \\to ${ex.D.tex}`}</M></>}
      </div>
    </div>
  );
}

/* ================================================================== Asymptoten */
type AId = 'o1' | 'o2' | 'h1';
const ASY: Record<AId, { f: (x: number) => number; g: (x: number) => number; pole: number; x: Range; y: Range; dy: Range; tick: [number, number]; d: string; tex: string; gTex: string; x0: number }> = {
  o1: { f: asym.o1, g: (x) => x - 1, pole: -1, x: [-8, 8], y: [-11, 9], dy: [-1.6, 1.6], tick: [2, 2], d: '\\frac{1}{x+1}', tex: 'f(x) = \\frac{x^2}{x+1}', gTex: 'g(x) = x - 1', x0: 3 },
  o2: { f: asym.o2, g: (x) => x * x + x - 2, pole: 1, x: [-3.5, 4.5], y: [-6, 24], dy: [-4, 4], tick: [1, 5], d: '\\frac{3}{x-1}', tex: 'f(x) = \\frac{x^3-3x+5}{x-1}', gTex: 'g(x) = x^2 + x - 2', x0: 2.5 },
  h1: { f: asym.h1, g: () => 2, pole: -1, x: [-8, 8], y: [-5, 8], dy: [-3, 3], tick: [2, 2], d: '-\\frac{2}{x+1}', tex: 'f(x) = \\frac{2x}{x+1}', gTex: 'g(x) = 2', x0: 3 },
};
/** Ü3 p. 9–12: the gap f(x) − g(x) at a movable x, and its own graph below — it shrinks to 0 on both sides. */
export function GapFigure() {
  const tr = useTr(), lang = useLang();
  const [id, setId] = useState<AId>('o1');
  const A = ASY[id];
  const [x0, setX0] = useState(A.x0);
  const sweep = useSweep(setX0);
  const fx = A.f(x0), gx = A.g(x0), d = fx - gx;
  const pick = (v: number) => (Math.abs(v - A.pole) < 0.3 ? A.pole + (v < A.pole ? -0.3 : 0.3) : v);
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {(['o1', 'o2', 'h1'] as AId[]).map((k) => <button key={k} type="button" aria-pressed={id === k} onClick={() => { setId(k); setX0(ASY[k].x0); }}>
          {k === 'o1' ? tr('schief', 'oblique') : k === 'o2' ? tr('Parabel', 'parabola') : tr('waagerecht', 'horizontal')}</button>)}
      </div>
      <div className="vdemo-fig wide">
        <Plot x={A.x} y={A.y} h={270} tick={A.tick} label={tr('Funktion, Asymptote und ihr Abstand', 'Function, asymptote and their gap')}>
          <VLine x={A.pole} role="aux" />
          <Curve f={A.g} role="asym" dashed />
          <Curve f={A.f} breaks={[A.pole]} n={900} />
          <Seg a={[x0, gx]} b={[x0, fx]} role="sec" width={3.5} />
          <Pt x={x0} y={fx} /><Pt x={x0} y={gx} role="asym" r={3.5} />
          <PLabel x={A.x[0]} y={A.y[1]} dx={8} dy={16} anchor="l" role="f" tex={A.tex} />
          <PLabel x={A.x[0]} y={A.y[1]} dx={8} dy={44} anchor="l" role="asym" small tex={A.gTex} />
        </Plot>
        <Plot x={A.x} y={A.dy} h={120} tick={[A.tick[0], A.dy[1] > 2 ? 2 : 1]} grid={[A.tick[0], 1]} axes={['x', 'f - g']} label={tr('Abstand f − g', 'Gap f − g')}>
          <VLine x={A.pole} role="aux" />
          <Curve f={(x) => A.f(x) - A.g(x)} role="sec" breaks={[A.pole]} n={900} />
          <Pt x={x0} y={d} />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <Slider label={<M>x</M>} value={x0} min={A.x[0]} max={A.x[1]} step={0.05} onChange={(v) => setX0(pick(v))} shown={fmtNum(x0, 2, lang)} aria="x" />
        <div className="motion-row">
          <button type="button" className="motion-btn" onClick={() => sweep(x0, A.x[1])}>{tr(<>nach rechts <M>{t`(x\to\infty)`}</M></>, <>to the right <M>{t`(x\to\infty)`}</M></>)}</button>
          <button type="button" className="motion-btn" onClick={() => sweep(x0, A.x[0])}>{tr(<>nach links <M>{t`(x\to-\infty)`}</M></>, <>to the left <M>{t`(x\to-\infty)`}</M></>)}</button>
        </div>
        <div className="v-result pos rt-readout"><M>{`f(x) - g(x) = ${A.d} = ${num(d, lang)}`}</M></div>
      </figcaption>
    </figure>
  );
}

/** Ü3 p. 10, «WICHTIG»: same zero of the denominator, different outcome — first check whether it cancels. */
export function DenominatorCheck() {
  const tr = useTr();
  return (
    <figure className="vdemo w3-pair">
      <div>
        <Plot x={[-2, 3.4]} y={[-3, 5]} w={300} h={240} tick={[1, 2]} label={tr('Kürzbar: nur ein Loch', 'Cancels: only a hole')}>
          <Curve f={holeF} breaks={[1]} /><Pt x={1} y={2} role="f" open />
          <VLine x={1} role="aux" />
        </Plot>
        <div className="w3-pair-cap"><M>{t`\frac{(x-1)(x+1)}{x-1} = x + 1`}</M><br />{tr('kürzbar → Loch', 'cancels → hole')}</div>
      </div>
      <div>
        <Plot x={[-2, 3.4]} y={[-6, 10]} w={300} h={240} tick={[1, 4]} label={tr('Nicht kürzbar: Polstelle', 'Does not cancel: pole')}>
          <VLine x={1} /><Curve f={asym.v2} breaks={[1]} />
        </Plot>
        <div className="w3-pair-cap"><M>{t`\frac{2x+1}{x-1}`}</M><br />{tr('nicht kürzbar → Pol', 'does not cancel → pole')}</div>
      </div>
    </figure>
  );
}

/* ================================================================== Polynomdivision */
/** Frame of the long-division animation, in the slide's layout (Ü3 p. 11). Step 0: set-up; step k: k-th quotient term; last: result. */
export function DivisionTable({ num: N, den, step, t: tt }: { num: Poly; den: Poly; step: number; t: number }) {
  const lang = useLang();
  const L = divLayout(N, den, lang);
  const nq = L.quotient.length;
  const last = step > nq;
  const visible = (r: { kind: string; step: number }) => r.step < step || last || (r.step === step && (r.kind === 'sub' ? tt > 0.3 : r.kind === 'rest' ? tt > 0.65 : true));
  const qShown = L.quotient.filter((_, k) => k + 1 < step || last || (k + 1 === step && tt > 0.02));
  const right = `:\\ (${polyTex(den, lang)}) = ${qShown.join(' ')}${last ? ` + \\frac{${polyTex(L.rest, lang)}}{${polyTex(den, lang)}}` : ''}`;
  return (
    <div className="w3-div" role="img" aria-label="long division">
      <div className="w3-div-grid" style={{ gridTemplateColumns: `repeat(${L.cols}, auto) 1fr` }}>
        {L.rows.map((r, ri) => {
          if (!visible(r)) return null;
          const idx = r.cells.map((c, i) => (c ? i : -1)).filter((i) => i >= 0);
          const isNew = !last && r.step === step && r.step > 0;
          return [
            ...r.cells.map((c, i) => (
              <div key={`${ri}-${i}`} className={`w3-cell${r.line && i >= idx[0] && i <= idx[idx.length - 1] ? ' line' : ''}${isNew ? ' new' : ''}${last && ri === L.rows.length - 1 ? ' rest' : ''}`} style={{ gridRow: ri + 1, gridColumn: i + 1 }}>
                {c && <M>{c}</M>}
              </div>
            )),
            ri === 0 ? <div key="q" className="w3-cell w3-q" style={{ gridRow: 1, gridColumn: L.cols + 1 }}><M>{right}</M></div> : null,
          ];
        })}
      </div>
      {last && <div className="w3-div-res"><M>{`\\Rightarrow\\ g(x) = ${divResultTex(L, lang).split(' + \\frac')[0]}`}</M></div>}
    </div>
  );
}

/** Divisor-step captions need the actual terms: exported helpers for the lesson. */
export const divTerms = (N: Poly, den: Poly, lang: Lang) => {
  const L = divLayout(N, den, lang);
  return { L, quotient: L.quotient.map((q) => q.replace(/^\{\}\+/, '').replace(/^\{\}/, '')), subs: L.rows.filter((r) => r.kind === 'sub').map((r) => r.cells.filter(Boolean).join(' ')), rests: L.rows.filter((r) => r.kind === 'rest').map((r) => r.cells.filter(Boolean).join(' ')) };
};
