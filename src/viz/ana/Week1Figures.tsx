import { useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { Band, HLine, Path, Plot, PLabel, Pt, Seg, VLine, usePlot, type Role } from '../plot/Plot';
import { EXPLORER, FRACS, SLIDE, degreeLimit, divided, entryIndex, fracValue, type ExplorerKey, type FracKey } from '../../analysis/folgen';
import { geoLimit, geoSum } from '../../analysis/reihen';
import type { Scene } from './week1Scenes';
import { num } from './week1Scenes';
import { polyNumTex, polyTex, signedTex } from './week1Tex';

const t = String.raw;
const R = (r: string) => r as Role; // the week-1 group colours grp0…grp3 are extra classes (styles.css, «ana week 1»)

/** Draws a pure scene (week1Scenes.ts) with the shared plot. */
export function SceneView({ scene: s, label }: { scene: Scene; label: string }) {
  return (
    <Plot x={s.x} y={s.y} w={s.w} h={s.h} grid={s.grid} tick={s.tick} axes={s.axes} label={label} className={s.w && s.w === s.h ? "w1-anim square" : "w1-anim"}>
      {s.bands.map((b, i) => <Band key={`b${i}`} from={b.from} to={b.to} />)}
      {s.polys.map((p, i) => <Path key={`p${i}`} pts={p.pts} role={R(p.role)} fill={p.fill} closed dashed={p.dashed} />)}
      {s.hlines.map((h, i) => <HLine key={`h${i}`} y={h.at} role={R(h.role)} dashed={!!h.dashed} />)}
      {s.vlines.map((v, i) => <VLine key={`v${i}`} x={v.at} role={R(v.role)} dashed={!!v.dashed} />)}
      {s.pts.map((p, i) => <Pt key={`q${i}`} x={p.x} y={p.y} role={R(p.role)} r={p.r ?? 4} />)}
      {s.labels.map((l, i) => <PLabel key={`l${i}`} x={l.x} y={l.y} tex={l.tex} role={R(l.role)} anchor={l.anchor} dx={l.dx} dy={l.dy} small={l.small} />)}
    </Plot>
  );
}
/** Scene for the current language. */
export function SceneFig({ build, step, t: tt, label }: { build: (s: number, t: number, l: 'de' | 'en') => Scene; step: number; t: number; label: string }) {
  const lang = useLang();
  return <SceneView scene={build(step, tt, lang)} label={label} />;
}

/* ------------------------------------------------------------------ the slide's picture (U01 p. 10) */
function Square({ x, y }: { x: number; y: number }) {
  const f = usePlot();
  return <rect className="w1-square" x={f.sx(x) - 5} y={f.sy(y) - 5} width={10} height={10} />;
}
function Cross({ x, y }: { x: number; y: number }) {
  const f = usePlot(), X = f.sx(x), Y = f.sy(y);
  return <g className="w1-cross"><line x1={X - 5} y1={Y - 5} x2={X + 5} y2={Y + 5} /><line x1={X - 5} y1={Y + 5} x2={X + 5} y2={Y - 5} /></g>;
}
/** U01 p. 10: blue squares «divergent», green crosses «konvergent & beschränkt», magenta circles «divergent & beschränkt». */
export function SlideKinds() {
  const tr = useTr();
  const ns = Array.from({ length: 14 }, (_, i) => i + 1);
  return (
    <figure className="vdemo">
      <div className="vdemo-fig wide">
        <Plot x={[0, 15]} y={[-1, 4.9]} grid={[0, 0]} tick={[0, 0]} axes={['n', 'a_n']} label={tr('Drei Arten von Folgen wie im Übungsblatt', 'Three kinds of sequences as on the slide')}>
          {ns.map((n) => <Square key={`s${n}`} x={n} y={SLIDE.div(n)} />)}
          {ns.map((n) => <Cross key={`c${n}`} x={n} y={SLIDE.conv(n)} />)}
          {ns.map((n) => <Pt key={`o${n}`} x={n} y={SLIDE.osc(n)} role="g" open r={4} />)}
        </Plot>
      </div>
      <ul className="w1-legend">
        <li><svg viewBox="0 0 14 14" aria-hidden="true"><rect className="w1-square" x={2} y={2} width={10} height={10} /></svg>{tr('divergent (wächst über jede Grenze)', 'divergent (grows beyond every bound)')}</li>
        <li><svg viewBox="0 0 14 14" aria-hidden="true"><g className="w1-cross"><line x1={2} y1={2} x2={12} y2={12} /><line x1={2} y1={12} x2={12} y2={2} /></g></svg>{tr('konvergent & beschränkt', 'convergent & bounded')}</li>
        <li><svg viewBox="0 0 14 14" aria-hidden="true"><circle className="pl-dot pl-g open" cx={7} cy={7} r={4.5} /></svg>{tr('divergent & beschränkt (pendelt)', 'divergent & bounded (oscillates)')}</li>
      </ul>
    </figure>
  );
}

/* ------------------------------------------------------------------ the ε-strip explorer (supplement) */
const SEQ_TEX: Record<ExplorerKey, string> = { mono: t`a_n = \frac{n}{n+1}`, alt: t`a_n = 1 + \frac{(-1)^n}{n}`, osc: t`a_n = (-1)^n`, grow: t`a_n = \frac{n}{10}` };
const N_SHOWN = 30;

/**
 * Pick a sequence and a strip. «Parallelstreifen»: one strip of finite width holds every term (bounded).
 * «ε-Streifen»: a strip of half-width ε about L; from some N on every term stays inside (convergent).
 */
export function StripExplorer() {
  const tr = useTr(), lang = useLang();
  const [key, setKey] = useState<ExplorerKey>('alt');
  const [mode, setMode] = useState<'bound' | 'eps'>('eps');
  const [eps, setEps] = useState(0.3);
  const [cand, setCand] = useState(0);
  const s = EXPLORER[key];
  const L = s.L ?? cand;
  const N = mode === 'eps' ? entryIndex(s.a, L, eps, 5000, 1, s.dist) : null;
  const inside = (n: number) => Math.abs(s.a(n) - L) < eps;
  const ns = Array.from({ length: N_SHOWN }, (_, i) => i + 1);
  const choose = (k: ExplorerKey) => { setKey(k); setCand(k === 'grow' ? 1 : 0); };
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {(['mono', 'alt', 'osc', 'grow'] as ExplorerKey[]).map((k) => (
          <button key={k} type="button" aria-pressed={key === k} onClick={() => choose(k)}><M>{SEQ_TEX[k]}</M></button>
        ))}
      </div>
      <div className="vdemo-fig wide">
        <Plot x={[0, N_SHOWN + 0.8]} y={[-1.4, 3.2]} grid={[5, 0.5]} tick={[5, 1]} axes={['n', 'a_n']}
          label={tr('Folge mit Streifen: Glieder innerhalb blau, ausserhalb rot', 'Sequence with a strip: terms inside blue, outside red')}>
          {mode === 'bound' && s.sup !== null && <>
            <Band from={s.inf} to={s.sup} />
            <HLine y={s.inf} role="g" dashed={false} /><HLine y={s.sup} role="g" dashed={false} />
          </>}
          {mode === 'eps' && <>
            <Band from={L - eps} to={L + eps} />
            <HLine y={L} role="asym" />
            <PLabel x={N_SHOWN + 0.6} y={L} tex={s.L !== null ? `L = ${num(L, 2, lang)}` : `L = ${num(L, 2, lang)}\\,?`} role="asym" anchor="r" dy={-12 - (eps / 4.6) * 272} small />
            {N !== null && N > 1 && <>
              <VLine x={N - 0.5} role="aux" />
              <PLabel x={N - 0.5} y={-1.4} tex={`N = ${N}`} role="muted" anchor="l" dx={4} dy={-12} small />
            </>}
          </>}
          {ns.map((n) => <Pt key={n} x={n} y={s.a(n)} r={3.6} role={mode === 'eps' && !inside(n) ? 'pt' : 'f'} />)}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="v-presets">
          <button type="button" aria-pressed={mode === 'bound'} onClick={() => setMode('bound')}>{tr('Parallelstreifen (beschränkt?)', 'parallel strip (bounded?)')}</button>
          <button type="button" aria-pressed={mode === 'eps'} onClick={() => setMode('eps')}><M>\varepsilon</M>{tr('-Streifen (konvergent?)', '-strip (convergent?)')}</button>
        </div>
        {mode === 'eps' && <>
          <label className="slider wide-slider"><span><M>\varepsilon</M></span>
            <input type="range" min={0.05} max={1} step={0.01} value={eps} onChange={(e) => setEps(Number(e.target.value))} aria-label="epsilon" /><span className="val">{fmtNum(eps, 2, lang)}</span></label>
          {s.L === null && <label className="slider wide-slider"><span><M>L</M>?</span>
            <input type="range" min={-1} max={2} step={0.05} value={cand} onChange={(e) => setCand(Number(e.target.value))} aria-label={tr('Kandidat L', 'candidate L')} /><span className="val">{fmtNum(cand, 2, lang)}</span></label>}
        </>}
        <div className={`v-result rt-readout ${(mode === 'eps' ? N !== null : s.sup !== null) ? 'pos' : 'neg'}`}>
          {mode === 'bound' && key === 'mono' && <span><M>{t`\tfrac12 \le a_n < 1`}</M> {tr('– beschränkt, monoton wachsend', '– bounded, increasing')}</span>}
          {mode === 'bound' && key === 'alt' && <span><M>{t`0 \le a_n \le \tfrac32`}</M> {tr('– beschränkt, nicht monoton', '– bounded, not monotonic')}</span>}
          {mode === 'bound' && key === 'osc' && <span><M>{t`-1 \le a_n \le 1`}</M> {tr('– beschränkt, nicht monoton', '– bounded, not monotonic')}</span>}
          {mode === 'bound' && key === 'grow' && <span>{tr('Kein Streifen reicht – unbeschränkt', 'No strip is wide enough – unbounded')}</span>}
          {mode === 'eps' && N !== null && <span>{tr('Ab', 'From')} <M>{`n = ${N}`}</M> {tr('liegen alle Glieder im Streifen', 'on, every term lies in the strip')}</span>}
          {mode === 'eps' && N === null && <span>{tr('Kein', 'No')} <M>N</M> {tr('– Glieder fallen immer wieder heraus', '– terms keep falling out')}</span>}
        </div>
        <p className="vdemo-note">
          {mode === 'bound' && key !== 'grow' && tr(
            <>Ein Streifen endlicher Breite enthält <b>alle</b> Glieder. Das heisst «beschränkt». Wechsle zum <M>\varepsilon</M>-Streifen: Bei <M>{t`(-1)^n`}</M> ist die Folge zwar beschränkt, aber nicht konvergent.</>,
            <>A strip of finite width holds <b>every</b> term. That is what “bounded” means. Switch to the <M>\varepsilon</M>-strip: <M>{t`(-1)^n`}</M> is bounded, yet not convergent.</>)}
          {mode === 'bound' && key === 'grow' && tr(
            <>Jede obere Schranke wird irgendwann überschritten: <M>{t`\frac{n}{10} > K`}</M> für <M p=".">{t`n > 10K`}</M> Unbeschränkt, also divergent.</>,
            <>Every upper bound is passed eventually: <M>{t`\frac{n}{10} > K`}</M> for <M p=".">{t`n > 10K`}</M> Unbounded, hence divergent.</>)}
          {mode === 'eps' && (key === 'mono' || key === 'alt') && tr(
            <>Der Abstand zum Grenzwert ist <M p=",">{key === 'mono' ? t`|a_n - 1| = \frac{1}{n+1}` : t`|a_n - 1| = \frac1n`}</M> er wird mit jedem <M>n</M> kleiner. Darum bleiben auch alle Glieder nach <M>{`n = ${N_SHOWN}`}</M> im Streifen. Mach <M>\varepsilon</M> kleiner: <M>N</M> wird grösser, aber es gibt immer eins.</>,
            <>The distance to the limit is <M p=",">{key === 'mono' ? t`|a_n - 1| = \frac{1}{n+1}` : t`|a_n - 1| = \frac1n`}</M> it shrinks with every <M p=".">n</M> So all terms after <M>{`n = ${N_SHOWN}`}</M> stay in the strip too. Make <M>\varepsilon</M> smaller: <M>N</M> grows, but there always is one.</>)}
          {mode === 'eps' && key === 'osc' && tr(
            <>Schiebe <M>L</M> wohin du willst: Die Glieder <M>1</M> und <M>-1</M> liegen <M>2</M> auseinander, ein Streifen der Breite <M>{t`2\varepsilon \le 2`}</M> fasst nie beide. Kein Grenzwert – beschränkt, aber divergent.</>,
            <>Move <M>L</M> wherever you like: the terms <M>1</M> and <M>-1</M> are <M>2</M> apart, a strip of width <M>{t`2\varepsilon \le 2`}</M> never holds both. No limit – bounded, but divergent.</>)}
          {mode === 'eps' && key === 'grow' && tr(
            <>Egal welches <M p=":">L</M> Die Glieder wachsen über den Streifen hinaus und kommen nie zurück. Divergent.</>,
            <>Whatever <M>L</M> you pick, the terms grow out of the strip and never come back. Divergent.</>)}
        </p>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ the degree rule (U01 p. 11) */
const FRAC_WIN: Record<FracKey, { y: [number, number]; tick: number; grid: number }> = {
  gt: { y: [0, 230], tick: 50, grid: 25 },
  eq: { y: [0, 2.8], tick: 0.5, grid: 0.25 },
  lt: { y: [-0.8, 0.3], tick: 0.2, grid: 0.1 },
  neg: { y: [-85, 14], tick: 20, grid: 10 },
};
const LIM_TEX = (v: number) => (v === Infinity ? t`\infty` : v === -Infinity ? t`-\infty` : v === 0 ? '0' : t`\frac74`);
const N_MAX = 40;

/** Slider n: the terms of P(n)/Q(n), and the same fraction after dividing every term by the highest power of the denominator. */
export function DegreeExplorer() {
  const tr = useTr(), lang = useLang();
  const [key, setKey] = useState<FracKey>('eq');
  const [n, setN] = useState(10);
  const F = FRACS[key], w = FRAC_WIN[key];
  const nn = Math.max(F.n0, n);
  const [P, Q] = divided(F.P, F.Q);
  const lim = degreeLimit(F.P, F.Q);
  const ns = Array.from({ length: N_MAX - F.n0 + 1 }, (_, i) => F.n0 + i);
  const v = fracValue(key, nn);
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {(['gt', 'eq', 'lt', 'neg'] as FracKey[]).map((k) => (
          <button key={k} type="button" aria-pressed={key === k} onClick={() => setKey(k)}><M>{t`\frac{${polyTex(FRACS[k].P)}}{${polyTex(FRACS[k].Q)}}`}</M></button>
        ))}
      </div>
      <div className="vdemo-fig wide">
        <Plot x={[0, N_MAX + 1]} y={w.y} grid={[5, w.grid]} tick={[10, w.tick]} axes={['n', 'a_n']} label={tr('Glieder des Bruchs gegen n', 'terms of the fraction against n')}>
          {Number.isFinite(lim) && lim !== 0 && <HLine y={lim} role="asym" />}
          {Number.isFinite(lim) && lim !== 0 && <PLabel x={N_MAX + 0.8} y={lim} tex={t`\tfrac74`} role="asym" anchor="r" dy={-14} />}
          {ns.map((k) => <Pt key={k} x={k} y={fracValue(key, k)} r={k === nn ? 5.5 : 3.2} role={k === nn ? 'pt' : k < nn ? 'f' : 'muted'} />)}
          <Seg a={[nn, w.y[0]]} b={[nn, fracValue(key, nn)]} role="aux" dashed />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider"><span><M>n</M></span>
          <input type="range" min={F.n0} max={N_MAX} step={1} value={nn} onChange={(e) => setN(Number(e.target.value))} aria-label="n" /><span className="val">{nn}</span></label>
        <div className="v-result rt-readout"><M>{t`a_n = \dfrac{${polyTex(P)}}{${polyTex(Q)}}`}</M></div>
        <div className="v-result pos rt-readout"><M>{t`a_{${nn}} = \dfrac{${polyNumTex(P, nn, lang)}}{${polyNumTex(Q, nn, lang)}} \approx ${signedTex(v, lang)}`}</M></div>
        <div className="v-result rt-readout"><M>{t`\lim_{n\to\infty} a_n = ${LIM_TEX(lim)}`}</M></div>
        <p className="vdemo-note">{tr(
          <>Oben und unten ist alles durch die höchste Potenz des Nenners geteilt. Der Nenner geht gegen seine Leitzahl, die Brüche mit <M>n</M> unten gegen <M p=".">0</M> Bewege <M>n</M> und schau, welche Zahlen schrumpfen.</>,
          <>Top and bottom are divided by the highest power of the denominator. The denominator tends to its leading coefficient, the fractions with <M>n</M> below tend to <M p=".">0</M> Move <M>n</M> and watch which numbers shrink.</>)}
          {key === 'gt' && tr(<> Bei <M>{t`n = 2`}</M> wäre der Nenner <M p=",">0</M> darum beginnt die Folge bei <M p=".">{t`n = 3`}</M></>, <> At <M>{t`n = 2`}</M> the denominator would be <M p=",">0</M> so the sequence starts at <M p=".">{t`n = 3`}</M></>)}
        </p>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ the geometric series: which q? (U01 p. 12) */
const GQ = [0.5, -0.5, 0.9, 1, -1, 1.1];
const A1 = 3, NG = 20;
/** Slider q: partial sums S_n of 3 + 3q + 3q² + … and the limit 3/(1 − q) when |q| < 1. */
export function GeoExplorer() {
  const tr = useTr(), lang = useLang();
  const [q, setQ] = useState(0.5);
  const lim = geoLimit(A1, q);
  const ns = Array.from({ length: NG }, (_, i) => i + 1);
  const qt = q < 0 ? `(${num(q, 2, lang)})` : num(q, 2, lang);
  const S = geoSum(A1, q, NG);
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {GQ.map((g) => <button key={g} type="button" aria-pressed={Math.abs(q - g) < 1e-9} onClick={() => setQ(g)}><M>{`q = ${num(g, 2, lang)}`}</M></button>)}
      </div>
      <div className="vdemo-fig wide">
        <Plot x={[0, NG + 0.8]} y={[-4, 32]} grid={[5, 4]} tick={[5, 8]} axes={['n', 'S_n']} label={tr('Teilsummen der geometrischen Reihe', 'partial sums of the geometric series')}>
          {lim !== null && <HLine y={lim} role="asym" />}
          {lim !== null && <PLabel x={NG + 0.6} y={lim} tex={t`S_\infty = ${num(lim, 2, lang)}`} role="asym" anchor="r" dy={lim > 26 ? 14 : -14} small />}
          {ns.map((k) => <Pt key={k} x={k} y={geoSum(A1, q, k)} r={3.6} role="f" />)}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider"><span><M>q</M></span>
          <input type="range" min={-1.2} max={1.2} step={0.05} value={q} onChange={(e) => setQ(Math.round(Number(e.target.value) * 100) / 100)} aria-label="q" /><span className="val">{fmtNum(q, 2, lang)}</span></label>
        <div className="v-result rt-readout"><M>{q === 1 ? t`S_{${NG}} = ${NG}\cdot 3 = ${NG * 3}` : t`S_{${NG}} = 3\cdot\dfrac{1 - ${qt}^{${NG}}}{1 - ${qt}} \approx ${signedTex(S, lang)}`}</M></div>
        <div className={`v-result rt-readout ${lim !== null ? 'pos' : 'neg'}`}>
          {lim !== null
            ? <M>{t`|q| < 1:\quad S_\infty = \dfrac{3}{1 - ${qt}} = ${num(lim, 2, lang)}`}</M>
            : <span><M p=":">{t`|q| \ge 1`}</M> {tr('keine endliche Summe', 'no finite sum')}</span>}
        </div>
        <p className="vdemo-note">{tr(
          <>In <M>{t`S_n = a_1\frac{1-q^n}{1-q}`}</M> hängt nur <M>{t`q^n`}</M> von <M>n</M> ab. Für <M>{t`|q| < 1`}</M> schrumpft <M>{t`q^n`}</M> gegen <M p=".">0</M> Für <M>{t`|q| > 1`}</M> wächst es, für <M>{t`q = -1`}</M> springt es zwischen <M>1</M> und <M p=".">-1</M> Für <M>{t`q = 1`}</M> ist die Formel nicht definiert (Division durch <M p="),">0</M> dann ist einfach <M p=".">{t`S_n = n\,a_1`}</M></>,
          <>In <M>{t`S_n = a_1\frac{1-q^n}{1-q}`}</M> only <M>{t`q^n`}</M> depends on <M p=".">n</M> For <M>{t`|q| < 1`}</M> <M>{t`q^n`}</M> shrinks to <M p=".">0</M> For <M>{t`|q| > 1`}</M> it grows; for <M>{t`q = -1`}</M> it jumps between <M>1</M> and <M p=".">-1</M> For <M>{t`q = 1`}</M> the formula is undefined (division by <M p="),">0</M> then simply <M p=".">{t`S_n = n\,a_1`}</M></>)}</p>
      </figcaption>
    </figure>
  );
}
