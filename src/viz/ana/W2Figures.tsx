import { useEffect, useRef, useState, type ReactNode } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { useReducedMotion } from '../figUtils';
import { Band, Curve, HLine, Line, PArrow, PLabel, Path, Plot, Pt, Seg, VLine } from '../plot/Plot';
import {
  G15_MAX, G15_MIN, LH_SLOPES, PARAB_CRIT, STET_A, STET_B, SYM_FNS, TYPE_FNS, absEx, cexDeriv, cexRatio, fStet, g15, gLeft, gRight, gStet,
  imageOfInterval, kuerzenReduced, leftVal, lhF, lhG, parab, plateau, reachedAt, recip3, rightVal, solveG15, solveRecip3, type Interval,
} from '../../analysis/w2';
import { CANCEL_X, dragEnd, ivTex, nearerEnd, numTex, probeH, sinShapes, zoomW, zoomWindow, type CancelFrame, type SinFrame } from './w2Geom';

const t = String.raw;

/* ================================================================== anatomy of f: (−1, 4] → ℝ, x ↦ 4x + 3 */

function Part({ tex, cls, label, below }: { tex: string; cls: string; label: ReactNode; below?: boolean }) {
  return (
    <span className={`w2-part ${cls}${below ? ' below' : ''}`}>
      <span className="w2-part-label">{label}</span>
      <span className="w2-part-tex"><M>{tex}</M></span>
    </span>
  );
}

/** The slide's annotated function, every part in the slide's colour with its name. */
export function FunctionAnatomy() {
  const tr = useTr();
  return (
    <figure className="vdemo w2-anat" aria-label={tr('Aufbau einer Funktion', 'Anatomy of a function')}>
      <div className="w2-anat-row">
        <Part tex="f" cls="name" below label={tr('Funktions­name', 'function name')} />
        <span className="w2-part-tex plain"><M>{':'}</M></span>
        <Part tex="(-1, 4]" cls="dom" label={<>{tr('Definitions­bereich', 'domain')} <M>{t`\mathbb{D}`}</M></>} />
        <Part tex={t`\longrightarrow`} cls="set" below label={tr('Mengen­pfeil', 'set arrow')} />
        <Part tex={t`\mathbb{R}`} cls="ziel" label={tr('Ziel­bereich', 'target set')} />
      </div>
      <div className="w2-anat-row">
        <Part tex="x" cls="var" below label={tr('Variable / Argument', 'variable / argument')} />
        <Part tex={t`\longmapsto`} cls="maps" label={tr('Abbildungs­pfeil', 'maps-to arrow')} />
        <Part tex="4x + 3" cls="val" below label={tr('Funktions­wert', 'function value')} />
      </div>
      <p className="vdemo-note">{tr(<>Hier: <M p=".">{t`-1 < x \le 4`}</M> Der Mengenpfeil verbindet zwei <em>Mengen</em>, der Abbildungspfeil eine <em>Zahl</em> mit ihrem Funktionswert.</>,
        <>Here: <M p=".">{t`-1 < x \le 4`}</M> The set arrow joins two <em>sets</em>; the maps-to arrow joins a <em>number</em> to its function value.</>)}</p>
    </figure>
  );
}

/* ================================================================== image of an interval: (x − 4)² on [2, 6) */

const SLIDE_D: Interval = { lo: 2, hi: 6, loIn: true, hiIn: false };
const D_PRESETS: { id: string; d: Interval }[] = [
  { id: 'slide', d: SLIDE_D },
  { id: 'closed', d: { lo: 2, hi: 6, loIn: true, hiIn: true } },
  { id: 'open', d: { lo: 4, hi: 6, loIn: false, hiIn: false } },
  { id: 'right', d: { lo: 5, hi: 6, loIn: true, hiIn: false } },
  { id: 'wide', d: { lo: 1, hi: 7, loIn: true, hiIn: true } },
];
const same = (a: Interval, b: Interval) => a.lo === b.lo && a.hi === b.hi && a.loIn === b.loIn && a.hiIn === b.hiIn;

/** Drag the ends of the domain; the image interval appears on the y-axis, with the points where its ends are reached. */
export function ImageExplorer() {
  const tr = useTr(), lang = useLang();
  const [d, setD] = useState<Interval>(SLIDE_D);
  const drag = useRef<'lo' | 'hi' | null>(null);
  const im = imageOfInterval(parab, PARAB_CRIT, d);
  const atHi = reachedAt(parab, PARAB_CRIT, d, im.hi), atLo = reachedAt(parab, PARAB_CRIT, d, im.lo);
  const onDrag = (x: number, _y: number, phase: 'down' | 'move' | 'up') => {
    if (phase === 'down') drag.current = nearerEnd(d, x);
    const w = drag.current;
    if (w) setD((dd) => dragEnd(dd, x, w));
    if (phase === 'up') drag.current = null;
  };
  const n = (v: number) => numTex(v, lang);
  /** Why an end of the image is closed or open. */
  const why = (v: number, inc: boolean, xs: number[], top: boolean) => {
    const which = top ? tr('Oberes Ende', 'Upper end') : tr('Unteres Ende', 'Lower end');
    if (inc) {
      const x0 = xs[0];
      const how = x0 === 4 && x0 > d.lo && x0 < d.hi ? tr(' (Scheitel)', ' (vertex)') : '';
      return <li>{which} <M>{n(v)}</M> {tr('gehört dazu: Es wird bei', 'belongs to it: it is reached at')} <M>{t`x = ${n(x0)}`}</M>{how} {tr('erreicht.', '.')}</li>;
    }
    const ex = !d.loIn && Math.abs(parab(d.lo) - v) < 1e-9 ? d.lo : d.hi;
    return <li>{which} <M>{n(v)}</M> {tr('gehört nicht dazu: Nur', 'does not belong to it: only')} <M>{t`x = ${n(ex)}`}</M> {tr('würde es liefern, und das ist ausgeschlossen.', 'would give it, and that is excluded.')}</li>;
  };
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {D_PRESETS.map((p) => (
          <button key={p.id} type="button" aria-pressed={same(p.d, d)} onClick={() => setD(p.d)}>
            <M>{ivTex(p.d, lang)}</M>{p.id === 'slide' ? <> {tr('(Folie)', '(slide)')}</> : null}
          </button>
        ))}
      </div>
      <div className="vdemo-fig">
        <Plot x={[-0.8, 8.4]} y={[-1.4, 9.6]} h={360} onDrag={onDrag}
          label={tr('Parabel (x−4)² über einem ziehbaren Intervall, Bild auf der y-Achse', 'Parabola (x−4)² over a draggable interval, image on the y-axis')}>
          <Band from={im.lo} to={im.hi} />
          <Curve f={parab} role="ref" dashed />
          <Curve f={parab} dom={[d.lo, d.hi]} />
          {[...atHi.map((x) => [x, im.hi]), ...atLo.map((x) => [x, im.lo])].map(([x, v], i) => (
            <g key={i}><Seg a={[x, v]} b={[0, v]} dashed /><Seg a={[x, v]} b={[x, 0]} dashed /></g>
          ))}
          <Seg a={[d.lo, 0]} b={[d.hi, 0]} role="sec" width={5} />
          <Pt x={d.lo} y={0} role="sec" open={!d.loIn} r={5.5} />
          <Pt x={d.hi} y={0} role="sec" open={!d.hiIn} r={5.5} />
          <Seg a={[0, im.lo]} b={[0, im.hi]} role="sec" width={5} />
          <Pt x={0} y={im.lo} role="sec" open={!im.loIn} r={5.5} />
          <Pt x={0} y={im.hi} role="sec" open={!im.hiIn} r={5.5} />
          <Pt x={d.lo} y={parab(d.lo)} role="f" open={!d.loIn} />
          <Pt x={d.hi} y={parab(d.hi)} role="f" open={!d.hiIn} />
          {[...atHi.map((x) => [x, im.hi]), ...atLo.map((x) => [x, im.lo])].map(([x, v], i) => <Pt key={`r${i}`} x={x} y={v} />)}
          <PLabel x={(d.lo + d.hi) / 2} y={0} dy={32} tex={t`\mathbb{D}`} role="sec" />
          <PLabel x={0} y={(im.lo + im.hi) / 2} dx={10} anchor="l" tex={t`\mathbb{W}(f)`} role="sec" />
          <PLabel x={6.9} y={parab(6.9)} dx={-10} anchor="r" tex={t`(x-4)^2`} role="f" small />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="v-presets">
          <button type="button" aria-pressed={d.loIn} onClick={() => setD({ ...d, loIn: !d.loIn })}>{tr('linkes Ende', 'left end')} <M>{d.loIn ? '[' : '('}</M></button>
          <button type="button" aria-pressed={d.hiIn} onClick={() => setD({ ...d, hiIn: !d.hiIn })}>{tr('rechtes Ende', 'right end')} <M>{d.hiIn ? ']' : ')'}</M></button>
        </div>
        <div className="w2-big"><M>{t`\mathbb{D} = ${ivTex(d, lang)} \;\longrightarrow\; \mathbb{W}(f) = ${ivTex(im, lang)}`}</M></div>
        <ul className="w2-why">
          {why(im.lo, im.loIn, atLo, false)}
          {why(im.hi, im.hiIn, atHi, true)}
        </ul>
        <p className="vdemo-note">{tr(<>Ziehe die Enden von <M>{t`\mathbb{D}`}</M> (türkis auf der <M>x</M>-Achse), oder schalte sie mit den Knöpfen offen/geschlossen. Voller Punkt: gehört dazu; leerer Punkt: gehört nicht dazu.</>,
          <>Drag the ends of <M>{t`\mathbb{D}`}</M> (teal on the <M>x</M>-axis), or switch them open/closed with the buttons. Filled dot: belongs to it; empty dot: does not.</>)}</p>
      </figcaption>
    </figure>
  );
}

/* ================================================================== which values are reached? horizontal-line probe */

const REACH = {
  f: { fn: recip3, x: [-5, 10] as [number, number], y: [-5, 10] as [number, number], grid: [1, 1] as [number, number], tick: [5, 5] as [number, number], pole: 3, bar: -4.55, wy: 7.5, c0: 2, solve: solveRecip3, name: 'f(x)', W: t`\mathbb{W} = \mathbb{R}\setminus\{0\}` },
  g: { fn: g15, x: [-4.5, 27] as [number, number], y: [-6, 21] as [number, number], grid: [5, 5] as [number, number], tick: [5, 5] as [number, number], pole: 16, bar: -3.9, wy: 2.5, c0: 8, solve: solveG15, name: 'g(x)', W: t`\mathbb{W} = \mathbb{R}\setminus(6, 10)` },
};

/** Drag a horizontal line y = c: it meets the graph exactly when c is a value of the function. */
export function ReachProbe() {
  const tr = useTr(), lang = useLang();
  const [which, setWhich] = useState<'f' | 'g'>('f');
  const cfg = REACH[which];
  const [c, setC] = useState(cfg.c0);
  const choose = (w: 'f' | 'g') => { setWhich(w); setC(REACH[w].c0); };
  const xs = cfg.solve(c).filter((x) => x >= cfg.x[0] && x <= cfg.x[1]);
  const hit = cfg.solve(c).length > 0;
  const clampC = (y: number) => Math.round(Math.min(cfg.y[1] - 1, Math.max(cfg.y[0] + 1, y)) * 10) / 10;
  const n = (v: number) => numTex(v, lang);
  return (
    <figure className="vdemo">
      <div className="v-presets">
        <button type="button" aria-pressed={which === 'f'} onClick={() => choose('f')}><M>{t`f(x) = \frac{1}{x-3}`}</M></button>
        <button type="button" aria-pressed={which === 'g'} onClick={() => choose('g')}><M>{t`g(x) = \frac{x-15}{\sqrt{x}-4}`}</M></button>
      </div>
      <div className="vdemo-fig w2-gap">
        <Plot key={which} x={cfg.x} y={cfg.y} grid={cfg.grid} tick={cfg.tick} onDrag={(_x, y) => setC(clampC(y))}
          label={tr('Graph mit waagrechter Linie y = c; Schnittpunkte zeigen, ob c erreicht wird', 'Graph with a horizontal line y = c; intersections show whether c is reached')}>
          {which === 'g' && <Band from={G15_MAX.y} to={G15_MIN.y} role="asym" />}
          <VLine x={cfg.pole} />
          <Curve f={cfg.fn} dom={which === 'g' ? [0, cfg.x[1]] : undefined} breaks={[cfg.pole]} n={1200} />
          {which === 'g' && <><Pt x={0} y={g15(0)} role="f" /><Pt x={G15_MAX.x} y={G15_MAX.y} role="f" /><Pt x={G15_MIN.x} y={G15_MIN.y} role="f" /></>}
          {/* the image as a ruler of values at the left edge */}
          {which === 'f'
            ? <><Seg a={[cfg.bar, cfg.y[0]]} b={[cfg.bar, cfg.y[1]]} role="sec" width={5} /><Pt x={cfg.bar} y={0} role="sec" open r={5} /></>
            : <><Seg a={[cfg.bar, cfg.y[0]]} b={[cfg.bar, G15_MAX.y]} role="sec" width={5} /><Seg a={[cfg.bar, G15_MIN.y]} b={[cfg.bar, cfg.y[1]]} role="sec" width={5} />
              <Pt x={cfg.bar} y={G15_MAX.y} role="sec" r={5} /><Pt x={cfg.bar} y={G15_MIN.y} role="sec" r={5} /></>}
          <HLine y={c} role="pt" dashed={false} />
          {xs.map((x, i) => <Pt key={i} x={x} y={c} />)}
          <Pt x={cfg.bar} y={c} open={!hit} r={4} />
          <PLabel x={cfg.bar} y={cfg.wy} dx={9} anchor="l" tex={t`\mathbb{W}`} role="sec" />
          {which === 'f'
            ? <PLabel x={3.6} y={8.5} anchor="l" tex="f(x)" role="f" />
            : <>
              <PLabel x={20} y={17} anchor="l" tex="g(x)" role="f" />
              <PLabel x={G15_MAX.x} y={G15_MAX.y} dy={16} tex="(9, 6)" role="f" small />
              <PLabel x={G15_MIN.x} y={G15_MIN.y} dy={-16} anchor="r" dx={4} tex="(25, 10)" role="f" small />
            </>}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider"><span><M>c</M></span>
          <input type="range" min={cfg.y[0] + 1} max={cfg.y[1] - 1} step={0.1} value={c} onChange={(e) => setC(Number(e.target.value))} aria-label="c" /><span className="val">{fmtNum(c, 1, lang)}</span></label>
        <div className={`w2-big ${hit ? 'w2-ok' : 'w2-no'}`}>
          {hit
            ? <>{tr('getroffen bei', 'met at')} <M p=",">{xs.length > 1 ? t`x \approx ${n(xs[0])}\ \text{${tr('und', 'and')}}\ x \approx ${n(xs[1])}` : t`x \approx ${n(xs[0] ?? cfg.solve(c)[0])}`}</M> {tr('also', 'so')} <M>{t`${n(c)} \in \mathbb{W}`}</M></>
            : <>{tr('kein Schnittpunkt:', 'no intersection:')} <M>{t`${n(c)} \notin \mathbb{W}`}</M></>}
        </div>
        <div><M>{cfg.W}</M></div>
        <p className="vdemo-note">{tr(<>Ziehe die rote Linie <M>{t`y = c`}</M> auf und ab. Trifft sie den Graphen, ist <M>c</M> ein Funktionswert. Links das Bild <M>{t`\mathbb{W}`}</M> als türkiser Massstab{which === 'g' ? <>; violett die Lücke <M p=".">{t`(6, 10)`}</M></> : '.'}</>,
          <>Drag the red line <M>{t`y = c`}</M> up and down. If it meets the graph, <M>c</M> is a function value. On the left the image <M>{t`\mathbb{W}`}</M> as a teal ruler{which === 'g' ? <>; purple the gap <M p=".">{t`(6, 10)`}</M></> : '.'}</>)}</p>
      </figcaption>
    </figure>
  );
}

/* ================================================================== function types */

const TYPE_NAMES: Record<string, [string, string]> = {
  pot: ['Potenz', 'power'], poly: ['Polynom', 'polynomial'], rat: ['rational', 'rational'],
  trig: ['trigonometrisch', 'trigonometric'], exp: ['Exponential', 'exponential'], log: ['Logarithmus', 'logarithm'],
};
export function FunctionTypes() {
  const tr = useTr();
  const [id, setId] = useState('pot');
  const fn = TYPE_FNS.find((f) => f.id === id)!;
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {TYPE_FNS.map((f) => <button key={f.id} type="button" aria-pressed={f.id === id} onClick={() => setId(f.id)}>{tr(...TYPE_NAMES[f.id])}</button>)}
      </div>
      <div className="vdemo-fig">
        <Plot key={id} x={[-4.2, 4.2]} y={[-3.2, 3.2]} label={tr('Typischer Graph der gewählten Funktionsart', 'Typical graph of the chosen kind of function')}>
          {id === 'rat' && <><VLine x={-2} /><VLine x={2} /><HLine y={1} /></>}
          <Curve f={fn.f} dom={fn.dom} breaks={fn.breaks} n={900} />
        </Plot>
      </div>
      <div className="vdemo-readout"><M>{fn.tex}</M></div>
    </figure>
  );
}

/* ================================================================== even / odd as mirror symmetry */

export function EvenOdd() {
  const tr = useTr(), lang = useLang();
  const [id, setId] = useState('x2');
  const [x0, setX0] = useState(1.6);
  const s = SYM_FNS.find((f) => f.id === id)!;
  const y1 = s.f(x0), y2 = s.f(-x0);
  const kindTxt = { even: tr('gerade', 'even'), odd: tr('ungerade', 'odd'), none: tr('weder noch', 'neither') };
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {SYM_FNS.map((f) => <button key={f.id} type="button" aria-pressed={f.id === id} onClick={() => setId(f.id)}><M>{f.tex}</M></button>)}
      </div>
      <div className="vdemo-fig">
        <Plot x={[-3.4, 3.4]} y={[-2.6, 2.6]} label={tr('Graph mit den Punkten bei x und −x', 'Graph with the points at x and −x')}>
          {s.kind === 'even' && <Seg a={[0, -2.6]} b={[0, 2.6]} role="g" dashed width={2.5} />}
          <Curve f={s.f} />
          <Seg a={[x0, 0]} b={[x0, y1]} dashed /><Seg a={[-x0, 0]} b={[-x0, y2]} dashed />
          {s.kind === 'even' && <PArrow a={[x0 - 0.12, y1]} b={[-x0 + 0.12, y1]} role="g" />}
          {s.kind === 'odd' && <><Seg a={[x0, y1]} b={[-x0, y2]} role="g" dashed /><Pt x={0} y={0} role="g" r={3.5} /></>}
          {s.kind === 'none' && <><Pt x={-x0} y={y1} role="ref" open r={4} /><Pt x={-x0} y={-y1} role="ref" open r={4} /></>}
          <Pt x={x0} y={y1} /><Pt x={-x0} y={y2} />
          <PLabel x={x0} y={y1} dx={8} dy={y1 >= 0 ? -14 : 14} anchor="l" tex="f(x)" role="pt" small />
          <PLabel x={-x0} y={y2} dx={-8} dy={y2 >= 0 ? -14 : 14} anchor="r" tex="f(-x)" role="pt" small />
          <PLabel x={x0} y={0} dy={y1 >= 0 ? 14 : -14} tex="x" role="fg" small />
          <PLabel x={-x0} y={0} dy={y2 >= 0 ? 14 : -14} tex="-x" role="fg" small />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider"><span><M>x</M></span>
          <input type="range" min={0.2} max={3} step={0.05} value={x0} onChange={(e) => setX0(Number(e.target.value))} aria-label="x" /><span className="val">{fmtNum(x0, 2, lang)}</span></label>
        <div className="w2-big"><M>{t`f(x) = ${fmtNum(y1, 2, lang, true)}, \quad f(-x) = ${fmtNum(y2, 2, lang, true)}`}</M></div>
        <div className="w2-big"><b>{kindTxt[s.kind]}</b>{s.kind === 'even' ? <>: <M>{t`f(-x) = f(x)`}</M></> : s.kind === 'odd' ? <>: <M>{t`f(-x) = -f(x)`}</M></> : null}</div>
        <p className="vdemo-note">{s.kind === 'even'
          ? tr(<>Gerade: Der Graph ist an der <M>y</M>-Achse gespiegelt (magenta). Der Punkt bei <M>-x</M> liegt auf derselben Höhe.</>, <>Even: the graph is mirrored at the <M>y</M>-axis (magenta). The point at <M>-x</M> is at the same height.</>)
          : s.kind === 'odd'
            ? tr(<>Ungerade: Der Graph ist am Ursprung gespiegelt (Punktspiegelung, magenta). Der Punkt bei <M>-x</M> liegt gleich weit unten wie der bei <M>x</M> oben.</>, <>Odd: the graph is mirrored through the origin (point reflection, magenta). The point at <M>-x</M> is as far down as the one at <M>x</M> is up.</>)
            : tr(<>Weder noch: Keiner der beiden grauen Spiegelpunkte liegt auf dem Graphen.</>, <>Neither: none of the two grey mirror points lies on the graph.</>)}</p>
      </figcaption>
    </figure>
  );
}

/* ================================================================== monotonic, not strictly */

export function MonotoneFig() {
  const tr = useTr();
  const x1 = 2.5, x2 = 3.6;
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <Plot x={[-0.3, 6.4]} y={[-0.4, 4]} h={240} tick={[0, 0]} label={tr('Monoton wachsende Funktion mit flachem Stück', 'Increasing function with a flat piece')}>
          <Curve f={plateau} dom={[0, 6.2]} />
          <Seg a={[x1, 0]} b={[x1, 2]} dashed /><Seg a={[x2, 0]} b={[x2, 2]} dashed />
          <Pt x={x1} y={2} /><Pt x={x2} y={2} />
          <PLabel x={x1} y={0} dy={14} tex="x_1" role="pt" small />
          <PLabel x={x2} y={0} dy={14} tex="x_2" role="pt" small />
          <PLabel x={(x1 + x2) / 2} y={2} dy={-18} tex={t`f(x_1) = f(x_2)`} role="pt" small />
        </Plot>
      </div>
      <p className="vdemo-note">{tr(<>Monoton wachsend, aber <b>nicht strikt</b>: Auf dem flachen Stück ist <M>{t`x_1 < x_2`}</M> und trotzdem <M p=".">{t`f(x_1) = f(x_2)`}</M> «<M>\le</M>» erlaubt das, «<M>{'<'}</M>» nicht.</>,
        <>Increasing, but <b>not strictly</b>: on the flat piece <M>{t`x_1 < x_2`}</M> and still <M p=".">{t`f(x_1) = f(x_2)`}</M> “<M>\le</M>” allows this, “<M>{'<'}</M>” does not.</>)}</p>
    </figure>
  );
}

/* ================================================================== one-sided limits: probe from the left and the right */

type ProbeId = 'f' | 'gA' | 'gB' | 'abs';
const PROBE: Record<ProbeId, { fn: (x: number) => number; a: number; x: [number, number]; y: [number, number]; name: string; at: string; breaks: number[] }> = {
  f: { fn: fStet, a: 3, x: [-0.4, 9.6], y: [-0.4, 4.6], name: 'f', at: 'x_0', breaks: [] },
  gA: { fn: gStet, a: STET_A, x: [-0.4, 9.6], y: [-0.4, 4.6], name: 'g', at: 'a', breaks: [STET_A] },
  gB: { fn: gStet, a: STET_B, x: [-0.4, 9.6], y: [-0.4, 4.6], name: 'g', at: 'b', breaks: [STET_A] },
  abs: { fn: absEx, a: 1, x: [-1.2, 3.2], y: [-1, 1], name: 'f', at: '1', breaks: [1] },
};

/** Animate a value 0 → 1 over `ms` (requestAnimationFrame); reduced motion jumps to the end. */
function useApproach(set: (s: number) => void) {
  const reduced = useReducedMotion();
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return (ms = 2600) => {
    cancelAnimationFrame(raf.current);
    if (reduced) { set(1); return; }
    const t0 = performance.now();
    const tick = (now: number) => {
      const u = Math.min(1, (now - t0) / ms);
      set(u);
      if (u < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
}

export function LimitProbe() {
  const tr = useTr(), lang = useLang();
  const [id, setId] = useState<ProbeId>('gA');
  const [s, setS] = useState(0.35);
  const approach = useApproach(setS);
  const P = PROBE[id], h = probeH(s), xl = P.a - h, xr = P.a + h;
  const yl = P.fn(xl), yr = P.fn(xr);
  const L = leftVal(P.fn, P.a), R = rightVal(P.fn, P.a), jump = Math.abs(L - R) > 1e-3;
  const f2 = (v: number) => fmtNum(v, 2, lang, true);
  const argL = P.at === '1' ? '1-h' : `${P.at}-h`, argR = P.at === '1' ? '1+h' : `${P.at}+h`;
  const names: Record<ProbeId, ReactNode> = {
    f: <><M>f</M> {tr('stetig', 'continuous')}</>, gA: <><M>g</M> {tr('bei', 'at')} <M>a</M></>, gB: <><M>g</M> {tr('bei', 'at')} <M>b</M></>,
    abs: <M>{t`\frac{x-1}{2|x-1|}`}</M>,
  };
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {(Object.keys(PROBE) as ProbeId[]).map((k) => <button key={k} type="button" aria-pressed={k === id} onClick={() => { setId(k); setS(0.35); }}>{names[k]}</button>)}
      </div>
      <div className="vdemo-fig">
        <Plot key={id} x={P.x} y={P.y} grid={id === 'abs' ? [0.5, 0.5] : [1, 1]} tick={id === 'abs' ? [1, 0.5] : [0, 0]} axes={['x', id === 'abs' ? 'y' : 'y']}
          label={tr('Zwei Punkte nähern sich der Stelle von links und von rechts', 'Two points approach the place from the left and from the right')}>
          {id !== 'abs' && id !== 'f' && <><VLine x={STET_A} role="g" /><VLine x={STET_B} role="g" /></>}
          {id === 'f' && <VLine x={P.a} role="g" />}
          {id === 'abs' && <VLine x={1} role="g" />}
          <Curve f={P.fn} breaks={P.breaks} n={900} />
          {(id === 'gA' || id === 'gB') && <><Pt x={STET_A} y={gLeft(STET_A)} role="f" open /><Pt x={STET_A} y={gRight(STET_A)} role="f" /></>}
          {id === 'abs' && <><Pt x={1} y={0.5} role="f" open /><Pt x={1} y={-0.5} role="f" open /></>}
          <Seg a={[xl, 0]} b={[xl, yl]} dashed /><Seg a={[xr, 0]} b={[xr, yr]} dashed />
          <Seg a={[xl, yl]} b={[P.x[0] < 0 ? 0 : P.x[0], yl]} dashed /><Seg a={[xr, yr]} b={[P.x[0] < 0 ? 0 : P.x[0], yr]} dashed />
          {h > 0.12 && <><PArrow a={[xl, 0]} b={[P.a - 0.04, 0]} role="pt" /><PArrow a={[xr, 0]} b={[P.a + 0.04, 0]} role="pt" /></>}
          <Pt x={xl} y={yl} /><Pt x={xr} y={yr} />
          <Pt x={0} y={yl} r={3} /><Pt x={0} y={yr} r={3} />
          {id !== 'abs' && <>
            <PLabel x={STET_A} y={0} dy={14} tex="a" role="g" />
            <PLabel x={STET_B} y={0} dy={14} tex="b" role="g" />
            {id === 'f' && <PLabel x={P.a} y={0} dy={14} tex="x_0" role="g" />}
            <PLabel x={9.1} y={P.fn(9.1)} dy={-16} tex={`${P.name}(x)`} role="f" small />
          </>}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider"><span><M>h</M></span>
          <input type="range" min={0} max={1} step={0.01} value={s} onChange={(e) => setS(Number(e.target.value))} aria-label="h" /><span className="val">{fmtNum(h, 2, lang)}</span></label>
        <div className="motion-row"><button type="button" className="motion-btn" onClick={() => approach()}>{tr('Annähern', 'Approach')} <M>{t`h \to 0`}</M></button></div>
        <div className="w2-big"><M>{t`${P.name}(${argL}) = ${f2(yl)}, \quad ${P.name}(${argR}) = ${f2(yr)}`}</M></div>
        {s > 0.97
          ? <div className={`w2-big ${jump ? 'w2-no' : 'w2-ok'}`}>{jump
            ? <>{tr('links', 'left')} <M>{t`\to ${f2(L)}`}</M>, {tr('rechts', 'right')} <M p=":">{t`\to ${f2(R)}`}</M> {tr('verschieden – ein Sprung, nicht stetig.', 'different – a jump, not continuous.')}</>
            : <>{tr('beide Seiten', 'both sides')} <M p=":">{t`\to ${f2(L)}`}</M> {tr('gleich – kein Sprung.', 'equal – no jump.')}</>}</div>
          : <p className="vdemo-note">{tr(<>Schiebe <M>h</M> gegen <M p=",">0</M> oder tippe «Annähern». Die zwei roten Punkte laufen von links und von rechts auf die Stelle zu; links auf der <M>y</M>-Achse siehst du ihre Funktionswerte.</>,
            <>Slide <M>h</M> towards <M p=",">0</M> or tap “Approach”. The two red points run towards the place from the left and from the right; on the <M>y</M>-axis you see their function values.</>)}</p>}
      </figcaption>
    </figure>
  );
}

/* ================================================================== cancelling: the hole at x = 2 */

const kOrig = (x: number) => (x * x - 4) / (x * x + x - 6);
export function CancelFig({ fr }: { fr: CancelFrame }) {
  const tr = useTr();
  return (
    <Plot x={CANCEL_X} y={[-0.2, 1.15]} grid={[1, 0.2]} tick={[1, 0.2]} label={tr('Graph mit Loch bei x = 2', 'Graph with a hole at x = 2')}>
      {fr.reducedTo > CANCEL_X[0] && <Curve f={kuerzenReduced} dom={[CANCEL_X[0], fr.reducedTo]} role="g" dashed width={3.2} />}
      <Curve f={kOrig} breaks={[2]} />
      {fr.h !== null && <>
        {[2 - fr.h, 2 + fr.h].map((x, i) => <g key={i}><Seg a={[x, 0]} b={[x, kOrig(x)]} dashed /><Pt x={x} y={kOrig(x)} /></g>)}
      </>}
      {fr.limit
        ? <><Seg a={[0, 0.8]} b={[2, 0.8]} dashed /><Pt x={2} y={0.8} /><PLabel x={2} y={0.8} dx={-6} dy={-16} anchor="r" tex={t`\tfrac45`} role="pt" /></>
        : <Pt x={2} y={0.8} role="f" open />}
      <PLabel x={4.9} y={1.02} tex={t`\frac{x^2-4}{x^2+x-6}`} role="f" small />
      {fr.reducedTo > 4.9 && <PLabel x={4.9} y={0.62} tex={t`\frac{x+2}{x+3}`} role="g" small />}
    </Plot>
  );
}

/* ================================================================== largest power: towards ½ */

export function PowerFig() {
  const tr = useTr();
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <Plot x={[-2, 42]} y={[-0.2, 2.2]} h={220} grid={[5, 0.5]} tick={[10, 0.5]} label={tr('Graph nähert sich der Höhe ein halb', 'Graph approaching the height one half')}>
          <HLine y={0.5} />
          <Curve f={(x) => (x * x + 5 * x) / (2 * x * x)} dom={[1.2, 42]} />
          <PLabel x={30} y={0.5} dy={-14} tex={t`y = \tfrac12`} role="asym" small />
          <PLabel x={4} y={1.6} anchor="l" tex={t`\frac{x^2+5x}{2x^2}`} role="f" small />
        </Plot>
      </div>
      <p className="vdemo-note">{tr(<>Für grosse <M>x</M> zählt nur die grösste Potenz: Der Graph kommt der Höhe <M>{t`\tfrac12`}</M> beliebig nahe.</>, <>For large <M>x</M> only the largest power counts: the graph comes arbitrarily close to the height <M p=".">{t`\tfrac12`}</M></>)}</p>
    </figure>
  );
}

/* ================================================================== sin x / x on the unit circle */

export function SinCircle({ fr }: { fr: SinFrame }) {
  const tr = useTr(), lang = useLang();
  const s = sinShapes(fr.x);
  const quarter = sinShapes(Math.PI / 2, 60).arc;
  const n4 = (v: number) => fmtNum(v, 4, lang, true);
  const half = (v: number) => fmtNum(v / 2, 3, lang, true);
  const mid = fr.x / 2;
  return (
    <div className="w2-sin">
      <Plot x={[-0.15, 1.3]} y={[-0.15, 1.42]} w={360} h={380} grid={[0.5, 0.5]} tick={[0.5, 0.5]} label={tr('Einheitskreis mit Winkel x, Dreiecken und Sektor', 'Unit circle with angle x, triangles and sector')}>
        <Path pts={quarter} role="ref" />
        <Seg a={[1, -0.15]} b={[1, 1.42]} dashed />
        {fr.big && <Path pts={s.big} role="g" fill />}
        {fr.sector && <Path pts={s.sector} role="sec" fill />}
        {fr.small && <Path pts={s.small} role="f" fill />}
        <Seg a={[0, 0]} b={s.P} role="fg" width={1.6} />
        <Path pts={s.arc} role="asym" />
        {fr.small && <Seg a={s.P} b={s.foot} role="f" width={3} />}
        {fr.big && <><Seg a={s.A} b={s.T} role="g" width={3} /><Seg a={[0, 0]} b={s.T} role="g" width={1.4} /></>}
        <Pt x={0} y={0} r={3.5} /><Pt x={1} y={0} r={3.5} /><Pt x={s.P[0]} y={s.P[1]} r={3.5} />
        {fr.big && <Pt x={1} y={s.T[1]} r={3.5} />}
        <PLabel x={0} y={0} dx={-8} dy={10} anchor="r" tex="O" role="pt" small />
        <PLabel x={1} y={0} dx={8} dy={10} anchor="l" tex="A" role="pt" small />
        <PLabel x={s.P[0]} y={s.P[1]} dx={-8} dy={-10} anchor="r" tex="P" role="pt" small />
        {fr.big && <PLabel x={1} y={s.T[1]} dx={8} anchor="l" tex="T" role="pt" small />}
        {fr.x > 0.6 && <PLabel x={0.9 * Math.cos(mid)} y={0.9 * Math.sin(mid)} dx={-2} anchor="r" tex="x" role="asym" />}
        {fr.small && <PLabel x={s.P[0]} y={s.P[1] / 2} dx={-6} anchor="r" tex={t`\sin x`} role="f" small />}
        {fr.big && <PLabel x={1} y={s.T[1] / 2} dx={8} anchor="l" tex={t`\tan x`} role="g" small />}
      </Plot>
      <div className="vdemo-readout w2-sin-read">
        {!fr.small && <M>{t`x = ${fmtNum(fr.x, 2, lang, true)}`}</M>}
        {fr.small && !fr.squeeze && <M>{[
          t`\text{${tr('blau', 'blue')}} = \tfrac12\sin x = ${half(Math.sin(fr.x))}`,
          fr.sector ? t`\;\le\; \text{${tr('türkis', 'teal')}} = \tfrac12 x = ${half(fr.x)}` : '',
          fr.big ? t`\;\le\; \text{magenta} = \tfrac12\tan x = ${half(Math.tan(fr.x))}` : '',
        ].join('')}</M>}
        {fr.squeeze && <M>{t`1 \;\le\; \frac{x}{\sin x} = ${n4(fr.x / Math.sin(fr.x))} \;\le\; \frac{1}{\cos x} = ${n4(1 / Math.cos(fr.x))}`}</M>}
      </div>
    </div>
  );
}

/* ================================================================== x·sin(1/x) between ±|x| */

export function XSinFig() {
  const tr = useTr();
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <Plot x={[-0.5, 0.5]} y={[-0.52, 0.52]} h={260} grid={[0.1, 0.1]} tick={[0.25, 0.25]} label={tr('x mal sin(1/x), eingeklemmt zwischen −|x| und |x|', 'x times sin(1/x), squeezed between −|x| and |x|')}>
          <Curve f={Math.abs} role="ref" dashed /><Curve f={(x) => -Math.abs(x)} role="ref" dashed />
          <Curve f={(x) => (x === 0 ? NaN : x * Math.sin(1 / x))} n={6000} width={1.6} />
          <Pt x={0} y={0} role="f" open r={3.5} />
          <PLabel x={0.4} y={0.4} dx={-8} anchor="r" tex="|x|" role="muted" small />
          <PLabel x={0.4} y={-0.4} dx={-8} anchor="r" tex="-|x|" role="muted" small />
        </Plot>
      </div>
      <p className="vdemo-note">{tr(<><M>{t`\sin(1/x)`}</M> schwingt immer schneller, bleibt aber zwischen <M>-1</M> und <M p=".">1</M> Darum bleibt <M>{t`x\sin(1/x)`}</M> zwischen den grauen Linien <M>{t`\pm|x|`}</M> – und die laufen in <M>{t`(0, 0)`}</M> zusammen.</>,
        <><M>{t`\sin(1/x)`}</M> oscillates faster and faster but stays between <M>-1</M> and <M p=".">1</M> So <M>{t`x\sin(1/x)`}</M> stays between the grey lines <M>{t`\pm|x|`}</M> – and they meet at <M p=".">{t`(0, 0)`}</M></>)}</p>
    </figure>
  );
}

/* ================================================================== L'Hôpital: zoom in, graphs become their tangents */

export function LhZoom() {
  const tr = useTr(), lang = useLang();
  const [s, setS] = useState(0);
  const approach = useApproach(setS);
  const w = zoomW(s), win = zoomWindow(w), x0 = 0.6 * w;
  const fx = lhF(x0), gx = lhG(x0);
  const lbl = 0.8 * w;
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <Plot x={win.x} y={win.y} grid={[win.step, win.step]} tick={[win.step, 2 * win.step]} label={tr('Zwei Graphen durch den Ursprung mit ihren Tangenten, zoombar', 'Two graphs through the origin with their tangents, zoomable')}>
          <Line p={[0, 0]} m={LH_SLOPES.f} role="f" dashed />
          <Line p={[0, 0]} m={LH_SLOPES.g} role="g" dashed />
          <Curve f={lhF} /><Curve f={lhG} role="g" />
          <Seg a={[x0, 0]} b={[x0, fx]} role="f" width={4.5} />
          <Seg a={[x0 + 0.05 * w, 0]} b={[x0 + 0.05 * w, gx]} role="g" width={4.5} />
          <Pt x={x0} y={fx} r={3.5} /><Pt x={x0 + 0.05 * w} y={gx} r={3.5} />
          <PLabel x={lbl} y={lhF(lbl)} dy={16} tex="f" role="f" />
          <PLabel x={lbl} y={lhG(lbl)} dx={-6} dy={-14} anchor="r" tex="g" role="g" />
          <PLabel x={x0} y={0} dy={14} tex="x" role="fg" small />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider"><span>{tr('Zoom', 'zoom')}</span>
          <input type="range" min={0} max={1} step={0.01} value={s} onChange={(e) => setS(Number(e.target.value))} aria-label="zoom" /><span className="val">{fmtNum(w, 2, lang)}</span></label>
        <div className="motion-row"><button type="button" className="motion-btn" onClick={() => approach(3200)}>{tr('Hineinzoomen', 'Zoom in')}</button></div>
        <div className="w2-big"><M>{t`\frac{f(x)}{g(x)} = \frac{${fmtNum(fx, 4, lang, true)}}{${fmtNum(gx, 4, lang, true)}} = ${fmtNum(fx / gx, 3, lang, true)}`}</M></div>
        <div className="w2-big"><M>{t`\frac{f'(0)}{g'(0)} = \frac{2}{1} = 2`}</M></div>
        <p className="vdemo-note">{tr(<>Blau <M p=",">{t`f(x) = \sin(2x)`}</M> magenta <M p=";">{t`g(x) = e^x - 1`}</M> beide sind <M>0</M> bei <M p=".">0</M> Gestrichelt ihre Tangenten. Je näher du hinschaust, desto mehr fallen Graph und Tangente zusammen – und das Verhältnis der Höhen (dicke Striche) wird zum Verhältnis der Steigungen.</>,
          <>Blue <M p=",">{t`f(x) = \sin(2x)`}</M> magenta <M p=";">{t`g(x) = e^x - 1`}</M> both are <M>0</M> at <M p=".">0</M> Dashed: their tangents. The closer you look, the more graph and tangent coincide – and the ratio of the heights (thick bars) becomes the ratio of the slopes.</>)}</p>
      </figcaption>
    </figure>
  );
}

/* ================================================================== A-008 counter-example */

export function CexFig() {
  const tr = useTr();
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <Plot x={[-1.5, 42]} y={[-0.3, 2.7]} h={220} grid={[5, 0.5]} tick={[10, 1]} label={tr('Quotient strebt gegen 1, Quotient der Ableitungen schwingt', 'Quotient tends to 1, quotient of derivatives oscillates')}>
          <HLine y={1} role="ref" />
          <Curve f={cexDeriv} dom={[0.5, 42]} role="g" n={1200} width={2} />
          <Curve f={cexRatio} dom={[0.5, 42]} n={1200} />
          <PLabel x={23} y={2.4} anchor="r" tex={t`\frac{x+\sin x}{x}`} role="f" small />
          <PLabel x={26} y={2.4} anchor="l" tex={t`\frac{f'}{g'} = 1+\cos x`} role="g" small />
        </Plot>
      </div>
      <p className="vdemo-note">{tr(<>Blau der Quotient: Er strebt gegen <M p=".">1</M> Magenta der Quotient der Ableitungen: Er schwingt ewig zwischen <M>0</M> und <M>2</M> und hat keinen Grenzwert.</>,
        <>Blue: the quotient; it tends to <M p=".">1</M> Magenta: the quotient of the derivatives; it swings between <M>0</M> and <M>2</M> forever and has no limit.</>)}</p>
    </figure>
  );
}
