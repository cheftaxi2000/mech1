import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { M } from '../../components/Tex';
import { T, useTr } from '../../i18n';
import { mat, type Mat } from '../../linalg/gauss';
import { traceGauss } from '../../linalg/gaussTrace';
import { ElimView, frameCaption } from './ElimView';
import { MatrixEditor, fromStrings, toStrings } from './MatrixEditor';
import './gauss.css';

const t = String.raw;

export interface SolvePreset { id: string; label: ReactNode; aug: Mat }
/** The «Solve» examples of Übung 2 (slides 32–36) and the main example of slides 26–30. */
export const SOLVE_PRESETS: SolvePreset[] = [
  { id: 's26', label: <T de="Folie 26" en="Slide 26" />, aug: mat([[1, 1, 1, 6], [1, 2, 1, 8], [2, 3, 5, 23]]) },
  { id: 's32', label: <T de="Folie 32" en="Slide 32" />, aug: mat([[1, 1, 3, 1], [2, 2, -1, 2]]) },
  { id: 's33', label: <T de="Folie 33 (a)" en="Slide 33 (a)" />, aug: mat([[1, 1, 3], [2, -1, 0]]) },
  { id: 's34', label: <T de="Folie 34 (b)" en="Slide 34 (b)" />, aug: mat([[1, 1, 2], [2, 2, 5]]) },
  { id: 's35', label: <T de="Folie 35 (c)" en="Slide 35 (c)" />, aug: mat([[1, -2, 3, 7], [2, -3, 4, 11], [3, 4, -2, 0]]) },
  { id: 's36', label: <T de="Folie 36 (d)" en="Slide 36 (d)" />, aug: mat([[1, 1, 1, 2], [2, 2, 2, 4], [3, 3, 3, 6]]) },
];

/** Pick a preset or type a small system (up to 3 × 4); step through the elimination with the explanation of every step. */
export function SolveExplorer() {
  const tr = useTr();
  const [preset, setPreset] = useState<string | null>('s32');
  const [vals, setVals] = useState<string[][]>(() => toStrings(SOLVE_PRESETS[1].aug));
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const aug = useMemo(() => fromStrings(vals), [vals]);
  const trace = useMemo(() => traceGauss(aug), [aug]);
  const frames = trace.frames;
  const k = Math.min(i, frames.length - 1);
  const sig = JSON.stringify(vals);
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } setI(0); setPlaying(false); }, [sig]);
  useEffect(() => {
    if (!playing) return;
    if (k >= frames.length - 1) { setPlaying(false); return; }
    const h = setTimeout(() => setI((x) => x + 1), 1700);
    return () => clearTimeout(h);
  }, [playing, k, frames.length]);
  const pick = (p: SolvePreset) => { setPreset(p.id); setVals(toStrings(p.aug)); };
  const edit = (v: string[][]) => { setPreset(null); setVals(v); };
  return (
    <figure className="explorer ge-ex-fig">
      <div className="ge-ex">
        <div className="ge-presets" role="group" aria-label={tr('Beispiele', 'Examples')}>
          {SOLVE_PRESETS.map((p) => <button key={p.id} aria-pressed={preset === p.id} onClick={() => pick(p)}>{p.label}</button>)}
        </div>
        <div className="ge-grid">
          <div className="ge-panel">
            <ElimView frame={frames[k]} nVars={trace.nVars} />
          </div>
          <div className="ge-panel">
            <div className="ge-bar">
              <button className="ge-btn" onClick={() => { setPlaying(false); setI(Math.max(0, k - 1)); }} disabled={k === 0} aria-label={tr('Vorheriger Schritt', 'Previous step')}>‹</button>
              <button className="ge-btn primary" onClick={() => { if (k >= frames.length - 1) { setI(0); setPlaying(true); } else setPlaying(!playing); }}>
                {playing ? tr('Pause', 'Pause') : k >= frames.length - 1 ? tr('Nochmals', 'Replay') : tr('Abspielen', 'Play')}
              </button>
              <button className="ge-btn" onClick={() => { setPlaying(false); setI(Math.min(frames.length - 1, k + 1)); }} disabled={k >= frames.length - 1} aria-label={tr('Nächster Schritt', 'Next step')}>›</button>
              <button className="ge-btn" onClick={() => { setPlaying(false); setI(frames.length - 1); }} disabled={k >= frames.length - 1}>{tr('Ergebnis', 'Result')}</button>
              <span className="ge-count">{tr('Schritt', 'Step')} <M>{t`${k + 1}/${frames.length}`}</M></span>
            </div>
            <div className="ge-caption" aria-live="polite">{frameCaption(frames[k], trace)}</div>
            <MatrixEditor value={vals} onChange={edit} />
            <p className="ge-rule">
              <T de={<>Einträge: ganze Zahlen oder Brüche wie <code>1/2</code>. Ein Klick auf ein Beispiel stellt es wieder her.</>}
                en={<>Entries: whole numbers or fractions such as <code>1/2</code>. Clicking an example restores it.</>} />
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
}
