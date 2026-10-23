import { useState } from 'react';
import { M } from '../../components/Tex';
import { T, useTr } from '../../i18n';
import { add, mul, q, tex, type Q } from '../../linalg/frac';
import { combine, eqTex, lineKind, lineParam, pointOnLine, qNum, twoLines, type Eq2 } from '../../linalg/lines2';
import { ELine, PLabel, Plot, Pt } from '../plot/Plot';
import { Presets, Slider } from './Controls12';
import type { LineScene, Win } from './lineScenes';
import './l12.css';

const t = String.raw;
/** h of a viewBox of width w with the same scale in x and y (pad 14 as in makeFrame) */
const sameScale = (x: readonly [number, number], y: readonly [number, number], w = 400) => Math.round(28 + ((y[1] - y[0]) * (w - 28)) / (x[1] - x[0]));
/** a rational number in TeX, negative ones in brackets (for products like 4·(−1/2)) */
const br = (v: Q) => (v[0] < 0 ? `\\left(${tex(v)}\\right)` : tex(v));

/* ================================================================ step animations: a LineScene in the shared Plot */
export function LineSceneFig({ scene, win, label }: { scene: LineScene; win: Win; label: string }) {
  return (
    <div className="anim-fig l12-lines">
      <Plot x={win.x} y={win.y} w={win.w} h={win.h} grid={[1, 1]} tick={[1, 1]} label={label}>
        {scene.lines.map((l) => l.o > 0.01 && <g key={l.key} style={{ opacity: l.o }}><ELine a={l.e[0]} b={l.e[1]} c={l.e[2]} role={l.role} dashed={l.dashed} width={2.6} /></g>)}
        {scene.points.map((p) => p.o > 0.01 && <g key={p.key} style={{ opacity: p.o }}><Pt x={p.x} y={p.y} role={p.role} r={5} /></g>)}
        {scene.labels.map((l) => l.o > 0.5 && <PLabel key={l.key} x={l.x} y={l.y} tex={l.tex} role={l.role} anchor={l.anchor} dx={l.dx} dy={l.dy} small />)}
      </Plot>
    </div>
  );
}

/* ================================================================ (b) one equation = one line (slide 5) */
const LX = 6, LY = 5;
export function LineExplorer() {
  const tr = useTr();
  const [a, setA] = useState(4), [b, setB] = useState(6), [c, setC] = useState(10);
  const [u, setU] = useState(1);
  const e: Eq2 = [a, b, c];
  const kind = lineKind(e);
  const rng = lineParam(e, LX, LY);
  const uu = rng ? Math.min(rng.hi, Math.max(rng.lo, Math.round(u * 2) / 2)) : 0;
  const P = rng ? pointOnLine(e, rng.fixed, q(Math.round(uu * 2), 2)) : undefined;
  const drag = (x: number, y: number) => { if (rng) setU(rng.fixed === 'x' ? x : y); };
  const y = sameScale([-LX, LX], [-LY, LY]);
  return (
    <figure className="vdemo l12-lines">
      <div className="vdemo-fig">
        <Plot x={[-LX, LX]} y={[-LY, LY]} w={400} h={y} grid={[1, 1]} tick={[2, 2]} onDrag={drag}
          label={tr('Die Gerade a x + b y = c mit einem verschiebbaren Punkt', 'The line a x + b y = c with a draggable point')}>
          {kind === 'line' && <ELine a={a} b={b} c={c} role="f" width={2.6} />}
          {P && <>
            <Pt x={qNum(P)[0]} y={qNum(P)[1]} role="pt" r={6} />
            <PLabel x={qNum(P)[0]} y={qNum(P)[1]} dx={10} dy={-14} anchor="l" small role="pt" tex={t`(x_0, y_0)`} />
          </>}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="l12-verdict"><M>{eqTex([a, b], c)}</M></div>
        <div className="l12-sliders flat">
          <Slider label={<M>a</M>} min={-6} max={6} step={1} value={a} onChange={setA} aria="a" show={String(a)} />
          <Slider label={<M>b</M>} min={-6} max={6} step={1} value={b} onChange={setB} aria="b" show={String(b)} />
          <Slider label={<M>c</M>} min={-12} max={12} step={1} value={c} onChange={setC} aria="c" show={String(c)} />
        </div>
        {P && <>
          <div><M>{t`(x_0, y_0) = (${tex(P[0])},\ ${tex(P[1])})`}</M></div>
          <div className="l12-verdict one"><M p={' ✓'}>{t`${a}\cdot ${br(P[0])} + ${br(q(b))}\cdot ${br(P[1])} = ${tex(mul(q(a), P[0]))} + ${br(mul(q(b), P[1]))} = ${tex(add(mul(q(a), P[0]), mul(q(b), P[1])))}`}</M></div>
        </>}
        <p className="vdemo-note">{kind === 'all'
          ? <T de={<>Mit <M>{t`a = b = 0`}</M> und <M>{t`c = 0`}</M> steht da <M p=":">{t`0 = 0`}</M> Jeder Punkt der Ebene ist eine Lösung.</>} en={<>With <M>{t`a = b = 0`}</M> and <M>{t`c = 0`}</M> the equation reads <M p=":">{t`0 = 0`}</M> every point of the plane is a solution.</>} />
          : kind === 'empty'
            ? <T de={<>Mit <M>{t`a = b = 0`}</M> und <M>{t`c \neq 0`}</M> steht da <M p=":">{t`0 = ${c}`}</M> Kein Punkt ist eine Lösung.</>} en={<>With <M>{t`a = b = 0`}</M> and <M>{t`c \neq 0`}</M> the equation reads <M p=":">{t`0 = ${c}`}</M> no point is a solution.</>} />
            : !rng
              ? tr('Die Gerade liegt ausserhalb des Bildes.', 'The line lies outside the picture.')
              : <T de={<>Zieh den roten Punkt: Er bleibt auf der Geraden, und die Gleichung stimmt für jeden Punkt.</>} en={<>Drag the red point: it stays on the line, and the equation holds for every point.</>} />}</p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ (c) a system = intersection (slides 6–10) */
const TX = 5, TY = 4;
type TwoId = 'one' | 'same' | 'par';
const TWO: Record<TwoId, [Eq2, Eq2]> = { one: [[2, 3, 5], [3, -2, 0]], same: [[2, 3, 5], [4, 6, 10]], par: [[2, 3, 5], [4, 6, 5]] };
const sameEq = (p: Eq2, r: Eq2) => p.every((v, i) => v === r[i]);
export function TwoLinesExplorer() {
  const tr = useTr();
  const [E, setE] = useState<[Eq2, Eq2]>(TWO.one);
  const set = (k: 0 | 1, i: 0 | 1 | 2, v: number) => setE((old) => { const n = [[...old[0]], [...old[1]]]; n[k][i] = v; return n as unknown as [Eq2, Eq2]; });
  const r = twoLines(E[0], E[1]);
  const preset = (Object.keys(TWO) as TwoId[]).find((k) => sameEq(TWO[k][0], E[0]) && sameEq(TWO[k][1], E[1])) ?? null;
  const P = r.point ? qNum(r.point) : null;
  const inWin = P && Math.abs(P[0]) <= TX && Math.abs(P[1]) <= TY;
  const sl = (k: 0 | 1, i: 0 | 1 | 2, name: string) => (
    <Slider label={<M>{name}</M>} min={i === 2 ? -12 : -6} max={i === 2 ? 12 : 6} step={1} value={E[k][i]} onChange={(v) => set(k, i, v)} aria={name.replace(/[_{}]/g, '')} show={String(E[k][i])} />
  );
  return (
    <figure className="vdemo l12-lines">
      <div className="vdemo-fig">
        <Plot x={[-TX, TX]} y={[-TY, TY]} w={400} h={sameScale([-TX, TX], [-TY, TY])} grid={[1, 1]} tick={[1, 1]}
          label={tr('Zwei Geraden: Schnittpunkt, gleiche Gerade oder parallel', 'Two lines: intersection point, same line or parallel')}>
          {lineKind(E[0]) === 'line' && <ELine a={E[0][0]} b={E[0][1]} c={E[0][2]} role="f" width={r.rel === 'same' ? 6 : 2.6} />}
          {lineKind(E[1]) === 'line' && <ELine a={E[1][0]} b={E[1][1]} c={E[1][2]} role="g" width={2.6} dashed={r.rel === 'same'} />}
          {inWin && <><Pt x={P![0]} y={P![1]} role="pt" r={5.5} /><PLabel x={P![0]} y={P![1]} dx={10} dy={-14} anchor="l" small role="pt" tex={t`(${tex(r.point![0])},\ ${tex(r.point![1])})`} /></>}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <Presets label={tr('Beispiele der Folien', 'Examples of the slides')} value={preset} onPick={(id) => setE(TWO[id])}
          items={[{ id: 'one', label: tr('ein Punkt', 'one point') }, { id: 'same', label: tr('gleiche Gerade', 'same line') }, { id: 'par', label: tr('parallel', 'parallel') }]} />
        <div className="l12-eqs">
          <div><span className="l12-swatch" style={{ background: 'var(--a-f)' }} /><M>{t`E_1:\ ${eqTex([E[0][0], E[0][1]], E[0][2])}`}</M></div>
          <div><span className="l12-swatch" style={{ background: 'var(--a-g)' }} /><M>{t`E_2:\ ${eqTex([E[1][0], E[1][1]], E[1][2])}`}</M></div>
        </div>
        <div className={`l12-verdict ${r.rel === 'cross' ? 'one' : r.rel === 'same' || r.rel === 'all' ? 'many' : 'none'}`}>
          {r.rel === 'cross' && <T de={<><b>Genau eine Lösung:</b> <M p=".">{t`(x, y) = (${tex(r.point![0])},\ ${tex(r.point![1])})`}</M></>} en={<><b>Exactly one solution:</b> <M p=".">{t`(x, y) = (${tex(r.point![0])},\ ${tex(r.point![1])})`}</M></>} />}
          {r.rel === 'same' && <T de={<><b>Unendlich viele Lösungen:</b> beide Gleichungen beschreiben dieselbe Gerade.</>} en={<><b>Infinitely many solutions:</b> both equations describe the same line.</>} />}
          {r.rel === 'parallel' && <T de={<><b>Keine Lösung:</b> die Geraden sind parallel und berühren sich nie.</>} en={<><b>No solution:</b> the lines are parallel and never meet.</>} />}
          {r.rel === 'all' && <T de={<><b>Jeder Punkt ist eine Lösung</b> (zweimal <M p=").">{t`0 = 0`}</M></>} en={<><b>Every point is a solution</b> (twice <M p=").">{t`0 = 0`}</M></>} />}
          {r.rel === 'empty' && <T de={<><b>Keine Lösung:</b> eine Gleichung lautet <M p=".">{t`0 = c \neq 0`}</M></>} en={<><b>No solution:</b> one equation reads <M p=".">{t`0 = c \neq 0`}</M></>} />}
        </div>
        <div className="l12-state"><M>{t`a_1 b_2 - a_2 b_1 = ${r.det}`}</M>{' '}{r.det !== 0 ? tr('(nicht parallel)', '(not parallel)') : tr('(parallel oder gleich)', '(parallel or the same)')}</div>
        {inWin === false && r.rel === 'cross' && <p className="vdemo-note">{tr('Der Schnittpunkt liegt ausserhalb des Bildes.', 'The intersection lies outside the picture.')}</p>}
        <div className="l12-sliders cols">
          {sl(0, 0, 'a_1')}{sl(0, 1, 'b_1')}{sl(0, 2, 'c_1')}
          {sl(1, 0, 'a_2')}{sl(1, 1, 'b_2')}{sl(1, 2, 'c_2')}
        </div>
      </figcaption>
    </figure>
  );
}

/* ================================================================ (d) combining equations (slides 11–12) */
type CombId = 'sum' | 'diff' | 'three';
const COMB: Record<CombId, [number, number]> = { sum: [1, 1], diff: [-1, 1], three: [3, 1] };
const CE1: Eq2 = [2, 3, 5], CE2: Eq2 = [1, -2, -1];
const CW = { x: [-3, 5] as const, y: [-2, 4.5] as const };
export function CombineExplorer() {
  const tr = useTr();
  const [al, setAl] = useState(1), [be, setBe] = useState(1);
  const S = combine(CE1, CE2, al, be);
  const preset = (Object.keys(COMB) as CombId[]).find((k) => COMB[k][0] === al && COMB[k][1] === be) ?? null;
  const zero = al === 0 && be === 0;
  const name = `${al === 1 ? '' : al === -1 ? '-' : al}E_1${be < 0 ? '-' : '+'}${Math.abs(be) === 1 ? '' : Math.abs(be)}E_2`;
  return (
    <figure className="vdemo l12-lines">
      <div className="vdemo-fig">
        <Plot x={CW.x} y={CW.y} w={400} h={sameScale(CW.x, CW.y)} grid={[1, 1]} tick={[1, 1]}
          label={tr('E1, E2 und ihre Kombination: alle gehen durch den Punkt (1, 1)', 'E1, E2 and their combination: all pass through the point (1, 1)')}>
          <ELine a={CE1[0]} b={CE1[1]} c={CE1[2]} role="f" width={2.2} />
          <ELine a={CE2[0]} b={CE2[1]} c={CE2[2]} role="g" width={2.2} />
          {!zero && <ELine a={S[0]} b={S[1]} c={S[2]} role="sec" width={3.2} />}
          <Pt x={1} y={1} role="pt" r={5.5} />
          <PLabel x={1} y={1} dx={10} dy={14} anchor="l" small role="pt" tex="(1, 1)" />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <Presets label={tr('Kombinationen der Folie', 'Combinations of the slide')} value={preset} onPick={(id) => { setAl(COMB[id][0]); setBe(COMB[id][1]); }}
          items={[{ id: 'sum', label: <M>{'E_1+E_2'}</M> }, { id: 'diff', label: <M>{'-E_1+E_2'}</M> }, { id: 'three', label: <M>{'3E_1+E_2'}</M> }]} />
        <div className="l12-eqs">
          <div><span className="l12-swatch" style={{ background: 'var(--a-f)' }} /><M>{'E_1:\\ 2x+3y=5'}</M></div>
          <div><span className="l12-swatch" style={{ background: 'var(--a-g)' }} /><M>{'E_2:\\ x-2y=-1'}</M></div>
          <div><span className="l12-swatch" style={{ background: 'var(--a-sec)' }} /><M>{zero ? t`0\cdot E_1 + 0\cdot E_2:\ 0 = 0` : t`${name}:\ ${eqTex([S[0], S[1]], S[2])}`}</M></div>
        </div>
        <Slider label={<M>\alpha</M>} min={-4} max={4} step={1} value={al} onChange={setAl} aria="alpha" show={String(al)} />
        <Slider label={<M>\beta</M>} min={-4} max={4} step={1} value={be} onChange={setBe} aria="beta" show={String(be)} />
        <div className="l12-verdict one">{zero
          ? <T de={<>Mit <M>{t`\alpha = \beta = 0`}</M> bleibt nur <M p=":">{t`0 = 0`}</M> keine Gerade mehr.</>} en={<>With <M>{t`\alpha = \beta = 0`}</M> only <M>{t`0 = 0`}</M> is left: no line any more.</>} />
          : <T de={<>Probe bei <M p=":">{t`(1, 1)`}</M> <M p={' ✓'}>{t`${S[0]}\cdot 1 ${S[1] < 0 ? '-' : '+'} ${Math.abs(S[1])}\cdot 1 = ${S[2]}`}</M></>} en={<>Check at <M p=":">{t`(1, 1)`}</M> <M p={' ✓'}>{t`${S[0]}\cdot 1 ${S[1] < 0 ? '-' : '+'} ${Math.abs(S[1])}\cdot 1 = ${S[2]}`}</M></>} />}</div>
        <p className="vdemo-note">{tr('Welche Zahlen du auch wählst: die neue (türkise) Gerade dreht sich immer um denselben Punkt.', 'Whatever numbers you choose: the new (teal) line always turns about the same point.')}</p>
      </figcaption>
    </figure>
  );
}
