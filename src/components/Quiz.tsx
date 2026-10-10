import { useState, type ReactNode } from 'react';
import { useTr } from '../i18n';

export interface Choice { text: ReactNode; correct?: boolean; why: ReactNode }

/** Multiple choice where every option carries its own explanation — wrong answers teach too. */
export function Choice({ question, choices }: { question: ReactNode; choices: Choice[] }) {
  const tr = useTr();
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="quiz">
      <div className="quiz-q">{question}</div>
      <ul className="quiz-choices">
        {choices.map((c, i) => (
          <li key={i}>
            <button className={picked === i ? (c.correct ? 'ok' : 'bad') : ''} onClick={() => setPicked(i)} aria-pressed={picked === i}>
              {c.text}
            </button>
          </li>
        ))}
      </ul>
      {picked !== null && (
        <div className={`quiz-feedback ${choices[picked].correct ? 'ok' : 'bad'}`} role="status">
          <strong>{choices[picked].correct ? tr('Richtig. ', 'Correct. ') : tr('Nicht ganz. ', 'Not quite. ')}</strong>
          {choices[picked].why}
        </div>
      )}
    </div>
  );
}

/** Predict-then-reveal: the student commits to an answer before seeing the explanation. */
export function Predict({ prompt, answer }: { prompt: ReactNode; answer: ReactNode }) {
  const tr = useTr();
  const [open, setOpen] = useState(false);
  return (
    <div className="quiz predict">
      <div className="quiz-q"><strong>{tr('Zuerst vorhersagen:', 'Predict first:')}</strong> {prompt}</div>
      {open ? <div className="quiz-feedback">{answer}</div> : (
        <button onClick={() => setOpen(true)}>{tr('Ich habe meine Vorhersage – auflösen', 'I have my prediction – reveal')}</button>
      )}
    </div>
  );
}

/** Numerical answer checked with a relative tolerance. Accepts a decimal comma or point. */
export function NumericAnswer({ question, value, tol = 0.01, unit, explain }: {
  question: ReactNode; value: number; tol?: number; unit?: string; explain: ReactNode;
}) {
  const tr = useTr();
  const [txt, setTxt] = useState('');
  const [state, setState] = useState<'idle' | 'ok' | 'bad'>('idle');
  const check = () => {
    const x = Number(txt.replace(',', '.'));
    setState(txt.trim() !== '' && Number.isFinite(x) && Math.abs(x - value) <= tol * Math.max(1, Math.abs(value)) ? 'ok' : 'bad');
  };
  return (
    <div className="quiz">
      <div className="quiz-q">{question}</div>
      <div className="numeric">
        <input value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && check()} inputMode="decimal" aria-label={tr('Antwort', 'answer')} />
        {unit && <span>{unit}</span>}
        <button onClick={check}>{tr('Prüfen', 'Check')}</button>
      </div>
      {state !== 'idle' && (
        <div className={`quiz-feedback ${state}`} role="status">
          <strong>{state === 'ok' ? tr('Richtig. ', 'Correct. ') : tr('Noch nicht – versuche es nochmals oder lies die Lösung. ', 'Not yet – try again or read the solution. ')}</strong>
          {state === 'ok' && explain}
          {state === 'bad' && <details><summary>{tr('Lösung anzeigen', 'Show solution')}</summary>{explain}</details>}
        </div>
      )}
    </div>
  );
}
