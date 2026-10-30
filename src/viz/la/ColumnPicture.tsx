import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { De } from '../../components/Blocks';
import { M } from '../../components/Tex';
import { T, useLang, useTr, type Lang } from '../../i18n';
import { COL_PRESETS, colFrame, colModel, colPoints, colResult, countKey, type ColFrame, type ColModel } from '../../linalg/columnPicture';
import { norm, type M2, type V2 } from '../../linalg/plane2';
import { StepPlayer, type AnimStep } from '../anim/StepPlayer';
import { useInView } from '../figUtils';
import { Mat } from './Mat';
import { PlaneView } from './PlaneView';
import { colScene, dragSystem } from './colScene';
import { fitView, ntex, type View } from './planeItems';

const t = String.raw;

/* ---------- captions: what you see first, then what it means (≤ 3 short sentences) ---------- */
export function colSteps(m: ColModel, lang: Lang): AnimStep[] {
  const d = m.disp;
  const flip = (v: number) => (Math.abs(v) < 1e-9
    ? <T de={<> Es schrumpft auf nichts.</>} en={<> It shrinks to nothing.</>} />
    : v < 0 ? <T de={<> Negativ: der Pfeil dreht um und zeigt zurück.</>} en={<> Negative: the arrow turns round and points back.</>} /> : null);
  const tried = m.kind === 'none' && m.r > 0;
  const s1: ReactNode = (
    <T
      de={<>Grün <M p=",">{'a_1'}</M> blau <M p=",">{'a_2'}</M> rot das Ziel <M p=".">b</M> Die Frage: Wie viel von <M>{'a_1'}</M> und wie viel von <M>{'a_2'}</M> ergibt <M p="?">b</M>{m.r === 1 ? <> <M>{'a_1'}</M> und <M>{'a_2'}</M> liegen auf einer Geraden.</> : m.r === 0 ? <> Beide Spalten sind null.</> : null} Die Spitzen lassen sich ziehen.</>}
      en={<>Green <M p=",">{'a_1'}</M> blue <M p=",">{'a_2'}</M> red the target <M p=".">b</M> The question: how much of <M>{'a_1'}</M> and how much of <M>{'a_2'}</M> make <M p="?">b</M>{m.r === 1 ? <> <M>{'a_1'}</M> and <M>{'a_2'}</M> lie on one line.</> : m.r === 0 ? <> Both columns are zero.</> : null} The tips can be dragged.</>}
    />
  );
  const s2: ReactNode = m.r === 0
    ? <T de={<><M>{'a_1 = 0'}</M> bleibt null, egal wie viel man davon nimmt: <M p=".">{t`x_1 \cdot 0 = 0`}</M></>} en={<><M>{'a_1 = 0'}</M> stays zero however much you take: <M p=".">{t`x_1 \cdot 0 = 0`}</M></>} />
    : <T
      de={<>{tried ? 'Erster Versuch: ' : ''}Strecke <M>{'a_1'}</M> mit <M p=".">{t`x_1 = ${ntex(d[0], 2, lang)}`}</M>{flip(d[0])} Der Faktor <M>{'x_1'}</M> sagt, wie weit der Pfeil reicht.</>}
      en={<>{tried ? 'First try: ' : ''}Scale <M>{'a_1'}</M> by <M p=".">{t`x_1 = ${ntex(d[0], 2, lang)}`}</M>{flip(d[0])} The factor <M>{'x_1'}</M> says how far the arrow reaches.</>}
    />;
  const s3: ReactNode = m.r === 0
    ? <T de={<>Ebenso <M p=".">{t`x_2 \cdot 0 = 0`}</M> <M>{'Ax'}</M> kann den Nullpunkt nie verlassen.</>} en={<>Likewise <M p=".">{t`x_2 \cdot 0 = 0`}</M> <M>{'Ax'}</M> can never leave the origin.</>} />
    : <T
      de={<>Hänge <M>{'x_2 a_2'}</M> an die Spitze von <M>{'x_1 a_1'}</M> an und strecke es mit <M p=".">{t`x_2 = ${ntex(d[1], 2, lang)}`}</M>{flip(d[1])}</>}
      en={<>Attach <M>{'x_2 a_2'}</M> at the tip of <M>{'x_1 a_1'}</M> and scale it by <M p=".">{t`x_2 = ${ntex(d[1], 2, lang)}`}</M>{flip(d[1])}</>}
    />;
  let s4: ReactNode;
  if (m.kind === 'unique') s4 = norm(m.b) < 1e-9
    ? <T de={<>Nur <M>{t`x = 0`}</M> landet auf <M p=".">0</M></>} en={<>Only <M>{t`x = 0`}</M> lands on <M p=".">0</M></>} />
    : <T de={<>Die Spitze von <M>{'Ax'}</M> liegt genau auf <M p=".">b</M> Es gibt nur diese eine Mischung: <M p=".">{t`x = ${vtup(m.xp, lang)}`}</M></>} en={<>The tip of <M>{'Ax'}</M> lies exactly on <M p=".">b</M> This is the only mix: <M p=".">{t`x = ${vtup(m.xp, lang)}`}</M></>} />;
  else if (m.kind === 'infinite') s4 = <T de={<><M>{'Ax'}</M> bleibt auf <M p=",">b</M> während <M>x</M> wandert. Jedes <M>x</M> dieser Familie ist eine Lösung: unendlich viele.</>} en={<><M>{'Ax'}</M> stays on <M p=",">b</M> while <M>x</M> walks. Every <M>x</M> of this family is a solution: infinitely many.</>} />;
  else if (m.kind === 'all') s4 = <T de={<><M>{t`A = 0`}</M> und <M p=":">{t`b = 0`}</M> jedes <M>x</M> ist eine Lösung.</>} en={<><M>{t`A = 0`}</M> and <M p=":">{t`b = 0`}</M> every <M>x</M> is a solution.</>} />;
  else if (m.r === 0) s4 = <T de={<>Was auch immer <M>x</M> ist: <M p=".">{t`Ax = 0`}</M> Der Abstand zu <M>b</M> bleibt <M p=".">|b|</M> Keine Lösung.</>} en={<>Whatever <M>x</M> is: <M p=".">{t`Ax = 0`}</M> The distance to <M>b</M> stays <M p=".">|b|</M> No solution.</>} />;
  else s4 = <T de={<><M>{'Ax'}</M> kann die Gerade nicht verlassen. Selbst der nächste Punkt verfehlt <M>b</M> um <M p=".">{t`${ntex(norm([m.b[0] - m.proj[0], m.b[1] - m.proj[1]]), 2, lang)}`}</M> Keine Lösung.</>} en={<><M>{'Ax'}</M> cannot leave the line. Even the closest point misses <M>b</M> by <M p=".">{t`${ntex(norm([m.b[0] - m.proj[0], m.b[1] - m.proj[1]]), 2, lang)}`}</M> No solution.</>} />;
  return [
    { caption: s1, ms: 2000, holdMs: 1400 },
    { caption: s2, ms: m.r === 0 ? 3200 : 1500, holdMs: 1200 },
    { caption: s3, ms: m.r === 0 ? 3200 : 2600, holdMs: 1200 },
    { caption: s4, ms: m.kind === 'none' && m.r === 1 ? 3200 : 1300, holdMs: 3000 },
  ];
}
const vtup = (v: V2, lang: Lang) => t`\begin{pmatrix}${ntex(v[0], 2, lang)}\\${ntex(v[1], 2, lang)}\end{pmatrix}`;

/* ---------- the live matrix panel ---------- */
function Panel({ m, f, step, lang }: { m: ColModel; f: ColFrame; step: number; lang: Lang }) {
  const n = (v: number) => ntex(v, 2, lang);
  const { hit, miss } = colResult(m, f);
  const A = m.A;
  const x1 = step >= 1 ? <M>{n(f.x[0])}</M> : <M>{'x_1'}</M>;
  const x2 = step >= 3 || (step === 2 && f.x2num) ? <M>{n(f.x[1])}</M> : <M>{'x_2'}</M>;
  const k = countKey(m);
  let L: string;
  if (m.kind === 'unique') L = t`L = \left\{ ${vtup(m.xp, lang)} \right\}`;
  else if (m.kind === 'infinite') L = norm(m.xc!) < 1e-9
    ? t`L = \left\{ \alpha ${vtup(m.n!, lang)} \;\middle|\; \alpha \in \mathbb{R} \right\}`
    : t`L = \left\{ ${vtup(m.xc!, lang)} + \alpha ${vtup(m.n!, lang)} \;\middle|\; \alpha \in \mathbb{R} \right\}`;
  else if (m.kind === 'none') L = t`L = \varnothing`;
  else L = t`L = \mathbb{R}^2`;
  const done = step >= 3 && f.axGrow >= 1;
  return (
    <div className="la-panel" aria-live="polite">
      <div className="la-eq">
        <Mat cols={[[<M key="a">{n(A[0][0])}</M>, <M key="b">{n(A[1][0])}</M>], [<M key="c">{n(A[0][1])}</M>, <M key="d">{n(A[1][1])}</M>]]} cls={['k1', 'k2']} caption={[<M key="1">{'a_1'}</M>, <M key="2">{'a_2'}</M>]} />
        <Mat cols={[[<span key="1" className="la-k1">{x1}</span>, <span key="2" className="la-k2">{x2}</span>]]} />
        <M>=</M>
        <Mat cols={[[<M key="1">{n(m.b[0])}</M>, <M key="2">{n(m.b[1])}</M>]]} cls={['kb']} caption={[<M key="b">b</M>]} />
      </div>
      <div className="la-info">
        <span><T de="Rang" en="rank" />{' '}<M>{t`r = ${m.r}`}</M></span>
        <span className="la-count"><T de="Lösungen:" en="solutions:" />{' '}
          {k === 'unique' && <De en="unique">eindeutig</De>}
          {k === 'infinite' && <De en="infinitely many">unendlich viele</De>}
          {k === 'none' && <De en="none">keine</De>}
        </span>
        <span className={`la-status${done ? '' : ' la-hid'}`}>
          {hit ? <b className="la-ok"><M>{t`\checkmark\; Ax = b`}</M></b> : <b className="la-ko"><M>{t`|Ax - b| = ${n(miss)}`}</M></b>}
        </span>
      </div>
      <div className={`la-sol${step >= 3 ? '' : ' la-hid'}`}><M>{L}</M></div>
    </div>
  );
}

/* ---------- one frame of the figure ---------- */
function useTau(running: boolean, seen: boolean) {
  const [tau, setTau] = useState(0);
  useEffect(() => {
    if (!running || !seen) { setTau(0); return; }
    if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0, last = performance.now(), acc = 0, shown = 0;
    const tick = (now: number) => {
      acc += Math.min(0.1, (now - last) / 1000); last = now;
      if (acc - shown > 1 / 30) { shown = acc; setTau(acc); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, seen]);
  return running ? tau : 0;
}

function Frame({ m, step, tt, view, seen, onHandle }: { m: ColModel; seen: boolean; step: number; tt: number; view: View; onHandle: (id: string, at: V2, phase: string) => void }) {
  const tr = useTr(), lang = useLang();
  const walking = step === 3 && tt >= 1 && (m.kind === 'infinite' || m.r === 0);
  const tau = useTau(walking, seen);
  const f = colFrame(m, step, tt, tau);
  const sc = colScene(m, f, view, lang, tau);
  const handles = sc.handles.map((h) => ({ ...h, label: h.id === 'a1' ? tr('Spitze von a₁ ziehen', 'drag the tip of a₁') : h.id === 'a2' ? tr('Spitze von a₂ ziehen', 'drag the tip of a₂') : tr('Spitze von b ziehen', 'drag the tip of b') }));
  return (
    <div className="la-colpic">
      <PlaneView view={view} items={sc.items} handles={handles} onHandle={onHandle}
        label={tr('Spaltenbild: die Spalten a₁, a₂ von A, ihre Kombination Ax und das Ziel b', 'Column picture: the columns a₁, a₂ of A, their combination Ax and the target b')} />
      <Panel m={m} f={f} step={step} lang={lang} />
    </div>
  );
}

/* ---------- the figure ---------- */
export function ColumnPicture({ start = 0, presets }: { start?: number; presets?: number[] }) {
  const tr = useTr(), lang = useLang();
  const list = presets ?? COL_PRESETS.map((_, i) => i);
  const [sys, setSys] = useState<{ A: M2; b: V2; preset: number; gen: number }>(() => ({ A: COL_PRESETS[start].A, b: COL_PRESETS[start].b, preset: start, gen: 0 }));
  const m = useMemo(() => colModel(sys.A, sys.b), [sys.A, sys.b]);
  const frozen = useRef<View | null>(null);
  const fitted = useMemo(() => fitView(colPoints(m), 560, 420), [m]);
  const view = frozen.current ?? fitted;
  const steps = useMemo(() => colSteps(m, lang), [m, lang]);
  const [, bump] = useState(0);
  const figRef = useRef<HTMLElement>(null);
  const seen = useInView(figRef);
  const load = (i: number) => { frozen.current = null; setSys((s) => ({ A: COL_PRESETS[i].A, b: COL_PRESETS[i].b, preset: i, gen: s.gen + 1 })); };
  // «show this case in the figure» buttons in the lesson text (ShowPreset) switch the preset and bring the figure into view
  useEffect(() => {
    const on = (e: Event) => {
      const i = (e as CustomEvent<number>).detail;
      if (!list.includes(i)) return;
      load(i);
      figRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    };
    window.addEventListener(JUMP, on);
    return () => window.removeEventListener(JUMP, on);
  });
  const onHandle = (id: string, at: V2, phase: string) => {
    if (phase === 'down') { frozen.current = fitted; bump((v) => v + 1); return; }
    if (phase === 'up') { frozen.current = null; bump((v) => v + 1); return; }
    if (phase === 'key') frozen.current = null;
    setSys((s) => {
      const r = dragSystem(s.A, s.b, id, at);
      if (r.A.every((row, i) => row.every((v, j) => v === s.A[i][j])) && r.b[0] === s.b[0] && r.b[1] === s.b[1]) return s;
      return { ...s, A: r.A, b: r.b, preset: -1 };
    });
  };
  return (
    <figure className="la-fig la-col" ref={figRef}>
      <div className="v-presets la-presets" role="group" aria-label={tr('Beispielsysteme', 'Example systems')}>
        {list.map((i) => (
          <button key={i} type="button" aria-pressed={sys.preset === i}
            onClick={() => load(i)}>
            {withX(tr(...COL_PRESETS[i].label))}
          </button>
        ))}
      </div>
      <StepPlayer key={sys.gen} steps={steps} label={tr('Spaltenbild in vier Schritten: Spalten und Ziel, x₁a₁, x₂a₂ angehängt, Ax gegen b', 'Column picture in four steps: columns and target, x₁a₁, x₂a₂ attached, Ax against b')}>
        {(step, tt) => <Frame m={m} step={step} tt={tt} view={view} seen={seen} onHandle={onHandle} />}
      </StepPlayer>
      <T
        de={<p className="la-hint">Die Spitzen von <M p=",">{'a_1'}</M> <M>{'a_2'}</M> und <M>b</M> lassen sich ziehen (Raster <M p=");">{t`0{,}5`}</M> die Pfeiltasten verschieben die fokussierte Spitze.</p>}
        en={<p className="la-hint">The tips of <M p=",">{'a_1'}</M> <M>{'a_2'}</M> and <M>b</M> can be dragged (grid <M p=");">{t`0.5`}</M> the arrow keys move the focused tip.</p>}
      />
    </figure>
  );
}

/** «§x» in a preset label → KaTeX x. */
export const withX = (s: string) => s.split('§x').flatMap((p, k) => (k ? [<M key={k}>x</M>, p] : [p]));

const JUMP = 'la-colpic-preset';
/** A button in the lesson text that shows one preset in the column picture above (no second copy of the figure). */
export function ShowPreset({ i, children }: { i: number; children: ReactNode }) {
  return (
    <button type="button" className="la-jump" onClick={() => window.dispatchEvent(new CustomEvent(JUMP, { detail: i }))}>
      {children}
    </button>
  );
}
