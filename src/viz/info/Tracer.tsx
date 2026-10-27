import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Code } from '../../components/Code';
import { useTr } from '../../i18n';
import { runAny, type Ev, type FrameView, type Snap } from '../../info/cpp/interp';
import type { Prog } from '../../info/cpp/programs';
import { StackView } from './FunctionFigures';
import { VecCells } from './VectorFigures';
import { useInterval } from './InfoControls';
import './info.css';

type Tr = <X,>(de: X, en: X) => X;

/** The sentence under the code: what the step that was just prepared is about (event kinds come from the interpreter). */
export function evText(ev: Ev | undefined, tr: Tr): ReactNode {
  if (!ev) return null;
  const c = (s: string) => <code className="ic">{s}</code>;
  switch (ev.kind) {
    case 'cond': return <>{tr('Bedingung', 'Condition')} {c(ev.src)}{tr(' ergibt ', ' evaluates to ')}<b className={ev.value ? 'tr-t' : 'tr-f'}>{ev.value ? 'true' : 'false'}</b>.</>;
    case 'init': return <>{tr('Schleifenkopf: die Initialisierung läuft genau einmal.', 'Loop header: the initialization runs exactly once.')}</>;
    case 'step': return <>{tr('Ende des Durchlaufs: der Schritt', 'End of the round: the step')} {c(ev.src)} {tr('wird ausgeführt.', 'is executed.')}</>;
    case 'call': return <>{tr('Aufruf von', 'Call of')} {c(`${ev.name}(${ev.args.join(', ')})`)}{tr(': ein neuer Rahmen entsteht, die Parameter sind Kopien der Argumente.', ': a new frame is created, the parameters are copies of the arguments.')}</>;
    case 'return': return <>{tr('Rückkehr', 'Return')}{ev.value !== undefined && <> {tr('mit dem Wert', 'with the value')} {c(ev.value)}</>}{tr(': der Rahmen verschwindet.', ': the frame disappears.')}</>;
    case 'returned': return <>{tr('Zurück im Aufrufer:', 'Back in the caller:')} {c(`${ev.name}(…)`)}{ev.value !== undefined && <> {tr('hat den Wert', 'has the value')} {c(ev.value)}</>}.</>;
    case 'input': return <>{tr('Eingabe gelesen:', 'Input read:')} {c(ev.text)}</>;
    case 'ub': return <b className="tr-warn">{tr('Achtung: ', 'Warning: ')}{ev.msg}</b>;
    case 'overflow': return <b className="tr-warn">{tr('Achtung: Der Ausdruck', 'Warning: the expression')} {c(ev.src)} {tr('läuft über den Wertebereich von int. In C++ ist das undefiniertes Verhalten; praktisch wird modulo 2³² weitergerechnet.', 'leaves the range of int. In C++ that is undefined behavior; in practice the computation continues modulo 2³².')}</b>;
    case 'end': return <>{tr('Das Programm ist zu Ende.', 'The program has finished.')}</>;
  }
}

function VarTable({ frame, tr, top }: { frame: FrameView; tr: Tr; top: boolean }) {
  return (
    <table className={`tr-vars${top ? ' top' : ''}`}>
      <thead><tr><th>{tr('Name', 'Name')}</th><th>{tr('Typ', 'Type')}</th><th>{tr('Wert', 'Value')}</th></tr></thead>
      <tbody>
        {frame.vars.length === 0 && <tr><td colSpan={3} className="tr-empty">{tr('noch keine Variablen', 'no variables yet')}</td></tr>}
        {frame.vars.map((v) => (
          <Fragment key={v.id + v.name}>
            <tr className={`${v.changed ? 'chg' : ''}${v.shadowed ? ' shadow' : ''}`}>
              <td><code>{v.name}</code>{v.isConst && <span className="tr-badge" title="const"> const</span>}</td>
              <td><code>{v.type}</code></td>
              <td className={v.uninit ? 'uninit' : ''}>{v.vec ? <span className="tr-count">{tr(`${v.vec.length} Elemente`, `${v.vec.length} elements`)}</span> : <code>{v.value}</code>}{v.isRef && <span className="tr-badge"> {tr('Alias', 'alias')}</span>}</td>
            </tr>
            {v.vec && <tr className={`tr-vecrow${v.shadowed ? ' shadow' : ''}`}><td colSpan={3}><VecCells elems={v.vec} /></td></tr>}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Step through a program: the line that runs next is highlighted, the table shows every variable (changed values are
 * marked), the console shows what has been printed. The trace is computed by the interpreter, never typed.
 * `inputs` offers alternative console inputs the student can switch between.
 */
export function Tracer({ prog, inputs, label, stack }: { prog: Prog; inputs?: string[]; label?: string; /** draw the call stack as boxes of cells (notes Subsection 6.4) instead of tables */ stack?: boolean }) {
  const tr = useTr();
  const [inp, setInp] = useState(prog.stdin ?? inputs?.[0] ?? '');
  const trace = useMemo(() => runAny(prog.code, { fragment: prog.fragment, stdin: inp }), [prog, inp]);
  const [i, setI] = useState(0);
  const [play, setPlay] = useState(false);
  const last = trace.snaps.length - 1;
  useEffect(() => { setI(0); setPlay(false); }, [prog, inp]);
  useInterval(play, 700, () => setI((k) => { if (k >= last) { setPlay(false); return k; } return k + 1; }));
  const s: Snap = trace.snaps[Math.min(i, last)];
  const done = s.line === null;
  const frames = [...s.frames].reverse(); // innermost call first
  const shownLine = s.line;

  return (
    <figure className="vdemo tr-fig in-fig">
      {inputs && inputs.length > 1 && (
        <div className="v-presets" role="group" aria-label={tr('Eingabe', 'Input')}>
          <span className="tr-inl">{tr('Eingabe:', 'Input:')}</span>
          {inputs.map((x) => <button type="button" key={x} aria-pressed={x === inp} onClick={() => setInp(x)}><code>{x.trim()}</code></button>)}
        </div>
      )}
      <div className="tr-main">
        <Code code={prog.code} active={shownLine ? [shownLine - 1] : []} label={label ?? tr('Programm', 'Program')} />
        <div className="tr-side">
          {stack && <StackView frames={frames} />}
          {!stack && frames.map((f, k) => (
            <div key={k} className="tr-frame">
              {(frames.length > 1 || f.fn !== 'main') && <div className="tr-fn"><code>{f.fn}</code>{k === 0 && frames.length > 1 && <span className="tr-badge"> {tr('aktiv', 'active')}</span>}</div>}
              <VarTable frame={f} tr={tr} top={k === 0} />
            </div>
          ))}
          <div className="tr-out" aria-label={tr('Konsole', 'Console')}>
            <div className="tr-out-h">{tr('Konsole', 'Console')}{inp.trim() && !prog.stdin?.includes('\n\n') && <span className="tr-badge"> {tr('Eingabe', 'input')}: <code>{inp.trim()}</code></span>}</div>
            <pre><code>{s.out || ' '}</code></pre>
          </div>
        </div>
      </div>
      <div className="bx-say" aria-live="polite">
        {evText(s.ev, tr) ?? (done ? tr('Das Programm ist zu Ende.', 'The program has finished.') : <>{tr('Als Nächstes läuft Zeile', 'Next to run: line')} <b>{shownLine}</b>.</>)}
        {trace.error && done && <b className="tr-warn"> {trace.error.msg}</b>}
      </div>
      <div className="in-controls">
        <button type="button" className="motion-btn" onClick={() => { setPlay(false); setI((k) => Math.max(0, k - 1)); }} disabled={i === 0}>‹ {tr('Zurück', 'Back')}</button>
        <button type="button" className="motion-btn primary" onClick={() => { setPlay(false); setI((k) => Math.min(last, k + 1)); }} disabled={i >= last}>{tr('Schritt', 'Step')} ›</button>
        <button type="button" className="motion-btn" onClick={() => { if (i >= last) setI(0); setPlay((p) => !p); }}>{play ? tr('Pause', 'Pause') : tr('Abspielen', 'Play')}</button>
        <button type="button" className="motion-btn" onClick={() => { setI(0); setPlay(false); }}>↺</button>
        <span className="in-counter">{tr(`Schritt ${i} von ${last}`, `Step ${i} of ${last}`)}{trace.truncated ? ' …' : ''}</span>
      </div>
    </figure>
  );
}

/** A listing together with what it prints (computed): for short programs where stepping is not needed. */
export function Listing({ prog, label }: { prog: Prog; label?: string }) {
  const tr = useTr();
  const out = useMemo(() => runAny(prog.code, { fragment: prog.fragment, stdin: prog.stdin }), [prog]);
  return (
    <figure className="vdemo lst-fig">
      <Code code={prog.code} label={label} />
      <div className="tr-out">
        <div className="tr-out-h">{tr('Ausgabe', 'Output')}{prog.stdin && <span className="tr-badge"> {tr('Eingabe', 'input')}: <code>{prog.stdin.trim()}</code></span>}</div>
        <pre><code>{out.stdout || ' '}</code></pre>
      </div>
    </figure>
  );
}
