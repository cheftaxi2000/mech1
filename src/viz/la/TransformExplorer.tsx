import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { De } from '../../components/Blocks';
import { M } from '../../components/Tex';
import { T, useLang, useTr, type Lang } from '../../i18n';
import { analyze, apply, type M2, type V2 } from '../../linalg/plane2';
import { TR_PRESETS, chooseInputs, effect, findInput, firstInput } from '../../linalg/transform';
import { ease } from '../../linalg/columnPicture';
import { Mat } from './Mat';
import { PlaneView, type HandlePhase } from './PlaneView';
import { fitView, ntex, type View } from './planeItems';
import { trPoints, trScene, type TrInput } from './trScene';

const t = String.raw;
const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const MORPH_MS = 2500;
const MAX_TRACES = 6;

/** A matrix entry the student can type into (decimal comma or point). */
function Entry({ value, onChange, lang, label }: { value: number; onChange: (v: number) => void; lang: Lang; label: string }) {
  const shown = ntex(value, 2, lang).replace('{,}', ',').replace('-', '−');
  const [draft, setDraft] = useState<string | null>(null);
  const commit = () => {
    if (draft === null) return;
    const v = Number(draft.replace(',', '.').replace('−', '-').trim());
    if (draft.trim() !== '' && Number.isFinite(v)) onChange(Math.max(-9, Math.min(9, v)));
    setDraft(null);
  };
  return (
    <input className="la-entry" inputMode="decimal" aria-label={label} value={draft ?? shown}
      onFocus={(e) => { setDraft(shown.replace('−', '-')); e.currentTarget.select(); }}
      onChange={(e) => setDraft(e.target.value)} onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') { commit(); (e.target as HTMLInputElement).blur(); } }} />
  );
}

type Mode = 'free' | 'find';

export function TransformExplorer({ start = 1 }: { start?: number }) {
  const tr = useTr(), lang = useLang();
  const [preset, setPreset] = useState(start);
  const [A, setA] = useState<M2>(TR_PRESETS[start].A);
  const [b, setB] = useState<V2>(TR_PRESETS[start].b);
  const [x, setX] = useState<V2>(() => TR_PRESETS[start].x ?? firstInput(analyze(TR_PRESETS[start].A, TR_PRESETS[start].b)));
  const [traces, setTraces] = useState<V2[]>(() => chooseInputs(TR_PRESETS[start].A, TR_PRESETS[start].b, analyze(TR_PRESETS[start].A, TR_PRESETS[start].b), x));
  const [mode, setMode] = useState<Mode>('free');
  const [tm, setTm] = useState(() => (reducedMotion() ? 1 : 0));
  const [playing, setPlaying] = useState(false);
  const tRef = useRef(tm); tRef.current = tm;
  const figRef = useRef<HTMLElement>(null);
  const frozen = useRef<View | null>(null);
  const [, bump] = useState(0);

  const load = (i: number) => {
    const p = TR_PRESETS[i], an = analyze(p.A, p.b), x0 = p.x ?? firstInput(an);
    setPreset(i); setA(p.A); setB(p.b); setX(x0); setTraces(chooseInputs(p.A, p.b, an, x0));
    frozen.current = null;
    if (!reducedMotion()) { setTm(0); setPlaying(true); } else setTm(1);
  };

  // play the morph once when the figure first comes into view
  const started = useRef(false);
  useEffect(() => {
    const el = figRef.current;
    if (!el || typeof IntersectionObserver === 'undefined' || reducedMotion()) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && e.intersectionRatio >= 0.5 && !started.current) { started.current = true; setTm(0); setPlaying(true); }
    }, { threshold: [0, 0.5] });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // the morph clock: forwards to t = 1 (or backwards when we are already at the end)
  const dir = useRef(1);
  useEffect(() => {
    if (!playing) return;
    let raf = 0, last = performance.now();
    let u = dir.current > 0 ? tRef.current : 1 - tRef.current; // progress along the eased path
    const tick = (now: number) => {
      u = Math.min(1, u + Math.min(100, now - last) / MORPH_MS); last = now;
      const v = ease(u);
      setTm(dir.current > 0 ? v : 1 - v);
      if (u < 1) raf = requestAnimationFrame(tick); else setPlaying(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);
  const play = () => {
    if (playing) { setPlaying(false); return; }
    dir.current = tRef.current >= 0.999 ? -1 : 1;
    setPlaying(true);
  };

  const find = mode === 'find' ? findInput(A, b) : null;
  const xin: V2 = find ? find.x : x;
  const inputs: TrInput[] = [
    ...(mode === 'free' ? traces.map((p, i) => ({ id: `tr${i}`, p, role: 'c3' as const, w: 2.2 })) : []),
    { id: 'x', p: xin, role: 'ax', label: 'x', imgLabel: 'Ax', stair: true, ghost: true },
  ];
  const fitted = useMemo(() => fitView(trPoints(A, [xin, ...(mode === 'free' ? traces : [])], mode === 'find' ? b : undefined), 560, 420, { minSpan: 8 }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [A, xin[0], xin[1], traces, mode, b]);
  const view = frozen.current ?? fitted;
  const sc = trScene({ A, t: tm, inputs, b: mode === 'find' ? b : undefined, drag: mode === 'free' ? ['a1', 'a2', 'x'] : ['a1', 'a2', 'b'], targets: true, lang }, view);
  const handles = sc.handles.map((h) => ({ ...h, label: h.id === 'a1' ? tr('Bild von e₁ (Spalte a₁) ziehen', 'drag the image of e₁ (column a₁)') : h.id === 'a2' ? tr('Bild von e₂ (Spalte a₂) ziehen', 'drag the image of e₂ (column a₂)') : h.id === 'b' ? tr('Ziel b ziehen', 'drag the target b') : tr('Eingabe x ziehen', 'drag the input x') }));

  const setCol = (j: 0 | 1, p: V2) => setA((M0) => { const N: M2 = [[M0[0][0], M0[0][1]], [M0[1][0], M0[1][1]]]; N[0][j] = p[0]; N[1][j] = p[1]; return N; });
  const onHandle = (id: string, at: V2, phase: HandlePhase) => {
    if (phase === 'down') { frozen.current = fitted; setPlaying(false); bump((v) => v + 1); return; }
    if (phase === 'up') { frozen.current = null; bump((v) => v + 1); return; }
    if (phase === 'key') frozen.current = null;
    setPreset(-1);
    if (id === 'a1' || id === 'a2') { setCol(id === 'a1' ? 0 : 1, at); if (tRef.current < 0.999) setTm(1); }
    else if (id === 'b') { setB(at); }
    else if (id === 'x') setX(at);
  };
  const onTap = mode === 'free' ? (p: V2) => setTraces((L) => [...L, p].slice(-MAX_TRACES)) : undefined;

  const Ax = apply(A, xin);
  const n = (v: number) => ntex(v, 2, lang);
  const r = analyze(A, [0, 0]).r;
  const eff = effect(A);
  const entry = (i: 0 | 1, j: 0 | 1) => (
    <Entry key={`${i}${j}`} value={A[i][j]} lang={lang} label={tr(`Eintrag A${i + 1}${j + 1}`, `entry A${i + 1}${j + 1}`)}
      onChange={(v) => { setPreset(-1); setA((M0) => { const N: M2 = [[M0[0][0], M0[0][1]], [M0[1][0], M0[1][1]]]; N[i][j] = v; return N; }); }} />
  );

  let verdict: ReactNode = null;
  if (find) {
    if (find.kind === 'unique') verdict = <T de={<>Genau ein <M>x</M> landet auf <M p=":">b</M> <M p=".">{t`x = A^{-1}b`}</M></>} en={<>Exactly one <M>x</M> lands on <M p=":">b</M> <M p=".">{t`x = A^{-1}b`}</M></>} />;
    else if (find.kind === 'line') verdict = <T de={<>Eine ganze Gerade von Eingaben (orange) landet auf <M p=":">b</M> unendlich viele Lösungen.</>} en={<>A whole line of inputs (orange) lands on <M p=":">b</M> infinitely many solutions.</>} />;
    else if (find.kind === 'none') verdict = <T de={<>Die Ebene wird auf eine Gerade gedrückt, und <M>b</M> liegt daneben: kein <M>x</M> trifft.</>} en={<>The plane is squashed onto a line, and <M>b</M> lies beside it: no <M>x</M> hits.</>} />;
    else if (find.kind === 'all') verdict = <T de={<>Alles landet auf <M p=":">{t`0 = b`}</M> jedes <M>x</M> ist eine Lösung.</>} en={<>Everything lands on <M p=":">{t`0 = b`}</M> every <M>x</M> is a solution.</>} />;
    else verdict = <T de={<>Alles landet auf <M p=",">0</M> nie auf <M p=".">b</M></>} en={<>Everything lands on <M p=",">0</M> never on <M p=".">b</M></>} />;
  }

  return (
    <figure className="la-fig la-tr" ref={figRef}>
      <div className="v-presets la-presets" role="group" aria-label={tr('Beispielmatrizen', 'Example matrices')}>
        {TR_PRESETS.map((p, i) => <button key={p.id} type="button" aria-pressed={preset === i} onClick={() => load(i)}>{tr(...p.label)}</button>)}
      </div>
      <div className="la-tr-grid">
        <div className="la-tr-stage">
          <PlaneView view={view} items={sc.items} handles={handles} onHandle={onHandle} onTap={onTap}
            label={tr('Die Ebene unter der Matrix A: Gitter, e₁ und e₂ mit ihren Bildern, eine Eingabe x und ihr Bild Ax', 'The plane under the matrix A: grid, e₁ and e₂ with their images, an input x and its image Ax')} />
          <div className="la-morph">
            <button type="button" onClick={() => { setPlaying(false); setTm(0); }} aria-pressed={tm <= 0.001}><T de="Vorher" en="Before" /></button>
            <button type="button" className="primary" onClick={play}>{playing ? tr('Pause', 'Pause') : tm >= 0.999 ? tr('Zurückspielen', 'Play back') : tr('Abspielen', 'Play')}</button>
            <button type="button" onClick={() => { setPlaying(false); setTm(1); }} aria-pressed={tm >= 0.999}><T de="Nachher" en="After" /></button>
            <label className="slider grow has-val">
              <span><M>t</M></span>
              <input type="range" min={0} max={1} step={0.01} value={tm} onChange={(e) => { setPlaying(false); setTm(Number(e.target.value)); }} aria-label={tr('Verwandlung von vorher (0) bis nachher (1)', 'morph from before (0) to after (1)')} />
              <span className="val"><M>{n(tm)}</M></span>
            </label>
          </div>
        </div>
        <div className="la-panel la-tr-side" aria-live="polite">
          <div className="la-seg" role="group" aria-label={tr('Modus', 'mode')}>
            <button type="button" aria-pressed={mode === 'free'} onClick={() => setMode('free')}><T de={<>Eingabe <M>x</M> wählen</>} en={<>Choose the input <M>x</M></>} /></button>
            <button type="button" aria-pressed={mode === 'find'} onClick={() => { setMode('find'); }}><T de={<>Eingabe zu <M>b</M> finden</>} en={<>Find the input for <M>b</M></>} /></button>
          </div>
          <div className="la-eq">
            <span className="la-matwrap">
              <span className="la-br la-edit">
                <span className="la-col k1">{entry(0, 0)}{entry(1, 0)}</span>
                <span className="la-col k2">{entry(0, 1)}{entry(1, 1)}</span>
              </span>
              <span className="la-cap"><span className="k1"><M>{'a_1'}</M></span><span className="k2"><M>{'a_2'}</M></span></span>
            </span>
            <Mat cols={[[<M key="1">{n(xin[0])}</M>, <M key="2">{n(xin[1])}</M>]]} caption={[<M key="x">x</M>]} />
            <M>=</M>
            <Mat cols={[[<M key="1">{n(Ax[0])}</M>, <M key="2">{n(Ax[1])}</M>]]} cls={[mode === 'find' && find && find.kind !== 'none' && find.kind !== 'none0' ? 'kb' : undefined]} caption={[<M key="a">{'Ax'}</M>]} />
          </div>
          <p className="la-line">
            <T de="Rang" en="rank" />{' '}<M p=":">{t`r = ${r}`}</M>{' '}
            {eff === 'plane' && <T de="die Ebene wird verformt, bleibt aber eine Ebene." en="the plane is deformed but stays a plane." />}
            {eff === 'line' && <T de={<>die ganze Ebene wird auf eine Gerade <De en="collapsed">gedrückt</De>.</>} en={<>the whole plane is squashed onto a line (<De en="collapsed">gedrückt</De>).</>} />}
            {eff === 'point' && <T de="alles landet im Nullpunkt." en="everything lands on the origin." />}
          </p>
          <p className="la-line">
            <M>{t`Ax = ${n(xin[0])}\,a_1 + ${xin[1] < 0 ? `(${n(xin[1])})` : n(xin[1])}\,a_2`}</M>
          </p>
          {verdict && <p className="la-line la-verdict">{verdict}</p>}
          {mode === 'free'
            ? <p className="la-hint">
                <T de={<>Ziehen: die Spitzen der Spalten <M>{'a_1'}</M> und <M>{'a_2'}</M> und die Eingabe <M p=".">x</M> Tippen auf die Ebene lässt weitere Eingaben (violett) mitwandern.</>}
                  en={<>Drag: the tips of the columns <M>{'a_1'}</M> and <M>{'a_2'}</M> and the input <M p=".">x</M> Tapping the plane drops more inputs (purple) that travel along.</>} />{' '}
                {traces.length > 0 && <button type="button" className="la-small-btn" onClick={() => setTraces([])}><T de="Spuren löschen" en="Clear inputs" /></button>}
              </p>
            : <p className="la-hint"><T de={<>Zieh das Ziel <M p=".">b</M> Gesucht ist das <M p=",">x</M> das nach der Verwandlung auf <M>b</M> landet.</>} en={<>Drag the target <M p=".">b</M> We look for the <M>x</M> that lands on <M>b</M> after the transformation.</>} /></p>}
        </div>
      </div>
    </figure>
  );
}
